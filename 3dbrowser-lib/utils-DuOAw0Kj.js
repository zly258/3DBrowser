import * as h from "three";
import { OrbitControls as Rt } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFExporter as Lt } from "three/examples/jsm/exporters/GLTFExporter.js";
function At(s) {
  let e = 0;
  if (s.attributes)
    for (const t in s.attributes) {
      const i = s.attributes[t];
      i.array && (e += i.array.byteLength);
    }
  return s.index && s.index.array && (e += s.index.array.byteLength), e / (1024 * 1024);
}
function Dt(s) {
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
function ue(s) {
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
  return Ot(s.name);
}
function Ot(s) {
  return 9741240;
}
function zt(s) {
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
            color: ue(n),
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
          color: ue(n),
          matrix: a.clone(),
          center: c
        });
    }
  }), e;
}
async function Tt(s, e = {}) {
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
      const g = Array.isArray(l) ? l[0]?.uuid : l?.uuid, M = `${d.uuid}_${g}`;
      if (u.isInstancedMesh) {
        const m = u;
        for (let k = 0; k < m.count; k++) {
          m.getMatrixAt(k, i), i.premultiply(p);
          const b = new h.Vector3();
          d.boundingBox.getCenter(b), b.applyMatrix4(i), t.push({
            id: M,
            uuid: u.uuid,
            sourceMesh: u,
            expressID: m.userData.expressID,
            geometry: d,
            material: l,
            color: ue(u),
            matrix: i.clone(),
            center: b
          });
        }
      } else
        t.push({
          id: M,
          uuid: u.uuid,
          sourceMesh: u,
          expressID: u.userData.expressID,
          geometry: d,
          material: l,
          color: ue(u),
          matrix: p.clone(),
          center: f
        });
    }
    e.onProgress?.(Math.min(r + a.length, o.length), o.length), await new Promise((c) => requestAnimationFrame(() => c()));
  }
  return t;
}
function Ke(s, e, t, i = 0) {
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
      c.push(Ke(a[d], f, t, i + 1)), u = !0;
    }
  return u ? { bounds: e.clone(), children: c, items: [], level: i } : { bounds: e.clone(), children: null, items: s, level: i };
}
async function Ut(s, e, t = {}) {
  if (s.length === 0) return null;
  const i = t.batchSize ?? 1200, n = t.yieldControl ?? (() => new Promise((M) => requestAnimationFrame(() => M())));
  let o = 0, r = 0;
  const a = /* @__PURE__ */ new Map(), c = [];
  for (let M = 0; M < s.length; M++) {
    const m = s[M];
    let k = a.get(m.geometry);
    k || (k = Dt(m.geometry), a.set(m.geometry, k)), c.push({
      ...m,
      geometry: k
    }), o += k.attributes.position.count, k.index && (r += k.index.count), M > 0 && M % i === 0 && await n();
  }
  const u = new h.BatchedMesh(c.length, o, r, e);
  u.frustumCulled = !1, u.perInstanceFrustumCulling = !1;
  const d = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map();
  for (let M = 0; M < c.length; M++) {
    const m = c[M];
    let k = d.get(m.geometry);
    if (k === void 0 && (k = u.addGeometry(m.geometry), d.set(m.geometry, k)), k !== -1) {
      const b = u.addInstance(k);
      u.setMatrixAt(b, m.matrix), m.geometry.boundingBox || m.geometry.computeBoundingBox(), u.setBoundingBoxAt && u.setBoundingBoxAt(b, m.geometry.boundingBox);
      const y = new h.Color(m.color);
      u.setColorAt(b, y), m.expressID !== void 0 && l.set(b, m.expressID), p.set(b, m.uuid), f.set(b, m.color), g.set(b, m.geometry);
    }
    M > 0 && M % i === 0 && await n();
  }
  return u.userData.batchIdToExpressId = l, u.userData.batchIdToUuid = p, u.userData.batchIdToColor = f, u.userData.batchIdToGeometry = g, u.computeBoundingBox(), u.computeBoundingSphere(), u;
}
function je(s, e = []) {
  if (s.children)
    for (const t of s.children)
      je(t, e);
  else s.items.length > 0 && e.push(s);
  return e;
}
function Gt(s, e) {
  const t = Math.max(2, s), i = e === "smooth" ? 0.85 : e === "quality" ? 1.15 : 1, n = Math.max(20, Math.min(128, Math.floor(t * 10 * i))), o = Math.max(8, Math.min(48, Math.floor(t * 3 * i)));
  return {
    maxConcurrentChunkLoads: n,
    maxChunkLoadsPerFrame: o
  };
}
const Je = typeof window < "u" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
function xe(s, ...e) {
  Je && console.log(`[${s}]`, ...e);
}
function Ft(s, ...e) {
  Je && console.warn(`[${s}]`, ...e);
}
function Vt(s, e) {
  let t = 2166136261;
  for (let r = 0; r < s.length; r++)
    t ^= s.charCodeAt(r), t = Math.imul(t, 16777619);
  const i = (t >>> 0) / 4294967295 * Math.PI * 2, n = (t >>> 9 & 1023) / 1023 * 2 - 1, o = Math.sqrt(Math.max(0, 1 - n * n));
  return e.set(Math.cos(i) * o, Math.sin(i) * o, n).normalize(), e;
}
async function Et(s) {
  const e = await s.slice(0, 1024).arrayBuffer(), t = new DataView(e);
  return {
    magic: t.getUint32(0, !0),
    version: t.getUint32(4, !0),
    manifestOffset: t.getUint32(8, !0),
    manifestLength: t.getUint32(12, !0)
  };
}
async function Wt(s, e) {
  const i = await s.slice(e.manifestOffset, e.manifestOffset + e.manifestLength).text();
  return JSON.parse(i);
}
function Ht(s) {
  if (s.rectElement) return s.rectElement;
  const e = document.createElement("div");
  return e.style.cssText = `
        position: fixed; border: 1px dashed #00aaff;
        background: rgba(0, 170, 255, 0.08); pointer-events: none; z-index: 1000;
    `, document.body.appendChild(e), s.rectElement = e, e;
}
function et(s) {
  const e = Ht(s);
  e.style.left = `${Math.min(s.startX, s.endX)}px`, e.style.top = `${Math.min(s.startY, s.endY)}px`, e.style.width = `${Math.abs(s.endX - s.startX)}px`, e.style.height = `${Math.abs(s.endY - s.startY)}px`;
}
function Nt() {
  return {
    active: !1,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    rectElement: null
  };
}
function $t(s, e, t) {
  const i = {
    ...s,
    active: !0,
    startX: e,
    startY: t,
    endX: e,
    endY: t
  };
  return et(i), { state: i, needsRender: !0 };
}
function _t(s, e, t) {
  if (!s.active)
    return { state: s, needsRender: !1 };
  const i = {
    ...s,
    endX: e,
    endY: t
  };
  return et(i), { state: i, needsRender: !0 };
}
function tt(s) {
  return s.rectElement && s.rectElement.remove(), {
    state: {
      ...s,
      active: !1,
      rectElement: null
    },
    needsRender: !0
  };
}
function Qt(s, e, t) {
  if (!s.active)
    return {
      state: s,
      selected: [],
      needsRender: !1
    };
  const { state: i, needsRender: n } = tt(s), { startX: o, startY: r, endX: a, endY: c } = s, u = Math.abs(a - o), d = Math.abs(c - r);
  if (u < 5 || d < 5)
    return { state: i, selected: [], needsRender: n };
  const l = e.getBoundingClientRect(), p = (Math.min(o, a) - l.left) / l.width * 2 - 1, f = -(Math.max(r, c) - l.top) / l.height * 2 + 1, g = (Math.max(o, a) - l.left) / l.width * 2 - 1, M = -(Math.min(r, c) - l.top) / l.height * 2 + 1;
  return {
    state: i,
    selected: t(p, f, g, M),
    needsRender: n
  };
}
function Re(s) {
  return `${s.nbimFileId || "local"}:${s.byteOffset || 0}:${s.byteLength || 0}`;
}
function Le(s) {
  return Number.isFinite(s?.byteOffset) && Number.isFinite(s?.byteLength) && s.byteLength > 0;
}
function it(s, e) {
  const t = s.filter((i) => i !== e);
  return t.push(e), t;
}
function qt(s) {
  const {
    chunkReadCache: e,
    chunkReadCacheOrder: t,
    cacheKey: i,
    buffer: n,
    chunkReadCacheSize: o
  } = s;
  e.set(i, n);
  let r = it(t, i);
  for (; r.length > o; ) {
    const a = r.shift();
    a && e.delete(a);
  }
  return r;
}
async function Xt(s) {
  const {
    chunk: e,
    nbimFiles: t,
    chunkReadCache: i,
    chunkReadCacheOrder: n,
    chunkReadCacheSize: o
  } = s, r = Re(e), a = i.get(r);
  if (a)
    return {
      buffer: a.slice(0),
      chunkReadCacheOrder: it(n, r)
    };
  const c = t.get(e.nbimFileId);
  if (!c)
    throw new Error(`NBIM file not found for chunk: ${e.id}`);
  const u = await c.slice(e.byteOffset, e.byteOffset + e.byteLength).arrayBuffer();
  return {
    buffer: u,
    chunkReadCacheOrder: qt({
      chunkReadCache: i,
      chunkReadCacheOrder: n,
      cacheKey: r,
      buffer: u.slice(0),
      chunkReadCacheSize: o
    })
  };
}
function Yt(s) {
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
function Zt(s) {
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
    const g = r[f + 1];
    if (!g || g.loaded || a.has(g.id) || !g.nbimFileId || !Le(g)) continue;
    const M = Re(g);
    c.has(M) || d.push(g.id);
  }
  return {
    chunkIds: d,
    prefetchRoundRobinCursor: o + 1
  };
}
function Kt(s) {
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
async function jt(s) {
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
    chunks: g,
    processingChunks: M
  } = s, m = i(e.id);
  if (m)
    return { mesh: m, prefetchCandidates: [] };
  if (e.node)
    return { mesh: await Ut(e.node.items, t, {
      batchSize: 1200,
      yieldControl: () => n()
    }), prefetchCandidates: [] };
  if (e.nbimFileId && o.has(e.nbimFileId) && r(e)) {
    const k = await a(e), b = c.get(e.nbimFileId), y = b?.version ?? 8;
    if (y !== 8)
      throw new Error(`Unsupported NBIM version: ${y}. Only V8 is supported.`);
    const C = await u({
      buffer: k,
      version: y,
      originalUuid: e.originalUuid,
      bimIdTable: b?.bimIdTable
    }, [k]), x = d(C, t), w = [];
    if (!l && p > 0) {
      const I = f(e.id);
      if (I >= 0)
        for (let D = 1; D <= p; D++) {
          const R = g[I + D];
          if (!R) break;
          R.loaded || M.has(R.id) || !R.nbimFileId || !r(R) || w.push(R.id);
        }
    }
    return { mesh: x, prefetchCandidates: w };
  }
  return { mesh: null, prefetchCandidates: [] };
}
function Jt(s) {
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
function ei(s) {
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
function ti(s) {
  const { chunkId: e, ghostGroup: t, releaseGhostLine: i } = s, n = t.getObjectByName(`ghost_${e}`);
  return n ? (t.remove(n), i(n), { changed: !0 }) : { changed: !1 };
}
function ii(s) {
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
function si(s) {
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
  const f = [...e].sort((b, y) => y.priority - b.priority), g = n - o;
  if (g <= 0)
    return [];
  const M = r && a < c ? u : 0, m = d(l, p, M), k = Math.min(g, m, f.length);
  return f.slice(0, k);
}
function ni(s) {
  const { data: e, material: t, resolveUuidByBimId: i } = s, { geometries: n, instances: o, originalUuid: r } = e, a = n.some((y) => y.index && y.index.length > 0), c = n.map((y) => {
    const C = new h.BufferGeometry();
    if (C.setAttribute("position", new h.BufferAttribute(y.position, 3)), C.setAttribute("normal", new h.BufferAttribute(y.normal, 3)), y.index && y.index.length > 0)
      C.setIndex(new h.BufferAttribute(y.index, 1));
    else if (a) {
      const x = y.position.length / 3, w = new Uint32Array(x);
      for (let I = 0; I < x; I++)
        w[I] = I;
      C.setIndex(new h.BufferAttribute(w, 1));
    }
    return C;
  });
  let u = 0, d = 0;
  c.forEach((y) => {
    u += y.attributes.position.count, y.index && (d += y.index.count);
  });
  const l = new h.BatchedMesh(o.length, u, d, t);
  l.frustumCulled = !1, l.perInstanceFrustumCulling = !1;
  const p = c.map((y) => l.addGeometry(y)), f = new h.Matrix4(), g = new h.Color(), M = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
  return o.forEach((y) => {
    g.setHex(y.color), f.fromArray(y.matrix);
    const C = l.addInstance(p[y.geoIdx]);
    l.setMatrixAt(C, f), l.setColorAt(C, g);
    const x = c[y.geoIdx];
    x.boundingBox || x.computeBoundingBox(), x.boundingBox && l.setBoundingBoxAt && l.setBoundingBoxAt(C, x.boundingBox);
    const w = y.bimId;
    M.set(C, i(r, w)), m.set(C, w), k.set(C, y.color), b.set(C, x);
  }), l.userData.batchIdToUuid = M, l.userData.batchIdToBimId = m, l.userData.batchIdToColor = k, l.userData.batchIdToGeometry = b, l.computeBoundingBox(), l.computeBoundingSphere(), l;
}
async function ri(s) {
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
    if (!f || !f.nbimFileId || !Le(f))
      continue;
    const g = Re(f);
    c.has(g) || (o.add(p), u(f).catch((M) => {
      Ft("SceneManager/prefetch", `prefetch failed for ${p}`, M);
    }).finally(() => {
      o.delete(p), i.length > 0 && d();
    }));
  }
}
function oi(s) {
  const { mesh: e, sharedMaterial: t } = s;
  e.geometry && e.geometry.dispose(), e.material && e.material !== t && (Array.isArray(e.material) ? e.material : [e.material]).forEach((n) => n.dispose && n.dispose());
}
function st(s, e) {
  return [...s.filter((t) => t !== e), e];
}
function ai(s) {
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
  let a = st(n, e.id);
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
function ci(s) {
  const { chunkId: e, chunkMeshCache: t, chunkCacheOrder: i } = s, n = t.get(e) || null;
  return n ? (t.delete(e), {
    mesh: n,
    chunkCacheOrder: i.filter((o) => o !== e)
  }) : {
    mesh: null,
    chunkCacheOrder: i
  };
}
function hi(s) {
  const { chunkMeshCache: e, chunkCacheOrder: t, disposeChunkMesh: i, filter: n } = s;
  for (const [o, r] of e.entries())
    n && !n(o, r) || (i(r), e.delete(o));
  return t.filter((o) => e.has(o));
}
function li(s) {
  const { mesh: e, optimizedMapping: t } = s, i = e.userData.batchIdToUuid;
  if (i)
    for (const [n, o] of i.entries()) {
      const r = t.get(o);
      if (!r) continue;
      const a = r.findIndex((c) => c.mesh === e && c.instanceId === n);
      a !== -1 && r.splice(a, 1), r.length === 0 && t.delete(o);
    }
}
function ui(s) {
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
function di(s) {
  const { ghostMeshPool: e, ghostEdgesGeometry: t, ghostMaterial: i } = s, n = e.pop();
  return n ? (n.visible = !0, n) : new h.LineSegments(t, i);
}
function pi(s) {
  const { line: e, ghostMeshPool: t } = s;
  e.visible = !1, e.name = "", e.scale.set(1, 1, 1), e.position.set(0, 0, 0), e.material instanceof h.LineBasicMaterial && (e.material.opacity = 0.3), t.push(e);
}
function fi(s) {
  const { name: e, bounds: t, acquireGhostLine: i } = s, n = new h.Vector3(), o = new h.Vector3();
  t.getSize(n), t.getCenter(o);
  const r = i();
  return r.name = e, r.scale.copy(n), r.position.copy(o), r;
}
function mi(s) {
  const { chunk: e, ghostGroup: t, createGhostLine: i } = s;
  if (t.getObjectByName(`ghost_${e.id}`))
    return;
  const n = i(`ghost_${e.id}`, e.bounds);
  t.add(n);
}
function gi(s) {
  const { workerQueue: e, data: t, transferables: i, processQueue: n } = s;
  return new Promise((o, r) => {
    e.push({ resolve: o, reject: r, data: t, transferables: i }), n();
  });
}
function Mi(s) {
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
function yi(s) {
  const { workers: e, workerQueue: t, rejectReason: i } = s;
  for (const n of e)
    try {
      n.terminate();
    } catch (o) {
      console.warn("Worker terminate failed:", o);
    }
  t.length > 0 && t.splice(0, t.length).forEach((o) => o.reject(new Error(i)));
}
function ki(s) {
  const { chunk: e, padding: t, tempSize: i } = s;
  if (!e.paddedBounds || e._padding !== t) {
    const n = e.bounds.getSize(i), o = e.bounds.clone();
    o.expandByVector(n.multiplyScalar(t)), e.paddedBounds = o, e._padding = t;
  }
  e.center || (e.center = e.bounds.getCenter(new h.Vector3()));
}
function Ci(s) {
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
    tempCenterNdc: g,
    viewHeight: M,
    canvasHeight: m,
    sampleUnloadedWhileMoving: k,
    movingSampleStride: b,
    movingSampleSeed: y,
    resolveShouldRefreshPeripheral: C,
    chunkWarmupActive: x,
    chunkLoadedCount: w,
    initialChunkLoadTarget: I,
    chunkLoadResumeAt: D,
    chunkMeshCached: R
  } = s;
  f.copy(e.center).sub(d);
  const O = f.length(), P = O < u;
  if (k && !e.loaded && t % b !== y)
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
  const v = e.bounds.getSize(new h.Vector3()).length() / M * m, T = g.copy(e.center).applyMatrix4(p), A = Math.sqrt(T.x * T.x + T.y * T.y), B = 1 - Math.min(1, A), L = O > 1e-5 ? Math.max(0, l.dot(f.divideScalar(O))) : 1, G = v < 4, H = o === "moving" && B < r.movingFocusCentralityThreshold && v < r.movingFocusPixelThreshold, V = s.inFrustum && !c && P && !G && !H, E = Math.max(e.lastVisibleAt || 0, e.lastFocusAt || 0), W = o === "moving" && s.inFrustum && !c && P && !G && n - E < r.chunkVisibilityHoldMs, X = B < r.movingCoreCentralityThreshold && v < r.movingCorePixelThreshold && L < r.movingCoreForwardThreshold, Y = C(X), _ = o === "moving" && X && !Y ? e.lastEffectiveVisible ?? e.mesh?.visible ?? !1 : V || W, N = x || n < D + r.centerPriorityWindowMs, Z = B < r.centerPriorityThreshold && L < r.forwardPriorityThreshold && v < 96;
  let ne = null;
  if (!e.loaded && V) {
    const pe = B > 0.8 ? 4.5 : B > 0.62 ? 2.8 : 1, fe = Math.min(8, v / 120), me = 1e3 / (O + 1), re = L * 550, F = R ? 420 : 0, $ = x && w < I ? B > 0.65 ? 1500 : B > 0.45 ? 500 : 0 : 0, oe = o === "moving" ? B > 0.65 || L > 0.7 ? 900 : B > 0.4 ? 250 : -250 : 0;
    o === "moving" && B < 0.08 && v < 18 || o === "moving" && X && !Y || o !== "moving" && N && Z || o === "moving" && a === "smooth" && B < 0.3 && v < 54 && L < 0.62 || (ne = oe + F + $ + re + pe * 1e3 + fe * 120 + me + B * 300);
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
    dist: O,
    centrality: B,
    forwardness: L,
    pixelSize: v
  };
}
function bi(s) {
  const { now: e, total: t, loaded: i, lastReportedProgress: n, lastChunkProgressReportAt: o } = s, r = i !== n.loaded || t !== n.total, a = t === 0 || t > 0 && i >= t, c = e - o >= 48;
  return {
    shouldNotify: r && (c || a),
    nextProgress: { loaded: i, total: t },
    nextReportedAt: a || c ? e : o
  };
}
function xi(s) {
  const { chunkCount: e, compact: t, balanced: i, massive: n } = s;
  return e > 2e3 ? n : e > 600 ? i : t;
}
function wi(s) {
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
function vi(s) {
  const { centrality: e, pixelSize: t, forwardness: i, profile: n } = s;
  return e < n.movingCoreCentralityThreshold && t < n.movingCorePixelThreshold && i < n.movingCoreForwardThreshold;
}
function Si(s) {
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
    const g = Math.min(
      n,
      Math.max(o.movingPeripheralMinBatchSize, Math.ceil(n * o.movingPeripheralBatchRatio))
    );
    c = (c + g) % n, u = e;
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
const Bi = [16711680, 16711680, 65280, 65280, 255, 255];
function nt(s) {
  return s.map((e) => e.clone());
}
function ee(s, e, t, i, n, o, r) {
  if (!s) return;
  const a = o && r;
  s.visible = a, s.scale.set(Math.max(i, 1e-3), Math.max(n, 1e-3), 1), s.position.copy(t), s.lookAt(t.clone().add(e)), s.children.forEach((c) => {
    c.visible = a;
  });
}
function Ii(s) {
  const e = [
    new h.Plane(new h.Vector3(1, 0, 0), 0),
    new h.Plane(new h.Vector3(-1, 0, 0), 0),
    new h.Plane(new h.Vector3(0, 1, 0), 0),
    new h.Plane(new h.Vector3(0, -1, 0), 0),
    new h.Plane(new h.Vector3(0, 0, 1), 0),
    new h.Plane(new h.Vector3(0, 0, -1), 0)
  ];
  s.renderer.clippingPlanes = [], s.clipHelpersGroup.clear();
  const t = Bi.map((i) => {
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
function Pi(s, e) {
  const t = {
    ...s.state,
    clippingPlanes: nt(s.state.clippingPlanes),
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
function Ri(s, e, t, i) {
  if (e.isEmpty())
    return { state: s.state, needsRender: !1 };
  const n = nt(s.state.clippingPlanes), o = [...s.state.clipPlaneHelpers], r = { ...s.state, clippingPlanes: n, clipPlaneHelpers: o }, { min: a, max: c } = e, u = c.clone().sub(a), d = a.x + t.x[0] / 100 * u.x, l = a.x + t.x[1] / 100 * u.x, p = a.y + t.y[0] / 100 * u.y, f = a.y + t.y[1] / 100 * u.y, g = a.z + t.z[0] / 100 * u.z, M = a.z + t.z[1] / 100 * u.z, m = s.renderer.clippingPlanes.length > 0, k = new h.Vector3(
    i.x ? d : a.x,
    i.y ? p : a.y,
    i.z ? g : a.z
  ), b = new h.Vector3(
    i.x ? l : c.x,
    i.y ? f : c.y,
    i.z ? M : c.z
  ), y = k.clone().add(b).multiplyScalar(0.5), C = b.clone().sub(k), x = 5e-4;
  return i.x ? (n[0].constant = -d, n[1].constant = l, ee(
    o[0],
    new h.Vector3(1, 0, 0),
    new h.Vector3(d + x, y.y, y.z),
    C.z,
    C.y,
    m,
    r.clipHelperVisible
  ), ee(
    o[1],
    new h.Vector3(-1, 0, 0),
    new h.Vector3(l - x, y.y, y.z),
    C.z,
    C.y,
    m,
    r.clipHelperVisible
  )) : (n[0].constant = 1 / 0, n[1].constant = 1 / 0, o[0] && (o[0].visible = !1), o[1] && (o[1].visible = !1)), i.y ? (n[2].constant = -p, n[3].constant = f, ee(
    o[2],
    new h.Vector3(0, 1, 0),
    new h.Vector3(y.x, p + x, y.z),
    C.x,
    C.z,
    m,
    r.clipHelperVisible
  ), ee(
    o[3],
    new h.Vector3(0, -1, 0),
    new h.Vector3(y.x, f - x, y.z),
    C.x,
    C.z,
    m,
    r.clipHelperVisible
  )) : (n[2].constant = 1 / 0, n[3].constant = 1 / 0, o[2] && (o[2].visible = !1), o[3] && (o[3].visible = !1)), i.z ? (n[4].constant = -g, n[5].constant = M, ee(
    o[4],
    new h.Vector3(0, 0, 1),
    new h.Vector3(y.x, y.y, g + x),
    C.x,
    C.y,
    m,
    r.clipHelperVisible
  ), ee(
    o[5],
    new h.Vector3(0, 0, -1),
    new h.Vector3(y.x, y.y, M - x),
    C.x,
    C.y,
    m,
    r.clipHelperVisible
  )) : (n[4].constant = 1 / 0, n[5].constant = 1 / 0, o[4] && (o[4].visible = !1), o[5] && (o[5].visible = !1)), { state: r, needsRender: !0 };
}
function Li(s, e) {
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
function we(s) {
  s.geometry?.dispose?.(), (s.material ? Array.isArray(s.material) ? s.material : [s.material] : []).forEach((t) => t?.dispose?.());
}
function Ai(s) {
  for (s.cancelDeferredStructureBuild(), s.clearLocateFocus(), s.animationFrameId !== null && cancelAnimationFrame(s.animationFrameId), s.onAnimationFrameDisposed(), s.logicTimer && clearInterval(s.logicTimer), yi({
    workers: s.workers,
    workerQueue: s.workerQueue,
    rejectReason: "SceneManager disposed"
  }), s.onWorkersDisposed(), s.onQueuesReset(), s.onStateCachesReset(), s.clearChunkCache(); s.ghostGroup.children.length > 0; ) {
    const e = s.ghostGroup.children[0];
    s.ghostGroup.remove(e), s.releaseGhostLine(e);
  }
  s.controls.dispose(), we(s.selectionBox), we(s.highlightMesh), we(s.tempMarker), s.dotTexture.dispose(), s.sharedMaterial.dispose(), s.ghostEdgesGeometry.dispose(), s.ghostMaterial.dispose(), s.renderer.dispose();
}
function rt(s, e) {
  const t = new h.Matrix4();
  return e !== void 0 && s.isInstancedMesh ? (s.getMatrixAt(e, t), t) : t.copy(s.matrixWorld);
}
function $e(s, e, t) {
  const i = s.attributes.position, n = s.index, o = rt(e, t), r = new h.Vector3(), a = new h.Vector3(), c = new h.Vector3(), u = new h.Vector3();
  let d = 0;
  if (n)
    for (let l = 0; l < n.count; l += 3)
      r.fromBufferAttribute(i, n.getX(l)).applyMatrix4(o), a.fromBufferAttribute(i, n.getX(l + 1)).applyMatrix4(o), c.fromBufferAttribute(i, n.getX(l + 2)).applyMatrix4(o), d += r.dot(u.crossVectors(a, c)) / 6;
  else
    for (let l = 0; l < i.count; l += 3)
      r.fromBufferAttribute(i, l).applyMatrix4(o), a.fromBufferAttribute(i, l + 1).applyMatrix4(o), c.fromBufferAttribute(i, l + 2).applyMatrix4(o), d += r.dot(u.crossVectors(a, c)) / 6;
  return Math.abs(d);
}
function _e(s, e, t) {
  const i = s.attributes.position, n = s.index, o = rt(e, t), r = new h.Vector3(), a = new h.Vector3(), c = new h.Vector3(), u = new h.Vector3(), d = new h.Vector3();
  let l = 0;
  if (n)
    for (let p = 0; p < n.count; p += 3)
      r.fromBufferAttribute(i, n.getX(p)).applyMatrix4(o), a.fromBufferAttribute(i, n.getX(p + 1)).applyMatrix4(o), c.fromBufferAttribute(i, n.getX(p + 2)).applyMatrix4(o), l += u.subVectors(a, r).cross(d.subVectors(c, r)).length() / 2;
  else
    for (let p = 0; p < i.count; p += 3)
      r.fromBufferAttribute(i, p).applyMatrix4(o), a.fromBufferAttribute(i, p + 1).applyMatrix4(o), c.fromBufferAttribute(i, p + 2).applyMatrix4(o), l += u.subVectors(a, r).cross(d.subVectors(c, r)).length() / 2;
  return l;
}
function Di(s) {
  const { uuid: e, optimizedMapping: t, contentGroup: i } = s;
  let n = 0, o = 0;
  const r = t.get(e);
  if (r && r.length > 0)
    return r.forEach((c) => {
      c.geometry && (n += _e(c.geometry, c.mesh, c.instanceId), o += $e(c.geometry, c.mesh, c.instanceId));
    }), { area: n, volume: o };
  const a = i.getObjectByProperty("uuid", e);
  if (a && a.isMesh) {
    const c = a;
    c.geometry && (n = _e(c.geometry, c), o = $e(c.geometry, c));
  }
  return { area: n, volume: o };
}
function de(s) {
  return s.replace(/\.[^./\\]+$/, "");
}
function se(s) {
  return s.replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, " ").trim() || "model";
}
const Oi = /* @__PURE__ */ new Set(["", "n/a", "na", "undefined", "null", "-", "--"]);
function he(...s) {
  for (const e of s) {
    if (e == null) continue;
    const t = String(e).trim();
    if (!Oi.has(t.toLowerCase()))
      return t;
  }
  return "";
}
function ot(s) {
  if (!s) return 0;
  let e = s.type === "Mesh" ? 1 : 0;
  if (s.children)
    for (const t of s.children)
      e += ot(t);
  return e;
}
function Qe(s) {
  if (!s || typeof s != "object") return;
  const e = {};
  return s.originalUuid !== void 0 && (e.originalUuid = String(s.originalUuid)), s.expressID !== void 0 && (e.expressID = s.expressID), s.modelID !== void 0 && (e.modelID = s.modelID), Object.keys(e).length > 0 ? e : void 0;
}
function zi(s) {
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
  const o = Qe(s?.userData);
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
      const f = Qe(d?.userData);
      f && (p.userData = f), c.children.push(p), r.push({ src: d, dst: p });
    }
  }
  return n;
}
function Ti(s, e) {
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
function Ui(s) {
  const e = [];
  s.children.forEach((r) => {
    if (r.userData?.isOptimizedGroup || r.name.startsWith("optimized_")) return;
    const a = (typeof r.userData?.modelName == "string" ? r.userData.modelName : "") || r.children?.[0]?.name || "" || r.name, c = se(de(a));
    e.push(c);
  });
  const t = Array.from(new Set(e));
  if (t.length === 1) return t[0];
  const i = /* @__PURE__ */ new Date(), n = (r) => String(r).padStart(2, "0");
  return `批量导出_${`${i.getFullYear()}${n(i.getMonth() + 1)}${n(i.getDate())}_${n(i.getHours())}${n(i.getMinutes())}${n(i.getSeconds())}`}`;
}
function Gi(s, e) {
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
function Fi(s) {
  const { fileName: e, modelRootName: t, rootId: i } = s, n = new h.Group();
  n.name = `file_${i}`, n.userData.originalUuid = i;
  const o = se(de(e));
  return n.userData.modelName = se(
    he(t && t !== "Root" ? t : "", o, i) || o
  ), n;
}
function Vi(s) {
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
async function Ei(s) {
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
            const { ifcManager: d, modelID: l } = i.get(a), p = await d.getItemProperties(l, Number(u)), f = p?.rawGroups || p?.groups || null, g = p?.normalizedGroups || null;
            f && Object.keys(f).length > 0 && (n[c].ifcRawGroups = f), g && Object.keys(g).length > 0 && (n[c].ifcNormalizedGroups = g);
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
function Wi(s, e) {
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
    const g = new h.BufferGeometry();
    if (g.setAttribute("position", new h.BufferAttribute(new Float32Array(p), 3)), g.setAttribute("normal", new h.BufferAttribute(new Float32Array(f), 3)), l > 0) {
      const M = new Uint32Array(s, i, l);
      i += l * 4, g.setIndex(new h.BufferAttribute(new Uint32Array(M), 1));
    }
    o.push(g);
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
    for (let g = 0; g < 16; g++)
      a.elements[g] = t.getFloat32(i, !0), i += 4;
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
async function Hi(s) {
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
      const m = await t.get(l.nbimFileId).slice(l.byteOffset, l.byteOffset + l.byteLength).arrayBuffer(), k = i.get(l.nbimFileId), b = k?.version ?? 8;
      if (b !== 8)
        throw new Error(`Unsupported NBIM version: ${b}. Only V8 is supported.`);
      const C = Wi(m, k?.bimIdTable || []).map((x) => ({
        uuid: "",
        bimId: x.bimId,
        typeIndex: x.typeIndex,
        color: x.color,
        matrix: x.matrix,
        geometry: x.geometry
      }));
      f = r(C, n);
    }
    if (!f)
      continue;
    const g = new Uint8Array(f);
    a.push(g), p.byteOffset = u, p.byteLength = g.byteLength, u += g.byteLength;
  }
  return {
    chunkBlobs: a,
    exportChunks: c,
    currentOffset: u
  };
}
function Ni(s) {
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
function $i(s) {
  const { structureRoot: e, modelRoot: t } = s;
  return e.children || (e.children = []), t && (t.children && t.name === "Root" ? e.children.push(...t.children) : e.children.push(t)), e;
}
function _i(s) {
  const { manifestStats: e, modelRoot: t, chunks: i } = s;
  return e || {
    meshes: ot(t),
    faces: 0,
    memory: parseFloat(((i || []).reduce((n, o) => n + (o.byteLength || 0), 0) / (1024 * 1024)).toFixed(2))
  };
}
function Qi(s) {
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
async function qi(s) {
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
  const f = t.lengthSq() > 0 ? t.clone().negate() : null, g = [];
  for (let M = 0; M < e.length; M++) {
    const m = e[M];
    if (!m?.bounds || typeof m.byteOffset != "number" || typeof m.byteLength != "number")
      throw new Error("NBIM 分块数据不完整，可能格式有问题");
    const k = new h.Box3(
      new h.Vector3(m.bounds.min.x, m.bounds.min.y, m.bounds.min.z),
      new h.Vector3(m.bounds.max.x, m.bounds.max.y, m.bounds.max.z)
    );
    f && k.translate(f);
    const b = m.id, y = k.getCenter(new h.Vector3()), C = k.clone(), x = k.getSize(new h.Vector3()).multiplyScalar(i);
    if (C.expandByVector(x), u({
      id: b,
      bounds: k,
      paddedBounds: C,
      _padding: i,
      center: y,
      loaded: !1,
      byteOffset: m.byteOffset,
      byteLength: m.byteLength,
      nbimFileId: o,
      groupName: `optimized_${n}`,
      originalUuid: m.originalUuid ? String(m.originalUuid) : n
    }), M < r ? l(d(`ghost_${b}`, k)) : g.push({ chunkId: b, bounds: k }), (M + 1) % a === 0) {
      if (c) {
        const w = Math.max(0, Math.min(1, (M + 1) / e.length));
        c(30 + Math.round(w * 40), "正在初始化分块...");
      }
      await p();
    }
  }
  return {
    deferredGhostSpecs: g
  };
}
function Xi(s) {
  const { chunkCount: e, hasManifestStats: t, hasManifestChunks: i } = s;
  return {
    chunkWarmupActive: !0,
    initialChunkLoadTarget: e > 200 ? 44 : e > 80 ? 30 : 16,
    shouldEstimateStats: !t && i
  };
}
function Yi(s, e) {
  const t = s.nodeMap.get(e);
  return !t || t.length === 0 || t.some((i) => i.visible !== !1);
}
function at(s, e, t) {
  return s.nodeMap.get(e)?.[0]?.name || t;
}
function ct(s) {
  let e = s;
  for (; e; ) {
    if (!e.visible) return !1;
    e = e.parent;
  }
  return !0;
}
function ht(s, e) {
  if (s.boundingBox || s.computeBoundingBox(), !s.boundingBox) return null;
  const t = s.boundingBox.clone().applyMatrix4(e);
  return t.isEmpty() ? null : t;
}
function ve(s, e, t) {
  if (!ct(e) || !e.geometry || e.userData?.isIfcGridHelper || e.isBatchedMesh || e.userData?.isOptimized) return;
  e.updateMatrixWorld(!0);
  const i = ht(e.geometry, e.matrixWorld);
  if (!i) return;
  const n = `mesh:${e.uuid}`;
  t.set(n, {
    key: n,
    uuid: e.uuid,
    name: e.name || at(s, e.uuid, e.uuid),
    object: e,
    geometry: e.geometry,
    matrixWorld: e.matrixWorld.clone(),
    box: i,
    type: "mesh"
  });
}
function lt(s, e, t, i) {
  if (!ct(t.mesh) || !Yi(s, e)) return;
  const n = t.geometry || t.mesh.geometry;
  if (!n) return;
  const o = new h.Matrix4();
  t.mesh.getMatrixAt(t.instanceId, o), o.premultiply(t.mesh.matrixWorld);
  const r = ht(n, o);
  if (!r) return;
  const a = `instance:${t.mesh.uuid}:${t.instanceId}`;
  i.set(a, {
    key: a,
    uuid: e,
    name: at(s, e, e),
    object: t.mesh,
    geometry: n,
    matrixWorld: o.clone(),
    box: r,
    type: "instance",
    ownerUuid: e,
    batchedMesh: t.mesh,
    instanceId: t.instanceId,
    originalColor: t.originalColor
  });
}
function Zi(s, e) {
  const t = /* @__PURE__ */ new Set(), i = e.filter(Boolean), n = /* @__PURE__ */ new Set();
  for (; i.length > 0; ) {
    const o = i.shift();
    if (!o || n.has(o)) continue;
    n.add(o), t.add(o);
    const r = s.nodeMap.get(o);
    if (r)
      for (const a of r) {
        const c = Array.isArray(a.children) ? a.children : [];
        for (const u of c)
          n.has(u.id) || i.push(u.id);
      }
  }
  return t;
}
function ut(s, e) {
  const t = /* @__PURE__ */ new Map(), i = Zi(s, Array.from(new Set(e.filter(Boolean))));
  return s.contentGroup.updateMatrixWorld(!0), i.forEach((n) => {
    const o = s.optimizedMapping.get(n);
    o && o.forEach((a) => lt(s, n, a, t));
    const r = s.contentGroup.getObjectByProperty("uuid", n);
    if (r) {
      if (r.isMesh) {
        ve(s, r, t);
        return;
      }
      r.traverse((a) => {
        a !== r && a.isMesh && ve(s, a, t);
      });
    }
  }), Array.from(t.values());
}
function Ki(s) {
  const e = /* @__PURE__ */ new Map();
  return s.contentGroup.updateMatrixWorld(!0), s.contentGroup.traverse((t) => {
    t.isMesh && ve(s, t, e);
  }), s.optimizedMapping.forEach((t, i) => {
    t.forEach((n) => lt(s, i, n, e));
  }), Array.from(e.values());
}
function le(s, e) {
  const t = new h.Box3();
  return ut(s, e).forEach((i) => t.union(i.box)), t;
}
function dt(s) {
  return new h.Color(s.highlightColor || "#ff9f1c");
}
function ji(s, e) {
  for (const t of e) {
    const i = s.optimizedMapping.get(t);
    i && i.forEach((n) => {
      n.mesh.setColorAt(n.instanceId, new h.Color(n.originalColor)), n.mesh.instanceColor && (n.mesh.instanceColor.needsUpdate = !0);
    });
  }
}
function Ji(s, e) {
  const t = dt(s.settings);
  for (const i of e) {
    const n = s.optimizedMapping.get(i);
    n && n.forEach((o) => {
      o.mesh.setColorAt(o.instanceId, t), o.mesh.instanceColor && (o.mesh.instanceColor.needsUpdate = !0);
    });
  }
}
function es(s, e) {
  if (s.selectionBox.visible = !1, s.highlightMesh.visible = !1, e.size === 0)
    return;
  const t = le(s, Array.from(e));
  if (!t.isEmpty()) {
    s.selectionBox.box.copy(t);
    const u = !!(s.state.locateFocusUuid && e.has(s.state.locateFocusUuid));
    if (u) {
      const d = Math.max(t.getSize(new h.Vector3()).length() * 0.048, 0.22);
      s.selectionBox.box.expandByScalar(d);
    }
    s.selectionBox.visible = u || !!s.settings.highlightShowBox;
  }
  const i = s.state.lastSelectedUuid;
  if (!i) return;
  const n = s.optimizedMapping.get(i);
  if (n && n.length > 0) {
    s.highlightMesh.visible = !1;
    return;
  }
  const o = s.contentGroup.getObjectByProperty("uuid", i);
  if (!o || !o.isMesh) return;
  o.updateMatrixWorld(!0), s.highlightMesh.geometry = o.geometry;
  const r = new h.Vector3(), a = new h.Quaternion(), c = new h.Vector3();
  o.matrixWorld.decompose(r, a, c), c.multiplyScalar(1.035), s.highlightMesh.position.copy(r), s.highlightMesh.quaternion.copy(a), s.highlightMesh.scale.copy(c), s.highlightMesh.visible = !0;
}
function pt(s, e) {
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
function Se(s, e) {
  s.clearClashPairHighlight();
  const t = Array.from(new Set(e.filter(Boolean))), i = pt(s.nodeMap, t);
  return s.state.locateResultSet.size > 0 || (ji(s, Array.from(s.state.highlightedUuids).filter((o) => !i.has(o))), Ji(s, Array.from(i).filter((o) => !s.state.highlightedUuids.has(o)))), s.state.highlightedUuids = i, s.state.lastSelectedUuid = e.length > 0 ? e[e.length - 1] : null, es(s, i), { needsRender: !0 };
}
function Be(s) {
  return s.clearClashPairHighlight(), s.locateObjectMaterialCache.forEach((e, t) => {
    const i = s.contentGroup.getObjectByProperty("uuid", t);
    i && (i.isMesh || i.isBatchedMesh) && (i.material = e, i.visible = !0);
  }), s.locateObjectMaterialCache.clear(), s.locateMaterialCache.clear(), s.locateDimmedInstances.forEach(({ mesh: e, instanceId: t, originalColor: i, originalVisible: n }) => {
    e.isBatchedMesh && (e.setColorAt(t, new h.Color(i)), e.setVisibleAt && e.setVisibleAt(t, n), e.instanceColor && (e.instanceColor.needsUpdate = !0));
  }), s.locateDimmedInstances.clear(), s.state.locateResultSet.clear(), s.state.locateFocusUuid = null, s.state.highlightedUuids = /* @__PURE__ */ new Set(), s.state.lastSelectedUuid = null, s.selectionBox.visible = !1, s.highlightMesh.visible = !1, { needsRender: !0 };
}
function qe(s, e, t = null, i) {
  const n = Array.from(new Set(e.filter(Boolean)));
  if (n.length === 0)
    return Be(s);
  Be(s);
  const o = pt(s.nodeMap, n), r = Array.from(o), a = dt(s.settings), c = new h.Color("#e0e0e0");
  s.state.locateResultSet = o, s.state.locateFocusUuid = t && o.has(t) ? t : r[0];
  const u = s.state.locateFocusUuid, d = /* @__PURE__ */ new Map();
  return s.optimizedMapping.forEach((l, p) => {
    o.has(p) && l.forEach((f) => d.set(f.mesh.uuid, !0));
  }), s.contentGroup.traverse((l) => {
    const p = l;
    if (!p.isMesh || !p.material) return;
    s.locateObjectMaterialCache.has(l.uuid) || s.locateObjectMaterialCache.set(l.uuid, p.material);
    const f = !!p.isBatchedMesh, g = o.has(l.uuid), M = d.get(p.uuid), k = (Array.isArray(p.material) ? p.material : [p.material]).map((b) => {
      if (!b) return b;
      const y = b.clone();
      return g ? (y.transparent = !1, y.opacity = 1, y.color && y.color.copy(a), y.emissive && y.emissive.copy(a.clone().multiplyScalar(0.4))) : f && M ? (y.transparent = !0, y.opacity = 0.25, y.depthWrite = !1) : (y.transparent = !0, y.opacity = 0.05, y.depthWrite = !1, y.color && y.color.set("#f5f5f5"), y.emissive && y.emissive.set(0)), y;
    });
    p.material = Array.isArray(p.material) ? k : k[0];
  }), s.optimizedMapping.forEach((l, p) => {
    const f = o.has(p), g = f && u !== null && p === u;
    l.forEach((M) => {
      const m = M.mesh, k = `${m.uuid}:${M.instanceId}`;
      s.locateDimmedInstances.set(k, {
        mesh: m,
        instanceId: M.instanceId,
        originalColor: M.originalColor,
        originalVisible: !0
      }), f ? m.setColorAt(M.instanceId, g ? a : a.clone().lerp(new h.Color("#ffffff"), 0.2)) : m.setColorAt(M.instanceId, c), m.instanceColor && (m.instanceColor.needsUpdate = !0);
    });
  }), Se(s, s.state.locateFocusUuid ? [s.state.locateFocusUuid] : []);
}
function ft(s, e, t) {
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
function Xe(s, e) {
  const t = new h.BufferGeometry().setFromPoints(s), i = new h.LineBasicMaterial({ color: 16711680, depthTest: !1, linewidth: 2 }), n = new h.Line(t, i);
  n.renderOrder = 998, e.add(n);
}
function ts(s, e) {
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
function mt(s, e) {
  e.previewLine && (s.measureGroup.remove(e.previewLine), e.previewLine = null), e.previewPolygon && (s.measureGroup.remove(e.previewPolygon), e.previewPolygon = null), s.tempMarker.visible = !1;
}
function gt(s, e = !0) {
  const t = {
    ...s.state,
    currentMeasurePoints: e ? [] : [...s.state.currentMeasurePoints]
  };
  mt(s, t);
  for (let i = s.measureGroup.children.length - 1; i >= 0; i--) {
    const n = s.measureGroup.children[i];
    n.name.startsWith("measure_") || s.measureGroup.remove(n);
  }
  return {
    state: t,
    needsRender: !0
  };
}
function Ae(s, e) {
  const t = {
    ...s.state,
    currentMeasurePoints: [...s.state.currentMeasurePoints]
  };
  mt(s, t);
  const i = [...t.currentMeasurePoints];
  if (e && i.push(e), i.length < 2)
    return { state: t, needsRender: !0 };
  const n = new h.BufferGeometry().setFromPoints(i), o = new h.LineDashedMaterial({
    color: 16711680,
    dashSize: 5,
    gapSize: 2,
    depthTest: !1
  });
  return t.previewLine = new h.Line(n, o), t.previewLine.computeLineDistances(), t.previewLine.renderOrder = 998, s.measureGroup.add(t.previewLine), { state: t, needsRender: !0 };
}
function is(s, e, t) {
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
    state: Ae(s, o).state,
    needsRender: !0
  };
}
function Mt(s) {
  const e = {
    ...s.state,
    currentMeasurePoints: [...s.state.currentMeasurePoints]
  }, t = `measure_${Date.now()}`, i = new h.Group();
  i.name = t, e.currentMeasurePoints.forEach((d) => ft(d, i, s.dotTexture));
  let n = "", o = "";
  const r = e.measureType, a = new h.Vector3();
  if (e.measureType === "dist") {
    const [d, l] = e.currentMeasurePoints, p = d.distanceTo(l), f = Math.abs(l.x - d.x), g = Math.abs(l.y - d.y), M = Math.abs(l.z - d.z);
    o = p.toFixed(3), n = `${o} (Δx:${f.toFixed(2)}, Δy:${g.toFixed(2)}, Δz:${M.toFixed(2)})`, Xe(e.currentMeasurePoints, i), a.copy(d).add(l).multiplyScalar(0.5);
  } else if (e.measureType === "angle") {
    const [d, l, p] = e.currentMeasurePoints, f = d.clone().sub(l).normalize(), g = p.clone().sub(l).normalize();
    o = `${(f.angleTo(g) * (180 / Math.PI)).toFixed(2)}°`, n = o, Xe(e.currentMeasurePoints, i), a.copy(l);
  } else {
    const [d] = e.currentMeasurePoints;
    o = `(${d.x.toFixed(2)}, ${d.y.toFixed(2)}, ${d.z.toFixed(2)})`, n = o, a.copy(d);
  }
  i.add(ts(o, a)), s.measureGroup.add(i), s.measureRecords.set(t, {
    id: t,
    type: r,
    val: n,
    group: i,
    modelUuid: e.currentMeasureModelUuid || void 0
  });
  const u = {
    ...gt(
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
function ss(s, e, t) {
  if (s.state.measureType === "none")
    return { state: s.state, needsRender: !1, completed: null };
  const i = {
    ...s.state,
    currentMeasurePoints: [...s.state.currentMeasurePoints, e],
    currentMeasureModelUuid: t ?? s.state.currentMeasureModelUuid
  };
  return ft(e, s.measureGroup, s.dotTexture), i.measureType === "dist" && i.currentMeasurePoints.length === 2 || i.measureType === "angle" && i.currentMeasurePoints.length === 3 || i.measureType === "coord" ? Mt({ ...s, state: i }) : {
    state: Ae({ ...s, state: i }).state,
    needsRender: !0,
    completed: null
  };
}
function ns(s, e) {
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
function rs(s, e, t) {
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
function os(s) {
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
function as(s, e, t, i) {
  const o = s.nodeMap.get(i)?.[0], r = new h.Object3D();
  r.uuid = i, o && (r.name = o.name, r.type = o.type, r.isMesh = o.type === "Mesh"), r.getWorldPosition = (c) => {
    const u = new h.Matrix4();
    return e.getMatrixAt(t, u), u.premultiply(e.matrixWorld), c.setFromMatrixPosition(u);
  };
  const a = new h.Matrix4();
  return e.getMatrixAt(t, a), r.position.setFromMatrixPosition(a), r;
}
function yt(s) {
  return s.interactableListValid ? {
    interactableList: s.interactableList,
    interactableListValid: !0
  } : {
    interactableList: os(s),
    interactableListValid: !0
  };
}
function cs(s, e, t) {
  const i = s.canvas.getBoundingClientRect();
  s.mouse.x = (e - i.left) / i.width * 2 - 1, s.mouse.y = -((t - i.top) / i.height) * 2 + 1, s.raycaster.setFromCamera(s.mouse, s.camera);
  const n = yt(s), o = s.raycaster.intersectObjects(n.interactableList, !1);
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
  return r.object = d ?? as(s, a, c, u), { intersect: r, state: n };
}
function hs(s, e, t, i, n) {
  const o = Math.min(e, i), r = Math.max(e, i), a = Math.min(t, n), c = Math.max(t, n), u = s.camera.projectionMatrix.clone(), d = new h.Matrix4(), l = r - o, p = c - a, f = l / 2, g = p / 2, M = (r + o) / 2, m = (c + a) / 2, k = new h.Matrix4().makeTranslation(-M, -m, 0), b = new h.Matrix4().makeScale(1 / f, 1 / g, 1);
  d.multiplyMatrices(b, k);
  const y = d.multiply(u), C = new h.Frustum(), x = s.camera.matrixWorldInverse, w = y.clone().multiply(x);
  C.setFromProjectionMatrix(w);
  const I = [], D = new h.Box3(), R = new h.Matrix4();
  for (const O of s.interactableList) {
    if (O.isBatchedMesh) {
      const P = O, z = P.userData.batchIdToUuid, v = P.userData.batchIdToGeometry;
      if (!z || !v) continue;
      for (const [T, A] of z)
        try {
          const B = v.get(T);
          if (!B) continue;
          P.getMatrixAt(T, R), R.premultiply(P.matrixWorld);
          const L = new h.Box3();
          B.boundingBox || B.computeBoundingBox(), L.copy(B.boundingBox).applyMatrix4(R), C.intersectsBox(L) && I.push(A);
        } catch {
        }
      continue;
    }
    D.setFromObject(O), C.intersectsBox(D) && I.push(O.uuid);
  }
  return I;
}
function ls({
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
function kt(s, e) {
  for (const [t, i] of e.entries())
    if (t.endsWith(`::${s}`) && i.length > 0)
      return i[0];
  return null;
}
function us(s, e, t) {
  return e.has(s) ? s : kt(s, t) || s;
}
function Ct(s, e) {
  const t = e.get(s);
  return t && t.length > 0 ? t[0] : null;
}
function bt({
  id: s,
  nodeMap: e,
  nbimPropsByOriginalUuid: t
}) {
  const i = Ct(s, e);
  if (!i || !i.bimId) return null;
  const n = i.userData?.originalUuid ? String(i.userData.originalUuid) : "";
  if (!n) return null;
  const o = t.get(n);
  return o ? {
    entry: o[`${n}::${i.bimId}`],
    node: i
  } : null;
}
function ds(s) {
  const e = bt(s);
  if (!e?.entry || typeof e.entry != "object") return e?.entry || null;
  const { ifcRawGroups: t, ifcNormalizedGroups: i, ...n } = e.entry;
  return n;
}
function ps(s, e = "raw") {
  const t = bt(s);
  if (!t?.entry || typeof t.entry != "object") return null;
  const i = t.entry.ifcRawGroups, n = t.entry.ifcNormalizedGroups;
  return e === "normalized" ? n || i || null : i || n || null;
}
function fs(s) {
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
function ms(s) {
  const e = s.renderer.info.render.calls, t = fs(s.contentGroup);
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
function gs(s, e, t) {
  const i = (n) => {
    n.visible = t, n.children?.forEach(i);
  };
  e.children?.forEach(i), s.forEach((n) => {
    n.forEach((o) => {
      o.visible = t;
    });
  });
}
function Ms(s, e) {
  s.forEach((t) => {
    t.forEach((i) => {
      i.mesh.setVisibleAt(i.instanceId, e);
    });
  });
}
function xt(s, e) {
  if (!(s.name === "Helpers" || s.name === "Measure")) {
    if (s.isMesh && s.userData.isOptimized) {
      s.visible = !1;
      return;
    }
    s.visible = e;
  }
}
function Ie(s, e) {
  let t = s?.parent;
  for (; t && t !== e; )
    t.visible = !0, t = t.parent;
}
function ys(s, e, t, i) {
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
function wt(s, e, t) {
  e.visible = t, e.children?.forEach((n) => wt(s, n, t)), s.get(e.id)?.forEach((n) => {
    n.visible = t;
  });
}
function Ye(s, e, t) {
  const i = s.get(e);
  i && i.forEach((n) => {
    n.mesh.setVisibleAt(n.instanceId, t);
  });
}
function vt(s, e) {
  return gs(s.nodeMap, s.structureRoot, e), Ms(s.optimizedMapping, e), s.contentGroup.traverse((t) => {
    xt(t, e);
  }), {
    needsBoundsUpdate: !0,
    needsExplodeRefresh: !0,
    needsRender: !0
  };
}
function Pe(s, e, t, i = !0) {
  const n = s.nodeMap.get(e);
  n?.forEach((a) => wt(s.nodeMap, a, t));
  const o = s.contentGroup.getObjectByProperty("uuid", e);
  t && o && i && Ie(o, s.scene);
  const r = t ? [] : ys(s.highlightedUuids, e, o, n);
  if (!o) {
    if (n && n.length > 0) {
      const a = (c) => {
        Ye(s.optimizedMapping, c.id, t), c.children?.forEach(a);
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
    a.name === "Helpers" || a.name === "Measure" || (xt(a, t), Ye(s.optimizedMapping, a.uuid, t));
  }), {
    needsBoundsUpdate: !0,
    needsExplodeRefresh: !1,
    needsRender: !0,
    nextHighlightedUuids: r.length > 0 ? Array.from(new Set([...s.highlightedUuids].filter((a) => !r.includes(a)))) : void 0
  };
}
function ks(s, e, t = {}) {
  if (e.length === 0)
    return {
      needsBoundsUpdate: !1,
      needsExplodeRefresh: !1,
      needsRender: !1
    };
  let i = new Set(s.highlightedUuids), n = !1;
  return e.forEach((o) => {
    const r = Pe(
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
function Cs(s, e, t) {
  vt(s, !1);
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
    n.visible = !0, Ie(n, s.scene);
  }), e.forEach((n) => {
    const o = s.contentGroup.getObjectByProperty("uuid", n);
    o && Ie(o, s.scene);
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
function Ze(s) {
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
const bs = 220, xs = 180;
class Ss {
  constructor(e, t = {}) {
    this.structureRoot = { id: "root", name: "Root", type: "Group", children: [] }, this.nodeMap = /* @__PURE__ */ new Map(), this.bimIdToNodeIds = /* @__PURE__ */ new Map(), this.lastSelectedUuid = null, this.highlightedUuids = /* @__PURE__ */ new Set(), this.locateFocusUuid = null, this.locateResultSet = /* @__PURE__ */ new Set(), this.locateMaterialCache = /* @__PURE__ */ new Map(), this.locateObjectMaterialCache = /* @__PURE__ */ new Map(), this.locateDimmedInstances = /* @__PURE__ */ new Map(), this.clashPairObjectMaterialCache = /* @__PURE__ */ new Map(), this.clashPairInstanceColorCache = /* @__PURE__ */ new Map(), this.clashPairUuids = /* @__PURE__ */ new Set(), this.highlightPulseColor = new h.Color("#ffffff"), this.explodeEnabled = !1, this.explodeStrength = 0, this.explodeCenter = new h.Vector3(), this.explodeMode = "radial", this.explodeObjectStates = /* @__PURE__ */ new Map(), this.explodeInstanceStates = /* @__PURE__ */ new Map(), this.explodeScratchUniform = new h.Vector3(), this.explodeScratchMix = new h.Vector3(), this.measureType = "none", this.currentMeasurePoints = [], this.currentMeasureModelUuid = null, this.previewLine = null, this.previewPolygon = null, this.measureRecords = /* @__PURE__ */ new Map(), this.boxSelectState = Nt(), this.clippingPlanes = [], this.clipPlaneHelpers = [], this.clipHelperVisible = !1, this.clipHelperOpacity = 0.12, this.sceneCenter = new h.Vector3(), this.globalOffset = new h.Vector3(), this.componentMap = /* @__PURE__ */ new Map(), this.optimizedMapping = /* @__PURE__ */ new Map(), this.settings = {
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
    }, this.movingPeripheralCursor = 0, this.movingPeripheralLastRefreshAt = 0, this.postMoveRecoveryUntil = 0, this.deferredStructureTimer = null, this.deferredStructureToken = 0, this.loadGeneration = 0, this.fastPreviewMeshLimit = 1200, this.fastPreviewModels = /* @__PURE__ */ new Set(), this.chunkCullingTempSize = new h.Vector3(), this.chunkCullingTempDirection = new h.Vector3(), this.chunkCullingTempForward = new h.Vector3(), this.chunkCullingTempCenterNdc = new h.Vector3(), this.boundsScanBatchSize = 2400, this.chunkRegistrationBatchSize = 18, this.chunkGhostBatchSize = 24, this.animationFrameId = null, this.animateFramePending = !1, this.disposed = !1, this.interactionShadowDowngraded = !1, this.interactionShadowRestoreAt = 0, this.interactionShadowRestoreDelayMs = 220, this.cullingScanCursor = 0, this.cullingTimeBudgetMovingMs = 4.5, this.cullingTimeBudgetRecoveryMs = 6, this.cullingTimeBudgetIdleMs = 9, this.forceMaxChunkLoadSpeed = !0, this.ghostMeshPool = [], this.animate = () => {
      if (this.disposed) return;
      this.animateFramePending = !1, this.animationFrameId = null;
      const l = performance.now();
      this.controls && this.controls.update(), this.updateInteractionPerformance(l), this.updateAdaptiveQuality(), this._needsBoundsUpdate && (this.updateSceneBounds(), this._needsBoundsUpdate = !1), this.updateCameraClipping();
      const p = performance.now(), f = this.getChunkRuntimeProfile(), g = this.getChunkRenderPhase(p), M = this.cullingDirty ? g === "moving" ? f.movingCullingIntervalMs : g === "recovery" ? f.recoveryCullingIntervalMs : Math.min(f.recoveryCullingIntervalMs, 70) : f.idleCullingIntervalMs;
      (!this._lastCullingTime || p - this._lastCullingTime > M) && (this.checkCullingAndLoad(p), this._lastCullingTime = p, this.cullingDirty = !1);
      const m = this.highlightMesh.material;
      if (m)
        if (this.locateFocusUuid && this.highlightMesh.visible) {
          const x = new h.Color(this.settings.highlightColor || "#ff9f1c"), w = 0.22 + (Math.sin(l / 125) + 1) * 0.3;
          m.color.copy(x).lerp(this.highlightPulseColor, w), m.opacity = 1;
        } else
          m.color.set(this.settings.highlightColor || "#ff9f1c"), m.opacity = 1;
      const k = this.selectionBox.material;
      if (this.locateFocusUuid && this.selectionBox.visible && k && !Array.isArray(k)) {
        const x = new h.Color(this.settings.highlightColor || "#ff9f1c"), w = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(l / 125));
        k.color.copy(x).lerp(this.highlightPulseColor, 0.34 * w);
      } else k && !Array.isArray(k) && k.color.set(this.settings.highlightColor || "#ff9f1c");
      this.renderer.render(this.scene, this.camera);
      const b = this.chunkLoadingEnabled && this.chunks.length > 0 && this.chunkLoadedCount < this.chunks.length, y = !!(this.locateFocusUuid && (this.highlightMesh.visible || this.selectionBox.visible));
      (this.isCameraMoving || this.isInPostMoveRecovery(p) || this.processingChunks.size > 0 || this.chunkWarmupActive || b || y) && this.requestRender();
    }, this.canvas = e, this.options = t, this.resolvedChunkOptions = Ze(t.chunkOptions), t.performancePreset && (this.settings.performanceMode = t.performancePreset);
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
    ), this.camera.up.set(0, 0, 1), this.camera.position.set(1e3, -1e3, 1e3), this.camera.lookAt(0, 0, 0), this.controls = new Rt(this.camera, e), this.controls.enableDamping = !1, this.controls.screenSpacePanning = !0, this.controls.maxPolarAngle = Math.PI, this.controls.mouseButtons = {
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
      if (this.isCameraMoving = !1, this.prefetchPaused = !1, this.chunkLoadResumeAt = l + Math.max(24, Math.floor(p.resumeAfterMoveMs * 0.75)), this.postMoveRecoveryUntil = l + p.postMoveRecoveryMs, this.interactionShadowRestoreAt = l + this.interactionShadowRestoreDelayMs, this.movingPeripheralLastRefreshAt = 0, this.movingPeripheralCursor = 0, this.controls.target.length() > 5e4) {
        const g = this.controls.target.clone();
        this.scene.position.sub(g), this.camera.position.sub(g), this.controls.target.set(0, 0, 0), this.camera.updateProjectionMatrix(), this.dirLight && this.dirLight.position.sub(g), this.backLight && this.backLight.position.sub(g), this.precomputedBounds.translate(g.clone().negate()), this.sceneBounds.translate(g.clone().negate());
      }
      this.markSceneDirty({ needsCulling: !0 });
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
  invalidateRender(e = {}) {
    this.markSceneDirty(e);
  }
  updateSettings(e) {
    this.settings = { ...this.settings, ...e }, this.applyHighlightSettings(), e.clip && this.setClipHelperOptions({
      visible: e.clip.helperVisible,
      opacity: e.clip.helperOpacity
    }), this.ambientLight.intensity = this.settings.ambientInt, this.dirLight.intensity = this.settings.dirInt, this.backLight.intensity = this.settings.backLightInt ?? 0.5, this.renderer.outputColorSpace = this.settings.colorSpace === "linear" ? h.LinearSRGBColorSpace : h.SRGBColorSpace, this.renderer.toneMapping = this.settings.toneMapping === "none" ? h.NoToneMapping : this.settings.toneMapping === "neutral" ? h.NeutralToneMapping : h.ACESFilmicToneMapping, this.renderer.toneMappingExposure = this.settings.exposure ?? 1, this.renderer.setClearColor(this.settings.bgColor), e.frustumCulling !== void 0 && this.contentGroup.traverse((t) => {
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
    return i && (i.beginPath(), i.arc(64 / 2, 64 / 2, 64 / 2 - 2, 0, 2 * Math.PI), i.fillStyle = "#ffffff", i.fill()), new h.CanvasTexture(t);
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
    const e = navigator, t = Math.max(2, e.hardwareConcurrency || 4), i = e.deviceMemory || 8, n = this.options.performancePreset ?? this.settings.performanceMode ?? "balanced", o = Gt(t, n);
    this.forceMaxChunkLoadSpeed ? (this.maxWorkers = Math.max(4, Math.min(12, t - 1)), this.maxConcurrentChunkLoads = Math.max(128, Math.min(192, this.maxWorkers * 24)), this.maxChunkLoadsPerFrame = Math.max(64, Math.min(128, this.maxWorkers * 14)), this.cullingTimeBudgetMovingMs = 7.5, this.cullingTimeBudgetRecoveryMs = 10.5, this.cullingTimeBudgetIdleMs = 14, this.chunkRegistrationBatchSize = 28, this.chunkGhostBatchSize = 40) : (this.maxWorkers = 4, this.maxConcurrentChunkLoads = o.maxConcurrentChunkLoads, this.maxChunkLoadsPerFrame = o.maxChunkLoadsPerFrame), this.maxLoadedChunks = i <= 4 ? 160 : i <= 8 ? 320 : 640, this.maxCachedChunks = i <= 4 ? 24 : i <= 8 ? 48 : 96, this.settings.targetFps = this.resolvedChunkOptions.targetMinFps;
  }
  collectObjectOverview(e) {
    let t = 0, i = 0, n = 0;
    return e.traverse((o) => {
      const r = o;
      !r.isMesh || !r.geometry || (t++, r.geometry.index ? i += r.geometry.index.count / 3 : r.geometry.attributes.position && (i += r.geometry.attributes.position.count / 3), n += At(r.geometry));
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
      for (let M = 0; M < p; M++) {
        const m = d.getUint32(l, !0);
        l += 4;
        const k = d.getUint32(l, !0);
        l += 4, l += m * 12, l += m * 12, k > 0 && (l += k * 4), f.push(k > 0 ? k / 3 : m / 3);
      }
      const g = d.getUint32(l, !0);
      l += 4, n += g, r += c.byteLength / (1024 * 1024);
      for (let M = 0; M < g; M++) {
        l += 4, l += 4, l += 4, l += 64;
        const m = d.getUint32(l, !0);
        l += 4, o += f[m] || 0;
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
    oi({
      mesh: e,
      sharedMaterial: this.sharedMaterial
    });
  }
  touchChunkCache(e) {
    this.chunkCacheOrder = st(this.chunkCacheOrder, e);
  }
  cacheChunkMesh(e, t) {
    const i = ai({
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
    const t = ci({
      chunkId: e,
      chunkMeshCache: this.chunkMeshCache,
      chunkCacheOrder: this.chunkCacheOrder
    });
    return this.chunkCacheOrder = t.chunkCacheOrder, t.mesh;
  }
  clearChunkCache(e) {
    this.chunkCacheOrder = hi({
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
    const t = await Xt({
      chunk: e,
      nbimFiles: this.nbimFiles,
      chunkReadCache: this.chunkReadCache,
      chunkReadCacheOrder: this.chunkReadCacheOrder,
      chunkReadCacheSize: this.resolvedChunkOptions.chunkReadCacheSize
    });
    return this.chunkReadCacheOrder = t.chunkReadCacheOrder, t.buffer;
  }
  enqueueChunkPrefetch(e) {
    this.prefetchQueue = Yt({
      chunkIds: e,
      chunkPrefetchWindow: this.resolvedChunkOptions.chunkPrefetchWindow,
      prefetchQueue: this.prefetchQueue,
      prefetchQueueSet: this.prefetchQueueSet,
      prefetchInFlight: this.prefetchInFlight
    });
  }
  schedulePrefetchFromVisibleChunks(e) {
    const t = Zt({
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
    await ri({
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
    li({
      mesh: e,
      optimizedMapping: this.optimizedMapping
    });
  }
  registerOptimizedMeshMapping(e) {
    ui({
      mesh: e,
      optimizedMapping: this.optimizedMapping
    });
  }
  acquireGhostLine() {
    return di({
      ghostMeshPool: this.ghostMeshPool,
      ghostEdgesGeometry: this.ghostEdgesGeometry,
      ghostMaterial: this.ghostMaterial
    });
  }
  releaseGhostLine(e) {
    pi({
      line: e,
      ghostMeshPool: this.ghostMeshPool
    });
  }
  createGhostLine(e, t) {
    return fi({
      name: e,
      bounds: t,
      acquireGhostLine: () => this.acquireGhostLine()
    });
  }
  ensureChunkGhost(e) {
    mi({
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
          const g = Math.max(r.x, r.y, r.z);
          p = f.boundingSphere.radius * g;
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
          const g = this.nodeMap.get(f.uuid);
          g && g.forEach((M) => {
            M.bimId === void 0 && (M.bimId = M.id), M.chunkId = u;
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
      const d = Ke(e, t, { maxItemsPerNode: i, maxDepth: n });
      return je(d).map((l) => ({
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
    this.activePixelRatio = d, this.renderer.setPixelRatio(d), this.renderer.setSize(i, n, !1), this.controls && this.controls.update(), this.markSceneDirty({ needsCulling: !0 });
  }
  reportChunkProgress() {
    const e = bi({
      now: performance.now(),
      total: this.chunks.length,
      loaded: this.chunkLoadedCount,
      lastReportedProgress: this.lastReportedProgress,
      lastChunkProgressReportAt: this.lastChunkProgressReportAt
    });
    this.onChunkProgress && e.shouldNotify && (this.lastReportedProgress = e.nextProgress, this.lastChunkProgressReportAt = e.nextReportedAt, this.onChunkProgress(e.nextProgress.loaded, e.nextProgress.total));
  }
  getChunkRuntimeProfile(e = this.chunks.length) {
    return xi({
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
    return wi({
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
    return vi({
      centrality: e,
      pixelSize: t,
      forwardness: i,
      profile: n
    });
  }
  shouldRefreshPeripheralChunk(e, t, i, n) {
    const o = Si({
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
    const c = this.chunkCullingTempDirection, u = this.chunkCullingTempSize, d = this.chunkCullingTempCenterNdc, l = (this.camera.top - this.camera.bottom) / this.camera.zoom, p = this.renderer.domElement.clientHeight, f = [], g = [], M = this.renderer.clippingPlanes.length > 0;
    let m = !1;
    const k = this.chunks.length, b = performance.now(), y = i === "moving" ? this.cullingTimeBudgetMovingMs : i === "recovery" ? this.cullingTimeBudgetRecoveryMs : this.cullingTimeBudgetIdleMs;
    let C = !1;
    const x = n !== "quality" && i === "moving" && k > 1800, w = x ? k > 5e3 ? 8 : k > 3e3 ? 6 : 4 : 1, I = x ? Math.floor(e / Math.max(1, t.movingPeripheralRefreshMs)) % w : 0, D = k > 0 ? this.cullingScanCursor % k : 0;
    for (let P = 0; P < k; P++) {
      const z = (D + P) % k, v = this.chunks[z];
      if ((P & 31) === 0 && performance.now() - b > y) {
        C = !0, this.cullingScanCursor = (z + 1) % k;
        break;
      }
      ki({
        chunk: v,
        padding: o,
        tempSize: u
      });
      const T = this.frustum.intersectsBox(v.paddedBounds), A = M && this.isBoxClipped(v.bounds), B = Ci({
        chunk: v,
        chunkIndex: z,
        totalChunks: k,
        now: e,
        phase: i,
        profile: t,
        performanceMode: n,
        isBoxClipped: A,
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
        movingSampleStride: w,
        movingSampleSeed: I,
        resolveShouldRefreshPeripheral: (L) => !L || this.shouldRefreshPeripheralChunk(e, z, k, t),
        chunkWarmupActive: this.chunkWarmupActive,
        chunkLoadedCount: this.chunkLoadedCount,
        initialChunkLoadTarget: this.initialChunkLoadTarget,
        chunkLoadResumeAt: this.chunkLoadResumeAt,
        chunkMeshCached: this.chunkMeshCache.has(v.id)
      });
      if (!B.shouldSkipSample)
        if (B.effectiveVisible && (v.lastVisibleAt = e), (B.centrality > 0.42 || B.forwardness > 0.55) && (v.lastFocusAt = e), v.lastEffectiveVisible = B.effectiveVisible, v.loaded)
          if (g.push(v), v.mesh)
            v.mesh.visible !== B.effectiveVisible && (v.mesh.visible = B.effectiveVisible, m = !0);
          else {
            const G = this.contentGroup.getObjectByName(v.groupName)?.getObjectByName(v.id);
            G && (v.mesh = G, G.visible = B.effectiveVisible, m = !0);
          }
        else !this.processingChunks.has(v.id) && B.shouldBeVisible && B.priority !== null && (v.priority = B.priority, f.push(v));
    }
    C || (this.cullingScanCursor = (D + k) % Math.max(k, 1));
    const R = ii({
      isCameraMoving: this.isCameraMoving,
      loadedChunks: g,
      maxLoadedChunks: this.maxLoadedChunks,
      cameraPos: r,
      now: e,
      chunkResidencyMs: this.chunkResidencyMs
    });
    for (const P of R)
      this.unloadChunk(P);
    R.length > 0 && (m = !0);
    const O = si({
      toLoad: f,
      now: performance.now(),
      chunkLoadResumeAt: this.chunkLoadResumeAt,
      maxConcurrentChunkLoads: this.maxConcurrentChunkLoads,
      processingChunkCount: this.processingChunks.size,
      chunkWarmupActive: this.chunkWarmupActive,
      chunkLoadedCount: this.chunkLoadedCount,
      initialChunkLoadTarget: this.initialChunkLoadTarget,
      warmupChunkBoost: this.warmupChunkBoost,
      getChunkFrameBudget: (P, z, v) => this.getChunkFrameBudget(P, z, v),
      phase: i,
      profile: t
    });
    for (const P of O)
      this.loadChunk(P);
    O.length > 0 && (m = !0), this.schedulePrefetchFromVisibleChunks(g), this.forceMaxChunkLoadSpeed, C && (this.cullingDirty = !0), this.chunkWarmupActive && this.chunkLoadedCount >= this.initialChunkLoadTarget && (this.chunkWarmupActive = !1, m = !0), (m || C) && this.markSceneDirty();
  }
  async runWorkerTask(e, t) {
    return gi({
      workerQueue: this.workerQueue,
      data: e,
      transferables: t,
      processQueue: () => this.processWorkerQueue()
    });
  }
  processWorkerQueue() {
    Mi({
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
    const t = Kt({
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
      const { mesh: a, prefetchCandidates: c } = await jt({
        chunk: e,
        sharedMaterial: this.sharedMaterial,
        takeCachedChunkMesh: (l) => this.takeCachedChunkMesh(l),
        yieldToMainThread: () => this.yieldToMainThread(),
        nbimFiles: this.nbimFiles,
        hasValidChunkBinaryRange: (l) => this.hasValidChunkBinaryRange(l),
        readChunkBuffer: (l) => this.readChunkBuffer(l),
        nbimMeta: this.nbimMeta,
        runWorkerTask: (l, p) => this.runWorkerTask(l, p),
        reconstructBatchedMesh: (l, p) => ni({
          data: l,
          material: p,
          resolveUuidByBimId: (f, g) => {
            const M = `${f}::${g}`;
            return this.bimIdToNodeIds.get(M)?.[0] || g || f;
          }
        }),
        isCameraMoving: this.isCameraMoving,
        chunkPrefetchWindow: this.resolvedChunkOptions.chunkPrefetchWindow,
        getChunkIndex: (l) => this.getChunkIndex(l),
        chunks: this.chunks,
        processingChunks: this.processingChunks
      });
      c.length > 0 && (this.enqueueChunkPrefetch(c), this.processPrefetchQueue()), a && (t = Jt({
        chunk: e,
        mesh: a,
        cancelledChunkIds: this.cancelledChunkIds,
        chunkIdSet: this.chunkIdSet,
        disposeChunkMesh: (p) => this.disposeChunkMesh(p),
        globalOffset: this.globalOffset,
        contentGroup: this.contentGroup,
        registerOptimizedMeshMapping: (p) => this.registerOptimizedMeshMapping(p)
      }).attached, t && (o = !0, n = !0, i = !0));
      const u = ei({
        chunk: e,
        loadedNow: t,
        now: performance.now(),
        chunkLoadedCount: this.chunkLoadedCount,
        chunkWarmupActive: this.chunkWarmupActive,
        initialChunkLoadTarget: this.initialChunkLoadTarget,
        deactivateFastPreviewForModel: (l) => this.deactivateFastPreviewForModel(l)
      });
      this.chunkLoadedCount = u.nextChunkLoadedCount, this.chunkWarmupActive = u.nextChunkWarmupActive, u.progressChanged && (this.reportChunkProgress(), r = !0, i = !0), this.cancelledChunkIds.delete(e.id), ti({
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
    const t = Ze(e);
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
        de(e.name),
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
    const n = this.resolvedChunkOptions.loadProfile === "max-speed", o = n ? 1200 : this.octreeWorkerThreshold, r = t >= o ? await Tt(e, {
      batchSize: n ? 5200 : 3e3,
      onProgress: (g, M) => {
        if (!i || M === 0) return;
        const m = g / M;
        i(10 + Math.round(m * 10), `正在收集构件... (${g}/${M})`);
      }
    }) : zt(e);
    if (r.length === 0) return;
    i && i(20, `已收集 ${r.length} 个构件，正在计算八叉树...`);
    const a = await this.computeItemBoundsProgressively(r, i);
    i && i(35, "正在计算八叉树...");
    const d = await this.buildLeafPlans(r, a, 3e3, 6), l = await this.registerLeafChunksProgressively(e, d, i);
    this.reportChunkProgress(), this.checkCullingAndLoad(), this.createChunkGhostsProgressively(l);
    const p = /* @__PURE__ */ new Set();
    for (const g of r) {
      const M = g.sourceMesh;
      M?.isMesh && p.add(M);
    }
    const f = p.size > 0 ? Array.from(p) : (() => {
      const g = [];
      return e.traverse((M) => {
        M.isMesh && g.push(M);
      }), g;
    })();
    for (let g = 0; g < f.length; g++) {
      const M = f[g];
      e.userData.fastPreviewActive && M.userData.fastPreview || (M.visible = !1, M.userData.isOptimized = !0, g > 0 && g % 6e3 === 0 && await this.yieldToMainThread());
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
          this.replaceStructureNode(i, o), this.onStructureUpdate && this.onStructureUpdate(), this.markSceneDirty({
            invalidateInteractables: !0,
            needsBoundsUpdate: !0,
            needsCulling: !0
          });
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
    await this.prepareModelRuntimeStage(e, o), this.attachModelToContentGroup(e, u), this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    }), await this.prepareModelChunkStage(e, o, t), this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    }), this.finalizeModelStage(c, t), this.scheduleDeferredStructureReplacement(e, r, a), this.markSceneDirty({
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
      const d = u.getAttribute("position"), l = u.getAttribute("normal"), p = d.count, f = u.index, g = f ? f.count : 0;
      a.setUint32(c, p, !0), c += 4, a.setUint32(c, g, !0), c += 4;
      for (let M = 0; M < p; M++)
        a.setFloat32(c, d.getX(M), !0), c += 4, a.setFloat32(c, d.getY(M), !0), c += 4, a.setFloat32(c, d.getZ(M), !0), c += 4;
      for (let M = 0; M < p; M++)
        a.setFloat32(c, l.getX(M), !0), c += 4, a.setFloat32(c, l.getY(M), !0), c += 4, a.setFloat32(c, l.getZ(M), !0), c += 4;
      if (f && g > 0)
        for (let M = 0; M < g; M++)
          a.setUint32(c, f.getX(M), !0), c += 4;
    }
    a.setUint32(c, e.length, !0), c += 4;
    for (const u of e) {
      const l = this.nodeMap.get(u.uuid)?.[0], p = u.bimId || l?.bimId || l?.id || u.uuid, f = t.get(p) ?? 0;
      a.setUint32(c, f, !0), c += 4;
      const g = typeof u.typeIndex == "number" ? u.typeIndex : 0;
      a.setUint32(c, g, !0), c += 4, a.setUint32(c, u.color, !0), c += 4;
      const M = u.matrix.elements;
      for (let k = 0; k < 16; k++)
        a.setFloat32(c, M[k], !0), c += 4;
      const m = n.get(u.geometry) || 0;
      a.setUint32(c, m, !0), c += 4;
    }
    return r;
  }
  async exportNbim(e) {
    if (this.chunks.length === 0) throw new Error("无模型数据可导出");
    const t = [""], i = /* @__PURE__ */ new Map(), n = (w) => {
      if (!w || i.has(w)) return;
      const I = t.length;
      t.push(w), i.set(w, I);
    }, o = (w) => {
      n(w.bimId), w.children && w.children.forEach(o);
    };
    o(this.structureRoot);
    const { ifcApiByModel: r, ifcManagerByModel: a } = Vi(this.contentGroup), c = await Ei({
      structureRoot: this.structureRoot,
      ifcApiByModel: r,
      ifcManagerByModel: a
    }), { chunkBlobs: u, exportChunks: d, currentOffset: l } = await Hi({
      chunks: this.chunks,
      nbimFiles: this.nbimFiles,
      nbimMeta: this.nbimMeta,
      bimIdToIndex: i,
      hasValidChunkBinaryRange: (w) => this.hasValidChunkBinaryRange(w),
      generateChunkBinaryV8: (w, I) => this.generateChunkBinaryV8(w, I)
    }), p = {
      globalBounds: {
        min: { x: this.sceneBounds.min.x, y: this.sceneBounds.min.y, z: this.sceneBounds.min.z },
        max: { x: this.sceneBounds.max.x, y: this.sceneBounds.max.y, z: this.sceneBounds.max.z }
      },
      chunks: d,
      stats: this.originalStats,
      structureTree: zi(this.structureRoot),
      bimIdTable: t,
      bimProperties: c
    }, f = Ti(p, this.structureRoot), g = new ArrayBuffer(1024), M = new DataView(g);
    M.setUint32(0, 1296646734, !0), M.setUint32(4, 8, !0), M.setUint32(8, l, !0), M.setUint32(12, f.byteLength, !0);
    const m = [g, ...u, f], k = new Blob(m, { type: "application/octet-stream" }), b = URL.createObjectURL(k), y = document.createElement("a");
    y.href = b;
    const C = Ui(this.contentGroup), x = se(de((e || "").trim()) || C);
    y.download = `${x}.nbim`, y.click(), URL.revokeObjectURL(b);
  }
  async loadNbim(e, t) {
    const i = `nbim_${e.name}_${(/* @__PURE__ */ new Date()).getTime()}`;
    this.nbimFiles.set(i, e), t && t(10, "正在解析 NBIM 文件头...");
    const n = await Et(e);
    if (n.magic !== 1296646734) throw new Error("不是有效的 NBIM 文件");
    const r = n.version;
    if (r !== 8)
      throw new Error(`不支持的 NBIM 版本: ${r}，当前仅支持 V8`);
    t && t(20, "正在读取元数据...");
    const a = await Wt(e, n);
    this.nbimMeta.set(i, { version: r, bimIdTable: a.bimIdTable });
    const c = Ni({
      globalBounds: a.globalBounds,
      precomputedBounds: this.precomputedBounds,
      sceneBounds: this.sceneBounds,
      globalOffset: this.globalOffset
    });
    this.precomputedBounds.copy(c.precomputedBounds), this.sceneBounds.copy(c.sceneBounds), this.globalOffset.copy(c.globalOffset), c.initializedOffset && xe("SceneManager/NBIM", "初始化全局偏移", this.globalOffset);
    const u = a.structureTree;
    $i({
      structureRoot: this.structureRoot,
      modelRoot: u
    });
    const d = u?.id || i, l = a?.bimProperties && typeof a.bimProperties == "object" ? a.bimProperties : {}, { defaultOwner: p, grouped: f } = Gi(l, d);
    f.forEach((C, x) => this.nbimPropsByOriginalUuid.set(x, C));
    const g = _i({
      manifestStats: a.stats,
      modelRoot: u,
      chunks: a.chunks
    });
    this.registerOriginalStats(d, g);
    const M = Fi({
      fileName: e.name,
      modelRootName: typeof u?.name == "string" ? u.name : "",
      rootId: d
    });
    this.contentGroup.add(M), this.interactableListValid = !1, this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    }), Qi({
      modelRoot: u,
      defaultOwner: p,
      nodeMap: this.nodeMap,
      bimIdToNodeIds: this.bimIdToNodeIds
    }), t && t(30, "正在初始化分块...");
    const m = Array.isArray(a.chunks) ? a.chunks : [];
    this.applyNbimScaleTuning(m.length);
    const k = this.resolvedChunkOptions.ghostMode === "all" ? Number.MAX_SAFE_INTEGER : xs, { deferredGhostSpecs: b } = await qi({
      chunkEntries: m,
      globalOffset: this.globalOffset,
      chunkPadding: this.chunkPadding,
      rootId: d,
      fileId: i,
      immediateGhostLimit: k,
      registrationBatchSize: bs,
      onProgress: t,
      registerChunk: (C) => this.registerChunk(C),
      createGhostLine: (C, x) => this.createGhostLine(C, x),
      addGhostLine: (C) => this.ghostGroup.add(C),
      yieldToMainThread: () => this.yieldToMainThread()
    });
    b.length > 0 && this.createChunkGhostsProgressively(b), this.reportChunkProgress(), this.fitView(!0), this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    });
    const y = Xi({
      chunkCount: this.chunks.length,
      hasManifestStats: !!a.stats,
      hasManifestChunks: !!a.chunks?.length
    });
    this.chunkWarmupActive = y.chunkWarmupActive, this.initialChunkLoadTarget = y.initialChunkLoadTarget, t && t(100, "NBIM 已就绪，正在按需加载..."), this.checkCullingAndLoad(), this.markSceneDirty({
      invalidateInteractables: !0,
      needsBoundsUpdate: !0,
      needsCulling: !0
    }), y.shouldEstimateStats && this.estimateNbimStats(e, a.chunks, r).then((C) => {
      this.unregisterOriginalStats(d), this.registerOriginalStats(d, C);
    }).catch((C) => {
      console.warn("NBIM 统计估算失败:", C);
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
    return ls({
      uuid: e,
      nodeMap: this.nodeMap,
      bimIdToNodeIds: this.bimIdToNodeIds
    });
  }
  resolveNodeUuidByBimId(e) {
    return kt(e, this.bimIdToNodeIds);
  }
  resolveSelectionUuid(e) {
    return us(e, this.nodeMap, this.bimIdToNodeIds);
  }
  resolveNbimNode(e) {
    return Ct(e, this.nodeMap);
  }
  getNbimProperties(e) {
    return ds({
      id: e,
      nodeMap: this.nodeMap,
      nbimPropsByOriginalUuid: this.nbimPropsByOriginalUuid
    });
  }
  getNbimIfcPropertyGroups(e, t = "raw") {
    return ps({
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
    vt(this.getVisibilityContext(), e), this.updateSceneBounds(), this.refreshExplodeState(), this.markSceneDirty();
  }
  hideObjects(e) {
    this.setObjectsVisibility(e, !1);
  }
  applyVisibilityBatch(e, t = {}) {
    const i = ks(this.getVisibilityContext(), e, t);
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
    Cs(
      this.getVisibilityContext(),
      e,
      (t, i, n) => {
        const o = Pe(this.getVisibilityContext(), t, i, n);
        if (o.nextHighlightedUuids) {
          const r = this.getHighlightContext(), a = Se(r, o.nextHighlightedUuids);
          this.syncHighlightState(r.state), a.needsRender && this.markSceneDirty();
        }
      }
    ), this.markSceneDirty({
      invalidateInteractables: !0,
      needsRender: !1
    }), this.updateSceneBounds(), this.refreshExplodeState(), this.markSceneDirty();
  }
  setObjectVisibility(e, t, i = !0) {
    const n = Pe(this.getVisibilityContext(), e, t, i);
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
    Vt(e, t);
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
        const M = this.getExplodeWorldDirection(d);
        this.explodeStableUnitDirection(c.uuid, this.explodeScratchUniform);
        const m = Math.pow(1 - Math.min(l / 1.08, 1), 1.15);
        f = this.explodeScratchMix.copy(M).multiplyScalar(1 - m).addScaledVector(this.explodeScratchUniform, m).normalize();
      } else
        f = this.getExplodeWorldDirection(d);
      const g = this.toLocalDirection(f, c.parent?.matrixWorld || new h.Matrix4());
      this.explodeObjectStates.set(c.uuid, {
        object: c,
        basePosition: c.position.clone(),
        directionLocal: g,
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
        const g = n.sub(this.explodeCenter), M = g.length() / t, m = 0.14 + 0.86 * Math.pow(h.MathUtils.clamp(M, 0, 2.5) / 2.5, 0.38);
        let k;
        if (this.explodeMode === "radial") {
          const b = this.getExplodeWorldDirection(g);
          this.explodeStableUnitDirection(p, this.explodeScratchUniform);
          const y = Math.pow(1 - Math.min(M / 1.08, 1), 1.15);
          k = this.explodeScratchMix.copy(b).multiplyScalar(1 - y).addScaledVector(this.explodeScratchUniform, y).normalize();
        } else
          k = this.getExplodeWorldDirection(g);
        this.explodeInstanceStates.set(p, {
          mesh: l.mesh,
          instanceId: l.instanceId,
          baseMatrix: r.clone(),
          directionLocal: this.toLocalDirection(k, l.mesh.matrixWorld),
          weight: m
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
    this.explodeStrength = h.MathUtils.clamp(e, 0, 100), this.explodeEnabled && (this.explodeObjectStates.size === 0 && this.explodeInstanceStates.size === 0 && this.captureExplodeSnapshot(), this.applyExplodeState());
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
      if (!f.isMesh || f.isBatchedMesh || f.userData?.isOptimized || !f.material) return;
      const g = a.has(p.uuid) ? "A" : c.has(p.uuid) ? "B" : null;
      if (!g) return;
      this.clashPairObjectMaterialCache.has(p.uuid) || this.clashPairObjectMaterialCache.set(p.uuid, f.material);
      const M = Array.isArray(f.material) ? f.material : [f.material], m = g === "A" ? u : d, k = M.map((b) => {
        if (!b) return b;
        const y = b.clone();
        return "transparent" in y && (y.transparent = !1), "opacity" in y && (y.opacity = 1), "depthWrite" in y && (y.depthWrite = !0), "color" in y && y.color && y.color.copy(y.color.clone().lerp(m, 0.86)), "emissive" in y && y.emissive && y.emissive.copy(m.clone().multiplyScalar(0.36)), y.needsUpdate = !0, y;
      });
      f.material = Array.isArray(f.material) ? k : k[0];
    });
    const l = /* @__PURE__ */ new Map();
    this.optimizedMapping.forEach((p) => {
      p.forEach((f) => {
        l.set(`${f.mesh.uuid}:${f.instanceId}`, f.originalColor);
      });
    }), this.contentGroup.traverse((p) => {
      const f = p;
      if (!p.isBatchedMesh) return;
      const g = f.userData?.batchIdToUuid;
      if (!g || g.size === 0) return;
      let M = !1;
      g.forEach((m, k) => {
        const b = a.has(m) ? "A" : c.has(m) ? "B" : null;
        if (!b) return;
        const y = `${f.uuid}:${k}`;
        if (!this.clashPairInstanceColorCache.has(y)) {
          const w = l.get(y);
          if (typeof w == "number")
            this.clashPairInstanceColorCache.set(y, {
              mesh: f,
              instanceId: k,
              originalColor: w
            });
          else {
            const I = new h.Color();
            f.getColorAt(k, I), this.clashPairInstanceColorCache.set(y, {
              mesh: f,
              instanceId: k,
              originalColor: I.getHex()
            });
          }
        }
        const C = this.clashPairInstanceColorCache.get(y)?.originalColor;
        if (typeof C != "number") return;
        const x = b === "A" ? u : d;
        f.setColorAt(k, new h.Color(C).lerp(x, 0.88)), M = !0;
      }), M && f.instanceColor && (f.instanceColor.needsUpdate = !0);
    }), this.clashPairUuids = /* @__PURE__ */ new Set([o, r]), this.markSceneDirty();
  }
  clearLocateFocus() {
    const e = this.getHighlightContext(), t = Be(e);
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
    const i = this.getHighlightContext(), n = qe(i, e, t);
    this.syncHighlightState(i.state), n.needsRender && this.markSceneDirty();
  }
  setLocateFocusContext(e, t = null, i) {
    const n = this.getHighlightContext(), o = qe(n, e, t);
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
    const t = this.getHighlightContext(), i = Se(t, e);
    this.syncHighlightState(t.state), i.needsRender && this.markSceneDirty();
  }
  /**
   * 通用多构件聚焦高亮入口：
   * - 高亮 uuids 中的所有物体（橙色），其余设为半透明灰色
   * - 可选 fitView 将镜头飞到这批物体
   * - 可选 highlightColors 支持按 UUID 指定不同颜色（碰撞场景 A/B 色对）
   * - 传空数组等同于 clearLocateFocus()
   */
  focusHighlightObjects(e, t = {}) {
    const { fitView: i = !0, focusUuid: n = null, highlightColors: o } = t, r = Array.from(new Set(e.filter(Boolean)));
    if (r.length === 0) {
      this.clearLocateFocus();
      return;
    }
    this.setLocateFocusContext(r, n ?? r[0], o), i && this.fitViewToObjects(r);
  }
  collectRenderableTargets(e) {
    const t = this.getHighlightContext();
    return e && e.length > 0 ? ut(t, e) : Ki(t);
  }
  pick(e, t) {
    const i = this.getRayIntersects(e, t);
    return i ? { object: i.object, intersect: i } : null;
  }
  getRayIntersects(e, t) {
    const i = cs(this.getPickingContext(), e, t);
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
    let t = le(this.getHighlightContext(), [e]);
    t.isEmpty() && (t = new h.Box3(), this.unionNodeBounds(e, t)), t.isEmpty() || this.fitBox(t, !1, 1.14);
  }
  getBoundsForObject(e) {
    if (!e) return null;
    let t = le(this.getHighlightContext(), [e]);
    return t.isEmpty() && (t = new h.Box3(), this.unionNodeBounds(e, t)), t.isEmpty() ? null : t;
  }
  collectBoundsForUuids(e) {
    const t = le(this.getHighlightContext(), e);
    if (!t.isEmpty()) return t;
    const i = new h.Box3();
    return Array.from(new Set((e || []).filter(Boolean))).forEach((o) => this.unionNodeBounds(o, i)), i;
  }
  fitViewToObjects(e) {
    const t = this.collectBoundsForUuids(e);
    t.isEmpty() || this.fitBox(t, !1, 1.14);
  }
  fitBox(e, t = !0, i) {
    if (e.isEmpty()) {
      this.camera.zoom = 1, this.camera.position.set(1e3, 1e3, 1e3), this.camera.lookAt(0, 0, 0), this.controls.target.set(0, 0, 0), this.camera.updateProjectionMatrix(), this.controls.update(), this.markSceneDirty({ needsCulling: !0 });
      return;
    }
    const n = e.getCenter(new h.Vector3()), o = e.getSize(new h.Vector3()), r = Math.max(o.x, o.y, o.z), a = r > 0 ? r : 100, c = i ?? 1.02, u = this.canvas.clientWidth, d = this.canvas.clientHeight, l = u / d;
    let p, f;
    l >= 1 ? (p = a * c, f = p * l) : (f = a * c, p = f / l);
    const g = Math.max(a * 5, 200);
    this.camera.near = -g, this.camera.far = g;
    let M = 1, m = -f / 2, k = f / 2, b = p / 2, y = -p / 2;
    if (t) {
      const C = new h.Vector3(1, -1, 1).normalize(), x = Math.max(a * 2.2, 5), w = n.clone().add(C.multiplyScalar(x)), I = n.clone(), D = this.camera.position.clone(), R = this.controls.target.clone(), O = performance.now(), P = 600, z = () => {
        const v = performance.now() - O, T = Math.min(v / P, 1), A = 1 - Math.pow(1 - T, 3);
        this.camera.position.lerpVectors(D, w, A), this.controls.target.lerpVectors(R, I, A), this.camera.lookAt(this.controls.target), this.camera.zoom = 1 + (M - 1) * A, this.camera.left = this.camera.left + (m - this.camera.left) * A, this.camera.right = this.camera.right + (k - this.camera.right) * A, this.camera.top = this.camera.top + (b - this.camera.top) * A, this.camera.bottom = this.camera.bottom + (y - this.camera.bottom) * A, this.camera.updateProjectionMatrix(), this.controls.update(), this.markSceneDirty({ needsCulling: !0 }), T < 1 ? requestAnimationFrame(z) : this.markSceneDirty({ needsCulling: !0 });
      };
      z();
    } else {
      const C = new h.Vector3();
      this.camera.getWorldDirection(C);
      const x = this.camera.position.distanceTo(this.controls.target), w = n.clone().add(C.multiplyScalar(-x)), I = n.clone(), D = 1.01, R = new h.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion), O = new h.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion), P = Math.max(1e-6, (this.camera.right - this.camera.left) * 0.5), z = Math.max(1e-6, (this.camera.top - this.camera.bottom) * 0.5), v = [
        new h.Vector3(e.min.x, e.min.y, e.min.z),
        new h.Vector3(e.min.x, e.min.y, e.max.z),
        new h.Vector3(e.min.x, e.max.y, e.min.z),
        new h.Vector3(e.min.x, e.max.y, e.max.z),
        new h.Vector3(e.max.x, e.min.y, e.min.z),
        new h.Vector3(e.max.x, e.min.y, e.max.z),
        new h.Vector3(e.max.x, e.max.y, e.min.z),
        new h.Vector3(e.max.x, e.max.y, e.max.z)
      ];
      let T = 0, A = 0;
      for (let _ = 0; _ < v.length; _++) {
        const N = v[_].clone().sub(n);
        T = Math.max(T, Math.abs(N.dot(R))), A = Math.max(A, Math.abs(N.dot(O)));
      }
      const B = Math.max(1e-3, T * D), L = Math.max(1e-3, A * D), G = Math.max(
        1e-4,
        Math.min(1e6, Math.min(P / B, z / L))
      ), H = this.camera.position.clone(), V = this.controls.target.clone(), E = this.camera.zoom, W = performance.now(), X = 600, Y = () => {
        const _ = performance.now() - W, N = Math.min(_ / X, 1), Z = 1 - Math.pow(1 - N, 3);
        this.camera.position.lerpVectors(H, w, Z), this.controls.target.lerpVectors(V, I, Z), this.camera.lookAt(this.controls.target), this.camera.zoom = E + (G - E) * Z, this.camera.updateProjectionMatrix(), this.controls.update(), this.markSceneDirty({ needsCulling: !0 }), N < 1 ? requestAnimationFrame(Y) : this.markSceneDirty({ needsCulling: !0 });
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
    const i = this.getMeasurementContext(), n = ss(i, e, t);
    return this.syncMeasurementState(n.state), n.needsRender && this.markSceneDirty(), n.completed ?? null;
  }
  updateMeasurePreview(e) {
    const t = this.getMeasurementContext(), i = Ae(t, e);
    this.syncMeasurementState(i.state), i.needsRender && this.markSceneDirty();
  }
  updateMeasureHover(e, t) {
    const i = this.getMeasurementContext(), n = is(i, e, t);
    this.syncMeasurementState(n.state), n.needsRender && this.markSceneDirty();
  }
  finalizeMeasurement() {
    const e = this.getMeasurementContext(), t = Mt(e);
    return this.syncMeasurementState(t.state), t.needsRender && this.markSceneDirty(), t.completed ?? null;
  }
  highlightMeasurement(e) {
    const t = ns(this.getMeasurementContext(), e);
    this.syncMeasurementState(t.state), this.markSceneDirty();
  }
  pickMeasurement(e, t) {
    return rs(this.getMeasurementContext(), e, t);
  }
  /**
   * 获取对象的面积和体积
   */
  getObjectGeometryData(e) {
    return Di({
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
    const i = $t(this.boxSelectState, e, t);
    this.syncBoxSelectState(i.state), this.markSceneDirty();
  }
  /**
   * 更新框选范围
   */
  updateBoxSelect(e, t) {
    const i = _t(this.boxSelectState, e, t);
    this.syncBoxSelectState(i.state), i.needsRender && this.markSceneDirty();
  }
  /**
   * 完成框选，返回选中的对象 UUID 列表
   */
  endBoxSelect() {
    const e = Qt(
      this.boxSelectState,
      this.canvas,
      (t, i, n, o) => this.selectByScreenRect(t, i, n, o)
    );
    return this.syncBoxSelectState(e.state), e.needsRender && this.markSceneDirty(), e.selected;
  }
  /**
   * 取消框选
   */
  cancelBoxSelect() {
    const e = tt(this.boxSelectState);
    this.syncBoxSelectState(e.state), this.markSceneDirty();
  }
  /**
   * 通过屏幕矩形选择对象
   */
  selectByScreenRect(e, t, i, n) {
    const o = yt(this.getPickingContext());
    return this.syncPickingState(o), hs(
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
    const e = this.getMeasurementContext(), t = gt(e);
    this.syncMeasurementState(t.state), this.markSceneDirty();
  }
  // --- 剖切逻辑 ---
  setupClipping() {
    const e = Ii(this.getClippingContext());
    this.syncClippingState(e.state), this.markSceneDirty();
  }
  setClipHelperOptions(e) {
    const t = Pi(this.getClippingContext(), e);
    this.syncClippingState(t.state), this.markSceneDirty();
  }
  setClippingEnabled(e) {
    this.renderer.clippingPlanes = e ? this.clippingPlanes : [], e || this.clipPlaneHelpers.forEach((t) => t.visible = !1), this.markSceneDirty();
  }
  updateClippingPlanes(e, t, i) {
    const n = Ri(this.getClippingContext(), e, t, i);
    this.syncClippingState(n.state), n.needsRender && this.markSceneDirty();
  }
  /**
   * 检查包围盒是否完全被当前剖切面裁剪掉
   * 如果包围盒完全在任意一个激活的剖切面的“背面”，则认为被裁剪
   */
  isBoxClipped(e) {
    return Li(this.clippingPlanes, e);
  }
  getStats() {
    return ms({
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
    this.disposed = !0, this.animateFramePending = !1, this.cancelBoxSelect(), Ai({
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
async function Bs(s) {
  const e = new Lt();
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
async function Is(s, e) {
  e("准备LMB导出...");
  const t = [], i = [], n = /* @__PURE__ */ new Map();
  s.updateMatrixWorld(!0);
  const o = new h.Vector3(0, 0, 0);
  s.userData.originalCenter && o.copy(s.userData.originalCenter), s.traverse((m) => {
    if (m.isMesh && m.visible) {
      t.push(m);
      const k = m.material, b = k.color ? k.color.getHex() : 16777215;
      n.has(b.toString()) || (n.set(b.toString(), i.length), i.push(b));
    }
  });
  const r = [], a = new TextEncoder(), c = new ArrayBuffer(20), u = new DataView(c);
  u.setFloat32(0, o.x, !0), u.setFloat32(4, o.y, !0), u.setFloat32(8, o.z, !0), u.setUint32(12, i.length, !0), u.setUint32(16, t.length, !0), r.push(c);
  const d = new ArrayBuffer(i.length * 4), l = new DataView(d);
  for (let m = 0; m < i.length; m++)
    l.setUint32(m * 4, i[m], !0);
  r.push(d);
  for (let m = 0; m < t.length; m++) {
    const k = Math.floor(m / t.length * 100);
    m % 10 === 0 && e(`Encoding mesh ${m + 1}/${t.length} (${k}%)`);
    const b = t[m], y = b.geometry;
    if (!y.getAttribute("position")) continue;
    const C = y.getAttribute("position"), x = y.getAttribute("normal"), w = y.index, I = a.encode(b.name || `Node_${m}`), D = new ArrayBuffer(2);
    new DataView(D).setUint16(0, I.length, !0), r.push(D), r.push(I.buffer);
    const R = (4 - (2 + I.length) % 4) % 4;
    R > 0 && r.push(new Uint8Array(R).buffer);
    const P = b.matrixWorld.elements, z = new ArrayBuffer(36), v = new DataView(z), T = [0, 1, 2, 4, 5, 6, 8, 9, 10];
    for (let S = 0; S < 9; S++) v.setFloat32(S * 4, P[T[S]], !0);
    r.push(z);
    const A = new ArrayBuffer(12), B = new DataView(A);
    B.setFloat32(0, P[12], !0), B.setFloat32(4, P[13], !0), B.setFloat32(8, P[14], !0), r.push(A);
    let L = 1 / 0, G = 1 / 0, H = 1 / 0, V = -1 / 0, E = -1 / 0, W = -1 / 0;
    for (let S = 0; S < C.count; S++) {
      const U = C.getX(S), Q = C.getY(S), q = C.getZ(S);
      U < L && (L = U), Q < G && (G = Q), q < H && (H = q), U > V && (V = U), Q > E && (E = Q), q > W && (W = q);
    }
    V === L && (V += 1e-3), E === G && (E += 1e-3), W === H && (W += 1e-3);
    const X = V - L, Y = E - G, _ = W - H, N = (L + V) / 2, Z = (G + E) / 2, ne = (H + W) / 2, pe = 32767 / (X * 0.5), fe = 32767 / (Y * 0.5), me = 32767 / (_ * 0.5), re = new ArrayBuffer(24), F = new DataView(re);
    F.setFloat32(0, N, !0), F.setFloat32(4, Z, !0), F.setFloat32(8, ne, !0), F.setFloat32(12, pe, !0), F.setFloat32(16, fe, !0), F.setFloat32(20, me, !0), r.push(re);
    const $ = C.count, oe = new ArrayBuffer(4);
    new DataView(oe).setUint32(0, $, !0), r.push(oe);
    const te = C.getX(0), ae = C.getY(0), ce = C.getZ(0);
    F.setFloat32(0, te, !0), F.setFloat32(4, ae, !0), F.setFloat32(8, ce, !0);
    const De = Math.max(Math.abs(V - te), Math.abs(L - te)), Oe = Math.max(Math.abs(E - ae), Math.abs(G - ae)), ze = Math.max(Math.abs(W - ce), Math.abs(H - ce)), Te = De > 1e-4 ? 32767 / De : 1, Ue = Oe > 1e-4 ? 32767 / Oe : 1, Ge = ze > 1e-4 ? 32767 / ze : 1;
    F.setFloat32(12, Te, !0), F.setFloat32(16, Ue, !0), F.setFloat32(20, Ge, !0);
    const ge = ($ - 1) * 6, Fe = new ArrayBuffer(ge > 0 ? ge : 0);
    if (ge > 0) {
      const S = new DataView(Fe);
      for (let U = 1; U < $; U++) {
        const Q = C.getX(U), q = C.getY(U), ye = C.getZ(U), ke = Math.round((Q - te) * Te), Ce = Math.round((q - ae) * Ue), be = Math.round((ye - ce) * Ge), j = (U - 1) * 6;
        S.setInt16(j, ke, !0), S.setInt16(j + 2, Ce, !0), S.setInt16(j + 4, be, !0);
      }
    }
    r.push(Fe);
    const Ve = new ArrayBuffer($ * 4), St = new DataView(Ve);
    for (let S = 0; S < $; S++) {
      let U = 0, Q = 0, q = 1;
      x && (U = x.getX(S), Q = x.getY(S), q = x.getZ(S));
      const ye = (ke, Ce, be) => {
        const j = (Pt) => Math.max(0, Math.min(1023, Math.round((Pt + 1) * 511)));
        return j(ke) << 20 | j(Ce) << 10 | j(be);
      };
      St.setUint32(S * 4, ye(U, Q, q), !0);
    }
    r.push(Ve);
    const Me = w ? w.count : $, ie = $ <= 255 ? 1 : $ <= 65535 ? 2 : 4, Ee = new ArrayBuffer(Me * ie), J = new DataView(Ee);
    if (w)
      for (let S = 0; S < Me; S++) {
        const U = w.getX(S);
        ie === 1 ? J.setUint8(S, U) : ie === 2 ? J.setUint16(S * 2, U, !0) : J.setUint32(S * 4, U, !0);
      }
    else
      for (let S = 0; S < Me; S++)
        ie === 1 ? J.setUint8(S, S) : ie === 2 ? J.setUint16(S * 2, S, !0) : J.setUint32(S * 4, S, !0);
    r.push(Ee);
    const We = b.material, Bt = We.color ? We.color.getHex() : 16777215, It = n.get(Bt.toString()) || 0, He = new ArrayBuffer(4);
    new DataView(He).setUint32(0, It, !0), r.push(He);
    const Ne = new ArrayBuffer(4);
    new DataView(Ne).setUint32(0, 0, !0), r.push(Ne);
  }
  e("完成LMB文件...");
  const p = r.reduce((m, k) => m + k.byteLength, 0), f = new ArrayBuffer(p), g = new Uint8Array(f);
  let M = 0;
  for (const m of r)
    g.set(new Uint8Array(m), M), M += m.byteLength;
  return new Blob([f], { type: "application/octet-stream" });
}
export {
  Ss as S,
  de as a,
  Is as b,
  Bs as e,
  se as s
};
