import * as d from "three";
import { OrbitControls as Et } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFExporter as Vt } from "three/examples/jsm/exporters/GLTFExporter.js";
function Gt(s) {
  let e = 0;
  if (s.attributes)
    for (const t in s.attributes) {
      const i = s.attributes[t];
      i.array && (e += i.array.byteLength);
    }
  return s.index && s.index.array && (e += s.index.array.byteLength), e / (1024 * 1024);
}
function Wt(s) {
  if (!s.getAttribute("position")) return new d.BoxGeometry(0.1, 0.1, 0.1);
  const e = new d.BufferGeometry(), t = s.getAttribute("position");
  if (t.isInterleavedBufferAttribute) {
    const n = new Float32Array(t.count * 3);
    for (let o = 0; o < t.count; o++)
      n[o * 3] = t.getX(o), n[o * 3 + 1] = t.getY(o), n[o * 3 + 2] = t.getZ(o);
    e.setAttribute("position", new d.BufferAttribute(n, 3));
  } else
    e.setAttribute("position", t.clone());
  const i = s.getAttribute("normal");
  if (i)
    if (i.isInterleavedBufferAttribute) {
      const n = new Float32Array(i.count * 3);
      for (let o = 0; o < i.count; o++)
        n[o * 3] = i.getX(o), n[o * 3 + 1] = i.getY(o), n[o * 3 + 2] = i.getZ(o);
      e.setAttribute("normal", new d.BufferAttribute(n, 3));
    } else
      e.setAttribute("normal", i.clone());
  else
    e.computeVertexNormals();
  const r = s.getIndex();
  if (r)
    e.setIndex(r.clone());
  else {
    const n = t.count, o = new Uint32Array(n);
    for (let a = 0; a < n; a++) o[a] = a;
    e.setIndex(new d.BufferAttribute(o, 1));
  }
  return e.deleteAttribute("uv"), e.deleteAttribute("uv2"), e.deleteAttribute("color"), e.computeBoundingBox(), e;
}
function ge(s) {
  if (s.userData.color !== void 0) return s.userData.color;
  const e = s.geometry;
  if (e && e.attributes.color) {
    const i = e.attributes.color;
    if (i.count > 0) {
      const r = i.getX(0), n = i.getY(0), o = i.getZ(0), a = new d.Color();
      return r > 1 || n > 1 || o > 1 ? a.setRGB(r / 255, n / 255, o / 255) : a.setRGB(r, n, o), a.getHex();
    }
  }
  const t = s.material;
  if (Array.isArray(t)) {
    for (const i of t)
      if (i.color) return i.color.getHex();
  } else if (t.color)
    return t.color.getHex();
  return Nt(s.name);
}
function Nt(s) {
  return 9741240;
}
function Ht(s) {
  const e = [], t = new d.Matrix4();
  return s.updateMatrixWorld(!0), s.traverse((i) => {
    if (i.isMesh) {
      const r = i, n = r.geometry, o = r.material;
      if (!n) return;
      n.boundingBox || n.computeBoundingBox();
      const a = r.matrixWorld, c = new d.Vector3();
      n.boundingBox.getCenter(c), c.applyMatrix4(a);
      const u = Array.isArray(o) ? o[0]?.uuid : o?.uuid, l = `${n.uuid}_${u}`;
      if (r.isInstancedMesh) {
        const h = r;
        for (let f = 0; f < h.count; f++) {
          h.getMatrixAt(f, t), t.premultiply(a);
          const p = new d.Vector3();
          n.boundingBox.getCenter(p), p.applyMatrix4(t), e.push({
            id: l,
            uuid: r.uuid,
            sourceMesh: r,
            expressID: h.userData.expressID,
            geometry: n,
            material: o,
            color: ge(r),
            matrix: t.clone(),
            center: p
          });
        }
      } else
        e.push({
          id: l,
          uuid: r.uuid,
          sourceMesh: r,
          expressID: r.userData.expressID,
          geometry: n,
          material: o,
          color: ge(r),
          matrix: a.clone(),
          center: c
        });
    }
  }), e;
}
async function $t(s, e = {}) {
  const t = [], i = new d.Matrix4(), r = e.batchSize ?? 4e3;
  s.updateMatrixWorld(!0);
  const n = [];
  s.traverse((o) => {
    o.isMesh && n.push(o);
  });
  for (let o = 0; o < n.length; o += r) {
    const a = n.slice(o, o + r);
    for (const c of a) {
      const u = c, l = u.geometry, h = u.material;
      if (!l) continue;
      l.boundingBox || l.computeBoundingBox();
      const f = u.matrixWorld, p = new d.Vector3();
      l.boundingBox.getCenter(p), p.applyMatrix4(f);
      const m = Array.isArray(h) ? h[0]?.uuid : h?.uuid, y = `${l.uuid}_${m}`;
      if (u.isInstancedMesh) {
        const g = u;
        for (let M = 0; M < g.count; M++) {
          g.getMatrixAt(M, i), i.premultiply(f);
          const x = new d.Vector3();
          l.boundingBox.getCenter(x), x.applyMatrix4(i), t.push({
            id: y,
            uuid: u.uuid,
            sourceMesh: u,
            expressID: g.userData.expressID,
            geometry: l,
            material: h,
            color: ge(u),
            matrix: i.clone(),
            center: x
          });
        }
      } else
        t.push({
          id: y,
          uuid: u.uuid,
          sourceMesh: u,
          expressID: u.userData.expressID,
          geometry: l,
          material: h,
          color: ge(u),
          matrix: f.clone(),
          center: p
        });
    }
    e.onProgress?.(Math.min(o + a.length, n.length), n.length), await new Promise((c) => requestAnimationFrame(() => c()));
  }
  return t;
}
function it(s, e, t, i = 0) {
  if (s.length <= t.maxItemsPerNode || i >= t.maxDepth)
    return { bounds: e.clone(), children: null, items: s, level: i };
  const r = e.getCenter(new d.Vector3()), n = e.min, o = e.max, a = Array(8).fill(null).map(() => []);
  for (const l of s) {
    const h = l.center, f = (h.x >= r.x ? 1 : 0) | (h.y >= r.y ? 2 : 0) | (h.z >= r.z ? 4 : 0);
    a[f].push(l);
  }
  const c = [];
  let u = !1;
  for (let l = 0; l < 8; l++)
    if (a[l].length > 0) {
      const h = new d.Vector3(l & 1 ? r.x : n.x, l & 2 ? r.y : n.y, l & 4 ? r.z : n.z), f = new d.Vector3(l & 1 ? o.x : r.x, l & 2 ? o.y : r.y, l & 4 ? o.z : r.z), p = new d.Box3(h, f);
      c.push(it(a[l], p, t, i + 1)), u = !0;
    }
  return u ? { bounds: e.clone(), children: c, items: [], level: i } : { bounds: e.clone(), children: null, items: s, level: i };
}
async function _t(s, e, t = {}) {
  if (s.length === 0) return null;
  const i = t.batchSize ?? 1200, r = t.yieldControl ?? (() => new Promise((y) => requestAnimationFrame(() => y())));
  let n = 0, o = 0;
  const a = /* @__PURE__ */ new Map(), c = [];
  for (let y = 0; y < s.length; y++) {
    const g = s[y];
    let M = a.get(g.geometry);
    M || (M = Wt(g.geometry), a.set(g.geometry, M)), c.push({
      ...g,
      geometry: M
    }), n += M.attributes.position.count, M.index && (o += M.index.count), y > 0 && y % i === 0 && await r();
  }
  const u = new d.BatchedMesh(c.length, n, o, e);
  u.frustumCulled = !1, u.perInstanceFrustumCulling = !1;
  const l = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
  for (let y = 0; y < c.length; y++) {
    const g = c[y];
    let M = l.get(g.geometry);
    if (M === void 0 && (M = u.addGeometry(g.geometry), l.set(g.geometry, M)), M !== -1) {
      const x = u.addInstance(M);
      u.setMatrixAt(x, g.matrix), g.geometry.boundingBox || g.geometry.computeBoundingBox(), u.setBoundingBoxAt && u.setBoundingBoxAt(x, g.geometry.boundingBox);
      const b = new d.Color(g.color);
      u.setColorAt(x, b), g.expressID !== void 0 && h.set(x, g.expressID), f.set(x, g.uuid), p.set(x, g.color), m.set(x, g.geometry);
    }
    y > 0 && y % i === 0 && await r();
  }
  return u.userData.batchIdToExpressId = h, u.userData.batchIdToUuid = f, u.userData.batchIdToColor = p, u.userData.batchIdToGeometry = m, u.computeBoundingBox(), u.computeBoundingSphere(), u;
}
function st(s, e = []) {
  if (s.children)
    for (const t of s.children)
      st(t, e);
  else s.items.length > 0 && e.push(s);
  return e;
}
function Qt(s, e) {
  const t = Math.max(2, s), i = e === "smooth" ? 0.85 : e === "quality" ? 1.15 : 1, r = Math.max(20, Math.min(128, Math.floor(t * 10 * i))), n = Math.max(8, Math.min(48, Math.floor(t * 3 * i)));
  return {
    maxConcurrentChunkLoads: r,
    maxChunkLoadsPerFrame: n
  };
}
const rt = typeof window < "u" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
function Be(s, ...e) {
  rt && console.log(`[${s}]`, ...e);
}
function qt(s, ...e) {
  rt && console.warn(`[${s}]`, ...e);
}
function Xt(s, e) {
  let t = 2166136261;
  for (let o = 0; o < s.length; o++)
    t ^= s.charCodeAt(o), t = Math.imul(t, 16777619);
  const i = (t >>> 0) / 4294967295 * Math.PI * 2, r = (t >>> 9 & 1023) / 1023 * 2 - 1, n = Math.sqrt(Math.max(0, 1 - r * r));
  return e.set(Math.cos(i) * n, Math.sin(i) * n, r).normalize(), e;
}
async function Yt(s) {
  const e = await s.slice(0, 1024).arrayBuffer(), t = new DataView(e);
  return {
    magic: t.getUint32(0, !0),
    version: t.getUint32(4, !0),
    manifestOffset: t.getUint32(8, !0),
    manifestLength: t.getUint32(12, !0)
  };
}
async function jt(s, e) {
  const i = await s.slice(e.manifestOffset, e.manifestOffset + e.manifestLength).text();
  return JSON.parse(i);
}
function Zt(s) {
  if (s.rectElement) return s.rectElement;
  const e = document.createElement("div");
  return e.style.cssText = `
        position: fixed; border: 1px dashed #00aaff;
        background: rgba(0, 170, 255, 0.08); pointer-events: none; z-index: 1000;
    `, document.body.appendChild(e), s.rectElement = e, e;
}
function nt(s) {
  const e = Zt(s);
  e.style.left = `${Math.min(s.startX, s.endX)}px`, e.style.top = `${Math.min(s.startY, s.endY)}px`, e.style.width = `${Math.abs(s.endX - s.startX)}px`, e.style.height = `${Math.abs(s.endY - s.startY)}px`;
}
function Kt() {
  return {
    active: !1,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    rectElement: null
  };
}
function Jt(s, e, t) {
  const i = {
    ...s,
    active: !0,
    startX: e,
    startY: t,
    endX: e,
    endY: t
  };
  return nt(i), { state: i, needsRender: !0 };
}
function ei(s, e, t) {
  if (!s.active)
    return { state: s, needsRender: !1 };
  const i = {
    ...s,
    endX: e,
    endY: t
  };
  return nt(i), { state: i, needsRender: !0 };
}
function ot(s) {
  return s.rectElement && s.rectElement.remove(), {
    state: {
      ...s,
      active: !1,
      rectElement: null
    },
    needsRender: !0
  };
}
function ti(s, e, t) {
  if (!s.active)
    return {
      state: s,
      selected: [],
      needsRender: !1
    };
  const { state: i, needsRender: r } = ot(s), { startX: n, startY: o, endX: a, endY: c } = s, u = Math.abs(a - n), l = Math.abs(c - o);
  if (u < 5 || l < 5)
    return { state: i, selected: [], needsRender: r };
  const h = e.getBoundingClientRect(), f = (Math.min(n, a) - h.left) / h.width * 2 - 1, p = -(Math.max(o, c) - h.top) / h.height * 2 + 1, m = (Math.max(n, a) - h.left) / h.width * 2 - 1, y = -(Math.min(o, c) - h.top) / h.height * 2 + 1;
  return {
    state: i,
    selected: t(f, p, m, y),
    needsRender: r
  };
}
function Ae(s) {
  return `${s.nbimFileId || "local"}:${s.byteOffset || 0}:${s.byteLength || 0}`;
}
function Le(s) {
  return Number.isFinite(s?.byteOffset) && Number.isFinite(s?.byteLength) && s.byteLength > 0;
}
function at(s, e) {
  const t = s.filter((i) => i !== e);
  return t.push(e), t;
}
function ii(s) {
  const {
    chunkReadCache: e,
    chunkReadCacheOrder: t,
    cacheKey: i,
    buffer: r,
    chunkReadCacheSize: n
  } = s;
  e.set(i, r);
  let o = at(t, i);
  for (; o.length > n; ) {
    const a = o.shift();
    a && e.delete(a);
  }
  return o;
}
async function si(s) {
  const {
    chunk: e,
    nbimFiles: t,
    chunkReadCache: i,
    chunkReadCacheOrder: r,
    chunkReadCacheSize: n
  } = s, o = Ae(e), a = i.get(o);
  if (a)
    return {
      buffer: a.slice(0),
      chunkReadCacheOrder: at(r, o)
    };
  const c = t.get(e.nbimFileId);
  if (!c)
    throw new Error(`NBIM file not found for chunk: ${e.id}`);
  const u = await c.slice(e.byteOffset, e.byteOffset + e.byteLength).arrayBuffer();
  return {
    buffer: u,
    chunkReadCacheOrder: ii({
      chunkReadCache: i,
      chunkReadCacheOrder: r,
      cacheKey: o,
      buffer: u.slice(0),
      chunkReadCacheSize: n
    })
  };
}
function ri(s) {
  const {
    chunkIds: e,
    chunkPrefetchWindow: t,
    prefetchQueue: i,
    prefetchQueueSet: r,
    prefetchInFlight: n
  } = s;
  if (t <= 0)
    return i;
  const o = [...i];
  for (const a of e)
    r.has(a) || n.has(a) || (o.push(a), r.add(a));
  return o;
}
function ni(s) {
  const {
    visibleChunks: e,
    chunkPrefetchWindow: t,
    prefetchPaused: i,
    isCameraMoving: r,
    prefetchRoundRobinCursor: n,
    chunks: o,
    processingChunks: a,
    chunkReadCache: c,
    getChunkIndex: u
  } = s;
  if (t <= 0 || i || r || e.length === 0)
    return {
      chunkIds: [],
      prefetchRoundRobinCursor: n
    };
  const l = [];
  for (let h = 0; h < e.length && l.length < t; h++) {
    const f = e[(n + h) % e.length], p = u(f.id);
    if (p < 0) continue;
    const m = o[p + 1];
    if (!m || m.loaded || a.has(m.id) || !m.nbimFileId || !Le(m)) continue;
    const y = Ae(m);
    c.has(y) || l.push(m.id);
  }
  return {
    chunkIds: l,
    prefetchRoundRobinCursor: n + 1
  };
}
function oi(s) {
  const { chunk: e, unregisterOptimizedMeshMapping: t, cacheChunkMesh: i, ensureChunkGhost: r } = s;
  if (!e.loaded || !e.mesh)
    return {
      changed: !1,
      chunkLoadedCountDelta: 0
    };
  const n = e.mesh;
  return t(n), n.parent && n.parent.remove(n), i(e, n), r(e), e.mesh = null, e.loaded = !1, {
    changed: !0,
    chunkLoadedCountDelta: -1
  };
}
async function ai(s) {
  const {
    chunk: e,
    sharedMaterial: t,
    takeCachedChunkMesh: i,
    yieldToMainThread: r,
    nbimFiles: n,
    hasValidChunkBinaryRange: o,
    readChunkBuffer: a,
    nbimMeta: c,
    runWorkerTask: u,
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
    return { mesh: await _t(e.node.items, t, {
      batchSize: 1200,
      yieldControl: () => r()
    }), prefetchCandidates: [] };
  if (e.nbimFileId && n.has(e.nbimFileId) && o(e)) {
    const M = await a(e), x = c.get(e.nbimFileId), b = x?.version ?? 8;
    if (b !== 8)
      throw new Error(`Unsupported NBIM version: ${b}. Only V8 is supported.`);
    const k = await u({
      buffer: M,
      version: b,
      originalUuid: e.originalUuid,
      bimIdTable: x?.bimIdTable
    }, [M]), C = l(k, t), w = [];
    if (!h && f > 0) {
      const P = p(e.id);
      if (P >= 0)
        for (let B = 1; B <= f; B++) {
          const R = m[P + B];
          if (!R) break;
          R.loaded || y.has(R.id) || !R.nbimFileId || !o(R) || w.push(R.id);
        }
    }
    return { mesh: C, prefetchCandidates: w };
  }
  return { mesh: null, prefetchCandidates: [] };
}
function ci(s) {
  const {
    chunk: e,
    mesh: t,
    cancelledChunkIds: i,
    chunkIdSet: r,
    disposeChunkMesh: n,
    globalOffset: o,
    contentGroup: a,
    registerOptimizedMeshMapping: c
  } = s;
  if (i.has(e.id) || !r.has(e.id))
    return n(t), { attached: !1 };
  t.name = e.id, t.userData.chunkId = e.id, t.userData.originalUuid = e.originalUuid, e.nbimFileId && (t.position.sub(o), t.updateMatrixWorld(!0));
  let u = a.getObjectByName(e.groupName);
  return u || (u = new d.Group(), u.name = e.groupName, u.userData.isOptimizedGroup = !0, u.userData.originalUuid = e.originalUuid, a.add(u)), u.add(t), e.mesh = t, c(t), { attached: !0 };
}
function hi(s) {
  const {
    chunk: e,
    loadedNow: t,
    now: i,
    chunkLoadedCount: r,
    chunkWarmupActive: n,
    initialChunkLoadTarget: o,
    deactivateFastPreviewForModel: a
  } = s;
  let c = r, u = n, l = !1;
  return t && !e.loaded && (e.loaded = !0, c++, e.lastVisibleAt = i, e.lastFocusAt = i, e.originalUuid && a(e.originalUuid), u && c >= o && (u = !1), l = !0), {
    nextChunkLoadedCount: c,
    nextChunkWarmupActive: u,
    progressChanged: l
  };
}
function li(s) {
  const { chunkId: e, ghostGroup: t, releaseGhostLine: i } = s, r = t.getObjectByName(`ghost_${e}`);
  return r ? (t.remove(r), i(r), { changed: !0 }) : { changed: !1 };
}
function ui(s) {
  const {
    isCameraMoving: e,
    loadedChunks: t,
    maxLoadedChunks: i,
    cameraPos: r,
    now: n,
    chunkResidencyMs: o
  } = s;
  if (e || t.length <= i)
    return [];
  const a = [...t].sort(
    (l, h) => h.center.distanceToSquared(r) - l.center.distanceToSquared(r)
  ), c = a.length - i, u = [];
  for (const l of a) {
    if (u.length >= c)
      break;
    const h = Math.max(l.lastVisibleAt || 0, l.lastFocusAt || 0);
    n - h < o || (!l.mesh || !l.mesh.visible) && u.push(l);
  }
  return u;
}
function di(s) {
  const {
    toLoad: e,
    now: t,
    chunkLoadResumeAt: i,
    maxConcurrentChunkLoads: r,
    processingChunkCount: n,
    chunkWarmupActive: o,
    chunkLoadedCount: a,
    initialChunkLoadTarget: c,
    warmupChunkBoost: u,
    getChunkFrameBudget: l,
    phase: h,
    profile: f
  } = s;
  if (e.length === 0 || t < i)
    return [];
  const p = [...e].sort((x, b) => b.priority - x.priority), m = r - n;
  if (m <= 0)
    return [];
  const y = o && a < c ? u : 0, g = l(h, f, y), M = Math.min(m, g, p.length);
  return p.slice(0, M);
}
function fi(s) {
  const { data: e, material: t, resolveUuidByBimId: i } = s, { geometries: r, instances: n, originalUuid: o } = e, a = r.some((b) => b.index && b.index.length > 0), c = r.map((b) => {
    const k = new d.BufferGeometry();
    if (k.setAttribute("position", new d.BufferAttribute(b.position, 3)), k.setAttribute("normal", new d.BufferAttribute(b.normal, 3)), b.index && b.index.length > 0)
      k.setIndex(new d.BufferAttribute(b.index, 1));
    else if (a) {
      const C = b.position.length / 3, w = new Uint32Array(C);
      for (let P = 0; P < C; P++)
        w[P] = P;
      k.setIndex(new d.BufferAttribute(w, 1));
    }
    return k;
  });
  let u = 0, l = 0;
  c.forEach((b) => {
    u += b.attributes.position.count, b.index && (l += b.index.count);
  });
  const h = new d.BatchedMesh(n.length, u, l, t);
  h.frustumCulled = !1, h.perInstanceFrustumCulling = !1;
  const f = c.map((b) => h.addGeometry(b)), p = new d.Matrix4(), m = new d.Color(), y = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map();
  return n.forEach((b) => {
    m.setHex(b.color), p.fromArray(b.matrix);
    const k = h.addInstance(f[b.geoIdx]);
    h.setMatrixAt(k, p), h.setColorAt(k, m);
    const C = c[b.geoIdx];
    C.boundingBox || C.computeBoundingBox(), C.boundingBox && h.setBoundingBoxAt && h.setBoundingBoxAt(k, C.boundingBox);
    const w = b.bimId;
    y.set(k, i(o, w)), g.set(k, w), M.set(k, b.color), x.set(k, C);
  }), h.userData.batchIdToUuid = y, h.userData.batchIdToBimId = g, h.userData.batchIdToColor = M, h.userData.batchIdToGeometry = x, h.computeBoundingBox(), h.computeBoundingSphere(), h;
}
async function pi(s) {
  const {
    prefetchPaused: e,
    isCameraMoving: t,
    prefetchQueue: i,
    prefetchQueueSet: r,
    prefetchInFlight: n,
    maxWorkers: o,
    getChunkById: a,
    chunkReadCache: c,
    readChunkBuffer: u,
    processQueue: l
  } = s;
  if (e || t || i.length === 0)
    return;
  const h = Math.max(1, Math.min(4, Math.floor(o / 2)));
  for (; !e && !t && i.length > 0 && n.size < h; ) {
    const f = i.shift();
    if (!f) break;
    r.delete(f);
    const p = a(f);
    if (!p || !p.nbimFileId || !Le(p))
      continue;
    const m = Ae(p);
    c.has(m) || (n.add(f), u(p).catch((y) => {
      qt("SceneManager/prefetch", `prefetch failed for ${f}`, y);
    }).finally(() => {
      n.delete(f), i.length > 0 && l();
    }));
  }
}
function mi(s) {
  const { mesh: e, sharedMaterial: t } = s;
  e.geometry && e.geometry.dispose(), e.material && e.material !== t && (Array.isArray(e.material) ? e.material : [e.material]).forEach((r) => r.dispose && r.dispose());
}
function ct(s, e) {
  return [...s.filter((t) => t !== e), e];
}
function gi(s) {
  const {
    chunk: e,
    mesh: t,
    chunkMeshCache: i,
    chunkCacheOrder: r,
    maxCachedChunks: n,
    disposeChunkMesh: o
  } = s;
  if (i.has(e.id)) {
    const c = i.get(e.id);
    c !== t && o(c);
  }
  i.set(e.id, t);
  let a = ct(r, e.id);
  for (; a.length > n; ) {
    const c = a.shift();
    if (!c) break;
    const u = i.get(c);
    u && (i.delete(c), o(u));
  }
  return {
    chunkMeshCache: i,
    chunkCacheOrder: a
  };
}
function yi(s) {
  const { chunkId: e, chunkMeshCache: t, chunkCacheOrder: i } = s, r = t.get(e) || null;
  return r ? (t.delete(e), {
    mesh: r,
    chunkCacheOrder: i.filter((n) => n !== e)
  }) : {
    mesh: null,
    chunkCacheOrder: i
  };
}
function Mi(s) {
  const { chunkMeshCache: e, chunkCacheOrder: t, disposeChunkMesh: i, filter: r } = s;
  for (const [n, o] of e.entries())
    r && !r(n, o) || (i(o), e.delete(n));
  return t.filter((n) => e.has(n));
}
function bi(s) {
  const { mesh: e, optimizedMapping: t } = s, i = e.userData.batchIdToUuid;
  if (i)
    for (const [r, n] of i.entries()) {
      const o = t.get(n);
      if (!o) continue;
      const a = o.findIndex((c) => c.mesh === e && c.instanceId === r);
      a !== -1 && o.splice(a, 1), o.length === 0 && t.delete(n);
    }
}
function ki(s) {
  const { mesh: e, optimizedMapping: t } = s, i = e.userData.batchIdToUuid, r = e.userData.batchIdToColor, n = e.userData.batchIdToGeometry;
  if (i)
    for (const [o, a] of i.entries()) {
      t.has(a) || t.set(a, []);
      const c = r?.get(o) ?? 16777215, u = n?.get(o);
      t.get(a).push({
        mesh: e,
        instanceId: o,
        originalColor: c,
        geometry: u
      });
    }
}
function Ci(s) {
  const { ghostMeshPool: e, ghostEdgesGeometry: t, ghostMaterial: i } = s, r = e.pop();
  return r ? (r.visible = !0, r) : new d.LineSegments(t, i);
}
function xi(s) {
  const { line: e, ghostMeshPool: t } = s;
  e.visible = !1, e.name = "", e.scale.set(1, 1, 1), e.position.set(0, 0, 0), e.material instanceof d.LineBasicMaterial && (e.material.opacity = 0.3), t.push(e);
}
function wi(s) {
  const { name: e, bounds: t, acquireGhostLine: i } = s, r = new d.Vector3(), n = new d.Vector3();
  t.getSize(r), t.getCenter(n);
  const o = i();
  return o.name = e, o.scale.copy(r), o.position.copy(n), o;
}
function Si(s) {
  const { chunk: e, ghostGroup: t, createGhostLine: i } = s;
  if (t.getObjectByName(`ghost_${e.id}`))
    return;
  const r = i(`ghost_${e.id}`, e.bounds);
  t.add(r);
}
function vi(s) {
  const { workerQueue: e, data: t, transferables: i, processQueue: r } = s;
  return new Promise((n, o) => {
    e.push({ resolve: n, reject: o, data: t, transferables: i }), r();
  });
}
function Bi(s) {
  const {
    activeWorkerCount: e,
    maxWorkers: t,
    workerQueue: i,
    workers: r,
    createWorker: n,
    getActiveWorkerCount: o,
    onActiveWorkerCountChange: a,
    processQueue: c
  } = s;
  if (e >= t || i.length === 0)
    return;
  const u = i.shift();
  a(e + 1);
  const l = r.pop() ?? n(), h = (p) => {
    l.removeEventListener("message", h), l.removeEventListener("error", f), r.push(l), a(Math.max(0, o() - 1)), p.data.type === "success" ? u.resolve(p.data.result) : u.reject(new Error(p.data.error)), c();
  }, f = (p) => {
    l.removeEventListener("message", h), l.removeEventListener("error", f), a(Math.max(0, o() - 1)), u.reject(new Error(p.message)), c();
  };
  l.addEventListener("message", h), l.addEventListener("error", f), l.postMessage(u.data, u.transferables);
}
function Ii(s) {
  const { workers: e, workerQueue: t, rejectReason: i } = s;
  for (const r of e)
    try {
      r.terminate();
    } catch (n) {
      console.warn("Worker terminate failed:", n);
    }
  t.length > 0 && t.splice(0, t.length).forEach((n) => n.reject(new Error(i)));
}
function Pi(s) {
  const { chunk: e, padding: t, tempSize: i } = s;
  if (!e.paddedBounds || e._padding !== t) {
    const r = e.bounds.getSize(i), n = e.bounds.clone();
    n.expandByVector(r.multiplyScalar(t)), e.paddedBounds = n, e._padding = t;
  }
  e.center || (e.center = e.bounds.getCenter(new d.Vector3()));
}
function Ri(s) {
  const {
    chunk: e,
    chunkIndex: t,
    totalChunks: i,
    now: r,
    phase: n,
    profile: o,
    performanceMode: a,
    isBoxClipped: c,
    maxRenderDistance: u,
    cameraPos: l,
    cameraForward: h,
    projScreenMatrix: f,
    toChunkDirection: p,
    tempCenterNdc: m,
    viewHeight: y,
    canvasHeight: g,
    sampleUnloadedWhileMoving: M,
    movingSampleStride: x,
    movingSampleSeed: b,
    resolveShouldRefreshPeripheral: k,
    chunkWarmupActive: C,
    chunkLoadedCount: w,
    initialChunkLoadTarget: P,
    chunkLoadResumeAt: B,
    chunkMeshCached: R
  } = s;
  p.copy(e.center).sub(l);
  const O = p.length(), D = O < u;
  if (M && !e.loaded && t % x !== b)
    return {
      shouldSkipSample: !0,
      shouldBeVisible: !1,
      effectiveVisible: !1,
      isPeripheralWhileMoving: !1,
      shouldRefreshPeripheral: !0,
      centerPriorityWindow: !1,
      isPeripheralCandidate: !1,
      priority: null,
      dist: O,
      centrality: 0,
      forwardness: 0,
      pixelSize: 0
    };
  const S = e.bounds.getSize(new d.Vector3()).length() / y * g, E = m.copy(e.center).applyMatrix4(f), N = Math.sqrt(E.x * E.x + E.y * E.y), v = 1 - Math.min(1, N), A = O > 1e-5 ? Math.max(0, h.dot(p.divideScalar(O))) : 1, U = S < 4, $ = n === "moving" && v < o.movingFocusCentralityThreshold && S < o.movingFocusPixelThreshold, F = s.inFrustum && !c && D && !U && !$, H = Math.max(e.lastVisibleAt || 0, e.lastFocusAt || 0), V = n === "moving" && s.inFrustum && !c && D && !U && r - H < o.chunkVisibilityHoldMs, G = v < o.movingCoreCentralityThreshold && S < o.movingCorePixelThreshold && A < o.movingCoreForwardThreshold, Z = k(G), ne = n === "moving" && G && !Z ? e.lastEffectiveVisible ?? e.mesh?.visible ?? !1 : F || V, te = C || r < B + o.centerPriorityWindowMs, ie = v < o.centerPriorityThreshold && A < o.forwardPriorityThreshold && S < 96;
  let K = null;
  if (!e.loaded && F) {
    const Q = v > 0.8 ? 4.5 : v > 0.62 ? 2.8 : 1, q = Math.min(8, S / 120), J = 1e3 / (O + 1), le = A * 550, W = R ? 420 : 0, _ = C && w < P ? v > 0.65 ? 1500 : v > 0.45 ? 500 : 0 : 0, ue = n === "moving" ? v > 0.65 || A > 0.7 ? 900 : v > 0.4 ? 250 : -250 : 0;
    n === "moving" && v < 0.08 && S < 18 || n === "moving" && G && !Z || n !== "moving" && te && ie || n === "moving" && a === "smooth" && v < 0.3 && S < 54 && A < 0.62 || (K = ue + W + _ + le + Q * 1e3 + q * 120 + J + v * 300);
  }
  return {
    shouldSkipSample: !1,
    shouldBeVisible: F,
    effectiveVisible: ne,
    isPeripheralWhileMoving: G,
    shouldRefreshPeripheral: Z,
    centerPriorityWindow: te,
    isPeripheralCandidate: ie,
    priority: K,
    dist: O,
    centrality: v,
    forwardness: A,
    pixelSize: S
  };
}
function Di(s) {
  const { now: e, total: t, loaded: i, lastReportedProgress: r, lastChunkProgressReportAt: n } = s, o = i !== r.loaded || t !== r.total, a = t === 0 || t > 0 && i >= t, c = e - n >= 48;
  return {
    shouldNotify: o && (c || a),
    nextProgress: { loaded: i, total: t },
    nextReportedAt: a || c ? e : n
  };
}
function Ai(s) {
  const { chunkCount: e, compact: t, balanced: i, massive: r } = s;
  return e > 2e3 ? r : e > 600 ? i : t;
}
function Li(s) {
  const {
    forceMaxChunkLoadSpeed: e,
    maxChunkLoadsPerFrame: t,
    performanceMode: i,
    chunkCount: r,
    phase: n,
    profile: o,
    warmupExtra: a
  } = s;
  if (e)
    return t + a;
  const c = r > 2e3, u = r > 600;
  if (n === "moving") {
    const l = Math.max(
      o.movingLoadBudgetMin,
      Math.min(o.movingLoadBudgetMax, Math.floor(t / 4))
    );
    return i === "smooth" ? c ? Math.max(1, Math.floor(l * 0.35)) : u ? Math.max(1, Math.floor(l * 0.5)) : Math.max(1, Math.floor(l * 0.7)) : c ? Math.max(1, Math.floor(l * 0.55)) : u ? Math.max(1, Math.floor(l * 0.75)) : l;
  }
  if (n === "recovery") {
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
function Oi(s) {
  const { centrality: e, pixelSize: t, forwardness: i, profile: r } = s;
  return e < r.movingCoreCentralityThreshold && t < r.movingCorePixelThreshold && i < r.movingCoreForwardThreshold;
}
function zi(s) {
  const {
    now: e,
    isCameraMoving: t,
    chunkIndex: i,
    totalChunks: r,
    profile: n,
    movingPeripheralCursor: o,
    movingPeripheralLastRefreshAt: a
  } = s;
  if (!t || r === 0)
    return {
      shouldRefresh: !0,
      movingPeripheralCursor: o,
      movingPeripheralLastRefreshAt: a
    };
  let c = o, u = a;
  if (e - u >= n.movingPeripheralRefreshMs) {
    const m = Math.min(
      r,
      Math.max(n.movingPeripheralMinBatchSize, Math.ceil(r * n.movingPeripheralBatchRatio))
    );
    c = (c + m) % r, u = e;
  }
  const l = Math.min(
    r,
    Math.max(n.movingPeripheralMinBatchSize, Math.ceil(r * n.movingPeripheralBatchRatio))
  ), h = c, f = h + l;
  return {
    shouldRefresh: f <= r ? i >= h && i < f : i >= h || i < f % r,
    movingPeripheralCursor: c,
    movingPeripheralLastRefreshAt: u
  };
}
const Ti = [16711680, 16711680, 65280, 65280, 255, 255];
function ht(s) {
  return s.map((e) => e.clone());
}
function re(s, e, t, i, r, n, o) {
  if (!s) return;
  const a = n && o;
  s.visible = a, s.scale.set(Math.max(i, 1e-3), Math.max(r, 1e-3), 1), s.position.copy(t), s.lookAt(t.clone().add(e)), s.children.forEach((c) => {
    c.visible = a;
  });
}
function Ui(s) {
  const e = [
    new d.Plane(new d.Vector3(1, 0, 0), 0),
    new d.Plane(new d.Vector3(-1, 0, 0), 0),
    new d.Plane(new d.Vector3(0, 1, 0), 0),
    new d.Plane(new d.Vector3(0, -1, 0), 0),
    new d.Plane(new d.Vector3(0, 0, 1), 0),
    new d.Plane(new d.Vector3(0, 0, -1), 0)
  ];
  s.renderer.clippingPlanes = [], s.clipHelpersGroup.clear();
  const t = Ti.map((i) => {
    const r = new d.PlaneGeometry(1, 1), n = new d.MeshBasicMaterial({
      color: i,
      transparent: !0,
      opacity: s.state.clipHelperOpacity,
      side: d.DoubleSide,
      depthWrite: !1,
      polygonOffset: !0,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
      clippingPlanes: []
    }), o = new d.Mesh(r, n);
    o.visible = !1, o.renderOrder = 9999;
    const a = new d.EdgesGeometry(r), c = new d.LineSegments(a, new d.LineBasicMaterial({
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
function Fi(s, e) {
  const t = {
    ...s.state,
    clippingPlanes: ht(s.state.clippingPlanes),
    clipPlaneHelpers: [...s.state.clipPlaneHelpers],
    clipHelperVisible: typeof e.visible == "boolean" ? e.visible : s.state.clipHelperVisible,
    clipHelperOpacity: typeof e.opacity == "number" && !Number.isNaN(e.opacity) ? d.MathUtils.clamp(e.opacity, 0.05, 0.35) : s.state.clipHelperOpacity
  };
  return t.clipPlaneHelpers.forEach((i) => {
    const r = i.material;
    r.opacity = t.clipHelperOpacity, r.needsUpdate = !0, i.children.forEach((n) => {
      const o = n.material;
      o && (o.opacity = Math.min(1, t.clipHelperOpacity + 0.08), o.needsUpdate = !0);
    });
  }), t.clipPlaneHelpers.forEach((i, r) => {
    const n = s.state.clippingPlanes[r], o = !!n && Number.isFinite(n.constant) && n.constant !== 1 / 0, a = t.clipHelperVisible && s.renderer.clippingPlanes.length > 0 && o;
    i.visible = a, i.children.forEach((c) => {
      c.visible = a;
    });
  }), { state: t, needsRender: !0 };
}
function Ei(s, e, t, i) {
  if (e.isEmpty())
    return { state: s.state, needsRender: !1 };
  const r = ht(s.state.clippingPlanes), n = [...s.state.clipPlaneHelpers], o = { ...s.state, clippingPlanes: r, clipPlaneHelpers: n }, { min: a, max: c } = e, u = c.clone().sub(a), l = a.x + t.x[0] / 100 * u.x, h = a.x + t.x[1] / 100 * u.x, f = a.y + t.y[0] / 100 * u.y, p = a.y + t.y[1] / 100 * u.y, m = a.z + t.z[0] / 100 * u.z, y = a.z + t.z[1] / 100 * u.z, g = s.renderer.clippingPlanes.length > 0, M = new d.Vector3(
    i.x ? l : a.x,
    i.y ? f : a.y,
    i.z ? m : a.z
  ), x = new d.Vector3(
    i.x ? h : c.x,
    i.y ? p : c.y,
    i.z ? y : c.z
  ), b = M.clone().add(x).multiplyScalar(0.5), k = x.clone().sub(M), C = 5e-4;
  return i.x ? (r[0].constant = -l, r[1].constant = h, re(
    n[0],
    new d.Vector3(1, 0, 0),
    new d.Vector3(l + C, b.y, b.z),
    k.z,
    k.y,
    g,
    o.clipHelperVisible
  ), re(
    n[1],
    new d.Vector3(-1, 0, 0),
    new d.Vector3(h - C, b.y, b.z),
    k.z,
    k.y,
    g,
    o.clipHelperVisible
  )) : (r[0].constant = 1 / 0, r[1].constant = 1 / 0, n[0] && (n[0].visible = !1), n[1] && (n[1].visible = !1)), i.y ? (r[2].constant = -f, r[3].constant = p, re(
    n[2],
    new d.Vector3(0, 1, 0),
    new d.Vector3(b.x, f + C, b.z),
    k.x,
    k.z,
    g,
    o.clipHelperVisible
  ), re(
    n[3],
    new d.Vector3(0, -1, 0),
    new d.Vector3(b.x, p - C, b.z),
    k.x,
    k.z,
    g,
    o.clipHelperVisible
  )) : (r[2].constant = 1 / 0, r[3].constant = 1 / 0, n[2] && (n[2].visible = !1), n[3] && (n[3].visible = !1)), i.z ? (r[4].constant = -m, r[5].constant = y, re(
    n[4],
    new d.Vector3(0, 0, 1),
    new d.Vector3(b.x, b.y, m + C),
    k.x,
    k.y,
    g,
    o.clipHelperVisible
  ), re(
    n[5],
    new d.Vector3(0, 0, -1),
    new d.Vector3(b.x, b.y, y - C),
    k.x,
    k.y,
    g,
    o.clipHelperVisible
  )) : (r[4].constant = 1 / 0, r[5].constant = 1 / 0, n[4] && (n[4].visible = !1), n[5] && (n[5].visible = !1)), { state: o, needsRender: !0 };
}
function Vi(s, e) {
  for (const t of s) {
    if (t.constant === 1 / 0) continue;
    const i = t.normal, r = new d.Vector3(
      i.x > 0 ? e.max.x : e.min.x,
      i.y > 0 ? e.max.y : e.min.y,
      i.z > 0 ? e.max.z : e.min.z
    );
    if (t.distanceToPoint(r) < 0)
      return !0;
  }
  return !1;
}
function Ie(s) {
  s.geometry?.dispose?.(), (s.material ? Array.isArray(s.material) ? s.material : [s.material] : []).forEach((t) => t?.dispose?.());
}
function Gi(s) {
  for (s.cancelDeferredStructureBuild(), s.clearLocateFocus(), s.animationFrameId !== null && cancelAnimationFrame(s.animationFrameId), s.onAnimationFrameDisposed(), s.logicTimer && clearInterval(s.logicTimer), Ii({
    workers: s.workers,
    workerQueue: s.workerQueue,
    rejectReason: "SceneManager disposed"
  }), s.onWorkersDisposed(), s.onQueuesReset(), s.onStateCachesReset(), s.clearChunkCache(); s.ghostGroup.children.length > 0; ) {
    const e = s.ghostGroup.children[0];
    s.ghostGroup.remove(e), s.releaseGhostLine(e);
  }
  s.controls.dispose(), Ie(s.selectionBox), Ie(s.highlightMesh), Ie(s.tempMarker), s.dotTexture.dispose(), s.sharedMaterial.dispose(), s.ghostEdgesGeometry.dispose(), s.ghostMaterial.dispose(), s.renderer.dispose();
}
function lt(s, e) {
  const t = new d.Matrix4();
  return e !== void 0 && s.isInstancedMesh ? (s.getMatrixAt(e, t), t) : t.copy(s.matrixWorld);
}
function qe(s, e, t) {
  const i = s.attributes.position, r = s.index, n = lt(e, t), o = new d.Vector3(), a = new d.Vector3(), c = new d.Vector3(), u = new d.Vector3();
  let l = 0;
  if (r)
    for (let h = 0; h < r.count; h += 3)
      o.fromBufferAttribute(i, r.getX(h)).applyMatrix4(n), a.fromBufferAttribute(i, r.getX(h + 1)).applyMatrix4(n), c.fromBufferAttribute(i, r.getX(h + 2)).applyMatrix4(n), l += o.dot(u.crossVectors(a, c)) / 6;
  else
    for (let h = 0; h < i.count; h += 3)
      o.fromBufferAttribute(i, h).applyMatrix4(n), a.fromBufferAttribute(i, h + 1).applyMatrix4(n), c.fromBufferAttribute(i, h + 2).applyMatrix4(n), l += o.dot(u.crossVectors(a, c)) / 6;
  return Math.abs(l);
}
function Xe(s, e, t) {
  const i = s.attributes.position, r = s.index, n = lt(e, t), o = new d.Vector3(), a = new d.Vector3(), c = new d.Vector3(), u = new d.Vector3(), l = new d.Vector3();
  let h = 0;
  if (r)
    for (let f = 0; f < r.count; f += 3)
      o.fromBufferAttribute(i, r.getX(f)).applyMatrix4(n), a.fromBufferAttribute(i, r.getX(f + 1)).applyMatrix4(n), c.fromBufferAttribute(i, r.getX(f + 2)).applyMatrix4(n), h += u.subVectors(a, o).cross(l.subVectors(c, o)).length() / 2;
  else
    for (let f = 0; f < i.count; f += 3)
      o.fromBufferAttribute(i, f).applyMatrix4(n), a.fromBufferAttribute(i, f + 1).applyMatrix4(n), c.fromBufferAttribute(i, f + 2).applyMatrix4(n), h += u.subVectors(a, o).cross(l.subVectors(c, o)).length() / 2;
  return h;
}
function Wi(s) {
  const { uuid: e, optimizedMapping: t, contentGroup: i } = s;
  let r = 0, n = 0;
  const o = t.get(e);
  if (o && o.length > 0)
    return o.forEach((c) => {
      c.geometry && (r += Xe(c.geometry, c.mesh, c.instanceId), n += qe(c.geometry, c.mesh, c.instanceId));
    }), { area: r, volume: n };
  const a = i.getObjectByProperty("uuid", e);
  if (a && a.isMesh) {
    const c = a;
    c.geometry && (r = Xe(c.geometry, c), n = qe(c.geometry, c));
  }
  return { area: r, volume: n };
}
function ye(s) {
  return s.replace(/\.[^./\\]+$/, "");
}
function ce(s) {
  return s.replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, " ").trim() || "model";
}
const Ni = /* @__PURE__ */ new Set(["", "n/a", "na", "undefined", "null", "-", "--"]);
function pe(...s) {
  for (const e of s) {
    if (e == null) continue;
    const t = String(e).trim();
    if (!Ni.has(t.toLowerCase()))
      return t;
  }
  return "";
}
function ut(s) {
  if (!s) return 0;
  let e = s.type === "Mesh" ? 1 : 0;
  if (s.children)
    for (const t of s.children)
      e += ut(t);
  return e;
}
function Ye(s) {
  if (!s || typeof s != "object") return;
  const e = {};
  return s.originalUuid !== void 0 && (e.originalUuid = String(s.originalUuid)), s.expressID !== void 0 && (e.expressID = s.expressID), s.modelID !== void 0 && (e.modelID = s.modelID), Object.keys(e).length > 0 ? e : void 0;
}
function Hi(s) {
  const e = /* @__PURE__ */ new Set(), t = (a, c) => {
    const u = a && a.trim() ? a.trim() : c;
    if (!e.has(u))
      return e.add(u), u;
    let l = 2;
    for (; e.has(`${u}_${l}`); ) l++;
    const h = `${u}_${l}`;
    return e.add(h), h;
  }, r = {
    id: t(s?.name, s?.id ?? "Root"),
    name: s?.name,
    type: s?.type,
    visible: s?.visible !== !1,
    children: []
  };
  s?.bimId !== void 0 && (r.bimId = s.bimId), s?.chunkId !== void 0 && (r.chunkId = s.chunkId);
  const n = Ye(s?.userData);
  n && (r.userData = n);
  const o = [{ src: s, dst: r }];
  for (; o.length > 0; ) {
    const { src: a, dst: c } = o.pop(), u = Array.isArray(a?.children) ? a.children : [];
    for (const l of u) {
      const f = {
        id: t(l?.name, l?.id ?? "Node"),
        name: l?.name,
        type: l?.type,
        visible: l?.visible !== !1,
        children: []
      };
      l?.bimId !== void 0 && (f.bimId = l.bimId), l?.chunkId !== void 0 && (f.chunkId = l.chunkId);
      const p = Ye(l?.userData);
      p && (f.userData = p), c.children.push(f), o.push({ src: l, dst: f });
    }
  }
  return r;
}
function $i(s, e) {
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
function _i(s) {
  const e = [];
  s.children.forEach((o) => {
    if (o.userData?.isOptimizedGroup || o.name.startsWith("optimized_")) return;
    const a = (typeof o.userData?.modelName == "string" ? o.userData.modelName : "") || o.children?.[0]?.name || "" || o.name, c = ce(ye(a));
    e.push(c);
  });
  const t = Array.from(new Set(e));
  if (t.length === 1) return t[0];
  const i = /* @__PURE__ */ new Date(), r = (o) => String(o).padStart(2, "0");
  return `批量导出_${`${i.getFullYear()}${r(i.getMonth() + 1)}${r(i.getDate())}_${r(i.getHours())}${r(i.getMinutes())}${r(i.getSeconds())}`}`;
}
function Qi(s, e) {
  const t = Object.keys(s), i = /* @__PURE__ */ new Set();
  t.forEach((o) => {
    const a = o.indexOf("::");
    a > 0 && i.add(o.slice(0, a));
  });
  const r = i.size === 1 ? [...i][0] : e, n = /* @__PURE__ */ new Map();
  return i.size >= 1 ? i.size === 1 ? n.set(r, s) : t.forEach((o) => {
    const a = o.indexOf("::"), c = a > 0 ? o.slice(0, a) : e;
    n.has(c) || n.set(c, {}), n.get(c)[o] = s[o];
  }) : n.set(e, s), {
    defaultOwner: r,
    grouped: n
  };
}
function qi(s) {
  const { fileName: e, modelRootName: t, rootId: i } = s, r = new d.Group();
  r.name = `file_${i}`, r.userData.originalUuid = i;
  const n = ce(ye(e));
  return r.userData.modelName = ce(
    pe(t && t !== "Root" ? t : "", n, i) || n
  ), r;
}
function je(s) {
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
function dt(s) {
  return s == null ? "" : typeof s == "string" ? s.trim() : typeof s == "number" || typeof s == "boolean" ? String(s) : Array.isArray(s) ? s.map((e) => dt(e)).filter(Boolean).join(", ") : "";
}
function L(s, e, t, i, r, n) {
  const o = dt(i), a = String(e || "").trim(), c = String(t || "").trim();
  !a || !c || !o || s.push({
    group: a,
    key: c,
    rawKey: n,
    path: `${a}.${c}`,
    value: o,
    source: r
  });
}
function he(s, e, t, i, r = "") {
  if (!(!t || typeof t != "object")) {
    if (Array.isArray(t)) {
      t.forEach((n, o) => {
        if (n && typeof n == "object" && "key" in n) {
          L(
            s,
            e,
            String(n.key || ""),
            n.value,
            n.source || i,
            n.rawKey
          );
          return;
        }
        if (n && typeof n == "object") {
          he(s, e, n, i, `${r || "Item"}${o + 1}`);
          return;
        }
        L(s, e, `${r || "Item"}${o + 1}`, n, i);
      });
      return;
    }
    Object.entries(t).forEach(([n, o]) => {
      const a = r ? `${r}.${n}` : n;
      o !== null && typeof o == "object" && !Array.isArray(o) ? he(s, e, o, i, a) : L(s, e, a, o, i, n);
    });
  }
}
function Me(s) {
  const e = /* @__PURE__ */ new Map();
  return Object.values(s || {}).forEach((t) => {
    (t.rows || []).forEach((i) => {
      if (!i?.group || !i?.key) return;
      const r = i.path || `${i.group}.${i.key}`;
      e.has(r) || e.set(r, {
        group: i.group,
        key: i.key,
        path: r,
        rawKey: i.rawKey,
        count: 0
      }), e.get(r).count++;
    });
  }), Array.from(e.values()).sort((t, i) => t.path.localeCompare(i.path, "zh-Hans-CN"));
}
function Xi(s, e) {
  const t = [];
  return L(t, "基本信息", "UUID", s.id, "nbim"), L(t, "基本信息", "名称", s.name, "nbim"), L(t, "基本信息", "类型", s.type, "nbim"), L(t, "基本信息", "模型ID", e, "nbim"), L(t, "基本信息", "BIM_ID", s.bimId, "nbim"), L(t, "基本信息", "ExpressID", s.userData?.expressID, "nbim"), t;
}
async function ft(s) {
  const { rows: e, oldCompat: t, originalUuid: i, expressID: r, ifcApiByModel: n, ifcManagerByModel: o } = s;
  if (r == null || r === "") return;
  const a = Number(r);
  if (Number.isFinite(a)) {
    if (n.has(i))
      try {
        const { ifcApi: c, modelID: u } = n.get(i), l = c.GetLine(u, a);
        if (l) {
          const h = l.is_a || "", f = l.GlobalId?.value || "", p = l.Name?.value || "";
          t.ifcType = h, t.globalId = f, t.ifcName = p, L(e, "IFC 标识", "类型", h, "ifc", "is_a"), L(e, "IFC 标识", "GlobalId", f, "ifc", "GlobalId"), L(e, "IFC 标识", "名称", p, "ifc", "Name");
        }
      } catch {
      }
    if (o.has(i))
      try {
        const { ifcManager: c, modelID: u } = o.get(i), l = await c.getItemProperties(u, a), h = l?.rawGroups || l?.groups || null, f = l?.normalizedGroups || null;
        h && Object.keys(h).length > 0 && (t.ifcRawGroups = h), f && Object.keys(f).length > 0 && (t.ifcNormalizedGroups = f), f && Object.keys(f).length > 0 ? Object.entries(f).forEach(([p, m]) => {
          he(e, p, m, "ifc-normalized");
        }) : h && Object.keys(h).length > 0 && Object.entries(h).forEach(([p, m]) => {
          he(e, p, m, "ifc-raw");
        });
      } catch {
      }
  }
}
async function Yi(s) {
  const { structureRoot: e, ifcApiByModel: t, ifcManagerByModel: i } = s, r = {}, n = {}, o = [e];
  for (; o.length > 0; ) {
    const a = o.pop(), c = a.userData?.originalUuid ? String(a.userData.originalUuid) : "";
    if (a.bimId) {
      const u = `${c}::${a.bimId}`;
      if (!n[u]) {
        const l = Xi(a, c), h = { uuid: a.id, name: a.name };
        await ft({
          rows: l,
          oldCompat: h,
          originalUuid: c,
          expressID: a.userData?.expressID,
          ifcApiByModel: t,
          ifcManagerByModel: i
        }), r[u] = h, n[u] = {
          owner: c,
          bimId: String(a.bimId),
          uuid: String(a.id),
          name: String(a.name || ""),
          rows: l
        };
      }
    }
    if (a.children && a.children.length > 0)
      for (let u = a.children.length - 1; u >= 0; u--)
        o.push(a.children[u]);
  }
  return {
    bimProperties: r,
    bimPropertyDocs: n,
    propertyNameIndex: Me(n)
  };
}
function ji(s) {
  const e = String(s.uuid), t = {}, i = /* @__PURE__ */ new Set();
  return s.traverse((r) => {
    const n = r.userData?.expressID;
    if (n == null || n === "") return;
    const o = `${e}::${n}`;
    if (i.has(o)) return;
    i.add(o);
    const a = [];
    L(a, "基本信息", "UUID", r.uuid, "ifc-basic"), L(a, "基本信息", "名称", r.name, "ifc-basic"), L(a, "基本信息", "类型", r.type, "ifc-basic"), L(a, "基本信息", "模型ID", e, "ifc-basic"), L(a, "基本信息", "BIM_ID", n, "ifc-basic"), L(a, "基本信息", "ExpressID", n, "ifc-basic");
    const c = r.userData?.ifcType || r.userData?.ifcMetadata?.typeName || r.userData?.ifcMetadata?.category;
    L(a, "IFC 标识", "类型", c, "ifc-basic"), t[o] = {
      owner: e,
      bimId: String(n),
      uuid: r.uuid,
      name: String(r.name || n),
      rows: a
    };
  }), {
    bimPropertyDocs: t,
    propertyNameIndex: Me(t)
  };
}
async function Zi(s) {
  const { object: e, ifcApiByModel: t, ifcManagerByModel: i, onProgress: r } = s, n = {}, o = {}, a = String(e.uuid), c = [], u = /* @__PURE__ */ new Set();
  e.traverse((l) => {
    const h = l.userData?.expressID;
    if (h == null || h === "") return;
    const f = `${a}::${h}`;
    u.has(f) || (u.add(f), c.push(l));
  });
  for (let l = 0; l < c.length; l++) {
    const h = c[l], f = h.userData?.expressID, p = `${a}::${f}`, m = [], y = { uuid: h.uuid, name: h.name };
    L(m, "基本信息", "UUID", h.uuid, "ifc-object"), L(m, "基本信息", "名称", h.name, "ifc-object"), L(m, "基本信息", "类型", h.type, "ifc-object"), L(m, "基本信息", "模型ID", a, "ifc-object"), L(m, "基本信息", "BIM_ID", f, "ifc-object"), L(m, "基本信息", "ExpressID", f, "ifc-object");
    const g = h.userData?.ifcMetadata;
    g && typeof g == "object" && he(m, "IFC 元数据", g, "ifc-metadata"), await ft({
      rows: m,
      oldCompat: y,
      originalUuid: a,
      expressID: f,
      ifcApiByModel: t,
      ifcManagerByModel: i
    }), n[p] = y, o[p] = {
      owner: a,
      bimId: String(f),
      uuid: h.uuid,
      name: h.name || String(f),
      rows: m
    }, l > 0 && l % 120 === 0 && (r?.(l, c.length), await new Promise((M) => setTimeout(M, 0)));
  }
  return r?.(c.length, c.length), {
    bimProperties: n,
    bimPropertyDocs: o,
    propertyNameIndex: Me(o)
  };
}
function Ki(s, e) {
  const t = new DataView(s);
  let i = 0;
  const r = t.getUint32(i, !0);
  i += 4;
  const n = [];
  for (let u = 0; u < r; u++) {
    const l = t.getUint32(i, !0);
    i += 4;
    const h = t.getUint32(i, !0);
    i += 4;
    const f = new Float32Array(s, i, l * 3);
    i += l * 12;
    const p = new Float32Array(s, i, l * 3);
    i += l * 12;
    const m = new d.BufferGeometry();
    if (m.setAttribute("position", new d.BufferAttribute(new Float32Array(f), 3)), m.setAttribute("normal", new d.BufferAttribute(new Float32Array(p), 3)), h > 0) {
      const y = new Uint32Array(s, i, h);
      i += h * 4, m.setIndex(new d.BufferAttribute(new Uint32Array(y), 1));
    }
    n.push(m);
  }
  const o = t.getUint32(i, !0);
  i += 4;
  const a = new d.Matrix4(), c = [];
  for (let u = 0; u < o; u++) {
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
      geometry: n[p]
    });
  }
  return c;
}
async function Ji(s) {
  const {
    chunks: e,
    nbimFiles: t,
    nbimMeta: i,
    bimIdToIndex: r,
    hasValidChunkBinaryRange: n,
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
  let u = 1024;
  for (let l = 0; l < e.length; l++) {
    const h = e[l], f = c[l];
    let p = null;
    if (h.node)
      p = o(h.node.items, r);
    else if (h.nbimFileId && t.has(h.nbimFileId) && n(h)) {
      const g = await t.get(h.nbimFileId).slice(h.byteOffset, h.byteOffset + h.byteLength).arrayBuffer(), M = i.get(h.nbimFileId), x = M?.version ?? 8;
      if (x !== 8)
        throw new Error(`Unsupported NBIM version: ${x}. Only V8 is supported.`);
      const k = Ki(g, M?.bimIdTable || []).map((C) => ({
        uuid: "",
        bimId: C.bimId,
        typeIndex: C.typeIndex,
        color: C.color,
        matrix: C.matrix,
        geometry: C.geometry
      }));
      p = o(k, r);
    }
    if (!p)
      continue;
    const m = new Uint8Array(p);
    a.push(m), f.byteOffset = u, f.byteLength = m.byteLength, u += m.byteLength;
  }
  return {
    chunkBlobs: a,
    exportChunks: c,
    currentOffset: u
  };
}
function es(s) {
  const { globalBounds: e, precomputedBounds: t, sceneBounds: i, globalOffset: r } = s;
  if (!e)
    return {
      precomputedBounds: t,
      sceneBounds: i,
      globalOffset: r,
      initializedOffset: !1
    };
  const n = new d.Box3(
    new d.Vector3(e.min.x, e.min.y, e.min.z),
    new d.Vector3(e.max.x, e.max.y, e.max.z)
  );
  let o = !1;
  const a = r.clone();
  a.length() === 0 && (n.getCenter(a), o = !0);
  const c = t.clone();
  return c.isEmpty() ? c.copy(n) : c.union(n), {
    precomputedBounds: c,
    sceneBounds: c.clone(),
    globalOffset: a,
    initializedOffset: o
  };
}
function ts(s) {
  const { structureRoot: e, modelRoot: t } = s;
  return e.children || (e.children = []), t && (t.children && t.name === "Root" ? e.children.push(...t.children) : e.children.push(t)), e;
}
function is(s) {
  const { manifestStats: e, modelRoot: t, chunks: i } = s;
  return e || {
    meshes: ut(t),
    faces: 0,
    memory: parseFloat(((i || []).reduce((r, n) => r + (n.byteLength || 0), 0) / (1024 * 1024)).toFixed(2))
  };
}
function ss(s) {
  const { modelRoot: e, defaultOwner: t, nodeMap: i, bimIdToNodeIds: r } = s;
  if (!e) return;
  const n = (o) => {
    o.userData || (o.userData = {});
    const a = o.userData?.originalUuid ? String(o.userData.originalUuid) : t;
    if (o.userData.originalUuid = a, i.has(o.id) || i.set(o.id, []), i.get(o.id).push(o), o.bimId) {
      const c = `${a}::${o.bimId}`;
      r.has(c) || r.set(c, []), r.get(c).push(o.id);
    }
    o.children && o.children.forEach(n);
  };
  n(e);
}
async function rs(s) {
  const {
    chunkEntries: e,
    globalOffset: t,
    chunkPadding: i,
    rootId: r,
    fileId: n,
    immediateGhostLimit: o,
    registrationBatchSize: a,
    onProgress: c,
    registerChunk: u,
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
    const M = new d.Box3(
      new d.Vector3(g.bounds.min.x, g.bounds.min.y, g.bounds.min.z),
      new d.Vector3(g.bounds.max.x, g.bounds.max.y, g.bounds.max.z)
    );
    p && M.translate(p);
    const x = g.id, b = M.getCenter(new d.Vector3()), k = M.clone(), C = M.getSize(new d.Vector3()).multiplyScalar(i);
    if (k.expandByVector(C), u({
      id: x,
      bounds: M,
      paddedBounds: k,
      _padding: i,
      center: b,
      loaded: !1,
      byteOffset: g.byteOffset,
      byteLength: g.byteLength,
      nbimFileId: n,
      groupName: `optimized_${r}`,
      originalUuid: g.originalUuid ? String(g.originalUuid) : r
    }), y < o ? h(l(`ghost_${x}`, M)) : m.push({ chunkId: x, bounds: M }), (y + 1) % a === 0) {
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
function ns(s) {
  const { chunkCount: e, hasManifestStats: t, hasManifestChunks: i } = s;
  return {
    chunkWarmupActive: !0,
    initialChunkLoadTarget: e > 200 ? 44 : e > 80 ? 30 : 16,
    shouldEstimateStats: !t && i
  };
}
function os(s, e) {
  const t = s.nodeMap.get(e);
  return !t || t.length === 0 || t.some((i) => i.visible !== !1);
}
function pt(s, e, t) {
  return s.nodeMap.get(e)?.[0]?.name || t;
}
function mt(s) {
  let e = s;
  for (; e; ) {
    if (!e.visible) return !1;
    e = e.parent;
  }
  return !0;
}
function gt(s, e) {
  if (s.boundingBox || s.computeBoundingBox(), !s.boundingBox) return null;
  const t = s.boundingBox.clone().applyMatrix4(e);
  return t.isEmpty() ? null : t;
}
function as(s) {
  const e = s.userData || (s.userData = {}), t = s.matrixWorld.elements, i = `${t[12]},${t[13]},${t[14]},${t[0]},${t[5]},${t[10]}`, r = e.__rtWorldBoxCache;
  if (r && r.key === i) return r.box.clone();
  const n = gt(s.geometry, s.matrixWorld);
  return n && (e.__rtWorldBoxCache = { key: i, box: n.clone() }), n;
}
function cs(s, e, t, i) {
  const r = e.mesh.userData || (e.mesh.userData = {}), n = r.__rtInstanceBoxCache ||= /* @__PURE__ */ new Map(), o = `${s}:${e.instanceId}`, a = n.get(o);
  if (a) return a.clone();
  const c = gt(t, i);
  return c && n.set(o, c.clone()), c;
}
function Pe(s, e, t) {
  if (!mt(e) || !e.geometry || e.userData?.isIfcGridHelper || e.isBatchedMesh || e.userData?.isOptimized) return;
  e.updateMatrixWorld(!0);
  const i = as(e);
  if (!i) return;
  const r = `mesh:${e.uuid}`;
  t.set(r, {
    key: r,
    uuid: e.uuid,
    name: e.name || pt(s, e.uuid, e.uuid),
    object: e,
    geometry: e.geometry,
    matrixWorld: e.matrixWorld.clone(),
    box: i,
    type: "mesh"
  });
}
function yt(s, e, t, i) {
  if (!mt(t.mesh) || !os(s, e)) return;
  const r = t.geometry || t.mesh.geometry;
  if (!r) return;
  const n = new d.Matrix4();
  t.mesh.getMatrixAt(t.instanceId, n), n.premultiply(t.mesh.matrixWorld);
  const o = cs(e, t, r, n);
  if (!o) return;
  const a = `instance:${t.mesh.uuid}:${t.instanceId}`;
  i.set(a, {
    key: a,
    uuid: e,
    name: pt(s, e, e),
    object: t.mesh,
    geometry: r,
    matrixWorld: n.clone(),
    box: o,
    type: "instance",
    ownerUuid: e,
    batchedMesh: t.mesh,
    instanceId: t.instanceId,
    originalColor: t.originalColor
  });
}
function hs(s, e) {
  const t = /* @__PURE__ */ new Set(), i = e.filter(Boolean), r = /* @__PURE__ */ new Set();
  for (; i.length > 0; ) {
    const n = i.shift();
    if (!n || r.has(n)) continue;
    r.add(n), t.add(n);
    const o = s.nodeMap.get(n);
    if (o)
      for (const a of o) {
        const c = Array.isArray(a.children) ? a.children : [];
        for (const u of c)
          r.has(u.id) || i.push(u.id);
      }
  }
  return t;
}
function Mt(s, e) {
  const t = /* @__PURE__ */ new Map(), i = hs(s, Array.from(new Set(e.filter(Boolean))));
  return s.contentGroup.updateMatrixWorld(!0), i.forEach((r) => {
    const n = s.optimizedMapping.get(r);
    n && n.forEach((a) => yt(s, r, a, t));
    const o = s.contentGroup.getObjectByProperty("uuid", r);
    if (o) {
      if (o.isMesh) {
        Pe(s, o, t);
        return;
      }
      o.traverse((a) => {
        a !== o && a.isMesh && Pe(s, a, t);
      });
    }
  }), Array.from(t.values());
}
function ls(s) {
  const e = /* @__PURE__ */ new Map();
  return s.contentGroup.updateMatrixWorld(!0), s.contentGroup.traverse((t) => {
    t.isMesh && Pe(s, t, e);
  }), s.optimizedMapping.forEach((t, i) => {
    t.forEach((r) => yt(s, i, r, e));
  }), Array.from(e.values());
}
function me(s, e) {
  const t = new d.Box3();
  return Mt(s, e).forEach((i) => t.union(i.box)), t;
}
function us(s) {
  return new d.Color(s.highlightColor || "#ff9f1c");
}
function ds(s, e, t) {
  return new d.Color(t?.[s] || e.highlightColor || "#ff9f1c");
}
function bt(s, e) {
  const t = /* @__PURE__ */ new Set(), i = [...e], r = /* @__PURE__ */ new Set();
  for (; i.length > 0; ) {
    const n = i.shift();
    if (!n || r.has(n)) continue;
    r.add(n), t.add(n);
    const o = s.get(n);
    if (!(!o || o.length === 0)) {
      for (const a of o)
        if (!(!a.children || a.children.length === 0))
          for (const c of a.children)
            r.has(c.id) || i.push(c.id);
    }
  }
  return t;
}
function be(s) {
  for (const e of s)
    e.instanceColor && (e.instanceColor.needsUpdate = !0);
}
function Oe(s, e) {
  const t = /* @__PURE__ */ new Set();
  for (const i of e) {
    const r = s.optimizedMapping.get(i);
    r && r.forEach((n) => {
      n.mesh.setColorAt(n.instanceId, new d.Color(n.originalColor)), t.add(n.mesh);
    });
  }
  be(t);
}
function fs(s, e) {
  const t = us(s.settings), i = /* @__PURE__ */ new Set();
  for (const r of e) {
    const n = s.optimizedMapping.get(r);
    n && n.forEach((o) => {
      o.mesh.setColorAt(o.instanceId, t), i.add(o.mesh);
    });
  }
  be(i);
}
function kt(s, e) {
  if (s.selectionBox.visible = !1, s.highlightMesh.visible = !1, e.size === 0)
    return;
  const t = me(s, Array.from(e));
  if (!t.isEmpty()) {
    if (s.selectionBox.box.copy(t), !!(s.state.locateFocusUuid && e.has(s.state.locateFocusUuid))) {
      const l = Math.max(t.getSize(new d.Vector3()).length() * 0.048, 0.22);
      s.selectionBox.box.expandByScalar(l);
    }
    s.selectionBox.visible = !!s.settings.highlightShowBox;
  }
  const i = s.state.locateFocusUuid || s.state.lastSelectedUuid;
  if (!i) return;
  const r = s.optimizedMapping.get(i);
  if (r && r.length > 0) {
    s.highlightMesh.visible = !1;
    return;
  }
  const n = s.contentGroup.getObjectByProperty("uuid", i);
  if (!n || !n.isMesh) return;
  n.updateMatrixWorld(!0), s.highlightMesh.geometry = n.geometry;
  const o = new d.Vector3(), a = new d.Quaternion(), c = new d.Vector3();
  n.matrixWorld.decompose(o, a, c), c.multiplyScalar(1.035), s.highlightMesh.position.copy(o), s.highlightMesh.quaternion.copy(a), s.highlightMesh.scale.copy(c), s.highlightMesh.visible = !0;
}
function ps(s) {
  (Array.isArray(s) ? s : [s]).forEach((t) => t.dispose());
}
function ms(s) {
  s.locateObjectMaterialCache.forEach((e, t) => {
    const i = s.contentGroup.getObjectByProperty("uuid", t);
    i && (i.isMesh || i.isBatchedMesh) && (i.material = e);
  });
}
function gs(s) {
  const e = /* @__PURE__ */ new Set();
  s.locateDimmedInstances.forEach(({ mesh: t, instanceId: i, originalColor: r, originalVisible: n }) => {
    t.setColorAt(i, new d.Color(r)), t.setVisibleAt && t.setVisibleAt(i, n), e.add(t);
  }), be(e);
}
function Ct(s) {
  ms(s), gs(s), s.locateMaterialCache.forEach((e) => ps(e)), s.locateMaterialCache.clear(), s.locateObjectMaterialCache.clear(), s.locateDimmedInstances.clear();
}
function Ze(s, e) {
  s.clearClashPairHighlight();
  const t = Array.from(new Set(e.filter(Boolean))), i = bt(s.nodeMap, t);
  return s.state.locateResultSet.size > 0 || (Oe(s, Array.from(s.state.highlightedUuids).filter((n) => !i.has(n))), fs(s, Array.from(i).filter((n) => !s.state.highlightedUuids.has(n)))), s.state.highlightedUuids = i, s.state.lastSelectedUuid = e.length > 0 ? e[e.length - 1] : null, kt(s, i), { needsRender: !0 };
}
function xt(s) {
  return s.clearClashPairHighlight(), Oe(s, s.state.highlightedUuids), (s.locateObjectMaterialCache.size > 0 || s.locateDimmedInstances.size > 0 || s.locateMaterialCache.size > 0) && Ct(s), s.state.locateResultSet.clear(), s.state.locateFocusUuid = null, s.state.highlightedUuids = /* @__PURE__ */ new Set(), s.state.lastSelectedUuid = null, s.selectionBox.visible = !1, s.highlightMesh.visible = !1, { needsRender: !0 };
}
function Ke(s, e, t = null, i) {
  const r = Array.from(new Set(e.filter(Boolean)));
  if (r.length === 0)
    return xt(s);
  s.clearClashPairHighlight(), (s.locateObjectMaterialCache.size > 0 || s.locateDimmedInstances.size > 0 || s.locateMaterialCache.size > 0) && Ct(s);
  const n = bt(s.nodeMap, r), o = Array.from(n), a = new Set(s.state.highlightedUuids), c = i?.highlightColors, u = t && n.has(t) ? t : o[0] || null, l = Array.from(a).filter((m) => !n.has(m)), h = Array.from(n).filter((m) => !a.has(m)), f = new Set(h);
  s.state.locateFocusUuid && n.has(s.state.locateFocusUuid) && f.add(s.state.locateFocusUuid), u && n.has(u) && f.add(u), c && Object.keys(c).forEach((m) => {
    n.has(m) && f.add(m);
  }), Oe(s, l);
  const p = /* @__PURE__ */ new Set();
  return f.forEach((m) => {
    const y = s.optimizedMapping.get(m);
    if (!y) return;
    const g = ds(m, s.settings, c);
    y.forEach((M) => {
      M.mesh.setColorAt(M.instanceId, g), p.add(M.mesh);
    });
  }), be(p), s.state.locateResultSet = n, s.state.locateFocusUuid = u, s.state.highlightedUuids = n, s.state.lastSelectedUuid = u, kt(s, n), { needsRender: !0 };
}
function wt(s, e, t) {
  const i = new d.BufferGeometry().setAttribute(
    "position",
    new d.Float32BufferAttribute([s.x, s.y, s.z], 3)
  ), r = new d.PointsMaterial({
    color: 16711680,
    size: 8,
    map: t,
    transparent: !0,
    alphaTest: 0.5,
    depthTest: !1
  }), n = new d.Points(i, r);
  n.renderOrder = 999, e.add(n);
}
function Je(s, e) {
  const t = new d.BufferGeometry().setFromPoints(s), i = new d.LineBasicMaterial({ color: 16711680, depthTest: !1, linewidth: 2 }), r = new d.Line(t, i);
  r.renderOrder = 998, e.add(r);
}
function ys(s, e) {
  const t = document.createElement("canvas"), i = t.getContext("2d");
  if (!i) return new d.Sprite();
  const r = 48, n = 24;
  i.font = `Bold ${r}px "Segoe UI", Arial, sans-serif`;
  const o = i.measureText(s).width;
  t.width = o + n * 2, t.height = r + n, i.shadowColor = "rgba(0, 0, 0, 0.5)", i.shadowBlur = 10, i.fillStyle = "rgba(30, 30, 30, 0.9)";
  const a = 8, c = i;
  c.roundRect ? c.roundRect(5, 5, t.width - 10, t.height - 10, a) : i.rect(5, 5, t.width - 10, t.height - 10), i.fill(), i.shadowBlur = 0, i.strokeStyle = "#ff0000", i.lineWidth = 2, i.stroke(), i.font = `Bold ${r}px "Segoe UI", Arial, sans-serif`, i.fillStyle = "#ffffff", i.textAlign = "center", i.textBaseline = "middle", i.fillText(s, t.width / 2, t.height / 2);
  const u = new d.CanvasTexture(t);
  u.minFilter = d.LinearFilter, u.magFilter = d.LinearFilter;
  const l = new d.SpriteMaterial({
    map: u,
    depthTest: !1,
    sizeAttenuation: !1
  }), h = new d.Sprite(l);
  h.position.copy(e);
  const f = 0.5;
  return h.scale.set(f * (t.width / t.height), f, 1), h.renderOrder = 1001, h.userData = { type: "label" }, h;
}
function St(s, e) {
  e.previewLine && (s.measureGroup.remove(e.previewLine), e.previewLine = null), e.previewPolygon && (s.measureGroup.remove(e.previewPolygon), e.previewPolygon = null), s.tempMarker.visible = !1;
}
function vt(s, e = !0) {
  const t = {
    ...s.state,
    currentMeasurePoints: e ? [] : [...s.state.currentMeasurePoints]
  };
  St(s, t);
  for (let i = s.measureGroup.children.length - 1; i >= 0; i--) {
    const r = s.measureGroup.children[i];
    r.name.startsWith("measure_") || s.measureGroup.remove(r);
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
  St(s, t);
  const i = [...t.currentMeasurePoints];
  if (e && i.push(e), i.length < 2)
    return { state: t, needsRender: !0 };
  const r = new d.BufferGeometry().setFromPoints(i), n = new d.LineDashedMaterial({
    color: 16711680,
    dashSize: 5,
    gapSize: 2,
    depthTest: !1
  });
  return t.previewLine = new d.Line(r, n), t.previewLine.computeLineDistances(), t.previewLine.renderOrder = 998, s.measureGroup.add(t.previewLine), { state: t, needsRender: !0 };
}
function Ms(s, e, t) {
  const i = {
    ...s.state,
    currentMeasurePoints: [...s.state.currentMeasurePoints]
  };
  if (i.measureType === "none")
    return s.tempMarker.visible = !1, { state: i, needsRender: !1 };
  const r = s.getRayIntersects(e, t);
  if (!r)
    return s.tempMarker.visible = !1, i.previewLine && (i.previewLine.visible = !1), { state: i, needsRender: !0 };
  const n = r.point, o = s.tempMarker.geometry.attributes.position;
  return o.setXYZ(0, n.x, n.y, n.z), o.needsUpdate = !0, s.tempMarker.visible = !0, i.currentMeasurePoints.length === 0 ? { state: i, needsRender: !0 } : {
    state: ze(s, n).state,
    needsRender: !0
  };
}
function Bt(s) {
  const e = {
    ...s.state,
    currentMeasurePoints: [...s.state.currentMeasurePoints]
  }, t = `measure_${Date.now()}`, i = new d.Group();
  i.name = t, e.currentMeasurePoints.forEach((l) => wt(l, i, s.dotTexture));
  let r = "", n = "";
  const o = e.measureType, a = new d.Vector3();
  if (e.measureType === "dist") {
    const [l, h] = e.currentMeasurePoints, f = l.distanceTo(h), p = Math.abs(h.x - l.x), m = Math.abs(h.y - l.y), y = Math.abs(h.z - l.z);
    n = f.toFixed(3), r = `${n} (Δx:${p.toFixed(2)}, Δy:${m.toFixed(2)}, Δz:${y.toFixed(2)})`, Je(e.currentMeasurePoints, i), a.copy(l).add(h).multiplyScalar(0.5);
  } else if (e.measureType === "angle") {
    const [l, h, f] = e.currentMeasurePoints, p = l.clone().sub(h).normalize(), m = f.clone().sub(h).normalize();
    n = `${(p.angleTo(m) * (180 / Math.PI)).toFixed(2)}°`, r = n, Je(e.currentMeasurePoints, i), a.copy(h);
  } else {
    const [l] = e.currentMeasurePoints;
    n = `(${l.x.toFixed(2)}, ${l.y.toFixed(2)}, ${l.z.toFixed(2)})`, r = n, a.copy(l);
  }
  i.add(ys(n, a)), s.measureGroup.add(i), s.measureRecords.set(t, {
    id: t,
    type: o,
    val: r,
    group: i,
    modelUuid: e.currentMeasureModelUuid || void 0
  });
  const u = {
    ...vt(
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
    state: u,
    needsRender: !0,
    completed: { id: t, type: o, val: r }
  };
}
function bs(s, e, t) {
  if (s.state.measureType === "none")
    return { state: s.state, needsRender: !1, completed: null };
  const i = {
    ...s.state,
    currentMeasurePoints: [...s.state.currentMeasurePoints, e],
    currentMeasureModelUuid: t ?? s.state.currentMeasureModelUuid
  };
  return wt(e, s.measureGroup, s.dotTexture), i.measureType === "dist" && i.currentMeasurePoints.length === 2 || i.measureType === "angle" && i.currentMeasurePoints.length === 3 || i.measureType === "coord" ? Bt({ ...s, state: i }) : {
    state: ze({ ...s, state: i }).state,
    needsRender: !0,
    completed: null
  };
}
function ks(s, e) {
  return s.measureRecords.forEach((t, i) => {
    const r = i === e, n = r ? 65280 : 16711680;
    t.group.traverse((o) => {
      o instanceof d.Line || o instanceof d.LineLoop || o instanceof d.Points ? o.material.color.set(n) : o instanceof d.Sprite ? o.material.color.set(r ? 65280 : 16777215) : (o instanceof d.Mesh && o.material instanceof d.MeshBasicMaterial || o instanceof d.Box3Helper) && o.material.color.set(n);
    });
  }), {
    state: s.state,
    needsRender: !0
  };
}
function Cs(s, e, t) {
  const i = s.canvas.getBoundingClientRect();
  s.mouse.x = (e - i.left) / i.width * 2 - 1, s.mouse.y = -((t - i.top) / i.height) * 2 + 1, s.raycaster.setFromCamera(s.mouse, s.camera);
  const r = s.raycaster.params.Line?.threshold || 0;
  s.raycaster.params.Line && (s.raycaster.params.Line.threshold = 5);
  const n = s.raycaster.intersectObjects(s.measureGroup.children, !0);
  if (s.raycaster.params.Line && (s.raycaster.params.Line.threshold = r), n.length === 0)
    return null;
  let o = n[0].object;
  for (; o.parent && !o.name.startsWith("measure_"); )
    o = o.parent;
  return o.name.startsWith("measure_") ? o.name : null;
}
function xs(s) {
  const e = [];
  s.chunks.length > 0 && s.chunks.forEach((i) => {
    i.loaded && i.mesh && i.mesh.visible && e.push(i.mesh);
  });
  const t = (i, r) => {
    if (!(r > 10) && i.visible && !i.userData.chunkId) {
      if (i.isMesh || i.isBatchedMesh) {
        i.userData.isOptimized || e.push(i);
        return;
      }
      if (i.children.length !== 0)
        for (const n of i.children)
          t(n, r + 1);
    }
  };
  for (const i of s.contentGroup.children)
    i.userData.isOptimizedGroup || t(i, 0);
  return e;
}
function ws(s, e, t, i) {
  const n = s.nodeMap.get(i)?.[0], o = new d.Object3D();
  o.uuid = i, n && (o.name = n.name, o.type = n.type, o.isMesh = n.type === "Mesh"), o.getWorldPosition = (c) => {
    const u = new d.Matrix4();
    return e.getMatrixAt(t, u), u.premultiply(e.matrixWorld), c.setFromMatrixPosition(u);
  };
  const a = new d.Matrix4();
  return e.getMatrixAt(t, a), o.position.setFromMatrixPosition(a), o;
}
function It(s) {
  return s.interactableListValid ? {
    interactableList: s.interactableList,
    interactableListValid: !0
  } : {
    interactableList: xs(s),
    interactableListValid: !0
  };
}
function Ss(s, e, t) {
  const i = s.canvas.getBoundingClientRect();
  s.mouse.x = (e - i.left) / i.width * 2 - 1, s.mouse.y = -((t - i.top) / i.height) * 2 + 1, s.raycaster.setFromCamera(s.mouse, s.camera);
  const r = It(s), n = s.raycaster.intersectObjects(r.interactableList, !1);
  if (n.length === 0)
    return { intersect: null, state: r };
  const o = n[0];
  if (!o.object.isBatchedMesh)
    return { intersect: o, state: r };
  const a = o.object, c = o.batchId !== void 0 ? o.batchId : o.instanceId;
  if (c === void 0)
    return { intersect: o, state: r };
  const u = a.userData.batchIdToUuid?.get(c);
  if (!u)
    return { intersect: o, state: r };
  const l = s.contentGroup.getObjectByProperty("uuid", u);
  return o.object = l ?? ws(s, a, c, u), { intersect: o, state: r };
}
function vs(s, e, t, i, r) {
  const n = Math.min(e, i), o = Math.max(e, i), a = Math.min(t, r), c = Math.max(t, r), u = s.camera.projectionMatrix.clone(), l = new d.Matrix4(), h = o - n, f = c - a, p = h / 2, m = f / 2, y = (o + n) / 2, g = (c + a) / 2, M = new d.Matrix4().makeTranslation(-y, -g, 0), x = new d.Matrix4().makeScale(1 / p, 1 / m, 1);
  l.multiplyMatrices(x, M);
  const b = l.multiply(u), k = new d.Frustum(), C = s.camera.matrixWorldInverse, w = b.clone().multiply(C);
  k.setFromProjectionMatrix(w);
  const P = [], B = new d.Box3(), R = new d.Matrix4();
  for (const O of s.interactableList) {
    if (O.isBatchedMesh) {
      const D = O, z = D.userData.batchIdToUuid, S = D.userData.batchIdToGeometry;
      if (!z || !S) continue;
      for (const [E, N] of z)
        try {
          const v = S.get(E);
          if (!v) continue;
          D.getMatrixAt(E, R), R.premultiply(D.matrixWorld);
          const A = new d.Box3();
          v.boundingBox || v.computeBoundingBox(), A.copy(v.boundingBox).applyMatrix4(R), k.intersectsBox(A) && P.push(N);
        } catch {
        }
      continue;
    }
    B.setFromObject(O), k.intersectsBox(B) && P.push(O.uuid);
  }
  return P;
}
function Bs({
  uuid: s,
  nodeMap: e,
  bimIdToNodeIds: t
}) {
  const i = e.get(s);
  if (i && i.length > 0 && i[0].bimId)
    return i[0].bimId;
  for (const [r, n] of t.entries())
    if (n.includes(s)) {
      const o = r.split("::");
      return o.length > 1 ? o[1] : null;
    }
  return null;
}
function Pt(s, e) {
  for (const [t, i] of e.entries())
    if (t.endsWith(`::${s}`) && i.length > 0)
      return i[0];
  return null;
}
function Is(s, e, t) {
  return e.has(s) ? s : Pt(s, t) || s;
}
function Rt(s, e) {
  const t = e.get(s);
  return t && t.length > 0 ? t[0] : null;
}
function Dt({
  id: s,
  nodeMap: e,
  nbimPropsByOriginalUuid: t
}) {
  const i = Rt(s, e);
  if (!i || !i.bimId) return null;
  const r = i.userData?.originalUuid ? String(i.userData.originalUuid) : "";
  if (!r) return null;
  const n = t.get(r);
  return n ? {
    entry: n[`${r}::${i.bimId}`],
    node: i
  } : null;
}
function Ps(s) {
  const e = Dt(s);
  if (!e?.entry || typeof e.entry != "object") return e?.entry || null;
  const { ifcRawGroups: t, ifcNormalizedGroups: i, ...r } = e.entry;
  return r;
}
function Rs(s, e = "raw") {
  const t = Dt(s);
  if (!t?.entry || typeof t.entry != "object") return null;
  const i = t.entry.ifcRawGroups, r = t.entry.ifcNormalizedGroups;
  return e === "normalized" ? r || i || null : i || r || null;
}
function Ds(s) {
  let e = 0;
  const t = /* @__PURE__ */ new Set();
  return s.traverse((i) => {
    if (i.name === "__EdgesHelper" || !i.isMesh && !i.isBatchedMesh) return;
    const r = i;
    (Array.isArray(r.material) ? r.material : [r.material]).forEach((o) => {
      o && Object.values(o).forEach((a) => {
        if (!(a instanceof d.Texture) || t.has(a)) return;
        t.add(a);
        const c = a.image, u = c?.width || 0, l = c?.height || 0;
        u > 0 && l > 0 && (e += u * l * 4 / (1024 * 1024));
      });
    });
  }), parseFloat(e.toFixed(2));
}
function As(s) {
  const e = s.renderer.info.render.calls, t = Ds(s.contentGroup);
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
function Ls(s, e, t) {
  const i = (r) => {
    r.visible = t, r.children?.forEach(i);
  };
  e.children?.forEach(i), s.forEach((r) => {
    r.forEach((n) => {
      n.visible = t;
    });
  });
}
function Os(s, e) {
  s.forEach((t) => {
    t.forEach((i) => {
      i.mesh.setVisibleAt(i.instanceId, e);
    });
  });
}
function At(s, e) {
  if (!(s.name === "Helpers" || s.name === "Measure")) {
    if (s.isMesh && s.userData.isOptimized) {
      s.visible = !1;
      return;
    }
    s.visible = e;
  }
}
function Re(s, e) {
  let t = s?.parent;
  for (; t && t !== e; )
    t.visible = !0, t = t.parent;
}
function zs(s, e, t, i) {
  const r = [];
  if (s.has(e) && r.push(e), t)
    return t.traverse((n) => {
      s.has(n.uuid) && r.push(n.uuid);
    }), r;
  if (i && i.length > 0) {
    const n = (o) => {
      s.has(o.id) && r.push(o.id), o.children?.forEach(n);
    };
    n(i[0]);
  }
  return r;
}
function Lt(s, e, t) {
  e.visible = t, e.children?.forEach((r) => Lt(s, r, t)), s.get(e.id)?.forEach((r) => {
    r.visible = t;
  });
}
function et(s, e, t) {
  const i = s.get(e);
  i && i.forEach((r) => {
    r.mesh.setVisibleAt(r.instanceId, t);
  });
}
function Ot(s, e) {
  return Ls(s.nodeMap, s.structureRoot, e), Os(s.optimizedMapping, e), s.contentGroup.traverse((t) => {
    At(t, e);
  }), {
    needsBoundsUpdate: !0,
    needsExplodeRefresh: !0,
    needsRender: !0
  };
}
function De(s, e, t, i = !0) {
  const r = s.nodeMap.get(e);
  r?.forEach((a) => Lt(s.nodeMap, a, t));
  const n = s.contentGroup.getObjectByProperty("uuid", e);
  t && n && i && Re(n, s.scene);
  const o = t ? [] : zs(s.highlightedUuids, e, n, r);
  if (!n) {
    if (r && r.length > 0) {
      const a = (c) => {
        et(s.optimizedMapping, c.id, t), c.children?.forEach(a);
      };
      a(r[0]);
    }
    return {
      needsBoundsUpdate: !0,
      needsExplodeRefresh: !1,
      needsRender: !0,
      nextHighlightedUuids: o.length > 0 ? Array.from(new Set([...s.highlightedUuids].filter((a) => !o.includes(a)))) : void 0
    };
  }
  return n.traverse((a) => {
    a.name === "Helpers" || a.name === "Measure" || (At(a, t), et(s.optimizedMapping, a.uuid, t));
  }), {
    needsBoundsUpdate: !0,
    needsExplodeRefresh: !1,
    needsRender: !0,
    nextHighlightedUuids: o.length > 0 ? Array.from(new Set([...s.highlightedUuids].filter((a) => !o.includes(a)))) : void 0
  };
}
function Ts(s, e, t = {}) {
  if (e.length === 0)
    return {
      needsBoundsUpdate: !1,
      needsExplodeRefresh: !1,
      needsRender: !1
    };
  let i = new Set(s.highlightedUuids), r = !1;
  return e.forEach((n) => {
    const o = De(
      {
        ...s,
        highlightedUuids: i
      },
      n.uuid,
      n.visible,
      n.showParents ?? !0
    );
    o.nextHighlightedUuids && (i = new Set(o.nextHighlightedUuids)), r = r || o.needsRender;
  }), {
    needsBoundsUpdate: t.recomputeBounds ?? !0,
    needsExplodeRefresh: t.refreshExplode ?? !1,
    needsRender: r,
    nextHighlightedUuids: Array.from(i)
  };
}
function Us(s, e, t) {
  Ot(s, !1);
  const i = /* @__PURE__ */ new Set();
  return e.forEach((r) => {
    t(r, !0);
    const n = s.nodeMap.get(r);
    n && n.forEach((a) => {
      const c = (u) => {
        u.id !== r && t(u.id, !0), u.children?.forEach(c);
      };
      c(a);
    }), s.optimizedMapping.get(r)?.forEach((a) => {
      i.add(a.mesh);
    });
  }), i.forEach((r) => {
    r.visible = !0, Re(r, s.scene);
  }), e.forEach((r) => {
    const n = s.contentGroup.getObjectByProperty("uuid", r);
    n && Re(n, s.scene);
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
function tt(s) {
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
const Fs = 220, Es = 180;
class Ws {
  constructor(e, t = {}) {
    this.structureRoot = { id: "root", name: "Root", type: "Group", children: [] }, this.nodeMap = /* @__PURE__ */ new Map(), this.bimIdToNodeIds = /* @__PURE__ */ new Map(), this.lastSelectedUuid = null, this.highlightedUuids = /* @__PURE__ */ new Set(), this.locateFocusUuid = null, this.locateResultSet = /* @__PURE__ */ new Set(), this.locateMaterialCache = /* @__PURE__ */ new Map(), this.locateObjectMaterialCache = /* @__PURE__ */ new Map(), this.locateDimmedInstances = /* @__PURE__ */ new Map(), this.locateIsolationRestoreChanges = [], this.locateIsolationActive = !1, this.clashPairObjectMaterialCache = /* @__PURE__ */ new Map(), this.clashPairInstanceColorCache = /* @__PURE__ */ new Map(), this.clashPairUuids = /* @__PURE__ */ new Set(), this.highlightPulseColor = new d.Color("#ffffff"), this.explodeEnabled = !1, this.explodeStrength = 0, this.explodeCenter = new d.Vector3(), this.explodeMode = "radial", this.explodeObjectStates = /* @__PURE__ */ new Map(), this.explodeInstanceStates = /* @__PURE__ */ new Map(), this.explodeScratchUniform = new d.Vector3(), this.explodeScratchMix = new d.Vector3(), this.measureType = "none", this.currentMeasurePoints = [], this.currentMeasureModelUuid = null, this.previewLine = null, this.previewPolygon = null, this.measureRecords = /* @__PURE__ */ new Map(), this.boxSelectState = Kt(), this.clippingPlanes = [], this.clipPlaneHelpers = [], this.clipHelperVisible = !1, this.clipHelperOpacity = 0.12, this.sceneCenter = new d.Vector3(), this.globalOffset = new d.Vector3(), this.componentMap = /* @__PURE__ */ new Map(), this.optimizedMapping = /* @__PURE__ */ new Map(), this.settings = {
      ambientInt: 2,
      dirInt: 1,
      bgColor: "#edf0f3",
      viewCubeSize: 100,
      colorSpace: "srgb",
      toneMapping: "aces",
      exposure: 1,
      shadowQuality: "medium",
      adaptiveQuality: !0,
      minPixelRatio: 0.8,
      maxPixelRatio: 2,
      targetFps: 50,
      performanceMode: "balanced",
      highlightColor: "#ff9f1c",
      highlightShowBox: !1,
      backLightInt: 0.5,
      maxRenderDistance: 1e6
      // 增加默认渲染距离到 1km (针对 mm 单位)
    }, this.sceneBounds = new d.Box3(), this.cachedSceneSphere = new d.Sphere(), this.sceneSphereValid = !1, this.precomputedBounds = new d.Box3(), this.chunks = [], this.chunkIdSet = /* @__PURE__ */ new Set(), this.chunkById = /* @__PURE__ */ new Map(), this.chunkIndexById = /* @__PURE__ */ new Map(), this.processingChunks = /* @__PURE__ */ new Set(), this.cancelledChunkIds = /* @__PURE__ */ new Set(), this.frustum = new d.Frustum(), this.projScreenMatrix = new d.Matrix4(), this.logicTimer = null, this.nbimFiles = /* @__PURE__ */ new Map(), this.nbimMeta = /* @__PURE__ */ new Map(), this.nbimPropsByOriginalUuid = /* @__PURE__ */ new Map(), this.nbimPropertyDocsByOriginalUuid = /* @__PURE__ */ new Map(), this.nbimSearchDocsByUuid = /* @__PURE__ */ new Map(), this.nbimPropertyNameIndex = /* @__PURE__ */ new Map(), this.nbimPropertyNameIndexVersion = 0, this.sharedMaterial = new d.MeshStandardMaterial({
      color: 14277857,
      roughness: 0.82,
      metalness: 0.03,
      side: d.DoubleSide
    }), this.interactableList = [], this.interactableListValid = !1, this._needsBoundsUpdate = !1, this.lastReportedProgress = { loaded: -1, total: -1 }, this.lastChunkProgressReportAt = 0, this.chunkLoadedCount = 0, this.chunkPadding = 0.2, this.maxConcurrentChunkLoads = 128, this.maxChunkLoadsPerFrame = 64, this.maxLoadedChunks = 512, this.maxCachedChunks = 48, this.chunkLoadingEnabled = !0, this.maxRenderDistance = 1e6, this._lastCullingTime = 0, this.chunkMeshCache = /* @__PURE__ */ new Map(), this.chunkCacheOrder = [], this.chunkReadCache = /* @__PURE__ */ new Map(), this.chunkReadCacheOrder = [], this.prefetchQueue = [], this.prefetchQueueSet = /* @__PURE__ */ new Set(), this.prefetchInFlight = /* @__PURE__ */ new Set(), this.prefetchRoundRobinCursor = 0, this.prefetchPaused = !1, this.originalStats = { meshes: 0, faces: 0, memory: 0 }, this.originalStatsByModel = /* @__PURE__ */ new Map(), this.workers = [], this.workerQueue = [], this.activeWorkerCount = 0, this.maxWorkers = 4, this.isCameraMoving = !1, this.activePixelRatio = 1, this.chunkLoadResumeAt = 0, this.cullingDirty = !0, this.deferredStructureThreshold = 2e4, this.octreeWorkerThreshold = 25e3, this.initialChunkLoadTarget = 18, this.warmupChunkBoost = 12, this.chunkWarmupActive = !1, this.chunkResidencyMs = 1800, this.chunkRuntimeProfiles = {
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
    }, this.movingPeripheralCursor = 0, this.movingPeripheralLastRefreshAt = 0, this.postMoveRecoveryUntil = 0, this.deferredStructureTimer = null, this.deferredStructureToken = 0, this.loadGeneration = 0, this.fastPreviewMeshLimit = 1200, this.fastPreviewModels = /* @__PURE__ */ new Set(), this.chunkCullingTempSize = new d.Vector3(), this.chunkCullingTempDirection = new d.Vector3(), this.chunkCullingTempForward = new d.Vector3(), this.chunkCullingTempCenterNdc = new d.Vector3(), this.boundsScanBatchSize = 2400, this.chunkRegistrationBatchSize = 18, this.chunkGhostBatchSize = 24, this.animationFrameId = null, this.cameraFlightFrameId = null, this.cameraFlightToken = 0, this.animateFramePending = !1, this.disposed = !1, this.interactionShadowDowngraded = !1, this.interactionShadowRestoreAt = 0, this.interactionShadowRestoreDelayMs = 220, this.cullingScanCursor = 0, this.cullingTimeBudgetMovingMs = 4.5, this.cullingTimeBudgetRecoveryMs = 6, this.cullingTimeBudgetIdleMs = 9, this.forceMaxChunkLoadSpeed = !0, this.ghostMeshPool = [], this.animate = () => {
      if (this.disposed) return;
      this.animateFramePending = !1, this.animationFrameId = null;
      const h = performance.now();
      this.controls && this.controls.update(), this.updateInteractionPerformance(h), this.updateAdaptiveQuality(), this._needsBoundsUpdate && (this.updateSceneBounds(), this._needsBoundsUpdate = !1), this.updateCameraClipping();
      const f = performance.now(), p = this.getChunkRuntimeProfile(), m = this.getChunkRenderPhase(f), y = this.cullingDirty ? m === "moving" ? p.movingCullingIntervalMs : m === "recovery" ? p.recoveryCullingIntervalMs : Math.min(p.recoveryCullingIntervalMs, 70) : p.idleCullingIntervalMs;
      (!this._lastCullingTime || f - this._lastCullingTime > y) && (this.checkCullingAndLoad(f), this._lastCullingTime = f, this.cullingDirty = !1);
      const g = this.highlightMesh.material;
      if (g)
        if (this.locateFocusUuid && this.highlightMesh.visible) {
          const C = new d.Color(this.settings.highlightColor || "#ff9f1c"), w = 0.22 + (Math.sin(h / 125) + 1) * 0.3;
          g.color.copy(C).lerp(this.highlightPulseColor, w), g.opacity = 1;
        } else
          g.color.set(this.settings.highlightColor || "#ff9f1c"), g.opacity = 1;
      const M = this.selectionBox.material;
      if (this.locateFocusUuid && this.selectionBox.visible && M && !Array.isArray(M)) {
        const C = new d.Color(this.settings.highlightColor || "#ff9f1c"), w = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(h / 125));
        M.color.copy(C).lerp(this.highlightPulseColor, 0.34 * w);
      } else M && !Array.isArray(M) && M.color.set(this.settings.highlightColor || "#ff9f1c");
      this.renderer.render(this.scene, this.camera);
      const x = this.chunkLoadingEnabled && this.chunks.length > 0 && this.chunkLoadedCount < this.chunks.length, b = !!(this.locateFocusUuid && (this.highlightMesh.visible || this.selectionBox.visible));
      (this.isCameraMoving || this.isInPostMoveRecovery(f) || this.processingChunks.size > 0 || this.chunkWarmupActive || x || b) && this.requestRender();
    }, this.canvas = e, this.options = t, this.resolvedChunkOptions = tt(t.chunkOptions), t.performancePreset && (this.settings.performanceMode = t.performancePreset);
    const i = e.clientWidth, r = e.clientHeight;
    this.dotTexture = this.createCircleTexture(), this.clock = new d.Clock(), this.initHardwareProfile(), this.ghostEdgesGeometry = new d.EdgesGeometry(new d.BoxGeometry(1, 1, 1)), this.ghostMaterial = new d.LineBasicMaterial({ color: 4674921, transparent: !0, opacity: 0.3 }), this.renderer = new d.WebGLRenderer({
      canvas: e,
      antialias: !0,
      alpha: !0,
      logarithmicDepthBuffer: !1,
      // 正交相机不建议开启对数深度缓冲区，会导致 negative near 裁剪问题
      precision: "highp",
      powerPreference: "high-performance"
    }), this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)), this.renderer.setSize(i, r, !1), this.renderer.setClearColor(this.settings.bgColor), this.renderer.localClippingEnabled = !0, this.renderer.outputColorSpace = d.SRGBColorSpace, this.renderer.toneMapping = d.ACESFilmicToneMapping, this.renderer.toneMappingExposure = 1.04, this.activePixelRatio = this.renderer.getPixelRatio(), this.scene = new d.Scene(), this.contentGroup = new d.Group(), this.contentGroup.name = "Content", this.scene.add(this.contentGroup), this.helpersGroup = new d.Group(), this.helpersGroup.name = "Helpers", this.scene.add(this.helpersGroup), this.measureGroup = new d.Group(), this.measureGroup.name = "Measure", this.scene.add(this.measureGroup), this.ghostGroup = new d.Group(), this.ghostGroup.name = "Ghost", this.scene.add(this.ghostGroup), this.clipHelpersGroup = new d.Group(), this.clipHelpersGroup.name = "ClipHelpers", this.scene.add(this.clipHelpersGroup);
    const n = 100, o = i / r;
    this.camera = new d.OrthographicCamera(
      n * o / -2,
      n * o / 2,
      n / 2,
      n / -2,
      -1e6,
      1e6
    ), this.camera.up.set(0, 0, 1), this.camera.position.set(1e3, -1e3, 1e3), this.camera.lookAt(0, 0, 0), this.controls = new Et(this.camera, e), this.controls.enableDamping = !1, this.controls.screenSpacePanning = !0, this.controls.maxPolarAngle = Math.PI, this.controls.mouseButtons = {
      LEFT: d.MOUSE.ROTATE,
      MIDDLE: d.MOUSE.PAN,
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
    }), this.ambientLight = new d.AmbientLight(16251131, this.settings.ambientInt), this.scene.add(this.ambientLight), this.dirLight = new d.DirectionalLight(16776438, this.settings.dirInt), this.dirLight.position.set(60, 45, 110), this.scene.add(this.dirLight), this.backLight = new d.DirectionalLight(15331062, this.settings.backLightInt ?? 0.5), this.backLight.position.set(-40, -35, 30), this.scene.add(this.backLight);
    const a = new d.Box3(new d.Vector3(), new d.Vector3());
    this.selectionBox = new d.Box3Helper(a, new d.Color(16776960)), this.selectionBox.visible = !1, this.helpersGroup.add(this.selectionBox);
    const c = new d.MeshBasicMaterial({
      color: this.settings.highlightColor,
      transparent: !1,
      opacity: 1,
      depthTest: !1,
      depthWrite: !1,
      side: d.BackSide
    });
    this.highlightMesh = new d.Mesh(new d.BufferGeometry(), c), this.highlightMesh.visible = !1, this.highlightMesh.renderOrder = 999, this.helpersGroup.add(this.highlightMesh);
    const u = new d.BufferGeometry();
    u.setAttribute("position", new d.Float32BufferAttribute([0, 0, 0], 3));
    const l = new d.PointsMaterial({
      color: 16711680,
      size: 8,
      sizeAttenuation: !1,
      map: this.dotTexture,
      transparent: !0,
      alphaTest: 0.5,
      depthTest: !1
    });
    this.tempMarker = new d.Points(u, l), this.tempMarker.visible = !1, this.tempMarker.renderOrder = 1e3, this.helpersGroup.add(this.tempMarker), this.setupClipping(), this.raycaster = new d.Raycaster(), this.raycaster.params.Points.threshold = 10, this.raycaster.params.Line || (this.raycaster.params.Line = { threshold: 1 }), this.raycaster.params.Line.threshold = 2, this.mouse = new d.Vector2(), this.animate = this.animate.bind(this), this.markSceneDirty();
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
      needsCulling: r = !1,
      invalidateInteractables: n = !1
    } = e;
    n && (this.interactableListValid = !1), i && (this._needsBoundsUpdate = !0), r && (this.cullingDirty = !0), t && this.requestRender();
  }
  invalidateRender(e = {}) {
    this.markSceneDirty(e);
  }
  updateSettings(e) {
    this.settings = { ...this.settings, ...e }, this.applyHighlightSettings(), e.clip && this.setClipHelperOptions({
      visible: e.clip.helperVisible,
      opacity: e.clip.helperOpacity
    }), this.ambientLight.intensity = this.settings.ambientInt, this.dirLight.intensity = this.settings.dirInt, this.backLight.intensity = this.settings.backLightInt ?? 0.5, this.renderer.outputColorSpace = this.settings.colorSpace === "linear" ? d.LinearSRGBColorSpace : d.SRGBColorSpace, this.renderer.toneMapping = this.settings.toneMapping === "none" ? d.NoToneMapping : this.settings.toneMapping === "neutral" ? d.NeutralToneMapping : d.ACESFilmicToneMapping, this.renderer.toneMappingExposure = this.settings.exposure ?? 1, this.renderer.setClearColor(this.settings.bgColor), e.frustumCulling !== void 0 && this.contentGroup.traverse((t) => {
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
    return i && (i.beginPath(), i.arc(64 / 2, 64 / 2, 64 / 2 - 2, 0, 2 * Math.PI), i.fillStyle = "#ffffff", i.fill()), new d.CanvasTexture(t);
  }
  updateAdaptiveQuality() {
    if (!this.settings.adaptiveQuality) return;
    const e = window.devicePixelRatio || 1, t = Math.min(e, this.settings.minPixelRatio ?? 0.8), i = Math.min(e, this.settings.maxPixelRatio ?? 2), r = this.chunks.length, n = this.originalStats.meshes, o = this.settings.performanceMode ?? "balanced";
    let a = i;
    if (this.isCameraMoving) {
      const u = o === "quality" ? r > 3500 || n > 25e4 ? 0.68 : r > 1600 || n > 12e4 ? 0.76 : 0.84 : o === "smooth" ? r > 3500 || n > 25e4 ? 0.44 : r > 1600 || n > 12e4 ? 0.52 : 0.6 : r > 3500 || n > 25e4 ? 0.48 : r > 1600 || n > 12e4 ? 0.56 : 0.65;
      a = Math.max(t, i * u);
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
    const e = navigator, t = Math.max(2, e.hardwareConcurrency || 4), i = e.deviceMemory || 8, r = this.options.performancePreset ?? this.settings.performanceMode ?? "balanced", n = Qt(t, r);
    this.forceMaxChunkLoadSpeed ? (this.maxWorkers = Math.max(4, Math.min(12, t - 1)), this.maxConcurrentChunkLoads = Math.max(128, Math.min(192, this.maxWorkers * 24)), this.maxChunkLoadsPerFrame = Math.max(64, Math.min(128, this.maxWorkers * 14)), this.cullingTimeBudgetMovingMs = 7.5, this.cullingTimeBudgetRecoveryMs = 10.5, this.cullingTimeBudgetIdleMs = 14, this.chunkRegistrationBatchSize = 28, this.chunkGhostBatchSize = 40) : (this.maxWorkers = 4, this.maxConcurrentChunkLoads = n.maxConcurrentChunkLoads, this.maxChunkLoadsPerFrame = n.maxChunkLoadsPerFrame), this.maxLoadedChunks = i <= 4 ? 160 : i <= 8 ? 320 : 640, this.maxCachedChunks = i <= 4 ? 24 : i <= 8 ? 48 : 96, this.settings.targetFps = this.resolvedChunkOptions.targetMinFps;
  }
  collectObjectOverview(e) {
    let t = 0, i = 0, r = 0;
    return e.traverse((n) => {
      const o = n;
      !o.isMesh || !o.geometry || (t++, o.geometry.index ? i += o.geometry.index.count / 3 : o.geometry.attributes.position && (i += o.geometry.attributes.position.count / 3), r += Gt(o.geometry));
    }), {
      meshes: t,
      faces: Math.floor(i),
      memory: parseFloat(r.toFixed(2))
    };
  }
  async estimateNbimStats(e, t, i) {
    let r = 0, n = 0, o = 0;
    for (let a = 0; a < t.length; a++) {
      const c = t[a], u = await e.slice(c.byteOffset, c.byteOffset + c.byteLength).arrayBuffer(), l = new DataView(u);
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
      h += 4, r += m, o += c.byteLength / (1024 * 1024);
      for (let y = 0; y < m; y++) {
        h += 4, h += 4, h += 4, h += 64;
        const g = l.getUint32(h, !0);
        h += 4, n += p[g] || 0;
      }
      a > 0 && a % 8 === 0 && await this.yieldToMainThread();
    }
    return {
      meshes: r,
      faces: Math.floor(n),
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
    mi({
      mesh: e,
      sharedMaterial: this.sharedMaterial
    });
  }
  touchChunkCache(e) {
    this.chunkCacheOrder = ct(this.chunkCacheOrder, e);
  }
  cacheChunkMesh(e, t) {
    const i = gi({
      chunk: e,
      mesh: t,
      chunkMeshCache: this.chunkMeshCache,
      chunkCacheOrder: this.chunkCacheOrder,
      maxCachedChunks: this.maxCachedChunks,
      disposeChunkMesh: (r) => this.disposeChunkMesh(r)
    });
    this.chunkCacheOrder = i.chunkCacheOrder;
  }
  takeCachedChunkMesh(e) {
    const t = yi({
      chunkId: e,
      chunkMeshCache: this.chunkMeshCache,
      chunkCacheOrder: this.chunkCacheOrder
    });
    return this.chunkCacheOrder = t.chunkCacheOrder, t.mesh;
  }
  clearChunkCache(e) {
    this.chunkCacheOrder = Mi({
      chunkMeshCache: this.chunkMeshCache,
      chunkCacheOrder: this.chunkCacheOrder,
      disposeChunkMesh: (t) => this.disposeChunkMesh(t),
      filter: e
    });
  }
  hasValidChunkBinaryRange(e) {
    return Le(e);
  }
  async readChunkBuffer(e) {
    const t = await si({
      chunk: e,
      nbimFiles: this.nbimFiles,
      chunkReadCache: this.chunkReadCache,
      chunkReadCacheOrder: this.chunkReadCacheOrder,
      chunkReadCacheSize: this.resolvedChunkOptions.chunkReadCacheSize
    });
    return this.chunkReadCacheOrder = t.chunkReadCacheOrder, t.buffer;
  }
  enqueueChunkPrefetch(e) {
    this.prefetchQueue = ri({
      chunkIds: e,
      chunkPrefetchWindow: this.resolvedChunkOptions.chunkPrefetchWindow,
      prefetchQueue: this.prefetchQueue,
      prefetchQueueSet: this.prefetchQueueSet,
      prefetchInFlight: this.prefetchInFlight
    });
  }
  schedulePrefetchFromVisibleChunks(e) {
    const t = ni({
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
    await pi({
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
    bi({
      mesh: e,
      optimizedMapping: this.optimizedMapping
    });
  }
  registerOptimizedMeshMapping(e) {
    ki({
      mesh: e,
      optimizedMapping: this.optimizedMapping
    });
    const t = e.userData.batchIdToUuid;
    if (!t) return;
    let i = !1;
    t.forEach((r, n) => {
      const o = this.nodeMap.get(r);
      if (!o || o.length === 0) return;
      const a = o.some((c) => c.visible !== !1);
      e.setVisibleAt(n, a), i = !0;
    }), i && e.computeBoundingSphere?.();
  }
  acquireGhostLine() {
    return Ci({
      ghostMeshPool: this.ghostMeshPool,
      ghostEdgesGeometry: this.ghostEdgesGeometry,
      ghostMaterial: this.ghostMaterial
    });
  }
  releaseGhostLine(e) {
    xi({
      line: e,
      ghostMeshPool: this.ghostMeshPool
    });
  }
  createGhostLine(e, t) {
    return wi({
      name: e,
      bounds: t,
      acquireGhostLine: () => this.acquireGhostLine()
    });
  }
  ensureChunkGhost(e) {
    Si({
      chunk: e,
      ghostGroup: this.ghostGroup,
      createGhostLine: (t, i) => this.createGhostLine(t, i)
    });
  }
  attachStructureRoot(e) {
    e.name === "Root" && e.children && e.children.length > 0 ? (this.structureRoot.children || (this.structureRoot.children = []), this.structureRoot.children.push(...e.children)) : (this.structureRoot.children || (this.structureRoot.children = []), this.structureRoot.children.push(e));
  }
  replaceStructureNode(e, t) {
    const i = (r) => {
      for (let n = 0; n < r.length; n++) {
        if (r[n].id === e)
          return r[n] = t, !0;
        if (r[n].children && i(r[n].children)) return !0;
      }
      return !1;
    };
    this.structureRoot.children && i(this.structureRoot.children);
  }
  buildAndRegisterModelStructure(e) {
    let t;
    e.userData.isIFC ? t = this.buildIFCStructure(e) : t = this.buildSceneGraph(e);
    const i = (n) => {
      n.userData || (n.userData = {}), n.userData.originalUuid = e.uuid, n.children && n.children.forEach(i);
    };
    i(t);
    const r = (n) => {
      if (n.bimId) {
        const o = `${e.uuid}::${n.bimId}`;
        this.bimIdToNodeIds.has(o) || this.bimIdToNodeIds.set(o, []), this.bimIdToNodeIds.get(o).push(n.id);
      }
      n.children && n.children.forEach(r);
    };
    return r(t), t;
  }
  async yieldToMainThread() {
    await new Promise((e) => requestAnimationFrame(() => e()));
  }
  createPreviewGhost(e, t) {
    const i = this.createGhostLine(t, e);
    return i.material instanceof d.LineBasicMaterial && (i.material.opacity = 0.45), this.ghostGroup.add(i), i;
  }
  async computeItemBoundsProgressively(e, t) {
    const i = new d.Box3(), r = new d.Vector3(), n = new d.Vector3(), o = new d.Vector3();
    for (let a = 0; a < e.length; a += this.boundsScanBatchSize) {
      const c = Math.min(e.length, a + this.boundsScanBatchSize);
      for (let u = a; u < c; u++) {
        const l = e[u], h = l.center;
        let f = 0;
        const p = l.geometry;
        if (p.boundingSphere || p.computeBoundingSphere(), p.boundingSphere) {
          o.setFromMatrixScale(l.matrix);
          const m = Math.max(o.x, o.y, o.z);
          f = p.boundingSphere.radius * m;
        }
        r.set(h.x - f, h.y - f, h.z - f), n.set(h.x + f, h.y + f, h.z + f), i.expandByPoint(r), i.expandByPoint(n);
      }
      t && e.length > 0 && t(20 + Math.min(12, Math.floor(c / e.length * 12)), "正在统计大模型范围..."), c < e.length && await this.yieldToMainThread();
    }
    return i.min.subScalar(0.1), i.max.addScalar(0.1), i;
  }
  async createChunkGhostsProgressively(e) {
    if (e.length !== 0)
      for (let t = 0; t < e.length; t += this.chunkGhostBatchSize) {
        const i = Math.min(e.length, t + this.chunkGhostBatchSize);
        let r = !1;
        for (let n = t; n < i; n++) {
          const o = e[n], a = this.getChunkById(o.chunkId);
          if (!a || a.loaded || this.cancelledChunkIds.has(o.chunkId) || this.ghostGroup.getObjectByName(`ghost_${o.chunkId}`)) continue;
          const c = this.createGhostLine(`ghost_${o.chunkId}`, o.bounds);
          this.ghostGroup.add(c), r = !0;
        }
        r && this.markSceneDirty(), i < e.length && await this.yieldToMainThread();
      }
  }
  async registerLeafChunksProgressively(e, t, i) {
    const r = [];
    for (let n = 0; n < t.length; n += this.chunkRegistrationBatchSize) {
      const o = Math.min(t.length, n + this.chunkRegistrationBatchSize);
      for (let a = n; a < o; a++) {
        const c = t[a], u = `${e.uuid}_chunk_${a}`, l = c.bounds.clone();
        c.items.forEach((p) => {
          const m = this.nodeMap.get(p.uuid);
          m && m.forEach((y) => {
            y.bimId === void 0 && (y.bimId = y.id), y.chunkId = u;
          });
        });
        const h = l.clone(), f = l.getSize(new d.Vector3()).multiplyScalar(this.chunkPadding);
        h.expandByVector(f), this.registerChunk({
          id: u,
          bounds: l,
          paddedBounds: h,
          _padding: this.chunkPadding,
          center: l.getCenter(new d.Vector3()),
          loaded: !1,
          node: c,
          groupName: `optimized_${e.uuid}`,
          originalUuid: e.uuid
        }), r.push({ chunkId: u, bounds: l });
      }
      i && t.length > 0 && i(40 + Math.floor(o / t.length * 50), `正在生成分块... (${o}/${t.length})`), o < t.length && await this.yieldToMainThread();
    }
    return r;
  }
  async buildLeafPlans(e, t, i, r) {
    const n = this.resolvedChunkOptions.preferWorkerOctree ? 1200 : this.octreeWorkerThreshold;
    if (e.length < n) {
      const l = it(e, t, { maxItemsPerNode: i, maxDepth: r });
      return st(l).map((h) => ({
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
      maxDepth: r
    }, [o.buffer, a.buffer]), u = [];
    for (let l = 0; l < c.length; l++) {
      const h = c[l];
      u.push({
        bounds: new d.Box3(
          new d.Vector3(h.bounds[0], h.bounds[1], h.bounds[2]),
          new d.Vector3(h.bounds[3], h.bounds[4], h.bounds[5])
        ),
        level: h.level,
        items: Array.from(h.itemIndices, (f) => e[f])
      }), l > 0 && l % 120 === 0 && await this.yieldToMainThread();
    }
    return u;
  }
  updateCameraClipping() {
    if (!this.sceneBounds || this.sceneBounds.isEmpty()) return;
    this.sceneSphereValid || (this.sceneBounds.getBoundingSphere(this.cachedSceneSphere), this.sceneSphereValid = !0);
    const e = this.camera.position.distanceTo(this.cachedSceneSphere.center), t = Math.max(this.cachedSceneSphere.radius * 20, e + this.cachedSceneSphere.radius * 5), i = 0.01;
    (Math.abs(this.camera.far - t) / Math.max(this.camera.far, 1) > i || Math.abs(this.camera.near - -t) / Math.max(Math.abs(this.camera.near), 1) > i) && (this.camera.near = -t, this.camera.far = t, this.camera.updateProjectionMatrix());
  }
  resize(e, t) {
    if (!this.canvas) return;
    let i = e, r = t;
    if (i === void 0 || r === void 0) {
      const h = this.canvas.parentElement?.getBoundingClientRect() || this.canvas.getBoundingClientRect();
      i = h.width, r = h.height;
    }
    if (i = Math.max(1, i), r = Math.max(1, r), i === 0 || r === 0) return;
    const n = i / r, o = this.camera, c = (o.top - o.bottom) / 2, u = c * n;
    o.left = -u, o.right = u, o.top = c, o.bottom = -c, o.updateProjectionMatrix();
    const l = this.settings.adaptiveQuality ? Math.min(window.devicePixelRatio, this.settings.maxPixelRatio ?? 2) : Math.min(window.devicePixelRatio, 2);
    this.activePixelRatio = l, this.renderer.setPixelRatio(l), this.renderer.setSize(i, r, !1), this.controls && this.controls.update(), this.markSceneDirty({ needsCulling: !0 });
  }
  reportChunkProgress() {
    const e = Di({
      now: performance.now(),
      total: this.chunks.length,
      loaded: this.chunkLoadedCount,
      lastReportedProgress: this.lastReportedProgress,
      lastChunkProgressReportAt: this.lastChunkProgressReportAt
    });
    this.onChunkProgress && e.shouldNotify && (this.lastReportedProgress = e.nextProgress, this.lastChunkProgressReportAt = e.nextReportedAt, this.onChunkProgress(e.nextProgress.loaded, e.nextProgress.total));
  }
  getChunkRuntimeProfile(e = this.chunks.length) {
    return Ai({
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
    e && (e.color.set(this.settings.highlightColor || "#ff9f1c"), e.transparent = !1, e.opacity = 1, e.depthTest = !1, e.depthWrite = !1, e.side = d.BackSide, e.needsUpdate = !0);
    const t = this.selectionBox.material;
    Array.isArray(t) ? t.forEach((i) => i.color.set(this.settings.highlightColor || "#ff9f1c")) : t && t.color.set(this.settings.highlightColor || "#ff9f1c");
  }
  getChunkRenderPhase(e) {
    return this.isCameraMoving ? "moving" : this.isInPostMoveRecovery(e) ? "recovery" : "idle";
  }
  getChunkFrameBudget(e, t, i) {
    return Li({
      forceMaxChunkLoadSpeed: this.forceMaxChunkLoadSpeed,
      maxChunkLoadsPerFrame: this.maxChunkLoadsPerFrame,
      performanceMode: this.settings.performanceMode ?? "balanced",
      chunkCount: this.chunks.length,
      phase: e,
      profile: t,
      warmupExtra: i
    });
  }
  isMovingPeripheralChunk(e, t, i, r) {
    return Oi({
      centrality: e,
      pixelSize: t,
      forwardness: i,
      profile: r
    });
  }
  shouldRefreshPeripheralChunk(e, t, i, r) {
    const n = zi({
      now: e,
      isCameraMoving: this.isCameraMoving,
      chunkIndex: t,
      totalChunks: i,
      profile: r,
      movingPeripheralCursor: this.movingPeripheralCursor,
      movingPeripheralLastRefreshAt: this.movingPeripheralLastRefreshAt
    });
    return this.movingPeripheralCursor = n.movingPeripheralCursor, this.movingPeripheralLastRefreshAt = n.movingPeripheralLastRefreshAt, n.shouldRefresh;
  }
  checkCullingAndLoad(e = performance.now()) {
    if (!this.chunkLoadingEnabled || this.chunks.length === 0 || (this.reportChunkProgress(), this.processingChunks.size >= this.maxConcurrentChunkLoads)) return;
    const t = this.getChunkRuntimeProfile(), i = this.getChunkRenderPhase(e), r = this.settings.performanceMode ?? "balanced";
    this.camera.updateMatrixWorld(), this.projScreenMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse), this.frustum.setFromProjectionMatrix(this.projScreenMatrix);
    const n = this.chunkPadding, o = this.camera.position, a = this.chunkCullingTempForward;
    this.camera.getWorldDirection(a);
    const c = this.chunkCullingTempDirection, u = this.chunkCullingTempSize, l = this.chunkCullingTempCenterNdc, h = (this.camera.top - this.camera.bottom) / this.camera.zoom, f = this.renderer.domElement.clientHeight, p = [], m = [], y = this.renderer.clippingPlanes.length > 0;
    let g = !1;
    const M = this.chunks.length, x = performance.now(), b = i === "moving" ? this.cullingTimeBudgetMovingMs : i === "recovery" ? this.cullingTimeBudgetRecoveryMs : this.cullingTimeBudgetIdleMs;
    let k = !1;
    const C = r !== "quality" && i === "moving" && M > 1800, w = C ? M > 5e3 ? 8 : M > 3e3 ? 6 : 4 : 1, P = C ? Math.floor(e / Math.max(1, t.movingPeripheralRefreshMs)) % w : 0, B = M > 0 ? this.cullingScanCursor % M : 0;
    for (let D = 0; D < M; D++) {
      const z = (B + D) % M, S = this.chunks[z];
      if ((D & 31) === 0 && performance.now() - x > b) {
        k = !0, this.cullingScanCursor = (z + 1) % M;
        break;
      }
      Pi({
        chunk: S,
        padding: n,
        tempSize: u
      });
      const E = this.frustum.intersectsBox(S.paddedBounds), N = y && this.isBoxClipped(S.bounds), v = Ri({
        chunk: S,
        chunkIndex: z,
        totalChunks: M,
        now: e,
        phase: i,
        profile: t,
        performanceMode: r,
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
        sampleUnloadedWhileMoving: C,
        movingSampleStride: w,
        movingSampleSeed: P,
        resolveShouldRefreshPeripheral: (A) => !A || this.shouldRefreshPeripheralChunk(e, z, M, t),
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
            const U = this.contentGroup.getObjectByName(S.groupName)?.getObjectByName(S.id);
            U && (S.mesh = U, U.visible = v.effectiveVisible, g = !0);
          }
        else !this.processingChunks.has(S.id) && v.shouldBeVisible && v.priority !== null && (S.priority = v.priority, p.push(S));
    }
    k || (this.cullingScanCursor = (B + M) % Math.max(M, 1));
    const R = ui({
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
    const O = di({
      toLoad: p,
      now: performance.now(),
      chunkLoadResumeAt: this.chunkLoadResumeAt,
      maxConcurrentChunkLoads: this.maxConcurrentChunkLoads,
      processingChunkCount: this.processingChunks.size,
      chunkWarmupActive: this.chunkWarmupActive,
      chunkLoadedCount: this.chunkLoadedCount,
      initialChunkLoadTarget: this.initialChunkLoadTarget,
      warmupChunkBoost: this.warmupChunkBoost,
      getChunkFrameBudget: (D, z, S) => this.getChunkFrameBudget(D, z, S),
      phase: i,
      profile: t
    });
    for (const D of O)
      this.loadChunk(D);
    O.length > 0 && (g = !0), this.schedulePrefetchFromVisibleChunks(m), this.forceMaxChunkLoadSpeed, k && (this.cullingDirty = !0), this.chunkWarmupActive && this.chunkLoadedCount >= this.initialChunkLoadTarget && (this.chunkWarmupActive = !1, g = !0), (g || k) && this.markSceneDirty();
  }
  async runWorkerTask(e, t) {
    return vi({
      workerQueue: this.workerQueue,
      data: e,
      transferables: t,
      processQueue: () => this.processWorkerQueue()
    });
  }
  processWorkerQueue() {
    Bi({
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
    const t = oi({
      chunk: e,
      unregisterOptimizedMeshMapping: (i) => this.unregisterOptimizedMeshMapping(i),
      cacheChunkMesh: (i, r) => this.cacheChunkMesh(i, r),
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
      let t = !1, i = !1, r = !1, n = !1, o = !1;
      const { mesh: a, prefetchCandidates: c } = await ai({
        chunk: e,
        sharedMaterial: this.sharedMaterial,
        takeCachedChunkMesh: (h) => this.takeCachedChunkMesh(h),
        yieldToMainThread: () => this.yieldToMainThread(),
        nbimFiles: this.nbimFiles,
        hasValidChunkBinaryRange: (h) => this.hasValidChunkBinaryRange(h),
        readChunkBuffer: (h) => this.readChunkBuffer(h),
        nbimMeta: this.nbimMeta,
        runWorkerTask: (h, f) => this.runWorkerTask(h, f),
        reconstructBatchedMesh: (h, f) => fi({
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
      c.length > 0 && (this.enqueueChunkPrefetch(c), this.processPrefetchQueue()), a && (t = ci({
        chunk: e,
        mesh: a,
        cancelledChunkIds: this.cancelledChunkIds,
        chunkIdSet: this.chunkIdSet,
        disposeChunkMesh: (f) => this.disposeChunkMesh(f),
        globalOffset: this.globalOffset,
        contentGroup: this.contentGroup,
        registerOptimizedMeshMapping: (f) => this.registerOptimizedMeshMapping(f)
      }).attached, t && (n = !0, r = !0, i = !0));
      const u = hi({
        chunk: e,
        loadedNow: t,
        now: performance.now(),
        chunkLoadedCount: this.chunkLoadedCount,
        chunkWarmupActive: this.chunkWarmupActive,
        initialChunkLoadTarget: this.initialChunkLoadTarget,
        deactivateFastPreviewForModel: (h) => this.deactivateFastPreviewForModel(h)
      });
      this.chunkLoadedCount = u.nextChunkLoadedCount, this.chunkWarmupActive = u.nextChunkWarmupActive, u.progressChanged && (this.reportChunkProgress(), o = !0, i = !0), this.cancelledChunkIds.delete(e.id), li({
        chunkId: e.id,
        ghostGroup: this.ghostGroup,
        releaseGhostLine: (h) => this.releaseGhostLine(h)
      }).changed && (i = !0), i && this.markSceneDirty({
        invalidateInteractables: n,
        needsBoundsUpdate: r,
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
    const t = tt(e);
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
    for (const r of e.children)
      i.children.push(this.buildSceneGraph(r));
    return i;
  }
  /**
   * 构建基于 IFC 图层和空间结构的复合树
   */
  buildIFCStructure(e) {
    const t = (i) => {
      const r = i.isMesh ? `Mesh_${i.id}` : `Group_${i.id}`, n = {
        id: i.uuid,
        name: pe(i.name, i.userData?.name) || r,
        type: i.isMesh ? "Mesh" : "Group",
        children: [],
        bimId: i.userData?.bimId ? String(i.userData.bimId) : i.userData?.expressID !== void 0 ? String(i.userData.expressID) : i.name ? String(i.name) : void 0,
        userData: { ...i.userData }
      };
      this.nodeMap.has(i.uuid) || this.nodeMap.set(i.uuid, []), this.nodeMap.get(i.uuid).push(n);
      for (const o of i.children)
        o.userData?.isIfcGridHelper || n.children.push(t(o));
      return n;
    };
    return t(e);
  }
  async prepareObjectRuntimeData(e, t, i = 6e3) {
    const r = [e];
    let n = 0;
    for (; r.length > 0; ) {
      const o = r.pop();
      if (o.isMesh) {
        const a = o;
        this.componentMap.set(a.uuid, a), a.userData.expressID !== void 0 && this.componentMap.set(a.userData.expressID, a), a.userData.bimId || (a.userData.expressID !== void 0 ? a.userData.bimId = String(a.userData.expressID) : a.userData.bimId = a.uuid), a.material && (Array.isArray(a.material) ? a.material : [a.material]).forEach((u) => {
          u.map && (u.map.anisotropy = t);
        });
      }
      n++;
      for (let a = o.children.length - 1; a >= 0; a--)
        r.push(o.children[a]);
      n > 0 && n % i === 0 && await this.yieldToMainThread();
    }
  }
  applyGlobalOffsetForModel(e) {
    const t = new d.Box3().setFromObject(e);
    return t.isEmpty() ? t : (this.globalOffset.length() === 0 && (t.getCenter(this.globalOffset), console.log("初始化全局偏移以解决大坐标问题:", this.globalOffset)), e.position.sub(this.globalOffset), e.updateMatrixWorld(!0), new d.Box3().setFromObject(e));
  }
  configureModelWarmup(e) {
    if (this.chunkWarmupActive = !0, this.resolvedChunkOptions.loadProfile === "max-speed") {
      this.initialChunkLoadTarget = e > 1e5 ? 42 : e > 3e4 ? 32 : 20, this.warmupChunkBoost = 16;
      return;
    }
    this.initialChunkLoadTarget = e > 1e5 ? 24 : e > 3e4 ? 18 : 12, this.warmupChunkBoost = 12;
  }
  prepareStructureStage(e, t, i) {
    const r = t >= this.deferredStructureThreshold;
    let n = null;
    if (i && i(5, r ? "正在准备轻量预览..." : "正在构建场景树..."), r) {
      n = `deferred_${e.uuid}`;
      const o = {
        id: n,
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
    return { shouldDeferStructure: r, deferredPlaceholderId: n };
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
    let r = 0;
    const n = this.fastPreviewMeshLimit;
    return e.traverse((o) => {
      if (!o.isMesh) return;
      const a = o, c = r < n;
      a.visible = c, a.userData.fastPreview = c, c && r++;
    }), i && i(8, `正在准备快速预览... (${r} meshes)`), r > 0 && (e.userData.fastPreviewActive = !0, this.fastPreviewModels.add(e.uuid)), r > 0;
  }
  attachModelToContentGroup(e, t = !1) {
    const i = new d.Group();
    i.name = `file_${e.uuid}`, i.userData.originalUuid = e.uuid;
    const r = ce(
      pe(
        typeof e.userData?.modelName == "string" ? e.userData.modelName : "",
        ye(e.name),
        e.name
      ) || "model"
    );
    i.userData.modelName = r, e.userData.originalUuid = e.uuid, e.userData.modelName = r, i.add(e), e.visible = t, this.contentGroup.add(i), this.markSceneDirty({
      invalidateInteractables: !0,
      needsRender: !1
    });
  }
  async prepareModelChunkStage(e, t, i) {
    i && i(10, "正在收集构件...");
    const r = this.resolvedChunkOptions.loadProfile === "max-speed", n = r ? 1200 : this.octreeWorkerThreshold, o = t >= n ? await $t(e, {
      batchSize: r ? 5200 : 3e3,
      onProgress: (m, y) => {
        if (!i || y === 0) return;
        const g = m / y;
        i(10 + Math.round(g * 10), `正在收集构件... (${m}/${y})`);
      }
    }) : Ht(e);
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
      const r = this.deferredStructureToken;
      this.deferredStructureTimer = setTimeout(() => {
        try {
          if (r !== this.deferredStructureToken) return;
          const n = this.buildAndRegisterModelStructure(e);
          this.replaceStructureNode(i, n), this.onStructureUpdate && this.onStructureUpdate(), this.markSceneDirty({
            invalidateInteractables: !0,
            needsBoundsUpdate: !0,
            needsCulling: !0
          });
        } catch (n) {
          console.warn("延迟构建结构树失败:", n);
        }
      }, 80);
      return;
    }
    this.onStructureUpdate && this.onStructureUpdate();
  }
  async addModel(e, t) {
    e.updateMatrixWorld(!0);
    const i = this.applyGlobalOffsetForModel(e), r = this.collectObjectOverview(e), n = r.meshes;
    this.configureModelWarmup(n), this.registerOriginalStats(e.uuid, r);
    const { shouldDeferStructure: o, deferredPlaceholderId: a } = this.prepareStructureStage(e, n, t), c = this.prepareModelBoundsStage(e, i), u = this.prepareFastVisibleStage(e, n, t);
    await this.prepareModelRuntimeStage(e, n), this.attachModelToContentGroup(e, u), this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    }), await this.prepareModelChunkStage(e, n, t), this.markSceneDirty({
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
    const t = this.nodeMap.get(e), i = t?.[0]?.userData?.originalUuid || e, r = [];
    this.contentGroup.traverse((a) => {
      (a.name === `optimized_${e}` || a.name === `file_${e}` || a.userData.originalUuid === e || a.userData.originalUuid === i || a.name.startsWith("optimized_") && (a.userData.originalUuid === e || a.userData.originalUuid === i) || a.name.startsWith("file_") && (a.userData.originalUuid === e || a.userData.originalUuid === i)) && r.push(a);
    }), r.forEach((a) => {
      a.traverse((c) => {
        if (c.isBatchedMesh) {
          const u = c;
          this.disposeChunkMesh(u);
        }
      }), a.removeFromParent();
    });
    const n = this.contentGroup.getObjectByProperty("uuid", e), o = (a) => {
      const c = a instanceof d.Object3D ? a.uuid : a.id, u = this.optimizedMapping.get(c);
      if (u && (u.forEach((h) => {
        h.mesh.setVisibleAt(h.instanceId, !1);
      }), this.optimizedMapping.delete(c)), a.isMesh) {
        const h = a;
        h.geometry && h.geometry.dispose(), h.material && (Array.isArray(h.material) ? h.material : [h.material]).forEach((p) => p.dispose());
      } else if (a.isBatchedMesh) {
        const h = a;
        this.disposeChunkMesh(h);
      }
      this.componentMap.delete(c), a instanceof d.Object3D && a.userData.expressID !== void 0 && this.componentMap.delete(a.userData.expressID);
      const l = this.nodeMap.get(c);
      l && l.forEach((h) => {
        h.bimId !== void 0 && this.componentMap.delete(h.bimId);
      }), this.nodeMap.delete(c);
    };
    if (n)
      n.traverse(o), n.removeFromParent();
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
      const u = c.userData.originalUuid || "";
      return u === e || u === i || a.startsWith(e) || a.startsWith(i);
    }), (this.currentMeasureModelUuid === e || this.currentMeasureModelUuid === i) && (this.currentMeasureModelUuid = null), this.chunks = this.chunks.filter((a) => {
      if (a.originalUuid === e || a.originalUuid === i || a.id.startsWith(e)) {
        this.cancelledChunkIds.add(a.id), this.processingChunks.delete(a.id);
        const u = this.ghostGroup.getObjectByName(`ghost_${a.id}`);
        return u && (this.ghostGroup.remove(u), this.releaseGhostLine(u)), !1;
      }
      return !0;
    }), this.rebuildChunkIdSet(), this.structureRoot) {
      const a = (c) => c.filter((u) => u.id === e || !this.nodeMap.has(u.id) && u.id !== "root" ? !1 : (u.children && (u.children = a(u.children)), !0));
      this.structureRoot.id === e ? this.structureRoot = { id: "root", name: "Root", type: "Group", children: [] } : this.structureRoot.children && (this.structureRoot.children = a(this.structureRoot.children));
    }
    return this.precomputedBounds = this.computeTotalBounds(), this.precomputedBounds.isEmpty() && this.contentGroup.traverse((a) => {
      if (a.isMesh && a.visible) {
        const c = new d.Box3().setFromObject(a);
        c.isEmpty() || this.precomputedBounds.union(c);
      }
    }), this.updateSceneBounds(), this.onStructureUpdate && this.onStructureUpdate(), this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    }), this.measureRecords.forEach((a, c) => {
      let u = a.modelUuid === e || a.modelUuid === i;
      !u && a.modelUuid && n && n.traverse((l) => {
        l.uuid === a.modelUuid && (u = !0);
      }), u && this.removeMeasurement(c);
    }), !0;
  }
  async removeModel(e) {
    return this.removeObject(e);
  }
  // --- NBIM 导入/导出功能 ---
  generateChunkBinaryV8(e, t) {
    const i = [], r = /* @__PURE__ */ new Map();
    e.forEach((u) => {
      u.geometry && !r.has(u.geometry) && (r.set(u.geometry, i.length), i.push(u.geometry));
    });
    let n = 4;
    for (const u of i) {
      const l = u.attributes.position.count, h = u.index, f = h ? h.count : 0;
      n += 8 + l * 12 + l * 12, f > 0 && (n += f * 4);
    }
    n += 4, n += e.length * 80;
    const o = new ArrayBuffer(n), a = new DataView(o);
    let c = 0;
    a.setUint32(c, i.length, !0), c += 4;
    for (const u of i) {
      const l = u.getAttribute("position"), h = u.getAttribute("normal"), f = l.count, p = u.index, m = p ? p.count : 0;
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
    for (const u of e) {
      const h = this.nodeMap.get(u.uuid)?.[0], f = u.bimId || h?.bimId || h?.id || u.uuid, p = t.get(f) ?? 0;
      a.setUint32(c, p, !0), c += 4;
      const m = typeof u.typeIndex == "number" ? u.typeIndex : 0;
      a.setUint32(c, m, !0), c += 4, a.setUint32(c, u.color, !0), c += 4;
      const y = u.matrix.elements;
      for (let M = 0; M < 16; M++)
        a.setFloat32(c, y[M], !0), c += 4;
      const g = r.get(u.geometry) || 0;
      a.setUint32(c, g, !0), c += 4;
    }
    return o;
  }
  registerPropertyDocuments(e) {
    const { docs: t, propertyNameIndex: i, rootId: r, preferNodeMapping: n = !1 } = e;
    let o = !1;
    Object.entries(t || {}).forEach(([a, c]) => {
      if (!c || !Array.isArray(c.rows)) return;
      const u = a.indexOf("::"), l = c.owner || (u > 0 ? a.slice(0, u) : r || ""), h = c.bimId || (u > 0 ? a.slice(u + 2) : "");
      let f = c.uuid || h;
      if (n && l && h) {
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
    const i = ji(e);
    Object.keys(i.bimPropertyDocs).length > 0 && this.registerPropertyDocuments({
      docs: i.bimPropertyDocs,
      propertyNameIndex: i.propertyNameIndex,
      rootId: e.uuid
    });
    const r = e.userData?.ifcMetadataReady;
    r && typeof r.then == "function" && (t && t(95, "正在完成 IFC 属性资源解析..."), await r);
    const n = je(this.contentGroup);
    if (!n.ifcManagerByModel.has(e.uuid) && !n.ifcApiByModel.has(e.uuid)) return;
    t && t(96, "正在建立属性索引...");
    const { bimProperties: o, bimPropertyDocs: a, propertyNameIndex: c } = await Zi({
      object: e,
      ifcApiByModel: n.ifcApiByModel,
      ifcManagerByModel: n.ifcManagerByModel,
      onProgress: (u, l) => {
        if (!t || l <= 0) return;
        const h = 96 + Math.floor(u / l * 3);
        t(Math.min(99, h), `正在建立属性索引... (${u}/${l})`);
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
      }).catch((r) => {
        console.warn("IFC 属性索引后台构建失败:", r);
      });
    }, 0), t && t(100, "模型已加载，属性索引将在后台构建...");
  }
  buildExportPropertyDocsFromCache() {
    const e = {};
    return this.nbimSearchDocsByUuid.forEach((t) => {
      if (!t || !Array.isArray(t.rows)) return;
      const i = String(t.owner || ""), r = String(t.bimId || "");
      if (!i || !r) return;
      const n = `${i}::${r}`;
      e[n] || (e[n] = {
        ...t,
        owner: i,
        bimId: r,
        uuid: String(t.uuid || r),
        name: String(t.name || ""),
        rows: t.rows
      });
    }), {
      bimPropertyDocs: e,
      propertyNameIndex: Me(e)
    };
  }
  async exportNbim(e) {
    if (this.chunks.length === 0) throw new Error("无模型数据可导出");
    const t = [""], i = /* @__PURE__ */ new Map(), r = (C) => {
      if (!C || i.has(C)) return;
      const w = t.length;
      t.push(C), i.set(C, w);
    }, n = (C) => {
      r(C.bimId), C.children && C.children.forEach(n);
    };
    n(this.structureRoot);
    let { bimPropertyDocs: o, propertyNameIndex: a } = this.buildExportPropertyDocsFromCache();
    if (Object.keys(o).length === 0) {
      const { ifcApiByModel: C, ifcManagerByModel: w } = je(this.contentGroup), P = await Yi({
        structureRoot: this.structureRoot,
        ifcApiByModel: C,
        ifcManagerByModel: w
      });
      o = P.bimPropertyDocs, a = P.propertyNameIndex;
    }
    const { chunkBlobs: c, exportChunks: u, currentOffset: l } = await Ji({
      chunks: this.chunks,
      nbimFiles: this.nbimFiles,
      nbimMeta: this.nbimMeta,
      bimIdToIndex: i,
      hasValidChunkBinaryRange: (C) => this.hasValidChunkBinaryRange(C),
      generateChunkBinaryV8: (C, w) => this.generateChunkBinaryV8(C, w)
    }), h = {
      globalBounds: {
        min: { x: this.sceneBounds.min.x, y: this.sceneBounds.min.y, z: this.sceneBounds.min.z },
        max: { x: this.sceneBounds.max.x, y: this.sceneBounds.max.y, z: this.sceneBounds.max.z }
      },
      chunks: u,
      stats: this.originalStats,
      structureTree: Hi(this.structureRoot),
      bimIdTable: t,
      bimPropertyDocs: o,
      propertyNameIndex: a
    }, f = $i(h, this.structureRoot), p = new ArrayBuffer(1024), m = new DataView(p);
    m.setUint32(0, 1296646734, !0), m.setUint32(4, 8, !0), m.setUint32(8, l, !0), m.setUint32(12, f.byteLength, !0);
    const y = [p, ...c, f], g = new Blob(y, { type: "application/octet-stream" }), M = URL.createObjectURL(g), x = document.createElement("a");
    x.href = M;
    const b = _i(this.contentGroup), k = ce(ye((e || "").trim()) || b);
    x.download = `${k}.nbim`, x.click(), URL.revokeObjectURL(M);
  }
  async loadNbim(e, t) {
    const i = `nbim_${e.name}_${(/* @__PURE__ */ new Date()).getTime()}`;
    t && t(10, "正在解析 NBIM 文件头...");
    const r = await Yt(e);
    if (r.magic !== 1296646734) throw new Error("不是有效的 NBIM 文件");
    const o = r.version;
    if (o !== 8)
      throw new Error(`不支持的 NBIM 版本: ${o}，当前仅支持 V8`);
    t && t(20, "正在读取元数据...");
    const a = await jt(e, r), c = a?.bimPropertyDocs && typeof a.bimPropertyDocs == "object" ? a.bimPropertyDocs : null, u = Array.isArray(a.propertyNameIndex) ? a.propertyNameIndex : null;
    if (!c || !u)
      throw new Error("不支持旧版 NBIM：缺少 bimPropertyDocs 或 propertyNameIndex。请使用当前版本重新导出 NBIM。");
    this.nbimFiles.set(i, e), this.nbimMeta.set(i, { version: o, bimIdTable: a.bimIdTable });
    const l = es({
      globalBounds: a.globalBounds,
      precomputedBounds: this.precomputedBounds,
      sceneBounds: this.sceneBounds,
      globalOffset: this.globalOffset
    });
    this.precomputedBounds.copy(l.precomputedBounds), this.sceneBounds.copy(l.sceneBounds), this.globalOffset.copy(l.globalOffset), l.initializedOffset && Be("SceneManager/NBIM", "初始化全局偏移", this.globalOffset);
    const h = a.structureTree;
    ts({
      structureRoot: this.structureRoot,
      modelRoot: h
    });
    const f = h?.id || i, p = a?.bimProperties && typeof a.bimProperties == "object" ? a.bimProperties : {}, m = /* @__PURE__ */ new Set();
    Object.keys(c).forEach((B) => {
      const R = B.indexOf("::");
      R > 0 && m.add(B.slice(0, R));
    });
    const { defaultOwner: y, grouped: g } = Qi(p, f), M = m.size === 1 ? Array.from(m)[0] : y;
    g.forEach((B, R) => this.nbimPropsByOriginalUuid.set(R, B));
    const x = is({
      manifestStats: a.stats,
      modelRoot: h,
      chunks: a.chunks
    });
    this.registerOriginalStats(f, x);
    const b = qi({
      fileName: e.name,
      modelRootName: typeof h?.name == "string" ? h.name : "",
      rootId: f
    });
    this.contentGroup.add(b), this.interactableListValid = !1, this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    }), ss({
      modelRoot: h,
      defaultOwner: M,
      nodeMap: this.nodeMap,
      bimIdToNodeIds: this.bimIdToNodeIds
    }), this.registerPropertyDocuments({
      docs: c,
      propertyNameIndex: u,
      rootId: f,
      preferNodeMapping: !0
    }), t && t(30, "正在初始化分块...");
    const k = Array.isArray(a.chunks) ? a.chunks : [];
    this.applyNbimScaleTuning(k.length);
    const C = this.resolvedChunkOptions.ghostMode === "all" ? Number.MAX_SAFE_INTEGER : Es, { deferredGhostSpecs: w } = await rs({
      chunkEntries: k,
      globalOffset: this.globalOffset,
      chunkPadding: this.chunkPadding,
      rootId: f,
      fileId: i,
      immediateGhostLimit: C,
      registrationBatchSize: Fs,
      onProgress: t,
      registerChunk: (B) => this.registerChunk(B),
      createGhostLine: (B, R) => this.createGhostLine(B, R),
      addGhostLine: (B) => this.ghostGroup.add(B),
      yieldToMainThread: () => this.yieldToMainThread()
    });
    w.length > 0 && this.createChunkGhostsProgressively(w), this.reportChunkProgress(), this.fitView(!0), this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    });
    const P = ns({
      chunkCount: this.chunks.length,
      hasManifestStats: !!a.stats,
      hasManifestChunks: !!a.chunks?.length
    });
    this.chunkWarmupActive = P.chunkWarmupActive, this.initialChunkLoadTarget = P.initialChunkLoadTarget, t && t(100, "NBIM 已就绪，正在按需加载..."), this.checkCullingAndLoad(), this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    }), P.shouldEstimateStats && this.estimateNbimStats(e, a.chunks, o).then((B) => {
      this.unregisterOriginalStats(f), this.registerOriginalStats(f, B);
    }).catch((B) => {
      console.warn("NBIM 统计估算失败:", B);
    });
  }
  async clear() {
    this.beginLoadGeneration(), Be("SceneManager", "开始清空场景..."), this.cancelDeferredStructureBuild(), this.resetExplode(), this.clearLocateFocus(), this.locateIsolationRestoreChanges = [], this.locateIsolationActive = !1;
    try {
      const e = (t) => {
        if (t.isMesh) {
          const i = t;
          i.geometry && i.geometry.dispose(), i.material && (Array.isArray(i.material) ? i.material : [i.material]).forEach((n) => n.dispose());
        } else if (t.isBatchedMesh) {
          const i = t;
          i.geometry && i.geometry.dispose(), i.material && (Array.isArray(i.material) ? i.material : [i.material]).forEach((n) => n.dispose());
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
    return Bs({
      uuid: e,
      nodeMap: this.nodeMap,
      bimIdToNodeIds: this.bimIdToNodeIds
    });
  }
  resolveNodeUuidByBimId(e) {
    return Pt(e, this.bimIdToNodeIds);
  }
  resolveSelectionUuid(e) {
    return Is(e, this.nodeMap, this.bimIdToNodeIds);
  }
  resolveNbimNode(e) {
    return Rt(e, this.nodeMap);
  }
  getNbimProperties(e) {
    return Ps({
      id: e,
      nodeMap: this.nodeMap,
      nbimPropsByOriginalUuid: this.nbimPropsByOriginalUuid
    });
  }
  getNbimIfcPropertyGroups(e, t = "raw") {
    return Rs({
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
      const n = this.nbimSearchDocsByUuid.get(i);
      if (n) return n;
    }
    const r = this.getBimIdByUuid(e);
    return r && this.nbimSearchDocsByUuid.get(r) || null;
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
    const i = Ts(this.getVisibilityContext(), e, t);
    i.nextHighlightedUuids && this.highlightObjects(i.nextHighlightedUuids), (t.invalidateInteractables ?? !0) && this.markSceneDirty({
      invalidateInteractables: !0,
      needsRender: !1
    }), i.needsBoundsUpdate && this.updateSceneBounds(), i.needsExplodeRefresh && this.refreshExplodeState(), i.needsRender && this.markSceneDirty();
  }
  setObjectsVisibility(e, t, i = {}) {
    if (e.length === 0) return;
    const r = e.map((o) => ({
      uuid: o,
      visible: t,
      showParents: i.showParents
    })), n = !i.deferRefresh;
    this.applyVisibilityBatch(r, {
      recomputeBounds: n,
      refreshExplode: i.refreshExplode ?? !1,
      invalidateInteractables: !i.deferRefresh
    });
  }
  isolateObjects(e) {
    this.restoreLocateIsolation({ clearFocus: !1, invalidate: !1 }), Us(
      this.getVisibilityContext(),
      e,
      (t, i, r) => {
        const n = De(this.getVisibilityContext(), t, i, r);
        if (n.nextHighlightedUuids) {
          const o = this.getHighlightContext();
          Ze(o, n.nextHighlightedUuids), this.syncHighlightState(o.state), this.markSceneDirty();
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
    const r = (l) => {
      l && (i.add(l.id), l.children?.forEach(r));
    };
    Array.from(i).forEach((l) => {
      this.nodeMap.get(l)?.forEach(r);
    });
    const n = /* @__PURE__ */ new Set(), o = (l, h) => {
      const f = i.has(l.id);
      let p = !1;
      return l.children?.forEach((m) => {
        o(m, [...h, l.id]) && (p = !0);
      }), (f || p) && (n.add(l.id), h.forEach((m) => n.add(m))), f || p;
    };
    this.structureRoot.children?.forEach((l) => o(l, [])), i.forEach((l) => n.add(l));
    const a = /* @__PURE__ */ new Set(), c = (l) => {
      if (!l.id || n.has(l.id)) {
        l.children?.forEach(c);
        return;
      }
      const h = this.nodeMap.get(l.id);
      (h ? h.some((p) => p.visible !== !1) : l.visible !== !1) && a.add(l.id);
    };
    if (this.structureRoot.children?.forEach(c), this.collectRenderableTargets().forEach((l) => {
      const h = l.ownerUuid || l.uuid;
      if (!h || n.has(h) || n.has(l.uuid)) return;
      const f = this.nodeMap.get(h);
      (f ? f.some((m) => m.visible !== !1) : l.object.visible !== !1) && a.add(h);
    }), a.size === 0) {
      this.locateIsolationRestoreChanges = [], this.locateIsolationActive = !1;
      return;
    }
    const u = Array.from(a).map((l) => ({
      uuid: l,
      visible: !1,
      showParents: !1
    }));
    this.locateIsolationRestoreChanges = Array.from(a).map((l) => ({
      uuid: l,
      visible: !0,
      showParents: !0
    })), this.locateIsolationActive = !0, this.applyVisibilityBatch(u, {
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
    const r = De(this.getVisibilityContext(), e, t, i);
    r.nextHighlightedUuids && this.highlightObjects(r.nextHighlightedUuids), this.markSceneDirty({
      invalidateInteractables: !0,
      needsRender: !1
    }), r.needsBoundsUpdate && this.updateSceneBounds(), r.needsRender && this.markSceneDirty();
  }
  highlightObject(e) {
    this.highlightObjects(e ? [e] : []);
  }
  toLocalDirection(e, t) {
    return e.clone().transformDirection(t.clone().invert()).normalize();
  }
  getExplodeWorldDirection(e) {
    const t = e.clone();
    return this.explodeMode === "horizontal" ? t.z = 0 : this.explodeMode === "vertical" && (t.x = 0, t.y = 0, t.z = t.z >= 0 ? 1 : -1), t.lengthSq() < 1e-8 ? this.explodeMode === "vertical" ? new d.Vector3(0, 0, 1) : this.explodeMode === "horizontal" ? new d.Vector3(1, 0, 0) : new d.Vector3(0, 0, 1) : t.normalize();
  }
  /** 由 UUID 导出的稳定单位向量，近似均匀分布于球面（与径向方向混合后爆炸更散、更匀） */
  explodeStableUnitDirection(e, t) {
    Xt(e, t);
  }
  captureExplodeSnapshot() {
    this.explodeObjectStates.clear(), this.explodeInstanceStates.clear();
    let e = this.computeTotalBounds(!0, !0);
    if (e.isEmpty() && (e = this.computeTotalBounds(!1, !0)), e.isEmpty()) {
      this.explodeCenter.set(0, 0, 0);
      return;
    }
    this.explodeCenter.copy(e.getCenter(new d.Vector3()));
    const t = Math.max(e.getSize(new d.Vector3()).length() * 0.5, 1), i = new d.Box3(), r = new d.Vector3();
    this.contentGroup.updateMatrixWorld(!0), this.contentGroup.traverse((c) => {
      if (!c.isMesh || !c.visible || c.userData?.isIfcGridHelper || (i.setFromObject(c), i.isEmpty())) return;
      r.copy(i.getCenter(new d.Vector3()));
      const l = r.sub(this.explodeCenter), h = l.length() / t, f = 0.14 + 0.86 * Math.pow(d.MathUtils.clamp(h, 0, 2.5) / 2.5, 0.38);
      let p;
      if (this.explodeMode === "radial") {
        const y = this.getExplodeWorldDirection(l);
        this.explodeStableUnitDirection(c.uuid, this.explodeScratchUniform);
        const g = Math.pow(1 - Math.min(h / 1.08, 1), 1.15);
        p = this.explodeScratchMix.copy(y).multiplyScalar(1 - g).addScaledVector(this.explodeScratchUniform, g).normalize();
      } else
        p = this.getExplodeWorldDirection(l);
      const m = this.toLocalDirection(p, c.parent?.matrixWorld || new d.Matrix4());
      this.explodeObjectStates.set(c.uuid, {
        object: c,
        basePosition: c.position.clone(),
        directionLocal: m,
        weight: f
      });
    });
    const n = new d.Box3(), o = new d.Matrix4(), a = new d.Matrix4();
    this.optimizedMapping.forEach((c, u) => {
      (this.nodeMap.get(u)?.some((h) => h.visible !== !1) ?? !0) && c.forEach((h) => {
        const f = `${h.mesh.uuid}:${h.instanceId}`;
        if (this.explodeInstanceStates.has(f)) return;
        h.mesh.getMatrixAt(h.instanceId, o);
        const p = h.geometry || h.mesh.geometry;
        if (p?.boundingBox || p?.computeBoundingBox?.(), !p?.boundingBox || (a.copy(h.mesh.matrixWorld).multiply(o), n.copy(p.boundingBox).applyMatrix4(a), n.isEmpty())) return;
        r.copy(n.getCenter(new d.Vector3()));
        const m = r.sub(this.explodeCenter), y = m.length() / t, g = 0.14 + 0.86 * Math.pow(d.MathUtils.clamp(y, 0, 2.5) / 2.5, 0.38);
        let M;
        if (this.explodeMode === "radial") {
          const x = this.getExplodeWorldDirection(m);
          this.explodeStableUnitDirection(f, this.explodeScratchUniform);
          const b = Math.pow(1 - Math.min(y / 1.08, 1), 1.15);
          M = this.explodeScratchMix.copy(x).multiplyScalar(1 - b).addScaledVector(this.explodeScratchUniform, b).normalize();
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
    const e = this.computeTotalBounds(!0, !0), t = e.isEmpty() ? new d.Vector3(100, 100, 100) : e.getSize(new d.Vector3()), i = Math.max(t.length() * 0.125 * (this.explodeStrength / 100), 0);
    this.explodeObjectStates.forEach((c) => {
      c.object.position.copy(c.basePosition).addScaledVector(c.directionLocal, i * c.weight), c.object.updateMatrixWorld();
    });
    const r = new d.Vector3(), n = new d.Quaternion(), o = new d.Vector3(), a = new d.Matrix4();
    this.explodeInstanceStates.forEach((c) => {
      a.copy(c.baseMatrix), a.decompose(r, n, o), r.addScaledVector(c.directionLocal, i * c.weight), a.compose(r, n, o), c.mesh.setMatrixAt(c.instanceId, a), c.mesh.instanceMatrix && (c.mesh.instanceMatrix.needsUpdate = !0);
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
    this.explodeStrength = d.MathUtils.clamp(e, 0, 100), this.explodeEnabled && (this.explodeObjectStates.size === 0 && this.explodeInstanceStates.size === 0 && this.captureExplodeSnapshot(), this.applyExplodeState());
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
      e.setColorAt(t, new d.Color(i)), e.instanceColor && (e.instanceColor.needsUpdate = !0);
    }), this.clashPairInstanceColorCache.clear(), this.clashPairUuids.clear();
  }
  setClashPairHighlight(e, t, i = "#ff4d4f", r = "#1890ff") {
    const n = String(e || "").trim(), o = String(t || "").trim();
    if (!n || !o) {
      this.clearClashPairHighlight(), this.markSceneDirty();
      return;
    }
    this.clearLocateFocus(), this.clearClashPairHighlight();
    const a = this.expandLocateTargets([n]), c = this.expandLocateTargets([o]), u = new d.Color(i), l = new d.Color(r);
    this.contentGroup.traverse((f) => {
      const p = f;
      if (!p.isMesh || p.isBatchedMesh || p.userData?.isOptimized || !p.material) return;
      const m = a.has(f.uuid) ? "A" : c.has(f.uuid) ? "B" : null;
      if (!m) return;
      this.clashPairObjectMaterialCache.has(f.uuid) || this.clashPairObjectMaterialCache.set(f.uuid, p.material);
      const y = Array.isArray(p.material) ? p.material : [p.material], g = m === "A" ? u : l, M = y.map((x) => {
        if (!x) return x;
        const b = x.clone();
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
        const x = a.has(g) ? "A" : c.has(g) ? "B" : null;
        if (!x) return;
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
            const P = new d.Color();
            p.getColorAt(M, P), this.clashPairInstanceColorCache.set(b, {
              mesh: p,
              instanceId: M,
              originalColor: P.getHex()
            });
          }
        }
        const k = this.clashPairInstanceColorCache.get(b)?.originalColor;
        if (typeof k != "number") return;
        const C = x === "A" ? u : l;
        p.setColorAt(M, new d.Color(k).lerp(C, 0.88)), y = !0;
      }), y && p.instanceColor && (p.instanceColor.needsUpdate = !0);
    }), this.clashPairUuids = /* @__PURE__ */ new Set([n, o]), this.markSceneDirty();
  }
  clearLocateFocus() {
    if (this.locateResultSet.size === 0 && this.locateObjectMaterialCache.size === 0 && this.locateDimmedInstances.size === 0 && !this.locateFocusUuid && this.highlightedUuids.size === 0)
      return;
    const e = this.getHighlightContext(), t = xt(e);
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
    const t = /* @__PURE__ */ new Set(), i = [...e], r = /* @__PURE__ */ new Set();
    for (; i.length > 0; ) {
      const n = i.shift();
      if (!n || r.has(n)) continue;
      r.add(n), t.add(n);
      const o = this.nodeMap.get(n);
      if (!(!o || o.length === 0)) {
        for (const a of o)
          if (!(!a.children || a.children.length === 0))
            for (const c of a.children)
              r.has(c.id) || i.push(c.id);
      }
    }
    return t;
  }
  setLocateResultSet(e, t = null) {
    const i = this.getHighlightContext(), r = Ke(i, e, t);
    this.syncHighlightState(i.state), r.needsRender && this.markSceneDirty();
  }
  setLocateFocusContext(e, t = null, i) {
    const r = this.getHighlightContext(), n = Ke(r, e, t, { highlightColors: i });
    this.syncHighlightState(r.state), n.needsRender && this.markSceneDirty();
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
    Ze(t, e), this.syncHighlightState(t.state), this.markSceneDirty();
  }
  /**
   * 通用多构件聚焦高亮入口：
   * - 高亮 uuids 中的所有物体
   * - 可选 fitView 将镜头飞到这批物体
   * - 可选 highlightColors 支持按 UUID 指定不同颜色（碰撞场景 A/B 色对）
   * - 传空数组等同于 clearLocateFocus()
   */
  focusHighlightObjects(e, t = {}) {
    const { fitView: i = !0, focusUuid: r = null, highlightColors: n } = t, o = Array.from(new Set(e.filter(Boolean)));
    if (o.length === 0) {
      this.clearLocateFocus();
      return;
    }
    this.setLocateFocusContext(o, r ?? o[0], n), i && this.fitViewToObjects(o);
  }
  collectRenderableTargets(e) {
    const t = this.getHighlightContext();
    return e && e.length > 0 ? Mt(t, e) : ls(t);
  }
  pick(e, t) {
    const i = this.getRayIntersects(e, t);
    return i ? { object: i.object, intersect: i } : null;
  }
  getRayIntersects(e, t) {
    const i = Ss(this.getPickingContext(), e, t);
    return this.syncPickingState(i.state), i.intersect;
  }
  computeTotalBounds(e = !1, t = !1) {
    if (!e && !t && !this.precomputedBounds.isEmpty()) {
      const r = this.precomputedBounds.clone();
      return this.globalOffset.length() > 0 && r.translate(this.globalOffset.clone().negate()), r;
    }
    const i = new d.Box3();
    if (this.contentGroup.updateMatrixWorld(!0), this.contentGroup.traverse((r) => {
      if (!(e && !r.visible)) {
        if (r.isMesh && !r._skipTraverse) {
          const n = r;
          if (n.geometry) {
            const o = new d.Box3().setFromObject(n);
            o.isEmpty() || i.union(o);
          }
        } else if (r.isBatchedMesh && !r._skipTraverse) {
          const n = r;
          if (n.computeBoundingBox) {
            if (n.computeBoundingBox(), n.boundingBox) {
              const o = n.boundingBox.clone().applyMatrix4(n.matrixWorld);
              i.union(o);
            }
          } else {
            const o = new d.Box3().setFromObject(n);
            o.isEmpty() || i.union(o);
          }
        }
      }
    }), this.contentGroup.traverse((r) => {
      delete r._skipTraverse;
    }), this.chunks.length > 0 && this.chunks.forEach((r) => {
      (!e || r.loaded) && i.union(r.bounds);
    }), i.isEmpty() && !this.precomputedBounds.isEmpty()) {
      const r = this.precomputedBounds.clone();
      return this.globalOffset.length() > 0 && r.translate(this.globalOffset.clone().negate()), r;
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
    const r = new d.Box3();
    e.userData?.boundingBox ? r.copy(e.userData.boundingBox).applyMatrix4(e.matrixWorld) : r.setFromObject(e), r.isEmpty() || t.union(r);
  }
  unionTilesNodeBounds(e, t, i = !1) {
    if (i && e?.visible === !1) return;
    const r = e?.userData?.tilesBoundingVolumeBox;
    if (!Array.isArray(r) || r.length < 12) return;
    const n = new d.Vector3(r[0], r[1], r[2]), o = new d.Vector3(r[3], r[4], r[5]), a = new d.Vector3(r[6], r[7], r[8]), c = new d.Vector3(r[9], r[10], r[11]), u = new d.Vector3(o.length(), a.length(), c.length()), l = new d.Box3(n.clone().sub(u), n.clone().add(u));
    l.isEmpty() || t.union(l);
  }
  unionOptimizedBounds(e, t, i = !1) {
    const r = this.optimizedMapping.get(e);
    if (!r || r.length === 0) return;
    const n = new d.Matrix4();
    for (const o of r) {
      if (i && !this.isWorldVisible(o.mesh)) continue;
      const a = o.geometry || o.mesh.geometry;
      if (a.boundingBox || a.computeBoundingBox(), !a.boundingBox) continue;
      o.mesh.getMatrixAt(o.instanceId, n), n.premultiply(o.mesh.matrixWorld);
      const c = a.boundingBox.clone().applyMatrix4(n);
      c.isEmpty() || t.union(c);
    }
  }
  unionNodeBounds(e, t, i = /* @__PURE__ */ new Set(), r = !1) {
    if (!e || i.has(e)) return;
    i.add(e);
    const n = this.contentGroup.getObjectByProperty("uuid", e);
    n && this.unionObjectBounds(n, t, r), this.unionOptimizedBounds(e, t, r);
    const o = this.nodeMap.get(e) || [];
    for (const a of o) {
      this.unionTilesNodeBounds(a, t, r);
      const c = Array.isArray(a.children) ? a.children : [];
      for (const u of c)
        this.unionNodeBounds(u.id, t, i, r);
    }
  }
  fitViewToObject(e) {
    let t = me(this.getHighlightContext(), [e]);
    t.isEmpty() && (t = new d.Box3(), this.unionNodeBounds(e, t, /* @__PURE__ */ new Set(), !0)), t.isEmpty() || this.fitBox(t, !1, 1.14, !1);
  }
  getBoundsForObject(e) {
    if (!e) return null;
    let t = me(this.getHighlightContext(), [e]);
    return t.isEmpty() && (t = new d.Box3(), this.unionNodeBounds(e, t, /* @__PURE__ */ new Set(), !0)), t.isEmpty() ? null : t;
  }
  collectBoundsForUuids(e) {
    const t = me(this.getHighlightContext(), e);
    if (!t.isEmpty()) return t;
    const i = new d.Box3();
    return Array.from(new Set((e || []).filter(Boolean))).forEach((n) => this.unionNodeBounds(n, i, /* @__PURE__ */ new Set(), !0)), i;
  }
  fitViewToObjects(e) {
    const t = this.collectBoundsForUuids(e);
    t.isEmpty() || this.fitBox(t, !1, 1.14, !1);
  }
  fitBox(e, t = !0, i, r = !0) {
    if (this.cancelCameraFlight(), e.isEmpty()) {
      this.camera.zoom = 1, this.camera.position.set(1e3, 1e3, 1e3), this.camera.lookAt(0, 0, 0), this.controls.target.set(0, 0, 0), this.camera.updateProjectionMatrix(), this.controls.update(), this.markSceneDirty({ needsCulling: r });
      return;
    }
    const n = e.getCenter(new d.Vector3()), o = e.getSize(new d.Vector3()), a = Math.max(o.x, o.y, o.z), c = a > 0 ? a : 100, u = i ?? 1.02, l = this.canvas.clientWidth, h = this.canvas.clientHeight, f = l / h;
    let p, m;
    f >= 1 ? (p = c * u, m = p * f) : (m = c * u, p = m / f);
    const y = Math.max(c * 5, 200);
    this.camera.near = -y, this.camera.far = y;
    let g = 1, M = -m / 2, x = m / 2, b = p / 2, k = -p / 2;
    const C = this.cameraFlightToken;
    if (t) {
      const w = new d.Vector3(1, -1, 1).normalize(), P = Math.max(c * 2.2, 5), B = n.clone().add(w.multiplyScalar(P)), R = n.clone(), O = this.camera.left, D = this.camera.right, z = this.camera.top, S = this.camera.bottom, E = this.camera.position.distanceTo(B), N = this.controls.target.distanceTo(R);
      if (E < 1e-3 && N < 1e-3) {
        this.controls.target.copy(R), this.camera.position.copy(B), this.camera.left = M, this.camera.right = x, this.camera.top = b, this.camera.bottom = k, this.camera.zoom = g, this.camera.lookAt(this.controls.target), this.camera.updateProjectionMatrix(), this.controls.update(), this.markSceneDirty({ needsCulling: r });
        return;
      }
      const v = this.camera.position.clone(), A = this.controls.target.clone(), U = performance.now(), $ = 420, F = () => {
        if (C !== this.cameraFlightToken) return;
        const H = performance.now() - U, V = Math.min(H / $, 1), G = 1 - Math.pow(1 - V, 3);
        this.camera.position.lerpVectors(v, B, G), this.controls.target.lerpVectors(A, R, G), this.camera.lookAt(this.controls.target), this.camera.zoom = g, this.camera.left = O + (M - O) * G, this.camera.right = D + (x - D) * G, this.camera.top = z + (b - z) * G, this.camera.bottom = S + (k - S) * G, this.camera.updateProjectionMatrix(), this.controls.update(), this.markSceneDirty({ needsCulling: r }), V < 1 ? this.cameraFlightFrameId = requestAnimationFrame(F) : (this.cameraFlightFrameId = null, this.markSceneDirty({ needsCulling: r }));
      };
      F();
    } else {
      const w = new d.Vector3();
      this.camera.getWorldDirection(w);
      const P = this.camera.position.distanceTo(this.controls.target), B = n.clone().add(w.multiplyScalar(-P)), R = n.clone(), O = 1.01, D = new d.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion), z = new d.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion), S = Math.max(1e-6, (this.camera.right - this.camera.left) * 0.5), E = Math.max(1e-6, (this.camera.top - this.camera.bottom) * 0.5), N = [
        new d.Vector3(e.min.x, e.min.y, e.min.z),
        new d.Vector3(e.min.x, e.min.y, e.max.z),
        new d.Vector3(e.min.x, e.max.y, e.min.z),
        new d.Vector3(e.min.x, e.max.y, e.max.z),
        new d.Vector3(e.max.x, e.min.y, e.min.z),
        new d.Vector3(e.max.x, e.min.y, e.max.z),
        new d.Vector3(e.max.x, e.max.y, e.min.z),
        new d.Vector3(e.max.x, e.max.y, e.max.z)
      ];
      let v = 0, A = 0;
      for (let Q = 0; Q < N.length; Q++) {
        const q = N[Q].clone().sub(n);
        v = Math.max(v, Math.abs(q.dot(D))), A = Math.max(A, Math.abs(q.dot(z)));
      }
      const U = Math.max(1e-3, v * O), $ = Math.max(1e-3, A * O);
      g = Math.max(
        1e-4,
        Math.min(1e6, Math.min(S / U, E / $))
      );
      const F = this.camera.position.clone(), H = this.controls.target.clone(), V = this.camera.zoom, G = performance.now(), Z = this.camera.position.distanceTo(B), ne = this.controls.target.distanceTo(R), te = Math.abs(this.camera.zoom - g);
      if (Z < 1e-3 && ne < 1e-3 && te < 1e-4) {
        this.camera.position.copy(B), this.controls.target.copy(R), this.camera.lookAt(this.controls.target), this.camera.zoom = g, this.camera.updateProjectionMatrix(), this.controls.update(), this.markSceneDirty({ needsCulling: r });
        return;
      }
      const ie = 420, K = () => {
        if (C !== this.cameraFlightToken) return;
        const Q = performance.now() - G, q = Math.min(Q / ie, 1), J = 1 - Math.pow(1 - q, 3);
        this.camera.position.lerpVectors(F, B, J), this.controls.target.lerpVectors(H, R, J), this.camera.lookAt(this.controls.target), this.camera.zoom = V + (g - V) * J, this.camera.updateProjectionMatrix(), this.controls.update(), this.markSceneDirty({ needsCulling: r }), q < 1 ? this.cameraFlightFrameId = requestAnimationFrame(K) : (this.cameraFlightFrameId = null, this.markSceneDirty({ needsCulling: r }));
      };
      K();
    }
  }
  setView(e) {
    let t = this.computeTotalBounds(!0);
    t.isEmpty() && (t = this.computeTotalBounds(!1)), this.sceneBounds = t.clone();
    const i = t.isEmpty() ? new d.Vector3(0, 0, 0) : t.getCenter(new d.Vector3()), r = t.isEmpty() ? new d.Vector3(100, 100, 100) : t.getSize(new d.Vector3()), n = Math.max(r.x, r.y, r.z), o = Math.max(n * 2, 10);
    let a = new d.Vector3();
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
    const i = new d.Box3();
    if (t.group.traverse((c) => {
      if ((c.isMesh || c.isLine || c.isSprite) && (c.updateMatrixWorld(), c.geometry)) {
        c.geometry.boundingBox || c.geometry.computeBoundingBox();
        const u = c.geometry.boundingBox.clone();
        u.applyMatrix4(c.matrixWorld), i.union(u);
      }
    }), i.isEmpty()) return;
    const r = i.getCenter(new d.Vector3()), n = i.getSize(new d.Vector3()), o = Math.max(n.x, n.y, n.z) || 1;
    this.controls.target.copy(r);
    const a = (this.camera.top - this.camera.bottom) / (o * 0.5);
    this.camera.zoom = Math.min(a, 100), this.camera.updateProjectionMatrix(), this.controls.update(), this.markSceneDirty();
  }
  // --- 测量逻辑 ---
  startMeasurement(e) {
    this.measureType = e, this.currentMeasurePoints = [], this.currentMeasureModelUuid = null, this.clearMeasurementPreview();
  }
  addMeasurePoint(e, t) {
    const i = this.getMeasurementContext(), r = bs(i, e, t);
    return this.syncMeasurementState(r.state), r.needsRender && this.markSceneDirty(), r.completed ?? null;
  }
  updateMeasurePreview(e) {
    const t = this.getMeasurementContext(), i = ze(t, e);
    this.syncMeasurementState(i.state), i.needsRender && this.markSceneDirty();
  }
  updateMeasureHover(e, t) {
    const i = this.getMeasurementContext(), r = Ms(i, e, t);
    this.syncMeasurementState(r.state), r.needsRender && this.markSceneDirty();
  }
  finalizeMeasurement() {
    const e = this.getMeasurementContext(), t = Bt(e);
    return this.syncMeasurementState(t.state), t.needsRender && this.markSceneDirty(), t.completed ?? null;
  }
  highlightMeasurement(e) {
    const t = ks(this.getMeasurementContext(), e);
    this.syncMeasurementState(t.state), this.markSceneDirty();
  }
  pickMeasurement(e, t) {
    return Cs(this.getMeasurementContext(), e, t);
  }
  /**
   * 获取对象的面积和体积
   */
  getObjectGeometryData(e) {
    return Wi({
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
    const i = Jt(this.boxSelectState, e, t);
    this.syncBoxSelectState(i.state), this.markSceneDirty();
  }
  /**
   * 更新框选范围
   */
  updateBoxSelect(e, t) {
    const i = ei(this.boxSelectState, e, t);
    this.syncBoxSelectState(i.state), i.needsRender && this.markSceneDirty();
  }
  /**
   * 完成框选，返回选中的对象 UUID 列表
   */
  endBoxSelect() {
    const e = ti(
      this.boxSelectState,
      this.canvas,
      (t, i, r, n) => this.selectByScreenRect(t, i, r, n)
    );
    return this.syncBoxSelectState(e.state), e.needsRender && this.markSceneDirty(), e.selected;
  }
  /**
   * 取消框选
   */
  cancelBoxSelect() {
    const e = ot(this.boxSelectState);
    this.syncBoxSelectState(e.state), this.markSceneDirty();
  }
  /**
   * 通过屏幕矩形选择对象
   */
  selectByScreenRect(e, t, i, r) {
    const n = It(this.getPickingContext());
    return this.syncPickingState(n), vs(
      {
        camera: this.camera,
        interactableList: this.interactableList
      },
      e,
      t,
      i,
      r
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
    const e = this.getMeasurementContext(), t = vt(e);
    this.syncMeasurementState(t.state), this.markSceneDirty();
  }
  // --- 剖切逻辑 ---
  setupClipping() {
    const e = Ui(this.getClippingContext());
    this.syncClippingState(e.state), this.markSceneDirty();
  }
  setClipHelperOptions(e) {
    const t = Fi(this.getClippingContext(), e);
    this.syncClippingState(t.state), this.markSceneDirty();
  }
  setClippingEnabled(e) {
    this.renderer.clippingPlanes = e ? this.clippingPlanes : [], e || this.clipPlaneHelpers.forEach((t) => t.visible = !1), this.markSceneDirty();
  }
  updateClippingPlanes(e, t, i) {
    const r = Ei(this.getClippingContext(), e, t, i);
    this.syncClippingState(r.state), r.needsRender && this.markSceneDirty();
  }
  /**
   * 检查包围盒是否完全被当前剖切面裁剪掉
   * 如果包围盒完全在任意一个激活的剖切面的“背面”，则认为被裁剪
   */
  isBoxClipped(e) {
    return Vi(this.clippingPlanes, e);
  }
  getStats() {
    return As({
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
    this.disposed = !0, this.animateFramePending = !1, this.cancelCameraFlight(), this.cancelBoxSelect(), Gi({
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
async function Ns(s) {
  const e = new Vt();
  return new Promise((t, i) => {
    e.parse(
      s,
      (r) => {
        const n = new Blob([r], { type: "model/gltf-binary" });
        t(n);
      },
      (r) => i(r),
      { binary: !0 }
    );
  });
}
async function Hs(s, e) {
  e("准备LMB导出...");
  const t = [], i = [], r = /* @__PURE__ */ new Map();
  s.updateMatrixWorld(!0);
  const n = new d.Vector3(0, 0, 0);
  s.userData.originalCenter && n.copy(s.userData.originalCenter), s.traverse((g) => {
    if (g.isMesh && g.visible) {
      t.push(g);
      const M = g.material, x = M.color ? M.color.getHex() : 16777215;
      r.has(x.toString()) || (r.set(x.toString(), i.length), i.push(x));
    }
  });
  const o = [], a = new TextEncoder(), c = new ArrayBuffer(20), u = new DataView(c);
  u.setFloat32(0, n.x, !0), u.setFloat32(4, n.y, !0), u.setFloat32(8, n.z, !0), u.setUint32(12, i.length, !0), u.setUint32(16, t.length, !0), o.push(c);
  const l = new ArrayBuffer(i.length * 4), h = new DataView(l);
  for (let g = 0; g < i.length; g++)
    h.setUint32(g * 4, i[g], !0);
  o.push(l);
  for (let g = 0; g < t.length; g++) {
    const M = Math.floor(g / t.length * 100);
    g % 10 === 0 && e(`Encoding mesh ${g + 1}/${t.length} (${M}%)`);
    const x = t[g], b = x.geometry;
    if (!b.getAttribute("position")) continue;
    const k = b.getAttribute("position"), C = b.getAttribute("normal"), w = b.index, P = a.encode(x.name || `Node_${g}`), B = new ArrayBuffer(2);
    new DataView(B).setUint16(0, P.length, !0), o.push(B), o.push(P.buffer);
    const R = (4 - (2 + P.length) % 4) % 4;
    R > 0 && o.push(new Uint8Array(R).buffer);
    const D = x.matrixWorld.elements, z = new ArrayBuffer(36), S = new DataView(z), E = [0, 1, 2, 4, 5, 6, 8, 9, 10];
    for (let I = 0; I < 9; I++) S.setFloat32(I * 4, D[E[I]], !0);
    o.push(z);
    const N = new ArrayBuffer(12), v = new DataView(N);
    v.setFloat32(0, D[12], !0), v.setFloat32(4, D[13], !0), v.setFloat32(8, D[14], !0), o.push(N);
    let A = 1 / 0, U = 1 / 0, $ = 1 / 0, F = -1 / 0, H = -1 / 0, V = -1 / 0;
    for (let I = 0; I < k.count; I++) {
      const T = k.getX(I), X = k.getY(I), Y = k.getZ(I);
      T < A && (A = T), X < U && (U = X), Y < $ && ($ = Y), T > F && (F = T), X > H && (H = X), Y > V && (V = Y);
    }
    F === A && (F += 1e-3), H === U && (H += 1e-3), V === $ && (V += 1e-3);
    const G = F - A, Z = H - U, ne = V - $, te = (A + F) / 2, ie = (U + H) / 2, K = ($ + V) / 2, Q = 32767 / (G * 0.5), q = 32767 / (Z * 0.5), J = 32767 / (ne * 0.5), le = new ArrayBuffer(24), W = new DataView(le);
    W.setFloat32(0, te, !0), W.setFloat32(4, ie, !0), W.setFloat32(8, K, !0), W.setFloat32(12, Q, !0), W.setFloat32(16, q, !0), W.setFloat32(20, J, !0), o.push(le);
    const _ = k.count, ue = new ArrayBuffer(4);
    new DataView(ue).setUint32(0, _, !0), o.push(ue);
    const oe = k.getX(0), de = k.getY(0), fe = k.getZ(0);
    W.setFloat32(0, oe, !0), W.setFloat32(4, de, !0), W.setFloat32(8, fe, !0);
    const Te = Math.max(Math.abs(F - oe), Math.abs(A - oe)), Ue = Math.max(Math.abs(H - de), Math.abs(U - de)), Fe = Math.max(Math.abs(V - fe), Math.abs($ - fe)), Ee = Te > 1e-4 ? 32767 / Te : 1, Ve = Ue > 1e-4 ? 32767 / Ue : 1, Ge = Fe > 1e-4 ? 32767 / Fe : 1;
    W.setFloat32(12, Ee, !0), W.setFloat32(16, Ve, !0), W.setFloat32(20, Ge, !0);
    const ke = (_ - 1) * 6, We = new ArrayBuffer(ke > 0 ? ke : 0);
    if (ke > 0) {
      const I = new DataView(We);
      for (let T = 1; T < _; T++) {
        const X = k.getX(T), Y = k.getY(T), xe = k.getZ(T), we = Math.round((X - oe) * Ee), Se = Math.round((Y - de) * Ve), ve = Math.round((xe - fe) * Ge), ee = (T - 1) * 6;
        I.setInt16(ee, we, !0), I.setInt16(ee + 2, Se, !0), I.setInt16(ee + 4, ve, !0);
      }
    }
    o.push(We);
    const Ne = new ArrayBuffer(_ * 4), zt = new DataView(Ne);
    for (let I = 0; I < _; I++) {
      let T = 0, X = 0, Y = 1;
      C && (T = C.getX(I), X = C.getY(I), Y = C.getZ(I));
      const xe = (we, Se, ve) => {
        const ee = (Ft) => Math.max(0, Math.min(1023, Math.round((Ft + 1) * 511)));
        return ee(we) << 20 | ee(Se) << 10 | ee(ve);
      };
      zt.setUint32(I * 4, xe(T, X, Y), !0);
    }
    o.push(Ne);
    const Ce = w ? w.count : _, ae = _ <= 255 ? 1 : _ <= 65535 ? 2 : 4, He = new ArrayBuffer(Ce * ae), se = new DataView(He);
    if (w)
      for (let I = 0; I < Ce; I++) {
        const T = w.getX(I);
        ae === 1 ? se.setUint8(I, T) : ae === 2 ? se.setUint16(I * 2, T, !0) : se.setUint32(I * 4, T, !0);
      }
    else
      for (let I = 0; I < Ce; I++)
        ae === 1 ? se.setUint8(I, I) : ae === 2 ? se.setUint16(I * 2, I, !0) : se.setUint32(I * 4, I, !0);
    o.push(He);
    const $e = x.material, Tt = $e.color ? $e.color.getHex() : 16777215, Ut = r.get(Tt.toString()) || 0, _e = new ArrayBuffer(4);
    new DataView(_e).setUint32(0, Ut, !0), o.push(_e);
    const Qe = new ArrayBuffer(4);
    new DataView(Qe).setUint32(0, 0, !0), o.push(Qe);
  }
  e("完成LMB文件...");
  const f = o.reduce((g, M) => g + M.byteLength, 0), p = new ArrayBuffer(f), m = new Uint8Array(p);
  let y = 0;
  for (const g of o)
    m.set(new Uint8Array(g), y), y += g.byteLength;
  return new Blob([p], { type: "application/octet-stream" });
}
export {
  Ws as S,
  ye as a,
  Hs as b,
  Ns as e,
  ce as s
};
