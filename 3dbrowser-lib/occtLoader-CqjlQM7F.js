import * as p from "three";
const E = new p.Color(13421772);
let g = null;
function _(e) {
  return e.replace(/occt-import-js\.wasm(?:\?.*)?$/i, "occt-import-js.js");
}
async function x(e) {
  if (g)
    return g;
  g = (async () => {
    const a = globalThis.window?.occtimportjs;
    if (typeof a == "function")
      return a({
        locateFile: (o) => o.endsWith(".wasm") ? e : o
      });
    const r = _(e);
    await new Promise((o, f) => {
      const t = document.querySelector('script[data-occt-import-js="true"]');
      if (t) {
        if (typeof globalThis.window?.occtimportjs == "function") {
          o();
          return;
        }
        t.addEventListener("load", () => o(), { once: !0 }), t.addEventListener("error", () => f(new Error(`Failed to load ${r}`)), { once: !0 });
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
  } catch (a) {
    throw g = null, a;
  }
}
function A(e) {
  return !Array.isArray(e) || e.length < 3 ? E.clone() : new p.Color(e[0], e[1], e[2]);
}
function D(e) {
  return new p.MeshPhongMaterial({
    color: e,
    side: p.DoubleSide,
    flatShading: !1,
    shininess: 30,
    polygonOffset: !0,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
  });
}
function b(e, a) {
  const r = a.getHex(), i = e.get(r);
  if (i) return i;
  const o = D(a);
  return e.set(r, o), o;
}
function M(e, a) {
  const r = new p.BufferGeometry();
  r.setAttribute("position", new p.Float32BufferAttribute(Array.from(e.attributes.position.array), 3)), e.attributes.normal?.array ? r.setAttribute("normal", new p.Float32BufferAttribute(Array.from(e.attributes.normal.array), 3)) : r.computeVertexNormals(), e.index?.array && r.setIndex(Array.from(e.index.array)), r.computeBoundingBox(), r.computeBoundingSphere();
  const i = A(e.color), o = b(a, i), f = Array.isArray(e.brep_faces) ? e.brep_faces : [], t = r.index ? r.index.count / 3 : r.attributes.position.count / 3;
  let l = o;
  if (t > 0 && f.length > 0) {
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
        const n = Math.max(0, Math.min(t, m.first)), h = Math.max(n, Math.min(t, m.last + 1));
        n > u && r.addGroup(u * 3, (n - u) * 3, 0);
        const y = A(m.color ?? e.color ?? null);
        s.push(b(a, y)), r.addGroup(n * 3, (h - n) * 3, s.length - 1), u = Math.max(u, h);
      }
      u < t && r.addGroup(u * 3, (t - u) * 3, 0), l = s.length > 1 ? s : o;
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
function C(e, a, r, i) {
  if (!a)
    return;
  const o = typeof a.name == "string" ? a.name.trim() : "", f = Array.isArray(a.meshes) ? a.meshes : [], t = Array.isArray(a.children) ? a.children : [], l = !!o || t.length > 0 || f.length > 1;
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
  t.forEach((c, s) => {
    C(d, c, r, `${i}.${s}`);
  });
}
class F {
  constructor(a = "/libs/occt-import-js/occt-import-js.wasm") {
    this.wasmUrl = a, this.readParameters = {
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
  async load(a, r, i) {
    if (!a || a.byteLength === 0)
      throw new Error(r("error_empty_file"));
    i && i(10, r("loading_cad_engine"));
    let o;
    try {
      o = await x(this.wasmUrl);
    } catch (n) {
      throw console.error("初始化 OCCT 引擎失败:", n), new Error(r("error_cad_engine_init_failed"));
    }
    i && i(30, r("parsing_cad_data"));
    const f = new Uint8Array(a);
    let t, l = null, d = null;
    try {
      t = o.ReadStepFile(f, {
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
    if (!t || !t.success)
      try {
        t = o.ReadIgesFile(f, {
          linearDeflection: this.readParameters.linearDeflection,
          angularDeflection: this.readParameters.angularDeflection
        });
      } catch (n) {
        d = n, console.error("IGES 解析失败", n);
      }
    if (!t)
      throw new Error(r("error_cad_parse_failed") + " - " + r("error_no_parser_result"));
    if (!t.success) {
      let n = r("error_cad_parse_failed");
      throw t.error ? n += ` - ${t.error}` : l && d && (n += ` - STEP: ${l.message || "未知错误"}, IGES: ${d.message || "未知错误"}`), new Error(n);
    }
    if (!Array.isArray(t.meshes) || t.meshes.length === 0)
      throw new Error(r("error_cad_no_meshes"));
    i && i(70, r("creating_geometry"));
    const c = new p.Group();
    c.name = "CAD Model", c.userData = {
      source: "OCCT",
      isCADRoot: !0
    };
    const s = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map();
    t.meshes.forEach((n, h) => {
      u.set(h, M(n, s));
    });
    const m = t.root;
    return m && ((Array.isArray(m.meshes) ? m.meshes : []).forEach((y) => {
      const w = u.get(y);
      w && c.add(w);
    }), (Array.isArray(m.children) ? m.children : []).forEach((y, w) => {
      C(c, y, u, String(w));
    })), u.forEach((n) => {
      n.parent || c.add(n);
    }), c.updateMatrixWorld(!0), i && i(100, r("model_loaded")), c;
  }
}
export {
  F as OCCTLoader
};
