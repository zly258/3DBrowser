import * as l from "three";
let ae = null, Pe = "";
const ge = /* @__PURE__ */ new Map();
function Be(m) {
  return `${typeof window < "u" ? new URL(m.endsWith("/") ? m : `${m}/`, window.location.href).toString() : m.endsWith("/") ? m : `${m}/`}web-ifc/`;
}
async function We(m) {
  const E = Be(m);
  return ae && Pe === E || (Pe = E, ae = (async () => {
    const A = await import("web-ifc"), G = new A.IfcAPI();
    return G.SetWasmPath(E), await G.Init(), ge.clear(), { ifcApi: G, WebIFC: A, wasmPath: E };
  })()), ae;
}
function H(m, E) {
  const A = ge.get(E);
  if (A !== void 0) return A;
  const G = m.GetTypeCodeFromName(E);
  return ge.set(E, G), G;
}
function T(m) {
  if (typeof m == "number" && Number.isFinite(m)) return m;
  if (m && typeof m == "object" && typeof m.value == "number") return m.value;
}
function P(m) {
  if (!m) return [];
  if (Array.isArray(m))
    return m.map(T).filter((A) => typeof A == "number");
  if (typeof m.size == "function" && typeof m.get == "function") {
    const A = [];
    for (let G = 0; G < m.size(); G++) {
      const Q = T(m.get(G));
      typeof Q == "number" && A.push(Q);
    }
    return A;
  }
  const E = T(m);
  return typeof E == "number" ? [E] : [];
}
function R(m) {
  return Array.from(
    new Set(
      m.map((E) => typeof E == "string" ? E.trim() : "").filter(Boolean)
    )
  );
}
function v(...m) {
  const E = /* @__PURE__ */ new Set(["", "n/a", "na", "undefined", "null", "-", "--"]);
  for (const A of m) {
    if (typeof A != "string") continue;
    const G = A.trim();
    if (!E.has(G.toLowerCase()))
      return G;
  }
  return "";
}
const Qe = async (m, E, A, G = "./libs", Q) => {
  const { ifcApi: w, WebIFC: Z } = await We(G);
  let X;
  if (typeof m != "string")
    m instanceof ArrayBuffer ? X = m : (E(5, `${A("reading")}...`), X = await m.arrayBuffer(), E(25, `${A("reading")}...`));
  else {
    const n = new l.FileLoader();
    n.setResponseType("arraybuffer");
    let i = 0;
    X = await new Promise((s, t) => {
      n.load(
        m,
        (e) => s(e),
        (e) => {
          if (e.total > 0) {
            const r = e.loaded / e.total * 100;
            E(r, `${A("reading")}...`);
          } else
            i = i + 5, E(Math.min(35, i), `${A("reading")}...`);
        },
        t
      );
    });
  }
  const Re = new Uint8Array(X);
  E(30, A("analyzing"));
  const x = w.OpenModel(Re, {
    COORDINATE_TO_ORIGIN: !0,
    CIRCLE_SEGMENTS: 12,
    MEMORY_LIMIT: 1073741824
    // 1GB（内存限制）
  }), D = new l.Group();
  D.name = "IFC模型";
  const K = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), g = (n) => {
    if (le.has(n)) return le.get(n);
    const i = w.GetLine(x, n);
    return le.set(n, i), i;
  }, Ce = () => {
    try {
      const n = H(w, "IFCRELDEFINESBYPROPERTIES"), i = w.GetLineIDsWithType(x, n), s = i.size();
      for (let t = 0; t < s; t++) {
        const e = i.get(t), r = g(e);
        if (r?.RelatedObjects && Array.isArray(r.RelatedObjects)) {
          const o = r.RelatingPropertyDefinition?.value;
          o && r.RelatedObjects.forEach((a) => {
            const c = a.value;
            K.has(c) || K.set(c, []), K.get(c).push(o);
          });
        }
      }
    } catch (n) {
      console.warn("无法构建属性映射表", n);
    }
  }, Fe = () => {
    try {
      const n = H(w, "IFCRELDEFINESBYTYPE"), i = w.GetLineIDsWithType(x, n);
      for (let s = 0; s < i.size(); s++) {
        const t = g(i.get(s)), e = T(t?.RelatingType);
        if (!e) continue;
        P(t?.RelatedObjects).forEach((o) => {
          oe.set(o, e);
        });
        const r = g(e);
        P(r?.HasPropertySets).forEach((o) => {
          k.has(e) || k.set(e, []), k.get(e).push(o);
        });
      }
    } catch (n) {
      console.warn("无法构建类型属性映射表", n);
    }
  }, Se = () => {
    try {
      const n = H(w, "IFCPRESENTATIONLAYERASSIGNMENT"), i = w.GetLineIDsWithType(x, n);
      for (let s = 0; s < i.size(); s++) {
        const t = i.get(s), e = g(t), r = e?.Name?.value || `Layer_${t}`;
        e?.AssignedItems && Array.isArray(e.AssignedItems) && e.AssignedItems.forEach((o) => {
          const a = o.value;
          V.set(a, r);
        });
      }
    } catch (n) {
      console.warn("无法构建图层映射表", n);
    }
  }, ve = (n) => {
    if (!n) return null;
    const i = typeof n == "number" ? g(n) : n;
    if (!i) return null;
    const s = v(i.Identification?.value, i.ItemReference?.value, i.Reference?.value) || "", t = v(i.Name?.value, i.Description?.value, i.Source?.value) || "", e = R([s, t]);
    return e.length > 0 ? e.join(" - ") : v(i.is_a) || null;
  }, Ee = () => {
    try {
      const n = H(w, "IFCRELASSOCIATESCLASSIFICATION"), i = w.GetLineIDsWithType(x, n);
      for (let s = 0; s < i.size(); s++) {
        const t = g(i.get(s)), e = T(t?.RelatingClassification), r = e ? g(e) : t?.RelatingClassification, o = ve(r);
        o && P(t?.RelatedObjects).forEach((a) => {
          z.has(a) || z.set(a, []), z.get(a).push(o);
        });
      }
    } catch (n) {
      console.warn("无法构建分类映射表", n);
    }
  }, ue = (n, i = /* @__PURE__ */ new Set()) => {
    if (!n) return [];
    const s = T(n), t = typeof n == "number" || n?.value !== void 0 ? g(s) : n;
    if (s && i.has(s)) return [];
    if (s && i.add(s), !t) return [];
    const e = R([
      v(t.Name?.value),
      v(t.LayerSetName?.value),
      v(t.Category?.value)
    ]), o = ["Materials", "MaterialLayers", "MaterialProfiles", "MaterialConstituents"].flatMap(
      (c) => P(t[c]).flatMap((f) => ue(f, i))
    ), a = [t.ForLayerSet, t.ForProfileSet, t.Material].map(T).filter((c) => typeof c == "number").flatMap((c) => ue(c, i));
    return R([...e, ...o, ...a]);
  }, Me = () => {
    try {
      const n = H(w, "IFCRELASSOCIATESMATERIAL"), i = w.GetLineIDsWithType(x, n);
      for (let s = 0; s < i.size(); s++) {
        const t = g(i.get(s)), e = ue(t?.RelatingMaterial);
        e.length !== 0 && P(t?.RelatedObjects).forEach((r) => {
          j.has(r) || j.set(r, []), j.get(r).push(...e);
        });
      }
    } catch (n) {
      console.warn("无法构建材质映射表", n);
    }
  }, we = () => {
    try {
      const n = H(w, "IFCRELASSIGNSTOGROUP"), i = w.GetLineIDsWithType(x, n);
      for (let s = 0; s < i.size(); s++) {
        const t = g(i.get(s)), e = T(t?.RelatingGroup);
        if (!e) continue;
        const r = g(e);
        if (!r || r.is_a !== "IFCSYSTEM" && r.is_a !== "IFCDISTRIBUTIONSYSTEM") continue;
        const o = v(r.Name?.value, r.LongName?.value) || `${r.is_a} [${e}]`;
        P(t?.RelatedObjects).forEach((a) => {
          U.has(a) || U.set(a, []), U.get(a).push(o);
        });
      }
    } catch (n) {
      console.warn("无法构建系统映射表", n);
    }
  };
  D.userData.isIFC = !0, D.userData.ifcAPI = w, D.userData.modelID = x, D.userData.layerMap = V, D.userData.ifcGridDiagnostics = [];
  const Ae = (n, i, s, t = 36) => {
    const e = document.createElement("canvas"), r = e.getContext("2d");
    if (!r) return new l.Sprite();
    const o = 'bold 26px "Microsoft YaHei", Arial, sans-serif';
    r.font = o;
    const a = 14, c = Math.ceil(r.measureText(n).width);
    e.width = c + a * 2, e.height = 44, r.font = o, r.fillStyle = "rgba(255,255,255,0.92)", r.fillRect(0, 0, e.width, e.height), r.strokeStyle = s, r.lineWidth = 2, r.strokeRect(1, 1, e.width - 2, e.height - 2), r.fillStyle = "#111827", r.textAlign = "center", r.textBaseline = "middle", r.fillText(n, e.width / 2, e.height / 2);
    const f = new l.CanvasTexture(e);
    f.minFilter = l.LinearFilter, f.magFilter = l.LinearFilter;
    const u = new l.Sprite(new l.SpriteMaterial({
      map: f,
      transparent: !0,
      depthTest: !1,
      depthWrite: !1
    }));
    u.position.copy(i);
    const d = l.MathUtils.clamp(t, 6, 320);
    return u.scale.set(d * (e.width / e.height), d, 1), u.renderOrder = 1002, u.userData.isIfcGridHelper = !0, u;
  }, B = (n) => {
    const i = T(n), t = (i ? g(i) : n)?.Coordinates;
    if (!t) return null;
    const e = Array.isArray(t) ? t.map((r) => r?.value ?? r) : [];
    return new l.Vector3(
      Number(e[0] || 0),
      Number(e[1] || 0),
      Number(e[2] || 0)
    );
  }, O = (n) => {
    if (n == null) return null;
    if (typeof n == "number") return Number.isFinite(n) ? n : null;
    if (typeof n == "string") {
      const i = Number(n);
      return Number.isFinite(i) ? i : null;
    }
    if (typeof n == "object") {
      if (typeof n.value == "number") return Number.isFinite(n.value) ? n.value : null;
      if (typeof n.wrappedValue == "number") return Number.isFinite(n.wrappedValue) ? n.wrappedValue : null;
    }
    return null;
  }, Le = (n, i, s = !0) => {
    const t = [], e = Math.max(2, i), r = s ? e - 1 : e;
    for (let o = 0; o < e; o++) {
      const a = r === 0 ? 0 : o / r;
      t.push(n(Math.min(1, Math.max(0, a))));
    }
    return t;
  }, pe = /* @__PURE__ */ new Map(), ee = (n, i) => {
    const s = T(n);
    if (!s) return i.clone();
    const e = g(s)?.DirectionRatios;
    if (!Array.isArray(e)) return i.clone();
    const r = new l.Vector3(
      Number(e[0]?.value ?? e[0] ?? i.x),
      Number(e[1]?.value ?? e[1] ?? i.y),
      Number(e[2]?.value ?? e[2] ?? i.z)
    );
    return r.lengthSq() > 0 ? r.normalize() : i.clone();
  }, te = (n) => {
    const i = T(n), s = i ? g(i) : n;
    if (!s) return new l.Matrix4();
    const t = B(s.Location) || new l.Vector3(), e = ee(s.Axis, new l.Vector3(0, 0, 1));
    let r = ee(s.RefDirection, new l.Vector3(1, 0, 0)), o = new l.Vector3().crossVectors(e, r).normalize();
    return o.lengthSq() === 0 && (r = new l.Vector3(1, 0, 0), o = new l.Vector3(0, 1, 0)), r = new l.Vector3().crossVectors(o, e).normalize(), new l.Matrix4().makeBasis(r, o, e).setPosition(t);
  }, Te = (n) => {
    const i = T(n);
    if (!i) return new l.Matrix4();
    if (pe.has(i))
      return pe.get(i).clone();
    const s = g(i);
    let t = new l.Matrix4();
    if (s?.is_a === "IFCLOCALPLACEMENT") {
      const e = te(s.RelativePlacement), r = T(s.PlacementRelTo);
      t = r ? Te(r).multiply(e) : e;
    } else (s?.is_a === "IFCAXIS2PLACEMENT3D" || s?.is_a === "IFCAXIS2PLACEMENT2D") && (t = te(s));
    return pe.set(i, t.clone()), t;
  }, Oe = (n, i, s, t) => {
    const e = i.clone().invert(), r = n.clone().applyMatrix4(e);
    return Math.atan2(r.y / Math.max(t, 1e-6), r.x / Math.max(s, 1e-6));
  }, $e = (n, i) => {
    let s = i;
    for (; s <= n; )
      s += Math.PI * 2;
    return { startAngle: n, endAngle: s };
  }, fe = (n, i, s, t = 0, e = Math.PI * 2) => {
    const r = te(n), { startAngle: o, endAngle: a } = $e(t, e), c = Math.abs(a - o), f = Math.max(12, Math.ceil(c / (Math.PI * 2) * 48));
    return Le((u) => {
      const d = o + (a - o) * u;
      return new l.Vector3(
        Math.cos(d) * i,
        Math.sin(d) * s,
        0
      ).applyMatrix4(r);
    }, f, !0);
  }, De = (n, i, s, t) => {
    const e = Array.isArray(n.Trim1) ? n.Trim1 : [n.Trim1], r = Array.isArray(n.Trim2) ? n.Trim2 : [n.Trim2], o = te(i.Position), a = (u) => {
      const d = B(u);
      return d ? Oe(d, o, s, t) : O(u);
    }, c = e.map(a).find((u) => u !== null), f = r.map(a).find((u) => u !== null);
    return c === void 0 || f === void 0 ? null : fe(i.Position, s, t, c, f);
  }, Ve = (n, i, s = new l.Vector3(0, 0, 1)) => {
    if (n.length < 2 || Math.abs(i) < 1e-6) return n;
    const t = [];
    for (let e = 0; e < n.length; e++) {
      const r = n[Math.max(0, e - 1)], a = n[Math.min(n.length - 1, e + 1)].clone().sub(r);
      if (a.lengthSq() < 1e-8) {
        t.push(n[e].clone());
        continue;
      }
      const c = new l.Vector3().crossVectors(s, a.normalize()).normalize();
      t.push(n[e].clone().addScaledVector(c, i));
    }
    return t;
  }, W = (n, i = /* @__PURE__ */ new Set()) => {
    const s = T(n), t = s ? g(s) : n;
    if (!t) return [];
    if (s && i.has(s)) return [];
    if (s && i.add(s), t.is_a === "IFCPOLYLINE")
      return P(t.Points).map((e) => B(e)).filter((e) => !!e);
    if (t.is_a === "IFCINDEXEDPOLYCURVE")
      return (g(T(t.Points) || 0)?.CoordList || []).map((o) => {
        const a = Array.isArray(o) ? o.map((c) => c?.value ?? c) : [];
        return new l.Vector3(Number(a[0] || 0), Number(a[1] || 0), Number(a[2] || 0));
      });
    if (t.is_a === "IFCCOMPOSITECURVE")
      return P(t.Segments).flatMap((e) => {
        const r = g(e), o = W(r?.ParentCurve, i);
        return r?.SameSense === !1 ? o.reverse() : o;
      });
    if (t.is_a === "IFCCURVESEGMENT") {
      const e = t.ParentCurve || t.BasisCurve || t.BaseCurve, r = W(e, i);
      return t.SameSense === !1 ? r.reverse() : r;
    }
    if (t.is_a === "IFCPCURVE")
      return W(t.ReferenceCurve || t.BasisCurve || t.OuterBoundary, i);
    if (t.is_a === "IFCOFFSETCURVE2D" || t.is_a === "IFCOFFSETCURVE3D") {
      const e = t.BasisCurve || t.ParentCurve || t.ReferenceCurve, r = W(e, i);
      if (r.length < 2) return r;
      const o = O(t.Distance || t.OffsetDistance) ?? 0, a = t.is_a === "IFCOFFSETCURVE3D" ? ee(t.RefDirection, new l.Vector3(0, 0, 1)) : new l.Vector3(0, 0, 1);
      return Ve(r, o, a);
    }
    if (t.is_a === "IFCBSPLINECURVE" || t.is_a === "IFCBSPLINECURVEWITHKNOTS") {
      const e = (t.ControlPointsList || t.ControlPoints || []).map((r) => B(r)).filter((r) => !!r);
      if (e.length >= 2)
        return new l.CatmullRomCurve3(e).getPoints(Math.max(16, e.length * 6));
    }
    if (t.is_a === "IFCCIRCLE") {
      const e = O(t.Radius) ?? 1;
      return fe(t.Position, e, e);
    }
    if (t.is_a === "IFCELLIPSE") {
      const e = O(t.SemiAxis1) ?? 1, r = O(t.SemiAxis2) ?? e;
      return fe(t.Position, e, r);
    }
    if (t.is_a === "IFCTRIMMEDCURVE") {
      const e = T(t.BasisCurve) ? g(T(t.BasisCurve)) : t.BasisCurve;
      if (e?.is_a === "IFCCIRCLE") {
        const a = O(e.Radius) ?? 1, c = De(t, e, a, a);
        if (c && c.length > 1) return c;
      }
      if (e?.is_a === "IFCELLIPSE") {
        const a = O(e.SemiAxis1) ?? 1, c = O(e.SemiAxis2) ?? a, f = De(t, e, a, c);
        if (f && f.length > 1) return f;
      }
      const r = P(t.Trim1).map((a) => B(a)).filter((a) => !!a), o = P(t.Trim2).map((a) => B(a)).filter((a) => !!a);
      return r.length > 0 && o.length > 0 ? [r[0], o[0]] : W(t.BasisCurve, i);
    }
    if (t.is_a === "IFCLINE") {
      const e = B(t.Pnt) || new l.Vector3(), r = ee(t.Dir?.Orientation, new l.Vector3(1, 0, 0)), a = 1e3 * (Number(t.Dir?.Magnitude?.value ?? t.Dir?.Magnitude ?? 1) || 1);
      return [
        e.clone().addScaledVector(r, -a),
        e.clone().addScaledVector(r, a)
      ];
    }
    return t.is_a === "IFCGRIDAXIS" ? W(t.AxisCurve, i) : (D.userData.ifcGridDiagnostics.push(t.is_a || `UnknownCurve:${s ?? "?"}`), []);
  }, de = /* @__PURE__ */ new Map();
  de.set(0, D);
  const J = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), _e = () => {
    const n = w.GetLineIDsWithType(x, Z.IFCRELAGGREGATES);
    for (let s = 0; s < n.size(); s++) {
      const t = g(n.get(s)), e = t.RelatingObject.value, r = t.RelatedObjects.map((o) => o.value);
      ne.has(e) || ne.set(e, []), ne.get(e).push(...r);
    }
    const i = w.GetLineIDsWithType(x, Z.IFCRELCONTAINEDINSPATIALSTRUCTURE);
    for (let s = 0; s < i.size(); s++) {
      const t = g(i.get(s)), e = t.RelatingStructure.value, r = t.RelatedElements.map((o) => o.value);
      se.has(e) || se.set(e, []), se.get(e).push(...r);
    }
  }, be = /* @__PURE__ */ new Set(), ie = (n, i, s) => {
    const t = g(n);
    if (!t || be.has(n)) return;
    be.add(n);
    let e = i, r = s;
    const a = [
      "IFCPROJECT",
      "IFCSITE",
      "IFCBUILDING",
      "IFCBUILDINGSTOREY",
      "IFCSPACE",
      "IFCZONE"
    ].includes(t.is_a), c = v(t.Name?.value, t.LongName?.value, t.Description?.value) || `${t.is_a} [${n}]`, f = t.is_a === "IFCBUILDINGSTOREY" ? O(t.Elevation) : s.elevation, u = new l.Group();
    u.name = c, r = {
      storey: t.is_a === "IFCBUILDINGSTOREY" ? c : s.storey,
      elevation: f ?? void 0,
      path: a ? [...s.path, c] : s.path,
      container: t.is_a
    }, u.userData = {
      expressID: n,
      isSpatial: a,
      isIfcEntity: !0,
      type: t.is_a,
      ifcSpatial: r,
      ifcMetadata: {
        category: t.is_a,
        storey: r.storey,
        elevation: r.elevation,
        spatialPath: r.path,
        systems: [],
        materials: [],
        classifications: [],
        typeName: "",
        globalId: t.GlobalId?.value || ""
      }
    }, i.add(u), e = u, de.set(n, u), ce.set(n, r);
    const d = ne.get(n);
    if (d)
      for (const I of d)
        ie(I, e, r);
    const C = se.get(n);
    if (C)
      for (const I of C)
        ie(I, e, r);
  };
  (() => {
    try {
      _e();
      const n = w.GetLineIDsWithType(x, Z.IFCPROJECT);
      if (n.size() > 0)
        for (let i = 0; i < n.size(); i++)
          ie(n.get(i), D, {
            storey: "",
            elevation: void 0,
            path: [],
            container: "IFCPROJECT"
          });
      else {
        const i = w.GetLineIDsWithType(x, Z.IFCSITE);
        for (let s = 0; s < i.size(); s++)
          ie(i.get(s), D, {
            storey: "",
            elevation: void 0,
            path: [],
            container: "IFCSITE"
          });
      }
    } catch (n) {
      console.error("解析 IFC 完整空间结构失败:", n);
    }
  })(), (() => {
    try {
      const n = H(w, "IFCGRID"), i = w.GetLineIDsWithType(x, n);
      if (!i || i.size() === 0) return;
      const s = new l.Group();
      s.name = "__IFCGridHelper", s.visible = !0, s.userData.isIfcGridHelper = !0;
      const t = [
        { key: "UAxes", color: "#d97706" },
        { key: "VAxes", color: "#2563eb" },
        { key: "WAxes", color: "#059669" }
      ], e = (r, o) => {
        const a = new l.Group();
        a.userData.isIfcGridHelper = !0;
        const f = new l.Box3().setFromPoints(r).getSize(new l.Vector3()), u = Math.max(f.x, f.y, f.z, 1), d = l.MathUtils.clamp(u * 2e-3, 0.6, 28), C = new l.MeshBasicMaterial({
          color: o,
          transparent: !0,
          opacity: 0.92,
          depthTest: !1,
          depthWrite: !1
        });
        for (let I = 0; I < r.length - 1; I++) {
          const F = r[I], y = r[I + 1], S = new l.Vector3().subVectors(y, F), b = S.length();
          if (b <= 1e-4) continue;
          const h = new l.Mesh(
            new l.CylinderGeometry(d, d, b, 10),
            C
          );
          h.position.copy(F).add(y).multiplyScalar(0.5), h.quaternion.setFromUnitVectors(
            new l.Vector3(0, 1, 0),
            S.normalize()
          ), h.renderOrder = 1e3, h.userData.isIfcGridHelper = !0, a.add(h);
        }
        return r.forEach((I) => {
          const F = new l.Mesh(
            new l.SphereGeometry(d * 1.15, 10, 10),
            C
          );
          F.position.copy(I), F.renderOrder = 1001, F.userData.isIfcGridHelper = !0, a.add(F);
        }), a;
      };
      for (let r = 0; r < i.size(); r++) {
        const o = g(i.get(r));
        o && t.forEach(({ key: a, color: c }) => {
          P(o[a]).forEach((f) => {
            const u = g(f), d = Te(o?.ObjectPlacement), C = W(u?.AxisCurve).map(($) => $.clone().applyMatrix4(d));
            if (C.length < 2) return;
            s.add(e(C, c));
            const I = v(u?.AxisTag?.value, u?.Name?.value) || `${a}-${f}`, F = C[0], y = C[C.length - 1], S = F.distanceTo(y), b = l.MathUtils.clamp(S * 0.035, 10, 220), h = l.MathUtils.clamp(S * 2e-3, 0.6, 28), p = Math.max(h * 3.2, b * 0.12), N = new l.Vector3(p, p, h * 0.6);
            s.add(Ae(I, F.clone().add(N), c, b)), F.distanceTo(y) > 1 && s.add(Ae(I, y.clone().add(N), c, b));
          });
        });
      }
      s.children.length > 0 && (D.add(s), D.userData.ifcGridHelper = s);
    } catch (n) {
      console.warn("构建 IFC 轴网失败", n);
    }
  })();
  const ze = (typeof Q?.deferIfcProperties == "boolean" ? !!Q.deferIfcProperties : void 0) ?? X.byteLength > 20 * 1024 * 1024, Ne = () => {
    for (const [n, i] of J.entries()) {
      const s = V.get(n);
      if (s)
        for (const t of i)
          t.userData.layer = s;
    }
  };
  ze ? (E(42, `${A("analyzing")}...`), setTimeout(() => {
    Se(), Ce(), Fe(), Ee(), Me(), we(), Ne();
  }, 0)) : (Se(), Ce(), Fe(), Ee(), Me(), we(), Ne());
  const _ = (n) => {
    let i = n.replace(/^(is|has|are)_/i, "");
    return ((t) => t.replace(/([A-Z])/g, " $1").replace(/^ /, ""))(i);
  }, je = (n) => n, Y = (n) => {
    if (n == null || n === "") return "";
    if (typeof n == "object" && n !== null) {
      if (n.value !== void 0)
        return Y(n.value);
      if (Array.isArray(n))
        return n.map((i) => Y(i)).filter((i) => i != null && i !== "").join(", ");
      if (Object.keys(n).length <= 3)
        return Object.entries(n).map(([i, s]) => `${i}: ${Y(s)}`).join(", ");
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
      const i = n.trim();
      return ["", "n/a", "na", "undefined", "null", "-", "--"].includes(i.toLowerCase()) ? "" : (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(i), i);
    }
    return String(n);
  }, me = (n, i = "", s = _) => {
    const t = {};
    return Object.keys(n).forEach((e) => {
      if (["expressID", "is_a", "type", "ID", "Name", "GlobalId"].includes(e)) return;
      const r = n[e], o = s(e), a = i ? `${i}.` : "";
      if (typeof r == "object" && r !== null && !Array.isArray(r)) {
        const c = me(r, a + o, s);
        Object.assign(t, c);
      } else {
        const c = a + o;
        t[c] = Y(r);
      }
    }), t;
  }, Ge = (n, i = "") => {
    const s = {}, t = {};
    let e = 0;
    const r = (a, c) => (a[c] || (a[c] = []), a[c]), o = (a, c, f, u, d) => {
      const C = Y(u);
      C === "" || C === null || C === void 0 || r(a, c).push({
        key: f,
        rawKey: d,
        value: C,
        id: `${c}::${f}::${r(a, c).length}`
      });
    };
    for (const a of n)
      try {
        const c = g(a);
        if (!c) continue;
        const f = c.Name?.value || `属性集_${a}`, u = _(f), d = `${i}${f}`;
        if (c.HasProperties) {
          o(s, u, "类型", c.is_a, "is_a"), o(t, d, "is_a", c.is_a), o(s, u, "描述", c.Description?.value, "Description"), o(t, d, "Description", c.Description?.value);
          for (const C of c.HasProperties) {
            const I = C.value, F = g(I);
            if (!F || !F.Name) continue;
            const y = F.Name.value;
            if (F.NominalValue) {
              o(s, u, _(y), F.NominalValue.value, y), o(t, d, y, F.NominalValue.value);
              continue;
            }
            const S = me(F, "", _), b = me(F, "", je);
            Object.entries(S).forEach(([h, p]) => {
              o(s, u, `${_(y)}.${h}`, p, `${y}.${h}`);
            }), Object.entries(b).forEach(([h, p]) => {
              o(t, d, `${y}.${h}`, p);
            });
          }
        }
        if (c.Quantities) {
          e += 1;
          const C = `${u}.数量`, I = `${d}.Quantities`;
          c.Quantities.forEach((F) => {
            const y = T(F) ? g(F.value) : F;
            if (!y?.Name?.value) return;
            const S = y.Name.value;
            [
              "LengthValue",
              "AreaValue",
              "VolumeValue",
              "CountValue",
              "WeightValue",
              "TimeValue"
            ].forEach((h) => {
              y[h]?.value !== void 0 && (o(s, C, `${_(S)}.${_(h)}`, y[h].value, `${S}.${h}`), o(t, I, `${S}.${h}`, y[h].value));
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
  D.userData.ifcManager = {
    getItemProperties: async (n, i) => {
      const s = {}, t = {}, e = (p, N, $, L, q) => {
        L === "" || L === null || L === void 0 || (p[N] || (p[N] = []), p[N].push({
          key: $,
          rawKey: q,
          value: String(L),
          id: `${N}::${$}::${p[N].length}`
        }));
      };
      let r = null;
      try {
        r = g(i), r && (e(s, "IFC 标识", "ExpressID", i, "expressID"), e(s, "IFC 标识", "类型", r.is_a || "Unknown", "is_a"), e(s, "IFC 标识", "全局ID", r.GlobalId?.value || "", "GlobalId"), e(s, "IFC 标识", "名称", r.Name?.value || "", "Name"), e(s, "IFC 标识", "描述", r.Description?.value || "", "Description"), e(s, "IFC 标识", "标签", r.Tag?.value || "", "Tag"), e(t, "IFC Entity", "expressID", i), e(t, "IFC Entity", "is_a", r.is_a || "Unknown"), e(t, "IFC Entity", "GlobalId", r.GlobalId?.value || ""), e(t, "IFC Entity", "Name", r.Name?.value || ""), e(t, "IFC Entity", "Description", r.Description?.value || ""), e(t, "IFC Entity", "Tag", r.Tag?.value || ""), Object.keys(r).forEach((p) => {
          if (["expressID", "is_a", "type", "ID", "GlobalId", "Name", "Description", "Tag"].includes(p)) return;
          const N = Y(r[p]);
          e(s, "IFC 标识", _(p), N, p), e(t, "IFC Entity", p, N);
        }));
      } catch (p) {
        console.warn("获取实体属性失败", p);
      }
      const o = K.get(i) || [];
      let a = 0;
      if (o.length > 0) {
        const p = Ge(o);
        Object.assign(s, p.normalizedGroups), Object.assign(t, p.rawGroups), a += p.quantityGroupCount;
      }
      const c = oe.get(i);
      let f = "";
      if (c) {
        const p = g(c);
        f = p?.Name?.value || "", e(s, "IFC 类型", "类型实体", p?.is_a || ""), e(s, "IFC 类型", "类型名称", f), e(s, "IFC 类型", "类型ID", c), e(t, "IFC Type", "is_a", p?.is_a || ""), e(t, "IFC Type", "Name", f), e(t, "IFC Type", "expressID", c);
        const N = k.get(c) || [];
        if (N.length > 0) {
          const $ = Ge(N, "TYPE:");
          Object.entries($.normalizedGroups).forEach(([L, q]) => {
            s[`Type Properties · ${L}`] = q.map((M) => ({ ...M }));
          }), Object.entries($.rawGroups).forEach(([L, q]) => {
            t[`TYPE:${L}`] = q.map((M) => ({ ...M }));
          });
        }
      }
      const u = ce.get(i), d = R([
        ...z.get(i) || [],
        ...c ? z.get(c) || [] : []
      ]), C = R([
        ...j.get(i) || [],
        ...c ? j.get(c) || [] : []
      ]), I = R([
        ...U.get(i) || [],
        ...c ? U.get(c) || [] : []
      ]);
      d.length > 0 && (e(s, "IFC 分类", "编码", d.join(", ")), e(t, "IFC Classification", "Items", d.join(", "))), C.length > 0 && (e(s, "IFC 材质", "材质名称", C.join(", ")), e(t, "IFC Material", "Names", C.join(", "))), I.length > 0 && (e(s, "IFC 系统", "系统名称", I.join(", ")), e(t, "IFC System", "Names", I.join(", "))), u && (e(s, "IFC 空间", "所在楼层", u.storey || ""), e(s, "IFC 空间", "楼层标高", u.elevation ?? ""), e(s, "IFC 空间", "空间路径", u.path.join(" / ")), e(s, "IFC 空间", "容器类型", u.container), e(t, "IFC Spatial", "Storey", u.storey || ""), e(t, "IFC Spatial", "Elevation", u.elevation ?? ""), e(t, "IFC Spatial", "Path", u.path.join(" / ")), e(t, "IFC Spatial", "Container", u.container));
      const y = (J.get(i) || [])[0];
      if (y) {
        const p = Array.isArray(y.material) ? y.material[0] : y.material;
        p instanceof l.MeshStandardMaterial && (e(s, "IFC 渲染", "颜色", `#${p.color.getHexString().toUpperCase()}`), e(s, "IFC 渲染", "透明度", p.opacity.toFixed(2)), e(t, "IFC Render", "color", `#${p.color.getHexString().toUpperCase()}`), e(t, "IFC Render", "opacity", p.opacity.toFixed(2)));
      }
      const S = [];
      o.length === 0 && S.push("属性集"), c || S.push("类型属性"), d.length === 0 && S.push("分类编码"), C.length === 0 && S.push("材质关联"), I.length === 0 && S.push("系统关联"), u?.storey || S.push("楼层信息"), V.has(i) || S.push("图层信息");
      const b = R(
        P(r?.HasAssociations).map((p) => g(p)?.is_a).filter(
          (p) => !!p && ![
            "IFCRELASSOCIATESMATERIAL",
            "IFCRELASSOCIATESCLASSIFICATION",
            "IFCRELASSIGNSTOGROUP"
          ].includes(p)
        )
      ), h = R([
        ...b.map((p) => `关联:${p}`),
        ...r?.Representation ? ["表现样式/纹理细节"] : [],
        ...r?.ObjectPlacement ? ["放置与坐标系细节"] : []
      ]);
      return e(s, "IFC 解析诊断", "属性集", o.length > 0 ? `已解析 ${o.length} 组` : "未发现"), e(s, "IFC 解析诊断", "数量属性", a > 0 ? `已解析 ${a} 组` : "未发现"), e(s, "IFC 解析诊断", "类型属性", c ? "已解析" : "未发现"), e(s, "IFC 解析诊断", "分类编码", d.length > 0 ? `已解析 ${d.length} 条` : "未发现"), e(s, "IFC 解析诊断", "材质关联", C.length > 0 ? `已解析 ${C.length} 条` : "未发现"), e(s, "IFC 解析诊断", "系统关联", I.length > 0 ? `已解析 ${I.length} 条` : "未发现"), e(s, "IFC 解析诊断", "楼层识别", u?.storey ? u.storey : "未识别"), e(s, "IFC 解析诊断", "图层", V.has(i) ? "已解析" : "未发现"), e(s, "IFC 解析诊断", "文件未提供", S.length > 0 ? S.join("、") : "未发现"), e(s, "IFC 解析诊断", "当前未解析", h.length > 0 ? h.join("、") : "未发现"), e(t, "IFC Diagnostics", "PropertySets", o.length), e(t, "IFC Diagnostics", "QuantityGroups", a), e(t, "IFC Diagnostics", "TypeProperties", c ? "yes" : "no"), e(t, "IFC Diagnostics", "Classification", d.length), e(t, "IFC Diagnostics", "Material", C.length), e(t, "IFC Diagnostics", "System", I.length), e(t, "IFC Diagnostics", "Storey", u?.storey || ""), e(t, "IFC Diagnostics", "Layer", V.get(i) || ""), e(t, "IFC Diagnostics", "MissingInFile", S.join(", ")), e(t, "IFC Diagnostics", "CurrentlyUnparsed", h.join(", ")), {
        groups: t,
        normalizedGroups: s,
        rawGroups: t,
        filterMeta: {
          category: r?.is_a || "",
          typeName: f,
          storey: u?.storey || "",
          elevation: u?.elevation,
          spatialPath: u?.path || [],
          systems: I,
          materials: C,
          classifications: d
        }
      };
    },
    getExpressId: (n, i) => n.userData?.expressID
  }, E(50, A("building_geometry"));
  let Ie = 0, ye = 0;
  const he = {}, xe = (n, i = 1) => {
    const s = `${n}-${i}`;
    return he[s] || (he[s] = new l.MeshStandardMaterial({
      color: n,
      transparent: i < 1,
      opacity: i,
      side: l.DoubleSide
    })), he[s];
  }, Ue = new l.Matrix4();
  return w.StreamAllMeshes(x, (n) => {
    const i = n.geometries.size();
    ye += i;
    for (let s = 0; s < i; s++) {
      const t = n.geometries.get(s), e = n.expressID, r = t.geometryExpressID, o = w.GetGeometry(x, r), a = w.GetVertexArray(o.GetVertexData(), o.GetVertexDataSize()), c = w.GetIndexArray(o.GetIndexData(), o.GetIndexDataSize()), f = new l.BufferGeometry(), u = new Float32Array(a.length / 2), d = new Float32Array(a.length / 2);
      for (let M = 0; M < a.length; M += 6)
        u[M / 2] = a[M], u[M / 2 + 1] = a[M + 1], u[M / 2 + 2] = a[M + 2], d[M / 2] = a[M + 3], d[M / 2 + 1] = a[M + 4], d[M / 2 + 2] = a[M + 5];
      f.setAttribute("position", new l.BufferAttribute(u, 3)), f.setAttribute("normal", new l.BufferAttribute(d, 3)), f.setIndex(new l.BufferAttribute(c, 1)), f.userData = { expressID: e, bimId: String(e) };
      const C = t.flatTransformation;
      Ue.fromArray(C);
      const I = t.color;
      let F;
      if (I) {
        const M = new l.Color(I.x, I.y, I.z).getHex();
        F = xe(M, I.w);
      } else
        F = xe(13421772);
      const y = new l.Mesh(f, F);
      y.matrixAutoUpdate = !1, y.matrix.fromArray(C), y.matrixWorldNeedsUpdate = !0, y.userData.expressID = e, y.userData.bimId = String(e), J.has(e) || J.set(e, []), J.get(e).push(y), V.has(e) && (y.userData.layer = V.get(e));
      const S = g(e);
      try {
        const M = v(S?.is_a) || "Item", re = v(S?.Name?.value, S?.LongName?.value, S?.Description?.value);
        y.name = re ? `${M}: ${re}` : `${M} [${e}]`;
      } catch {
        y.name = `IFC Item ${e}`;
      }
      const b = ce.get(e), h = oe.get(e), p = h ? g(h) : null, N = R([
        ...z.get(e) || [],
        ...h ? z.get(h) || [] : []
      ]), $ = R([
        ...j.get(e) || [],
        ...h ? j.get(h) || [] : []
      ]), L = R([
        ...U.get(e) || [],
        ...h ? U.get(h) || [] : []
      ]);
      if (y.userData.ifcMetadata = {
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
        render: I ? {
          color: `#${new l.Color(I.x, I.y, I.z).getHexString().toUpperCase()}`,
          opacity: Number(I.w ?? 1)
        } : void 0
      }, y.userData.ifcSpatial = b, (de.get(e) || D).add(y), Ie++, ye > 0) {
        const M = Math.min(1, Ie / ye), re = 50 + Math.floor(M * 45);
        E(re, A("building_geometry"));
      }
    }
  }), console.log(`Loaded ${Ie} meshes from IFC.`), E(100, A("success")), D.rotateX(Math.PI / 2), D;
};
export {
  Qe as loadIFC
};
