import * as THREE from 'three';
import { G as GLTFExporter } from './loaders-TXHpcosE.js';

function calculateGeometryMemory(geometry) {
  let bytes = 0;
  if (geometry.attributes) {
    for (const name in geometry.attributes) {
      const attr = geometry.attributes[name];
      if (attr.array) {
        bytes += attr.array.byteLength;
      }
    }
  }
  if (geometry.index && geometry.index.array) {
    bytes += geometry.index.array.byteLength;
  }
  return bytes / (1024 * 1024);
}
function sanitizeGeometry(source) {
  if (!source.getAttribute("position")) return new THREE.BoxGeometry(0.1, 0.1, 0.1);
  const geometry = new THREE.BufferGeometry();
  const posAttr = source.getAttribute("position");
  if (posAttr.isInterleavedBufferAttribute) {
    const positions = new Float32Array(posAttr.count * 3);
    for (let i = 0; i < posAttr.count; i++) {
      positions[i * 3] = posAttr.getX(i);
      positions[i * 3 + 1] = posAttr.getY(i);
      positions[i * 3 + 2] = posAttr.getZ(i);
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  } else {
    geometry.setAttribute("position", posAttr.clone());
  }
  const normAttr = source.getAttribute("normal");
  if (normAttr) {
    if (normAttr.isInterleavedBufferAttribute) {
      const normals = new Float32Array(normAttr.count * 3);
      for (let i = 0; i < normAttr.count; i++) {
        normals[i * 3] = normAttr.getX(i);
        normals[i * 3 + 1] = normAttr.getY(i);
        normals[i * 3 + 2] = normAttr.getZ(i);
      }
      geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    } else {
      geometry.setAttribute("normal", normAttr.clone());
    }
  } else {
    geometry.computeVertexNormals();
  }
  const sourceIndex = source.getIndex();
  if (sourceIndex) {
    geometry.setIndex(sourceIndex.clone());
  } else {
    const count = posAttr.count;
    const indices = new Uint32Array(count);
    for (let i = 0; i < count; i++) indices[i] = i;
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  }
  geometry.deleteAttribute("uv");
  geometry.deleteAttribute("uv2");
  geometry.deleteAttribute("color");
  geometry.computeBoundingBox();
  return geometry;
}
function extractColor(mesh) {
  if (mesh.userData.color !== void 0) return mesh.userData.color;
  const geo = mesh.geometry;
  if (geo && geo.attributes.color) {
    const colorAttr = geo.attributes.color;
    if (colorAttr.count > 0) {
      const r = colorAttr.getX(0);
      const g = colorAttr.getY(0);
      const b = colorAttr.getZ(0);
      const color = new THREE.Color();
      if (r > 1 || g > 1 || b > 1) color.setRGB(r / 255, g / 255, b / 255);
      else color.setRGB(r, g, b);
      return color.getHex();
    }
  }
  const material = mesh.material;
  if (Array.isArray(material)) {
    for (const mat of material) {
      if (mat.color) return mat.color.getHex();
    }
  } else if (material.color) {
    return material.color.getHex();
  }
  return getColorByComponentType(mesh.name);
}
function getColorByComponentType(_name) {
  return 9741240;
}
function collectItems(root) {
  const items = [];
  const _m4 = new THREE.Matrix4();
  root.updateMatrixWorld(true);
  root.traverse((obj) => {
    if (obj.isMesh) {
      const mesh = obj;
      const geometry = mesh.geometry;
      const material = mesh.material;
      if (!geometry) return;
      if (!geometry.boundingBox) geometry.computeBoundingBox();
      const worldMatrix = mesh.matrixWorld;
      const center = new THREE.Vector3();
      geometry.boundingBox.getCenter(center);
      center.applyMatrix4(worldMatrix);
      const matUuid = Array.isArray(material) ? material[0]?.uuid : material?.uuid;
      const id = `${geometry.uuid}_${matUuid}`;
      if (mesh.isInstancedMesh) {
        const instancedMesh = mesh;
        for (let i = 0; i < instancedMesh.count; i++) {
          instancedMesh.getMatrixAt(i, _m4);
          _m4.premultiply(worldMatrix);
          const instanceCenter = new THREE.Vector3();
          geometry.boundingBox.getCenter(instanceCenter);
          instanceCenter.applyMatrix4(_m4);
          items.push({
            id,
            uuid: mesh.uuid,
            sourceMesh: mesh,
            expressID: instancedMesh.userData.expressID,
            geometry,
            material,
            color: extractColor(mesh),
            matrix: _m4.clone(),
            center: instanceCenter
          });
        }
      } else {
        items.push({
          id,
          uuid: mesh.uuid,
          sourceMesh: mesh,
          expressID: mesh.userData.expressID,
          geometry,
          material,
          color: extractColor(mesh),
          matrix: worldMatrix.clone(),
          center
        });
      }
    }
  });
  return items;
}
async function collectItemsBatched(root, options = {}) {
  const items = [];
  const _m4 = new THREE.Matrix4();
  const batchSize = options.batchSize ?? 4e3;
  root.updateMatrixWorld(true);
  const renderables = [];
  root.traverse((obj) => {
    if (obj.isMesh) renderables.push(obj);
  });
  for (let start = 0; start < renderables.length; start += batchSize) {
    const batch = renderables.slice(start, start + batchSize);
    for (const obj of batch) {
      const mesh = obj;
      const geometry = mesh.geometry;
      const material = mesh.material;
      if (!geometry) continue;
      if (!geometry.boundingBox) geometry.computeBoundingBox();
      const worldMatrix = mesh.matrixWorld;
      const center = new THREE.Vector3();
      geometry.boundingBox.getCenter(center);
      center.applyMatrix4(worldMatrix);
      const matUuid = Array.isArray(material) ? material[0]?.uuid : material?.uuid;
      const id = `${geometry.uuid}_${matUuid}`;
      if (mesh.isInstancedMesh) {
        const instancedMesh = mesh;
        for (let i = 0; i < instancedMesh.count; i++) {
          instancedMesh.getMatrixAt(i, _m4);
          _m4.premultiply(worldMatrix);
          const instanceCenter = new THREE.Vector3();
          geometry.boundingBox.getCenter(instanceCenter);
          instanceCenter.applyMatrix4(_m4);
          items.push({
            id,
            uuid: mesh.uuid,
            sourceMesh: mesh,
            expressID: instancedMesh.userData.expressID,
            geometry,
            material,
            color: extractColor(mesh),
            matrix: _m4.clone(),
            center: instanceCenter
          });
        }
      } else {
        items.push({
          id,
          uuid: mesh.uuid,
          sourceMesh: mesh,
          expressID: mesh.userData.expressID,
          geometry,
          material,
          color: extractColor(mesh),
          matrix: worldMatrix.clone(),
          center
        });
      }
    }
    options.onProgress?.(Math.min(start + batch.length, renderables.length), renderables.length);
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }
  return items;
}
function buildOctree(items, bounds, config, level = 0) {
  if (items.length <= config.maxItemsPerNode || level >= config.maxDepth) {
    return { bounds: bounds.clone(), children: null, items, level };
  }
  const center = bounds.getCenter(new THREE.Vector3());
  const min = bounds.min;
  const max = bounds.max;
  const childrenItems = Array(8).fill(null).map(() => []);
  for (const item of items) {
    const c = item.center;
    const idx = (c.x >= center.x ? 1 : 0) | (c.y >= center.y ? 2 : 0) | (c.z >= center.z ? 4 : 0);
    childrenItems[idx].push(item);
  }
  const children = [];
  let hasChildren = false;
  for (let i = 0; i < 8; i++) {
    if (childrenItems[i].length > 0) {
      const cMin = new THREE.Vector3(i & 1 ? center.x : min.x, i & 2 ? center.y : min.y, i & 4 ? center.z : min.z);
      const cMax = new THREE.Vector3(i & 1 ? max.x : center.x, i & 2 ? max.y : center.y, i & 4 ? max.z : center.z);
      const childBounds = new THREE.Box3(cMin, cMax);
      children.push(buildOctree(childrenItems[i], childBounds, config, level + 1));
      hasChildren = true;
    }
  }
  if (!hasChildren) {
    return { bounds: bounds.clone(), children: null, items, level };
  }
  return { bounds: bounds.clone(), children, items: [], level };
}
async function createBatchedMeshFromItemsAsync(items, material, options = {}) {
  if (items.length === 0) return null;
  const batchSize = options.batchSize ?? 1200;
  const yieldControl = options.yieldControl ?? (() => new Promise((resolve) => requestAnimationFrame(() => resolve())));
  let vertexCount = 0;
  let indexCount = 0;
  const sanitizedGeometries = /* @__PURE__ */ new Map();
  const sanitizedItems = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    let sanitized = sanitizedGeometries.get(item.geometry);
    if (!sanitized) {
      sanitized = sanitizeGeometry(item.geometry);
      sanitizedGeometries.set(item.geometry, sanitized);
    }
    sanitizedItems.push({
      ...item,
      geometry: sanitized
    });
    vertexCount += sanitized.attributes.position.count;
    if (sanitized.index) {
      indexCount += sanitized.index.count;
    }
    if (i > 0 && i % batchSize === 0) {
      await yieldControl();
    }
  }
  const batchedMesh = new THREE.BatchedMesh(sanitizedItems.length, vertexCount, indexCount, material);
  batchedMesh.frustumCulled = false;
  batchedMesh.perInstanceFrustumCulling = false;
  const geometryMap = /* @__PURE__ */ new Map();
  const batchIdToExpressId = /* @__PURE__ */ new Map();
  const batchIdToUuid = /* @__PURE__ */ new Map();
  const batchIdToColor = /* @__PURE__ */ new Map();
  const batchIdToGeometry = /* @__PURE__ */ new Map();
  for (let i = 0; i < sanitizedItems.length; i++) {
    const item = sanitizedItems[i];
    let geometryId = geometryMap.get(item.geometry);
    if (geometryId === void 0) {
      geometryId = batchedMesh.addGeometry(item.geometry);
      geometryMap.set(item.geometry, geometryId);
    }
    if (geometryId !== -1) {
      const instanceId = batchedMesh.addInstance(geometryId);
      batchedMesh.setMatrixAt(instanceId, item.matrix);
      if (!item.geometry.boundingBox) item.geometry.computeBoundingBox();
      if (batchedMesh.setBoundingBoxAt) {
        batchedMesh.setBoundingBoxAt(instanceId, item.geometry.boundingBox);
      }
      const color = new THREE.Color(item.color);
      batchedMesh.setColorAt(instanceId, color);
      if (item.expressID !== void 0) {
        batchIdToExpressId.set(instanceId, item.expressID);
      }
      batchIdToUuid.set(instanceId, item.uuid);
      batchIdToColor.set(instanceId, item.color);
      batchIdToGeometry.set(instanceId, item.geometry);
    }
    if (i > 0 && i % batchSize === 0) {
      await yieldControl();
    }
  }
  batchedMesh.userData.batchIdToExpressId = batchIdToExpressId;
  batchedMesh.userData.batchIdToUuid = batchIdToUuid;
  batchedMesh.userData.batchIdToColor = batchIdToColor;
  batchedMesh.userData.batchIdToGeometry = batchIdToGeometry;
  batchedMesh.computeBoundingBox();
  batchedMesh.computeBoundingSphere();
  return batchedMesh;
}
function collectLeafNodes(node, leaves = []) {
  if (node.children) {
    for (const child of node.children) {
      collectLeafNodes(child, leaves);
    }
  } else if (node.items.length > 0) {
    leaves.push(node);
  }
  return leaves;
}

