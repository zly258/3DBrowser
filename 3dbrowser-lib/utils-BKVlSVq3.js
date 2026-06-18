import * as u from "three";
import { OrbitControls as Vt } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFExporter as Wt } from "three/examples/jsm/exporters/GLTFExporter.js";
const Nt = new u.Color("#7f8c99"), Ht = 0.24, $t = 0.68;
function _t(s) {
  return s instanceof u.Color ? s.clone() : new u.Color(s);
}
function Me(s) {
  const e = _t(s), t = { h: 0, s: 0, l: 0 };
  e.getHSL(t);
  const i = t.s, n = t.l, r = i > 0.7 ? 0.56 : i > 0.45 ? 0.64 : 0.78, o = u.MathUtils.clamp(i * r + 0.025, 0.06, 0.68);
  let a = n * 0.88 + 0.018;
  a = u.MathUtils.clamp(a, Ht, $t), e.setHSL(t.h, o, a);
  const c = i > 0.55 ? 0.055 : 0.025;
  return e.lerp(Nt, c), e;
}
function Le(s) {
  if (!s) return;
  const e = s, t = e.userData || (e.userData = {});
  t.__industrialRenderStyled || (e.color && e.color.isColor && e.color.copy(Me(e.color)), e.emissive && e.emissive.isColor && (e.emissive.multiplyScalar(0.12), typeof e.emissiveIntensity == "number" && (e.emissiveIntensity = Math.min(e.emissiveIntensity, 0.18))), "roughness" in e && (e.roughness = u.MathUtils.clamp(Math.max(e.roughness ?? 0, 0.72), 0, 1)), "metalness" in e && (e.metalness = u.MathUtils.clamp((e.metalness ?? 0.04) * 0.45, 0.02, 0.16)), "shininess" in e && (e.shininess = Math.min(e.shininess ?? 30, 18)), "envMapIntensity" in e && (e.envMapIntensity = Math.min(e.envMapIntensity ?? 0.35, 0.35)), s.side = u.DoubleSide, t.__industrialRenderStyled = !0, s.needsUpdate = !0);
}
function Qt() {
  const s = new u.MeshStandardMaterial({
    color: Me(14277857),
    roughness: 0.72,
    metalness: 0.05,
    side: u.DoubleSide
  });
  return Le(s), s;
}
function qt(s, e, t) {
  s.setClearColor(e, 1), s.outputColorSpace = u.SRGBColorSpace, s.toneMapping = u.ACESFilmicToneMapping, s.toneMappingExposure = t ?? 0.92;
}
function Xt(s) {
  let e = 0;
  if (s.attributes)
    for (const t in s.attributes) {
      const i = s.attributes[t];
      i.array && (e += i.array.byteLength);
    }
  return s.index && s.index.array && (e += s.index.array.byteLength), e / (1024 * 1024);
}
function Yt(s) {
  if (!s.getAttribute("position")) return new u.BoxGeometry(0.1, 0.1, 0.1);
  const e = new u.BufferGeometry(), t = s.getAttribute("position");
  if (t.isInterleavedBufferAttribute) {
    const r = new Float32Array(t.count * 3);
    for (let o = 0; o < t.count; o++)
      r[o * 3] = t.getX(o), r[o * 3 + 1] = t.getY(o), r[o * 3 + 2] = t.getZ(o);
    e.setAttribute("position", new u.BufferAttribute(r, 3));
  } else
    e.setAttribute("position", t.clone());
  const i = s.getAttribute("normal");
  if (i)
    if (i.isInterleavedBufferAttribute) {
      const r = new Float32Array(i.count * 3);
      for (let o = 0; o < i.count; o++)
        r[o * 3] = i.getX(o), r[o * 3 + 1] = i.getY(o), r[o * 3 + 2] = i.getZ(o);
      e.setAttribute("normal", new u.BufferAttribute(r, 3));
    } else
      e.setAttribute("normal", i.clone());
  else
    e.computeVertexNormals();
  const n = s.getIndex();
  if (n)
    e.setIndex(n.clone());
  else {
    const r = t.count, o = new Uint32Array(r);
    for (let a = 0; a < r; a++) o[a] = a;
    e.setIndex(new u.BufferAttribute(o, 1));
  }
  return e.deleteAttribute("uv"), e.deleteAttribute("uv2"), e.deleteAttribute("color"), e.computeBoundingBox(), e;
}
function ge(s) {
  if (s.userData.color !== void 0) return s.userData.color;
  const e = s.geometry;
  if (e && e.attributes.color) {
    const i = e.attributes.color;
    if (i.count > 0) {
      const n = i.getX(0), r = i.getY(0), o = i.getZ(0), a = new u.Color();
      return n > 1 || r > 1 || o > 1 ? a.setRGB(n / 255, r / 255, o / 255) : a.setRGB(n, r, o), a.getHex();
    }
  }
  const t = s.material;
  if (Array.isArray(t)) {
    for (const i of t)
      if (i.color) return i.color.getHex();
  } else if (t.color)
    return t.color.getHex();
  return jt(s.name);
}
function jt(s) {
  return 9741240;
}
function Zt(s) {
  const e = [], t = new u.Matrix4();
  return s.updateMatrixWorld(!0), s.traverse((i) => {
    if (i.isMesh) {
      const n = i, r = n.geometry, o = n.material;
      if (!r) return;
      r.boundingBox || r.computeBoundingBox();
      const a = n.matrixWorld, c = new u.Vector3();
      r.boundingBox.getCenter(c), c.applyMatrix4(a);
      const d = Array.isArray(o) ? o[0]?.uuid : o?.uuid, l = `${r.uuid}_${d}`;
      if (n.isInstancedMesh) {
        const h = n;
        for (let f = 0; f < h.count; f++) {
          h.getMatrixAt(f, t), t.premultiply(a);
          const p = new u.Vector3();
          r.boundingBox.getCenter(p), p.applyMatrix4(t), e.push({
            id: l,
            uuid: n.uuid,
            sourceMesh: n,
            expressID: h.userData.expressID,
            geometry: r,
            material: o,
            color: ge(n),
            matrix: t.clone(),
            center: p
          });
        }
      } else
        e.push({
          id: l,
          uuid: n.uuid,
          sourceMesh: n,
          expressID: n.userData.expressID,
          geometry: r,
          material: o,
          color: ge(n),
          matrix: a.clone(),
          center: c
        });
    }
  }), e;
}
async function Kt(s, e = {}) {
  const t = [], i = new u.Matrix4(), n = e.batchSize ?? 4e3;
  s.updateMatrixWorld(!0);
  const r = [];
  s.traverse((o) => {
    o.isMesh && r.push(o);
  });
  for (let o = 0; o < r.length; o += n) {
    const a = r.slice(o, o + n);
    for (const c of a) {
      const d = c, l = d.geometry, h = d.material;
      if (!l) continue;
      l.boundingBox || l.computeBoundingBox();
      const f = d.matrixWorld, p = new u.Vector3();
      l.boundingBox.getCenter(p), p.applyMatrix4(f);
      const m = Array.isArray(h) ? h[0]?.uuid : h?.uuid, y = `${l.uuid}_${m}`;
      if (d.isInstancedMesh) {
        const g = d;
        for (let M = 0; M < g.count; M++) {
          g.getMatrixAt(M, i), i.premultiply(f);
          const k = new u.Vector3();
          l.boundingBox.getCenter(k), k.applyMatrix4(i), t.push({
            id: y,
            uuid: d.uuid,
            sourceMesh: d,
            expressID: g.userData.expressID,
            geometry: l,
            material: h,
            color: ge(d),
            matrix: i.clone(),
            center: k
          });
        }
      } else
        t.push({
          id: y,
          uuid: d.uuid,
          sourceMesh: d,
          expressID: d.userData.expressID,
          geometry: l,
          material: h,
          color: ge(d),
          matrix: f.clone(),
          center: p
        });
    }
    e.onProgress?.(Math.min(o + a.length, r.length), r.length), await new Promise((c) => requestAnimationFrame(() => c()));
  }
  return t;
}
function nt(s, e, t, i = 0) {
  if (s.length <= t.maxItemsPerNode || i >= t.maxDepth)
    return { bounds: e.clone(), children: null, items: s, level: i };
  const n = e.getCenter(new u.Vector3()), r = e.min, o = e.max, a = Array(8).fill(null).map(() => []);
  for (const l of s) {
    const h = l.center, f = (h.x >= n.x ? 1 : 0) | (h.y >= n.y ? 2 : 0) | (h.z >= n.z ? 4 : 0);
    a[f].push(l);
  }
  const c = [];
  let d = !1;
  for (let l = 0; l < 8; l++)
    if (a[l].length > 0) {
      const h = new u.Vector3(l & 1 ? n.x : r.x, l & 2 ? n.y : r.y, l & 4 ? n.z : r.z), f = new u.Vector3(l & 1 ? o.x : n.x, l & 2 ? o.y : n.y, l & 4 ? o.z : n.z), p = new u.Box3(h, f);
      c.push(nt(a[l], p, t, i + 1)), d = !0;
    }
  return d ? { bounds: e.clone(), children: c, items: [], level: i } : { bounds: e.clone(), children: null, items: s, level: i };
}
async function Jt(s, e, t = {}) {
  if (s.length === 0) return null;
  const i = t.batchSize ?? 1200, n = t.yieldControl ?? (() => new Promise((y) => requestAnimationFrame(() => y())));
  let r = 0, o = 0;
  const a = /* @__PURE__ */ new Map(), c = [];
  for (let y = 0; y < s.length; y++) {
    const g = s[y];
    let M = a.get(g.geometry);
    M || (M = Yt(g.geometry), a.set(g.geometry, M)), c.push({
      ...g,
      geometry: M
    }), r += M.attributes.position.count, M.index && (o += M.index.count), y > 0 && y % i === 0 && await n();
  }
  Le(e);
  const d = new u.BatchedMesh(c.length, r, o, e);
  d.frustumCulled = !1, d.perInstanceFrustumCulling = !1;
  const l = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
  for (let y = 0; y < c.length; y++) {
    const g = c[y];
    let M = l.get(g.geometry);
    if (M === void 0 && (M = d.addGeometry(g.geometry), l.set(g.geometry, M)), M !== -1) {
      const k = d.addInstance(M);
      d.setMatrixAt(k, g.matrix), g.geometry.boundingBox || g.geometry.computeBoundingBox(), d.setBoundingBoxAt && d.setBoundingBoxAt(k, g.geometry.boundingBox);
      const b = Me(g.color), C = b.getHex();
      d.setColorAt(k, b), g.expressID !== void 0 && h.set(k, g.expressID), f.set(k, g.uuid), p.set(k, C), (d.userData.batchIdToRawColor ??= /* @__PURE__ */ new Map()).set(k, g.color), m.set(k, g.geometry);
    }
    y > 0 && y % i === 0 && await n();
  }
  return d.userData.batchIdToExpressId = h, d.userData.batchIdToUuid = f, d.userData.batchIdToColor = p, d.userData.batchIdToGeometry = m, d.computeBoundingBox(), d.computeBoundingSphere(), d;
}
function rt(s, e = []) {
  if (s.children)
    for (const t of s.children)
      rt(t, e);
  else s.items.length > 0 && e.push(s);
  return e;
}
function ei(s, e) {
  const t = Math.max(2, s), i = e === "smooth" ? 0.85 : e === "quality" ? 1.15 : 1, n = Math.max(20, Math.min(128, Math.floor(t * 10 * i))), r = Math.max(8, Math.min(48, Math.floor(t * 3 * i)));
  return {
    maxConcurrentChunkLoads: n,
    maxChunkLoadsPerFrame: r
  };
}
const ot = typeof window < "u" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
function Be(s, ...e) {
  ot && console.log(`[${s}]`, ...e);
}
function ti(s, ...e) {
  ot && console.warn(`[${s}]`, ...e);
}
function ii(s, e) {
  let t = 2166136261;
  for (let o = 0; o < s.length; o++)
    t ^= s.charCodeAt(o), t = Math.imul(t, 16777619);
  const i = (t >>> 0) / 4294967295 * Math.PI * 2, n = (t >>> 9 & 1023) / 1023 * 2 - 1, r = Math.sqrt(Math.max(0, 1 - n * n));
  return e.set(Math.cos(i) * r, Math.sin(i) * r, n).normalize(), e;
}
async function si(s) {
  const e = await s.slice(0, 1024).arrayBuffer(), t = new DataView(e);
  return {
    magic: t.getUint32(0, !0),
    version: t.getUint32(4, !0),
    manifestOffset: t.getUint32(8, !0),
    manifestLength: t.getUint32(12, !0)
  };
}
async function ni(s, e) {
  const i = await s.slice(e.manifestOffset, e.manifestOffset + e.manifestLength).text();
  return JSON.parse(i);
}
function ri(s) {
  if (s.rectElement) return s.rectElement;
  const e = document.createElement("div");
  return e.style.cssText = `
        position: fixed; border: 1px dashed #00aaff;
        background: rgba(0, 170, 255, 0.08); pointer-events: none; z-index: 1000;
    `, document.body.appendChild(e), s.rectElement = e, e;
}
function at(s) {
  const e = ri(s);
  e.style.left = `${Math.min(s.startX, s.endX)}px`, e.style.top = `${Math.min(s.startY, s.endY)}px`, e.style.width = `${Math.abs(s.endX - s.startX)}px`, e.style.height = `${Math.abs(s.endY - s.startY)}px`;
}
function oi() {
  return {
    active: !1,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    rectElement: null
  };
}
function ai(s, e, t) {
  const i = {
    ...s,
    active: !0,
    startX: e,
    startY: t,
    endX: e,
    endY: t
  };
  return at(i), { state: i, needsRender: !0 };
}
function ci(s, e, t) {
  if (!s.active)
    return { state: s, needsRender: !1 };
  const i = {
    ...s,
    endX: e,
    endY: t
  };
  return at(i), { state: i, needsRender: !0 };
}
function ct(s) {
  return s.rectElement && s.rectElement.remove(), {
    state: {
      ...s,
      active: !1,
      rectElement: null
    },
    needsRender: !0
  };
}
function hi(s, e, t) {
  if (!s.active)
    return {
      state: s,
      selected: [],
      needsRender: !1
    };
  const { state: i, needsRender: n } = ct(s), { startX: r, startY: o, endX: a, endY: c } = s, d = Math.abs(a - r), l = Math.abs(c - o);
  if (d < 5 || l < 5)
    return { state: i, selected: [], needsRender: n };
  const h = e.getBoundingClientRect(), f = (Math.min(r, a) - h.left) / h.width * 2 - 1, p = -(Math.max(o, c) - h.top) / h.height * 2 + 1, m = (Math.max(r, a) - h.left) / h.width * 2 - 1, y = -(Math.min(o, c) - h.top) / h.height * 2 + 1;
  return {
    state: i,
    selected: t(f, p, m, y),
    needsRender: n
  };
}
function Te(s) {
  return `${s.nbimFileId || "local"}:${s.byteOffset || 0}:${s.byteLength || 0}`;
}
function Ue(s) {
  return Number.isFinite(s?.byteOffset) && Number.isFinite(s?.byteLength) && s.byteLength > 0;
}
function ht(s, e) {
  const t = s.filter((i) => i !== e);
  return t.push(e), t;
}
function li(s) {
  const {
    chunkReadCache: e,
    chunkReadCacheOrder: t,
    cacheKey: i,
    buffer: n,
    chunkReadCacheSize: r
  } = s;
  e.set(i, n);
  let o = ht(t, i);
  for (; o.length > r; ) {
    const a = o.shift();
    a && e.delete(a);
  }
  return o;
}
async function ui(s) {
  const {
    chunk: e,
    nbimFiles: t,
    chunkReadCache: i,
    chunkReadCacheOrder: n,
    chunkReadCacheSize: r
  } = s, o = Te(e), a = i.get(o);
  if (a)
    return {
      buffer: a.slice(0),
      chunkReadCacheOrder: ht(n, o)
    };
  const c = t.get(e.nbimFileId);
  if (!c)
    throw new Error(`NBIM file not found for chunk: ${e.id}`);
  const d = await c.slice(e.byteOffset, e.byteOffset + e.byteLength).arrayBuffer();
  return {
    buffer: d,
    chunkReadCacheOrder: li({
      chunkReadCache: i,
      chunkReadCacheOrder: n,
      cacheKey: o,
      buffer: d.slice(0),
      chunkReadCacheSize: r
    })
  };
}
function di(s) {
  const {
    chunkIds: e,
    chunkPrefetchWindow: t,
    prefetchQueue: i,
    prefetchQueueSet: n,
    prefetchInFlight: r
  } = s;
  if (t <= 0)
    return i;
  const o = [...i];
  for (const a of e)
    n.has(a) || r.has(a) || (o.push(a), n.add(a));
  return o;
}
function fi(s) {
  const {
    visibleChunks: e,
    chunkPrefetchWindow: t,
    prefetchPaused: i,
    isCameraMoving: n,
    prefetchRoundRobinCursor: r,
    chunks: o,
    processingChunks: a,
    chunkReadCache: c,
    getChunkIndex: d
  } = s;
  if (t <= 0 || i || n || e.length === 0)
    return {
      chunkIds: [],
      prefetchRoundRobinCursor: r
    };
  const l = [];
  for (let h = 0; h < e.length && l.length < t; h++) {
    const f = e[(r + h) % e.length], p = d(f.id);
    if (p < 0) continue;
    const m = o[p + 1];
    if (!m || m.loaded || a.has(m.id) || !m.nbimFileId || !Ue(m)) continue;
    const y = Te(m);
    c.has(y) || l.push(m.id);
  }
  return {
    chunkIds: l,
    prefetchRoundRobinCursor: r + 1
  };
}
function pi(s) {
  const { chunk: e, unregisterOptimizedMeshMapping: t, cacheChunkMesh: i, ensureChunkGhost: n } = s;
  if (!e.loaded || !e.mesh)
    return {
      changed: !1,
      chunkLoadedCountDelta: 0
    };
  const r = e.mesh;
  return t(r), r.parent && r.parent.remove(r), i(e, r), n(e), e.mesh = null, e.loaded = !1, {
    changed: !0,
    chunkLoadedCountDelta: -1
  };
}
async function mi(s) {
  const {
    chunk: e,
    sharedMaterial: t,
    takeCachedChunkMesh: i,
    yieldToMainThread: n,
    nbimFiles: r,
    hasValidChunkBinaryRange: o,
    readChunkBuffer: a,
    nbimMeta: c,
    runWorkerTask: d,
    reconstructBatchedMesh: l,
    isCameraMoving: h,
    chunkPrefetchWindow: f,
    getChunkIndex: p,
    chunks: m,
    processingChunks: y
  } = s, g = i(e.id);
  if (g)
    return { mesh: g, prefetchCandidates: [] };
  if (e.node)
    return { mesh: await Jt(e.node.items, t, {
      batchSize: 1200,
      yieldControl: () => n()
    }), prefetchCandidates: [] };
  if (e.nbimFileId && r.has(e.nbimFileId) && o(e)) {
    const M = await a(e), k = c.get(e.nbimFileId), b = k?.version ?? 8;
    if (b !== 8)
      throw new Error(`Unsupported NBIM version: ${b}. Only V8 is supported.`);
    const C = await d({
      buffer: M,
      version: b,
      originalUuid: e.originalUuid,
      bimIdTable: k?.bimIdTable
    }, [M]), x = l(C, t), w = [];
    if (!h && f > 0) {
      const P = p(e.id);
      if (P >= 0)
        for (let I = 1; I <= f; I++) {
          const R = m[P + I];
          if (!R) break;
          R.loaded || y.has(R.id) || !R.nbimFileId || !o(R) || w.push(R.id);
        }
    }
    return { mesh: x, prefetchCandidates: w };
  }
  return { mesh: null, prefetchCandidates: [] };
}
function gi(s) {
  const {
    chunk: e,
    mesh: t,
    cancelledChunkIds: i,
    chunkIdSet: n,
    disposeChunkMesh: r,
    globalOffset: o,
    contentGroup: a,
    registerOptimizedMeshMapping: c
  } = s;
  if (i.has(e.id) || !n.has(e.id))
    return r(t), { attached: !1 };
  t.name = e.id, t.castShadow = !0, t.receiveShadow = !0, t.userData.chunkId = e.id, t.userData.originalUuid = e.originalUuid, e.nbimFileId && (t.position.sub(o), t.updateMatrixWorld(!0));
  let d = a.getObjectByName(e.groupName);
  return d || (d = new u.Group(), d.name = e.groupName, d.userData.isOptimizedGroup = !0, d.userData.originalUuid = e.originalUuid, a.add(d)), d.add(t), e.mesh = t, c(t), { attached: !0 };
}
function yi(s) {
  const {
    chunk: e,
    loadedNow: t,
    now: i,
    chunkLoadedCount: n,
    chunkWarmupActive: r,
    initialChunkLoadTarget: o,
    deactivateFastPreviewForModel: a
  } = s;
  let c = n, d = r, l = !1;
  return t && !e.loaded && (e.loaded = !0, c++, e.lastVisibleAt = i, e.lastFocusAt = i, e.originalUuid && a(e.originalUuid), d && c >= o && (d = !1), l = !0), {
    nextChunkLoadedCount: c,
    nextChunkWarmupActive: d,
    progressChanged: l
  };
}
function Mi(s) {
  const { chunkId: e, ghostGroup: t, releaseGhostLine: i } = s, n = t.getObjectByName(`ghost_${e}`);
  return n ? (t.remove(n), i(n), { changed: !0 }) : { changed: !1 };
}
function bi(s) {
  const {
    isCameraMoving: e,
    loadedChunks: t,
    maxLoadedChunks: i,
    cameraPos: n,
    now: r,
    chunkResidencyMs: o
  } = s;
  if (e || t.length <= i)
    return [];
  const a = [...t].sort(
    (l, h) => h.center.distanceToSquared(n) - l.center.distanceToSquared(n)
  ), c = a.length - i, d = [];
  for (const l of a) {
    if (d.length >= c)
      break;
    const h = Math.max(l.lastVisibleAt || 0, l.lastFocusAt || 0);
    r - h < o || (!l.mesh || !l.mesh.visible) && d.push(l);
  }
  return d;
}
function Ci(s) {
  const {
    toLoad: e,
    now: t,
    chunkLoadResumeAt: i,
    maxConcurrentChunkLoads: n,
    processingChunkCount: r,
    chunkWarmupActive: o,
    chunkLoadedCount: a,
    initialChunkLoadTarget: c,
    warmupChunkBoost: d,
    getChunkFrameBudget: l,
    phase: h,
    profile: f
  } = s;
  if (e.length === 0 || t < i)
    return [];
  const p = [...e].sort((k, b) => b.priority - k.priority), m = n - r;
  if (m <= 0)
    return [];
  const y = o && a < c ? d : 0, g = l(h, f, y), M = Math.min(m, g, p.length);
  return p.slice(0, M);
}
function ki(s) {
  const { data: e, material: t, resolveUuidByBimId: i } = s, { geometries: n, instances: r, originalUuid: o } = e, a = n.some((b) => b.index && b.index.length > 0), c = n.map((b) => {
    const C = new u.BufferGeometry();
    if (C.setAttribute("position", new u.BufferAttribute(b.position, 3)), C.setAttribute("normal", new u.BufferAttribute(b.normal, 3)), b.index && b.index.length > 0)
      C.setIndex(new u.BufferAttribute(b.index, 1));
    else if (a) {
      const x = b.position.length / 3, w = new Uint32Array(x);
      for (let P = 0; P < x; P++)
        w[P] = P;
      C.setIndex(new u.BufferAttribute(w, 1));
    }
    return C;
  });
  let d = 0, l = 0;
  c.forEach((b) => {
    d += b.attributes.position.count, b.index && (l += b.index.count);
  }), Le(t);
  const h = new u.BatchedMesh(r.length, d, l, t);
  h.frustumCulled = !1, h.perInstanceFrustumCulling = !1;
  const f = c.map((b) => h.addGeometry(b)), p = new u.Matrix4(), m = new u.Color(), y = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map();
  return r.forEach((b) => {
    m.copy(Me(b.color)), p.fromArray(b.matrix);
    const C = h.addInstance(f[b.geoIdx]);
    h.setMatrixAt(C, p), h.setColorAt(C, m);
    const x = c[b.geoIdx];
    x.boundingBox || x.computeBoundingBox(), x.boundingBox && h.setBoundingBoxAt && h.setBoundingBoxAt(C, x.boundingBox);
    const w = b.bimId;
    y.set(C, i(o, w)), g.set(C, w), M.set(C, m.getHex()), (h.userData.batchIdToRawColor ??= /* @__PURE__ */ new Map()).set(C, b.color), k.set(C, x);
  }), h.userData.batchIdToUuid = y, h.userData.batchIdToBimId = g, h.userData.batchIdToColor = M, h.userData.batchIdToGeometry = k, h.computeBoundingBox(), h.computeBoundingSphere(), h;
}
async function xi(s) {
  const {
    prefetchPaused: e,
    isCameraMoving: t,
    prefetchQueue: i,
    prefetchQueueSet: n,
    prefetchInFlight: r,
    maxWorkers: o,
    getChunkById: a,
    chunkReadCache: c,
    readChunkBuffer: d,
    processQueue: l
  } = s;
  if (e || t || i.length === 0)
    return;
  const h = Math.max(1, Math.min(4, Math.floor(o / 2)));
  for (; !e && !t && i.length > 0 && r.size < h; ) {
    const f = i.shift();
    if (!f) break;
    n.delete(f);
    const p = a(f);
    if (!p || !p.nbimFileId || !Ue(p))
      continue;
    const m = Te(p);
    c.has(m) || (r.add(f), d(p).catch((y) => {
      ti("SceneManager/prefetch", `prefetch failed for ${f}`, y);
    }).finally(() => {
      r.delete(f), i.length > 0 && l();
    }));
  }
}
function wi(s) {
  const { mesh: e, sharedMaterial: t } = s;
  e.geometry && e.geometry.dispose(), e.material && e.material !== t && (Array.isArray(e.material) ? e.material : [e.material]).forEach((n) => n.dispose && n.dispose());
}
function lt(s, e) {
  return [...s.filter((t) => t !== e), e];
}
function Si(s) {
  const {
    chunk: e,
    mesh: t,
    chunkMeshCache: i,
    chunkCacheOrder: n,
    maxCachedChunks: r,
    disposeChunkMesh: o
  } = s;
  if (i.has(e.id)) {
    const c = i.get(e.id);
    c !== t && o(c);
  }
  i.set(e.id, t);
  let a = lt(n, e.id);
  for (; a.length > r; ) {
    const c = a.shift();
    if (!c) break;
    const d = i.get(c);
    d && (i.delete(c), o(d));
  }
  return {
    chunkMeshCache: i,
    chunkCacheOrder: a
  };
}
function vi(s) {
  const { chunkId: e, chunkMeshCache: t, chunkCacheOrder: i } = s, n = t.get(e) || null;
  return n ? (t.delete(e), {
    mesh: n,
    chunkCacheOrder: i.filter((r) => r !== e)
  }) : {
    mesh: null,
    chunkCacheOrder: i
  };
}
function Ii(s) {
  const { chunkMeshCache: e, chunkCacheOrder: t, disposeChunkMesh: i, filter: n } = s;
  for (const [r, o] of e.entries())
    n && !n(r, o) || (i(o), e.delete(r));
  return t.filter((r) => e.has(r));
}
function Bi(s) {
  const { mesh: e, optimizedMapping: t } = s, i = e.userData.batchIdToUuid;
  if (i)
    for (const [n, r] of i.entries()) {
      const o = t.get(r);
      if (!o) continue;
      const a = o.findIndex((c) => c.mesh === e && c.instanceId === n);
      a !== -1 && o.splice(a, 1), o.length === 0 && t.delete(r);
    }
}
function Pi(s) {
  const { mesh: e, optimizedMapping: t } = s, i = e.userData.batchIdToUuid, n = e.userData.batchIdToColor, r = e.userData.batchIdToGeometry;
  if (i)
    for (const [o, a] of i.entries()) {
      t.has(a) || t.set(a, []);
      const c = n?.get(o) ?? 16777215, d = r?.get(o);
      t.get(a).push({
        mesh: e,
        instanceId: o,
        originalColor: c,
        geometry: d
      });
    }
}
function Ri(s) {
  const { ghostMeshPool: e, ghostEdgesGeometry: t, ghostMaterial: i } = s, n = e.pop();
  return n ? (n.visible = !0, n) : new u.LineSegments(t, i);
}
function Di(s) {
  const { line: e, ghostMeshPool: t } = s;
  e.visible = !1, e.name = "", e.scale.set(1, 1, 1), e.position.set(0, 0, 0), e.material instanceof u.LineBasicMaterial && (e.material.opacity = 0.3), t.push(e);
}
function Ai(s) {
  const { name: e, bounds: t, acquireGhostLine: i } = s, n = new u.Vector3(), r = new u.Vector3();
  t.getSize(n), t.getCenter(r);
  const o = i();
  return o.name = e, o.scale.copy(n), o.position.copy(r), o;
}
function Li(s) {
  const { chunk: e, ghostGroup: t, createGhostLine: i } = s;
  if (t.getObjectByName(`ghost_${e.id}`))
    return;
  const n = i(`ghost_${e.id}`, e.bounds);
  t.add(n);
}
function Ti(s) {
  const { workerQueue: e, data: t, transferables: i, processQueue: n } = s;
  return new Promise((r, o) => {
    e.push({ resolve: r, reject: o, data: t, transferables: i }), n();
  });
}
function Ui(s) {
  const {
    activeWorkerCount: e,
    maxWorkers: t,
    workerQueue: i,
    workers: n,
    createWorker: r,
    getActiveWorkerCount: o,
    onActiveWorkerCountChange: a,
    processQueue: c
  } = s;
  if (e >= t || i.length === 0)
    return;
  const d = i.shift();
  a(e + 1);
  const l = n.pop() ?? r(), h = (p) => {
    l.removeEventListener("message", h), l.removeEventListener("error", f), n.push(l), a(Math.max(0, o() - 1)), p.data.type === "success" ? d.resolve(p.data.result) : d.reject(new Error(p.data.error)), c();
  }, f = (p) => {
    l.removeEventListener("message", h), l.removeEventListener("error", f), a(Math.max(0, o() - 1)), d.reject(new Error(p.message)), c();
  };
  l.addEventListener("message", h), l.addEventListener("error", f), l.postMessage(d.data, d.transferables);
}
function Oi(s) {
  const { workers: e, workerQueue: t, rejectReason: i } = s;
  for (const n of e)
    try {
      n.terminate();
    } catch (r) {
      console.warn("Worker terminate failed:", r);
    }
  t.length > 0 && t.splice(0, t.length).forEach((r) => r.reject(new Error(i)));
}
function zi(s) {
  const { chunk: e, padding: t, tempSize: i } = s;
  if (!e.paddedBounds || e._padding !== t) {
    const n = e.bounds.getSize(i), r = e.bounds.clone();
    r.expandByVector(n.multiplyScalar(t)), e.paddedBounds = r, e._padding = t;
  }
  e.center || (e.center = e.bounds.getCenter(new u.Vector3()));
}
function Fi(s) {
  const {
    chunk: e,
    chunkIndex: t,
    totalChunks: i,
    now: n,
    phase: r,
    profile: o,
    performanceMode: a,
    isBoxClipped: c,
    maxRenderDistance: d,
    cameraPos: l,
    cameraForward: h,
    projScreenMatrix: f,
    toChunkDirection: p,
    tempCenterNdc: m,
    viewHeight: y,
    canvasHeight: g,
    sampleUnloadedWhileMoving: M,
    movingSampleStride: k,
    movingSampleSeed: b,
    resolveShouldRefreshPeripheral: C,
    chunkWarmupActive: x,
    chunkLoadedCount: w,
    initialChunkLoadTarget: P,
    chunkLoadResumeAt: I,
    chunkMeshCached: R
  } = s;
  p.copy(e.center).sub(l);
  const T = p.length(), D = T < d;
  if (M && !e.loaded && t % k !== b)
    return {
      shouldSkipSample: !0,
      shouldBeVisible: !1,
      effectiveVisible: !1,
      isPeripheralWhileMoving: !1,
      shouldRefreshPeripheral: !0,
      centerPriorityWindow: !1,
      isPeripheralCandidate: !1,
      priority: null,
      dist: T,
      centrality: 0,
      forwardness: 0,
      pixelSize: 0
    };
  const S = e.bounds.getSize(new u.Vector3()).length() / y * g, E = m.copy(e.center).applyMatrix4(f), N = Math.sqrt(E.x * E.x + E.y * E.y), v = 1 - Math.min(1, N), A = T > 1e-5 ? Math.max(0, h.dot(p.divideScalar(T))) : 1, z = S < 4, $ = r === "moving" && v < o.movingFocusCentralityThreshold && S < o.movingFocusPixelThreshold, F = s.inFrustum && !c && D && !z && !$, H = Math.max(e.lastVisibleAt || 0, e.lastFocusAt || 0), G = r === "moving" && s.inFrustum && !c && D && !z && n - H < o.chunkVisibilityHoldMs, V = v < o.movingCoreCentralityThreshold && S < o.movingCorePixelThreshold && A < o.movingCoreForwardThreshold, Z = C(V), re = r === "moving" && V && !Z ? e.lastEffectiveVisible ?? e.mesh?.visible ?? !1 : F || G, te = x || n < I + o.centerPriorityWindowMs, ie = v < o.centerPriorityThreshold && A < o.forwardPriorityThreshold && S < 96;
  let K = null;
  if (!e.loaded && F) {
    const Q = v > 0.8 ? 4.5 : v > 0.62 ? 2.8 : 1, q = Math.min(8, S / 120), J = 1e3 / (T + 1), le = A * 550, W = R ? 420 : 0, _ = x && w < P ? v > 0.65 ? 1500 : v > 0.45 ? 500 : 0 : 0, ue = r === "moving" ? v > 0.65 || A > 0.7 ? 900 : v > 0.4 ? 250 : -250 : 0;
    r === "moving" && v < 0.08 && S < 18 || r === "moving" && V && !Z || r !== "moving" && te && ie || r === "moving" && a === "smooth" && v < 0.3 && S < 54 && A < 0.62 || (K = ue + W + _ + le + Q * 1e3 + q * 120 + J + v * 300);
  }
  return {
    shouldSkipSample: !1,
    shouldBeVisible: F,
    effectiveVisible: re,
    isPeripheralWhileMoving: V,
    shouldRefreshPeripheral: Z,
    centerPriorityWindow: te,
    isPeripheralCandidate: ie,
    priority: K,
    dist: T,
    centrality: v,
    forwardness: A,
    pixelSize: S
  };
}
function Ei(s) {
  const { now: e, total: t, loaded: i, lastReportedProgress: n, lastChunkProgressReportAt: r } = s, o = i !== n.loaded || t !== n.total, a = t === 0 || t > 0 && i >= t, c = e - r >= 48;
  return {
    shouldNotify: o && (c || a),
    nextProgress: { loaded: i, total: t },
    nextReportedAt: a || c ? e : r
  };
}
function Gi(s) {
  const { chunkCount: e, compact: t, balanced: i, massive: n } = s;
  return e > 2e3 ? n : e > 600 ? i : t;
}
function Vi(s) {
  const {
    forceMaxChunkLoadSpeed: e,
    maxChunkLoadsPerFrame: t,
    performanceMode: i,
    chunkCount: n,
    phase: r,
    profile: o,
    warmupExtra: a
  } = s;
  if (e)
    return t + a;
  const c = n > 2e3, d = n > 600;
  if (r === "moving") {
    const l = Math.max(
      o.movingLoadBudgetMin,
      Math.min(o.movingLoadBudgetMax, Math.floor(t / 4))
    );
    return i === "smooth" ? c ? Math.max(1, Math.floor(l * 0.35)) : d ? Math.max(1, Math.floor(l * 0.5)) : Math.max(1, Math.floor(l * 0.7)) : c ? Math.max(1, Math.floor(l * 0.55)) : d ? Math.max(1, Math.floor(l * 0.75)) : l;
  }
  if (r === "recovery") {
    const l = Math.max(
      o.recoveryLoadBudgetMin,
      Math.min(
        o.recoveryLoadBudgetMax,
        Math.floor(t * o.recoveryLoadBudgetRatio)
      )
    ), h = i === "smooth" ? Math.max(2, Math.floor(l * 0.6)) : 0;
    return l + h + a;
  }
  return t + a;
}
function Wi(s) {
  const { centrality: e, pixelSize: t, forwardness: i, profile: n } = s;
  return e < n.movingCoreCentralityThreshold && t < n.movingCorePixelThreshold && i < n.movingCoreForwardThreshold;
}
function Ni(s) {
  const {
    now: e,
    isCameraMoving: t,
    chunkIndex: i,
    totalChunks: n,
    profile: r,
    movingPeripheralCursor: o,
    movingPeripheralLastRefreshAt: a
  } = s;
  if (!t || n === 0)
    return {
      shouldRefresh: !0,
      movingPeripheralCursor: o,
      movingPeripheralLastRefreshAt: a
    };
  let c = o, d = a;
  if (e - d >= r.movingPeripheralRefreshMs) {
    const m = Math.min(
      n,
      Math.max(r.movingPeripheralMinBatchSize, Math.ceil(n * r.movingPeripheralBatchRatio))
    );
    c = (c + m) % n, d = e;
  }
  const l = Math.min(
    n,
    Math.max(r.movingPeripheralMinBatchSize, Math.ceil(n * r.movingPeripheralBatchRatio))
  ), h = c, f = h + l;
  return {
    shouldRefresh: f <= n ? i >= h && i < f : i >= h || i < f % n,
    movingPeripheralCursor: c,
    movingPeripheralLastRefreshAt: d
  };
}
const Hi = [16711680, 16711680, 65280, 65280, 255, 255];
function ut(s) {
  return s.map((e) => e.clone());
}
function ne(s, e, t, i, n, r, o) {
  if (!s) return;
  const a = r && o;
  s.visible = a, s.scale.set(Math.max(i, 1e-3), Math.max(n, 1e-3), 1), s.position.copy(t), s.lookAt(t.clone().add(e)), s.children.forEach((c) => {
    c.visible = a;
  });
}
function $i(s) {
  const e = [
    new u.Plane(new u.Vector3(1, 0, 0), 0),
    new u.Plane(new u.Vector3(-1, 0, 0), 0),
    new u.Plane(new u.Vector3(0, 1, 0), 0),
    new u.Plane(new u.Vector3(0, -1, 0), 0),
    new u.Plane(new u.Vector3(0, 0, 1), 0),
    new u.Plane(new u.Vector3(0, 0, -1), 0)
  ];
  s.renderer.clippingPlanes = [], s.clipHelpersGroup.clear();
  const t = Hi.map((i) => {
    const n = new u.PlaneGeometry(1, 1), r = new u.MeshBasicMaterial({
      color: i,
      transparent: !0,
      opacity: s.state.clipHelperOpacity,
      side: u.DoubleSide,
      depthWrite: !1,
      polygonOffset: !0,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
      clippingPlanes: []
    }), o = new u.Mesh(n, r);
    o.visible = !1, o.renderOrder = 9999;
    const a = new u.EdgesGeometry(n), c = new u.LineSegments(a, new u.LineBasicMaterial({
      color: i,
      transparent: !0,
      opacity: Math.min(1, s.state.clipHelperOpacity + 0.08),
      depthWrite: !1
    }));
    return c.visible = !1, c.renderOrder = 1e4, o.add(c), s.clipHelpersGroup.add(o), o;
  });
  return {
    state: {
      ...s.state,
      clippingPlanes: e,
      clipPlaneHelpers: t
    },
    needsRender: !1
  };
}
function _i(s, e) {
  const t = {
    ...s.state,
    clippingPlanes: ut(s.state.clippingPlanes),
    clipPlaneHelpers: [...s.state.clipPlaneHelpers],
    clipHelperVisible: typeof e.visible == "boolean" ? e.visible : s.state.clipHelperVisible,
    clipHelperOpacity: typeof e.opacity == "number" && !Number.isNaN(e.opacity) ? u.MathUtils.clamp(e.opacity, 0.05, 0.35) : s.state.clipHelperOpacity
  };
  return t.clipPlaneHelpers.forEach((i) => {
    const n = i.material;
    n.opacity = t.clipHelperOpacity, n.needsUpdate = !0, i.children.forEach((r) => {
      const o = r.material;
      o && (o.opacity = Math.min(1, t.clipHelperOpacity + 0.08), o.needsUpdate = !0);
    });
  }), t.clipPlaneHelpers.forEach((i, n) => {
    const r = s.state.clippingPlanes[n], o = !!r && Number.isFinite(r.constant) && r.constant !== 1 / 0, a = t.clipHelperVisible && s.renderer.clippingPlanes.length > 0 && o;
    i.visible = a, i.children.forEach((c) => {
      c.visible = a;
    });
  }), { state: t, needsRender: !0 };
}
function Qi(s, e, t, i) {
  if (e.isEmpty())
    return { state: s.state, needsRender: !1 };
  const n = ut(s.state.clippingPlanes), r = [...s.state.clipPlaneHelpers], o = { ...s.state, clippingPlanes: n, clipPlaneHelpers: r }, { min: a, max: c } = e, d = c.clone().sub(a), l = a.x + t.x[0] / 100 * d.x, h = a.x + t.x[1] / 100 * d.x, f = a.y + t.y[0] / 100 * d.y, p = a.y + t.y[1] / 100 * d.y, m = a.z + t.z[0] / 100 * d.z, y = a.z + t.z[1] / 100 * d.z, g = s.renderer.clippingPlanes.length > 0, M = new u.Vector3(
    i.x ? l : a.x,
    i.y ? f : a.y,
    i.z ? m : a.z
  ), k = new u.Vector3(
    i.x ? h : c.x,
    i.y ? p : c.y,
    i.z ? y : c.z
  ), b = M.clone().add(k).multiplyScalar(0.5), C = k.clone().sub(M), x = 5e-4;
  return i.x ? (n[0].constant = -l, n[1].constant = h, ne(
    r[0],
    new u.Vector3(1, 0, 0),
    new u.Vector3(l + x, b.y, b.z),
    C.z,
    C.y,
    g,
    o.clipHelperVisible
  ), ne(
    r[1],
    new u.Vector3(-1, 0, 0),
    new u.Vector3(h - x, b.y, b.z),
    C.z,
    C.y,
    g,
    o.clipHelperVisible
  )) : (n[0].constant = 1 / 0, n[1].constant = 1 / 0, r[0] && (r[0].visible = !1), r[1] && (r[1].visible = !1)), i.y ? (n[2].constant = -f, n[3].constant = p, ne(
    r[2],
    new u.Vector3(0, 1, 0),
    new u.Vector3(b.x, f + x, b.z),
    C.x,
    C.z,
    g,
    o.clipHelperVisible
  ), ne(
    r[3],
    new u.Vector3(0, -1, 0),
    new u.Vector3(b.x, p - x, b.z),
    C.x,
    C.z,
    g,
    o.clipHelperVisible
  )) : (n[2].constant = 1 / 0, n[3].constant = 1 / 0, r[2] && (r[2].visible = !1), r[3] && (r[3].visible = !1)), i.z ? (n[4].constant = -m, n[5].constant = y, ne(
    r[4],
    new u.Vector3(0, 0, 1),
    new u.Vector3(b.x, b.y, m + x),
    C.x,
    C.y,
    g,
    o.clipHelperVisible
  ), ne(
    r[5],
    new u.Vector3(0, 0, -1),
    new u.Vector3(b.x, b.y, y - x),
    C.x,
    C.y,
    g,
    o.clipHelperVisible
  )) : (n[4].constant = 1 / 0, n[5].constant = 1 / 0, r[4] && (r[4].visible = !1), r[5] && (r[5].visible = !1)), { state: o, needsRender: !0 };
}
function qi(s, e) {
  for (const t of s) {
    if (t.constant === 1 / 0) continue;
    const i = t.normal, n = new u.Vector3(
      i.x > 0 ? e.max.x : e.min.x,
      i.y > 0 ? e.max.y : e.min.y,
      i.z > 0 ? e.max.z : e.min.z
    );
    if (t.distanceToPoint(n) < 0)
      return !0;
  }
  return !1;
}
function Pe(s) {
  s.geometry?.dispose?.(), (s.material ? Array.isArray(s.material) ? s.material : [s.material] : []).forEach((t) => t?.dispose?.());
}
function Xi(s) {
  for (s.cancelDeferredStructureBuild(), s.clearLocateFocus(), s.animationFrameId !== null && cancelAnimationFrame(s.animationFrameId), s.onAnimationFrameDisposed(), s.logicTimer && clearInterval(s.logicTimer), Oi({
    workers: s.workers,
    workerQueue: s.workerQueue,
    rejectReason: "SceneManager disposed"
  }), s.onWorkersDisposed(), s.onQueuesReset(), s.onStateCachesReset(), s.clearChunkCache(); s.ghostGroup.children.length > 0; ) {
    const e = s.ghostGroup.children[0];
    s.ghostGroup.remove(e), s.releaseGhostLine(e);
  }
  s.controls.dispose(), Pe(s.selectionBox), Pe(s.highlightMesh), Pe(s.tempMarker), s.dotTexture.dispose(), s.sharedMaterial.dispose(), s.ghostEdgesGeometry.dispose(), s.ghostMaterial.dispose(), s.renderer.dispose();
}
function dt(s, e) {
  const t = new u.Matrix4();
  return e !== void 0 && s.isInstancedMesh ? (s.getMatrixAt(e, t), t) : t.copy(s.matrixWorld);
}
function Ye(s, e, t) {
  const i = s.attributes.position, n = s.index, r = dt(e, t), o = new u.Vector3(), a = new u.Vector3(), c = new u.Vector3(), d = new u.Vector3();
  let l = 0;
  if (n)
    for (let h = 0; h < n.count; h += 3)
      o.fromBufferAttribute(i, n.getX(h)).applyMatrix4(r), a.fromBufferAttribute(i, n.getX(h + 1)).applyMatrix4(r), c.fromBufferAttribute(i, n.getX(h + 2)).applyMatrix4(r), l += o.dot(d.crossVectors(a, c)) / 6;
  else
    for (let h = 0; h < i.count; h += 3)
      o.fromBufferAttribute(i, h).applyMatrix4(r), a.fromBufferAttribute(i, h + 1).applyMatrix4(r), c.fromBufferAttribute(i, h + 2).applyMatrix4(r), l += o.dot(d.crossVectors(a, c)) / 6;
  return Math.abs(l);
}
function je(s, e, t) {
  const i = s.attributes.position, n = s.index, r = dt(e, t), o = new u.Vector3(), a = new u.Vector3(), c = new u.Vector3(), d = new u.Vector3(), l = new u.Vector3();
  let h = 0;
  if (n)
    for (let f = 0; f < n.count; f += 3)
      o.fromBufferAttribute(i, n.getX(f)).applyMatrix4(r), a.fromBufferAttribute(i, n.getX(f + 1)).applyMatrix4(r), c.fromBufferAttribute(i, n.getX(f + 2)).applyMatrix4(r), h += d.subVectors(a, o).cross(l.subVectors(c, o)).length() / 2;
  else
    for (let f = 0; f < i.count; f += 3)
      o.fromBufferAttribute(i, f).applyMatrix4(r), a.fromBufferAttribute(i, f + 1).applyMatrix4(r), c.fromBufferAttribute(i, f + 2).applyMatrix4(r), h += d.subVectors(a, o).cross(l.subVectors(c, o)).length() / 2;
  return h;
}
function Yi(s) {
  const { uuid: e, optimizedMapping: t, contentGroup: i } = s;
  let n = 0, r = 0;
  const o = t.get(e);
  if (o && o.length > 0)
    return o.forEach((c) => {
      c.geometry && (n += je(c.geometry, c.mesh, c.instanceId), r += Ye(c.geometry, c.mesh, c.instanceId));
    }), { area: n, volume: r };
  const a = i.getObjectByProperty("uuid", e);
  if (a && a.isMesh) {
    const c = a;
    c.geometry && (n = je(c.geometry, c), r = Ye(c.geometry, c));
  }
  return { area: n, volume: r };
}
function ye(s) {
  return s.replace(/\.[^./\\]+$/, "");
}
function ce(s) {
  return s.replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, " ").trim() || "model";
}
const ji = /* @__PURE__ */ new Set(["", "n/a", "na", "undefined", "null", "-", "--"]);
function pe(...s) {
  for (const e of s) {
    if (e == null) continue;
    const t = String(e).trim();
    if (!ji.has(t.toLowerCase()))
      return t;
  }
  return "";
}
function ft(s) {
  if (!s) return 0;
  let e = s.type === "Mesh" ? 1 : 0;
  if (s.children)
    for (const t of s.children)
      e += ft(t);
  return e;
}
function Ze(s) {
  if (!s || typeof s != "object") return;
  const e = {};
  return s.originalUuid !== void 0 && (e.originalUuid = String(s.originalUuid)), s.expressID !== void 0 && (e.expressID = s.expressID), s.modelID !== void 0 && (e.modelID = s.modelID), Object.keys(e).length > 0 ? e : void 0;
}
function Zi(s) {
  const e = /* @__PURE__ */ new Set(), t = (a, c) => {
    const d = a && a.trim() ? a.trim() : c;
    if (!e.has(d))
      return e.add(d), d;
    let l = 2;
    for (; e.has(`${d}_${l}`); ) l++;
    const h = `${d}_${l}`;
    return e.add(h), h;
  }, n = {
    id: t(s?.name, s?.id ?? "Root"),
    name: s?.name,
    type: s?.type,
    visible: s?.visible !== !1,
    children: []
  };
  s?.bimId !== void 0 && (n.bimId = s.bimId), s?.chunkId !== void 0 && (n.chunkId = s.chunkId);
  const r = Ze(s?.userData);
  r && (n.userData = r);
  const o = [{ src: s, dst: n }];
  for (; o.length > 0; ) {
    const { src: a, dst: c } = o.pop(), d = Array.isArray(a?.children) ? a.children : [];
    for (const l of d) {
      const f = {
        id: t(l?.name, l?.id ?? "Node"),
        name: l?.name,
        type: l?.type,
        visible: l?.visible !== !1,
        children: []
      };
      l?.bimId !== void 0 && (f.bimId = l.bimId), l?.chunkId !== void 0 && (f.chunkId = l.chunkId);
      const p = Ze(l?.userData);
      p && (f.userData = p), c.children.push(f), o.push({ src: l, dst: f });
    }
  }
  return n;
}
function Ki(s, e) {
  let t;
  try {
    t = JSON.stringify(s);
  } catch {
    t = JSON.stringify({
      globalBounds: s.globalBounds,
      chunks: s.chunks,
      structureTree: {
        id: e.id,
        name: e.name,
        type: e.type,
        children: e.children ? [] : []
      },
      bimIdTable: s.bimIdTable,
      bimPropertyDocs: s.bimPropertyDocs || {},
      propertyNameIndex: s.propertyNameIndex || []
    });
  }
  return new TextEncoder().encode(t);
}
function Ji(s) {
  const e = [];
  s.children.forEach((o) => {
    if (o.userData?.isOptimizedGroup || o.name.startsWith("optimized_")) return;
    const a = (typeof o.userData?.modelName == "string" ? o.userData.modelName : "") || o.children?.[0]?.name || "" || o.name, c = ce(ye(a));
    e.push(c);
  });
  const t = Array.from(new Set(e));
  if (t.length === 1) return t[0];
  const i = /* @__PURE__ */ new Date(), n = (o) => String(o).padStart(2, "0");
  return `批量导出_${`${i.getFullYear()}${n(i.getMonth() + 1)}${n(i.getDate())}_${n(i.getHours())}${n(i.getMinutes())}${n(i.getSeconds())}`}`;
}
function es(s, e) {
  const t = Object.keys(s), i = /* @__PURE__ */ new Set();
  t.forEach((o) => {
    const a = o.indexOf("::");
    a > 0 && i.add(o.slice(0, a));
  });
  const n = i.size === 1 ? [...i][0] : e, r = /* @__PURE__ */ new Map();
  return i.size >= 1 ? i.size === 1 ? r.set(n, s) : t.forEach((o) => {
    const a = o.indexOf("::"), c = a > 0 ? o.slice(0, a) : e;
    r.has(c) || r.set(c, {}), r.get(c)[o] = s[o];
  }) : r.set(e, s), {
    defaultOwner: n,
    grouped: r
  };
}
function ts(s) {
  const { fileName: e, modelRootName: t, rootId: i } = s, n = new u.Group();
  n.name = `file_${i}`, n.userData.originalUuid = i;
  const r = ce(ye(e));
  return n.userData.modelName = ce(
    pe(t && t !== "Root" ? t : "", r, i) || r
  ), n;
}
function Ke(s) {
  const e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map();
  return s.traverse((i) => {
    i.userData?.ifcAPI && i.userData?.modelID !== void 0 && i.userData?.originalUuid && e.set(String(i.userData.originalUuid), {
      ifcApi: i.userData.ifcAPI,
      modelID: i.userData.modelID
    }), i.userData?.ifcManager && i.userData?.modelID !== void 0 && i.userData?.originalUuid && t.set(String(i.userData.originalUuid), {
      ifcManager: i.userData.ifcManager,
      modelID: i.userData.modelID
    });
  }), {
    ifcApiByModel: e,
    ifcManagerByModel: t
  };
}
function pt(s) {
  return s == null ? "" : typeof s == "string" ? s.trim() : typeof s == "number" || typeof s == "boolean" ? String(s) : Array.isArray(s) ? s.map((e) => pt(e)).filter(Boolean).join(", ") : "";
}
function L(s, e, t, i, n, r) {
  const o = pt(i), a = String(e || "").trim(), c = String(t || "").trim();
  !a || !c || !o || s.push({
    group: a,
    key: c,
    rawKey: r,
    path: `${a}.${c}`,
    value: o,
    source: n
  });
}
function he(s, e, t, i, n = "") {
  if (!(!t || typeof t != "object")) {
    if (Array.isArray(t)) {
      t.forEach((r, o) => {
        if (r && typeof r == "object" && "key" in r) {
          L(
            s,
            e,
            String(r.key || ""),
            r.value,
            r.source || i,
            r.rawKey
          );
          return;
        }
        if (r && typeof r == "object") {
          he(s, e, r, i, `${n || "Item"}${o + 1}`);
          return;
        }
        L(s, e, `${n || "Item"}${o + 1}`, r, i);
      });
      return;
    }
    Object.entries(t).forEach(([r, o]) => {
      const a = n ? `${n}.${r}` : r;
      o !== null && typeof o == "object" && !Array.isArray(o) ? he(s, e, o, i, a) : L(s, e, a, o, i, r);
    });
  }
}
function be(s) {
  const e = /* @__PURE__ */ new Map();
  return Object.values(s || {}).forEach((t) => {
    (t.rows || []).forEach((i) => {
      if (!i?.group || !i?.key) return;
      const n = i.path || `${i.group}.${i.key}`;
      e.has(n) || e.set(n, {
        group: i.group,
        key: i.key,
        path: n,
        rawKey: i.rawKey,
        count: 0
      }), e.get(n).count++;
    });
  }), Array.from(e.values()).sort((t, i) => t.path.localeCompare(i.path, "zh-Hans-CN"));
}
function is(s, e) {
  const t = [];
  return L(t, "基本信息", "UUID", s.id, "nbim"), L(t, "基本信息", "名称", s.name, "nbim"), L(t, "基本信息", "类型", s.type, "nbim"), L(t, "基本信息", "模型ID", e, "nbim"), L(t, "基本信息", "BIM_ID", s.bimId, "nbim"), L(t, "基本信息", "ExpressID", s.userData?.expressID, "nbim"), t;
}
async function mt(s) {
  const { rows: e, oldCompat: t, originalUuid: i, expressID: n, ifcApiByModel: r, ifcManagerByModel: o } = s;
  if (n == null || n === "") return;
  const a = Number(n);
  if (Number.isFinite(a)) {
    if (r.has(i))
      try {
        const { ifcApi: c, modelID: d } = r.get(i), l = c.GetLine(d, a);
        if (l) {
          const h = l.is_a || "", f = l.GlobalId?.value || "", p = l.Name?.value || "";
          t.ifcType = h, t.globalId = f, t.ifcName = p, L(e, "IFC 标识", "类型", h, "ifc", "is_a"), L(e, "IFC 标识", "GlobalId", f, "ifc", "GlobalId"), L(e, "IFC 标识", "名称", p, "ifc", "Name");
        }
      } catch {
      }
    if (o.has(i))
      try {
        const { ifcManager: c, modelID: d } = o.get(i), l = await c.getItemProperties(d, a), h = l?.rawGroups || l?.groups || null, f = l?.normalizedGroups || null;
        h && Object.keys(h).length > 0 && (t.ifcRawGroups = h), f && Object.keys(f).length > 0 && (t.ifcNormalizedGroups = f), f && Object.keys(f).length > 0 ? Object.entries(f).forEach(([p, m]) => {
          he(e, p, m, "ifc-normalized");
        }) : h && Object.keys(h).length > 0 && Object.entries(h).forEach(([p, m]) => {
          he(e, p, m, "ifc-raw");
        });
      } catch {
      }
  }
}
async function ss(s) {
  const { structureRoot: e, ifcApiByModel: t, ifcManagerByModel: i } = s, n = {}, r = {}, o = [e];
  for (; o.length > 0; ) {
    const a = o.pop(), c = a.userData?.originalUuid ? String(a.userData.originalUuid) : "";
    if (a.bimId) {
      const d = `${c}::${a.bimId}`;
      if (!r[d]) {
        const l = is(a, c), h = { uuid: a.id, name: a.name };
        await mt({
          rows: l,
          oldCompat: h,
          originalUuid: c,
          expressID: a.userData?.expressID,
          ifcApiByModel: t,
          ifcManagerByModel: i
        }), n[d] = h, r[d] = {
          owner: c,
          bimId: String(a.bimId),
          uuid: String(a.id),
          name: String(a.name || ""),
          rows: l
        };
      }
    }
    if (a.children && a.children.length > 0)
      for (let d = a.children.length - 1; d >= 0; d--)
        o.push(a.children[d]);
  }
  return {
    bimProperties: n,
    bimPropertyDocs: r,
    propertyNameIndex: be(r)
  };
}
function ns(s) {
  const e = String(s.uuid), t = {}, i = /* @__PURE__ */ new Set();
  return s.traverse((n) => {
    const r = n.userData?.expressID;
    if (r == null || r === "") return;
    const o = `${e}::${r}`;
    if (i.has(o)) return;
    i.add(o);
    const a = [];
    L(a, "基本信息", "UUID", n.uuid, "ifc-basic"), L(a, "基本信息", "名称", n.name, "ifc-basic"), L(a, "基本信息", "类型", n.type, "ifc-basic"), L(a, "基本信息", "模型ID", e, "ifc-basic"), L(a, "基本信息", "BIM_ID", r, "ifc-basic"), L(a, "基本信息", "ExpressID", r, "ifc-basic");
    const c = n.userData?.ifcType || n.userData?.ifcMetadata?.typeName || n.userData?.ifcMetadata?.category;
    L(a, "IFC 标识", "类型", c, "ifc-basic"), t[o] = {
      owner: e,
      bimId: String(r),
      uuid: n.uuid,
      name: String(n.name || r),
      rows: a
    };
  }), {
    bimPropertyDocs: t,
    propertyNameIndex: be(t)
  };
}
async function rs(s) {
  const { object: e, ifcApiByModel: t, ifcManagerByModel: i, onProgress: n } = s, r = {}, o = {}, a = String(e.uuid), c = [], d = /* @__PURE__ */ new Set();
  e.traverse((l) => {
    const h = l.userData?.expressID;
    if (h == null || h === "") return;
    const f = `${a}::${h}`;
    d.has(f) || (d.add(f), c.push(l));
  });
  for (let l = 0; l < c.length; l++) {
    const h = c[l], f = h.userData?.expressID, p = `${a}::${f}`, m = [], y = { uuid: h.uuid, name: h.name };
    L(m, "基本信息", "UUID", h.uuid, "ifc-object"), L(m, "基本信息", "名称", h.name, "ifc-object"), L(m, "基本信息", "类型", h.type, "ifc-object"), L(m, "基本信息", "模型ID", a, "ifc-object"), L(m, "基本信息", "BIM_ID", f, "ifc-object"), L(m, "基本信息", "ExpressID", f, "ifc-object");
    const g = h.userData?.ifcMetadata;
    g && typeof g == "object" && he(m, "IFC 元数据", g, "ifc-metadata"), await mt({
      rows: m,
      oldCompat: y,
      originalUuid: a,
      expressID: f,
      ifcApiByModel: t,
      ifcManagerByModel: i
    }), r[p] = y, o[p] = {
      owner: a,
      bimId: String(f),
      uuid: h.uuid,
      name: h.name || String(f),
      rows: m
    }, l > 0 && l % 120 === 0 && (n?.(l, c.length), await new Promise((M) => setTimeout(M, 0)));
  }
  return n?.(c.length, c.length), {
    bimProperties: r,
    bimPropertyDocs: o,
    propertyNameIndex: be(o)
  };
}
function os(s, e) {
  const t = new DataView(s);
  let i = 0;
  const n = t.getUint32(i, !0);
  i += 4;
  const r = [];
  for (let d = 0; d < n; d++) {
    const l = t.getUint32(i, !0);
    i += 4;
    const h = t.getUint32(i, !0);
    i += 4;
    const f = new Float32Array(s, i, l * 3);
    i += l * 12;
    const p = new Float32Array(s, i, l * 3);
    i += l * 12;
    const m = new u.BufferGeometry();
    if (m.setAttribute("position", new u.BufferAttribute(new Float32Array(f), 3)), m.setAttribute("normal", new u.BufferAttribute(new Float32Array(p), 3)), h > 0) {
      const y = new Uint32Array(s, i, h);
      i += h * 4, m.setIndex(new u.BufferAttribute(new Uint32Array(y), 1));
    }
    r.push(m);
  }
  const o = t.getUint32(i, !0);
  i += 4;
  const a = new u.Matrix4(), c = [];
  for (let d = 0; d < o; d++) {
    const l = t.getUint32(i, !0);
    i += 4;
    const h = t.getUint32(i, !0);
    i += 4;
    const f = t.getUint32(i, !0);
    i += 4;
    for (let m = 0; m < 16; m++)
      a.elements[m] = t.getFloat32(i, !0), i += 4;
    const p = t.getUint32(i, !0);
    i += 4, c.push({
      bimId: e[l] ?? String(l),
      typeIndex: h,
      color: f,
      matrix: a.clone(),
      geometry: r[p]
    });
  }
  return c;
}
async function as(s) {
  const {
    chunks: e,
    nbimFiles: t,
    nbimMeta: i,
    bimIdToIndex: n,
    hasValidChunkBinaryRange: r,
    generateChunkBinaryV8: o
  } = s, a = [], c = e.map((l) => ({
    id: l.id,
    bounds: {
      min: { x: l.bounds.min.x, y: l.bounds.min.y, z: l.bounds.min.z },
      max: { x: l.bounds.max.x, y: l.bounds.max.y, z: l.bounds.max.z }
    },
    originalUuid: l.originalUuid ? String(l.originalUuid) : void 0,
    byteOffset: 0,
    byteLength: 0
  }));
  let d = 1024;
  for (let l = 0; l < e.length; l++) {
    const h = e[l], f = c[l];
    let p = null;
    if (h.node)
      p = o(h.node.items, n);
    else if (h.nbimFileId && t.has(h.nbimFileId) && r(h)) {
      const g = await t.get(h.nbimFileId).slice(h.byteOffset, h.byteOffset + h.byteLength).arrayBuffer(), M = i.get(h.nbimFileId), k = M?.version ?? 8;
      if (k !== 8)
        throw new Error(`Unsupported NBIM version: ${k}. Only V8 is supported.`);
      const C = os(g, M?.bimIdTable || []).map((x) => ({
        uuid: "",
        bimId: x.bimId,
        typeIndex: x.typeIndex,
        color: x.color,
        matrix: x.matrix,
        geometry: x.geometry
      }));
      p = o(C, n);
    }
    if (!p)
      continue;
    const m = new Uint8Array(p);
    a.push(m), f.byteOffset = d, f.byteLength = m.byteLength, d += m.byteLength;
  }
  return {
    chunkBlobs: a,
    exportChunks: c,
    currentOffset: d
  };
}
function cs(s) {
  const { globalBounds: e, precomputedBounds: t, sceneBounds: i, globalOffset: n } = s;
  if (!e)
    return {
      precomputedBounds: t,
      sceneBounds: i,
      globalOffset: n,
      initializedOffset: !1
    };
  const r = new u.Box3(
    new u.Vector3(e.min.x, e.min.y, e.min.z),
    new u.Vector3(e.max.x, e.max.y, e.max.z)
  );
  let o = !1;
  const a = n.clone();
  a.length() === 0 && (r.getCenter(a), o = !0);
  const c = t.clone();
  return c.isEmpty() ? c.copy(r) : c.union(r), {
    precomputedBounds: c,
    sceneBounds: c.clone(),
    globalOffset: a,
    initializedOffset: o
  };
}
function hs(s) {
  const { structureRoot: e, modelRoot: t } = s;
  return e.children || (e.children = []), t && (t.children && t.name === "Root" ? e.children.push(...t.children) : e.children.push(t)), e;
}
function ls(s) {
  const { manifestStats: e, modelRoot: t, chunks: i } = s;
  return e || {
    meshes: ft(t),
    faces: 0,
    memory: parseFloat(((i || []).reduce((n, r) => n + (r.byteLength || 0), 0) / (1024 * 1024)).toFixed(2))
  };
}
function us(s) {
  const { modelRoot: e, defaultOwner: t, nodeMap: i, bimIdToNodeIds: n } = s;
  if (!e) return;
  const r = (o) => {
    o.userData || (o.userData = {});
    const a = o.userData?.originalUuid ? String(o.userData.originalUuid) : t;
    if (o.userData.originalUuid = a, i.has(o.id) || i.set(o.id, []), i.get(o.id).push(o), o.bimId) {
      const c = `${a}::${o.bimId}`;
      n.has(c) || n.set(c, []), n.get(c).push(o.id);
    }
    o.children && o.children.forEach(r);
  };
  r(e);
}
async function ds(s) {
  const {
    chunkEntries: e,
    globalOffset: t,
    chunkPadding: i,
    rootId: n,
    fileId: r,
    immediateGhostLimit: o,
    registrationBatchSize: a,
    onProgress: c,
    registerChunk: d,
    createGhostLine: l,
    addGhostLine: h,
    yieldToMainThread: f
  } = s;
  if (e.length === 0)
    throw new Error("NBIM 文件没有可渲染分块，可能格式有问题");
  const p = t.lengthSq() > 0 ? t.clone().negate() : null, m = [];
  for (let y = 0; y < e.length; y++) {
    const g = e[y];
    if (!g?.bounds || typeof g.byteOffset != "number" || typeof g.byteLength != "number")
      throw new Error("NBIM 分块数据不完整，可能格式有问题");
    const M = new u.Box3(
      new u.Vector3(g.bounds.min.x, g.bounds.min.y, g.bounds.min.z),
      new u.Vector3(g.bounds.max.x, g.bounds.max.y, g.bounds.max.z)
    );
    p && M.translate(p);
    const k = g.id, b = M.getCenter(new u.Vector3()), C = M.clone(), x = M.getSize(new u.Vector3()).multiplyScalar(i);
    if (C.expandByVector(x), d({
      id: k,
      bounds: M,
      paddedBounds: C,
      _padding: i,
      center: b,
      loaded: !1,
      byteOffset: g.byteOffset,
      byteLength: g.byteLength,
      nbimFileId: r,
      groupName: `optimized_${n}`,
      originalUuid: g.originalUuid ? String(g.originalUuid) : n
    }), y < o ? h(l(`ghost_${k}`, M)) : m.push({ chunkId: k, bounds: M }), (y + 1) % a === 0) {
      if (c) {
        const w = Math.max(0, Math.min(1, (y + 1) / e.length));
        c(30 + Math.round(w * 40), "正在初始化分块...");
      }
      await f();
    }
  }
  return {
    deferredGhostSpecs: m
  };
}
function fs(s) {
  const { chunkCount: e, hasManifestStats: t, hasManifestChunks: i } = s;
  return {
    chunkWarmupActive: !0,
    initialChunkLoadTarget: e > 200 ? 44 : e > 80 ? 30 : 16,
    shouldEstimateStats: !t && i
  };
}
function ps(s, e) {
  const t = s.nodeMap.get(e);
  return !t || t.length === 0 || t.some((i) => i.visible !== !1);
}
function gt(s, e, t) {
  return s.nodeMap.get(e)?.[0]?.name || t;
}
function yt(s) {
  let e = s;
  for (; e; ) {
    if (!e.visible) return !1;
    e = e.parent;
  }
  return !0;
}
function Mt(s, e) {
  if (s.boundingBox || s.computeBoundingBox(), !s.boundingBox) return null;
  const t = s.boundingBox.clone().applyMatrix4(e);
  return t.isEmpty() ? null : t;
}
function ms(s) {
  const e = s.userData || (s.userData = {}), t = s.matrixWorld.elements, i = `${t[12]},${t[13]},${t[14]},${t[0]},${t[5]},${t[10]}`, n = e.__rtWorldBoxCache;
  if (n && n.key === i) return n.box.clone();
  const r = Mt(s.geometry, s.matrixWorld);
  return r && (e.__rtWorldBoxCache = { key: i, box: r.clone() }), r;
}
function gs(s, e, t, i) {
  const n = e.mesh.userData || (e.mesh.userData = {}), r = n.__rtInstanceBoxCache ||= /* @__PURE__ */ new Map(), o = `${s}:${e.instanceId}`, a = r.get(o);
  if (a) return a.clone();
  const c = Mt(t, i);
  return c && r.set(o, c.clone()), c;
}
function Re(s, e, t) {
  if (!yt(e) || !e.geometry || e.userData?.isIfcGridHelper || e.isBatchedMesh || e.userData?.isOptimized) return;
  e.updateMatrixWorld(!0);
  const i = ms(e);
  if (!i) return;
  const n = `mesh:${e.uuid}`;
  t.set(n, {
    key: n,
    uuid: e.uuid,
    name: e.name || gt(s, e.uuid, e.uuid),
    object: e,
    geometry: e.geometry,
    matrixWorld: e.matrixWorld.clone(),
    box: i,
    type: "mesh"
  });
}
function bt(s, e, t, i) {
  if (!yt(t.mesh) || !ps(s, e)) return;
  const n = t.geometry || t.mesh.geometry;
  if (!n) return;
  const r = new u.Matrix4();
  t.mesh.getMatrixAt(t.instanceId, r), r.premultiply(t.mesh.matrixWorld);
  const o = gs(e, t, n, r);
  if (!o) return;
  const a = `instance:${t.mesh.uuid}:${t.instanceId}`;
  i.set(a, {
    key: a,
    uuid: e,
    name: gt(s, e, e),
    object: t.mesh,
    geometry: n,
    matrixWorld: r.clone(),
    box: o,
    type: "instance",
    ownerUuid: e,
    batchedMesh: t.mesh,
    instanceId: t.instanceId,
    originalColor: t.originalColor
  });
}
function ys(s, e) {
  const t = /* @__PURE__ */ new Set(), i = e.filter(Boolean), n = /* @__PURE__ */ new Set();
  for (; i.length > 0; ) {
    const r = i.shift();
    if (!r || n.has(r)) continue;
    n.add(r), t.add(r);
    const o = s.nodeMap.get(r);
    if (o)
      for (const a of o) {
        const c = Array.isArray(a.children) ? a.children : [];
        for (const d of c)
          n.has(d.id) || i.push(d.id);
      }
  }
  return t;
}
function Ct(s, e) {
  const t = /* @__PURE__ */ new Map(), i = ys(s, Array.from(new Set(e.filter(Boolean))));
  return s.contentGroup.updateMatrixWorld(!0), i.forEach((n) => {
    const r = s.optimizedMapping.get(n);
    r && r.forEach((a) => bt(s, n, a, t));
    const o = s.contentGroup.getObjectByProperty("uuid", n);
    if (o) {
      if (o.isMesh) {
        Re(s, o, t);
        return;
      }
      o.traverse((a) => {
        a !== o && a.isMesh && Re(s, a, t);
      });
    }
  }), Array.from(t.values());
}
function Ms(s) {
  const e = /* @__PURE__ */ new Map();
  return s.contentGroup.updateMatrixWorld(!0), s.contentGroup.traverse((t) => {
    t.isMesh && Re(s, t, e);
  }), s.optimizedMapping.forEach((t, i) => {
    t.forEach((n) => bt(s, i, n, e));
  }), Array.from(e.values());
}
function me(s, e) {
  const t = new u.Box3();
  return Ct(s, e).forEach((i) => t.union(i.box)), t;
}
function bs(s) {
  return new u.Color(s.highlightColor || "#ff9f1c");
}
function Cs(s, e, t) {
  return new u.Color(t?.[s] || e.highlightColor || "#ff9f1c");
}
function kt(s, e) {
  const t = /* @__PURE__ */ new Set(), i = [...e], n = /* @__PURE__ */ new Set();
  for (; i.length > 0; ) {
    const r = i.shift();
    if (!r || n.has(r)) continue;
    n.add(r), t.add(r);
    const o = s.get(r);
    if (!(!o || o.length === 0)) {
      for (const a of o)
        if (!(!a.children || a.children.length === 0))
          for (const c of a.children)
            n.has(c.id) || i.push(c.id);
    }
  }
  return t;
}
function Ce(s) {
  for (const e of s)
    e.instanceColor && (e.instanceColor.needsUpdate = !0);
}
function Oe(s, e) {
  const t = /* @__PURE__ */ new Set();
  for (const i of e) {
    const n = s.optimizedMapping.get(i);
    n && n.forEach((r) => {
      r.mesh.setColorAt(r.instanceId, new u.Color(r.originalColor)), t.add(r.mesh);
    });
  }
  Ce(t);
}
function ks(s, e) {
  const t = bs(s.settings), i = /* @__PURE__ */ new Set();
  for (const n of e) {
    const r = s.optimizedMapping.get(n);
    r && r.forEach((o) => {
      o.mesh.setColorAt(o.instanceId, t), i.add(o.mesh);
    });
  }
  Ce(i);
}
function xt(s, e) {
  if (s.selectionBox.visible = !1, s.highlightMesh.visible = !1, e.size === 0)
    return;
  const t = me(s, Array.from(e));
  if (!t.isEmpty()) {
    if (s.selectionBox.box.copy(t), !!(s.state.locateFocusUuid && e.has(s.state.locateFocusUuid))) {
      const l = Math.max(t.getSize(new u.Vector3()).length() * 0.048, 0.22);
      s.selectionBox.box.expandByScalar(l);
    }
    s.selectionBox.visible = !!s.settings.highlightShowBox;
  }
  const i = s.state.locateFocusUuid || s.state.lastSelectedUuid;
  if (!i) return;
  const n = s.optimizedMapping.get(i);
  if (n && n.length > 0) {
    s.highlightMesh.visible = !1;
    return;
  }
  const r = s.contentGroup.getObjectByProperty("uuid", i);
  if (!r || !r.isMesh) return;
  r.updateMatrixWorld(!0), s.highlightMesh.geometry = r.geometry;
  const o = new u.Vector3(), a = new u.Quaternion(), c = new u.Vector3();
  r.matrixWorld.decompose(o, a, c), c.multiplyScalar(1.035), s.highlightMesh.position.copy(o), s.highlightMesh.quaternion.copy(a), s.highlightMesh.scale.copy(c), s.highlightMesh.visible = !0;
}
function xs(s) {
  (Array.isArray(s) ? s : [s]).forEach((t) => t.dispose());
}
function ws(s) {
  s.locateObjectMaterialCache.forEach((e, t) => {
    const i = s.contentGroup.getObjectByProperty("uuid", t);
    i && (i.isMesh || i.isBatchedMesh) && (i.material = e);
  });
}
function Ss(s) {
  const e = /* @__PURE__ */ new Set();
  s.locateDimmedInstances.forEach(({ mesh: t, instanceId: i, originalColor: n, originalVisible: r }) => {
    t.setColorAt(i, new u.Color(n)), t.setVisibleAt && t.setVisibleAt(i, r), e.add(t);
  }), Ce(e);
}
function wt(s) {
  ws(s), Ss(s), s.locateMaterialCache.forEach((e) => xs(e)), s.locateMaterialCache.clear(), s.locateObjectMaterialCache.clear(), s.locateDimmedInstances.clear();
}
function Je(s, e) {
  s.clearClashPairHighlight();
  const t = Array.from(new Set(e.filter(Boolean))), i = kt(s.nodeMap, t);
  return s.state.locateResultSet.size > 0 || (Oe(s, Array.from(s.state.highlightedUuids).filter((r) => !i.has(r))), ks(s, Array.from(i).filter((r) => !s.state.highlightedUuids.has(r)))), s.state.highlightedUuids = i, s.state.lastSelectedUuid = e.length > 0 ? e[e.length - 1] : null, xt(s, i), { needsRender: !0 };
}
function St(s) {
  return s.clearClashPairHighlight(), Oe(s, s.state.highlightedUuids), (s.locateObjectMaterialCache.size > 0 || s.locateDimmedInstances.size > 0 || s.locateMaterialCache.size > 0) && wt(s), s.state.locateResultSet.clear(), s.state.locateFocusUuid = null, s.state.highlightedUuids = /* @__PURE__ */ new Set(), s.state.lastSelectedUuid = null, s.selectionBox.visible = !1, s.highlightMesh.visible = !1, { needsRender: !0 };
}
function et(s, e, t = null, i) {
  const n = Array.from(new Set(e.filter(Boolean)));
  if (n.length === 0)
    return St(s);
  s.clearClashPairHighlight(), (s.locateObjectMaterialCache.size > 0 || s.locateDimmedInstances.size > 0 || s.locateMaterialCache.size > 0) && wt(s);
  const r = kt(s.nodeMap, n), o = Array.from(r), a = new Set(s.state.highlightedUuids), c = i?.highlightColors, d = t && r.has(t) ? t : o[0] || null, l = Array.from(a).filter((m) => !r.has(m)), h = Array.from(r).filter((m) => !a.has(m)), f = new Set(h);
  s.state.locateFocusUuid && r.has(s.state.locateFocusUuid) && f.add(s.state.locateFocusUuid), d && r.has(d) && f.add(d), c && Object.keys(c).forEach((m) => {
    r.has(m) && f.add(m);
  }), Oe(s, l);
  const p = /* @__PURE__ */ new Set();
  return f.forEach((m) => {
    const y = s.optimizedMapping.get(m);
    if (!y) return;
    const g = Cs(m, s.settings, c);
    y.forEach((M) => {
      M.mesh.setColorAt(M.instanceId, g), p.add(M.mesh);
    });
  }), Ce(p), s.state.locateResultSet = r, s.state.locateFocusUuid = d, s.state.highlightedUuids = r, s.state.lastSelectedUuid = d, xt(s, r), { needsRender: !0 };
}
function vt(s, e, t) {
  const i = new u.BufferGeometry().setAttribute(
    "position",
    new u.Float32BufferAttribute([s.x, s.y, s.z], 3)
  ), n = new u.PointsMaterial({
    color: 16711680,
    size: 8,
    map: t,
    transparent: !0,
    alphaTest: 0.5,
    depthTest: !1
  }), r = new u.Points(i, n);
  r.renderOrder = 999, e.add(r);
}
function tt(s, e) {
  const t = new u.BufferGeometry().setFromPoints(s), i = new u.LineBasicMaterial({ color: 16711680, depthTest: !1, linewidth: 2 }), n = new u.Line(t, i);
  n.renderOrder = 998, e.add(n);
}
function vs(s, e) {
  const t = document.createElement("canvas"), i = t.getContext("2d");
  if (!i) return new u.Sprite();
  const n = 48, r = 24;
  i.font = `Bold ${n}px "Segoe UI", Arial, sans-serif`;
  const o = i.measureText(s).width;
  t.width = o + r * 2, t.height = n + r, i.shadowColor = "rgba(0, 0, 0, 0.5)", i.shadowBlur = 10, i.fillStyle = "rgba(30, 30, 30, 0.9)";
  const a = 8, c = i;
  c.roundRect ? c.roundRect(5, 5, t.width - 10, t.height - 10, a) : i.rect(5, 5, t.width - 10, t.height - 10), i.fill(), i.shadowBlur = 0, i.strokeStyle = "#ff0000", i.lineWidth = 2, i.stroke(), i.font = `Bold ${n}px "Segoe UI", Arial, sans-serif`, i.fillStyle = "#ffffff", i.textAlign = "center", i.textBaseline = "middle", i.fillText(s, t.width / 2, t.height / 2);
  const d = new u.CanvasTexture(t);
  d.minFilter = u.LinearFilter, d.magFilter = u.LinearFilter;
  const l = new u.SpriteMaterial({
    map: d,
    depthTest: !1,
    sizeAttenuation: !1
  }), h = new u.Sprite(l);
  h.position.copy(e);
  const f = 0.5;
  return h.scale.set(f * (t.width / t.height), f, 1), h.renderOrder = 1001, h.userData = { type: "label" }, h;
}
function It(s, e) {
  e.previewLine && (s.measureGroup.remove(e.previewLine), e.previewLine = null), e.previewPolygon && (s.measureGroup.remove(e.previewPolygon), e.previewPolygon = null), s.tempMarker.visible = !1;
}
function Bt(s, e = !0) {
  const t = {
    ...s.state,
    currentMeasurePoints: e ? [] : [...s.state.currentMeasurePoints]
  };
  It(s, t);
  for (let i = s.measureGroup.children.length - 1; i >= 0; i--) {
    const n = s.measureGroup.children[i];
    n.name.startsWith("measure_") || s.measureGroup.remove(n);
  }
  return {
    state: t,
    needsRender: !0
  };
}
function ze(s, e) {
  const t = {
    ...s.state,
    currentMeasurePoints: [...s.state.currentMeasurePoints]
  };
  It(s, t);
  const i = [...t.currentMeasurePoints];
  if (e && i.push(e), i.length < 2)
    return { state: t, needsRender: !0 };
  const n = new u.BufferGeometry().setFromPoints(i), r = new u.LineDashedMaterial({
    color: 16711680,
    dashSize: 5,
    gapSize: 2,
    depthTest: !1
  });
  return t.previewLine = new u.Line(n, r), t.previewLine.computeLineDistances(), t.previewLine.renderOrder = 998, s.measureGroup.add(t.previewLine), { state: t, needsRender: !0 };
}
function Is(s, e, t) {
  const i = {
    ...s.state,
    currentMeasurePoints: [...s.state.currentMeasurePoints]
  };
  if (i.measureType === "none")
    return s.tempMarker.visible = !1, { state: i, needsRender: !1 };
  const n = s.getRayIntersects(e, t);
  if (!n)
    return s.tempMarker.visible = !1, i.previewLine && (i.previewLine.visible = !1), { state: i, needsRender: !0 };
  const r = n.point, o = s.tempMarker.geometry.attributes.position;
  return o.setXYZ(0, r.x, r.y, r.z), o.needsUpdate = !0, s.tempMarker.visible = !0, i.currentMeasurePoints.length === 0 ? { state: i, needsRender: !0 } : {
    state: ze(s, r).state,
    needsRender: !0
  };
}
function Pt(s) {
  const e = {
    ...s.state,
    currentMeasurePoints: [...s.state.currentMeasurePoints]
  }, t = `measure_${Date.now()}`, i = new u.Group();
  i.name = t, e.currentMeasurePoints.forEach((l) => vt(l, i, s.dotTexture));
  let n = "", r = "";
  const o = e.measureType, a = new u.Vector3();
  if (e.measureType === "dist") {
    const [l, h] = e.currentMeasurePoints, f = l.distanceTo(h), p = Math.abs(h.x - l.x), m = Math.abs(h.y - l.y), y = Math.abs(h.z - l.z);
    r = f.toFixed(3), n = `${r} (Δx:${p.toFixed(2)}, Δy:${m.toFixed(2)}, Δz:${y.toFixed(2)})`, tt(e.currentMeasurePoints, i), a.copy(l).add(h).multiplyScalar(0.5);
  } else if (e.measureType === "angle") {
    const [l, h, f] = e.currentMeasurePoints, p = l.clone().sub(h).normalize(), m = f.clone().sub(h).normalize();
    r = `${(p.angleTo(m) * (180 / Math.PI)).toFixed(2)}°`, n = r, tt(e.currentMeasurePoints, i), a.copy(h);
  } else {
    const [l] = e.currentMeasurePoints;
    r = `(${l.x.toFixed(2)}, ${l.y.toFixed(2)}, ${l.z.toFixed(2)})`, n = r, a.copy(l);
  }
  i.add(vs(r, a)), s.measureGroup.add(i), s.measureRecords.set(t, {
    id: t,
    type: o,
    val: n,
    group: i,
    modelUuid: e.currentMeasureModelUuid || void 0
  });
  const d = {
    ...Bt(
      {
        ...s,
        state: {
          ...e,
          currentMeasurePoints: [],
          currentMeasureModelUuid: null
        }
      },
      !1
    ).state,
    currentMeasurePoints: [],
    currentMeasureModelUuid: null
  };
  return s.onMeasureUpdate && s.onMeasureUpdate(Array.from(s.measureRecords.values())), {
    state: d,
    needsRender: !0,
    completed: { id: t, type: o, val: n }
  };
}
function Bs(s, e, t) {
  if (s.state.measureType === "none")
    return { state: s.state, needsRender: !1, completed: null };
  const i = {
    ...s.state,
    currentMeasurePoints: [...s.state.currentMeasurePoints, e],
    currentMeasureModelUuid: t ?? s.state.currentMeasureModelUuid
  };
  return vt(e, s.measureGroup, s.dotTexture), i.measureType === "dist" && i.currentMeasurePoints.length === 2 || i.measureType === "angle" && i.currentMeasurePoints.length === 3 || i.measureType === "coord" ? Pt({ ...s, state: i }) : {
    state: ze({ ...s, state: i }).state,
    needsRender: !0,
    completed: null
  };
}
function Ps(s, e) {
  return s.measureRecords.forEach((t, i) => {
    const n = i === e, r = n ? 65280 : 16711680;
    t.group.traverse((o) => {
      o instanceof u.Line || o instanceof u.LineLoop || o instanceof u.Points ? o.material.color.set(r) : o instanceof u.Sprite ? o.material.color.set(n ? 65280 : 16777215) : (o instanceof u.Mesh && o.material instanceof u.MeshBasicMaterial || o instanceof u.Box3Helper) && o.material.color.set(r);
    });
  }), {
    state: s.state,
    needsRender: !0
  };
}
function Rs(s, e, t) {
  const i = s.canvas.getBoundingClientRect();
  s.mouse.x = (e - i.left) / i.width * 2 - 1, s.mouse.y = -((t - i.top) / i.height) * 2 + 1, s.raycaster.setFromCamera(s.mouse, s.camera);
  const n = s.raycaster.params.Line?.threshold || 0;
  s.raycaster.params.Line && (s.raycaster.params.Line.threshold = 5);
  const r = s.raycaster.intersectObjects(s.measureGroup.children, !0);
  if (s.raycaster.params.Line && (s.raycaster.params.Line.threshold = n), r.length === 0)
    return null;
  let o = r[0].object;
  for (; o.parent && !o.name.startsWith("measure_"); )
    o = o.parent;
  return o.name.startsWith("measure_") ? o.name : null;
}
function Ds(s) {
  const e = [];
  s.chunks.length > 0 && s.chunks.forEach((i) => {
    i.loaded && i.mesh && i.mesh.visible && e.push(i.mesh);
  });
  const t = (i, n) => {
    if (!(n > 10) && i.visible && !i.userData.chunkId) {
      if (i.isMesh || i.isBatchedMesh) {
        i.userData.isOptimized || e.push(i);
        return;
      }
      if (i.children.length !== 0)
        for (const r of i.children)
          t(r, n + 1);
    }
  };
  for (const i of s.contentGroup.children)
    i.userData.isOptimizedGroup || t(i, 0);
  return e;
}
function As(s, e, t, i) {
  const r = s.nodeMap.get(i)?.[0], o = new u.Object3D();
  o.uuid = i, r && (o.name = r.name, o.type = r.type, o.isMesh = r.type === "Mesh"), o.getWorldPosition = (c) => {
    const d = new u.Matrix4();
    return e.getMatrixAt(t, d), d.premultiply(e.matrixWorld), c.setFromMatrixPosition(d);
  };
  const a = new u.Matrix4();
  return e.getMatrixAt(t, a), o.position.setFromMatrixPosition(a), o;
}
function Rt(s) {
  return s.interactableListValid ? {
    interactableList: s.interactableList,
    interactableListValid: !0
  } : {
    interactableList: Ds(s),
    interactableListValid: !0
  };
}
function Ls(s, e, t) {
  const i = s.canvas.getBoundingClientRect();
  s.mouse.x = (e - i.left) / i.width * 2 - 1, s.mouse.y = -((t - i.top) / i.height) * 2 + 1, s.raycaster.setFromCamera(s.mouse, s.camera);
  const n = Rt(s), r = s.raycaster.intersectObjects(n.interactableList, !1);
  if (r.length === 0)
    return { intersect: null, state: n };
  const o = r[0];
  if (!o.object.isBatchedMesh)
    return { intersect: o, state: n };
  const a = o.object, c = o.batchId !== void 0 ? o.batchId : o.instanceId;
  if (c === void 0)
    return { intersect: o, state: n };
  const d = a.userData.batchIdToUuid?.get(c);
  if (!d)
    return { intersect: o, state: n };
  const l = s.contentGroup.getObjectByProperty("uuid", d);
  return o.object = l ?? As(s, a, c, d), { intersect: o, state: n };
}
function Ts(s, e, t, i, n) {
  const r = Math.min(e, i), o = Math.max(e, i), a = Math.min(t, n), c = Math.max(t, n), d = s.camera.projectionMatrix.clone(), l = new u.Matrix4(), h = o - r, f = c - a, p = h / 2, m = f / 2, y = (o + r) / 2, g = (c + a) / 2, M = new u.Matrix4().makeTranslation(-y, -g, 0), k = new u.Matrix4().makeScale(1 / p, 1 / m, 1);
  l.multiplyMatrices(k, M);
  const b = l.multiply(d), C = new u.Frustum(), x = s.camera.matrixWorldInverse, w = b.clone().multiply(x);
  C.setFromProjectionMatrix(w);
  const P = [], I = new u.Box3(), R = new u.Matrix4();
  for (const T of s.interactableList) {
    if (T.isBatchedMesh) {
      const D = T, U = D.userData.batchIdToUuid, S = D.userData.batchIdToGeometry;
      if (!U || !S) continue;
      for (const [E, N] of U)
        try {
          const v = S.get(E);
          if (!v) continue;
          D.getMatrixAt(E, R), R.premultiply(D.matrixWorld);
          const A = new u.Box3();
          v.boundingBox || v.computeBoundingBox(), A.copy(v.boundingBox).applyMatrix4(R), C.intersectsBox(A) && P.push(N);
        } catch {
        }
      continue;
    }
    I.setFromObject(T), C.intersectsBox(I) && P.push(T.uuid);
  }
  return P;
}
function Us({
  uuid: s,
  nodeMap: e,
  bimIdToNodeIds: t
}) {
  const i = e.get(s);
  if (i && i.length > 0 && i[0].bimId)
    return i[0].bimId;
  for (const [n, r] of t.entries())
    if (r.includes(s)) {
      const o = n.split("::");
      return o.length > 1 ? o[1] : null;
    }
  return null;
}
function Dt(s, e) {
  for (const [t, i] of e.entries())
    if (t.endsWith(`::${s}`) && i.length > 0)
      return i[0];
  return null;
}
function Os(s, e, t) {
  return e.has(s) ? s : Dt(s, t) || s;
}
function At(s, e) {
  const t = e.get(s);
  return t && t.length > 0 ? t[0] : null;
}
function Lt({
  id: s,
  nodeMap: e,
  nbimPropsByOriginalUuid: t
}) {
  const i = At(s, e);
  if (!i || !i.bimId) return null;
  const n = i.userData?.originalUuid ? String(i.userData.originalUuid) : "";
  if (!n) return null;
  const r = t.get(n);
  return r ? {
    entry: r[`${n}::${i.bimId}`],
    node: i
  } : null;
}
function zs(s) {
  const e = Lt(s);
  if (!e?.entry || typeof e.entry != "object") return e?.entry || null;
  const { ifcRawGroups: t, ifcNormalizedGroups: i, ...n } = e.entry;
  return n;
}
function Fs(s, e = "raw") {
  const t = Lt(s);
  if (!t?.entry || typeof t.entry != "object") return null;
  const i = t.entry.ifcRawGroups, n = t.entry.ifcNormalizedGroups;
  return e === "normalized" ? n || i || null : i || n || null;
}
function Es(s) {
  let e = 0;
  const t = /* @__PURE__ */ new Set();
  return s.traverse((i) => {
    if (i.name === "__EdgesHelper" || !i.isMesh && !i.isBatchedMesh) return;
    const n = i;
    (Array.isArray(n.material) ? n.material : [n.material]).forEach((o) => {
      o && Object.values(o).forEach((a) => {
        if (!(a instanceof u.Texture) || t.has(a)) return;
        t.add(a);
        const c = a.image, d = c?.width || 0, l = c?.height || 0;
        d > 0 && l > 0 && (e += d * l * 4 / (1024 * 1024));
      });
    });
  }), parseFloat(e.toFixed(2));
}
function Gs(s) {
  const e = s.renderer.info.render.calls, t = Es(s.contentGroup);
  return {
    meshes: s.originalStats.meshes,
    faces: s.originalStats.faces,
    memory: parseFloat(s.originalStats.memory.toFixed(2)),
    textureMemory: t,
    drawCalls: e,
    chunksLoaded: s.chunkLoadedCount,
    chunksTotal: s.chunksLength,
    chunksQueued: s.processingChunkCount,
    pixelRatio: Number(s.activePixelRatio.toFixed(2))
  };
}
function Vs(s, e, t) {
  const i = (n) => {
    n.visible = t, n.children?.forEach(i);
  };
  e.children?.forEach(i), s.forEach((n) => {
    n.forEach((r) => {
      r.visible = t;
    });
  });
}
function Ws(s, e) {
  s.forEach((t) => {
    t.forEach((i) => {
      i.mesh.setVisibleAt(i.instanceId, e);
    });
  });
}
function Tt(s, e) {
  if (!(s.name === "Helpers" || s.name === "Measure")) {
    if (s.isMesh && s.userData.isOptimized) {
      s.visible = !1;
      return;
    }
    s.visible = e;
  }
}
function De(s, e) {
  let t = s?.parent;
  for (; t && t !== e; )
    t.visible = !0, t = t.parent;
}
function Ns(s, e, t, i) {
  const n = [];
  if (s.has(e) && n.push(e), t)
    return t.traverse((r) => {
      s.has(r.uuid) && n.push(r.uuid);
    }), n;
  if (i && i.length > 0) {
    const r = (o) => {
      s.has(o.id) && n.push(o.id), o.children?.forEach(r);
    };
    r(i[0]);
  }
  return n;
}
function Ut(s, e, t) {
  e.visible = t, e.children?.forEach((n) => Ut(s, n, t)), s.get(e.id)?.forEach((n) => {
    n.visible = t;
  });
}
function it(s, e, t) {
  const i = s.get(e);
  i && i.forEach((n) => {
    n.mesh.setVisibleAt(n.instanceId, t);
  });
}
function Ot(s, e) {
  return Vs(s.nodeMap, s.structureRoot, e), Ws(s.optimizedMapping, e), s.contentGroup.traverse((t) => {
    Tt(t, e);
  }), {
    needsBoundsUpdate: !0,
    needsExplodeRefresh: !0,
    needsRender: !0
  };
}
function Ae(s, e, t, i = !0) {
  const n = s.nodeMap.get(e);
  n?.forEach((a) => Ut(s.nodeMap, a, t));
  const r = s.contentGroup.getObjectByProperty("uuid", e);
  t && r && i && De(r, s.scene);
  const o = t ? [] : Ns(s.highlightedUuids, e, r, n);
  if (!r) {
    if (n && n.length > 0) {
      const a = (c) => {
        it(s.optimizedMapping, c.id, t), c.children?.forEach(a);
      };
      a(n[0]);
    }
    return {
      needsBoundsUpdate: !0,
      needsExplodeRefresh: !1,
      needsRender: !0,
      nextHighlightedUuids: o.length > 0 ? Array.from(new Set([...s.highlightedUuids].filter((a) => !o.includes(a)))) : void 0
    };
  }
  return r.traverse((a) => {
    a.name === "Helpers" || a.name === "Measure" || (Tt(a, t), it(s.optimizedMapping, a.uuid, t));
  }), {
    needsBoundsUpdate: !0,
    needsExplodeRefresh: !1,
    needsRender: !0,
    nextHighlightedUuids: o.length > 0 ? Array.from(new Set([...s.highlightedUuids].filter((a) => !o.includes(a)))) : void 0
  };
}
function Hs(s, e, t = {}) {
  if (e.length === 0)
    return {
      needsBoundsUpdate: !1,
      needsExplodeRefresh: !1,
      needsRender: !1
    };
  let i = new Set(s.highlightedUuids), n = !1;
  return e.forEach((r) => {
    const o = Ae(
      {
        ...s,
        highlightedUuids: i
      },
      r.uuid,
      r.visible,
      r.showParents ?? !0
    );
    o.nextHighlightedUuids && (i = new Set(o.nextHighlightedUuids)), n = n || o.needsRender;
  }), {
    needsBoundsUpdate: t.recomputeBounds ?? !0,
    needsExplodeRefresh: t.refreshExplode ?? !1,
    needsRender: n,
    nextHighlightedUuids: Array.from(i)
  };
}
function $s(s, e, t) {
  Ot(s, !1);
  const i = /* @__PURE__ */ new Set();
  return e.forEach((n) => {
    t(n, !0);
    const r = s.nodeMap.get(n);
    r && r.forEach((a) => {
      const c = (d) => {
        d.id !== n && t(d.id, !0), d.children?.forEach(c);
      };
      c(a);
    }), s.optimizedMapping.get(n)?.forEach((a) => {
      i.add(a.mesh);
    });
  }), i.forEach((n) => {
    n.visible = !0, De(n, s.scene);
  }), e.forEach((n) => {
    const r = s.contentGroup.getObjectByProperty("uuid", n);
    r && De(r, s.scene);
  }), {
    needsBoundsUpdate: !0,
    needsExplodeRefresh: !0,
    needsRender: !0
  };
}
const j = {
  chunkReadCacheSize: 128,
  chunkPrefetchWindow: 0,
  ghostMode: "visible-first",
  targetMinFps: 20,
  loadProfile: "max-speed",
  deferIfcProperties: !0,
  preferWorkerOctree: !0,
  fastGeometrySanitize: !0
};
function st(s) {
  return {
    chunkReadCacheSize: Math.max(8, Math.min(256, Math.floor(s?.chunkReadCacheSize ?? j.chunkReadCacheSize))),
    chunkPrefetchWindow: Math.max(0, Math.min(32, Math.floor(s?.chunkPrefetchWindow ?? j.chunkPrefetchWindow))),
    ghostMode: s?.ghostMode ?? j.ghostMode,
    targetMinFps: Math.max(20, Math.min(60, Math.floor(s?.targetMinFps ?? j.targetMinFps))),
    loadProfile: s?.loadProfile ?? j.loadProfile,
    deferIfcProperties: s?.deferIfcProperties ?? j.deferIfcProperties,
    preferWorkerOctree: s?.preferWorkerOctree ?? j.preferWorkerOctree,
    fastGeometrySanitize: s?.fastGeometrySanitize ?? j.fastGeometrySanitize
  };
}
const _s = 220, Qs = 180;
class Ys {
  constructor(e, t = {}) {
    this.structureRoot = { id: "root", name: "Root", type: "Group", children: [] }, this.nodeMap = /* @__PURE__ */ new Map(), this.bimIdToNodeIds = /* @__PURE__ */ new Map(), this.lastSelectedUuid = null, this.highlightedUuids = /* @__PURE__ */ new Set(), this.locateFocusUuid = null, this.locateResultSet = /* @__PURE__ */ new Set(), this.locateMaterialCache = /* @__PURE__ */ new Map(), this.locateObjectMaterialCache = /* @__PURE__ */ new Map(), this.locateDimmedInstances = /* @__PURE__ */ new Map(), this.locateIsolationRestoreChanges = [], this.locateIsolationActive = !1, this.clashPairObjectMaterialCache = /* @__PURE__ */ new Map(), this.clashPairInstanceColorCache = /* @__PURE__ */ new Map(), this.clashPairUuids = /* @__PURE__ */ new Set(), this.highlightPulseColor = new u.Color("#ffffff"), this.explodeEnabled = !1, this.explodeStrength = 0, this.explodeCenter = new u.Vector3(), this.explodeMode = "radial", this.explodeObjectStates = /* @__PURE__ */ new Map(), this.explodeInstanceStates = /* @__PURE__ */ new Map(), this.explodeScratchUniform = new u.Vector3(), this.explodeScratchMix = new u.Vector3(), this.measureType = "none", this.currentMeasurePoints = [], this.currentMeasureModelUuid = null, this.previewLine = null, this.previewPolygon = null, this.measureRecords = /* @__PURE__ */ new Map(), this.boxSelectState = oi(), this.clippingPlanes = [], this.clipPlaneHelpers = [], this.clipHelperVisible = !1, this.clipHelperOpacity = 0.12, this.sceneCenter = new u.Vector3(), this.globalOffset = new u.Vector3(), this.componentMap = /* @__PURE__ */ new Map(), this.optimizedMapping = /* @__PURE__ */ new Map(), this.settings = {
      ambientInt: 0.78,
      dirInt: 1.48,
      hemiInt: 0.58,
      bgColor: "#eef2f5",
      viewCubeSize: 100,
      colorSpace: "srgb",
      toneMapping: "aces",
      exposure: 0.92,
      shadowQuality: "medium",
      adaptiveQuality: !0,
      minPixelRatio: 0.8,
      maxPixelRatio: 2,
      targetFps: 50,
      performanceMode: "balanced",
      highlightColor: "#ff9f1c",
      highlightShowBox: !1,
      backLightInt: 0.62,
      maxRenderDistance: 1e6
      // 增加默认渲染距离到 1km (针对 mm 单位)
    }, this.sceneBounds = new u.Box3(), this.cachedSceneSphere = new u.Sphere(), this.sceneSphereValid = !1, this.precomputedBounds = new u.Box3(), this.chunks = [], this.chunkIdSet = /* @__PURE__ */ new Set(), this.chunkById = /* @__PURE__ */ new Map(), this.chunkIndexById = /* @__PURE__ */ new Map(), this.processingChunks = /* @__PURE__ */ new Set(), this.cancelledChunkIds = /* @__PURE__ */ new Set(), this.frustum = new u.Frustum(), this.projScreenMatrix = new u.Matrix4(), this.logicTimer = null, this.nbimFiles = /* @__PURE__ */ new Map(), this.nbimMeta = /* @__PURE__ */ new Map(), this.nbimPropsByOriginalUuid = /* @__PURE__ */ new Map(), this.nbimPropertyDocsByOriginalUuid = /* @__PURE__ */ new Map(), this.nbimSearchDocsByUuid = /* @__PURE__ */ new Map(), this.nbimPropertyNameIndex = /* @__PURE__ */ new Map(), this.nbimPropertyNameIndexVersion = 0, this.sharedMaterial = Qt(), this.interactableList = [], this.interactableListValid = !1, this._needsBoundsUpdate = !1, this.lastReportedProgress = { loaded: -1, total: -1 }, this.lastChunkProgressReportAt = 0, this.chunkLoadedCount = 0, this.chunkPadding = 0.2, this.maxConcurrentChunkLoads = 128, this.maxChunkLoadsPerFrame = 64, this.maxLoadedChunks = 512, this.maxCachedChunks = 48, this.chunkLoadingEnabled = !0, this.maxRenderDistance = 1e6, this._lastCullingTime = 0, this.chunkMeshCache = /* @__PURE__ */ new Map(), this.chunkCacheOrder = [], this.chunkReadCache = /* @__PURE__ */ new Map(), this.chunkReadCacheOrder = [], this.prefetchQueue = [], this.prefetchQueueSet = /* @__PURE__ */ new Set(), this.prefetchInFlight = /* @__PURE__ */ new Set(), this.prefetchRoundRobinCursor = 0, this.prefetchPaused = !1, this.originalStats = { meshes: 0, faces: 0, memory: 0 }, this.originalStatsByModel = /* @__PURE__ */ new Map(), this.workers = [], this.workerQueue = [], this.activeWorkerCount = 0, this.maxWorkers = 4, this.isCameraMoving = !1, this.activePixelRatio = 1, this.chunkLoadResumeAt = 0, this.cullingDirty = !0, this.deferredStructureThreshold = 2e4, this.octreeWorkerThreshold = 25e3, this.initialChunkLoadTarget = 18, this.warmupChunkBoost = 12, this.chunkWarmupActive = !1, this.chunkResidencyMs = 1800, this.chunkRuntimeProfiles = {
      compact: {
        name: "compact",
        movingFocusCentralityThreshold: 0.16,
        movingFocusPixelThreshold: 24,
        chunkVisibilityHoldMs: 180,
        centerPriorityThreshold: 0.52,
        forwardPriorityThreshold: 0.64,
        movingCoreCentralityThreshold: 0.5,
        movingCorePixelThreshold: 36,
        movingCoreForwardThreshold: 0.58,
        movingPeripheralRefreshMs: 140,
        movingPeripheralBatchRatio: 0.24,
        movingPeripheralMinBatchSize: 40,
        movingCullingIntervalMs: 34,
        recoveryCullingIntervalMs: 58,
        idleCullingIntervalMs: 120,
        resumeAfterMoveMs: 90,
        postMoveRecoveryMs: 320,
        centerPriorityWindowMs: 180,
        movingLoadBudgetMin: 2,
        movingLoadBudgetMax: 8,
        recoveryLoadBudgetMin: 4,
        recoveryLoadBudgetMax: 12,
        recoveryLoadBudgetRatio: 0.45
      },
      balanced: {
        name: "balanced",
        movingFocusCentralityThreshold: 0.18,
        movingFocusPixelThreshold: 28,
        chunkVisibilityHoldMs: 220,
        centerPriorityThreshold: 0.58,
        forwardPriorityThreshold: 0.68,
        movingCoreCentralityThreshold: 0.54,
        movingCorePixelThreshold: 42,
        movingCoreForwardThreshold: 0.62,
        movingPeripheralRefreshMs: 180,
        movingPeripheralBatchRatio: 0.18,
        movingPeripheralMinBatchSize: 64,
        movingCullingIntervalMs: 40,
        recoveryCullingIntervalMs: 72,
        idleCullingIntervalMs: 140,
        resumeAfterMoveMs: 110,
        postMoveRecoveryMs: 480,
        centerPriorityWindowMs: 240,
        movingLoadBudgetMin: 2,
        movingLoadBudgetMax: 6,
        recoveryLoadBudgetMin: 4,
        recoveryLoadBudgetMax: 10,
        recoveryLoadBudgetRatio: 0.36
      },
      massive: {
        name: "massive",
        movingFocusCentralityThreshold: 0.2,
        movingFocusPixelThreshold: 32,
        chunkVisibilityHoldMs: 260,
        centerPriorityThreshold: 0.62,
        forwardPriorityThreshold: 0.72,
        movingCoreCentralityThreshold: 0.58,
        movingCorePixelThreshold: 48,
        movingCoreForwardThreshold: 0.66,
        movingPeripheralRefreshMs: 220,
        movingPeripheralBatchRatio: 0.12,
        movingPeripheralMinBatchSize: 96,
        movingCullingIntervalMs: 46,
        recoveryCullingIntervalMs: 88,
        idleCullingIntervalMs: 180,
        resumeAfterMoveMs: 130,
        postMoveRecoveryMs: 620,
        centerPriorityWindowMs: 300,
        movingLoadBudgetMin: 2,
        movingLoadBudgetMax: 5,
        recoveryLoadBudgetMin: 3,
        recoveryLoadBudgetMax: 8,
        recoveryLoadBudgetRatio: 0.28
      }
    }, this.movingPeripheralCursor = 0, this.movingPeripheralLastRefreshAt = 0, this.postMoveRecoveryUntil = 0, this.deferredStructureTimer = null, this.deferredStructureToken = 0, this.loadGeneration = 0, this.fastPreviewMeshLimit = 1200, this.fastPreviewModels = /* @__PURE__ */ new Set(), this.chunkCullingTempSize = new u.Vector3(), this.chunkCullingTempDirection = new u.Vector3(), this.chunkCullingTempForward = new u.Vector3(), this.chunkCullingTempCenterNdc = new u.Vector3(), this.boundsScanBatchSize = 2400, this.chunkRegistrationBatchSize = 18, this.chunkGhostBatchSize = 24, this.animationFrameId = null, this.cameraFlightFrameId = null, this.cameraFlightToken = 0, this.animateFramePending = !1, this.disposed = !1, this.interactionShadowDowngraded = !1, this.interactionShadowRestoreAt = 0, this.interactionShadowRestoreDelayMs = 220, this.cullingScanCursor = 0, this.cullingTimeBudgetMovingMs = 4.5, this.cullingTimeBudgetRecoveryMs = 6, this.cullingTimeBudgetIdleMs = 9, this.forceMaxChunkLoadSpeed = !0, this.ghostMeshPool = [], this.animate = () => {
      if (this.disposed) return;
      this.animateFramePending = !1, this.animationFrameId = null;
      const h = performance.now();
      this.controls && this.controls.update(), this.updateInteractionPerformance(h), this.updateAdaptiveQuality(), this._needsBoundsUpdate && (this.updateSceneBounds(), this._needsBoundsUpdate = !1), this.updateCameraClipping();
      const f = performance.now(), p = this.getChunkRuntimeProfile(), m = this.getChunkRenderPhase(f), y = this.cullingDirty ? m === "moving" ? p.movingCullingIntervalMs : m === "recovery" ? p.recoveryCullingIntervalMs : Math.min(p.recoveryCullingIntervalMs, 70) : p.idleCullingIntervalMs;
      (!this._lastCullingTime || f - this._lastCullingTime > y) && (this.checkCullingAndLoad(f), this._lastCullingTime = f, this.cullingDirty = !1);
      const g = this.highlightMesh.material;
      if (g)
        if (this.locateFocusUuid && this.highlightMesh.visible) {
          const x = new u.Color(this.settings.highlightColor || "#ff9f1c"), w = 0.22 + (Math.sin(h / 125) + 1) * 0.3;
          g.color.copy(x).lerp(this.highlightPulseColor, w), g.opacity = 1;
        } else
          g.color.set(this.settings.highlightColor || "#ff9f1c"), g.opacity = 1;
      const M = this.selectionBox.material;
      if (this.locateFocusUuid && this.selectionBox.visible && M && !Array.isArray(M)) {
        const x = new u.Color(this.settings.highlightColor || "#ff9f1c"), w = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(h / 125));
        M.color.copy(x).lerp(this.highlightPulseColor, 0.34 * w);
      } else M && !Array.isArray(M) && M.color.set(this.settings.highlightColor || "#ff9f1c");
      this.renderer.render(this.scene, this.camera);
      const k = this.chunkLoadingEnabled && this.chunks.length > 0 && this.chunkLoadedCount < this.chunks.length, b = !!(this.locateFocusUuid && (this.highlightMesh.visible || this.selectionBox.visible));
      (this.isCameraMoving || this.isInPostMoveRecovery(f) || this.processingChunks.size > 0 || this.chunkWarmupActive || k || b) && this.requestRender();
    }, this.canvas = e, this.options = t, this.resolvedChunkOptions = st(t.chunkOptions), t.performancePreset && (this.settings.performanceMode = t.performancePreset);
    const i = e.clientWidth, n = e.clientHeight;
    this.dotTexture = this.createCircleTexture(), this.clock = new u.Clock(), this.initHardwareProfile(), this.ghostEdgesGeometry = new u.EdgesGeometry(new u.BoxGeometry(1, 1, 1)), this.ghostMaterial = new u.LineBasicMaterial({ color: 4674921, transparent: !0, opacity: 0.3 }), this.renderer = new u.WebGLRenderer({
      canvas: e,
      antialias: !0,
      alpha: !1,
      logarithmicDepthBuffer: !1,
      // 正交相机不建议开启对数深度缓冲区，会导致 negative near 裁剪问题
      precision: "highp",
      powerPreference: "high-performance"
    }), this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)), this.renderer.setSize(i, n, !1), qt(this.renderer, this.settings.bgColor, this.settings.exposure), this.renderer.localClippingEnabled = !0, this.activePixelRatio = this.renderer.getPixelRatio(), this.scene = new u.Scene(), this.scene.background = new u.Color(this.settings.bgColor), this.contentGroup = new u.Group(), this.contentGroup.name = "Content", this.scene.add(this.contentGroup), this.helpersGroup = new u.Group(), this.helpersGroup.name = "Helpers", this.scene.add(this.helpersGroup), this.measureGroup = new u.Group(), this.measureGroup.name = "Measure", this.scene.add(this.measureGroup), this.ghostGroup = new u.Group(), this.ghostGroup.name = "Ghost", this.scene.add(this.ghostGroup), this.clipHelpersGroup = new u.Group(), this.clipHelpersGroup.name = "ClipHelpers", this.scene.add(this.clipHelpersGroup);
    const r = 100, o = i / n;
    this.camera = new u.OrthographicCamera(
      r * o / -2,
      r * o / 2,
      r / 2,
      r / -2,
      -1e6,
      1e6
    ), this.camera.up.set(0, 0, 1), this.camera.position.set(1e3, -1e3, 1e3), this.camera.lookAt(0, 0, 0), this.controls = new Vt(this.camera, e), this.controls.enableDamping = !1, this.controls.screenSpacePanning = !0, this.controls.maxPolarAngle = Math.PI, this.controls.mouseButtons = {
      LEFT: u.MOUSE.ROTATE,
      MIDDLE: u.MOUSE.PAN,
      RIGHT: void 0
    }, this.controls.addEventListener("start", () => {
      const h = this.getChunkRuntimeProfile();
      this.isCameraMoving = !0, this.prefetchPaused = !0, this.chunkLoadResumeAt = performance.now() + h.resumeAfterMoveMs, this.postMoveRecoveryUntil = 0, this.interactionShadowRestoreAt = 0, this.movingPeripheralLastRefreshAt = 0, this.movingPeripheralCursor = 0, this.markSceneDirty({ needsCulling: !0 });
    }), this.controls.addEventListener("change", () => {
      const h = this.getChunkRuntimeProfile();
      this.isCameraMoving = !0, this.prefetchPaused = !0, this.chunkLoadResumeAt = performance.now() + h.resumeAfterMoveMs, this.postMoveRecoveryUntil = 0, this.interactionShadowRestoreAt = 0, this.markSceneDirty({ needsCulling: !0 });
    }), this.controls.addEventListener("end", () => {
      const h = performance.now(), f = this.getChunkRuntimeProfile();
      if (this.isCameraMoving = !1, this.prefetchPaused = !1, this.chunkLoadResumeAt = h + Math.max(24, Math.floor(f.resumeAfterMoveMs * 0.75)), this.postMoveRecoveryUntil = h + f.postMoveRecoveryMs, this.interactionShadowRestoreAt = h + this.interactionShadowRestoreDelayMs, this.movingPeripheralLastRefreshAt = 0, this.movingPeripheralCursor = 0, this.controls.target.length() > 5e4) {
        const m = this.controls.target.clone();
        this.scene.position.sub(m), this.camera.position.sub(m), this.controls.target.set(0, 0, 0), this.camera.updateProjectionMatrix(), this.dirLight && this.dirLight.position.sub(m), this.backLight && this.backLight.position.sub(m), this.precomputedBounds.translate(m.clone().negate()), this.sceneBounds.translate(m.clone().negate());
      }
      this.markSceneDirty({ needsCulling: !0 });
    }), this.hemiLight = new u.HemisphereLight(16317439, 14279144, this.settings.hemiInt ?? 0.58), this.scene.add(this.hemiLight), this.ambientLight = new u.AmbientLight(16251131, this.settings.ambientInt), this.scene.add(this.ambientLight), this.dirLight = new u.DirectionalLight(16776438, this.settings.dirInt), this.dirLight.position.set(120, -90, 180), this.scene.add(this.dirLight), this.backLight = new u.DirectionalLight(15199733, this.settings.backLightInt ?? 0.62), this.backLight.position.set(-90, 60, 85), this.scene.add(this.backLight);
    const a = new u.Box3(new u.Vector3(), new u.Vector3());
    this.selectionBox = new u.Box3Helper(a, new u.Color(16776960)), this.selectionBox.visible = !1, this.helpersGroup.add(this.selectionBox);
    const c = new u.MeshBasicMaterial({
      color: this.settings.highlightColor,
      transparent: !1,
      opacity: 1,
      depthTest: !1,
      depthWrite: !1,
      side: u.BackSide
    });
    this.highlightMesh = new u.Mesh(new u.BufferGeometry(), c), this.highlightMesh.visible = !1, this.highlightMesh.renderOrder = 999, this.helpersGroup.add(this.highlightMesh);
    const d = new u.BufferGeometry();
    d.setAttribute("position", new u.Float32BufferAttribute([0, 0, 0], 3));
    const l = new u.PointsMaterial({
      color: 16711680,
      size: 8,
      sizeAttenuation: !1,
      map: this.dotTexture,
      transparent: !0,
      alphaTest: 0.5,
      depthTest: !1
    });
    this.tempMarker = new u.Points(d, l), this.tempMarker.visible = !1, this.tempMarker.renderOrder = 1e3, this.helpersGroup.add(this.tempMarker), this.setupClipping(), this.raycaster = new u.Raycaster(), this.raycaster.params.Points.threshold = 10, this.raycaster.params.Line || (this.raycaster.params.Line = { threshold: 1 }), this.raycaster.params.Line.threshold = 2, this.mouse = new u.Vector2(), this.animate = this.animate.bind(this), this.markSceneDirty();
  }
  registerChunk(e) {
    this.chunks.push(e), this.chunkIdSet.add(e.id), this.chunkById.set(e.id, e), this.chunkIndexById.set(e.id, this.chunks.length - 1);
  }
  rebuildChunkIdSet() {
    this.chunkIdSet.clear(), this.chunkById.clear(), this.chunkIndexById.clear();
    for (let e = 0; e < this.chunks.length; e++) {
      const t = this.chunks[e];
      this.chunkIdSet.add(t.id), this.chunkById.set(t.id, t), this.chunkIndexById.set(t.id, e);
    }
  }
  getChunkById(e) {
    return this.chunkById.get(e);
  }
  getChunkIndex(e) {
    return this.chunkIndexById.get(e) ?? -1;
  }
  /** 按需调度一帧：合并多次调用，在相机静止且无后台任务时不常驻 requestAnimationFrame */
  requestRender() {
    this.disposed || this.animateFramePending || (this.animateFramePending = !0, this.animationFrameId = requestAnimationFrame(this.animate));
  }
  markSceneDirty(e = {}) {
    const {
      needsRender: t = !0,
      needsBoundsUpdate: i = !1,
      needsCulling: n = !1,
      invalidateInteractables: r = !1
    } = e;
    r && (this.interactableListValid = !1), i && (this._needsBoundsUpdate = !0), n && (this.cullingDirty = !0), t && this.requestRender();
  }
  invalidateRender(e = {}) {
    this.markSceneDirty(e);
  }
  updateSettings(e) {
    this.settings = { ...this.settings, ...e }, this.applyHighlightSettings(), e.clip && this.setClipHelperOptions({
      visible: e.clip.helperVisible,
      opacity: e.clip.helperOpacity
    }), this.ambientLight.intensity = this.settings.ambientInt, this.hemiLight && (this.hemiLight.intensity = this.settings.hemiInt ?? 0.58), this.dirLight.intensity = this.settings.dirInt, this.backLight.intensity = this.settings.backLightInt ?? 0.62, this.renderer.outputColorSpace = this.settings.colorSpace === "linear" ? u.LinearSRGBColorSpace : u.SRGBColorSpace, this.renderer.toneMapping = this.settings.toneMapping === "none" ? u.NoToneMapping : this.settings.toneMapping === "neutral" ? u.NeutralToneMapping : u.ACESFilmicToneMapping, this.renderer.toneMappingExposure = this.settings.exposure ?? 0.92, this.renderer.setClearColor(this.settings.bgColor, 1), this.scene.background = new u.Color(this.settings.bgColor), e.frustumCulling !== void 0 && this.contentGroup.traverse((t) => {
      t.isMesh ? t.frustumCulled = e.frustumCulling : t.isBatchedMesh && (t.frustumCulled = !1);
    }), e.maxRenderDistance !== void 0 && (this.maxRenderDistance = e.maxRenderDistance, this.checkCullingAndLoad()), this.markSceneDirty({
      needsCulling: e.maxRenderDistance !== void 0,
      invalidateInteractables: e.frustumCulling !== void 0
    });
  }
  createCircleTexture() {
    const t = document.createElement("canvas");
    t.width = 64, t.height = 64;
    const i = t.getContext("2d");
    return i && (i.beginPath(), i.arc(64 / 2, 64 / 2, 64 / 2 - 2, 0, 2 * Math.PI), i.fillStyle = "#ffffff", i.fill()), new u.CanvasTexture(t);
  }
  updateAdaptiveQuality() {
    if (!this.settings.adaptiveQuality) return;
    const e = window.devicePixelRatio || 1, t = Math.min(e, this.settings.minPixelRatio ?? 0.8), i = Math.min(e, this.settings.maxPixelRatio ?? 2), n = this.chunks.length, r = this.originalStats.meshes, o = this.settings.performanceMode ?? "balanced";
    let a = i;
    if (this.isCameraMoving) {
      const d = o === "quality" ? n > 3500 || r > 25e4 ? 0.68 : n > 1600 || r > 12e4 ? 0.76 : 0.84 : o === "smooth" ? n > 3500 || r > 25e4 ? 0.44 : n > 1600 || r > 12e4 ? 0.52 : 0.6 : n > 3500 || r > 25e4 ? 0.48 : n > 1600 || r > 12e4 ? 0.56 : 0.65;
      a = Math.max(t, i * d);
    }
    if (a = Math.max(t, Math.min(i, a)), Math.abs(a - this.activePixelRatio) < 0.05) return;
    this.activePixelRatio = a, this.renderer.setPixelRatio(a);
    const c = this.canvas.getBoundingClientRect();
    this.renderer.setSize(Math.max(1, c.width), Math.max(1, c.height), !1);
  }
  updateInteractionPerformance(e) {
    this.interactionShadowDowngraded && e >= this.interactionShadowRestoreAt && (this.interactionShadowDowngraded = !1);
  }
  initHardwareProfile() {
    const e = navigator, t = Math.max(2, e.hardwareConcurrency || 4), i = e.deviceMemory || 8, n = this.options.performancePreset ?? this.settings.performanceMode ?? "balanced", r = ei(t, n);
    this.forceMaxChunkLoadSpeed ? (this.maxWorkers = Math.max(4, Math.min(12, t - 1)), this.maxConcurrentChunkLoads = Math.max(128, Math.min(192, this.maxWorkers * 24)), this.maxChunkLoadsPerFrame = Math.max(64, Math.min(128, this.maxWorkers * 14)), this.cullingTimeBudgetMovingMs = 7.5, this.cullingTimeBudgetRecoveryMs = 10.5, this.cullingTimeBudgetIdleMs = 14, this.chunkRegistrationBatchSize = 28, this.chunkGhostBatchSize = 40) : (this.maxWorkers = 4, this.maxConcurrentChunkLoads = r.maxConcurrentChunkLoads, this.maxChunkLoadsPerFrame = r.maxChunkLoadsPerFrame), this.maxLoadedChunks = i <= 4 ? 160 : i <= 8 ? 320 : 640, this.maxCachedChunks = i <= 4 ? 24 : i <= 8 ? 48 : 96, this.settings.targetFps = this.resolvedChunkOptions.targetMinFps;
  }
  collectObjectOverview(e) {
    let t = 0, i = 0, n = 0;
    return e.traverse((r) => {
      const o = r;
      !o.isMesh || !o.geometry || (t++, o.geometry.index ? i += o.geometry.index.count / 3 : o.geometry.attributes.position && (i += o.geometry.attributes.position.count / 3), n += Xt(o.geometry));
    }), {
      meshes: t,
      faces: Math.floor(i),
      memory: parseFloat(n.toFixed(2))
    };
  }
  async estimateNbimStats(e, t, i) {
    let n = 0, r = 0, o = 0;
    for (let a = 0; a < t.length; a++) {
      const c = t[a], d = await e.slice(c.byteOffset, c.byteOffset + c.byteLength).arrayBuffer(), l = new DataView(d);
      let h = 0;
      const f = l.getUint32(h, !0);
      h += 4;
      const p = [];
      for (let y = 0; y < f; y++) {
        const g = l.getUint32(h, !0);
        h += 4;
        const M = l.getUint32(h, !0);
        h += 4, h += g * 12, h += g * 12, M > 0 && (h += M * 4), p.push(M > 0 ? M / 3 : g / 3);
      }
      const m = l.getUint32(h, !0);
      h += 4, n += m, o += c.byteLength / (1024 * 1024);
      for (let y = 0; y < m; y++) {
        h += 4, h += 4, h += 4, h += 64;
        const g = l.getUint32(h, !0);
        h += 4, r += p[g] || 0;
      }
      a > 0 && a % 8 === 0 && await this.yieldToMainThread();
    }
    return {
      meshes: n,
      faces: Math.floor(r),
      memory: parseFloat(o.toFixed(2))
    };
  }
  registerOriginalStats(e, t) {
    this.originalStatsByModel.set(e, t), this.originalStats.meshes += t.meshes, this.originalStats.faces += t.faces, this.originalStats.memory = parseFloat((this.originalStats.memory + t.memory).toFixed(2));
  }
  unregisterOriginalStats(e) {
    const t = this.originalStatsByModel.get(e);
    t && (this.originalStats.meshes = Math.max(0, this.originalStats.meshes - t.meshes), this.originalStats.faces = Math.max(0, this.originalStats.faces - t.faces), this.originalStats.memory = parseFloat(Math.max(0, this.originalStats.memory - t.memory).toFixed(2)), this.originalStatsByModel.delete(e));
  }
  disposeChunkMesh(e) {
    wi({
      mesh: e,
      sharedMaterial: this.sharedMaterial
    });
  }
  touchChunkCache(e) {
    this.chunkCacheOrder = lt(this.chunkCacheOrder, e);
  }
  cacheChunkMesh(e, t) {
    const i = Si({
      chunk: e,
      mesh: t,
      chunkMeshCache: this.chunkMeshCache,
      chunkCacheOrder: this.chunkCacheOrder,
      maxCachedChunks: this.maxCachedChunks,
      disposeChunkMesh: (n) => this.disposeChunkMesh(n)
    });
    this.chunkCacheOrder = i.chunkCacheOrder;
  }
  takeCachedChunkMesh(e) {
    const t = vi({
      chunkId: e,
      chunkMeshCache: this.chunkMeshCache,
      chunkCacheOrder: this.chunkCacheOrder
    });
    return this.chunkCacheOrder = t.chunkCacheOrder, t.mesh;
  }
  clearChunkCache(e) {
    this.chunkCacheOrder = Ii({
      chunkMeshCache: this.chunkMeshCache,
      chunkCacheOrder: this.chunkCacheOrder,
      disposeChunkMesh: (t) => this.disposeChunkMesh(t),
      filter: e
    });
  }
  hasValidChunkBinaryRange(e) {
    return Ue(e);
  }
  async readChunkBuffer(e) {
    const t = await ui({
      chunk: e,
      nbimFiles: this.nbimFiles,
      chunkReadCache: this.chunkReadCache,
      chunkReadCacheOrder: this.chunkReadCacheOrder,
      chunkReadCacheSize: this.resolvedChunkOptions.chunkReadCacheSize
    });
    return this.chunkReadCacheOrder = t.chunkReadCacheOrder, t.buffer;
  }
  enqueueChunkPrefetch(e) {
    this.prefetchQueue = di({
      chunkIds: e,
      chunkPrefetchWindow: this.resolvedChunkOptions.chunkPrefetchWindow,
      prefetchQueue: this.prefetchQueue,
      prefetchQueueSet: this.prefetchQueueSet,
      prefetchInFlight: this.prefetchInFlight
    });
  }
  schedulePrefetchFromVisibleChunks(e) {
    const t = fi({
      visibleChunks: e,
      chunkPrefetchWindow: this.resolvedChunkOptions.chunkPrefetchWindow,
      prefetchPaused: this.prefetchPaused,
      isCameraMoving: this.isCameraMoving,
      prefetchRoundRobinCursor: this.prefetchRoundRobinCursor,
      chunks: this.chunks,
      processingChunks: this.processingChunks,
      chunkReadCache: this.chunkReadCache,
      getChunkIndex: (i) => this.getChunkIndex(i)
    });
    this.prefetchRoundRobinCursor = t.prefetchRoundRobinCursor, this.enqueueChunkPrefetch(t.chunkIds), this.processPrefetchQueue();
  }
  async processPrefetchQueue() {
    await xi({
      prefetchPaused: this.prefetchPaused,
      isCameraMoving: this.isCameraMoving,
      prefetchQueue: this.prefetchQueue,
      prefetchQueueSet: this.prefetchQueueSet,
      prefetchInFlight: this.prefetchInFlight,
      maxWorkers: this.maxWorkers,
      getChunkById: (e) => this.getChunkById(e),
      chunkReadCache: this.chunkReadCache,
      readChunkBuffer: (e) => this.readChunkBuffer(e),
      processQueue: () => this.processPrefetchQueue()
    });
  }
  unregisterOptimizedMeshMapping(e) {
    Bi({
      mesh: e,
      optimizedMapping: this.optimizedMapping
    });
  }
  registerOptimizedMeshMapping(e) {
    Pi({
      mesh: e,
      optimizedMapping: this.optimizedMapping
    });
    const t = e.userData.batchIdToUuid;
    if (!t) return;
    let i = !1;
    t.forEach((n, r) => {
      const o = this.nodeMap.get(n);
      if (!o || o.length === 0) return;
      const a = o.some((c) => c.visible !== !1);
      e.setVisibleAt(r, a), i = !0;
    }), i && e.computeBoundingSphere?.();
  }
  acquireGhostLine() {
    return Ri({
      ghostMeshPool: this.ghostMeshPool,
      ghostEdgesGeometry: this.ghostEdgesGeometry,
      ghostMaterial: this.ghostMaterial
    });
  }
  releaseGhostLine(e) {
    Di({
      line: e,
      ghostMeshPool: this.ghostMeshPool
    });
  }
  createGhostLine(e, t) {
    return Ai({
      name: e,
      bounds: t,
      acquireGhostLine: () => this.acquireGhostLine()
    });
  }
  ensureChunkGhost(e) {
    Li({
      chunk: e,
      ghostGroup: this.ghostGroup,
      createGhostLine: (t, i) => this.createGhostLine(t, i)
    });
  }
  attachStructureRoot(e) {
    e.name === "Root" && e.children && e.children.length > 0 ? (this.structureRoot.children || (this.structureRoot.children = []), this.structureRoot.children.push(...e.children)) : (this.structureRoot.children || (this.structureRoot.children = []), this.structureRoot.children.push(e));
  }
  replaceStructureNode(e, t) {
    const i = (n) => {
      for (let r = 0; r < n.length; r++) {
        if (n[r].id === e)
          return n[r] = t, !0;
        if (n[r].children && i(n[r].children)) return !0;
      }
      return !1;
    };
    this.structureRoot.children && i(this.structureRoot.children);
  }
  buildAndRegisterModelStructure(e) {
    let t;
    e.userData.isIFC ? t = this.buildIFCStructure(e) : t = this.buildSceneGraph(e);
    const i = (r) => {
      r.userData || (r.userData = {}), r.userData.originalUuid = e.uuid, r.children && r.children.forEach(i);
    };
    i(t);
    const n = (r) => {
      if (r.bimId) {
        const o = `${e.uuid}::${r.bimId}`;
        this.bimIdToNodeIds.has(o) || this.bimIdToNodeIds.set(o, []), this.bimIdToNodeIds.get(o).push(r.id);
      }
      r.children && r.children.forEach(n);
    };
    return n(t), t;
  }
  async yieldToMainThread() {
    await new Promise((e) => requestAnimationFrame(() => e()));
  }
  createPreviewGhost(e, t) {
    const i = this.createGhostLine(t, e);
    return i.material instanceof u.LineBasicMaterial && (i.material.opacity = 0.45), this.ghostGroup.add(i), i;
  }
  async computeItemBoundsProgressively(e, t) {
    const i = new u.Box3(), n = new u.Vector3(), r = new u.Vector3(), o = new u.Vector3();
    for (let a = 0; a < e.length; a += this.boundsScanBatchSize) {
      const c = Math.min(e.length, a + this.boundsScanBatchSize);
      for (let d = a; d < c; d++) {
        const l = e[d], h = l.center;
        let f = 0;
        const p = l.geometry;
        if (p.boundingSphere || p.computeBoundingSphere(), p.boundingSphere) {
          o.setFromMatrixScale(l.matrix);
          const m = Math.max(o.x, o.y, o.z);
          f = p.boundingSphere.radius * m;
        }
        n.set(h.x - f, h.y - f, h.z - f), r.set(h.x + f, h.y + f, h.z + f), i.expandByPoint(n), i.expandByPoint(r);
      }
      t && e.length > 0 && t(20 + Math.min(12, Math.floor(c / e.length * 12)), "正在统计大模型范围..."), c < e.length && await this.yieldToMainThread();
    }
    return i.min.subScalar(0.1), i.max.addScalar(0.1), i;
  }
  async createChunkGhostsProgressively(e) {
    if (e.length !== 0)
      for (let t = 0; t < e.length; t += this.chunkGhostBatchSize) {
        const i = Math.min(e.length, t + this.chunkGhostBatchSize);
        let n = !1;
        for (let r = t; r < i; r++) {
          const o = e[r], a = this.getChunkById(o.chunkId);
          if (!a || a.loaded || this.cancelledChunkIds.has(o.chunkId) || this.ghostGroup.getObjectByName(`ghost_${o.chunkId}`)) continue;
          const c = this.createGhostLine(`ghost_${o.chunkId}`, o.bounds);
          this.ghostGroup.add(c), n = !0;
        }
        n && this.markSceneDirty(), i < e.length && await this.yieldToMainThread();
      }
  }
  async registerLeafChunksProgressively(e, t, i) {
    const n = [];
    for (let r = 0; r < t.length; r += this.chunkRegistrationBatchSize) {
      const o = Math.min(t.length, r + this.chunkRegistrationBatchSize);
      for (let a = r; a < o; a++) {
        const c = t[a], d = `${e.uuid}_chunk_${a}`, l = c.bounds.clone();
        c.items.forEach((p) => {
          const m = this.nodeMap.get(p.uuid);
          m && m.forEach((y) => {
            y.bimId === void 0 && (y.bimId = y.id), y.chunkId = d;
          });
        });
        const h = l.clone(), f = l.getSize(new u.Vector3()).multiplyScalar(this.chunkPadding);
        h.expandByVector(f), this.registerChunk({
          id: d,
          bounds: l,
          paddedBounds: h,
          _padding: this.chunkPadding,
          center: l.getCenter(new u.Vector3()),
          loaded: !1,
          node: c,
          groupName: `optimized_${e.uuid}`,
          originalUuid: e.uuid
        }), n.push({ chunkId: d, bounds: l });
      }
      i && t.length > 0 && i(40 + Math.floor(o / t.length * 50), `正在生成分块... (${o}/${t.length})`), o < t.length && await this.yieldToMainThread();
    }
    return n;
  }
  async buildLeafPlans(e, t, i, n) {
    const r = this.resolvedChunkOptions.preferWorkerOctree ? 1200 : this.octreeWorkerThreshold;
    if (e.length < r) {
      const l = nt(e, t, { maxItemsPerNode: i, maxDepth: n });
      return rt(l).map((h) => ({
        bounds: h.bounds,
        level: h.level,
        items: h.items
      }));
    }
    const o = new Float32Array(e.length * 3), a = new Float32Array(e.length);
    for (let l = 0; l < e.length; l++) {
      const h = e[l].center;
      o[l * 3] = h.x, o[l * 3 + 1] = h.y, o[l * 3 + 2] = h.z, a[l] = 0, l > 0 && l % 16e3 === 0 && await this.yieldToMainThread();
    }
    const c = await this.runWorkerTask({
      taskType: "buildOctreePlan",
      centers: o,
      radii: a,
      bounds: [
        t.min.x,
        t.min.y,
        t.min.z,
        t.max.x,
        t.max.y,
        t.max.z
      ],
      maxItemsPerNode: i,
      maxDepth: n
    }, [o.buffer, a.buffer]), d = [];
    for (let l = 0; l < c.length; l++) {
      const h = c[l];
      d.push({
        bounds: new u.Box3(
          new u.Vector3(h.bounds[0], h.bounds[1], h.bounds[2]),
          new u.Vector3(h.bounds[3], h.bounds[4], h.bounds[5])
        ),
        level: h.level,
        items: Array.from(h.itemIndices, (f) => e[f])
      }), l > 0 && l % 120 === 0 && await this.yieldToMainThread();
    }
    return d;
  }
  updateCameraClipping() {
    if (!this.sceneBounds || this.sceneBounds.isEmpty()) return;
    this.sceneSphereValid || (this.sceneBounds.getBoundingSphere(this.cachedSceneSphere), this.sceneSphereValid = !0);
    const e = this.camera.position.distanceTo(this.cachedSceneSphere.center), t = Math.max(this.cachedSceneSphere.radius * 20, e + this.cachedSceneSphere.radius * 5), i = 0.01;
    (Math.abs(this.camera.far - t) / Math.max(this.camera.far, 1) > i || Math.abs(this.camera.near - -t) / Math.max(Math.abs(this.camera.near), 1) > i) && (this.camera.near = -t, this.camera.far = t, this.camera.updateProjectionMatrix());
  }
  resize(e, t) {
    if (!this.canvas) return;
    let i = e, n = t;
    if (i === void 0 || n === void 0) {
      const h = this.canvas.parentElement?.getBoundingClientRect() || this.canvas.getBoundingClientRect();
      i = h.width, n = h.height;
    }
    if (i = Math.max(1, i), n = Math.max(1, n), i === 0 || n === 0) return;
    const r = i / n, o = this.camera, c = (o.top - o.bottom) / 2, d = c * r;
    o.left = -d, o.right = d, o.top = c, o.bottom = -c, o.updateProjectionMatrix();
    const l = this.settings.adaptiveQuality ? Math.min(window.devicePixelRatio, this.settings.maxPixelRatio ?? 2) : Math.min(window.devicePixelRatio, 2);
    this.activePixelRatio = l, this.renderer.setPixelRatio(l), this.renderer.setSize(i, n, !1), this.controls && this.controls.update(), this.markSceneDirty({ needsCulling: !0 });
  }
  reportChunkProgress() {
    const e = Ei({
      now: performance.now(),
      total: this.chunks.length,
      loaded: this.chunkLoadedCount,
      lastReportedProgress: this.lastReportedProgress,
      lastChunkProgressReportAt: this.lastChunkProgressReportAt
    });
    this.onChunkProgress && e.shouldNotify && (this.lastReportedProgress = e.nextProgress, this.lastChunkProgressReportAt = e.nextReportedAt, this.onChunkProgress(e.nextProgress.loaded, e.nextProgress.total));
  }
  getChunkRuntimeProfile(e = this.chunks.length) {
    return Gi({
      chunkCount: e,
      compact: this.chunkRuntimeProfiles.compact,
      balanced: this.chunkRuntimeProfiles.balanced,
      massive: this.chunkRuntimeProfiles.massive
    });
  }
  isInPostMoveRecovery(e) {
    return !this.isCameraMoving && e < this.postMoveRecoveryUntil;
  }
  applyHighlightSettings() {
    const e = this.highlightMesh.material;
    e && (e.color.set(this.settings.highlightColor || "#ff9f1c"), e.transparent = !1, e.opacity = 1, e.depthTest = !1, e.depthWrite = !1, e.side = u.BackSide, e.needsUpdate = !0);
    const t = this.selectionBox.material;
    Array.isArray(t) ? t.forEach((i) => i.color.set(this.settings.highlightColor || "#ff9f1c")) : t && t.color.set(this.settings.highlightColor || "#ff9f1c");
  }
  getChunkRenderPhase(e) {
    return this.isCameraMoving ? "moving" : this.isInPostMoveRecovery(e) ? "recovery" : "idle";
  }
  getChunkFrameBudget(e, t, i) {
    return Vi({
      forceMaxChunkLoadSpeed: this.forceMaxChunkLoadSpeed,
      maxChunkLoadsPerFrame: this.maxChunkLoadsPerFrame,
      performanceMode: this.settings.performanceMode ?? "balanced",
      chunkCount: this.chunks.length,
      phase: e,
      profile: t,
      warmupExtra: i
    });
  }
  isMovingPeripheralChunk(e, t, i, n) {
    return Wi({
      centrality: e,
      pixelSize: t,
      forwardness: i,
      profile: n
    });
  }
  shouldRefreshPeripheralChunk(e, t, i, n) {
    const r = Ni({
      now: e,
      isCameraMoving: this.isCameraMoving,
      chunkIndex: t,
      totalChunks: i,
      profile: n,
      movingPeripheralCursor: this.movingPeripheralCursor,
      movingPeripheralLastRefreshAt: this.movingPeripheralLastRefreshAt
    });
    return this.movingPeripheralCursor = r.movingPeripheralCursor, this.movingPeripheralLastRefreshAt = r.movingPeripheralLastRefreshAt, r.shouldRefresh;
  }
  checkCullingAndLoad(e = performance.now()) {
    if (!this.chunkLoadingEnabled || this.chunks.length === 0 || (this.reportChunkProgress(), this.processingChunks.size >= this.maxConcurrentChunkLoads)) return;
    const t = this.getChunkRuntimeProfile(), i = this.getChunkRenderPhase(e), n = this.settings.performanceMode ?? "balanced";
    this.camera.updateMatrixWorld(), this.projScreenMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse), this.frustum.setFromProjectionMatrix(this.projScreenMatrix);
    const r = this.chunkPadding, o = this.camera.position, a = this.chunkCullingTempForward;
    this.camera.getWorldDirection(a);
    const c = this.chunkCullingTempDirection, d = this.chunkCullingTempSize, l = this.chunkCullingTempCenterNdc, h = (this.camera.top - this.camera.bottom) / this.camera.zoom, f = this.renderer.domElement.clientHeight, p = [], m = [], y = this.renderer.clippingPlanes.length > 0;
    let g = !1;
    const M = this.chunks.length, k = performance.now(), b = i === "moving" ? this.cullingTimeBudgetMovingMs : i === "recovery" ? this.cullingTimeBudgetRecoveryMs : this.cullingTimeBudgetIdleMs;
    let C = !1;
    const x = n !== "quality" && i === "moving" && M > 1800, w = x ? M > 5e3 ? 8 : M > 3e3 ? 6 : 4 : 1, P = x ? Math.floor(e / Math.max(1, t.movingPeripheralRefreshMs)) % w : 0, I = M > 0 ? this.cullingScanCursor % M : 0;
    for (let D = 0; D < M; D++) {
      const U = (I + D) % M, S = this.chunks[U];
      if ((D & 31) === 0 && performance.now() - k > b) {
        C = !0, this.cullingScanCursor = (U + 1) % M;
        break;
      }
      zi({
        chunk: S,
        padding: r,
        tempSize: d
      });
      const E = this.frustum.intersectsBox(S.paddedBounds), N = y && this.isBoxClipped(S.bounds), v = Fi({
        chunk: S,
        chunkIndex: U,
        totalChunks: M,
        now: e,
        phase: i,
        profile: t,
        performanceMode: n,
        isBoxClipped: N,
        inFrustum: E,
        maxRenderDistance: this.maxRenderDistance,
        cameraPos: o,
        cameraForward: a,
        projScreenMatrix: this.projScreenMatrix,
        toChunkDirection: c,
        tempCenterNdc: l,
        viewHeight: h,
        canvasHeight: f,
        sampleUnloadedWhileMoving: x,
        movingSampleStride: w,
        movingSampleSeed: P,
        resolveShouldRefreshPeripheral: (A) => !A || this.shouldRefreshPeripheralChunk(e, U, M, t),
        chunkWarmupActive: this.chunkWarmupActive,
        chunkLoadedCount: this.chunkLoadedCount,
        initialChunkLoadTarget: this.initialChunkLoadTarget,
        chunkLoadResumeAt: this.chunkLoadResumeAt,
        chunkMeshCached: this.chunkMeshCache.has(S.id)
      });
      if (!v.shouldSkipSample)
        if (v.effectiveVisible && (S.lastVisibleAt = e), (v.centrality > 0.42 || v.forwardness > 0.55) && (S.lastFocusAt = e), S.lastEffectiveVisible = v.effectiveVisible, S.loaded)
          if (m.push(S), S.mesh)
            S.mesh.visible !== v.effectiveVisible && (S.mesh.visible = v.effectiveVisible, g = !0);
          else {
            const z = this.contentGroup.getObjectByName(S.groupName)?.getObjectByName(S.id);
            z && (S.mesh = z, z.visible = v.effectiveVisible, g = !0);
          }
        else !this.processingChunks.has(S.id) && v.shouldBeVisible && v.priority !== null && (S.priority = v.priority, p.push(S));
    }
    C || (this.cullingScanCursor = (I + M) % Math.max(M, 1));
    const R = bi({
      isCameraMoving: this.isCameraMoving,
      loadedChunks: m,
      maxLoadedChunks: this.maxLoadedChunks,
      cameraPos: o,
      now: e,
      chunkResidencyMs: this.chunkResidencyMs
    });
    for (const D of R)
      this.unloadChunk(D);
    R.length > 0 && (g = !0);
    const T = Ci({
      toLoad: p,
      now: performance.now(),
      chunkLoadResumeAt: this.chunkLoadResumeAt,
      maxConcurrentChunkLoads: this.maxConcurrentChunkLoads,
      processingChunkCount: this.processingChunks.size,
      chunkWarmupActive: this.chunkWarmupActive,
      chunkLoadedCount: this.chunkLoadedCount,
      initialChunkLoadTarget: this.initialChunkLoadTarget,
      warmupChunkBoost: this.warmupChunkBoost,
      getChunkFrameBudget: (D, U, S) => this.getChunkFrameBudget(D, U, S),
      phase: i,
      profile: t
    });
    for (const D of T)
      this.loadChunk(D);
    T.length > 0 && (g = !0), this.schedulePrefetchFromVisibleChunks(m), this.forceMaxChunkLoadSpeed, C && (this.cullingDirty = !0), this.chunkWarmupActive && this.chunkLoadedCount >= this.initialChunkLoadTarget && (this.chunkWarmupActive = !1, g = !0), (g || C) && this.markSceneDirty();
  }
  async runWorkerTask(e, t) {
    return Ti({
      workerQueue: this.workerQueue,
      data: e,
      transferables: t,
      processQueue: () => this.processWorkerQueue()
    });
  }
  processWorkerQueue() {
    Ui({
      activeWorkerCount: this.activeWorkerCount,
      maxWorkers: this.maxWorkers,
      workerQueue: this.workerQueue,
      workers: this.workers,
      createWorker: () => new Worker(new URL(
        /* @vite-ignore */
        "" + new URL("assets/chunkWorker-C6VzdZOk.js", import.meta.url).href,
        import.meta.url
      ), { type: "module" }),
      getActiveWorkerCount: () => this.activeWorkerCount,
      onActiveWorkerCountChange: (e) => {
        this.activeWorkerCount = e;
      },
      processQueue: () => this.processWorkerQueue()
    });
  }
  unloadChunk(e) {
    const t = pi({
      chunk: e,
      unregisterOptimizedMeshMapping: (i) => this.unregisterOptimizedMeshMapping(i),
      cacheChunkMesh: (i, n) => this.cacheChunkMesh(i, n),
      ensureChunkGhost: (i) => this.ensureChunkGhost(i)
    });
    t.changed && (this.chunkLoadedCount = Math.max(0, this.chunkLoadedCount + t.chunkLoadedCountDelta), this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    }));
  }
  async loadChunk(e) {
    this.processingChunks.add(e.id), this.markSceneDirty();
    try {
      let t = !1, i = !1, n = !1, r = !1, o = !1;
      const { mesh: a, prefetchCandidates: c } = await mi({
        chunk: e,
        sharedMaterial: this.sharedMaterial,
        takeCachedChunkMesh: (h) => this.takeCachedChunkMesh(h),
        yieldToMainThread: () => this.yieldToMainThread(),
        nbimFiles: this.nbimFiles,
        hasValidChunkBinaryRange: (h) => this.hasValidChunkBinaryRange(h),
        readChunkBuffer: (h) => this.readChunkBuffer(h),
        nbimMeta: this.nbimMeta,
        runWorkerTask: (h, f) => this.runWorkerTask(h, f),
        reconstructBatchedMesh: (h, f) => ki({
          data: h,
          material: f,
          resolveUuidByBimId: (p, m) => {
            const y = `${p}::${m}`;
            return this.bimIdToNodeIds.get(y)?.[0] || m || p;
          }
        }),
        isCameraMoving: this.isCameraMoving,
        chunkPrefetchWindow: this.resolvedChunkOptions.chunkPrefetchWindow,
        getChunkIndex: (h) => this.getChunkIndex(h),
        chunks: this.chunks,
        processingChunks: this.processingChunks
      });
      c.length > 0 && (this.enqueueChunkPrefetch(c), this.processPrefetchQueue()), a && (t = gi({
        chunk: e,
        mesh: a,
        cancelledChunkIds: this.cancelledChunkIds,
        chunkIdSet: this.chunkIdSet,
        disposeChunkMesh: (f) => this.disposeChunkMesh(f),
        globalOffset: this.globalOffset,
        contentGroup: this.contentGroup,
        registerOptimizedMeshMapping: (f) => this.registerOptimizedMeshMapping(f)
      }).attached, t && (r = !0, n = !0, i = !0));
      const d = yi({
        chunk: e,
        loadedNow: t,
        now: performance.now(),
        chunkLoadedCount: this.chunkLoadedCount,
        chunkWarmupActive: this.chunkWarmupActive,
        initialChunkLoadTarget: this.initialChunkLoadTarget,
        deactivateFastPreviewForModel: (h) => this.deactivateFastPreviewForModel(h)
      });
      this.chunkLoadedCount = d.nextChunkLoadedCount, this.chunkWarmupActive = d.nextChunkWarmupActive, d.progressChanged && (this.reportChunkProgress(), o = !0, i = !0), this.cancelledChunkIds.delete(e.id), Mi({
        chunkId: e.id,
        ghostGroup: this.ghostGroup,
        releaseGhostLine: (h) => this.releaseGhostLine(h)
      }).changed && (i = !0), i && this.markSceneDirty({
        invalidateInteractables: r,
        needsBoundsUpdate: n,
        needsCulling: o
      });
    } catch (t) {
      console.error(`加载分块 ${e.id} 失败:`, t);
    } finally {
      this.processingChunks.delete(e.id), this.markSceneDirty();
    }
  }
  setChunkLoadingEnabled(e) {
    this.chunkLoadingEnabled = e, this.prefetchPaused = !e, this.cullingDirty = !0, e && this.checkCullingAndLoad(), this.markSceneDirty({ needsCulling: e });
  }
  applyNbimScaleTuning(e) {
    const t = this.options.chunkOptions || {}, i = e >= 2e3 ? { chunkPrefetchWindow: 0, chunkReadCacheSize: 128, targetMinFps: 20 } : e <= 1e3 ? { chunkPrefetchWindow: 0, chunkReadCacheSize: 128, targetMinFps: 20 } : { chunkPrefetchWindow: 0, chunkReadCacheSize: 128, targetMinFps: 20 };
    this.setChunkOptions({
      chunkPrefetchWindow: t.chunkPrefetchWindow ?? i.chunkPrefetchWindow,
      chunkReadCacheSize: t.chunkReadCacheSize ?? i.chunkReadCacheSize,
      targetMinFps: t.targetMinFps ?? i.targetMinFps,
      ghostMode: t.ghostMode ?? this.resolvedChunkOptions.ghostMode,
      loadProfile: t.loadProfile ?? this.resolvedChunkOptions.loadProfile,
      deferIfcProperties: t.deferIfcProperties ?? this.resolvedChunkOptions.deferIfcProperties,
      preferWorkerOctree: t.preferWorkerOctree ?? this.resolvedChunkOptions.preferWorkerOctree,
      fastGeometrySanitize: t.fastGeometrySanitize ?? this.resolvedChunkOptions.fastGeometrySanitize
    });
  }
  setChunkOptions(e = {}) {
    const t = st(e);
    for (this.resolvedChunkOptions.chunkReadCacheSize = t.chunkReadCacheSize, this.resolvedChunkOptions.chunkPrefetchWindow = t.chunkPrefetchWindow, this.resolvedChunkOptions.ghostMode = t.ghostMode, this.resolvedChunkOptions.targetMinFps = t.targetMinFps, this.resolvedChunkOptions.loadProfile = t.loadProfile, this.resolvedChunkOptions.deferIfcProperties = t.deferIfcProperties, this.resolvedChunkOptions.preferWorkerOctree = t.preferWorkerOctree, this.resolvedChunkOptions.fastGeometrySanitize = t.fastGeometrySanitize, this.settings.targetFps = t.targetMinFps; this.chunkReadCacheOrder.length > this.resolvedChunkOptions.chunkReadCacheSize; ) {
      const i = this.chunkReadCacheOrder.shift();
      i && this.chunkReadCache.delete(i);
    }
  }
  getChunkOptions() {
    return {
      chunkReadCacheSize: this.resolvedChunkOptions.chunkReadCacheSize,
      chunkPrefetchWindow: this.resolvedChunkOptions.chunkPrefetchWindow,
      ghostMode: this.resolvedChunkOptions.ghostMode,
      targetMinFps: this.resolvedChunkOptions.targetMinFps,
      loadProfile: this.resolvedChunkOptions.loadProfile,
      deferIfcProperties: this.resolvedChunkOptions.deferIfcProperties,
      preferWorkerOctree: this.resolvedChunkOptions.preferWorkerOctree,
      fastGeometrySanitize: this.resolvedChunkOptions.fastGeometrySanitize
    };
  }
  setContentVisible(e) {
    this.contentGroup.visible = e, this.ghostGroup.visible = e, this.markSceneDirty({ needsCulling: !0 });
  }
  buildSceneGraph(e) {
    const t = e.isMesh ? `Mesh_${e.id}` : `Group_${e.id}`, i = {
      id: e.uuid,
      name: pe(e.name, e.userData?.name) || t,
      type: e.isMesh ? "Mesh" : "Group",
      children: [],
      bimId: e.userData?.bimId ? String(e.userData.bimId) : e.userData?.expressID !== void 0 ? String(e.userData.expressID) : e.name ? String(e.name) : void 0,
      userData: { ...e.userData }
    };
    this.nodeMap.has(e.uuid) || this.nodeMap.set(e.uuid, []), this.nodeMap.get(e.uuid).push(i);
    for (const n of e.children)
      i.children.push(this.buildSceneGraph(n));
    return i;
  }
  /**
   * 构建基于 IFC 图层和空间结构的复合树
   */
  buildIFCStructure(e) {
    const t = (i) => {
      const n = i.isMesh ? `Mesh_${i.id}` : `Group_${i.id}`, r = {
        id: i.uuid,
        name: pe(i.name, i.userData?.name) || n,
        type: i.isMesh ? "Mesh" : "Group",
        children: [],
        bimId: i.userData?.bimId ? String(i.userData.bimId) : i.userData?.expressID !== void 0 ? String(i.userData.expressID) : i.name ? String(i.name) : void 0,
        userData: { ...i.userData }
      };
      this.nodeMap.has(i.uuid) || this.nodeMap.set(i.uuid, []), this.nodeMap.get(i.uuid).push(r);
      for (const o of i.children)
        o.userData?.isIfcGridHelper || r.children.push(t(o));
      return r;
    };
    return t(e);
  }
  async prepareObjectRuntimeData(e, t, i = 6e3) {
    const n = [e];
    let r = 0;
    for (; n.length > 0; ) {
      const o = n.pop();
      if (o.isMesh) {
        const a = o;
        this.componentMap.set(a.uuid, a), a.userData.expressID !== void 0 && this.componentMap.set(a.userData.expressID, a), a.userData.bimId || (a.userData.expressID !== void 0 ? a.userData.bimId = String(a.userData.expressID) : a.userData.bimId = a.uuid), a.material && (Array.isArray(a.material) ? a.material : [a.material]).forEach((d) => {
          d.map && (d.map.anisotropy = t);
        });
      }
      r++;
      for (let a = o.children.length - 1; a >= 0; a--)
        n.push(o.children[a]);
      r > 0 && r % i === 0 && await this.yieldToMainThread();
    }
  }
  applyGlobalOffsetForModel(e) {
    const t = new u.Box3().setFromObject(e);
    return t.isEmpty() ? t : (this.globalOffset.length() === 0 && (t.getCenter(this.globalOffset), console.log("初始化全局偏移以解决大坐标问题:", this.globalOffset)), e.position.sub(this.globalOffset), e.updateMatrixWorld(!0), new u.Box3().setFromObject(e));
  }
  configureModelWarmup(e) {
    if (this.chunkWarmupActive = !0, this.resolvedChunkOptions.loadProfile === "max-speed") {
      this.initialChunkLoadTarget = e > 1e5 ? 42 : e > 3e4 ? 32 : 20, this.warmupChunkBoost = 16;
      return;
    }
    this.initialChunkLoadTarget = e > 1e5 ? 24 : e > 3e4 ? 18 : 12, this.warmupChunkBoost = 12;
  }
  prepareStructureStage(e, t, i) {
    const n = t >= this.deferredStructureThreshold;
    let r = null;
    if (i && i(5, n ? "正在准备轻量预览..." : "正在构建场景树..."), n) {
      r = `deferred_${e.uuid}`;
      const o = {
        id: r,
        name: `${e.name || "Model"} (${t} meshes)`,
        type: "Group",
        children: [],
        userData: {
          originalUuid: e.uuid,
          deferred: !0,
          meshCount: t
        }
      };
      this.attachStructureRoot(o), this.onStructureUpdate && this.onStructureUpdate();
    } else {
      const o = this.buildAndRegisterModelStructure(e);
      this.attachStructureRoot(o);
    }
    return { shouldDeferStructure: n, deferredPlaceholderId: r };
  }
  prepareModelBoundsStage(e, t) {
    return t.isEmpty() || (this.precomputedBounds.union(t), this.sceneBounds.copy(this.precomputedBounds)), t.isEmpty() ? null : this.createPreviewGhost(t.clone(), `preview_${e.uuid}`);
  }
  async prepareModelRuntimeStage(e, t) {
    const i = this.renderer.capabilities.getMaxAnisotropy();
    t > 3e4 ? this.prepareObjectRuntimeData(e, i, 8e3) : await this.prepareObjectRuntimeData(e, i, 6e3);
  }
  prepareFastVisibleStage(e, t, i) {
    if (t < 12e3) return !1;
    let n = 0;
    const r = this.fastPreviewMeshLimit;
    return e.traverse((o) => {
      if (!o.isMesh) return;
      const a = o, c = n < r;
      a.visible = c, a.userData.fastPreview = c, c && n++;
    }), i && i(8, `正在准备快速预览... (${n} meshes)`), n > 0 && (e.userData.fastPreviewActive = !0, this.fastPreviewModels.add(e.uuid)), n > 0;
  }
  attachModelToContentGroup(e, t = !1) {
    const i = new u.Group();
    i.name = `file_${e.uuid}`, i.userData.originalUuid = e.uuid;
    const n = ce(
      pe(
        typeof e.userData?.modelName == "string" ? e.userData.modelName : "",
        ye(e.name),
        e.name
      ) || "model"
    );
    i.userData.modelName = n, e.userData.originalUuid = e.uuid, e.userData.modelName = n, i.add(e), e.visible = t, this.contentGroup.add(i), this.markSceneDirty({
      invalidateInteractables: !0,
      needsRender: !1
    });
  }
  async prepareModelChunkStage(e, t, i) {
    i && i(10, "正在收集构件...");
    const n = this.resolvedChunkOptions.loadProfile === "max-speed", r = n ? 1200 : this.octreeWorkerThreshold, o = t >= r ? await Kt(e, {
      batchSize: n ? 5200 : 3e3,
      onProgress: (m, y) => {
        if (!i || y === 0) return;
        const g = m / y;
        i(10 + Math.round(g * 10), `正在收集构件... (${m}/${y})`);
      }
    }) : Zt(e);
    if (o.length === 0) return;
    i && i(20, `已收集 ${o.length} 个构件，正在计算八叉树...`);
    const a = await this.computeItemBoundsProgressively(o, i);
    i && i(35, "正在计算八叉树...");
    const l = await this.buildLeafPlans(o, a, 3e3, 6), h = await this.registerLeafChunksProgressively(e, l, i);
    this.reportChunkProgress(), this.checkCullingAndLoad(), this.createChunkGhostsProgressively(h);
    const f = /* @__PURE__ */ new Set();
    for (const m of o) {
      const y = m.sourceMesh;
      y?.isMesh && f.add(y);
    }
    const p = f.size > 0 ? Array.from(f) : (() => {
      const m = [];
      return e.traverse((y) => {
        y.isMesh && m.push(y);
      }), m;
    })();
    for (let m = 0; m < p.length; m++) {
      const y = p[m];
      e.userData.fastPreviewActive && y.userData.fastPreview || (y.visible = !1, y.userData.isOptimized = !0, m > 0 && m % 6e3 === 0 && await this.yieldToMainThread());
    }
    i && i(95, "分块准备完成");
  }
  finalizeModelStage(e, t) {
    this.sceneBounds = this.computeTotalBounds(!1), this.precomputedBounds = this.sceneBounds.clone(), this.globalOffset.length() > 0 && this.precomputedBounds.translate(this.globalOffset), this.updateSettings(this.settings), t && t(100, "模型已加入加载队列"), this.checkCullingAndLoad(), e && (this.ghostGroup.remove(e), this.releaseGhostLine(e), this.markSceneDirty());
  }
  cancelDeferredStructureBuild() {
    this.deferredStructureTimer && (clearTimeout(this.deferredStructureTimer), this.deferredStructureTimer = null), this.deferredStructureToken++;
  }
  beginLoadGeneration() {
    return this.loadGeneration += 1, this.loadGeneration;
  }
  isLoadGenerationCurrent(e) {
    return e === this.loadGeneration;
  }
  deactivateFastPreviewForModel(e) {
    if (!this.fastPreviewModels.has(e)) return;
    this.fastPreviewModels.delete(e);
    const t = this.contentGroup.getObjectByName(`file_${e}`);
    t && t.traverse((i) => {
      i.isMesh && (i.visible = !1, i.userData.fastPreview && delete i.userData.fastPreview), i.userData?.fastPreviewActive && (i.userData.fastPreviewActive = !1);
    });
  }
  scheduleDeferredStructureReplacement(e, t, i) {
    if (t && i) {
      this.cancelDeferredStructureBuild();
      const n = this.deferredStructureToken;
      this.deferredStructureTimer = setTimeout(() => {
        try {
          if (n !== this.deferredStructureToken) return;
          const r = this.buildAndRegisterModelStructure(e);
          this.replaceStructureNode(i, r), this.onStructureUpdate && this.onStructureUpdate(), this.markSceneDirty({
            invalidateInteractables: !0,
            needsBoundsUpdate: !0,
            needsCulling: !0
          });
        } catch (r) {
          console.warn("延迟构建结构树失败:", r);
        }
      }, 80);
      return;
    }
    this.onStructureUpdate && this.onStructureUpdate();
  }
  async addModel(e, t) {
    e.updateMatrixWorld(!0);
    const i = this.applyGlobalOffsetForModel(e), n = this.collectObjectOverview(e), r = n.meshes;
    this.configureModelWarmup(r), this.registerOriginalStats(e.uuid, n);
    const { shouldDeferStructure: o, deferredPlaceholderId: a } = this.prepareStructureStage(e, r, t), c = this.prepareModelBoundsStage(e, i), d = this.prepareFastVisibleStage(e, r, t);
    await this.prepareModelRuntimeStage(e, r), this.attachModelToContentGroup(e, d), this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    }), await this.prepareModelChunkStage(e, r, t), this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    }), this.finalizeModelStage(c, t), this.scheduleDeferredStructureReplacement(e, o, a), this.scheduleSearchPropertyIndexRebuild(e, t), this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    });
  }
  removeObject(e) {
    this.cancelDeferredStructureBuild();
    const t = this.nodeMap.get(e), i = t?.[0]?.userData?.originalUuid || e, n = [];
    this.contentGroup.traverse((a) => {
      (a.name === `optimized_${e}` || a.name === `file_${e}` || a.userData.originalUuid === e || a.userData.originalUuid === i || a.name.startsWith("optimized_") && (a.userData.originalUuid === e || a.userData.originalUuid === i) || a.name.startsWith("file_") && (a.userData.originalUuid === e || a.userData.originalUuid === i)) && n.push(a);
    }), n.forEach((a) => {
      a.traverse((c) => {
        if (c.isBatchedMesh) {
          const d = c;
          this.disposeChunkMesh(d);
        }
      }), a.removeFromParent();
    });
    const r = this.contentGroup.getObjectByProperty("uuid", e), o = (a) => {
      const c = a instanceof u.Object3D ? a.uuid : a.id, d = this.optimizedMapping.get(c);
      if (d && (d.forEach((h) => {
        h.mesh.setVisibleAt(h.instanceId, !1);
      }), this.optimizedMapping.delete(c)), a.isMesh) {
        const h = a;
        h.geometry && h.geometry.dispose(), h.material && (Array.isArray(h.material) ? h.material : [h.material]).forEach((p) => p.dispose());
      } else if (a.isBatchedMesh) {
        const h = a;
        this.disposeChunkMesh(h);
      }
      this.componentMap.delete(c), a instanceof u.Object3D && a.userData.expressID !== void 0 && this.componentMap.delete(a.userData.expressID);
      const l = this.nodeMap.get(c);
      l && l.forEach((h) => {
        h.bimId !== void 0 && this.componentMap.delete(h.bimId);
      }), this.nodeMap.delete(c);
    };
    if (r)
      r.traverse(o), r.removeFromParent();
    else if (t && t.length > 0) {
      const a = (c) => {
        o(c), c.children && c.children.forEach(a);
      };
      a(t[0]);
    }
    if (this.markSceneDirty({
      invalidateInteractables: !0,
      needsRender: !1
    }), this.unregisterOriginalStats(i), this.fastPreviewModels.delete(e), this.fastPreviewModels.delete(i), this.clearChunkCache((a, c) => {
      const d = c.userData.originalUuid || "";
      return d === e || d === i || a.startsWith(e) || a.startsWith(i);
    }), (this.currentMeasureModelUuid === e || this.currentMeasureModelUuid === i) && (this.currentMeasureModelUuid = null), this.chunks = this.chunks.filter((a) => {
      if (a.originalUuid === e || a.originalUuid === i || a.id.startsWith(e)) {
        this.cancelledChunkIds.add(a.id), this.processingChunks.delete(a.id);
        const d = this.ghostGroup.getObjectByName(`ghost_${a.id}`);
        return d && (this.ghostGroup.remove(d), this.releaseGhostLine(d)), !1;
      }
      return !0;
    }), this.rebuildChunkIdSet(), this.structureRoot) {
      const a = (c) => c.filter((d) => d.id === e || !this.nodeMap.has(d.id) && d.id !== "root" ? !1 : (d.children && (d.children = a(d.children)), !0));
      this.structureRoot.id === e ? this.structureRoot = { id: "root", name: "Root", type: "Group", children: [] } : this.structureRoot.children && (this.structureRoot.children = a(this.structureRoot.children));
    }
    return this.precomputedBounds = this.computeTotalBounds(), this.precomputedBounds.isEmpty() && this.contentGroup.traverse((a) => {
      if (a.isMesh && a.visible) {
        const c = new u.Box3().setFromObject(a);
        c.isEmpty() || this.precomputedBounds.union(c);
      }
    }), this.updateSceneBounds(), this.onStructureUpdate && this.onStructureUpdate(), this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    }), this.measureRecords.forEach((a, c) => {
      let d = a.modelUuid === e || a.modelUuid === i;
      !d && a.modelUuid && r && r.traverse((l) => {
        l.uuid === a.modelUuid && (d = !0);
      }), d && this.removeMeasurement(c);
    }), !0;
  }
  async removeModel(e) {
    return this.removeObject(e);
  }
  // --- NBIM 导入/导出功能 ---
  generateChunkBinaryV8(e, t) {
    const i = [], n = /* @__PURE__ */ new Map();
    e.forEach((d) => {
      d.geometry && !n.has(d.geometry) && (n.set(d.geometry, i.length), i.push(d.geometry));
    });
    let r = 4;
    for (const d of i) {
      const l = d.attributes.position.count, h = d.index, f = h ? h.count : 0;
      r += 8 + l * 12 + l * 12, f > 0 && (r += f * 4);
    }
    r += 4, r += e.length * 80;
    const o = new ArrayBuffer(r), a = new DataView(o);
    let c = 0;
    a.setUint32(c, i.length, !0), c += 4;
    for (const d of i) {
      const l = d.getAttribute("position"), h = d.getAttribute("normal"), f = l.count, p = d.index, m = p ? p.count : 0;
      a.setUint32(c, f, !0), c += 4, a.setUint32(c, m, !0), c += 4;
      for (let y = 0; y < f; y++)
        a.setFloat32(c, l.getX(y), !0), c += 4, a.setFloat32(c, l.getY(y), !0), c += 4, a.setFloat32(c, l.getZ(y), !0), c += 4;
      for (let y = 0; y < f; y++)
        a.setFloat32(c, h.getX(y), !0), c += 4, a.setFloat32(c, h.getY(y), !0), c += 4, a.setFloat32(c, h.getZ(y), !0), c += 4;
      if (p && m > 0)
        for (let y = 0; y < m; y++)
          a.setUint32(c, p.getX(y), !0), c += 4;
    }
    a.setUint32(c, e.length, !0), c += 4;
    for (const d of e) {
      const h = this.nodeMap.get(d.uuid)?.[0], f = d.bimId || h?.bimId || h?.id || d.uuid, p = t.get(f) ?? 0;
      a.setUint32(c, p, !0), c += 4;
      const m = typeof d.typeIndex == "number" ? d.typeIndex : 0;
      a.setUint32(c, m, !0), c += 4, a.setUint32(c, d.color, !0), c += 4;
      const y = d.matrix.elements;
      for (let M = 0; M < 16; M++)
        a.setFloat32(c, y[M], !0), c += 4;
      const g = n.get(d.geometry) || 0;
      a.setUint32(c, g, !0), c += 4;
    }
    return o;
  }
  registerPropertyDocuments(e) {
    const { docs: t, propertyNameIndex: i, rootId: n, preferNodeMapping: r = !1 } = e;
    let o = !1;
    Object.entries(t || {}).forEach(([a, c]) => {
      if (!c || !Array.isArray(c.rows)) return;
      const d = a.indexOf("::"), l = c.owner || (d > 0 ? a.slice(0, d) : n || ""), h = c.bimId || (d > 0 ? a.slice(d + 2) : "");
      let f = c.uuid || h;
      if (r && l && h) {
        const m = this.bimIdToNodeIds.get(`${l}::${h}`) || [];
        m.length > 0 && (f = m[0]);
      }
      const p = {
        ...c,
        owner: l,
        bimId: String(h || ""),
        uuid: String(f || c.uuid || h || a),
        name: String(c.name || ""),
        rows: c.rows
      };
      this.nbimPropertyDocsByOriginalUuid.has(l) || this.nbimPropertyDocsByOriginalUuid.set(l, {}), this.nbimPropertyDocsByOriginalUuid.get(l)[a] = p, this.nbimSearchDocsByUuid.set(p.uuid, p), p.bimId && this.nbimSearchDocsByUuid.set(p.bimId, p), this.nbimSearchDocsByUuid.set(a, p), o = !0;
    }), (i || []).forEach((a) => {
      if (!a?.path) return;
      const c = this.nbimPropertyNameIndex.get(a.path);
      this.nbimPropertyNameIndex.set(a.path, {
        ...a,
        count: (c?.count || 0) + (a.count || 0)
      }), o = !0;
    }), o && this.nbimPropertyNameIndexVersion++;
  }
  async rebuildSearchPropertyIndexForObject(e, t) {
    if (!e?.userData?.isIFC) return;
    const i = ns(e);
    Object.keys(i.bimPropertyDocs).length > 0 && this.registerPropertyDocuments({
      docs: i.bimPropertyDocs,
      propertyNameIndex: i.propertyNameIndex,
      rootId: e.uuid
    });
    const n = e.userData?.ifcMetadataReady;
    n && typeof n.then == "function" && (t && t(95, "正在完成 IFC 属性资源解析..."), await n);
    const r = Ke(this.contentGroup);
    if (!r.ifcManagerByModel.has(e.uuid) && !r.ifcApiByModel.has(e.uuid)) return;
    t && t(96, "正在建立属性索引...");
    const { bimProperties: o, bimPropertyDocs: a, propertyNameIndex: c } = await rs({
      object: e,
      ifcApiByModel: r.ifcApiByModel,
      ifcManagerByModel: r.ifcManagerByModel,
      onProgress: (d, l) => {
        if (!t || l <= 0) return;
        const h = 96 + Math.floor(d / l * 3);
        t(Math.min(99, h), `正在建立属性索引... (${d}/${l})`);
      }
    });
    this.nbimPropsByOriginalUuid.set(e.uuid, o), this.registerPropertyDocuments({
      docs: a,
      propertyNameIndex: c,
      rootId: e.uuid
    });
  }
  scheduleSearchPropertyIndexRebuild(e, t) {
    if (!e?.userData?.isIFC) return;
    const i = this.loadGeneration;
    window.setTimeout(() => {
      this.rebuildSearchPropertyIndexForObject(e, void 0).then(() => {
        i === this.loadGeneration && this.markSceneDirty({ invalidateInteractables: !1, needsBoundsUpdate: !1, needsCulling: !1 });
      }).catch((n) => {
        console.warn("IFC 属性索引后台构建失败:", n);
      });
    }, 0), t && t(100, "模型已加载，属性索引将在后台构建...");
  }
  buildExportPropertyDocsFromCache() {
    const e = {};
    return this.nbimSearchDocsByUuid.forEach((t) => {
      if (!t || !Array.isArray(t.rows)) return;
      const i = String(t.owner || ""), n = String(t.bimId || "");
      if (!i || !n) return;
      const r = `${i}::${n}`;
      e[r] || (e[r] = {
        ...t,
        owner: i,
        bimId: n,
        uuid: String(t.uuid || n),
        name: String(t.name || ""),
        rows: t.rows
      });
    }), {
      bimPropertyDocs: e,
      propertyNameIndex: be(e)
    };
  }
  async exportNbim(e) {
    if (this.chunks.length === 0) throw new Error("无模型数据可导出");
    const t = [""], i = /* @__PURE__ */ new Map(), n = (x) => {
      if (!x || i.has(x)) return;
      const w = t.length;
      t.push(x), i.set(x, w);
    }, r = (x) => {
      n(x.bimId), x.children && x.children.forEach(r);
    };
    r(this.structureRoot);
    let { bimPropertyDocs: o, propertyNameIndex: a } = this.buildExportPropertyDocsFromCache();
    if (Object.keys(o).length === 0) {
      const { ifcApiByModel: x, ifcManagerByModel: w } = Ke(this.contentGroup), P = await ss({
        structureRoot: this.structureRoot,
        ifcApiByModel: x,
        ifcManagerByModel: w
      });
      o = P.bimPropertyDocs, a = P.propertyNameIndex;
    }
    const { chunkBlobs: c, exportChunks: d, currentOffset: l } = await as({
      chunks: this.chunks,
      nbimFiles: this.nbimFiles,
      nbimMeta: this.nbimMeta,
      bimIdToIndex: i,
      hasValidChunkBinaryRange: (x) => this.hasValidChunkBinaryRange(x),
      generateChunkBinaryV8: (x, w) => this.generateChunkBinaryV8(x, w)
    }), h = {
      globalBounds: {
        min: { x: this.sceneBounds.min.x, y: this.sceneBounds.min.y, z: this.sceneBounds.min.z },
        max: { x: this.sceneBounds.max.x, y: this.sceneBounds.max.y, z: this.sceneBounds.max.z }
      },
      chunks: d,
      stats: this.originalStats,
      structureTree: Zi(this.structureRoot),
      bimIdTable: t,
      bimPropertyDocs: o,
      propertyNameIndex: a
    }, f = Ki(h, this.structureRoot), p = new ArrayBuffer(1024), m = new DataView(p);
    m.setUint32(0, 1296646734, !0), m.setUint32(4, 8, !0), m.setUint32(8, l, !0), m.setUint32(12, f.byteLength, !0);
    const y = [p, ...c, f], g = new Blob(y, { type: "application/octet-stream" }), M = URL.createObjectURL(g), k = document.createElement("a");
    k.href = M;
    const b = Ji(this.contentGroup), C = ce(ye((e || "").trim()) || b);
    k.download = `${C}.nbim`, k.click(), URL.revokeObjectURL(M);
  }
  async loadNbim(e, t) {
    const i = `nbim_${e.name}_${(/* @__PURE__ */ new Date()).getTime()}`;
    t && t(10, "正在解析 NBIM 文件头...");
    const n = await si(e);
    if (n.magic !== 1296646734) throw new Error("不是有效的 NBIM 文件");
    const o = n.version;
    if (o !== 8)
      throw new Error(`不支持的 NBIM 版本: ${o}，当前仅支持 V8`);
    t && t(20, "正在读取元数据...");
    const a = await ni(e, n), c = a?.bimPropertyDocs && typeof a.bimPropertyDocs == "object" ? a.bimPropertyDocs : null, d = Array.isArray(a.propertyNameIndex) ? a.propertyNameIndex : null;
    if (!c || !d)
      throw new Error("不支持旧版 NBIM：缺少 bimPropertyDocs 或 propertyNameIndex。请使用当前版本重新导出 NBIM。");
    this.nbimFiles.set(i, e), this.nbimMeta.set(i, { version: o, bimIdTable: a.bimIdTable });
    const l = cs({
      globalBounds: a.globalBounds,
      precomputedBounds: this.precomputedBounds,
      sceneBounds: this.sceneBounds,
      globalOffset: this.globalOffset
    });
    this.precomputedBounds.copy(l.precomputedBounds), this.sceneBounds.copy(l.sceneBounds), this.globalOffset.copy(l.globalOffset), l.initializedOffset && Be("SceneManager/NBIM", "初始化全局偏移", this.globalOffset);
    const h = a.structureTree;
    hs({
      structureRoot: this.structureRoot,
      modelRoot: h
    });
    const f = h?.id || i, p = a?.bimProperties && typeof a.bimProperties == "object" ? a.bimProperties : {}, m = /* @__PURE__ */ new Set();
    Object.keys(c).forEach((I) => {
      const R = I.indexOf("::");
      R > 0 && m.add(I.slice(0, R));
    });
    const { defaultOwner: y, grouped: g } = es(p, f), M = m.size === 1 ? Array.from(m)[0] : y;
    g.forEach((I, R) => this.nbimPropsByOriginalUuid.set(R, I));
    const k = ls({
      manifestStats: a.stats,
      modelRoot: h,
      chunks: a.chunks
    });
    this.registerOriginalStats(f, k);
    const b = ts({
      fileName: e.name,
      modelRootName: typeof h?.name == "string" ? h.name : "",
      rootId: f
    });
    this.contentGroup.add(b), this.interactableListValid = !1, this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    }), us({
      modelRoot: h,
      defaultOwner: M,
      nodeMap: this.nodeMap,
      bimIdToNodeIds: this.bimIdToNodeIds
    }), this.registerPropertyDocuments({
      docs: c,
      propertyNameIndex: d,
      rootId: f,
      preferNodeMapping: !0
    }), t && t(30, "正在初始化分块...");
    const C = Array.isArray(a.chunks) ? a.chunks : [];
    this.applyNbimScaleTuning(C.length);
    const x = this.resolvedChunkOptions.ghostMode === "all" ? Number.MAX_SAFE_INTEGER : Qs, { deferredGhostSpecs: w } = await ds({
      chunkEntries: C,
      globalOffset: this.globalOffset,
      chunkPadding: this.chunkPadding,
      rootId: f,
      fileId: i,
      immediateGhostLimit: x,
      registrationBatchSize: _s,
      onProgress: t,
      registerChunk: (I) => this.registerChunk(I),
      createGhostLine: (I, R) => this.createGhostLine(I, R),
      addGhostLine: (I) => this.ghostGroup.add(I),
      yieldToMainThread: () => this.yieldToMainThread()
    });
    w.length > 0 && this.createChunkGhostsProgressively(w), this.reportChunkProgress(), this.fitView(!0), this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    });
    const P = fs({
      chunkCount: this.chunks.length,
      hasManifestStats: !!a.stats,
      hasManifestChunks: !!a.chunks?.length
    });
    this.chunkWarmupActive = P.chunkWarmupActive, this.initialChunkLoadTarget = P.initialChunkLoadTarget, t && t(100, "NBIM 已就绪，正在按需加载..."), this.checkCullingAndLoad(), this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    }), P.shouldEstimateStats && this.estimateNbimStats(e, a.chunks, o).then((I) => {
      this.unregisterOriginalStats(f), this.registerOriginalStats(f, I);
    }).catch((I) => {
      console.warn("NBIM 统计估算失败:", I);
    });
  }
  async clear() {
    this.beginLoadGeneration(), Be("SceneManager", "开始清空场景..."), this.cancelDeferredStructureBuild(), this.resetExplode(), this.clearLocateFocus(), this.locateIsolationRestoreChanges = [], this.locateIsolationActive = !1;
    try {
      const e = (t) => {
        if (t.isMesh) {
          const i = t;
          i.geometry && i.geometry.dispose(), i.material && (Array.isArray(i.material) ? i.material : [i.material]).forEach((r) => r.dispose());
        } else if (t.isBatchedMesh) {
          const i = t;
          i.geometry && i.geometry.dispose(), i.material && (Array.isArray(i.material) ? i.material : [i.material]).forEach((r) => r.dispose());
        }
      };
      for (this.contentGroup.traverse(e); this.contentGroup.children.length > 0; )
        this.contentGroup.remove(this.contentGroup.children[0]);
      for (; this.ghostGroup.children.length > 0; ) {
        const t = this.ghostGroup.children[0];
        this.ghostGroup.remove(t), this.releaseGhostLine(t);
      }
      this.ghostMeshPool.length = 0, this.selectionBox.visible = !1, this.highlightMesh.visible = !1, this.clearAllMeasurements(), this.optimizedMapping.clear(), this.sceneBounds.makeEmpty(), this.precomputedBounds.makeEmpty(), this.nbimFiles.clear(), this.nbimMeta.clear(), this.nbimPropsByOriginalUuid.clear(), this.nbimPropertyDocsByOriginalUuid.clear(), this.nbimSearchDocsByUuid.clear(), this.nbimPropertyNameIndex.clear(), this.nbimPropertyNameIndexVersion++, this.structureRoot = { id: "root", name: "Root", type: "Group", children: [] }, this.nodeMap.clear(), this.bimIdToNodeIds.clear(), this.chunks = [], this.chunkIdSet.clear(), this.chunkById.clear(), this.chunkIndexById.clear(), this.lastReportedProgress = { loaded: -1, total: -1 }, this.processingChunks.clear(), this.cancelledChunkIds.clear(), this.prefetchQueue = [], this.prefetchQueueSet.clear(), this.prefetchInFlight.clear(), this.chunkLoadedCount = 0, this.reportChunkProgress(), this.componentMap.clear(), this.clearChunkCache(), this.chunkReadCache.clear(), this.chunkReadCacheOrder = [], this.originalStats = { meshes: 0, faces: 0, memory: 0 }, this.originalStatsByModel.clear(), this.fastPreviewModels.clear(), this.chunkLoadingEnabled = !0, this.contentGroup.visible = !0, this.ghostGroup.visible = !0, this.chunkWarmupActive = !1, this.globalOffset.set(0, 0, 0), Be("SceneManager", "场景已清空"), this.markSceneDirty();
    } catch (e) {
      throw console.error("清空场景失败:", e), e;
    }
  }
  getStructureNodes(e) {
    return this.nodeMap.get(e);
  }
  getBimIdByUuid(e) {
    return Us({
      uuid: e,
      nodeMap: this.nodeMap,
      bimIdToNodeIds: this.bimIdToNodeIds
    });
  }
  resolveNodeUuidByBimId(e) {
    return Dt(e, this.bimIdToNodeIds);
  }
  resolveSelectionUuid(e) {
    return Os(e, this.nodeMap, this.bimIdToNodeIds);
  }
  resolveNbimNode(e) {
    return At(e, this.nodeMap);
  }
  getNbimProperties(e) {
    return zs({
      id: e,
      nodeMap: this.nodeMap,
      nbimPropsByOriginalUuid: this.nbimPropsByOriginalUuid
    });
  }
  getNbimIfcPropertyGroups(e, t = "raw") {
    return Fs({
      id: e,
      nodeMap: this.nodeMap,
      nbimPropsByOriginalUuid: this.nbimPropsByOriginalUuid
    }, t);
  }
  getNbimPropertyNameIndex() {
    return Array.from(this.nbimPropertyNameIndex.values()).sort((e, t) => e.path.localeCompare(t.path, "zh-Hans-CN"));
  }
  getNbimPropertyNameIndexVersion() {
    return this.nbimPropertyNameIndexVersion;
  }
  getNbimPropertySearchDocument(e) {
    if (!e) return null;
    const t = this.nbimSearchDocsByUuid.get(e);
    if (t) return t;
    const i = this.resolveSelectionUuid(e);
    if (i && i !== e) {
      const r = this.nbimSearchDocsByUuid.get(i);
      if (r) return r;
    }
    const n = this.getBimIdByUuid(e);
    return n && this.nbimSearchDocsByUuid.get(n) || null;
  }
  getAllNbimPropertySearchDocuments() {
    return Array.from(this.nbimSearchDocsByUuid.values());
  }
  hasRenderableTarget(e) {
    return e ? this.collectRenderableTargets([e]).length > 0 : !1;
  }
  getVisibilityContext() {
    return {
      scene: this.scene,
      contentGroup: this.contentGroup,
      structureRoot: this.structureRoot,
      nodeMap: this.nodeMap,
      optimizedMapping: this.optimizedMapping,
      highlightedUuids: this.highlightedUuids
    };
  }
  getHighlightContext() {
    return {
      contentGroup: this.contentGroup,
      selectionBox: this.selectionBox,
      highlightMesh: this.highlightMesh,
      optimizedMapping: this.optimizedMapping,
      settings: this.settings,
      state: {
        highlightedUuids: this.highlightedUuids,
        locateResultSet: this.locateResultSet,
        locateFocusUuid: this.locateFocusUuid,
        lastSelectedUuid: this.lastSelectedUuid
      },
      totalMeshCount: this.originalStats.meshes,
      locateMaterialCache: this.locateMaterialCache,
      locateObjectMaterialCache: this.locateObjectMaterialCache,
      locateDimmedInstances: this.locateDimmedInstances,
      clearClashPairHighlight: () => this.clearClashPairHighlight(),
      nodeMap: this.nodeMap
    };
  }
  cancelCameraFlight() {
    this.cameraFlightToken += 1, this.cameraFlightFrameId !== null && (cancelAnimationFrame(this.cameraFlightFrameId), this.cameraFlightFrameId = null);
  }
  isWorldVisible(e) {
    let t = e;
    for (; t; ) {
      if (!t.visible) return !1;
      t = t.parent;
    }
    return !0;
  }
  getPickingContext() {
    return {
      canvas: this.canvas,
      camera: this.camera,
      raycaster: this.raycaster,
      mouse: this.mouse,
      contentGroup: this.contentGroup,
      chunks: this.chunks,
      nodeMap: this.nodeMap,
      interactableList: this.interactableList,
      interactableListValid: this.interactableListValid
    };
  }
  syncHighlightState(e) {
    this.highlightedUuids = e.highlightedUuids, this.locateResultSet = e.locateResultSet, this.locateFocusUuid = e.locateFocusUuid, this.lastSelectedUuid = e.lastSelectedUuid;
  }
  syncPickingState(e) {
    this.interactableList = e.interactableList, this.interactableListValid = e.interactableListValid;
  }
  getMeasurementContext() {
    return {
      canvas: this.canvas,
      camera: this.camera,
      raycaster: this.raycaster,
      mouse: this.mouse,
      measureGroup: this.measureGroup,
      tempMarker: this.tempMarker,
      dotTexture: this.dotTexture,
      measureRecords: this.measureRecords,
      state: {
        measureType: this.measureType,
        currentMeasurePoints: this.currentMeasurePoints,
        currentMeasureModelUuid: this.currentMeasureModelUuid,
        previewLine: this.previewLine,
        previewPolygon: this.previewPolygon
      },
      getRayIntersects: (e, t) => this.getRayIntersects(e, t),
      onMeasureUpdate: this.onMeasureUpdate
    };
  }
  syncMeasurementState(e) {
    this.measureType = e.measureType, this.currentMeasurePoints = e.currentMeasurePoints, this.currentMeasureModelUuid = e.currentMeasureModelUuid, this.previewLine = e.previewLine, this.previewPolygon = e.previewPolygon;
  }
  syncBoxSelectState(e) {
    this.boxSelectState = e;
  }
  getClippingContext() {
    return {
      renderer: this.renderer,
      clipHelpersGroup: this.clipHelpersGroup,
      state: {
        clippingPlanes: this.clippingPlanes,
        clipPlaneHelpers: this.clipPlaneHelpers,
        clipHelperVisible: this.clipHelperVisible,
        clipHelperOpacity: this.clipHelperOpacity
      }
    };
  }
  syncClippingState(e) {
    this.clippingPlanes = e.clippingPlanes, this.clipPlaneHelpers = e.clipPlaneHelpers, this.clipHelperVisible = e.clipHelperVisible, this.clipHelperOpacity = e.clipHelperOpacity;
  }
  setAllVisibility(e) {
    this.locateIsolationRestoreChanges = [], this.locateIsolationActive = !1, Ot(this.getVisibilityContext(), e), this.updateSceneBounds(), this.refreshExplodeState(), this.markSceneDirty();
  }
  hideObjects(e) {
    this.setObjectsVisibility(e, !1);
  }
  applyVisibilityBatch(e, t = {}) {
    const i = Hs(this.getVisibilityContext(), e, t);
    i.nextHighlightedUuids && this.highlightObjects(i.nextHighlightedUuids), (t.invalidateInteractables ?? !0) && this.markSceneDirty({
      invalidateInteractables: !0,
      needsRender: !1
    }), i.needsBoundsUpdate && this.updateSceneBounds(), i.needsExplodeRefresh && this.refreshExplodeState(), i.needsRender && this.markSceneDirty();
  }
  setObjectsVisibility(e, t, i = {}) {
    if (e.length === 0) return;
    const n = e.map((o) => ({
      uuid: o,
      visible: t,
      showParents: i.showParents
    })), r = !i.deferRefresh;
    this.applyVisibilityBatch(n, {
      recomputeBounds: r,
      refreshExplode: i.refreshExplode ?? !1,
      invalidateInteractables: !i.deferRefresh
    });
  }
  isolateObjects(e) {
    this.restoreLocateIsolation({ clearFocus: !1, invalidate: !1 }), $s(
      this.getVisibilityContext(),
      e,
      (t, i, n) => {
        const r = Ae(this.getVisibilityContext(), t, i, n);
        if (r.nextHighlightedUuids) {
          const o = this.getHighlightContext();
          Je(o, r.nextHighlightedUuids), this.syncHighlightState(o.state), this.markSceneDirty();
        }
      }
    ), this.markSceneDirty({
      invalidateInteractables: !0,
      needsRender: !1
    }), this.updateSceneBounds(), this.refreshExplodeState(), this.markSceneDirty();
  }
  isolateObjectsForLocate(e) {
    const t = Array.from(new Set((e || []).map((l) => String(l || "").trim()).filter(Boolean)));
    if (t.length === 0) return;
    this.restoreLocateIsolation({ clearFocus: !1, invalidate: !1 });
    const i = new Set(t);
    this.collectRenderableTargets(t).forEach((l) => {
      i.add(l.uuid), l.ownerUuid && i.add(l.ownerUuid);
    });
    const n = (l) => {
      l && (i.add(l.id), l.children?.forEach(n));
    };
    Array.from(i).forEach((l) => {
      this.nodeMap.get(l)?.forEach(n);
    });
    const r = /* @__PURE__ */ new Set(), o = (l, h) => {
      const f = i.has(l.id);
      let p = !1;
      return l.children?.forEach((m) => {
        o(m, [...h, l.id]) && (p = !0);
      }), (f || p) && (r.add(l.id), h.forEach((m) => r.add(m))), f || p;
    };
    this.structureRoot.children?.forEach((l) => o(l, [])), i.forEach((l) => r.add(l));
    const a = /* @__PURE__ */ new Set(), c = (l) => {
      if (!l.id || r.has(l.id)) {
        l.children?.forEach(c);
        return;
      }
      const h = this.nodeMap.get(l.id);
      (h ? h.some((p) => p.visible !== !1) : l.visible !== !1) && a.add(l.id);
    };
    if (this.structureRoot.children?.forEach(c), this.collectRenderableTargets().forEach((l) => {
      const h = l.ownerUuid || l.uuid;
      if (!h || r.has(h) || r.has(l.uuid)) return;
      const f = this.nodeMap.get(h);
      (f ? f.some((m) => m.visible !== !1) : l.object.visible !== !1) && a.add(h);
    }), a.size === 0) {
      this.locateIsolationRestoreChanges = [], this.locateIsolationActive = !1;
      return;
    }
    const d = Array.from(a).map((l) => ({
      uuid: l,
      visible: !1,
      showParents: !1
    }));
    this.locateIsolationRestoreChanges = Array.from(a).map((l) => ({
      uuid: l,
      visible: !0,
      showParents: !0
    })), this.locateIsolationActive = !0, this.applyVisibilityBatch(d, {
      recomputeBounds: !1,
      refreshExplode: !1,
      invalidateInteractables: !0
    });
  }
  restoreLocateIsolation(e = {}) {
    if (!this.locateIsolationActive || this.locateIsolationRestoreChanges.length === 0)
      return this.locateIsolationActive = !1, this.locateIsolationRestoreChanges = [], !1;
    const t = this.locateIsolationRestoreChanges;
    return this.locateIsolationRestoreChanges = [], this.locateIsolationActive = !1, this.applyVisibilityBatch(t, {
      recomputeBounds: !1,
      refreshExplode: !1,
      invalidateInteractables: e.invalidate ?? !0
    }), (e.clearFocus ?? !0) && this.clearLocateFocus(), !0;
  }
  setObjectVisibility(e, t, i = !0) {
    const n = Ae(this.getVisibilityContext(), e, t, i);
    n.nextHighlightedUuids && this.highlightObjects(n.nextHighlightedUuids), this.markSceneDirty({
      invalidateInteractables: !0,
      needsRender: !1
    }), n.needsBoundsUpdate && this.updateSceneBounds(), n.needsRender && this.markSceneDirty();
  }
  highlightObject(e) {
    this.highlightObjects(e ? [e] : []);
  }
  toLocalDirection(e, t) {
    return e.clone().transformDirection(t.clone().invert()).normalize();
  }
  getExplodeWorldDirection(e) {
    const t = e.clone();
    return this.explodeMode === "horizontal" ? t.z = 0 : this.explodeMode === "vertical" && (t.x = 0, t.y = 0, t.z = t.z >= 0 ? 1 : -1), t.lengthSq() < 1e-8 ? this.explodeMode === "vertical" ? new u.Vector3(0, 0, 1) : this.explodeMode === "horizontal" ? new u.Vector3(1, 0, 0) : new u.Vector3(0, 0, 1) : t.normalize();
  }
  /** 由 UUID 导出的稳定单位向量，近似均匀分布于球面（与径向方向混合后爆炸更散、更匀） */
  explodeStableUnitDirection(e, t) {
    ii(e, t);
  }
  captureExplodeSnapshot() {
    this.explodeObjectStates.clear(), this.explodeInstanceStates.clear();
    let e = this.computeTotalBounds(!0, !0);
    if (e.isEmpty() && (e = this.computeTotalBounds(!1, !0)), e.isEmpty()) {
      this.explodeCenter.set(0, 0, 0);
      return;
    }
    this.explodeCenter.copy(e.getCenter(new u.Vector3()));
    const t = Math.max(e.getSize(new u.Vector3()).length() * 0.5, 1), i = new u.Box3(), n = new u.Vector3();
    this.contentGroup.updateMatrixWorld(!0), this.contentGroup.traverse((c) => {
      if (!c.isMesh || !c.visible || c.userData?.isIfcGridHelper || (i.setFromObject(c), i.isEmpty())) return;
      n.copy(i.getCenter(new u.Vector3()));
      const l = n.sub(this.explodeCenter), h = l.length() / t, f = 0.14 + 0.86 * Math.pow(u.MathUtils.clamp(h, 0, 2.5) / 2.5, 0.38);
      let p;
      if (this.explodeMode === "radial") {
        const y = this.getExplodeWorldDirection(l);
        this.explodeStableUnitDirection(c.uuid, this.explodeScratchUniform);
        const g = Math.pow(1 - Math.min(h / 1.08, 1), 1.15);
        p = this.explodeScratchMix.copy(y).multiplyScalar(1 - g).addScaledVector(this.explodeScratchUniform, g).normalize();
      } else
        p = this.getExplodeWorldDirection(l);
      const m = this.toLocalDirection(p, c.parent?.matrixWorld || new u.Matrix4());
      this.explodeObjectStates.set(c.uuid, {
        object: c,
        basePosition: c.position.clone(),
        directionLocal: m,
        weight: f
      });
    });
    const r = new u.Box3(), o = new u.Matrix4(), a = new u.Matrix4();
    this.optimizedMapping.forEach((c, d) => {
      (this.nodeMap.get(d)?.some((h) => h.visible !== !1) ?? !0) && c.forEach((h) => {
        const f = `${h.mesh.uuid}:${h.instanceId}`;
        if (this.explodeInstanceStates.has(f)) return;
        h.mesh.getMatrixAt(h.instanceId, o);
        const p = h.geometry || h.mesh.geometry;
        if (p?.boundingBox || p?.computeBoundingBox?.(), !p?.boundingBox || (a.copy(h.mesh.matrixWorld).multiply(o), r.copy(p.boundingBox).applyMatrix4(a), r.isEmpty())) return;
        n.copy(r.getCenter(new u.Vector3()));
        const m = n.sub(this.explodeCenter), y = m.length() / t, g = 0.14 + 0.86 * Math.pow(u.MathUtils.clamp(y, 0, 2.5) / 2.5, 0.38);
        let M;
        if (this.explodeMode === "radial") {
          const k = this.getExplodeWorldDirection(m);
          this.explodeStableUnitDirection(f, this.explodeScratchUniform);
          const b = Math.pow(1 - Math.min(y / 1.08, 1), 1.15);
          M = this.explodeScratchMix.copy(k).multiplyScalar(1 - b).addScaledVector(this.explodeScratchUniform, b).normalize();
        } else
          M = this.getExplodeWorldDirection(m);
        this.explodeInstanceStates.set(f, {
          mesh: h.mesh,
          instanceId: h.instanceId,
          baseMatrix: o.clone(),
          directionLocal: this.toLocalDirection(M, h.mesh.matrixWorld),
          weight: g
        });
      });
    });
  }
  applyExplodeState() {
    const e = this.computeTotalBounds(!0, !0), t = e.isEmpty() ? new u.Vector3(100, 100, 100) : e.getSize(new u.Vector3()), i = Math.max(t.length() * 0.125 * (this.explodeStrength / 100), 0);
    this.explodeObjectStates.forEach((c) => {
      c.object.position.copy(c.basePosition).addScaledVector(c.directionLocal, i * c.weight), c.object.updateMatrixWorld();
    });
    const n = new u.Vector3(), r = new u.Quaternion(), o = new u.Vector3(), a = new u.Matrix4();
    this.explodeInstanceStates.forEach((c) => {
      a.copy(c.baseMatrix), a.decompose(n, r, o), n.addScaledVector(c.directionLocal, i * c.weight), a.compose(n, r, o), c.mesh.setMatrixAt(c.instanceId, a), c.mesh.instanceMatrix && (c.mesh.instanceMatrix.needsUpdate = !0);
    }), this.interactableListValid = !1, this.updateSceneBounds(), this.markSceneDirty({
      needsBoundsUpdate: !0,
      needsCulling: !0,
      invalidateInteractables: !0
    });
  }
  restoreExplodeSnapshot() {
    this.explodeObjectStates.forEach((e) => {
      e.object.position.copy(e.basePosition), e.object.updateMatrixWorld();
    }), this.explodeInstanceStates.forEach((e) => {
      e.mesh.setMatrixAt(e.instanceId, e.baseMatrix), e.mesh.instanceMatrix && (e.mesh.instanceMatrix.needsUpdate = !0);
    }), this.interactableListValid = !1, this.updateSceneBounds(), this.markSceneDirty({
      needsBoundsUpdate: !0,
      needsCulling: !0,
      invalidateInteractables: !0
    });
  }
  refreshExplodeState() {
    this.explodeEnabled && (this.restoreExplodeSnapshot(), this.captureExplodeSnapshot(), this.applyExplodeState());
  }
  setExplodeEnabled(e) {
    if (e !== this.explodeEnabled) {
      if (this.explodeEnabled = e, !e) {
        this.restoreExplodeSnapshot(), this.explodeObjectStates.clear(), this.explodeInstanceStates.clear();
        return;
      }
      this.captureExplodeSnapshot(), this.applyExplodeState();
    }
  }
  setExplodeStrength(e) {
    this.explodeStrength = u.MathUtils.clamp(e, 0, 100), this.explodeEnabled && (this.explodeObjectStates.size === 0 && this.explodeInstanceStates.size === 0 && this.captureExplodeSnapshot(), this.applyExplodeState());
  }
  setExplodeMode(e) {
    this.explodeMode = e, this.explodeEnabled && (this.restoreExplodeSnapshot(), this.captureExplodeSnapshot(), this.applyExplodeState());
  }
  resetExplode() {
    this.explodeStrength = 0, this.explodeEnabled && this.restoreExplodeSnapshot(), this.explodeEnabled = !1, this.explodeObjectStates.clear(), this.explodeInstanceStates.clear(), this.markSceneDirty({
      needsBoundsUpdate: !0,
      needsCulling: !0,
      invalidateInteractables: !0
    });
  }
  clearClashPairHighlight() {
    this.clashPairObjectMaterialCache.forEach((e, t) => {
      const i = this.contentGroup.getObjectByProperty("uuid", t);
      !i || !i.isMesh && !i.isBatchedMesh || (i.material = e);
    }), this.clashPairObjectMaterialCache.clear(), this.clashPairInstanceColorCache.forEach(({ mesh: e, instanceId: t, originalColor: i }) => {
      e.setColorAt(t, new u.Color(i)), e.instanceColor && (e.instanceColor.needsUpdate = !0);
    }), this.clashPairInstanceColorCache.clear(), this.clashPairUuids.clear();
  }
  setClashPairHighlight(e, t, i = "#ff4d4f", n = "#1890ff") {
    const r = String(e || "").trim(), o = String(t || "").trim();
    if (!r || !o) {
      this.clearClashPairHighlight(), this.markSceneDirty();
      return;
    }
    this.clearLocateFocus(), this.clearClashPairHighlight();
    const a = this.expandLocateTargets([r]), c = this.expandLocateTargets([o]), d = new u.Color(i), l = new u.Color(n);
    this.contentGroup.traverse((f) => {
      const p = f;
      if (!p.isMesh || p.isBatchedMesh || p.userData?.isOptimized || !p.material) return;
      const m = a.has(f.uuid) ? "A" : c.has(f.uuid) ? "B" : null;
      if (!m) return;
      this.clashPairObjectMaterialCache.has(f.uuid) || this.clashPairObjectMaterialCache.set(f.uuid, p.material);
      const y = Array.isArray(p.material) ? p.material : [p.material], g = m === "A" ? d : l, M = y.map((k) => {
        if (!k) return k;
        const b = k.clone();
        return "transparent" in b && (b.transparent = !1), "opacity" in b && (b.opacity = 1), "depthWrite" in b && (b.depthWrite = !0), "color" in b && b.color && b.color.copy(b.color.clone().lerp(g, 0.86)), "emissive" in b && b.emissive && b.emissive.copy(g.clone().multiplyScalar(0.36)), b.needsUpdate = !0, b;
      });
      p.material = Array.isArray(p.material) ? M : M[0];
    });
    const h = /* @__PURE__ */ new Map();
    this.optimizedMapping.forEach((f) => {
      f.forEach((p) => {
        h.set(`${p.mesh.uuid}:${p.instanceId}`, p.originalColor);
      });
    }), this.contentGroup.traverse((f) => {
      const p = f;
      if (!f.isBatchedMesh) return;
      const m = p.userData?.batchIdToUuid;
      if (!m || m.size === 0) return;
      let y = !1;
      m.forEach((g, M) => {
        const k = a.has(g) ? "A" : c.has(g) ? "B" : null;
        if (!k) return;
        const b = `${p.uuid}:${M}`;
        if (!this.clashPairInstanceColorCache.has(b)) {
          const w = h.get(b);
          if (typeof w == "number")
            this.clashPairInstanceColorCache.set(b, {
              mesh: p,
              instanceId: M,
              originalColor: w
            });
          else {
            const P = new u.Color();
            p.getColorAt(M, P), this.clashPairInstanceColorCache.set(b, {
              mesh: p,
              instanceId: M,
              originalColor: P.getHex()
            });
          }
        }
        const C = this.clashPairInstanceColorCache.get(b)?.originalColor;
        if (typeof C != "number") return;
        const x = k === "A" ? d : l;
        p.setColorAt(M, new u.Color(C).lerp(x, 0.88)), y = !0;
      }), y && p.instanceColor && (p.instanceColor.needsUpdate = !0);
    }), this.clashPairUuids = /* @__PURE__ */ new Set([r, o]), this.markSceneDirty();
  }
  clearLocateFocus() {
    if (this.locateResultSet.size === 0 && this.locateObjectMaterialCache.size === 0 && this.locateDimmedInstances.size === 0 && !this.locateFocusUuid && this.highlightedUuids.size === 0)
      return;
    const e = this.getHighlightContext(), t = St(e);
    this.syncHighlightState(e.state), t.needsRender && this.markSceneDirty();
  }
  restoreView(e = !0) {
    if (this.cancelCameraFlight(), this.locateResultSet.size > 0 || this.locateObjectMaterialCache.size > 0 || this.locateDimmedInstances.size > 0) {
      this.clearLocateFocus(), requestAnimationFrame(() => {
        this.disposed || this.fitView(e);
      });
      return;
    }
    this.fitView(e);
  }
  expandLocateTargets(e) {
    const t = /* @__PURE__ */ new Set(), i = [...e], n = /* @__PURE__ */ new Set();
    for (; i.length > 0; ) {
      const r = i.shift();
      if (!r || n.has(r)) continue;
      n.add(r), t.add(r);
      const o = this.nodeMap.get(r);
      if (!(!o || o.length === 0)) {
        for (const a of o)
          if (!(!a.children || a.children.length === 0))
            for (const c of a.children)
              n.has(c.id) || i.push(c.id);
      }
    }
    return t;
  }
  setLocateResultSet(e, t = null) {
    const i = this.getHighlightContext(), n = et(i, e, t);
    this.syncHighlightState(i.state), n.needsRender && this.markSceneDirty();
  }
  setLocateFocusContext(e, t = null, i) {
    const n = this.getHighlightContext(), r = et(n, e, t, { highlightColors: i });
    this.syncHighlightState(n.state), r.needsRender && this.markSceneDirty();
  }
  setLocateFocus(e) {
    if (!e) {
      this.clearLocateFocus();
      return;
    }
    this.setLocateResultSet([e], e);
  }
  highlightObjects(e) {
    const t = this.getHighlightContext();
    Je(t, e), this.syncHighlightState(t.state), this.markSceneDirty();
  }
  /**
   * 通用多构件聚焦高亮入口：
   * - 高亮 uuids 中的所有物体
   * - 可选 fitView 将镜头飞到这批物体
   * - 可选 highlightColors 支持按 UUID 指定不同颜色（碰撞场景 A/B 色对）
   * - 传空数组等同于 clearLocateFocus()
   */
  focusHighlightObjects(e, t = {}) {
    const { fitView: i = !0, focusUuid: n = null, highlightColors: r } = t, o = Array.from(new Set(e.filter(Boolean)));
    if (o.length === 0) {
      this.clearLocateFocus();
      return;
    }
    this.setLocateFocusContext(o, n ?? o[0], r), i && this.fitViewToObjects(o);
  }
  collectRenderableTargets(e) {
    const t = this.getHighlightContext();
    return e && e.length > 0 ? Ct(t, e) : Ms(t);
  }
  pick(e, t) {
    const i = this.getRayIntersects(e, t);
    return i ? { object: i.object, intersect: i } : null;
  }
  getRayIntersects(e, t) {
    const i = Ls(this.getPickingContext(), e, t);
    return this.syncPickingState(i.state), i.intersect;
  }
  computeTotalBounds(e = !1, t = !1) {
    if (!e && !t && !this.precomputedBounds.isEmpty()) {
      const n = this.precomputedBounds.clone();
      return this.globalOffset.length() > 0 && n.translate(this.globalOffset.clone().negate()), n;
    }
    const i = new u.Box3();
    if (this.contentGroup.updateMatrixWorld(!0), this.contentGroup.traverse((n) => {
      if (!(e && !n.visible)) {
        if (n.isMesh && !n._skipTraverse) {
          const r = n;
          if (r.geometry) {
            const o = new u.Box3().setFromObject(r);
            o.isEmpty() || i.union(o);
          }
        } else if (n.isBatchedMesh && !n._skipTraverse) {
          const r = n;
          if (r.computeBoundingBox) {
            if (r.computeBoundingBox(), r.boundingBox) {
              const o = r.boundingBox.clone().applyMatrix4(r.matrixWorld);
              i.union(o);
            }
          } else {
            const o = new u.Box3().setFromObject(r);
            o.isEmpty() || i.union(o);
          }
        }
      }
    }), this.contentGroup.traverse((n) => {
      delete n._skipTraverse;
    }), this.chunks.length > 0 && this.chunks.forEach((n) => {
      (!e || n.loaded) && i.union(n.bounds);
    }), i.isEmpty() && !this.precomputedBounds.isEmpty()) {
      const n = this.precomputedBounds.clone();
      return this.globalOffset.length() > 0 && n.translate(this.globalOffset.clone().negate()), n;
    }
    return i;
  }
  updateSceneBounds() {
    const e = this.computeTotalBounds(!1, !0);
    this.precomputedBounds = e.clone(), this.globalOffset.length() > 0 && this.precomputedBounds.translate(this.globalOffset), this.sceneBounds.copy(e), this.sceneSphereValid = !1;
  }
  fitView(e = !0) {
    this.contentGroup.updateMatrixWorld(!0);
    let t = this.computeTotalBounds(!0);
    t.isEmpty() && (t = this.computeTotalBounds(!1)), this.sceneBounds = t.clone(), this.fitBox(t, !e);
  }
  unionObjectBounds(e, t, i = !1) {
    if (i && !this.isWorldVisible(e)) return;
    const n = new u.Box3();
    e.userData?.boundingBox ? n.copy(e.userData.boundingBox).applyMatrix4(e.matrixWorld) : n.setFromObject(e), n.isEmpty() || t.union(n);
  }
  unionTilesNodeBounds(e, t, i = !1) {
    if (i && e?.visible === !1) return;
    const n = e?.userData?.tilesBoundingVolumeBox;
    if (!Array.isArray(n) || n.length < 12) return;
    const r = new u.Vector3(n[0], n[1], n[2]), o = new u.Vector3(n[3], n[4], n[5]), a = new u.Vector3(n[6], n[7], n[8]), c = new u.Vector3(n[9], n[10], n[11]), d = new u.Vector3(o.length(), a.length(), c.length()), l = new u.Box3(r.clone().sub(d), r.clone().add(d));
    l.isEmpty() || t.union(l);
  }
  unionOptimizedBounds(e, t, i = !1) {
    const n = this.optimizedMapping.get(e);
    if (!n || n.length === 0) return;
    const r = new u.Matrix4();
    for (const o of n) {
      if (i && !this.isWorldVisible(o.mesh)) continue;
      const a = o.geometry || o.mesh.geometry;
      if (a.boundingBox || a.computeBoundingBox(), !a.boundingBox) continue;
      o.mesh.getMatrixAt(o.instanceId, r), r.premultiply(o.mesh.matrixWorld);
      const c = a.boundingBox.clone().applyMatrix4(r);
      c.isEmpty() || t.union(c);
    }
  }
  unionNodeBounds(e, t, i = /* @__PURE__ */ new Set(), n = !1) {
    if (!e || i.has(e)) return;
    i.add(e);
    const r = this.contentGroup.getObjectByProperty("uuid", e);
    r && this.unionObjectBounds(r, t, n), this.unionOptimizedBounds(e, t, n);
    const o = this.nodeMap.get(e) || [];
    for (const a of o) {
      this.unionTilesNodeBounds(a, t, n);
      const c = Array.isArray(a.children) ? a.children : [];
      for (const d of c)
        this.unionNodeBounds(d.id, t, i, n);
    }
  }
  fitViewToObject(e) {
    let t = me(this.getHighlightContext(), [e]);
    t.isEmpty() && (t = new u.Box3(), this.unionNodeBounds(e, t, /* @__PURE__ */ new Set(), !0)), t.isEmpty() || this.fitBox(t, !1, 1.14, !1);
  }
  getBoundsForObject(e) {
    if (!e) return null;
    let t = me(this.getHighlightContext(), [e]);
    return t.isEmpty() && (t = new u.Box3(), this.unionNodeBounds(e, t, /* @__PURE__ */ new Set(), !0)), t.isEmpty() ? null : t;
  }
  collectBoundsForUuids(e) {
    const t = me(this.getHighlightContext(), e);
    if (!t.isEmpty()) return t;
    const i = new u.Box3();
    return Array.from(new Set((e || []).filter(Boolean))).forEach((r) => this.unionNodeBounds(r, i, /* @__PURE__ */ new Set(), !0)), i;
  }
  fitViewToObjects(e) {
    const t = this.collectBoundsForUuids(e);
    t.isEmpty() || this.fitBox(t, !1, 1.14, !1);
  }
  fitBox(e, t = !0, i, n = !0) {
    if (this.cancelCameraFlight(), e.isEmpty()) {
      this.camera.zoom = 1, this.camera.position.set(1e3, 1e3, 1e3), this.camera.lookAt(0, 0, 0), this.controls.target.set(0, 0, 0), this.camera.updateProjectionMatrix(), this.controls.update(), this.markSceneDirty({ needsCulling: n });
      return;
    }
    const r = e.getCenter(new u.Vector3()), o = e.getSize(new u.Vector3()), a = Math.max(o.x, o.y, o.z), c = a > 0 ? a : 100, d = i ?? 1.02, l = this.canvas.clientWidth, h = this.canvas.clientHeight, f = l / h;
    let p, m;
    f >= 1 ? (p = c * d, m = p * f) : (m = c * d, p = m / f);
    const y = Math.max(c * 5, 200);
    this.camera.near = -y, this.camera.far = y;
    let g = 1, M = -m / 2, k = m / 2, b = p / 2, C = -p / 2;
    const x = this.cameraFlightToken;
    if (t) {
      const w = new u.Vector3(1, -1, 1).normalize(), P = Math.max(c * 2.2, 5), I = r.clone().add(w.multiplyScalar(P)), R = r.clone(), T = this.camera.left, D = this.camera.right, U = this.camera.top, S = this.camera.bottom, E = this.camera.position.distanceTo(I), N = this.controls.target.distanceTo(R);
      if (E < 1e-3 && N < 1e-3) {
        this.controls.target.copy(R), this.camera.position.copy(I), this.camera.left = M, this.camera.right = k, this.camera.top = b, this.camera.bottom = C, this.camera.zoom = g, this.camera.lookAt(this.controls.target), this.camera.updateProjectionMatrix(), this.controls.update(), this.markSceneDirty({ needsCulling: n });
        return;
      }
      const v = this.camera.position.clone(), A = this.controls.target.clone(), z = performance.now(), $ = 420, F = () => {
        if (x !== this.cameraFlightToken) return;
        const H = performance.now() - z, G = Math.min(H / $, 1), V = 1 - Math.pow(1 - G, 3);
        this.camera.position.lerpVectors(v, I, V), this.controls.target.lerpVectors(A, R, V), this.camera.lookAt(this.controls.target), this.camera.zoom = g, this.camera.left = T + (M - T) * V, this.camera.right = D + (k - D) * V, this.camera.top = U + (b - U) * V, this.camera.bottom = S + (C - S) * V, this.camera.updateProjectionMatrix(), this.controls.update(), this.markSceneDirty({ needsCulling: n }), G < 1 ? this.cameraFlightFrameId = requestAnimationFrame(F) : (this.cameraFlightFrameId = null, this.markSceneDirty({ needsCulling: n }));
      };
      F();
    } else {
      const w = new u.Vector3();
      this.camera.getWorldDirection(w);
      const P = this.camera.position.distanceTo(this.controls.target), I = r.clone().add(w.multiplyScalar(-P)), R = r.clone(), T = 1.01, D = new u.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion), U = new u.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion), S = Math.max(1e-6, (this.camera.right - this.camera.left) * 0.5), E = Math.max(1e-6, (this.camera.top - this.camera.bottom) * 0.5), N = [
        new u.Vector3(e.min.x, e.min.y, e.min.z),
        new u.Vector3(e.min.x, e.min.y, e.max.z),
        new u.Vector3(e.min.x, e.max.y, e.min.z),
        new u.Vector3(e.min.x, e.max.y, e.max.z),
        new u.Vector3(e.max.x, e.min.y, e.min.z),
        new u.Vector3(e.max.x, e.min.y, e.max.z),
        new u.Vector3(e.max.x, e.max.y, e.min.z),
        new u.Vector3(e.max.x, e.max.y, e.max.z)
      ];
      let v = 0, A = 0;
      for (let Q = 0; Q < N.length; Q++) {
        const q = N[Q].clone().sub(r);
        v = Math.max(v, Math.abs(q.dot(D))), A = Math.max(A, Math.abs(q.dot(U)));
      }
      const z = Math.max(1e-3, v * T), $ = Math.max(1e-3, A * T);
      g = Math.max(
        1e-4,
        Math.min(1e6, Math.min(S / z, E / $))
      );
      const F = this.camera.position.clone(), H = this.controls.target.clone(), G = this.camera.zoom, V = performance.now(), Z = this.camera.position.distanceTo(I), re = this.controls.target.distanceTo(R), te = Math.abs(this.camera.zoom - g);
      if (Z < 1e-3 && re < 1e-3 && te < 1e-4) {
        this.camera.position.copy(I), this.controls.target.copy(R), this.camera.lookAt(this.controls.target), this.camera.zoom = g, this.camera.updateProjectionMatrix(), this.controls.update(), this.markSceneDirty({ needsCulling: n });
        return;
      }
      const ie = 420, K = () => {
        if (x !== this.cameraFlightToken) return;
        const Q = performance.now() - V, q = Math.min(Q / ie, 1), J = 1 - Math.pow(1 - q, 3);
        this.camera.position.lerpVectors(F, I, J), this.controls.target.lerpVectors(H, R, J), this.camera.lookAt(this.controls.target), this.camera.zoom = G + (g - G) * J, this.camera.updateProjectionMatrix(), this.controls.update(), this.markSceneDirty({ needsCulling: n }), q < 1 ? this.cameraFlightFrameId = requestAnimationFrame(K) : (this.cameraFlightFrameId = null, this.markSceneDirty({ needsCulling: n }));
      };
      K();
    }
  }
  setView(e) {
    let t = this.computeTotalBounds(!0);
    t.isEmpty() && (t = this.computeTotalBounds(!1)), this.sceneBounds = t.clone();
    const i = t.isEmpty() ? new u.Vector3(0, 0, 0) : t.getCenter(new u.Vector3()), n = t.isEmpty() ? new u.Vector3(100, 100, 100) : t.getSize(new u.Vector3()), r = Math.max(n.x, n.y, n.z), o = Math.max(r * 2, 10);
    let a = new u.Vector3();
    switch (e) {
      case "top":
        a.set(0, 0, o);
        break;
      case "bottom":
        a.set(0, 0, -o);
        break;
      case "front":
        a.set(0, -o, 0);
        break;
      case "back":
        a.set(0, o, 0);
        break;
      case "left":
        a.set(-o, 0, 0);
        break;
      case "right":
        a.set(o, 0, 0);
        break;
      case "se":
      case "top-front-right":
        a.set(o, -o, o);
        break;
      case "sw":
      case "top-front-left":
        a.set(-o, -o, o);
        break;
      case "ne":
      case "top-back-right":
        a.set(o, o, o);
        break;
      case "nw":
      case "top-back-left":
        a.set(-o, o, o);
        break;
      case "bottom-front-right":
        a.set(o, -o, -o);
        break;
      case "bottom-front-left":
        a.set(-o, -o, -o);
        break;
      case "bottom-back-right":
        a.set(o, o, -o);
        break;
      case "bottom-back-left":
        a.set(-o, o, -o);
        break;
      case "top-front":
        a.set(0, -o, o);
        break;
      case "top-back":
        a.set(0, o, o);
        break;
      case "top-left":
        a.set(-o, 0, o);
        break;
      case "top-right":
        a.set(o, 0, o);
        break;
      case "bottom-front":
        a.set(0, -o, -o);
        break;
      case "bottom-back":
        a.set(0, o, -o);
        break;
      case "bottom-left":
        a.set(-o, 0, -o);
        break;
      case "bottom-right":
        a.set(o, 0, -o);
        break;
      case "front-left":
        a.set(-o, -o, 0);
        break;
      case "front-right":
        a.set(o, -o, 0);
        break;
      case "back-left":
        a.set(-o, o, 0);
        break;
      case "back-right":
        a.set(o, o, 0);
        break;
    }
    a.lengthSq() > 0 && (a.normalize().multiplyScalar(o), this.camera.position.copy(i).add(a), this.camera.lookAt(i), this.controls.target.copy(i), this.controls.update(), this.fitBox(t, !1));
  }
  getCameraState() {
    return {
      position: this.camera.position.toArray(),
      target: this.controls.target.toArray(),
      zoom: this.camera.zoom,
      left: this.camera.left,
      right: this.camera.right,
      top: this.camera.top,
      bottom: this.camera.bottom
    };
  }
  setCameraState(e) {
    e && (this.camera.position.fromArray(e.position), this.controls.target.fromArray(e.target), e.zoom !== void 0 && (this.camera.zoom = e.zoom), e.left !== void 0 && (this.camera.left = e.left), e.right !== void 0 && (this.camera.right = e.right), e.top !== void 0 && (this.camera.top = e.top), e.bottom !== void 0 && (this.camera.bottom = e.bottom), this.camera.updateProjectionMatrix(), this.controls.update(), this.markSceneDirty());
  }
  // --- 测量定位逻辑 ---
  locateMeasurement(e) {
    const t = this.measureRecords.get(e);
    if (!t) return;
    const i = new u.Box3();
    if (t.group.traverse((c) => {
      if ((c.isMesh || c.isLine || c.isSprite) && (c.updateMatrixWorld(), c.geometry)) {
        c.geometry.boundingBox || c.geometry.computeBoundingBox();
        const d = c.geometry.boundingBox.clone();
        d.applyMatrix4(c.matrixWorld), i.union(d);
      }
    }), i.isEmpty()) return;
    const n = i.getCenter(new u.Vector3()), r = i.getSize(new u.Vector3()), o = Math.max(r.x, r.y, r.z) || 1;
    this.controls.target.copy(n);
    const a = (this.camera.top - this.camera.bottom) / (o * 0.5);
    this.camera.zoom = Math.min(a, 100), this.camera.updateProjectionMatrix(), this.controls.update(), this.markSceneDirty();
  }
  // --- 测量逻辑 ---
  startMeasurement(e) {
    this.measureType = e, this.currentMeasurePoints = [], this.currentMeasureModelUuid = null, this.clearMeasurementPreview();
  }
  addMeasurePoint(e, t) {
    const i = this.getMeasurementContext(), n = Bs(i, e, t);
    return this.syncMeasurementState(n.state), n.needsRender && this.markSceneDirty(), n.completed ?? null;
  }
  updateMeasurePreview(e) {
    const t = this.getMeasurementContext(), i = ze(t, e);
    this.syncMeasurementState(i.state), i.needsRender && this.markSceneDirty();
  }
  updateMeasureHover(e, t) {
    const i = this.getMeasurementContext(), n = Is(i, e, t);
    this.syncMeasurementState(n.state), n.needsRender && this.markSceneDirty();
  }
  finalizeMeasurement() {
    const e = this.getMeasurementContext(), t = Pt(e);
    return this.syncMeasurementState(t.state), t.needsRender && this.markSceneDirty(), t.completed ?? null;
  }
  highlightMeasurement(e) {
    const t = Ps(this.getMeasurementContext(), e);
    this.syncMeasurementState(t.state), this.markSceneDirty();
  }
  pickMeasurement(e, t) {
    return Rs(this.getMeasurementContext(), e, t);
  }
  /**
   * 获取对象的面积和体积
   */
  getObjectGeometryData(e) {
    return Yi({
      uuid: e,
      optimizedMapping: this.optimizedMapping,
      contentGroup: this.contentGroup
    });
  }
  // ========== 框选方法 ==========
  /**
   * 开始框选
   */
  startBoxSelect(e, t) {
    const i = ai(this.boxSelectState, e, t);
    this.syncBoxSelectState(i.state), this.markSceneDirty();
  }
  /**
   * 更新框选范围
   */
  updateBoxSelect(e, t) {
    const i = ci(this.boxSelectState, e, t);
    this.syncBoxSelectState(i.state), i.needsRender && this.markSceneDirty();
  }
  /**
   * 完成框选，返回选中的对象 UUID 列表
   */
  endBoxSelect() {
    const e = hi(
      this.boxSelectState,
      this.canvas,
      (t, i, n, r) => this.selectByScreenRect(t, i, n, r)
    );
    return this.syncBoxSelectState(e.state), e.needsRender && this.markSceneDirty(), e.selected;
  }
  /**
   * 取消框选
   */
  cancelBoxSelect() {
    const e = ct(this.boxSelectState);
    this.syncBoxSelectState(e.state), this.markSceneDirty();
  }
  /**
   * 通过屏幕矩形选择对象
   */
  selectByScreenRect(e, t, i, n) {
    const r = Rt(this.getPickingContext());
    return this.syncPickingState(r), Ts(
      {
        camera: this.camera,
        interactableList: this.interactableList
      },
      e,
      t,
      i,
      n
    );
  }
  removeMeasurement(e) {
    if (this.measureRecords.has(e)) {
      const t = this.measureRecords.get(e);
      t && (this.measureGroup.remove(t.group), this.measureRecords.delete(e), this.onMeasureUpdate && this.onMeasureUpdate(Array.from(this.measureRecords.values())), this.markSceneDirty());
    }
  }
  clearAllMeasurements() {
    this.measureRecords.forEach((e) => {
      this.measureGroup.remove(e.group);
    }), this.measureRecords.clear(), this.clearMeasurementPreview(), this.onMeasureUpdate && this.onMeasureUpdate([]), this.markSceneDirty();
  }
  clearMeasurementPreview() {
    const e = this.getMeasurementContext(), t = Bt(e);
    this.syncMeasurementState(t.state), this.markSceneDirty();
  }
  // --- 剖切逻辑 ---
  setupClipping() {
    const e = $i(this.getClippingContext());
    this.syncClippingState(e.state), this.markSceneDirty();
  }
  setClipHelperOptions(e) {
    const t = _i(this.getClippingContext(), e);
    this.syncClippingState(t.state), this.markSceneDirty();
  }
  setClippingEnabled(e) {
    this.renderer.clippingPlanes = e ? this.clippingPlanes : [], e || this.clipPlaneHelpers.forEach((t) => t.visible = !1), this.markSceneDirty();
  }
  updateClippingPlanes(e, t, i) {
    const n = Qi(this.getClippingContext(), e, t, i);
    this.syncClippingState(n.state), n.needsRender && this.markSceneDirty();
  }
  /**
   * 检查包围盒是否完全被当前剖切面裁剪掉
   * 如果包围盒完全在任意一个激活的剖切面的“背面”，则认为被裁剪
   */
  isBoxClipped(e) {
    return qi(this.clippingPlanes, e);
  }
  getStats() {
    return Gs({
      renderer: this.renderer,
      contentGroup: this.contentGroup,
      originalStats: this.originalStats,
      chunkLoadedCount: this.chunkLoadedCount,
      chunksLength: this.chunks.length,
      processingChunkCount: this.processingChunks.size,
      activePixelRatio: this.activePixelRatio
    });
  }
  dispose() {
    this.disposed = !0, this.animateFramePending = !1, this.cancelCameraFlight(), this.cancelBoxSelect(), Xi({
      cancelDeferredStructureBuild: () => this.cancelDeferredStructureBuild(),
      clearLocateFocus: () => this.clearLocateFocus(),
      releaseGhostLine: (e) => this.releaseGhostLine(e),
      clearChunkCache: () => this.clearChunkCache(),
      controls: this.controls,
      selectionBox: this.selectionBox,
      highlightMesh: this.highlightMesh,
      tempMarker: this.tempMarker,
      dotTexture: this.dotTexture,
      sharedMaterial: this.sharedMaterial,
      ghostEdgesGeometry: this.ghostEdgesGeometry,
      ghostMaterial: this.ghostMaterial,
      renderer: this.renderer,
      ghostGroup: this.ghostGroup,
      workers: this.workers,
      workerQueue: this.workerQueue,
      logicTimer: this.logicTimer,
      animationFrameId: this.animationFrameId,
      onAnimationFrameDisposed: () => {
        this.animationFrameId = null;
      },
      onWorkersDisposed: () => {
        this.workers = [], this.activeWorkerCount = 0;
      },
      onQueuesReset: () => {
        this.processingChunks.clear(), this.cancelledChunkIds.clear(), this.prefetchQueue = [], this.prefetchQueueSet.clear(), this.prefetchInFlight.clear(), this.chunkReadCache.clear(), this.chunkReadCacheOrder = [];
      },
      onStateCachesReset: () => {
        this.highlightedUuids.clear(), this.locateResultSet.clear(), this.fastPreviewModels.clear(), this.ghostMeshPool.length = 0;
      }
    });
  }
}
async function js(s) {
  const e = new Wt();
  return new Promise((t, i) => {
    e.parse(
      s,
      (n) => {
        const r = new Blob([n], { type: "model/gltf-binary" });
        t(r);
      },
      (n) => i(n),
      { binary: !0 }
    );
  });
}
async function Zs(s, e) {
  e("准备LMB导出...");
  const t = [], i = [], n = /* @__PURE__ */ new Map();
  s.updateMatrixWorld(!0);
  const r = new u.Vector3(0, 0, 0);
  s.userData.originalCenter && r.copy(s.userData.originalCenter), s.traverse((g) => {
    if (g.isMesh && g.visible) {
      t.push(g);
      const M = g.material, k = M.color ? M.color.getHex() : 16777215;
      n.has(k.toString()) || (n.set(k.toString(), i.length), i.push(k));
    }
  });
  const o = [], a = new TextEncoder(), c = new ArrayBuffer(20), d = new DataView(c);
  d.setFloat32(0, r.x, !0), d.setFloat32(4, r.y, !0), d.setFloat32(8, r.z, !0), d.setUint32(12, i.length, !0), d.setUint32(16, t.length, !0), o.push(c);
  const l = new ArrayBuffer(i.length * 4), h = new DataView(l);
  for (let g = 0; g < i.length; g++)
    h.setUint32(g * 4, i[g], !0);
  o.push(l);
  for (let g = 0; g < t.length; g++) {
    const M = Math.floor(g / t.length * 100);
    g % 10 === 0 && e(`Encoding mesh ${g + 1}/${t.length} (${M}%)`);
    const k = t[g], b = k.geometry;
    if (!b.getAttribute("position")) continue;
    const C = b.getAttribute("position"), x = b.getAttribute("normal"), w = b.index, P = a.encode(k.name || `Node_${g}`), I = new ArrayBuffer(2);
    new DataView(I).setUint16(0, P.length, !0), o.push(I), o.push(P.buffer);
    const R = (4 - (2 + P.length) % 4) % 4;
    R > 0 && o.push(new Uint8Array(R).buffer);
    const D = k.matrixWorld.elements, U = new ArrayBuffer(36), S = new DataView(U), E = [0, 1, 2, 4, 5, 6, 8, 9, 10];
    for (let B = 0; B < 9; B++) S.setFloat32(B * 4, D[E[B]], !0);
    o.push(U);
    const N = new ArrayBuffer(12), v = new DataView(N);
    v.setFloat32(0, D[12], !0), v.setFloat32(4, D[13], !0), v.setFloat32(8, D[14], !0), o.push(N);
    let A = 1 / 0, z = 1 / 0, $ = 1 / 0, F = -1 / 0, H = -1 / 0, G = -1 / 0;
    for (let B = 0; B < C.count; B++) {
      const O = C.getX(B), X = C.getY(B), Y = C.getZ(B);
      O < A && (A = O), X < z && (z = X), Y < $ && ($ = Y), O > F && (F = O), X > H && (H = X), Y > G && (G = Y);
    }
    F === A && (F += 1e-3), H === z && (H += 1e-3), G === $ && (G += 1e-3);
    const V = F - A, Z = H - z, re = G - $, te = (A + F) / 2, ie = (z + H) / 2, K = ($ + G) / 2, Q = 32767 / (V * 0.5), q = 32767 / (Z * 0.5), J = 32767 / (re * 0.5), le = new ArrayBuffer(24), W = new DataView(le);
    W.setFloat32(0, te, !0), W.setFloat32(4, ie, !0), W.setFloat32(8, K, !0), W.setFloat32(12, Q, !0), W.setFloat32(16, q, !0), W.setFloat32(20, J, !0), o.push(le);
    const _ = C.count, ue = new ArrayBuffer(4);
    new DataView(ue).setUint32(0, _, !0), o.push(ue);
    const oe = C.getX(0), de = C.getY(0), fe = C.getZ(0);
    W.setFloat32(0, oe, !0), W.setFloat32(4, de, !0), W.setFloat32(8, fe, !0);
    const Fe = Math.max(Math.abs(F - oe), Math.abs(A - oe)), Ee = Math.max(Math.abs(H - de), Math.abs(z - de)), Ge = Math.max(Math.abs(G - fe), Math.abs($ - fe)), Ve = Fe > 1e-4 ? 32767 / Fe : 1, We = Ee > 1e-4 ? 32767 / Ee : 1, Ne = Ge > 1e-4 ? 32767 / Ge : 1;
    W.setFloat32(12, Ve, !0), W.setFloat32(16, We, !0), W.setFloat32(20, Ne, !0);
    const ke = (_ - 1) * 6, He = new ArrayBuffer(ke > 0 ? ke : 0);
    if (ke > 0) {
      const B = new DataView(He);
      for (let O = 1; O < _; O++) {
        const X = C.getX(O), Y = C.getY(O), we = C.getZ(O), Se = Math.round((X - oe) * Ve), ve = Math.round((Y - de) * We), Ie = Math.round((we - fe) * Ne), ee = (O - 1) * 6;
        B.setInt16(ee, Se, !0), B.setInt16(ee + 2, ve, !0), B.setInt16(ee + 4, Ie, !0);
      }
    }
    o.push(He);
    const $e = new ArrayBuffer(_ * 4), zt = new DataView($e);
    for (let B = 0; B < _; B++) {
      let O = 0, X = 0, Y = 1;
      x && (O = x.getX(B), X = x.getY(B), Y = x.getZ(B));
      const we = (Se, ve, Ie) => {
        const ee = (Gt) => Math.max(0, Math.min(1023, Math.round((Gt + 1) * 511)));
        return ee(Se) << 20 | ee(ve) << 10 | ee(Ie);
      };
      zt.setUint32(B * 4, we(O, X, Y), !0);
    }
    o.push($e);
    const xe = w ? w.count : _, ae = _ <= 255 ? 1 : _ <= 65535 ? 2 : 4, _e = new ArrayBuffer(xe * ae), se = new DataView(_e);
    if (w)
      for (let B = 0; B < xe; B++) {
        const O = w.getX(B);
        ae === 1 ? se.setUint8(B, O) : ae === 2 ? se.setUint16(B * 2, O, !0) : se.setUint32(B * 4, O, !0);
      }
    else
      for (let B = 0; B < xe; B++)
        ae === 1 ? se.setUint8(B, B) : ae === 2 ? se.setUint16(B * 2, B, !0) : se.setUint32(B * 4, B, !0);
    o.push(_e);
    const Qe = k.material, Ft = Qe.color ? Qe.color.getHex() : 16777215, Et = n.get(Ft.toString()) || 0, qe = new ArrayBuffer(4);
    new DataView(qe).setUint32(0, Et, !0), o.push(qe);
    const Xe = new ArrayBuffer(4);
    new DataView(Xe).setUint32(0, 0, !0), o.push(Xe);
  }
  e("完成LMB文件...");
  const f = o.reduce((g, M) => g + M.byteLength, 0), p = new ArrayBuffer(f), m = new Uint8Array(p);
  let y = 0;
  for (const g of o)
    m.set(new Uint8Array(g), y), y += g.byteLength;
  return new Blob([p], { type: "application/octet-stream" });
}
export {
  Ys as S,
  Le as a,
  ye as b,
  Zs as c,
  js as e,
  ce as s,
  Me as t
};
