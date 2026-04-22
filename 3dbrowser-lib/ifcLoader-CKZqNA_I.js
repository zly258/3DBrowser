import * as l from "three";
let oe = null, Re = "";
const ge = /* @__PURE__ */ new Map();
function He(m) {
  return `${typeof window < "u" ? new URL(m.endsWith("/") ? m : `${m}/`, window.location.href).toString() : m.endsWith("/") ? m : `${m}/`}web-ifc/`;
}
async function Ye(m) {
  const E = He(m);
  return oe && Re === E || (Re = E, oe = (async () => {
    const A = await import("web-ifc"), G = new A.IfcAPI();
    return G.SetWasmPath(E), await G.Init(), ge.clear(), { ifcApi: G, WebIFC: A, wasmPath: E };
  })()), oe;
}
function H(m, E) {
  const A = ge.get(E);
  if (A !== void 0) return A;
  const G = m.GetTypeCodeFromName(E);
  return ge.set(E, G), G;
}
function D(m) {
  if (typeof m == "number" && Number.isFinite(m)) return m;
  if (m && typeof m == "object" && typeof m.value == "number") return m.value;
}
function P(m) {
  if (!m) return [];
  if (Array.isArray(m))
    return m.map(D).filter((A) => typeof A == "number");
  if (typeof m.size == "function" && typeof m.get == "function") {
    const A = [];
    for (let G = 0; G < m.size(); G++) {
      const Q = D(m.get(G));
      typeof Q == "number" && A.push(Q);
    }
    return A;
  }
  const E = D(m);
  return typeof E == "number" ? [E] : [];
}
function v(m) {
  return Array.from(
    new Set(
      m.map((E) => typeof E == "string" ? E.trim() : "").filter(Boolean)
    )
  );
}
function R(...m) {
  const E = /* @__PURE__ */ new Set(["", "n/a", "na", "undefined", "null", "-", "--"]);
  for (const A of m) {
    if (A == null) continue;
    const G = String(A).trim();
    if (!E.has(G.toLowerCase()))
      return G;
  }
  return "";
}
const Je = async (m, E, A, G = "./libs", Q) => {
  const { ifcApi: M, WebIFC: K } = await Ye(G);
  let X;
  if (typeof m != "string")
    m instanceof ArrayBuffer ? X = m : (E(5, `${A("reading")}...`), X = await m.arrayBuffer(), E(25, `${A("reading")}...`));
  else {
    const n = new l.FileLoader();
    n.setResponseType("arraybuffer");
    let r = 0;
    X = await new Promise((s, t) => {
      n.load(
        m,
        (e) => s(e),
        (e) => {
          if (e.total > 0) {
            const i = e.loaded / e.total * 100;
            E(i, `${A("reading")}...`);
          } else
            r = r + 5, E(Math.min(35, r), `${A("reading")}...`);
        },
        t
      );
    });
  }
  const Le = new Uint8Array(X);
  E(30, A("analyzing"));
  const x = M.OpenModel(Le, {
    COORDINATE_TO_ORIGIN: !0,
    CIRCLE_SEGMENTS: 12,
    MEMORY_LIMIT: 1073741824
    // 1GB（内存限制）
  }), T = new l.Group();
  T.name = "IFC模型";
  const k = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), C = (n) => {
    if (ue.has(n)) return ue.get(n);
    const r = M.GetLine(x, n);
    return ue.set(n, r), r;
  }, Ce = () => {
    try {
      const n = H(M, "IFCRELDEFINESBYPROPERTIES"), r = M.GetLineIDsWithType(x, n), s = r.size();
      for (let t = 0; t < s; t++) {
        const e = r.get(t), i = C(e);
        if (i?.RelatedObjects && Array.isArray(i.RelatedObjects)) {
          const o = i.RelatingPropertyDefinition?.value;
          o && i.RelatedObjects.forEach((a) => {
            const c = a.value;
            k.has(c) || k.set(c, []), k.get(c).push(o);
          });
        }
      }
    } catch (n) {
      console.warn("无法构建属性映射表", n);
    }
  }, Fe = () => {
    try {
      const n = H(M, "IFCRELDEFINESBYTYPE"), r = M.GetLineIDsWithType(x, n);
      for (let s = 0; s < r.size(); s++) {
        const t = C(r.get(s)), e = D(t?.RelatingType);
        if (!e) continue;
        P(t?.RelatedObjects).forEach((o) => {
          ce.set(o, e);
        });
        const i = C(e);
        P(i?.HasPropertySets).forEach((o) => {
          ee.has(e) || ee.set(e, []), ee.get(e).push(o);
        });
      }
    } catch (n) {
      console.warn("无法构建类型属性映射表", n);
    }
  }, Se = () => {
    try {
      const n = H(M, "IFCPRESENTATIONLAYERASSIGNMENT"), r = M.GetLineIDsWithType(x, n);
      for (let s = 0; s < r.size(); s++) {
        const t = r.get(s), e = C(t), i = e?.Name?.value || `Layer_${t}`;
        e?.AssignedItems && Array.isArray(e.AssignedItems) && e.AssignedItems.forEach((o) => {
          const a = o.value;
          V.set(a, i);
        });
      }
    } catch (n) {
      console.warn("无法构建图层映射表", n);
    }
  }, Oe = (n) => {
    if (!n) return null;
    const r = typeof n == "number" ? C(n) : n;
    if (!r) return null;
    const s = R(r.Identification?.value, r.ItemReference?.value, r.Reference?.value) || "", t = R(r.Name?.value, r.Description?.value, r.Source?.value) || "", e = v([s, t]);
    return e.length > 0 ? e.join(" - ") : R(r.is_a) || null;
  }, Ee = () => {
    try {
      const n = H(M, "IFCRELASSOCIATESCLASSIFICATION"), r = M.GetLineIDsWithType(x, n);
      for (let s = 0; s < r.size(); s++) {
        const t = C(r.get(s)), e = D(t?.RelatingClassification), i = e ? C(e) : t?.RelatingClassification, o = Oe(i);
        o && P(t?.RelatedObjects).forEach((a) => {
          z.has(a) || z.set(a, []), z.get(a).push(o);
        });
      }
    } catch (n) {
      console.warn("无法构建分类映射表", n);
    }
  }, pe = (n, r = /* @__PURE__ */ new Set()) => {
    if (!n) return [];
    const s = D(n), t = typeof n == "number" || n?.value !== void 0 ? C(s) : n;
    if (s && r.has(s)) return [];
    if (s && r.add(s), !t) return [];
    const e = v([
      R(t.Name?.value),
      R(t.LayerSetName?.value),
      R(t.Category?.value)
    ]), o = ["Materials", "MaterialLayers", "MaterialProfiles", "MaterialConstituents"].flatMap(
      (c) => P(t[c]).flatMap((f) => pe(f, r))
    ), a = [t.ForLayerSet, t.ForProfileSet, t.Material].map(D).filter((c) => typeof c == "number").flatMap((c) => pe(c, r));
    return v([...e, ...o, ...a]);
  }, Me = () => {
    try {
      const n = H(M, "IFCRELASSOCIATESMATERIAL"), r = M.GetLineIDsWithType(x, n);
      for (let s = 0; s < r.size(); s++) {
        const t = C(r.get(s)), e = pe(t?.RelatingMaterial);
        e.length !== 0 && P(t?.RelatedObjects).forEach((i) => {
          j.has(i) || j.set(i, []), j.get(i).push(...e);
        });
      }
    } catch (n) {
      console.warn("无法构建材质映射表", n);
    }
  }, we = () => {
    try {
      const n = H(M, "IFCRELASSIGNSTOGROUP"), r = M.GetLineIDsWithType(x, n);
      for (let s = 0; s < r.size(); s++) {
        const t = C(r.get(s)), e = D(t?.RelatingGroup);
        if (!e) continue;
        const i = C(e);
        if (!i || i.is_a !== "IFCSYSTEM" && i.is_a !== "IFCDISTRIBUTIONSYSTEM") continue;
        const o = R(i.Name?.value, i.LongName?.value) || `${i.is_a} [${e}]`;
        P(t?.RelatedObjects).forEach((a) => {
          U.has(a) || U.set(a, []), U.get(a).push(o);
        });
      }
    } catch (n) {
      console.warn("无法构建系统映射表", n);
    }
  };
  T.userData.isIFC = !0, T.userData.ifcAPI = M, T.userData.modelID = x, T.userData.layerMap = V, T.userData.ifcGridDiagnostics = [];
  const Ae = (n, r, s, t = 36) => {
    const e = document.createElement("canvas"), i = e.getContext("2d");
    if (!i) return new l.Sprite();
    const o = 'bold 26px "Microsoft YaHei", Arial, sans-serif';
    i.font = o;
    const a = 14, c = Math.ceil(i.measureText(n).width);
    e.width = c + a * 2, e.height = 44, i.font = o, i.fillStyle = "rgba(255,255,255,0.92)", i.fillRect(0, 0, e.width, e.height), i.strokeStyle = s, i.lineWidth = 2, i.strokeRect(1, 1, e.width - 2, e.height - 2), i.fillStyle = "#111827", i.textAlign = "center", i.textBaseline = "middle", i.fillText(n, e.width / 2, e.height / 2);
    const f = new l.CanvasTexture(e);
    f.minFilter = l.LinearFilter, f.magFilter = l.LinearFilter;
    const u = new l.Sprite(new l.SpriteMaterial({
      map: f,
      transparent: !0,
      depthTest: !1,
      depthWrite: !1
    }));
    u.position.copy(r);
    const d = l.MathUtils.clamp(t, 6, 320);
    return u.scale.set(d * (e.width / e.height), d, 1), u.renderOrder = 1002, u.userData.isIfcGridHelper = !0, u;
  }, B = (n) => {
    const r = D(n), t = (r ? C(r) : n)?.Coordinates;
    if (!t) return null;
    const e = Array.isArray(t) ? t.map((i) => i?.value ?? i) : [];
    return new l.Vector3(
      Number(e[0] || 0),
      Number(e[1] || 0),
      Number(e[2] || 0)
    );
  }, O = (n) => {
    if (n == null) return null;
    if (typeof n == "number") return Number.isFinite(n) ? n : null;
    if (typeof n == "string") {
      const r = Number(n);
      return Number.isFinite(r) ? r : null;
    }
    if (typeof n == "object") {
      if (typeof n.value == "number") return Number.isFinite(n.value) ? n.value : null;
      if (typeof n.wrappedValue == "number") return Number.isFinite(n.wrappedValue) ? n.wrappedValue : null;
    }
    return null;
  }, $e = (n, r, s = !0) => {
    const t = [], e = Math.max(2, r), i = s ? e - 1 : e;
    for (let o = 0; o < e; o++) {
      const a = i === 0 ? 0 : o / i;
      t.push(n(Math.min(1, Math.max(0, a))));
    }
    return t;
  }, fe = /* @__PURE__ */ new Map(), te = (n, r) => {
    const s = D(n);
    if (!s) return r.clone();
    const e = C(s)?.DirectionRatios;
    if (!Array.isArray(e)) return r.clone();
    const i = new l.Vector3(
      Number(e[0]?.value ?? e[0] ?? r.x),
      Number(e[1]?.value ?? e[1] ?? r.y),
      Number(e[2]?.value ?? e[2] ?? r.z)
    );
    return i.lengthSq() > 0 ? i.normalize() : r.clone();
  }, ne = (n) => {
    const r = D(n), s = r ? C(r) : n;
    if (!s) return new l.Matrix4();
    const t = B(s.Location) || new l.Vector3(), e = te(s.Axis, new l.Vector3(0, 0, 1));
    let i = te(s.RefDirection, new l.Vector3(1, 0, 0)), o = new l.Vector3().crossVectors(e, i).normalize();
    return o.lengthSq() === 0 && (i = new l.Vector3(1, 0, 0), o = new l.Vector3(0, 1, 0)), i = new l.Vector3().crossVectors(o, e).normalize(), new l.Matrix4().makeBasis(i, o, e).setPosition(t);
  }, Te = (n) => {
    const r = D(n);
    if (!r) return new l.Matrix4();
    if (fe.has(r))
      return fe.get(r).clone();
    const s = C(r);
    let t = new l.Matrix4();
    if (s?.is_a === "IFCLOCALPLACEMENT") {
      const e = ne(s.RelativePlacement), i = D(s.PlacementRelTo);
      t = i ? Te(i).multiply(e) : e;
    } else (s?.is_a === "IFCAXIS2PLACEMENT3D" || s?.is_a === "IFCAXIS2PLACEMENT2D") && (t = ne(s));
    return fe.set(r, t.clone()), t;
  }, Ve = (n, r, s, t) => {
    const e = r.clone().invert(), i = n.clone().applyMatrix4(e);
    return Math.atan2(i.y / Math.max(t, 1e-6), i.x / Math.max(s, 1e-6));
  }, _e = (n, r) => {
    let s = r;
    for (; s <= n; )
      s += Math.PI * 2;
    return { startAngle: n, endAngle: s };
  }, de = (n, r, s, t = 0, e = Math.PI * 2) => {
    const i = ne(n), { startAngle: o, endAngle: a } = _e(t, e), c = Math.abs(a - o), f = Math.max(12, Math.ceil(c / (Math.PI * 2) * 48));
    return $e((u) => {
      const d = o + (a - o) * u;
      return new l.Vector3(
        Math.cos(d) * r,
        Math.sin(d) * s,
        0
      ).applyMatrix4(i);
    }, f, !0);
  }, De = (n, r, s, t) => {
    const e = Array.isArray(n.Trim1) ? n.Trim1 : [n.Trim1], i = Array.isArray(n.Trim2) ? n.Trim2 : [n.Trim2], o = ne(r.Position), a = (u) => {
      const d = B(u);
      return d ? Ve(d, o, s, t) : O(u);
    }, c = e.map(a).find((u) => u !== null), f = i.map(a).find((u) => u !== null);
    return c === void 0 || f === void 0 ? null : de(r.Position, s, t, c, f);
  }, ze = (n, r, s = new l.Vector3(0, 0, 1)) => {
    if (n.length < 2 || Math.abs(r) < 1e-6) return n;
    const t = [];
    for (let e = 0; e < n.length; e++) {
      const i = n[Math.max(0, e - 1)], a = n[Math.min(n.length - 1, e + 1)].clone().sub(i);
      if (a.lengthSq() < 1e-8) {
        t.push(n[e].clone());
        continue;
      }
      const c = new l.Vector3().crossVectors(s, a.normalize()).normalize();
      t.push(n[e].clone().addScaledVector(c, r));
    }
    return t;
  }, W = (n, r = /* @__PURE__ */ new Set()) => {
    const s = D(n), t = s ? C(s) : n;
    if (!t) return [];
    if (s && r.has(s)) return [];
    if (s && r.add(s), t.is_a === "IFCPOLYLINE")
      return P(t.Points).map((e) => B(e)).filter((e) => !!e);
    if (t.is_a === "IFCINDEXEDPOLYCURVE")
      return (C(D(t.Points) || 0)?.CoordList || []).map((o) => {
        const a = Array.isArray(o) ? o.map((c) => c?.value ?? c) : [];
        return new l.Vector3(Number(a[0] || 0), Number(a[1] || 0), Number(a[2] || 0));
      });
    if (t.is_a === "IFCCOMPOSITECURVE")
      return P(t.Segments).flatMap((e) => {
        const i = C(e), o = W(i?.ParentCurve, r);
        return i?.SameSense === !1 ? o.reverse() : o;
      });
    if (t.is_a === "IFCCURVESEGMENT") {
      const e = t.ParentCurve || t.BasisCurve || t.BaseCurve, i = W(e, r);
      return t.SameSense === !1 ? i.reverse() : i;
    }
    if (t.is_a === "IFCPCURVE")
      return W(t.ReferenceCurve || t.BasisCurve || t.OuterBoundary, r);
    if (t.is_a === "IFCOFFSETCURVE2D" || t.is_a === "IFCOFFSETCURVE3D") {
      const e = t.BasisCurve || t.ParentCurve || t.ReferenceCurve, i = W(e, r);
      if (i.length < 2) return i;
      const o = O(t.Distance || t.OffsetDistance) ?? 0, a = t.is_a === "IFCOFFSETCURVE3D" ? te(t.RefDirection, new l.Vector3(0, 0, 1)) : new l.Vector3(0, 0, 1);
      return ze(i, o, a);
    }
    if (t.is_a === "IFCBSPLINECURVE" || t.is_a === "IFCBSPLINECURVEWITHKNOTS") {
      const e = (t.ControlPointsList || t.ControlPoints || []).map((i) => B(i)).filter((i) => !!i);
      if (e.length >= 2)
        return new l.CatmullRomCurve3(e).getPoints(Math.max(16, e.length * 6));
    }
    if (t.is_a === "IFCCIRCLE") {
      const e = O(t.Radius) ?? 1;
      return de(t.Position, e, e);
    }
    if (t.is_a === "IFCELLIPSE") {
      const e = O(t.SemiAxis1) ?? 1, i = O(t.SemiAxis2) ?? e;
      return de(t.Position, e, i);
    }
    if (t.is_a === "IFCTRIMMEDCURVE") {
      const e = D(t.BasisCurve) ? C(D(t.BasisCurve)) : t.BasisCurve;
      if (e?.is_a === "IFCCIRCLE") {
        const a = O(e.Radius) ?? 1, c = De(t, e, a, a);
        if (c && c.length > 1) return c;
      }
      if (e?.is_a === "IFCELLIPSE") {
        const a = O(e.SemiAxis1) ?? 1, c = O(e.SemiAxis2) ?? a, f = De(t, e, a, c);
        if (f && f.length > 1) return f;
      }
      const i = P(t.Trim1).map((a) => B(a)).filter((a) => !!a), o = P(t.Trim2).map((a) => B(a)).filter((a) => !!a);
      return i.length > 0 && o.length > 0 ? [i[0], o[0]] : W(t.BasisCurve, r);
    }
    if (t.is_a === "IFCLINE") {
      const e = B(t.Pnt) || new l.Vector3(), i = te(t.Dir?.Orientation, new l.Vector3(1, 0, 0)), a = 1e3 * (Number(t.Dir?.Magnitude?.value ?? t.Dir?.Magnitude ?? 1) || 1);
      return [
        e.clone().addScaledVector(i, -a),
        e.clone().addScaledVector(i, a)
      ];
    }
    return t.is_a === "IFCGRIDAXIS" ? W(t.AxisCurve, r) : (T.userData.ifcGridDiagnostics.push(t.is_a || `UnknownCurve:${s ?? "?"}`), []);
  }, J = /* @__PURE__ */ new Map();
  J.set(0, T);
  const Z = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), je = () => {
    const n = M.GetLineIDsWithType(x, K.IFCRELAGGREGATES);
    for (let s = 0; s < n.size(); s++) {
      const t = C(n.get(s)), e = t.RelatingObject.value, i = t.RelatedObjects.map((o) => o.value);
      se.has(e) || se.set(e, []), se.get(e).push(...i);
    }
    const r = M.GetLineIDsWithType(x, K.IFCRELCONTAINEDINSPATIALSTRUCTURE);
    for (let s = 0; s < r.size(); s++) {
      const t = C(r.get(s)), e = t.RelatingStructure.value, i = t.RelatedElements.map((o) => o.value);
      re.has(e) || re.set(e, []), re.get(e).push(...i);
    }
  }, be = /* @__PURE__ */ new Set(), ie = (n, r, s) => {
    const t = C(n);
    if (!t || be.has(n)) return;
    be.add(n);
    let e = r, i = s;
    const o = [
      "IFCPROJECT",
      "IFCSITE",
      "IFCBUILDING",
      "IFCBUILDINGSTOREY",
      "IFCSPACE",
      "IFCZONE"
    ], a = t.is_a || (t.type ? M.GetNameFromTypeCode(t.type) : "Item"), c = o.includes(a), f = R(t.Name?.value, t.LongName?.value, t.Description?.value) || `${a} [${n}]`, u = a === "IFCBUILDINGSTOREY" ? O(t.Elevation) : s.elevation, d = new l.Group();
    d.name = f, i = {
      storey: a === "IFCBUILDINGSTOREY" ? f : s.storey,
      elevation: u ?? void 0,
      path: c ? [...s.path, f] : s.path,
      container: a
    }, d.userData = {
      expressID: n,
      isSpatial: c,
      isIfcEntity: !0,
      type: t.is_a,
      ifcSpatial: i,
      ifcMetadata: {
        category: t.is_a,
        storey: i.storey,
        elevation: i.elevation,
        spatialPath: i.path,
        systems: [],
        materials: [],
        classifications: [],
        typeName: "",
        globalId: t.GlobalId?.value || ""
      }
    }, r.add(d), e = d, J.set(n, d), le.set(n, i);
    const F = se.get(n);
    if (F)
      for (const y of F)
        ie(y, e, i);
    const h = re.get(n);
    if (h)
      for (const y of h)
        ie(y, e, i);
  };
  (() => {
    try {
      je();
      const n = M.GetLineIDsWithType(x, K.IFCPROJECT);
      if (n.size() > 0)
        for (let r = 0; r < n.size(); r++)
          ie(n.get(r), T, {
            storey: "",
            elevation: void 0,
            path: [],
            container: "IFCPROJECT"
          });
      else {
        const r = M.GetLineIDsWithType(x, K.IFCSITE);
        for (let s = 0; s < r.size(); s++)
          ie(r.get(s), T, {
            storey: "",
            elevation: void 0,
            path: [],
            container: "IFCSITE"
          });
      }
    } catch (n) {
      console.error("解析 IFC 完整空间结构失败:", n);
    }
  })();
  const Ne = (n) => {
    if (n.isMesh || !n.userData?.isSpatial) return !0;
    const r = [];
    return n.children.forEach((s) => {
      Ne(s) || r.push(s);
    }), r.forEach((s) => {
      n.remove(s), J.delete(s.userData?.expressID);
    }), n.children.length > 0;
  }, Ge = [];
  T.children.forEach((n) => {
    Ne(n) || Ge.push(n);
  }), Ge.forEach((n) => {
    T.remove(n), J.delete(n.userData?.expressID);
  }), (() => {
    try {
      const n = H(M, "IFCGRID"), r = M.GetLineIDsWithType(x, n);
      if (!r || r.size() === 0) return;
      const s = new l.Group();
      s.name = "__IFCGridHelper", s.visible = !0, s.userData.isIfcGridHelper = !0;
      const t = [
        { key: "UAxes", color: "#d97706" },
        { key: "VAxes", color: "#2563eb" },
        { key: "WAxes", color: "#059669" }
      ], e = (i, o) => {
        const a = new l.Group();
        a.userData.isIfcGridHelper = !0;
        const f = new l.Box3().setFromPoints(i).getSize(new l.Vector3()), u = Math.max(f.x, f.y, f.z, 1), d = l.MathUtils.clamp(u * 2e-3, 0.6, 28), F = new l.MeshBasicMaterial({
          color: o,
          transparent: !0,
          opacity: 0.92,
          depthTest: !1,
          depthWrite: !1
        });
        for (let h = 0; h < i.length - 1; h++) {
          const y = i[h], I = i[h + 1], S = new l.Vector3().subVectors(I, y), b = S.length();
          if (b <= 1e-4) continue;
          const g = new l.Mesh(
            new l.CylinderGeometry(d, d, b, 10),
            F
          );
          g.position.copy(y).add(I).multiplyScalar(0.5), g.quaternion.setFromUnitVectors(
            new l.Vector3(0, 1, 0),
            S.normalize()
          ), g.renderOrder = 1e3, g.userData.isIfcGridHelper = !0, a.add(g);
        }
        return i.forEach((h) => {
          const y = new l.Mesh(
            new l.SphereGeometry(d * 1.15, 10, 10),
            F
          );
          y.position.copy(h), y.renderOrder = 1001, y.userData.isIfcGridHelper = !0, a.add(y);
        }), a;
      };
      for (let i = 0; i < r.size(); i++) {
        const o = C(r.get(i));
        o && t.forEach(({ key: a, color: c }) => {
          P(o[a]).forEach((f) => {
            const u = C(f), d = Te(o?.ObjectPlacement), F = W(u?.AxisCurve).map(($) => $.clone().applyMatrix4(d));
            if (F.length < 2) return;
            s.add(e(F, c));
            const h = R(u?.AxisTag?.value, u?.Name?.value) || `${a}-${f}`, y = F[0], I = F[F.length - 1], S = y.distanceTo(I), b = l.MathUtils.clamp(S * 0.035, 10, 220), g = l.MathUtils.clamp(S * 2e-3, 0.6, 28), p = Math.max(g * 3.2, b * 0.12), N = new l.Vector3(p, p, g * 0.6);
            s.add(Ae(h, y.clone().add(N), c, b)), y.distanceTo(I) > 1 && s.add(Ae(h, I.clone().add(N), c, b));
          });
        });
      }
      s.children.length > 0 && (T.add(s), T.userData.ifcGridHelper = s);
    } catch (n) {
      console.warn("构建 IFC 轴网失败", n);
    }
  })();
  const Ue = (typeof Q?.deferIfcProperties == "boolean" ? !!Q.deferIfcProperties : void 0) ?? X.byteLength > 20 * 1024 * 1024, xe = () => {
    for (const [n, r] of Z.entries()) {
      const s = V.get(n);
      if (s)
        for (const t of r)
          t.userData.layer = s;
    }
  };
  Ue ? (E(42, `${A("analyzing")}...`), setTimeout(() => {
    Se(), Ce(), Fe(), Ee(), Me(), we(), xe();
  }, 0)) : (Se(), Ce(), Fe(), Ee(), Me(), we(), xe());
  const _ = (n) => {
    let r = n.replace(/^(is|has|are)_/i, "");
    return ((t) => t.replace(/([A-Z])/g, " $1").replace(/^ /, ""))(r);
  }, Be = (n) => n, Y = (n) => {
    if (n == null || n === "") return "";
    if (typeof n == "object" && n !== null) {
      if (n.value !== void 0)
        return Y(n.value);
      if (Array.isArray(n))
        return n.map((r) => Y(r)).filter((r) => r != null && r !== "").join(", ");
      if (Object.keys(n).length <= 3)
        return Object.entries(n).map(([r, s]) => `${r}: ${Y(s)}`).join(", ");
      try {
        return JSON.stringify(n, null, 2);
      } catch {
        return String(n);
      }
    }
    if (typeof n == "boolean")
      return n ? "是" : "否";
    if (typeof n == "number")
      return Number.isInteger(n) ? n.toString() : parseFloat(n.toFixed(3)).toString();
    if (typeof n == "string") {
      const r = n.trim();
      return ["", "n/a", "na", "undefined", "null", "-", "--"].includes(r.toLowerCase()) ? "" : (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(r), r);
    }
    return String(n);
  }, me = (n, r = "", s = _) => {
    const t = {};
    return Object.keys(n).forEach((e) => {
      if (["expressID", "is_a", "type", "ID", "Name", "GlobalId"].includes(e)) return;
      const i = n[e], o = s(e), a = r ? `${r}.` : "";
      if (typeof i == "object" && i !== null && !Array.isArray(i)) {
        const c = me(i, a + o, s);
        Object.assign(t, c);
      } else {
        const c = a + o;
        t[c] = Y(i);
      }
    }), t;
  }, Pe = (n, r = "") => {
    const s = {}, t = {};
    let e = 0;
    const i = (a, c) => (a[c] || (a[c] = []), a[c]), o = (a, c, f, u, d) => {
      const F = Y(u);
      F === "" || F === null || F === void 0 || i(a, c).push({
        key: f,
        rawKey: d,
        value: F,
        id: `${c}::${f}::${i(a, c).length}`
      });
    };
    for (const a of n)
      try {
        const c = C(a);
        if (!c) continue;
        const f = c.Name?.value || `属性集_${a}`, u = _(f), d = `${r}${f}`;
        if (c.HasProperties) {
          o(s, u, "类型", c.is_a, "is_a"), o(t, d, "is_a", c.is_a), o(s, u, "描述", c.Description?.value, "Description"), o(t, d, "Description", c.Description?.value);
          for (const F of c.HasProperties) {
            const h = F.value, y = C(h);
            if (!y || !y.Name) continue;
            const I = y.Name.value;
            if (y.NominalValue) {
              o(s, u, _(I), y.NominalValue.value, I), o(t, d, I, y.NominalValue.value);
              continue;
            }
            const S = me(y, "", _), b = me(y, "", Be);
            Object.entries(S).forEach(([g, p]) => {
              o(s, u, `${_(I)}.${g}`, p, `${I}.${g}`);
            }), Object.entries(b).forEach(([g, p]) => {
              o(t, d, `${I}.${g}`, p);
            });
          }
        }
        if (c.Quantities) {
          e += 1;
          const F = `${u}.数量`, h = `${d}.Quantities`;
          c.Quantities.forEach((y) => {
            const I = D(y) ? C(y.value) : y;
            if (!I?.Name?.value) return;
            const S = I.Name.value;
            [
              "LengthValue",
              "AreaValue",
              "VolumeValue",
              "CountValue",
              "WeightValue",
              "TimeValue"
            ].forEach((g) => {
              I[g]?.value !== void 0 && (o(s, F, `${_(S)}.${_(g)}`, I[g].value, `${S}.${g}`), o(t, h, `${S}.${g}`, I[g].value));
            });
          });
        }
      } catch (c) {
        console.warn(`解析属性集${a}失败`, c);
      }
    return {
      normalizedGroups: s,
      rawGroups: t,
      quantityGroupCount: e
    };
  };
  T.userData.ifcManager = {
    getItemProperties: async (n, r) => {
      const s = {}, t = {}, e = (p, N, $, L, q) => {
        L === "" || L === null || L === void 0 || (p[N] || (p[N] = []), p[N].push({
          key: $,
          rawKey: q,
          value: String(L),
          id: `${N}::${$}::${p[N].length}`
        }));
      };
      let i = null;
      try {
        i = C(r), i && (e(s, "IFC 标识", "ExpressID", r, "expressID"), e(s, "IFC 标识", "类型", i.is_a || "Unknown", "is_a"), e(s, "IFC 标识", "全局ID", i.GlobalId?.value || "", "GlobalId"), e(s, "IFC 标识", "名称", i.Name?.value || "", "Name"), e(s, "IFC 标识", "描述", i.Description?.value || "", "Description"), e(s, "IFC 标识", "标签", i.Tag?.value || "", "Tag"), e(t, "IFC Entity", "expressID", r), e(t, "IFC Entity", "is_a", i.is_a || "Unknown"), e(t, "IFC Entity", "GlobalId", i.GlobalId?.value || ""), e(t, "IFC Entity", "Name", i.Name?.value || ""), e(t, "IFC Entity", "Description", i.Description?.value || ""), e(t, "IFC Entity", "Tag", i.Tag?.value || ""), Object.keys(i).forEach((p) => {
          if (["expressID", "is_a", "type", "ID", "GlobalId", "Name", "Description", "Tag"].includes(p)) return;
          const N = Y(i[p]);
          e(s, "IFC 标识", _(p), N, p), e(t, "IFC Entity", p, N);
        }));
      } catch (p) {
        console.warn("获取实体属性失败", p);
      }
      const o = k.get(r) || [];
      let a = 0;
      if (o.length > 0) {
        const p = Pe(o);
        Object.assign(s, p.normalizedGroups), Object.assign(t, p.rawGroups), a += p.quantityGroupCount;
      }
      const c = ce.get(r);
      let f = "";
      if (c) {
        const p = C(c);
        f = p?.Name?.value || "", e(s, "IFC 类型", "类型实体", p?.is_a || ""), e(s, "IFC 类型", "类型名称", f), e(s, "IFC 类型", "类型ID", c), e(t, "IFC Type", "is_a", p?.is_a || ""), e(t, "IFC Type", "Name", f), e(t, "IFC Type", "expressID", c);
        const N = ee.get(c) || [];
        if (N.length > 0) {
          const $ = Pe(N, "TYPE:");
          Object.entries($.normalizedGroups).forEach(([L, q]) => {
            s[`Type Properties · ${L}`] = q.map((w) => ({ ...w }));
          }), Object.entries($.rawGroups).forEach(([L, q]) => {
            t[`TYPE:${L}`] = q.map((w) => ({ ...w }));
          });
        }
      }
      const u = le.get(r), d = v([
        ...z.get(r) || [],
        ...c ? z.get(c) || [] : []
      ]), F = v([
        ...j.get(r) || [],
        ...c ? j.get(c) || [] : []
      ]), h = v([
        ...U.get(r) || [],
        ...c ? U.get(c) || [] : []
      ]);
      d.length > 0 && (e(s, "IFC 分类", "编码", d.join(", ")), e(t, "IFC Classification", "Items", d.join(", "))), F.length > 0 && (e(s, "IFC 材质", "材质名称", F.join(", ")), e(t, "IFC Material", "Names", F.join(", "))), h.length > 0 && (e(s, "IFC 系统", "系统名称", h.join(", ")), e(t, "IFC System", "Names", h.join(", "))), u && (e(s, "IFC 空间", "所在楼层", u.storey || ""), e(s, "IFC 空间", "楼层标高", u.elevation ?? ""), e(s, "IFC 空间", "空间路径", u.path.join(" / ")), e(s, "IFC 空间", "容器类型", u.container), e(t, "IFC Spatial", "Storey", u.storey || ""), e(t, "IFC Spatial", "Elevation", u.elevation ?? ""), e(t, "IFC Spatial", "Path", u.path.join(" / ")), e(t, "IFC Spatial", "Container", u.container));
      const I = (Z.get(r) || [])[0];
      if (I) {
        const p = Array.isArray(I.material) ? I.material[0] : I.material;
        p instanceof l.MeshStandardMaterial && (e(s, "IFC 渲染", "颜色", `#${p.color.getHexString().toUpperCase()}`), e(s, "IFC 渲染", "透明度", p.opacity.toFixed(2)), e(t, "IFC Render", "color", `#${p.color.getHexString().toUpperCase()}`), e(t, "IFC Render", "opacity", p.opacity.toFixed(2)));
      }
      const S = [];
      o.length === 0 && S.push("属性集"), c || S.push("类型属性"), d.length === 0 && S.push("分类编码"), F.length === 0 && S.push("材质关联"), h.length === 0 && S.push("系统关联"), u?.storey || S.push("楼层信息"), V.has(r) || S.push("图层信息");
      const b = v(
        P(i?.HasAssociations).map((p) => C(p)?.is_a).filter(
          (p) => !!p && ![
            "IFCRELASSOCIATESMATERIAL",
            "IFCRELASSOCIATESCLASSIFICATION",
            "IFCRELASSIGNSTOGROUP"
          ].includes(p)
        )
      ), g = v([
        ...b.map((p) => `关联:${p}`),
        ...i?.Representation ? ["表现样式/纹理细节"] : [],
        ...i?.ObjectPlacement ? ["放置与坐标系细节"] : []
      ]);
      return e(s, "IFC 解析诊断", "属性集", o.length > 0 ? `已解析 ${o.length} 组` : "未发现"), e(s, "IFC 解析诊断", "数量属性", a > 0 ? `已解析 ${a} 组` : "未发现"), e(s, "IFC 解析诊断", "类型属性", c ? "已解析" : "未发现"), e(s, "IFC 解析诊断", "分类编码", d.length > 0 ? `已解析 ${d.length} 条` : "未发现"), e(s, "IFC 解析诊断", "材质关联", F.length > 0 ? `已解析 ${F.length} 条` : "未发现"), e(s, "IFC 解析诊断", "系统关联", h.length > 0 ? `已解析 ${h.length} 条` : "未发现"), e(s, "IFC 解析诊断", "楼层识别", u?.storey ? u.storey : "未识别"), e(s, "IFC 解析诊断", "图层", V.has(r) ? "已解析" : "未发现"), e(s, "IFC 解析诊断", "文件未提供", S.length > 0 ? S.join("、") : "未发现"), e(s, "IFC 解析诊断", "当前未解析", g.length > 0 ? g.join("、") : "未发现"), e(t, "IFC Diagnostics", "PropertySets", o.length), e(t, "IFC Diagnostics", "QuantityGroups", a), e(t, "IFC Diagnostics", "TypeProperties", c ? "yes" : "no"), e(t, "IFC Diagnostics", "Classification", d.length), e(t, "IFC Diagnostics", "Material", F.length), e(t, "IFC Diagnostics", "System", h.length), e(t, "IFC Diagnostics", "Storey", u?.storey || ""), e(t, "IFC Diagnostics", "Layer", V.get(r) || ""), e(t, "IFC Diagnostics", "MissingInFile", S.join(", ")), e(t, "IFC Diagnostics", "CurrentlyUnparsed", g.join(", ")), {
        groups: t,
        normalizedGroups: s,
        rawGroups: t,
        filterMeta: {
          category: i?.is_a || "",
          typeName: f,
          storey: u?.storey || "",
          elevation: u?.elevation,
          spatialPath: u?.path || [],
          systems: h,
          materials: F,
          classifications: d
        }
      };
    },
    getExpressId: (n, r) => n.userData?.expressID
  }, E(50, A("building_geometry"));
  let Ie = 0, he = 0;
  const ye = {}, ve = (n, r = 1) => {
    const s = `${n}-${r}`;
    return ye[s] || (ye[s] = new l.MeshStandardMaterial({
      color: n,
      transparent: r < 1,
      opacity: r,
      side: l.DoubleSide
    })), ye[s];
  }, We = new l.Matrix4();
  return M.StreamAllMeshes(x, (n) => {
    const r = n.geometries.size();
    he += r;
    for (let s = 0; s < r; s++) {
      const t = n.geometries.get(s), e = n.expressID, i = t.geometryExpressID, o = M.GetGeometry(x, i), a = M.GetVertexArray(o.GetVertexData(), o.GetVertexDataSize()), c = M.GetIndexArray(o.GetIndexData(), o.GetIndexDataSize()), f = new l.BufferGeometry(), u = new Float32Array(a.length / 2), d = new Float32Array(a.length / 2);
      for (let w = 0; w < a.length; w += 6)
        u[w / 2] = a[w], u[w / 2 + 1] = a[w + 1], u[w / 2 + 2] = a[w + 2], d[w / 2] = a[w + 3], d[w / 2 + 1] = a[w + 4], d[w / 2 + 2] = a[w + 5];
      f.setAttribute("position", new l.BufferAttribute(u, 3)), f.setAttribute("normal", new l.BufferAttribute(d, 3)), f.setIndex(new l.BufferAttribute(c, 1)), f.userData = { expressID: e, bimId: String(e) };
      const F = t.flatTransformation;
      We.fromArray(F);
      const h = t.color;
      let y;
      if (h) {
        const w = new l.Color(h.x, h.y, h.z).getHex();
        y = ve(w, h.w);
      } else
        y = ve(13421772);
      const I = new l.Mesh(f, y);
      I.matrixAutoUpdate = !1, I.matrix.fromArray(F), I.matrixWorldNeedsUpdate = !0, I.userData.expressID = e, I.userData.bimId = String(e), Z.has(e) || Z.set(e, []), Z.get(e).push(I), V.has(e) && (I.userData.layer = V.get(e));
      const S = C(e);
      try {
        const w = R(S?.is_a) || "Item", ae = R(S?.Name?.value, S?.LongName?.value, S?.Description?.value);
        I.name = ae ? `${w}: ${ae}` : `${w} [${e}]`;
      } catch {
        I.name = `IFC Item ${e}`;
      }
      const b = le.get(e), g = ce.get(e), p = g ? C(g) : null, N = v([
        ...z.get(e) || [],
        ...g ? z.get(g) || [] : []
      ]), $ = v([
        ...j.get(e) || [],
        ...g ? j.get(g) || [] : []
      ]), L = v([
        ...U.get(e) || [],
        ...g ? U.get(g) || [] : []
      ]);
      if (I.userData.ifcMetadata = {
        category: S?.is_a || "",
        storey: b?.storey || "",
        elevation: b?.elevation,
        spatialPath: b?.path || [],
        systems: L,
        materials: $,
        classifications: N,
        typeName: p?.Name?.value || "",
        globalId: S.GlobalId?.value || "",
        typeEntity: p?.is_a || "",
        render: h ? {
          color: `#${new l.Color(h.x, h.y, h.z).getHexString().toUpperCase()}`,
          opacity: Number(h.w ?? 1)
        } : void 0
      }, I.userData.ifcSpatial = b, (J.get(e) || T).add(I), Ie++, he > 0) {
        const w = Math.min(1, Ie / he), ae = 50 + Math.floor(w * 45);
        E(ae, A("building_geometry"));
      }
    }
  }), console.log(`Loaded ${Ie} meshes from IFC.`), E(100, A("success")), T.rotateX(Math.PI / 2), T;
};
export {
  Je as loadIFC
};