async function exportGLB(root) {
  const exporter = new GLTFExporter();
  return new Promise((resolve, reject) => {
    exporter.parse(
      root,
      (result) => {
        const blob = new Blob([result], { type: "model/gltf-binary" });
        resolve(blob);
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}
async function exportLMB(root, onProgress) {
  onProgress("准备LMB导出...");
  const meshes = [];
  const colors = [];
  const colorMap = /* @__PURE__ */ new Map();
  root.updateMatrixWorld(true);
  const globalOffset = new THREE.Vector3(0, 0, 0);
  if (root.userData.originalCenter) globalOffset.copy(root.userData.originalCenter);
  root.traverse((obj) => {
    if (obj.isMesh && obj.visible) {
      meshes.push(obj);
      const mat = obj.material;
      const hex = mat.color ? mat.color.getHex() : 16777215;
      if (!colorMap.has(hex.toString())) {
        colorMap.set(hex.toString(), colors.length);
        colors.push(hex);
      }
    }
  });
  const parts = [];
  const textEncoder = new TextEncoder();
  const header = new ArrayBuffer(4 * 3 + 4 + 4);
  const headerView = new DataView(header);
  headerView.setFloat32(0, globalOffset.x, true);
  headerView.setFloat32(4, globalOffset.y, true);
  headerView.setFloat32(8, globalOffset.z, true);
  headerView.setUint32(12, colors.length, true);
  headerView.setUint32(16, meshes.length, true);
  parts.push(header);
  const colorsBuffer = new ArrayBuffer(colors.length * 4);
  const colorsView = new DataView(colorsBuffer);
  for (let i = 0; i < colors.length; i++) {
    colorsView.setUint32(i * 4, colors[i], true);
  }
  parts.push(colorsBuffer);
  for (let i = 0; i < meshes.length; i++) {
    const percent = Math.floor(i / meshes.length * 100);
    if (i % 10 === 0) onProgress(`Encoding mesh ${i + 1}/${meshes.length} (${percent}%)`);
    const mesh = meshes[i];
    const geo = mesh.geometry;
    if (!geo.getAttribute("position")) continue;
    const posAttr = geo.getAttribute("position");
    const normAttr = geo.getAttribute("normal");
    const indexAttr = geo.index;
    const nameBytes = textEncoder.encode(mesh.name || `Node_${i}`);
    const nameLen = new ArrayBuffer(2);
    new DataView(nameLen).setUint16(0, nameBytes.length, true);
    parts.push(nameLen);
    parts.push(nameBytes.buffer);
    const paddingLen = (4 - (2 + nameBytes.length) % 4) % 4;
    if (paddingLen > 0) parts.push(new Uint8Array(paddingLen).buffer);
    const m = mesh.matrixWorld;
    const e = m.elements;
    const matBuf = new ArrayBuffer(9 * 4);
    const matView = new DataView(matBuf);
    const indices = [0, 1, 2, 4, 5, 6, 8, 9, 10];
    for (let k = 0; k < 9; k++) matView.setFloat32(k * 4, e[indices[k]], true);
    parts.push(matBuf);
    const posBuf = new ArrayBuffer(3 * 4);
    const posView = new DataView(posBuf);
    posView.setFloat32(0, e[12], true);
    posView.setFloat32(4, e[13], true);
    posView.setFloat32(8, e[14], true);
    parts.push(posBuf);
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (let k = 0; k < posAttr.count; k++) {
      const x = posAttr.getX(k);
      const y = posAttr.getY(k);
      const z = posAttr.getZ(k);
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (z < minZ) minZ = z;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      if (z > maxZ) maxZ = z;
    }
    if (maxX === minX) maxX += 1e-3;
    if (maxY === minY) maxY += 1e-3;
    if (maxZ === minZ) maxZ += 1e-3;
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    const rangeZ = maxZ - minZ;
    const baseX = (minX + maxX) / 2;
    const baseY = (minY + maxY) / 2;
    const baseZ = (minZ + maxZ) / 2;
    const scaleX = 32767 / (rangeX * 0.5);
    const scaleY = 32767 / (rangeY * 0.5);
    const scaleZ = 32767 / (rangeZ * 0.5);
    const compressionBuf = new ArrayBuffer(6 * 4);
    const compView = new DataView(compressionBuf);
    compView.setFloat32(0, baseX, true);
    compView.setFloat32(4, baseY, true);
    compView.setFloat32(8, baseZ, true);
    compView.setFloat32(12, scaleX, true);
    compView.setFloat32(16, scaleY, true);
    compView.setFloat32(20, scaleZ, true);
    parts.push(compressionBuf);
    const vertCount = posAttr.count;
    const countBuf = new ArrayBuffer(4);
    new DataView(countBuf).setUint32(0, vertCount, true);
    parts.push(countBuf);
    const firstX = posAttr.getX(0);
    const firstY = posAttr.getY(0);
    const firstZ = posAttr.getZ(0);
    compView.setFloat32(0, firstX, true);
    compView.setFloat32(4, firstY, true);
    compView.setFloat32(8, firstZ, true);
    const maxDeltaX = Math.max(Math.abs(maxX - firstX), Math.abs(minX - firstX));
    const maxDeltaY = Math.max(Math.abs(maxY - firstY), Math.abs(minY - firstY));
    const maxDeltaZ = Math.max(Math.abs(maxZ - firstZ), Math.abs(minZ - firstZ));
    const finalScaleX = maxDeltaX > 1e-4 ? 32767 / maxDeltaX : 1;
    const finalScaleY = maxDeltaY > 1e-4 ? 32767 / maxDeltaY : 1;
    const finalScaleZ = maxDeltaZ > 1e-4 ? 32767 / maxDeltaZ : 1;
    compView.setFloat32(12, finalScaleX, true);
    compView.setFloat32(16, finalScaleY, true);
    compView.setFloat32(20, finalScaleZ, true);
    const vertDataSize = (vertCount - 1) * 6;
    const vertBuf = new ArrayBuffer(vertDataSize > 0 ? vertDataSize : 0);
    if (vertDataSize > 0) {
      const vView = new DataView(vertBuf);
      for (let k = 1; k < vertCount; k++) {
        const x = posAttr.getX(k);
        const y = posAttr.getY(k);
        const z = posAttr.getZ(k);
        const qx = Math.round((x - firstX) * finalScaleX);
        const qy = Math.round((y - firstY) * finalScaleY);
        const qz = Math.round((z - firstZ) * finalScaleZ);
        const offset2 = (k - 1) * 6;
        vView.setInt16(offset2, qx, true);
        vView.setInt16(offset2 + 2, qy, true);
        vView.setInt16(offset2 + 4, qz, true);
      }
    }
    parts.push(vertBuf);
    const normBuf = new ArrayBuffer(vertCount * 4);
    const normView = new DataView(normBuf);
    for (let k = 0; k < vertCount; k++) {
      let nx = 0, ny = 0, nz = 1;
      if (normAttr) {
        nx = normAttr.getX(k);
        ny = normAttr.getY(k);
        nz = normAttr.getZ(k);
      }
      const packNormal = (x, y, z) => {
        const bias = (v) => Math.max(0, Math.min(1023, Math.round((v + 1) * 511)));
        return bias(x) << 20 | bias(y) << 10 | bias(z);
      };
      normView.setUint32(k * 4, packNormal(nx, ny, nz), true);
    }
    parts.push(normBuf);
    const indexCount = indexAttr ? indexAttr.count : vertCount;
    const indexSize = vertCount <= 255 ? 1 : vertCount <= 65535 ? 2 : 4;
    const indexBuf = new ArrayBuffer(indexCount * indexSize);
    const idxView = new DataView(indexBuf);
    if (indexAttr) {
      for (let k = 0; k < indexCount; k++) {
        const idx = indexAttr.getX(k);
        if (indexSize === 1) idxView.setUint8(k, idx);
        else if (indexSize === 2) idxView.setUint16(k * 2, idx, true);
        else idxView.setUint32(k * 4, idx, true);
      }
    } else {
      for (let k = 0; k < indexCount; k++) {
        if (indexSize === 1) idxView.setUint8(k, k);
        else if (indexSize === 2) idxView.setUint16(k * 2, k, true);
        else idxView.setUint32(k * 4, k, true);
      }
    }
    parts.push(indexBuf);
    const mat = mesh.material;
    const hex = mat.color ? mat.color.getHex() : 16777215;
    const colorIdx = colorMap.get(hex.toString()) || 0;
    const colorIdxBuf = new ArrayBuffer(4);
    new DataView(colorIdxBuf).setUint32(0, colorIdx, true);
    parts.push(colorIdxBuf);
    const instBuf = new ArrayBuffer(4);
    new DataView(instBuf).setUint32(0, 0, true);
    parts.push(instBuf);
  }
  onProgress("完成LMB文件...");
  const totalSize = parts.reduce((sum, buf) => sum + buf.byteLength, 0);
  const finalBuffer = new ArrayBuffer(totalSize);
  const finalView = new Uint8Array(finalBuffer);
  let offset = 0;
  for (const buf of parts) {
    finalView.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }
  return new Blob([finalBuffer], { type: "application/octet-stream" });
}

export { calculateGeometryMemory as a, buildOctree as b, createBatchedMeshFromItemsAsync as c, collectLeafNodes as d, collectItemsBatched as e, collectItems as f, exportGLB as g, exportLMB as h };
