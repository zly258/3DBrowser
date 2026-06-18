import * as p from "three";
import { t as E, a as _ } from "./utils-BKVlSVq3.js";
const D = new p.Color(13421772);
let g = null;
function M(e) {
  return e.replace(/occt-import-js\.wasm(?:\?.*)?$/i, "occt-import-js.js");
}
async function x(e) {
  if (g)
    return g;
  g = (async () => {
    const t = globalThis.window?.occtimportjs;
    if (typeof t == "function")
      return t({
        locateFile: (o) => o.endsWith(".wasm") ? e : o
      });
    const r = M(e);
    await new Promise((o, f) => {
      const a = document.querySelector('script[data-occt-import-js="true"]');
      if (a) {
        if (typeof globalThis.window?.occtimportjs == "function") {
          o();
          return;
        }
        a.addEventListener("load", () => o(), { once: !0 }), a.addEventListener("error", () => f(new Error(`Failed to load ${r}`)), { once: !0 });
        return;
      }
      const l = document.createElement("script");
      l.src = r, l.async = !0, l.dataset.occtImportJs = "true", l.onload = () => o(), l.onerror = () => f(new Error(`Failed to load ${r}`)), document.head.appendChild(l);
    });
    const i = globalThis.window?.occtimportjs;
    if (typeof i != "function")
      throw new TypeError("window.occtimportjs is not available after script load");
    return i({
      locateFile: (o) => o.endsWith(".wasm") ? e : o
    });
  })();
  try {
    return await g;
  } catch (t) {
    throw g = null, t;
  }
}
function A(e) {
  return !Array.isArray(e) || e.length < 3 ? D.clone() : E(new p.Color(e[0], e[1], e[2]));
}
function F(e) {
  const t = new p.MeshPhongMaterial({
    color: e,
    side: p.DoubleSide,
    flatShading: !1,
    shininess: 18,
    polygonOffset: !0,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
  });
  return _(t), t;
}
function C(e, t) {
  const r = t.getHex(), i = e.get(r);
  if (i) return i;
  const o = F(t);
  return e.set(r, o), o;
}
function S(e, t) {
  const r = new p.BufferGeometry();
  r.setAttribute("position", new p.Float32BufferAttribute(Array.from(e.attributes.position.array), 3)), e.attributes.normal?.array ? r.setAttribute("normal", new p.Float32BufferAttribute(Array.from(e.attributes.normal.array), 3)) : r.computeVertexNormals(), e.index?.array && r.setIndex(Array.from(e.index.array)), r.computeBoundingBox(), r.computeBoundingSphere();
  const i = A(e.color), o = C(t, i), f = Array.isArray(e.brep_faces) ? e.brep_faces : [], a = r.index ? r.index.count / 3 : r.attributes.position.count / 3;
  let l = o;
  if (a > 0 && f.length > 0) {
    const c = f.map((s) => ({
      first: Number(s.first),
      last: Number(s.last),
      color: s.color
    })).filter(
      (s) => Number.isFinite(s.first) && Number.isFinite(s.last) && s.first >= 0 && s.last >= s.first
    ).sort((s, u) => s.first - u.first);
    if (c.length > 0) {
      r.clearGroups();
      const s = [o];
      let u = 0;
      for (const m of c) {
        const n = Math.max(0, Math.min(a, m.first)), h = Math.max(n, Math.min(a, m.last + 1));
        n > u && r.addGroup(u * 3, (n - u) * 3, 0);
        const y = A(m.color ?? e.color ?? null);
        s.push(C(t, y)), r.addGroup(n * 3, (h - n) * 3, s.length - 1), u = Math.max(u, h);
      }
      u < a && r.addGroup(u * 3, (a - u) * 3, 0), l = s.length > 1 ? s : o;
    }
  }
  const d = new p.Mesh(r, l);
  return d.name = e.name || "CAD Part", d.userData = {
    ...e.userData || {},
    source: "OCCT",
    meshId: e.id,
    shapeName: e.name,
    color: i.getHex(),
    isAssembly: !!e.isAssembly,
    isComponent: !!e.isComponent
  }, d.frustumCulled = !0, d;
}
function b(e, t, r, i) {
  if (!t)
    return;
  const o = typeof t.name == "string" ? t.name.trim() : "", f = Array.isArray(t.meshes) ? t.meshes : [], a = Array.isArray(t.children) ? t.children : [], l = !!o || a.length > 0 || f.length > 1;
  let d = e;
  if (l) {
    const c = new p.Group();
    c.name = o || `CAD Node ${i}`, c.userData = {
      source: "OCCT",
      isCADNode: !0,
      nodeName: c.name
    }, e.add(c), d = c;
  }
  for (const c of f) {
    const s = r.get(c);
    s && d.add(s);
  }
  a.forEach((c, s) => {
    b(d, c, r, `${i}.${s}`);
  });
}
class N {
  constructor(t = "/libs/occt-import-js/occt-import-js.wasm") {
    this.wasmUrl = t, this.readParameters = {
      productContext: 1,
      assemblyLevel: 1,
      shapeRepr: 1,
      shapeAspect: 1,
      subShapesNames: 0,
      codePage: "UTF8",
      linearDeflection: 0.1,
      angularDeflection: 0.5
    };
  }
  async load(t, r, i) {
    if (!t || t.byteLength === 0)
      throw new Error(r("error_empty_file"));
    i && i(10, r("loading_cad_engine"));
    let o;
    try {
      o = await x(this.wasmUrl);
    } catch (n) {
      throw console.error("初始化 OCCT 引擎失败:", n), new Error(r("error_cad_engine_init_failed"));
    }
    i && i(30, r("parsing_cad_data"));
    const f = new Uint8Array(t);
    let a, l = null, d = null;
    try {
      a = o.ReadStepFile(f, {
        linearDeflection: this.readParameters.linearDeflection,
        angularDeflection: this.readParameters.angularDeflection,
        productContext: this.readParameters.productContext,
        assemblyLevel: this.readParameters.assemblyLevel,
        shapeRepr: this.readParameters.shapeRepr,
        shapeAspect: this.readParameters.shapeAspect,
        subShapesNames: this.readParameters.subShapesNames,
        codePage: this.readParameters.codePage
      });
    } catch (n) {
      l = n, console.warn("STEP 解析失败，正在尝试 IGES...", n);
    }
    if (!a || !a.success)
      try {
        a = o.ReadIgesFile(f, {
          linearDeflection: this.readParameters.linearDeflection,
          angularDeflection: this.readParameters.angularDeflection
        });
      } catch (n) {
        d = n, console.error("IGES 解析失败", n);
      }
    if (!a)
      throw new Error(r("error_cad_parse_failed") + " - " + r("error_no_parser_result"));
    if (!a.success) {
      let n = r("error_cad_parse_failed");
      throw a.error ? n += ` - ${a.error}` : l && d && (n += ` - STEP: ${l.message || "未知错误"}, IGES: ${d.message || "未知错误"}`), new Error(n);
    }
    if (!Array.isArray(a.meshes) || a.meshes.length === 0)
      throw new Error(r("error_cad_no_meshes"));
    i && i(70, r("creating_geometry"));
    const c = new p.Group();
    c.name = "CAD Model", c.userData = {
      source: "OCCT",
      isCADRoot: !0
    };
    const s = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map();
    a.meshes.forEach((n, h) => {
      u.set(h, S(n, s));
    });
    const m = a.root;
    return m && ((Array.isArray(m.meshes) ? m.meshes : []).forEach((y) => {
      const w = u.get(y);
      w && c.add(w);
    }), (Array.isArray(m.children) ? m.children : []).forEach((y, w) => {
      b(c, y, u, String(w));
    })), u.forEach((n) => {
      n.parent || c.add(n);
    }), c.updateMatrixWorld(!0), i && i(100, r("model_loaded")), c;
  }
}
export {
  N as OCCTLoader
};
