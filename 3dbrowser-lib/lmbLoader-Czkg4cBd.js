import * as M from "three";
import { Loader as Y, FileLoader as j } from "three";
import { t as R, a as Z } from "./utils-BKVlSVq3.js";
const $ = 1e6, q = 0.01, H = 0.02, O = 1 / 511, z = 1023, V = 20, W = 10, E = 512, T = 1024, K = (e) => {
  e && (e.side = M.DoubleSide, e.flatShading = !1, e.transparent = !1, e.depthWrite = !0, e.depthTest = !0);
}, tt = (e) => `${e}_${Date.now()}`;
function J(e, r, n) {
  const t = e[0], s = e[1], a = e[2], l = r[0], d = r[1], N = r[2], I = n[0], A = n[1], F = n[2], h = t + I / l, g = s + A / d, w = a + F / N;
  return { rx: h, ry: g, rz: w };
}
const Q = (e) => {
  let r = e >> V & z, n = e >> W & z, t = e & z;
  r = r >= E ? r - T : r, n = n >= E ? n - T : n, t = t >= E ? t - T : t;
  let s = r * O, a = n * O, l = t * O;
  const d = Math.sqrt(s * s + a * a + l * l);
  return d > 0 && (s /= d, a /= d, l /= d), { nx: s, ny: a, nz: l };
}, B = (e) => {
  const r = e >> 16 & 255, n = e >> 8 & 255, t = e & 255;
  return r << 16 | n << 8 | t;
}, X = (e) => {
  if (!e || e.length < 9)
    return [1, 1, 1];
  const r = Math.sqrt(e[0] * e[0] + e[1] * e[1] + e[2] * e[2]), n = Math.sqrt(e[3] * e[3] + e[4] * e[4] + e[5] * e[5]), t = Math.sqrt(e[6] * e[6] + e[7] * e[7] + e[8] * e[8]), s = (a) => Math.abs(a - q) < 1e-6 ? q : Math.abs(a - H) < 1e-6 ? H : a;
  return [s(r), s(n), s(t)];
}, k = (e) => {
  if (!e || e.length < 9) return Float32Array.from(e);
  const r = X(e), n = Float32Array.from(e);
  for (let t = 0; t < 3; t++) {
    const s = t * 3, a = r[t];
    Math.abs(a) > 1e-6 && (n[s] /= a, n[s + 1] /= a, n[s + 2] /= a);
  }
  return n;
}, P = (e, r) => {
  const n = new M.Matrix4();
  if (e && e.length >= 9 && r && r.length >= 3) {
    if (e.some((l) => isNaN(l)) || r.some((l) => isNaN(l)))
      return n.identity(), n;
    const t = X(e), s = k(e), a = [
      s[0] * t[0],
      s[1] * t[0],
      s[2] * t[0],
      0,
      s[3] * t[1],
      s[4] * t[1],
      s[5] * t[1],
      0,
      s[6] * t[2],
      s[7] * t[2],
      s[8] * t[2],
      0,
      r[0],
      r[1],
      r[2],
      1
    ];
    n.fromArray(a);
  } else
    n.identity(), r && r.length >= 3 && !r.some((t) => isNaN(t)) && n.setPosition(r[0], r[1], r[2]);
  return n;
};
class L extends Y {
  static {
    this.expressIdCounter = $;
  }
  static {
    this.textDecoder = new TextDecoder();
  }
  constructor(r) {
    super(r), this.manager = r || M.DefaultLoadingManager;
  }
  async loadAsync(r, n, t = {}) {
    const s = new j(this.manager);
    s.setResponseType("arraybuffer");
    let a = await new Promise((d, N) => {
      s.load(r, (I) => d(I), n, N);
    });
    if (r.split("?")[0].split("#")[0].toLowerCase().endsWith("lmbz")) throw new Error("不支持 lmbz 压缩格式，请使用 .lmb");
    return this.parse(a, n, t);
  }
  parse(r, n = () => {
  }, t = {}) {
    const s = t.fastMode ?? !0, a = new DataView(r);
    let l = 0;
    const d = new Float32Array(3);
    for (let i = 0; i < 3; i++)
      d[i] = a.getFloat32(l, !0), l += 4;
    const N = a.getUint32(l, !0);
    l += 4;
    const I = a.getUint32(l, !0);
    l += 4;
    let A = 0;
    const F = N + I, h = [];
    for (let i = 0; i < N; i++) {
      (i & 31) === 0 && n(A / F), A++;
      const c = a.getUint32(l, !0);
      h.push(c), l += 4;
    }
    const g = new M.Group();
    g.name = "LMB_Root", isNaN(d[0]) || g.position.set(d[0], d[1], d[2]);
    const w = h.map((i) => {
      const c = new M.MeshPhongMaterial({
        color: R(B(i)),
        side: M.DoubleSide,
        flatShading: !1,
        shininess: 30
      });
      return K(c), Z(c), c;
    });
    for (let i = 0; i < I; i++) {
      (i & 31) === 0 && n(A / F), A++;
      const c = this.parseNode(r, a, l, { decodeNames: !s }), y = new M.BufferGeometry();
      y.setAttribute("position", new M.Float32BufferAttribute(c.vertices, 3)), y.setAttribute("normal", new M.Float32BufferAttribute(c.normals, 3)), y.setIndex(new M.Uint32BufferAttribute(c.indices, 1)), y.computeBoundingBox();
      const p = c.name && c.name.length > 0 ? c.name : `Node_${i}`, S = L.expressIdCounter++;
      if (y.userData = { expressID: S, bimId: String(S) }, c.instances.length > 0) {
        const u = new M.InstancedMesh(
          y,
          w[c.colorIndex],
          c.instances.length + 1
        );
        u.name = p, u.userData.expressID = S, u.userData.bimId = String(S);
        const C = P(c.matrix, c.position);
        u.setMatrixAt(0, C), u.setColorAt(0, R(B(h[c.colorIndex]))), c.instances.forEach((o, m) => {
          const U = P(o.matrix, o.position);
          u.setMatrixAt(m + 1, U), u.setColorAt(m + 1, R(B(h[o.colorIndex])));
        }), g.add(u);
      } else {
        const u = new M.Mesh(y, w[c.colorIndex]);
        u.name = p, u.userData.expressID = S, u.userData.bimId = String(S);
        const C = P(c.matrix, c.position);
        u.applyMatrix4(C), g.add(u);
      }
      l = c.nextOffset;
    }
    return n(1), g;
  }
  parseNode(r, n, t, s = {}) {
    const a = s.decodeNames ?? !0, l = n.getUint16(t, !0);
    t += 2;
    const d = a ? L.textDecoder.decode(new Uint8Array(r, t, l)) : "";
    for (t += l; t % 4 !== 0; ) t++;
    const N = new Float32Array(9);
    for (let o = 0; o < 9; o++)
      N[o] = n.getFloat32(t, !0), t += 4;
    const I = new Float32Array(3);
    for (let o = 0; o < 3; o++)
      I[o] = n.getFloat32(t, !0), t += 4;
    const A = new Float32Array(3);
    for (let o = 0; o < 3; o++)
      A[o] = n.getFloat32(t, !0), t += 4;
    const F = new Float32Array(3);
    for (let o = 0; o < 3; o++)
      F[o] = n.getFloat32(t, !0), t += 4;
    const h = n.getUint32(t, !0);
    t += 4;
    const g = new Float32Array(h * 3);
    g[0] = A[0], g[1] = A[1], g[2] = A[2];
    for (let o = 0; o < h - 1; o++) {
      const m = new Int16Array(3);
      for (let b = 0; b < 3; b++)
        m[b] = n.getInt16(t, !0), t += 2;
      const { rx: U, ry: x, rz: D } = J(A, F, m);
      g[(o + 1) * 3] = U, g[(o + 1) * 3 + 1] = x, g[(o + 1) * 3 + 2] = D;
    }
    for (; t % 4 !== 0; ) t++;
    const w = h, i = new Float32Array(w * 3);
    for (let o = 0; o < w; o++) {
      const m = n.getUint32(t, !0);
      t += 4;
      const { nx: U, ny: x, nz: D } = Q(m);
      i[o * 3] = U, i[o * 3 + 1] = x, i[o * 3 + 2] = D;
    }
    for (; t % 4 !== 0; ) t++;
    const c = n.getUint32(t, !0);
    t += 4;
    const y = h <= 255 ? 1 : h <= 65535 ? 2 : 4;
    let p;
    h <= 255 ? p = new Uint8Array(c) : h <= 65535 ? p = new Uint16Array(c) : p = new Uint32Array(c);
    for (let o = 0; o < c; o++)
      y === 1 ? p[o] = n.getUint8(t) : y === 2 ? p[o] = n.getUint16(t, !0) : p[o] = n.getUint32(t, !0), t += y;
    if (y < 4)
      for (; t % 4 !== 0; ) t++;
    const S = n.getUint32(t, !0);
    t += 4;
    const u = n.getUint32(t, !0);
    t += 4;
    const C = [];
    if (u > 0)
      for (let o = 0; o < u; o++) {
        const m = n.getUint16(t, !0);
        t += 2;
        const U = a ? L.textDecoder.decode(new Uint8Array(r, t, m)) : "";
        t += m;
        const x = (4 - t % 4) % 4;
        t += x;
        const D = new Float32Array(9);
        for (let _ = 0; _ < 9; _++)
          D[_] = n.getFloat32(t, !0), t += 4;
        const b = new Float32Array(3);
        for (let _ = 0; _ < 3; _++)
          b[_] = n.getFloat32(t, !0), t += 4;
        const G = n.getUint32(t, !0);
        t += 4, C.push({
          name: U,
          matrix: D,
          position: b,
          colorIndex: G
        });
      }
    return {
      name: d,
      matrix: N,
      position: I,
      vertices: g,
      normals: i,
      indices: p,
      colorIndex: S,
      instances: C,
      nextOffset: t
    };
  }
}
export {
  L as LMBLoader,
  P as composeMatrixByMatrix3,
  Q as decodeNormal,
  J as decompressVertice,
  X as extractScaleFromMatrix3,
  tt as generateUniqueId,
  k as normalizeMatrix3,
  B as parseColor,
  K as setMaterialProperties
};
