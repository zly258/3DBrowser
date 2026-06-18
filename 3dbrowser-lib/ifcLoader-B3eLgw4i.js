import * as l from "three";
import { t as be, a as qe } from "./utils-BKVlSVq3.js";
let ce = null, Ne = "";
const ge = /* @__PURE__ */ new Map();
function Qe(m) {
  return `${typeof window < "u" ? new URL(m.endsWith("/") ? m : `${m}/`, window.location.href).toString() : m.endsWith("/") ? m : `${m}/`}web-ifc/`;
}
async function Xe(m) {
  const E = Qe(m);
  return ce && Ne === E || (Ne = E, ce = (async () => {
    const A = await import("web-ifc"), G = new A.IfcAPI();
    return G.SetWasmPath(E), await G.Init(), ge.clear(), { ifcApi: G, WebIFC: A, wasmPath: E };
  })()), ce;
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
    if (A == null) continue;
    const G = String(A).trim();
    if (!E.has(G.toLowerCase()))
      return G;
  }
  return "";
}
const et = async (m, E, A, G = "./libs", Q) => {
  const { ifcApi: M, WebIFC: K } = await Xe(G);
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
            const a = e.loaded / e.total * 100;
            E(a, `${A("reading")}...`);
          } else
            r = r + 5, E(Math.min(35, r), `${A("reading")}...`);
        },
        t
      );
    });
  }
  const Ge = new Uint8Array(X);
  E(30, A("analyzing"));
  const x = M.OpenModel(Ge, {
    COORDINATE_TO_ORIGIN: !0,
    CIRCLE_SEGMENTS: 12,
    MEMORY_LIMIT: 1073741824
    // 1GB（内存限制）
  }), D = new l.Group();
  D.name = "IFC模型";
  const k = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), pe = /* @__PURE__ */ new Map(), C = (n) => {
    if (pe.has(n)) return pe.get(n);
    const r = M.GetLine(x, n);
    return pe.set(n, r), r;
  }, xe = () => {
    try {
      const n = H(M, "IFCRELDEFINESBYPROPERTIES"), r = M.GetLineIDsWithType(x, n), s = r.size();
      for (let t = 0; t < s; t++) {
        const e = r.get(t), a = C(e);
        if (a?.RelatedObjects && Array.isArray(a.RelatedObjects)) {
          const o = a.RelatingPropertyDefinition?.value;
          o && a.RelatedObjects.forEach((i) => {
            const c = i.value;
            k.has(c) || k.set(c, []), k.get(c).push(o);
          });
        }
      }
    } catch (n) {
      console.warn("无法构建属性映射表", n);
    }
  }, Pe = () => {
    try {
      const n = H(M, "IFCRELDEFINESBYTYPE"), r = M.GetLineIDsWithType(x, n);
      for (let s = 0; s < r.size(); s++) {
        const t = C(r.get(s)), e = T(t?.RelatingType);
        if (!e) continue;
        P(t?.RelatedObjects).forEach((o) => {
          le.set(o, e);
        });
        const a = C(e);
        P(a?.HasPropertySets).forEach((o) => {
          ee.has(e) || ee.set(e, []), ee.get(e).push(o);
        });
      }
    } catch (n) {
      console.warn("无法构建类型属性映射表", n);
    }
  }, Re = () => {
    try {
      const n = H(M, "IFCPRESENTATIONLAYERASSIGNMENT"), r = M.GetLineIDsWithType(x, n);
      for (let s = 0; s < r.size(); s++) {
        const t = r.get(s), e = C(t), a = e?.Name?.value || `Layer_${t}`;
        e?.AssignedItems && Array.isArray(e.AssignedItems) && e.AssignedItems.forEach((o) => {
          const i = o.value;
          V.set(i, a);
        });
      }
    } catch (n) {
      console.warn("无法构建图层映射表", n);
    }
  }, ve = (n) => {
    if (!n) return null;
    const r = typeof n == "number" ? C(n) : n;
    if (!r) return null;
    const s = v(r.Identification?.value, r.ItemReference?.value, r.Reference?.value) || "", t = v(r.Name?.value, r.Description?.value, r.Source?.value) || "", e = R([s, t]);
    return e.length > 0 ? e.join(" - ") : v(r.is_a) || null;
  }, Le = () => {
    try {
      const n = H(M, "IFCRELASSOCIATESCLASSIFICATION"), r = M.GetLineIDsWithType(x, n);
      for (let s = 0; s < r.size(); s++) {
        const t = C(r.get(s)), e = T(t?.RelatingClassification), a = e ? C(e) : t?.RelatingClassification, o = ve(a);
        o && P(t?.RelatedObjects).forEach((i) => {
          z.has(i) || z.set(i, []), z.get(i).push(o);
        });
      }
    } catch (n) {
      console.warn("无法构建分类映射表", n);
    }
  }, fe = (n, r = /* @__PURE__ */ new Set()) => {
    if (!n) return [];
    const s = T(n), t = typeof n == "number" || n?.value !== void 0 ? C(s) : n;
    if (s && r.has(s)) return [];
    if (s && r.add(s), !t) return [];
    const e = R([
      v(t.Name?.value),
      v(t.LayerSetName?.value),
      v(t.Category?.value)
    ]), o = ["Materials", "MaterialLayers", "MaterialProfiles", "MaterialConstituents"].flatMap(
      (c) => P(t[c]).flatMap((f) => fe(f, r))
    ), i = [t.ForLayerSet, t.ForProfileSet, t.Material].map(T).filter((c) => typeof c == "number").flatMap((c) => fe(c, r));
    return R([...e, ...o, ...i]);
  }, Oe = () => {
    try {
      const n = H(M, "IFCRELASSOCIATESMATERIAL"), r = M.GetLineIDsWithType(x, n);
      for (let s = 0; s < r.size(); s++) {
        const t = C(r.get(s)), e = fe(t?.RelatingMaterial);
        e.length !== 0 && P(t?.RelatedObjects).forEach((a) => {
          j.has(a) || j.set(a, []), j.get(a).push(...e);
        });
      }
    } catch (n) {
      console.warn("无法构建材质映射表", n);
    }
  }, $e = () => {
    try {
      const n = H(M, "IFCRELASSIGNSTOGROUP"), r = M.GetLineIDsWithType(x, n);
      for (let s = 0; s < r.size(); s++) {
        const t = C(r.get(s)), e = T(t?.RelatingGroup);
        if (!e) continue;
        const a = C(e);
        if (!a || a.is_a !== "IFCSYSTEM" && a.is_a !== "IFCDISTRIBUTIONSYSTEM") continue;
        const o = v(a.Name?.value, a.LongName?.value) || `${a.is_a} [${e}]`;
        P(t?.RelatedObjects).forEach((i) => {
          U.has(i) || U.set(i, []), U.get(i).push(o);
        });
      }
    } catch (n) {
      console.warn("无法构建系统映射表", n);
    }
  };
  D.userData.isIFC = !0, D.userData.ifcAPI = M, D.userData.modelID = x, D.userData.layerMap = V, D.userData.ifcGridDiagnostics = [];
  const Ce = (n, r, s, t = 36) => {
    const e = document.createElement("canvas"), a = e.getContext("2d");
    if (!a) return new l.Sprite();
    const o = 'bold 26px "Microsoft YaHei", Arial, sans-serif';
    a.font = o;
    const i = 14, c = Math.ceil(a.measureText(n).width);
    e.width = c + i * 2, e.height = 44, a.font = o, a.fillStyle = "rgba(255,255,255,0.92)", a.fillRect(0, 0, e.width, e.height), a.strokeStyle = s, a.lineWidth = 2, a.strokeRect(1, 1, e.width - 2, e.height - 2), a.fillStyle = "#111827", a.textAlign = "center", a.textBaseline = "middle", a.fillText(n, e.width / 2, e.height / 2);
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
    const r = T(n), t = (r ? C(r) : n)?.Coordinates;
    if (!t) return null;
    const e = Array.isArray(t) ? t.map((a) => a?.value ?? a) : [];
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
  }, Ve = (n, r, s = !0) => {
    const t = [], e = Math.max(2, r), a = s ? e - 1 : e;
    for (let o = 0; o < e; o++) {
      const i = a === 0 ? 0 : o / a;
      t.push(n(Math.min(1, Math.max(0, i))));
    }
    return t;
  }, de = /* @__PURE__ */ new Map(), te = (n, r) => {
    const s = T(n);
    if (!s) return r.clone();
    const e = C(s)?.DirectionRatios;
    if (!Array.isArray(e)) return r.clone();
    const a = new l.Vector3(
      Number(e[0]?.value ?? e[0] ?? r.x),
      Number(e[1]?.value ?? e[1] ?? r.y),
      Number(e[2]?.value ?? e[2] ?? r.z)
    );
    return a.lengthSq() > 0 ? a.normalize() : r.clone();
  }, ne = (n) => {
    const r = T(n), s = r ? C(r) : n;
    if (!s) return new l.Matrix4();
    const t = B(s.Location) || new l.Vector3(), e = te(s.Axis, new l.Vector3(0, 0, 1));
    let a = te(s.RefDirection, new l.Vector3(1, 0, 0)), o = new l.Vector3().crossVectors(e, a).normalize();
    return o.lengthSq() === 0 && (a = new l.Vector3(1, 0, 0), o = new l.Vector3(0, 1, 0)), a = new l.Vector3().crossVectors(o, e).normalize(), new l.Matrix4().makeBasis(a, o, e).setPosition(t);
  }, Fe = (n) => {
    const r = T(n);
    if (!r) return new l.Matrix4();
    if (de.has(r))
      return de.get(r).clone();
    const s = C(r);
    let t = new l.Matrix4();
    if (s?.is_a === "IFCLOCALPLACEMENT") {
      const e = ne(s.RelativePlacement), a = T(s.PlacementRelTo);
      t = a ? Fe(a).multiply(e) : e;
    } else (s?.is_a === "IFCAXIS2PLACEMENT3D" || s?.is_a === "IFCAXIS2PLACEMENT2D") && (t = ne(s));
    return de.set(r, t.clone()), t;
  }, _e = (n, r, s, t) => {
    const e = r.clone().invert(), a = n.clone().applyMatrix4(e);
    return Math.atan2(a.y / Math.max(t, 1e-6), a.x / Math.max(s, 1e-6));
  }, ze = (n, r) => {
    let s = r;
    for (; s <= n; )
      s += Math.PI * 2;
    return { startAngle: n, endAngle: s };
  }, me = (n, r, s, t = 0, e = Math.PI * 2) => {
    const a = ne(n), { startAngle: o, endAngle: i } = ze(t, e), c = Math.abs(i - o), f = Math.max(12, Math.ceil(c / (Math.PI * 2) * 48));
    return Ve((u) => {
      const d = o + (i - o) * u;
      return new l.Vector3(
        Math.cos(d) * r,
        Math.sin(d) * s,
        0
      ).applyMatrix4(a);
    }, f, !0);
  }, Se = (n, r, s, t) => {
    const e = Array.isArray(n.Trim1) ? n.Trim1 : [n.Trim1], a = Array.isArray(n.Trim2) ? n.Trim2 : [n.Trim2], o = ne(r.Position), i = (u) => {
      const d = B(u);
      return d ? _e(d, o, s, t) : O(u);
    }, c = e.map(i).find((u) => u !== null), f = a.map(i).find((u) => u !== null);
    return c === void 0 || f === void 0 ? null : me(r.Position, s, t, c, f);
  }, je = (n, r, s = new l.Vector3(0, 0, 1)) => {
    if (n.length < 2 || Math.abs(r) < 1e-6) return n;
    const t = [];
    for (let e = 0; e < n.length; e++) {
      const a = n[Math.max(0, e - 1)], i = n[Math.min(n.length - 1, e + 1)].clone().sub(a);
      if (i.lengthSq() < 1e-8) {
        t.push(n[e].clone());
        continue;
      }
      const c = new l.Vector3().crossVectors(s, i.normalize()).normalize();
      t.push(n[e].clone().addScaledVector(c, r));
    }
    return t;
  }, W = (n, r = /* @__PURE__ */ new Set()) => {
    const s = T(n), t = s ? C(s) : n;
    if (!t) return [];
    if (s && r.has(s)) return [];
    if (s && r.add(s), t.is_a === "IFCPOLYLINE")
      return P(t.Points).map((e) => B(e)).filter((e) => !!e);
    if (t.is_a === "IFCINDEXEDPOLYCURVE")
      return (C(T(t.Points) || 0)?.CoordList || []).map((o) => {
        const i = Array.isArray(o) ? o.map((c) => c?.value ?? c) : [];
        return new l.Vector3(Number(i[0] || 0), Number(i[1] || 0), Number(i[2] || 0));
      });
    if (t.is_a === "IFCCOMPOSITECURVE")
      return P(t.Segments).flatMap((e) => {
        const a = C(e), o = W(a?.ParentCurve, r);
        return a?.SameSense === !1 ? o.reverse() : o;
      });
    if (t.is_a === "IFCCURVESEGMENT") {
      const e = t.ParentCurve || t.BasisCurve || t.BaseCurve, a = W(e, r);
      return t.SameSense === !1 ? a.reverse() : a;
    }
    if (t.is_a === "IFCPCURVE")
      return W(t.ReferenceCurve || t.BasisCurve || t.OuterBoundary, r);
    if (t.is_a === "IFCOFFSETCURVE2D" || t.is_a === "IFCOFFSETCURVE3D") {
      const e = t.BasisCurve || t.ParentCurve || t.ReferenceCurve, a = W(e, r);
      if (a.length < 2) return a;
      const o = O(t.Distance || t.OffsetDistance) ?? 0, i = t.is_a === "IFCOFFSETCURVE3D" ? te(t.RefDirection, new l.Vector3(0, 0, 1)) : new l.Vector3(0, 0, 1);
      return je(a, o, i);
    }
    if (t.is_a === "IFCBSPLINECURVE" || t.is_a === "IFCBSPLINECURVEWITHKNOTS") {
      const e = (t.ControlPointsList || t.ControlPoints || []).map((a) => B(a)).filter((a) => !!a);
      if (e.length >= 2)
        return new l.CatmullRomCurve3(e).getPoints(Math.max(16, e.length * 6));
    }
    if (t.is_a === "IFCCIRCLE") {
      const e = O(t.Radius) ?? 1;
      return me(t.Position, e, e);
    }
    if (t.is_a === "IFCELLIPSE") {
      const e = O(t.SemiAxis1) ?? 1, a = O(t.SemiAxis2) ?? e;
      return me(t.Position, e, a);
    }
    if (t.is_a === "IFCTRIMMEDCURVE") {
      const e = T(t.BasisCurve) ? C(T(t.BasisCurve)) : t.BasisCurve;
      if (e?.is_a === "IFCCIRCLE") {
        const i = O(e.Radius) ?? 1, c = Se(t, e, i, i);
        if (c && c.length > 1) return c;
      }
      if (e?.is_a === "IFCELLIPSE") {
        const i = O(e.SemiAxis1) ?? 1, c = O(e.SemiAxis2) ?? i, f = Se(t, e, i, c);
        if (f && f.length > 1) return f;
      }
      const a = P(t.Trim1).map((i) => B(i)).filter((i) => !!i), o = P(t.Trim2).map((i) => B(i)).filter((i) => !!i);
      return a.length > 0 && o.length > 0 ? [a[0], o[0]] : W(t.BasisCurve, r);
    }
    if (t.is_a === "IFCLINE") {
      const e = B(t.Pnt) || new l.Vector3(), a = te(t.Dir?.Orientation, new l.Vector3(1, 0, 0)), i = 1e3 * (Number(t.Dir?.Magnitude?.value ?? t.Dir?.Magnitude ?? 1) || 1);
      return [
        e.clone().addScaledVector(a, -i),
        e.clone().addScaledVector(a, i)
      ];
    }
    return t.is_a === "IFCGRIDAXIS" ? W(t.AxisCurve, r) : (D.userData.ifcGridDiagnostics.push(t.is_a || `UnknownCurve:${s ?? "?"}`), []);
  }, J = /* @__PURE__ */ new Map();
  J.set(0, D);
  const Z = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), Ue = () => {
    const n = M.GetLineIDsWithType(x, K.IFCRELAGGREGATES);
    for (let s = 0; s < n.size(); s++) {
      const t = C(n.get(s)), e = t.RelatingObject.value, a = t.RelatedObjects.map((o) => o.value);
      se.has(e) || se.set(e, []), se.get(e).push(...a);
    }
    const r = M.GetLineIDsWithType(x, K.IFCRELCONTAINEDINSPATIALSTRUCTURE);
    for (let s = 0; s < r.size(); s++) {
      const t = C(r.get(s)), e = t.RelatingStructure.value, a = t.RelatedElements.map((o) => o.value);
      re.has(e) || re.set(e, []), re.get(e).push(...a);
    }
  }, Ee = /* @__PURE__ */ new Set(), ae = (n, r, s) => {
    const t = C(n);
    if (!t || Ee.has(n)) return;
    Ee.add(n);
    let e = r, a = s;
    const o = [
      "IFCPROJECT",
      "IFCSITE",
      "IFCBUILDING",
      "IFCBUILDINGSTOREY",
      "IFCSPACE",
      "IFCZONE"
    ], i = t.is_a || (t.type ? M.GetNameFromTypeCode(t.type) : "Item"), c = o.includes(i), f = v(t.Name?.value, t.LongName?.value, t.Description?.value) || `${i} [${n}]`, u = i === "IFCBUILDINGSTOREY" ? O(t.Elevation) : s.elevation, d = new l.Group();
    d.name = f, a = {
      storey: i === "IFCBUILDINGSTOREY" ? f : s.storey,
      elevation: u ?? void 0,
      path: c ? [...s.path, f] : s.path,
      container: i
    }, d.userData = {
      expressID: n,
      isSpatial: c,
      isIfcEntity: !0,
      type: t.is_a,
      ifcSpatial: a,
      ifcMetadata: {
        category: t.is_a,
        storey: a.storey,
        elevation: a.elevation,
        spatialPath: a.path,
        systems: [],
        materials: [],
        classifications: [],
        typeName: "",
        globalId: t.GlobalId?.value || ""
      }
    }, r.add(d), e = d, J.set(n, d), ue.set(n, a);
    const F = se.get(n);
    if (F)
      for (const h of F)
        ae(h, e, a);
    const y = re.get(n);
    if (y)
      for (const h of y)
        ae(h, e, a);
  };
  (() => {
    try {
      Ue();
      const n = M.GetLineIDsWithType(x, K.IFCPROJECT);
      if (n.size() > 0)
        for (let r = 0; r < n.size(); r++)
          ae(n.get(r), D, {
            storey: "",
            elevation: void 0,
            path: [],
            container: "IFCPROJECT"
          });
      else {
        const r = M.GetLineIDsWithType(x, K.IFCSITE);
        for (let s = 0; s < r.size(); s++)
          ae(r.get(s), D, {
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
      const n = H(M, "IFCGRID"), r = M.GetLineIDsWithType(x, n);
      if (!r || r.size() === 0) return;
      const s = new l.Group();
      s.name = "__IFCGridHelper", s.visible = !0, s.userData.isIfcGridHelper = !0;
      const t = [
        { key: "UAxes", color: "#d97706" },
        { key: "VAxes", color: "#2563eb" },
        { key: "WAxes", color: "#059669" }
      ], e = (a, o) => {
        const i = new l.Group();
        i.userData.isIfcGridHelper = !0;
        const f = new l.Box3().setFromPoints(a).getSize(new l.Vector3()), u = Math.max(f.x, f.y, f.z, 1), d = l.MathUtils.clamp(u * 2e-3, 0.6, 28), F = new l.MeshBasicMaterial({
          color: o,
          transparent: !0,
          opacity: 0.92,
          depthTest: !1,
          depthWrite: !1
        });
        for (let y = 0; y < a.length - 1; y++) {
          const h = a[y], I = a[y + 1], S = new l.Vector3().subVectors(I, h), b = S.length();
          if (b <= 1e-4) continue;
          const g = new l.Mesh(
            new l.CylinderGeometry(d, d, b, 10),
            F
          );
          g.position.copy(h).add(I).multiplyScalar(0.5), g.quaternion.setFromUnitVectors(
            new l.Vector3(0, 1, 0),
            S.normalize()
          ), g.renderOrder = 1e3, g.userData.isIfcGridHelper = !0, i.add(g);
        }
        return a.forEach((y) => {
          const h = new l.Mesh(
            new l.SphereGeometry(d * 1.15, 10, 10),
            F
          );
          h.position.copy(y), h.renderOrder = 1001, h.userData.isIfcGridHelper = !0, i.add(h);
        }), i;
      };
      for (let a = 0; a < r.size(); a++) {
        const o = C(r.get(a));
        o && t.forEach(({ key: i, color: c }) => {
          P(o[i]).forEach((f) => {
            const u = C(f), d = Fe(o?.ObjectPlacement), F = W(u?.AxisCurve).map(($) => $.clone().applyMatrix4(d));
            if (F.length < 2) return;
            s.add(e(F, c));
            const y = v(u?.AxisTag?.value, u?.Name?.value) || `${i}-${f}`, h = F[0], I = F[F.length - 1], S = h.distanceTo(I), b = l.MathUtils.clamp(S * 0.035, 10, 220), g = l.MathUtils.clamp(S * 2e-3, 0.6, 28), p = Math.max(g * 3.2, b * 0.12), N = new l.Vector3(p, p, g * 0.6);
            s.add(Ce(y, h.clone().add(N), c, b)), h.distanceTo(I) > 1 && s.add(Ce(y, I.clone().add(N), c, b));
          });
        });
      }
      s.children.length > 0 && (D.add(s), D.userData.ifcGridHelper = s);
    } catch (n) {
      console.warn("构建 IFC 轴网失败", n);
    }
  })();
  const Be = (typeof Q?.deferIfcProperties == "boolean" ? !!Q.deferIfcProperties : void 0) ?? X.byteLength > 20 * 1024 * 1024, We = () => {
    for (const [n, r] of Z.entries()) {
      const s = V.get(n);
      if (s)
        for (const t of r)
          t.userData.layer = s;
    }
  }, Me = () => {
    Re(), xe(), Pe(), Le(), Oe(), $e(), We();
  };
  Be ? (E(42, `${A("analyzing")}...`), D.userData.ifcMetadataReady = new Promise((n) => {
    setTimeout(() => {
      Me(), n();
    }, 0);
  })) : (Me(), D.userData.ifcMetadataReady = Promise.resolve());
  const _ = (n) => {
    let r = n.replace(/^(is|has|are)_/i, "");
    return ((t) => t.replace(/([A-Z])/g, " $1").replace(/^ /, ""))(r);
  }, He = (n) => n, Y = (n) => {
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
  }, Ie = (n, r = "", s = _) => {
    const t = {};
    return Object.keys(n).forEach((e) => {
      if (["expressID", "is_a", "type", "ID", "Name", "GlobalId"].includes(e)) return;
      const a = n[e], o = s(e), i = r ? `${r}.` : "";
      if (typeof a == "object" && a !== null && !Array.isArray(a)) {
        const c = Ie(a, i + o, s);
        Object.assign(t, c);
      } else {
        const c = i + o;
        t[c] = Y(a);
      }
    }), t;
  }, we = (n, r = "") => {
    const s = {}, t = {};
    let e = 0;
    const a = (i, c) => (i[c] || (i[c] = []), i[c]), o = (i, c, f, u, d) => {
      const F = Y(u);
      F === "" || F === null || F === void 0 || a(i, c).push({
        key: f,
        rawKey: d,
        value: F,
        id: `${c}::${f}::${a(i, c).length}`
      });
    };
    for (const i of n)
      try {
        const c = C(i);
        if (!c) continue;
        const f = c.Name?.value || `属性集_${i}`, u = _(f), d = `${r}${f}`;
        if (c.HasProperties) {
          o(s, u, "类型", c.is_a, "is_a"), o(t, d, "is_a", c.is_a), o(s, u, "描述", c.Description?.value, "Description"), o(t, d, "Description", c.Description?.value);
          for (const F of c.HasProperties) {
            const y = F.value, h = C(y);
            if (!h || !h.Name) continue;
            const I = h.Name.value;
            if (h.NominalValue) {
              o(s, u, _(I), h.NominalValue.value, I), o(t, d, I, h.NominalValue.value);
              continue;
            }
            const S = Ie(h, "", _), b = Ie(h, "", He);
            Object.entries(S).forEach(([g, p]) => {
              o(s, u, `${_(I)}.${g}`, p, `${I}.${g}`);
            }), Object.entries(b).forEach(([g, p]) => {
              o(t, d, `${I}.${g}`, p);
            });
          }
        }
        if (c.Quantities) {
          e += 1;
          const F = `${u}.数量`, y = `${d}.Quantities`;
          c.Quantities.forEach((h) => {
            const I = T(h) ? C(h.value) : h;
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
              I[g]?.value !== void 0 && (o(s, F, `${_(S)}.${_(g)}`, I[g].value, `${S}.${g}`), o(t, y, `${S}.${g}`, I[g].value));
            });
          });
        }
      } catch (c) {
        console.warn(`解析属性集${i}失败`, c);
      }
    return {
      normalizedGroups: s,
      rawGroups: t,
      quantityGroupCount: e
    };
  };
  D.userData.ifcManager = {
    getItemProperties: async (n, r) => {
      const s = {}, t = {}, e = (p, N, $, L, q) => {
        L === "" || L === null || L === void 0 || (p[N] || (p[N] = []), p[N].push({
          key: $,
          rawKey: q,
          value: String(L),
          id: `${N}::${$}::${p[N].length}`
        }));
      };
      let a = null;
      try {
        a = C(r), a && (e(s, "IFC 标识", "ExpressID", r, "expressID"), e(s, "IFC 标识", "类型", a.is_a || "Unknown", "is_a"), e(s, "IFC 标识", "全局ID", a.GlobalId?.value || "", "GlobalId"), e(s, "IFC 标识", "名称", a.Name?.value || "", "Name"), e(s, "IFC 标识", "描述", a.Description?.value || "", "Description"), e(s, "IFC 标识", "标签", a.Tag?.value || "", "Tag"), e(t, "IFC Entity", "expressID", r), e(t, "IFC Entity", "is_a", a.is_a || "Unknown"), e(t, "IFC Entity", "GlobalId", a.GlobalId?.value || ""), e(t, "IFC Entity", "Name", a.Name?.value || ""), e(t, "IFC Entity", "Description", a.Description?.value || ""), e(t, "IFC Entity", "Tag", a.Tag?.value || ""), Object.keys(a).forEach((p) => {
          if (["expressID", "is_a", "type", "ID", "GlobalId", "Name", "Description", "Tag"].includes(p)) return;
          const N = Y(a[p]);
          e(s, "IFC 标识", _(p), N, p), e(t, "IFC Entity", p, N);
        }));
      } catch (p) {
        console.warn("获取实体属性失败", p);
      }
      const o = k.get(r) || [];
      let i = 0;
      if (o.length > 0) {
        const p = we(o);
        Object.assign(s, p.normalizedGroups), Object.assign(t, p.rawGroups), i += p.quantityGroupCount;
      }
      const c = le.get(r);
      let f = "";
      if (c) {
        const p = C(c);
        f = p?.Name?.value || "", e(s, "IFC 类型", "类型实体", p?.is_a || ""), e(s, "IFC 类型", "类型名称", f), e(s, "IFC 类型", "类型ID", c), e(t, "IFC Type", "is_a", p?.is_a || ""), e(t, "IFC Type", "Name", f), e(t, "IFC Type", "expressID", c);
        const N = ee.get(c) || [];
        if (N.length > 0) {
          const $ = we(N, "TYPE:");
          Object.entries($.normalizedGroups).forEach(([L, q]) => {
            s[`Type Properties · ${L}`] = q.map((w) => ({ ...w }));
          }), Object.entries($.rawGroups).forEach(([L, q]) => {
            t[`TYPE:${L}`] = q.map((w) => ({ ...w }));
          });
        }
      }
      const u = ue.get(r), d = R([
        ...z.get(r) || [],
        ...c ? z.get(c) || [] : []
      ]), F = R([
        ...j.get(r) || [],
        ...c ? j.get(c) || [] : []
      ]), y = R([
        ...U.get(r) || [],
        ...c ? U.get(c) || [] : []
      ]);
      d.length > 0 && (e(s, "IFC 分类", "编码", d.join(", ")), e(t, "IFC Classification", "Items", d.join(", "))), F.length > 0 && (e(s, "IFC 材质", "材质名称", F.join(", ")), e(t, "IFC Material", "Names", F.join(", "))), y.length > 0 && (e(s, "IFC 系统", "系统名称", y.join(", ")), e(t, "IFC System", "Names", y.join(", "))), u && (e(s, "IFC 空间", "所在楼层", u.storey || ""), e(s, "IFC 空间", "楼层标高", u.elevation ?? ""), e(s, "IFC 空间", "空间路径", u.path.join(" / ")), e(s, "IFC 空间", "容器类型", u.container), e(t, "IFC Spatial", "Storey", u.storey || ""), e(t, "IFC Spatial", "Elevation", u.elevation ?? ""), e(t, "IFC Spatial", "Path", u.path.join(" / ")), e(t, "IFC Spatial", "Container", u.container));
      const I = (Z.get(r) || [])[0];
      if (I) {
        const p = Array.isArray(I.material) ? I.material[0] : I.material;
        p instanceof l.MeshStandardMaterial && (e(s, "IFC 渲染", "颜色", `#${p.color.getHexString().toUpperCase()}`), e(s, "IFC 渲染", "透明度", p.opacity.toFixed(2)), e(t, "IFC Render", "color", `#${p.color.getHexString().toUpperCase()}`), e(t, "IFC Render", "opacity", p.opacity.toFixed(2)));
      }
      const S = [];
      o.length === 0 && S.push("属性集"), c || S.push("类型属性"), d.length === 0 && S.push("分类编码"), F.length === 0 && S.push("材质关联"), y.length === 0 && S.push("系统关联"), u?.storey || S.push("楼层信息"), V.has(r) || S.push("图层信息");
      const b = R(
        P(a?.HasAssociations).map((p) => C(p)?.is_a).filter(
          (p) => !!p && ![
            "IFCRELASSOCIATESMATERIAL",
            "IFCRELASSOCIATESCLASSIFICATION",
            "IFCRELASSIGNSTOGROUP"
          ].includes(p)
        )
      ), g = R([
        ...b.map((p) => `关联:${p}`),
        ...a?.Representation ? ["表现样式/纹理细节"] : [],
        ...a?.ObjectPlacement ? ["放置与坐标系细节"] : []
      ]);
      return e(s, "IFC 解析诊断", "属性集", o.length > 0 ? `已解析 ${o.length} 组` : "未发现"), e(s, "IFC 解析诊断", "数量属性", i > 0 ? `已解析 ${i} 组` : "未发现"), e(s, "IFC 解析诊断", "类型属性", c ? "已解析" : "未发现"), e(s, "IFC 解析诊断", "分类编码", d.length > 0 ? `已解析 ${d.length} 条` : "未发现"), e(s, "IFC 解析诊断", "材质关联", F.length > 0 ? `已解析 ${F.length} 条` : "未发现"), e(s, "IFC 解析诊断", "系统关联", y.length > 0 ? `已解析 ${y.length} 条` : "未发现"), e(s, "IFC 解析诊断", "楼层识别", u?.storey ? u.storey : "未识别"), e(s, "IFC 解析诊断", "图层", V.has(r) ? "已解析" : "未发现"), e(s, "IFC 解析诊断", "文件未提供", S.length > 0 ? S.join("、") : "未发现"), e(s, "IFC 解析诊断", "当前未解析", g.length > 0 ? g.join("、") : "未发现"), e(t, "IFC Diagnostics", "PropertySets", o.length), e(t, "IFC Diagnostics", "QuantityGroups", i), e(t, "IFC Diagnostics", "TypeProperties", c ? "yes" : "no"), e(t, "IFC Diagnostics", "Classification", d.length), e(t, "IFC Diagnostics", "Material", F.length), e(t, "IFC Diagnostics", "System", y.length), e(t, "IFC Diagnostics", "Storey", u?.storey || ""), e(t, "IFC Diagnostics", "Layer", V.get(r) || ""), e(t, "IFC Diagnostics", "MissingInFile", S.join(", ")), e(t, "IFC Diagnostics", "CurrentlyUnparsed", g.join(", ")), {
        groups: t,
        normalizedGroups: s,
        rawGroups: t,
        filterMeta: {
          category: a?.is_a || "",
          typeName: f,
          storey: u?.storey || "",
          elevation: u?.elevation,
          spatialPath: u?.path || [],
          systems: y,
          materials: F,
          classifications: d
        }
      };
    },
    getExpressId: (n, r) => n.userData?.expressID
  }, E(50, A("building_geometry"));
  let ye = 0, he = 0;
  const ie = {}, Ae = (n, r = 1) => {
    const s = be(n), t = `${s.getHex()}-${r}`;
    return ie[t] || (ie[t] = new l.MeshStandardMaterial({
      color: s,
      transparent: r < 1,
      opacity: r,
      roughness: 0.76,
      metalness: 0.05,
      side: l.DoubleSide
    }), qe(ie[t])), ie[t];
  }, Ye = new l.Matrix4();
  M.StreamAllMeshes(x, (n) => {
    const r = n.geometries.size();
    he += r;
    for (let s = 0; s < r; s++) {
      const t = n.geometries.get(s), e = n.expressID, a = t.geometryExpressID, o = M.GetGeometry(x, a), i = M.GetVertexArray(o.GetVertexData(), o.GetVertexDataSize()), c = M.GetIndexArray(o.GetIndexData(), o.GetIndexDataSize()), f = new l.BufferGeometry(), u = new Float32Array(i.length / 2), d = new Float32Array(i.length / 2);
      for (let w = 0; w < i.length; w += 6)
        u[w / 2] = i[w], u[w / 2 + 1] = i[w + 1], u[w / 2 + 2] = i[w + 2], d[w / 2] = i[w + 3], d[w / 2 + 1] = i[w + 4], d[w / 2 + 2] = i[w + 5];
      f.setAttribute("position", new l.BufferAttribute(u, 3)), f.setAttribute("normal", new l.BufferAttribute(d, 3)), f.setIndex(new l.BufferAttribute(c, 1)), f.userData = { expressID: e, bimId: String(e) };
      const F = t.flatTransformation;
      Ye.fromArray(F);
      const y = t.color;
      let h;
      if (y) {
        const w = new l.Color(y.x, y.y, y.z).getHex();
        h = Ae(w, y.w);
      } else
        h = Ae(13421772);
      const I = new l.Mesh(f, h);
      I.matrixAutoUpdate = !1, I.matrix.fromArray(F), I.matrixWorldNeedsUpdate = !0, I.userData.expressID = e, I.userData.bimId = String(e), Z.has(e) || Z.set(e, []), Z.get(e).push(I), V.has(e) && (I.userData.layer = V.get(e));
      const S = C(e);
      try {
        const w = v(S?.is_a) || "Item", oe = v(S?.Name?.value, S?.LongName?.value, S?.Description?.value);
        I.name = oe ? `${w}: ${oe}` : `${w} [${e}]`;
      } catch {
        I.name = `IFC Item ${e}`;
      }
      const b = ue.get(e), g = le.get(e), p = g ? C(g) : null, N = R([
        ...z.get(e) || [],
        ...g ? z.get(g) || [] : []
      ]), $ = R([
        ...j.get(e) || [],
        ...g ? j.get(g) || [] : []
      ]), L = R([
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
        render: y ? {
          color: `#${be(new l.Color(y.x, y.y, y.z)).getHexString().toUpperCase()}`,
          opacity: Number(y.w ?? 1)
        } : void 0
      }, I.userData.ifcSpatial = b, (J.get(e) || D).add(I), ye++, he > 0) {
        const w = Math.min(1, ye / he), oe = 50 + Math.floor(w * 45);
        E(oe, A("building_geometry"));
      }
    }
  });
  const De = (n) => {
    if (n.isMesh || !n.userData?.isSpatial) return !0;
    const r = [];
    return n.children.forEach((s) => {
      De(s) || r.push(s);
    }), r.forEach((s) => {
      n.remove(s), J.delete(s.userData?.expressID);
    }), n.children.length > 0;
  }, Te = [];
  return D.children.forEach((n) => {
    De(n) || Te.push(n);
  }), Te.forEach((n) => {
    D.remove(n), J.delete(n.userData?.expressID);
  }), console.log(`Loaded ${ye} meshes from IFC.`), E(100, A("success")), D.rotateX(Math.PI / 2), D;
};
export {
  et as loadIFC
};
