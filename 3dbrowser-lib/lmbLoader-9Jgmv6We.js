import * as h from "three";
import { Loader as G, FileLoader as Y } from "three";
const j = 1e6, P = 0.01, q = 0.02, R = 1 / 511, O = 1023, Z = 20, $ = 10, z = 512, E = 1024, V = (e) => {
  e && (e.side = h.DoubleSide, e.flatShading = !1, e.transparent = !1, e.depthWrite = !0, e.depthTest = !0);
}, k = (e) => `${e}_${Date.now()}`;
function W(e, r, n) {
  const t = e[0], s = e[1], c = e[2], l = r[0], d = r[1], m = r[2], I = n[0], M = n[1], S = n[2], A = t + I / l, g = s + M / d, w = c + S / m;
  return { rx: A, ry: g, rz: w };
}
const K = (e) => {
  let r = e >> Z & O, n = e >> $ & O, t = e & O;
  r = r >= z ? r - E : r, n = n >= z ? n - E : n, t = t >= z ? t - E : t;
  let s = r * R, c = n * R, l = t * R;
  const d = Math.sqrt(s * s + c * c + l * l);
  return d > 0 && (s /= d, c /= d, l /= d), { nx: s, ny: c, nz: l };
}, T = (e) => {
  const r = e >> 16 & 255, n = e >> 8 & 255, t = e & 255;
  return r << 16 | n << 8 | t;
}, H = (e) => {
  if (!e || e.length < 9)
    return [1, 1, 1];
  const r = Math.sqrt(e[0] * e[0] + e[1] * e[1] + e[2] * e[2]), n = Math.sqrt(e[3] * e[3] + e[4] * e[4] + e[5] * e[5]), t = Math.sqrt(e[6] * e[6] + e[7] * e[7] + e[8] * e[8]), s = (c) => Math.abs(c - P) < 1e-6 ? P : Math.abs(c - q) < 1e-6 ? q : c;
  return [s(r), s(n), s(t)];
}, J = (e) => {
  if (!e || e.length < 9) return Float32Array.from(e);
  const r = H(e), n = Float32Array.from(e);
  for (let t = 0; t < 3; t++) {
    const s = t * 3, c = r[t];
    Math.abs(c) > 1e-6 && (n[s] /= c, n[s + 1] /= c, n[s + 2] /= c);
  }
  return n;
}, B = (e, r) => {
  const n = new h.Matrix4();
  if (e && e.length >= 9 && r && r.length >= 3) {
    if (e.some((l) => isNaN(l)) || r.some((l) => isNaN(l)))
      return n.identity(), n;
    const t = H(e), s = J(e), c = [
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
    n.fromArray(c);
  } else
    n.identity(), r && r.length >= 3 && !r.some((t) => isNaN(t)) && n.setPosition(r[0], r[1], r[2]);
  return n;
};
class L extends G {
  static {
    this.expressIdCounter = j;
  }
  static {
    this.textDecoder = new TextDecoder();
  }
  constructor(r) {
    super(r), this.manager = r || h.DefaultLoadingManager;
  }
  async loadAsync(r, n, t = {}) {
    const s = new Y(this.manager);
    s.setResponseType("arraybuffer");
    let c = await new Promise((d, m) => {
      s.load(r, (I) => d(I), n, m);
    });
    if (r.split("?")[0].split("#")[0].toLowerCase().endsWith("lmbz")) throw new Error("不支持 lmbz 压缩格式，请使用 .lmb");
    return this.parse(c, n, t);
  }
  parse(r, n = () => {
  }, t = {}) {
    const s = t.fastMode ?? !0, c = new DataView(r);
    let l = 0;
    const d = new Float32Array(3);
    for (let i = 0; i < 3; i++)
      d[i] = c.getFloat32(l, !0), l += 4;
    const m = c.getUint32(l, !0);
    l += 4;
    const I = c.getUint32(l, !0);
    l += 4;
    let M = 0;
    const S = m + I, A = [];
    for (let i = 0; i < m; i++) {
      (i & 31) === 0 && n(M / S), M++;
      const a = c.getUint32(l, !0);
      A.push(a), l += 4;
    }
    const g = new h.Group();
    g.name = "LMB_Root", isNaN(d[0]) || g.position.set(d[0], d[1], d[2]);
    const w = A.map((i) => {
      const a = new h.MeshPhongMaterial({
        color: new h.Color(T(i)),
        side: h.DoubleSide,
        flatShading: !1,
        shininess: 30
      });
      return V(a), a;
    });
    for (let i = 0; i < I; i++) {
      (i & 31) === 0 && n(M / S), M++;
      const a = this.parseNode(r, c, l, { decodeNames: !s }), y = new h.BufferGeometry();
      y.setAttribute("position", new h.Float32BufferAttribute(a.vertices, 3)), y.setAttribute("normal", new h.Float32BufferAttribute(a.normals, 3)), y.setIndex(new h.Uint32BufferAttribute(a.indices, 1)), y.computeBoundingBox();
      const p = a.name && a.name.length > 0 ? a.name : `Node_${i}`, F = L.expressIdCounter++;
      if (y.userData = { expressID: F, bimId: String(F) }, a.instances.length > 0) {
        const u = new h.InstancedMesh(
          y,
          w[a.colorIndex],
          a.instances.length + 1
        );
        u.name = p, u.userData.expressID = F, u.userData.bimId = String(F);
        const _ = B(a.matrix, a.position);
        u.setMatrixAt(0, _), u.setColorAt(0, new h.Color(T(A[a.colorIndex]))), a.instances.forEach((o, N) => {
          const C = B(o.matrix, o.position);
          u.setMatrixAt(N + 1, C), u.setColorAt(N + 1, new h.Color(T(A[o.colorIndex])));
        }), g.add(u);
      } else {
        const u = new h.Mesh(y, w[a.colorIndex]);
        u.name = p, u.userData.expressID = F, u.userData.bimId = String(F);
        const _ = B(a.matrix, a.position);
        u.applyMatrix4(_), g.add(u);
      }
      l = a.nextOffset;
    }
    return n(1), g;
  }
  parseNode(r, n, t, s = {}) {
    const c = s.decodeNames ?? !0, l = n.getUint16(t, !0);
    t += 2;
    const d = c ? L.textDecoder.decode(new Uint8Array(r, t, l)) : "";
    for (t += l; t % 4 !== 0; ) t++;
    const m = new Float32Array(9);
    for (let o = 0; o < 9; o++)
      m[o] = n.getFloat32(t, !0), t += 4;
    const I = new Float32Array(3);
    for (let o = 0; o < 3; o++)
      I[o] = n.getFloat32(t, !0), t += 4;
    const M = new Float32Array(3);
    for (let o = 0; o < 3; o++)
      M[o] = n.getFloat32(t, !0), t += 4;
    const S = new Float32Array(3);
    for (let o = 0; o < 3; o++)
      S[o] = n.getFloat32(t, !0), t += 4;
    const A = n.getUint32(t, !0);
    t += 4;
    const g = new Float32Array(A * 3);
    g[0] = M[0], g[1] = M[1], g[2] = M[2];
    for (let o = 0; o < A - 1; o++) {
      const N = new Int16Array(3);
      for (let x = 0; x < 3; x++)
        N[x] = n.getInt16(t, !0), t += 2;
      const { rx: C, ry: D, rz: b } = W(M, S, N);
      g[(o + 1) * 3] = C, g[(o + 1) * 3 + 1] = D, g[(o + 1) * 3 + 2] = b;
    }
    for (; t % 4 !== 0; ) t++;
    const w = A, i = new Float32Array(w * 3);
    for (let o = 0; o < w; o++) {
      const N = n.getUint32(t, !0);
      t += 4;
      const { nx: C, ny: D, nz: b } = K(N);
      i[o * 3] = C, i[o * 3 + 1] = D, i[o * 3 + 2] = b;
    }
    for (; t % 4 !== 0; ) t++;
    const a = n.getUint32(t, !0);
    t += 4;
    const y = A <= 255 ? 1 : A <= 65535 ? 2 : 4;
    let p;
    A <= 255 ? p = new Uint8Array(a) : A <= 65535 ? p = new Uint16Array(a) : p = new Uint32Array(a);
    for (let o = 0; o < a; o++)
      y === 1 ? p[o] = n.getUint8(t) : y === 2 ? p[o] = n.getUint16(t, !0) : p[o] = n.getUint32(t, !0), t += y;
    if (y < 4)
      for (; t % 4 !== 0; ) t++;
    const F = n.getUint32(t, !0);
    t += 4;
    const u = n.getUint32(t, !0);
    t += 4;
    const _ = [];
    if (u > 0)
      for (let o = 0; o < u; o++) {
        const N = n.getUint16(t, !0);
        t += 2;
        const C = c ? L.textDecoder.decode(new Uint8Array(r, t, N)) : "";
        t += N;
        const D = (4 - t % 4) % 4;
        t += D;
        const b = new Float32Array(9);
        for (let U = 0; U < 9; U++)
          b[U] = n.getFloat32(t, !0), t += 4;
        const x = new Float32Array(3);
        for (let U = 0; U < 3; U++)
          x[U] = n.getFloat32(t, !0), t += 4;
        const X = n.getUint32(t, !0);
        t += 4, _.push({
          name: C,
          matrix: b,
          position: x,
          colorIndex: X
        });
      }
    return {
      name: d,
      matrix: m,
      position: I,
      vertices: g,
      normals: i,
      indices: p,
      colorIndex: F,
      instances: _,
      nextOffset: t
    };
  }
}
export {
  L as LMBLoader,
  B as composeMatrixByMatrix3,
  K as decodeNormal,
  W as decompressVertice,
  H as extractScaleFromMatrix3,
  k as generateUniqueId,
  J as normalizeMatrix3,
  T as parseColor,
  V as setMaterialProperties
};
