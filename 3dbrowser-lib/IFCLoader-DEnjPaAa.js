import * as THREE from 'three';

let cachedIfcRuntimePromise = null;
let cachedIfcRuntimePath = "";
const ifcTypeCodeCache = /* @__PURE__ */ new Map();
function getIfcWasmPath(libPath) {
  const normalized = typeof window !== "undefined" ? new URL(libPath.endsWith("/") ? libPath : `${libPath}/`, window.location.href).toString() : libPath.endsWith("/") ? libPath : `${libPath}/`;
  return `${normalized}web-ifc/`;
}
async function getIfcRuntime(libPath) {
  const wasmPath = getIfcWasmPath(libPath);
  if (cachedIfcRuntimePromise && cachedIfcRuntimePath === wasmPath) {
    return cachedIfcRuntimePromise;
  }
  cachedIfcRuntimePath = wasmPath;
  cachedIfcRuntimePromise = (async () => {
    const WebIFC = await import('web-ifc');
    const ifcApi = new WebIFC.IfcAPI();
    ifcApi.SetWasmPath(wasmPath);
    await ifcApi.Init();
    ifcTypeCodeCache.clear();
    return { ifcApi, WebIFC, wasmPath };
  })();
  return cachedIfcRuntimePromise;
}
function getIfcTypeCode(ifcApi, typeName) {
  const cached = ifcTypeCodeCache.get(typeName);
  if (cached !== void 0) return cached;
  const typeCode = ifcApi.GetTypeCodeFromName(typeName);
  ifcTypeCodeCache.set(typeName, typeCode);
  return typeCode;
}
function resolveExpressId(ref) {
  if (typeof ref === "number" && Number.isFinite(ref)) return ref;
  if (ref && typeof ref === "object" && typeof ref.value === "number") return ref.value;
  return void 0;
}
function toExpressIds(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map(resolveExpressId).filter((id2) => typeof id2 === "number");
  }
  if (typeof value.size === "function" && typeof value.get === "function") {
    const ids = [];
    for (let index = 0; index < value.size(); index++) {
      const id2 = resolveExpressId(value.get(index));
      if (typeof id2 === "number") ids.push(id2);
    }
    return ids;
  }
  const id = resolveExpressId(value);
  return typeof id === "number" ? [id] : [];
}
function uniqueStrings(values) {
  return Array.from(
    new Set(
      values.map((value) => typeof value === "string" ? value.trim() : "").filter(Boolean)
    )
  );
}
function sanitizeIfcLabel(...candidates) {
  const invalidValues = /* @__PURE__ */ new Set(["", "n/a", "na", "undefined", "null", "-", "--"]);
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const trimmed = candidate.trim();
    if (invalidValues.has(trimmed.toLowerCase())) continue;
    return trimmed;
  }
  return "";
}
const loadIFC = async (input, onProgress, t, libPath = "./libs", settings) => {
  const { ifcApi, WebIFC } = await getIfcRuntime(libPath);
  let buffer;
  if (typeof input !== "string") {
    if (input instanceof ArrayBuffer) {
      buffer = input;
    } else {
      onProgress(5, `${t("reading")}...`);
      buffer = await input.arrayBuffer();
      onProgress(25, `${t("reading")}...`);
    }
  } else {
    const loader = new THREE.FileLoader();
    loader.setResponseType("arraybuffer");
    let staticReadCounter = 0;
    buffer = await new Promise((resolve, reject) => {
      loader.load(
        input,
        (data2) => resolve(data2),
        (event) => {
          if (event.total > 0) {
            const readPercent = event.loaded / event.total * 100;
            onProgress(readPercent, `${t("reading")}...`);
          } else {
            staticReadCounter = staticReadCounter + 5;
            onProgress(Math.min(35, staticReadCounter), `${t("reading")}...`);
          }
        },
        reject
      );
    });
  }
  const data = new Uint8Array(buffer);
  onProgress(30, t("analyzing"));
  const modelID = ifcApi.OpenModel(data, {
    COORDINATE_TO_ORIGIN: true,
    CIRCLE_SEGMENTS: 12,
    MEMORY_LIMIT: 1073741824
    // 1GB（内存限制）
  });
  const rootGroup = new THREE.Group();
  rootGroup.name = "IFC模型";
  const propertyMap = /* @__PURE__ */ new Map();
  const typePropertyMap = /* @__PURE__ */ new Map();
  const typeAssignmentMap = /* @__PURE__ */ new Map();
  const layerMap = /* @__PURE__ */ new Map();
  const classificationMap = /* @__PURE__ */ new Map();
  const materialMap = /* @__PURE__ */ new Map();
  const systemMap = /* @__PURE__ */ new Map();
  const spatialMetaMap = /* @__PURE__ */ new Map();
  const lineCache = /* @__PURE__ */ new Map();
  const getLineCached = (expressID) => {
    if (lineCache.has(expressID)) return lineCache.get(expressID);
    const line = ifcApi.GetLine(modelID, expressID);
    lineCache.set(expressID, line);
    return line;
  };
  const buildPropertyMap = () => {
    try {
      const relID = getIfcTypeCode(ifcApi, "IFCRELDEFINESBYPROPERTIES");
      const lines = ifcApi.GetLineIDsWithType(modelID, relID);
      const size = lines.size();
      for (let i = 0; i < size; i++) {
        const id = lines.get(i);
        const rel = getLineCached(id);
        if (rel?.RelatedObjects && Array.isArray(rel.RelatedObjects)) {
          const psetID = rel.RelatingPropertyDefinition?.value;
          if (psetID) {
            rel.RelatedObjects.forEach((objRef) => {
              const objID = objRef.value;
              if (!propertyMap.has(objID)) propertyMap.set(objID, []);
              propertyMap.get(objID).push(psetID);
            });
          }
        }
      }
    } catch (e) {
      console.warn("无法构建属性映射表", e);
    }
  };
  const buildTypeAssignments = () => {
    try {
      const relID = getIfcTypeCode(ifcApi, "IFCRELDEFINESBYTYPE");
      const lines = ifcApi.GetLineIDsWithType(modelID, relID);
      for (let i = 0; i < lines.size(); i++) {
        const rel = getLineCached(lines.get(i));
        const typeId = resolveExpressId(rel?.RelatingType);
        if (!typeId) continue;
        toExpressIds(rel?.RelatedObjects).forEach((objID) => {
          typeAssignmentMap.set(objID, typeId);
        });
        const typeEntity = getLineCached(typeId);
        toExpressIds(typeEntity?.HasPropertySets).forEach((psetID) => {
          if (!typePropertyMap.has(typeId)) typePropertyMap.set(typeId, []);
          typePropertyMap.get(typeId).push(psetID);
        });
      }
    } catch (e) {
      console.warn("无法构建类型属性映射表", e);
    }
  };
  const buildLayerMap = () => {
    try {
      const layerType = getIfcTypeCode(ifcApi, "IFCPRESENTATIONLAYERASSIGNMENT");
      const layers = ifcApi.GetLineIDsWithType(modelID, layerType);
      for (let i = 0; i < layers.size(); i++) {
        const id = layers.get(i);
        const layer = getLineCached(id);
        const layerName = layer?.Name?.value || `Layer_${id}`;
        if (layer?.AssignedItems && Array.isArray(layer.AssignedItems)) {
          layer.AssignedItems.forEach((itemRef) => {
            const itemID = itemRef.value;
            layerMap.set(itemID, layerName);
          });
        }
      }
    } catch (e) {
      console.warn("无法构建图层映射表", e);
    }
  };
  const getClassificationLabel = (classification) => {
    if (!classification) return null;
    const raw = typeof classification === "number" ? getLineCached(classification) : classification;
    if (!raw) return null;
    const identification = sanitizeIfcLabel(raw.Identification?.value, raw.ItemReference?.value, raw.Reference?.value) || "";
    const name = sanitizeIfcLabel(raw.Name?.value, raw.Description?.value, raw.Source?.value) || "";
    const parts = uniqueStrings([identification, name]);
    return parts.length > 0 ? parts.join(" - ") : sanitizeIfcLabel(raw.is_a) || null;
  };
  const buildClassificationMap = () => {
    try {
      const relID = getIfcTypeCode(ifcApi, "IFCRELASSOCIATESCLASSIFICATION");
      const lines = ifcApi.GetLineIDsWithType(modelID, relID);
      for (let i = 0; i < lines.size(); i++) {
        const rel = getLineCached(lines.get(i));
        const relatedClassificationId = resolveExpressId(rel?.RelatingClassification);
        const relatedClassification = relatedClassificationId ? getLineCached(relatedClassificationId) : rel?.RelatingClassification;
        const label = getClassificationLabel(relatedClassification);
        if (!label) continue;
        toExpressIds(rel?.RelatedObjects).forEach((objID) => {
          if (!classificationMap.has(objID)) classificationMap.set(objID, []);
          classificationMap.get(objID).push(label);
        });
      }
    } catch (e) {
      console.warn("无法构建分类映射表", e);
    }
  };
  const extractMaterialNames = (source, visited = /* @__PURE__ */ new Set()) => {
    if (!source) return [];
    const sourceId = resolveExpressId(source);
    const line = typeof source === "number" || source?.value !== void 0 ? getLineCached(sourceId) : source;
    if (sourceId && visited.has(sourceId)) return [];
    if (sourceId) visited.add(sourceId);
    if (!line) return [];
    const baseNames = uniqueStrings([
      sanitizeIfcLabel(line.Name?.value),
      sanitizeIfcLabel(line.LayerSetName?.value),
      sanitizeIfcLabel(line.Category?.value)
    ]);
    const nestedKeys = ["Materials", "MaterialLayers", "MaterialProfiles", "MaterialConstituents"];
    const nestedNames = nestedKeys.flatMap(
      (key) => toExpressIds(line[key]).flatMap((id) => extractMaterialNames(id, visited))
    );
    const singleRefs = [line.ForLayerSet, line.ForProfileSet, line.Material].map(resolveExpressId).filter((id) => typeof id === "number").flatMap((id) => extractMaterialNames(id, visited));
    return uniqueStrings([...baseNames, ...nestedNames, ...singleRefs]);
  };
  const buildMaterialMap = () => {
    try {
      const relID = getIfcTypeCode(ifcApi, "IFCRELASSOCIATESMATERIAL");
      const lines = ifcApi.GetLineIDsWithType(modelID, relID);
      for (let i = 0; i < lines.size(); i++) {
        const rel = getLineCached(lines.get(i));
        const names = extractMaterialNames(rel?.RelatingMaterial);
        if (names.length === 0) continue;
        toExpressIds(rel?.RelatedObjects).forEach((objID) => {
          if (!materialMap.has(objID)) materialMap.set(objID, []);
          materialMap.get(objID).push(...names);
        });
      }
    } catch (e) {
      console.warn("无法构建材质映射表", e);
    }
  };
  const buildSystemMap = () => {
    try {
      const relID = getIfcTypeCode(ifcApi, "IFCRELASSIGNSTOGROUP");
      const lines = ifcApi.GetLineIDsWithType(modelID, relID);
      for (let i = 0; i < lines.size(); i++) {
        const rel = getLineCached(lines.get(i));
        const groupId = resolveExpressId(rel?.RelatingGroup);
        if (!groupId) continue;
        const group = getLineCached(groupId);
        if (!group || group.is_a !== "IFCSYSTEM" && group.is_a !== "IFCDISTRIBUTIONSYSTEM") continue;
        const systemName = sanitizeIfcLabel(group.Name?.value, group.LongName?.value) || `${group.is_a} [${groupId}]`;
        toExpressIds(rel?.RelatedObjects).forEach((objID) => {
          if (!systemMap.has(objID)) systemMap.set(objID, []);
          systemMap.get(objID).push(systemName);
        });
      }
    } catch (e) {
      console.warn("无法构建系统映射表", e);
    }
  };
  rootGroup.userData.isIFC = true;
  rootGroup.userData.ifcAPI = ifcApi;
  rootGroup.userData.modelID = modelID;
  rootGroup.userData.layerMap = layerMap;
  rootGroup.userData.ifcGridDiagnostics = [];
  const createTextSprite = (text, position, color, worldHeight = 36) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.Sprite();
    const font = 'bold 26px "Microsoft YaHei", Arial, sans-serif';
    ctx.font = font;
    const padding = 14;
    const textWidth = Math.ceil(ctx.measureText(text).width);
    canvas.width = textWidth + padding * 2;
    canvas.height = 44;
    ctx.font = font;
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
    ctx.fillStyle = "#111827";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false
    }));
    sprite.position.copy(position);
    const baseScale = THREE.MathUtils.clamp(worldHeight, 6, 320);
    sprite.scale.set(baseScale * (canvas.width / canvas.height), baseScale, 1);
    sprite.renderOrder = 1002;
    sprite.userData.isIfcGridHelper = true;
    return sprite;
  };
  const getCartesianPoint = (pointRef) => {
    const pointId = resolveExpressId(pointRef);
    const point = pointId ? getLineCached(pointId) : pointRef;
    const coords = point?.Coordinates;
    if (!coords) return null;
    const values = Array.isArray(coords) ? coords.map((coord) => coord?.value ?? coord) : [];
    return new THREE.Vector3(
      Number(values[0] || 0),
      Number(values[1] || 0),
      Number(values[2] || 0)
    );
  };
  const getScalarValue = (valueRef) => {
    if (valueRef === void 0 || valueRef === null) return null;
    if (typeof valueRef === "number") return Number.isFinite(valueRef) ? valueRef : null;
    if (typeof valueRef === "string") {
      const parsed = Number(valueRef);
      return Number.isFinite(parsed) ? parsed : null;
    }
    if (typeof valueRef === "object") {
      if (typeof valueRef.value === "number") return Number.isFinite(valueRef.value) ? valueRef.value : null;
      if (typeof valueRef.wrappedValue === "number") return Number.isFinite(valueRef.wrappedValue) ? valueRef.wrappedValue : null;
    }
    return null;
  };
  const sampleCurvePoints = (evaluator, steps, includeEnd = true) => {
    const points = [];
    const count = Math.max(2, steps);
    const denominator = includeEnd ? count - 1 : count;
    for (let index = 0; index < count; index++) {
      const t2 = denominator === 0 ? 0 : index / denominator;
      points.push(evaluator(Math.min(1, Math.max(0, t2))));
    }
    return points;
  };
  const placementMatrixCache = /* @__PURE__ */ new Map();
  const getDirectionVector = (directionRef, fallback) => {
    const directionId = resolveExpressId(directionRef);
    if (!directionId) return fallback.clone();
    const direction = getLineCached(directionId);
    const ratios = direction?.DirectionRatios;
    if (!Array.isArray(ratios)) return fallback.clone();
    const vector = new THREE.Vector3(
      Number(ratios[0]?.value ?? ratios[0] ?? fallback.x),
      Number(ratios[1]?.value ?? ratios[1] ?? fallback.y),
      Number(ratios[2]?.value ?? ratios[2] ?? fallback.z)
    );
    return vector.lengthSq() > 0 ? vector.normalize() : fallback.clone();
  };
  const getAxisPlacementMatrix = (placementRef) => {
    const placementId = resolveExpressId(placementRef);
    const placement = placementId ? getLineCached(placementId) : placementRef;
    if (!placement) return new THREE.Matrix4();
    const location = getCartesianPoint(placement.Location) || new THREE.Vector3();
    const zAxis = getDirectionVector(placement.Axis, new THREE.Vector3(0, 0, 1));
    let xAxis = getDirectionVector(placement.RefDirection, new THREE.Vector3(1, 0, 0));
    let yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize();
    if (yAxis.lengthSq() === 0) {
      xAxis = new THREE.Vector3(1, 0, 0);
      yAxis = new THREE.Vector3(0, 1, 0);
    }
    xAxis = new THREE.Vector3().crossVectors(yAxis, zAxis).normalize();
    return new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis).setPosition(location);
  };
  const getObjectPlacementMatrix = (placementRef) => {
    const placementId = resolveExpressId(placementRef);
    if (!placementId) return new THREE.Matrix4();
    if (placementMatrixCache.has(placementId)) {
      return placementMatrixCache.get(placementId).clone();
    }
    const placement = getLineCached(placementId);
    let matrix = new THREE.Matrix4();
    if (placement?.is_a === "IFCLOCALPLACEMENT") {
      const relative = getAxisPlacementMatrix(placement.RelativePlacement);
      const parentId = resolveExpressId(placement.PlacementRelTo);
      matrix = parentId ? getObjectPlacementMatrix(parentId).multiply(relative) : relative;
    } else if (placement?.is_a === "IFCAXIS2PLACEMENT3D" || placement?.is_a === "IFCAXIS2PLACEMENT2D") {
      matrix = getAxisPlacementMatrix(placement);
    }
    placementMatrixCache.set(placementId, matrix.clone());
    return matrix;
  };
  const angleFromPointOnConic = (point, basis, xRadius, yRadius) => {
    const inverse = basis.clone().invert();
    const localPoint = point.clone().applyMatrix4(inverse);
    return Math.atan2(localPoint.y / Math.max(yRadius, 1e-6), localPoint.x / Math.max(xRadius, 1e-6));
  };
  const unwrapAngleRange = (startAngle, endAngle) => {
    let normalizedEnd = endAngle;
    while (normalizedEnd <= startAngle) {
      normalizedEnd += Math.PI * 2;
    }
    return { startAngle, endAngle: normalizedEnd };
  };
  const buildConicPoints = (positionRef, xRadius, yRadius, startAngle = 0, endAngle = Math.PI * 2) => {
    const basis = getAxisPlacementMatrix(positionRef);
    const { startAngle: from, endAngle: to } = unwrapAngleRange(startAngle, endAngle);
    const span = Math.abs(to - from);
    const steps = Math.max(12, Math.ceil(span / (Math.PI * 2) * 48));
    return sampleCurvePoints((t2) => {
      const angle = from + (to - from) * t2;
      return new THREE.Vector3(
        Math.cos(angle) * xRadius,
        Math.sin(angle) * yRadius,
        0
      ).applyMatrix4(basis);
    }, steps, true);
  };
  const getTrimmedConicPoints = (curve, basisCurve, xRadius, yRadius) => {
    const trim1Values = Array.isArray(curve.Trim1) ? curve.Trim1 : [curve.Trim1];
    const trim2Values = Array.isArray(curve.Trim2) ? curve.Trim2 : [curve.Trim2];
    const basis = getAxisPlacementMatrix(basisCurve.Position);
    const resolveAngle = (trimValue) => {
      const point = getCartesianPoint(trimValue);
      if (point) {
        return angleFromPointOnConic(point, basis, xRadius, yRadius);
      }
      return getScalarValue(trimValue);
    };
    const startAngle = trim1Values.map(resolveAngle).find((value) => value !== null);
    const endAngle = trim2Values.map(resolveAngle).find((value) => value !== null);
    if (startAngle === void 0 || endAngle === void 0) return null;
    return buildConicPoints(basisCurve.Position, xRadius, yRadius, startAngle, endAngle);
  };
  const offsetPolylinePoints = (points, distance, referenceDirection = new THREE.Vector3(0, 0, 1)) => {
    if (points.length < 2 || Math.abs(distance) < 1e-6) return points;
    const shifted = [];
    for (let index = 0; index < points.length; index++) {
      const prev = points[Math.max(0, index - 1)];
      const next = points[Math.min(points.length - 1, index + 1)];
      const tangent = next.clone().sub(prev);
      if (tangent.lengthSq() < 1e-8) {
        shifted.push(points[index].clone());
        continue;
      }
      const normal = new THREE.Vector3().crossVectors(referenceDirection, tangent.normalize()).normalize();
      shifted.push(points[index].clone().addScaledVector(normal, distance));
    }
    return shifted;
  };
  const extractCurvePoints = (curveRef, visited = /* @__PURE__ */ new Set()) => {
    const curveId = resolveExpressId(curveRef);
    const curve = curveId ? getLineCached(curveId) : curveRef;
    if (!curve) return [];
    if (curveId && visited.has(curveId)) return [];
    if (curveId) visited.add(curveId);
    if (curve.is_a === "IFCPOLYLINE") {
      return toExpressIds(curve.Points).map((pointId) => getCartesianPoint(pointId)).filter((point) => !!point);
    }
    if (curve.is_a === "IFCINDEXEDPOLYCURVE") {
      const points = getLineCached(resolveExpressId(curve.Points) || 0);
      const coordList = points?.CoordList || [];
      return coordList.map((coord) => {
        const values = Array.isArray(coord) ? coord.map((item) => item?.value ?? item) : [];
        return new THREE.Vector3(Number(values[0] || 0), Number(values[1] || 0), Number(values[2] || 0));
      });
    }
    if (curve.is_a === "IFCCOMPOSITECURVE") {
      return toExpressIds(curve.Segments).flatMap((segmentId) => {
        const segment = getLineCached(segmentId);
        const points = extractCurvePoints(segment?.ParentCurve, visited);
        return segment?.SameSense === false ? points.reverse() : points;
      });
    }
    if (curve.is_a === "IFCCURVESEGMENT") {
      const baseCurve = curve.ParentCurve || curve.BasisCurve || curve.BaseCurve;
      const basePoints = extractCurvePoints(baseCurve, visited);
      return curve.SameSense === false ? basePoints.reverse() : basePoints;
    }
    if (curve.is_a === "IFCPCURVE") {
      return extractCurvePoints(curve.ReferenceCurve || curve.BasisCurve || curve.OuterBoundary, visited);
    }
    if (curve.is_a === "IFCOFFSETCURVE2D" || curve.is_a === "IFCOFFSETCURVE3D") {
      const baseCurve = curve.BasisCurve || curve.ParentCurve || curve.ReferenceCurve;
      const basePoints = extractCurvePoints(baseCurve, visited);
      if (basePoints.length < 2) return basePoints;
      const distance = getScalarValue(curve.Distance || curve.OffsetDistance) ?? 0;
      const referenceDirection = curve.is_a === "IFCOFFSETCURVE3D" ? getDirectionVector(curve.RefDirection, new THREE.Vector3(0, 0, 1)) : new THREE.Vector3(0, 0, 1);
      return offsetPolylinePoints(basePoints, distance, referenceDirection);
    }
    if (curve.is_a === "IFCBSPLINECURVE" || curve.is_a === "IFCBSPLINECURVEWITHKNOTS") {
      const controlPoints = (curve.ControlPointsList || curve.ControlPoints || []).map((pointRef) => getCartesianPoint(pointRef)).filter((point) => !!point);
      if (controlPoints.length >= 2) {
        const spline = new THREE.CatmullRomCurve3(controlPoints);
        return spline.getPoints(Math.max(16, controlPoints.length * 6));
      }
    }
    if (curve.is_a === "IFCCIRCLE") {
      const radius = getScalarValue(curve.Radius) ?? 1;
      return buildConicPoints(curve.Position, radius, radius);
    }
    if (curve.is_a === "IFCELLIPSE") {
      const semiAxis1 = getScalarValue(curve.SemiAxis1) ?? 1;
      const semiAxis2 = getScalarValue(curve.SemiAxis2) ?? semiAxis1;
      return buildConicPoints(curve.Position, semiAxis1, semiAxis2);
    }
    if (curve.is_a === "IFCTRIMMEDCURVE") {
      const basisCurve = resolveExpressId(curve.BasisCurve) ? getLineCached(resolveExpressId(curve.BasisCurve)) : curve.BasisCurve;
      if (basisCurve?.is_a === "IFCCIRCLE") {
        const radius = getScalarValue(basisCurve.Radius) ?? 1;
        const arcPoints = getTrimmedConicPoints(curve, basisCurve, radius, radius);
        if (arcPoints && arcPoints.length > 1) return arcPoints;
      }
      if (basisCurve?.is_a === "IFCELLIPSE") {
        const semiAxis1 = getScalarValue(basisCurve.SemiAxis1) ?? 1;
        const semiAxis2 = getScalarValue(basisCurve.SemiAxis2) ?? semiAxis1;
        const arcPoints = getTrimmedConicPoints(curve, basisCurve, semiAxis1, semiAxis2);
        if (arcPoints && arcPoints.length > 1) return arcPoints;
      }
      const trim1 = toExpressIds(curve.Trim1).map((id) => getCartesianPoint(id)).filter((point) => !!point);
      const trim2 = toExpressIds(curve.Trim2).map((id) => getCartesianPoint(id)).filter((point) => !!point);
      if (trim1.length > 0 && trim2.length > 0) {
        return [trim1[0], trim2[0]];
      }
      return extractCurvePoints(curve.BasisCurve, visited);
    }
    if (curve.is_a === "IFCLINE") {
      const origin = getCartesianPoint(curve.Pnt) || new THREE.Vector3();
      const direction = getDirectionVector(curve.Dir?.Orientation, new THREE.Vector3(1, 0, 0));
      const magnitude = Number(curve.Dir?.Magnitude?.value ?? curve.Dir?.Magnitude ?? 1) || 1;
      const span = 1e3 * magnitude;
      return [
        origin.clone().addScaledVector(direction, -span),
        origin.clone().addScaledVector(direction, span)
      ];
    }
    if (curve.is_a === "IFCGRIDAXIS") {
      return extractCurvePoints(curve.AxisCurve, visited);
    }
    rootGroup.userData.ifcGridDiagnostics.push(curve.is_a || `UnknownCurve:${curveId ?? "?"}`);
    return [];
  };
  const nodesMap = /* @__PURE__ */ new Map();
  nodesMap.set(0, rootGroup);
  const meshesByExpressId = /* @__PURE__ */ new Map();
  const aggregatesMap = /* @__PURE__ */ new Map();
  const containmentMap = /* @__PURE__ */ new Map();
  const buildIndices = () => {
    const relDecomposes = ifcApi.GetLineIDsWithType(modelID, WebIFC.IFCRELAGGREGATES);
    for (let i = 0; i < relDecomposes.size(); i++) {
      const rel = getLineCached(relDecomposes.get(i));
      const parentID = rel.RelatingObject.value;
      const children = rel.RelatedObjects.map((obj) => obj.value);
      if (!aggregatesMap.has(parentID)) aggregatesMap.set(parentID, []);
      aggregatesMap.get(parentID).push(...children);
    }
    const relContained = ifcApi.GetLineIDsWithType(modelID, WebIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE);
    for (let i = 0; i < relContained.size(); i++) {
      const rel = getLineCached(relContained.get(i));
      const containerID = rel.RelatingStructure.value;
      const elements = rel.RelatedElements.map((el) => el.value);
      if (!containmentMap.has(containerID)) containmentMap.set(containerID, []);
      containmentMap.get(containerID).push(...elements);
    }
  };
  const visitedHierarchy = /* @__PURE__ */ new Set();
  const parseSpatialRecursive = (expressID, parent, spatialContext) => {
    const props = getLineCached(expressID);
    if (!props) return;
    if (visitedHierarchy.has(expressID)) return;
    visitedHierarchy.add(expressID);
    let currentParent = parent;
    let nextSpatialContext = spatialContext;
    const spatialTypes = [
      "IFCPROJECT",
      "IFCSITE",
      "IFCBUILDING",
      "IFCBUILDINGSTOREY",
      "IFCSPACE",
      "IFCZONE"
    ];
    const isSpatialContainer = spatialTypes.includes(props.is_a);
    const name = sanitizeIfcLabel(props.Name?.value, props.LongName?.value, props.Description?.value) || `${props.is_a} [${expressID}]`;
    const storeyElevation = props.is_a === "IFCBUILDINGSTOREY" ? getScalarValue(props.Elevation) : spatialContext.elevation;
    const group = new THREE.Group();
    group.name = name;
    nextSpatialContext = {
      storey: props.is_a === "IFCBUILDINGSTOREY" ? name : spatialContext.storey,
      elevation: storeyElevation ?? void 0,
      path: isSpatialContainer ? [...spatialContext.path, name] : spatialContext.path,
      container: props.is_a
    };
    group.userData = {
      expressID,
      isSpatial: isSpatialContainer,
      isIfcEntity: true,
      type: props.is_a,
      ifcSpatial: nextSpatialContext,
      ifcMetadata: {
        category: props.is_a,
        storey: nextSpatialContext.storey,
        elevation: nextSpatialContext.elevation,
        spatialPath: nextSpatialContext.path,
        systems: [],
        materials: [],
        classifications: [],
        typeName: "",
        globalId: props.GlobalId?.value || ""
      }
    };
    parent.add(group);
    currentParent = group;
    nodesMap.set(expressID, group);
    spatialMetaMap.set(expressID, nextSpatialContext);
    const children = aggregatesMap.get(expressID);
    if (children) {
      for (const childID of children) {
        parseSpatialRecursive(childID, currentParent, nextSpatialContext);
      }
    }
    const elements = containmentMap.get(expressID);
    if (elements) {
      for (const elementID of elements) {
        parseSpatialRecursive(elementID, currentParent, nextSpatialContext);
      }
    }
  };
  const loadSpatialStructure = () => {
    try {
      buildIndices();
      const projects = ifcApi.GetLineIDsWithType(modelID, WebIFC.IFCPROJECT);
      if (projects.size() > 0) {
        for (let i = 0; i < projects.size(); i++) {
          parseSpatialRecursive(projects.get(i), rootGroup, {
            storey: "",
            elevation: void 0,
            path: [],
            container: "IFCPROJECT"
          });
        }
      } else {
        const sites = ifcApi.GetLineIDsWithType(modelID, WebIFC.IFCSITE);
        for (let i = 0; i < sites.size(); i++) {
          parseSpatialRecursive(sites.get(i), rootGroup, {
            storey: "",
            elevation: void 0,
            path: [],
            container: "IFCSITE"
          });
        }
      }
    } catch (e) {
      console.error("解析 IFC 完整空间结构失败:", e);
    }
  };
  loadSpatialStructure();
  const buildIfcGridHelpers = () => {
    try {
      const gridType = getIfcTypeCode(ifcApi, "IFCGRID");
      const grids = ifcApi.GetLineIDsWithType(modelID, gridType);
      if (!grids || grids.size() === 0) return;
      const gridGroup = new THREE.Group();
      gridGroup.name = "__IFCGridHelper";
      gridGroup.visible = true;
      gridGroup.userData.isIfcGridHelper = true;
      const axisConfigs = [
        { key: "UAxes", color: "#d97706" },
        { key: "VAxes", color: "#2563eb" },
        { key: "WAxes", color: "#059669" }
      ];
      const createAxisPolyline = (points, color) => {
        const axisGroup = new THREE.Group();
        axisGroup.userData.isIfcGridHelper = true;
        const bounds = new THREE.Box3().setFromPoints(points);
        const size = bounds.getSize(new THREE.Vector3());
        const maxSpan = Math.max(size.x, size.y, size.z, 1);
        const radius = THREE.MathUtils.clamp(maxSpan * 2e-3, 0.6, 28);
        const material = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.92,
          depthTest: false,
          depthWrite: false
        });
        for (let pointIndex = 0; pointIndex < points.length - 1; pointIndex++) {
          const start = points[pointIndex];
          const end = points[pointIndex + 1];
          const direction = new THREE.Vector3().subVectors(end, start);
          const length = direction.length();
          if (length <= 1e-4) continue;
          const cylinder = new THREE.Mesh(
            new THREE.CylinderGeometry(radius, radius, length, 10),
            material
          );
          cylinder.position.copy(start).add(end).multiplyScalar(0.5);
          cylinder.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.normalize()
          );
          cylinder.renderOrder = 1e3;
          cylinder.userData.isIfcGridHelper = true;
          axisGroup.add(cylinder);
        }
        points.forEach((point) => {
          const joint = new THREE.Mesh(
            new THREE.SphereGeometry(radius * 1.15, 10, 10),
            material
          );
          joint.position.copy(point);
          joint.renderOrder = 1001;
          joint.userData.isIfcGridHelper = true;
          axisGroup.add(joint);
        });
        return axisGroup;
      };
      for (let i = 0; i < grids.size(); i++) {
        const grid = getLineCached(grids.get(i));
        if (!grid) continue;
        axisConfigs.forEach(({ key, color }) => {
          toExpressIds(grid[key]).forEach((axisId) => {
            const axis = getLineCached(axisId);
            const placementMatrix = getObjectPlacementMatrix(grid?.ObjectPlacement);
            const points = extractCurvePoints(axis?.AxisCurve).map((point) => point.clone().applyMatrix4(placementMatrix));
            if (points.length < 2) return;
            gridGroup.add(createAxisPolyline(points, color));
            const axisTag = sanitizeIfcLabel(axis?.AxisTag?.value, axis?.Name?.value) || `${key}-${axisId}`;
            const start = points[0];
            const end = points[points.length - 1];
            const span = start.distanceTo(end);
            const labelSize = THREE.MathUtils.clamp(span * 0.035, 10, 220);
            const labelRadius = THREE.MathUtils.clamp(span * 2e-3, 0.6, 28);
            const offsetValue = Math.max(labelRadius * 3.2, labelSize * 0.12);
            const offset = new THREE.Vector3(offsetValue, offsetValue, labelRadius * 0.6);
            gridGroup.add(createTextSprite(axisTag, start.clone().add(offset), color, labelSize));
            if (start.distanceTo(end) > 1) {
              gridGroup.add(createTextSprite(axisTag, end.clone().add(offset), color, labelSize));
            }
          });
        });
      }
      if (gridGroup.children.length > 0) {
        rootGroup.add(gridGroup);
        rootGroup.userData.ifcGridHelper = gridGroup;
      }
    } catch (e) {
      console.warn("构建 IFC 轴网失败", e);
    }
  };
  buildIfcGridHelpers();
  const shouldDeferMetadata = buffer.byteLength > 20 * 1024 * 1024;
  const applyLayerMetadata = () => {
    for (const [expressID, meshes] of meshesByExpressId.entries()) {
      const layerName = layerMap.get(expressID);
      if (!layerName) continue;
      for (const mesh of meshes) {
        mesh.userData.layer = layerName;
      }
    }
  };
  if (shouldDeferMetadata) {
    onProgress(42, `${t("analyzing")}...`);
    setTimeout(() => {
      buildLayerMap();
      buildPropertyMap();
      buildTypeAssignments();
      buildClassificationMap();
      buildMaterialMap();
      buildSystemMap();
      applyLayerMetadata();
    }, 0);
  } else {
    buildLayerMap();
    buildPropertyMap();
    buildTypeAssignments();
    buildClassificationMap();
    buildMaterialMap();
    buildSystemMap();
    applyLayerMetadata();
  }
  const getFriendlyName = (name) => {
    let cleanName = name.replace(/^(is|has|are)_/i, "");
    const camelToWords = (str) => {
      return str.replace(/([A-Z])/g, " $1").replace(/^ /, "");
    };
    return camelToWords(cleanName);
  };
  const getRawDisplayName = (name) => name;
  const formatDisplayValue = (value) => {
    if (value === null || value === void 0) return "";
    if (value === "") return "";
    if (typeof value === "object" && value !== null) {
      if (value.value !== void 0) {
        return formatDisplayValue(value.value);
      }
      if (Array.isArray(value)) {
        return value.map((item) => formatDisplayValue(item)).filter((v) => v !== null && v !== void 0 && v !== "").join(", ");
      }
      if (Object.keys(value).length <= 3) {
        return Object.entries(value).map(([k, v]) => `${k}: ${formatDisplayValue(v)}`).join(", ");
      }
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    }
    if (typeof value === "boolean") {
      return value ? "是" : "否";
    }
    if (typeof value === "number") {
      if (Number.isInteger(value)) {
        return value.toString();
      }
      return parseFloat(value.toFixed(3)).toString();
    }
    if (typeof value === "string") {
      const cleaned = value.trim();
      if (["", "n/a", "na", "undefined", "null", "-", "--"].includes(cleaned.toLowerCase())) {
        return "";
      }
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleaned)) {
        return cleaned;
      }
      return cleaned;
    }
    return String(value);
  };
  const flattenAndFormatProperties = (obj, category = "", formatter = getFriendlyName) => {
    const result = {};
    Object.keys(obj).forEach((key) => {
      if (["expressID", "is_a", "type", "ID", "Name", "GlobalId"].includes(key)) return;
      const value = obj[key];
      const displayKey = formatter(key);
      const categoryPrefix = category ? `${category}.` : "";
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        const nested = flattenAndFormatProperties(value, categoryPrefix + displayKey, formatter);
        Object.assign(result, nested);
      } else {
        const fullKey = categoryPrefix + displayKey;
        result[fullKey] = formatDisplayValue(value);
      }
    });
    return result;
  };
  const collectPsetData = (psetIDs, rawKeyPrefix = "") => {
    const normalizedGroups = {};
    const rawGroups = {};
    let quantityGroupCount = 0;
    const ensureGroup = (target, groupName) => {
      if (!target[groupName]) target[groupName] = {};
      return target[groupName];
    };
    for (const psetID of psetIDs) {
      try {
        const pset = getLineCached(psetID);
        if (!pset) continue;
        const psetBaseName = pset.Name?.value || `属性集_${psetID}`;
        const normalizedGroupName = getFriendlyName(psetBaseName);
        const rawGroupName = `${rawKeyPrefix}${psetBaseName}`;
        if (pset.HasProperties) {
          const normalizedGroup = ensureGroup(normalizedGroups, normalizedGroupName);
          const rawGroup = ensureGroup(rawGroups, rawGroupName);
          normalizedGroup["类型"] = pset.is_a;
          rawGroup["is_a"] = pset.is_a;
          if (pset.Description?.value) {
            normalizedGroup["描述"] = formatDisplayValue(pset.Description.value);
            rawGroup["Description"] = formatDisplayValue(pset.Description.value);
          }
          for (const propRef of pset.HasProperties) {
            const propID = propRef.value;
            const prop = getLineCached(propID);
            if (!prop || !prop.Name) continue;
            const propName = prop.Name.value;
            if (prop.NominalValue) {
              normalizedGroup[getFriendlyName(propName)] = formatDisplayValue(prop.NominalValue.value);
              rawGroup[propName] = formatDisplayValue(prop.NominalValue.value);
              continue;
            }
            const flattenedNormalized = flattenAndFormatProperties(prop, "", getFriendlyName);
            const flattenedRaw = flattenAndFormatProperties(prop, "", getRawDisplayName);
            Object.entries(flattenedNormalized).forEach(([key, value]) => {
              normalizedGroup[`${getFriendlyName(propName)}.${key}`] = String(value);
            });
            Object.entries(flattenedRaw).forEach(([key, value]) => {
              rawGroup[`${propName}.${key}`] = String(value);
            });
          }
        }
        if (pset.Quantities) {
          quantityGroupCount += 1;
          const normalizedGroup = ensureGroup(normalizedGroups, `${normalizedGroupName}.数量`);
          const rawGroup = ensureGroup(rawGroups, `${rawGroupName}.Quantities`);
          pset.Quantities.forEach((quant) => {
            const quantity = resolveExpressId(quant) ? getLineCached(quant.value) : quant;
            if (!quantity?.Name?.value) return;
            const quantityName = quantity.Name.value;
            const valueTypes = [
              "LengthValue",
              "AreaValue",
              "VolumeValue",
              "CountValue",
              "WeightValue",
              "TimeValue"
            ];
            valueTypes.forEach((valueKey) => {
              if (quantity[valueKey]?.value === void 0) return;
              normalizedGroup[`${getFriendlyName(quantityName)}.${getFriendlyName(valueKey)}`] = formatDisplayValue(quantity[valueKey].value);
              rawGroup[`${quantityName}.${valueKey}`] = formatDisplayValue(quantity[valueKey].value);
            });
          });
        }
      } catch (e) {
        console.warn(`解析属性集${psetID}失败`, e);
      }
    }
    return {
      normalizedGroups,
      rawGroups,
      quantityGroupCount
    };
  };
  rootGroup.userData.ifcManager = {
    getItemProperties: async (_id, expressID) => {
      const normalizedGroups = {};
      const rawGroups = {};
      const addGroupEntry = (target, groupName, key, value) => {
        if (value === "" || value === null || value === void 0) return;
        if (!target[groupName]) target[groupName] = {};
        target[groupName][key] = String(value);
      };
      let entity = null;
      try {
        entity = getLineCached(expressID);
        if (entity) {
          addGroupEntry(normalizedGroups, "IFC 标识", "ExpressID", expressID);
          addGroupEntry(normalizedGroups, "IFC 标识", "类型", entity.is_a || "Unknown");
          addGroupEntry(normalizedGroups, "IFC 标识", "全局ID", entity.GlobalId?.value || "");
          addGroupEntry(normalizedGroups, "IFC 标识", "名称", entity.Name?.value || "");
          addGroupEntry(normalizedGroups, "IFC 标识", "描述", entity.Description?.value || "");
          addGroupEntry(normalizedGroups, "IFC 标识", "标签", entity.Tag?.value || "");
          addGroupEntry(rawGroups, "IFC Entity", "expressID", expressID);
          addGroupEntry(rawGroups, "IFC Entity", "is_a", entity.is_a || "Unknown");
          addGroupEntry(rawGroups, "IFC Entity", "GlobalId", entity.GlobalId?.value || "");
          addGroupEntry(rawGroups, "IFC Entity", "Name", entity.Name?.value || "");
          addGroupEntry(rawGroups, "IFC Entity", "Description", entity.Description?.value || "");
          addGroupEntry(rawGroups, "IFC Entity", "Tag", entity.Tag?.value || "");
          Object.keys(entity).forEach((key) => {
            if (["expressID", "is_a", "type", "ID", "GlobalId", "Name", "Description", "Tag"].includes(key)) return;
            const value = formatDisplayValue(entity[key]);
            addGroupEntry(normalizedGroups, "IFC 标识", getFriendlyName(key), value);
            addGroupEntry(rawGroups, "IFC Entity", key, value);
          });
        }
      } catch (e) {
        console.warn("获取实体属性失败", e);
      }
      const psetIDs = propertyMap.get(expressID) || [];
      let quantityGroupCount = 0;
      if (psetIDs.length > 0) {
        const parsed = collectPsetData(psetIDs);
        Object.assign(normalizedGroups, parsed.normalizedGroups);
        Object.assign(rawGroups, parsed.rawGroups);
        quantityGroupCount += parsed.quantityGroupCount;
      }
      const typeId = typeAssignmentMap.get(expressID);
      let typeName = "";
      if (typeId) {
        const typeEntity = getLineCached(typeId);
        typeName = typeEntity?.Name?.value || "";
        addGroupEntry(normalizedGroups, "IFC 类型", "类型实体", typeEntity?.is_a || "");
        addGroupEntry(normalizedGroups, "IFC 类型", "类型名称", typeName);
        addGroupEntry(normalizedGroups, "IFC 类型", "类型ID", typeId);
        addGroupEntry(rawGroups, "IFC Type", "is_a", typeEntity?.is_a || "");
        addGroupEntry(rawGroups, "IFC Type", "Name", typeName);
        addGroupEntry(rawGroups, "IFC Type", "expressID", typeId);
        const typePropertySets = typePropertyMap.get(typeId) || [];
        if (typePropertySets.length > 0) {
          const parsed = collectPsetData(typePropertySets, "TYPE:");
          Object.entries(parsed.normalizedGroups).forEach(([groupName, props]) => {
            normalizedGroups[`Type Properties · ${groupName}`] = props;
          });
          Object.entries(parsed.rawGroups).forEach(([groupName, props]) => {
            rawGroups[`TYPE:${groupName}`] = props;
          });
        }
      }
      const spatialMeta = spatialMetaMap.get(expressID);
      const classifications = uniqueStrings([
        ...classificationMap.get(expressID) || [],
        ...typeId ? classificationMap.get(typeId) || [] : []
      ]);
      const materials2 = uniqueStrings([
        ...materialMap.get(expressID) || [],
        ...typeId ? materialMap.get(typeId) || [] : []
      ]);
      const systems = uniqueStrings([
        ...systemMap.get(expressID) || [],
        ...typeId ? systemMap.get(typeId) || [] : []
      ]);
      if (classifications.length > 0) {
        addGroupEntry(normalizedGroups, "IFC 分类", "编码", classifications.join(", "));
        addGroupEntry(rawGroups, "IFC Classification", "Items", classifications.join(", "));
      }
      if (materials2.length > 0) {
        addGroupEntry(normalizedGroups, "IFC 材质", "材质名称", materials2.join(", "));
        addGroupEntry(rawGroups, "IFC Material", "Names", materials2.join(", "));
      }
      if (systems.length > 0) {
        addGroupEntry(normalizedGroups, "IFC 系统", "系统名称", systems.join(", "));
        addGroupEntry(rawGroups, "IFC System", "Names", systems.join(", "));
      }
      if (spatialMeta) {
        addGroupEntry(normalizedGroups, "IFC 空间", "所在楼层", spatialMeta.storey || "");
        addGroupEntry(normalizedGroups, "IFC 空间", "楼层标高", spatialMeta.elevation ?? "");
        addGroupEntry(normalizedGroups, "IFC 空间", "空间路径", spatialMeta.path.join(" / "));
        addGroupEntry(normalizedGroups, "IFC 空间", "容器类型", spatialMeta.container);
        addGroupEntry(rawGroups, "IFC Spatial", "Storey", spatialMeta.storey || "");
        addGroupEntry(rawGroups, "IFC Spatial", "Elevation", spatialMeta.elevation ?? "");
        addGroupEntry(rawGroups, "IFC Spatial", "Path", spatialMeta.path.join(" / "));
        addGroupEntry(rawGroups, "IFC Spatial", "Container", spatialMeta.container);
      }
      const meshRefs = meshesByExpressId.get(expressID) || [];
      const firstMesh = meshRefs[0];
      if (firstMesh) {
        const material = Array.isArray(firstMesh.material) ? firstMesh.material[0] : firstMesh.material;
        if (material instanceof THREE.MeshStandardMaterial) {
          addGroupEntry(normalizedGroups, "IFC 渲染", "颜色", `#${material.color.getHexString().toUpperCase()}`);
          addGroupEntry(normalizedGroups, "IFC 渲染", "透明度", material.opacity.toFixed(2));
          addGroupEntry(rawGroups, "IFC Render", "color", `#${material.color.getHexString().toUpperCase()}`);
          addGroupEntry(rawGroups, "IFC Render", "opacity", material.opacity.toFixed(2));
        }
      }
      const missingProvided = [];
      if (psetIDs.length === 0) missingProvided.push("属性集");
      if (!typeId) missingProvided.push("类型属性");
      if (classifications.length === 0) missingProvided.push("分类编码");
      if (materials2.length === 0) missingProvided.push("材质关联");
      if (systems.length === 0) missingProvided.push("系统关联");
      if (!spatialMeta?.storey) missingProvided.push("楼层信息");
      if (!layerMap.has(expressID)) missingProvided.push("图层信息");
      const unparsedRelations = uniqueStrings(
        toExpressIds(entity?.HasAssociations).map((relId) => getLineCached(relId)?.is_a).filter(
          (relType) => !!relType && ![
            "IFCRELASSOCIATESMATERIAL",
            "IFCRELASSOCIATESCLASSIFICATION",
            "IFCRELASSIGNSTOGROUP"
          ].includes(relType)
        )
      );
      const currentUnparsed = uniqueStrings([
        ...unparsedRelations.map((type) => `关联:${type}`),
        ...entity?.Representation ? ["表现样式/纹理细节"] : [],
        ...entity?.ObjectPlacement ? ["放置与坐标系细节"] : []
      ]);
      addGroupEntry(normalizedGroups, "IFC 解析诊断", "属性集", psetIDs.length > 0 ? `已解析 ${psetIDs.length} 组` : "未发现");
      addGroupEntry(normalizedGroups, "IFC 解析诊断", "数量属性", quantityGroupCount > 0 ? `已解析 ${quantityGroupCount} 组` : "未发现");
      addGroupEntry(normalizedGroups, "IFC 解析诊断", "类型属性", typeId ? "已解析" : "未发现");
      addGroupEntry(normalizedGroups, "IFC 解析诊断", "分类编码", classifications.length > 0 ? `已解析 ${classifications.length} 条` : "未发现");
      addGroupEntry(normalizedGroups, "IFC 解析诊断", "材质关联", materials2.length > 0 ? `已解析 ${materials2.length} 条` : "未发现");
      addGroupEntry(normalizedGroups, "IFC 解析诊断", "系统关联", systems.length > 0 ? `已解析 ${systems.length} 条` : "未发现");
      addGroupEntry(normalizedGroups, "IFC 解析诊断", "楼层识别", spatialMeta?.storey ? spatialMeta.storey : "未识别");
      addGroupEntry(normalizedGroups, "IFC 解析诊断", "图层", layerMap.has(expressID) ? "已解析" : "未发现");
      addGroupEntry(normalizedGroups, "IFC 解析诊断", "文件未提供", missingProvided.length > 0 ? missingProvided.join("、") : "未发现");
      addGroupEntry(normalizedGroups, "IFC 解析诊断", "当前未解析", currentUnparsed.length > 0 ? currentUnparsed.join("、") : "未发现");
      addGroupEntry(rawGroups, "IFC Diagnostics", "PropertySets", psetIDs.length);
      addGroupEntry(rawGroups, "IFC Diagnostics", "QuantityGroups", quantityGroupCount);
      addGroupEntry(rawGroups, "IFC Diagnostics", "TypeProperties", typeId ? "yes" : "no");
      addGroupEntry(rawGroups, "IFC Diagnostics", "Classification", classifications.length);
      addGroupEntry(rawGroups, "IFC Diagnostics", "Material", materials2.length);
      addGroupEntry(rawGroups, "IFC Diagnostics", "System", systems.length);
      addGroupEntry(rawGroups, "IFC Diagnostics", "Storey", spatialMeta?.storey || "");
      addGroupEntry(rawGroups, "IFC Diagnostics", "Layer", layerMap.get(expressID) || "");
      addGroupEntry(rawGroups, "IFC Diagnostics", "MissingInFile", missingProvided.join(", "));
      addGroupEntry(rawGroups, "IFC Diagnostics", "CurrentlyUnparsed", currentUnparsed.join(", "));
      return {
        groups: rawGroups,
        normalizedGroups,
        rawGroups,
        filterMeta: {
          category: entity?.is_a || "",
          typeName,
          storey: spatialMeta?.storey || "",
          elevation: spatialMeta?.elevation,
          spatialPath: spatialMeta?.path || [],
          systems,
          materials: materials2,
          classifications
        }
      };
    },
    getExpressId: (geo, _faceIndex) => {
      return geo.userData?.expressID;
    }
  };
  onProgress(50, t("building_geometry"));
  let meshCount = 0;
  let expectedTotal = 0;
  const materials = {};
  const getMaterial = (color, opacity = 1) => {
    const key = `${color}-${opacity}`;
    if (!materials[key]) {
      materials[key] = new THREE.MeshStandardMaterial({
        color,
        transparent: opacity < 1,
        opacity,
        side: THREE.DoubleSide
      });
    }
    return materials[key];
  };
  const dummyMatrix = new THREE.Matrix4();
  ifcApi.StreamAllMeshes(modelID, (flatMesh) => {
    const size = flatMesh.geometries.size();
    expectedTotal += size;
    for (let i = 0; i < size; i++) {
      const placedGeom = flatMesh.geometries.get(i);
      const expressID = flatMesh.expressID;
      const geomID = placedGeom.geometryExpressID;
      const meshData = ifcApi.GetGeometry(modelID, geomID);
      const verts = ifcApi.GetVertexArray(meshData.GetVertexData(), meshData.GetVertexDataSize());
      const indices = ifcApi.GetIndexArray(meshData.GetIndexData(), meshData.GetIndexDataSize());
      const geometry = new THREE.BufferGeometry();
      const posFloats = new Float32Array(verts.length / 2);
      const normFloats = new Float32Array(verts.length / 2);
      for (let k = 0; k < verts.length; k += 6) {
        posFloats[k / 2] = verts[k];
        posFloats[k / 2 + 1] = verts[k + 1];
        posFloats[k / 2 + 2] = verts[k + 2];
        normFloats[k / 2] = verts[k + 3];
        normFloats[k / 2 + 1] = verts[k + 4];
        normFloats[k / 2 + 2] = verts[k + 5];
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(posFloats, 3));
      geometry.setAttribute("normal", new THREE.BufferAttribute(normFloats, 3));
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      geometry.userData = { expressID, bimId: String(expressID) };
      const transform = placedGeom.flatTransformation;
      dummyMatrix.fromArray(transform);
      const color = placedGeom.color;
      let material;
      if (color) {
        const hex = new THREE.Color(color.x, color.y, color.z).getHex();
        material = getMaterial(hex, color.w);
      } else {
        material = getMaterial(13421772);
      }
      const mesh = new THREE.Mesh(geometry, material);
      mesh.matrixAutoUpdate = false;
      mesh.matrix.fromArray(transform);
      mesh.matrixWorldNeedsUpdate = true;
      mesh.userData.expressID = expressID;
      mesh.userData.bimId = String(expressID);
      if (!meshesByExpressId.has(expressID)) meshesByExpressId.set(expressID, []);
      meshesByExpressId.get(expressID).push(mesh);
      if (layerMap.has(expressID)) {
        mesh.userData.layer = layerMap.get(expressID);
      }
      const entity = getLineCached(expressID);
      try {
        const ifcType = sanitizeIfcLabel(entity?.is_a) || "Item";
        const ifcName = sanitizeIfcLabel(entity?.Name?.value, entity?.LongName?.value, entity?.Description?.value);
        mesh.name = ifcName ? `${ifcType}: ${ifcName}` : `${ifcType} [${expressID}]`;
      } catch (e) {
        mesh.name = `IFC Item ${expressID}`;
      }
      const spatialMeta = spatialMetaMap.get(expressID);
      const typeId = typeAssignmentMap.get(expressID);
      const typeEntity = typeId ? getLineCached(typeId) : null;
      const classifications = uniqueStrings([
        ...classificationMap.get(expressID) || [],
        ...typeId ? classificationMap.get(typeId) || [] : []
      ]);
      const materialsForMesh = uniqueStrings([
        ...materialMap.get(expressID) || [],
        ...typeId ? materialMap.get(typeId) || [] : []
      ]);
      const systemsForMesh = uniqueStrings([
        ...systemMap.get(expressID) || [],
        ...typeId ? systemMap.get(typeId) || [] : []
      ]);
      mesh.userData.ifcMetadata = {
        category: entity?.is_a || "",
        storey: spatialMeta?.storey || "",
        elevation: spatialMeta?.elevation,
        spatialPath: spatialMeta?.path || [],
        systems: systemsForMesh,
        materials: materialsForMesh,
        classifications,
        typeName: typeEntity?.Name?.value || "",
        globalId: entity.GlobalId?.value || "",
        typeEntity: typeEntity?.is_a || "",
        render: color ? {
          color: `#${new THREE.Color(color.x, color.y, color.z).getHexString().toUpperCase()}`,
          opacity: Number(color.w ?? 1)
        } : void 0
      };
      mesh.userData.ifcSpatial = spatialMeta;
      const parentGroup = nodesMap.get(expressID) || rootGroup;
      parentGroup.add(mesh);
      meshCount++;
      if (expectedTotal > 0) {
        const ratio = Math.min(1, meshCount / expectedTotal);
        const p = 50 + Math.floor(ratio * 45);
        onProgress(p, t("building_geometry"));
      }
    }
  });
  console.log(`Loaded ${meshCount} meshes from IFC.`);
  onProgress(100, t("success"));
  rootGroup.rotateX(Math.PI / 2);
  return rootGroup;
};

export { loadIFC };
