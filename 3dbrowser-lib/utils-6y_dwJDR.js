import * as h from "three";
import { OrbitControls as bt } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFExporter as wt } from "three/examples/jsm/exporters/GLTFExporter.js";
function vt(s) {
  let e = 0;
  if (s.attributes)
    for (const t in s.attributes) {
      const i = s.attributes[t];
      i.array && (e += i.array.byteLength);
    }
  return s.index && s.index.array && (e += s.index.array.byteLength), e / (1024 * 1024);
}
function St(s) {
  if (!s.getAttribute("position")) return new h.BoxGeometry(0.1, 0.1, 0.1);
  const e = new h.BufferGeometry(), t = s.getAttribute("position");
  if (t.isInterleavedBufferAttribute) {
    const o = new Float32Array(t.count * 3);
    for (let r = 0; r < t.count; r++)
      o[r * 3] = t.getX(r), o[r * 3 + 1] = t.getY(r), o[r * 3 + 2] = t.getZ(r);
    e.setAttribute("position", new h.BufferAttribute(o, 3));
  } else
    e.setAttribute("position", t.clone());
  const i = s.getAttribute("normal");
  if (i)
    if (i.isInterleavedBufferAttribute) {
      const o = new Float32Array(i.count * 3);
      for (let r = 0; r < i.count; r++)
        o[r * 3] = i.getX(r), o[r * 3 + 1] = i.getY(r), o[r * 3 + 2] = i.getZ(r);
      e.setAttribute("normal", new h.BufferAttribute(o, 3));
    } else
      e.setAttribute("normal", i.clone());
  else
    e.computeVertexNormals();
  const n = s.getIndex();
  if (n)
    e.setIndex(n.clone());
  else {
    const o = t.count, r = new Uint32Array(o);
    for (let a = 0; a < o; a++) r[a] = a;
    e.setIndex(new h.BufferAttribute(r, 1));
  }
  return e.deleteAttribute("uv"), e.deleteAttribute("uv2"), e.deleteAttribute("color"), e.computeBoundingBox(), e;
}
function le(s) {
  if (s.userData.color !== void 0) return s.userData.color;
  const e = s.geometry;
  if (e && e.attributes.color) {
    const i = e.attributes.color;
    if (i.count > 0) {
      const n = i.getX(0), o = i.getY(0), r = i.getZ(0), a = new h.Color();
      return n > 1 || o > 1 || r > 1 ? a.setRGB(n / 255, o / 255, r / 255) : a.setRGB(n, o, r), a.getHex();
    }
  }
  const t = s.material;
  if (Array.isArray(t)) {
    for (const i of t)
      if (i.color) return i.color.getHex();
  } else if (t.color)
    return t.color.getHex();
  return Bt(s.name);
}
function Bt(s) {
  return 9741240;
}
function It(s) {
  const e = [], t = new h.Matrix4();
  return s.updateMatrixWorld(!0), s.traverse((i) => {
    if (i.isMesh) {
      const n = i, o = n.geometry, r = n.material;
      if (!o) return;
      o.boundingBox || o.computeBoundingBox();
      const a = n.matrixWorld, c = new h.Vector3();
      o.boundingBox.getCenter(c), c.applyMatrix4(a);
      const u = Array.isArray(r) ? r[0]?.uuid : r?.uuid, d = `${o.uuid}_${u}`;
      if (n.isInstancedMesh) {
        const l = n;
        for (let p = 0; p < l.count; p++) {
          l.getMatrixAt(p, t), t.premultiply(a);
          const f = new h.Vector3();
          o.boundingBox.getCenter(f), f.applyMatrix4(t), e.push({
            id: d,
            uuid: n.uuid,
            sourceMesh: n,
            expressID: l.userData.expressID,
            geometry: o,
            material: r,
            color: le(n),
            matrix: t.clone(),
            center: f
          });
        }
      } else
        e.push({
          id: d,
          uuid: n.uuid,
          sourceMesh: n,
          expressID: n.userData.expressID,
          geometry: o,
          material: r,
          color: le(n),
          matrix: a.clone(),
          center: c
        });
    }
  }), e;
}
async function Pt(s, e = {}) {
  const t = [], i = new h.Matrix4(), n = e.batchSize ?? 4e3;
  s.updateMatrixWorld(!0);
  const o = [];
  s.traverse((r) => {
    r.isMesh && o.push(r);
  });
  for (let r = 0; r < o.length; r += n) {
    const a = o.slice(r, r + n);
    for (const c of a) {
      const u = c, d = u.geometry, l = u.material;
      if (!d) continue;
      d.boundingBox || d.computeBoundingBox();
      const p = u.matrixWorld, f = new h.Vector3();
      d.boundingBox.getCenter(f), f.applyMatrix4(p);
      const m = Array.isArray(l) ? l[0]?.uuid : l?.uuid, g = `${d.uuid}_${m}`;
      if (u.isInstancedMesh) {
        const M = u;
        for (let y = 0; y < M.count; y++) {
          M.getMatrixAt(y, i), i.premultiply(p);
          const b = new h.Vector3();
          d.boundingBox.getCenter(b), b.applyMatrix4(i), t.push({
            id: g,
            uuid: u.uuid,
            sourceMesh: u,
            expressID: M.userData.expressID,
            geometry: d,
            material: l,
            color: le(u),
            matrix: i.clone(),
            center: b
          });
        }
      } else
        t.push({
          id: g,
          uuid: u.uuid,
          sourceMesh: u,
          expressID: u.userData.expressID,
          geometry: d,
          material: l,
          color: le(u),
          matrix: p.clone(),
          center: f
        });
    }
    e.onProgress?.(Math.min(r + a.length, o.length), o.length), await new Promise((c) => requestAnimationFrame(() => c()));
  }
  return t;
}
function Ze(s, e, t, i = 0) {
  if (s.length <= t.maxItemsPerNode || i >= t.maxDepth)
    return { bounds: e.clone(), children: null, items: s, level: i };
  const n = e.getCenter(new h.Vector3()), o = e.min, r = e.max, a = Array(8).fill(null).map(() => []);
  for (const d of s) {
    const l = d.center, p = (l.x >= n.x ? 1 : 0) | (l.y >= n.y ? 2 : 0) | (l.z >= n.z ? 4 : 0);
    a[p].push(d);
  }
  const c = [];
  let u = !1;
  for (let d = 0; d < 8; d++)
    if (a[d].length > 0) {
      const l = new h.Vector3(d & 1 ? n.x : o.x, d & 2 ? n.y : o.y, d & 4 ? n.z : o.z), p = new h.Vector3(d & 1 ? r.x : n.x, d & 2 ? r.y : n.y, d & 4 ? r.z : n.z), f = new h.Box3(l, p);
      c.push(Ze(a[d], f, t, i + 1)), u = !0;
    }
  return u ? { bounds: e.clone(), children: c, items: [], level: i } : { bounds: e.clone(), children: null, items: s, level: i };
}
async function Rt(s, e, t = {}) {
  if (s.length === 0) return null;
  const i = t.batchSize ?? 1200, n = t.yieldControl ?? (() => new Promise((g) => requestAnimationFrame(() => g())));
  let o = 0, r = 0;
  const a = /* @__PURE__ */ new Map(), c = [];
  for (let g = 0; g < s.length; g++) {
    const M = s[g];
    let y = a.get(M.geometry);
    y || (y = St(M.geometry), a.set(M.geometry, y)), c.push({
      ...M,
      geometry: y
    }), o += y.attributes.position.count, y.index && (r += y.index.count), g > 0 && g % i === 0 && await n();
  }
  const u = new h.BatchedMesh(c.length, o, r, e);
  u.frustumCulled = !1, u.perInstanceFrustumCulling = !1;
  const d = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
  for (let g = 0; g < c.length; g++) {
    const M = c[g];
    let y = d.get(M.geometry);
    if (y === void 0 && (y = u.addGeometry(M.geometry), d.set(M.geometry, y)), y !== -1) {
      const b = u.addInstance(y);
      u.setMatrixAt(b, M.matrix), M.geometry.boundingBox || M.geometry.computeBoundingBox(), u.setBoundingBoxAt && u.setBoundingBoxAt(b, M.geometry.boundingBox);
      const C = new h.Color(M.color);
      u.setColorAt(b, C), M.expressID !== void 0 && l.set(b, M.expressID), p.set(b, M.uuid), f.set(b, M.color), m.set(b, M.geometry);
    }
    g > 0 && g % i === 0 && await n();
  }
  return u.userData.batchIdToExpressId = l, u.userData.batchIdToUuid = p, u.userData.batchIdToColor = f, u.userData.batchIdToGeometry = m, u.computeBoundingBox(), u.computeBoundingSphere(), u;
}
function Ke(s, e = []) {
  if (s.children)
    for (const t of s.children)
      Ke(t, e);
  else s.items.length > 0 && e.push(s);
  return e;
}
function Lt(s, e) {
  const t = Math.max(2, s), i = e === "smooth" ? 0.85 : e === "quality" ? 1.15 : 1, n = Math.max(20, Math.min(128, Math.floor(t * 10 * i))), o = Math.max(8, Math.min(48, Math.floor(t * 3 * i)));
  return {
    maxConcurrentChunkLoads: n,
    maxChunkLoadsPerFrame: o
  };
}
const je = typeof window < "u" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
function xe(s, ...e) {
  je && console.log(`[${s}]`, ...e);
}
function At(s, ...e) {
  je && console.warn(`[${s}]`, ...e);
}
function Ot(s, e) {
  let t = 2166136261;
  for (let r = 0; r < s.length; r++)
    t ^= s.charCodeAt(r), t = Math.imul(t, 16777619);
  const i = (t >>> 0) / 4294967295 * Math.PI * 2, n = (t >>> 9 & 1023) / 1023 * 2 - 1, o = Math.sqrt(Math.max(0, 1 - n * n));
  return e.set(Math.cos(i) * o, Math.sin(i) * o, n).normalize(), e;
}
async function Dt(s) {
  const e = await s.slice(0, 1024).arrayBuffer(), t = new DataView(e);
  return {
    magic: t.getUint32(0, !0),
    version: t.getUint32(4, !0),
    manifestOffset: t.getUint32(8, !0),
    manifestLength: t.getUint32(12, !0)
  };
}
async function zt(s, e) {
  const i = await s.slice(e.manifestOffset, e.manifestOffset + e.manifestLength).text();
  return JSON.parse(i);
}
function Tt(s) {
  if (s.rectElement) return s.rectElement;
  const e = document.createElement("div");
  return e.style.cssText = `
        position: fixed; border: 1px dashed #00aaff;
        background: rgba(0, 170, 255, 0.08); pointer-events: none; z-index: 1000;
    `, document.body.appendChild(e), s.rectElement = e, e;
}
function Je(s) {
  const e = Tt(s);
  e.style.left = `${Math.min(s.startX, s.endX)}px`, e.style.top = `${Math.min(s.startY, s.endY)}px`, e.style.width = `${Math.abs(s.endX - s.startX)}px`, e.style.height = `${Math.abs(s.endY - s.startY)}px`;
}
function Ut() {
  return {
    active: !1,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    rectElement: null
  };
}
function Ft(s, e, t) {
  const i = {
    ...s,
    active: !0,
    startX: e,
    startY: t,
    endX: e,
    endY: t
  };
  return Je(i), { state: i };
}
function Gt(s, e, t) {
  if (!s.active)
    return { state: s };
  const i = {
    ...s,
    endX: e,
    endY: t
  };
  return Je(i), { state: i };
}
function et(s) {
  return s.rectElement && s.rectElement.remove(), {
    state: {
      ...s,
      active: !1,
      rectElement: null
    }
  };
}
function Vt(s, e, t) {
  if (!s.active)
    return {
      state: s,
      selected: []
    };
  const { state: i } = et(s), { startX: n, startY: o, endX: r, endY: a } = s, c = Math.abs(r - n), u = Math.abs(a - o);
  if (c < 5 || u < 5)
    return { state: i, selected: [] };
  const d = e.getBoundingClientRect(), l = (Math.min(n, r) - d.left) / d.width * 2 - 1, p = -(Math.max(o, a) - d.top) / d.height * 2 + 1, f = (Math.max(n, r) - d.left) / d.width * 2 - 1, m = -(Math.min(o, a) - d.top) / d.height * 2 + 1;
  return {
    state: i,
    selected: t(l, p, f, m)
  };
}
function Ie(s) {
  return `${s.nbimFileId || "local"}:${s.byteOffset || 0}:${s.byteLength || 0}`;
}
function Pe(s) {
  return Number.isFinite(s?.byteOffset) && Number.isFinite(s?.byteLength) && s.byteLength > 0;
}
function tt(s, e) {
  const t = s.filter((i) => i !== e);
  return t.push(e), t;
}
function Et(s) {
  const {
    chunkReadCache: e,
    chunkReadCacheOrder: t,
    cacheKey: i,
    buffer: n,
    chunkReadCacheSize: o
  } = s;
  e.set(i, n);
  let r = tt(t, i);
  for (; r.length > o; ) {
    const a = r.shift();
    a && e.delete(a);
  }
  return r;
}
async function Wt(s) {
  const {
    chunk: e,
    nbimFiles: t,
    chunkReadCache: i,
    chunkReadCacheOrder: n,
    chunkReadCacheSize: o
  } = s, r = Ie(e), a = i.get(r);
  if (a)
    return {
      buffer: a.slice(0),
      chunkReadCacheOrder: tt(n, r)
    };
  const c = t.get(e.nbimFileId);
  if (!c)
    throw new Error(`NBIM file not found for chunk: ${e.id}`);
  const u = await c.slice(e.byteOffset, e.byteOffset + e.byteLength).arrayBuffer();
  return {
    buffer: u,
    chunkReadCacheOrder: Et({
      chunkReadCache: i,
      chunkReadCacheOrder: n,
      cacheKey: r,
      buffer: u.slice(0),
      chunkReadCacheSize: o
    })
  };
}
function Ht(s) {
  const {
    chunkIds: e,
    chunkPrefetchWindow: t,
    prefetchQueue: i,
    prefetchQueueSet: n,
    prefetchInFlight: o
  } = s;
  if (t <= 0)
    return i;
  const r = [...i];
  for (const a of e)
    n.has(a) || o.has(a) || (r.push(a), n.add(a));
  return r;
}
function Nt(s) {
  const {
    visibleChunks: e,
    chunkPrefetchWindow: t,
    prefetchPaused: i,
    isCameraMoving: n,
    prefetchRoundRobinCursor: o,
    chunks: r,
    processingChunks: a,
    chunkReadCache: c,
    getChunkIndex: u
  } = s;
  if (t <= 0 || i || n || e.length === 0)
    return {
      chunkIds: [],
      prefetchRoundRobinCursor: o
    };
  const d = [];
  for (let l = 0; l < e.length && d.length < t; l++) {
    const p = e[(o + l) % e.length], f = u(p.id);
    if (f < 0) continue;
    const m = r[f + 1];
    if (!m || m.loaded || a.has(m.id) || !m.nbimFileId || !Pe(m)) continue;
    const g = Ie(m);
    c.has(g) || d.push(m.id);
  }
  return {
    chunkIds: d,
    prefetchRoundRobinCursor: o + 1
  };
}
function $t(s) {
  const { chunk: e, unregisterOptimizedMeshMapping: t, cacheChunkMesh: i, ensureChunkGhost: n } = s;
  if (!e.loaded || !e.mesh)
    return {
      changed: !1,
      chunkLoadedCountDelta: 0
    };
  const o = e.mesh;
  return t(o), o.parent && o.parent.remove(o), i(e, o), n(e), e.mesh = null, e.loaded = !1, {
    changed: !0,
    chunkLoadedCountDelta: -1
  };
}
async function _t(s) {
  const {
    chunk: e,
    sharedMaterial: t,
    takeCachedChunkMesh: i,
    yieldToMainThread: n,
    nbimFiles: o,
    hasValidChunkBinaryRange: r,
    readChunkBuffer: a,
    nbimMeta: c,
    runWorkerTask: u,
    reconstructBatchedMesh: d,
    isCameraMoving: l,
    chunkPrefetchWindow: p,
    getChunkIndex: f,
    chunks: m,
    processingChunks: g
  } = s, M = i(e.id);
  if (M)
    return { mesh: M, prefetchCandidates: [] };
  if (e.node)
    return { mesh: await Rt(e.node.items, t, {
      batchSize: 1200,
      yieldControl: () => n()
    }), prefetchCandidates: [] };
  if (e.nbimFileId && o.has(e.nbimFileId) && r(e)) {
    const y = await a(e), b = c.get(e.nbimFileId), C = b?.version ?? 8;
    if (C !== 8)
      throw new Error(`Unsupported NBIM version: ${C}. Only V8 is supported.`);
    const k = await u({
      buffer: y,
      version: C,
      originalUuid: e.originalUuid,
      bimIdTable: b?.bimIdTable
    }, [y]), x = d(k, t), v = [];
    if (!l && p > 0) {
      const P = f(e.id);
      if (P >= 0)
        for (let A = 1; A <= p; A++) {
          const L = m[P + A];
          if (!L) break;
          L.loaded || g.has(L.id) || !L.nbimFileId || !r(L) || v.push(L.id);
        }
    }
    return { mesh: x, prefetchCandidates: v };
  }
  return { mesh: null, prefetchCandidates: [] };
}
function Qt(s) {
  const {
    chunk: e,
    mesh: t,
    cancelledChunkIds: i,
    chunkIdSet: n,
    disposeChunkMesh: o,
    globalOffset: r,
    contentGroup: a,
    registerOptimizedMeshMapping: c
  } = s;
  if (i.has(e.id) || !n.has(e.id))
    return o(t), { attached: !1 };
  t.name = e.id, t.userData.chunkId = e.id, t.userData.originalUuid = e.originalUuid, e.nbimFileId && (t.position.sub(r), t.updateMatrixWorld(!0));
  let u = a.getObjectByName(e.groupName);
  return u || (u = new h.Group(), u.name = e.groupName, u.userData.isOptimizedGroup = !0, u.userData.originalUuid = e.originalUuid, a.add(u)), u.add(t), e.mesh = t, c(t), { attached: !0 };
}
function qt(s) {
  const {
    chunk: e,
    loadedNow: t,
    now: i,
    chunkLoadedCount: n,
    chunkWarmupActive: o,
    initialChunkLoadTarget: r,
    deactivateFastPreviewForModel: a
  } = s;
  let c = n, u = o, d = !1;
  return t && !e.loaded && (e.loaded = !0, c++, e.lastVisibleAt = i, e.lastFocusAt = i, e.originalUuid && a(e.originalUuid), u && c >= r && (u = !1), d = !0), {
    nextChunkLoadedCount: c,
    nextChunkWarmupActive: u,
    progressChanged: d
  };
}
function Xt(s) {
  const { chunkId: e, ghostGroup: t, releaseGhostLine: i } = s, n = t.getObjectByName(`ghost_${e}`);
  return n ? (t.remove(n), i(n), { changed: !0 }) : { changed: !1 };
}
function Yt(s) {
  const {
    isCameraMoving: e,
    loadedChunks: t,
    maxLoadedChunks: i,
    cameraPos: n,
    now: o,
    chunkResidencyMs: r
  } = s;
  if (e || t.length <= i)
    return [];
  const a = [...t].sort(
    (d, l) => l.center.distanceToSquared(n) - d.center.distanceToSquared(n)
  ), c = a.length - i, u = [];
  for (const d of a) {
    if (u.length >= c)
      break;
    const l = Math.max(d.lastVisibleAt || 0, d.lastFocusAt || 0);
    o - l < r || (!d.mesh || !d.mesh.visible) && u.push(d);
  }
  return u;
}
function Zt(s) {
  const {
    toLoad: e,
    now: t,
    chunkLoadResumeAt: i,
    maxConcurrentChunkLoads: n,
    processingChunkCount: o,
    chunkWarmupActive: r,
    chunkLoadedCount: a,
    initialChunkLoadTarget: c,
    warmupChunkBoost: u,
    getChunkFrameBudget: d,
    phase: l,
    profile: p
  } = s;
  if (e.length === 0 || t < i)
    return [];
  const f = [...e].sort((b, C) => C.priority - b.priority), m = n - o;
  if (m <= 0)
    return [];
  const g = r && a < c ? u : 0, M = d(l, p, g), y = Math.min(m, M, f.length);
  return f.slice(0, y);
}
function Kt(s) {
  const { data: e, material: t, resolveUuidByBimId: i } = s, { geometries: n, instances: o, originalUuid: r } = e, a = n.some((C) => C.index && C.index.length > 0), c = n.map((C) => {
    const k = new h.BufferGeometry();
    if (k.setAttribute("position", new h.BufferAttribute(C.position, 3)), k.setAttribute("normal", new h.BufferAttribute(C.normal, 3)), C.index && C.index.length > 0)
      k.setIndex(new h.BufferAttribute(C.index, 1));
    else if (a) {
      const x = C.position.length / 3, v = new Uint32Array(x);
      for (let P = 0; P < x; P++)
        v[P] = P;
      k.setIndex(new h.BufferAttribute(v, 1));
    }
    return k;
  });
  let u = 0, d = 0;
  c.forEach((C) => {
    u += C.attributes.position.count, C.index && (d += C.index.count);
  });
  const l = new h.BatchedMesh(o.length, u, d, t);
  l.frustumCulled = !1, l.perInstanceFrustumCulling = !1;
  const p = c.map((C) => l.addGeometry(C)), f = new h.Matrix4(), m = new h.Color(), g = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
  return o.forEach((C) => {
    m.setHex(C.color), f.fromArray(C.matrix);
    const k = l.addInstance(p[C.geoIdx]);
    l.setMatrixAt(k, f), l.setColorAt(k, m);
    const x = c[C.geoIdx];
    x.boundingBox || x.computeBoundingBox(), x.boundingBox && l.setBoundingBoxAt && l.setBoundingBoxAt(k, x.boundingBox);
    const v = C.bimId;
    g.set(k, i(r, v)), M.set(k, v), y.set(k, C.color), b.set(k, x);
  }), l.userData.batchIdToUuid = g, l.userData.batchIdToBimId = M, l.userData.batchIdToColor = y, l.userData.batchIdToGeometry = b, l.computeBoundingBox(), l.computeBoundingSphere(), l;
}
async function jt(s) {
  const {
    prefetchPaused: e,
    isCameraMoving: t,
    prefetchQueue: i,
    prefetchQueueSet: n,
    prefetchInFlight: o,
    maxWorkers: r,
    getChunkById: a,
    chunkReadCache: c,
    readChunkBuffer: u,
    processQueue: d
  } = s;
  if (e || t || i.length === 0)
    return;
  const l = Math.max(1, Math.min(4, Math.floor(r / 2)));
  for (; !e && !t && i.length > 0 && o.size < l; ) {
    const p = i.shift();
    if (!p) break;
    n.delete(p);
    const f = a(p);
    if (!f || !f.nbimFileId || !Pe(f))
      continue;
    const m = Ie(f);
    c.has(m) || (o.add(p), u(f).catch((g) => {
      At("SceneManager/prefetch", `prefetch failed for ${p}`, g);
    }).finally(() => {
      o.delete(p), i.length > 0 && d();
    }));
  }
}
function Jt(s) {
  const { mesh: e, sharedMaterial: t } = s;
  e.geometry && e.geometry.dispose(), e.material && e.material !== t && (Array.isArray(e.material) ? e.material : [e.material]).forEach((n) => n.dispose && n.dispose());
}
function it(s, e) {
  return [...s.filter((t) => t !== e), e];
}
function ei(s) {
  const {
    chunk: e,
    mesh: t,
    chunkMeshCache: i,
    chunkCacheOrder: n,
    maxCachedChunks: o,
    disposeChunkMesh: r
  } = s;
  if (i.has(e.id)) {
    const c = i.get(e.id);
    c !== t && r(c);
  }
  i.set(e.id, t);
  let a = it(n, e.id);
  for (; a.length > o; ) {
    const c = a.shift();
    if (!c) break;
    const u = i.get(c);
    u && (i.delete(c), r(u));
  }
  return {
    chunkMeshCache: i,
    chunkCacheOrder: a
  };
}
function ti(s) {
  const { chunkId: e, chunkMeshCache: t, chunkCacheOrder: i } = s, n = t.get(e) || null;
  return n ? (t.delete(e), {
    mesh: n,
    chunkCacheOrder: i.filter((o) => o !== e)
  }) : {
    mesh: null,
    chunkCacheOrder: i
  };
}
function ii(s) {
  const { chunkMeshCache: e, chunkCacheOrder: t, disposeChunkMesh: i, filter: n } = s;
  for (const [o, r] of e.entries())
    n && !n(o, r) || (i(r), e.delete(o));
  return t.filter((o) => e.has(o));
}
function si(s) {
  const { mesh: e, optimizedMapping: t } = s, i = e.userData.batchIdToUuid;
  if (i)
    for (const [n, o] of i.entries()) {
      const r = t.get(o);
      if (!r) continue;
      const a = r.findIndex((c) => c.mesh === e && c.instanceId === n);
      a !== -1 && r.splice(a, 1), r.length === 0 && t.delete(o);
    }
}
function ni(s) {
  const { mesh: e, optimizedMapping: t } = s, i = e.userData.batchIdToUuid, n = e.userData.batchIdToColor, o = e.userData.batchIdToGeometry;
  if (i)
    for (const [r, a] of i.entries()) {
      t.has(a) || t.set(a, []);
      const c = n?.get(r) ?? 16777215, u = o?.get(r);
      t.get(a).push({
        mesh: e,
        instanceId: r,
        originalColor: c,
        geometry: u
      });
    }
}
function ri(s) {
  const { ghostMeshPool: e, ghostEdgesGeometry: t, ghostMaterial: i } = s, n = e.pop();
  return n ? (n.visible = !0, n) : new h.LineSegments(t, i);
}
function oi(s) {
  const { line: e, ghostMeshPool: t } = s;
  e.visible = !1, e.name = "", e.scale.set(1, 1, 1), e.position.set(0, 0, 0), e.material instanceof h.LineBasicMaterial && (e.material.opacity = 0.3), t.push(e);
}
function ai(s) {
  const { name: e, bounds: t, acquireGhostLine: i } = s, n = new h.Vector3(), o = new h.Vector3();
  t.getSize(n), t.getCenter(o);
  const r = i();
  return r.name = e, r.scale.copy(n), r.position.copy(o), r;
}
function ci(s) {
  const { chunk: e, ghostGroup: t, createGhostLine: i } = s;
  if (t.getObjectByName(`ghost_${e.id}`))
    return;
  const n = i(`ghost_${e.id}`, e.bounds);
  t.add(n);
}
function hi(s) {
  const { workerQueue: e, data: t, transferables: i, processQueue: n } = s;
  return new Promise((o, r) => {
    e.push({ resolve: o, reject: r, data: t, transferables: i }), n();
  });
}
function li(s) {
  const {
    activeWorkerCount: e,
    maxWorkers: t,
    workerQueue: i,
    workers: n,
    createWorker: o,
    getActiveWorkerCount: r,
    onActiveWorkerCountChange: a,
    processQueue: c
  } = s;
  if (e >= t || i.length === 0)
    return;
  const u = i.shift();
  a(e + 1);
  const d = n.pop() ?? o(), l = (f) => {
    d.removeEventListener("message", l), d.removeEventListener("error", p), n.push(d), a(Math.max(0, r() - 1)), f.data.type === "success" ? u.resolve(f.data.result) : u.reject(new Error(f.data.error)), c();
  }, p = (f) => {
    d.removeEventListener("message", l), d.removeEventListener("error", p), a(Math.max(0, r() - 1)), u.reject(new Error(f.message)), c();
  };
  d.addEventListener("message", l), d.addEventListener("error", p), d.postMessage(u.data, u.transferables);
}
function ui(s) {
  const { workers: e, workerQueue: t, rejectReason: i } = s;
  for (const n of e)
    try {
      n.terminate();
    } catch (o) {
      console.warn("Worker terminate failed:", o);
    }
  t.length > 0 && t.splice(0, t.length).forEach((o) => o.reject(new Error(i)));
}
function di(s) {
  const { chunk: e, padding: t, tempSize: i } = s;
  if (!e.paddedBounds || e._padding !== t) {
    const n = e.bounds.getSize(i), o = e.bounds.clone();
    o.expandByVector(n.multiplyScalar(t)), e.paddedBounds = o, e._padding = t;
  }
  e.center || (e.center = e.bounds.getCenter(new h.Vector3()));
}
function pi(s) {
  const {
    chunk: e,
    chunkIndex: t,
    totalChunks: i,
    now: n,
    phase: o,
    profile: r,
    performanceMode: a,
    isBoxClipped: c,
    maxRenderDistance: u,
    cameraPos: d,
    cameraForward: l,
    projScreenMatrix: p,
    toChunkDirection: f,
    tempCenterNdc: m,
    viewHeight: g,
    canvasHeight: M,
    sampleUnloadedWhileMoving: y,
    movingSampleStride: b,
    movingSampleSeed: C,
    resolveShouldRefreshPeripheral: k,
    chunkWarmupActive: x,
    chunkLoadedCount: v,
    initialChunkLoadTarget: P,
    chunkLoadResumeAt: A,
    chunkMeshCached: L
  } = s;
  f.copy(e.center).sub(d);
  const R = f.length(), w = R < u;
  if (y && !e.loaded && t % b !== C)
    return {
      shouldSkipSample: !0,
      shouldBeVisible: !1,
      effectiveVisible: !1,
      isPeripheralWhileMoving: !1,
      shouldRefreshPeripheral: !0,
      centerPriorityWindow: !1,
      isPeripheralCandidate: !1,
      priority: null,
      dist: R,
      centrality: 0,
      forwardness: 0,
      pixelSize: 0
    };
  const S = e.bounds.getSize(new h.Vector3()).length() / g * M, T = m.copy(e.center).applyMatrix4(p), z = Math.sqrt(T.x * T.x + T.y * T.y), I = 1 - Math.min(1, z), O = R > 1e-5 ? Math.max(0, l.dot(f.divideScalar(R))) : 1, F = S < 4, H = o === "moving" && I < r.movingFocusCentralityThreshold && S < r.movingFocusPixelThreshold, V = s.inFrustum && !c && w && !F && !H, E = Math.max(e.lastVisibleAt || 0, e.lastFocusAt || 0), W = o === "moving" && s.inFrustum && !c && w && !F && n - E < r.chunkVisibilityHoldMs, X = I < r.movingCoreCentralityThreshold && S < r.movingCorePixelThreshold && O < r.movingCoreForwardThreshold, Y = k(X), _ = o === "moving" && X && !Y ? e.lastEffectiveVisible ?? e.mesh?.visible ?? !1 : V || W, N = x || n < A + r.centerPriorityWindowMs, Z = I < r.centerPriorityThreshold && O < r.forwardPriorityThreshold && S < 96;
  let ne = null;
  if (!e.loaded && V) {
    const de = I > 0.8 ? 4.5 : I > 0.62 ? 2.8 : 1, pe = Math.min(8, S / 120), fe = 1e3 / (R + 1), re = O * 550, G = L ? 420 : 0, $ = x && v < P ? I > 0.65 ? 1500 : I > 0.45 ? 500 : 0 : 0, oe = o === "moving" ? I > 0.65 || O > 0.7 ? 900 : I > 0.4 ? 250 : -250 : 0;
    o === "moving" && I < 0.08 && S < 18 || o === "moving" && X && !Y || o !== "moving" && N && Z || o === "moving" && a === "smooth" && I < 0.3 && S < 54 && O < 0.62 || (ne = oe + G + $ + re + de * 1e3 + pe * 120 + fe + I * 300);
  }
  return {
    shouldSkipSample: !1,
    shouldBeVisible: V,
    effectiveVisible: _,
    isPeripheralWhileMoving: X,
    shouldRefreshPeripheral: Y,
    centerPriorityWindow: N,
    isPeripheralCandidate: Z,
    priority: ne,
    dist: R,
    centrality: I,
    forwardness: O,
    pixelSize: S
  };
}
function fi(s) {
  const { now: e, total: t, loaded: i, lastReportedProgress: n, lastChunkProgressReportAt: o } = s, r = i !== n.loaded || t !== n.total, a = t === 0 || t > 0 && i >= t, c = e - o >= 48;
  return {
    shouldNotify: r && (c || a),
    nextProgress: { loaded: i, total: t },
    nextReportedAt: a || c ? e : o
  };
}
function mi(s) {
  const { chunkCount: e, compact: t, balanced: i, massive: n } = s;
  return e > 2e3 ? n : e > 600 ? i : t;
}
function gi(s) {
  const {
    forceMaxChunkLoadSpeed: e,
    maxChunkLoadsPerFrame: t,
    performanceMode: i,
    chunkCount: n,
    phase: o,
    profile: r,
    warmupExtra: a
  } = s;
  if (e)
    return t + a;
  const c = n > 2e3, u = n > 600;
  if (o === "moving") {
    const d = Math.max(
      r.movingLoadBudgetMin,
      Math.min(r.movingLoadBudgetMax, Math.floor(t / 4))
    );
    return i === "smooth" ? c ? Math.max(1, Math.floor(d * 0.35)) : u ? Math.max(1, Math.floor(d * 0.5)) : Math.max(1, Math.floor(d * 0.7)) : c ? Math.max(1, Math.floor(d * 0.55)) : u ? Math.max(1, Math.floor(d * 0.75)) : d;
  }
  if (o === "recovery") {
    const d = Math.max(
      r.recoveryLoadBudgetMin,
      Math.min(
        r.recoveryLoadBudgetMax,
        Math.floor(t * r.recoveryLoadBudgetRatio)
      )
    ), l = i === "smooth" ? Math.max(2, Math.floor(d * 0.6)) : 0;
    return d + l + a;
  }
  return t + a;
}
function Mi(s) {
  const { centrality: e, pixelSize: t, forwardness: i, profile: n } = s;
  return e < n.movingCoreCentralityThreshold && t < n.movingCorePixelThreshold && i < n.movingCoreForwardThreshold;
}
function yi(s) {
  const {
    now: e,
    isCameraMoving: t,
    chunkIndex: i,
    totalChunks: n,
    profile: o,
    movingPeripheralCursor: r,
    movingPeripheralLastRefreshAt: a
  } = s;
  if (!t || n === 0)
    return {
      shouldRefresh: !0,
      movingPeripheralCursor: r,
      movingPeripheralLastRefreshAt: a
    };
  let c = r, u = a;
  if (e - u >= o.movingPeripheralRefreshMs) {
    const m = Math.min(
      n,
      Math.max(o.movingPeripheralMinBatchSize, Math.ceil(n * o.movingPeripheralBatchRatio))
    );
    c = (c + m) % n, u = e;
  }
  const d = Math.min(
    n,
    Math.max(o.movingPeripheralMinBatchSize, Math.ceil(n * o.movingPeripheralBatchRatio))
  ), l = c, p = l + d;
  return {
    shouldRefresh: p <= n ? i >= l && i < p : i >= l || i < p % n,
    movingPeripheralCursor: c,
    movingPeripheralLastRefreshAt: u
  };
}
const Ci = [16711680, 16711680, 65280, 65280, 255, 255];
function st(s) {
  return s.map((e) => e.clone());
}
function ee(s, e, t, i, n, o, r) {
  if (!s) return;
  const a = o && r;
  s.visible = a, s.scale.set(Math.max(i, 1e-3), Math.max(n, 1e-3), 1), s.position.copy(t), s.lookAt(t.clone().add(e)), s.children.forEach((c) => {
    c.visible = a;
  });
}
function ki(s) {
  const e = [
    new h.Plane(new h.Vector3(1, 0, 0), 0),
    new h.Plane(new h.Vector3(-1, 0, 0), 0),
    new h.Plane(new h.Vector3(0, 1, 0), 0),
    new h.Plane(new h.Vector3(0, -1, 0), 0),
    new h.Plane(new h.Vector3(0, 0, 1), 0),
    new h.Plane(new h.Vector3(0, 0, -1), 0)
  ];
  s.renderer.clippingPlanes = [], s.clipHelpersGroup.clear();
  const t = Ci.map((i) => {
    const n = new h.PlaneGeometry(1, 1), o = new h.MeshBasicMaterial({
      color: i,
      transparent: !0,
      opacity: s.state.clipHelperOpacity,
      side: h.DoubleSide,
      depthWrite: !1,
      polygonOffset: !0,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
      clippingPlanes: []
    }), r = new h.Mesh(n, o);
    r.visible = !1, r.renderOrder = 9999;
    const a = new h.EdgesGeometry(n), c = new h.LineSegments(a, new h.LineBasicMaterial({
      color: i,
      transparent: !0,
      opacity: Math.min(1, s.state.clipHelperOpacity + 0.08),
      depthWrite: !1
    }));
    return c.visible = !1, c.renderOrder = 1e4, r.add(c), s.clipHelpersGroup.add(r), r;
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
function xi(s, e) {
  const t = {
    ...s.state,
    clippingPlanes: st(s.state.clippingPlanes),
    clipPlaneHelpers: [...s.state.clipPlaneHelpers],
    clipHelperVisible: typeof e.visible == "boolean" ? e.visible : s.state.clipHelperVisible,
    clipHelperOpacity: typeof e.opacity == "number" && !Number.isNaN(e.opacity) ? h.MathUtils.clamp(e.opacity, 0.05, 0.35) : s.state.clipHelperOpacity
  };
  return t.clipPlaneHelpers.forEach((i) => {
    const n = i.material;
    n.opacity = t.clipHelperOpacity, n.needsUpdate = !0, i.children.forEach((o) => {
      const r = o.material;
      r && (r.opacity = Math.min(1, t.clipHelperOpacity + 0.08), r.needsUpdate = !0);
    });
  }), t.clipPlaneHelpers.forEach((i, n) => {
    const o = s.state.clippingPlanes[n], r = !!o && Number.isFinite(o.constant) && o.constant !== 1 / 0, a = t.clipHelperVisible && s.renderer.clippingPlanes.length > 0 && r;
    i.visible = a, i.children.forEach((c) => {
      c.visible = a;
    });
  }), { state: t, needsRender: !0 };
}
function bi(s, e, t, i) {
  if (e.isEmpty())
    return { state: s.state, needsRender: !1 };
  const n = st(s.state.clippingPlanes), o = [...s.state.clipPlaneHelpers], r = { ...s.state, clippingPlanes: n, clipPlaneHelpers: o }, { min: a, max: c } = e, u = c.clone().sub(a), d = a.x + t.x[0] / 100 * u.x, l = a.x + t.x[1] / 100 * u.x, p = a.y + t.y[0] / 100 * u.y, f = a.y + t.y[1] / 100 * u.y, m = a.z + t.z[0] / 100 * u.z, g = a.z + t.z[1] / 100 * u.z, M = s.renderer.clippingPlanes.length > 0, y = new h.Vector3(
    i.x ? d : a.x,
    i.y ? p : a.y,
    i.z ? m : a.z
  ), b = new h.Vector3(
    i.x ? l : c.x,
    i.y ? f : c.y,
    i.z ? g : c.z
  ), C = y.clone().add(b).multiplyScalar(0.5), k = b.clone().sub(y), x = 5e-4;
  return i.x ? (n[0].constant = -d, n[1].constant = l, ee(
    o[0],
    new h.Vector3(1, 0, 0),
    new h.Vector3(d + x, C.y, C.z),
    k.z,
    k.y,
    M,
    r.clipHelperVisible
  ), ee(
    o[1],
    new h.Vector3(-1, 0, 0),
    new h.Vector3(l - x, C.y, C.z),
    k.z,
    k.y,
    M,
    r.clipHelperVisible
  )) : (n[0].constant = 1 / 0, n[1].constant = 1 / 0, o[0] && (o[0].visible = !1), o[1] && (o[1].visible = !1)), i.y ? (n[2].constant = -p, n[3].constant = f, ee(
    o[2],
    new h.Vector3(0, 1, 0),
    new h.Vector3(C.x, p + x, C.z),
    k.x,
    k.z,
    M,
    r.clipHelperVisible
  ), ee(
    o[3],
    new h.Vector3(0, -1, 0),
    new h.Vector3(C.x, f - x, C.z),
    k.x,
    k.z,
    M,
    r.clipHelperVisible
  )) : (n[2].constant = 1 / 0, n[3].constant = 1 / 0, o[2] && (o[2].visible = !1), o[3] && (o[3].visible = !1)), i.z ? (n[4].constant = -m, n[5].constant = g, ee(
    o[4],
    new h.Vector3(0, 0, 1),
    new h.Vector3(C.x, C.y, m + x),
    k.x,
    k.y,
    M,
    r.clipHelperVisible
  ), ee(
    o[5],
    new h.Vector3(0, 0, -1),
    new h.Vector3(C.x, C.y, g - x),
    k.x,
    k.y,
    M,
    r.clipHelperVisible
  )) : (n[4].constant = 1 / 0, n[5].constant = 1 / 0, o[4] && (o[4].visible = !1), o[5] && (o[5].visible = !1)), { state: r, needsRender: !0 };
}
function wi(s, e) {
  for (const t of s) {
    if (t.constant === 1 / 0) continue;
    const i = t.normal, n = new h.Vector3(
      i.x > 0 ? e.max.x : e.min.x,
      i.y > 0 ? e.max.y : e.min.y,
      i.z > 0 ? e.max.z : e.min.z
    );
    if (t.distanceToPoint(n) < 0)
      return !0;
  }
  return !1;
}
function be(s) {
  s.geometry?.dispose?.(), (s.material ? Array.isArray(s.material) ? s.material : [s.material] : []).forEach((t) => t?.dispose?.());
}
function vi(s) {
  for (s.cancelDeferredStructureBuild(), s.clearLocateFocus(), s.animationFrameId !== null && cancelAnimationFrame(s.animationFrameId), s.onAnimationFrameDisposed(), s.logicTimer && clearInterval(s.logicTimer), ui({
    workers: s.workers,
    workerQueue: s.workerQueue,
    rejectReason: "SceneManager disposed"
  }), s.onWorkersDisposed(), s.onQueuesReset(), s.onStateCachesReset(), s.clearChunkCache(); s.ghostGroup.children.length > 0; ) {
    const e = s.ghostGroup.children[0];
    s.ghostGroup.remove(e), s.releaseGhostLine(e);
  }
  s.controls.dispose(), be(s.selectionBox), be(s.highlightMesh), be(s.tempMarker), s.dotTexture.dispose(), s.sharedMaterial.dispose(), s.ghostEdgesGeometry.dispose(), s.ghostMaterial.dispose(), s.renderer.dispose();
}
function nt(s, e) {
  const t = new h.Matrix4();
  return e !== void 0 && s.isInstancedMesh ? (s.getMatrixAt(e, t), t) : t.copy(s.matrixWorld);
}
function He(s, e, t) {
  const i = s.attributes.position, n = s.index, o = nt(e, t), r = new h.Vector3(), a = new h.Vector3(), c = new h.Vector3(), u = new h.Vector3();
  let d = 0;
  if (n)
    for (let l = 0; l < n.count; l += 3)
      r.fromBufferAttribute(i, n.getX(l)).applyMatrix4(o), a.fromBufferAttribute(i, n.getX(l + 1)).applyMatrix4(o), c.fromBufferAttribute(i, n.getX(l + 2)).applyMatrix4(o), d += r.dot(u.crossVectors(a, c)) / 6;
  else
    for (let l = 0; l < i.count; l += 3)
      r.fromBufferAttribute(i, l).applyMatrix4(o), a.fromBufferAttribute(i, l + 1).applyMatrix4(o), c.fromBufferAttribute(i, l + 2).applyMatrix4(o), d += r.dot(u.crossVectors(a, c)) / 6;
  return Math.abs(d);
}
function Ne(s, e, t) {
  const i = s.attributes.position, n = s.index, o = nt(e, t), r = new h.Vector3(), a = new h.Vector3(), c = new h.Vector3(), u = new h.Vector3(), d = new h.Vector3();
  let l = 0;
  if (n)
    for (let p = 0; p < n.count; p += 3)
      r.fromBufferAttribute(i, n.getX(p)).applyMatrix4(o), a.fromBufferAttribute(i, n.getX(p + 1)).applyMatrix4(o), c.fromBufferAttribute(i, n.getX(p + 2)).applyMatrix4(o), l += u.subVectors(a, r).cross(d.subVectors(c, r)).length() / 2;
  else
    for (let p = 0; p < i.count; p += 3)
      r.fromBufferAttribute(i, p).applyMatrix4(o), a.fromBufferAttribute(i, p + 1).applyMatrix4(o), c.fromBufferAttribute(i, p + 2).applyMatrix4(o), l += u.subVectors(a, r).cross(d.subVectors(c, r)).length() / 2;
  return l;
}
function Si(s) {
  const { uuid: e, optimizedMapping: t, contentGroup: i } = s;
  let n = 0, o = 0;
  const r = t.get(e);
  if (r && r.length > 0)
    return r.forEach((c) => {
      c.geometry && (n += Ne(c.geometry, c.mesh, c.instanceId), o += He(c.geometry, c.mesh, c.instanceId));
    }), { area: n, volume: o };
  const a = i.getObjectByProperty("uuid", e);
  if (a && a.isMesh) {
    const c = a;
    c.geometry && (n = Ne(c.geometry, c), o = He(c.geometry, c));
  }
  return { area: n, volume: o };
}
function ue(s) {
  return s.replace(/\.[^./\\]+$/, "");
}
function se(s) {
  return s.replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, " ").trim() || "model";
}
const Bi = /* @__PURE__ */ new Set(["", "n/a", "na", "undefined", "null", "-", "--"]);
function he(...s) {
  for (const e of s) {
    if (typeof e != "string") continue;
    const t = e.trim();
    if (!Bi.has(t.toLowerCase()))
      return t;
  }
  return "";
}
function rt(s) {
  if (!s) return 0;
  let e = s.type === "Mesh" ? 1 : 0;
  if (s.children)
    for (const t of s.children)
      e += rt(t);
  return e;
}
function $e(s) {
  if (!s || typeof s != "object") return;
  const e = {};
  return s.originalUuid !== void 0 && (e.originalUuid = String(s.originalUuid)), s.expressID !== void 0 && (e.expressID = s.expressID), s.modelID !== void 0 && (e.modelID = s.modelID), Object.keys(e).length > 0 ? e : void 0;
}
function Ii(s) {
  const e = /* @__PURE__ */ new Set(), t = (a, c) => {
    const u = a && a.trim() ? a.trim() : c;
    if (!e.has(u))
      return e.add(u), u;
    let d = 2;
    for (; e.has(`${u}_${d}`); ) d++;
    const l = `${u}_${d}`;
    return e.add(l), l;
  }, n = {
    id: t(s?.name, s?.id ?? "Root"),
    name: s?.name,
    type: s?.type,
    visible: s?.visible !== !1,
    children: []
  };
  s?.bimId !== void 0 && (n.bimId = s.bimId), s?.chunkId !== void 0 && (n.chunkId = s.chunkId);
  const o = $e(s?.userData);
  o && (n.userData = o);
  const r = [{ src: s, dst: n }];
  for (; r.length > 0; ) {
    const { src: a, dst: c } = r.pop(), u = Array.isArray(a?.children) ? a.children : [];
    for (const d of u) {
      const p = {
        id: t(d?.name, d?.id ?? "Node"),
        name: d?.name,
        type: d?.type,
        visible: d?.visible !== !1,
        children: []
      };
      d?.bimId !== void 0 && (p.bimId = d.bimId), d?.chunkId !== void 0 && (p.chunkId = d.chunkId);
      const f = $e(d?.userData);
      f && (p.userData = f), c.children.push(p), r.push({ src: d, dst: p });
    }
  }
  return n;
}
function Pi(s, e) {
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
      bimProperties: {}
    });
  }
  return new TextEncoder().encode(t);
}
function Ri(s) {
  const e = [];
  s.children.forEach((r) => {
    if (r.userData?.isOptimizedGroup || r.name.startsWith("optimized_")) return;
    const a = (typeof r.userData?.modelName == "string" ? r.userData.modelName : "") || r.children?.[0]?.name || "" || r.name, c = se(ue(a));
    e.push(c);
  });
  const t = Array.from(new Set(e));
  if (t.length === 1) return t[0];
  const i = /* @__PURE__ */ new Date(), n = (r) => String(r).padStart(2, "0");
  return `批量导出_${`${i.getFullYear()}${n(i.getMonth() + 1)}${n(i.getDate())}_${n(i.getHours())}${n(i.getMinutes())}${n(i.getSeconds())}`}`;
}
function Li(s, e) {
  const t = Object.keys(s), i = /* @__PURE__ */ new Set();
  t.forEach((r) => {
    const a = r.indexOf("::");
    a > 0 && i.add(r.slice(0, a));
  });
  const n = i.size === 1 ? [...i][0] : e, o = /* @__PURE__ */ new Map();
  return i.size >= 1 ? i.size === 1 ? o.set(n, s) : t.forEach((r) => {
    const a = r.indexOf("::"), c = a > 0 ? r.slice(0, a) : e;
    o.has(c) || o.set(c, {}), o.get(c)[r] = s[r];
  }) : o.set(e, s), {
    defaultOwner: n,
    grouped: o
  };
}
function Ai(s) {
  const { fileName: e, modelRootName: t, rootId: i } = s, n = new h.Group();
  n.name = `file_${i}`, n.userData.originalUuid = i;
  const o = se(ue(e));
  return n.userData.modelName = se(
    he(t && t !== "Root" ? t : "", o, i) || o
  ), n;
}
function Oi(s) {
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
async function Di(s) {
  const { structureRoot: e, ifcApiByModel: t, ifcManagerByModel: i } = s, n = {}, o = [e];
  for (; o.length > 0; ) {
    const r = o.pop(), a = r.userData?.originalUuid ? String(r.userData.originalUuid) : "";
    if (r.bimId) {
      const c = `${a}::${r.bimId}`;
      if (!n[c]) {
        n[c] = { uuid: r.id, name: r.name };
        const u = r.userData?.expressID;
        if (u !== void 0 && t.has(a))
          try {
            const { ifcApi: d, modelID: l } = t.get(a), p = d.GetLine(l, Number(u));
            p && (n[c].ifcType = p.is_a || "", n[c].globalId = p.GlobalId?.value || "", n[c].ifcName = p.Name?.value || "");
          } catch {
          }
        if (u !== void 0 && i.has(a))
          try {
            const { ifcManager: d, modelID: l } = i.get(a), p = await d.getItemProperties(l, Number(u)), f = p?.rawGroups || p?.groups || null, m = p?.normalizedGroups || null;
            f && Object.keys(f).length > 0 && (n[c].ifcRawGroups = f), m && Object.keys(m).length > 0 && (n[c].ifcNormalizedGroups = m);
          } catch {
          }
      }
    }
    if (r.children && r.children.length > 0)
      for (let c = r.children.length - 1; c >= 0; c--)
        o.push(r.children[c]);
  }
  return n;
}
function zi(s, e) {
  const t = new DataView(s);
  let i = 0;
  const n = t.getUint32(i, !0);
  i += 4;
  const o = [];
  for (let u = 0; u < n; u++) {
    const d = t.getUint32(i, !0);
    i += 4;
    const l = t.getUint32(i, !0);
    i += 4;
    const p = new Float32Array(s, i, d * 3);
    i += d * 12;
    const f = new Float32Array(s, i, d * 3);
    i += d * 12;
    const m = new h.BufferGeometry();
    if (m.setAttribute("position", new h.BufferAttribute(new Float32Array(p), 3)), m.setAttribute("normal", new h.BufferAttribute(new Float32Array(f), 3)), l > 0) {
      const g = new Uint32Array(s, i, l);
      i += l * 4, m.setIndex(new h.BufferAttribute(new Uint32Array(g), 1));
    }
    o.push(m);
  }
  const r = t.getUint32(i, !0);
  i += 4;
  const a = new h.Matrix4(), c = [];
  for (let u = 0; u < r; u++) {
    const d = t.getUint32(i, !0);
    i += 4;
    const l = t.getUint32(i, !0);
    i += 4;
    const p = t.getUint32(i, !0);
    i += 4;
    for (let m = 0; m < 16; m++)
      a.elements[m] = t.getFloat32(i, !0), i += 4;
    const f = t.getUint32(i, !0);
    i += 4, c.push({
      bimId: e[d] ?? String(d),
      typeIndex: l,
      color: p,
      matrix: a.clone(),
      geometry: o[f]
    });
  }
  return c;
}
async function Ti(s) {
  const {
    chunks: e,
    nbimFiles: t,
    nbimMeta: i,
    bimIdToIndex: n,
    hasValidChunkBinaryRange: o,
    generateChunkBinaryV8: r
  } = s, a = [], c = e.map((d) => ({
    id: d.id,
    bounds: {
      min: { x: d.bounds.min.x, y: d.bounds.min.y, z: d.bounds.min.z },
      max: { x: d.bounds.max.x, y: d.bounds.max.y, z: d.bounds.max.z }
    },
    originalUuid: d.originalUuid ? String(d.originalUuid) : void 0,
    byteOffset: 0,
    byteLength: 0
  }));
  let u = 1024;
  for (let d = 0; d < e.length; d++) {
    const l = e[d], p = c[d];
    let f = null;
    if (l.node)
      f = r(l.node.items, n);
    else if (l.nbimFileId && t.has(l.nbimFileId) && o(l)) {
      const M = await t.get(l.nbimFileId).slice(l.byteOffset, l.byteOffset + l.byteLength).arrayBuffer(), y = i.get(l.nbimFileId), b = y?.version ?? 8;
      if (b !== 8)
        throw new Error(`Unsupported NBIM version: ${b}. Only V8 is supported.`);
      const k = zi(M, y?.bimIdTable || []).map((x) => ({
        uuid: "",
        bimId: x.bimId,
        typeIndex: x.typeIndex,
        color: x.color,
        matrix: x.matrix,
        geometry: x.geometry
      }));
      f = r(k, n);
    }
    if (!f)
      continue;
    const m = new Uint8Array(f);
    a.push(m), p.byteOffset = u, p.byteLength = m.byteLength, u += m.byteLength;
  }
  return {
    chunkBlobs: a,
    exportChunks: c,
    currentOffset: u
  };
}
function Ui(s) {
  const { globalBounds: e, precomputedBounds: t, sceneBounds: i, globalOffset: n } = s;
  if (!e)
    return {
      precomputedBounds: t,
      sceneBounds: i,
      globalOffset: n,
      initializedOffset: !1
    };
  const o = new h.Box3(
    new h.Vector3(e.min.x, e.min.y, e.min.z),
    new h.Vector3(e.max.x, e.max.y, e.max.z)
  );
  let r = !1;
  const a = n.clone();
  a.length() === 0 && (o.getCenter(a), r = !0);
  const c = t.clone();
  return c.isEmpty() ? c.copy(o) : c.union(o), {
    precomputedBounds: c,
    sceneBounds: c.clone(),
    globalOffset: a,
    initializedOffset: r
  };
}
function Fi(s) {
  const { structureRoot: e, modelRoot: t } = s;
  return e.children || (e.children = []), t && (t.children && t.name === "Root" ? e.children.push(...t.children) : e.children.push(t)), e;
}
function Gi(s) {
  const { manifestStats: e, modelRoot: t, chunks: i } = s;
  return e || {
    meshes: rt(t),
    faces: 0,
    memory: parseFloat(((i || []).reduce((n, o) => n + (o.byteLength || 0), 0) / (1024 * 1024)).toFixed(2))
  };
}
function Vi(s) {
  const { modelRoot: e, defaultOwner: t, nodeMap: i, bimIdToNodeIds: n } = s;
  if (!e) return;
  const o = (r) => {
    r.userData || (r.userData = {});
    const a = r.userData?.originalUuid ? String(r.userData.originalUuid) : t;
    if (r.userData.originalUuid = a, i.has(r.id) || i.set(r.id, []), i.get(r.id).push(r), r.bimId) {
      const c = `${a}::${r.bimId}`;
      n.has(c) || n.set(c, []), n.get(c).push(r.id);
    }
    r.children && r.children.forEach(o);
  };
  o(e);
}
async function Ei(s) {
  const {
    chunkEntries: e,
    globalOffset: t,
    chunkPadding: i,
    rootId: n,
    fileId: o,
    immediateGhostLimit: r,
    registrationBatchSize: a,
    onProgress: c,
    registerChunk: u,
    createGhostLine: d,
    addGhostLine: l,
    yieldToMainThread: p
  } = s;
  if (e.length === 0)
    throw new Error("NBIM 文件没有可渲染分块，可能格式有问题");
  const f = t.lengthSq() > 0 ? t.clone().negate() : null, m = [];
  for (let g = 0; g < e.length; g++) {
    const M = e[g];
    if (!M?.bounds || typeof M.byteOffset != "number" || typeof M.byteLength != "number")
      throw new Error("NBIM 分块数据不完整，可能格式有问题");
    const y = new h.Box3(
      new h.Vector3(M.bounds.min.x, M.bounds.min.y, M.bounds.min.z),
      new h.Vector3(M.bounds.max.x, M.bounds.max.y, M.bounds.max.z)
    );
    f && y.translate(f);
    const b = M.id, C = y.getCenter(new h.Vector3()), k = y.clone(), x = y.getSize(new h.Vector3()).multiplyScalar(i);
    if (k.expandByVector(x), u({
      id: b,
      bounds: y,
      paddedBounds: k,
      _padding: i,
      center: C,
      loaded: !1,
      byteOffset: M.byteOffset,
      byteLength: M.byteLength,
      nbimFileId: o,
      groupName: `optimized_${n}`,
      originalUuid: M.originalUuid ? String(M.originalUuid) : n
    }), g < r ? l(d(`ghost_${b}`, y)) : m.push({ chunkId: b, bounds: y }), (g + 1) % a === 0) {
      if (c) {
        const v = Math.max(0, Math.min(1, (g + 1) / e.length));
        c(30 + Math.round(v * 40), "正在初始化分块...");
      }
      await p();
    }
  }
  return {
    deferredGhostSpecs: m
  };
}
function Wi(s) {
  const { chunkCount: e, hasManifestStats: t, hasManifestChunks: i } = s;
  return {
    chunkWarmupActive: !0,
    initialChunkLoadTarget: e > 200 ? 44 : e > 80 ? 30 : 16,
    shouldEstimateStats: !t && i
  };
}
function ot(s) {
  return new h.Color(s.highlightColor || "#ff9f1c");
}
function Hi(s, e) {
  for (const t of e) {
    const i = s.optimizedMapping.get(t);
    i && i.forEach((n) => {
      n.mesh.setColorAt(n.instanceId, new h.Color(n.originalColor)), n.mesh.instanceColor && (n.mesh.instanceColor.needsUpdate = !0);
    });
  }
}
function Ni(s, e) {
  const t = ot(s.settings);
  for (const i of e) {
    const n = s.optimizedMapping.get(i);
    n && n.forEach((o) => {
      o.mesh.setColorAt(o.instanceId, t), o.mesh.instanceColor && (o.mesh.instanceColor.needsUpdate = !0);
    });
  }
}
function $i(s, e) {
  if (s.selectionBox.visible = !1, s.highlightMesh.visible = !1, e.size === 0)
    return;
  const t = new h.Box3(), i = new h.Box3(), n = new h.Matrix4(), o = (p) => {
    const f = s.optimizedMapping.get(p);
    if (f && f.length > 0) {
      const g = f[0];
      g.geometry && (g.geometry.boundingBox || g.geometry.computeBoundingBox(), i.copy(g.geometry.boundingBox), g.mesh.getMatrixAt(g.instanceId, n), n.premultiply(g.mesh.matrixWorld), i.applyMatrix4(n), t.union(i));
      return;
    }
    const m = s.contentGroup.getObjectByProperty("uuid", p);
    m && (m.updateMatrixWorld(!0), m.userData.boundingBox ? i.copy(m.userData.boundingBox).applyMatrix4(m.matrixWorld) : i.setFromObject(m), t.union(i));
  };
  for (const p of e) o(p);
  if (!t.isEmpty()) {
    s.selectionBox.box.copy(t);
    const p = !!(s.state.locateFocusUuid && e.has(s.state.locateFocusUuid));
    if (p) {
      const f = Math.max(t.getSize(new h.Vector3()).length() * 0.048, 0.22);
      s.selectionBox.box.expandByScalar(f);
    }
    s.selectionBox.visible = p || !!s.settings.highlightShowBox;
  }
  const r = s.state.lastSelectedUuid;
  if (!r) return;
  const a = s.optimizedMapping.get(r);
  if (a && a.length > 0) {
    s.highlightMesh.visible = !1;
    return;
  }
  const c = s.contentGroup.getObjectByProperty("uuid", r);
  if (!c || !c.isMesh) return;
  c.updateMatrixWorld(!0), s.highlightMesh.geometry = c.geometry;
  const u = new h.Vector3(), d = new h.Quaternion(), l = new h.Vector3();
  c.matrixWorld.decompose(u, d, l), l.multiplyScalar(1.035), s.highlightMesh.position.copy(u), s.highlightMesh.quaternion.copy(d), s.highlightMesh.scale.copy(l), s.highlightMesh.visible = !0;
}
function _e(s, e) {
  const t = /* @__PURE__ */ new Set(), i = [...e], n = /* @__PURE__ */ new Set();
  for (; i.length > 0; ) {
    const o = i.shift();
    if (!o || n.has(o)) continue;
    n.add(o), t.add(o);
    const r = s.get(o);
    if (!(!r || r.length === 0)) {
      for (const a of r)
        if (!(!a.children || a.children.length === 0))
          for (const c of a.children)
            n.has(c.id) || i.push(c.id);
    }
  }
  return t;
}
function we(s, e) {
  s.clearClashPairHighlight();
  const t = new Set(e.filter(Boolean));
  return s.state.locateResultSet.size > 0 || (Hi(s, Array.from(s.state.highlightedUuids).filter((n) => !t.has(n))), Ni(s, Array.from(t).filter((n) => !s.state.highlightedUuids.has(n)))), s.state.highlightedUuids = t, s.state.lastSelectedUuid = e.length > 0 ? e[e.length - 1] : null, $i(s, t), { needsRender: !0 };
}
function ve(s) {
  return s.clearClashPairHighlight(), s.locateObjectMaterialCache.forEach((e, t) => {
    const i = s.contentGroup.getObjectByProperty("uuid", t);
    !i || !i.isMesh && !i.isBatchedMesh || (i.material = e);
  }), s.locateObjectMaterialCache.clear(), s.locateMaterialCache.clear(), s.locateDimmedInstances.forEach(({ mesh: e, instanceId: t, originalColor: i }) => {
    e.setColorAt(t, new h.Color(i)), e.instanceColor && (e.instanceColor.needsUpdate = !0);
  }), s.locateDimmedInstances.clear(), s.state.locateResultSet.clear(), s.state.locateFocusUuid = null, s.state.highlightedUuids = /* @__PURE__ */ new Set(), s.state.lastSelectedUuid = null, s.selectionBox.visible = !1, s.highlightMesh.visible = !1, { needsRender: !0 };
}
function Qe(s, e, t = null, i) {
  const n = Array.from(new Set(e.filter(Boolean)));
  if (n.length === 0)
    return ve(s);
  ve(s);
  const o = new Set(n), r = _e(s.nodeMap, n), a = Array.from(r), c = /* @__PURE__ */ new Map(), u = i?.highlightColors || {};
  n.forEach((f) => {
    const m = u[f];
    if (!m) return;
    const g = new h.Color(m);
    _e(s.nodeMap, [f]).forEach((y) => c.set(y, g));
  }), s.state.locateResultSet = r, s.state.locateFocusUuid = t && r.has(t) ? t : a[0];
  const d = s.state.locateFocusUuid, l = new h.Color("#b7bec9"), p = ot(s.settings);
  return new h.Color(), s.contentGroup.traverse((f) => {
    const m = f;
    if (!m.isMesh || !m.material) return;
    s.locateObjectMaterialCache.has(f.uuid) || s.locateObjectMaterialCache.set(f.uuid, m.material);
    const g = Array.isArray(m.material) ? m.material : [m.material], M = r.has(f.uuid), y = M && d !== null && f.uuid === d, b = c.get(f.uuid) || p, C = g.map((k) => {
      if (!k) return k;
      const x = k.clone();
      if ("transparent" in x && (x.transparent = !1), "opacity" in x && (x.opacity = 1), "depthWrite" in x && (x.depthWrite = !0), "color" in x && x.color) {
        const v = x.color.clone();
        M ? x.color.copy(v.lerp(b, y ? 0.94 : 0.85)) : (x.transparent = !0, x.opacity = 0.08, x.depthWrite = !1, x.color.copy(v.lerp(l, 0.95)));
      }
      return "emissive" in x && x.emissive && (M ? x.emissive.copy(b.clone().multiplyScalar(y ? 0.45 : 0.18)) : x.emissive.set(0)), "roughness" in x && !M && (x.roughness = Math.max(0.95, x.roughness ?? 0.95)), "metalness" in x && !M && (x.metalness = Math.min(0.01, x.metalness ?? 0.01)), x.needsUpdate = !0, x;
    });
    m.material = Array.isArray(m.material) ? C : C[0];
  }), s.contentGroup.traverse((f) => {
    const m = f;
    if (!m.isBatchedMesh || !m.material) return;
    s.locateObjectMaterialCache.has(f.uuid) || s.locateObjectMaterialCache.set(f.uuid, m.material);
    const g = m.userData?.originalUuid ? String(m.userData.originalUuid) : "", M = m.userData?.batchIdToUuid;
    let y = !1, b = !1, C = g && c.get(g) || null;
    if (M && M.size > 0) {
      for (const R of M.values())
        if (!y && r.has(R) && (y = !0), !b && d !== null && R === d && (b = !0), !C && r.has(R) && (C = c.get(R) || null), y && b) break;
    }
    const k = g ? o.has(g) : !1, x = r.has(f.uuid) || y || k, v = s.state.locateFocusUuid !== null && s.state.locateFocusUuid === f.uuid || b || k && s.state.locateFocusUuid !== null && s.state.locateFocusUuid === g, P = Array.isArray(m.material) ? m.material : [m.material], A = C || p, L = P.map((R) => {
      if (!R) return R;
      const w = R.clone();
      if ("transparent" in w && (w.transparent = !1), "opacity" in w && (w.opacity = 1), "depthWrite" in w && (w.depthWrite = !0), "color" in w && w.color) {
        const D = w.color.clone();
        x ? w.color.copy(D.lerp(A, v ? 0.94 : 0.75)) : (w.transparent = !0, w.opacity = 0.08, w.depthWrite = !1, w.color.copy(D.lerp(l, 0.9)));
      }
      return "emissive" in w && w.emissive && (x ? w.emissive.copy(A.clone().multiplyScalar(v ? 0.4 : 0.15)) : w.emissive.set(0)), "roughness" in w && !x && (w.roughness = Math.max(0.95, w.roughness ?? 0.95)), "metalness" in w && !x && (w.metalness = Math.min(0.01, w.metalness ?? 0.01)), w.needsUpdate = !0, w;
    });
    m.material = Array.isArray(m.material) ? L : L[0];
  }), s.optimizedMapping.forEach((f, m) => {
    const g = r.has(m), M = g && d !== null && m === d, y = c.get(m) || p;
    f.forEach((b) => {
      const C = `${b.mesh.uuid}:${b.instanceId}`;
      s.locateDimmedInstances.set(C, {
        mesh: b.mesh,
        instanceId: b.instanceId,
        originalColor: b.originalColor
      });
      const k = new h.Color(b.originalColor), x = M ? 0.94 : g ? 0.82 : 0.88, v = g ? y : l;
      b.mesh.setColorAt(b.instanceId, k.lerp(v, x)), b.mesh.instanceColor && (b.mesh.instanceColor.needsUpdate = !0);
    });
  }), we(s, s.state.locateFocusUuid ? [s.state.locateFocusUuid] : []);
}
function at(s, e, t) {
  const i = new h.BufferGeometry().setAttribute(
    "position",
    new h.Float32BufferAttribute([s.x, s.y, s.z], 3)
  ), n = new h.PointsMaterial({
    color: 16711680,
    size: 8,
    map: t,
    transparent: !0,
    alphaTest: 0.5,
    depthTest: !1
  }), o = new h.Points(i, n);
  o.renderOrder = 999, e.add(o);
}
function qe(s, e) {
  const t = new h.BufferGeometry().setFromPoints(s), i = new h.LineBasicMaterial({ color: 16711680, depthTest: !1, linewidth: 2 }), n = new h.Line(t, i);
  n.renderOrder = 998, e.add(n);
}
function _i(s, e) {
  const t = document.createElement("canvas"), i = t.getContext("2d");
  if (!i) return new h.Sprite();
  const n = 48, o = 24;
  i.font = `Bold ${n}px "Segoe UI", Arial, sans-serif`;
  const r = i.measureText(s).width;
  t.width = r + o * 2, t.height = n + o, i.shadowColor = "rgba(0, 0, 0, 0.5)", i.shadowBlur = 10, i.fillStyle = "rgba(30, 30, 30, 0.9)";
  const a = 8, c = i;
  c.roundRect ? c.roundRect(5, 5, t.width - 10, t.height - 10, a) : i.rect(5, 5, t.width - 10, t.height - 10), i.fill(), i.shadowBlur = 0, i.strokeStyle = "#ff0000", i.lineWidth = 2, i.stroke(), i.font = `Bold ${n}px "Segoe UI", Arial, sans-serif`, i.fillStyle = "#ffffff", i.textAlign = "center", i.textBaseline = "middle", i.fillText(s, t.width / 2, t.height / 2);
  const u = new h.CanvasTexture(t);
  u.minFilter = h.LinearFilter, u.magFilter = h.LinearFilter;
  const d = new h.SpriteMaterial({
    map: u,
    depthTest: !1,
    sizeAttenuation: !1
  }), l = new h.Sprite(d);
  l.position.copy(e);
  const p = 0.5;
  return l.scale.set(p * (t.width / t.height), p, 1), l.renderOrder = 1001, l.userData = { type: "label" }, l;
}
function ct(s, e) {
  e.previewLine && (s.measureGroup.remove(e.previewLine), e.previewLine = null), e.previewPolygon && (s.measureGroup.remove(e.previewPolygon), e.previewPolygon = null), s.tempMarker.visible = !1;
}
function ht(s, e = !0) {
  const t = {
    ...s.state,
    currentMeasurePoints: e ? [] : [...s.state.currentMeasurePoints]
  };
  ct(s, t);
  for (let i = s.measureGroup.children.length - 1; i >= 0; i--) {
    const n = s.measureGroup.children[i];
    n.name.startsWith("measure_") || s.measureGroup.remove(n);
  }
  return {
    state: t,
    needsRender: !0
  };
}
function Re(s, e) {
  const t = {
    ...s.state,
    currentMeasurePoints: [...s.state.currentMeasurePoints]
  };
  ct(s, t);
  const i = [...t.currentMeasurePoints];
  if (e && i.push(e), i.length < 2)
    return { state: t, needsRender: !1 };
  const n = new h.BufferGeometry().setFromPoints(i), o = new h.LineDashedMaterial({
    color: 16711680,
    dashSize: 5,
    gapSize: 2,
    depthTest: !1
  });
  return t.previewLine = new h.Line(n, o), t.previewLine.computeLineDistances(), t.previewLine.renderOrder = 998, s.measureGroup.add(t.previewLine), { state: t, needsRender: !1 };
}
function Qi(s, e, t) {
  const i = {
    ...s.state,
    currentMeasurePoints: [...s.state.currentMeasurePoints]
  };
  if (i.measureType === "none")
    return s.tempMarker.visible = !1, { state: i, needsRender: !1 };
  const n = s.getRayIntersects(e, t);
  if (!n)
    return s.tempMarker.visible = !1, i.previewLine && (i.previewLine.visible = !1), { state: i, needsRender: !0 };
  const o = n.point, r = s.tempMarker.geometry.attributes.position;
  return r.setXYZ(0, o.x, o.y, o.z), r.needsUpdate = !0, s.tempMarker.visible = !0, i.currentMeasurePoints.length === 0 ? { state: i, needsRender: !0 } : {
    state: Re(s, o).state,
    needsRender: !0
  };
}
function lt(s) {
  const e = {
    ...s.state,
    currentMeasurePoints: [...s.state.currentMeasurePoints]
  }, t = `measure_${Date.now()}`, i = new h.Group();
  i.name = t, e.currentMeasurePoints.forEach((d) => at(d, i, s.dotTexture));
  let n = "", o = "";
  const r = e.measureType, a = new h.Vector3();
  if (e.measureType === "dist") {
    const [d, l] = e.currentMeasurePoints, p = d.distanceTo(l), f = Math.abs(l.x - d.x), m = Math.abs(l.y - d.y), g = Math.abs(l.z - d.z);
    o = p.toFixed(3), n = `${o} (Δx:${f.toFixed(2)}, Δy:${m.toFixed(2)}, Δz:${g.toFixed(2)})`, qe(e.currentMeasurePoints, i), a.copy(d).add(l).multiplyScalar(0.5);
  } else if (e.measureType === "angle") {
    const [d, l, p] = e.currentMeasurePoints, f = d.clone().sub(l).normalize(), m = p.clone().sub(l).normalize();
    o = `${(f.angleTo(m) * (180 / Math.PI)).toFixed(2)}°`, n = o, qe(e.currentMeasurePoints, i), a.copy(l);
  } else {
    const [d] = e.currentMeasurePoints;
    o = `(${d.x.toFixed(2)}, ${d.y.toFixed(2)}, ${d.z.toFixed(2)})`, n = o, a.copy(d);
  }
  i.add(_i(o, a)), s.measureGroup.add(i), s.measureRecords.set(t, {
    id: t,
    type: r,
    val: n,
    group: i,
    modelUuid: e.currentMeasureModelUuid || void 0
  });
  const u = {
    ...ht(
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
    completed: { id: t, type: r, val: n }
  };
}
function qi(s, e, t) {
  if (s.state.measureType === "none")
    return { state: s.state, needsRender: !1, completed: null };
  const i = {
    ...s.state,
    currentMeasurePoints: [...s.state.currentMeasurePoints, e],
    currentMeasureModelUuid: t ?? s.state.currentMeasureModelUuid
  };
  return at(e, s.measureGroup, s.dotTexture), i.measureType === "dist" && i.currentMeasurePoints.length === 2 || i.measureType === "angle" && i.currentMeasurePoints.length === 3 || i.measureType === "coord" ? lt({ ...s, state: i }) : {
    state: Re({ ...s, state: i }).state,
    needsRender: !0,
    completed: null
  };
}
function Xi(s, e) {
  return s.measureRecords.forEach((t, i) => {
    const n = i === e, o = n ? 65280 : 16711680;
    t.group.traverse((r) => {
      r instanceof h.Line || r instanceof h.LineLoop || r instanceof h.Points ? r.material.color.set(o) : r instanceof h.Sprite ? r.material.color.set(n ? 65280 : 16777215) : (r instanceof h.Mesh && r.material instanceof h.MeshBasicMaterial || r instanceof h.Box3Helper) && r.material.color.set(o);
    });
  }), {
    state: s.state,
    needsRender: !0
  };
}
function Yi(s, e, t) {
  const i = s.canvas.getBoundingClientRect();
  s.mouse.x = (e - i.left) / i.width * 2 - 1, s.mouse.y = -((t - i.top) / i.height) * 2 + 1, s.raycaster.setFromCamera(s.mouse, s.camera);
  const n = s.raycaster.params.Line?.threshold || 0;
  s.raycaster.params.Line && (s.raycaster.params.Line.threshold = 5);
  const o = s.raycaster.intersectObjects(s.measureGroup.children, !0);
  if (s.raycaster.params.Line && (s.raycaster.params.Line.threshold = n), o.length === 0)
    return null;
  let r = o[0].object;
  for (; r.parent && !r.name.startsWith("measure_"); )
    r = r.parent;
  return r.name.startsWith("measure_") ? r.name : null;
}
function Zi(s) {
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
        for (const o of i.children)
          t(o, n + 1);
    }
  };
  for (const i of s.contentGroup.children)
    i.userData.isOptimizedGroup || t(i, 0);
  return e;
}
function Ki(s, e, t, i) {
  const o = s.nodeMap.get(i)?.[0], r = new h.Object3D();
  r.uuid = i, o && (r.name = o.name, r.type = o.type, r.isMesh = o.type === "Mesh"), r.getWorldPosition = (c) => {
    const u = new h.Matrix4();
    return e.getMatrixAt(t, u), u.premultiply(e.matrixWorld), c.setFromMatrixPosition(u);
  };
  const a = new h.Matrix4();
  return e.getMatrixAt(t, a), r.position.setFromMatrixPosition(a), r;
}
function ut(s) {
  return s.interactableListValid ? {
    interactableList: s.interactableList,
    interactableListValid: !0
  } : {
    interactableList: Zi(s),
    interactableListValid: !0
  };
}
function ji(s, e, t) {
  const i = s.canvas.getBoundingClientRect();
  s.mouse.x = (e - i.left) / i.width * 2 - 1, s.mouse.y = -((t - i.top) / i.height) * 2 + 1, s.raycaster.setFromCamera(s.mouse, s.camera);
  const n = ut(s), o = s.raycaster.intersectObjects(n.interactableList, !1);
  if (o.length === 0)
    return { intersect: null, state: n };
  const r = o[0];
  if (!r.object.isBatchedMesh)
    return { intersect: r, state: n };
  const a = r.object, c = r.batchId !== void 0 ? r.batchId : r.instanceId;
  if (c === void 0)
    return { intersect: r, state: n };
  const u = a.userData.batchIdToUuid?.get(c);
  if (!u)
    return { intersect: r, state: n };
  const d = s.contentGroup.getObjectByProperty("uuid", u);
  return r.object = d ?? Ki(s, a, c, u), { intersect: r, state: n };
}
function Ji(s, e, t, i, n) {
  const o = Math.min(e, i), r = Math.max(e, i), a = Math.min(t, n), c = Math.max(t, n), u = s.camera.projectionMatrix.clone(), d = new h.Matrix4(), l = r - o, p = c - a, f = l / 2, m = p / 2, g = (r + o) / 2, M = (c + a) / 2, y = new h.Matrix4().makeTranslation(-g, -M, 0), b = new h.Matrix4().makeScale(1 / f, 1 / m, 1);
  d.multiplyMatrices(b, y);
  const C = d.multiply(u), k = new h.Frustum(), x = s.camera.matrixWorldInverse, v = C.clone().multiply(x);
  k.setFromProjectionMatrix(v);
  const P = [], A = new h.Box3(), L = new h.Matrix4();
  for (const R of s.interactableList) {
    if (R.isBatchedMesh) {
      const w = R, D = w.userData.batchIdToUuid, S = w.userData.batchIdToGeometry;
      if (!D || !S) continue;
      for (const [T, z] of D)
        try {
          const I = S.get(T);
          if (!I) continue;
          w.getMatrixAt(T, L), L.premultiply(w.matrixWorld);
          const O = new h.Box3();
          I.boundingBox || I.computeBoundingBox(), O.copy(I.boundingBox).applyMatrix4(L), k.intersectsBox(O) && P.push(z);
        } catch {
        }
      continue;
    }
    A.setFromObject(R), k.intersectsBox(A) && P.push(R.uuid);
  }
  return P;
}
function es({
  uuid: s,
  nodeMap: e,
  bimIdToNodeIds: t
}) {
  const i = e.get(s);
  if (i && i.length > 0 && i[0].bimId)
    return i[0].bimId;
  for (const [n, o] of t.entries())
    if (o.includes(s)) {
      const r = n.split("::");
      return r.length > 1 ? r[1] : null;
    }
  return null;
}
function dt(s, e) {
  for (const [t, i] of e.entries())
    if (t.endsWith(`::${s}`) && i.length > 0)
      return i[0];
  return null;
}
function ts(s, e, t) {
  return e.has(s) ? s : dt(s, t) || s;
}
function pt(s, e) {
  const t = e.get(s);
  return t && t.length > 0 ? t[0] : null;
}
function ft({
  id: s,
  nodeMap: e,
  nbimPropsByOriginalUuid: t
}) {
  const i = pt(s, e);
  if (!i || !i.bimId) return null;
  const n = i.userData?.originalUuid ? String(i.userData.originalUuid) : "";
  if (!n) return null;
  const o = t.get(n);
  return o ? {
    entry: o[`${n}::${i.bimId}`],
    node: i
  } : null;
}
function is(s) {
  const e = ft(s);
  if (!e?.entry || typeof e.entry != "object") return e?.entry || null;
  const { ifcRawGroups: t, ifcNormalizedGroups: i, ...n } = e.entry;
  return n;
}
function ss(s, e = "raw") {
  const t = ft(s);
  if (!t?.entry || typeof t.entry != "object") return null;
  const i = t.entry.ifcRawGroups, n = t.entry.ifcNormalizedGroups;
  return e === "normalized" ? n || i || null : i || n || null;
}
function ns(s) {
  let e = 0;
  const t = /* @__PURE__ */ new Set();
  return s.traverse((i) => {
    if (i.name === "__EdgesHelper" || !i.isMesh && !i.isBatchedMesh) return;
    const n = i;
    (Array.isArray(n.material) ? n.material : [n.material]).forEach((r) => {
      r && Object.values(r).forEach((a) => {
        if (!(a instanceof h.Texture) || t.has(a)) return;
        t.add(a);
        const c = a.image, u = c?.width || 0, d = c?.height || 0;
        u > 0 && d > 0 && (e += u * d * 4 / (1024 * 1024));
      });
    });
  }), parseFloat(e.toFixed(2));
}
function rs(s) {
  const e = s.renderer.info.render.calls, t = ns(s.contentGroup);
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
function os(s, e, t) {
  const i = (n) => {
    n.visible = t, n.children?.forEach(i);
  };
  e.children?.forEach(i), s.forEach((n) => {
    n.forEach((o) => {
      o.visible = t;
    });
  });
}
function as(s, e) {
  s.forEach((t) => {
    t.forEach((i) => {
      i.mesh.setVisibleAt(i.instanceId, e);
    });
  });
}
function mt(s, e) {
  if (!(s.name === "Helpers" || s.name === "Measure")) {
    if (s.isMesh && s.userData.isOptimized) {
      s.visible = !1;
      return;
    }
    s.visible = e;
  }
}
function Se(s, e) {
  let t = s?.parent;
  for (; t && t !== e; )
    t.visible = !0, t = t.parent;
}
function cs(s, e, t, i) {
  const n = [];
  if (s.has(e) && n.push(e), t)
    return t.traverse((o) => {
      s.has(o.uuid) && n.push(o.uuid);
    }), n;
  if (i && i.length > 0) {
    const o = (r) => {
      s.has(r.id) && n.push(r.id), r.children?.forEach(o);
    };
    o(i[0]);
  }
  return n;
}
function gt(s, e, t) {
  e.visible = t, e.children?.forEach((n) => gt(s, n, t)), s.get(e.id)?.forEach((n) => {
    n.visible = t;
  });
}
function Xe(s, e, t) {
  const i = s.get(e);
  i && i.forEach((n) => {
    n.mesh.setVisibleAt(n.instanceId, t);
  });
}
function Mt(s, e) {
  return os(s.nodeMap, s.structureRoot, e), as(s.optimizedMapping, e), s.contentGroup.traverse((t) => {
    mt(t, e);
  }), {
    needsBoundsUpdate: !0,
    needsExplodeRefresh: !0,
    needsRender: !0
  };
}
function Be(s, e, t, i = !0) {
  const n = s.nodeMap.get(e);
  n?.forEach((a) => gt(s.nodeMap, a, t));
  const o = s.contentGroup.getObjectByProperty("uuid", e);
  t && o && i && Se(o, s.scene);
  const r = t ? [] : cs(s.highlightedUuids, e, o, n);
  if (!o) {
    if (n && n.length > 0) {
      const a = (c) => {
        Xe(s.optimizedMapping, c.id, t), c.children?.forEach(a);
      };
      a(n[0]);
    }
    return {
      needsBoundsUpdate: !0,
      needsExplodeRefresh: !1,
      needsRender: !0,
      nextHighlightedUuids: r.length > 0 ? Array.from(new Set([...s.highlightedUuids].filter((a) => !r.includes(a)))) : void 0
    };
  }
  return o.traverse((a) => {
    a.name === "Helpers" || a.name === "Measure" || (mt(a, t), Xe(s.optimizedMapping, a.uuid, t));
  }), {
    needsBoundsUpdate: !0,
    needsExplodeRefresh: !1,
    needsRender: !0,
    nextHighlightedUuids: r.length > 0 ? Array.from(new Set([...s.highlightedUuids].filter((a) => !r.includes(a)))) : void 0
  };
}
function hs(s, e, t = {}) {
  if (e.length === 0)
    return {
      needsBoundsUpdate: !1,
      needsExplodeRefresh: !1,
      needsRender: !1
    };
  let i = new Set(s.highlightedUuids), n = !1;
  return e.forEach((o) => {
    const r = Be(
      {
        ...s,
        highlightedUuids: i
      },
      o.uuid,
      o.visible,
      o.showParents ?? !0
    );
    r.nextHighlightedUuids && (i = new Set(r.nextHighlightedUuids)), n = n || r.needsRender;
  }), {
    needsBoundsUpdate: t.recomputeBounds ?? !0,
    needsExplodeRefresh: t.refreshExplode ?? !1,
    needsRender: n,
    nextHighlightedUuids: Array.from(i)
  };
}
function ls(s, e, t) {
  Mt(s, !1);
  const i = /* @__PURE__ */ new Set();
  return e.forEach((n) => {
    t(n, !0);
    const o = s.nodeMap.get(n);
    o && o.forEach((a) => {
      const c = (u) => {
        u.id !== n && t(u.id, !0), u.children?.forEach(c);
      };
      c(a);
    }), s.optimizedMapping.get(n)?.forEach((a) => {
      i.add(a.mesh);
    });
  }), i.forEach((n) => {
    n.visible = !0, Se(n, s.scene);
  }), e.forEach((n) => {
    const o = s.contentGroup.getObjectByProperty("uuid", n);
    o && Se(o, s.scene);
  }), {
    needsBoundsUpdate: !0,
    needsExplodeRefresh: !0,
    needsRender: !0
  };
}
const K = {
  chunkReadCacheSize: 128,
  chunkPrefetchWindow: 0,
  ghostMode: "visible-first",
  targetMinFps: 20,
  loadProfile: "max-speed",
  deferIfcProperties: !0,
  preferWorkerOctree: !0,
  fastGeometrySanitize: !0
};
function Ye(s) {
  return {
    chunkReadCacheSize: Math.max(8, Math.min(256, Math.floor(s?.chunkReadCacheSize ?? K.chunkReadCacheSize))),
    chunkPrefetchWindow: Math.max(0, Math.min(32, Math.floor(s?.chunkPrefetchWindow ?? K.chunkPrefetchWindow))),
    ghostMode: s?.ghostMode ?? K.ghostMode,
    targetMinFps: Math.max(20, Math.min(60, Math.floor(s?.targetMinFps ?? K.targetMinFps))),
    loadProfile: s?.loadProfile ?? K.loadProfile,
    deferIfcProperties: s?.deferIfcProperties ?? K.deferIfcProperties,
    preferWorkerOctree: s?.preferWorkerOctree ?? K.preferWorkerOctree,
    fastGeometrySanitize: s?.fastGeometrySanitize ?? K.fastGeometrySanitize
  };
}
const us = 220, ds = 180;
class ms {
  constructor(e, t = {}) {
    this.structureRoot = { id: "root", name: "Root", type: "Group", children: [] }, this.nodeMap = /* @__PURE__ */ new Map(), this.bimIdToNodeIds = /* @__PURE__ */ new Map(), this.lastSelectedUuid = null, this.highlightedUuids = /* @__PURE__ */ new Set(), this.locateFocusUuid = null, this.locateResultSet = /* @__PURE__ */ new Set(), this.locateMaterialCache = /* @__PURE__ */ new Map(), this.locateObjectMaterialCache = /* @__PURE__ */ new Map(), this.locateDimmedInstances = /* @__PURE__ */ new Map(), this.clashPairObjectMaterialCache = /* @__PURE__ */ new Map(), this.clashPairInstanceColorCache = /* @__PURE__ */ new Map(), this.clashPairUuids = /* @__PURE__ */ new Set(), this.highlightPulseColor = new h.Color("#ffffff"), this.explodeEnabled = !1, this.explodeStrength = 0, this.explodeCenter = new h.Vector3(), this.explodeMode = "radial", this.explodeObjectStates = /* @__PURE__ */ new Map(), this.explodeInstanceStates = /* @__PURE__ */ new Map(), this.explodeScratchUniform = new h.Vector3(), this.explodeScratchMix = new h.Vector3(), this.measureType = "none", this.currentMeasurePoints = [], this.currentMeasureModelUuid = null, this.previewLine = null, this.previewPolygon = null, this.measureRecords = /* @__PURE__ */ new Map(), this.boxSelectState = Ut(), this.clippingPlanes = [], this.clipPlaneHelpers = [], this.clipHelperVisible = !1, this.clipHelperOpacity = 0.12, this.sceneCenter = new h.Vector3(), this.globalOffset = new h.Vector3(), this.componentMap = /* @__PURE__ */ new Map(), this.optimizedMapping = /* @__PURE__ */ new Map(), this.settings = {
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
    }, this.sceneBounds = new h.Box3(), this.cachedSceneSphere = new h.Sphere(), this.sceneSphereValid = !1, this.precomputedBounds = new h.Box3(), this.chunks = [], this.chunkIdSet = /* @__PURE__ */ new Set(), this.chunkById = /* @__PURE__ */ new Map(), this.chunkIndexById = /* @__PURE__ */ new Map(), this.processingChunks = /* @__PURE__ */ new Set(), this.cancelledChunkIds = /* @__PURE__ */ new Set(), this.frustum = new h.Frustum(), this.projScreenMatrix = new h.Matrix4(), this.logicTimer = null, this.nbimFiles = /* @__PURE__ */ new Map(), this.nbimMeta = /* @__PURE__ */ new Map(), this.nbimPropsByOriginalUuid = /* @__PURE__ */ new Map(), this.sharedMaterial = new h.MeshStandardMaterial({
      color: 14277857,
      roughness: 0.82,
      metalness: 0.03,
      side: h.DoubleSide
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
    }, this.movingPeripheralCursor = 0, this.movingPeripheralLastRefreshAt = 0, this.postMoveRecoveryUntil = 0, this.deferredStructureTimer = null, this.deferredStructureToken = 0, this.loadGeneration = 0, this.fastPreviewMeshLimit = 1200, this.fastPreviewModels = /* @__PURE__ */ new Set(), this.chunkCullingTempSize = new h.Vector3(), this.chunkCullingTempDirection = new h.Vector3(), this.chunkCullingTempForward = new h.Vector3(), this.chunkCullingTempCenterNdc = new h.Vector3(), this.boundsScanBatchSize = 2400, this.chunkRegistrationBatchSize = 18, this.chunkGhostBatchSize = 24, this.animationFrameId = null, this.animateFramePending = !1, this.disposed = !1, this.interactionShadowDowngraded = !1, this.interactionShadowRestoreAt = 0, this.interactionShadowRestoreDelayMs = 220, this.cullingScanCursor = 0, this.cullingTimeBudgetMovingMs = 4.5, this.cullingTimeBudgetRecoveryMs = 6, this.cullingTimeBudgetIdleMs = 9, this.forceMaxChunkLoadSpeed = !0, this.ghostMeshPool = [], this.canvas = e, this.options = t, this.resolvedChunkOptions = Ye(t.chunkOptions), t.performancePreset && (this.settings.performanceMode = t.performancePreset);
    const i = e.clientWidth, n = e.clientHeight;
    this.dotTexture = this.createCircleTexture(), this.clock = new h.Clock(), this.initHardwareProfile(), this.ghostEdgesGeometry = new h.EdgesGeometry(new h.BoxGeometry(1, 1, 1)), this.ghostMaterial = new h.LineBasicMaterial({ color: 4674921, transparent: !0, opacity: 0.3 }), this.renderer = new h.WebGLRenderer({
      canvas: e,
      antialias: !0,
      alpha: !0,
      logarithmicDepthBuffer: !1,
      // 正交相机不建议开启对数深度缓冲区，会导致 negative near 裁剪问题
      precision: "highp",
      powerPreference: "high-performance"
    }), this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)), this.renderer.setSize(i, n, !1), this.renderer.setClearColor(this.settings.bgColor), this.renderer.localClippingEnabled = !0, this.renderer.outputColorSpace = h.SRGBColorSpace, this.renderer.toneMapping = h.ACESFilmicToneMapping, this.renderer.toneMappingExposure = 1.04, this.activePixelRatio = this.renderer.getPixelRatio(), this.scene = new h.Scene(), this.contentGroup = new h.Group(), this.contentGroup.name = "Content", this.scene.add(this.contentGroup), this.helpersGroup = new h.Group(), this.helpersGroup.name = "Helpers", this.scene.add(this.helpersGroup), this.measureGroup = new h.Group(), this.measureGroup.name = "Measure", this.scene.add(this.measureGroup), this.ghostGroup = new h.Group(), this.ghostGroup.name = "Ghost", this.scene.add(this.ghostGroup), this.clipHelpersGroup = new h.Group(), this.clipHelpersGroup.name = "ClipHelpers", this.scene.add(this.clipHelpersGroup);
    const o = 100, r = i / n;
    this.camera = new h.OrthographicCamera(
      o * r / -2,
      o * r / 2,
      o / 2,
      o / -2,
      -1e6,
      1e6
    ), this.camera.up.set(0, 0, 1), this.camera.position.set(1e3, -1e3, 1e3), this.camera.lookAt(0, 0, 0), this.controls = new bt(this.camera, e), this.controls.enableDamping = !1, this.controls.screenSpacePanning = !0, this.controls.maxPolarAngle = Math.PI, this.controls.mouseButtons = {
      LEFT: h.MOUSE.ROTATE,
      MIDDLE: h.MOUSE.PAN,
      RIGHT: void 0
    }, this.controls.addEventListener("start", () => {
      const l = this.getChunkRuntimeProfile();
      this.isCameraMoving = !0, this.prefetchPaused = !0, this.chunkLoadResumeAt = performance.now() + l.resumeAfterMoveMs, this.postMoveRecoveryUntil = 0, this.interactionShadowRestoreAt = 0, this.movingPeripheralLastRefreshAt = 0, this.movingPeripheralCursor = 0, this.markSceneDirty({ needsCulling: !0 });
    }), this.controls.addEventListener("change", () => {
      const l = this.getChunkRuntimeProfile();
      this.isCameraMoving = !0, this.prefetchPaused = !0, this.chunkLoadResumeAt = performance.now() + l.resumeAfterMoveMs, this.postMoveRecoveryUntil = 0, this.interactionShadowRestoreAt = 0, this.markSceneDirty({ needsCulling: !0 });
    }), this.controls.addEventListener("end", () => {
      const l = performance.now(), p = this.getChunkRuntimeProfile();
      this.isCameraMoving = !1, this.prefetchPaused = !1, this.chunkLoadResumeAt = l + Math.max(24, Math.floor(p.resumeAfterMoveMs * 0.75)), this.postMoveRecoveryUntil = l + p.postMoveRecoveryMs, this.interactionShadowRestoreAt = l + this.interactionShadowRestoreDelayMs, this.movingPeripheralLastRefreshAt = 0, this.movingPeripheralCursor = 0, this.markSceneDirty({ needsCulling: !0 });
    }), this.ambientLight = new h.AmbientLight(16251131, this.settings.ambientInt), this.scene.add(this.ambientLight), this.dirLight = new h.DirectionalLight(16776438, this.settings.dirInt), this.dirLight.position.set(60, 45, 110), this.scene.add(this.dirLight), this.backLight = new h.DirectionalLight(15331062, this.settings.backLightInt ?? 0.5), this.backLight.position.set(-40, -35, 30), this.scene.add(this.backLight);
    const a = new h.Box3(new h.Vector3(), new h.Vector3());
    this.selectionBox = new h.Box3Helper(a, new h.Color(16776960)), this.selectionBox.visible = !1, this.helpersGroup.add(this.selectionBox);
    const c = new h.MeshBasicMaterial({
      color: this.settings.highlightColor,
      transparent: !1,
      opacity: 1,
      depthTest: !1,
      depthWrite: !1,
      side: h.BackSide
    });
    this.highlightMesh = new h.Mesh(new h.BufferGeometry(), c), this.highlightMesh.visible = !1, this.highlightMesh.renderOrder = 999, this.helpersGroup.add(this.highlightMesh);
    const u = new h.BufferGeometry();
    u.setAttribute("position", new h.Float32BufferAttribute([0, 0, 0], 3));
    const d = new h.PointsMaterial({
      color: 16711680,
      size: 8,
      sizeAttenuation: !1,
      map: this.dotTexture,
      transparent: !0,
      alphaTest: 0.5,
      depthTest: !1
    });
    this.tempMarker = new h.Points(u, d), this.tempMarker.visible = !1, this.tempMarker.renderOrder = 1e3, this.helpersGroup.add(this.tempMarker), this.setupClipping(), this.raycaster = new h.Raycaster(), this.raycaster.params.Points.threshold = 10, this.raycaster.params.Line || (this.raycaster.params.Line = { threshold: 1 }), this.raycaster.params.Line.threshold = 2, this.mouse = new h.Vector2(), this.animate = this.animate.bind(this), this.markSceneDirty();
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
      invalidateInteractables: o = !1
    } = e;
    o && (this.interactableListValid = !1), i && (this._needsBoundsUpdate = !0), n && (this.cullingDirty = !0), t && this.requestRender();
  }
  updateSettings(e) {
    this.settings = { ...this.settings, ...e }, this.applyHighlightSettings(), e.clip && this.setClipHelperOptions({
      visible: e.clip.helperVisible,
      opacity: e.clip.helperOpacity
    }), this.ambientLight.intensity = this.settings.ambientInt, this.dirLight.intensity = this.settings.dirInt, this.backLight.intensity = this.settings.backLightInt ?? 0.5, this.renderer.outputColorSpace = this.settings.colorSpace === "linear" ? h.LinearSRGBColorSpace : h.SRGBColorSpace, this.renderer.toneMapping = this.settings.toneMapping === "none" ? h.NoToneMapping : this.settings.toneMapping === "neutral" ? h.NeutralToneMapping : h.ACESFilmicToneMapping, this.renderer.toneMappingExposure = this.settings.exposure ?? 1, this.renderer.setClearColor(this.settings.bgColor), e.frustumCulling !== void 0 && this.contentGroup.traverse((t) => {
      t.isMesh ? t.frustumCulled = e.frustumCulling : t.isBatchedMesh && (t.frustumCulled = !1);
    }), e.maxRenderDistance !== void 0 && (this.maxRenderDistance = e.maxRenderDistance, this.checkCullingAndLoad()), this.renderer.render(this.scene, this.camera);
  }
  createCircleTexture() {
    const t = document.createElement("canvas");
    t.width = 64, t.height = 64;
    const i = t.getContext("2d");
    return i && (i.beginPath(), i.arc(64 / 2, 64 / 2, 64 / 2 - 2, 0, 2 * Math.PI), i.fillStyle = "#ffffff", i.fill()), new h.CanvasTexture(t);
  }
  animate() {
    if (this.disposed) return;
    this.animateFramePending = !1, this.animationFrameId = null;
    const e = performance.now();
    this.controls && this.controls.update(), this.updateInteractionPerformance(e), this.updateAdaptiveQuality(), this._needsBoundsUpdate && (this.updateSceneBounds(), this._needsBoundsUpdate = !1), this.updateCameraClipping();
    const t = performance.now(), i = this.getChunkRuntimeProfile(), n = this.getChunkRenderPhase(t), o = this.cullingDirty ? n === "moving" ? i.movingCullingIntervalMs : n === "recovery" ? i.recoveryCullingIntervalMs : Math.min(i.recoveryCullingIntervalMs, 70) : i.idleCullingIntervalMs;
    (!this._lastCullingTime || t - this._lastCullingTime > o) && (this.checkCullingAndLoad(t), this._lastCullingTime = t, this.cullingDirty = !1);
    const r = this.highlightMesh.material;
    if (r)
      if (this.locateFocusUuid && this.highlightMesh.visible) {
        const l = new h.Color(this.settings.highlightColor || "#ff9f1c"), p = 0.22 + (Math.sin(e / 125) + 1) * 0.3;
        r.color.copy(l).lerp(this.highlightPulseColor, p), r.opacity = 1;
      } else
        r.color.set(this.settings.highlightColor || "#ff9f1c"), r.opacity = 1;
    const a = this.selectionBox.material;
    if (this.locateFocusUuid && this.selectionBox.visible && a && !Array.isArray(a)) {
      const l = new h.Color(this.settings.highlightColor || "#ff9f1c"), p = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(e / 125));
      a.color.copy(l).lerp(this.highlightPulseColor, 0.34 * p);
    } else a && !Array.isArray(a) && a.color.set(this.settings.highlightColor || "#ff9f1c");
    this.renderer.render(this.scene, this.camera);
    const c = this.chunkLoadingEnabled && this.chunks.length > 0 && this.chunkLoadedCount < this.chunks.length, u = !!(this.locateFocusUuid && (this.highlightMesh.visible || this.selectionBox.visible));
    (this.isCameraMoving || this.isInPostMoveRecovery(t) || this.processingChunks.size > 0 || this.chunkWarmupActive || c || u) && this.requestRender();
  }
  updateAdaptiveQuality() {
    if (!this.settings.adaptiveQuality) return;
    const e = window.devicePixelRatio || 1, t = Math.min(e, this.settings.minPixelRatio ?? 0.8), i = Math.min(e, this.settings.maxPixelRatio ?? 2), n = this.chunks.length, o = this.originalStats.meshes, r = this.settings.performanceMode ?? "balanced";
    let a = i;
    if (this.isCameraMoving) {
      const u = r === "quality" ? n > 3500 || o > 25e4 ? 0.68 : n > 1600 || o > 12e4 ? 0.76 : 0.84 : r === "smooth" ? n > 3500 || o > 25e4 ? 0.44 : n > 1600 || o > 12e4 ? 0.52 : 0.6 : n > 3500 || o > 25e4 ? 0.48 : n > 1600 || o > 12e4 ? 0.56 : 0.65;
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
    const e = navigator, t = Math.max(2, e.hardwareConcurrency || 4), i = e.deviceMemory || 8, n = this.options.performancePreset ?? this.settings.performanceMode ?? "balanced", o = Lt(t, n);
    this.forceMaxChunkLoadSpeed ? (this.maxWorkers = Math.max(4, Math.min(12, t - 1)), this.maxConcurrentChunkLoads = Math.max(128, Math.min(192, this.maxWorkers * 24)), this.maxChunkLoadsPerFrame = Math.max(64, Math.min(128, this.maxWorkers * 14)), this.cullingTimeBudgetMovingMs = 7.5, this.cullingTimeBudgetRecoveryMs = 10.5, this.cullingTimeBudgetIdleMs = 14, this.chunkRegistrationBatchSize = 28, this.chunkGhostBatchSize = 40) : (this.maxWorkers = 4, this.maxConcurrentChunkLoads = o.maxConcurrentChunkLoads, this.maxChunkLoadsPerFrame = o.maxChunkLoadsPerFrame), this.maxLoadedChunks = i <= 4 ? 160 : i <= 8 ? 320 : 640, this.maxCachedChunks = i <= 4 ? 24 : i <= 8 ? 48 : 96, this.settings.targetFps = this.resolvedChunkOptions.targetMinFps;
  }
  collectObjectOverview(e) {
    let t = 0, i = 0, n = 0;
    return e.traverse((o) => {
      const r = o;
      !r.isMesh || !r.geometry || (t++, r.geometry.index ? i += r.geometry.index.count / 3 : r.geometry.attributes.position && (i += r.geometry.attributes.position.count / 3), n += vt(r.geometry));
    }), {
      meshes: t,
      faces: Math.floor(i),
      memory: parseFloat(n.toFixed(2))
    };
  }
  async estimateNbimStats(e, t, i) {
    let n = 0, o = 0, r = 0;
    for (let a = 0; a < t.length; a++) {
      const c = t[a], u = await e.slice(c.byteOffset, c.byteOffset + c.byteLength).arrayBuffer(), d = new DataView(u);
      let l = 0;
      const p = d.getUint32(l, !0);
      l += 4;
      const f = [];
      for (let g = 0; g < p; g++) {
        const M = d.getUint32(l, !0);
        l += 4;
        const y = d.getUint32(l, !0);
        l += 4, l += M * 12, l += M * 12, y > 0 && (l += y * 4), f.push(y > 0 ? y / 3 : M / 3);
      }
      const m = d.getUint32(l, !0);
      l += 4, n += m, r += c.byteLength / (1024 * 1024);
      for (let g = 0; g < m; g++) {
        l += 4, l += 4, l += 4, l += 64;
        const M = d.getUint32(l, !0);
        l += 4, o += f[M] || 0;
      }
      a > 0 && a % 8 === 0 && await this.yieldToMainThread();
    }
    return {
      meshes: n,
      faces: Math.floor(o),
      memory: parseFloat(r.toFixed(2))
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
    Jt({
      mesh: e,
      sharedMaterial: this.sharedMaterial
    });
  }
  touchChunkCache(e) {
    this.chunkCacheOrder = it(this.chunkCacheOrder, e);
  }
  cacheChunkMesh(e, t) {
    const i = ei({
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
    const t = ti({
      chunkId: e,
      chunkMeshCache: this.chunkMeshCache,
      chunkCacheOrder: this.chunkCacheOrder
    });
    return this.chunkCacheOrder = t.chunkCacheOrder, t.mesh;
  }
  clearChunkCache(e) {
    this.chunkCacheOrder = ii({
      chunkMeshCache: this.chunkMeshCache,
      chunkCacheOrder: this.chunkCacheOrder,
      disposeChunkMesh: (t) => this.disposeChunkMesh(t),
      filter: e
    });
  }
  hasValidChunkBinaryRange(e) {
    return Pe(e);
  }
  async readChunkBuffer(e) {
    const t = await Wt({
      chunk: e,
      nbimFiles: this.nbimFiles,
      chunkReadCache: this.chunkReadCache,
      chunkReadCacheOrder: this.chunkReadCacheOrder,
      chunkReadCacheSize: this.resolvedChunkOptions.chunkReadCacheSize
    });
    return this.chunkReadCacheOrder = t.chunkReadCacheOrder, t.buffer;
  }
  enqueueChunkPrefetch(e) {
    this.prefetchQueue = Ht({
      chunkIds: e,
      chunkPrefetchWindow: this.resolvedChunkOptions.chunkPrefetchWindow,
      prefetchQueue: this.prefetchQueue,
      prefetchQueueSet: this.prefetchQueueSet,
      prefetchInFlight: this.prefetchInFlight
    });
  }
  schedulePrefetchFromVisibleChunks(e) {
    const t = Nt({
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
    await jt({
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
    si({
      mesh: e,
      optimizedMapping: this.optimizedMapping
    });
  }
  registerOptimizedMeshMapping(e) {
    ni({
      mesh: e,
      optimizedMapping: this.optimizedMapping
    });
  }
  acquireGhostLine() {
    return ri({
      ghostMeshPool: this.ghostMeshPool,
      ghostEdgesGeometry: this.ghostEdgesGeometry,
      ghostMaterial: this.ghostMaterial
    });
  }
  releaseGhostLine(e) {
    oi({
      line: e,
      ghostMeshPool: this.ghostMeshPool
    });
  }
  createGhostLine(e, t) {
    return ai({
      name: e,
      bounds: t,
      acquireGhostLine: () => this.acquireGhostLine()
    });
  }
  ensureChunkGhost(e) {
    ci({
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
      for (let o = 0; o < n.length; o++) {
        if (n[o].id === e)
          return n[o] = t, !0;
        if (n[o].children && i(n[o].children)) return !0;
      }
      return !1;
    };
    this.structureRoot.children && i(this.structureRoot.children);
  }
  buildAndRegisterModelStructure(e) {
    let t;
    e.userData.isIFC ? t = this.buildIFCStructure(e) : t = this.buildSceneGraph(e);
    const i = (o) => {
      o.userData || (o.userData = {}), o.userData.originalUuid = e.uuid, o.children && o.children.forEach(i);
    };
    i(t);
    const n = (o) => {
      if (o.bimId) {
        const r = `${e.uuid}::${o.bimId}`;
        this.bimIdToNodeIds.has(r) || this.bimIdToNodeIds.set(r, []), this.bimIdToNodeIds.get(r).push(o.id);
      }
      o.children && o.children.forEach(n);
    };
    return n(t), t;
  }
  async yieldToMainThread() {
    await new Promise((e) => requestAnimationFrame(() => e()));
  }
  createPreviewGhost(e, t) {
    const i = this.createGhostLine(t, e);
    return i.material instanceof h.LineBasicMaterial && (i.material.opacity = 0.45), this.ghostGroup.add(i), i;
  }
  async computeItemBoundsProgressively(e, t) {
    const i = new h.Box3(), n = new h.Vector3(), o = new h.Vector3(), r = new h.Vector3();
    for (let a = 0; a < e.length; a += this.boundsScanBatchSize) {
      const c = Math.min(e.length, a + this.boundsScanBatchSize);
      for (let u = a; u < c; u++) {
        const d = e[u], l = d.center;
        let p = 0;
        const f = d.geometry;
        if (f.boundingSphere || f.computeBoundingSphere(), f.boundingSphere) {
          r.setFromMatrixScale(d.matrix);
          const m = Math.max(r.x, r.y, r.z);
          p = f.boundingSphere.radius * m;
        }
        n.set(l.x - p, l.y - p, l.z - p), o.set(l.x + p, l.y + p, l.z + p), i.expandByPoint(n), i.expandByPoint(o);
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
        for (let o = t; o < i; o++) {
          const r = e[o], a = this.getChunkById(r.chunkId);
          if (!a || a.loaded || this.cancelledChunkIds.has(r.chunkId) || this.ghostGroup.getObjectByName(`ghost_${r.chunkId}`)) continue;
          const c = this.createGhostLine(`ghost_${r.chunkId}`, r.bounds);
          this.ghostGroup.add(c), n = !0;
        }
        n && this.markSceneDirty(), i < e.length && await this.yieldToMainThread();
      }
  }
  async registerLeafChunksProgressively(e, t, i) {
    const n = [];
    for (let o = 0; o < t.length; o += this.chunkRegistrationBatchSize) {
      const r = Math.min(t.length, o + this.chunkRegistrationBatchSize);
      for (let a = o; a < r; a++) {
        const c = t[a], u = `${e.uuid}_chunk_${a}`, d = c.bounds.clone();
        c.items.forEach((f) => {
          const m = this.nodeMap.get(f.uuid);
          m && m.forEach((g) => {
            g.bimId === void 0 && (g.bimId = g.id), g.chunkId = u;
          });
        });
        const l = d.clone(), p = d.getSize(new h.Vector3()).multiplyScalar(this.chunkPadding);
        l.expandByVector(p), this.registerChunk({
          id: u,
          bounds: d,
          paddedBounds: l,
          _padding: this.chunkPadding,
          center: d.getCenter(new h.Vector3()),
          loaded: !1,
          node: c,
          groupName: `optimized_${e.uuid}`,
          originalUuid: e.uuid
        }), n.push({ chunkId: u, bounds: d });
      }
      i && t.length > 0 && i(40 + Math.floor(r / t.length * 50), `正在生成分块... (${r}/${t.length})`), r < t.length && await this.yieldToMainThread();
    }
    return n;
  }
  async buildLeafPlans(e, t, i, n) {
    const o = this.resolvedChunkOptions.preferWorkerOctree ? 1200 : this.octreeWorkerThreshold;
    if (e.length < o) {
      const d = Ze(e, t, { maxItemsPerNode: i, maxDepth: n });
      return Ke(d).map((l) => ({
        bounds: l.bounds,
        level: l.level,
        items: l.items
      }));
    }
    const r = new Float32Array(e.length * 3), a = new Float32Array(e.length);
    for (let d = 0; d < e.length; d++) {
      const l = e[d].center;
      r[d * 3] = l.x, r[d * 3 + 1] = l.y, r[d * 3 + 2] = l.z, a[d] = 0, d > 0 && d % 16e3 === 0 && await this.yieldToMainThread();
    }
    const c = await this.runWorkerTask({
      taskType: "buildOctreePlan",
      centers: r,
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
    }, [r.buffer, a.buffer]), u = [];
    for (let d = 0; d < c.length; d++) {
      const l = c[d];
      u.push({
        bounds: new h.Box3(
          new h.Vector3(l.bounds[0], l.bounds[1], l.bounds[2]),
          new h.Vector3(l.bounds[3], l.bounds[4], l.bounds[5])
        ),
        level: l.level,
        items: Array.from(l.itemIndices, (p) => e[p])
      }), d > 0 && d % 120 === 0 && await this.yieldToMainThread();
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
    let i = e, n = t;
    if (i === void 0 || n === void 0) {
      const l = this.canvas.parentElement?.getBoundingClientRect() || this.canvas.getBoundingClientRect();
      i = l.width, n = l.height;
    }
    if (i = Math.max(1, i), n = Math.max(1, n), i === 0 || n === 0) return;
    const o = i / n, r = this.camera, c = (r.top - r.bottom) / 2, u = c * o;
    r.left = -u, r.right = u, r.top = c, r.bottom = -c, r.updateProjectionMatrix();
    const d = this.settings.adaptiveQuality ? Math.min(window.devicePixelRatio, this.settings.maxPixelRatio ?? 2) : Math.min(window.devicePixelRatio, 2);
    this.activePixelRatio = d, this.renderer.setPixelRatio(d), this.renderer.setSize(i, n, !1), this.controls && this.controls.update(), this.renderer.render(this.scene, this.camera);
  }
  reportChunkProgress() {
    const e = fi({
      now: performance.now(),
      total: this.chunks.length,
      loaded: this.chunkLoadedCount,
      lastReportedProgress: this.lastReportedProgress,
      lastChunkProgressReportAt: this.lastChunkProgressReportAt
    });
    this.onChunkProgress && e.shouldNotify && (this.lastReportedProgress = e.nextProgress, this.lastChunkProgressReportAt = e.nextReportedAt, this.onChunkProgress(e.nextProgress.loaded, e.nextProgress.total));
  }
  getChunkRuntimeProfile(e = this.chunks.length) {
    return mi({
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
    e && (e.color.set(this.settings.highlightColor || "#ff9f1c"), e.transparent = !1, e.opacity = 1, e.depthTest = !1, e.depthWrite = !1, e.side = h.BackSide, e.needsUpdate = !0);
    const t = this.selectionBox.material;
    Array.isArray(t) ? t.forEach((i) => i.color.set(this.settings.highlightColor || "#ff9f1c")) : t && t.color.set(this.settings.highlightColor || "#ff9f1c");
  }
  getChunkRenderPhase(e) {
    return this.isCameraMoving ? "moving" : this.isInPostMoveRecovery(e) ? "recovery" : "idle";
  }
  getChunkFrameBudget(e, t, i) {
    return gi({
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
    return Mi({
      centrality: e,
      pixelSize: t,
      forwardness: i,
      profile: n
    });
  }
  shouldRefreshPeripheralChunk(e, t, i, n) {
    const o = yi({
      now: e,
      isCameraMoving: this.isCameraMoving,
      chunkIndex: t,
      totalChunks: i,
      profile: n,
      movingPeripheralCursor: this.movingPeripheralCursor,
      movingPeripheralLastRefreshAt: this.movingPeripheralLastRefreshAt
    });
    return this.movingPeripheralCursor = o.movingPeripheralCursor, this.movingPeripheralLastRefreshAt = o.movingPeripheralLastRefreshAt, o.shouldRefresh;
  }
  checkCullingAndLoad(e = performance.now()) {
    if (!this.chunkLoadingEnabled || this.chunks.length === 0 || (this.reportChunkProgress(), this.processingChunks.size >= this.maxConcurrentChunkLoads)) return;
    const t = this.getChunkRuntimeProfile(), i = this.getChunkRenderPhase(e), n = this.settings.performanceMode ?? "balanced";
    this.camera.updateMatrixWorld(), this.projScreenMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse), this.frustum.setFromProjectionMatrix(this.projScreenMatrix);
    const o = this.chunkPadding, r = this.camera.position, a = this.chunkCullingTempForward;
    this.camera.getWorldDirection(a);
    const c = this.chunkCullingTempDirection, u = this.chunkCullingTempSize, d = this.chunkCullingTempCenterNdc, l = (this.camera.top - this.camera.bottom) / this.camera.zoom, p = this.renderer.domElement.clientHeight, f = [], m = [], g = this.renderer.clippingPlanes.length > 0;
    let M = !1;
    const y = this.chunks.length, b = performance.now(), C = i === "moving" ? this.cullingTimeBudgetMovingMs : i === "recovery" ? this.cullingTimeBudgetRecoveryMs : this.cullingTimeBudgetIdleMs;
    let k = !1;
    const x = n !== "quality" && i === "moving" && y > 1800, v = x ? y > 5e3 ? 8 : y > 3e3 ? 6 : 4 : 1, P = x ? Math.floor(e / Math.max(1, t.movingPeripheralRefreshMs)) % v : 0, A = y > 0 ? this.cullingScanCursor % y : 0;
    for (let w = 0; w < y; w++) {
      const D = (A + w) % y, S = this.chunks[D];
      if ((w & 31) === 0 && performance.now() - b > C) {
        k = !0, this.cullingScanCursor = (D + 1) % y;
        break;
      }
      di({
        chunk: S,
        padding: o,
        tempSize: u
      });
      const T = this.frustum.intersectsBox(S.paddedBounds), z = g && this.isBoxClipped(S.bounds), I = pi({
        chunk: S,
        chunkIndex: D,
        totalChunks: y,
        now: e,
        phase: i,
        profile: t,
        performanceMode: n,
        isBoxClipped: z,
        inFrustum: T,
        maxRenderDistance: this.maxRenderDistance,
        cameraPos: r,
        cameraForward: a,
        projScreenMatrix: this.projScreenMatrix,
        toChunkDirection: c,
        tempCenterNdc: d,
        viewHeight: l,
        canvasHeight: p,
        sampleUnloadedWhileMoving: x,
        movingSampleStride: v,
        movingSampleSeed: P,
        resolveShouldRefreshPeripheral: (O) => !O || this.shouldRefreshPeripheralChunk(e, D, y, t),
        chunkWarmupActive: this.chunkWarmupActive,
        chunkLoadedCount: this.chunkLoadedCount,
        initialChunkLoadTarget: this.initialChunkLoadTarget,
        chunkLoadResumeAt: this.chunkLoadResumeAt,
        chunkMeshCached: this.chunkMeshCache.has(S.id)
      });
      if (!I.shouldSkipSample)
        if (I.effectiveVisible && (S.lastVisibleAt = e), (I.centrality > 0.42 || I.forwardness > 0.55) && (S.lastFocusAt = e), S.lastEffectiveVisible = I.effectiveVisible, S.loaded)
          if (m.push(S), S.mesh)
            S.mesh.visible !== I.effectiveVisible && (S.mesh.visible = I.effectiveVisible, M = !0);
          else {
            const F = this.contentGroup.getObjectByName(S.groupName)?.getObjectByName(S.id);
            F && (S.mesh = F, F.visible = I.effectiveVisible, M = !0);
          }
        else !this.processingChunks.has(S.id) && I.shouldBeVisible && I.priority !== null && (S.priority = I.priority, f.push(S));
    }
    k || (this.cullingScanCursor = (A + y) % Math.max(y, 1));
    const L = Yt({
      isCameraMoving: this.isCameraMoving,
      loadedChunks: m,
      maxLoadedChunks: this.maxLoadedChunks,
      cameraPos: r,
      now: e,
      chunkResidencyMs: this.chunkResidencyMs
    });
    for (const w of L)
      this.unloadChunk(w);
    L.length > 0 && (M = !0);
    const R = Zt({
      toLoad: f,
      now: performance.now(),
      chunkLoadResumeAt: this.chunkLoadResumeAt,
      maxConcurrentChunkLoads: this.maxConcurrentChunkLoads,
      processingChunkCount: this.processingChunks.size,
      chunkWarmupActive: this.chunkWarmupActive,
      chunkLoadedCount: this.chunkLoadedCount,
      initialChunkLoadTarget: this.initialChunkLoadTarget,
      warmupChunkBoost: this.warmupChunkBoost,
      getChunkFrameBudget: (w, D, S) => this.getChunkFrameBudget(w, D, S),
      phase: i,
      profile: t
    });
    for (const w of R)
      this.loadChunk(w);
    R.length > 0 && (M = !0), this.schedulePrefetchFromVisibleChunks(m), this.forceMaxChunkLoadSpeed, k && (this.cullingDirty = !0), this.chunkWarmupActive && this.chunkLoadedCount >= this.initialChunkLoadTarget && (this.chunkWarmupActive = !1, M = !0), (M || k) && this.markSceneDirty();
  }
  async runWorkerTask(e, t) {
    return hi({
      workerQueue: this.workerQueue,
      data: e,
      transferables: t,
      processQueue: () => this.processWorkerQueue()
    });
  }
  processWorkerQueue() {
    li({
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
    const t = $t({
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
      let t = !1, i = !1, n = !1, o = !1, r = !1;
      const { mesh: a, prefetchCandidates: c } = await _t({
        chunk: e,
        sharedMaterial: this.sharedMaterial,
        takeCachedChunkMesh: (l) => this.takeCachedChunkMesh(l),
        yieldToMainThread: () => this.yieldToMainThread(),
        nbimFiles: this.nbimFiles,
        hasValidChunkBinaryRange: (l) => this.hasValidChunkBinaryRange(l),
        readChunkBuffer: (l) => this.readChunkBuffer(l),
        nbimMeta: this.nbimMeta,
        runWorkerTask: (l, p) => this.runWorkerTask(l, p),
        reconstructBatchedMesh: (l, p) => Kt({
          data: l,
          material: p,
          resolveUuidByBimId: (f, m) => {
            const g = `${f}::${m}`;
            return this.bimIdToNodeIds.get(g)?.[0] || m || f;
          }
        }),
        isCameraMoving: this.isCameraMoving,
        chunkPrefetchWindow: this.resolvedChunkOptions.chunkPrefetchWindow,
        getChunkIndex: (l) => this.getChunkIndex(l),
        chunks: this.chunks,
        processingChunks: this.processingChunks
      });
      c.length > 0 && (this.enqueueChunkPrefetch(c), this.processPrefetchQueue()), a && (t = Qt({
        chunk: e,
        mesh: a,
        cancelledChunkIds: this.cancelledChunkIds,
        chunkIdSet: this.chunkIdSet,
        disposeChunkMesh: (p) => this.disposeChunkMesh(p),
        globalOffset: this.globalOffset,
        contentGroup: this.contentGroup,
        registerOptimizedMeshMapping: (p) => this.registerOptimizedMeshMapping(p)
      }).attached, t && (o = !0, n = !0, i = !0));
      const u = qt({
        chunk: e,
        loadedNow: t,
        now: performance.now(),
        chunkLoadedCount: this.chunkLoadedCount,
        chunkWarmupActive: this.chunkWarmupActive,
        initialChunkLoadTarget: this.initialChunkLoadTarget,
        deactivateFastPreviewForModel: (l) => this.deactivateFastPreviewForModel(l)
      });
      this.chunkLoadedCount = u.nextChunkLoadedCount, this.chunkWarmupActive = u.nextChunkWarmupActive, u.progressChanged && (this.reportChunkProgress(), r = !0, i = !0), this.cancelledChunkIds.delete(e.id), Xt({
        chunkId: e.id,
        ghostGroup: this.ghostGroup,
        releaseGhostLine: (l) => this.releaseGhostLine(l)
      }).changed && (i = !0), i && this.markSceneDirty({
        invalidateInteractables: o,
        needsBoundsUpdate: n,
        needsCulling: r
      });
    } catch (t) {
      console.error(`加载分块 ${e.id} 失败:`, t);
    } finally {
      this.processingChunks.delete(e.id), this.markSceneDirty();
    }
  }
  setChunkLoadingEnabled(e) {
    if (this.chunkLoadingEnabled = e, this.prefetchPaused = !e, this.cullingDirty = !0, e) {
      this.checkCullingAndLoad();
      return;
    }
    this.markSceneDirty();
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
    const t = Ye(e);
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
    this.contentGroup.visible = e, this.ghostGroup.visible = e, this.renderer.render(this.scene, this.camera);
  }
  buildSceneGraph(e) {
    const t = e.isMesh ? `Mesh_${e.id}` : `Group_${e.id}`, i = {
      id: e.uuid,
      name: he(e.name, e.userData?.name) || t,
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
      const n = i.isMesh ? `Mesh_${i.id}` : `Group_${i.id}`, o = {
        id: i.uuid,
        name: he(i.name, i.userData?.name) || n,
        type: i.isMesh ? "Mesh" : "Group",
        children: [],
        bimId: i.userData?.bimId ? String(i.userData.bimId) : i.userData?.expressID !== void 0 ? String(i.userData.expressID) : i.name ? String(i.name) : void 0,
        userData: { ...i.userData }
      };
      this.nodeMap.has(i.uuid) || this.nodeMap.set(i.uuid, []), this.nodeMap.get(i.uuid).push(o);
      for (const r of i.children)
        r.userData?.isIfcGridHelper || o.children.push(t(r));
      return o;
    };
    return t(e);
  }
  async prepareObjectRuntimeData(e, t, i = 6e3) {
    const n = [e];
    let o = 0;
    for (; n.length > 0; ) {
      const r = n.pop();
      if (r.isMesh) {
        const a = r;
        this.componentMap.set(a.uuid, a), a.userData.expressID !== void 0 && this.componentMap.set(a.userData.expressID, a), a.userData.bimId || (a.userData.expressID !== void 0 ? a.userData.bimId = String(a.userData.expressID) : a.userData.bimId = a.uuid), a.material && (Array.isArray(a.material) ? a.material : [a.material]).forEach((u) => {
          u.map && (u.map.anisotropy = t);
        });
      }
      o++;
      for (let a = r.children.length - 1; a >= 0; a--)
        n.push(r.children[a]);
      o > 0 && o % i === 0 && await this.yieldToMainThread();
    }
  }
  applyGlobalOffsetForModel(e) {
    const t = new h.Box3().setFromObject(e);
    return t.isEmpty() ? t : (this.globalOffset.length() === 0 && (t.getCenter(this.globalOffset), console.log("初始化全局偏移以解决大坐标问题:", this.globalOffset)), e.position.sub(this.globalOffset), e.updateMatrixWorld(!0), new h.Box3().setFromObject(e));
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
    let o = null;
    if (i && i(5, n ? "正在准备轻量预览..." : "正在构建场景树..."), n) {
      o = `deferred_${e.uuid}`;
      const r = {
        id: o,
        name: `${e.name || "Model"} (${t} meshes)`,
        type: "Group",
        children: [],
        userData: {
          originalUuid: e.uuid,
          deferred: !0,
          meshCount: t
        }
      };
      this.attachStructureRoot(r), this.onStructureUpdate && this.onStructureUpdate();
    } else {
      const r = this.buildAndRegisterModelStructure(e);
      this.attachStructureRoot(r);
    }
    return { shouldDeferStructure: n, deferredPlaceholderId: o };
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
    const o = this.fastPreviewMeshLimit;
    return e.traverse((r) => {
      if (!r.isMesh) return;
      const a = r, c = n < o;
      a.visible = c, a.userData.fastPreview = c, c && n++;
    }), i && i(8, `正在准备快速预览... (${n} meshes)`), n > 0 && (e.userData.fastPreviewActive = !0, this.fastPreviewModels.add(e.uuid)), n > 0;
  }
  attachModelToContentGroup(e, t = !1) {
    const i = new h.Group();
    i.name = `file_${e.uuid}`, i.userData.originalUuid = e.uuid;
    const n = se(
      he(
        typeof e.userData?.modelName == "string" ? e.userData.modelName : "",
        ue(e.name),
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
    const n = this.resolvedChunkOptions.loadProfile === "max-speed", o = n ? 1200 : this.octreeWorkerThreshold, r = t >= o ? await Pt(e, {
      batchSize: n ? 5200 : 3e3,
      onProgress: (m, g) => {
        if (!i || g === 0) return;
        const M = m / g;
        i(10 + Math.round(M * 10), `正在收集构件... (${m}/${g})`);
      }
    }) : It(e);
    if (r.length === 0) return;
    i && i(20, `已收集 ${r.length} 个构件，正在计算八叉树...`);
    const a = await this.computeItemBoundsProgressively(r, i);
    i && i(35, "正在计算八叉树...");
    const d = await this.buildLeafPlans(r, a, 3e3, 6), l = await this.registerLeafChunksProgressively(e, d, i);
    this.reportChunkProgress(), this.checkCullingAndLoad(), this.createChunkGhostsProgressively(l);
    const p = /* @__PURE__ */ new Set();
    for (const m of r) {
      const g = m.sourceMesh;
      g?.isMesh && p.add(g);
    }
    const f = p.size > 0 ? Array.from(p) : (() => {
      const m = [];
      return e.traverse((g) => {
        g.isMesh && m.push(g);
      }), m;
    })();
    for (let m = 0; m < f.length; m++) {
      const g = f[m];
      e.userData.fastPreviewActive && g.userData.fastPreview || (g.visible = !1, g.userData.isOptimized = !0, m > 0 && m % 6e3 === 0 && await this.yieldToMainThread());
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
          const o = this.buildAndRegisterModelStructure(e);
          this.replaceStructureNode(i, o), this.onStructureUpdate && this.onStructureUpdate();
        } catch (o) {
          console.warn("延迟构建结构树失败:", o);
        }
      }, 80);
      return;
    }
    this.onStructureUpdate && this.onStructureUpdate();
  }
  async addModel(e, t) {
    e.updateMatrixWorld(!0);
    const i = this.applyGlobalOffsetForModel(e), n = this.collectObjectOverview(e), o = n.meshes;
    this.configureModelWarmup(o), this.registerOriginalStats(e.uuid, n);
    const { shouldDeferStructure: r, deferredPlaceholderId: a } = this.prepareStructureStage(e, o, t), c = this.prepareModelBoundsStage(e, i), u = this.prepareFastVisibleStage(e, o, t);
    await this.prepareModelRuntimeStage(e, o), this.attachModelToContentGroup(e, u), await this.prepareModelChunkStage(e, o, t), this.finalizeModelStage(c, t), this.scheduleDeferredStructureReplacement(e, r, a);
  }
  removeObject(e) {
    this.cancelDeferredStructureBuild();
    const t = this.nodeMap.get(e), i = t?.[0]?.userData?.originalUuid || e, n = [];
    this.contentGroup.traverse((a) => {
      (a.name === `optimized_${e}` || a.name === `file_${e}` || a.userData.originalUuid === e || a.userData.originalUuid === i || a.name.startsWith("optimized_") && (a.userData.originalUuid === e || a.userData.originalUuid === i) || a.name.startsWith("file_") && (a.userData.originalUuid === e || a.userData.originalUuid === i)) && n.push(a);
    }), n.forEach((a) => {
      a.traverse((c) => {
        if (c.isBatchedMesh) {
          const u = c;
          this.disposeChunkMesh(u);
        }
      }), a.removeFromParent();
    });
    const o = this.contentGroup.getObjectByProperty("uuid", e), r = (a) => {
      const c = a instanceof h.Object3D ? a.uuid : a.id, u = this.optimizedMapping.get(c);
      if (u && (u.forEach((l) => {
        l.mesh.setVisibleAt(l.instanceId, !1);
      }), this.optimizedMapping.delete(c)), a.isMesh) {
        const l = a;
        l.geometry && l.geometry.dispose(), l.material && (Array.isArray(l.material) ? l.material : [l.material]).forEach((f) => f.dispose());
      } else if (a.isBatchedMesh) {
        const l = a;
        this.disposeChunkMesh(l);
      }
      this.componentMap.delete(c), a instanceof h.Object3D && a.userData.expressID !== void 0 && this.componentMap.delete(a.userData.expressID);
      const d = this.nodeMap.get(c);
      d && d.forEach((l) => {
        l.bimId !== void 0 && this.componentMap.delete(l.bimId);
      }), this.nodeMap.delete(c);
    };
    if (o)
      o.traverse(r), o.removeFromParent();
    else if (t && t.length > 0) {
      const a = (c) => {
        r(c), c.children && c.children.forEach(a);
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
        const c = new h.Box3().setFromObject(a);
        c.isEmpty() || this.precomputedBounds.union(c);
      }
    }), this.updateSceneBounds(), this.onStructureUpdate && this.onStructureUpdate(), this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    }), this.measureRecords.forEach((a, c) => {
      let u = a.modelUuid === e || a.modelUuid === i;
      !u && a.modelUuid && o && o.traverse((d) => {
        d.uuid === a.modelUuid && (u = !0);
      }), u && this.removeMeasurement(c);
    }), !0;
  }
  async removeModel(e) {
    return this.removeObject(e);
  }
  // --- NBIM 导入/导出功能 ---
  generateChunkBinaryV8(e, t) {
    const i = [], n = /* @__PURE__ */ new Map();
    e.forEach((u) => {
      u.geometry && !n.has(u.geometry) && (n.set(u.geometry, i.length), i.push(u.geometry));
    });
    let o = 4;
    for (const u of i) {
      const d = u.attributes.position.count, l = u.index, p = l ? l.count : 0;
      o += 8 + d * 12 + d * 12, p > 0 && (o += p * 4);
    }
    o += 4, o += e.length * 80;
    const r = new ArrayBuffer(o), a = new DataView(r);
    let c = 0;
    a.setUint32(c, i.length, !0), c += 4;
    for (const u of i) {
      const d = u.getAttribute("position"), l = u.getAttribute("normal"), p = d.count, f = u.index, m = f ? f.count : 0;
      a.setUint32(c, p, !0), c += 4, a.setUint32(c, m, !0), c += 4;
      for (let g = 0; g < p; g++)
        a.setFloat32(c, d.getX(g), !0), c += 4, a.setFloat32(c, d.getY(g), !0), c += 4, a.setFloat32(c, d.getZ(g), !0), c += 4;
      for (let g = 0; g < p; g++)
        a.setFloat32(c, l.getX(g), !0), c += 4, a.setFloat32(c, l.getY(g), !0), c += 4, a.setFloat32(c, l.getZ(g), !0), c += 4;
      if (f && m > 0)
        for (let g = 0; g < m; g++)
          a.setUint32(c, f.getX(g), !0), c += 4;
    }
    a.setUint32(c, e.length, !0), c += 4;
    for (const u of e) {
      const l = this.nodeMap.get(u.uuid)?.[0], p = u.bimId || l?.bimId || l?.id || u.uuid, f = t.get(p) ?? 0;
      a.setUint32(c, f, !0), c += 4;
      const m = typeof u.typeIndex == "number" ? u.typeIndex : 0;
      a.setUint32(c, m, !0), c += 4, a.setUint32(c, u.color, !0), c += 4;
      const g = u.matrix.elements;
      for (let y = 0; y < 16; y++)
        a.setFloat32(c, g[y], !0), c += 4;
      const M = n.get(u.geometry) || 0;
      a.setUint32(c, M, !0), c += 4;
    }
    return r;
  }
  async exportNbim(e) {
    if (this.chunks.length === 0) throw new Error("无模型数据可导出");
    const t = [""], i = /* @__PURE__ */ new Map(), n = (v) => {
      if (!v || i.has(v)) return;
      const P = t.length;
      t.push(v), i.set(v, P);
    }, o = (v) => {
      n(v.bimId), v.children && v.children.forEach(o);
    };
    o(this.structureRoot);
    const { ifcApiByModel: r, ifcManagerByModel: a } = Oi(this.contentGroup), c = await Di({
      structureRoot: this.structureRoot,
      ifcApiByModel: r,
      ifcManagerByModel: a
    }), { chunkBlobs: u, exportChunks: d, currentOffset: l } = await Ti({
      chunks: this.chunks,
      nbimFiles: this.nbimFiles,
      nbimMeta: this.nbimMeta,
      bimIdToIndex: i,
      hasValidChunkBinaryRange: (v) => this.hasValidChunkBinaryRange(v),
      generateChunkBinaryV8: (v, P) => this.generateChunkBinaryV8(v, P)
    }), p = {
      globalBounds: {
        min: { x: this.sceneBounds.min.x, y: this.sceneBounds.min.y, z: this.sceneBounds.min.z },
        max: { x: this.sceneBounds.max.x, y: this.sceneBounds.max.y, z: this.sceneBounds.max.z }
      },
      chunks: d,
      stats: this.originalStats,
      structureTree: Ii(this.structureRoot),
      bimIdTable: t,
      bimProperties: c
    }, f = Pi(p, this.structureRoot), m = new ArrayBuffer(1024), g = new DataView(m);
    g.setUint32(0, 1296646734, !0), g.setUint32(4, 8, !0), g.setUint32(8, l, !0), g.setUint32(12, f.byteLength, !0);
    const M = [m, ...u, f], y = new Blob(M, { type: "application/octet-stream" }), b = URL.createObjectURL(y), C = document.createElement("a");
    C.href = b;
    const k = Ri(this.contentGroup), x = se(ue((e || "").trim()) || k);
    C.download = `${x}.nbim`, C.click(), URL.revokeObjectURL(b);
  }
  async loadNbim(e, t) {
    const i = `nbim_${e.name}_${(/* @__PURE__ */ new Date()).getTime()}`;
    this.nbimFiles.set(i, e), t && t(10, "正在解析 NBIM 文件头...");
    const n = await Dt(e);
    if (n.magic !== 1296646734) throw new Error("不是有效的 NBIM 文件");
    const r = n.version;
    if (r !== 8)
      throw new Error(`不支持的 NBIM 版本: ${r}，当前仅支持 V8`);
    t && t(20, "正在读取元数据...");
    const a = await zt(e, n);
    this.nbimMeta.set(i, { version: r, bimIdTable: a.bimIdTable });
    const c = Ui({
      globalBounds: a.globalBounds,
      precomputedBounds: this.precomputedBounds,
      sceneBounds: this.sceneBounds,
      globalOffset: this.globalOffset
    });
    this.precomputedBounds.copy(c.precomputedBounds), this.sceneBounds.copy(c.sceneBounds), this.globalOffset.copy(c.globalOffset), c.initializedOffset && xe("SceneManager/NBIM", "初始化全局偏移", this.globalOffset);
    const u = a.structureTree;
    Fi({
      structureRoot: this.structureRoot,
      modelRoot: u
    });
    const d = u?.id || i, l = a?.bimProperties && typeof a.bimProperties == "object" ? a.bimProperties : {}, { defaultOwner: p, grouped: f } = Li(l, d);
    f.forEach((k, x) => this.nbimPropsByOriginalUuid.set(x, k));
    const m = Gi({
      manifestStats: a.stats,
      modelRoot: u,
      chunks: a.chunks
    });
    this.registerOriginalStats(d, m);
    const g = Ai({
      fileName: e.name,
      modelRootName: typeof u?.name == "string" ? u.name : "",
      rootId: d
    });
    this.contentGroup.add(g), this.interactableListValid = !1, Vi({
      modelRoot: u,
      defaultOwner: p,
      nodeMap: this.nodeMap,
      bimIdToNodeIds: this.bimIdToNodeIds
    }), t && t(30, "正在初始化分块...");
    const M = Array.isArray(a.chunks) ? a.chunks : [];
    this.applyNbimScaleTuning(M.length);
    const y = this.resolvedChunkOptions.ghostMode === "all" ? Number.MAX_SAFE_INTEGER : ds, { deferredGhostSpecs: b } = await Ei({
      chunkEntries: M,
      globalOffset: this.globalOffset,
      chunkPadding: this.chunkPadding,
      rootId: d,
      fileId: i,
      immediateGhostLimit: y,
      registrationBatchSize: us,
      onProgress: t,
      registerChunk: (k) => this.registerChunk(k),
      createGhostLine: (k, x) => this.createGhostLine(k, x),
      addGhostLine: (k) => this.ghostGroup.add(k),
      yieldToMainThread: () => this.yieldToMainThread()
    });
    b.length > 0 && this.createChunkGhostsProgressively(b), this.reportChunkProgress(), this.fitView(!0);
    const C = Wi({
      chunkCount: this.chunks.length,
      hasManifestStats: !!a.stats,
      hasManifestChunks: !!a.chunks?.length
    });
    this.chunkWarmupActive = C.chunkWarmupActive, this.initialChunkLoadTarget = C.initialChunkLoadTarget, t && t(100, "NBIM 已就绪，正在按需加载..."), this.checkCullingAndLoad(), C.shouldEstimateStats && this.estimateNbimStats(e, a.chunks, r).then((k) => {
      this.unregisterOriginalStats(d), this.registerOriginalStats(d, k);
    }).catch((k) => {
      console.warn("NBIM 统计估算失败:", k);
    });
  }
  async clear() {
    this.beginLoadGeneration(), xe("SceneManager", "开始清空场景..."), this.cancelDeferredStructureBuild(), this.resetExplode(), this.clearLocateFocus();
    try {
      const e = (t) => {
        if (t.isMesh) {
          const i = t;
          i.geometry && i.geometry.dispose(), i.material && (Array.isArray(i.material) ? i.material : [i.material]).forEach((o) => o.dispose());
        } else if (t.isBatchedMesh) {
          const i = t;
          i.geometry && i.geometry.dispose(), i.material && (Array.isArray(i.material) ? i.material : [i.material]).forEach((o) => o.dispose());
        }
      };
      for (this.contentGroup.traverse(e); this.contentGroup.children.length > 0; )
        this.contentGroup.remove(this.contentGroup.children[0]);
      for (; this.ghostGroup.children.length > 0; ) {
        const t = this.ghostGroup.children[0];
        this.ghostGroup.remove(t), this.releaseGhostLine(t);
      }
      this.ghostMeshPool.length = 0, this.selectionBox.visible = !1, this.highlightMesh.visible = !1, this.clearAllMeasurements(), this.optimizedMapping.clear(), this.sceneBounds.makeEmpty(), this.precomputedBounds.makeEmpty(), this.nbimFiles.clear(), this.nbimMeta.clear(), this.nbimPropsByOriginalUuid.clear(), this.structureRoot = { id: "root", name: "Root", type: "Group", children: [] }, this.nodeMap.clear(), this.bimIdToNodeIds.clear(), this.chunks = [], this.chunkIdSet.clear(), this.chunkById.clear(), this.chunkIndexById.clear(), this.lastReportedProgress = { loaded: -1, total: -1 }, this.processingChunks.clear(), this.cancelledChunkIds.clear(), this.prefetchQueue = [], this.prefetchQueueSet.clear(), this.prefetchInFlight.clear(), this.chunkLoadedCount = 0, this.reportChunkProgress(), this.componentMap.clear(), this.clearChunkCache(), this.chunkReadCache.clear(), this.chunkReadCacheOrder = [], this.originalStats = { meshes: 0, faces: 0, memory: 0 }, this.originalStatsByModel.clear(), this.fastPreviewModels.clear(), this.chunkLoadingEnabled = !0, this.contentGroup.visible = !0, this.ghostGroup.visible = !0, this.chunkWarmupActive = !1, this.globalOffset.set(0, 0, 0), xe("SceneManager", "场景已清空"), this.markSceneDirty();
    } catch (e) {
      throw console.error("清空场景失败:", e), e;
    }
  }
  getStructureNodes(e) {
    return this.nodeMap.get(e);
  }
  getBimIdByUuid(e) {
    return es({
      uuid: e,
      nodeMap: this.nodeMap,
      bimIdToNodeIds: this.bimIdToNodeIds
    });
  }
  resolveNodeUuidByBimId(e) {
    return dt(e, this.bimIdToNodeIds);
  }
  resolveSelectionUuid(e) {
    return ts(e, this.nodeMap, this.bimIdToNodeIds);
  }
  resolveNbimNode(e) {
    return pt(e, this.nodeMap);
  }
  getNbimProperties(e) {
    return is({
      id: e,
      nodeMap: this.nodeMap,
      nbimPropsByOriginalUuid: this.nbimPropsByOriginalUuid
    });
  }
  getNbimIfcPropertyGroups(e, t = "raw") {
    return ss({
      id: e,
      nodeMap: this.nodeMap,
      nbimPropsByOriginalUuid: this.nbimPropsByOriginalUuid
    }, t);
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
      locateMaterialCache: this.locateMaterialCache,
      locateObjectMaterialCache: this.locateObjectMaterialCache,
      locateDimmedInstances: this.locateDimmedInstances,
      clearClashPairHighlight: () => this.clearClashPairHighlight(),
      nodeMap: this.nodeMap
    };
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
    Mt(this.getVisibilityContext(), e), this.updateSceneBounds(), this.refreshExplodeState(), this.markSceneDirty();
  }
  hideObjects(e) {
    this.setObjectsVisibility(e, !1);
  }
  applyVisibilityBatch(e, t = {}) {
    const i = hs(this.getVisibilityContext(), e, t);
    i.nextHighlightedUuids && this.highlightObjects(i.nextHighlightedUuids), (t.invalidateInteractables ?? !0) && this.markSceneDirty({
      invalidateInteractables: !0,
      needsRender: !1
    }), i.needsBoundsUpdate && this.updateSceneBounds(), i.needsExplodeRefresh && this.refreshExplodeState(), i.needsRender && this.markSceneDirty();
  }
  setObjectsVisibility(e, t, i = {}) {
    if (e.length === 0) return;
    const n = e.map((r) => ({
      uuid: r,
      visible: t,
      showParents: i.showParents
    })), o = !i.deferRefresh;
    this.applyVisibilityBatch(n, {
      recomputeBounds: o,
      refreshExplode: i.refreshExplode ?? !1,
      invalidateInteractables: !i.deferRefresh
    });
  }
  isolateObjects(e) {
    ls(
      this.getVisibilityContext(),
      e,
      (t, i, n) => {
        const o = Be(this.getVisibilityContext(), t, i, n);
        if (o.nextHighlightedUuids) {
          const r = this.getHighlightContext(), a = we(r, o.nextHighlightedUuids);
          this.syncHighlightState(r.state), a.needsRender && this.markSceneDirty();
        }
      }
    ), this.markSceneDirty({
      invalidateInteractables: !0,
      needsRender: !1
    }), this.updateSceneBounds(), this.refreshExplodeState(), this.markSceneDirty();
  }
  setObjectVisibility(e, t, i = !0) {
    const n = Be(this.getVisibilityContext(), e, t, i);
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
    return this.explodeMode === "horizontal" ? t.z = 0 : this.explodeMode === "vertical" && (t.x = 0, t.y = 0, t.z = t.z >= 0 ? 1 : -1), t.lengthSq() < 1e-8 ? this.explodeMode === "vertical" ? new h.Vector3(0, 0, 1) : this.explodeMode === "horizontal" ? new h.Vector3(1, 0, 0) : new h.Vector3(0, 0, 1) : t.normalize();
  }
  /** 由 UUID 导出的稳定单位向量，近似均匀分布于球面（与径向方向混合后爆炸更散、更匀） */
  explodeStableUnitDirection(e, t) {
    Ot(e, t);
  }
  captureExplodeSnapshot() {
    this.explodeObjectStates.clear(), this.explodeInstanceStates.clear();
    let e = this.computeTotalBounds(!0, !0);
    if (e.isEmpty() && (e = this.computeTotalBounds(!1, !0)), e.isEmpty()) {
      this.explodeCenter.set(0, 0, 0);
      return;
    }
    this.explodeCenter.copy(e.getCenter(new h.Vector3()));
    const t = Math.max(e.getSize(new h.Vector3()).length() * 0.5, 1), i = new h.Box3(), n = new h.Vector3();
    this.contentGroup.updateMatrixWorld(!0), this.contentGroup.traverse((c) => {
      if (!c.isMesh || !c.visible || c.userData?.isIfcGridHelper || (i.setFromObject(c), i.isEmpty())) return;
      n.copy(i.getCenter(new h.Vector3()));
      const d = n.sub(this.explodeCenter), l = d.length() / t, p = 0.14 + 0.86 * Math.pow(h.MathUtils.clamp(l, 0, 2.5) / 2.5, 0.38);
      let f;
      if (this.explodeMode === "radial") {
        const g = this.getExplodeWorldDirection(d);
        this.explodeStableUnitDirection(c.uuid, this.explodeScratchUniform);
        const M = Math.pow(1 - Math.min(l / 1.08, 1), 1.15);
        f = this.explodeScratchMix.copy(g).multiplyScalar(1 - M).addScaledVector(this.explodeScratchUniform, M).normalize();
      } else
        f = this.getExplodeWorldDirection(d);
      const m = this.toLocalDirection(f, c.parent?.matrixWorld || new h.Matrix4());
      this.explodeObjectStates.set(c.uuid, {
        object: c,
        basePosition: c.position.clone(),
        directionLocal: m,
        weight: p
      });
    });
    const o = new h.Box3(), r = new h.Matrix4(), a = new h.Matrix4();
    this.optimizedMapping.forEach((c, u) => {
      (this.nodeMap.get(u)?.some((l) => l.visible !== !1) ?? !0) && c.forEach((l) => {
        const p = `${l.mesh.uuid}:${l.instanceId}`;
        if (this.explodeInstanceStates.has(p)) return;
        l.mesh.getMatrixAt(l.instanceId, r);
        const f = l.geometry || l.mesh.geometry;
        if (f?.boundingBox || f?.computeBoundingBox?.(), !f?.boundingBox || (a.copy(l.mesh.matrixWorld).multiply(r), o.copy(f.boundingBox).applyMatrix4(a), o.isEmpty())) return;
        n.copy(o.getCenter(new h.Vector3()));
        const m = n.sub(this.explodeCenter), g = m.length() / t, M = 0.14 + 0.86 * Math.pow(h.MathUtils.clamp(g, 0, 2.5) / 2.5, 0.38);
        let y;
        if (this.explodeMode === "radial") {
          const b = this.getExplodeWorldDirection(m);
          this.explodeStableUnitDirection(p, this.explodeScratchUniform);
          const C = Math.pow(1 - Math.min(g / 1.08, 1), 1.15);
          y = this.explodeScratchMix.copy(b).multiplyScalar(1 - C).addScaledVector(this.explodeScratchUniform, C).normalize();
        } else
          y = this.getExplodeWorldDirection(m);
        this.explodeInstanceStates.set(p, {
          mesh: l.mesh,
          instanceId: l.instanceId,
          baseMatrix: r.clone(),
          directionLocal: this.toLocalDirection(y, l.mesh.matrixWorld),
          weight: M
        });
      });
    });
  }
  applyExplodeState() {
    const e = this.computeTotalBounds(!0, !0), t = e.isEmpty() ? new h.Vector3(100, 100, 100) : e.getSize(new h.Vector3()), i = Math.max(t.length() * 0.125 * (this.explodeStrength / 100), 0);
    this.explodeObjectStates.forEach((c) => {
      c.object.position.copy(c.basePosition).addScaledVector(c.directionLocal, i * c.weight), c.object.updateMatrixWorld();
    });
    const n = new h.Vector3(), o = new h.Quaternion(), r = new h.Vector3(), a = new h.Matrix4();
    this.explodeInstanceStates.forEach((c) => {
      a.copy(c.baseMatrix), a.decompose(n, o, r), n.addScaledVector(c.directionLocal, i * c.weight), a.compose(n, o, r), c.mesh.setMatrixAt(c.instanceId, a), c.mesh.instanceMatrix && (c.mesh.instanceMatrix.needsUpdate = !0);
    }), this.interactableListValid = !1, this.updateSceneBounds(), this.markSceneDirty();
  }
  restoreExplodeSnapshot() {
    this.explodeObjectStates.forEach((e) => {
      e.object.position.copy(e.basePosition), e.object.updateMatrixWorld();
    }), this.explodeInstanceStates.forEach((e) => {
      e.mesh.setMatrixAt(e.instanceId, e.baseMatrix), e.mesh.instanceMatrix && (e.mesh.instanceMatrix.needsUpdate = !0);
    }), this.interactableListValid = !1, this.updateSceneBounds(), this.markSceneDirty();
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
    this.explodeStrength = h.MathUtils.clamp(e, 0, 100), this.explodeEnabled && (this.explodeObjectStates.size === 0 && this.explodeInstanceStates.size === 0 && this.captureExplodeSnapshot(), this.applyExplodeState());
  }
  setExplodeMode(e) {
    this.explodeMode = e, this.explodeEnabled && (this.restoreExplodeSnapshot(), this.captureExplodeSnapshot(), this.applyExplodeState());
  }
  resetExplode() {
    this.explodeStrength = 0, this.explodeEnabled && this.restoreExplodeSnapshot(), this.explodeEnabled = !1, this.explodeObjectStates.clear(), this.explodeInstanceStates.clear();
  }
  clearClashPairHighlight() {
    this.clashPairObjectMaterialCache.forEach((e, t) => {
      const i = this.contentGroup.getObjectByProperty("uuid", t);
      !i || !i.isMesh && !i.isBatchedMesh || (i.material = e);
    }), this.clashPairObjectMaterialCache.clear(), this.clashPairInstanceColorCache.forEach(({ mesh: e, instanceId: t, originalColor: i }) => {
      e.setColorAt(t, new h.Color(i)), e.instanceColor && (e.instanceColor.needsUpdate = !0);
    }), this.clashPairInstanceColorCache.clear(), this.clashPairUuids.clear();
  }
  setClashPairHighlight(e, t, i = "#ff4d4f", n = "#1890ff") {
    const o = String(e || "").trim(), r = String(t || "").trim();
    if (!o || !r) {
      this.clearClashPairHighlight(), this.markSceneDirty();
      return;
    }
    this.clearLocateFocus(), this.clearClashPairHighlight();
    const a = this.expandLocateTargets([o]), c = this.expandLocateTargets([r]), u = new h.Color(i), d = new h.Color(n);
    this.contentGroup.traverse((p) => {
      const f = p;
      if (!f.isMesh || !f.material) return;
      const m = a.has(p.uuid) ? "A" : c.has(p.uuid) ? "B" : null;
      if (!m) return;
      this.clashPairObjectMaterialCache.has(p.uuid) || this.clashPairObjectMaterialCache.set(p.uuid, f.material);
      const g = Array.isArray(f.material) ? f.material : [f.material], M = m === "A" ? u : d, y = g.map((b) => {
        if (!b) return b;
        const C = b.clone();
        return "transparent" in C && (C.transparent = !1), "opacity" in C && (C.opacity = 1), "depthWrite" in C && (C.depthWrite = !0), "color" in C && C.color && C.color.copy(C.color.clone().lerp(M, 0.86)), "emissive" in C && C.emissive && C.emissive.copy(M.clone().multiplyScalar(0.36)), C.needsUpdate = !0, C;
      });
      f.material = Array.isArray(f.material) ? y : y[0];
    });
    const l = /* @__PURE__ */ new Map();
    this.optimizedMapping.forEach((p) => {
      p.forEach((f) => {
        l.set(`${f.mesh.uuid}:${f.instanceId}`, f.originalColor);
      });
    }), this.contentGroup.traverse((p) => {
      const f = p;
      if (!p.isBatchedMesh) return;
      const m = f.userData?.batchIdToUuid;
      if (!m || m.size === 0) return;
      let g = !1;
      m.forEach((M, y) => {
        const b = a.has(M) ? "A" : c.has(M) ? "B" : null;
        if (!b) return;
        const C = `${f.uuid}:${y}`;
        if (!this.clashPairInstanceColorCache.has(C)) {
          const v = l.get(C);
          if (typeof v == "number")
            this.clashPairInstanceColorCache.set(C, {
              mesh: f,
              instanceId: y,
              originalColor: v
            });
          else {
            const P = new h.Color();
            f.getColorAt(y, P), this.clashPairInstanceColorCache.set(C, {
              mesh: f,
              instanceId: y,
              originalColor: P.getHex()
            });
          }
        }
        const k = this.clashPairInstanceColorCache.get(C)?.originalColor;
        if (typeof k != "number") return;
        const x = b === "A" ? u : d;
        f.setColorAt(y, new h.Color(k).lerp(x, 0.88)), g = !0;
      }), g && f.instanceColor && (f.instanceColor.needsUpdate = !0);
    }), this.clashPairUuids = /* @__PURE__ */ new Set([o, r]), this.markSceneDirty();
  }
  clearLocateFocus() {
    const e = this.getHighlightContext(), t = ve(e);
    this.syncHighlightState(e.state), t.needsRender && this.markSceneDirty();
  }
  expandLocateTargets(e) {
    const t = /* @__PURE__ */ new Set(), i = [...e], n = /* @__PURE__ */ new Set();
    for (; i.length > 0; ) {
      const o = i.shift();
      if (!o || n.has(o)) continue;
      n.add(o), t.add(o);
      const r = this.nodeMap.get(o);
      if (!(!r || r.length === 0)) {
        for (const a of r)
          if (!(!a.children || a.children.length === 0))
            for (const c of a.children)
              n.has(c.id) || i.push(c.id);
      }
    }
    return t;
  }
  setLocateResultSet(e, t = null) {
    const i = this.getHighlightContext(), n = Qe(i, e, t);
    this.syncHighlightState(i.state), n.needsRender && this.markSceneDirty();
  }
  setLocateFocusContext(e, t = null, i) {
    const n = this.getHighlightContext(), o = Qe(n, e, t, { highlightColors: i });
    this.syncHighlightState(n.state), o.needsRender && this.markSceneDirty();
  }
  setLocateFocus(e) {
    if (!e) {
      this.clearLocateFocus();
      return;
    }
    this.setLocateResultSet([e], e);
  }
  highlightObjects(e) {
    const t = this.getHighlightContext(), i = we(t, e);
    this.syncHighlightState(t.state), i.needsRender && this.markSceneDirty();
  }
  pick(e, t) {
    const i = this.getRayIntersects(e, t);
    return i ? { object: i.object, intersect: i } : null;
  }
  getRayIntersects(e, t) {
    const i = ji(this.getPickingContext(), e, t);
    return this.syncPickingState(i.state), i.intersect;
  }
  computeTotalBounds(e = !1, t = !1) {
    if (!e && !t && !this.precomputedBounds.isEmpty()) {
      const n = this.precomputedBounds.clone();
      return this.globalOffset.length() > 0 && n.translate(this.globalOffset.clone().negate()), n;
    }
    const i = new h.Box3();
    if (this.contentGroup.updateMatrixWorld(!0), this.contentGroup.traverse((n) => {
      if (!(e && !n.visible)) {
        if (n.isMesh && !n._skipTraverse) {
          const o = n;
          if (o.geometry) {
            const r = new h.Box3().setFromObject(o);
            r.isEmpty() || i.union(r);
          }
        } else if (n.isBatchedMesh && !n._skipTraverse) {
          const o = n;
          if (o.computeBoundingBox) {
            if (o.computeBoundingBox(), o.boundingBox) {
              const r = o.boundingBox.clone().applyMatrix4(o.matrixWorld);
              i.union(r);
            }
          } else {
            const r = new h.Box3().setFromObject(o);
            r.isEmpty() || i.union(r);
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
  unionObjectBounds(e, t) {
    const i = new h.Box3();
    e.userData?.boundingBox ? i.copy(e.userData.boundingBox).applyMatrix4(e.matrixWorld) : i.setFromObject(e), i.isEmpty() || t.union(i);
  }
  unionTilesNodeBounds(e, t) {
    const i = e?.userData?.tilesBoundingVolumeBox;
    if (!Array.isArray(i) || i.length < 12) return;
    const n = new h.Vector3(i[0], i[1], i[2]), o = new h.Vector3(i[3], i[4], i[5]), r = new h.Vector3(i[6], i[7], i[8]), a = new h.Vector3(i[9], i[10], i[11]), c = new h.Vector3(o.length(), r.length(), a.length()), u = new h.Box3(n.clone().sub(c), n.clone().add(c));
    u.isEmpty() || t.union(u);
  }
  unionOptimizedBounds(e, t) {
    const i = this.optimizedMapping.get(e);
    if (!i || i.length === 0) return;
    const n = new h.Matrix4();
    for (const o of i) {
      const r = o.geometry || o.mesh.geometry;
      if (r.boundingBox || r.computeBoundingBox(), !r.boundingBox) continue;
      o.mesh.getMatrixAt(o.instanceId, n), n.premultiply(o.mesh.matrixWorld);
      const a = r.boundingBox.clone().applyMatrix4(n);
      a.isEmpty() || t.union(a);
    }
  }
  unionNodeBounds(e, t, i = /* @__PURE__ */ new Set()) {
    if (!e || i.has(e)) return;
    i.add(e);
    const n = this.contentGroup.getObjectByProperty("uuid", e);
    n && this.unionObjectBounds(n, t), this.unionOptimizedBounds(e, t);
    const o = this.nodeMap.get(e) || [];
    for (const r of o) {
      this.unionTilesNodeBounds(r, t);
      const a = Array.isArray(r.children) ? r.children : [];
      for (const c of a)
        this.unionNodeBounds(c.id, t, i);
    }
  }
  fitViewToObject(e) {
    const t = new h.Box3();
    this.unionNodeBounds(e, t), t.isEmpty() || this.fitBox(t, !1, 1.14);
  }
  getBoundsForObject(e) {
    if (!e) return null;
    const t = new h.Box3();
    return this.unionNodeBounds(e, t), t.isEmpty() ? null : t;
  }
  collectBoundsForUuids(e) {
    const t = new h.Box3();
    return Array.from(new Set((e || []).filter(Boolean))).forEach((n) => this.unionNodeBounds(n, t)), t;
  }
  fitViewToObjects(e) {
    const t = this.collectBoundsForUuids(e);
    t.isEmpty() || this.fitBox(t, !1, 1.14);
  }
  fitBox(e, t = !0, i) {
    if (e.isEmpty()) {
      this.camera.zoom = 1, this.camera.position.set(1e3, 1e3, 1e3), this.camera.lookAt(0, 0, 0), this.controls.target.set(0, 0, 0), this.camera.updateProjectionMatrix(), this.controls.update();
      return;
    }
    const n = e.getCenter(new h.Vector3()), o = e.getSize(new h.Vector3()), r = Math.max(o.x, o.y, o.z), a = r > 0 ? r : 100, c = i ?? 1.02, u = this.canvas.clientWidth, d = this.canvas.clientHeight, l = u / d;
    let p, f;
    l >= 1 ? (p = a * c, f = p * l) : (f = a * c, p = f / l);
    const m = Math.max(a * 5, 200);
    this.camera.near = -m, this.camera.far = m;
    let g = 1, M = -f / 2, y = f / 2, b = p / 2, C = -p / 2;
    if (t) {
      const k = new h.Vector3(1, -1, 1).normalize(), x = Math.max(a * 2.2, 5), v = n.clone().add(k.multiplyScalar(x)), P = n.clone(), A = this.camera.position.clone(), L = this.controls.target.clone(), R = performance.now(), w = 600, D = () => {
        const S = performance.now() - R, T = Math.min(S / w, 1), z = 1 - Math.pow(1 - T, 3);
        this.camera.position.lerpVectors(A, v, z), this.controls.target.lerpVectors(L, P, z), this.camera.lookAt(this.controls.target), this.camera.zoom = 1 + (g - 1) * z, this.camera.left = this.camera.left + (M - this.camera.left) * z, this.camera.right = this.camera.right + (y - this.camera.right) * z, this.camera.top = this.camera.top + (b - this.camera.top) * z, this.camera.bottom = this.camera.bottom + (C - this.camera.bottom) * z, this.camera.updateProjectionMatrix(), this.controls.update(), this.renderer.render(this.scene, this.camera), T < 1 && requestAnimationFrame(D);
      };
      D();
    } else {
      const k = new h.Vector3();
      this.camera.getWorldDirection(k);
      const x = this.camera.position.distanceTo(this.controls.target), v = n.clone().add(k.multiplyScalar(-x)), P = n.clone(), A = 1.01, L = new h.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion), R = new h.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion), w = Math.max(1e-6, (this.camera.right - this.camera.left) * 0.5), D = Math.max(1e-6, (this.camera.top - this.camera.bottom) * 0.5), S = [
        new h.Vector3(e.min.x, e.min.y, e.min.z),
        new h.Vector3(e.min.x, e.min.y, e.max.z),
        new h.Vector3(e.min.x, e.max.y, e.min.z),
        new h.Vector3(e.min.x, e.max.y, e.max.z),
        new h.Vector3(e.max.x, e.min.y, e.min.z),
        new h.Vector3(e.max.x, e.min.y, e.max.z),
        new h.Vector3(e.max.x, e.max.y, e.min.z),
        new h.Vector3(e.max.x, e.max.y, e.max.z)
      ];
      let T = 0, z = 0;
      for (let _ = 0; _ < S.length; _++) {
        const N = S[_].clone().sub(n);
        T = Math.max(T, Math.abs(N.dot(L))), z = Math.max(z, Math.abs(N.dot(R)));
      }
      const I = Math.max(1e-3, T * A), O = Math.max(1e-3, z * A), F = Math.max(
        1e-4,
        Math.min(1e6, Math.min(w / I, D / O))
      ), H = this.camera.position.clone(), V = this.controls.target.clone(), E = this.camera.zoom, W = performance.now(), X = 600, Y = () => {
        const _ = performance.now() - W, N = Math.min(_ / X, 1), Z = 1 - Math.pow(1 - N, 3);
        this.camera.position.lerpVectors(H, v, Z), this.controls.target.lerpVectors(V, P, Z), this.camera.lookAt(this.controls.target), this.camera.zoom = E + (F - E) * Z, this.camera.updateProjectionMatrix(), this.controls.update(), this.renderer.render(this.scene, this.camera), N < 1 && requestAnimationFrame(Y);
      };
      Y();
    }
  }
  setView(e) {
    let t = this.computeTotalBounds(!0);
    t.isEmpty() && (t = this.computeTotalBounds(!1)), this.sceneBounds = t.clone();
    const i = t.isEmpty() ? new h.Vector3(0, 0, 0) : t.getCenter(new h.Vector3()), n = t.isEmpty() ? new h.Vector3(100, 100, 100) : t.getSize(new h.Vector3()), o = Math.max(n.x, n.y, n.z), r = Math.max(o * 2, 10);
    let a = new h.Vector3();
    switch (e) {
      case "top":
        a.set(0, 0, r);
        break;
      case "bottom":
        a.set(0, 0, -r);
        break;
      case "front":
        a.set(0, -r, 0);
        break;
      case "back":
        a.set(0, r, 0);
        break;
      case "left":
        a.set(-r, 0, 0);
        break;
      case "right":
        a.set(r, 0, 0);
        break;
      case "se":
      case "top-front-right":
        a.set(r, -r, r);
        break;
      case "sw":
      case "top-front-left":
        a.set(-r, -r, r);
        break;
      case "ne":
      case "top-back-right":
        a.set(r, r, r);
        break;
      case "nw":
      case "top-back-left":
        a.set(-r, r, r);
        break;
      case "bottom-front-right":
        a.set(r, -r, -r);
        break;
      case "bottom-front-left":
        a.set(-r, -r, -r);
        break;
      case "bottom-back-right":
        a.set(r, r, -r);
        break;
      case "bottom-back-left":
        a.set(-r, r, -r);
        break;
      case "top-front":
        a.set(0, -r, r);
        break;
      case "top-back":
        a.set(0, r, r);
        break;
      case "top-left":
        a.set(-r, 0, r);
        break;
      case "top-right":
        a.set(r, 0, r);
        break;
      case "bottom-front":
        a.set(0, -r, -r);
        break;
      case "bottom-back":
        a.set(0, r, -r);
        break;
      case "bottom-left":
        a.set(-r, 0, -r);
        break;
      case "bottom-right":
        a.set(r, 0, -r);
        break;
      case "front-left":
        a.set(-r, -r, 0);
        break;
      case "front-right":
        a.set(r, -r, 0);
        break;
      case "back-left":
        a.set(-r, r, 0);
        break;
      case "back-right":
        a.set(r, r, 0);
        break;
    }
    a.lengthSq() > 0 && (a.normalize().multiplyScalar(r), this.camera.position.copy(i).add(a), this.camera.lookAt(i), this.controls.target.copy(i), this.controls.update(), this.fitBox(t, !1));
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
    const i = new h.Box3();
    if (t.group.traverse((c) => {
      if ((c.isMesh || c.isLine || c.isSprite) && (c.updateMatrixWorld(), c.geometry)) {
        c.geometry.boundingBox || c.geometry.computeBoundingBox();
        const u = c.geometry.boundingBox.clone();
        u.applyMatrix4(c.matrixWorld), i.union(u);
      }
    }), i.isEmpty()) return;
    const n = i.getCenter(new h.Vector3()), o = i.getSize(new h.Vector3()), r = Math.max(o.x, o.y, o.z) || 1;
    this.controls.target.copy(n);
    const a = (this.camera.top - this.camera.bottom) / (r * 0.5);
    this.camera.zoom = Math.min(a, 100), this.camera.updateProjectionMatrix(), this.controls.update(), this.markSceneDirty();
  }
  // --- 测量逻辑 ---
  startMeasurement(e) {
    this.measureType = e, this.currentMeasurePoints = [], this.currentMeasureModelUuid = null, this.clearMeasurementPreview();
  }
  addMeasurePoint(e, t) {
    const i = this.getMeasurementContext(), n = qi(i, e, t);
    return this.syncMeasurementState(n.state), n.needsRender && this.markSceneDirty(), n.completed ?? null;
  }
  updateMeasurePreview(e) {
    const t = this.getMeasurementContext(), i = Re(t, e);
    this.syncMeasurementState(i.state);
  }
  updateMeasureHover(e, t) {
    const i = this.getMeasurementContext(), n = Qi(i, e, t);
    this.syncMeasurementState(n.state), n.needsRender && this.markSceneDirty();
  }
  finalizeMeasurement() {
    const e = this.getMeasurementContext(), t = lt(e);
    return this.syncMeasurementState(t.state), t.needsRender && this.markSceneDirty(), t.completed ?? null;
  }
  highlightMeasurement(e) {
    const t = Xi(this.getMeasurementContext(), e);
    this.syncMeasurementState(t.state), this.markSceneDirty();
  }
  pickMeasurement(e, t) {
    return Yi(this.getMeasurementContext(), e, t);
  }
  /**
   * 获取对象的面积和体积
   */
  getObjectGeometryData(e) {
    return Si({
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
    const i = Ft(this.boxSelectState, e, t);
    this.syncBoxSelectState(i.state);
  }
  /**
   * 更新框选范围
   */
  updateBoxSelect(e, t) {
    const i = Gt(this.boxSelectState, e, t);
    this.syncBoxSelectState(i.state);
  }
  /**
   * 完成框选，返回选中的对象 UUID 列表
   */
  endBoxSelect() {
    const e = Vt(
      this.boxSelectState,
      this.canvas,
      (t, i, n, o) => this.selectByScreenRect(t, i, n, o)
    );
    return this.syncBoxSelectState(e.state), e.selected;
  }
  /**
   * 取消框选
   */
  cancelBoxSelect() {
    const e = et(this.boxSelectState);
    this.syncBoxSelectState(e.state);
  }
  /**
   * 通过屏幕矩形选择对象
   */
  selectByScreenRect(e, t, i, n) {
    const o = ut(this.getPickingContext());
    return this.syncPickingState(o), Ji(
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
    const e = this.getMeasurementContext(), t = ht(e);
    this.syncMeasurementState(t.state), this.markSceneDirty();
  }
  // --- 剖切逻辑 ---
  setupClipping() {
    const e = ki(this.getClippingContext());
    this.syncClippingState(e.state);
  }
  setClipHelperOptions(e) {
    const t = xi(this.getClippingContext(), e);
    this.syncClippingState(t.state), this.markSceneDirty();
  }
  setClippingEnabled(e) {
    this.renderer.clippingPlanes = e ? this.clippingPlanes : [], e || this.clipPlaneHelpers.forEach((t) => t.visible = !1), this.markSceneDirty();
  }
  updateClippingPlanes(e, t, i) {
    const n = bi(this.getClippingContext(), e, t, i);
    this.syncClippingState(n.state), n.needsRender && this.markSceneDirty();
  }
  /**
   * 检查包围盒是否完全被当前剖切面裁剪掉
   * 如果包围盒完全在任意一个激活的剖切面的“背面”，则认为被裁剪
   */
  isBoxClipped(e) {
    return wi(this.clippingPlanes, e);
  }
  getStats() {
    return rs({
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
    this.disposed = !0, this.animateFramePending = !1, this.cancelBoxSelect(), vi({
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
async function gs(s) {
  const e = new wt();
  return new Promise((t, i) => {
    e.parse(
      s,
      (n) => {
        const o = new Blob([n], { type: "model/gltf-binary" });
        t(o);
      },
      (n) => i(n),
      { binary: !0 }
    );
  });
}
async function Ms(s, e) {
  e("准备LMB导出...");
  const t = [], i = [], n = /* @__PURE__ */ new Map();
  s.updateMatrixWorld(!0);
  const o = new h.Vector3(0, 0, 0);
  s.userData.originalCenter && o.copy(s.userData.originalCenter), s.traverse((M) => {
    if (M.isMesh && M.visible) {
      t.push(M);
      const y = M.material, b = y.color ? y.color.getHex() : 16777215;
      n.has(b.toString()) || (n.set(b.toString(), i.length), i.push(b));
    }
  });
  const r = [], a = new TextEncoder(), c = new ArrayBuffer(20), u = new DataView(c);
  u.setFloat32(0, o.x, !0), u.setFloat32(4, o.y, !0), u.setFloat32(8, o.z, !0), u.setUint32(12, i.length, !0), u.setUint32(16, t.length, !0), r.push(c);
  const d = new ArrayBuffer(i.length * 4), l = new DataView(d);
  for (let M = 0; M < i.length; M++)
    l.setUint32(M * 4, i[M], !0);
  r.push(d);
  for (let M = 0; M < t.length; M++) {
    const y = Math.floor(M / t.length * 100);
    M % 10 === 0 && e(`Encoding mesh ${M + 1}/${t.length} (${y}%)`);
    const b = t[M], C = b.geometry;
    if (!C.getAttribute("position")) continue;
    const k = C.getAttribute("position"), x = C.getAttribute("normal"), v = C.index, P = a.encode(b.name || `Node_${M}`), A = new ArrayBuffer(2);
    new DataView(A).setUint16(0, P.length, !0), r.push(A), r.push(P.buffer);
    const L = (4 - (2 + P.length) % 4) % 4;
    L > 0 && r.push(new Uint8Array(L).buffer);
    const w = b.matrixWorld.elements, D = new ArrayBuffer(36), S = new DataView(D), T = [0, 1, 2, 4, 5, 6, 8, 9, 10];
    for (let B = 0; B < 9; B++) S.setFloat32(B * 4, w[T[B]], !0);
    r.push(D);
    const z = new ArrayBuffer(12), I = new DataView(z);
    I.setFloat32(0, w[12], !0), I.setFloat32(4, w[13], !0), I.setFloat32(8, w[14], !0), r.push(z);
    let O = 1 / 0, F = 1 / 0, H = 1 / 0, V = -1 / 0, E = -1 / 0, W = -1 / 0;
    for (let B = 0; B < k.count; B++) {
      const U = k.getX(B), Q = k.getY(B), q = k.getZ(B);
      U < O && (O = U), Q < F && (F = Q), q < H && (H = q), U > V && (V = U), Q > E && (E = Q), q > W && (W = q);
    }
    V === O && (V += 1e-3), E === F && (E += 1e-3), W === H && (W += 1e-3);
    const X = V - O, Y = E - F, _ = W - H, N = (O + V) / 2, Z = (F + E) / 2, ne = (H + W) / 2, de = 32767 / (X * 0.5), pe = 32767 / (Y * 0.5), fe = 32767 / (_ * 0.5), re = new ArrayBuffer(24), G = new DataView(re);
    G.setFloat32(0, N, !0), G.setFloat32(4, Z, !0), G.setFloat32(8, ne, !0), G.setFloat32(12, de, !0), G.setFloat32(16, pe, !0), G.setFloat32(20, fe, !0), r.push(re);
    const $ = k.count, oe = new ArrayBuffer(4);
    new DataView(oe).setUint32(0, $, !0), r.push(oe);
    const te = k.getX(0), ae = k.getY(0), ce = k.getZ(0);
    G.setFloat32(0, te, !0), G.setFloat32(4, ae, !0), G.setFloat32(8, ce, !0);
    const Le = Math.max(Math.abs(V - te), Math.abs(O - te)), Ae = Math.max(Math.abs(E - ae), Math.abs(F - ae)), Oe = Math.max(Math.abs(W - ce), Math.abs(H - ce)), De = Le > 1e-4 ? 32767 / Le : 1, ze = Ae > 1e-4 ? 32767 / Ae : 1, Te = Oe > 1e-4 ? 32767 / Oe : 1;
    G.setFloat32(12, De, !0), G.setFloat32(16, ze, !0), G.setFloat32(20, Te, !0);
    const me = ($ - 1) * 6, Ue = new ArrayBuffer(me > 0 ? me : 0);
    if (me > 0) {
      const B = new DataView(Ue);
      for (let U = 1; U < $; U++) {
        const Q = k.getX(U), q = k.getY(U), Me = k.getZ(U), ye = Math.round((Q - te) * De), Ce = Math.round((q - ae) * ze), ke = Math.round((Me - ce) * Te), j = (U - 1) * 6;
        B.setInt16(j, ye, !0), B.setInt16(j + 2, Ce, !0), B.setInt16(j + 4, ke, !0);
      }
    }
    r.push(Ue);
    const Fe = new ArrayBuffer($ * 4), yt = new DataView(Fe);
    for (let B = 0; B < $; B++) {
      let U = 0, Q = 0, q = 1;
      x && (U = x.getX(B), Q = x.getY(B), q = x.getZ(B));
      const Me = (ye, Ce, ke) => {
        const j = (xt) => Math.max(0, Math.min(1023, Math.round((xt + 1) * 511)));
        return j(ye) << 20 | j(Ce) << 10 | j(ke);
      };
      yt.setUint32(B * 4, Me(U, Q, q), !0);
    }
    r.push(Fe);
    const ge = v ? v.count : $, ie = $ <= 255 ? 1 : $ <= 65535 ? 2 : 4, Ge = new ArrayBuffer(ge * ie), J = new DataView(Ge);
    if (v)
      for (let B = 0; B < ge; B++) {
        const U = v.getX(B);
        ie === 1 ? J.setUint8(B, U) : ie === 2 ? J.setUint16(B * 2, U, !0) : J.setUint32(B * 4, U, !0);
      }
    else
      for (let B = 0; B < ge; B++)
        ie === 1 ? J.setUint8(B, B) : ie === 2 ? J.setUint16(B * 2, B, !0) : J.setUint32(B * 4, B, !0);
    r.push(Ge);
    const Ve = b.material, Ct = Ve.color ? Ve.color.getHex() : 16777215, kt = n.get(Ct.toString()) || 0, Ee = new ArrayBuffer(4);
    new DataView(Ee).setUint32(0, kt, !0), r.push(Ee);
    const We = new ArrayBuffer(4);
    new DataView(We).setUint32(0, 0, !0), r.push(We);
  }
  e("完成LMB文件...");
  const p = r.reduce((M, y) => M + y.byteLength, 0), f = new ArrayBuffer(p), m = new Uint8Array(f);
  let g = 0;
  for (const M of r)
    m.set(new Uint8Array(M), g), g += M.byteLength;
  return new Blob([f], { type: "application/octet-stream" });
}
export {
  ms as S,
  ue as a,
  Ms as b,
  gs as e,
  se as s
};
