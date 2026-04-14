import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { useState, useEffect, useRef, useCallback, useMemo, Component } from 'react';
import * as THREE from 'three';
import { Vector3, Matrix3, MathUtils, Box3, Matrix4, Ray } from 'three';
import { O as OrbitControls } from './loaders-TXHpcosE.js';
import { c as createBatchedMeshFromItemsAsync, a as calculateGeometryMemory, b as buildOctree, d as collectLeafNodes, e as collectItemsBatched, f as collectItems, g as exportGLB, h as exportLMB } from './utils-DN_d7V9M.js';

function deriveInitialRuntimeFromHardware(cpuCount, preset) {
  const normalizedCpu = Math.max(2, cpuCount);
  const presetFactor = preset === "smooth" ? 0.85 : preset === "quality" ? 1.15 : 1;
  const maxConcurrentChunkLoads = Math.max(20, Math.min(128, Math.floor(normalizedCpu * 10 * presetFactor)));
  const maxChunkLoadsPerFrame = Math.max(8, Math.min(48, Math.floor(normalizedCpu * 3 * presetFactor)));
  return {
    maxConcurrentChunkLoads,
    maxChunkLoadsPerFrame
  };
}

const isDevHost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
function debugLog(scope, ...args) {
  if (!isDevHost) return;
  console.log(`[${scope}]`, ...args);
}
function debugWarn(scope, ...args) {
  if (!isDevHost) return;
  console.warn(`[${scope}]`, ...args);
}

function stableExplodeDirection(seed, target) {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const angle = (hash >>> 0) / 4294967295 * Math.PI * 2;
  const z = (hash >>> 9 & 1023) / 1023 * 2 - 1;
  const r = Math.sqrt(Math.max(0, 1 - z * z));
  target.set(Math.cos(angle) * r, Math.sin(angle) * r, z).normalize();
  return target;
}

async function readNbimHeader(file) {
  const headerBuffer = await file.slice(0, 1024).arrayBuffer();
  const dv = new DataView(headerBuffer);
  return {
    magic: dv.getUint32(0, true),
    version: dv.getUint32(4, true),
    manifestOffset: dv.getUint32(8, true),
    manifestLength: dv.getUint32(12, true)
  };
}
async function readNbimManifest(file, header) {
  const manifestBlob = file.slice(header.manifestOffset, header.manifestOffset + header.manifestLength);
  const manifestText = await manifestBlob.text();
  return JSON.parse(manifestText);
}

function ensureRectElement(state) {
  if (state.rectElement) return state.rectElement;
  const rectElement = document.createElement("div");
  rectElement.style.cssText = `
        position: fixed; border: 1px dashed #00aaff;
        background: rgba(0, 170, 255, 0.08); pointer-events: none; z-index: 1000;
    `;
  document.body.appendChild(rectElement);
  state.rectElement = rectElement;
  return rectElement;
}
function updateRectElement(state) {
  const rectElement = ensureRectElement(state);
  rectElement.style.left = `${Math.min(state.startX, state.endX)}px`;
  rectElement.style.top = `${Math.min(state.startY, state.endY)}px`;
  rectElement.style.width = `${Math.abs(state.endX - state.startX)}px`;
  rectElement.style.height = `${Math.abs(state.endY - state.startY)}px`;
}
function createInitialBoxSelectState() {
  return {
    active: false,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    rectElement: null
  };
}
function applyStartBoxSelect(prevState, clientX, clientY) {
  const state = {
    ...prevState,
    active: true,
    startX: clientX,
    startY: clientY,
    endX: clientX,
    endY: clientY
  };
  updateRectElement(state);
  return { state };
}
function applyUpdateBoxSelect(prevState, clientX, clientY) {
  if (!prevState.active) {
    return { state: prevState };
  }
  const state = {
    ...prevState,
    endX: clientX,
    endY: clientY
  };
  updateRectElement(state);
  return { state };
}
function applyCancelBoxSelect(prevState) {
  if (prevState.rectElement) {
    prevState.rectElement.remove();
  }
  return {
    state: {
      ...prevState,
      active: false,
      rectElement: null
    }
  };
}
function applyEndBoxSelect(prevState, canvas, selectByScreenRect) {
  if (!prevState.active) {
    return {
      state: prevState,
      selected: []
    };
  }
  const { state } = applyCancelBoxSelect(prevState);
  const { startX, startY, endX, endY } = prevState;
  const dx = Math.abs(endX - startX);
  const dy = Math.abs(endY - startY);
  if (dx < 5 || dy < 5) {
    return { state, selected: [] };
  }
  const rect = canvas.getBoundingClientRect();
  const x1 = (Math.min(startX, endX) - rect.left) / rect.width * 2 - 1;
  const y1 = -(Math.max(startY, endY) - rect.top) / rect.height * 2 + 1;
  const x2 = (Math.max(startX, endX) - rect.left) / rect.width * 2 - 1;
  const y2 = -(Math.min(startY, endY) - rect.top) / rect.height * 2 + 1;
  return {
    state,
    selected: selectByScreenRect(x1, y1, x2, y2)
  };
}

function getChunkReadCacheKey(chunk) {
  return `${chunk.nbimFileId || "local"}:${chunk.byteOffset || 0}:${chunk.byteLength || 0}`;
}
function hasValidChunkBinaryRange(chunk) {
  return Number.isFinite(chunk?.byteOffset) && Number.isFinite(chunk?.byteLength) && chunk.byteLength > 0;
}
function touchChunkReadCache(cacheOrder, cacheKey) {
  const nextOrder = cacheOrder.filter((key) => key !== cacheKey);
  nextOrder.push(cacheKey);
  return nextOrder;
}
function putChunkReadCache(options) {
  const {
    chunkReadCache,
    chunkReadCacheOrder,
    cacheKey,
    buffer,
    chunkReadCacheSize
  } = options;
  chunkReadCache.set(cacheKey, buffer);
  let nextOrder = touchChunkReadCache(chunkReadCacheOrder, cacheKey);
  while (nextOrder.length > chunkReadCacheSize) {
    const evictKey = nextOrder.shift();
    if (!evictKey) continue;
    chunkReadCache.delete(evictKey);
  }
  return nextOrder;
}
async function readChunkBuffer(options) {
  const {
    chunk,
    nbimFiles,
    chunkReadCache,
    chunkReadCacheOrder,
    chunkReadCacheSize
  } = options;
  const cacheKey = getChunkReadCacheKey(chunk);
  const cached = chunkReadCache.get(cacheKey);
  if (cached) {
    return {
      buffer: cached.slice(0),
      chunkReadCacheOrder: touchChunkReadCache(chunkReadCacheOrder, cacheKey)
    };
  }
  const file = nbimFiles.get(chunk.nbimFileId);
  if (!file) {
    throw new Error(`NBIM file not found for chunk: ${chunk.id}`);
  }
  const buffer = await file.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength).arrayBuffer();
  return {
    buffer,
    chunkReadCacheOrder: putChunkReadCache({
      chunkReadCache,
      chunkReadCacheOrder,
      cacheKey,
      buffer: buffer.slice(0),
      chunkReadCacheSize
    })
  };
}
function enqueueChunkPrefetch(options) {
  const {
    chunkIds,
    chunkPrefetchWindow,
    prefetchQueue,
    prefetchQueueSet,
    prefetchInFlight
  } = options;
  if (chunkPrefetchWindow <= 0) {
    return prefetchQueue;
  }
  const nextQueue = [...prefetchQueue];
  for (const chunkId of chunkIds) {
    if (prefetchQueueSet.has(chunkId)) continue;
    if (prefetchInFlight.has(chunkId)) continue;
    nextQueue.push(chunkId);
    prefetchQueueSet.add(chunkId);
  }
  return nextQueue;
}
function collectPrefetchCandidates(options) {
  const {
    visibleChunks,
    chunkPrefetchWindow,
    prefetchPaused,
    isCameraMoving,
    prefetchRoundRobinCursor,
    chunks,
    processingChunks,
    chunkReadCache,
    getChunkIndex
  } = options;
  if (chunkPrefetchWindow <= 0 || prefetchPaused || isCameraMoving || visibleChunks.length === 0) {
    return {
      chunkIds: [],
      prefetchRoundRobinCursor
    };
  }
  const toPrefetch = [];
  for (let index = 0; index < visibleChunks.length && toPrefetch.length < chunkPrefetchWindow; index++) {
    const pivot = visibleChunks[(prefetchRoundRobinCursor + index) % visibleChunks.length];
    const pivotIndex = getChunkIndex(pivot.id);
    if (pivotIndex < 0) continue;
    const nextChunk = chunks[pivotIndex + 1];
    if (!nextChunk || nextChunk.loaded || processingChunks.has(nextChunk.id)) continue;
    if (!nextChunk.nbimFileId || !hasValidChunkBinaryRange(nextChunk)) continue;
    const cacheKey = getChunkReadCacheKey(nextChunk);
    if (chunkReadCache.has(cacheKey)) continue;
    toPrefetch.push(nextChunk.id);
  }
  return {
    chunkIds: toPrefetch,
    prefetchRoundRobinCursor: prefetchRoundRobinCursor + 1
  };
}

function applyUnloadChunk(options) {
  const { chunk, unregisterOptimizedMeshMapping, cacheChunkMesh, ensureChunkGhost } = options;
  if (!chunk.loaded || !chunk.mesh) {
    return {
      changed: false,
      chunkLoadedCountDelta: 0
    };
  }
  const mesh = chunk.mesh;
  unregisterOptimizedMeshMapping(mesh);
  if (mesh.parent) {
    mesh.parent.remove(mesh);
  }
  cacheChunkMesh(chunk, mesh);
  ensureChunkGhost(chunk);
  chunk.mesh = null;
  chunk.loaded = false;
  return {
    changed: true,
    chunkLoadedCountDelta: -1
  };
}
async function resolveChunkMeshForLoad(options) {
  const {
    chunk,
    sharedMaterial,
    takeCachedChunkMesh,
    yieldToMainThread,
    nbimFiles,
    hasValidChunkBinaryRange,
    readChunkBuffer,
    nbimMeta,
    runWorkerTask,
    reconstructBatchedMesh,
    isCameraMoving,
    chunkPrefetchWindow,
    getChunkIndex,
    chunks,
    processingChunks
  } = options;
  const cachedMesh = takeCachedChunkMesh(chunk.id);
  if (cachedMesh) {
    return { mesh: cachedMesh, prefetchCandidates: [] };
  }
  if (chunk.node) {
    const mesh = await createBatchedMeshFromItemsAsync(chunk.node.items, sharedMaterial, {
      batchSize: 1200,
      yieldControl: () => yieldToMainThread()
    });
    return { mesh, prefetchCandidates: [] };
  }
  if (chunk.nbimFileId && nbimFiles.has(chunk.nbimFileId) && hasValidChunkBinaryRange(chunk)) {
    const buffer = await readChunkBuffer(chunk);
    const meta = nbimMeta.get(chunk.nbimFileId);
    const version = meta?.version ?? 8;
    if (version !== 8) {
      throw new Error(`Unsupported NBIM version: ${version}. Only V8 is supported.`);
    }
    const workerResult = await runWorkerTask({
      buffer,
      version,
      originalUuid: chunk.originalUuid,
      bimIdTable: meta?.bimIdTable
    }, [buffer]);
    const mesh = reconstructBatchedMesh(workerResult, sharedMaterial);
    const prefetchCandidates = [];
    if (!isCameraMoving && chunkPrefetchWindow > 0) {
      const chunkIndex = getChunkIndex(chunk.id);
      if (chunkIndex >= 0) {
        for (let i = 1; i <= chunkPrefetchWindow; i++) {
          const next = chunks[chunkIndex + i];
          if (!next) break;
          if (next.loaded || processingChunks.has(next.id)) continue;
          if (!next.nbimFileId || !hasValidChunkBinaryRange(next)) continue;
          prefetchCandidates.push(next.id);
        }
      }
    }
    return { mesh, prefetchCandidates };
  }
  return { mesh: null, prefetchCandidates: [] };
}
function attachLoadedChunkMesh(options) {
  const {
    chunk,
    mesh,
    cancelledChunkIds,
    chunkIdSet,
    disposeChunkMesh,
    globalOffset,
    contentGroup,
    registerOptimizedMeshMapping
  } = options;
  if (cancelledChunkIds.has(chunk.id) || !chunkIdSet.has(chunk.id)) {
    disposeChunkMesh(mesh);
    return { attached: false };
  }
  mesh.name = chunk.id;
  mesh.userData.chunkId = chunk.id;
  mesh.userData.originalUuid = chunk.originalUuid;
  if (chunk.nbimFileId) {
    mesh.position.sub(globalOffset);
    mesh.updateMatrixWorld(true);
  }
  let optimizedGroup = contentGroup.getObjectByName(chunk.groupName);
  if (!optimizedGroup) {
    optimizedGroup = new THREE.Group();
    optimizedGroup.name = chunk.groupName;
    optimizedGroup.userData.isOptimizedGroup = true;
    optimizedGroup.userData.originalUuid = chunk.originalUuid;
    contentGroup.add(optimizedGroup);
  }
  optimizedGroup.add(mesh);
  chunk.mesh = mesh;
  registerOptimizedMeshMapping(mesh);
  return { attached: true };
}
function finalizeLoadedChunk(options) {
  const {
    chunk,
    loadedNow,
    now,
    chunkLoadedCount,
    chunkWarmupActive,
    initialChunkLoadTarget,
    deactivateFastPreviewForModel
  } = options;
  let nextChunkLoadedCount = chunkLoadedCount;
  let nextChunkWarmupActive = chunkWarmupActive;
  let progressChanged = false;
  if (loadedNow && !chunk.loaded) {
    chunk.loaded = true;
    nextChunkLoadedCount++;
    chunk.lastVisibleAt = now;
    chunk.lastFocusAt = now;
    if (chunk.originalUuid) {
      deactivateFastPreviewForModel(chunk.originalUuid);
    }
    if (nextChunkWarmupActive && nextChunkLoadedCount >= initialChunkLoadTarget) {
      nextChunkWarmupActive = false;
    }
    progressChanged = true;
  }
  return {
    nextChunkLoadedCount,
    nextChunkWarmupActive,
    progressChanged
  };
}
function cleanupChunkGhost(options) {
  const { chunkId, ghostGroup, releaseGhostLine } = options;
  const ghost = ghostGroup.getObjectByName(`ghost_${chunkId}`);
  if (!ghost) {
    return { changed: false };
  }
  ghostGroup.remove(ghost);
  releaseGhostLine(ghost);
  return { changed: true };
}

function selectChunksToUnload(options) {
  const {
    isCameraMoving,
    loadedChunks,
    maxLoadedChunks,
    cameraPos,
    now,
    chunkResidencyMs
  } = options;
  if (isCameraMoving || loadedChunks.length <= maxLoadedChunks) {
    return [];
  }
  const sortedChunks = [...loadedChunks].sort(
    (a, b) => b.center.distanceToSquared(cameraPos) - a.center.distanceToSquared(cameraPos)
  );
  const targetUnload = sortedChunks.length - maxLoadedChunks;
  const unloadTargets = [];
  for (const chunk of sortedChunks) {
    if (unloadTargets.length >= targetUnload) {
      break;
    }
    const lastTouchedAt = Math.max(chunk.lastVisibleAt || 0, chunk.lastFocusAt || 0);
    if (now - lastTouchedAt < chunkResidencyMs) {
      continue;
    }
    if (!chunk.mesh || !chunk.mesh.visible) {
      unloadTargets.push(chunk);
    }
  }
  return unloadTargets;
}
function planChunkLoads(options) {
  const {
    toLoad,
    now,
    chunkLoadResumeAt,
    maxConcurrentChunkLoads,
    processingChunkCount,
    chunkWarmupActive,
    chunkLoadedCount,
    initialChunkLoadTarget,
    warmupChunkBoost,
    getChunkFrameBudget,
    phase,
    profile
  } = options;
  if (toLoad.length === 0 || now < chunkLoadResumeAt) {
    return [];
  }
  const sortedChunks = [...toLoad].sort((a, b) => b.priority - a.priority);
  const available = maxConcurrentChunkLoads - processingChunkCount;
  if (available <= 0) {
    return [];
  }
  const warmupExtra = chunkWarmupActive && chunkLoadedCount < initialChunkLoadTarget ? warmupChunkBoost : 0;
  const frameBudget = getChunkFrameBudget(phase, profile, warmupExtra);
  const count = Math.min(available, frameBudget, sortedChunks.length);
  return sortedChunks.slice(0, count);
}

function reconstructBatchedMeshFromWorkerData(options) {
  const { data, material, resolveUuidByBimId } = options;
  const { geometries: geoData, instances: instData, originalUuid } = data;
  const hasAnyIndex = geoData.some((geometry) => geometry.index && geometry.index.length > 0);
  const geometries = geoData.map((geometryData) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(geometryData.position, 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(geometryData.normal, 3));
    if (geometryData.index && geometryData.index.length > 0) {
      geometry.setIndex(new THREE.BufferAttribute(geometryData.index, 1));
    } else if (hasAnyIndex) {
      const count = geometryData.position.length / 3;
      const index = new Uint32Array(count);
      for (let i = 0; i < count; i++) {
        index[i] = i;
      }
      geometry.setIndex(new THREE.BufferAttribute(index, 1));
    }
    return geometry;
  });
  let totalVerts = 0;
  let totalIndices = 0;
  geometries.forEach((geometry) => {
    totalVerts += geometry.attributes.position.count;
    if (geometry.index) {
      totalIndices += geometry.index.count;
    }
  });
  const batchedMesh = new THREE.BatchedMesh(instData.length, totalVerts, totalIndices, material);
  batchedMesh.frustumCulled = false;
  batchedMesh.perInstanceFrustumCulling = false;
  const geometryIds = geometries.map((geometry) => batchedMesh.addGeometry(geometry));
  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();
  const batchIdToUuid = /* @__PURE__ */ new Map();
  const batchIdToBimId = /* @__PURE__ */ new Map();
  const batchIdToColor = /* @__PURE__ */ new Map();
  const batchIdToGeometry = /* @__PURE__ */ new Map();
  instData.forEach((instance) => {
    color.setHex(instance.color);
    matrix.fromArray(instance.matrix);
    const instanceId = batchedMesh.addInstance(geometryIds[instance.geoIdx]);
    batchedMesh.setMatrixAt(instanceId, matrix);
    batchedMesh.setColorAt(instanceId, color);
    const geometry = geometries[instance.geoIdx];
    if (!geometry.boundingBox) {
      geometry.computeBoundingBox();
    }
    if (geometry.boundingBox && batchedMesh.setBoundingBoxAt) {
      batchedMesh.setBoundingBoxAt(instanceId, geometry.boundingBox);
    }
    const bimId = instance.bimId;
    batchIdToUuid.set(instanceId, resolveUuidByBimId(originalUuid, bimId));
    batchIdToBimId.set(instanceId, bimId);
    batchIdToColor.set(instanceId, instance.color);
    batchIdToGeometry.set(instanceId, geometry);
  });
  batchedMesh.userData.batchIdToUuid = batchIdToUuid;
  batchedMesh.userData.batchIdToBimId = batchIdToBimId;
  batchedMesh.userData.batchIdToColor = batchIdToColor;
  batchedMesh.userData.batchIdToGeometry = batchIdToGeometry;
  batchedMesh.computeBoundingBox();
  batchedMesh.computeBoundingSphere();
  return batchedMesh;
}

async function processChunkPrefetchQueue(options) {
  const {
    prefetchPaused,
    isCameraMoving,
    prefetchQueue,
    prefetchQueueSet,
    prefetchInFlight,
    maxWorkers,
    getChunkById,
    chunkReadCache,
    readChunkBuffer,
    processQueue
  } = options;
  if (prefetchPaused || isCameraMoving || prefetchQueue.length === 0) {
    return;
  }
  const maxParallel = Math.max(1, Math.min(4, Math.floor(maxWorkers / 2)));
  while (!prefetchPaused && !isCameraMoving && prefetchQueue.length > 0 && prefetchInFlight.size < maxParallel) {
    const chunkId = prefetchQueue.shift();
    if (!chunkId) break;
    prefetchQueueSet.delete(chunkId);
    const chunk = getChunkById(chunkId);
    if (!chunk || !chunk.nbimFileId || !hasValidChunkBinaryRange(chunk)) {
      continue;
    }
    const cacheKey = getChunkReadCacheKey(chunk);
    if (chunkReadCache.has(cacheKey)) {
      continue;
    }
    prefetchInFlight.add(chunkId);
    void readChunkBuffer(chunk).catch((error) => {
      debugWarn("SceneManager/prefetch", `prefetch failed for ${chunkId}`, error);
    }).finally(() => {
      prefetchInFlight.delete(chunkId);
      if (prefetchQueue.length > 0) {
        void processQueue();
      }
    });
  }
}

function disposeChunkMeshResource(options) {
  const { mesh, sharedMaterial } = options;
  if (mesh.geometry) {
    mesh.geometry.dispose();
  }
  if (mesh.material && mesh.material !== sharedMaterial) {
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => material.dispose && material.dispose());
  }
}
function touchChunkMeshCacheOrder(chunkCacheOrder, chunkId) {
  return [...chunkCacheOrder.filter((id) => id !== chunkId), chunkId];
}
function cacheChunkMeshEntry(options) {
  const {
    chunk,
    mesh,
    chunkMeshCache,
    chunkCacheOrder,
    maxCachedChunks,
    disposeChunkMesh
  } = options;
  if (chunkMeshCache.has(chunk.id)) {
    const oldMesh = chunkMeshCache.get(chunk.id);
    if (oldMesh !== mesh) {
      disposeChunkMesh(oldMesh);
    }
  }
  chunkMeshCache.set(chunk.id, mesh);
  let nextChunkCacheOrder = touchChunkMeshCacheOrder(chunkCacheOrder, chunk.id);
  while (nextChunkCacheOrder.length > maxCachedChunks) {
    const evictId = nextChunkCacheOrder.shift();
    if (!evictId) break;
    const cached = chunkMeshCache.get(evictId);
    if (!cached) continue;
    chunkMeshCache.delete(evictId);
    disposeChunkMesh(cached);
  }
  return {
    chunkMeshCache,
    chunkCacheOrder: nextChunkCacheOrder
  };
}
function takeCachedChunkMeshEntry(options) {
  const { chunkId, chunkMeshCache, chunkCacheOrder } = options;
  const mesh = chunkMeshCache.get(chunkId) || null;
  if (!mesh) {
    return {
      mesh: null,
      chunkCacheOrder
    };
  }
  chunkMeshCache.delete(chunkId);
  return {
    mesh,
    chunkCacheOrder: chunkCacheOrder.filter((id) => id !== chunkId)
  };
}
function clearChunkMeshCacheEntries(options) {
  const { chunkMeshCache, chunkCacheOrder, disposeChunkMesh, filter } = options;
  for (const [chunkId, mesh] of chunkMeshCache.entries()) {
    if (filter && !filter(chunkId, mesh)) continue;
    disposeChunkMesh(mesh);
    chunkMeshCache.delete(chunkId);
  }
  return chunkCacheOrder.filter((chunkId) => chunkMeshCache.has(chunkId));
}
function unregisterOptimizedMeshResourceMapping(options) {
  const { mesh, optimizedMapping } = options;
  const batchIdToUuid = mesh.userData.batchIdToUuid;
  if (!batchIdToUuid) return;
  for (const [batchId, originalUuid] of batchIdToUuid.entries()) {
    const mapping = optimizedMapping.get(originalUuid);
    if (!mapping) continue;
    const index = mapping.findIndex((item) => item.mesh === mesh && item.instanceId === batchId);
    if (index !== -1) {
      mapping.splice(index, 1);
    }
    if (mapping.length === 0) {
      optimizedMapping.delete(originalUuid);
    }
  }
}
function registerOptimizedMeshResourceMapping(options) {
  const { mesh, optimizedMapping } = options;
  const batchIdToUuid = mesh.userData.batchIdToUuid;
  const batchIdToColor = mesh.userData.batchIdToColor;
  const batchIdToGeometry = mesh.userData.batchIdToGeometry;
  if (!batchIdToUuid) return;
  for (const [batchId, originalUuid] of batchIdToUuid.entries()) {
    if (!optimizedMapping.has(originalUuid)) {
      optimizedMapping.set(originalUuid, []);
    }
    const originalColor = batchIdToColor?.get(batchId) ?? 16777215;
    const geometry = batchIdToGeometry?.get(batchId);
    optimizedMapping.get(originalUuid).push({
      mesh,
      instanceId: batchId,
      originalColor,
      geometry
    });
  }
}
function acquireGhostLineResource(options) {
  const { ghostMeshPool, ghostEdgesGeometry, ghostMaterial } = options;
  const reused = ghostMeshPool.pop();
  if (reused) {
    reused.visible = true;
    return reused;
  }
  return new THREE.LineSegments(ghostEdgesGeometry, ghostMaterial);
}
function releaseGhostLineResource(options) {
  const { line, ghostMeshPool } = options;
  line.visible = false;
  line.name = "";
  line.scale.set(1, 1, 1);
  line.position.set(0, 0, 0);
  if (line.material instanceof THREE.LineBasicMaterial) {
    line.material.opacity = 0.3;
  }
  ghostMeshPool.push(line);
}
function createGhostLineResource(options) {
  const { name, bounds, acquireGhostLine } = options;
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  bounds.getSize(size);
  bounds.getCenter(center);
  const edges = acquireGhostLine();
  edges.name = name;
  edges.scale.copy(size);
  edges.position.copy(center);
  return edges;
}
function ensureChunkGhostResource(options) {
  const { chunk, ghostGroup, createGhostLine } = options;
  if (ghostGroup.getObjectByName(`ghost_${chunk.id}`)) {
    return;
  }
  const edges = createGhostLine(`ghost_${chunk.id}`, chunk.bounds);
  ghostGroup.add(edges);
}

function queueChunkWorkerTask(options) {
  const { workerQueue, data, transferables, processQueue } = options;
  return new Promise((resolve, reject) => {
    workerQueue.push({ resolve, reject, data, transferables });
    processQueue();
  });
}
function processChunkWorkerQueue(options) {
  const {
    activeWorkerCount,
    maxWorkers,
    workerQueue,
    workers,
    createWorker,
    getActiveWorkerCount,
    onActiveWorkerCountChange,
    processQueue
  } = options;
  if (activeWorkerCount >= maxWorkers || workerQueue.length === 0) {
    return;
  }
  const task = workerQueue.shift();
  onActiveWorkerCountChange(activeWorkerCount + 1);
  const worker = workers.pop() ?? createWorker();
  const onMessage = (event) => {
    worker.removeEventListener("message", onMessage);
    worker.removeEventListener("error", onError);
    workers.push(worker);
    onActiveWorkerCountChange(Math.max(0, getActiveWorkerCount() - 1));
    if (event.data.type === "success") {
      task.resolve(event.data.result);
    } else {
      task.reject(new Error(event.data.error));
    }
    processQueue();
  };
  const onError = (event) => {
    worker.removeEventListener("message", onMessage);
    worker.removeEventListener("error", onError);
    onActiveWorkerCountChange(Math.max(0, getActiveWorkerCount() - 1));
    task.reject(new Error(event.message));
    processQueue();
  };
  worker.addEventListener("message", onMessage);
  worker.addEventListener("error", onError);
  worker.postMessage(task.data, task.transferables);
}
function disposeChunkWorkerPool(options) {
  const { workers, workerQueue, rejectReason } = options;
  for (const worker of workers) {
    try {
      worker.terminate();
    } catch (error) {
      console.warn("Worker terminate failed:", error);
    }
  }
  if (workerQueue.length > 0) {
    const pending = workerQueue.splice(0, workerQueue.length);
    pending.forEach((task) => task.reject(new Error(rejectReason)));
  }
}

function ensureChunkSpatialState(options) {
  const { chunk, padding, tempSize } = options;
  if (!chunk.paddedBounds || chunk._padding !== padding) {
    const size = chunk.bounds.getSize(tempSize);
    const paddedBounds = chunk.bounds.clone();
    paddedBounds.expandByVector(size.multiplyScalar(padding));
    chunk.paddedBounds = paddedBounds;
    chunk._padding = padding;
  }
  if (!chunk.center) {
    chunk.center = chunk.bounds.getCenter(new THREE.Vector3());
  }
}
function evaluateChunkVisibility(options) {
  const {
    chunk,
    chunkIndex,
    totalChunks,
    now,
    phase,
    profile,
    performanceMode,
    isBoxClipped,
    maxRenderDistance,
    cameraPos,
    cameraForward,
    projScreenMatrix,
    toChunkDirection,
    tempCenterNdc,
    viewHeight,
    canvasHeight,
    sampleUnloadedWhileMoving,
    movingSampleStride,
    movingSampleSeed,
    resolveShouldRefreshPeripheral,
    chunkWarmupActive,
    chunkLoadedCount,
    initialChunkLoadTarget,
    chunkLoadResumeAt,
    chunkMeshCached
  } = options;
  toChunkDirection.copy(chunk.center).sub(cameraPos);
  const dist = toChunkDirection.length();
  const inRange = dist < maxRenderDistance;
  if (sampleUnloadedWhileMoving && !chunk.loaded && chunkIndex % movingSampleStride !== movingSampleSeed) {
    return {
      shouldSkipSample: true,
      shouldBeVisible: false,
      effectiveVisible: false,
      isPeripheralWhileMoving: false,
      shouldRefreshPeripheral: true,
      centerPriorityWindow: false,
      isPeripheralCandidate: false,
      priority: null,
      dist,
      centrality: 0,
      forwardness: 0,
      pixelSize: 0
    };
  }
  const boxSize = chunk.bounds.getSize(new THREE.Vector3()).length();
  const pixelSize = boxSize / viewHeight * canvasHeight;
  const centerNdc = tempCenterNdc.copy(chunk.center).applyMatrix4(projScreenMatrix);
  const ndcDistance = Math.sqrt(centerNdc.x * centerNdc.x + centerNdc.y * centerNdc.y);
  const centrality = 1 - Math.min(1, ndcDistance);
  const forwardness = dist > 1e-5 ? Math.max(0, cameraForward.dot(toChunkDirection.divideScalar(dist))) : 1;
  const isTooSmall = pixelSize < 4;
  const shouldHidePeripheralWhileMoving = phase === "moving" && centrality < profile.movingFocusCentralityThreshold && pixelSize < profile.movingFocusPixelThreshold;
  const shouldBeVisible = options.inFrustum && !isBoxClipped && inRange && !isTooSmall && !shouldHidePeripheralWhileMoving;
  const lastTouchedAt = Math.max(chunk.lastVisibleAt || 0, chunk.lastFocusAt || 0);
  const shouldKeepVisibleWhileMoving = phase === "moving" && options.inFrustum && !isBoxClipped && inRange && !isTooSmall && now - lastTouchedAt < profile.chunkVisibilityHoldMs;
  const isPeripheralWhileMoving = centrality < profile.movingCoreCentralityThreshold && pixelSize < profile.movingCorePixelThreshold && forwardness < profile.movingCoreForwardThreshold;
  const shouldRefreshPeripheral = resolveShouldRefreshPeripheral(isPeripheralWhileMoving);
  const effectiveVisible = phase === "moving" && isPeripheralWhileMoving && !shouldRefreshPeripheral ? chunk.lastEffectiveVisible ?? chunk.mesh?.visible ?? false : shouldBeVisible || shouldKeepVisibleWhileMoving;
  const centerPriorityWindow = chunkWarmupActive || now < chunkLoadResumeAt + profile.centerPriorityWindowMs;
  const isPeripheralCandidate = centrality < profile.centerPriorityThreshold && forwardness < profile.forwardPriorityThreshold && pixelSize < 96;
  let priority = null;
  if (!chunk.loaded && shouldBeVisible) {
    const viewportBoost = centrality > 0.8 ? 4.5 : centrality > 0.62 ? 2.8 : 1;
    const sizeScore = Math.min(8, pixelSize / 120);
    const distanceScore = 1e3 / (dist + 1);
    const forwardScore = forwardness * 550;
    const cacheBoost = chunkMeshCached ? 420 : 0;
    const warmupBoost = chunkWarmupActive && chunkLoadedCount < initialChunkLoadTarget ? centrality > 0.65 ? 1500 : centrality > 0.45 ? 500 : 0 : 0;
    const movingPriorityBoost = phase === "moving" ? centrality > 0.65 || forwardness > 0.7 ? 900 : centrality > 0.4 ? 250 : -250 : 0;
    const shouldSkipForPriority = phase === "moving" && centrality < 0.08 && pixelSize < 18 || phase === "moving" && isPeripheralWhileMoving && !shouldRefreshPeripheral || phase !== "moving" && centerPriorityWindow && isPeripheralCandidate || phase === "moving" && performanceMode === "smooth" && centrality < 0.3 && pixelSize < 54 && forwardness < 0.62;
    if (!shouldSkipForPriority) {
      priority = movingPriorityBoost + cacheBoost + warmupBoost + forwardScore + viewportBoost * 1e3 + sizeScore * 120 + distanceScore + centrality * 300;
    }
  }
  return {
    shouldSkipSample: false,
    shouldBeVisible,
    effectiveVisible,
    isPeripheralWhileMoving,
    shouldRefreshPeripheral,
    centerPriorityWindow,
    isPeripheralCandidate,
    priority,
    dist,
    centrality,
    forwardness,
    pixelSize
  };
}

function reportChunkProgressIfNeeded(options) {
  const { now, total, loaded, lastReportedProgress, lastChunkProgressReportAt } = options;
  const changed = loaded !== lastReportedProgress.loaded || total !== lastReportedProgress.total;
  const shouldFlush = total === 0 || total > 0 && loaded >= total;
  const intervalReached = now - lastChunkProgressReportAt >= 48;
  return {
    shouldNotify: changed && (intervalReached || shouldFlush),
    nextProgress: { loaded, total },
    nextReportedAt: shouldFlush || intervalReached ? now : lastChunkProgressReportAt
  };
}
function selectChunkRuntimeProfile(options) {
  const { chunkCount, compact, balanced, massive } = options;
  if (chunkCount > 2e3) return massive;
  if (chunkCount > 600) return balanced;
  return compact;
}
function computeChunkFrameBudget(options) {
  const {
    forceMaxChunkLoadSpeed,
    maxChunkLoadsPerFrame,
    performanceMode,
    chunkCount,
    phase,
    profile,
    warmupExtra
  } = options;
  if (forceMaxChunkLoadSpeed) {
    return maxChunkLoadsPerFrame + warmupExtra;
  }
  const isHugeScene = chunkCount > 2e3;
  const isLargeScene = chunkCount > 600;
  if (phase === "moving") {
    const baseMovingBudget = Math.max(
      profile.movingLoadBudgetMin,
      Math.min(profile.movingLoadBudgetMax, Math.floor(maxChunkLoadsPerFrame / 4))
    );
    if (performanceMode === "smooth") {
      if (isHugeScene) return Math.max(1, Math.floor(baseMovingBudget * 0.35));
      if (isLargeScene) return Math.max(1, Math.floor(baseMovingBudget * 0.5));
      return Math.max(1, Math.floor(baseMovingBudget * 0.7));
    }
    if (isHugeScene) return Math.max(1, Math.floor(baseMovingBudget * 0.55));
    if (isLargeScene) return Math.max(1, Math.floor(baseMovingBudget * 0.75));
    return baseMovingBudget;
  }
  if (phase === "recovery") {
    const recoveryBudget = Math.max(
      profile.recoveryLoadBudgetMin,
      Math.min(
        profile.recoveryLoadBudgetMax,
        Math.floor(maxChunkLoadsPerFrame * profile.recoveryLoadBudgetRatio)
      )
    );
    const recoveryBoost = performanceMode === "smooth" ? Math.max(2, Math.floor(recoveryBudget * 0.6)) : 0;
    return recoveryBudget + recoveryBoost + warmupExtra;
  }
  return maxChunkLoadsPerFrame + warmupExtra;
}
function isMovingPeripheralChunk(options) {
  const { centrality, pixelSize, forwardness, profile } = options;
  return centrality < profile.movingCoreCentralityThreshold && pixelSize < profile.movingCorePixelThreshold && forwardness < profile.movingCoreForwardThreshold;
}
function updatePeripheralRefreshWindow(options) {
  const {
    now,
    isCameraMoving,
    chunkIndex,
    totalChunks,
    profile,
    movingPeripheralCursor,
    movingPeripheralLastRefreshAt
  } = options;
  if (!isCameraMoving || totalChunks === 0) {
    return {
      shouldRefresh: true,
      movingPeripheralCursor,
      movingPeripheralLastRefreshAt
    };
  }
  let nextCursor = movingPeripheralCursor;
  let nextLastRefreshAt = movingPeripheralLastRefreshAt;
  if (now - nextLastRefreshAt >= profile.movingPeripheralRefreshMs) {
    const batchSize2 = Math.min(
      totalChunks,
      Math.max(profile.movingPeripheralMinBatchSize, Math.ceil(totalChunks * profile.movingPeripheralBatchRatio))
    );
    nextCursor = (nextCursor + batchSize2) % totalChunks;
    nextLastRefreshAt = now;
  }
  const batchSize = Math.min(
    totalChunks,
    Math.max(profile.movingPeripheralMinBatchSize, Math.ceil(totalChunks * profile.movingPeripheralBatchRatio))
  );
  const start = nextCursor;
  const end = start + batchSize;
  const shouldRefresh = end <= totalChunks ? chunkIndex >= start && chunkIndex < end : chunkIndex >= start || chunkIndex < end % totalChunks;
  return {
    shouldRefresh,
    movingPeripheralCursor: nextCursor,
    movingPeripheralLastRefreshAt: nextLastRefreshAt
  };
}

const CLIP_HELPER_COLORS = [16711680, 16711680, 65280, 65280, 255, 255];
function clonePlanes(planes) {
  return planes.map((plane) => plane.clone());
}
function updatePlaneHelper(helper, normal, position, width, height, isEnabled, clipHelperVisible) {
  if (!helper) return;
  const helperVisible = isEnabled && clipHelperVisible;
  helper.visible = helperVisible;
  helper.scale.set(Math.max(width, 1e-3), Math.max(height, 1e-3), 1);
  helper.position.copy(position);
  helper.lookAt(position.clone().add(normal));
  helper.children.forEach((child) => {
    child.visible = helperVisible;
  });
}
function applySetupClipping(context) {
  const clippingPlanes = [
    new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
    new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0),
    new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
    new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
  ];
  context.renderer.clippingPlanes = [];
  context.clipHelpersGroup.clear();
  const clipPlaneHelpers = CLIP_HELPER_COLORS.map((color) => {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: context.state.clipHelperOpacity,
      side: THREE.DoubleSide,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
      clippingPlanes: []
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.visible = false;
    mesh.renderOrder = 9999;
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: Math.min(1, context.state.clipHelperOpacity + 0.08),
      depthWrite: false
    }));
    line.visible = false;
    line.renderOrder = 1e4;
    mesh.add(line);
    context.clipHelpersGroup.add(mesh);
    return mesh;
  });
  return {
    state: {
      ...context.state,
      clippingPlanes,
      clipPlaneHelpers
    },
    needsRender: false
  };
}
function applySetClipHelperOptions(context, options) {
  const state = {
    ...context.state,
    clippingPlanes: clonePlanes(context.state.clippingPlanes),
    clipPlaneHelpers: [...context.state.clipPlaneHelpers],
    clipHelperVisible: typeof options.visible === "boolean" ? options.visible : context.state.clipHelperVisible,
    clipHelperOpacity: typeof options.opacity === "number" && !Number.isNaN(options.opacity) ? THREE.MathUtils.clamp(options.opacity, 0.05, 0.35) : context.state.clipHelperOpacity
  };
  state.clipPlaneHelpers.forEach((helper) => {
    const surfaceMaterial = helper.material;
    surfaceMaterial.opacity = state.clipHelperOpacity;
    surfaceMaterial.needsUpdate = true;
    helper.children.forEach((child) => {
      const lineMaterial = child.material;
      if (!lineMaterial) return;
      lineMaterial.opacity = Math.min(1, state.clipHelperOpacity + 0.08);
      lineMaterial.needsUpdate = true;
    });
  });
  state.clipPlaneHelpers.forEach((helper, index) => {
    const plane = context.state.clippingPlanes[index];
    const isPlaneActive = !!plane && Number.isFinite(plane.constant) && plane.constant !== Infinity;
    const helperVisible = state.clipHelperVisible && context.renderer.clippingPlanes.length > 0 && isPlaneActive;
    helper.visible = helperVisible;
    helper.children.forEach((child) => {
      child.visible = helperVisible;
    });
  });
  return { state, needsRender: true };
}
function applyUpdateClippingPlanes(context, bounds, values, active) {
  if (bounds.isEmpty()) {
    return { state: context.state, needsRender: false };
  }
  const clippingPlanes = clonePlanes(context.state.clippingPlanes);
  const clipPlaneHelpers = [...context.state.clipPlaneHelpers];
  const state = { ...context.state, clippingPlanes, clipPlaneHelpers };
  const { min, max } = bounds;
  const size = max.clone().sub(min);
  const xMin = min.x + values.x[0] / 100 * size.x;
  const xMax = min.x + values.x[1] / 100 * size.x;
  const yMin = min.y + values.y[0] / 100 * size.y;
  const yMax = min.y + values.y[1] / 100 * size.y;
  const zMin = min.z + values.z[0] / 100 * size.z;
  const zMax = min.z + values.z[1] / 100 * size.z;
  const isEnabled = context.renderer.clippingPlanes.length > 0;
  const clippedBoxMin = new THREE.Vector3(
    active.x ? xMin : min.x,
    active.y ? yMin : min.y,
    active.z ? zMin : min.z
  );
  const clippedBoxMax = new THREE.Vector3(
    active.x ? xMax : max.x,
    active.y ? yMax : max.y,
    active.z ? zMax : max.z
  );
  const clippedCenter = clippedBoxMin.clone().add(clippedBoxMax).multiplyScalar(0.5);
  const clippedSize = clippedBoxMax.clone().sub(clippedBoxMin);
  const epsilon = 5e-4;
  if (active.x) {
    clippingPlanes[0].constant = -xMin;
    clippingPlanes[1].constant = xMax;
    updatePlaneHelper(
      clipPlaneHelpers[0],
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(xMin + epsilon, clippedCenter.y, clippedCenter.z),
      clippedSize.z,
      clippedSize.y,
      isEnabled,
      state.clipHelperVisible
    );
    updatePlaneHelper(
      clipPlaneHelpers[1],
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(xMax - epsilon, clippedCenter.y, clippedCenter.z),
      clippedSize.z,
      clippedSize.y,
      isEnabled,
      state.clipHelperVisible
    );
  } else {
    clippingPlanes[0].constant = Infinity;
    clippingPlanes[1].constant = Infinity;
    if (clipPlaneHelpers[0]) clipPlaneHelpers[0].visible = false;
    if (clipPlaneHelpers[1]) clipPlaneHelpers[1].visible = false;
  }
  if (active.y) {
    clippingPlanes[2].constant = -yMin;
    clippingPlanes[3].constant = yMax;
    updatePlaneHelper(
      clipPlaneHelpers[2],
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(clippedCenter.x, yMin + epsilon, clippedCenter.z),
      clippedSize.x,
      clippedSize.z,
      isEnabled,
      state.clipHelperVisible
    );
    updatePlaneHelper(
      clipPlaneHelpers[3],
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(clippedCenter.x, yMax - epsilon, clippedCenter.z),
      clippedSize.x,
      clippedSize.z,
      isEnabled,
      state.clipHelperVisible
    );
  } else {
    clippingPlanes[2].constant = Infinity;
    clippingPlanes[3].constant = Infinity;
    if (clipPlaneHelpers[2]) clipPlaneHelpers[2].visible = false;
    if (clipPlaneHelpers[3]) clipPlaneHelpers[3].visible = false;
  }
  if (active.z) {
    clippingPlanes[4].constant = -zMin;
    clippingPlanes[5].constant = zMax;
    updatePlaneHelper(
      clipPlaneHelpers[4],
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(clippedCenter.x, clippedCenter.y, zMin + epsilon),
      clippedSize.x,
      clippedSize.y,
      isEnabled,
      state.clipHelperVisible
    );
    updatePlaneHelper(
      clipPlaneHelpers[5],
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(clippedCenter.x, clippedCenter.y, zMax - epsilon),
      clippedSize.x,
      clippedSize.y,
      isEnabled,
      state.clipHelperVisible
    );
  } else {
    clippingPlanes[4].constant = Infinity;
    clippingPlanes[5].constant = Infinity;
    if (clipPlaneHelpers[4]) clipPlaneHelpers[4].visible = false;
    if (clipPlaneHelpers[5]) clipPlaneHelpers[5].visible = false;
  }
  return { state, needsRender: true };
}
function isBoxClippedByPlanes(planes, box) {
  for (const plane of planes) {
    if (plane.constant === Infinity) continue;
    const planeNormal = plane.normal;
    const maxPoint = new THREE.Vector3(
      planeNormal.x > 0 ? box.max.x : box.min.x,
      planeNormal.y > 0 ? box.max.y : box.min.y,
      planeNormal.z > 0 ? box.max.z : box.min.z
    );
    if (plane.distanceToPoint(maxPoint) < 0) {
      return true;
    }
  }
  return false;
}

function disposeGeometryAndMaterial(object) {
  object.geometry?.dispose?.();
  const materials = object.material ? Array.isArray(object.material) ? object.material : [object.material] : [];
  materials.forEach((material) => material?.dispose?.());
}
function disposeSceneManagerResources(context) {
  context.cancelDeferredStructureBuild();
  context.clearLocateFocus();
  if (context.animationFrameId !== null) {
    cancelAnimationFrame(context.animationFrameId);
  }
  context.onAnimationFrameDisposed();
  if (context.logicTimer) {
    clearInterval(context.logicTimer);
  }
  disposeChunkWorkerPool({
    workers: context.workers,
    workerQueue: context.workerQueue,
    rejectReason: "SceneManager disposed"
  });
  context.onWorkersDisposed();
  context.onQueuesReset();
  context.onStateCachesReset();
  context.clearChunkCache();
  while (context.ghostGroup.children.length > 0) {
    const ghost = context.ghostGroup.children[0];
    context.ghostGroup.remove(ghost);
    context.releaseGhostLine(ghost);
  }
  context.controls.dispose();
  disposeGeometryAndMaterial(context.selectionBox);
  disposeGeometryAndMaterial(context.highlightMesh);
  disposeGeometryAndMaterial(context.tempMarker);
  context.dotTexture.dispose();
  context.sharedMaterial.dispose();
  context.ghostEdgesGeometry.dispose();
  context.ghostMaterial.dispose();
  context.renderer.dispose();
}

function resolveWorldMatrix(mesh, instanceId) {
  const matrix = new THREE.Matrix4();
  if (instanceId !== void 0 && mesh.isInstancedMesh) {
    mesh.getMatrixAt(instanceId, matrix);
    return matrix;
  }
  return matrix.copy(mesh.matrixWorld);
}
function computeGeometryVolume(geometry, mesh, instanceId) {
  const position = geometry.attributes.position;
  const index = geometry.index;
  const worldMatrix = resolveWorldMatrix(mesh, instanceId);
  const vertexA = new THREE.Vector3();
  const vertexB = new THREE.Vector3();
  const vertexC = new THREE.Vector3();
  const cross = new THREE.Vector3();
  let volume = 0;
  if (index) {
    for (let i = 0; i < index.count; i += 3) {
      vertexA.fromBufferAttribute(position, index.getX(i)).applyMatrix4(worldMatrix);
      vertexB.fromBufferAttribute(position, index.getX(i + 1)).applyMatrix4(worldMatrix);
      vertexC.fromBufferAttribute(position, index.getX(i + 2)).applyMatrix4(worldMatrix);
      volume += vertexA.dot(cross.crossVectors(vertexB, vertexC)) / 6;
    }
  } else {
    for (let i = 0; i < position.count; i += 3) {
      vertexA.fromBufferAttribute(position, i).applyMatrix4(worldMatrix);
      vertexB.fromBufferAttribute(position, i + 1).applyMatrix4(worldMatrix);
      vertexC.fromBufferAttribute(position, i + 2).applyMatrix4(worldMatrix);
      volume += vertexA.dot(cross.crossVectors(vertexB, vertexC)) / 6;
    }
  }
  return Math.abs(volume);
}
function computeGeometryArea(geometry, mesh, instanceId) {
  const position = geometry.attributes.position;
  const index = geometry.index;
  const worldMatrix = resolveWorldMatrix(mesh, instanceId);
  const vertexA = new THREE.Vector3();
  const vertexB = new THREE.Vector3();
  const vertexC = new THREE.Vector3();
  const edgeAB = new THREE.Vector3();
  const edgeAC = new THREE.Vector3();
  let area = 0;
  if (index) {
    for (let i = 0; i < index.count; i += 3) {
      vertexA.fromBufferAttribute(position, index.getX(i)).applyMatrix4(worldMatrix);
      vertexB.fromBufferAttribute(position, index.getX(i + 1)).applyMatrix4(worldMatrix);
      vertexC.fromBufferAttribute(position, index.getX(i + 2)).applyMatrix4(worldMatrix);
      area += edgeAB.subVectors(vertexB, vertexA).cross(edgeAC.subVectors(vertexC, vertexA)).length() / 2;
    }
  } else {
    for (let i = 0; i < position.count; i += 3) {
      vertexA.fromBufferAttribute(position, i).applyMatrix4(worldMatrix);
      vertexB.fromBufferAttribute(position, i + 1).applyMatrix4(worldMatrix);
      vertexC.fromBufferAttribute(position, i + 2).applyMatrix4(worldMatrix);
      area += edgeAB.subVectors(vertexB, vertexA).cross(edgeAC.subVectors(vertexC, vertexA)).length() / 2;
    }
  }
  return area;
}
function getObjectGeometryDataFromScene(options) {
  const { uuid, optimizedMapping, contentGroup } = options;
  let area = 0;
  let volume = 0;
  const mappings = optimizedMapping.get(uuid);
  if (mappings && mappings.length > 0) {
    mappings.forEach((mapping) => {
      if (!mapping.geometry) return;
      area += computeGeometryArea(mapping.geometry, mapping.mesh, mapping.instanceId);
      volume += computeGeometryVolume(mapping.geometry, mapping.mesh, mapping.instanceId);
    });
    return { area, volume };
  }
  const object = contentGroup.getObjectByProperty("uuid", uuid);
  if (object && object.isMesh) {
    const mesh = object;
    if (mesh.geometry) {
      area = computeGeometryArea(mesh.geometry, mesh);
      volume = computeGeometryVolume(mesh.geometry, mesh);
    }
  }
  return { area, volume };
}

function stripFileExtension(name) {
  return name.replace(/\.[^./\\]+$/, "");
}
function sanitizeFileStem(name) {
  const sanitized = name.replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, " ").trim();
  return sanitized || "model";
}

const INVALID_DISPLAY_LABELS = /* @__PURE__ */ new Set(["", "n/a", "na", "undefined", "null", "-", "--"]);
function sanitizeDisplayLabel(...candidates) {
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const trimmed = candidate.trim();
    if (INVALID_DISPLAY_LABELS.has(trimmed.toLowerCase())) continue;
    return trimmed;
  }
  return "";
}
function countStructureRenderableNodes(node) {
  if (!node) return 0;
  let count = node.type === "Mesh" ? 1 : 0;
  if (node.children) {
    for (const child of node.children) {
      count += countStructureRenderableNodes(child);
    }
  }
  return count;
}
function sanitizeStructureUserData(userData) {
  if (!userData || typeof userData !== "object") return void 0;
  const sanitized = {};
  if (userData.originalUuid !== void 0) sanitized.originalUuid = String(userData.originalUuid);
  if (userData.expressID !== void 0) sanitized.expressID = userData.expressID;
  if (userData.modelID !== void 0) sanitized.modelID = userData.modelID;
  return Object.keys(sanitized).length > 0 ? sanitized : void 0;
}
function buildExportStructureTree(structureRoot) {
  const usedIds = /* @__PURE__ */ new Set();
  const assignId = (rawName, fallback) => {
    const base = rawName && rawName.trim() ? rawName.trim() : fallback;
    if (!usedIds.has(base)) {
      usedIds.add(base);
      return base;
    }
    let suffix = 2;
    while (usedIds.has(`${base}_${suffix}`)) suffix++;
    const resolvedId = `${base}_${suffix}`;
    usedIds.add(resolvedId);
    return resolvedId;
  };
  const rootId = assignId(structureRoot?.name, structureRoot?.id ?? "Root");
  const rootCopy = {
    id: rootId,
    name: structureRoot?.name,
    type: structureRoot?.type,
    visible: structureRoot?.visible !== false,
    children: []
  };
  if (structureRoot?.bimId !== void 0) rootCopy.bimId = structureRoot.bimId;
  if (structureRoot?.chunkId !== void 0) rootCopy.chunkId = structureRoot.chunkId;
  const rootUserData = sanitizeStructureUserData(structureRoot?.userData);
  if (rootUserData) rootCopy.userData = rootUserData;
  const stack = [{ src: structureRoot, dst: rootCopy }];
  while (stack.length > 0) {
    const { src, dst } = stack.pop();
    const children = Array.isArray(src?.children) ? src.children : [];
    for (const child of children) {
      const childId = assignId(child?.name, child?.id ?? "Node");
      const childCopy = {
        id: childId,
        name: child?.name,
        type: child?.type,
        visible: child?.visible !== false,
        children: []
      };
      if (child?.bimId !== void 0) childCopy.bimId = child.bimId;
      if (child?.chunkId !== void 0) childCopy.chunkId = child.chunkId;
      const childUserData = sanitizeStructureUserData(child?.userData);
      if (childUserData) childCopy.userData = childUserData;
      dst.children.push(childCopy);
      stack.push({ src: child, dst: childCopy });
    }
  }
  return rootCopy;
}
function encodeNbimManifest(manifest, structureRoot) {
  let manifestString;
  try {
    manifestString = JSON.stringify(manifest);
  } catch {
    manifestString = JSON.stringify({
      globalBounds: manifest.globalBounds,
      chunks: manifest.chunks,
      structureTree: {
        id: structureRoot.id,
        name: structureRoot.name,
        type: structureRoot.type,
        children: structureRoot.children ? [] : []
      },
      bimIdTable: manifest.bimIdTable,
      bimProperties: {}
    });
  }
  return new TextEncoder().encode(manifestString);
}
function deriveDefaultNbimStem(contentGroup) {
  const names = [];
  contentGroup.children.forEach((child) => {
    if (child.userData?.isOptimizedGroup) return;
    if (child.name.startsWith("optimized_")) return;
    const rawName = (typeof child.userData?.modelName === "string" ? child.userData.modelName : "") || (child.children?.[0]?.name || "") || child.name;
    const baseName = sanitizeFileStem(stripFileExtension(rawName));
    names.push(baseName);
  });
  const uniqueNames = Array.from(new Set(names));
  if (uniqueNames.length === 1) return uniqueNames[0];
  const now = /* @__PURE__ */ new Date();
  const pad = (value) => String(value).padStart(2, "0");
  const suffix = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `批量导出_${suffix}`;
}
function groupNbimPropertiesByOwner(manifestBimProperties, rootId) {
  const propertyKeys = Object.keys(manifestBimProperties);
  const ownerSet = /* @__PURE__ */ new Set();
  propertyKeys.forEach((key) => {
    const separatorIndex = key.indexOf("::");
    if (separatorIndex > 0) ownerSet.add(key.slice(0, separatorIndex));
  });
  const defaultOwner = ownerSet.size === 1 ? [...ownerSet][0] : rootId;
  const grouped = /* @__PURE__ */ new Map();
  if (ownerSet.size >= 1) {
    if (ownerSet.size === 1) {
      grouped.set(defaultOwner, manifestBimProperties);
    } else {
      propertyKeys.forEach((key) => {
        const separatorIndex = key.indexOf("::");
        const owner = separatorIndex > 0 ? key.slice(0, separatorIndex) : rootId;
        if (!grouped.has(owner)) grouped.set(owner, {});
        grouped.get(owner)[key] = manifestBimProperties[key];
      });
    }
  } else {
    grouped.set(rootId, manifestBimProperties);
  }
  return {
    defaultOwner,
    grouped
  };
}
function createNbimContainerGroup(options) {
  const { fileName, modelRootName, rootId } = options;
  const fileGroup = new THREE.Group();
  fileGroup.name = `file_${rootId}`;
  fileGroup.userData.originalUuid = rootId;
  const fileBaseName = sanitizeFileStem(stripFileExtension(fileName));
  fileGroup.userData.modelName = sanitizeFileStem(
    sanitizeDisplayLabel(modelRootName && modelRootName !== "Root" ? modelRootName : "", fileBaseName, rootId) || fileBaseName
  );
  return fileGroup;
}
function collectIfcModelReferences(contentGroup) {
  const ifcApiByModel = /* @__PURE__ */ new Map();
  const ifcManagerByModel = /* @__PURE__ */ new Map();
  contentGroup.traverse((object) => {
    if (object.userData?.ifcAPI && object.userData?.modelID !== void 0 && object.userData?.originalUuid) {
      ifcApiByModel.set(String(object.userData.originalUuid), {
        ifcApi: object.userData.ifcAPI,
        modelID: object.userData.modelID
      });
    }
    if (object.userData?.ifcManager && object.userData?.modelID !== void 0 && object.userData?.originalUuid) {
      ifcManagerByModel.set(String(object.userData.originalUuid), {
        ifcManager: object.userData.ifcManager,
        modelID: object.userData.modelID
      });
    }
  });
  return {
    ifcApiByModel,
    ifcManagerByModel
  };
}
async function collectNbimBimProperties(options) {
  const { structureRoot, ifcApiByModel, ifcManagerByModel } = options;
  const bimProperties = {};
  const stack = [structureRoot];
  while (stack.length > 0) {
    const node = stack.pop();
    const originalUuid = node.userData?.originalUuid ? String(node.userData.originalUuid) : "";
    if (node.bimId) {
      const key = `${originalUuid}::${node.bimId}`;
      if (!bimProperties[key]) {
        bimProperties[key] = { uuid: node.id, name: node.name };
        const expressID = node.userData?.expressID;
        if (expressID !== void 0 && ifcApiByModel.has(originalUuid)) {
          try {
            const { ifcApi, modelID } = ifcApiByModel.get(originalUuid);
            const entity = ifcApi.GetLine(modelID, Number(expressID));
            if (entity) {
              bimProperties[key].ifcType = entity.is_a || "";
              bimProperties[key].globalId = entity.GlobalId?.value || "";
              bimProperties[key].ifcName = entity.Name?.value || "";
            }
          } catch {
          }
        }
        if (expressID !== void 0 && ifcManagerByModel.has(originalUuid)) {
          try {
            const { ifcManager, modelID } = ifcManagerByModel.get(originalUuid);
            const fullProps = await ifcManager.getItemProperties(modelID, Number(expressID));
            const rawGroups = fullProps?.rawGroups || fullProps?.groups || null;
            const normalizedGroups = fullProps?.normalizedGroups || null;
            if (rawGroups && Object.keys(rawGroups).length > 0) {
              bimProperties[key].ifcRawGroups = rawGroups;
            }
            if (normalizedGroups && Object.keys(normalizedGroups).length > 0) {
              bimProperties[key].ifcNormalizedGroups = normalizedGroups;
            }
          } catch {
          }
        }
      }
    }
    if (node.children && node.children.length > 0) {
      for (let index = node.children.length - 1; index >= 0; index--) {
        stack.push(node.children[index]);
      }
    }
  }
  return bimProperties;
}
function decodeChunkBinaryV8(buffer, bimIdTable) {
  const dataView = new DataView(buffer);
  let offset = 0;
  const geometryCount = dataView.getUint32(offset, true);
  offset += 4;
  const geometries = [];
  for (let i = 0; i < geometryCount; i++) {
    const vertexCount = dataView.getUint32(offset, true);
    offset += 4;
    const indexCount = dataView.getUint32(offset, true);
    offset += 4;
    const positions = new Float32Array(buffer, offset, vertexCount * 3);
    offset += vertexCount * 12;
    const normals = new Float32Array(buffer, offset, vertexCount * 3);
    offset += vertexCount * 12;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), 3));
    if (indexCount > 0) {
      const indices = new Uint32Array(buffer, offset, indexCount);
      offset += indexCount * 4;
      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
    }
    geometries.push(geometry);
  }
  const instanceCount = dataView.getUint32(offset, true);
  offset += 4;
  const matrix = new THREE.Matrix4();
  const instances = [];
  for (let i = 0; i < instanceCount; i++) {
    const bimIdIndex = dataView.getUint32(offset, true);
    offset += 4;
    const typeIndex = dataView.getUint32(offset, true);
    offset += 4;
    const color = dataView.getUint32(offset, true);
    offset += 4;
    for (let elementIndex = 0; elementIndex < 16; elementIndex++) {
      matrix.elements[elementIndex] = dataView.getFloat32(offset, true);
      offset += 4;
    }
    const geometryIndex = dataView.getUint32(offset, true);
    offset += 4;
    instances.push({
      bimId: bimIdTable[bimIdIndex] ?? String(bimIdIndex),
      typeIndex,
      color,
      matrix: matrix.clone(),
      geometry: geometries[geometryIndex]
    });
  }
  return instances;
}
async function prepareNbimExportChunks(options) {
  const {
    chunks,
    nbimFiles,
    nbimMeta,
    bimIdToIndex,
    hasValidChunkBinaryRange,
    generateChunkBinaryV8
  } = options;
  const chunkBlobs = [];
  const exportChunks = chunks.map((chunk) => ({
    id: chunk.id,
    bounds: {
      min: { x: chunk.bounds.min.x, y: chunk.bounds.min.y, z: chunk.bounds.min.z },
      max: { x: chunk.bounds.max.x, y: chunk.bounds.max.y, z: chunk.bounds.max.z }
    },
    originalUuid: chunk.originalUuid ? String(chunk.originalUuid) : void 0,
    byteOffset: 0,
    byteLength: 0
  }));
  let currentOffset = 1024;
  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index];
    const exportChunk = exportChunks[index];
    let buffer = null;
    if (chunk.node) {
      buffer = generateChunkBinaryV8(chunk.node.items, bimIdToIndex);
    } else if (chunk.nbimFileId && nbimFiles.has(chunk.nbimFileId) && hasValidChunkBinaryRange(chunk)) {
      const file = nbimFiles.get(chunk.nbimFileId);
      const raw = await file.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength).arrayBuffer();
      const meta = nbimMeta.get(chunk.nbimFileId);
      const version = meta?.version ?? 8;
      if (version !== 8) {
        throw new Error(`Unsupported NBIM version: ${version}. Only V8 is supported.`);
      }
      const instances = decodeChunkBinaryV8(raw, meta?.bimIdTable || []);
      const items = instances.map((instance) => ({
        uuid: "",
        bimId: instance.bimId,
        typeIndex: instance.typeIndex,
        color: instance.color,
        matrix: instance.matrix,
        geometry: instance.geometry
      }));
      buffer = generateChunkBinaryV8(items, bimIdToIndex);
    }
    if (!buffer) {
      continue;
    }
    const uint8 = new Uint8Array(buffer);
    chunkBlobs.push(uint8);
    exportChunk.byteOffset = currentOffset;
    exportChunk.byteLength = uint8.byteLength;
    currentOffset += uint8.byteLength;
  }
  return {
    chunkBlobs,
    exportChunks,
    currentOffset
  };
}

function applyNbimGlobalBounds(options) {
  const { globalBounds, precomputedBounds, sceneBounds, globalOffset } = options;
  if (!globalBounds) {
    return {
      precomputedBounds,
      sceneBounds,
      globalOffset,
      initializedOffset: false
    };
  }
  const newBounds = new THREE.Box3(
    new THREE.Vector3(globalBounds.min.x, globalBounds.min.y, globalBounds.min.z),
    new THREE.Vector3(globalBounds.max.x, globalBounds.max.y, globalBounds.max.z)
  );
  let initializedOffset = false;
  const nextGlobalOffset = globalOffset.clone();
  if (nextGlobalOffset.length() === 0) {
    newBounds.getCenter(nextGlobalOffset);
    initializedOffset = true;
  }
  const nextPrecomputedBounds = precomputedBounds.clone();
  if (nextPrecomputedBounds.isEmpty()) {
    nextPrecomputedBounds.copy(newBounds);
  } else {
    nextPrecomputedBounds.union(newBounds);
  }
  return {
    precomputedBounds: nextPrecomputedBounds,
    sceneBounds: nextPrecomputedBounds.clone(),
    globalOffset: nextGlobalOffset,
    initializedOffset
  };
}
function appendNbimStructure(options) {
  const { structureRoot, modelRoot } = options;
  if (!structureRoot.children) structureRoot.children = [];
  if (!modelRoot) return structureRoot;
  if (modelRoot.children && modelRoot.name === "Root") {
    structureRoot.children.push(...modelRoot.children);
  } else {
    structureRoot.children.push(modelRoot);
  }
  return structureRoot;
}
function buildNbimQuickStats(options) {
  const { manifestStats, modelRoot, chunks } = options;
  return manifestStats || {
    meshes: countStructureRenderableNodes(modelRoot),
    faces: 0,
    memory: parseFloat(((chunks || []).reduce((sum, chunk) => sum + (chunk.byteLength || 0), 0) / (1024 * 1024)).toFixed(2))
  };
}
function populateNbimNodeMappings(options) {
  const { modelRoot, defaultOwner, nodeMap, bimIdToNodeIds } = options;
  if (!modelRoot) return;
  const traverse = (node) => {
    if (!node.userData) node.userData = {};
    const nodeOriginalUuid = node.userData?.originalUuid ? String(node.userData.originalUuid) : defaultOwner;
    node.userData.originalUuid = nodeOriginalUuid;
    if (!nodeMap.has(node.id)) nodeMap.set(node.id, []);
    nodeMap.get(node.id).push(node);
    if (node.bimId) {
      const key = `${nodeOriginalUuid}::${node.bimId}`;
      if (!bimIdToNodeIds.has(key)) bimIdToNodeIds.set(key, []);
      bimIdToNodeIds.get(key).push(node.id);
    }
    if (node.children) node.children.forEach(traverse);
  };
  traverse(modelRoot);
}
async function registerNbimChunks(options) {
  const {
    chunkEntries,
    globalOffset,
    chunkPadding,
    rootId,
    fileId,
    immediateGhostLimit,
    registrationBatchSize,
    onProgress,
    registerChunk,
    createGhostLine,
    addGhostLine,
    yieldToMainThread
  } = options;
  if (chunkEntries.length === 0) {
    throw new Error("NBIM 文件没有可渲染分块，可能格式有问题");
  }
  const chunkOffset = globalOffset.lengthSq() > 0 ? globalOffset.clone().negate() : null;
  const deferredGhostSpecs = [];
  for (let index = 0; index < chunkEntries.length; index++) {
    const chunkEntry = chunkEntries[index];
    if (!chunkEntry?.bounds || typeof chunkEntry.byteOffset !== "number" || typeof chunkEntry.byteLength !== "number") {
      throw new Error("NBIM 分块数据不完整，可能格式有问题");
    }
    const bounds = new THREE.Box3(
      new THREE.Vector3(chunkEntry.bounds.min.x, chunkEntry.bounds.min.y, chunkEntry.bounds.min.z),
      new THREE.Vector3(chunkEntry.bounds.max.x, chunkEntry.bounds.max.y, chunkEntry.bounds.max.z)
    );
    if (chunkOffset) {
      bounds.translate(chunkOffset);
    }
    const chunkId = chunkEntry.id;
    const center = bounds.getCenter(new THREE.Vector3());
    const paddedBounds = bounds.clone();
    const padSize = bounds.getSize(new THREE.Vector3()).multiplyScalar(chunkPadding);
    paddedBounds.expandByVector(padSize);
    registerChunk({
      id: chunkId,
      bounds,
      paddedBounds,
      _padding: chunkPadding,
      center,
      loaded: false,
      byteOffset: chunkEntry.byteOffset,
      byteLength: chunkEntry.byteLength,
      nbimFileId: fileId,
      groupName: `optimized_${rootId}`,
      originalUuid: chunkEntry.originalUuid ? String(chunkEntry.originalUuid) : rootId
    });
    if (index < immediateGhostLimit) {
      addGhostLine(createGhostLine(`ghost_${chunkId}`, bounds));
    } else {
      deferredGhostSpecs.push({ chunkId, bounds });
    }
    if ((index + 1) % registrationBatchSize === 0) {
      if (onProgress) {
        const ratio = Math.max(0, Math.min(1, (index + 1) / chunkEntries.length));
        onProgress(30 + Math.round(ratio * 40), "正在初始化分块...");
      }
      await yieldToMainThread();
    }
  }
  return {
    deferredGhostSpecs
  };
}
function finalizeNbimLoad(options) {
  const { chunkCount, hasManifestStats, hasManifestChunks } = options;
  return {
    chunkWarmupActive: true,
    initialChunkLoadTarget: chunkCount > 200 ? 44 : chunkCount > 80 ? 30 : 16,
    shouldEstimateStats: !hasManifestStats && hasManifestChunks
  };
}

function getHighlightColor(settings) {
  return new THREE.Color(settings.highlightColor || "#ff9f1c");
}
function restoreHighlightedInstanceColors(context, uuids) {
  for (const id of uuids) {
    const mappings = context.optimizedMapping.get(id);
    if (!mappings) continue;
    mappings.forEach((mapping) => {
      mapping.mesh.setColorAt(mapping.instanceId, new THREE.Color(mapping.originalColor));
      if (mapping.mesh.instanceColor) {
        mapping.mesh.instanceColor.needsUpdate = true;
      }
    });
  }
}
function applyHighlightedInstanceColors(context, uuids) {
  const highlightColor = getHighlightColor(context.settings);
  for (const id of uuids) {
    const mappings = context.optimizedMapping.get(id);
    if (!mappings) continue;
    mappings.forEach((mapping) => {
      mapping.mesh.setColorAt(mapping.instanceId, highlightColor);
      if (mapping.mesh.instanceColor) {
        mapping.mesh.instanceColor.needsUpdate = true;
      }
    });
  }
}
function updateSelectionHelpers(context, target) {
  context.selectionBox.visible = false;
  context.highlightMesh.visible = false;
  if (target.size === 0) {
    return;
  }
  const union = new THREE.Box3();
  const tmpBox = new THREE.Box3();
  const tmpMatrix = new THREE.Matrix4();
  const addObjectBounds = (id) => {
    const mappings = context.optimizedMapping.get(id);
    if (mappings && mappings.length > 0) {
      const mapping = mappings[0];
      if (mapping.geometry) {
        if (!mapping.geometry.boundingBox) mapping.geometry.computeBoundingBox();
        tmpBox.copy(mapping.geometry.boundingBox);
        mapping.mesh.getMatrixAt(mapping.instanceId, tmpMatrix);
        tmpMatrix.premultiply(mapping.mesh.matrixWorld);
        tmpBox.applyMatrix4(tmpMatrix);
        union.union(tmpBox);
      }
      return;
    }
    const object = context.contentGroup.getObjectByProperty("uuid", id);
    if (!object) return;
    object.updateMatrixWorld(true);
    if (object.userData.boundingBox) {
      tmpBox.copy(object.userData.boundingBox).applyMatrix4(object.matrixWorld);
    } else {
      tmpBox.setFromObject(object);
    }
    union.union(tmpBox);
  };
  for (const id of target) addObjectBounds(id);
  if (!union.isEmpty()) {
    context.selectionBox.box.copy(union);
    const locatingFocus = !!(context.state.locateFocusUuid && target.has(context.state.locateFocusUuid));
    if (locatingFocus) {
      const pad = Math.max(union.getSize(new THREE.Vector3()).length() * 0.048, 0.22);
      context.selectionBox.box.expandByScalar(pad);
    }
    context.selectionBox.visible = locatingFocus || !!context.settings.highlightShowBox;
  }
  const focusId = context.state.lastSelectedUuid;
  if (!focusId) return;
  const focusMappings = context.optimizedMapping.get(focusId);
  if (focusMappings && focusMappings.length > 0) {
    context.highlightMesh.visible = false;
    return;
  }
  const focusObject = context.contentGroup.getObjectByProperty("uuid", focusId);
  if (!focusObject || !focusObject.isMesh) return;
  focusObject.updateMatrixWorld(true);
  context.highlightMesh.geometry = focusObject.geometry;
  const worldPosition = new THREE.Vector3();
  const worldQuaternion = new THREE.Quaternion();
  const worldScale = new THREE.Vector3();
  focusObject.matrixWorld.decompose(worldPosition, worldQuaternion, worldScale);
  worldScale.multiplyScalar(1.035);
  context.highlightMesh.position.copy(worldPosition);
  context.highlightMesh.quaternion.copy(worldQuaternion);
  context.highlightMesh.scale.copy(worldScale);
  context.highlightMesh.visible = true;
}
function hasSameLocateResultSet(currentSet, uuids) {
  if (currentSet.size !== uuids.length) return false;
  for (const uuid of uuids) {
    if (!currentSet.has(uuid)) return false;
  }
  return true;
}
function expandLocateTargets(contentMap, ids) {
  const expanded = /* @__PURE__ */ new Set();
  const queue = [...ids];
  const visited = /* @__PURE__ */ new Set();
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);
    expanded.add(current);
    const nodes = contentMap.get(current);
    if (!nodes || nodes.length === 0) continue;
    for (const node of nodes) {
      if (!node.children || node.children.length === 0) continue;
      for (const child of node.children) {
        if (!visited.has(child.id)) queue.push(child.id);
      }
    }
  }
  return expanded;
}
function applyHighlightObjects(context, uuids) {
  context.clearClashPairHighlight();
  const target = new Set(uuids.filter(Boolean));
  const preserveLocateTint = context.state.locateResultSet.size > 0;
  if (!preserveLocateTint) {
    restoreHighlightedInstanceColors(context, [...context.state.highlightedUuids].filter((id) => !target.has(id)));
    applyHighlightedInstanceColors(context, [...target].filter((id) => !context.state.highlightedUuids.has(id)));
  }
  context.state.highlightedUuids = target;
  context.state.lastSelectedUuid = uuids.length > 0 ? uuids[uuids.length - 1] : null;
  updateSelectionHelpers(context, target);
  return { needsRender: true };
}
function applyClearLocateFocus(context) {
  context.clearClashPairHighlight();
  context.locateObjectMaterialCache.forEach((material, uuid) => {
    const object = context.contentGroup.getObjectByProperty("uuid", uuid);
    if (!object || !object.isMesh && !object.isBatchedMesh) return;
    object.material = material;
  });
  context.locateObjectMaterialCache.clear();
  context.locateMaterialCache.clear();
  context.locateDimmedInstances.forEach(({ mesh, instanceId, originalColor }) => {
    mesh.setColorAt(instanceId, new THREE.Color(originalColor));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });
  context.locateDimmedInstances.clear();
  context.state.locateResultSet.clear();
  context.state.locateFocusUuid = null;
  context.state.highlightedUuids = /* @__PURE__ */ new Set();
  context.state.lastSelectedUuid = null;
  context.selectionBox.visible = false;
  context.highlightMesh.visible = false;
  return { needsRender: true };
}
function applySetLocateResultSet(context, uuids, focusUuid = null, options) {
  context.clearClashPairHighlight();
  const normalized = Array.from(new Set(uuids.filter(Boolean)));
  if (normalized.length === 0) {
    return applyClearLocateFocus(context);
  }
  const selectedSet = new Set(normalized);
  const expandedTargets = expandLocateTargets(context.nodeMap, normalized);
  const expandedList = Array.from(expandedTargets);
  const rootColorByExpandedId = /* @__PURE__ */ new Map();
  const colorEntries = options?.highlightColors || {};
  normalized.forEach((rootId) => {
    const colorHex = colorEntries[rootId];
    if (!colorHex) return;
    const rootColor = new THREE.Color(colorHex);
    const expandedFromRoot = expandLocateTargets(context.nodeMap, [rootId]);
    expandedFromRoot.forEach((id) => rootColorByExpandedId.set(id, rootColor));
  });
  if (hasSameLocateResultSet(context.state.locateResultSet, expandedList)) {
    const nextFocus = focusUuid && context.state.locateResultSet.has(focusUuid) ? focusUuid : expandedList[0];
    context.state.locateFocusUuid = nextFocus;
    return applyHighlightObjects(context, nextFocus ? [nextFocus] : []);
  }
  applyClearLocateFocus(context);
  context.state.locateResultSet = expandedTargets;
  context.state.locateFocusUuid = focusUuid && expandedTargets.has(focusUuid) ? focusUuid : expandedList[0];
  const focusKey = context.state.locateFocusUuid;
  const dimmedColor = new THREE.Color("#b7bec9");
  const accentColor = getHighlightColor(context.settings);
  context.contentGroup.traverse((child) => {
    const mesh = child;
    if (!mesh.isMesh || !mesh.material) return;
    if (!context.locateObjectMaterialCache.has(child.uuid)) {
      context.locateObjectMaterialCache.set(child.uuid, mesh.material);
    }
    const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const isMatched = expandedTargets.has(child.uuid);
    const isFocus = isMatched && focusKey !== null && child.uuid === focusKey;
    const matchedColor = rootColorByExpandedId.get(child.uuid) || accentColor;
    const nextMaterials = sourceMaterials.map((material) => {
      if (!material) return material;
      const cloned = material.clone();
      if ("transparent" in cloned) cloned.transparent = false;
      if ("opacity" in cloned) cloned.opacity = 1;
      if ("depthWrite" in cloned) cloned.depthWrite = true;
      if ("color" in cloned && cloned.color) {
        const baseColor = cloned.color.clone();
        if (isMatched) {
          cloned.color.copy(baseColor.lerp(matchedColor, isFocus ? 0.93 : 0.76));
        } else {
          cloned.transparent = true;
          cloned.opacity = 0.18;
          cloned.depthWrite = false;
          cloned.color.copy(baseColor.lerp(dimmedColor, 0.84));
        }
      }
      if ("emissive" in cloned && cloned.emissive) {
        if (isMatched) cloned.emissive.copy(matchedColor.clone().multiplyScalar(isFocus ? 0.4 : 0.12));
        else cloned.emissive.set(0);
      }
      if ("roughness" in cloned && !isMatched) cloned.roughness = Math.max(0.9, cloned.roughness ?? 0.9);
      if ("metalness" in cloned && !isMatched) cloned.metalness = Math.min(0.02, cloned.metalness ?? 0.02);
      cloned.needsUpdate = true;
      return cloned;
    });
    mesh.material = Array.isArray(mesh.material) ? nextMaterials : nextMaterials[0];
  });
  context.contentGroup.traverse((child) => {
    const batched = child;
    if (!batched.isBatchedMesh || !batched.material) return;
    if (!context.locateObjectMaterialCache.has(child.uuid)) {
      context.locateObjectMaterialCache.set(child.uuid, batched.material);
    }
    const owner = batched.userData?.originalUuid ? String(batched.userData.originalUuid) : "";
    const batchIdToUuid = batched.userData?.batchIdToUuid;
    let hasMatchedInstance = false;
    let hasFocusInstance = false;
    let instanceMatchColor = owner ? rootColorByExpandedId.get(owner) || null : null;
    if (batchIdToUuid && batchIdToUuid.size > 0) {
      for (const instanceUuid of batchIdToUuid.values()) {
        if (!hasMatchedInstance && expandedTargets.has(instanceUuid)) hasMatchedInstance = true;
        if (!hasFocusInstance && focusKey !== null && instanceUuid === focusKey) hasFocusInstance = true;
        if (!instanceMatchColor && expandedTargets.has(instanceUuid)) {
          instanceMatchColor = rootColorByExpandedId.get(instanceUuid) || null;
        }
        if (hasMatchedInstance && hasFocusInstance) break;
      }
    }
    const ownerExplicitSelected = owner ? selectedSet.has(owner) : false;
    const isMatched = expandedTargets.has(child.uuid) || hasMatchedInstance || ownerExplicitSelected;
    const isFocus = context.state.locateFocusUuid !== null && context.state.locateFocusUuid === child.uuid || hasFocusInstance || ownerExplicitSelected && context.state.locateFocusUuid !== null && context.state.locateFocusUuid === owner;
    const sourceMaterials = Array.isArray(batched.material) ? batched.material : [batched.material];
    const matchedColor = instanceMatchColor || accentColor;
    const nextMaterials = sourceMaterials.map((material) => {
      if (!material) return material;
      const cloned = material.clone();
      if ("transparent" in cloned) cloned.transparent = false;
      if ("opacity" in cloned) cloned.opacity = 1;
      if ("depthWrite" in cloned) cloned.depthWrite = true;
      if ("color" in cloned && cloned.color) {
        const baseColor = cloned.color.clone();
        if (isMatched) {
          cloned.color.copy(baseColor.lerp(matchedColor, isFocus ? 0.92 : 0.7));
        } else {
          cloned.transparent = true;
          cloned.opacity = 0.16;
          cloned.depthWrite = false;
          cloned.color.copy(baseColor.lerp(dimmedColor, 0.86));
        }
      }
      if ("emissive" in cloned && cloned.emissive) {
        if (isMatched) cloned.emissive.copy(matchedColor.clone().multiplyScalar(isFocus ? 0.36 : 0.12));
        else cloned.emissive.set(0);
      }
      if ("roughness" in cloned && !isMatched) cloned.roughness = Math.max(0.9, cloned.roughness ?? 0.9);
      if ("metalness" in cloned && !isMatched) cloned.metalness = Math.min(0.02, cloned.metalness ?? 0.02);
      cloned.needsUpdate = true;
      return cloned;
    });
    batched.material = Array.isArray(batched.material) ? nextMaterials : nextMaterials[0];
  });
  context.optimizedMapping.forEach((mappings, originalUuid) => {
    const isMatched = expandedTargets.has(originalUuid);
    const isFocus = isMatched && focusKey !== null && originalUuid === focusKey;
    const matchedColor = rootColorByExpandedId.get(originalUuid) || accentColor;
    mappings.forEach((mapping) => {
      const key = `${mapping.mesh.uuid}:${mapping.instanceId}`;
      context.locateDimmedInstances.set(key, {
        mesh: mapping.mesh,
        instanceId: mapping.instanceId,
        originalColor: mapping.originalColor
      });
      const sourceColor = new THREE.Color(mapping.originalColor);
      const tint = isFocus ? 0.93 : isMatched ? 0.76 : 0.82;
      const targetColor = isMatched ? matchedColor : dimmedColor;
      mapping.mesh.setColorAt(mapping.instanceId, sourceColor.lerp(targetColor, tint));
      if (mapping.mesh.instanceColor) mapping.mesh.instanceColor.needsUpdate = true;
    });
  });
  return applyHighlightObjects(context, context.state.locateFocusUuid ? [context.state.locateFocusUuid] : []);
}

function createMarker(point, parent, dotTexture) {
  const markerGeometry = new THREE.BufferGeometry().setAttribute(
    "position",
    new THREE.Float32BufferAttribute([point.x, point.y, point.z], 3)
  );
  const markerMaterial = new THREE.PointsMaterial({
    color: 16711680,
    size: 8,
    map: dotTexture,
    transparent: true,
    alphaTest: 0.5,
    depthTest: false
  });
  const marker = new THREE.Points(markerGeometry, markerMaterial);
  marker.renderOrder = 999;
  parent.add(marker);
}
function createLine(points, parent) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 16711680, depthTest: false, linewidth: 2 });
  const line = new THREE.Line(geometry, material);
  line.renderOrder = 998;
  parent.add(line);
}
function createLabel(text, position) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return new THREE.Sprite();
  const fontSize = 48;
  const padding = 24;
  context.font = `Bold ${fontSize}px "Segoe UI", Arial, sans-serif`;
  const textWidth = context.measureText(text).width;
  canvas.width = textWidth + padding * 2;
  canvas.height = fontSize + padding;
  context.shadowColor = "rgba(0, 0, 0, 0.5)";
  context.shadowBlur = 10;
  context.fillStyle = "rgba(30, 30, 30, 0.9)";
  const radius = 8;
  const roundedContext = context;
  if (roundedContext.roundRect) {
    roundedContext.roundRect(5, 5, canvas.width - 10, canvas.height - 10, radius);
  } else {
    context.rect(5, 5, canvas.width - 10, canvas.height - 10);
  }
  context.fill();
  context.shadowBlur = 0;
  context.strokeStyle = "#ff0000";
  context.lineWidth = 2;
  context.stroke();
  context.font = `Bold ${fontSize}px "Segoe UI", Arial, sans-serif`;
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({
    map: texture,
    depthTest: false,
    sizeAttenuation: false
  });
  const sprite = new THREE.Sprite(material);
  sprite.position.copy(position);
  const baseScale = 0.5;
  sprite.scale.set(baseScale * (canvas.width / canvas.height), baseScale, 1);
  sprite.renderOrder = 1001;
  sprite.userData = { type: "label" };
  return sprite;
}
function clearPreviewVisuals(context, state) {
  if (state.previewLine) {
    context.measureGroup.remove(state.previewLine);
    state.previewLine = null;
  }
  if (state.previewPolygon) {
    context.measureGroup.remove(state.previewPolygon);
    state.previewPolygon = null;
  }
  context.tempMarker.visible = false;
}
function applyClearMeasurementPreview(context, resetPoints = true) {
  const state = {
    ...context.state,
    currentMeasurePoints: resetPoints ? [] : [...context.state.currentMeasurePoints]
  };
  clearPreviewVisuals(context, state);
  for (let i = context.measureGroup.children.length - 1; i >= 0; i--) {
    const child = context.measureGroup.children[i];
    if (!child.name.startsWith("measure_")) {
      context.measureGroup.remove(child);
    }
  }
  return {
    state,
    needsRender: true
  };
}
function applyUpdateMeasurePreview(context, hoverPoint) {
  const state = {
    ...context.state,
    currentMeasurePoints: [...context.state.currentMeasurePoints]
  };
  clearPreviewVisuals(context, state);
  const points = [...state.currentMeasurePoints];
  if (hoverPoint) points.push(hoverPoint);
  if (points.length < 2) {
    return { state, needsRender: false };
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineDashedMaterial({
    color: 16711680,
    dashSize: 5,
    gapSize: 2,
    depthTest: false
  });
  state.previewLine = new THREE.Line(geometry, material);
  state.previewLine.computeLineDistances();
  state.previewLine.renderOrder = 998;
  context.measureGroup.add(state.previewLine);
  return { state, needsRender: false };
}
function applyUpdateMeasureHover(context, clientX, clientY) {
  const state = {
    ...context.state,
    currentMeasurePoints: [...context.state.currentMeasurePoints]
  };
  if (state.measureType === "none") {
    context.tempMarker.visible = false;
    return { state, needsRender: false };
  }
  const intersect = context.getRayIntersects(clientX, clientY);
  if (!intersect) {
    context.tempMarker.visible = false;
    if (state.previewLine) state.previewLine.visible = false;
    return { state, needsRender: true };
  }
  const point = intersect.point;
  const position = context.tempMarker.geometry.attributes.position;
  position.setXYZ(0, point.x, point.y, point.z);
  position.needsUpdate = true;
  context.tempMarker.visible = true;
  if (state.currentMeasurePoints.length === 0) {
    return { state, needsRender: true };
  }
  const previewResult = applyUpdateMeasurePreview(context, point);
  return {
    state: previewResult.state,
    needsRender: true
  };
}
function applyFinalizeMeasurement(context) {
  const state = {
    ...context.state,
    currentMeasurePoints: [...context.state.currentMeasurePoints]
  };
  const id = `measure_${Date.now()}`;
  const group = new THREE.Group();
  group.name = id;
  state.currentMeasurePoints.forEach((point) => createMarker(point, group, context.dotTexture));
  let value = "";
  let displayValue = "";
  const type = state.measureType;
  const labelPosition = new THREE.Vector3();
  if (state.measureType === "dist") {
    const [p1, p2] = state.currentMeasurePoints;
    const distance = p1.distanceTo(p2);
    const dx = Math.abs(p2.x - p1.x);
    const dy = Math.abs(p2.y - p1.y);
    const dz = Math.abs(p2.z - p1.z);
    displayValue = distance.toFixed(3);
    value = `${displayValue} (Δx:${dx.toFixed(2)}, Δy:${dy.toFixed(2)}, Δz:${dz.toFixed(2)})`;
    createLine(state.currentMeasurePoints, group);
    labelPosition.copy(p1).add(p2).multiplyScalar(0.5);
  } else if (state.measureType === "angle") {
    const [p1, center, p2] = state.currentMeasurePoints;
    const v1 = p1.clone().sub(center).normalize();
    const v2 = p2.clone().sub(center).normalize();
    const angle = v1.angleTo(v2) * (180 / Math.PI);
    displayValue = `${angle.toFixed(2)}°`;
    value = displayValue;
    createLine(state.currentMeasurePoints, group);
    labelPosition.copy(center);
  } else {
    const [point] = state.currentMeasurePoints;
    displayValue = `(${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)})`;
    value = displayValue;
    labelPosition.copy(point);
  }
  group.add(createLabel(displayValue, labelPosition));
  context.measureGroup.add(group);
  context.measureRecords.set(id, {
    id,
    type,
    val: value,
    group,
    modelUuid: state.currentMeasureModelUuid || void 0
  });
  const cleared = applyClearMeasurementPreview(
    {
      ...context,
      state: {
        ...state,
        currentMeasurePoints: [],
        currentMeasureModelUuid: null
      }
    },
    false
  );
  const nextState = {
    ...cleared.state,
    currentMeasurePoints: [],
    currentMeasureModelUuid: null
  };
  if (context.onMeasureUpdate) {
    context.onMeasureUpdate(Array.from(context.measureRecords.values()));
  }
  return {
    state: nextState,
    needsRender: true,
    completed: { id, type, val: value }
  };
}
function applyAddMeasurePoint(context, point, modelUuid) {
  if (context.state.measureType === "none") {
    return { state: context.state, needsRender: false, completed: null };
  }
  const state = {
    ...context.state,
    currentMeasurePoints: [...context.state.currentMeasurePoints, point],
    currentMeasureModelUuid: modelUuid ?? context.state.currentMeasureModelUuid
  };
  createMarker(point, context.measureGroup, context.dotTexture);
  const shouldFinalize = state.measureType === "dist" && state.currentMeasurePoints.length === 2 || state.measureType === "angle" && state.currentMeasurePoints.length === 3 || state.measureType === "coord";
  if (shouldFinalize) {
    return applyFinalizeMeasurement({ ...context, state });
  }
  const previewResult = applyUpdateMeasurePreview({ ...context, state });
  return {
    state: previewResult.state,
    needsRender: true,
    completed: null
  };
}
function applyHighlightMeasurement(context, id) {
  context.measureRecords.forEach((record, recordId) => {
    const isHighlighted = recordId === id;
    const color = isHighlighted ? 65280 : 16711680;
    record.group.traverse((child) => {
      if (child instanceof THREE.Line || child instanceof THREE.LineLoop) {
        child.material.color.set(color);
      } else if (child instanceof THREE.Points) {
        child.material.color.set(color);
      } else if (child instanceof THREE.Sprite) {
        child.material.color.set(isHighlighted ? 65280 : 16777215);
      } else if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
        child.material.color.set(color);
      } else if (child instanceof THREE.Box3Helper) {
        child.material.color.set(color);
      }
    });
  });
  return {
    state: context.state,
    needsRender: true
  };
}
function applyPickMeasurement(context, clientX, clientY) {
  const rect = context.canvas.getBoundingClientRect();
  context.mouse.x = (clientX - rect.left) / rect.width * 2 - 1;
  context.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  context.raycaster.setFromCamera(context.mouse, context.camera);
  const previousThreshold = context.raycaster.params.Line?.threshold || 0;
  if (context.raycaster.params.Line) {
    context.raycaster.params.Line.threshold = 5;
  }
  const intersects = context.raycaster.intersectObjects(context.measureGroup.children, true);
  if (context.raycaster.params.Line) {
    context.raycaster.params.Line.threshold = previousThreshold;
  }
  if (intersects.length === 0) {
    return null;
  }
  let object = intersects[0].object;
  while (object.parent && !object.name.startsWith("measure_")) {
    object = object.parent;
  }
  return object.name.startsWith("measure_") ? object.name : null;
}

function buildInteractableList(context) {
  const interactableList = [];
  if (context.chunks.length > 0) {
    context.chunks.forEach((chunk) => {
      if (chunk.loaded && chunk.mesh && chunk.mesh.visible) {
        interactableList.push(chunk.mesh);
      }
    });
  }
  const traverseLimit = (object, depth) => {
    if (depth > 10) return;
    if (!object.visible) return;
    if (object.userData.chunkId) return;
    if (object.isMesh || object.isBatchedMesh) {
      if (!object.userData.isOptimized) {
        interactableList.push(object);
      }
      return;
    }
    if (object.children.length === 0) return;
    for (const child of object.children) {
      traverseLimit(child, depth + 1);
    }
  };
  for (const child of context.contentGroup.children) {
    if (child.userData.isOptimizedGroup) continue;
    traverseLimit(child, 0);
  }
  return interactableList;
}
function createProxyObjectForBatchedHit(context, batchedMesh, batchId, originalUuid) {
  const nodes = context.nodeMap.get(originalUuid);
  const node = nodes?.[0];
  const proxy = new THREE.Object3D();
  proxy.uuid = originalUuid;
  if (node) {
    proxy.name = node.name;
    proxy.type = node.type;
    proxy.isMesh = node.type === "Mesh";
  }
  proxy.getWorldPosition = (vector) => {
    const matrix2 = new THREE.Matrix4();
    batchedMesh.getMatrixAt(batchId, matrix2);
    matrix2.premultiply(batchedMesh.matrixWorld);
    return vector.setFromMatrixPosition(matrix2);
  };
  const matrix = new THREE.Matrix4();
  batchedMesh.getMatrixAt(batchId, matrix);
  proxy.position.setFromMatrixPosition(matrix);
  return proxy;
}
function ensureInteractableList(context) {
  if (context.interactableListValid) {
    return {
      interactableList: context.interactableList,
      interactableListValid: true
    };
  }
  return {
    interactableList: buildInteractableList(context),
    interactableListValid: true
  };
}
function applyGetRayIntersects(context, clientX, clientY) {
  const rect = context.canvas.getBoundingClientRect();
  context.mouse.x = (clientX - rect.left) / rect.width * 2 - 1;
  context.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  context.raycaster.setFromCamera(context.mouse, context.camera);
  const state = ensureInteractableList(context);
  const intersects = context.raycaster.intersectObjects(state.interactableList, false);
  if (intersects.length === 0) {
    return { intersect: null, state };
  }
  const hit = intersects[0];
  if (!hit.object.isBatchedMesh) {
    return { intersect: hit, state };
  }
  const batchedMesh = hit.object;
  const batchId = hit.batchId !== void 0 ? hit.batchId : hit.instanceId;
  if (batchId === void 0) {
    return { intersect: hit, state };
  }
  const originalUuid = batchedMesh.userData.batchIdToUuid?.get(batchId);
  if (!originalUuid) {
    return { intersect: hit, state };
  }
  const originalObject = context.contentGroup.getObjectByProperty("uuid", originalUuid);
  hit.object = originalObject ?? createProxyObjectForBatchedHit(context, batchedMesh, batchId, originalUuid);
  return { intersect: hit, state };
}
function selectInteractablesByScreenRect(context, x1, y1, x2, y2) {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  const originalMatrix = context.camera.projectionMatrix.clone();
  const newMatrix = new THREE.Matrix4();
  const selectWidth = maxX - minX;
  const selectHeight = maxY - minY;
  const scaleX = selectWidth / 2;
  const scaleY = selectHeight / 2;
  const centerX = (maxX + minX) / 2;
  const centerY = (maxY + minY) / 2;
  const translateMatrix = new THREE.Matrix4().makeTranslation(-centerX, -centerY, 0);
  const scaleMatrix = new THREE.Matrix4().makeScale(1 / scaleX, 1 / scaleY, 1);
  newMatrix.multiplyMatrices(scaleMatrix, translateMatrix);
  const modifiedProjectionMatrix = newMatrix.multiply(originalMatrix);
  const frustum = new THREE.Frustum();
  const viewMatrix = context.camera.matrixWorldInverse;
  const projViewMatrix = modifiedProjectionMatrix.clone().multiply(viewMatrix);
  frustum.setFromProjectionMatrix(projViewMatrix);
  const selected = [];
  const box = new THREE.Box3();
  const tmpMatrix = new THREE.Matrix4();
  for (const object of context.interactableList) {
    if (object.isBatchedMesh) {
      const batchedMesh = object;
      const batchIdToUuid = batchedMesh.userData.batchIdToUuid;
      const batchIdToGeometry = batchedMesh.userData.batchIdToGeometry;
      if (!batchIdToUuid || !batchIdToGeometry) continue;
      for (const [batchId, uuid] of batchIdToUuid) {
        try {
          const geometry = batchIdToGeometry.get(batchId);
          if (!geometry) continue;
          batchedMesh.getMatrixAt(batchId, tmpMatrix);
          tmpMatrix.premultiply(batchedMesh.matrixWorld);
          const geometryBox = new THREE.Box3();
          if (!geometry.boundingBox) geometry.computeBoundingBox();
          geometryBox.copy(geometry.boundingBox).applyMatrix4(tmpMatrix);
          if (frustum.intersectsBox(geometryBox)) {
            selected.push(uuid);
          }
        } catch {
        }
      }
      continue;
    }
    box.setFromObject(object);
    if (frustum.intersectsBox(box)) {
      selected.push(object.uuid);
    }
  }
  return selected;
}

function resolveBimIdByUuid({
  uuid,
  nodeMap,
  bimIdToNodeIds
}) {
  const nodes = nodeMap.get(uuid);
  if (nodes && nodes.length > 0 && nodes[0].bimId) {
    return nodes[0].bimId;
  }
  for (const [key, nodeIds] of bimIdToNodeIds.entries()) {
    if (nodeIds.includes(uuid)) {
      const parts = key.split("::");
      return parts.length > 1 ? parts[1] : null;
    }
  }
  return null;
}
function resolveNodeUuidByBimId(bimId, bimIdToNodeIds) {
  for (const [key, nodeIds] of bimIdToNodeIds.entries()) {
    if (key.endsWith(`::${bimId}`) && nodeIds.length > 0) {
      return nodeIds[0];
    }
  }
  return null;
}
function resolveSelectionUuid(rawUuid, nodeMap, bimIdToNodeIds) {
  if (nodeMap.has(rawUuid)) return rawUuid;
  return resolveNodeUuidByBimId(rawUuid, bimIdToNodeIds) || rawUuid;
}
function resolveNbimNode(id, nodeMap) {
  const direct = nodeMap.get(id);
  return direct && direct.length > 0 ? direct[0] : null;
}
function resolveNbimPropertyEntry({
  id,
  nodeMap,
  nbimPropsByOriginalUuid
}) {
  const node = resolveNbimNode(id, nodeMap);
  if (!node || !node.bimId) return null;
  const originalUuid = node.userData?.originalUuid ? String(node.userData.originalUuid) : "";
  if (!originalUuid) return null;
  const map = nbimPropsByOriginalUuid.get(originalUuid);
  if (!map) return null;
  return {
    entry: map[`${originalUuid}::${node.bimId}`],
    node
  };
}
function resolveNbimFlatProperties(args) {
  const resolved = resolveNbimPropertyEntry(args);
  if (!resolved?.entry || typeof resolved.entry !== "object") return resolved?.entry || null;
  const { ifcRawGroups, ifcNormalizedGroups, ...flatProps } = resolved.entry;
  return flatProps;
}
function resolveNbimIfcPropertyGroups(args, mode = "raw") {
  const resolved = resolveNbimPropertyEntry(args);
  if (!resolved?.entry || typeof resolved.entry !== "object") return null;
  const rawGroups = resolved.entry.ifcRawGroups;
  const normalizedGroups = resolved.entry.ifcNormalizedGroups;
  if (mode === "normalized") {
    return normalizedGroups || rawGroups || null;
  }
  return rawGroups || normalizedGroups || null;
}

function estimateTextureMemoryMb(root) {
  let textureMemory = 0;
  const textures = /* @__PURE__ */ new Set();
  root.traverse((obj) => {
    if (obj.name === "__EdgesHelper") return;
    if (!obj.isMesh && !obj.isBatchedMesh) return;
    const mesh = obj;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      if (!material) return;
      Object.values(material).forEach((value) => {
        if (!(value instanceof THREE.Texture) || textures.has(value)) return;
        textures.add(value);
        const image = value.image;
        const width = image?.width || 0;
        const height = image?.height || 0;
        if (width > 0 && height > 0) {
          textureMemory += width * height * 4 / (1024 * 1024);
        }
      });
    });
  });
  return parseFloat(textureMemory.toFixed(2));
}

function collectSceneManagerStats(context) {
  const drawCalls = context.renderer.info.render.calls;
  const textureMemory = estimateTextureMemoryMb(context.contentGroup);
  return {
    meshes: context.originalStats.meshes,
    faces: context.originalStats.faces,
    memory: parseFloat(context.originalStats.memory.toFixed(2)),
    textureMemory,
    drawCalls,
    chunksLoaded: context.chunkLoadedCount,
    chunksTotal: context.chunksLength,
    chunksQueued: context.processingChunkCount,
    pixelRatio: Number(context.activePixelRatio.toFixed(2))
  };
}

function syncStructureNodeVisibility(nodeMap, rootNode, visible) {
  const setNodeVisible = (node) => {
    node.visible = visible;
    node.children?.forEach(setNodeVisible);
  };
  rootNode.children?.forEach(setNodeVisible);
  nodeMap.forEach((nodes) => {
    nodes.forEach((node) => {
      node.visible = visible;
    });
  });
}
function applyOptimizedMappingsVisibility(optimizedMapping, visible) {
  optimizedMapping.forEach((mappings) => {
    mappings.forEach((mapping) => {
      mapping.mesh.setVisibleAt(mapping.instanceId, visible);
    });
  });
}
function applyRenderableVisibility(object, visible) {
  if (object.name === "Helpers" || object.name === "Measure") return;
  if (object.isMesh && object.userData.isOptimized) {
    object.visible = false;
    return;
  }
  object.visible = visible;
}
function ensureParentChainVisible(object, scene) {
  let parent = object?.parent;
  while (parent && parent !== scene) {
    parent.visible = true;
    parent = parent.parent;
  }
}
function collectHighlightedDescendants(highlightedUuids, uuid, object, nodes) {
  const idsToUnhighlight = [];
  if (highlightedUuids.has(uuid)) {
    idsToUnhighlight.push(uuid);
  }
  if (object) {
    object.traverse((child) => {
      if (highlightedUuids.has(child.uuid)) {
        idsToUnhighlight.push(child.uuid);
      }
    });
    return idsToUnhighlight;
  }
  if (nodes && nodes.length > 0) {
    const walk = (node) => {
      if (highlightedUuids.has(node.id)) idsToUnhighlight.push(node.id);
      node.children?.forEach(walk);
    };
    walk(nodes[0]);
  }
  return idsToUnhighlight;
}
function syncNodeBranchVisibility(nodeMap, node, visible) {
  node.visible = visible;
  node.children?.forEach((child) => syncNodeBranchVisibility(nodeMap, child, visible));
  const mirrored = nodeMap.get(node.id);
  mirrored?.forEach((item) => {
    item.visible = visible;
  });
}
function applyObjectMappingVisibility(optimizedMapping, objectOrNodeId, visible) {
  const mappings = optimizedMapping.get(objectOrNodeId);
  if (!mappings) return;
  mappings.forEach((mapping) => {
    mapping.mesh.setVisibleAt(mapping.instanceId, visible);
  });
}
function applySetAllVisibility(context, visible) {
  syncStructureNodeVisibility(context.nodeMap, context.structureRoot, visible);
  applyOptimizedMappingsVisibility(context.optimizedMapping, visible);
  context.contentGroup.traverse((object) => {
    applyRenderableVisibility(object, visible);
  });
  return {
    needsBoundsUpdate: true,
    needsExplodeRefresh: true,
    needsRender: true
  };
}
function applySetObjectVisibility(context, uuid, visible, showParents = true) {
  const nodes = context.nodeMap.get(uuid);
  nodes?.forEach((node) => syncNodeBranchVisibility(context.nodeMap, node, visible));
  const object = context.contentGroup.getObjectByProperty("uuid", uuid);
  if (visible && object && showParents) {
    ensureParentChainVisible(object, context.scene);
  }
  const idsToUnhighlight = !visible ? collectHighlightedDescendants(context.highlightedUuids, uuid, object, nodes) : [];
  if (!object) {
    if (nodes && nodes.length > 0) {
      const walk = (node) => {
        applyObjectMappingVisibility(context.optimizedMapping, node.id, visible);
        node.children?.forEach(walk);
      };
      walk(nodes[0]);
    }
    return {
      needsBoundsUpdate: true,
      needsExplodeRefresh: false,
      needsRender: true,
      nextHighlightedUuids: idsToUnhighlight.length > 0 ? Array.from(new Set([...context.highlightedUuids].filter((id) => !idsToUnhighlight.includes(id)))) : void 0
    };
  }
  object.traverse((child) => {
    if (child.name === "Helpers" || child.name === "Measure") return;
    applyRenderableVisibility(child, visible);
    applyObjectMappingVisibility(context.optimizedMapping, child.uuid, visible);
  });
  return {
    needsBoundsUpdate: true,
    needsExplodeRefresh: false,
    needsRender: true,
    nextHighlightedUuids: idsToUnhighlight.length > 0 ? Array.from(new Set([...context.highlightedUuids].filter((id) => !idsToUnhighlight.includes(id)))) : void 0
  };
}
function applyVisibilityBatch(context, changes, options = {}) {
  if (changes.length === 0) {
    return {
      needsBoundsUpdate: false,
      needsExplodeRefresh: false,
      needsRender: false
    };
  }
  let highlighted = new Set(context.highlightedUuids);
  let needsRender = false;
  changes.forEach((change) => {
    const result = applySetObjectVisibility(
      {
        ...context,
        highlightedUuids: highlighted
      },
      change.uuid,
      change.visible,
      change.showParents ?? true
    );
    if (result.nextHighlightedUuids) {
      highlighted = new Set(result.nextHighlightedUuids);
    }
    needsRender = needsRender || result.needsRender;
  });
  return {
    needsBoundsUpdate: options.recomputeBounds ?? true,
    needsExplodeRefresh: options.refreshExplode ?? false,
    needsRender,
    nextHighlightedUuids: Array.from(highlighted)
  };
}
function applyIsolateObjects(context, uuids, setObjectVisibility) {
  applySetAllVisibility(context, false);
  const affectedBatchedMeshes = /* @__PURE__ */ new Set();
  uuids.forEach((uuid) => {
    setObjectVisibility(uuid, true);
    const nodes = context.nodeMap.get(uuid);
    if (nodes) {
      nodes.forEach((node) => {
        const showChildrenRecursive = (currentNode) => {
          if (currentNode.id !== uuid) {
            setObjectVisibility(currentNode.id, true);
          }
          currentNode.children?.forEach(showChildrenRecursive);
        };
        showChildrenRecursive(node);
      });
    }
    const mappings = context.optimizedMapping.get(uuid);
    mappings?.forEach((mapping) => {
      affectedBatchedMeshes.add(mapping.mesh);
    });
  });
  affectedBatchedMeshes.forEach((mesh) => {
    mesh.visible = true;
    ensureParentChainVisible(mesh, context.scene);
  });
  uuids.forEach((uuid) => {
    const object = context.contentGroup.getObjectByProperty("uuid", uuid);
    if (object) {
      ensureParentChainVisible(object, context.scene);
    }
  });
  return {
    needsBoundsUpdate: true,
    needsExplodeRefresh: true,
    needsRender: true
  };
}

const DEFAULT_SCENE_CHUNK_OPTIONS = {
  chunkReadCacheSize: 128,
  chunkPrefetchWindow: 0,
  ghostMode: "visible-first",
  targetMinFps: 20,
  loadProfile: "max-speed",
  deferIfcProperties: true,
  preferWorkerOctree: true,
  fastGeometrySanitize: true
};
function resolveSceneChunkOptions(options) {
  return {
    chunkReadCacheSize: Math.max(8, Math.min(256, Math.floor(options?.chunkReadCacheSize ?? DEFAULT_SCENE_CHUNK_OPTIONS.chunkReadCacheSize))),
    chunkPrefetchWindow: Math.max(0, Math.min(32, Math.floor(options?.chunkPrefetchWindow ?? DEFAULT_SCENE_CHUNK_OPTIONS.chunkPrefetchWindow))),
    ghostMode: options?.ghostMode ?? DEFAULT_SCENE_CHUNK_OPTIONS.ghostMode,
    targetMinFps: Math.max(20, Math.min(60, Math.floor(options?.targetMinFps ?? DEFAULT_SCENE_CHUNK_OPTIONS.targetMinFps))),
    loadProfile: options?.loadProfile ?? DEFAULT_SCENE_CHUNK_OPTIONS.loadProfile,
    deferIfcProperties: options?.deferIfcProperties ?? DEFAULT_SCENE_CHUNK_OPTIONS.deferIfcProperties,
    preferWorkerOctree: options?.preferWorkerOctree ?? DEFAULT_SCENE_CHUNK_OPTIONS.preferWorkerOctree,
    fastGeometrySanitize: options?.fastGeometrySanitize ?? DEFAULT_SCENE_CHUNK_OPTIONS.fastGeometrySanitize
  };
}

const NBIM_CHUNK_REGISTRATION_BATCH = 220;
const GHOST_VISIBLE_FIRST_BATCH = 180;
class SceneManager {
  constructor(canvas, options = {}) {
    this.structureRoot = { id: "root", name: "Root", type: "Group", children: [] };
    this.nodeMap = /* @__PURE__ */ new Map();
    this.bimIdToNodeIds = /* @__PURE__ */ new Map();
    this.lastSelectedUuid = null;
    this.highlightedUuids = /* @__PURE__ */ new Set();
    this.locateFocusUuid = null;
    this.locateResultSet = /* @__PURE__ */ new Set();
    this.locateMaterialCache = /* @__PURE__ */ new Map();
    this.locateObjectMaterialCache = /* @__PURE__ */ new Map();
    this.locateDimmedInstances = /* @__PURE__ */ new Map();
    this.clashPairObjectMaterialCache = /* @__PURE__ */ new Map();
    this.clashPairInstanceColorCache = /* @__PURE__ */ new Map();
    this.clashPairUuids = /* @__PURE__ */ new Set();
    this.highlightPulseColor = new THREE.Color("#ffffff");
    this.explodeEnabled = false;
    this.explodeStrength = 0;
    this.explodeCenter = new THREE.Vector3();
    this.explodeMode = "radial";
    this.explodeObjectStates = /* @__PURE__ */ new Map();
    this.explodeInstanceStates = /* @__PURE__ */ new Map();
    this.explodeScratchUniform = new THREE.Vector3();
    this.explodeScratchMix = new THREE.Vector3();
    this.measureType = "none";
    this.currentMeasurePoints = [];
    this.currentMeasureModelUuid = null;
    this.previewLine = null;
    this.previewPolygon = null;
    this.measureRecords = /* @__PURE__ */ new Map();
    this.boxSelectState = createInitialBoxSelectState();
    this.clippingPlanes = [];
    this.clipPlaneHelpers = [];
    this.clipHelperVisible = false;
    this.clipHelperOpacity = 0.12;
    this.sceneCenter = new THREE.Vector3();
    this.globalOffset = new THREE.Vector3();
    this.componentMap = /* @__PURE__ */ new Map();
    this.optimizedMapping = /* @__PURE__ */ new Map();
    this.settings = {
      ambientInt: 2,
      dirInt: 1,
      bgColor: "#edf0f3",
      viewCubeSize: 100,
      colorSpace: "srgb",
      toneMapping: "aces",
      exposure: 1,
      shadowQuality: "medium",
      adaptiveQuality: true,
      minPixelRatio: 0.8,
      maxPixelRatio: 2,
      targetFps: 50,
      performanceMode: "balanced",
      highlightColor: "#ff9f1c",
      highlightShowBox: false,
      backLightInt: 0.5,
      maxRenderDistance: 1e6
      // 增加默认渲染距离到 1km (针对 mm 单位)
    };
    this.sceneBounds = new THREE.Box3();
    this.cachedSceneSphere = new THREE.Sphere();
    this.sceneSphereValid = false;
    this.precomputedBounds = new THREE.Box3();
    this.chunks = [];
    this.chunkIdSet = /* @__PURE__ */ new Set();
    this.chunkById = /* @__PURE__ */ new Map();
    this.chunkIndexById = /* @__PURE__ */ new Map();
    this.processingChunks = /* @__PURE__ */ new Set();
    this.cancelledChunkIds = /* @__PURE__ */ new Set();
    this.frustum = new THREE.Frustum();
    this.projScreenMatrix = new THREE.Matrix4();
    this.logicTimer = null;
    this.nbimFiles = /* @__PURE__ */ new Map();
    this.nbimMeta = /* @__PURE__ */ new Map();
    this.nbimPropsByOriginalUuid = /* @__PURE__ */ new Map();
    this.sharedMaterial = new THREE.MeshStandardMaterial({
      color: 14277857,
      roughness: 0.82,
      metalness: 0.03,
      side: THREE.DoubleSide
    });
    this.interactableList = [];
    this.interactableListValid = false;
    this._needsBoundsUpdate = false;
    this.lastReportedProgress = { loaded: -1, total: -1 };
    this.lastChunkProgressReportAt = 0;
    this.chunkLoadedCount = 0;
    this.chunkPadding = 0.2;
    this.maxConcurrentChunkLoads = 128;
    this.maxChunkLoadsPerFrame = 64;
    this.maxLoadedChunks = 512;
    this.maxCachedChunks = 48;
    this.chunkLoadingEnabled = true;
    this.maxRenderDistance = 1e6;
    this._lastCullingTime = 0;
    this.chunkMeshCache = /* @__PURE__ */ new Map();
    this.chunkCacheOrder = [];
    this.chunkReadCache = /* @__PURE__ */ new Map();
    this.chunkReadCacheOrder = [];
    this.prefetchQueue = [];
    this.prefetchQueueSet = /* @__PURE__ */ new Set();
    this.prefetchInFlight = /* @__PURE__ */ new Set();
    this.prefetchRoundRobinCursor = 0;
    this.prefetchPaused = false;
    this.originalStats = { meshes: 0, faces: 0, memory: 0 };
    this.originalStatsByModel = /* @__PURE__ */ new Map();
    this.workers = [];
    this.workerQueue = [];
    this.activeWorkerCount = 0;
    this.maxWorkers = 4;
    this.isCameraMoving = false;
    this.activePixelRatio = 1;
    this.chunkLoadResumeAt = 0;
    this.cullingDirty = true;
    this.deferredStructureThreshold = 2e4;
    this.octreeWorkerThreshold = 25e3;
    this.initialChunkLoadTarget = 18;
    this.warmupChunkBoost = 12;
    this.chunkWarmupActive = false;
    this.chunkResidencyMs = 1800;
    this.chunkRuntimeProfiles = {
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
    };
    this.movingPeripheralCursor = 0;
    this.movingPeripheralLastRefreshAt = 0;
    this.postMoveRecoveryUntil = 0;
    this.deferredStructureTimer = null;
    this.deferredStructureToken = 0;
    this.loadGeneration = 0;
    this.fastPreviewMeshLimit = 1200;
    this.fastPreviewModels = /* @__PURE__ */ new Set();
    this.chunkCullingTempSize = new THREE.Vector3();
    this.chunkCullingTempDirection = new THREE.Vector3();
    this.chunkCullingTempForward = new THREE.Vector3();
    this.chunkCullingTempCenterNdc = new THREE.Vector3();
    this.boundsScanBatchSize = 2400;
    this.chunkRegistrationBatchSize = 18;
    this.chunkGhostBatchSize = 24;
    this.animationFrameId = null;
    this.animateFramePending = false;
    this.disposed = false;
    this.interactionShadowDowngraded = false;
    this.interactionShadowRestoreAt = 0;
    this.interactionShadowRestoreDelayMs = 220;
    this.cullingScanCursor = 0;
    this.cullingTimeBudgetMovingMs = 4.5;
    this.cullingTimeBudgetRecoveryMs = 6;
    this.cullingTimeBudgetIdleMs = 9;
    this.forceMaxChunkLoadSpeed = true;
    this.ghostMeshPool = [];
    this.canvas = canvas;
    this.options = options;
    this.resolvedChunkOptions = resolveSceneChunkOptions(options.chunkOptions);
    if (options.performancePreset) {
      this.settings.performanceMode = options.performancePreset;
    }
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    this.dotTexture = this.createCircleTexture();
    this.clock = new THREE.Clock();
    this.initHardwareProfile();
    this.ghostEdgesGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
    this.ghostMaterial = new THREE.LineBasicMaterial({ color: 4674921, transparent: true, opacity: 0.3 });
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: false,
      // 正交相机不建议开启对数深度缓冲区，会导致 negative near 裁剪问题
      precision: "highp",
      powerPreference: "high-performance"
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height, false);
    this.renderer.setClearColor(this.settings.bgColor);
    this.renderer.localClippingEnabled = true;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.04;
    this.activePixelRatio = this.renderer.getPixelRatio();
    this.scene = new THREE.Scene();
    this.contentGroup = new THREE.Group();
    this.contentGroup.name = "Content";
    this.scene.add(this.contentGroup);
    this.helpersGroup = new THREE.Group();
    this.helpersGroup.name = "Helpers";
    this.scene.add(this.helpersGroup);
    this.measureGroup = new THREE.Group();
    this.measureGroup.name = "Measure";
    this.scene.add(this.measureGroup);
    this.ghostGroup = new THREE.Group();
    this.ghostGroup.name = "Ghost";
    this.scene.add(this.ghostGroup);
    this.clipHelpersGroup = new THREE.Group();
    this.clipHelpersGroup.name = "ClipHelpers";
    this.scene.add(this.clipHelpersGroup);
    const frustumSize = 100;
    const aspect = width / height;
    this.camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      -1e6,
      1e6
    );
    this.camera.up.set(0, 0, 1);
    this.camera.position.set(1e3, -1e3, 1e3);
    this.camera.lookAt(0, 0, 0);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = false;
    this.controls.screenSpacePanning = true;
    this.controls.maxPolarAngle = Math.PI;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.PAN,
      RIGHT: void 0
    };
    this.controls.addEventListener("start", () => {
      const profile = this.getChunkRuntimeProfile();
      this.isCameraMoving = true;
      this.prefetchPaused = true;
      this.chunkLoadResumeAt = performance.now() + profile.resumeAfterMoveMs;
      this.postMoveRecoveryUntil = 0;
      this.interactionShadowRestoreAt = 0;
      this.movingPeripheralLastRefreshAt = 0;
      this.movingPeripheralCursor = 0;
      this.markSceneDirty({ needsCulling: true });
    });
    this.controls.addEventListener("change", () => {
      const profile = this.getChunkRuntimeProfile();
      this.isCameraMoving = true;
      this.prefetchPaused = true;
      this.chunkLoadResumeAt = performance.now() + profile.resumeAfterMoveMs;
      this.postMoveRecoveryUntil = 0;
      this.interactionShadowRestoreAt = 0;
      this.markSceneDirty({ needsCulling: true });
    });
    this.controls.addEventListener("end", () => {
      const now = performance.now();
      const profile = this.getChunkRuntimeProfile();
      this.isCameraMoving = false;
      this.prefetchPaused = false;
      this.chunkLoadResumeAt = now + Math.max(24, Math.floor(profile.resumeAfterMoveMs * 0.75));
      this.postMoveRecoveryUntil = now + profile.postMoveRecoveryMs;
      this.interactionShadowRestoreAt = now + this.interactionShadowRestoreDelayMs;
      this.movingPeripheralLastRefreshAt = 0;
      this.movingPeripheralCursor = 0;
      this.markSceneDirty({ needsCulling: true });
    });
    this.ambientLight = new THREE.AmbientLight(16251131, this.settings.ambientInt);
    this.scene.add(this.ambientLight);
    this.dirLight = new THREE.DirectionalLight(16776438, this.settings.dirInt);
    this.dirLight.position.set(60, 45, 110);
    this.scene.add(this.dirLight);
    this.backLight = new THREE.DirectionalLight(15331062, this.settings.backLightInt ?? 0.5);
    this.backLight.position.set(-40, -35, 30);
    this.scene.add(this.backLight);
    const box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    this.selectionBox = new THREE.Box3Helper(box, new THREE.Color(16776960));
    this.selectionBox.visible = false;
    this.helpersGroup.add(this.selectionBox);
    const highlightMat = new THREE.MeshBasicMaterial({
      color: this.settings.highlightColor,
      transparent: false,
      opacity: 1,
      depthTest: false,
      depthWrite: false,
      side: THREE.BackSide
    });
    this.highlightMesh = new THREE.Mesh(new THREE.BufferGeometry(), highlightMat);
    this.highlightMesh.visible = false;
    this.highlightMesh.renderOrder = 999;
    this.helpersGroup.add(this.highlightMesh);
    const markerGeo = new THREE.BufferGeometry();
    markerGeo.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0], 3));
    const markerMat = new THREE.PointsMaterial({
      color: 16711680,
      size: 8,
      sizeAttenuation: false,
      map: this.dotTexture,
      transparent: true,
      alphaTest: 0.5,
      depthTest: false
    });
    this.tempMarker = new THREE.Points(markerGeo, markerMat);
    this.tempMarker.visible = false;
    this.tempMarker.renderOrder = 1e3;
    this.helpersGroup.add(this.tempMarker);
    this.setupClipping();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 10;
    if (!this.raycaster.params.Line) this.raycaster.params.Line = { threshold: 1 };
    this.raycaster.params.Line.threshold = 2;
    this.mouse = new THREE.Vector2();
    this.animate = this.animate.bind(this);
    this.markSceneDirty();
  }
  registerChunk(chunk) {
    this.chunks.push(chunk);
    this.chunkIdSet.add(chunk.id);
    this.chunkById.set(chunk.id, chunk);
    this.chunkIndexById.set(chunk.id, this.chunks.length - 1);
  }
  rebuildChunkIdSet() {
    this.chunkIdSet.clear();
    this.chunkById.clear();
    this.chunkIndexById.clear();
    for (let index = 0; index < this.chunks.length; index++) {
      const chunk = this.chunks[index];
      this.chunkIdSet.add(chunk.id);
      this.chunkById.set(chunk.id, chunk);
      this.chunkIndexById.set(chunk.id, index);
    }
  }
  getChunkById(chunkId) {
    return this.chunkById.get(chunkId);
  }
  getChunkIndex(chunkId) {
    return this.chunkIndexById.get(chunkId) ?? -1;
  }
  /** 按需调度一帧：合并多次调用，在相机静止且无后台任务时不常驻 requestAnimationFrame */
  requestRender() {
    if (this.disposed) return;
    if (this.animateFramePending) return;
    this.animateFramePending = true;
    this.animationFrameId = requestAnimationFrame(this.animate);
  }
  markSceneDirty(options = {}) {
    const {
      needsRender = true,
      needsBoundsUpdate = false,
      needsCulling = false,
      invalidateInteractables = false
    } = options;
    if (invalidateInteractables) {
      this.interactableListValid = false;
    }
    if (needsBoundsUpdate) {
      this._needsBoundsUpdate = true;
    }
    if (needsCulling) {
      this.cullingDirty = true;
    }
    if (needsRender) {
      this.requestRender();
    }
  }
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.applyHighlightSettings();
    if (newSettings.clip) {
      this.setClipHelperOptions({
        visible: newSettings.clip.helperVisible,
        opacity: newSettings.clip.helperOpacity
      });
    }
    this.ambientLight.intensity = this.settings.ambientInt;
    this.dirLight.intensity = this.settings.dirInt;
    this.backLight.intensity = this.settings.backLightInt ?? 0.5;
    this.renderer.outputColorSpace = this.settings.colorSpace === "linear" ? THREE.LinearSRGBColorSpace : THREE.SRGBColorSpace;
    this.renderer.toneMapping = this.settings.toneMapping === "none" ? THREE.NoToneMapping : this.settings.toneMapping === "neutral" ? THREE.NeutralToneMapping : THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = this.settings.exposure ?? 1;
    this.renderer.setClearColor(this.settings.bgColor);
    if (newSettings.frustumCulling !== void 0) {
      this.contentGroup.traverse((obj) => {
        if (obj.isMesh) {
          obj.frustumCulled = newSettings.frustumCulling;
        } else if (obj.isBatchedMesh) {
          obj.frustumCulled = false;
        }
      });
    }
    if (newSettings.maxRenderDistance !== void 0) {
      this.maxRenderDistance = newSettings.maxRenderDistance;
      this.checkCullingAndLoad();
    }
    this.renderer.render(this.scene, this.camera);
  }
  createCircleTexture() {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (context) {
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2 - 2, 0, 2 * Math.PI);
      context.fillStyle = "#ffffff";
      context.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }
  animate() {
    if (this.disposed) return;
    this.animateFramePending = false;
    this.animationFrameId = null;
    const frameNow = performance.now();
    if (this.controls) {
      this.controls.update();
    }
    this.updateInteractionPerformance(frameNow);
    this.updateAdaptiveQuality();
    if (this._needsBoundsUpdate) {
      this.updateSceneBounds();
      this._needsBoundsUpdate = false;
    }
    this.updateCameraClipping();
    const now = performance.now();
    const profile = this.getChunkRuntimeProfile();
    const phase = this.getChunkRenderPhase(now);
    const cullingInterval = this.cullingDirty ? phase === "moving" ? profile.movingCullingIntervalMs : phase === "recovery" ? profile.recoveryCullingIntervalMs : Math.min(profile.recoveryCullingIntervalMs, 70) : profile.idleCullingIntervalMs;
    if (!this._lastCullingTime || now - this._lastCullingTime > cullingInterval) {
      this.checkCullingAndLoad(now);
      this._lastCullingTime = now;
      this.cullingDirty = false;
    }
    const highlightMaterial = this.highlightMesh.material;
    if (highlightMaterial) {
      if (this.locateFocusUuid && this.highlightMesh.visible) {
        const focusColor = new THREE.Color(this.settings.highlightColor || "#ff9f1c");
        const pulseMix = 0.22 + (Math.sin(frameNow / 125) + 1) * 0.3;
        highlightMaterial.color.copy(focusColor).lerp(this.highlightPulseColor, pulseMix);
        highlightMaterial.opacity = 1;
      } else {
        highlightMaterial.color.set(this.settings.highlightColor || "#ff9f1c");
        highlightMaterial.opacity = 1;
      }
    }
    const selectionLineMat = this.selectionBox.material;
    if (this.locateFocusUuid && this.selectionBox.visible && selectionLineMat && !Array.isArray(selectionLineMat)) {
      const baseSel = new THREE.Color(this.settings.highlightColor || "#ff9f1c");
      const pulseSel = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(frameNow / 125));
      selectionLineMat.color.copy(baseSel).lerp(this.highlightPulseColor, 0.34 * pulseSel);
    } else if (selectionLineMat && !Array.isArray(selectionLineMat)) {
      selectionLineMat.color.set(this.settings.highlightColor || "#ff9f1c");
    }
    this.renderer.render(this.scene, this.camera);
    const chunksIncomplete = this.chunkLoadingEnabled && this.chunks.length > 0 && this.chunkLoadedCount < this.chunks.length;
    const locatingPulse = !!(this.locateFocusUuid && (this.highlightMesh.visible || this.selectionBox.visible));
    const keepLoop = this.isCameraMoving || this.isInPostMoveRecovery(now) || this.processingChunks.size > 0 || this.chunkWarmupActive || chunksIncomplete || locatingPulse;
    if (keepLoop) {
      this.requestRender();
    }
  }
  updateAdaptiveQuality() {
    if (!this.settings.adaptiveQuality) return;
    const deviceRatio = window.devicePixelRatio || 1;
    const minRatio = Math.min(deviceRatio, this.settings.minPixelRatio ?? 0.8);
    const maxRatio = Math.min(deviceRatio, this.settings.maxPixelRatio ?? 2);
    const chunkCount = this.chunks.length;
    const meshCount = this.originalStats.meshes;
    const mode = this.settings.performanceMode ?? "balanced";
    let desiredRatio = maxRatio;
    if (this.isCameraMoving) {
      const movingScale = mode === "quality" ? chunkCount > 3500 || meshCount > 25e4 ? 0.68 : chunkCount > 1600 || meshCount > 12e4 ? 0.76 : 0.84 : mode === "smooth" ? chunkCount > 3500 || meshCount > 25e4 ? 0.44 : chunkCount > 1600 || meshCount > 12e4 ? 0.52 : 0.6 : chunkCount > 3500 || meshCount > 25e4 ? 0.48 : chunkCount > 1600 || meshCount > 12e4 ? 0.56 : 0.65;
      desiredRatio = Math.max(minRatio, maxRatio * movingScale);
    }
    desiredRatio = Math.max(minRatio, Math.min(maxRatio, desiredRatio));
    if (Math.abs(desiredRatio - this.activePixelRatio) < 0.05) return;
    this.activePixelRatio = desiredRatio;
    this.renderer.setPixelRatio(desiredRatio);
    const rect = this.canvas.getBoundingClientRect();
    this.renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
  }
  updateInteractionPerformance(now) {
    if (this.interactionShadowDowngraded && now >= this.interactionShadowRestoreAt) {
      this.interactionShadowDowngraded = false;
    }
  }
  initHardwareProfile() {
    const nav = navigator;
    const cpuCount = Math.max(2, nav.hardwareConcurrency || 4);
    const memoryGb = nav.deviceMemory || 8;
    const preset = this.options.performancePreset ?? this.settings.performanceMode ?? "balanced";
    const runtime = deriveInitialRuntimeFromHardware(cpuCount, preset);
    if (this.forceMaxChunkLoadSpeed) {
      this.maxWorkers = Math.max(4, Math.min(12, cpuCount - 1));
      this.maxConcurrentChunkLoads = Math.max(128, Math.min(192, this.maxWorkers * 24));
      this.maxChunkLoadsPerFrame = Math.max(64, Math.min(128, this.maxWorkers * 14));
      this.cullingTimeBudgetMovingMs = 7.5;
      this.cullingTimeBudgetRecoveryMs = 10.5;
      this.cullingTimeBudgetIdleMs = 14;
      this.chunkRegistrationBatchSize = 28;
      this.chunkGhostBatchSize = 40;
    } else {
      this.maxWorkers = 4;
      this.maxConcurrentChunkLoads = runtime.maxConcurrentChunkLoads;
      this.maxChunkLoadsPerFrame = runtime.maxChunkLoadsPerFrame;
    }
    this.maxLoadedChunks = memoryGb <= 4 ? 160 : memoryGb <= 8 ? 320 : 640;
    this.maxCachedChunks = memoryGb <= 4 ? 24 : memoryGb <= 8 ? 48 : 96;
    this.settings.targetFps = this.resolvedChunkOptions.targetMinFps;
  }
  collectObjectOverview(object) {
    let meshes = 0;
    let faces = 0;
    let memory = 0;
    object.traverse((child) => {
      const mesh = child;
      if (!mesh.isMesh || !mesh.geometry) return;
      meshes++;
      if (mesh.geometry.index) {
        faces += mesh.geometry.index.count / 3;
      } else if (mesh.geometry.attributes.position) {
        faces += mesh.geometry.attributes.position.count / 3;
      }
      memory += calculateGeometryMemory(mesh.geometry);
    });
    return {
      meshes,
      faces: Math.floor(faces),
      memory: parseFloat(memory.toFixed(2))
    };
  }
  async estimateNbimStats(file, chunks, version) {
    let meshes = 0;
    let faces = 0;
    let memory = 0;
    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const chunk = chunks[chunkIndex];
      const buffer = await file.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength).arrayBuffer();
      const dv = new DataView(buffer);
      let offset = 0;
      const geoCount = dv.getUint32(offset, true);
      offset += 4;
      const geometryFaces = [];
      for (let i = 0; i < geoCount; i++) {
        const vertCount = dv.getUint32(offset, true);
        offset += 4;
        const indexCount = dv.getUint32(offset, true);
        offset += 4;
        offset += vertCount * 12;
        offset += vertCount * 12;
        if (indexCount > 0) offset += indexCount * 4;
        geometryFaces.push(indexCount > 0 ? indexCount / 3 : vertCount / 3);
      }
      const instanceCount = dv.getUint32(offset, true);
      offset += 4;
      meshes += instanceCount;
      memory += chunk.byteLength / (1024 * 1024);
      for (let i = 0; i < instanceCount; i++) {
        offset += 4;
        offset += 4;
        offset += 4;
        offset += 64;
        const geoIdx = dv.getUint32(offset, true);
        offset += 4;
        faces += geometryFaces[geoIdx] || 0;
      }
      if (chunkIndex > 0 && chunkIndex % 8 === 0) {
        await this.yieldToMainThread();
      }
    }
    return {
      meshes,
      faces: Math.floor(faces),
      memory: parseFloat(memory.toFixed(2))
    };
  }
  registerOriginalStats(originalUuid, stats) {
    this.originalStatsByModel.set(originalUuid, stats);
    this.originalStats.meshes += stats.meshes;
    this.originalStats.faces += stats.faces;
    this.originalStats.memory = parseFloat((this.originalStats.memory + stats.memory).toFixed(2));
  }
  unregisterOriginalStats(originalUuid) {
    const stats = this.originalStatsByModel.get(originalUuid);
    if (!stats) return;
    this.originalStats.meshes = Math.max(0, this.originalStats.meshes - stats.meshes);
    this.originalStats.faces = Math.max(0, this.originalStats.faces - stats.faces);
    this.originalStats.memory = parseFloat(Math.max(0, this.originalStats.memory - stats.memory).toFixed(2));
    this.originalStatsByModel.delete(originalUuid);
  }
  disposeChunkMesh(mesh) {
    disposeChunkMeshResource({
      mesh,
      sharedMaterial: this.sharedMaterial
    });
  }
  touchChunkCache(chunkId) {
    this.chunkCacheOrder = touchChunkMeshCacheOrder(this.chunkCacheOrder, chunkId);
  }
  cacheChunkMesh(chunk, mesh) {
    const result = cacheChunkMeshEntry({
      chunk,
      mesh,
      chunkMeshCache: this.chunkMeshCache,
      chunkCacheOrder: this.chunkCacheOrder,
      maxCachedChunks: this.maxCachedChunks,
      disposeChunkMesh: (nextMesh) => this.disposeChunkMesh(nextMesh)
    });
    this.chunkCacheOrder = result.chunkCacheOrder;
  }
  takeCachedChunkMesh(chunkId) {
    const result = takeCachedChunkMeshEntry({
      chunkId,
      chunkMeshCache: this.chunkMeshCache,
      chunkCacheOrder: this.chunkCacheOrder
    });
    this.chunkCacheOrder = result.chunkCacheOrder;
    return result.mesh;
  }
  clearChunkCache(filter) {
    this.chunkCacheOrder = clearChunkMeshCacheEntries({
      chunkMeshCache: this.chunkMeshCache,
      chunkCacheOrder: this.chunkCacheOrder,
      disposeChunkMesh: (mesh) => this.disposeChunkMesh(mesh),
      filter
    });
  }
  hasValidChunkBinaryRange(chunk) {
    return hasValidChunkBinaryRange(chunk);
  }
  async readChunkBuffer(chunk) {
    const result = await readChunkBuffer({
      chunk,
      nbimFiles: this.nbimFiles,
      chunkReadCache: this.chunkReadCache,
      chunkReadCacheOrder: this.chunkReadCacheOrder,
      chunkReadCacheSize: this.resolvedChunkOptions.chunkReadCacheSize
    });
    this.chunkReadCacheOrder = result.chunkReadCacheOrder;
    return result.buffer;
  }
  enqueueChunkPrefetch(chunkIds) {
    this.prefetchQueue = enqueueChunkPrefetch({
      chunkIds,
      chunkPrefetchWindow: this.resolvedChunkOptions.chunkPrefetchWindow,
      prefetchQueue: this.prefetchQueue,
      prefetchQueueSet: this.prefetchQueueSet,
      prefetchInFlight: this.prefetchInFlight
    });
  }
  schedulePrefetchFromVisibleChunks(visibleChunks) {
    const result = collectPrefetchCandidates({
      visibleChunks,
      chunkPrefetchWindow: this.resolvedChunkOptions.chunkPrefetchWindow,
      prefetchPaused: this.prefetchPaused,
      isCameraMoving: this.isCameraMoving,
      prefetchRoundRobinCursor: this.prefetchRoundRobinCursor,
      chunks: this.chunks,
      processingChunks: this.processingChunks,
      chunkReadCache: this.chunkReadCache,
      getChunkIndex: (chunkId) => this.getChunkIndex(chunkId)
    });
    this.prefetchRoundRobinCursor = result.prefetchRoundRobinCursor;
    this.enqueueChunkPrefetch(result.chunkIds);
    void this.processPrefetchQueue();
  }
  async processPrefetchQueue() {
    await processChunkPrefetchQueue({
      prefetchPaused: this.prefetchPaused,
      isCameraMoving: this.isCameraMoving,
      prefetchQueue: this.prefetchQueue,
      prefetchQueueSet: this.prefetchQueueSet,
      prefetchInFlight: this.prefetchInFlight,
      maxWorkers: this.maxWorkers,
      getChunkById: (chunkId) => this.getChunkById(chunkId),
      chunkReadCache: this.chunkReadCache,
      readChunkBuffer: (chunk) => this.readChunkBuffer(chunk),
      processQueue: () => this.processPrefetchQueue()
    });
  }
  unregisterOptimizedMeshMapping(bm) {
    unregisterOptimizedMeshResourceMapping({
      mesh: bm,
      optimizedMapping: this.optimizedMapping
    });
  }
  registerOptimizedMeshMapping(bm) {
    registerOptimizedMeshResourceMapping({
      mesh: bm,
      optimizedMapping: this.optimizedMapping
    });
  }
  acquireGhostLine() {
    return acquireGhostLineResource({
      ghostMeshPool: this.ghostMeshPool,
      ghostEdgesGeometry: this.ghostEdgesGeometry,
      ghostMaterial: this.ghostMaterial
    });
  }
  releaseGhostLine(line) {
    releaseGhostLineResource({
      line,
      ghostMeshPool: this.ghostMeshPool
    });
  }
  createGhostLine(name, bounds) {
    return createGhostLineResource({
      name,
      bounds,
      acquireGhostLine: () => this.acquireGhostLine()
    });
  }
  ensureChunkGhost(chunk) {
    ensureChunkGhostResource({
      chunk,
      ghostGroup: this.ghostGroup,
      createGhostLine: (name, bounds) => this.createGhostLine(name, bounds)
    });
  }
  attachStructureRoot(modelRoot) {
    if (modelRoot.name === "Root" && modelRoot.children && modelRoot.children.length > 0) {
      if (!this.structureRoot.children) this.structureRoot.children = [];
      this.structureRoot.children.push(...modelRoot.children);
    } else {
      if (!this.structureRoot.children) this.structureRoot.children = [];
      this.structureRoot.children.push(modelRoot);
    }
  }
  replaceStructureNode(targetId, replacement) {
    const replaceInNodes = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === targetId) {
          nodes[i] = replacement;
          return true;
        }
        if (nodes[i].children && replaceInNodes(nodes[i].children)) return true;
      }
      return false;
    };
    if (this.structureRoot.children) {
      replaceInNodes(this.structureRoot.children);
    }
  }
  buildAndRegisterModelStructure(object) {
    let modelRoot;
    if (object.userData.isIFC) {
      modelRoot = this.buildIFCStructure(object);
    } else {
      modelRoot = this.buildSceneGraph(object);
    }
    const markOriginalUuid = (node) => {
      if (!node.userData) node.userData = {};
      node.userData.originalUuid = object.uuid;
      if (node.children) node.children.forEach(markOriginalUuid);
    };
    markOriginalUuid(modelRoot);
    const indexBimIds = (node) => {
      if (node.bimId) {
        const key = `${object.uuid}::${node.bimId}`;
        if (!this.bimIdToNodeIds.has(key)) this.bimIdToNodeIds.set(key, []);
        this.bimIdToNodeIds.get(key).push(node.id);
      }
      if (node.children) node.children.forEach(indexBimIds);
    };
    indexBimIds(modelRoot);
    return modelRoot;
  }
  async yieldToMainThread() {
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }
  createPreviewGhost(bounds, name) {
    const edges = this.createGhostLine(name, bounds);
    if (edges.material instanceof THREE.LineBasicMaterial) {
      edges.material.opacity = 0.45;
    }
    this.ghostGroup.add(edges);
    return edges;
  }
  async computeItemBoundsProgressively(items, onProgress) {
    const bounds = new THREE.Box3();
    const tmpMin = new THREE.Vector3();
    const tmpMax = new THREE.Vector3();
    const tmpScale = new THREE.Vector3();
    for (let start = 0; start < items.length; start += this.boundsScanBatchSize) {
      const end = Math.min(items.length, start + this.boundsScanBatchSize);
      for (let itemIndex = start; itemIndex < end; itemIndex++) {
        const item = items[itemIndex];
        const center = item.center;
        let r = 0;
        const geo = item.geometry;
        if (!geo.boundingSphere) geo.computeBoundingSphere();
        if (geo.boundingSphere) {
          tmpScale.setFromMatrixScale(item.matrix);
          const maxScale = Math.max(tmpScale.x, tmpScale.y, tmpScale.z);
          r = geo.boundingSphere.radius * maxScale;
        }
        tmpMin.set(center.x - r, center.y - r, center.z - r);
        tmpMax.set(center.x + r, center.y + r, center.z + r);
        bounds.expandByPoint(tmpMin);
        bounds.expandByPoint(tmpMax);
      }
      if (onProgress && items.length > 0) {
        onProgress(20 + Math.min(12, Math.floor(end / items.length * 12)), "正在统计大模型范围...");
      }
      if (end < items.length) {
        await this.yieldToMainThread();
      }
    }
    bounds.min.subScalar(0.1);
    bounds.max.addScalar(0.1);
    return bounds;
  }
  async createChunkGhostsProgressively(ghostSpecs) {
    if (ghostSpecs.length === 0) return;
    for (let start = 0; start < ghostSpecs.length; start += this.chunkGhostBatchSize) {
      const end = Math.min(ghostSpecs.length, start + this.chunkGhostBatchSize);
      let addedAnyGhost = false;
      for (let index = start; index < end; index++) {
        const spec = ghostSpecs[index];
        const chunk = this.getChunkById(spec.chunkId);
        if (!chunk || chunk.loaded || this.cancelledChunkIds.has(spec.chunkId)) continue;
        if (this.ghostGroup.getObjectByName(`ghost_${spec.chunkId}`)) continue;
        const edges = this.createGhostLine(`ghost_${spec.chunkId}`, spec.bounds);
        this.ghostGroup.add(edges);
        addedAnyGhost = true;
      }
      if (addedAnyGhost) {
        this.markSceneDirty();
      }
      if (end < ghostSpecs.length) {
        await this.yieldToMainThread();
      }
    }
  }
  async registerLeafChunksProgressively(object, leafNodes, onProgress) {
    const ghostSpecs = [];
    for (let start = 0; start < leafNodes.length; start += this.chunkRegistrationBatchSize) {
      const end = Math.min(leafNodes.length, start + this.chunkRegistrationBatchSize);
      for (let index = start; index < end; index++) {
        const node = leafNodes[index];
        const chunkId = `${object.uuid}_chunk_${index}`;
        const chunkBounds = node.bounds.clone();
        node.items.forEach((item) => {
          const treeNodes = this.nodeMap.get(item.uuid);
          if (treeNodes) {
            treeNodes.forEach((treeNode) => {
              if (treeNode.bimId === void 0) {
                treeNode.bimId = treeNode.id;
              }
              treeNode.chunkId = chunkId;
            });
          }
        });
        const paddedBounds = chunkBounds.clone();
        const padSize = chunkBounds.getSize(new THREE.Vector3()).multiplyScalar(this.chunkPadding);
        paddedBounds.expandByVector(padSize);
        this.registerChunk({
          id: chunkId,
          bounds: chunkBounds,
          paddedBounds,
          _padding: this.chunkPadding,
          center: chunkBounds.getCenter(new THREE.Vector3()),
          loaded: false,
          node,
          groupName: `optimized_${object.uuid}`,
          originalUuid: object.uuid
        });
        ghostSpecs.push({ chunkId, bounds: chunkBounds });
      }
      if (onProgress && leafNodes.length > 0) {
        onProgress(40 + Math.floor(end / leafNodes.length * 50), `正在生成分块... (${end}/${leafNodes.length})`);
      }
      if (end < leafNodes.length) {
        await this.yieldToMainThread();
      }
    }
    return ghostSpecs;
  }
  async buildLeafPlans(items, bounds, maxItemsPerNode, maxDepth) {
    const workerThreshold = this.resolvedChunkOptions.preferWorkerOctree ? 1200 : this.octreeWorkerThreshold;
    if (items.length < workerThreshold) {
      const octree = buildOctree(items, bounds, { maxItemsPerNode, maxDepth });
      return collectLeafNodes(octree).map((node) => ({
        bounds: node.bounds,
        level: node.level,
        items: node.items
      }));
    }
    const centers = new Float32Array(items.length * 3);
    const radii = new Float32Array(items.length);
    for (let i = 0; i < items.length; i++) {
      const center = items[i].center;
      centers[i * 3] = center.x;
      centers[i * 3 + 1] = center.y;
      centers[i * 3 + 2] = center.z;
      radii[i] = 0;
      if (i > 0 && i % 16e3 === 0) {
        await this.yieldToMainThread();
      }
    }
    const result = await this.runWorkerTask({
      taskType: "buildOctreePlan",
      centers,
      radii,
      bounds: [
        bounds.min.x,
        bounds.min.y,
        bounds.min.z,
        bounds.max.x,
        bounds.max.y,
        bounds.max.z
      ],
      maxItemsPerNode,
      maxDepth
    }, [centers.buffer, radii.buffer]);
    const leaves = [];
    for (let i = 0; i < result.length; i++) {
      const leaf = result[i];
      leaves.push({
        bounds: new THREE.Box3(
          new THREE.Vector3(leaf.bounds[0], leaf.bounds[1], leaf.bounds[2]),
          new THREE.Vector3(leaf.bounds[3], leaf.bounds[4], leaf.bounds[5])
        ),
        level: leaf.level,
        items: Array.from(leaf.itemIndices, (itemIndex) => items[itemIndex])
      });
      if (i > 0 && i % 120 === 0) {
        await this.yieldToMainThread();
      }
    }
    return leaves;
  }
  updateCameraClipping() {
    if (!this.sceneBounds || this.sceneBounds.isEmpty()) return;
    if (!this.sceneSphereValid) {
      this.sceneBounds.getBoundingSphere(this.cachedSceneSphere);
      this.sceneSphereValid = true;
    }
    const dist = this.camera.position.distanceTo(this.cachedSceneSphere.center);
    const range = Math.max(this.cachedSceneSphere.radius * 20, dist + this.cachedSceneSphere.radius * 5);
    const threshold = 0.01;
    if (Math.abs(this.camera.far - range) / Math.max(this.camera.far, 1) > threshold || Math.abs(this.camera.near - -range) / Math.max(Math.abs(this.camera.near), 1) > threshold) {
      this.camera.near = -range;
      this.camera.far = range;
      this.camera.updateProjectionMatrix();
    }
  }
  resize(width, height) {
    if (!this.canvas) return;
    let w = width;
    let h = height;
    if (w === void 0 || h === void 0) {
      const rect = this.canvas.parentElement?.getBoundingClientRect() || this.canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
    }
    w = Math.max(1, w);
    h = Math.max(1, h);
    if (w === 0 || h === 0) return;
    const aspect = w / h;
    const cam = this.camera;
    const currentHeight = cam.top - cam.bottom;
    const halfHeight = currentHeight / 2;
    const halfWidth = halfHeight * aspect;
    cam.left = -halfWidth;
    cam.right = halfWidth;
    cam.top = halfHeight;
    cam.bottom = -halfHeight;
    cam.updateProjectionMatrix();
    const maxRatio = this.settings.adaptiveQuality ? Math.min(window.devicePixelRatio, this.settings.maxPixelRatio ?? 2) : Math.min(window.devicePixelRatio, 2);
    this.activePixelRatio = maxRatio;
    this.renderer.setPixelRatio(maxRatio);
    this.renderer.setSize(w, h, false);
    if (this.controls) {
      this.controls.update();
    }
    this.renderer.render(this.scene, this.camera);
  }
  reportChunkProgress() {
    const result = reportChunkProgressIfNeeded({
      now: performance.now(),
      total: this.chunks.length,
      loaded: this.chunkLoadedCount,
      lastReportedProgress: this.lastReportedProgress,
      lastChunkProgressReportAt: this.lastChunkProgressReportAt
    });
    if (this.onChunkProgress && result.shouldNotify) {
      this.lastReportedProgress = result.nextProgress;
      this.lastChunkProgressReportAt = result.nextReportedAt;
      this.onChunkProgress(result.nextProgress.loaded, result.nextProgress.total);
    }
  }
  getChunkRuntimeProfile(chunkCount = this.chunks.length) {
    return selectChunkRuntimeProfile({
      chunkCount,
      compact: this.chunkRuntimeProfiles.compact,
      balanced: this.chunkRuntimeProfiles.balanced,
      massive: this.chunkRuntimeProfiles.massive
    });
  }
  isInPostMoveRecovery(now) {
    return !this.isCameraMoving && now < this.postMoveRecoveryUntil;
  }
  applyHighlightSettings() {
    const highlightMaterial = this.highlightMesh.material;
    if (highlightMaterial) {
      highlightMaterial.color.set(this.settings.highlightColor || "#ff9f1c");
      highlightMaterial.transparent = false;
      highlightMaterial.opacity = 1;
      highlightMaterial.depthTest = false;
      highlightMaterial.depthWrite = false;
      highlightMaterial.side = THREE.BackSide;
      highlightMaterial.needsUpdate = true;
    }
    const boxMaterial = this.selectionBox.material;
    if (Array.isArray(boxMaterial)) {
      boxMaterial.forEach((material) => material.color.set(this.settings.highlightColor || "#ff9f1c"));
    } else if (boxMaterial) {
      boxMaterial.color.set(this.settings.highlightColor || "#ff9f1c");
    }
  }
  getChunkRenderPhase(now) {
    if (this.isCameraMoving) return "moving";
    if (this.isInPostMoveRecovery(now)) return "recovery";
    return "idle";
  }
  getChunkFrameBudget(phase, profile, warmupExtra) {
    return computeChunkFrameBudget({
      forceMaxChunkLoadSpeed: this.forceMaxChunkLoadSpeed,
      maxChunkLoadsPerFrame: this.maxChunkLoadsPerFrame,
      performanceMode: this.settings.performanceMode ?? "balanced",
      chunkCount: this.chunks.length,
      phase,
      profile,
      warmupExtra
    });
  }
  isMovingPeripheralChunk(centrality, pixelSize, forwardness, profile) {
    return isMovingPeripheralChunk({
      centrality,
      pixelSize,
      forwardness,
      profile
    });
  }
  shouldRefreshPeripheralChunk(now, chunkIndex, totalChunks, profile) {
    const result = updatePeripheralRefreshWindow({
      now,
      isCameraMoving: this.isCameraMoving,
      chunkIndex,
      totalChunks,
      profile,
      movingPeripheralCursor: this.movingPeripheralCursor,
      movingPeripheralLastRefreshAt: this.movingPeripheralLastRefreshAt
    });
    this.movingPeripheralCursor = result.movingPeripheralCursor;
    this.movingPeripheralLastRefreshAt = result.movingPeripheralLastRefreshAt;
    return result.shouldRefresh;
  }
  checkCullingAndLoad(now = performance.now()) {
    if (!this.chunkLoadingEnabled) return;
    if (this.chunks.length === 0) return;
    this.reportChunkProgress();
    if (this.processingChunks.size >= this.maxConcurrentChunkLoads) return;
    const profile = this.getChunkRuntimeProfile();
    const phase = this.getChunkRenderPhase(now);
    const mode = this.settings.performanceMode ?? "balanced";
    this.camera.updateMatrixWorld();
    this.projScreenMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
    this.frustum.setFromProjectionMatrix(this.projScreenMatrix);
    const padding = this.chunkPadding;
    const cameraPos = this.camera.position;
    const cameraForward = this.chunkCullingTempForward;
    this.camera.getWorldDirection(cameraForward);
    const toChunkDirection = this.chunkCullingTempDirection;
    const tempSize = this.chunkCullingTempSize;
    const tempCenterNdc = this.chunkCullingTempCenterNdc;
    const viewHeight = (this.camera.top - this.camera.bottom) / this.camera.zoom;
    const canvasHeight = this.renderer.domElement.clientHeight;
    const toLoad = [];
    const loadedChunks = [];
    const isClippingActive = this.renderer.clippingPlanes.length > 0;
    let sceneMutated = false;
    const totalChunks = this.chunks.length;
    const cullingLoopStart = performance.now();
    const cullingTimeBudgetMs = phase === "moving" ? this.cullingTimeBudgetMovingMs : phase === "recovery" ? this.cullingTimeBudgetRecoveryMs : this.cullingTimeBudgetIdleMs;
    let abortedByBudget = false;
    const sampleUnloadedWhileMoving = mode !== "quality" && phase === "moving" && totalChunks > 1800;
    const movingSampleStride = sampleUnloadedWhileMoving ? totalChunks > 5e3 ? 8 : totalChunks > 3e3 ? 6 : 4 : 1;
    const movingSampleSeed = sampleUnloadedWhileMoving ? Math.floor(now / Math.max(1, profile.movingPeripheralRefreshMs)) % movingSampleStride : 0;
    const startIndex = totalChunks > 0 ? this.cullingScanCursor % totalChunks : 0;
    for (let scanOffset = 0; scanOffset < totalChunks; scanOffset++) {
      const chunkIndex = (startIndex + scanOffset) % totalChunks;
      const c = this.chunks[chunkIndex];
      if ((scanOffset & 31) === 0) {
        const elapsed = performance.now() - cullingLoopStart;
        if (elapsed > cullingTimeBudgetMs) {
          abortedByBudget = true;
          this.cullingScanCursor = (chunkIndex + 1) % totalChunks;
          break;
        }
      }
      ensureChunkSpatialState({
        chunk: c,
        padding,
        tempSize
      });
      const inFrustum = this.frustum.intersectsBox(c.paddedBounds);
      const isClipped = isClippingActive && this.isBoxClipped(c.bounds);
      const evaluation = evaluateChunkVisibility({
        chunk: c,
        chunkIndex,
        totalChunks,
        now,
        phase,
        profile,
        performanceMode: mode,
        isBoxClipped: isClipped,
        inFrustum,
        maxRenderDistance: this.maxRenderDistance,
        cameraPos,
        cameraForward,
        projScreenMatrix: this.projScreenMatrix,
        toChunkDirection,
        tempCenterNdc,
        viewHeight,
        canvasHeight,
        sampleUnloadedWhileMoving,
        movingSampleStride,
        movingSampleSeed,
        resolveShouldRefreshPeripheral: (isPeripheralWhileMoving) => !isPeripheralWhileMoving || this.shouldRefreshPeripheralChunk(now, chunkIndex, totalChunks, profile),
        chunkWarmupActive: this.chunkWarmupActive,
        chunkLoadedCount: this.chunkLoadedCount,
        initialChunkLoadTarget: this.initialChunkLoadTarget,
        chunkLoadResumeAt: this.chunkLoadResumeAt,
        chunkMeshCached: this.chunkMeshCache.has(c.id)
      });
      if (evaluation.shouldSkipSample) {
        continue;
      }
      if (evaluation.effectiveVisible) {
        c.lastVisibleAt = now;
      }
      if (evaluation.centrality > 0.42 || evaluation.forwardness > 0.55) {
        c.lastFocusAt = now;
      }
      c.lastEffectiveVisible = evaluation.effectiveVisible;
      if (c.loaded) {
        loadedChunks.push(c);
        if (c.mesh) {
          if (c.mesh.visible !== evaluation.effectiveVisible) {
            c.mesh.visible = evaluation.effectiveVisible;
            sceneMutated = true;
          }
        } else {
          const optimizedGroup = this.contentGroup.getObjectByName(c.groupName);
          const bm = optimizedGroup?.getObjectByName(c.id);
          if (bm) {
            c.mesh = bm;
            bm.visible = evaluation.effectiveVisible;
            sceneMutated = true;
          }
        }
      } else if (!this.processingChunks.has(c.id) && evaluation.shouldBeVisible && evaluation.priority !== null) {
        c.priority = evaluation.priority;
        toLoad.push(c);
      }
    }
    if (!abortedByBudget) {
      this.cullingScanCursor = (startIndex + totalChunks) % Math.max(totalChunks, 1);
    }
    const unloadTargets = selectChunksToUnload({
      isCameraMoving: this.isCameraMoving,
      loadedChunks,
      maxLoadedChunks: this.maxLoadedChunks,
      cameraPos,
      now,
      chunkResidencyMs: this.chunkResidencyMs
    });
    for (const chunk of unloadTargets) {
      this.unloadChunk(chunk);
    }
    if (unloadTargets.length > 0) {
      sceneMutated = true;
    }
    const loadPlan = planChunkLoads({
      toLoad,
      now: performance.now(),
      chunkLoadResumeAt: this.chunkLoadResumeAt,
      maxConcurrentChunkLoads: this.maxConcurrentChunkLoads,
      processingChunkCount: this.processingChunks.size,
      chunkWarmupActive: this.chunkWarmupActive,
      chunkLoadedCount: this.chunkLoadedCount,
      initialChunkLoadTarget: this.initialChunkLoadTarget,
      warmupChunkBoost: this.warmupChunkBoost,
      getChunkFrameBudget: (nextPhase, nextProfile, warmupExtra) => this.getChunkFrameBudget(nextPhase, nextProfile, warmupExtra),
      phase,
      profile
    });
    for (const chunk of loadPlan) {
      this.loadChunk(chunk);
    }
    if (loadPlan.length > 0) {
      sceneMutated = true;
    }
    this.schedulePrefetchFromVisibleChunks(loadedChunks);
    if (!this.forceMaxChunkLoadSpeed) ;
    if (abortedByBudget) {
      this.cullingDirty = true;
    }
    if (this.chunkWarmupActive && this.chunkLoadedCount >= this.initialChunkLoadTarget) {
      this.chunkWarmupActive = false;
      sceneMutated = true;
    }
    if (sceneMutated || abortedByBudget) {
      this.markSceneDirty();
    }
  }
  async runWorkerTask(data, transferables) {
    return queueChunkWorkerTask({
      workerQueue: this.workerQueue,
      data,
      transferables,
      processQueue: () => this.processWorkerQueue()
    });
  }
  processWorkerQueue() {
    processChunkWorkerQueue({
      activeWorkerCount: this.activeWorkerCount,
      maxWorkers: this.maxWorkers,
      workerQueue: this.workerQueue,
      workers: this.workers,
      createWorker: () => {
        return new Worker(new URL(/* @vite-ignore */ ""+new URL('assets/chunkWorker-46LMRdEv.js', import.meta.url).href+"", import.meta.url), { type: "module" });
      },
      getActiveWorkerCount: () => this.activeWorkerCount,
      onActiveWorkerCountChange: (count) => {
        this.activeWorkerCount = count;
      },
      processQueue: () => this.processWorkerQueue()
    });
  }
  unloadChunk(chunk) {
    const result = applyUnloadChunk({
      chunk,
      unregisterOptimizedMeshMapping: (mesh) => this.unregisterOptimizedMeshMapping(mesh),
      cacheChunkMesh: (nextChunk, mesh) => this.cacheChunkMesh(nextChunk, mesh),
      ensureChunkGhost: (nextChunk) => this.ensureChunkGhost(nextChunk)
    });
    if (!result.changed) return;
    this.chunkLoadedCount = Math.max(0, this.chunkLoadedCount + result.chunkLoadedCountDelta);
    this.markSceneDirty({
      invalidateInteractables: true,
      needsBoundsUpdate: true,
      needsCulling: true
    });
  }
  async loadChunk(chunk) {
    this.processingChunks.add(chunk.id);
    this.markSceneDirty();
    try {
      let loadedNow = false;
      let needsRender = false;
      let needsBoundsUpdate = false;
      let invalidateInteractables = false;
      let needsCulling = false;
      const { mesh: bm, prefetchCandidates } = await resolveChunkMeshForLoad({
        chunk,
        sharedMaterial: this.sharedMaterial,
        takeCachedChunkMesh: (chunkId) => this.takeCachedChunkMesh(chunkId),
        yieldToMainThread: () => this.yieldToMainThread(),
        nbimFiles: this.nbimFiles,
        hasValidChunkBinaryRange: (nextChunk) => this.hasValidChunkBinaryRange(nextChunk),
        readChunkBuffer: (nextChunk) => this.readChunkBuffer(nextChunk),
        nbimMeta: this.nbimMeta,
        runWorkerTask: (data, transferables) => this.runWorkerTask(data, transferables),
        reconstructBatchedMesh: (data, material) => reconstructBatchedMeshFromWorkerData({
          data,
          material,
          resolveUuidByBimId: (originalUuid, bimId) => {
            const key = `${originalUuid}::${bimId}`;
            const nodeIds = this.bimIdToNodeIds.get(key);
            return nodeIds?.[0] || bimId || originalUuid;
          }
        }),
        isCameraMoving: this.isCameraMoving,
        chunkPrefetchWindow: this.resolvedChunkOptions.chunkPrefetchWindow,
        getChunkIndex: (chunkId) => this.getChunkIndex(chunkId),
        chunks: this.chunks,
        processingChunks: this.processingChunks
      });
      if (prefetchCandidates.length > 0) {
        this.enqueueChunkPrefetch(prefetchCandidates);
        void this.processPrefetchQueue();
      }
      if (bm) {
        const attached = attachLoadedChunkMesh({
          chunk,
          mesh: bm,
          cancelledChunkIds: this.cancelledChunkIds,
          chunkIdSet: this.chunkIdSet,
          disposeChunkMesh: (mesh) => this.disposeChunkMesh(mesh),
          globalOffset: this.globalOffset,
          contentGroup: this.contentGroup,
          registerOptimizedMeshMapping: (mesh) => this.registerOptimizedMeshMapping(mesh)
        });
        loadedNow = attached.attached;
        if (loadedNow) {
          invalidateInteractables = true;
          needsBoundsUpdate = true;
          needsRender = true;
        }
      }
      const finalized = finalizeLoadedChunk({
        chunk,
        loadedNow,
        now: performance.now(),
        chunkLoadedCount: this.chunkLoadedCount,
        chunkWarmupActive: this.chunkWarmupActive,
        initialChunkLoadTarget: this.initialChunkLoadTarget,
        deactivateFastPreviewForModel: (originalUuid) => this.deactivateFastPreviewForModel(originalUuid)
      });
      this.chunkLoadedCount = finalized.nextChunkLoadedCount;
      this.chunkWarmupActive = finalized.nextChunkWarmupActive;
      if (finalized.progressChanged) {
        this.reportChunkProgress();
        needsCulling = true;
        needsRender = true;
      }
      this.cancelledChunkIds.delete(chunk.id);
      const ghostCleanup = cleanupChunkGhost({
        chunkId: chunk.id,
        ghostGroup: this.ghostGroup,
        releaseGhostLine: (line) => this.releaseGhostLine(line)
      });
      if (ghostCleanup.changed) {
        needsRender = true;
      }
      if (needsRender) {
        this.markSceneDirty({
          invalidateInteractables,
          needsBoundsUpdate,
          needsCulling
        });
      }
    } catch (err) {
      console.error(`加载分块 ${chunk.id} 失败:`, err);
    } finally {
      this.processingChunks.delete(chunk.id);
      this.markSceneDirty();
    }
  }
  setChunkLoadingEnabled(enabled) {
    this.chunkLoadingEnabled = enabled;
    this.prefetchPaused = !enabled;
    this.cullingDirty = true;
    if (enabled) {
      this.checkCullingAndLoad();
      return;
    }
    this.markSceneDirty();
  }
  applyNbimScaleTuning(chunkCount) {
    const userChunkOptions = this.options.chunkOptions || {};
    const autoTuned = chunkCount >= 2e3 ? { chunkPrefetchWindow: 0, chunkReadCacheSize: 128, targetMinFps: 20 } : chunkCount <= 1e3 ? { chunkPrefetchWindow: 0, chunkReadCacheSize: 128, targetMinFps: 20 } : { chunkPrefetchWindow: 0, chunkReadCacheSize: 128, targetMinFps: 20 };
    this.setChunkOptions({
      chunkPrefetchWindow: userChunkOptions.chunkPrefetchWindow ?? autoTuned.chunkPrefetchWindow,
      chunkReadCacheSize: userChunkOptions.chunkReadCacheSize ?? autoTuned.chunkReadCacheSize,
      targetMinFps: userChunkOptions.targetMinFps ?? autoTuned.targetMinFps,
      ghostMode: userChunkOptions.ghostMode ?? this.resolvedChunkOptions.ghostMode,
      loadProfile: userChunkOptions.loadProfile ?? this.resolvedChunkOptions.loadProfile,
      deferIfcProperties: userChunkOptions.deferIfcProperties ?? this.resolvedChunkOptions.deferIfcProperties,
      preferWorkerOctree: userChunkOptions.preferWorkerOctree ?? this.resolvedChunkOptions.preferWorkerOctree,
      fastGeometrySanitize: userChunkOptions.fastGeometrySanitize ?? this.resolvedChunkOptions.fastGeometrySanitize
    });
  }
  setChunkOptions(options = {}) {
    const resolved = resolveSceneChunkOptions(options);
    this.resolvedChunkOptions.chunkReadCacheSize = resolved.chunkReadCacheSize;
    this.resolvedChunkOptions.chunkPrefetchWindow = resolved.chunkPrefetchWindow;
    this.resolvedChunkOptions.ghostMode = resolved.ghostMode;
    this.resolvedChunkOptions.targetMinFps = resolved.targetMinFps;
    this.resolvedChunkOptions.loadProfile = resolved.loadProfile;
    this.resolvedChunkOptions.deferIfcProperties = resolved.deferIfcProperties;
    this.resolvedChunkOptions.preferWorkerOctree = resolved.preferWorkerOctree;
    this.resolvedChunkOptions.fastGeometrySanitize = resolved.fastGeometrySanitize;
    this.settings.targetFps = resolved.targetMinFps;
    while (this.chunkReadCacheOrder.length > this.resolvedChunkOptions.chunkReadCacheSize) {
      const evict = this.chunkReadCacheOrder.shift();
      if (!evict) continue;
      this.chunkReadCache.delete(evict);
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
  setContentVisible(visible) {
    this.contentGroup.visible = visible;
    this.ghostGroup.visible = visible;
    this.renderer.render(this.scene, this.camera);
  }
  buildSceneGraph(object) {
    const fallbackName = object.isMesh ? `Mesh_${object.id}` : `Group_${object.id}`;
    const node = {
      id: object.uuid,
      name: sanitizeDisplayLabel(object.name, object.userData?.name) || fallbackName,
      type: object.isMesh ? "Mesh" : "Group",
      children: [],
      bimId: object.userData?.bimId ? String(object.userData.bimId) : object.userData?.expressID !== void 0 ? String(object.userData.expressID) : object.name ? String(object.name) : void 0,
      userData: { ...object.userData }
    };
    if (!this.nodeMap.has(object.uuid)) this.nodeMap.set(object.uuid, []);
    this.nodeMap.get(object.uuid).push(node);
    for (const child of object.children) {
      node.children.push(this.buildSceneGraph(child));
    }
    return node;
  }
  /**
   * 构建基于 IFC 图层和空间结构的复合树
   */
  buildIFCStructure(object) {
    const buildSpatialRecursive = (obj) => {
      const fallbackName = obj.isMesh ? `Mesh_${obj.id}` : `Group_${obj.id}`;
      const node = {
        id: obj.uuid,
        name: sanitizeDisplayLabel(obj.name, obj.userData?.name) || fallbackName,
        type: obj.isMesh ? "Mesh" : "Group",
        children: [],
        bimId: obj.userData?.bimId ? String(obj.userData.bimId) : obj.userData?.expressID !== void 0 ? String(obj.userData.expressID) : obj.name ? String(obj.name) : void 0,
        userData: { ...obj.userData }
      };
      if (!this.nodeMap.has(obj.uuid)) this.nodeMap.set(obj.uuid, []);
      this.nodeMap.get(obj.uuid).push(node);
      for (const child of obj.children) {
        if (child.userData?.isIfcGridHelper) continue;
        node.children.push(buildSpatialRecursive(child));
      }
      return node;
    };
    return buildSpatialRecursive(object);
  }
  async prepareObjectRuntimeData(object, maxAnisotropy, batchSize = 6e3) {
    const stack = [object];
    let traverseIndex = 0;
    while (stack.length > 0) {
      const child = stack.pop();
      if (child.isMesh) {
        const mesh = child;
        this.componentMap.set(mesh.uuid, mesh);
        if (mesh.userData.expressID !== void 0) {
          this.componentMap.set(mesh.userData.expressID, mesh);
        }
        if (!mesh.userData.bimId) {
          if (mesh.userData.expressID !== void 0) mesh.userData.bimId = String(mesh.userData.expressID);
          else mesh.userData.bimId = mesh.uuid;
        }
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            if (mat.map) {
              mat.map.anisotropy = maxAnisotropy;
            }
          });
        }
      }
      traverseIndex++;
      for (let i = child.children.length - 1; i >= 0; i--) {
        stack.push(child.children[i]);
      }
      if (traverseIndex > 0 && traverseIndex % batchSize === 0) {
        await this.yieldToMainThread();
      }
    }
  }
  applyGlobalOffsetForModel(object) {
    const modelBox = new THREE.Box3().setFromObject(object);
    if (modelBox.isEmpty()) return modelBox;
    if (this.globalOffset.length() === 0) {
      modelBox.getCenter(this.globalOffset);
      console.log("初始化全局偏移以解决大坐标问题:", this.globalOffset);
    }
    object.position.sub(this.globalOffset);
    object.updateMatrixWorld(true);
    return new THREE.Box3().setFromObject(object);
  }
  configureModelWarmup(meshCount) {
    this.chunkWarmupActive = true;
    if (this.resolvedChunkOptions.loadProfile === "max-speed") {
      this.initialChunkLoadTarget = meshCount > 1e5 ? 42 : meshCount > 3e4 ? 32 : 20;
      this.warmupChunkBoost = 16;
      return;
    }
    this.initialChunkLoadTarget = meshCount > 1e5 ? 24 : meshCount > 3e4 ? 18 : 12;
    this.warmupChunkBoost = 12;
  }
  prepareStructureStage(object, meshCount, onProgress) {
    const shouldDeferStructure = meshCount >= this.deferredStructureThreshold;
    let deferredPlaceholderId = null;
    if (onProgress) {
      onProgress(5, shouldDeferStructure ? "正在准备轻量预览..." : "正在构建场景树...");
    }
    if (shouldDeferStructure) {
      deferredPlaceholderId = `deferred_${object.uuid}`;
      const placeholder = {
        id: deferredPlaceholderId,
        name: `${object.name || "Model"} (${meshCount} meshes)`,
        type: "Group",
        children: [],
        userData: {
          originalUuid: object.uuid,
          deferred: true,
          meshCount
        }
      };
      this.attachStructureRoot(placeholder);
      if (this.onStructureUpdate) this.onStructureUpdate();
    } else {
      const modelRoot = this.buildAndRegisterModelStructure(object);
      this.attachStructureRoot(modelRoot);
    }
    return { shouldDeferStructure, deferredPlaceholderId };
  }
  prepareModelBoundsStage(object, modelBox) {
    if (!modelBox.isEmpty()) {
      this.precomputedBounds.union(modelBox);
      this.sceneBounds.copy(this.precomputedBounds);
    }
    return !modelBox.isEmpty() ? this.createPreviewGhost(modelBox.clone(), `preview_${object.uuid}`) : null;
  }
  async prepareModelRuntimeStage(object, meshCount) {
    const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
    const shouldDeferRuntimeData = meshCount > 3e4;
    if (shouldDeferRuntimeData) {
      void this.prepareObjectRuntimeData(object, maxAnisotropy, 8e3);
    } else {
      await this.prepareObjectRuntimeData(object, maxAnisotropy, 6e3);
    }
  }
  prepareFastVisibleStage(object, meshCount, onProgress) {
    if (meshCount < 12e3) return false;
    let visibleCount = 0;
    const limit = this.fastPreviewMeshLimit;
    object.traverse((child) => {
      if (!child.isMesh) return;
      const mesh = child;
      const isVisible = visibleCount < limit;
      mesh.visible = isVisible;
      mesh.userData.fastPreview = isVisible;
      if (isVisible) visibleCount++;
    });
    if (onProgress) {
      onProgress(8, `正在准备快速预览... (${visibleCount} meshes)`);
    }
    if (visibleCount > 0) {
      object.userData.fastPreviewActive = true;
      this.fastPreviewModels.add(object.uuid);
    }
    return visibleCount > 0;
  }
  attachModelToContentGroup(object, keepVisible = false) {
    const fileGroup = new THREE.Group();
    fileGroup.name = `file_${object.uuid}`;
    fileGroup.userData.originalUuid = object.uuid;
    const modelName = sanitizeFileStem(
      sanitizeDisplayLabel(
        typeof object.userData?.modelName === "string" ? object.userData.modelName : "",
        stripFileExtension(object.name),
        object.name
      ) || "model"
    );
    fileGroup.userData.modelName = modelName;
    object.userData.originalUuid = object.uuid;
    object.userData.modelName = modelName;
    fileGroup.add(object);
    object.visible = keepVisible;
    this.contentGroup.add(fileGroup);
    this.markSceneDirty({
      invalidateInteractables: true,
      needsRender: false
    });
  }
  async prepareModelChunkStage(object, meshCount, onProgress) {
    if (onProgress) onProgress(10, "正在收集构件...");
    const preferFastCollect = this.resolvedChunkOptions.loadProfile === "max-speed";
    const collectBatchedThreshold = preferFastCollect ? 1200 : this.octreeWorkerThreshold;
    const items = meshCount >= collectBatchedThreshold ? await collectItemsBatched(object, {
      batchSize: preferFastCollect ? 5200 : 3e3,
      onProgress: (processed, total) => {
        if (!onProgress || total === 0) return;
        const ratio = processed / total;
        onProgress(10 + Math.round(ratio * 10), `正在收集构件... (${processed}/${total})`);
      }
    }) : collectItems(object);
    if (items.length === 0) return;
    if (onProgress) onProgress(20, `已收集 ${items.length} 个构件，正在计算八叉树...`);
    const bounds = await this.computeItemBoundsProgressively(items, onProgress);
    if (onProgress) onProgress(35, "正在计算八叉树...");
    const maxItemsPerNode = 3e3;
    const maxDepth = 6;
    const leafNodes = await this.buildLeafPlans(items, bounds, maxItemsPerNode, maxDepth);
    const ghostSpecs = await this.registerLeafChunksProgressively(object, leafNodes, onProgress);
    this.reportChunkProgress();
    this.checkCullingAndLoad();
    void this.createChunkGhostsProgressively(ghostSpecs);
    const meshesToHideSet = /* @__PURE__ */ new Set();
    for (const item of items) {
      const sourceMesh = item.sourceMesh;
      if (sourceMesh?.isMesh) {
        meshesToHideSet.add(sourceMesh);
      }
    }
    const meshesToHide = meshesToHideSet.size > 0 ? Array.from(meshesToHideSet) : (() => {
      const fallbackMeshes = [];
      object.traverse((child) => {
        if (child.isMesh) {
          fallbackMeshes.push(child);
        }
      });
      return fallbackMeshes;
    })();
    for (let i = 0; i < meshesToHide.length; i++) {
      const child = meshesToHide[i];
      if (object.userData.fastPreviewActive && child.userData.fastPreview) {
        continue;
      }
      child.visible = false;
      child.userData.isOptimized = true;
      if (i > 0 && i % 6e3 === 0) {
        await this.yieldToMainThread();
      }
    }
    if (onProgress) onProgress(95, "分块准备完成");
  }
  finalizeModelStage(previewGhost, onProgress) {
    this.sceneBounds = this.computeTotalBounds(false);
    this.precomputedBounds = this.sceneBounds.clone();
    if (this.globalOffset.length() > 0) {
      this.precomputedBounds.translate(this.globalOffset);
    }
    this.updateSettings(this.settings);
    if (onProgress) onProgress(100, "模型已加入加载队列");
    this.checkCullingAndLoad();
    if (!previewGhost) return;
    this.ghostGroup.remove(previewGhost);
    this.releaseGhostLine(previewGhost);
    this.markSceneDirty();
  }
  cancelDeferredStructureBuild() {
    if (this.deferredStructureTimer) {
      clearTimeout(this.deferredStructureTimer);
      this.deferredStructureTimer = null;
    }
    this.deferredStructureToken++;
  }
  beginLoadGeneration() {
    this.loadGeneration += 1;
    return this.loadGeneration;
  }
  isLoadGenerationCurrent(generation) {
    return generation === this.loadGeneration;
  }
  deactivateFastPreviewForModel(originalUuid) {
    if (!this.fastPreviewModels.has(originalUuid)) return;
    this.fastPreviewModels.delete(originalUuid);
    const fileGroup = this.contentGroup.getObjectByName(`file_${originalUuid}`);
    if (!fileGroup) return;
    fileGroup.traverse((child) => {
      if (child.isMesh) {
        child.visible = false;
        if (child.userData.fastPreview) delete child.userData.fastPreview;
      }
      if (child.userData?.fastPreviewActive) {
        child.userData.fastPreviewActive = false;
      }
    });
  }
  scheduleDeferredStructureReplacement(object, shouldDeferStructure, deferredPlaceholderId) {
    if (shouldDeferStructure && deferredPlaceholderId) {
      this.cancelDeferredStructureBuild();
      const token = this.deferredStructureToken;
      this.deferredStructureTimer = setTimeout(() => {
        try {
          if (token !== this.deferredStructureToken) return;
          const modelRoot = this.buildAndRegisterModelStructure(object);
          this.replaceStructureNode(deferredPlaceholderId, modelRoot);
          if (this.onStructureUpdate) this.onStructureUpdate();
        } catch (error) {
          console.warn("延迟构建结构树失败:", error);
        }
      }, 80);
      return;
    }
    if (this.onStructureUpdate) {
      this.onStructureUpdate();
    }
  }
  async addModel(object, onProgress) {
    object.updateMatrixWorld(true);
    const modelBox = this.applyGlobalOffsetForModel(object);
    const objectOverview = this.collectObjectOverview(object);
    const meshCount = objectOverview.meshes;
    this.configureModelWarmup(meshCount);
    this.registerOriginalStats(object.uuid, objectOverview);
    const { shouldDeferStructure, deferredPlaceholderId } = this.prepareStructureStage(object, meshCount, onProgress);
    const previewGhost = this.prepareModelBoundsStage(object, modelBox);
    const quickVisibleEnabled = this.prepareFastVisibleStage(object, meshCount, onProgress);
    await this.prepareModelRuntimeStage(object, meshCount);
    this.attachModelToContentGroup(object, quickVisibleEnabled);
    await this.prepareModelChunkStage(object, meshCount, onProgress);
    this.finalizeModelStage(previewGhost, onProgress);
    this.scheduleDeferredStructureReplacement(object, shouldDeferStructure, deferredPlaceholderId);
  }
  removeObject(uuid) {
    this.cancelDeferredStructureBuild();
    const nodes = this.nodeMap.get(uuid);
    const originalUuid = nodes?.[0]?.userData?.originalUuid || uuid;
    const optimizedGroupsToRemove = [];
    this.contentGroup.traverse((child) => {
      const isMatch = child.name === `optimized_${uuid}` || child.name === `file_${uuid}` || child.userData.originalUuid === uuid || child.userData.originalUuid === originalUuid || child.name.startsWith("optimized_") && (child.userData.originalUuid === uuid || child.userData.originalUuid === originalUuid) || child.name.startsWith("file_") && (child.userData.originalUuid === uuid || child.userData.originalUuid === originalUuid);
      if (isMatch) {
        optimizedGroupsToRemove.push(child);
      }
    });
    optimizedGroupsToRemove.forEach((group) => {
      group.traverse((child) => {
        if (child.isBatchedMesh) {
          const bm = child;
          this.disposeChunkMesh(bm);
        }
      });
      group.removeFromParent();
    });
    const obj = this.contentGroup.getObjectByProperty("uuid", uuid);
    const processRemoval = (o) => {
      const id = o instanceof THREE.Object3D ? o.uuid : o.id;
      const mappings = this.optimizedMapping.get(id);
      if (mappings) {
        mappings.forEach((m) => {
          m.mesh.setVisibleAt(m.instanceId, false);
        });
        this.optimizedMapping.delete(id);
      }
      if (o.isMesh) {
        const mesh = o;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((m) => m.dispose());
        }
      } else if (o.isBatchedMesh) {
        const bm = o;
        this.disposeChunkMesh(bm);
      }
      this.componentMap.delete(id);
      if (o instanceof THREE.Object3D && o.userData.expressID !== void 0) {
        this.componentMap.delete(o.userData.expressID);
      }
      const nodeInfos = this.nodeMap.get(id);
      if (nodeInfos) {
        nodeInfos.forEach((nodeInfo) => {
          if (nodeInfo.bimId !== void 0) {
            this.componentMap.delete(nodeInfo.bimId);
          }
        });
      }
      this.nodeMap.delete(id);
    };
    if (obj) {
      obj.traverse(processRemoval);
      obj.removeFromParent();
    } else if (nodes && nodes.length > 0) {
      const traverseNode = (n) => {
        processRemoval(n);
        if (n.children) n.children.forEach(traverseNode);
      };
      traverseNode(nodes[0]);
    }
    this.markSceneDirty({
      invalidateInteractables: true,
      needsRender: false
    });
    this.unregisterOriginalStats(originalUuid);
    this.fastPreviewModels.delete(uuid);
    this.fastPreviewModels.delete(originalUuid);
    this.clearChunkCache((chunkId, mesh) => {
      const owner = mesh.userData.originalUuid || "";
      return owner === uuid || owner === originalUuid || chunkId.startsWith(uuid) || chunkId.startsWith(originalUuid);
    });
    if (this.currentMeasureModelUuid === uuid || this.currentMeasureModelUuid === originalUuid) {
      this.currentMeasureModelUuid = null;
    }
    this.chunks = this.chunks.filter((c) => {
      const isMatch = c.originalUuid === uuid || c.originalUuid === originalUuid || c.id.startsWith(uuid);
      if (isMatch) {
        this.cancelledChunkIds.add(c.id);
        this.processingChunks.delete(c.id);
        const ghost = this.ghostGroup.getObjectByName(`ghost_${c.id}`);
        if (ghost) {
          this.ghostGroup.remove(ghost);
          this.releaseGhostLine(ghost);
        }
        return false;
      }
      return true;
    });
    this.rebuildChunkIdSet();
    if (this.structureRoot) {
      const filterNodes = (nodes2) => {
        return nodes2.filter((n) => {
          if (n.id === uuid) return false;
          if (!this.nodeMap.has(n.id) && n.id !== "root") return false;
          if (n.children) {
            n.children = filterNodes(n.children);
          }
          return true;
        });
      };
      if (this.structureRoot.id === uuid) {
        this.structureRoot = { id: "root", name: "Root", type: "Group", children: [] };
      } else if (this.structureRoot.children) {
        this.structureRoot.children = filterNodes(this.structureRoot.children);
      }
    }
    this.precomputedBounds = this.computeTotalBounds();
    if (this.precomputedBounds.isEmpty()) {
      this.contentGroup.traverse((child) => {
        if (child.isMesh && child.visible) {
          const box = new THREE.Box3().setFromObject(child);
          if (!box.isEmpty()) this.precomputedBounds.union(box);
        }
      });
    }
    this.updateSceneBounds();
    if (this.onStructureUpdate) this.onStructureUpdate();
    this.markSceneDirty({
      invalidateInteractables: true,
      needsBoundsUpdate: true,
      needsCulling: true
    });
    this.measureRecords.forEach((record, recordId) => {
      let isRelated = record.modelUuid === uuid || record.modelUuid === originalUuid;
      if (!isRelated && record.modelUuid && obj) {
        obj.traverse((child) => {
          if (child.uuid === record.modelUuid) {
            isRelated = true;
          }
        });
      }
      if (isRelated) {
        this.removeMeasurement(recordId);
      }
    });
    return true;
  }
  async removeModel(uuid) {
    return this.removeObject(uuid);
  }
  // --- NBIM 导入/导出功能 ---
  generateChunkBinaryV8(items, bimIdToIndex) {
    const uniqueGeos = [];
    const geoMap = /* @__PURE__ */ new Map();
    items.forEach((item) => {
      if (item.geometry && !geoMap.has(item.geometry)) {
        geoMap.set(item.geometry, uniqueGeos.length);
        uniqueGeos.push(item.geometry);
      }
    });
    let size = 4;
    for (const geo of uniqueGeos) {
      const vertCount = geo.attributes.position.count;
      const index = geo.index;
      const indexCount = index ? index.count : 0;
      size += 4 + 4 + vertCount * 12 + vertCount * 12;
      if (indexCount > 0) size += indexCount * 4;
    }
    size += 4;
    size += items.length * (4 + 4 + 4 + 64 + 4);
    const buffer = new ArrayBuffer(size);
    const dv = new DataView(buffer);
    let offset = 0;
    dv.setUint32(offset, uniqueGeos.length, true);
    offset += 4;
    for (const geo of uniqueGeos) {
      const pos = geo.getAttribute("position");
      const norm = geo.getAttribute("normal");
      const count = pos.count;
      const index = geo.index;
      const indexCount = index ? index.count : 0;
      dv.setUint32(offset, count, true);
      offset += 4;
      dv.setUint32(offset, indexCount, true);
      offset += 4;
      for (let i = 0; i < count; i++) {
        dv.setFloat32(offset, pos.getX(i), true);
        offset += 4;
        dv.setFloat32(offset, pos.getY(i), true);
        offset += 4;
        dv.setFloat32(offset, pos.getZ(i), true);
        offset += 4;
      }
      for (let i = 0; i < count; i++) {
        dv.setFloat32(offset, norm.getX(i), true);
        offset += 4;
        dv.setFloat32(offset, norm.getY(i), true);
        offset += 4;
        dv.setFloat32(offset, norm.getZ(i), true);
        offset += 4;
      }
      if (index && indexCount > 0) {
        for (let i = 0; i < indexCount; i++) {
          dv.setUint32(offset, index.getX(i), true);
          offset += 4;
        }
      }
    }
    dv.setUint32(offset, items.length, true);
    offset += 4;
    for (const item of items) {
      const treeNodes = this.nodeMap.get(item.uuid);
      const firstNode = treeNodes?.[0];
      const bimId = item.bimId || firstNode?.bimId || firstNode?.id || item.uuid;
      const bimIdIndex = bimIdToIndex.get(bimId) ?? 0;
      dv.setUint32(offset, bimIdIndex, true);
      offset += 4;
      const typeIndex = typeof item.typeIndex === "number" ? item.typeIndex : 0;
      dv.setUint32(offset, typeIndex, true);
      offset += 4;
      dv.setUint32(offset, item.color, true);
      offset += 4;
      const elements = item.matrix.elements;
      for (let k = 0; k < 16; k++) {
        dv.setFloat32(offset, elements[k], true);
        offset += 4;
      }
      const geoId = geoMap.get(item.geometry) || 0;
      dv.setUint32(offset, geoId, true);
      offset += 4;
    }
    return buffer;
  }
  async exportNbim(fileName) {
    if (this.chunks.length === 0) throw new Error("无模型数据可导出");
    const bimIdTable = [""];
    const bimIdToIndex = /* @__PURE__ */ new Map();
    const addBimId = (bimId) => {
      if (!bimId) return;
      if (bimIdToIndex.has(bimId)) return;
      const idx = bimIdTable.length;
      bimIdTable.push(bimId);
      bimIdToIndex.set(bimId, idx);
    };
    const traverseBimIds = (node) => {
      addBimId(node.bimId);
      if (node.children) node.children.forEach(traverseBimIds);
    };
    traverseBimIds(this.structureRoot);
    const { ifcApiByModel, ifcManagerByModel } = collectIfcModelReferences(this.contentGroup);
    const bimProperties = await collectNbimBimProperties({
      structureRoot: this.structureRoot,
      ifcApiByModel,
      ifcManagerByModel
    });
    const { chunkBlobs, exportChunks, currentOffset } = await prepareNbimExportChunks({
      chunks: this.chunks,
      nbimFiles: this.nbimFiles,
      nbimMeta: this.nbimMeta,
      bimIdToIndex,
      hasValidChunkBinaryRange: (chunk) => this.hasValidChunkBinaryRange(chunk),
      generateChunkBinaryV8: (items, indexMap) => this.generateChunkBinaryV8(items, indexMap)
    });
    const manifest = {
      globalBounds: {
        min: { x: this.sceneBounds.min.x, y: this.sceneBounds.min.y, z: this.sceneBounds.min.z },
        max: { x: this.sceneBounds.max.x, y: this.sceneBounds.max.y, z: this.sceneBounds.max.z }
      },
      chunks: exportChunks,
      stats: this.originalStats,
      structureTree: buildExportStructureTree(this.structureRoot),
      bimIdTable,
      bimProperties
    };
    const manifestBytes = encodeNbimManifest(manifest, this.structureRoot);
    const header = new ArrayBuffer(1024);
    const dv = new DataView(header);
    dv.setUint32(0, 1296646734, true);
    dv.setUint32(4, 8, true);
    dv.setUint32(8, currentOffset, true);
    dv.setUint32(12, manifestBytes.byteLength, true);
    const blobParts = [header, ...chunkBlobs, manifestBytes];
    const finalBlob = new Blob(blobParts, { type: "application/octet-stream" });
    const url = URL.createObjectURL(finalBlob);
    const a = document.createElement("a");
    a.href = url;
    const defaultStem = deriveDefaultNbimStem(this.contentGroup);
    const resolvedName = sanitizeFileStem(stripFileExtension((fileName || "").trim()) || defaultStem);
    a.download = `${resolvedName}.nbim`;
    a.click();
    URL.revokeObjectURL(url);
  }
  async loadNbim(file, onProgress) {
    const fileId = `nbim_${file.name}_${(/* @__PURE__ */ new Date()).getTime()}`;
    this.nbimFiles.set(fileId, file);
    if (onProgress) onProgress(10, "正在解析 NBIM 文件头...");
    const header = await readNbimHeader(file);
    const magic = header.magic;
    if (magic !== 1296646734) throw new Error("不是有效的 NBIM 文件");
    const version = header.version;
    if (version !== 8) {
      throw new Error(`不支持的 NBIM 版本: ${version}，当前仅支持 V8`);
    }
    if (onProgress) onProgress(20, "正在读取元数据...");
    const manifest = await readNbimManifest(file, header);
    this.nbimMeta.set(fileId, { version, bimIdTable: manifest.bimIdTable });
    const boundsState = applyNbimGlobalBounds({
      globalBounds: manifest.globalBounds,
      precomputedBounds: this.precomputedBounds,
      sceneBounds: this.sceneBounds,
      globalOffset: this.globalOffset
    });
    this.precomputedBounds.copy(boundsState.precomputedBounds);
    this.sceneBounds.copy(boundsState.sceneBounds);
    this.globalOffset.copy(boundsState.globalOffset);
    if (boundsState.initializedOffset) {
      debugLog("SceneManager/NBIM", "初始化全局偏移", this.globalOffset);
    }
    const modelRoot = manifest.structureTree;
    appendNbimStructure({
      structureRoot: this.structureRoot,
      modelRoot
    });
    const rootId = modelRoot?.id || fileId;
    const manifestBimProperties = manifest?.bimProperties && typeof manifest.bimProperties === "object" ? manifest.bimProperties : {};
    const { defaultOwner, grouped } = groupNbimPropertiesByOwner(manifestBimProperties, rootId);
    grouped.forEach((props, owner) => this.nbimPropsByOriginalUuid.set(owner, props));
    const quickStats = buildNbimQuickStats({
      manifestStats: manifest.stats,
      modelRoot,
      chunks: manifest.chunks
    });
    this.registerOriginalStats(rootId, quickStats);
    const fileGroup = createNbimContainerGroup({
      fileName: file.name,
      modelRootName: typeof modelRoot?.name === "string" ? modelRoot.name : "",
      rootId
    });
    this.contentGroup.add(fileGroup);
    this.interactableListValid = false;
    populateNbimNodeMappings({
      modelRoot,
      defaultOwner,
      nodeMap: this.nodeMap,
      bimIdToNodeIds: this.bimIdToNodeIds
    });
    if (onProgress) onProgress(30, "正在初始化分块...");
    const chunkEntries = Array.isArray(manifest.chunks) ? manifest.chunks : [];
    this.applyNbimScaleTuning(chunkEntries.length);
    const immediateGhostLimit = this.resolvedChunkOptions.ghostMode === "all" ? Number.MAX_SAFE_INTEGER : GHOST_VISIBLE_FIRST_BATCH;
    const { deferredGhostSpecs } = await registerNbimChunks({
      chunkEntries,
      globalOffset: this.globalOffset,
      chunkPadding: this.chunkPadding,
      rootId,
      fileId,
      immediateGhostLimit,
      registrationBatchSize: NBIM_CHUNK_REGISTRATION_BATCH,
      onProgress,
      registerChunk: (chunk) => this.registerChunk(chunk),
      createGhostLine: (name, bounds) => this.createGhostLine(name, bounds),
      addGhostLine: (line) => this.ghostGroup.add(line),
      yieldToMainThread: () => this.yieldToMainThread()
    });
    if (deferredGhostSpecs.length > 0) {
      void this.createChunkGhostsProgressively(deferredGhostSpecs);
    }
    this.reportChunkProgress();
    this.fitView(true);
    const loadFinalize = finalizeNbimLoad({
      chunkCount: this.chunks.length,
      hasManifestStats: Boolean(manifest.stats),
      hasManifestChunks: Boolean(manifest.chunks?.length)
    });
    this.chunkWarmupActive = loadFinalize.chunkWarmupActive;
    this.initialChunkLoadTarget = loadFinalize.initialChunkLoadTarget;
    if (onProgress) onProgress(100, "NBIM 已就绪，正在按需加载...");
    this.checkCullingAndLoad();
    if (loadFinalize.shouldEstimateStats) {
      void this.estimateNbimStats(file, manifest.chunks, version).then((stats) => {
        this.unregisterOriginalStats(rootId);
        this.registerOriginalStats(rootId, stats);
      }).catch((error) => {
        console.warn("NBIM 统计估算失败:", error);
      });
    }
  }
  async clear() {
    this.beginLoadGeneration();
    debugLog("SceneManager", "开始清空场景...");
    this.cancelDeferredStructureBuild();
    this.resetExplode();
    this.clearLocateFocus();
    try {
      const disposeObject = (obj) => {
        if (obj.isMesh) {
          const mesh = obj;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((m) => m.dispose());
          }
        } else if (obj.isBatchedMesh) {
          const bm = obj;
          if (bm.geometry) bm.geometry.dispose();
          if (bm.material) {
            const materials = Array.isArray(bm.material) ? bm.material : [bm.material];
            materials.forEach((m) => m.dispose());
          }
        }
      };
      this.contentGroup.traverse(disposeObject);
      while (this.contentGroup.children.length > 0) {
        this.contentGroup.remove(this.contentGroup.children[0]);
      }
      while (this.ghostGroup.children.length > 0) {
        const ghost = this.ghostGroup.children[0];
        this.ghostGroup.remove(ghost);
        this.releaseGhostLine(ghost);
      }
      this.ghostMeshPool.length = 0;
      this.selectionBox.visible = false;
      this.highlightMesh.visible = false;
      this.clearAllMeasurements();
      this.optimizedMapping.clear();
      this.sceneBounds.makeEmpty();
      this.precomputedBounds.makeEmpty();
      this.nbimFiles.clear();
      this.nbimMeta.clear();
      this.nbimPropsByOriginalUuid.clear();
      this.structureRoot = { id: "root", name: "Root", type: "Group", children: [] };
      this.nodeMap.clear();
      this.bimIdToNodeIds.clear();
      this.chunks = [];
      this.chunkIdSet.clear();
      this.chunkById.clear();
      this.chunkIndexById.clear();
      this.lastReportedProgress = { loaded: -1, total: -1 };
      this.processingChunks.clear();
      this.cancelledChunkIds.clear();
      this.prefetchQueue = [];
      this.prefetchQueueSet.clear();
      this.prefetchInFlight.clear();
      this.chunkLoadedCount = 0;
      this.reportChunkProgress();
      this.componentMap.clear();
      this.clearChunkCache();
      this.chunkReadCache.clear();
      this.chunkReadCacheOrder = [];
      this.originalStats = { meshes: 0, faces: 0, memory: 0 };
      this.originalStatsByModel.clear();
      this.fastPreviewModels.clear();
      this.chunkLoadingEnabled = true;
      this.contentGroup.visible = true;
      this.ghostGroup.visible = true;
      this.chunkWarmupActive = false;
      this.globalOffset.set(0, 0, 0);
      debugLog("SceneManager", "场景已清空");
      this.markSceneDirty();
    } catch (error) {
      console.error("清空场景失败:", error);
      throw error;
    }
  }
  getStructureNodes(id) {
    return this.nodeMap.get(id);
  }
  getBimIdByUuid(uuid) {
    return resolveBimIdByUuid({
      uuid,
      nodeMap: this.nodeMap,
      bimIdToNodeIds: this.bimIdToNodeIds
    });
  }
  resolveNodeUuidByBimId(bimId) {
    return resolveNodeUuidByBimId(bimId, this.bimIdToNodeIds);
  }
  resolveSelectionUuid(rawUuid) {
    return resolveSelectionUuid(rawUuid, this.nodeMap, this.bimIdToNodeIds);
  }
  resolveNbimNode(id) {
    return resolveNbimNode(id, this.nodeMap);
  }
  getNbimProperties(id) {
    return resolveNbimFlatProperties({
      id,
      nodeMap: this.nodeMap,
      nbimPropsByOriginalUuid: this.nbimPropsByOriginalUuid
    });
  }
  getNbimIfcPropertyGroups(id, mode = "raw") {
    return resolveNbimIfcPropertyGroups({
      id,
      nodeMap: this.nodeMap,
      nbimPropsByOriginalUuid: this.nbimPropsByOriginalUuid
    }, mode);
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
  syncHighlightState(state) {
    this.highlightedUuids = state.highlightedUuids;
    this.locateResultSet = state.locateResultSet;
    this.locateFocusUuid = state.locateFocusUuid;
    this.lastSelectedUuid = state.lastSelectedUuid;
  }
  syncPickingState(state) {
    this.interactableList = state.interactableList;
    this.interactableListValid = state.interactableListValid;
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
      getRayIntersects: (clientX, clientY) => this.getRayIntersects(clientX, clientY),
      onMeasureUpdate: this.onMeasureUpdate
    };
  }
  syncMeasurementState(state) {
    this.measureType = state.measureType;
    this.currentMeasurePoints = state.currentMeasurePoints;
    this.currentMeasureModelUuid = state.currentMeasureModelUuid;
    this.previewLine = state.previewLine;
    this.previewPolygon = state.previewPolygon;
  }
  syncBoxSelectState(state) {
    this.boxSelectState = state;
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
  syncClippingState(state) {
    this.clippingPlanes = state.clippingPlanes;
    this.clipPlaneHelpers = state.clipPlaneHelpers;
    this.clipHelperVisible = state.clipHelperVisible;
    this.clipHelperOpacity = state.clipHelperOpacity;
  }
  setAllVisibility(visible) {
    applySetAllVisibility(this.getVisibilityContext(), visible);
    this.updateSceneBounds();
    this.refreshExplodeState();
    this.markSceneDirty();
  }
  hideObjects(uuids) {
    this.setObjectsVisibility(uuids, false);
  }
  applyVisibilityBatch(changes, options = {}) {
    const result = applyVisibilityBatch(this.getVisibilityContext(), changes, options);
    if (result.nextHighlightedUuids) {
      this.highlightObjects(result.nextHighlightedUuids);
    }
    if (options.invalidateInteractables ?? true) {
      this.markSceneDirty({
        invalidateInteractables: true,
        needsRender: false
      });
    }
    if (result.needsBoundsUpdate) this.updateSceneBounds();
    if (result.needsExplodeRefresh) this.refreshExplodeState();
    if (result.needsRender) this.markSceneDirty();
  }
  setObjectsVisibility(uuids, visible, options = {}) {
    if (uuids.length === 0) return;
    const changes = uuids.map((uuid) => ({
      uuid,
      visible,
      showParents: options.showParents
    }));
    const recomputeBounds = !options.deferRefresh;
    this.applyVisibilityBatch(changes, {
      recomputeBounds,
      refreshExplode: options.refreshExplode ?? false,
      invalidateInteractables: !options.deferRefresh
    });
  }
  isolateObjects(uuids) {
    applyIsolateObjects(
      this.getVisibilityContext(),
      uuids,
      (uuid, visible, showParents) => {
        const inner = applySetObjectVisibility(this.getVisibilityContext(), uuid, visible, showParents);
        if (inner.nextHighlightedUuids) {
          const highlightContext = this.getHighlightContext();
          const highlightResult = applyHighlightObjects(highlightContext, inner.nextHighlightedUuids);
          this.syncHighlightState(highlightContext.state);
          if (highlightResult.needsRender) this.markSceneDirty();
        }
      }
    );
    this.markSceneDirty({
      invalidateInteractables: true,
      needsRender: false
    });
    this.updateSceneBounds();
    this.refreshExplodeState();
    this.markSceneDirty();
  }
  setObjectVisibility(uuid, visible, showParents = true) {
    const result = applySetObjectVisibility(this.getVisibilityContext(), uuid, visible, showParents);
    if (result.nextHighlightedUuids) {
      this.highlightObjects(result.nextHighlightedUuids);
    }
    this.markSceneDirty({
      invalidateInteractables: true,
      needsRender: false
    });
    if (result.needsBoundsUpdate) this.updateSceneBounds();
    if (result.needsRender) this.markSceneDirty();
  }
  highlightObject(uuid) {
    this.highlightObjects(uuid ? [uuid] : []);
  }
  toLocalDirection(directionWorld, matrixWorld) {
    return directionWorld.clone().transformDirection(matrixWorld.clone().invert()).normalize();
  }
  getExplodeWorldDirection(vectorFromCenter) {
    const direction = vectorFromCenter.clone();
    if (this.explodeMode === "horizontal") {
      direction.z = 0;
    } else if (this.explodeMode === "vertical") {
      direction.x = 0;
      direction.y = 0;
      direction.z = direction.z >= 0 ? 1 : -1;
    }
    if (direction.lengthSq() < 1e-8) {
      if (this.explodeMode === "vertical") return new THREE.Vector3(0, 0, 1);
      if (this.explodeMode === "horizontal") return new THREE.Vector3(1, 0, 0);
      return new THREE.Vector3(0, 0, 1);
    }
    return direction.normalize();
  }
  /** 由 UUID 导出的稳定单位向量，近似均匀分布于球面（与径向方向混合后爆炸更散、更匀） */
  explodeStableUnitDirection(seed, target) {
    stableExplodeDirection(seed, target);
  }
  captureExplodeSnapshot() {
    this.explodeObjectStates.clear();
    this.explodeInstanceStates.clear();
    let bounds = this.computeTotalBounds(true, true);
    if (bounds.isEmpty()) bounds = this.computeTotalBounds(false, true);
    if (bounds.isEmpty()) {
      this.explodeCenter.set(0, 0, 0);
      return;
    }
    this.explodeCenter.copy(bounds.getCenter(new THREE.Vector3()));
    const radius = Math.max(bounds.getSize(new THREE.Vector3()).length() * 0.5, 1);
    const objectBox = new THREE.Box3();
    const objectCenter = new THREE.Vector3();
    this.contentGroup.updateMatrixWorld(true);
    this.contentGroup.traverse((obj) => {
      const mesh = obj;
      if (!mesh.isMesh || !obj.visible || obj.userData?.isIfcGridHelper) return;
      objectBox.setFromObject(obj);
      if (objectBox.isEmpty()) return;
      objectCenter.copy(objectBox.getCenter(new THREE.Vector3()));
      const offset = objectCenter.sub(this.explodeCenter);
      const distN = offset.length() / radius;
      const weight = 0.14 + 0.86 * Math.pow(THREE.MathUtils.clamp(distN, 0, 2.5) / 2.5, 0.38);
      let directionWorld;
      if (this.explodeMode === "radial") {
        const radial = this.getExplodeWorldDirection(offset);
        this.explodeStableUnitDirection(obj.uuid, this.explodeScratchUniform);
        const mix = Math.pow(1 - Math.min(distN / 1.08, 1), 1.15);
        directionWorld = this.explodeScratchMix.copy(radial).multiplyScalar(1 - mix).addScaledVector(this.explodeScratchUniform, mix).normalize();
      } else {
        directionWorld = this.getExplodeWorldDirection(offset);
      }
      const directionLocal = this.toLocalDirection(directionWorld, obj.parent?.matrixWorld || new THREE.Matrix4());
      this.explodeObjectStates.set(obj.uuid, {
        object: obj,
        basePosition: obj.position.clone(),
        directionLocal,
        weight
      });
    });
    const instanceBox = new THREE.Box3();
    const instanceMatrix = new THREE.Matrix4();
    const worldMatrix = new THREE.Matrix4();
    this.optimizedMapping.forEach((mappings, originalUuid) => {
      const isVisible = this.nodeMap.get(originalUuid)?.some((node) => node.visible !== false) ?? true;
      if (!isVisible) return;
      mappings.forEach((mapping) => {
        const key = `${mapping.mesh.uuid}:${mapping.instanceId}`;
        if (this.explodeInstanceStates.has(key)) return;
        mapping.mesh.getMatrixAt(mapping.instanceId, instanceMatrix);
        const geometry = mapping.geometry || mapping.mesh.geometry;
        if (!geometry?.boundingBox) geometry?.computeBoundingBox?.();
        if (!geometry?.boundingBox) return;
        worldMatrix.copy(mapping.mesh.matrixWorld).multiply(instanceMatrix);
        instanceBox.copy(geometry.boundingBox).applyMatrix4(worldMatrix);
        if (instanceBox.isEmpty()) return;
        objectCenter.copy(instanceBox.getCenter(new THREE.Vector3()));
        const offset = objectCenter.sub(this.explodeCenter);
        const distN = offset.length() / radius;
        const weight = 0.14 + 0.86 * Math.pow(THREE.MathUtils.clamp(distN, 0, 2.5) / 2.5, 0.38);
        let directionWorld;
        if (this.explodeMode === "radial") {
          const radial = this.getExplodeWorldDirection(offset);
          this.explodeStableUnitDirection(key, this.explodeScratchUniform);
          const mix = Math.pow(1 - Math.min(distN / 1.08, 1), 1.15);
          directionWorld = this.explodeScratchMix.copy(radial).multiplyScalar(1 - mix).addScaledVector(this.explodeScratchUniform, mix).normalize();
        } else {
          directionWorld = this.getExplodeWorldDirection(offset);
        }
        this.explodeInstanceStates.set(key, {
          mesh: mapping.mesh,
          instanceId: mapping.instanceId,
          baseMatrix: instanceMatrix.clone(),
          directionLocal: this.toLocalDirection(directionWorld, mapping.mesh.matrixWorld),
          weight
        });
      });
    });
  }
  applyExplodeState() {
    const bounds = this.computeTotalBounds(true, true);
    const size = bounds.isEmpty() ? new THREE.Vector3(100, 100, 100) : bounds.getSize(new THREE.Vector3());
    const magnitude = Math.max(size.length() * 0.125 * (this.explodeStrength / 100), 0);
    this.explodeObjectStates.forEach((state) => {
      state.object.position.copy(state.basePosition).addScaledVector(state.directionLocal, magnitude * state.weight);
      state.object.updateMatrixWorld();
    });
    const translation = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const matrixWork = new THREE.Matrix4();
    this.explodeInstanceStates.forEach((state) => {
      matrixWork.copy(state.baseMatrix);
      matrixWork.decompose(translation, quaternion, scale);
      translation.addScaledVector(state.directionLocal, magnitude * state.weight);
      matrixWork.compose(translation, quaternion, scale);
      state.mesh.setMatrixAt(state.instanceId, matrixWork);
      if (state.mesh.instanceMatrix) state.mesh.instanceMatrix.needsUpdate = true;
    });
    this.interactableListValid = false;
    this.updateSceneBounds();
    this.markSceneDirty();
  }
  restoreExplodeSnapshot() {
    this.explodeObjectStates.forEach((state) => {
      state.object.position.copy(state.basePosition);
      state.object.updateMatrixWorld();
    });
    this.explodeInstanceStates.forEach((state) => {
      state.mesh.setMatrixAt(state.instanceId, state.baseMatrix);
      if (state.mesh.instanceMatrix) state.mesh.instanceMatrix.needsUpdate = true;
    });
    this.interactableListValid = false;
    this.updateSceneBounds();
    this.markSceneDirty();
  }
  refreshExplodeState() {
    if (!this.explodeEnabled) return;
    this.restoreExplodeSnapshot();
    this.captureExplodeSnapshot();
    this.applyExplodeState();
  }
  setExplodeEnabled(enabled) {
    if (enabled === this.explodeEnabled) return;
    this.explodeEnabled = enabled;
    if (!enabled) {
      this.restoreExplodeSnapshot();
      this.explodeObjectStates.clear();
      this.explodeInstanceStates.clear();
      return;
    }
    this.captureExplodeSnapshot();
    this.applyExplodeState();
  }
  setExplodeStrength(value) {
    this.explodeStrength = THREE.MathUtils.clamp(value, 0, 100);
    if (!this.explodeEnabled) return;
    if (this.explodeObjectStates.size === 0 && this.explodeInstanceStates.size === 0) {
      this.captureExplodeSnapshot();
    }
    this.applyExplodeState();
  }
  setExplodeMode(mode) {
    this.explodeMode = mode;
    if (!this.explodeEnabled) return;
    this.restoreExplodeSnapshot();
    this.captureExplodeSnapshot();
    this.applyExplodeState();
  }
  resetExplode() {
    this.explodeStrength = 0;
    if (this.explodeEnabled) {
      this.restoreExplodeSnapshot();
    }
    this.explodeEnabled = false;
    this.explodeObjectStates.clear();
    this.explodeInstanceStates.clear();
  }
  clearClashPairHighlight() {
    this.clashPairObjectMaterialCache.forEach((material, uuid) => {
      const obj = this.contentGroup.getObjectByProperty("uuid", uuid);
      if (!obj || !obj.isMesh && !obj.isBatchedMesh) return;
      obj.material = material;
    });
    this.clashPairObjectMaterialCache.clear();
    this.clashPairInstanceColorCache.forEach(({ mesh, instanceId, originalColor }) => {
      mesh.setColorAt(instanceId, new THREE.Color(originalColor));
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    });
    this.clashPairInstanceColorCache.clear();
    this.clashPairUuids.clear();
  }
  setClashPairHighlight(aUuid, bUuid, colorAHex = "#ff4d4f", colorBHex = "#1890ff") {
    const normalizedA = String(aUuid || "").trim();
    const normalizedB = String(bUuid || "").trim();
    if (!normalizedA || !normalizedB) {
      this.clearClashPairHighlight();
      this.markSceneDirty();
      return;
    }
    this.clearLocateFocus();
    this.clearClashPairHighlight();
    const aTargets = this.expandLocateTargets([normalizedA]);
    const bTargets = this.expandLocateTargets([normalizedB]);
    const colorA = new THREE.Color(colorAHex);
    const colorB = new THREE.Color(colorBHex);
    this.contentGroup.traverse((child) => {
      const mesh = child;
      if (!mesh.isMesh || !mesh.material) return;
      const side = aTargets.has(child.uuid) ? "A" : bTargets.has(child.uuid) ? "B" : null;
      if (!side) return;
      if (!this.clashPairObjectMaterialCache.has(child.uuid)) {
        this.clashPairObjectMaterialCache.set(child.uuid, mesh.material);
      }
      const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const tintColor = side === "A" ? colorA : colorB;
      const nextMaterials = sourceMaterials.map((material) => {
        if (!material) return material;
        const cloned = material.clone();
        if ("transparent" in cloned) cloned.transparent = false;
        if ("opacity" in cloned) cloned.opacity = 1;
        if ("depthWrite" in cloned) cloned.depthWrite = true;
        if ("color" in cloned && cloned.color) {
          cloned.color.copy(cloned.color.clone().lerp(tintColor, 0.86));
        }
        if ("emissive" in cloned && cloned.emissive) {
          cloned.emissive.copy(tintColor.clone().multiplyScalar(0.36));
        }
        cloned.needsUpdate = true;
        return cloned;
      });
      mesh.material = Array.isArray(mesh.material) ? nextMaterials : nextMaterials[0];
    });
    const originalColorByInstance = /* @__PURE__ */ new Map();
    this.optimizedMapping.forEach((mappings) => {
      mappings.forEach((mapping) => {
        originalColorByInstance.set(`${mapping.mesh.uuid}:${mapping.instanceId}`, mapping.originalColor);
      });
    });
    this.contentGroup.traverse((child) => {
      const batched = child;
      if (!child.isBatchedMesh) return;
      const batchIdToUuid = batched.userData?.batchIdToUuid;
      if (!batchIdToUuid || batchIdToUuid.size === 0) return;
      let touched = false;
      batchIdToUuid.forEach((instanceUuid, instanceId) => {
        const side = aTargets.has(instanceUuid) ? "A" : bTargets.has(instanceUuid) ? "B" : null;
        if (!side) return;
        const key = `${batched.uuid}:${instanceId}`;
        if (!this.clashPairInstanceColorCache.has(key)) {
          const mappedOriginalColor = originalColorByInstance.get(key);
          if (typeof mappedOriginalColor === "number") {
            this.clashPairInstanceColorCache.set(key, {
              mesh: batched,
              instanceId,
              originalColor: mappedOriginalColor
            });
          } else {
            const currentColor = new THREE.Color();
            batched.getColorAt(instanceId, currentColor);
            this.clashPairInstanceColorCache.set(key, {
              mesh: batched,
              instanceId,
              originalColor: currentColor.getHex()
            });
          }
        }
        const origin = this.clashPairInstanceColorCache.get(key)?.originalColor;
        if (typeof origin !== "number") return;
        const tintColor = side === "A" ? colorA : colorB;
        batched.setColorAt(instanceId, new THREE.Color(origin).lerp(tintColor, 0.88));
        touched = true;
      });
      if (touched && batched.instanceColor) batched.instanceColor.needsUpdate = true;
    });
    this.clashPairUuids = /* @__PURE__ */ new Set([normalizedA, normalizedB]);
    this.markSceneDirty();
  }
  clearLocateFocus() {
    const context = this.getHighlightContext();
    const result = applyClearLocateFocus(context);
    this.syncHighlightState(context.state);
    if (result.needsRender) this.markSceneDirty();
  }
  expandLocateTargets(ids) {
    const expanded = /* @__PURE__ */ new Set();
    const queue = [...ids];
    const visited = /* @__PURE__ */ new Set();
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || visited.has(current)) continue;
      visited.add(current);
      expanded.add(current);
      const nodes = this.nodeMap.get(current);
      if (!nodes || nodes.length === 0) continue;
      for (const node of nodes) {
        if (!node.children || node.children.length === 0) continue;
        for (const child of node.children) {
          if (!visited.has(child.id)) queue.push(child.id);
        }
      }
    }
    return expanded;
  }
  setLocateResultSet(uuids, focusUuid = null) {
    const context = this.getHighlightContext();
    const result = applySetLocateResultSet(context, uuids, focusUuid);
    this.syncHighlightState(context.state);
    if (result.needsRender) this.markSceneDirty();
  }
  setLocateFocusContext(uuids, focusUuid = null, highlightColors) {
    const context = this.getHighlightContext();
    const result = applySetLocateResultSet(context, uuids, focusUuid, { highlightColors });
    this.syncHighlightState(context.state);
    if (result.needsRender) this.markSceneDirty();
  }
  setLocateFocus(uuid) {
    if (!uuid) {
      this.clearLocateFocus();
      return;
    }
    this.setLocateResultSet([uuid], uuid);
  }
  highlightObjects(uuids) {
    const context = this.getHighlightContext();
    const result = applyHighlightObjects(context, uuids);
    this.syncHighlightState(context.state);
    if (result.needsRender) this.markSceneDirty();
  }
  pick(clientX, clientY) {
    const intersect = this.getRayIntersects(clientX, clientY);
    if (!intersect) return null;
    return { object: intersect.object, intersect };
  }
  getRayIntersects(clientX, clientY) {
    const result = applyGetRayIntersects(this.getPickingContext(), clientX, clientY);
    this.syncPickingState(result.state);
    return result.intersect;
  }
  computeTotalBounds(onlyVisible = false, forceRecompute = false) {
    if (!onlyVisible && !forceRecompute && !this.precomputedBounds.isEmpty()) {
      const box = this.precomputedBounds.clone();
      if (this.globalOffset.length() > 0) {
        box.translate(this.globalOffset.clone().negate());
      }
      return box;
    }
    const totalBox = new THREE.Box3();
    this.contentGroup.updateMatrixWorld(true);
    this.contentGroup.traverse((obj) => {
      if (onlyVisible && !obj.visible) return;
      if (obj.isMesh && !obj._skipTraverse) {
        const mesh = obj;
        if (mesh.geometry) {
          const box = new THREE.Box3().setFromObject(mesh);
          if (!box.isEmpty()) totalBox.union(box);
        }
      } else if (obj.isBatchedMesh && !obj._skipTraverse) {
        const bm = obj;
        if (bm.computeBoundingBox) {
          bm.computeBoundingBox();
          if (bm.boundingBox) {
            const box = bm.boundingBox.clone().applyMatrix4(bm.matrixWorld);
            totalBox.union(box);
          }
        } else {
          const box = new THREE.Box3().setFromObject(bm);
          if (!box.isEmpty()) totalBox.union(box);
        }
      }
    });
    this.contentGroup.traverse((obj) => {
      delete obj._skipTraverse;
    });
    if (this.chunks.length > 0) {
      this.chunks.forEach((c) => {
        if (!onlyVisible || c.loaded) {
          totalBox.union(c.bounds);
        }
      });
    }
    if (totalBox.isEmpty() && !this.precomputedBounds.isEmpty()) {
      const fallback = this.precomputedBounds.clone();
      if (this.globalOffset.length() > 0) {
        fallback.translate(this.globalOffset.clone().negate());
      }
      return fallback;
    }
    return totalBox;
  }
  updateSceneBounds() {
    const fullBox = this.computeTotalBounds(false, true);
    this.precomputedBounds = fullBox.clone();
    if (this.globalOffset.length() > 0) {
      this.precomputedBounds.translate(this.globalOffset);
    }
    this.sceneBounds.copy(fullBox);
    this.sceneSphereValid = false;
  }
  fitView(keepOrientation = true) {
    this.contentGroup.updateMatrixWorld(true);
    let box = this.computeTotalBounds(true);
    if (box.isEmpty()) {
      box = this.computeTotalBounds(false);
    }
    this.sceneBounds = box.clone();
    this.fitBox(box, !keepOrientation);
  }
  unionObjectBounds(obj, targetBox) {
    const box = new THREE.Box3();
    if (obj.userData?.boundingBox) {
      box.copy(obj.userData.boundingBox).applyMatrix4(obj.matrixWorld);
    } else {
      box.setFromObject(obj);
    }
    if (!box.isEmpty()) targetBox.union(box);
  }
  unionTilesNodeBounds(node, targetBox) {
    const encodedBox = node?.userData?.tilesBoundingVolumeBox;
    if (!Array.isArray(encodedBox) || encodedBox.length < 12) return;
    const center = new THREE.Vector3(encodedBox[0], encodedBox[1], encodedBox[2]);
    const axisX = new THREE.Vector3(encodedBox[3], encodedBox[4], encodedBox[5]);
    const axisY = new THREE.Vector3(encodedBox[6], encodedBox[7], encodedBox[8]);
    const axisZ = new THREE.Vector3(encodedBox[9], encodedBox[10], encodedBox[11]);
    const extent = new THREE.Vector3(axisX.length(), axisY.length(), axisZ.length());
    const box = new THREE.Box3(center.clone().sub(extent), center.clone().add(extent));
    if (!box.isEmpty()) targetBox.union(box);
  }
  unionOptimizedBounds(uuid, targetBox) {
    const mappings = this.optimizedMapping.get(uuid);
    if (!mappings || mappings.length === 0) return;
    const instanceMatrix = new THREE.Matrix4();
    for (const mapping of mappings) {
      const geometry = mapping.geometry || mapping.mesh.geometry;
      if (!geometry.boundingBox) geometry.computeBoundingBox();
      if (!geometry.boundingBox) continue;
      mapping.mesh.getMatrixAt(mapping.instanceId, instanceMatrix);
      instanceMatrix.premultiply(mapping.mesh.matrixWorld);
      const box = geometry.boundingBox.clone().applyMatrix4(instanceMatrix);
      if (!box.isEmpty()) targetBox.union(box);
    }
  }
  unionNodeBounds(uuid, targetBox, visited = /* @__PURE__ */ new Set()) {
    if (!uuid || visited.has(uuid)) return;
    visited.add(uuid);
    const obj = this.contentGroup.getObjectByProperty("uuid", uuid);
    if (obj) {
      this.unionObjectBounds(obj, targetBox);
    }
    this.unionOptimizedBounds(uuid, targetBox);
    const nodes = this.nodeMap.get(uuid) || [];
    for (const node of nodes) {
      this.unionTilesNodeBounds(node, targetBox);
      const children = Array.isArray(node.children) ? node.children : [];
      for (const child of children) {
        this.unionNodeBounds(child.id, targetBox, visited);
      }
    }
  }
  fitViewToObject(uuid) {
    const box = new THREE.Box3();
    this.unionNodeBounds(uuid, box);
    if (!box.isEmpty()) this.fitBox(box, false, 1.14);
  }
  getBoundsForObject(uuid) {
    if (!uuid) return null;
    const box = new THREE.Box3();
    this.unionNodeBounds(uuid, box);
    return box.isEmpty() ? null : box;
  }
  collectBoundsForUuids(uuids) {
    const box = new THREE.Box3();
    const unique = Array.from(new Set((uuids || []).filter(Boolean)));
    unique.forEach((uuid) => this.unionNodeBounds(uuid, box));
    return box;
  }
  fitViewToObjects(uuids) {
    const box = this.collectBoundsForUuids(uuids);
    if (!box.isEmpty()) this.fitBox(box, false, 1.14);
  }
  fitBox(box, updateCameraPosition = true, paddingOverride) {
    if (box.isEmpty()) {
      this.camera.zoom = 1;
      this.camera.position.set(1e3, 1e3, 1e3);
      this.camera.lookAt(0, 0, 0);
      this.controls.target.set(0, 0, 0);
      this.camera.updateProjectionMatrix();
      this.controls.update();
      return;
    }
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const extent = maxDim > 0 ? maxDim : 100;
    const padding = paddingOverride ?? 1.02;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const aspect = w / h;
    let fH, fW;
    if (aspect >= 1) {
      fH = extent * padding;
      fW = fH * aspect;
    } else {
      fW = extent * padding;
      fH = fW / aspect;
    }
    const zBuffer = Math.max(extent * 5, 2e3);
    this.camera.near = -zBuffer;
    this.camera.far = zBuffer;
    let targetZoom = 1;
    let targetLeft = -fW / 2;
    let targetRight = fW / 2;
    let targetTop = fH / 2;
    let targetBottom = -fH / 2;
    if (updateCameraPosition) {
      const offset = new THREE.Vector3(1, -1, 1).normalize();
      const dist = Math.max(extent * 2, 2e3);
      const targetPosition = center.clone().add(offset.multiplyScalar(dist));
      const targetLookAt = center.clone();
      const startPosition = this.camera.position.clone();
      const startTarget = this.controls.target.clone();
      const startTime = performance.now();
      const duration = 600;
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        this.camera.position.lerpVectors(startPosition, targetPosition, eased);
        this.controls.target.lerpVectors(startTarget, targetLookAt, eased);
        this.camera.lookAt(this.controls.target);
        this.camera.zoom = 1 + (targetZoom - 1) * eased;
        this.camera.left = this.camera.left + (targetLeft - this.camera.left) * eased;
        this.camera.right = this.camera.right + (targetRight - this.camera.right) * eased;
        this.camera.top = this.camera.top + (targetTop - this.camera.top) * eased;
        this.camera.bottom = this.camera.bottom + (targetBottom - this.camera.bottom) * eased;
        this.camera.updateProjectionMatrix();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    } else {
      const direction = new THREE.Vector3();
      this.camera.getWorldDirection(direction);
      const dist = this.camera.position.distanceTo(this.controls.target);
      const targetPosition = center.clone().add(direction.multiplyScalar(-dist));
      const targetLookAt = center.clone();
      const paddingForOrientationFit = 1.01;
      const camRight = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
      const camUp = new THREE.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion);
      const halfBaseWidth = Math.max(1e-6, (this.camera.right - this.camera.left) * 0.5);
      const halfBaseHeight = Math.max(1e-6, (this.camera.top - this.camera.bottom) * 0.5);
      const corners = [
        new THREE.Vector3(box.min.x, box.min.y, box.min.z),
        new THREE.Vector3(box.min.x, box.min.y, box.max.z),
        new THREE.Vector3(box.min.x, box.max.y, box.min.z),
        new THREE.Vector3(box.min.x, box.max.y, box.max.z),
        new THREE.Vector3(box.max.x, box.min.y, box.min.z),
        new THREE.Vector3(box.max.x, box.min.y, box.max.z),
        new THREE.Vector3(box.max.x, box.max.y, box.min.z),
        new THREE.Vector3(box.max.x, box.max.y, box.max.z)
      ];
      let maxProjX = 0;
      let maxProjY = 0;
      for (let i = 0; i < corners.length; i++) {
        const delta = corners[i].clone().sub(center);
        maxProjX = Math.max(maxProjX, Math.abs(delta.dot(camRight)));
        maxProjY = Math.max(maxProjY, Math.abs(delta.dot(camUp)));
      }
      const safeHalfX = Math.max(1e-3, maxProjX * paddingForOrientationFit);
      const safeHalfY = Math.max(1e-3, maxProjY * paddingForOrientationFit);
      const targetZoom2 = Math.max(
        1e-4,
        Math.min(1e6, Math.min(halfBaseWidth / safeHalfX, halfBaseHeight / safeHalfY))
      );
      const startPosition = this.camera.position.clone();
      const startTarget = this.controls.target.clone();
      const startZoom = this.camera.zoom;
      const startTime = performance.now();
      const duration = 600;
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        this.camera.position.lerpVectors(startPosition, targetPosition, eased);
        this.controls.target.lerpVectors(startTarget, targetLookAt, eased);
        this.camera.lookAt(this.controls.target);
        this.camera.zoom = startZoom + (targetZoom2 - startZoom) * eased;
        this.camera.updateProjectionMatrix();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }
  setView(view) {
    let box = this.computeTotalBounds(true);
    if (box.isEmpty()) box = this.computeTotalBounds(false);
    this.sceneBounds = box.clone();
    const center = box.isEmpty() ? new THREE.Vector3(0, 0, 0) : box.getCenter(new THREE.Vector3());
    const size = box.isEmpty() ? new THREE.Vector3(100, 100, 100) : box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const dist = Math.max(maxDim * 2, 10);
    let pos = new THREE.Vector3();
    switch (view) {
      case "top":
        pos.set(0, 0, dist);
        break;
      case "bottom":
        pos.set(0, 0, -dist);
        break;
      case "front":
        pos.set(0, -dist, 0);
        break;
      case "back":
        pos.set(0, dist, 0);
        break;
      case "left":
        pos.set(-dist, 0, 0);
        break;
      case "right":
        pos.set(dist, 0, 0);
        break;
      case "se":
      case "top-front-right":
        pos.set(dist, -dist, dist);
        break;
      case "sw":
      case "top-front-left":
        pos.set(-dist, -dist, dist);
        break;
      case "ne":
      case "top-back-right":
        pos.set(dist, dist, dist);
        break;
      case "nw":
      case "top-back-left":
        pos.set(-dist, dist, dist);
        break;
      case "bottom-front-right":
        pos.set(dist, -dist, -dist);
        break;
      case "bottom-front-left":
        pos.set(-dist, -dist, -dist);
        break;
      case "bottom-back-right":
        pos.set(dist, dist, -dist);
        break;
      case "bottom-back-left":
        pos.set(-dist, dist, -dist);
        break;
      case "top-front":
        pos.set(0, -dist, dist);
        break;
      case "top-back":
        pos.set(0, dist, dist);
        break;
      case "top-left":
        pos.set(-dist, 0, dist);
        break;
      case "top-right":
        pos.set(dist, 0, dist);
        break;
      case "bottom-front":
        pos.set(0, -dist, -dist);
        break;
      case "bottom-back":
        pos.set(0, dist, -dist);
        break;
      case "bottom-left":
        pos.set(-dist, 0, -dist);
        break;
      case "bottom-right":
        pos.set(dist, 0, -dist);
        break;
      case "front-left":
        pos.set(-dist, -dist, 0);
        break;
      case "front-right":
        pos.set(dist, -dist, 0);
        break;
      case "back-left":
        pos.set(-dist, dist, 0);
        break;
      case "back-right":
        pos.set(dist, dist, 0);
        break;
    }
    if (pos.lengthSq() > 0) {
      pos.normalize().multiplyScalar(dist);
      this.camera.position.copy(center).add(pos);
      this.camera.lookAt(center);
      this.controls.target.copy(center);
      this.controls.update();
      this.fitBox(box, false);
    }
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
  setCameraState(state) {
    if (!state) return;
    this.camera.position.fromArray(state.position);
    this.controls.target.fromArray(state.target);
    if (state.zoom !== void 0) this.camera.zoom = state.zoom;
    if (state.left !== void 0) this.camera.left = state.left;
    if (state.right !== void 0) this.camera.right = state.right;
    if (state.top !== void 0) this.camera.top = state.top;
    if (state.bottom !== void 0) this.camera.bottom = state.bottom;
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.markSceneDirty();
  }
  // --- 测量定位逻辑 ---
  locateMeasurement(id) {
    const record = this.measureRecords.get(id);
    if (!record) return;
    const box = new THREE.Box3();
    record.group.traverse((obj) => {
      if (obj.isMesh || obj.isLine || obj.isSprite) {
        obj.updateMatrixWorld();
        if (obj.geometry) {
          if (!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
          const b = obj.geometry.boundingBox.clone();
          b.applyMatrix4(obj.matrixWorld);
          box.union(b);
        }
      }
    });
    if (box.isEmpty()) return;
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    this.controls.target.copy(center);
    const targetZoom = (this.camera.top - this.camera.bottom) / (maxDim * 0.5);
    this.camera.zoom = Math.min(targetZoom, 100);
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.markSceneDirty();
  }
  // --- 测量逻辑 ---
  startMeasurement(type) {
    this.measureType = type;
    this.currentMeasurePoints = [];
    this.currentMeasureModelUuid = null;
    this.clearMeasurementPreview();
  }
  addMeasurePoint(point, modelUuid) {
    const context = this.getMeasurementContext();
    const result = applyAddMeasurePoint(context, point, modelUuid);
    this.syncMeasurementState(result.state);
    if (result.needsRender) this.markSceneDirty();
    return result.completed ?? null;
  }
  updateMeasurePreview(hoverPoint) {
    const context = this.getMeasurementContext();
    const result = applyUpdateMeasurePreview(context, hoverPoint);
    this.syncMeasurementState(result.state);
  }
  updateMeasureHover(clientX, clientY) {
    const context = this.getMeasurementContext();
    const result = applyUpdateMeasureHover(context, clientX, clientY);
    this.syncMeasurementState(result.state);
    if (result.needsRender) this.markSceneDirty();
  }
  finalizeMeasurement() {
    const context = this.getMeasurementContext();
    const result = applyFinalizeMeasurement(context);
    this.syncMeasurementState(result.state);
    if (result.needsRender) this.markSceneDirty();
    return result.completed ?? null;
  }
  highlightMeasurement(id) {
    const result = applyHighlightMeasurement(this.getMeasurementContext(), id);
    this.syncMeasurementState(result.state);
    this.markSceneDirty();
  }
  pickMeasurement(clientX, clientY) {
    return applyPickMeasurement(this.getMeasurementContext(), clientX, clientY);
  }
  /**
   * 获取对象的面积和体积
   */
  getObjectGeometryData(uuid) {
    return getObjectGeometryDataFromScene({
      uuid,
      optimizedMapping: this.optimizedMapping,
      contentGroup: this.contentGroup
    });
  }
  // ========== 框选方法 ==========
  /**
   * 开始框选
   */
  startBoxSelect(clientX, clientY) {
    const result = applyStartBoxSelect(this.boxSelectState, clientX, clientY);
    this.syncBoxSelectState(result.state);
  }
  /**
   * 更新框选范围
   */
  updateBoxSelect(clientX, clientY) {
    const result = applyUpdateBoxSelect(this.boxSelectState, clientX, clientY);
    this.syncBoxSelectState(result.state);
  }
  /**
   * 完成框选，返回选中的对象 UUID 列表
   */
  endBoxSelect() {
    const result = applyEndBoxSelect(
      this.boxSelectState,
      this.canvas,
      (x1, y1, x2, y2) => this.selectByScreenRect(x1, y1, x2, y2)
    );
    this.syncBoxSelectState(result.state);
    return result.selected;
  }
  /**
   * 取消框选
   */
  cancelBoxSelect() {
    const result = applyCancelBoxSelect(this.boxSelectState);
    this.syncBoxSelectState(result.state);
  }
  /**
   * 通过屏幕矩形选择对象
   */
  selectByScreenRect(x1, y1, x2, y2) {
    const pickingState = ensureInteractableList(this.getPickingContext());
    this.syncPickingState(pickingState);
    return selectInteractablesByScreenRect(
      {
        camera: this.camera,
        interactableList: this.interactableList
      },
      x1,
      y1,
      x2,
      y2
    );
  }
  removeMeasurement(id) {
    if (this.measureRecords.has(id)) {
      const record = this.measureRecords.get(id);
      if (record) {
        this.measureGroup.remove(record.group);
        this.measureRecords.delete(id);
        if (this.onMeasureUpdate) {
          this.onMeasureUpdate(Array.from(this.measureRecords.values()));
        }
        this.markSceneDirty();
      }
    }
  }
  clearAllMeasurements() {
    this.measureRecords.forEach((record) => {
      this.measureGroup.remove(record.group);
    });
    this.measureRecords.clear();
    this.clearMeasurementPreview();
    if (this.onMeasureUpdate) {
      this.onMeasureUpdate([]);
    }
    this.markSceneDirty();
  }
  clearMeasurementPreview() {
    const context = this.getMeasurementContext();
    const result = applyClearMeasurementPreview(context);
    this.syncMeasurementState(result.state);
    this.markSceneDirty();
  }
  // --- 剖切逻辑 ---
  setupClipping() {
    const result = applySetupClipping(this.getClippingContext());
    this.syncClippingState(result.state);
  }
  setClipHelperOptions(options) {
    const result = applySetClipHelperOptions(this.getClippingContext(), options);
    this.syncClippingState(result.state);
    this.markSceneDirty();
  }
  setClippingEnabled(enabled) {
    this.renderer.clippingPlanes = enabled ? this.clippingPlanes : [];
    if (!enabled) {
      this.clipPlaneHelpers.forEach((h) => h.visible = false);
    }
    this.markSceneDirty();
  }
  updateClippingPlanes(bounds, values, active) {
    const result = applyUpdateClippingPlanes(this.getClippingContext(), bounds, values, active);
    this.syncClippingState(result.state);
    if (result.needsRender) this.markSceneDirty();
  }
  /**
   * 检查包围盒是否完全被当前剖切面裁剪掉
   * 如果包围盒完全在任意一个激活的剖切面的“背面”，则认为被裁剪
   */
  isBoxClipped(box) {
    return isBoxClippedByPlanes(this.clippingPlanes, box);
  }
  getStats() {
    return collectSceneManagerStats({
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
    this.disposed = true;
    this.animateFramePending = false;
    this.cancelBoxSelect();
    disposeSceneManagerResources({
      cancelDeferredStructureBuild: () => this.cancelDeferredStructureBuild(),
      clearLocateFocus: () => this.clearLocateFocus(),
      releaseGhostLine: (line) => this.releaseGhostLine(line),
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
        this.workers = [];
        this.activeWorkerCount = 0;
      },
      onQueuesReset: () => {
        this.processingChunks.clear();
        this.cancelledChunkIds.clear();
        this.prefetchQueue = [];
        this.prefetchQueueSet.clear();
        this.prefetchInFlight.clear();
        this.chunkReadCache.clear();
        this.chunkReadCacheOrder = [];
      },
      onStateCachesReset: () => {
        this.highlightedUuids.clear();
        this.locateResultSet.clear();
        this.fastPreviewModels.clear();
        this.ghostMeshPool.length = 0;
      }
    });
  }
}

const themes = {
  light: {
    bg: "#F8FAFF",
    panelBg: "#FFFFFF",
    headerBg: "#E0E2EC",
    border: "#d2d2d2",
    text: "#1C1B1F",
    textLight: "#000000",
    textMuted: "#49454F",
    accent: "#0061A4",
    highlight: "#E0E2EC",
    itemHover: "rgba(0, 97, 164, 0.08)",
    success: "#217346",
    warning: "#CA8A04",
    danger: "#B3261E",
    canvasBg: "#FFFFFF",
    shadow: "rgba(0, 0, 0, 0.15)"
  }
};
const DEFAULT_FONT = "'Roboto', 'Inter', 'Segoe UI', 'Microsoft YaHei', sans-serif";

const resources = {
  en: {
    home: "Home",
    menu_open_file: "Open File",
    menu_open_folder: "Open Folder",
    menu_open_url: "Open URL",
    menu_batch_convert: "Batch Convert",
    menu_file: "File",
    menu_export: "Export",
    interface_display: "Display",
    view: "View",
    menu_fit_view: "Fit View",
    view_top: "Top",
    view_bottom: "Bottom",
    view_front: "Front",
    view_back: "Back",
    view_left: "Left",
    view_right: "Right",
    view_se: "SE",
    view_sw: "SW",
    view_ne: "NE",
    view_nw: "NW",
    cube_top: "Top",
    cube_bottom: "Bottom",
    cube_front: "Front",
    cube_back: "Back",
    cube_left: "Left",
    cube_right: "Right",
    op_pick: "Select Model",
    op_clear: "Clear",
    tool_measure: "Measure",
    tool: "Tools",
    tool_clip: "Section",
    settings: "Settings",
    setting_general: "Preferences",
    interface_outline: "Structures",
    interface_props: "Properties",
    status_ready: "Ready",
    loading_resources: "Loading resources...",
    analyzing: "Analyzing...",
    reading: "Reading",
    success: "Operation Successful",
    failed: "Failed",
    processing: "Processing",
    no_selection: "No selection",
    no_models: "No model loaded",
    no_measurements: "No measurements",
    search_nodes: "Search nodes...",
    search_props: "Search properties...",
    copy_all_props: "Copy All",
    copy_group_props: "Copy Group",
    prop_groups: "Groups",
    prop_items: "Items",
    about_version: "Version",
    ifc_view_normalized: "Normalized",
    ifc_view_raw: "Raw IFC",
    ifc_filter_storey: "All Storeys",
    ifc_filter_elevation: "All Elevations",
    ifc_filter_system: "All Systems",
    ifc_filter_category: "All Categories",
    ifc_filter_material: "All Materials",
    ifc_filter_clear: "Clear Filters",
    ifc_filter_apply_viewport: "Apply To Viewport",
    ifc_filter_applied: "IFC filter isolated",
    no_matching_ifc_filter: "No components match the current IFC filter",
    ifc_workset_current: "Current Storey",
    ifc_workset_adjacent: "Adjacent Storeys",
    ifc_workset_applied: "Storey workset isolated",
    expand_all: "Expand All",
    collapse_all: "Collapse All",
    isolate_selection: "Isolate Selection",
    clear_selection: "Clear Selection",
    ctx_show_all: "Show All",
    hide_selected: "Hide Selected",
    show_all: "Show All",
    ctx_hide_selection: "Hide Selection",
    monitor_meshes: "Mesh",
    monitor_faces: "Faces",
    monitor_mem: "Mem",
    monitor_calls: "Calls",
    selected_count: "Selected",
    tips_rotate: "LMB: Rotate",
    tips_pan: "MMB: Pan",
    tips_zoom: "Scroll: Zoom",
    confirm_delete: "Confirm delete",
    confirm_clear: "Are you sure you want to clear the scene?",
    app_title: "3D Browser - Professional Viewer",
    interface_display_short: "Display",
    view_perspective: "Perspective",
    view_ortho: "Orthographic",
    writing: "Writing files...",
    delete_item: "Delete Item",
    btn_confirm: "Confirm",
    btn_cancel: "Cancel",
    panel_close: "Close",
    // 属性
    pg_basic: "Basic Information",
    pg_geo: "Geometry",
    pg_clash: "Clash Status",
    prop_name: "Name",
    prop_id: "ID",
    prop_type: "Type",
    prop_status: "Status",
    prop_pos: "Position",
    prop_dim: "Dimensions",
    prop_inst: "Instances",
    prop_vert: "Vertices",
    prop_tri: "Triangles",
    prop_area: "Area",
    prop_volume: "Volume",
    // 测量
    measure_title: "Measurement Tool",
    measure_type: "Type",
    measure_none: "None",
    measure_dist: "Distance",
    measure_angle: "Angle",
    measure_coord: "Coordinate",
    measure_instruct_dist: "Click 2 points to measure distance.",
    measure_instruct_angle: "Click 3 points (Start-Vertex-End).",
    measure_instruct_coord: "Click any point to get coordinates.",
    measure_clear: "Clear All",
    measure_start: "Start",
    measure_stop: "Stop",
    measure_panel_hint: "Choose a mode, then click points in the viewport to measure.",
    tb_boxSelect: "Box Select",
    tb_boxSelect_hint: "Drag to select objects",
    tb_wireframe: "Wireframe",
    op_screenshot: "Screenshot",
    // 渲染样式
    display_mode: "DisplayMode",
    dm_solid: "Solid",
    dm_transparent: "Transparent",
    dm_wireframe: "Wireframe",
    dm_solidwire: "Solid with Outline",
    dm_hidden: "Hidden Line",
    // 剖切
    clip_title: "Sectioning Tool",
    clip_enable: "Enable Clipping",
    clip_x: "X Axis",
    clip_y: "Y Axis",
    clip_z: "Z Axis",
    clip_helper_visible: "Show Helpers",
    clip_helper_opacity: "Helper Opacity",
    clip_reset: "Reset Range",
    // 导出
    export_title: "Export Scene",
    export_format: "Format",
    export_glb: "GLB (Standard)",
    export_lmb: "LMB (Custom Compressed)",
    export_nbim: "NBIM (High Performance)",
    export_filename: "File Name",
    export_filename_placeholder: "Enter file name",
    export_filename_hint: "Leave empty to auto-generate from model names",
    export_batch_name: "batch_export",
    export_btn: "Export",
    // 设置
    st_lighting: "Lighting",
    st_ambient: "Ambient Int.",
    st_dir: "Direct Int.",
    st_back: "Back Light Int.",
    st_render_mode: "Render Mode",
    st_render_standard: "Standard",
    st_render_mayo: "Mayo",
    st_render_blender: "Blender",
    st_sun_simulation: "Sun Simulation",
    st_sun_enabled: "Enable Sun",
    st_sun_latitude: "Latitude",
    st_sun_longitude: "Longitude",
    st_sun_time: "Time",
    st_sun_info: "Set location and time for realistic sunlight",
    st_sun_shadow: "Show Shadows",
    st_bg: "Background",
    st_lang: "Language",
    st_theme: "Theme",
    st_menu_mode: "Menu Mode",
    menu_mode_menu: "Menu",
    menu_mode_toolbar: "Toolbar",
    tb_file: "File",
    tb_folder: "Folder",
    tb_export: "Export",
    tb_clear: "Clear",
    tb_fit: "Fit",
    tb_view: "View",
    tb_model: "Model",
    tb_props: "Props",
    tb_pick: "Pick",
    tb_measure: "Measure",
    tb_clip: "Clip",
    tb_screenshot: "Shot",
    tb_settings: "Setting",
    tb_about: "About",
    tb_search: "Search",
    tb_clash: "Clash",
    tb_sun: "Sun",
    tb_explode: "Explode",
    search_conditions: "Search Conditions",
    search_field_name: "Property Name",
    search_field_value: "Property Value",
    search_add_condition: "Add Condition",
    search_run: "Search",
    search_clear: "Clear Results",
    search_no_results: "No Results",
    search_page_size: "Per Page",
    search_page_prev: "Prev",
    search_page_next: "Next",
    searching: "Searching...",
    search_invalid_condition: "Please fill at least one complete condition",
    search_cancel: "Cancel Search",
    search_cancelled: "Search Cancelled",
    remove_condition: "Remove Condition",
    search_connector_and: "AND",
    search_connector_or: "OR",
    search_op_equals: "Equals",
    search_op_contains: "Contains",
    search_op_not_contains: "Not Contains",
    search_op_starts_with: "Starts With",
    search_op_ends_with: "Ends With",
    clash_placeholder: "Clash detection will be implemented in phase 2. This phase keeps the toolbar entry and panel scaffold.",
    clash_run: "Run Check",
    clash_clear: "Clear Results",
    clash_ready: "Ready",
    clash_collecting: "Collecting Candidates...",
    clash_running: "Running clash detection...",
    clash_results: "Clash Results",
    clash_no_results: "No clash results",
    clash_scope_visible: "Scope: Visible objects",
    clash_candidates: "Candidates",
    clash_overlap_volume: "Overlap Volume",
    clash_insufficient_candidates: "Not enough candidates (at least 2 required)",
    clash_set_a: "Model Set A",
    clash_set_b: "Model Set B",
    clash_no_models: "No models",
    clash_tolerance: "Tolerance",
    clash_min_overlap: "Min Overlap Volume",
    clash_clearance_distance: "Min Clearance Distance",
    clash_clearance_value: "Clearance Distance",
    clash_detection_type: "Detection Type",
    clash_type_all: "All Types",
    clash_type_hard: "Hard Clash",
    clash_type_clearance: "Clearance Clash",
    clash_narrow_phase: "Enable Narrow Phase (OBB)",
    clash_triangle_phase: "Enable Triangle Validation",
    clash_include_same_model: "Include Intra-model Checks",
    clash_pairs_scanned: "Pairs Scanned",
    clash_export_csv: "Export CSV",
    clash_group_all: "All",
    clash_group_new: "New",
    clash_group_confirmed: "Confirmed",
    clash_group_resolved: "Resolved",
    clash_mark_confirmed: "Mark Group Confirmed",
    clash_mark_resolved: "Mark Group Resolved",
    clash_mark_new: "Mark Group New",
    clash_isolate_new: "Isolate New",
    clash_isolate_confirmed: "Isolate Confirmed",
    clash_severity_high: "High",
    clash_severity_medium: "Medium",
    clash_severity_low: "Low",
    tree_clash_only: "Clash Nodes Only",
    st_monitor: "Performance Panel",
    st_adaptive_quality: "Adaptive Quality",
    st_performance_profile: "Performance Profile",
    st_perf_smooth: "Smooth",
    st_perf_balanced: "Balanced",
    st_perf_quality: "Quality",
    st_exposure: "Exposure",
    st_tonemapping: "Tone Mapping",
    st_shadow_quality: "Shadow Quality",
    st_shadow_off: "Off",
    st_shadow_low: "Low",
    st_shadow_medium: "Medium",
    st_shadow_high: "High",
    st_instancing: "Instancing Render",
    st_viewport: "Viewport",
    st_viewcube_size: "ViewCube Size",
    st_frustum_culling: "Frustum Culling",
    st_highlight: "Highlight",
    st_highlight_color: "Highlight Color",
    st_highlight_box: "Show Bounding Box",
    unsupported_format: "Unsupported format",
    theme_dark: "Dark",
    theme_light: "Light",
    ready: "ready",
    all_chunks_loaded: "All model chunks loaded",
    loading_chunks: "Chunks",
    loading_cad_engine: "Loading CAD engine...",
    parsing_cad_data: "Parsing CAD data...",
    creating_geometry: "Creating geometry...",
    error_cad_parse_failed: "Failed to parse CAD file",
    model_loaded: "Model loaded",
    confirm_clear_title: "Clear Scene",
    confirm_clear_msg: "Are you sure you want to clear all models in the scene?",
    menu_about: "About",
    about_title: "About 3D Browser",
    about_author: "Author",
    about_tagline: "Professional 3D Model Viewer",
    about_copyright: "Copyright © 2026. All rights reserved.",
    project_url: "Project URL",
    about_license: "License",
    about_license_nc: "Non-commercial Use Only",
    license_details: "License Details",
    third_party_libs: "Third-party Libraries",
    license_summary: "This software is licensed under Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).\n\nKey terms:\n• Free for non-commercial use only\n• Commercial use is strictly prohibited\n• Attribution required\n• ShareAlike for adaptations (non-commercial)\n• No warranties or liability\n\nFor commercial licensing, contact: zhangly1403@163.com",
    third_party_desc: "This software uses the following open-source libraries:",
    view_package_json: "View full dependency list in package.json",
    full_license: "Full license:",
    error_title: "Application Error",
    error_msg: "Sorry, the application encountered an unexpected error. You can try reloading the page or contact the developer.",
    error_reload: "Reload Page",
    viewpoint_title: "Viewpoint Management",
    viewpoint_save: "Save Current Viewpoint",
    viewpoint_empty: "No saved viewpoints",
    viewpoint_loading: "Restoring viewpoint",
    viewpoint_default_name: "Viewpoint",
    viewpoint_load: "Restore",
    viewpoint_load_hint: "Double click to restore",
    viewpoint_overwrite: "Overwrite",
    viewpoint_no_preview: "No preview",
    viewpoint_save_visibility: "Save visibility",
    viewpoint_save_selection: "Save selection",
    viewpoint_save_clip: "Save clipping",
    viewpoint_save_explode: "Save explode",
    viewpoint_flag_visibility: "Visibility",
    viewpoint_flag_selection: "Selection",
    viewpoint_flag_clip: "Clip",
    viewpoint_flag_explode: "Explode",
    chunk_loading: "Chunks",
    select_all: "Select All",
    invert_selection: "Invert Selection",
    set_opacity: "Opacity",
    copied: "Copied",
    click_to_copy: "Click to copy",
    search_results: "Results",
    search_selected_results: "Checked",
    search_batch_highlight: "Batch Highlight",
    search_add_to_selection: "Add To Selection",
    search_export_results: "Export Results",
    locate_in_view: "Locate in View",
    settings_more: "More Settings",
    locate_first_match: "Locate First Match",
    ifc_locator_all: "All",
    ifc_locator_name: "Name",
    ifc_locator_globalid: "GlobalId",
    ifc_locator_classification: "Classification",
    ifc_locator_type: "Type",
    ifc_locator_placeholder: "Locate by IFC identifier...",
    ifc_locator_results: "IFC Matches",
    ifc_locator_prev: "Previous",
    ifc_locator_next: "Next",
    ifc_locator_action: "Locate Element",
    explode_title: "Explode View",
    explode_enable: "Enable",
    explode_strength: "Strength",
    explode_mode: "Mode",
    explode_mode_radial: "Radial",
    explode_mode_horizontal: "Horizontal",
    explode_mode_vertical: "Vertical",
    explode_reset: "Reset",
    op_screenshot_transparent: "Transparent Screenshot",
    screenshot_mode: "Capture Mode",
    screenshot_scene_desc: "Export PNG with the current scene background",
    screenshot_transparent_desc: "Export transparent PNG for documents and overlays",
    summary_parent: "Parent",
    summary_children: "Children",
    summary_visible: "Visible",
    summary_yes: "Yes",
    summary_no: "No",
    summary_models: "Models",
    summary_types: "Type Mix",
    summary_bounds: "Selection Bounds",
    summary_total_area: "Total Area",
    summary_total_volume: "Total Volume",
    mode_measure: "Measuring",
    mode_clip: "Clipping",
    mode_search: "Search Highlight",
    mode_hidden: "Hidden Objects",
    mode_isolated: "Isolated Objects",
    mode_box_select: "Box Selection",
    mode_clash: "Clash Active",
    mode_clear: "Clear",
    stats_original_meshes: "Original Meshes",
    stats_triangles: "Triangles",
    stats_chunks: "Chunks",
    stats_pixel_ratio: "Pixel Ratio",
    confirm: "Confirm",
    view_home: "Home View"
  },
  zh: {
    home: "首页",
    view_home: "主视图",
    menu_open_file: "打开文件",
    menu_open_folder: "打开目录",
    menu_open_url: "打开 URL",
    menu_batch_convert: "批量转换",
    menu_file: "文件",
    menu_export: "导出场景",
    interface_display: "界面",
    view: "视图",
    menu_fit_view: "充满视图",
    view_top: "顶视",
    view_bottom: "底视",
    view_front: "前视",
    view_back: "后视",
    view_left: "左视",
    view_right: "右视",
    view_se: "东南",
    view_sw: "西南",
    view_ne: "东北",
    view_nw: "西北",
    cube_top: "顶",
    cube_bottom: "底",
    cube_front: "前",
    cube_back: "后",
    cube_left: "左",
    cube_right: "右",
    op_pick: "选择模式",
    op_clear: "清空场景",
    tool: "工具",
    tool_measure: "测量工具",
    tool_clip: "剖切工具",
    settings: "设置",
    setting_general: "全局设置",
    interface_outline: "模型结构",
    interface_props: "对象属性",
    status_ready: "就绪",
    loading_resources: "正在加载资源...",
    analyzing: "正在分析...",
    reading: "读取",
    success: "操作成功",
    failed: "失败",
    processing: "处理中",
    no_selection: "未选择对象",
    no_models: "未加载模型",
    no_measurements: "无测量结果",
    search_nodes: "搜索节点...",
    search_props: "搜索属性...",
    copy_all_props: "复制全部",
    copy_group_props: "复制组",
    prop_groups: "分组",
    prop_items: "条目",
    about_version: "版本",
    ifc_view_normalized: "规范化",
    ifc_view_raw: "原始 IFC",
    ifc_filter_storey: "全部楼层",
    ifc_filter_elevation: "全部标高",
    ifc_filter_system: "全部系统",
    ifc_filter_category: "全部类别",
    ifc_filter_material: "全部材质",
    ifc_filter_clear: "清除筛选",
    ifc_filter_apply_viewport: "应用到视口",
    ifc_filter_applied: "已按 IFC 筛选隔离显示",
    no_matching_ifc_filter: "没有匹配当前 IFC 筛选的构件",
    ifc_workset_current: "当前楼层",
    ifc_workset_adjacent: "上下楼层",
    ifc_workset_applied: "已按楼层工作集隔离显示",
    expand_all: "全部展开",
    collapse_all: "全部折叠",
    isolate_selection: "隔离选择",
    clear_selection: "清空选择",
    ctx_show_all: "显示所有",
    hide_selected: "隐藏选中",
    show_all: "显示全部",
    ctx_hide_selection: "隐藏选择",
    monitor_meshes: "网格",
    monitor_faces: "面",
    monitor_mem: "显存",
    monitor_calls: "绘制",
    selected_count: "已选择",
    tips_rotate: "左键旋转",
    tips_pan: "中键平移",
    tips_zoom: "滚轮缩放",
    confirm_delete: "确定要删除吗？",
    confirm_clear: "确定要清空场景吗？",
    app_title: "3D Browser - 专业浏览器",
    interface_display_short: "显示",
    view_perspective: "透视",
    view_ortho: "正交",
    delete_item: "删除模型",
    btn_confirm: "确定",
    btn_cancel: "取消",
    panel_close: "关闭",
    // 属性
    pg_basic: "基本信息",
    pg_geo: "几何信息",
    pg_clash: "碰撞状态",
    prop_name: "名称",
    prop_id: "ID",
    prop_type: "类型",
    prop_status: "状态",
    prop_pos: "位置",
    prop_dim: "尺寸",
    prop_inst: "实例数",
    prop_vert: "顶点数",
    prop_tri: "面数",
    prop_area: "面积",
    prop_volume: "体积",
    // 测量
    measure_title: "测量面板",
    measure_type: "测量类型",
    measure_none: "无",
    measure_dist: "长度",
    measure_angle: "角度",
    measure_coord: "坐标",
    measure_instruct_dist: "请在场景中点击两个点以测量距离。",
    measure_instruct_angle: "请点击三个点测量角度 (起点-顶点-终点)。",
    measure_instruct_coord: "点击任意位置获取世界坐标。",
    measure_clear: "清空测量",
    measure_start: "开始测量",
    measure_stop: "停止测量",
    measure_panel_hint: "选择测量方式后，在视口中点击点位开始测量。",
    tb_boxSelect: "框选",
    tb_boxSelect_hint: "拖拽选择对象",
    tb_wireframe: "线框",
    op_screenshot: "场景截图",
    // 渲染样式
    display_mode: "样式",
    dm_solid: "着色",
    dm_transparent: "透明",
    dm_wireframe: "线框",
    dm_solidwire: "着色带轮廓线",
    dm_hidden: "消隐",
    // 剖切
    clip_title: "剖切面板",
    clip_enable: "开启剖切",
    clip_x: "X 轴",
    clip_y: "Y 轴",
    clip_z: "Z 轴",
    clip_helper_visible: "显示辅助面",
    clip_helper_opacity: "辅助面透明度",
    clip_reset: "重置范围",
    // 导出
    export_title: "导出场景",
    export_format: "导出格式",
    export_glb: "GLB (标准通用)",
    export_lmb: "LMB (自定义压缩)",
    export_nbim: "NBIM (高性能分块模型)",
    export_filename: "文件名",
    export_filename_placeholder: "请输入文件名",
    export_filename_hint: "为空时自动按模型名生成",
    export_batch_name: "批量导出",
    export_btn: "开始导出",
    // 设置
    st_lighting: "场景光照",
    st_ambient: "环境光强度",
    st_dir: "直射光强度",
    st_back: "背光强度",
    st_render_mode: "渲染模式",
    st_render_standard: "标准",
    st_render_mayo: "Mayo",
    st_render_blender: "Blender",
    st_sun_simulation: "光照模拟",
    st_sun_enabled: "启用太阳光",
    st_sun_latitude: "纬度",
    st_sun_longitude: "经度",
    st_sun_time: "时间",
    st_sun_info: "设置位置和时间以模拟真实光照效果",
    st_sun_shadow: "显示阴影",
    st_bg: "背景颜色",
    st_lang: "界面语言",
    st_theme: "界面主题",
    st_menu_mode: "菜单模式",
    menu_mode_menu: "菜单",
    menu_mode_toolbar: "工具栏",
    tb_file: "文件",
    tb_folder: "目录",
    tb_export: "导出",
    tb_clear: "清空",
    tb_fit: "充满",
    tb_view: "视图",
    tb_model: "模型",
    tb_props: "属性",
    tb_pick: "选择",
    tb_measure: "测量",
    tb_clip: "剖切",
    tb_screenshot: "截图",
    tb_settings: "设置",
    tb_about: "关于",
    tb_search: "搜索",
    tb_clash: "碰撞",
    tb_sun: "光照",
    tb_explode: "爆炸",
    search_conditions: "搜索条件",
    search_field_name: "属性名",
    search_field_value: "属性值",
    search_add_condition: "添加条件",
    search_run: "搜索",
    search_clear: "清除结果",
    search_no_results: "暂无结果",
    search_page_size: "每页",
    search_page_prev: "上一页",
    search_page_next: "下一页",
    searching: "搜索中...",
    search_invalid_condition: "请至少输入一组完整的搜索条件",
    search_cancel: "取消搜索",
    search_cancelled: "搜索已取消",
    remove_condition: "移除条件",
    search_connector_and: "且",
    search_connector_or: "或",
    search_op_equals: "等于",
    search_op_contains: "包含",
    search_op_not_contains: "不包含",
    search_op_starts_with: "开头",
    search_op_ends_with: "结尾",
    clash_placeholder: "碰撞检查将在下一期实现。本期已预留工具入口与结果面板结构。",
    clash_run: "开始检查",
    clash_clear: "清空结果",
    clash_ready: "准备就绪",
    clash_collecting: "正在收集候选构件...",
    clash_running: "正在执行碰撞检查...",
    clash_results: "碰撞结果",
    clash_no_results: "暂无碰撞结果",
    clash_scope_visible: "范围：当前可见构件",
    clash_candidates: "候选",
    clash_overlap_volume: "重叠体积",
    clash_insufficient_candidates: "可检测构件不足（至少需要2个）",
    clash_set_a: "模型集 A",
    clash_set_b: "模型集 B",
    clash_no_models: "暂无模型",
    clash_tolerance: "容差",
    clash_min_overlap: "最小重叠体积",
    clash_clearance_distance: "最小净空距离",
    clash_clearance_value: "净空距离",
    clash_detection_type: "检测类型",
    clash_type_all: "全部类型",
    clash_type_hard: "硬碰撞",
    clash_type_clearance: "净空碰撞",
    clash_narrow_phase: "启用精筛（OBB）",
    clash_triangle_phase: "启用三角面复核",
    clash_include_same_model: "包含同模型内检测",
    clash_pairs_scanned: "已扫描对数",
    clash_export_csv: "导出 CSV",
    clash_group_all: "全部",
    clash_group_new: "新建",
    clash_group_confirmed: "已确认",
    clash_group_resolved: "已解决",
    clash_mark_confirmed: "当前组标记已确认",
    clash_mark_resolved: "当前组标记已解决",
    clash_mark_new: "当前组标记新建",
    clash_isolate_new: "仅看新建",
    clash_isolate_confirmed: "仅看已确认",
    clash_severity_high: "高",
    clash_severity_medium: "中",
    clash_severity_low: "低",
    tree_clash_only: "仅显示冲突节点",
    st_monitor: "性能面板",
    st_adaptive_quality: "自适应画质",
    st_performance_profile: "性能策略",
    st_perf_smooth: "流畅优先",
    st_perf_balanced: "平衡",
    st_perf_quality: "画质优先",
    st_exposure: "曝光",
    st_tonemapping: "色调映射",
    st_shadow_quality: "阴影质量",
    st_shadow_off: "关闭",
    st_shadow_low: "低",
    st_shadow_medium: "中",
    st_shadow_high: "高",
    st_instancing: "实例化渲染",
    st_viewport: "视口设置",
    st_viewcube_size: "导航方块大小",
    st_frustum_culling: "视锥体剔除",
    st_highlight: "高亮设置",
    st_highlight_color: "高亮颜色",
    st_highlight_box: "显示包围盒",
    unsupported_format: "不支持的文件格式",
    theme_dark: "深色模式",
    theme_light: "浅色模式",
    ready: "就绪",
    all_chunks_loaded: "所有模型分片已加载",
    loading_chunks: "分片",
    loading_cad_engine: "正在加载 CAD 引擎...",
    parsing_cad_data: "正在解析 CAD 数据...",
    creating_geometry: "正在生成几何体...",
    error_cad_parse_failed: "CAD 文件解析失败",
    model_loaded: "模型加载完成",
    confirm_clear_title: "清空场景",
    confirm_clear_msg: "确定要清空场景中的所有模型吗？",
    menu_about: "关于",
    about_title: "关于 3D Browser",
    about_author: "作者",
    about_tagline: "专业三维模型查看器",
    about_copyright: "Copyright © 2026. All rights reserved.",
    project_url: "项目地址",
    about_license: "授权协议",
    about_license_nc: "仅限非商业用途",
    license_details: "授权协议详情",
    third_party_libs: "第三方库",
    license_summary: "本软件采用知识共享署名-非商业性使用 4.0 国际许可协议 (CC BY-NC 4.0)。\n\n主要条款：\n• 仅限非商业用途免费使用\n• 禁止用于任何商业目的\n• 必须保留署名\n• 相同方式共享（非商业性改编）\n• 不提供任何担保或责任\n\n如需商业授权，请联系：zhangly1403@163.com",
    third_party_desc: "本软件使用了以下开源库：",
    view_package_json: "查看完整依赖列表请参考 package.json",
    full_license: "完整协议:",
    error_title: "应用发生错误",
    error_msg: "抱歉，程序运行过程中遇到了未预期的错误。您可以尝试重新加载页面，或联系开发人员。",
    error_reload: "重新加载页面",
    viewpoint_title: "视点管理",
    viewpoint_save: "保存当前视点",
    viewpoint_empty: "暂无保存的视点",
    viewpoint_loading: "恢复视点",
    viewpoint_default_name: "视点",
    viewpoint_load: "恢复",
    viewpoint_load_hint: "双击恢复视点",
    viewpoint_overwrite: "覆盖",
    viewpoint_no_preview: "无预览",
    viewpoint_save_visibility: "保存可见性",
    viewpoint_save_selection: "保存选择",
    viewpoint_save_clip: "保存剖切",
    viewpoint_save_explode: "保存爆炸图",
    viewpoint_flag_visibility: "可见性",
    viewpoint_flag_selection: "选择",
    viewpoint_flag_clip: "剖切",
    viewpoint_flag_explode: "爆炸图",
    chunk_loading: "分片加载",
    select_all: "全选",
    invert_selection: "反选",
    set_opacity: "透明度",
    copied: "已复制",
    click_to_copy: "点击复制",
    search_results: "结果数",
    search_selected_results: "已勾选",
    search_batch_highlight: "批量高亮",
    search_add_to_selection: "加入当前选择",
    search_export_results: "导出结果",
    locate_in_view: "定位到视图",
    settings_more: "更多设置",
    locate_first_match: "定位首个匹配",
    ifc_locator_all: "综合",
    ifc_locator_name: "名称",
    ifc_locator_globalid: "GlobalId",
    ifc_locator_classification: "分类编码",
    ifc_locator_type: "类型",
    ifc_locator_placeholder: "按 IFC 标识定位...",
    ifc_locator_results: "IFC 结果",
    ifc_locator_prev: "上一个",
    ifc_locator_next: "下一个",
    ifc_locator_action: "定位构件",
    explode_title: "爆炸图",
    explode_enable: "启用",
    explode_strength: "强度",
    explode_mode: "方向",
    explode_mode_radial: "四周",
    explode_mode_horizontal: "横向",
    explode_mode_vertical: "纵向",
    explode_reset: "重置",
    op_screenshot_transparent: "透明背景截图",
    screenshot_mode: "截图方式",
    screenshot_scene_desc: "导出带当前场景背景的 PNG 截图",
    screenshot_transparent_desc: "导出透明背景 PNG，便于报告排版",
    summary_parent: "父级",
    summary_children: "子节点",
    summary_visible: "可见",
    summary_yes: "是",
    summary_no: "否",
    summary_models: "模型数",
    summary_types: "类型分布",
    summary_bounds: "总体包围盒",
    summary_total_area: "总面积",
    summary_total_volume: "总体积",
    mode_measure: "测量中",
    mode_clip: "剖切中",
    mode_search: "搜索结果高亮",
    mode_hidden: "已隐藏对象",
    mode_isolated: "已隔离对象",
    mode_box_select: "框选中",
    mode_clash: "碰撞结果已激活",
    mode_clear: "清除",
    stats_original_meshes: "原始网格",
    stats_triangles: "三角面",
    stats_chunks: "分片",
    stats_pixel_ratio: "像素比",
    confirm: "确定",
    writing: "正在写入文件..."
  }
};
const getTranslation = (lang, key) => {
  return resources[lang][key] || key;
};

const iconSize = 24;
const iconStrokeWidth = 1.5;
const createIcon = (paths, props = {}) => {
  const { size, color, ...rest } = props;
  return /* @__PURE__ */ jsx(
    "svg",
    {
      width: size || iconSize,
      height: size || iconSize,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color || "currentColor",
      strokeWidth: iconStrokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...rest,
      children: paths
    }
  );
};
const IconChevronRight = (props) => createIcon(/* @__PURE__ */ jsx("polyline", { points: "9 18 15 12 9 6" }), props);
const IconChevronLeft = (props) => createIcon(/* @__PURE__ */ jsx("polyline", { points: "15 18 9 12 15 6" }), props);
const IconChevronDown = (props) => createIcon(/* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" }), props);
const IconChevronUp = (props) => createIcon(/* @__PURE__ */ jsx("polyline", { points: "18 15 12 9 6 15" }), props);
const IconTarget = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "7" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "2.5" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "2", x2: "12", y2: "5" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "19", x2: "12", y2: "22" }),
    /* @__PURE__ */ jsx("line", { x1: "2", y1: "12", x2: "5", y2: "12" }),
    /* @__PURE__ */ jsx("line", { x1: "19", y1: "12", x2: "22", y2: "12" })
  ] }),
  props
);
const IconClear = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("polyline", { points: "3 6 5 6 21 6" }),
    /* @__PURE__ */ jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
    /* @__PURE__ */ jsx("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
    /* @__PURE__ */ jsx("line", { x1: "14", y1: "11", x2: "14", y2: "17" })
  ] }),
  props
);
const IconClose = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
    /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
  ] }),
  props
);
const IconFile = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
    /* @__PURE__ */ jsx("polyline", { points: "14 2 14 8 20 8" })
  ] }),
  props
);
const IconMaximize = (props) => createIcon(
  /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("path", { d: "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" }) }),
  props
);
const IconRuler = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { x: "2", y: "2", width: "20", height: "16", rx: "1" }),
    /* @__PURE__ */ jsx("line", { x1: "6", y1: "14", x2: "6", y2: "17" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "14", x2: "12", y2: "16" }),
    /* @__PURE__ */ jsx("line", { x1: "18", y1: "14", x2: "18", y2: "17" })
  ] }),
  props
);
const IconScissors = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "6", cy: "6", r: "3" }),
    /* @__PURE__ */ jsx("circle", { cx: "6", cy: "18", r: "3" }),
    /* @__PURE__ */ jsx("line", { x1: "20", y1: "4", x2: "8.12", y2: "15.88" }),
    /* @__PURE__ */ jsx("line", { x1: "14.47", y1: "14.48", x2: "20", y2: "20" }),
    /* @__PURE__ */ jsx("line", { x1: "8.12", y1: "8.12", x2: "12", y2: "12" })
  ] }),
  props
);
const IconSettings = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" }),
    /* @__PURE__ */ jsx("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })
  ] }),
  props
);
const IconInfo = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })
  ] }),
  props
);
const IconTrash2 = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("polyline", { points: "3 6 5 6 21 6" }),
    /* @__PURE__ */ jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
    /* @__PURE__ */ jsx("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
    /* @__PURE__ */ jsx("line", { x1: "14", y1: "11", x2: "14", y2: "17" })
  ] }),
  props
);
const IconMousePointer = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" }),
    /* @__PURE__ */ jsx("path", { d: "M13 13l6 6" })
  ] }),
  props
);
const IconBox = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }),
    /* @__PURE__ */ jsx("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "22.08", x2: "12", y2: "12" })
  ] }),
  props
);
const IconList = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("line", { x1: "8", y1: "6", x2: "21", y2: "6" }),
    /* @__PURE__ */ jsx("line", { x1: "8", y1: "12", x2: "21", y2: "12" }),
    /* @__PURE__ */ jsx("line", { x1: "8", y1: "18", x2: "21", y2: "18" }),
    /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "3.01", y2: "6" }),
    /* @__PURE__ */ jsx("line", { x1: "3", y1: "12", x2: "3.01", y2: "12" }),
    /* @__PURE__ */ jsx("line", { x1: "3", y1: "18", x2: "3.01", y2: "18" })
  ] }),
  props
);
const IconActivity = (props) => createIcon(
  /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" }) }),
  props
);
const IconCamera = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "13", r: "4" })
  ] }),
  props
);
const IconEye = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" })
  ] }),
  props
);
const IconSearch = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "7" }),
    /* @__PURE__ */ jsx("line", { x1: "16.65", y1: "16.65", x2: "21", y2: "21" })
  ] }),
  props
);
const IconGrid = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "7", height: "7" }),
    /* @__PURE__ */ jsx("rect", { x: "14", y: "3", width: "7", height: "7" }),
    /* @__PURE__ */ jsx("rect", { x: "14", y: "14", width: "7", height: "7" }),
    /* @__PURE__ */ jsx("rect", { x: "3", y: "14", width: "7", height: "7" })
  ] }),
  props
);
const IconImage = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
    /* @__PURE__ */ jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
    /* @__PURE__ */ jsx("polyline", { points: "21 15 16 10 5 21" })
  ] }),
  props
);
const IconLayers = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }),
    /* @__PURE__ */ jsx("polyline", { points: "2 12 12 17 22 12" }),
    /* @__PURE__ */ jsx("polyline", { points: "2 17 12 22 22 17" })
  ] }),
  props
);
const IconExplode = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "2.25" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "2", x2: "12", y2: "6" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "18", x2: "12", y2: "22" }),
    /* @__PURE__ */ jsx("line", { x1: "2", y1: "12", x2: "6", y2: "12" }),
    /* @__PURE__ */ jsx("line", { x1: "18", y1: "12", x2: "22", y2: "12" }),
    /* @__PURE__ */ jsx("line", { x1: "4.9", y1: "4.9", x2: "7.8", y2: "7.8" }),
    /* @__PURE__ */ jsx("line", { x1: "16.2", y1: "16.2", x2: "19.1", y2: "19.1" }),
    /* @__PURE__ */ jsx("line", { x1: "4.9", y1: "19.1", x2: "7.8", y2: "16.2" }),
    /* @__PURE__ */ jsx("line", { x1: "16.2", y1: "7.8", x2: "19.1", y2: "4.9" })
  ] }),
  props
);
const IconSelectAll = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M3 3h4v4H3zM17 3h4v4h-4zM3 17h4v4H3zM17 17h4v4h-4z", fill: "none" }),
    /* @__PURE__ */ jsx("line", { x1: "7", y1: "5", x2: "17", y2: "5" }),
    /* @__PURE__ */ jsx("line", { x1: "5", y1: "7", x2: "5", y2: "17" }),
    /* @__PURE__ */ jsx("line", { x1: "17", y1: "19", x2: "7", y2: "19" }),
    /* @__PURE__ */ jsx("line", { x1: "19", y1: "17", x2: "19", y2: "7" })
  ] }),
  props
);
const IconViewTop = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 12,13 3,8", fill: "currentColor", fillOpacity: "0.55" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  props
);
const IconViewBottom = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ jsx("polygon", { points: "3,16 12,13 21,16 12,21", fill: "currentColor", fillOpacity: "0.55" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  props
);
const IconViewFront = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ jsx("polygon", { points: "3,8 12,13 12,21 3,16", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  props
);
const IconViewBack = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ jsx("polygon", { points: "21,8 12,13 12,21 21,16", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  props
);
const IconViewLeft = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ jsx("polygon", { points: "3,8 12,3 12,13 3,8", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  props
);
const IconViewRight = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ jsx("polygon", { points: "21,8 12,3 12,13 21,8", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  props
);
const IconViewSW = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ jsx("polygon", { points: "3,8 12,13 12,21 3,16", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 12,13 3,8", fill: "currentColor", fillOpacity: "0.25" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  props
);
const IconViewSE = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ jsx("polygon", { points: "21,8 12,13 12,21 21,16", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 12,13 3,8", fill: "currentColor", fillOpacity: "0.25" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  props
);
const IconViewNE = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ jsx("polygon", { points: "21,8 12,13 12,21 21,16", fill: "currentColor", fillOpacity: "0.25" }),
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 12,13 3,8", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  props
);
const IconViewNW = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.08" }),
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ jsx("polygon", { points: "3,8 12,13 12,21 3,16", fill: "currentColor", fillOpacity: "0.25" }),
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 12,13 3,8", fill: "currentColor", fillOpacity: "0.45" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  props
);
const IconSolid = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "currentColor", fillOpacity: "0.35" }),
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "13", x2: "12", y2: "21" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  props
);
const IconTransparent = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", fill: "none" }),
    /* @__PURE__ */ jsx("polygon", { points: "12,3 21,8 21,16 12,21 3,16 3,8", strokeDasharray: "2 2" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "13", x2: "12", y2: "21", strokeDasharray: "2 2" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "3", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "3", y1: "8", x2: "12", y2: "13" }),
    /* @__PURE__ */ jsx("line", { x1: "21", y1: "8", x2: "12", y2: "13" })
  ] }),
  props
);
const IconOpenFile = (props) => createIcon(
  /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("path", { d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" }) }),
  props
);
const IconExportScene = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    /* @__PURE__ */ jsx("polyline", { points: "7 10 12 15 17 10" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
  ] }),
  props
);
const IconCopy = (props) => createIcon(
  /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
  ] }),
  props
);

const ImageButton = ({
  icon,
  label,
  active,
  theme,
  style,
  className = "",
  disabled,
  ...props
}) => {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      style: { opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer", ...style },
      className: `ui-toolbar-btn ${active ? "active" : ""} ${className}`,
      disabled,
      ...props,
      children: [
        /* @__PURE__ */ jsx("div", { className: "ui-toolbar-btn-icon", children: icon }),
        label && /* @__PURE__ */ jsx("div", { className: "ui-toolbar-btn-label", children: label })
      ]
    }
  );
};

const Toolbar = (props) => {
  const {
    t,
    theme,
    hiddenMenus = []
  } = props;
  const isHidden = (id) => (hiddenMenus || []).includes(id);
  const fileInputRef = React.useRef(null);
  const batchConvertInputRef = React.useRef(null);
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = React.useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const toggleMenu = (menuId) => {
    setOpenMenu(openMenu === menuId ? null : menuId);
  };
  const renderDropdown = (menuId, items) => {
    if (openMenu !== menuId) return null;
    return /* @__PURE__ */ jsx("div", { ref: menuRef, className: "ui-toolbar-menu", children: items });
  };
  const menuItem = (icon, label, onClick) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: "ui-toolbar-menu-item",
      onClick,
      children: [
        /* @__PURE__ */ jsx("span", { className: "ui-toolbar-menu-icon", children: icon }),
        label
      ]
    }
  );
  const menuDivider = () => /* @__PURE__ */ jsx("div", { className: "ui-toolbar-menu-divider" });
  return /* @__PURE__ */ jsxs("div", { className: "ui-toolbar", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "file",
        ref: fileInputRef,
        style: { display: "none" },
        multiple: true,
        accept: ".lmb,.lmbz,.glb,.gltf,.ifc,.nbim,.fbx,.obj,.stl,.ply,.3ds,.dae,.stp,.step,.igs,.iges",
        onChange: props.handleOpenFiles
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "file",
        ref: batchConvertInputRef,
        style: { display: "none" },
        multiple: true,
        accept: ".lmb,.lmbz,.glb,.gltf,.ifc,.fbx,.obj,.stl,.ply,.3ds,.dae,.stp,.step,.igs,.iges",
        onChange: props.handleBatchConvert
      }
    ),
    !isHidden("file") && /* @__PURE__ */ jsx("div", { className: "ui-toolbar-group", children: /* @__PURE__ */ jsxs("div", { className: "ui-toolbar-menu-anchor", children: [
      /* @__PURE__ */ jsx(
        ImageButton,
        {
          icon: /* @__PURE__ */ jsx(IconFile, {}),
          label: t("tb_file"),
          active: openMenu === "file",
          onClick: () => toggleMenu("file"),
          theme
        }
      ),
      renderDropdown("file", /* @__PURE__ */ jsxs(Fragment, { children: [
        !isHidden("open_file") && menuItem(/* @__PURE__ */ jsx(IconOpenFile, {}), t("menu_open_file"), () => {
          fileInputRef.current?.click();
          setOpenMenu(null);
        }),
        !isHidden("export") && menuItem(/* @__PURE__ */ jsx(IconExportScene, {}), t("menu_export"), () => {
          props.setActiveTool?.("export");
          setOpenMenu(null);
        }),
        !isHidden("clear") && /* @__PURE__ */ jsxs(Fragment, { children: [
          menuDivider(),
          menuItem(/* @__PURE__ */ jsx(IconClear, {}), t("op_clear"), () => {
            props.handleClear?.();
            setOpenMenu(null);
          })
        ] })
      ] }))
    ] }) }),
    !isHidden("view") && /* @__PURE__ */ jsxs("div", { className: "ui-toolbar-group", children: [
      /* @__PURE__ */ jsx(
        ImageButton,
        {
          icon: /* @__PURE__ */ jsx(IconMaximize, {}),
          label: t("tb_fit"),
          onClick: () => props.sceneMgr?.fitView(),
          theme
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "ui-toolbar-menu-anchor", children: [
        /* @__PURE__ */ jsx(
          ImageButton,
          {
            icon: /* @__PURE__ */ jsx(IconEye, {}),
            label: t("tb_view"),
            active: openMenu === "views",
            onClick: () => toggleMenu("views"),
            theme
          }
        ),
        renderDropdown("views", /* @__PURE__ */ jsxs(Fragment, { children: [
          menuItem(/* @__PURE__ */ jsx(IconViewFront, {}), t("view_front"), () => {
            props.handleView?.("front");
            setOpenMenu(null);
          }),
          menuItem(/* @__PURE__ */ jsx(IconViewBack, {}), t("view_back"), () => {
            props.handleView?.("back");
            setOpenMenu(null);
          }),
          menuItem(/* @__PURE__ */ jsx(IconViewTop, {}), t("view_top"), () => {
            props.handleView?.("top");
            setOpenMenu(null);
          }),
          menuItem(/* @__PURE__ */ jsx(IconViewBottom, {}), t("view_bottom"), () => {
            props.handleView?.("bottom");
            setOpenMenu(null);
          }),
          menuItem(/* @__PURE__ */ jsx(IconViewLeft, {}), t("view_left"), () => {
            props.handleView?.("left");
            setOpenMenu(null);
          }),
          menuItem(/* @__PURE__ */ jsx(IconViewRight, {}), t("view_right"), () => {
            props.handleView?.("right");
            setOpenMenu(null);
          }),
          menuDivider(),
          menuItem(/* @__PURE__ */ jsx(IconViewSE, {}), t("view_se"), () => {
            props.handleView?.("se");
            setOpenMenu(null);
          }),
          menuItem(/* @__PURE__ */ jsx(IconViewSW, {}), t("view_sw"), () => {
            props.handleView?.("sw");
            setOpenMenu(null);
          }),
          menuItem(/* @__PURE__ */ jsx(IconViewNE, {}), t("view_ne"), () => {
            props.handleView?.("ne");
            setOpenMenu(null);
          }),
          menuItem(/* @__PURE__ */ jsx(IconViewNW, {}), t("view_nw"), () => {
            props.handleView?.("nw");
            setOpenMenu(null);
          })
        ] }))
      ] })
    ] }),
    !isHidden("interface") && /* @__PURE__ */ jsxs("div", { className: "ui-toolbar-group", children: [
      !isHidden("wireframe") && /* @__PURE__ */ jsxs("div", { className: "ui-toolbar-menu-anchor", children: [
        /* @__PURE__ */ jsx(
          ImageButton,
          {
            icon: /* @__PURE__ */ jsx(IconLayers, {}),
            label: t("display_mode") || "样式",
            active: openMenu === "displayMode",
            onClick: () => toggleMenu("displayMode"),
            theme
          }
        ),
        renderDropdown("displayMode", /* @__PURE__ */ jsxs(Fragment, { children: [
          menuItem(/* @__PURE__ */ jsx(IconSolid, {}), t("dm_solid") || "着色", () => {
            props.handleDisplayModeChange?.("solid");
            setOpenMenu(null);
          }),
          menuItem(/* @__PURE__ */ jsx(IconTransparent, {}), t("dm_transparent") || "透明", () => {
            props.handleDisplayModeChange?.("transparent");
            setOpenMenu(null);
          })
        ] }))
      ] }),
      !isHidden("outline") && /* @__PURE__ */ jsx(
        ImageButton,
        {
          icon: /* @__PURE__ */ jsx(IconBox, {}),
          label: t("tb_model"),
          active: props.showOutline,
          onClick: () => props.setShowOutline?.(!props.showOutline),
          theme
        }
      ),
      !isHidden("props") && /* @__PURE__ */ jsx(
        ImageButton,
        {
          icon: /* @__PURE__ */ jsx(IconList, {}),
          label: t("tb_props"),
          active: props.showProps,
          onClick: () => props.setShowProps?.(!props.showProps),
          theme
        }
      ),
      !isHidden("pick") && /* @__PURE__ */ jsx(
        ImageButton,
        {
          icon: /* @__PURE__ */ jsx(IconMousePointer, {}),
          label: t("tb_pick"),
          active: props.pickEnabled,
          onClick: () => props.setPickEnabled?.(!props.pickEnabled),
          theme
        }
      )
    ] }),
    !isHidden("tool") && /* @__PURE__ */ jsxs("div", { className: "ui-toolbar-group", children: [
      !isHidden("measure") && /* @__PURE__ */ jsx(
        ImageButton,
        {
          icon: /* @__PURE__ */ jsx(IconRuler, {}),
          label: t("tb_measure"),
          active: props.activeTool === "measure",
          onClick: () => props.setActiveTool?.(props.activeTool === "measure" ? "none" : "measure"),
          theme
        }
      ),
      !isHidden("boxSelect") && /* @__PURE__ */ jsx(
        ImageButton,
        {
          icon: /* @__PURE__ */ jsx(IconSelectAll, {}),
          label: t("tb_boxSelect"),
          active: props.activeTool === "boxSelect",
          onClick: () => props.setActiveTool?.(props.activeTool === "boxSelect" ? "none" : "boxSelect"),
          theme
        }
      ),
      !isHidden("clip") && /* @__PURE__ */ jsx(
        ImageButton,
        {
          icon: /* @__PURE__ */ jsx(IconScissors, {}),
          label: t("tb_clip"),
          active: props.activeTool === "clip",
          onClick: () => props.setActiveTool?.(props.activeTool === "clip" ? "none" : "clip"),
          theme
        }
      ),
      !isHidden("viewpoint") && /* @__PURE__ */ jsx(
        ImageButton,
        {
          icon: /* @__PURE__ */ jsx(IconCamera, {}),
          label: t("tb_view"),
          active: props.activeTool === "viewpoint",
          onClick: () => props.setActiveTool?.(props.activeTool === "viewpoint" ? "none" : "viewpoint"),
          theme
        }
      ),
      !isHidden("screenshot") && /* @__PURE__ */ jsx(
        ImageButton,
        {
          icon: /* @__PURE__ */ jsx(IconImage, {}),
          label: t("tb_screenshot") || "截图",
          active: props.activeTool === "screenshot",
          onClick: () => props.openScreenshotPanel?.(),
          theme
        }
      ),
      !isHidden("search") && /* @__PURE__ */ jsx(
        ImageButton,
        {
          icon: /* @__PURE__ */ jsx(IconSearch, {}),
          label: t("tb_search") || "搜索",
          active: props.activeTool === "search",
          onClick: () => props.setActiveTool?.(props.activeTool === "search" ? "none" : "search"),
          theme
        }
      ),
      !isHidden("clash") && /* @__PURE__ */ jsx(
        ImageButton,
        {
          icon: /* @__PURE__ */ jsx(IconTarget, {}),
          label: t("tb_clash") || "碰撞",
          active: props.activeTool === "clash",
          onClick: () => props.setActiveTool?.(props.activeTool === "clash" ? "none" : "clash"),
          theme
        }
      ),
      !isHidden("explode") && /* @__PURE__ */ jsx(
        ImageButton,
        {
          icon: /* @__PURE__ */ jsx(IconExplode, {}),
          label: t("tb_explode") || "爆炸",
          active: props.activeTool === "explode",
          onClick: () => props.setActiveTool?.(props.activeTool === "explode" ? "none" : "explode"),
          theme
        }
      )
    ] }),
    !isHidden("about") && /* @__PURE__ */ jsxs("div", { className: "ui-toolbar-group", children: [
      !isHidden("settings") && /* @__PURE__ */ jsx(
        ImageButton,
        {
          icon: /* @__PURE__ */ jsx(IconSettings, {}),
          label: t("tb_settings"),
          active: props.activeTool === "settings",
          onClick: () => props.setActiveTool?.(props.activeTool === "settings" ? "none" : "settings"),
          theme
        }
      ),
      /* @__PURE__ */ jsx(
        ImageButton,
        {
          icon: /* @__PURE__ */ jsx(IconInfo, {}),
          label: t("tb_about"),
          onClick: () => props.onOpenAbout?.(),
          theme
        }
      )
    ] })
  ] });
};

const Button = ({
  children,
  variant = "default",
  size = "md",
  active,
  theme,
  style,
  className = "",
  ...props
}) => {
  let btnClass = "ui-btn";
  if (variant === "primary") btnClass += " ui-btn-primary";
  else if (variant === "danger") btnClass += " ui-btn-danger";
  else if (variant === "ghost") btnClass += " ui-btn-ghost";
  else btnClass += " ui-btn-default";
  if (size === "sm") btnClass += " ui-btn-sm";
  else if (size === "lg") btnClass += " ui-btn-lg";
  else btnClass += " ui-btn-md";
  if (active) btnClass += " active";
  return /* @__PURE__ */ jsx("button", { className: `${btnClass} ${className}`, style, ...props, children });
};

const Slider = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  theme,
  disabled = false,
  style
}) => {
  const percentage = (value - min) / (max - min) * 100;
  const sliderRef = useRef(null);
  const calcValueFromX = useCallback((clientX) => {
    if (!sliderRef.current) return value;
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = min + percent * (max - min);
    return Math.round(newValue / step) * step;
  }, [min, max, step, value]);
  const handleMouseDown = useCallback((e) => {
    if (disabled) return;
    e.preventDefault();
    const targetValue = calcValueFromX(e.clientX);
    onChange(Math.max(min, Math.min(max, targetValue)));
    const handleMouseMove = (moveEvent) => {
      const newValue = calcValueFromX(moveEvent.clientX);
      onChange(Math.max(min, Math.min(max, newValue)));
    };
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [calcValueFromX, onChange, min, max, disabled]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: sliderRef,
      className: `ui-slider ui-slider-control ${disabled ? "ui-slider-control-disabled" : "ui-slider-control-interactive"}`,
      style: {
        width: "100%",
        minWidth: 0,
        ...style
      },
      onMouseDown: handleMouseDown,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "ui-slider-track"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "ui-slider-progress",
            style: {
              width: `${percentage}%`
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "ui-slider-thumb",
            style: {
              left: `${percentage}%`,
              cursor: disabled ? "not-allowed" : "default"
            }
          }
        )
      ]
    }
  );
};

const DualSlider = ({
  min,
  max,
  value,
  onChange,
  theme,
  disabled = false,
  style
}) => {
  const sliderRef = useRef(null);
  const percentage1 = (value[0] - min) / (max - min) * 100;
  const percentage2 = (value[1] - min) / (max - min) * 100;
  const calcValueFromX = useCallback((clientX) => {
    if (!sliderRef.current) return min;
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return min + percent * (max - min);
  }, [min, max]);
  const handleThumb1MouseDown = useCallback((e) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    const handleMouseMove = (moveEvent) => {
      const newValue = calcValueFromX(moveEvent.clientX);
      onChange([Math.max(min, Math.min(value[1] - 1, Math.round(newValue))), value[1]]);
    };
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [disabled, calcValueFromX, onChange, min, value]);
  const handleThumb2MouseDown = useCallback((e) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    const handleMouseMove = (moveEvent) => {
      const newValue = calcValueFromX(moveEvent.clientX);
      onChange([value[0], Math.min(max, Math.max(value[0] + 1, Math.round(newValue)))]);
    };
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [disabled, calcValueFromX, onChange, max, value]);
  const handleTrackClick = useCallback((e) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    const clickValue = calcValueFromX(e.clientX);
    const dist1 = Math.abs(clickValue - value[0]);
    const dist2 = Math.abs(clickValue - value[1]);
    if (dist1 <= dist2) {
      onChange([Math.max(min, Math.min(value[1] - 1, Math.round(clickValue))), value[1]]);
    } else {
      onChange([value[0], Math.min(max, Math.max(value[0] + 1, Math.round(clickValue)))]);
    }
  }, [disabled, calcValueFromX, onChange, min, max, value]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: sliderRef,
      className: "ui-slider",
      style: {
        opacity: disabled ? 0.5 : 1,
        width: "100%",
        minWidth: 0,
        flex: 1,
        height: "24px",
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        ...style
      },
      onClick: handleTrackClick,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "ui-slider-track",
            style: {
              position: "absolute",
              width: "100%",
              height: "6px",
              backgroundColor: "var(--border-color)",
              borderRadius: "3px"
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "ui-slider-progress",
            style: {
              position: "absolute",
              left: `${percentage1}%`,
              width: `${percentage2 - percentage1}%`,
              height: "6px",
              backgroundColor: "var(--accent)",
              borderRadius: "3px"
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "ui-slider-thumb",
            style: {
              left: `${percentage1}%`,
              width: "16px",
              height: "16px",
              backgroundColor: "var(--bg-primary)",
              border: `2px solid var(--accent)`,
              borderRadius: "50%",
              cursor: disabled ? "not-allowed" : "default",
              position: "absolute",
              transform: "translateX(-50%)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              zIndex: 1
            },
            onMouseDown: handleThumb1MouseDown
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "ui-slider-thumb",
            style: {
              left: `${percentage2}%`,
              width: "16px",
              height: "16px",
              backgroundColor: "var(--bg-primary)",
              border: `2px solid var(--accent)`,
              borderRadius: "50%",
              cursor: disabled ? "not-allowed" : "default",
              position: "absolute",
              transform: "translateX(-50%)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              zIndex: 1
            },
            onMouseDown: handleThumb2MouseDown
          }
        )
      ]
    }
  );
};

const Switch = ({ checked, onChange, disabled = false, className = "" }) => {
  return /* @__PURE__ */ jsx(
    "button",
    {
      className: `ui-switch ${checked ? "active" : ""} ${disabled ? "disabled" : ""} ${className}`,
      onClick: () => !disabled && onChange(!checked),
      role: "switch",
      "aria-checked": checked,
      disabled,
      children: /* @__PURE__ */ jsx("div", { className: "ui-switch-thumb" })
    }
  );
};

const SegmentedControl = ({
  options,
  value,
  onChange,
  className = ""
}) => /* @__PURE__ */ jsx("div", { className: `ui-segmented ${className}`, children: options.map((option) => /* @__PURE__ */ jsxs(
  "button",
  {
    className: `ui-segmented-item ${value === option.value ? "active" : ""}`,
    onClick: () => onChange(option.value),
    children: [
      option.icon && /* @__PURE__ */ jsx("span", { children: option.icon }),
      /* @__PURE__ */ jsx("span", { children: option.label })
    ]
  },
  option.value
)) });

const ColorPicker = ({ value, onChange, style }) => /* @__PURE__ */ jsxs("div", { className: "ui-color-picker", style, children: [
  /* @__PURE__ */ jsx(
    "input",
    {
      type: "color",
      value,
      onChange: (e) => onChange(e.target.value),
      className: "ui-color-picker-input"
    }
  ),
  /* @__PURE__ */ jsx("span", { className: "ui-color-picker-value", children: value })
] });

const Select = ({ value, options, onChange, className = "", style, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find((opt) => opt.value === value) || options[0];
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: `ui-select-custom ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""}`,
      style,
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `ui-select-selector ui-input ${className}`,
            onClick: () => !disabled && setIsOpen(!isOpen),
            children: [
              /* @__PURE__ */ jsx("span", { className: "ui-select-selection-item", children: selectedOption?.label }),
              /* @__PURE__ */ jsx("span", { className: "ui-select-arrow", children: /* @__PURE__ */ jsx("svg", { viewBox: "64 64 896 896", width: "12", height: "12", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" }) }) })
            ]
          }
        ),
        isOpen && !disabled && /* @__PURE__ */ jsx("div", { className: "ui-select-dropdown", children: options.map((option) => /* @__PURE__ */ jsx(
          "div",
          {
            className: `ui-select-item ${option.value === value ? "selected" : ""}`,
            onClick: () => {
              onChange(option.value);
              setIsOpen(false);
            },
            children: option.label
          },
          option.value
        )) })
      ]
    }
  );
};

const Checkbox = ({
  label,
  checked,
  onChange,
  disabled = false,
  style,
  labelStyle
}) => {
  return /* @__PURE__ */ jsxs(
    "label",
    {
      className: `ui-checkbox ${disabled ? "ui-checkbox-disabled" : ""}`,
      style,
      onClick: (e) => {
        if (disabled) return;
        e.preventDefault();
        onChange(!checked);
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `ui-checkbox-box ${checked ? "ui-checkbox-box-checked" : ""}`,
            children: checked && /* @__PURE__ */ jsx(
              "svg",
              {
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "white",
                strokeWidth: "3",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: "ui-checkbox-icon",
                children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" })
              }
            )
          }
        ),
        label && /* @__PURE__ */ jsx("span", { className: "ui-checkbox-label", style: labelStyle, children: label })
      ]
    }
  );
};

const InputNumber = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  className = "",
  style,
  ...props
}) => {
  const [text, setText] = useState(() => String(value));
  useEffect(() => {
    setText(String(value));
  }, [value]);
  const clampValue = (nextValue) => {
    let val = nextValue;
    if (min !== void 0) val = Math.max(min, val);
    if (max !== void 0) val = Math.min(max, val);
    return val;
  };
  const handleChange = (e) => {
    const nextText = e.target.value;
    setText(nextText);
    if (nextText.trim() === "") return;
    const parsed = parseFloat(nextText);
    if (isNaN(parsed)) return;
    onChange(clampValue(parsed));
  };
  const handleBlur = () => {
    if (text.trim() === "") {
      setText(String(value));
      return;
    }
    const parsed = parseFloat(text);
    if (isNaN(parsed)) {
      setText(String(value));
      return;
    }
    const clamped = clampValue(parsed);
    setText(String(clamped));
    if (clamped !== value) {
      onChange(clamped);
    }
  };
  const stepUp = () => {
    const nextValue = clampValue(value + step);
    setText(String(nextValue));
    onChange(nextValue);
  };
  const stepDown = () => {
    const nextValue = clampValue(value - step);
    setText(String(nextValue));
    onChange(nextValue);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `ui-input-number ui-input-number-root ${className}`,
      style,
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: text,
            onChange: handleChange,
            onBlur: handleBlur,
            min,
            max,
            step,
            className: `ui-input ui-input-number-input ${unit ? "ui-input-number-input-with-unit" : "ui-input-number-input-with-controls"}`,
            ...props
          }
        ),
        unit && /* @__PURE__ */ jsx("span", { className: "ui-input-number-unit", children: unit }),
        /* @__PURE__ */ jsxs("div", { className: "ui-input-number-controls", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: stepUp,
              className: "ui-input-number-btn",
              title: "Increase",
              style: { flex: 1 },
              children: "▲"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: stepDown,
              className: "ui-input-number-btn",
              title: "Decrease",
              style: { flex: 1 },
              children: "▼"
            }
          )
        ] })
      ]
    }
  );
};

const PaginationControls = ({
  prevTitle,
  nextTitle,
  currentPage,
  totalPages,
  onPrev,
  onNext,
  rightContent
}) => {
  return /* @__PURE__ */ jsxs("div", { className: "ui-page-nav-wrap", children: [
    /* @__PURE__ */ jsxs("div", { className: "ui-page-nav-group", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          className: "ui-properties-action ui-icon-btn ui-page-nav-btn",
          onClick: onPrev,
          disabled: currentPage <= 1,
          title: prevTitle,
          children: /* @__PURE__ */ jsx(IconChevronLeft, { size: 20 })
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "ui-page-nav-indicator", children: [
        currentPage,
        "/",
        totalPages
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          className: "ui-properties-action ui-icon-btn ui-page-nav-btn",
          onClick: onNext,
          disabled: currentPage >= totalPages,
          title: nextTitle,
          children: /* @__PURE__ */ jsx(IconChevronRight, { size: 20 })
        }
      )
    ] }),
    rightContent
  ] });
};

const ContextMenu = ({ x, y, items, onClose, theme }) => {
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: menuRef,
      className: "ui-context-menu",
      style: { left: x, top: y },
      children: items.map((item, index) => {
        if (item.divider) {
          return /* @__PURE__ */ jsx(
            "div",
            {
              className: "ui-context-menu-divider"
            },
            index
          );
        }
        if (item.slider) {
          return /* @__PURE__ */ jsxs("div", { className: "ui-context-menu-item", style: { display: "flex", flexDirection: "column", gap: "4px", cursor: "default" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-secondary)" }, children: [
              /* @__PURE__ */ jsx("span", { children: item.label }),
              /* @__PURE__ */ jsxs("span", { children: [
                Math.round((item.value || 0) * 100),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "range",
                min: "0",
                max: "1",
                step: "0.01",
                value: item.value || 0,
                onChange: (e) => item.onChange?.(parseFloat(e.target.value)),
                style: { width: "100%", cursor: "pointer" }
              }
            )
          ] }, index);
        }
        return /* @__PURE__ */ jsx(
          "div",
          {
            onClick: () => {
              if (!item.disabled && item.onClick) {
                item.onClick();
                onClose();
              }
            },
            className: `ui-context-menu-item ${item.disabled ? "disabled" : ""}`,
            children: item.label
          },
          index
        );
      })
    }
  );
};

const INVALID_LABELS = /* @__PURE__ */ new Set(["", "n/a", "na", "undefined", "null", "-", "--"]);
const sanitizeTreeLabel = (...candidates) => {
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const trimmed = candidate.trim();
    if (INVALID_LABELS.has(trimmed.toLowerCase())) continue;
    return trimmed;
  }
  return "";
};
const flattenTree = (nodes, result = [], parentIsLast = []) => {
  if (!nodes) return result;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.isLastChild = i === nodes.length - 1;
    node.parentIsLast = [...parentIsLast];
    result.push(node);
    if (node.expanded && node.children && node.children.length > 0) {
      flattenTree(node.children, result, [...parentIsLast, node.isLastChild]);
    }
  }
  return result;
};
const collectExpandedState = (nodes) => {
  const map = /* @__PURE__ */ new Map();
  const walk = (list) => {
    list.forEach((node) => {
      map.set(node.uuid, node.expanded);
      if (node.children.length > 0) walk(node.children);
    });
  };
  walk(nodes);
  return map;
};
const applyExpandedState = (nodes, expandedMap) => nodes.map((node) => ({
  ...node,
  expanded: expandedMap.get(node.uuid) ?? node.expanded,
  children: applyExpandedState(node.children, expandedMap)
}));
const getRawChildren = (node) => {
  const children = node?.object?.children ?? node?.children;
  return Array.isArray(children) ? children : [];
};
const createTreeNodeFromRaw = (rawNode, depth, isFileNode = false) => {
  const rawChildren = Array.isArray(rawNode?.children) ? rawNode.children : [];
  const fallbackName = rawNode?.type === "Mesh" ? `Mesh_${rawNode?.id ?? "?"}` : `Group_${rawNode?.id ?? "?"}`;
  return {
    uuid: rawNode?.id ?? rawNode?.uuid ?? String(Math.random()),
    name: sanitizeTreeLabel(rawNode?.name, rawNode?.userData?.name) || fallbackName,
    type: rawNode?.type === "Mesh" ? "MESH" : "GROUP",
    depth,
    children: [],
    expanded: false,
    visible: rawNode?.visible !== false,
    object: rawNode,
    isFileNode,
    hasChildren: rawChildren.length > 0,
    childrenLoaded: false
  };
};
const ensureNodeChildrenLoaded = (node) => {
  if (node.childrenLoaded || !node.hasChildren) return node;
  return {
    ...node,
    childrenLoaded: true,
    children: getRawChildren(node).map((child) => createTreeNodeFromRaw(child, node.depth + 1))
  };
};
const rawTreeContainsUuid = (rawNode, targetUuid) => {
  if (!rawNode) return false;
  if (rawNode.id === targetUuid || rawNode.uuid === targetUuid) return true;
  const children = Array.isArray(rawNode.children) ? rawNode.children : [];
  return children.some((child) => rawTreeContainsUuid(child, targetUuid));
};
const getNodeSearchText = (node) => {
  const source = node?.object ?? node;
  const meta = source?.userData?.ifcMetadata || {};
  return [
    source?.name,
    source?.type,
    source?.bimId,
    source?.userData?.bimId,
    source?.userData?.expressID,
    source?.userData?.ifcType,
    source?.userData?.globalId,
    meta.storey,
    meta.category,
    meta.typeName,
    meta.globalId,
    ...meta.systems || [],
    ...meta.materials || [],
    ...meta.classifications || []
  ].filter(Boolean).join(" ").toLowerCase();
};
const SceneTree = ({
  t,
  treeRoot,
  setTreeRoot,
  selectedUuid,
  locatedUuid,
  onSelect,
  onToggleVisibility,
  onDelete,
  onIsolate,
  onHide,
  onShowAll,
  onLocate,
  onClearLocate,
  onLocateResultsChange,
  locateResultUuids = [],
  clashSummaryByUuid = {}
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contextMenu, setContextMenu] = useState(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(400);
  const containerRef = useRef(null);
  const selectionSourceRef = useRef(null);
  const searchExpandedStateRef = useRef(null);
  const previousSearchQueryRef = useRef("");
  const [activeTreeUuid, setActiveTreeUuid] = useState(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => setContainerHeight(entry.contentRect.height));
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);
  useEffect(() => {
    const prevQuery = previousSearchQueryRef.current;
    if (!prevQuery && searchQuery) {
      searchExpandedStateRef.current = collectExpandedState(treeRoot);
    }
    if (prevQuery && !searchQuery && searchExpandedStateRef.current) {
      const snapshot = searchExpandedStateRef.current;
      setTreeRoot((prev) => applyExpandedState(prev, snapshot));
      searchExpandedStateRef.current = null;
    }
    previousSearchQueryRef.current = searchQuery;
  }, [searchQuery, setTreeRoot, treeRoot]);
  useEffect(() => {
    if (!activeTreeUuid) return;
    if (selectionSourceRef.current !== "tree") return;
    setTreeRoot((prev) => {
      const expandSelectedPath = (nodes) => {
        let found2 = false;
        const nextNodes = nodes.map((node) => {
          let workingNode = node;
          if (node.uuid === activeTreeUuid) {
            found2 = true;
            return node;
          }
          if (!node.childrenLoaded && node.hasChildren) {
            const rawChildren = getRawChildren(node);
            const containsTarget = rawChildren.some((child) => rawTreeContainsUuid(child, activeTreeUuid));
            if (containsTarget) {
              workingNode = ensureNodeChildrenLoaded(node);
            }
          }
          const [children, childFound] = expandSelectedPath(workingNode.children);
          if (childFound) found2 = true;
          return {
            ...workingNode,
            expanded: childFound ? true : workingNode.expanded,
            children
          };
        });
        return [nextNodes, found2];
      };
      const [nextTree, found] = expandSelectedPath(prev);
      return found ? nextTree : prev;
    });
  }, [activeTreeUuid, setTreeRoot]);
  const filterTree = (nodes, query) => {
    const lowercaseQuery = query.toLowerCase();
    return nodes.reduce((acc, node) => {
      const matchesQuery = !query || getNodeSearchText(node).includes(lowercaseQuery);
      const sourceChildren = query ? getRawChildren(node).map((child) => createTreeNodeFromRaw(child, node.depth + 1)) : node.children;
      const filteredChildren = filterTree(sourceChildren, query);
      const includeByQuery = !query || matchesQuery || filteredChildren.length > 0;
      if (includeByQuery) {
        acc.push({
          ...node,
          childrenLoaded: query ? true : node.childrenLoaded,
          hasChildren: node.hasChildren ?? getRawChildren(node).length > 0,
          expanded: query ? true : node.expanded,
          children: filteredChildren
        });
      }
      return acc;
    }, []);
  };
  const filteredTree = useMemo(() => filterTree(treeRoot, searchQuery), [treeRoot, searchQuery]);
  const flatData = useMemo(() => flattenTree(filteredTree), [filteredTree]);
  const firstSearchMatch = useMemo(() => {
    if (!searchQuery) return null;
    const query = searchQuery.toLowerCase();
    const stack = [...treeRoot];
    while (stack.length > 0) {
      const node = stack.shift();
      if (getNodeSearchText(node).includes(query)) return node;
      getRawChildren(node).map((child) => createTreeNodeFromRaw(child, (node.depth ?? 0) + 1)).forEach((child) => stack.push(child));
    }
    return null;
  }, [searchQuery, treeRoot]);
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.trim().toLowerCase();
    const results = [];
    const stack = [...treeRoot];
    while (stack.length > 0) {
      const node = stack.shift();
      if (getNodeSearchText(node).includes(query)) {
        results.push(node);
      }
      getRawChildren(node).map((child) => createTreeNodeFromRaw(child, (node.depth ?? 0) + 1)).forEach((child) => stack.push(child));
    }
    return results;
  }, [searchQuery, treeRoot]);
  const rowHeight = 24;
  const totalHeight = flatData.length * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight));
  const visibleCount = Math.ceil(containerHeight / rowHeight);
  const endIndex = Math.min(flatData.length, startIndex + visibleCount + 1);
  const visibleItems = flatData.slice(startIndex, endIndex);
  useEffect(() => {
    if (selectionSourceRef.current === "tree") {
      selectionSourceRef.current = null;
    }
  }, [selectedUuid]);
  useEffect(() => {
    const nextLocateResults = searchQuery.trim() ? searchMatches.map((item) => item.uuid) : [];
    onLocateResultsChange?.(nextLocateResults);
  }, [searchMatches, searchQuery, onLocateResultsChange]);
  const toggleNode = (nodeUuid) => {
    const toggle = (nodes) => nodes.map((node) => {
      if (node.uuid === nodeUuid) {
        const nextNode = ensureNodeChildrenLoaded(node);
        return { ...nextNode, expanded: !node.expanded };
      }
      if (node.children.length > 0) return { ...node, children: toggle(node.children) };
      return node;
    });
    setTreeRoot((prev) => toggle(prev));
  };
  const expandAll = () => {
    const expand = (nodes) => nodes.map((node) => {
      const expandedNode = ensureNodeChildrenLoaded(node);
      return {
        ...expandedNode,
        expanded: expandedNode.hasChildren,
        children: expand(expandedNode.children)
      };
    });
    setTreeRoot((prev) => expand(prev));
  };
  const collapseAll = () => {
    const collapse = (nodes) => nodes.map((node) => ({
      ...node,
      expanded: false,
      children: collapse(node.children)
    }));
    setTreeRoot((prev) => collapse(prev));
  };
  const handleLocateFirstMatch = () => {
    if (!firstSearchMatch) return;
    onLocate?.(firstSearchMatch.object);
  };
  const getClashBadge = (uuid) => {
    const summary = clashSummaryByUuid[uuid];
    if (!summary) return null;
    if (summary.worstStatus === "new") {
      return {
        label: `${t("clash_group_new")} ${summary.newCount}`,
        color: "var(--error)"
      };
    }
    if (summary.worstStatus === "confirmed") {
      return {
        label: `${t("clash_group_confirmed")} ${summary.confirmedCount}`,
        color: "var(--warning, #f59e0b)"
      };
    }
    return {
      label: `${t("clash_group_resolved")} ${summary.resolvedCount}`,
      color: "var(--success)"
    };
  };
  return /* @__PURE__ */ jsxs("div", { className: "ui-tree-panel", children: [
    /* @__PURE__ */ jsxs("div", { className: "ui-search-bar", children: [
      /* @__PURE__ */ jsxs("div", { className: "ui-search-input-wrap", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: t("search_nodes"),
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleLocateFirstMatch();
              }
            },
            className: "ui-input ui-input-compact"
          }
        ),
        searchQuery && /* @__PURE__ */ jsx("button", { className: "ui-search-clear", onClick: () => setSearchQuery(""), children: /* @__PURE__ */ jsx(IconClose, { width: 14, height: 14 }) })
      ] }),
      searchQuery && /* @__PURE__ */ jsxs("div", { className: "ui-tree-search-meta", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          t("search_results"),
          ": ",
          searchMatches.length
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            className: "ui-properties-action",
            onClick: handleLocateFirstMatch,
            disabled: !firstSearchMatch,
            children: t("locate_first_match")
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: containerRef,
        className: "ui-tree-container flex-1 overflow-y-auto overflow-x-hidden",
        onScroll: (e) => setScrollTop(e.currentTarget.scrollTop),
        children: /* @__PURE__ */ jsx("div", { style: { height: totalHeight, position: "relative" }, children: /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: startIndex * rowHeight, left: 0, right: 0 }, children: visibleItems.map((node) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: `ui-tree-node ${node.uuid === activeTreeUuid ? "selected" : ""} ${locateResultUuids.includes(node.uuid) ? "matched" : ""} ${node.uuid === locatedUuid ? "located" : ""}`,
            style: { paddingLeft: 8 + node.depth * 16 },
            onClick: () => {
              selectionSourceRef.current = "tree";
              setActiveTreeUuid(node.uuid);
              onSelect(node.uuid, node.object);
            },
            onDoubleClick: (e) => {
              if (node.hasChildren) {
                e.stopPropagation();
                toggleNode(node.uuid);
              }
            },
            onContextMenu: (e) => {
              e.preventDefault();
              setContextMenu({ x: e.clientX, y: e.clientY, node });
            },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "ui-tree-expander",
                  onClick: (e) => {
                    e.stopPropagation();
                    toggleNode(node.uuid);
                  },
                  children: node.hasChildren ? node.expanded ? /* @__PURE__ */ jsx(IconChevronDown, { size: 12 }) : /* @__PURE__ */ jsx(IconChevronRight, { size: 12 }) : null
                }
              ),
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  checked: node.visible,
                  onChange: (val) => onToggleVisibility(node.uuid, val),
                  style: { marginRight: 4, padding: 0, flexShrink: 0 }
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "ui-tree-label", children: [
                searchQuery && node.name.toLowerCase().includes(searchQuery.toLowerCase()) ? /* @__PURE__ */ jsx("span", { children: node.name.split(new RegExp(`(${searchQuery})`, "gi")).map(
                  (part, index) => part.toLowerCase() === searchQuery.toLowerCase() ? /* @__PURE__ */ jsx("span", { className: "ui-search-hit", children: part }, index) : part
                ) }) : node.name,
                (() => {
                  const badge = getClashBadge(node.uuid);
                  if (!badge) return null;
                  return /* @__PURE__ */ jsx(
                    "span",
                    {
                      style: {
                        marginLeft: 6,
                        padding: "0 6px",
                        borderRadius: "var(--radius-xl)",
                        border: `1px solid ${badge.color}`,
                        color: badge.color,
                        fontSize: "var(--font-size-label)",
                        lineHeight: "16px",
                        display: "inline-flex",
                        alignItems: "center",
                        verticalAlign: "middle"
                      },
                      children: badge.label
                    }
                  );
                })()
              ] })
            ]
          },
          node.uuid
        )) }) })
      }
    ),
    contextMenu && /* @__PURE__ */ jsx(
      ContextMenu,
      {
        x: contextMenu.x,
        y: contextMenu.y,
        onClose: () => setContextMenu(null),
        items: [
          {
            label: t("locate_in_view"),
            onClick: () => onLocate?.(contextMenu.node.object)
          },
          {
            divider: true
          },
          {
            label: t("expand_all"),
            onClick: expandAll
          },
          {
            label: t("collapse_all"),
            onClick: collapseAll
          },
          ...contextMenu.node.isFileNode ? [
            { divider: true },
            {
              label: t("delete_item"),
              onClick: () => onDelete?.(contextMenu.node.object)
            }
          ] : []
        ]
      }
    )
  ] });
};

const FloatingPanel = ({
  title,
  onClose,
  children,
  width = 300,
  height,
  x = 100,
  y = 100,
  resizable = false,
  movable = true,
  storageId,
  modal = false,
  autoHeight = height === void 0,
  closeLabel = "Close"
}) => {
  const panelRef = useRef(null);
  const minWidth = storageId === "tool_measure" ? 320 : 220;
  const minHeight = storageId === "tool_measure" ? 400 : 120;
  const getInitialPos = () => {
    if (modal) {
      return {
        x: Math.max(0, (window.innerWidth - width) / 2),
        y: Math.max(0, (window.innerHeight - (height ?? minHeight)) / 2)
      };
    }
    if (storageId) {
      try {
        const saved = localStorage.getItem(`panel_${storageId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.pos && typeof parsed.pos.x === "number" && typeof parsed.pos.y === "number") {
            return {
              x: Math.min(Math.max(0, parsed.pos.x), window.innerWidth - 50),
              y: Math.min(Math.max(0, parsed.pos.y), window.innerHeight - 50)
            };
          }
        }
      } catch (e) {
      }
    }
    if (x === 100 && y === 100 && !storageId) {
      return {
        x: Math.max(0, (window.innerWidth - width) / 2),
        y: Math.max(0, (window.innerHeight - (height ?? minHeight)) / 2)
      };
    }
    return { x, y };
  };
  const getInitialSize = () => {
    if (storageId && resizable) {
      try {
        const saved = localStorage.getItem(`panel_${storageId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.size && typeof parsed.size.w === "number" && typeof parsed.size.h === "number") {
            return {
              w: Math.max(minWidth, parsed.size.w),
              h: Math.max(minHeight, parsed.size.h)
            };
          }
        }
      } catch (e) {
      }
    }
    return { w: width, h: height ?? minHeight };
  };
  const posRef = useRef(getInitialPos());
  const sizeRef = useRef(getInitialSize());
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const resizeDirection = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ w: 0, h: 0 });
  const applyStyle = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const pos2 = posRef.current;
    const size2 = sizeRef.current;
    panel.style.transform = `translate(${pos2.x}px, ${pos2.y}px)`;
    panel.style.width = `${size2.w}px`;
    if (!autoHeight) {
      panel.style.height = `${size2.h}px`;
    }
  }, [autoHeight]);
  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current && !isResizing.current) return;
    e.preventDefault();
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const panel = panelRef.current;
    if (isDragging.current) {
      let limitW = window.innerWidth;
      let limitH = window.innerHeight;
      if (panel?.parentElement) {
        limitW = panel.parentElement.clientWidth;
        limitH = panel.parentElement.clientHeight;
      }
      const panelHeight = autoHeight ? panel?.offsetHeight || sizeRef.current.h : sizeRef.current.h;
      const maxX = limitW - sizeRef.current.w;
      const maxY = limitH - panelHeight;
      posRef.current = {
        x: Math.max(0, Math.min(startPos.current.x + dx, maxX)),
        y: Math.max(0, Math.min(startPos.current.y + dy, maxY))
      };
      applyStyle();
    } else if (isResizing.current && resizeDirection.current) {
      const dir = resizeDirection.current;
      let newW = startSize.current.w;
      let newH = startSize.current.h;
      let newX = startPos.current.x;
      let newY = startPos.current.y;
      if (dir.includes("e")) {
        newW = Math.max(minWidth, startSize.current.w + dx);
      }
      if (dir.includes("w")) {
        const maxDx = startSize.current.w - minWidth;
        const actualDx = Math.min(dx, maxDx);
        newW = startSize.current.w - actualDx;
        newX = startPos.current.x + actualDx;
      }
      if (dir.includes("s")) {
        newH = Math.max(minHeight, startSize.current.h + dy);
      }
      if (dir.includes("n")) {
        const maxDy = startSize.current.h - minHeight;
        const actualDy = Math.min(dy, maxDy);
        newH = startSize.current.h - actualDy;
        newY = startPos.current.y + actualDy;
      }
      sizeRef.current = { w: newW, h: newH };
      if (dir.includes("w") || dir.includes("n")) {
        posRef.current = { x: newX, y: newY };
      }
      applyStyle();
    }
  }, [minWidth, minHeight, autoHeight, applyStyle]);
  const handleMouseUp = useCallback(() => {
    if (isDragging.current || isResizing.current) {
      if (storageId) {
        try {
          localStorage.setItem(`panel_${storageId}`, JSON.stringify({
            pos: posRef.current,
            size: sizeRef.current
          }));
        } catch (e) {
        }
      }
    }
    isDragging.current = false;
    isResizing.current = false;
    resizeDirection.current = null;
    document.body.style.cursor = "";
  }, [storageId]);
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);
  useEffect(() => {
    if (!modal) return;
    const centerPanel = () => {
      const measuredHeight = autoHeight ? Math.min(window.innerHeight - 64, panelRef.current?.offsetHeight || sizeRef.current.h) : sizeRef.current.h;
      posRef.current = {
        x: Math.max(0, (window.innerWidth - sizeRef.current.w) / 2),
        y: Math.max(0, (window.innerHeight - measuredHeight) / 2)
      };
      applyStyle();
    };
    window.addEventListener("resize", centerPanel);
    centerPanel();
    return () => window.removeEventListener("resize", centerPanel);
  }, [autoHeight, modal, applyStyle]);
  const onHeaderDown = (e) => {
    if (modal || e.button !== 0 || !movable) return;
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...posRef.current };
    document.body.style.cursor = "grabbing";
  };
  const onResizeDown = (direction) => (e) => {
    if (modal || e.button !== 0 || !resizable) return;
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    resizeDirection.current = direction;
    dragStart.current = { x: e.clientX, y: e.clientY };
    startSize.current = { ...sizeRef.current };
    startPos.current = { ...posRef.current };
    const cursors = {
      "n": "ns-resize",
      "s": "ns-resize",
      "e": "ew-resize",
      "w": "ew-resize",
      "ne": "nesw-resize",
      "sw": "nesw-resize",
      "nw": "nwse-resize",
      "se": "nwse-resize"
    };
    document.body.style.cursor = cursors[direction];
  };
  const onCloseClick = (e) => {
    e.stopPropagation();
    onClose?.();
  };
  const pos = posRef.current;
  const size = sizeRef.current;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    modal && /* @__PURE__ */ jsx(
      "div",
      {
        className: "ui-modal-scrim"
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: panelRef,
        className: `ui-panel${modal ? " ui-panel-modal" : ""}`,
        style: {
          position: modal ? "fixed" : "absolute",
          left: 0,
          top: 0,
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          width: size.w,
          height: autoHeight ? "auto" : size.h,
          maxHeight: autoHeight ? "calc(100vh - 64px)" : void 0,
          zIndex: modal ? 2e3 : 200,
          willChange: isDragging.current || isResizing.current ? "transform, width, height" : "auto"
        },
        children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `ui-panel-header ${!movable || modal ? "ui-panel-header-static" : ""}`,
              onMouseDown: onHeaderDown,
              children: [
                /* @__PURE__ */ jsx("span", { className: "ui-panel-title", children: title }),
                onClose && /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "ui-panel-close",
                    onClick: onCloseClick,
                    title: closeLabel,
                    children: /* @__PURE__ */ jsx(IconClose, { width: 14, height: 14 })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "ui-panel-content", children }),
          resizable && !modal && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "ui-panel-resize-handle ui-panel-resize-e", onMouseDown: onResizeDown("e") }),
            /* @__PURE__ */ jsx("div", { className: "ui-panel-resize-handle ui-panel-resize-s", onMouseDown: onResizeDown("s") }),
            /* @__PURE__ */ jsx("div", { className: "ui-panel-resize-handle ui-panel-resize-w", onMouseDown: onResizeDown("w") }),
            /* @__PURE__ */ jsx("div", { className: "ui-panel-resize-handle ui-panel-resize-se", onMouseDown: onResizeDown("se") }),
            /* @__PURE__ */ jsx("div", { className: "ui-panel-resize-handle ui-panel-resize-sw", onMouseDown: onResizeDown("sw") })
          ] })
        ]
      }
    )
  ] });
};

const Row$1 = ({ label, children, labelWidth = "80px", stretch = false }) => /* @__PURE__ */ jsxs(
  "div",
  {
    className: "ui-form-row ui-form-row-tight",
    children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          className: "ui-form-label ui-form-label-dynamic",
          style: { ["--label-width"]: labelWidth },
          children: label
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `ui-form-value ${stretch ? "ui-form-value-stretch" : ""} ${stretch ? "" : "ui-form-value-end"}`,
          children
        }
      )
    ]
  }
);
const SettingsPanel = ({
  t,
  // 翻译函数
  onClose,
  // 关闭回调
  settings,
  // 场景设置
  onUpdate,
  // 设置更新回调
  currentLang,
  // 当前语言
  setLang,
  // 设置语言回调
  showStats,
  // 是否显示统计
  setShowStats,
  // 设置统计显示回调
  // 样式配置
  theme
  // 主题配置
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const tabOptions = [
    { value: "general", label: t("setting_general") || "通用" },
    { value: "lighting", label: t("st_lighting") || "光照" },
    { value: "viewport", label: t("st_viewport") || "视口" },
    { value: "highlight", label: t("st_highlight") || "高亮" }
  ];
  return /* @__PURE__ */ jsx(
    FloatingPanel,
    {
      title: t("settings"),
      closeLabel: t("panel_close") || "关闭",
      onClose,
      width: 360,
      height: 400,
      modal: true,
      movable: false,
      theme,
      children: /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-body", style: { flex: 1, minHeight: 0 }, children: [
        /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-sticky-tabs", children: /* @__PURE__ */ jsx(
          SegmentedControl,
          {
            options: tabOptions,
            value: activeTab,
            onChange: (value) => setActiveTab(value)
          }
        ) }),
        activeTab === "general" && /* @__PURE__ */ jsxs("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ jsx(Row$1, { label: t("st_lang"), labelWidth: "70px", stretch: true, children: /* @__PURE__ */ jsx(
            Select,
            {
              value: currentLang,
              options: [
                { value: "zh", label: "简体中文" },
                { value: "en", label: "English" }
              ],
              onChange: (v) => setLang(v)
            }
          ) }),
          /* @__PURE__ */ jsx(Row$1, { label: t("st_monitor"), labelWidth: "70px", children: /* @__PURE__ */ jsx(
            Switch,
            {
              checked: showStats,
              onChange: (v) => setShowStats(v)
            }
          ) })
        ] }),
        activeTab === "lighting" && /* @__PURE__ */ jsxs("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ jsx(Row$1, { label: t("st_ambient") || "环境光", labelWidth: "90px", stretch: true, children: /* @__PURE__ */ jsxs("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ jsx("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ jsx(
              Slider,
              {
                min: 0,
                max: 4,
                step: 0.05,
                value: settings.ambientInt || 0,
                onChange: (value) => onUpdate({ ambientInt: value })
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "ui-result-item-secondary-value", children: (settings.ambientInt || 0).toFixed(2) })
          ] }) }),
          /* @__PURE__ */ jsx(Row$1, { label: t("st_dir") || "主光", labelWidth: "90px", stretch: true, children: /* @__PURE__ */ jsxs("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ jsx("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ jsx(
              Slider,
              {
                min: 0,
                max: 4,
                step: 0.05,
                value: settings.dirInt || 0,
                onChange: (value) => onUpdate({ dirInt: value })
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "ui-result-item-secondary-value", children: (settings.dirInt || 0).toFixed(2) })
          ] }) }),
          /* @__PURE__ */ jsx(Row$1, { label: t("st_back") || "背光", labelWidth: "90px", stretch: true, children: /* @__PURE__ */ jsxs("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ jsx("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ jsx(
              Slider,
              {
                min: 0,
                max: 2,
                step: 0.05,
                value: settings.backLightInt ?? 0.5,
                onChange: (value) => onUpdate({ backLightInt: value })
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "ui-result-item-secondary-value", children: (settings.backLightInt ?? 0.5).toFixed(2) })
          ] }) })
        ] }),
        activeTab === "viewport" && /* @__PURE__ */ jsxs("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ jsx(Row$1, { label: t("st_viewcube_size"), labelWidth: "90px", stretch: true, children: /* @__PURE__ */ jsxs("div", { className: "ui-slider-field", children: [
            /* @__PURE__ */ jsx("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ jsx(
              Slider,
              {
                min: 120,
                max: 180,
                step: 5,
                value: settings.viewCubeSize || 120,
                onChange: (value) => onUpdate({ viewCubeSize: value })
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "ui-result-item-secondary-value ui-result-item-secondary-value-wide", children: [
              settings.viewCubeSize || 120,
              "px"
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(Row$1, { label: t("st_adaptive_quality") || "Adaptive", labelWidth: "90px", children: /* @__PURE__ */ jsx(
            Switch,
            {
              checked: settings.adaptiveQuality !== false,
              onChange: (v) => onUpdate({ adaptiveQuality: v })
            }
          ) }),
          /* @__PURE__ */ jsx(Row$1, { label: t("st_performance_profile") || "性能策略", labelWidth: "90px", children: /* @__PURE__ */ jsx("div", { className: "ui-inline-actions ui-inline-actions-end", children: /* @__PURE__ */ jsx(
            SegmentedControl,
            {
              options: [
                { value: "smooth", label: t("st_perf_smooth") || "流畅优先" },
                { value: "balanced", label: t("st_perf_balanced") || "平衡" },
                { value: "quality", label: t("st_perf_quality") || "画质优先" }
              ],
              value: settings.performanceMode || "balanced",
              onChange: (v) => onUpdate({ performanceMode: v })
            }
          ) }) })
        ] }),
        activeTab === "highlight" && /* @__PURE__ */ jsxs("div", { className: "ui-panel-stack", children: [
          /* @__PURE__ */ jsx(Row$1, { label: t("st_highlight_color") || "高亮颜色", labelWidth: "90px", stretch: true, children: /* @__PURE__ */ jsx(
            ColorPicker,
            {
              value: settings.highlightColor || "#ff9f1c",
              onChange: (value) => onUpdate({ highlightColor: value })
            }
          ) }),
          /* @__PURE__ */ jsx(Row$1, { label: t("st_highlight_box") || "显示包围盒", labelWidth: "90px", children: /* @__PURE__ */ jsx(
            Switch,
            {
              checked: settings.highlightShowBox === true,
              onChange: (value) => onUpdate({ highlightShowBox: value })
            }
          ) })
        ] })
      ] })
    }
  );
};

const Icons = {
  Trash: () => /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ jsx("path", { d: "M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9", strokeLinecap: "round", strokeLinejoin: "round" }) }),
  Close: () => /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ jsx("path", { d: "M2 2L12 12M12 2L2 12", strokeLinecap: "round" }) })
};
const ClearButton = ({ onClick, disabled }) => {
  return /* @__PURE__ */ jsx(
    Button,
    {
      onClick,
      disabled,
      variant: "ghost",
      size: "sm",
      className: "ui-btn-icon",
      title: "Clear All",
      children: /* @__PURE__ */ jsx(Icons.Trash, {})
    }
  );
};
const DataPanel = ({ children, empty, emptyText }) => {
  return /* @__PURE__ */ jsx("div", { className: "ui-data-panel ui-measure-results", children: empty ? /* @__PURE__ */ jsx("div", { className: "ui-measure-empty", children: emptyText }) : children });
};
const MeasureItem = ({ item, isHighlighted, onHighlight, onDelete }) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onClick: onHighlight,
      className: `ui-list-item ui-measure-item ${isHighlighted ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ jsx("span", { className: "ui-measure-item-value", children: item.val }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              onDelete();
            },
            className: "ui-btn ui-btn-icon-sm ui-btn-ghost",
            style: { opacity: 0.6, marginLeft: "8px" },
            onMouseEnter: (e) => e.currentTarget.style.opacity = "1",
            onMouseLeave: (e) => e.currentTarget.style.opacity = "0.6",
            children: /* @__PURE__ */ jsx(Icons.Close, {})
          }
        )
      ]
    }
  );
};
const TypeHeader = ({ label }) => {
  return /* @__PURE__ */ jsx("div", { className: "ui-group-title", children: label });
};
const MeasurePanel = ({
  t,
  sceneMgr,
  measureType,
  setMeasureType,
  measureHistory,
  onDelete,
  onClear,
  onClose,
  highlightedId,
  onHighlight
}) => {
  const groupedHistory = useMemo(() => {
    const groups = {
      "dist": [],
      "angle": [],
      "coord": []
    };
    measureHistory.forEach((item) => {
      if (groups[item.type]) groups[item.type].push(item);
    });
    return groups;
  }, [measureHistory]);
  const handleTypeChange = (type) => {
    setMeasureType(type);
    sceneMgr?.startMeasurement(type);
  };
  const getInstructionText = () => {
    switch (measureType) {
      case "dist":
        return t("measure_instruct_dist");
      case "angle":
        return t("measure_instruct_angle");
      case "coord":
        return t("measure_instruct_coord");
      default:
        return "";
    }
  };
  const getTypeLabel = (type) => {
    switch (type) {
      case "dist":
        return t("measure_dist") || "Distance";
      case "angle":
        return t("measure_angle") || "Angle";
      case "coord":
        return t("measure_coord") || "Coordinate";
      default:
        return type;
    }
  };
  return /* @__PURE__ */ jsx(
    FloatingPanel,
    {
      title: t("measure_title"),
      closeLabel: t("panel_close") || "关闭",
      onClose,
      width: 300,
      height: 400,
      resizable: true,
      storageId: "tool_measure",
      children: /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-body", children: [
        /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-row-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "ui-segmented ui-measure-types", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `ui-segmented-item ${measureType === "none" ? "active" : ""}`,
                onClick: () => handleTypeChange("none"),
                children: /* @__PURE__ */ jsx("span", { children: t("measure_none") || "None" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `ui-segmented-item ${measureType === "dist" ? "active" : ""}`,
                onClick: () => handleTypeChange("dist"),
                children: /* @__PURE__ */ jsx("span", { children: t("measure_dist") || "Distance" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `ui-segmented-item ${measureType === "angle" ? "active" : ""}`,
                onClick: () => handleTypeChange("angle"),
                children: /* @__PURE__ */ jsx("span", { children: t("measure_angle") || "Angle" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `ui-segmented-item ${measureType === "coord" ? "active" : ""}`,
                onClick: () => handleTypeChange("coord"),
                children: /* @__PURE__ */ jsx("span", { children: t("measure_coord") || "Coord" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx(ClearButton, { onClick: onClear, disabled: measureHistory.length === 0 })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-row-between ui-toolpanel-caption", children: [
          /* @__PURE__ */ jsx("span", { children: getInstructionText() }),
          measureType !== "none" && /* @__PURE__ */ jsx("span", { className: "ui-toolpanel-caption-muted", children: "[ESC] Exit" })
        ] }),
        /* @__PURE__ */ jsx(DataPanel, { empty: measureHistory.length === 0, emptyText: t("no_measurements") || "No measurements", children: measureHistory.length > 0 && /* @__PURE__ */ jsx("div", { className: "ui-measure-results-scroll", children: Object.entries(groupedHistory).map(([type, items]) => {
          if (items.length === 0) return null;
          return /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(TypeHeader, { label: getTypeLabel(type) }),
            items.map((item) => /* @__PURE__ */ jsx(
              MeasureItem,
              {
                item,
                isHighlighted: highlightedId === item.id,
                onHighlight: () => onHighlight?.(item.id),
                onDelete: () => onDelete(item.id)
              },
              item.id
            ))
          ] }, type);
        }) }) })
      ] })
    }
  );
};

const AxisSliderRow = ({ axis, label, active, value, onToggle, onChange, disabled = false }) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `ui-clip-axis-row${disabled ? " ui-is-disabled" : ""}`,
      children: [
        /* @__PURE__ */ jsx(
          Checkbox,
          {
            checked: active,
            onChange: (e) => onToggle(e),
            style: {
              width: "16px",
              height: "16px",
              cursor: "pointer",
              flexShrink: 0
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `ui-clip-axis-label${active ? " is-active" : ""}`,
            children: axis.toUpperCase()
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ jsx(
          DualSlider,
          {
            min: 0,
            max: 100,
            value,
            onChange,
            disabled: disabled || !active
          }
        ) }),
        /* @__PURE__ */ jsxs(
          "span",
          {
            className: "ui-clip-axis-value",
            children: [
              String(Math.round(value[0])).padStart(2, "0"),
              "-",
              String(Math.round(value[1])).padStart(2, "0"),
              "%"
            ]
          }
        )
      ]
    }
  );
};
const ClipPanel = ({
  t,
  onClose,
  clipEnabled,
  setClipEnabled,
  clipValues,
  setClipValues,
  clipActive,
  setClipActive,
  clipHelperVisible,
  setClipHelperVisible,
  clipHelperOpacity,
  setClipHelperOpacity
}) => {
  const handleReset = () => {
    setClipValues({ x: [0, 100], y: [0, 100], z: [0, 100] });
  };
  return /* @__PURE__ */ jsx(
    FloatingPanel,
    {
      title: t("clip_title"),
      closeLabel: t("panel_close") || "关闭",
      onClose,
      width: 320,
      height: 420,
      resizable: false,
      storageId: "tool_clip",
      children: /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-body", children: [
        /* @__PURE__ */ jsxs("div", { className: "ui-panel-section", children: [
          /* @__PURE__ */ jsxs("div", { className: "ui-form-row", children: [
            /* @__PURE__ */ jsx("span", { className: "ui-form-label", children: t("clip_enable") }),
            /* @__PURE__ */ jsx("div", { className: "ui-form-value", children: /* @__PURE__ */ jsx(Switch, { checked: clipEnabled, onChange: (v) => setClipEnabled(v) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ui-form-row", children: [
            /* @__PURE__ */ jsx("span", { className: "ui-form-label", children: t("clip_helper_visible") }),
            /* @__PURE__ */ jsx("div", { className: "ui-form-value", children: /* @__PURE__ */ jsx(
              Switch,
              {
                checked: clipHelperVisible,
                onChange: (v) => setClipHelperVisible(v),
                disabled: !clipEnabled
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ui-form-row", children: [
            /* @__PURE__ */ jsx("span", { className: "ui-form-label", children: t("clip_helper_opacity") }),
            /* @__PURE__ */ jsx("div", { className: "ui-form-value ui-form-value-stretch", children: /* @__PURE__ */ jsxs("div", { className: "ui-slider-field", children: [
              /* @__PURE__ */ jsx(
                Slider,
                {
                  min: 0.05,
                  max: 0.35,
                  step: 0.01,
                  value: clipHelperOpacity,
                  onChange: (value) => setClipHelperOpacity(value),
                  disabled: !clipEnabled || !clipHelperVisible
                }
              ),
              /* @__PURE__ */ jsxs("span", { className: "ui-slider-value", children: [
                Math.round(clipHelperOpacity * 100),
                "%"
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `ui-panel-section ui-panel-section-fill${clipEnabled ? "" : " ui-is-disabled"}`,
            children: [
              /* @__PURE__ */ jsx(
                AxisSliderRow,
                {
                  axis: "x",
                  label: t("clip_x"),
                  active: clipActive.x,
                  value: clipValues.x,
                  onToggle: (v) => setClipActive({ ...clipActive, x: v }),
                  onChange: (val) => setClipValues({ ...clipValues, x: val }),
                  disabled: !clipEnabled
                }
              ),
              /* @__PURE__ */ jsx(
                AxisSliderRow,
                {
                  axis: "y",
                  label: t("clip_y"),
                  active: clipActive.y,
                  value: clipValues.y,
                  onToggle: (v) => setClipActive({ ...clipActive, y: v }),
                  onChange: (val) => setClipValues({ ...clipValues, y: val }),
                  disabled: !clipEnabled
                }
              ),
              /* @__PURE__ */ jsx(
                AxisSliderRow,
                {
                  axis: "z",
                  label: t("clip_z"),
                  active: clipActive.z,
                  value: clipValues.z,
                  onToggle: (v) => setClipActive({ ...clipActive, z: v }),
                  onChange: (val) => setClipValues({ ...clipValues, z: val }),
                  disabled: !clipEnabled
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "ui-panel-footer", children: /* @__PURE__ */ jsx(Button, { variant: "default", onClick: handleReset, disabled: !clipEnabled, children: t("clip_reset") || "重置范围" }) })
      ] })
    }
  );
};

const ExportPanel = ({ t, onClose, onExport, getDefaultFileName, theme }) => {
  const [format, setFormat] = useState("glb");
  const [fileName, setFileName] = useState(() => getDefaultFileName("glb"));
  useEffect(() => {
    setFileName(getDefaultFileName(format));
  }, [format, getDefaultFileName]);
  return /* @__PURE__ */ jsx(FloatingPanel, { title: t("export_title"), closeLabel: t("panel_close") || "关闭", onClose, width: 320, height: 520, resizable: false, theme, storageId: "tool_export", children: /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-body", children: [
    /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-caption", children: [
      t("export_format"),
      ":"
    ] }),
    [
      { id: "glb", label: "GLB", desc: t("export_glb") },
      { id: "lmb", label: "LMB", desc: t("export_lmb") },
      { id: "nbim", label: "NBIM", desc: t("export_nbim") }
    ].map((opt) => /* @__PURE__ */ jsxs("label", { className: `ui-choice-card ${format === opt.id ? "active" : ""}`, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "radio",
          name: "exportFmt",
          checked: format === opt.id,
          onChange: () => setFormat(opt.id),
          className: "ui-choice-card-radio"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "ui-choice-card-content", children: [
        /* @__PURE__ */ jsx("div", { className: "ui-choice-card-title", children: opt.label }),
        /* @__PURE__ */ jsx("div", { className: "ui-choice-card-desc", children: opt.desc })
      ] })
    ] }, opt.id)),
    /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-spaced", children: [
      t("export_filename") || "文件名",
      ":"
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value: fileName,
        onChange: (e) => setFileName(e.target.value),
        placeholder: t("export_filename_placeholder") || "请输入文件名",
        className: "ui-input ui-input-compact"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: t("export_filename_hint") || "留空时自动按模型名生成" }),
    /* @__PURE__ */ jsx(
      Button,
      {
        theme,
        onClick: () => onExport(format, fileName),
        className: "ui-toolpanel-submit",
        children: t("export_btn")
      }
    )
  ] }) });
};

const ScreenshotPanel = ({ t, onClose, onCapture, theme }) => {
  const [mode, setMode] = useState("scene");
  const options = [
    {
      id: "scene",
      label: t("op_screenshot") || "场景截图",
      desc: t("screenshot_scene_desc") || "保留当前背景色和界面里的场景效果"
    },
    {
      id: "transparent",
      label: t("op_screenshot_transparent") || "透明背景截图",
      desc: t("screenshot_transparent_desc") || "导出透明背景 PNG，便于汇报和排版"
    }
  ];
  return /* @__PURE__ */ jsx(
    FloatingPanel,
    {
      title: t("op_screenshot") || "场景截图",
      closeLabel: t("panel_close") || "关闭",
      onClose,
      width: 320,
      height: 340,
      resizable: false,
      theme,
      storageId: "tool_screenshot",
      children: /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-body", children: [
        /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-caption", children: [
          t("screenshot_mode") || "截图方式",
          ":"
        ] }),
        options.map((opt) => /* @__PURE__ */ jsxs("label", { className: `ui-choice-card ${mode === opt.id ? "active" : ""}`, children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "radio",
              name: "screenshotMode",
              checked: mode === opt.id,
              onChange: () => setMode(opt.id),
              className: "ui-choice-card-radio"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "ui-choice-card-content", children: [
            /* @__PURE__ */ jsx("div", { className: "ui-choice-card-title", children: opt.label }),
            /* @__PURE__ */ jsx("div", { className: "ui-choice-card-desc", children: opt.desc })
          ] })
        ] }, opt.id)),
        /* @__PURE__ */ jsx(
          Button,
          {
            theme,
            onClick: () => onCapture(mode),
            className: "ui-toolpanel-submit",
            children: t("btn_confirm") || "确定"
          }
        )
      ] })
    }
  );
};

const DEFAULT_SAVE_OPTIONS = {
  visibility: true,
  selection: true,
  clip: true,
  explode: true
};
const ViewpointPanel = ({
  t,
  onClose,
  viewpoints,
  onSave,
  onUpdateName,
  onLoad,
  onDelete,
  theme
}) => {
  const [newName, setNewName] = useState("");
  const [editingNames, setEditingNames] = useState({});
  const [saveOptions, setSaveOptions] = useState(DEFAULT_SAVE_OPTIONS);
  useEffect(() => {
    setNewName(`${t("viewpoint_title") || "视点"} ${viewpoints.length + 1}`);
  }, [viewpoints.length, t]);
  useEffect(() => {
    setEditingNames(
      viewpoints.reduce((acc, vp) => {
        acc[vp.id] = vp.name;
        return acc;
      }, {})
    );
  }, [viewpoints]);
  const handleSave = () => {
    const normalized = newName.trim();
    if (!normalized) return;
    onSave(normalized, saveOptions);
    setNewName(`${t("viewpoint_title") || "视点"} ${viewpoints.length + 1}`);
  };
  const handleRenameCommit = (id) => {
    const nextName = (editingNames[id] || "").trim();
    if (!nextName) {
      setEditingNames((prev) => ({
        ...prev,
        [id]: viewpoints.find((vp) => vp.id === id)?.name || ""
      }));
      return;
    }
    onUpdateName(id, nextName);
  };
  return /* @__PURE__ */ jsx(
    FloatingPanel,
    {
      title: t("viewpoint_title") || "视点管理",
      closeLabel: t("panel_close") || "关闭",
      onClose,
      width: 320,
      height: 470,
      resizable: true,
      theme,
      storageId: "tool_viewpoint",
      children: /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-body ui-toolpanel-body-dense", children: [
        /* @__PURE__ */ jsxs("div", { className: "ui-inline-actions", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              autoFocus: true,
              value: newName,
              onChange: (e) => setNewName(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") handleSave();
              },
              className: "ui-input",
              placeholder: t("viewpoint_title") || "视点名称"
            }
          ),
          /* @__PURE__ */ jsx(Button, { variant: "primary", onClick: handleSave, children: t("btn_confirm") || "保存" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ui-viewpoint-options", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              label: t("viewpoint_save_visibility") || "保存可见性",
              checked: saveOptions.visibility,
              onChange: (checked) => setSaveOptions((prev) => ({ ...prev, visibility: checked }))
            }
          ),
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              label: t("viewpoint_save_selection") || "保存选择",
              checked: saveOptions.selection,
              onChange: (checked) => setSaveOptions((prev) => ({ ...prev, selection: checked }))
            }
          ),
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              label: t("viewpoint_save_clip") || "保存剖切",
              checked: saveOptions.clip,
              onChange: (checked) => setSaveOptions((prev) => ({ ...prev, clip: checked }))
            }
          ),
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              label: t("viewpoint_save_explode") || "保存爆炸图",
              checked: saveOptions.explode,
              onChange: (checked) => setSaveOptions((prev) => ({ ...prev, explode: checked }))
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "ui-viewpoint-list-wrap", children: viewpoints.length === 0 ? /* @__PURE__ */ jsx("div", { className: "ui-empty-state", children: t("viewpoint_empty") || "暂无保存的视点" }) : /* @__PURE__ */ jsx("div", { className: "ui-viewpoint-grid", children: viewpoints.map((vp) => /* @__PURE__ */ jsxs("div", { className: "ui-viewpoint-card-v2", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "ui-viewpoint-image",
              onDoubleClick: () => onLoad(vp),
              title: t("viewpoint_load") || "双击恢复视点",
              children: [
                vp.image ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: vp.image,
                    alt: vp.name
                  }
                ) : /* @__PURE__ */ jsx("div", { className: "ui-viewpoint-no-preview", children: t("viewpoint_no_preview") || "无预览" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "ui-viewpoint-delete",
                    onClick: (e) => {
                      e.stopPropagation();
                      onDelete(vp.id);
                    },
                    title: t("delete_item") || "删除",
                    children: /* @__PURE__ */ jsx(IconTrash2, { size: 12 })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "ui-viewpoint-name",
              value: editingNames[vp.id] || "",
              onChange: (e) => setEditingNames((prev) => ({
                ...prev,
                [vp.id]: e.target.value
              })),
              onBlur: () => handleRenameCommit(vp.id),
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "ui-viewpoint-flags", children: [
            vp.saveOptions?.visibility !== false && /* @__PURE__ */ jsx("span", { children: t("viewpoint_flag_visibility") || "可见性" }),
            vp.saveOptions?.selection !== false && /* @__PURE__ */ jsx("span", { children: t("viewpoint_flag_selection") || "选择" }),
            vp.saveOptions?.clip !== false && /* @__PURE__ */ jsx("span", { children: t("viewpoint_flag_clip") || "剖切" }),
            vp.saveOptions?.explode !== false && /* @__PURE__ */ jsx("span", { children: t("viewpoint_flag_explode") || "爆炸图" })
          ] })
        ] }, vp.id)) }) })
      ] })
    }
  );
};

const Row = ({ label, children, stretch = false }) => /* @__PURE__ */ jsxs(
  "div",
  {
    className: "ui-form-row ui-form-row-tight",
    children: [
      /* @__PURE__ */ jsx("span", { className: "ui-form-label", children: label }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `ui-form-value${stretch ? " ui-form-value-stretch ui-form-value-start" : ""}`,
          children
        }
      )
    ]
  }
);
const ExplodePanel = ({
  t,
  onClose,
  enabled,
  strength,
  mode,
  onEnabledChange,
  onStrengthChange,
  onModeChange,
  onReset,
  theme
}) => {
  return /* @__PURE__ */ jsx(
    FloatingPanel,
    {
      title: t("explode_title") || "爆炸图",
      closeLabel: t("panel_close") || "关闭",
      onClose,
      width: 340,
      storageId: "tool_explode",
      modal: false,
      autoHeight: true,
      theme,
      children: /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-body ui-toolpanel-body-compact", children: [
        /* @__PURE__ */ jsx(Row, { label: t("explode_enable") || "启用", children: /* @__PURE__ */ jsx(Switch, { checked: enabled, onChange: onEnabledChange }) }),
        /* @__PURE__ */ jsx(Row, { label: t("explode_strength") || "强度", stretch: true, children: /* @__PURE__ */ jsxs("div", { className: "ui-slider-field", children: [
          /* @__PURE__ */ jsx("div", { className: "ui-inline-actions-stretch", children: /* @__PURE__ */ jsx(
            Slider,
            {
              min: 0,
              max: 100,
              step: 1,
              value: strength,
              onChange: onStrengthChange
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "ui-slider-value ui-slider-value-strong", children: [
            strength,
            "%"
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(Row, { label: t("explode_mode") || "方向", stretch: true, children: /* @__PURE__ */ jsx(
          SegmentedControl,
          {
            options: [
              { value: "radial", label: t("explode_mode_radial") || "四周" },
              { value: "horizontal", label: t("explode_mode_horizontal") || "横向" },
              { value: "vertical", label: t("explode_mode_vertical") || "纵向" }
            ],
            value: mode,
            onChange: (value) => onModeChange(value)
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "ui-panel-footer ui-panel-footer-spaced", children: /* @__PURE__ */ jsx(Button, { className: "ui-properties-action", onClick: onReset, children: t("explode_reset") || "重置" }) })
      ] })
    }
  );
};

const operatorOptions = [
  { value: "equals", labelKey: "search_op_equals", fallback: "等于" },
  { value: "contains", labelKey: "search_op_contains", fallback: "包含" },
  { value: "notContains", labelKey: "search_op_not_contains", fallback: "不包含" },
  { value: "startsWith", labelKey: "search_op_starts_with", fallback: "开头" },
  { value: "endsWith", labelKey: "search_op_ends_with", fallback: "结尾" }
];
const connectorOptions = [
  { value: "AND", labelKey: "search_connector_and", fallback: "且" },
  { value: "OR", labelKey: "search_connector_or", fallback: "或" }
];
const SearchPanel = ({
  t,
  onClose,
  conditions,
  results,
  searching,
  searchProgress,
  searchStatus,
  onConditionsChange,
  onSearch,
  onCancelSearch,
  onApplyResultHighlight,
  onClearResult,
  theme
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  useEffect(() => {
    setPage(1);
  }, [results.length, pageSize]);
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageItems = useMemo(() => results.slice(pageStart, pageStart + pageSize), [results, pageStart, pageSize]);
  const updateCondition = (id, patch) => {
    onConditionsChange(conditions.map((item) => item.id === id ? { ...item, ...patch } : item));
  };
  const addCondition = () => {
    const nextId = `cond_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    onConditionsChange([
      ...conditions,
      {
        id: nextId,
        propertyName: "",
        operator: "contains",
        value: "",
        connector: "AND"
      }
    ]);
  };
  const removeCondition = (id) => {
    const next = conditions.filter((item) => item.id !== id);
    onConditionsChange(next.length > 0 ? next : [{ id: "cond_init", propertyName: "", operator: "contains", value: "" }]);
  };
  return /* @__PURE__ */ jsx(
    FloatingPanel,
    {
      title: t("tb_search") || "属性搜索",
      closeLabel: t("panel_close") || "关闭",
      onClose,
      width: 420,
      storageId: "tool_search",
      autoHeight: true,
      theme,
      children: /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-body", children: [
        /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-row-between", children: [
          /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-caption", children: t("search_conditions") || "搜索条件" }),
          /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-row", children: [
            /* @__PURE__ */ jsx(Button, { className: "ui-properties-action", onClick: addCondition, children: t("search_add_condition") || "添加条件" }),
            /* @__PURE__ */ jsx(Button, { className: "ui-properties-action", onClick: onSearch, disabled: searching, children: searching ? t("searching") || "搜索中..." : t("search_run") || "搜索" })
          ] })
        ] }),
        conditions.map((condition, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: `ui-toolpanel-grid ui-toolpanel-grid-condition ${index > 0 ? "ui-toolpanel-grid-condition-linked" : "ui-toolpanel-grid-condition-first"}`,
            children: [
              index > 0 && /* @__PURE__ */ jsx(
                Select,
                {
                  value: condition.connector || "AND",
                  options: connectorOptions.map((item) => ({ value: item.value, label: t(item.labelKey) || item.fallback })),
                  onChange: (value) => updateCondition(condition.id, { connector: value }),
                  className: "ui-input-compact",
                  style: { width: "64px", flexShrink: 0 }
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  className: "ui-input ui-input-compact",
                  placeholder: t("search_field_name") || "属性名",
                  value: condition.propertyName,
                  onChange: (e) => updateCondition(condition.id, { propertyName: e.target.value }),
                  style: { flex: 1, minWidth: 0 }
                }
              ),
              /* @__PURE__ */ jsx(
                Select,
                {
                  value: condition.operator,
                  options: operatorOptions.map((item) => ({ value: item.value, label: t(item.labelKey) || item.fallback })),
                  onChange: (value) => updateCondition(condition.id, { operator: value }),
                  className: "ui-input-compact",
                  style: { width: "92px" }
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  className: "ui-input ui-input-compact",
                  placeholder: t("search_field_value") || "属性值",
                  value: condition.value,
                  onChange: (e) => updateCondition(condition.id, { value: e.target.value }),
                  style: { flex: 1, minWidth: 0 }
                }
              ),
              index > 0 ? /* @__PURE__ */ jsx(
                "button",
                {
                  className: "ui-search-clear ui-search-clear-static",
                  onClick: () => removeCondition(condition.id),
                  title: t("remove_condition") || "移除条件",
                  style: { flexShrink: 0, width: "24px" },
                  children: /* @__PURE__ */ jsx(IconClose, { width: 14, height: 14 })
                }
              ) : /* @__PURE__ */ jsx("div", { style: { width: "24px", flexShrink: 0 } })
            ]
          },
          condition.id
        )),
        /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-row-between ui-toolpanel-caption", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            t("search_results") || "搜索结果",
            ": ",
            results.length
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-row", children: [
            /* @__PURE__ */ jsx("span", { children: t("search_page_size") || "每页" }),
            /* @__PURE__ */ jsx(
              Select,
              {
                value: String(pageSize),
                onChange: (value) => setPageSize(Number(value) || 50),
                options: [
                  { value: "20", label: "20" },
                  { value: "50", label: "50" },
                  { value: "100", label: "100" }
                ],
                className: "ui-input-compact",
                style: { minWidth: 68 }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-results-box ui-search-results-box", children: results.length === 0 ? /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-results-empty", children: t("search_no_results") || "暂无结果" }) : pageItems.map((item) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "ui-search-result-item ui-search-result-item-simple",
            title: `${item.uuid}
${item.matchedBy.join("\n")}`,
            children: /* @__PURE__ */ jsxs(
              "button",
              {
                className: "ui-search-result-main",
                onClick: () => onApplyResultHighlight(item.uuid),
                children: [
                  /* @__PURE__ */ jsx("span", { children: item.name || item.uuid }),
                  /* @__PURE__ */ jsx("span", { className: "ui-result-item-secondary", children: [item.type, item.modelId, ...item.matchedBy].filter(Boolean).join(" · ") })
                ]
              }
            )
          },
          item.uuid
        )) }),
        results.length > 0 && /* @__PURE__ */ jsx(
          PaginationControls,
          {
            prevTitle: t("search_page_prev") || "上一页",
            nextTitle: t("search_page_next") || "下一页",
            currentPage,
            totalPages,
            onPrev: () => setPage((prev) => Math.max(1, prev - 1)),
            onNext: () => setPage((prev) => Math.min(totalPages, prev + 1)),
            rightContent: /* @__PURE__ */ jsx(Button, { className: "ui-properties-action", onClick: onClearResult, children: t("search_clear") || "清除结果" })
          }
        ),
        searching && /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-overlay", children: /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-overlay-card", children: [
          /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-overlay-title", children: searchStatus || (t("searching") || "搜索中...") }),
          /* @__PURE__ */ jsx("div", { className: "ui-progress-bar ui-progress-bar-full", children: /* @__PURE__ */ jsx("div", { className: "ui-progress-fill", style: { width: `${Math.max(0, Math.min(100, searchProgress))}%` } }) }),
          /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-row-between ui-toolpanel-caption ui-toolpanel-caption-spaced", children: [
            /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: [
              Math.round(searchProgress),
              "%"
            ] }),
            /* @__PURE__ */ jsx(Button, { className: "ui-properties-action", onClick: onCancelSearch, children: t("search_cancel") || "取消搜索" })
          ] })
        ] }) })
      ] })
    }
  );
};

const ClashPanel = ({
  t,
  onClose,
  running,
  progress,
  status,
  scannedCount,
  pairsScanned,
  results,
  resultFilter,
  modelOptions,
  setA,
  setB,
  tolerance,
  minOverlapVolume,
  clearanceDistance,
  useNarrowPhase,
  useTrianglePhase,
  includeSameModel,
  onSetAChange,
  onSetBChange,
  onToleranceChange,
  onMinOverlapVolumeChange,
  onClearanceDistanceChange,
  onUseNarrowPhaseChange,
  onUseTrianglePhaseChange,
  onIncludeSameModelChange,
  onRun,
  onCancel,
  onClear,
  onExportCsv,
  onIsolateByStatus,
  onRestoreVisibility,
  onResultFilterChange,
  typeFilter,
  onTypeFilterChange,
  onUpdateResultStatus,
  onMarkFilteredStatus,
  onSetASelectAll,
  onSetAClear,
  onSetBSelectAll,
  onSetBClear,
  onFocusResult,
  theme
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [scopeExpanded, setScopeExpanded] = useState(modelOptions.length <= 4);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);
  useEffect(() => {
    setPage(1);
  }, [results.length, pageSize]);
  const filteredResults = results;
  const totalPages = Math.max(1, Math.ceil(filteredResults.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageItems = useMemo(() => filteredResults.slice(pageStart, pageStart + pageSize), [filteredResults, pageStart, pageSize]);
  const setAIds = useMemo(() => new Set(setA), [setA]);
  const setBIds = useMemo(() => new Set(setB), [setB]);
  const readyText = status || (running ? t("clash_running") || "正在执行碰撞检查..." : t("clash_ready") || "准备就绪");
  const scopeSummary = `${t("clash_set_a") || "模型集 A"} ${setA.length} · ${t("clash_set_b") || "模型集 B"} ${setB.length}`;
  const toggleFromSet = (source, id, onChange) => {
    const nextSet = new Set(source);
    if (nextSet.has(id)) nextSet.delete(id);
    else nextSet.add(id);
    onChange(Array.from(nextSet));
  };
  return /* @__PURE__ */ jsx(
    FloatingPanel,
    {
      title: t("tb_clash") || "碰撞检查",
      closeLabel: t("panel_close") || "关闭",
      onClose,
      width: 500,
      storageId: "tool_clash",
      autoHeight: true,
      theme,
      children: /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-body ui-clash-panel", children: [
        /* @__PURE__ */ jsxs("div", { className: "ui-clash-hero", children: [
          /* @__PURE__ */ jsxs("div", { className: "ui-clash-hero-main", children: [
            /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-caption-strong ui-clash-hero-title", children: readyText }),
            /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-caption ui-clash-hero-meta", children: [
              t("clash_scope_visible") || "范围：当前可见构件",
              " · ",
              t("clash_candidates") || "候选",
              " ",
              scannedCount,
              " · ",
              t("clash_pairs_scanned") || "已扫描对数",
              " ",
              pairsScanned
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-row ui-toolpanel-wrap ui-clash-hero-actions", children: [
            !running ? /* @__PURE__ */ jsx(Button, { className: "ui-properties-action", onClick: onRun, variant: "primary", children: t("clash_run") || "开始检查" }) : /* @__PURE__ */ jsx(Button, { className: "ui-properties-action", onClick: onCancel, children: t("search_cancel") || "取消搜索" }),
            /* @__PURE__ */ jsx(Button, { className: "ui-properties-action", onClick: onClear, children: t("clash_clear") || "清空结果" }),
            /* @__PURE__ */ jsx(Button, { className: "ui-properties-action", onClick: onExportCsv, disabled: results.length === 0, children: t("clash_export_csv") || "导出 CSV" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "ui-progress-bar ui-progress-bar-full ui-clash-progress", children: /* @__PURE__ */ jsx("div", { className: "ui-progress-fill", style: { width: `${Math.max(0, Math.min(100, progress))}%` } }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ui-clash-section", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              className: "ui-clash-section-toggle",
              onClick: () => setScopeExpanded((prev) => !prev),
              children: [
                /* @__PURE__ */ jsx("span", { className: "ui-toolpanel-caption-strong ui-clash-section-title", children: t("clash_scope_visible") || "检测范围" }),
                /* @__PURE__ */ jsx("span", { className: "ui-toolpanel-caption ui-clash-section-summary", children: scopeSummary })
              ]
            }
          ),
          scopeExpanded && /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-grid ui-toolpanel-grid-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "ui-selection-box", children: [
              /* @__PURE__ */ jsxs("div", { className: "ui-selection-box-header", children: [
                /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-caption-strong", children: t("clash_set_a") || "模型集 A" }),
                /* @__PURE__ */ jsxs("div", { className: "ui-selection-box-actions", children: [
                  /* @__PURE__ */ jsx("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: onSetASelectAll, children: t("select_all") || "全选" }),
                  /* @__PURE__ */ jsx("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: onSetAClear, children: t("search_clear") || "清空" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "ui-selection-box-list ui-clash-selection-list", children: modelOptions.length === 0 ? /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: t("clash_no_models") || "暂无模型" }) : modelOptions.map((item) => /* @__PURE__ */ jsx(
                Checkbox,
                {
                  checked: setAIds.has(item.id),
                  onChange: () => toggleFromSet(setA, item.id, onSetAChange),
                  label: item.name,
                  labelStyle: { fontSize: 11 }
                },
                `a_${item.id}`
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "ui-selection-box", children: [
              /* @__PURE__ */ jsxs("div", { className: "ui-selection-box-header", children: [
                /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-caption-strong", children: t("clash_set_b") || "模型集 B" }),
                /* @__PURE__ */ jsxs("div", { className: "ui-selection-box-actions", children: [
                  /* @__PURE__ */ jsx("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: onSetBSelectAll, children: t("select_all") || "全选" }),
                  /* @__PURE__ */ jsx("button", { className: "ui-statusbar-tag ui-statusbar-tag-compact", onClick: onSetBClear, children: t("search_clear") || "清空" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "ui-selection-box-list ui-clash-selection-list", children: modelOptions.length === 0 ? /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: t("clash_no_models") || "暂无模型" }) : modelOptions.map((item) => /* @__PURE__ */ jsx(
                Checkbox,
                {
                  checked: setBIds.has(item.id),
                  onChange: () => toggleFromSet(setB, item.id, onSetBChange),
                  label: item.name,
                  labelStyle: { fontSize: 11 }
                },
                `b_${item.id}`
              )) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ui-clash-section", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              className: "ui-clash-section-toggle",
              onClick: () => setAdvancedExpanded((prev) => !prev),
              children: [
                /* @__PURE__ */ jsx("span", { className: "ui-toolpanel-caption-strong ui-clash-section-title", children: t("settings_more") || "高级设置" }),
                /* @__PURE__ */ jsxs("span", { className: "ui-toolpanel-caption ui-clash-section-summary", children: [
                  t("clash_tolerance") || "容差",
                  " / ",
                  t("clash_min_overlap") || "最小重叠体积",
                  " / ",
                  t("clash_clearance_distance") || "最小净空距离"
                ] })
              ]
            }
          ),
          advancedExpanded && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-grid ui-toolpanel-grid-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-spaced", children: t("clash_tolerance") || "容差" }),
                /* @__PURE__ */ jsx(
                  InputNumber,
                  {
                    className: "ui-input-compact",
                    value: Number.isFinite(tolerance) ? tolerance : 0,
                    min: 0,
                    step: 1e-3,
                    onChange: (value) => onToleranceChange(Math.max(0, value || 0)),
                    style: { width: "100%" }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-spaced", children: t("clash_min_overlap") || "最小重叠体积" }),
                /* @__PURE__ */ jsx(
                  InputNumber,
                  {
                    className: "ui-input-compact",
                    value: Number.isFinite(minOverlapVolume) ? minOverlapVolume : 0,
                    min: 0,
                    step: 1e-6,
                    onChange: (value) => onMinOverlapVolumeChange(Math.max(0, value || 0)),
                    style: { width: "100%" }
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-grid ui-toolpanel-grid-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-spaced", children: t("clash_clearance_distance") || "最小净空距离" }),
                /* @__PURE__ */ jsx(
                  InputNumber,
                  {
                    className: "ui-input-compact",
                    value: Number.isFinite(clearanceDistance) ? clearanceDistance : 0,
                    min: 0,
                    step: 1e-3,
                    onChange: (value) => onClearanceDistanceChange(Math.max(0, value || 0)),
                    style: { width: "100%" }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "ui-clash-option-stack", children: [
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    checked: useNarrowPhase,
                    onChange: onUseNarrowPhaseChange,
                    label: t("clash_narrow_phase") || "启用精筛（OBB）",
                    labelStyle: { fontSize: 12 }
                  }
                ),
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    checked: useTrianglePhase,
                    onChange: onUseTrianglePhaseChange,
                    label: t("clash_triangle_phase") || "启用三角面复核",
                    labelStyle: { fontSize: 12 }
                  }
                ),
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    checked: includeSameModel,
                    onChange: onIncludeSameModelChange,
                    label: t("clash_include_same_model") || "包含同模型内检测",
                    labelStyle: { fontSize: 12 }
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-row-between ui-clash-results-header", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-caption-strong ui-clash-results-title", children: [
              t("clash_results") || "碰撞结果",
              " ",
              filteredResults.length
            ] }),
            /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-caption ui-toolpanel-caption-muted", children: t("locate_in_view") || "点击条目定位到视图" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-row", children: /* @__PURE__ */ jsx(
            Select,
            {
              value: String(pageSize),
              onChange: (value) => setPageSize(Number(value) || 50),
              options: [
                { value: "20", label: "20" },
                { value: "50", label: "50" },
                { value: "100", label: "100" }
              ],
              className: "ui-input-compact",
              style: { minWidth: 68 }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-results-box ui-clash-results-box", children: filteredResults.length === 0 ? /* @__PURE__ */ jsx("div", { className: "ui-toolpanel-results-empty", children: t("clash_no_results") || "暂无碰撞结果" }) : pageItems.map((item) => /* @__PURE__ */ jsxs(
          "button",
          {
            className: "ui-search-result-item ui-clash-result-item",
            onClick: () => onFocusResult(item),
            title: `${item.aUuid} <> ${item.bUuid}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "ui-clash-result-top", children: /* @__PURE__ */ jsxs("span", { className: "ui-clash-result-title", children: [
                item.aName || item.aUuid,
                " ",
                " <> ",
                " ",
                item.bName || item.bUuid
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "ui-toolpanel-row-between ui-clash-result-meta", children: [
                /* @__PURE__ */ jsxs("span", { className: "ui-result-item-secondary", children: [
                  item.aUuid,
                  " ",
                  " <> ",
                  " ",
                  item.bUuid
                ] }),
                /* @__PURE__ */ jsx("span", { className: "ui-result-item-secondary", children: item.type === "hard" ? `${t("clash_overlap_volume") || "重叠体积"}: ${item.overlapVolume.toFixed(6)}` : `${t("clash_clearance_value") || "净空距离"}: ${item.distance.toFixed(6)}` })
              ] })
            ]
          },
          item.id
        )) }),
        filteredResults.length > 0 && /* @__PURE__ */ jsx(
          PaginationControls,
          {
            prevTitle: t("search_page_prev") || "上一页",
            nextTitle: t("search_page_next") || "下一页",
            currentPage,
            totalPages,
            onPrev: () => setPage((prev) => Math.max(1, prev - 1)),
            onNext: () => setPage((prev) => Math.min(totalPages, prev + 1))
          }
        )
      ] })
    }
  );
};

const LoadingOverlay = ({ t, loading, status, progress, theme }) => {
  if (!loading) return null;
  return /* @__PURE__ */ jsx("div", { className: "ui-loading-overlay", children: /* @__PURE__ */ jsxs("div", { className: "ui-loading-box", children: [
    /* @__PURE__ */ jsxs("div", { className: "ui-loading-header", children: [
      /* @__PURE__ */ jsx("div", { className: "ui-loading-title", children: status }),
      /* @__PURE__ */ jsxs("div", { className: "ui-loading-percent", children: [
        Math.round(progress),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "ui-progress-bar ui-loading-progress", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "ui-progress-fill",
        style: {
          width: `${progress}%`,
          transition: "width 0.3s ease-out"
        }
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "ui-loading-meta", children: [
      /* @__PURE__ */ jsxs("svg", { className: "ui-loading-spinner", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ jsx("circle", { className: "ui-loading-spinner-track", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }),
        /* @__PURE__ */ jsx("path", { className: "ui-loading-spinner-head", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
      ] }),
      /* @__PURE__ */ jsx("span", { children: progress === 100 ? t("processing") : t("loading_resources") })
    ] })
  ] }) });
};

function normalizePropertyToken(value) {
  return String(value ?? "").normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}
function stringifyPropertyValue(value) {
  if (value === null || value === void 0) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((item) => stringifyPropertyValue(item)).filter(Boolean).join(", ");
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}
function toListItems(input) {
  if (Array.isArray(input)) return input;
  return Object.entries(input).map(([key, value]) => ({ key, value }));
}
function createPropertyEntries(groupName, input, fallbackSource) {
  return toListItems(input).map((item, index) => {
    const key = String(item.key ?? "").trim();
    const value = stringifyPropertyValue(item.value);
    if (!key || !value) return null;
    const path = `${groupName}.${key}`;
    return {
      id: item.id || `${groupName}::${key}::${index}`,
      group: groupName,
      key,
      value,
      path,
      rawKey: item.rawKey,
      source: item.source || fallbackSource,
      normalizedGroup: normalizePropertyToken(groupName),
      normalizedKey: normalizePropertyToken(key),
      normalizedPath: normalizePropertyToken(path),
      normalizedValue: normalizePropertyToken(value)
    };
  }).filter(Boolean);
}
function buildPropertyGroupsFromRecord(groups, fallbackSource) {
  if (!groups) return [];
  return Object.entries(groups).map(([groupName, input]) => ({
    name: groupName,
    items: createPropertyEntries(groupName, input, fallbackSource)
  })).filter((group) => group.items.length > 0);
}
function filterPropertyGroups(groups, query) {
  const normalizedQuery = normalizePropertyToken(query);
  if (!normalizedQuery) return groups;
  return groups.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => item.normalizedGroup.includes(normalizedQuery) || item.normalizedKey.includes(normalizedQuery) || item.normalizedPath.includes(normalizedQuery) || item.normalizedValue.includes(normalizedQuery)
    )
  })).filter((group) => group.items.length > 0);
}
function serializePropertyGroups(groups) {
  return groups.map((group) => [`[${group.name}]`, ...group.items.map((item) => `${item.key}: ${item.value}`)].join("\n")).join("\n\n");
}

const PropertiesPanel = ({ t, selectedProps }) => {
  const [collapsed, setCollapsed] = useState(/* @__PURE__ */ new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedText, setCopiedText] = useState(null);
  const currentGroups = useMemo(() => {
    return selectedProps;
  }, [selectedProps]);
  const toggleGroup = (group) => {
    const next = new Set(collapsed);
    if (next.has(group)) next.delete(group);
    else next.add(group);
    setCollapsed(next);
  };
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 1500);
    } catch (e) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (copied) {
          setCopiedText(text);
          setTimeout(() => setCopiedText(null), 1500);
          return;
        }
      } catch {
      }
      console.error("Failed to copy", e);
    }
  };
  const filteredProps = useMemo(() => {
    if (!currentGroups) return null;
    return filterPropertyGroups(currentGroups, searchQuery);
  }, [currentGroups, searchQuery]);
  useEffect(() => {
    if (!filteredProps || !searchQuery) return;
    const matchedGroups = new Set(filteredProps.map((group) => group.name));
    setCollapsed((prev) => {
      const next = new Set(prev);
      matchedGroups.forEach((groupName) => next.delete(groupName));
      return next;
    });
  }, [filteredProps, searchQuery]);
  const groupCount = filteredProps ? filteredProps.length : 0;
  const itemCount = filteredProps ? filteredProps.reduce((sum, group) => sum + group.items.length, 0) : 0;
  return /* @__PURE__ */ jsxs("div", { className: "ui-properties-panel", children: [
    selectedProps && /* @__PURE__ */ jsxs("div", { className: "ui-properties-toolbar", children: [
      /* @__PURE__ */ jsx("div", { className: "ui-search-input-wrap", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: t("search_props"),
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          className: "ui-input ui-input-compact"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "ui-properties-subbar", children: [
        /* @__PURE__ */ jsxs("div", { className: "ui-properties-meta", children: [
          (searchQuery ? t("search_results") : t("prop_groups")) + `: ${groupCount}`,
          /* @__PURE__ */ jsx("span", { children: " · " }),
          t("prop_items") + `: ${itemCount}`
        ] }),
        /* @__PURE__ */ jsx("div", { className: "ui-properties-actions", children: /* @__PURE__ */ jsx(
          "button",
          {
            className: "ui-properties-action ui-properties-icon-btn",
            onClick: () => currentGroups && handleCopy(serializePropertyGroups(currentGroups)),
            disabled: !currentGroups,
            title: t("copy_all_props"),
            children: /* @__PURE__ */ jsx(IconCopy, { size: 14 })
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "ui-properties-scroll", children: filteredProps ? filteredProps.map((group) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: `ui-prop-group${collapsed.has(group.name) ? " collapsed" : ""}`, onClick: () => toggleGroup(group.name), children: [
        /* @__PURE__ */ jsx("span", { children: group.name }),
        /* @__PURE__ */ jsxs("div", { className: "ui-prop-group-actions", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "ui-prop-copy",
              onClick: (e) => {
                e.stopPropagation();
                handleCopy([`[${group.name}]`, ...group.items.map((item) => `${item.key}: ${item.value}`)].join("\n"));
              },
              title: t("copy_group_props"),
              children: /* @__PURE__ */ jsx(IconCopy, { size: 12 })
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "ui-prop-group-chevron", children: collapsed.has(group.name) ? /* @__PURE__ */ jsx(IconChevronRight, { width: 14, height: 14 }) : /* @__PURE__ */ jsx(IconChevronDown, { width: 14, height: 14 }) })
        ] })
      ] }),
      !collapsed.has(group.name) && group.items.map((item) => /* @__PURE__ */ jsxs("div", { className: "ui-prop-row", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "ui-prop-key",
            title: `${item.path} (${t("click_to_copy")})`,
            onClick: () => handleCopy(item.key),
            children: item.key
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "ui-prop-value",
            title: `${item.value}
${item.path}`,
            onClick: () => handleCopy(item.value),
            children: item.value
          }
        )
      ] }, item.id))
    ] }, group.name)) : /* @__PURE__ */ jsx("div", { className: "ui-properties-empty", children: t("no_selection") }) }),
    copiedText && /* @__PURE__ */ jsx("div", { className: "ui-copy-toast", children: t("copied") })
  ] });
};

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, t, theme }) => {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx(
    FloatingPanel,
    {
      title,
      onClose: onCancel,
      width: 360,
      height: 188,
      modal: true,
      movable: false,
      theme,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "ui-modal-body ui-modal-body-confirm",
          children: [
            /* @__PURE__ */ jsx("div", { className: "ui-modal-message", children: message }),
            /* @__PURE__ */ jsxs("div", { className: "ui-modal-actions", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "ui-btn ui-btn-default ui-modal-action-btn",
                  onClick: onCancel,
                  children: t("btn_cancel")
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "ui-btn ui-btn-danger ui-modal-action-btn",
                  onClick: onConfirm,
                  children: t("btn_confirm")
                }
              )
            ] })
          ]
        }
      )
    }
  );
};

const AboutModal = ({ isOpen, onClose, t, theme }) => {
  if (!isOpen) return null;
  const [showLicenseDetails, setShowLicenseDetails] = useState(true);
  return /* @__PURE__ */ jsx(
    FloatingPanel,
    {
      title: t("about_title"),
      onClose,
      width: 400,
      height: 520,
      modal: true,
      movable: false,
      theme,
      children: /* @__PURE__ */ jsxs("div", { className: "ui-modal-body ui-modal-body-scroll ui-about-modal", children: [
        /* @__PURE__ */ jsxs("div", { className: "ui-about-hero", children: [
          /* @__PURE__ */ jsx("div", { className: "ui-about-app-name", children: "3D Browser" }),
          /* @__PURE__ */ jsx("div", { className: "ui-about-tagline", children: t("about_tagline") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ui-about-meta-card", children: [
          /* @__PURE__ */ jsxs("div", { className: "ui-about-meta-row", children: [
            /* @__PURE__ */ jsx("span", { className: "ui-about-meta-label", children: t("about_version") }),
            /* @__PURE__ */ jsx("span", { className: "ui-about-meta-value", children: "1.6.0" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ui-about-meta-row", children: [
            /* @__PURE__ */ jsx("span", { className: "ui-about-meta-label", children: t("about_author") }),
            /* @__PURE__ */ jsx("span", { className: "ui-about-meta-value", children: "zhangly1403@163.com" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ui-about-meta-row", children: [
            /* @__PURE__ */ jsx("span", { className: "ui-about-meta-label", children: t("project_url") }),
            /* @__PURE__ */ jsx("a", { href: "https://github.com/zly258/3dbrowser", target: "_blank", rel: "noopener noreferrer", className: "ui-link", children: "github.com/zly258/3dbrowser" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ui-about-meta-row", children: [
            /* @__PURE__ */ jsx("span", { className: "ui-about-meta-label", children: t("about_license") }),
            /* @__PURE__ */ jsx("span", { className: "ui-about-meta-value ui-about-license-badge", children: t("about_license_nc") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ui-about-license-card", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "ui-about-license-toggle",
              onClick: () => setShowLicenseDetails(!showLicenseDetails),
              children: [
                /* @__PURE__ */ jsx("span", { className: "ui-about-license-title", children: t("license_details") }),
                showLicenseDetails ? /* @__PURE__ */ jsx(IconChevronUp, { width: 14, height: 14 }) : /* @__PURE__ */ jsx(IconChevronDown, { width: 14, height: 14 })
              ]
            }
          ),
          showLicenseDetails && /* @__PURE__ */ jsxs("div", { className: "ui-about-license-content", children: [
            /* @__PURE__ */ jsx("div", { className: "ui-about-license-summary", children: t("license_summary") }),
            /* @__PURE__ */ jsxs("div", { className: "ui-about-license-link", children: [
              t("full_license"),
              " ",
              /* @__PURE__ */ jsx("a", { href: "https://creativecommons.org/licenses/by-nc/4.0/", target: "_blank", rel: "noopener noreferrer", className: "ui-link", children: "CC BY-NC 4.0" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "ui-about-footer", children: t("about_copyright") })
      ] })
    }
  );
};

const ViewCube = ({ sceneMgr, lang = "zh", theme }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const cubeRef = useRef(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const hoveredPart = useRef(null);
  const cubeSize = sceneMgr?.settings?.viewCubeSize || 120;
  const t = (key) => getTranslation(lang, key);
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const width = cubeSize;
    const height = cubeSize;
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl2", {
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: false
    });
    if (gl) {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    }
    const renderer = new THREE.WebGLRenderer({
      canvas,
      context: gl || void 0,
      antialias: true,
      alpha: true,
      precision: "mediump"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 3.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    const ambientLight = new THREE.AmbientLight(16777215, 1);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(16777215, 0.6);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);
    cubeRef.current = cubeGroup;
    const createFaceTexture = (text, rotation = 0) => {
      const canvas2 = document.createElement("canvas");
      canvas2.width = 128;
      canvas2.height = 128;
      const context = canvas2.getContext("2d");
      if (context) {
        context.fillStyle = "#f8f9fa";
        context.fillRect(0, 0, 128, 128);
        context.save();
        context.translate(64, 64);
        if (rotation !== 0) {
          context.rotate(rotation * Math.PI / 180);
        }
        context.fillStyle = "#333333";
        context.font = lang === "zh" ? 'bold 54px "Microsoft YaHei", sans-serif' : "bold 32px Arial, sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, 0, 0);
        context.restore();
        context.strokeStyle = "#cccccc";
        context.lineWidth = 4;
        context.strokeRect(2, 2, 124, 124);
      }
      const texture = new THREE.CanvasTexture(canvas2);
      return texture;
    };
    const faceColor = 16316922;
    const edgeColor = 16316922;
    const cornerColor = 16316922;
    const createPart = (size, pos, name, color, text, rotation = 0) => {
      const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
      let material;
      if (text) {
        const texture = createFaceTexture(text, rotation);
        material = new THREE.MeshPhongMaterial({
          map: texture,
          transparent: true,
          opacity: 0.98,
          shininess: 30
        });
      } else {
        material = new THREE.MeshPhongMaterial({
          color,
          transparent: true,
          opacity: 0.98,
          shininess: 30
        });
      }
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(pos);
      mesh.name = name;
      mesh.userData.originalOpacity = material.opacity;
      mesh.userData.originalColor = material.color.clone();
      mesh.userData.isFace = !!text;
      cubeGroup.add(mesh);
      return mesh;
    };
    const faceSize = 0.88;
    const edgeSize = 0.12;
    const cornerSize = 0.12;
    const offset = 0.5;
    createPart(new THREE.Vector3(faceSize, 0.05, faceSize), new THREE.Vector3(0, -offset, 0), "front", faceColor, t("cube_front"));
    createPart(new THREE.Vector3(faceSize, 0.05, faceSize), new THREE.Vector3(0, offset, 0), "back", faceColor, t("cube_back"), 180);
    createPart(new THREE.Vector3(faceSize, faceSize, 0.05), new THREE.Vector3(0, 0, offset), "top", faceColor, t("cube_top"), 360);
    createPart(new THREE.Vector3(faceSize, faceSize, 0.05), new THREE.Vector3(0, 0, -offset), "bottom", faceColor, t("cube_bottom"));
    createPart(new THREE.Vector3(0.05, faceSize, faceSize), new THREE.Vector3(-offset, 0, 0), "left", faceColor, t("cube_left"), 90);
    createPart(new THREE.Vector3(0.05, faceSize, faceSize), new THREE.Vector3(offset, 0, 0), "right", faceColor, t("cube_right"), 270);
    createPart(new THREE.Vector3(faceSize, edgeSize, edgeSize), new THREE.Vector3(0, -offset, offset), "top-front", edgeColor);
    createPart(new THREE.Vector3(faceSize, edgeSize, edgeSize), new THREE.Vector3(0, offset, offset), "top-back", edgeColor);
    createPart(new THREE.Vector3(edgeSize, faceSize, edgeSize), new THREE.Vector3(-offset, 0, offset), "top-left", edgeColor);
    createPart(new THREE.Vector3(edgeSize, faceSize, edgeSize), new THREE.Vector3(offset, 0, offset), "top-right", edgeColor);
    createPart(new THREE.Vector3(faceSize, edgeSize, edgeSize), new THREE.Vector3(0, -offset, -offset), "bottom-front", edgeColor);
    createPart(new THREE.Vector3(faceSize, edgeSize, edgeSize), new THREE.Vector3(0, offset, -offset), "bottom-back", edgeColor);
    createPart(new THREE.Vector3(edgeSize, faceSize, edgeSize), new THREE.Vector3(-offset, 0, -offset), "bottom-left", edgeColor);
    createPart(new THREE.Vector3(edgeSize, faceSize, edgeSize), new THREE.Vector3(offset, 0, -offset), "bottom-right", edgeColor);
    createPart(new THREE.Vector3(edgeSize, edgeSize, faceSize), new THREE.Vector3(-offset, -offset, 0), "front-left", edgeColor);
    createPart(new THREE.Vector3(edgeSize, edgeSize, faceSize), new THREE.Vector3(offset, -offset, 0), "front-right", edgeColor);
    createPart(new THREE.Vector3(edgeSize, edgeSize, faceSize), new THREE.Vector3(-offset, offset, 0), "back-left", edgeColor);
    createPart(new THREE.Vector3(edgeSize, edgeSize, faceSize), new THREE.Vector3(offset, offset, 0), "back-right", edgeColor);
    createPart(new THREE.Vector3(cornerSize, cornerSize, cornerSize), new THREE.Vector3(-offset, -offset, offset), "top-front-left", cornerColor);
    createPart(new THREE.Vector3(cornerSize, cornerSize, cornerSize), new THREE.Vector3(offset, -offset, offset), "top-front-right", cornerColor);
    createPart(new THREE.Vector3(cornerSize, cornerSize, cornerSize), new THREE.Vector3(-offset, offset, offset), "top-back-left", cornerColor);
    createPart(new THREE.Vector3(cornerSize, cornerSize, cornerSize), new THREE.Vector3(offset, offset, offset), "top-back-right", cornerColor);
    createPart(new THREE.Vector3(cornerSize, cornerSize, cornerSize), new THREE.Vector3(-offset, -offset, -offset), "bottom-front-left", cornerColor);
    createPart(new THREE.Vector3(cornerSize, cornerSize, cornerSize), new THREE.Vector3(offset, -offset, -offset), "bottom-front-right", cornerColor);
    createPart(new THREE.Vector3(cornerSize, cornerSize, cornerSize), new THREE.Vector3(-offset, offset, -offset), "bottom-back-left", cornerColor);
    createPart(new THREE.Vector3(cornerSize, cornerSize, cornerSize), new THREE.Vector3(offset, offset, -offset), "bottom-back-right", cornerColor);
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (sceneMgr && cubeRef.current) {
        cubeRef.current.quaternion.copy(sceneMgr.camera.quaternion).invert();
      }
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    };
  }, [sceneMgr, cubeSize, lang]);
  const handleMouseMove = (event) => {
    if (!canvasRef.current || !sceneRef.current || !cameraRef.current || !cubeRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouse.current.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.current.setFromCamera(mouse.current, cameraRef.current);
    const intersects = raycaster.current.intersectObjects(cubeRef.current.children);
    if (intersects.length > 0) {
      const mesh = intersects[0].object;
      if (hoveredPart.current !== mesh) {
        if (hoveredPart.current) {
          const mat2 = hoveredPart.current.material;
          mat2.opacity = hoveredPart.current.userData.originalOpacity;
          mat2.color.copy(hoveredPart.current.userData.originalColor);
        }
        hoveredPart.current = mesh;
        const mat = mesh.material;
        mat.opacity = 1;
        mat.color.set(30932);
      }
      containerRef.current.style.cursor = "pointer";
    } else {
      if (hoveredPart.current) {
        const mat = hoveredPart.current.material;
        mat.opacity = hoveredPart.current.userData.originalOpacity;
        mat.color.copy(hoveredPart.current.userData.originalColor);
        hoveredPart.current = null;
      }
      containerRef.current.style.cursor = "default";
    }
  };
  const handleMouseLeave = () => {
    if (hoveredPart.current) {
      const mat = hoveredPart.current.material;
      mat.opacity = hoveredPart.current.userData.originalOpacity;
      mat.color.copy(hoveredPart.current.userData.originalColor);
      hoveredPart.current = null;
    }
  };
  const handleClick = (event) => {
    if (!canvasRef.current || !sceneRef.current || !cameraRef.current || !sceneMgr) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouse.current.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.current.setFromCamera(mouse.current, cameraRef.current);
    const intersects = raycaster.current.intersectObjects(cubeRef.current.children);
    if (intersects.length > 0) {
      const name = intersects[0].object.name;
      handleViewChange(name);
    }
  };
  const handleViewChange = (viewName) => {
    if (!sceneMgr) return;
    let targetView = viewName;
    if (viewName === "top-front-right") targetView = "se";
    else if (viewName === "top-front-left") targetView = "sw";
    else if (viewName === "top-back-right") targetView = "ne";
    else if (viewName === "top-back-left") targetView = "nw";
    sceneMgr.setView(targetView);
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      style: {
        position: "absolute",
        top: "10px",
        right: "10px",
        width: `${cubeSize}px`,
        height: `${cubeSize}px`,
        zIndex: 100,
        pointerEvents: "auto",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden"
      },
      onClick: handleClick,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      children: /* @__PURE__ */ jsx("canvas", { ref: canvasRef })
    }
  );
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary捕获到错误:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      const { t, theme } = this.props;
      return /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: DEFAULT_FONT,
        gap: "20px",
        padding: "40px",
        textAlign: "center"
      }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: "48px", lineHeight: 1 }, children: "⚠️" }),
        /* @__PURE__ */ jsx("h1", { style: { fontSize: "var(--font-size-title)", margin: 0, fontWeight: 700 }, children: t("error_title") }),
        /* @__PURE__ */ jsx("p", { style: { color: theme.textMuted, maxWidth: "600px", lineHeight: "1.6", fontSize: "var(--font-size-body)" }, children: t("error_msg") }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => window.location.reload(),
            style: {
              padding: "10px 24px",
              backgroundColor: theme.accent,
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "var(--font-size-body)",
              minHeight: "var(--control-h-md)"
            },
            children: t("error_reload")
          }
        )
      ] });
    }
    return this.props.children;
  }
}

function usePersistentState(key, initialValue, options = {}) {
  const {
    storage = typeof window !== "undefined" ? window.localStorage : void 0,
    serializer = JSON.stringify,
    parser = JSON.parse
  } = options;
  const resolveInitialValue = () => typeof initialValue === "function" ? initialValue() : initialValue;
  const [state, setState] = useState(() => {
    const fallback = resolveInitialValue();
    if (!storage) return fallback;
    try {
      const raw = storage.getItem(key);
      if (raw === null) return fallback;
      return parser(raw);
    } catch (error) {
      console.warn(`[usePersistentState] Failed to read "${key}"`, error);
      return fallback;
    }
  });
  useEffect(() => {
    if (!storage) return;
    try {
      storage.setItem(key, serializer(state));
    } catch (error) {
      console.warn(`[usePersistentState] Failed to write "${key}"`, error);
    }
  }, [key, serializer, state, storage]);
  return [state, setState];
}

function useChunkProgress({
  fileSetIdRef,
  completedFileSetsRef,
  onProgress,
  onCompleted
}) {
  const chunkProgressRafRef = useRef(null);
  const pendingChunkProgressRef = useRef(null);
  const flushChunkProgress = useCallback(() => {
    chunkProgressRafRef.current = null;
    const pending = pendingChunkProgressRef.current;
    if (!pending) return;
    pendingChunkProgressRef.current = null;
    const { loaded, total } = pending;
    onProgress((prev) => {
      if (prev.loaded === loaded && prev.total === total) return prev;
      return { loaded, total };
    });
    const fileSetId = fileSetIdRef.current;
    if (loaded === total && total > 0 && fileSetId) {
      if (!completedFileSetsRef.current.has(fileSetId)) {
        completedFileSetsRef.current.add(fileSetId);
        onCompleted();
      }
    }
  }, [completedFileSetsRef, fileSetIdRef, onCompleted, onProgress]);
  const onManagerChunkProgress = useCallback((loaded, total) => {
    pendingChunkProgressRef.current = { loaded, total };
    if (chunkProgressRafRef.current === null) {
      chunkProgressRafRef.current = requestAnimationFrame(flushChunkProgress);
    }
  }, [flushChunkProgress]);
  useEffect(() => {
    return () => {
      if (chunkProgressRafRef.current !== null) {
        cancelAnimationFrame(chunkProgressRafRef.current);
        chunkProgressRafRef.current = null;
      }
      pendingChunkProgressRef.current = null;
    };
  }, []);
  return { onManagerChunkProgress };
}

function normalizePath(path) {
  return path.replace(/\\/g, "/").replace(/^(\.\/)+/, "").replace(/^\/+/, "").toLowerCase();
}
function candidateKeys(input) {
  const normalized = normalizePath(input);
  const parts = normalized.split("/");
  const fileName = parts[parts.length - 1];
  return Array.from(/* @__PURE__ */ new Set([
    normalized,
    fileName,
    `./${normalized}`,
    `./${fileName}`
  ]));
}
function createResourceResolver(files) {
  const localFiles = files.filter((item) => item instanceof File);
  if (localFiles.length === 0) return null;
  const blobUrlMap = /* @__PURE__ */ new Map();
  const register = (key, file) => {
    if (!key || blobUrlMap.has(key)) return;
    blobUrlMap.set(key, URL.createObjectURL(file));
  };
  localFiles.forEach((file) => {
    register(normalizePath(file.name), file);
    const relativePath = file.webkitRelativePath;
    if (relativePath) {
      const trimmed = relativePath.split("/").slice(1).join("/");
      register(normalizePath(trimmed), file);
    }
  });
  return {
    resolve: (url) => {
      if (!url || /^(blob:|data:|https?:)/i.test(url)) return url;
      for (const key of candidateKeys(url)) {
        const resolved = blobUrlMap.get(key);
        if (resolved) return resolved;
      }
      return url;
    },
    has: (url) => candidateKeys(url).some((key) => blobUrlMap.has(key)),
    dispose: () => {
      blobUrlMap.forEach((blobUrl) => URL.revokeObjectURL(blobUrl));
      blobUrlMap.clear();
    }
  };
}

const STAGE_LABELS = {
  fetch: "reading",
  parse: "analyzing",
  normalize: "processing",
  optimize: "processing",
  addToScene: "processing"
};
const STAGE_WEIGHTS = {
  fetch: [0, 20],
  parse: [20, 58],
  normalize: [58, 72],
  optimize: [72, 92],
  addToScene: [92, 100]
};
const libPathCache = /* @__PURE__ */ new Map();
let gltfModulesPromise = null;
async function getGltfModules() {
  if (!gltfModulesPromise) {
    gltfModulesPromise = Promise.all([
      import('./loaders-TXHpcosE.js').then(n => n.a),
      import('./loaders-TXHpcosE.js').then(n => n.D),
      import('./loaders-TXHpcosE.js').then(n => n.K),
      import('./meshopt_decoder.module-C_9D6xwu.js')
    ]).then(([a, b, c, d]) => ({
      GLTFLoader: a.GLTFLoader,
      DRACOLoader: b.DRACOLoader,
      KTX2Loader: c.KTX2Loader,
      MeshoptDecoder: d.MeshoptDecoder
    }));
  }
  return gltfModulesPromise;
}
function normalizeLibPath(libPath) {
  if (!libPathCache.has(libPath)) {
    const trimmed = libPath.replace(/\/$/, "");
    const resolved = typeof window !== "undefined" ? new URL(trimmed ? `${trimmed}/` : "./", window.location.href).toString().replace(/\/$/, "") : trimmed;
    libPathCache.set(libPath, resolved);
  }
  return libPathCache.get(libPath);
}
function createLoadingManager(files, _libPath, _settings) {
  const resourceResolver = createResourceResolver(files);
  const manager = new THREE.LoadingManager();
  if (resourceResolver) {
    manager.setURLModifier((url) => resourceResolver.resolve(url));
  }
  const cleanup = () => {
    resourceResolver?.dispose();
  };
  return { manager, cleanup, resourceResolver };
}
async function createGltfLoaderRuntime(manager, libPath) {
  const { GLTFLoader, DRACOLoader, KTX2Loader, MeshoptDecoder } = await getGltfModules();
  const normalizedLibPath = normalizeLibPath(libPath);
  const supportsCompressedTextures = typeof window !== "undefined" && !!window.createImageBitmap;
  let probeRenderer = null;
  const dracoLoader = new DRACOLoader(manager);
  dracoLoader.setDecoderPath(`${normalizedLibPath}/draco/gltf/`);
  const ktx2Loader = new KTX2Loader(manager);
  ktx2Loader.setTranscoderPath(`${normalizedLibPath}/basis/`);
  if (typeof document !== "undefined") {
    try {
      probeRenderer = new THREE.WebGLRenderer({ canvas: document.createElement("canvas") });
      ktx2Loader.detectSupport(probeRenderer);
    } catch (error) {
      console.warn("[LoaderUtils] KTX2 detectSupport failed", error);
    }
  }
  const loader = new GLTFLoader(manager);
  loader.setDRACOLoader(dracoLoader);
  loader.setMeshoptDecoder(MeshoptDecoder);
  if (supportsCompressedTextures) {
    loader.setKTX2Loader(ktx2Loader);
  }
  return {
    loader,
    cleanup: () => {
      dracoLoader.dispose();
      ktx2Loader.dispose();
      probeRenderer?.dispose();
    }
  };
}
function createStageProgressReporter(onProgress, t, fileName, fileBaseProgress, fileWeight) {
  return (stage, progress, msg) => {
    const [start, end] = STAGE_WEIGHTS[stage];
    const safeP = Math.min(100, Math.max(0, Number.isFinite(progress) ? progress : 0));
    const stagePercent = start + safeP / 100 * (end - start);
    const totalPercent = fileBaseProgress + stagePercent / 100 * fileWeight;
    const label = msg || `${t(STAGE_LABELS[stage])} ${fileName}`;
    onProgress(Math.round(totalPercent), label);
  };
}
async function loadObjectByExtension(fileOrUrl, url, ext, files, reportStage, t, settings, libPath, runtimeHints) {
  const loaderContext = createLoadingManager(files);
  const { manager, cleanup, resourceResolver } = loaderContext;
  try {
    if (ext === "lmb") {
      const { LMBLoader } = await import('./lmbLoader-CgYhcRwk.js');
      const loader = new LMBLoader();
      reportStage("parse", 0);
      return await loader.loadAsync(
        url,
        (p) => reportStage("parse", p * 100),
        { fastMode: (runtimeHints.loadProfile ?? "balanced") === "max-speed" }
      );
    }
    if (ext === "glb" || ext === "gltf") {
      const { loader, cleanup: cleanupGltf } = await createGltfLoaderRuntime(manager, libPath);
      reportStage("parse", 0);
      try {
        const gltf = await new Promise((resolve, reject) => {
          loader.load(
            url,
            resolve,
            (e) => {
              if (e.total && e.total > 0) reportStage("parse", e.loaded / e.total * 100);
              else reportStage("parse", 50);
            },
            reject
          );
        });
        return gltf.scene;
      } finally {
        cleanupGltf();
      }
    }
    if (ext === "fbx") {
      const { FBXLoader } = await import('./loaders-TXHpcosE.js').then(n => n.F);
      const loader = new FBXLoader(manager);
      reportStage("parse", 0);
      return await new Promise((resolve, reject) => {
        loader.load(
          url,
          resolve,
          (e) => {
            if (e.total && e.total > 0) reportStage("parse", e.loaded / e.total * 100);
            else reportStage("parse", 50);
          },
          reject
        );
      });
    }
    if (ext === "ifc") {
      const { loadIFC } = await import('./ifcLoader-UXbmG1k2.js');
      reportStage("parse", 0);
      const ifcSettings = {
        ...settings,
        deferIfcProperties: runtimeHints.deferIfcProperties ?? true
      };
      return await loadIFC(
        typeof fileOrUrl === "string" ? url : fileOrUrl,
        (p, msg) => reportStage("parse", p, msg),
        t,
        libPath,
        ifcSettings
      );
    }
    if (ext === "obj") {
      const [{ OBJLoader }, { MTLLoader }] = await Promise.all([
        import('./loaders-TXHpcosE.js').then(n => n.b),
        import('./loaders-TXHpcosE.js').then(n => n.M)
      ]);
      const objLoader = new OBJLoader(manager);
      const mtlName = url.replace(/\.[^.]+$/i, ".mtl");
      if (resourceResolver?.has(mtlName)) {
        try {
          const materials = await new Promise((resolve, reject) => {
            const mtlLoader = new MTLLoader(manager);
            mtlLoader.load(mtlName, resolve, void 0, reject);
          });
          materials.preload();
          objLoader.setMaterials(materials);
        } catch (error) {
          console.warn("[LoaderUtils] Failed to load companion MTL", error);
        }
      }
      reportStage("parse", 0);
      return await objLoader.loadAsync(url, (e) => {
        if (e.total && e.total > 0) reportStage("parse", e.loaded / e.total * 100);
        else reportStage("parse", 50);
      });
    }
    if (ext === "stl") {
      const { STLLoader } = await import('./loaders-TXHpcosE.js').then(n => n.S);
      const loader = new STLLoader(manager);
      reportStage("parse", 0);
      const geometry = await loader.loadAsync(url, (e) => {
        if (e.total && e.total > 0) reportStage("parse", e.loaded / e.total * 100);
      });
      return new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 8947848 }));
    }
    if (ext === "ply") {
      const { PLYLoader } = await import('./loaders-TXHpcosE.js').then(n => n.P);
      const loader = new PLYLoader(manager);
      reportStage("parse", 0);
      const geometry = await loader.loadAsync(url, (e) => {
        if (e.total && e.total > 0) reportStage("parse", e.loaded / e.total * 100);
      });
      return new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
        color: 8947848,
        vertexColors: geometry.hasAttribute("color")
      }));
    }
    if (ext === "3mf") {
      const { ThreeMFLoader } = await import('./loaders-TXHpcosE.js').then(n => n._);
      const loader = new ThreeMFLoader(manager);
      reportStage("parse", 0);
      return await loader.loadAsync(url, (e) => {
        if (e.total && e.total > 0) reportStage("parse", e.loaded / e.total * 100);
      });
    }
    if (ext === "stp" || ext === "step" || ext === "igs" || ext === "iges") {
      reportStage("fetch", 0);
      const buffer = typeof fileOrUrl === "string" ? await fetch(url).then((r) => r.arrayBuffer()) : await fileOrUrl.arrayBuffer();
      const normalizedLibPath = normalizeLibPath(libPath);
      const wasmUrl = `${normalizedLibPath}/occt-import-js/occt-import-js.wasm`;
      const { OCCTLoader } = await import('./occtLoader-CiM09x_z.js');
      const loader = new OCCTLoader(wasmUrl);
      reportStage("parse", 0);
      return await loader.load(buffer, t, (p, msg) => reportStage("parse", p, msg));
    }
    return null;
  } finally {
    cleanup();
  }
}
function normalizeLoadedObject(object, settings, mode = "full") {
  const maxFastMeshes = 3200;
  let meshVisited = 0;
  object.traverse((child) => {
    if (child.isMesh) {
      if (mode === "fast" && meshVisited >= maxFastMeshes) return;
      const mesh = child;
      mesh.frustumCulled = settings.frustumCulling ?? true;
      meshVisited += 1;
      if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
      if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => {
        if (!material) return;
        if ("wireframe" in material) {
          material.wireframe = false;
        }
      });
    }
  });
}
const loadModelFiles = async (files, onProgress, t, settings, libPath = "./libs", runtimeHints = {}) => {
  const loadedObjects = [];
  const totalFiles = files.length;
  for (let i = 0; i < totalFiles; i++) {
    if (runtimeHints.isStale?.()) break;
    const fileOrUrl = files[i];
    const isUrl = typeof fileOrUrl === "string";
    let fileName = "";
    let ext = "";
    let url = "";
    if (isUrl) {
      url = fileOrUrl;
      const urlPath = url.split("?")[0].split("#")[0];
      fileName = urlPath.split("/").pop() || "model";
      ext = fileName.split(".").pop()?.toLowerCase() || "";
    } else {
      fileName = fileOrUrl.name;
      ext = fileName.split(".").pop()?.toLowerCase() || "";
      url = URL.createObjectURL(fileOrUrl);
    }
    const fileBaseProgress = i / totalFiles * 100;
    const fileWeight = 100 / totalFiles;
    const reportStage = createStageProgressReporter(onProgress, t, fileName, fileBaseProgress, fileWeight);
    try {
      reportStage("fetch", 5);
      const object = await loadObjectByExtension(fileOrUrl, url, ext, files, reportStage, t, settings, libPath, runtimeHints);
      if (!object) continue;
      object.name = fileName;
      reportStage("normalize", 30, `${t("processing")} ${fileName}`);
      const fastSanitize = runtimeHints.fastGeometrySanitize ?? true;
      normalizeLoadedObject(object, settings, fastSanitize ? "fast" : "full");
      if (fastSanitize) {
        setTimeout(() => {
          if (runtimeHints.isStale?.()) return;
          normalizeLoadedObject(object, settings, "full");
        }, 0);
      }
      reportStage("optimize", 100, `${t("analyzing")} ${fileName}`);
      reportStage("addToScene", 100, `${t("success")} ${fileName}`);
      loadedObjects.push(object);
    } catch (error) {
      console.error(`加载 ${fileName} 失败`, error);
    } finally {
      if (!isUrl) URL.revokeObjectURL(url);
    }
  }
  onProgress(100, t("analyzing"));
  return loadedObjects;
};

function cleanLoadingStatus(message) {
  if (!message) return "";
  return message.replace(/:\s*\d+%/g, "").replace(/\(\d+%\)/g, "").replace(/\d+%/g, "").trim();
}
function createFileSetId(items) {
  const names = items.map((item) => typeof item === "string" ? item : item.name).sort();
  return names.join("|");
}
async function loadSceneItems({
  items,
  manager,
  sceneSettings,
  libPath,
  t,
  onProgress,
  runtimeHints = {},
  isStale
}) {
  if (!items.length) return;
  const nbimItems = [];
  const otherItems = [];
  for (const item of items) {
    const path = typeof item === "string" ? item.split("?")[0].split("#")[0] : item.name;
    if (path.toLowerCase().endsWith(".nbim")) {
      nbimItems.push(item);
    } else {
      otherItems.push(item);
    }
  }
  for (const item of nbimItems) {
    if (isStale?.()) return;
    if (typeof item === "string") {
      const response = await fetch(item);
      if (!response.ok) throw new Error(`HTTP ${response.status} when fetching NBIM`);
      const blob = await response.blob();
      const fileName = item.split("?")[0].split("#")[0].split("/").pop() || "model.nbim";
      const file = new File([blob], fileName);
      await manager.loadNbim(file, (p, msg) => {
        onProgress(p, msg);
      });
    } else {
      await manager.loadNbim(item, (p, msg) => {
        onProgress(p, msg);
      });
    }
  }
  if (otherItems.length === 0) return;
  const loadedObjects = await loadModelFiles(
    otherItems,
    onProgress,
    t,
    sceneSettings,
    libPath,
    {
      ...runtimeHints,
      isStale
    }
  );
  const totalObjects = Math.max(loadedObjects.length, 1);
  for (let index = 0; index < loadedObjects.length; index++) {
    if (isStale?.()) return;
    const obj = loadedObjects[index];
    const objectBase = 92 + Math.round(index / totalObjects * 8);
    await manager.addModel(obj, (p, msg) => {
      const stagedProgress = Math.min(100, objectBase + Math.round(p / 100 * (8 / totalObjects)));
      onProgress(stagedProgress, msg);
    });
  }
}

function useFileLoadingFlow({
  managerRef,
  sceneSettings,
  libPath,
  t,
  setCurrentFileSetId,
  setLoading,
  setStatus,
  setProgress,
  setToast,
  updateTree
}) {
  const loadItemsIntoScene = useCallback(async (items) => {
    if (!items.length || !managerRef.current) return;
    const generation = managerRef.current.beginLoadGeneration?.() ?? 0;
    const runtimeHints = managerRef.current.getChunkOptions?.() || {};
    await loadSceneItems({
      items,
      manager: managerRef.current,
      sceneSettings,
      libPath,
      t,
      onProgress: (p, msg) => {
        setProgress(p);
        if (msg) setStatus(cleanLoadingStatus(msg));
      },
      runtimeHints,
      isStale: () => !managerRef.current?.isLoadGenerationCurrent?.(generation)
    });
  }, [libPath, managerRef, sceneSettings, setProgress, setStatus, t]);
  const processFiles = useCallback(async (items) => {
    if (!items.length || !managerRef.current) return;
    const setId = createFileSetId(items);
    setCurrentFileSetId(setId);
    managerRef.current.setChunkLoadingEnabled?.(true);
    managerRef.current.setContentVisible?.(true);
    setLoading(true);
    setStatus(t("loading"));
    setProgress(0);
    try {
      await loadItemsIntoScene(items);
      updateTree();
      const hasNbim = items.some((item) => {
        const path = typeof item === "string" ? item : item.name;
        return path.toLowerCase().endsWith(".nbim");
      });
      if (hasNbim) {
        const stats = managerRef.current.getStats?.();
        if (stats && stats.meshes <= 0) {
          throw new Error("NBIM 加载完成但没有可渲染外形，请检查文件格式或分块数据");
        }
      } else {
        managerRef.current?.fitView(false);
      }
      setStatus(t("success"));
    } catch (err) {
      setStatus(t("failed"));
      setToast({ message: `${t("failed")}: ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [loadItemsIntoScene, managerRef, setCurrentFileSetId, setLoading, setProgress, setStatus, setToast, t, updateTree]);
  return {
    processFiles,
    loadItemsIntoScene
  };
}

function useSceneStats({ mgrInstance, showStats, setStats }) {
  useEffect(() => {
    if (!mgrInstance || !showStats) return;
    const updateStats = () => {
      if (document.visibilityState !== "visible") return;
      setStats(mgrInstance.getStats());
    };
    updateStats();
    const statsInterval = window.setInterval(updateStats, 1e3);
    document.addEventListener("visibilitychange", updateStats);
    return () => {
      window.clearInterval(statsInterval);
      document.removeEventListener("visibilitychange", updateStats);
    };
  }, [mgrInstance, setStats, showStats]);
}

function toggleUuidSelection(current, uuid) {
  return current.includes(uuid) ? current.filter((id) => id !== uuid) : [...current, uuid];
}
function getLastSelectedUuid(current) {
  return current.length > 0 ? current[current.length - 1] : null;
}

function useSceneSelection() {
  const [selectedUuids, setSelectedUuids] = useState([]);
  const selectedUuid = useMemo(
    () => getLastSelectedUuid(selectedUuids),
    [selectedUuids]
  );
  const clearSelection = useCallback(() => {
    setSelectedUuids([]);
  }, []);
  const setSingleSelection = useCallback((uuid) => {
    setSelectedUuids([uuid]);
  }, []);
  const toggleSelection = useCallback((uuid) => {
    setSelectedUuids((prev) => toggleUuidSelection(prev, uuid));
  }, []);
  return {
    selectedUuids,
    selectedUuid,
    setSelectedUuids,
    clearSelection,
    setSingleSelection,
    toggleSelection
  };
}

function buildSelectedPropertyGroups({
  basicLabel,
  geoLabel,
  basicProps,
  geoProps,
  ifcProps,
  nbimProps,
  nbimLabel = "BIM 属性"
}) {
  const groups = [
    {
      name: basicLabel,
      items: createPropertyEntries(basicLabel, basicProps, "basic")
    },
    {
      name: geoLabel,
      items: createPropertyEntries(geoLabel, geoProps, "geometry")
    }
  ];
  if (ifcProps) {
    groups.push(...buildPropertyGroupsFromRecord(ifcProps, "ifc"));
  }
  return groups;
}

function resolveSelectionTarget(sceneManager, selectionObject, focusUuid) {
  let realObject = focusUuid === (selectionObject?.uuid || selectionObject?.id) && selectionObject instanceof THREE.Object3D ? selectionObject : sceneManager.contentGroup.getObjectByProperty("uuid", focusUuid);
  if (!realObject) {
    const nodes = sceneManager.getStructureNodes(focusUuid);
    if (nodes && nodes.length > 0) {
      realObject = nodes[0];
    }
  }
  return realObject || selectionObject;
}
function resolveTargetElevation(target) {
  if (typeof target?.userData?.ifcMetadata?.elevation === "number") {
    return target.userData.ifcMetadata.elevation;
  }
  if (!(target instanceof THREE.Object3D)) return void 0;
  let cursor = target;
  while (cursor) {
    const elevation = cursor.userData?.ifcMetadata?.elevation;
    if (typeof elevation === "number" && Number.isFinite(elevation)) {
      return elevation;
    }
    cursor = cursor.parent;
  }
  return void 0;
}
async function fetchIfcGroups(target, cache) {
  const resolveIfcContext = (candidate) => {
    let cursor = candidate instanceof THREE.Object3D ? candidate : null;
    let expressID = candidate?.userData?.expressID;
    while (cursor) {
      if (cursor.userData?.expressID !== void 0 && expressID === void 0) {
        expressID = cursor.userData.expressID;
      }
      if (cursor.userData?.ifcManager && cursor.userData?.modelID !== void 0) {
        return {
          ifcRoot: cursor,
          expressID
        };
      }
      cursor = cursor.parent;
    }
    return null;
  };
  const ifcContext = resolveIfcContext(target);
  if (!ifcContext?.ifcRoot || ifcContext.expressID === void 0) return null;
  try {
    const cacheKey = `${ifcContext.ifcRoot.userData.modelID}:${ifcContext.expressID}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    const ifcManager = ifcContext.ifcRoot.userData.ifcManager;
    const ifcProps = await ifcManager.getItemProperties(ifcContext.ifcRoot.userData.modelID, ifcContext.expressID);
    const groups = ifcProps?.rawGroups || ifcProps?.groups || ifcProps?.normalizedGroups || null;
    if (groups) {
      cache.set(cacheKey, groups);
    }
    return groups;
  } catch (error) {
    console.error("IFC Props Error", error);
    return null;
  }
}
function buildSelectionPropertyGroups({
  sceneManager,
  focusUuid,
  target,
  t,
  ifcGroups,
  clashSummary,
  isDev = false
}) {
  const basicProps = {};
  const geoProps = {};
  const targetElevation = resolveTargetElevation(target);
  const resolvedName = [target?.name, target?.userData?.name].find((value) => typeof value === "string" && value.trim().length > 0);
  const wrappedId = sceneManager.getBimIdByUuid(focusUuid) || focusUuid;
  if (resolvedName) {
    basicProps[t("prop_name")] = resolvedName;
  }
  basicProps[t("prop_id")] = wrappedId;
  basicProps[t("prop_type")] = target.type || (target.children ? "Group" : "Mesh");
  if (typeof targetElevation === "number" && Number.isFinite(targetElevation)) {
    basicProps[t("prop_storey_elevation")] = String(targetElevation);
  }
  if (target.getWorldPosition) {
    const worldPosition = new THREE.Vector3();
    target.getWorldPosition(worldPosition);
    geoProps[t("prop_pos")] = `${worldPosition.x.toFixed(2)}, ${worldPosition.y.toFixed(2)}, ${worldPosition.z.toFixed(2)}`;
  }
  if (target.isMesh || target.type === "Mesh") {
    if (target instanceof THREE.Mesh) {
      const box = new THREE.Box3().setFromObject(target);
      const size = new THREE.Vector3();
      box.getSize(size);
      geoProps[t("prop_dim")] = `${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`;
      if (target.geometry) {
        geoProps[t("prop_vert")] = (target.geometry.attributes.position?.count || 0).toLocaleString();
        geoProps[t("prop_tri")] = target.geometry.index ? (target.geometry.index.count / 3).toLocaleString() : ((target.geometry.attributes.position?.count || 0) / 3).toLocaleString();
      }
    } else if (target.userData?.boundingBox) {
      const size = new THREE.Vector3();
      target.userData.boundingBox.getSize(size);
      geoProps[t("prop_dim")] = `${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`;
    }
    if (target.isInstancedMesh) {
      geoProps[t("prop_inst")] = target.count.toLocaleString();
    }
    const geometryData = sceneManager.getObjectGeometryData(focusUuid);
    if (geometryData.area > 0) {
      geoProps[t("prop_area")] = geometryData.area.toFixed(3);
    }
    if (geometryData.volume > 0) {
      geoProps[t("prop_volume")] = geometryData.volume.toFixed(3);
    }
  } else if (target.userData?.boundingBox) {
    const size = new THREE.Vector3();
    target.userData.boundingBox.getSize(size);
    geoProps[t("prop_dim")] = `${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`;
  }
  const nbimProps = sceneManager.getNbimProperties(focusUuid);
  const nbimIfcGroups = sceneManager.getNbimIfcPropertyGroups(focusUuid, "raw");
  if (isDev && nbimProps && Object.keys(nbimProps).length > 0) {
    console.group(`NBIM 选中属性: ${focusUuid}`);
    console.log(nbimProps);
    console.log(JSON.stringify(nbimProps, null, 2));
    console.groupEnd();
  }
  if (isDev && nbimIfcGroups) {
    console.group(`NBIM IFC 组属性: ${focusUuid}`);
    console.log(nbimIfcGroups);
    console.log(JSON.stringify(nbimIfcGroups, null, 2));
    console.groupEnd();
  }
  const groups = buildSelectedPropertyGroups({
    basicLabel: t("pg_basic"),
    geoLabel: t("pg_geo"),
    basicProps,
    geoProps,
    ifcProps: ifcGroups || nbimIfcGroups || null,
    nbimProps: null
  });
  if (clashSummary) {
    const clashLabel = t("pg_clash");
    groups.push({
      name: clashLabel,
      items: createPropertyEntries(clashLabel, [
        { key: t("clash_group_all"), value: String(clashSummary.total) },
        { key: t("clash_group_new"), value: String(clashSummary.newCount) },
        { key: t("clash_group_confirmed"), value: String(clashSummary.confirmedCount) },
        { key: t("clash_group_resolved"), value: String(clashSummary.resolvedCount) },
        { key: t("prop_status"), value: t(`clash_group_${clashSummary.worstStatus}`) }
      ].map((item, index) => ({ ...item, id: `clash-summary::${index}` })))
    });
  }
  return groups;
}

function useViewerSelection({
  sceneMgrRef,
  selectedUuids,
  setSelectedUuids,
  setSelectedProps,
  setHiddenUuids,
  setIsolatedUuids,
  updateTree,
  propOnSelect,
  ifcPropertyCacheRef,
  clashSummaryByUuid,
  focusObjectsInView,
  t,
  isDev = false
}) {
  const [locatedUuid, setLocatedUuid] = useState(null);
  const [locateResultUuids, setLocateResultUuids] = useState([]);
  const resetLocateState = useCallback(() => {
    setLocatedUuid(null);
    setLocateResultUuids([]);
  }, []);
  const handleSelect = useCallback(async (obj, _intersect, isMultiSelect = false) => {
    const sceneManager = sceneMgrRef.current;
    if (!sceneManager) return;
    if (!obj) {
      setSelectedUuids([]);
      setSelectedProps(null);
      sceneManager.highlightObjects([]);
      return;
    }
    const rawUuid = obj.uuid || obj.id;
    const uuid = sceneManager.resolveSelectionUuid(rawUuid);
    if (!uuid) return;
    const nextUuids = isMultiSelect ? selectedUuids.includes(uuid) ? selectedUuids.filter((id) => id !== uuid) : [...selectedUuids, uuid] : [uuid];
    setSelectedUuids(nextUuids);
    sceneManager.highlightObjects(nextUuids);
    const focusUuid = nextUuids[nextUuids.length - 1];
    if (!focusUuid) {
      setSelectedProps(null);
      return;
    }
    propOnSelect?.(focusUuid, obj);
    const target = resolveSelectionTarget(sceneManager, obj, focusUuid);
    const ifcGroups = await fetchIfcGroups(target, ifcPropertyCacheRef.current || /* @__PURE__ */ new Map());
    const selectedGroups = buildSelectionPropertyGroups({
      sceneManager,
      focusUuid,
      target,
      t,
      ifcGroups,
      clashSummary: clashSummaryByUuid[focusUuid],
      isDev
    });
    setSelectedProps(selectedGroups);
  }, [
    clashSummaryByUuid,
    ifcPropertyCacheRef,
    isDev,
    propOnSelect,
    sceneMgrRef,
    selectedUuids,
    setSelectedProps,
    setSelectedUuids,
    t
  ]);
  const handleLocateObject = useCallback((obj) => {
    const sceneManager = sceneMgrRef.current;
    if (!sceneManager || !obj) return false;
    const rawUuid = obj.uuid || obj.id;
    if (!rawUuid) return false;
    const uuid = sceneManager.resolveSelectionUuid(rawUuid);
    if (!uuid) return false;
    const bounds = sceneManager.getBoundsForObject(uuid);
    if (!bounds) return false;
    setLocatedUuid(uuid);
    return focusObjectsInView({ uuids: [uuid], focusUuid: uuid, updateSelection: false });
  }, [focusObjectsInView, sceneMgrRef]);
  const handleLocateResultsChange = useCallback((uuids) => {
    const changed = !(locateResultUuids.length === uuids.length && locateResultUuids.every((uuid, index) => uuid === uuids[index]));
    if (!changed) return;
    setLocateResultUuids(uuids);
    const sceneManager = sceneMgrRef.current;
    if (!sceneManager || uuids.length > 0) return;
    sceneManager.clearLocateFocus();
  }, [locateResultUuids, sceneMgrRef]);
  const handleClearLocate = useCallback(() => {
    resetLocateState();
    sceneMgrRef.current?.clearLocateFocus();
    sceneMgrRef.current?.highlightObjects(selectedUuids);
  }, [resetLocateState, sceneMgrRef, selectedUuids]);
  return {
    locatedUuid,
    locateResultUuids,
    resetLocateState,
    handleSelect,
    handleLocateObject,
    handleLocateResultsChange,
    handleClearLocate
  };
}

function useViewerActions({
  sceneMgrRef,
  t,
  setLoading,
  setProgress,
  setStatus,
  setToast,
  setActiveTool,
  setConfirmState,
  setSelectedUuids,
  setSelectedProps,
  setChunkProgress,
  resetLocateState,
  clearSearchResult,
  resetClashState,
  resetMeasurementState,
  resetExplodeState,
  updateTree,
  ifcPropertyCacheRef,
  completedFileSetsRef
}) {
  const getExportModelNames = useCallback(() => {
    const manager = sceneMgrRef.current;
    if (!manager) return [];
    const names = [];
    manager.contentGroup.children.forEach((child) => {
      if (child.userData?.isOptimizedGroup) return;
      if (child.name.startsWith("optimized_")) return;
      const rawName = (typeof child.userData?.modelName === "string" ? child.userData.modelName : "") || (child.children?.[0]?.name || "") || child.name;
      const baseName = sanitizeFileStem(stripFileExtension(rawName));
      names.push(baseName);
    });
    return Array.from(new Set(names));
  }, [sceneMgrRef]);
  const getDefaultExportFileName = useCallback((format) => {
    const modelNames = getExportModelNames();
    if (modelNames.length === 1) {
      return modelNames[0];
    }
    const now = /* @__PURE__ */ new Date();
    const pad = (value) => String(value).padStart(2, "0");
    const suffix = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    return `${t("export_batch_name")}_${suffix}`;
  }, [getExportModelNames, t]);
  const resolveExportFilename = useCallback((format, requestedName) => {
    const fallback = getDefaultExportFileName(format);
    const stem = sanitizeFileStem(stripFileExtension((requestedName || "").trim()) || fallback);
    return `${stem}.${format}`;
  }, [getDefaultExportFileName]);
  const handleExport = useCallback(async (format, requestedName) => {
    const manager = sceneMgrRef.current;
    if (!manager) return;
    const content = manager.contentGroup;
    const resolvedFileName = resolveExportFilename(format, requestedName);
    const resolvedStem = stripFileExtension(resolvedFileName);
    if (format === "nbim") {
      if (content.children.length === 0) {
        setToast({ message: t("no_models"), type: "info" });
        return;
      }
      setLoading(true);
      setStatus(`${t("processing")}...`);
      setActiveTool("none");
      window.setTimeout(async () => {
        try {
          await sceneMgrRef.current?.exportNbim(resolvedStem);
          setToast({ message: t("success"), type: "success" });
        } catch (error) {
          console.error(error);
          setToast({ message: `${t("failed")}: ${error.message}`, type: "error" });
        } finally {
          setLoading(false);
        }
      }, 100);
      return;
    }
    const modelsToExport = content.children.filter((child) => !child.userData.isOptimizedGroup);
    if (modelsToExport.length === 0) {
      setToast({ message: t("no_models"), type: "info" });
      return;
    }
    const exportGroup = new THREE.Group();
    modelsToExport.forEach((model) => exportGroup.add(model.clone()));
    setLoading(true);
    setProgress(0);
    setStatus(`${t("processing")}...`);
    setActiveTool("none");
    window.setTimeout(async () => {
      try {
        let blob = null;
        if (format === "glb") {
          blob = await exportGLB(exportGroup);
        } else if (format === "lmb") {
          blob = await exportLMB(exportGroup, (message) => setStatus(cleanLoadingStatus(message)));
        }
        if (blob) {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = resolvedFileName;
          anchor.click();
          URL.revokeObjectURL(url);
          setToast({ message: t("success"), type: "success" });
        }
      } catch (error) {
        console.error(error);
        setToast({ message: `${t("failed")}: ${error.message}`, type: "error" });
      } finally {
        setLoading(false);
        setProgress(0);
      }
    }, 100);
  }, [resolveExportFilename, sceneMgrRef, setActiveTool, setLoading, setProgress, setStatus, setToast, t]);
  const handleClear = useCallback(async () => {
    const manager = sceneMgrRef.current;
    if (!manager) return;
    setConfirmState({
      isOpen: true,
      title: t("op_clear"),
      message: t("confirm_clear"),
      action: async () => {
        setLoading(true);
        setProgress(0);
        setStatus(`${t("op_clear")}...`);
        try {
          await sceneMgrRef.current?.clear();
          setSelectedUuids([]);
          resetLocateState();
          setSelectedProps(null);
          clearSearchResult();
          resetClashState();
          ifcPropertyCacheRef.current.clear();
          resetMeasurementState();
          setChunkProgress({ loaded: 0, total: 0 });
          completedFileSetsRef.current.clear();
          resetExplodeState();
          updateTree();
          setStatus(t("ready"));
        } catch (error) {
          console.error("清空场景失败:", error);
        } finally {
          setLoading(false);
        }
      }
    });
  }, [
    clearSearchResult,
    completedFileSetsRef,
    ifcPropertyCacheRef,
    resetClashState,
    resetExplodeState,
    resetLocateState,
    resetMeasurementState,
    sceneMgrRef,
    setChunkProgress,
    setConfirmState,
    setLoading,
    setProgress,
    setSelectedProps,
    setSelectedUuids,
    setStatus,
    t,
    updateTree
  ]);
  const handleScreenshot = useCallback((mode = "scene") => {
    const manager = sceneMgrRef.current;
    if (!manager) return;
    try {
      const renderer = manager.renderer;
      const scene = manager.scene;
      const previousBackground = scene.background;
      if (mode === "transparent") {
        scene.background = null;
        renderer.setClearAlpha(0);
      } else {
        renderer.setClearAlpha(1);
      }
      renderer.render(scene, manager.camera);
      const dataUrl = manager.canvas.toDataURL("image/png");
      const anchor = document.createElement("a");
      anchor.href = dataUrl;
      anchor.download = mode === "transparent" ? "screenshot-transparent.png" : "screenshot.png";
      anchor.click();
      scene.background = previousBackground;
      renderer.setClearAlpha(1);
      renderer.render(scene, manager.camera);
      setToast({ message: t("success"), type: "success" });
    } catch (error) {
      console.error(error);
      setToast({ message: t("failed"), type: "error" });
    }
  }, [sceneMgrRef, setToast, t]);
  return {
    getDefaultExportFileName,
    handleExport,
    handleClear,
    handleScreenshot
  };
}

function useViewerCanvasInteractions({
  sceneMgrRef,
  canvasRef,
  activeTool,
  setActiveTool,
  measureType,
  setMeasureType,
  pickEnabled,
  selectedUuids,
  setSelectedUuids,
  setSelectedProps,
  setMousePos,
  setHighlightedMeasureId,
  handleSelect,
  handleContextMenu,
  handleUndoVisibility,
  clearSelectionState
}) {
  const pointerDownRef = useRef(null);
  const mouseMoveRafRef = useRef(null);
  const pendingMousePointRef = useRef(null);
  useEffect(() => {
    const manager = sceneMgrRef.current;
    const canvas = canvasRef.current;
    if (!manager || !canvas) return;
    const clickMoveThreshold = 6;
    const handleMouseDown = (event) => {
      pointerDownRef.current = {
        x: event.clientX,
        y: event.clientY,
        moved: false,
        button: event.button
      };
    };
    const handleClick = (event) => {
      const pointerState = pointerDownRef.current;
      if (!pointerState || pointerState.button !== 0 || pointerState.moved) {
        pointerDownRef.current = null;
        return;
      }
      pointerDownRef.current = null;
      if (activeTool === "boxSelect") return;
      if (activeTool === "measure") {
        if (measureType !== "none") {
          const intersect = manager.getRayIntersects(event.clientX, event.clientY);
          if (intersect) {
            const modelUuid = intersect.object.uuid;
            manager.addMeasurePoint(intersect.point, modelUuid);
            return;
          }
        }
        const measurementId = manager.pickMeasurement(event.clientX, event.clientY);
        if (measurementId) {
          setHighlightedMeasureId(measurementId);
          manager.highlightMeasurement(measurementId);
          return;
        }
        setHighlightedMeasureId(null);
        manager.highlightMeasurement(null);
        return;
      }
      if (pickEnabled) {
        const result = manager.pick(event.clientX, event.clientY);
        void handleSelect(result ? result.object : null, result ? result.intersect : null, event.ctrlKey);
      }
    };
    const handleMouseMove = (event) => {
      if (pointerDownRef.current && !pointerDownRef.current.moved) {
        const dx = event.clientX - pointerDownRef.current.x;
        const dy = event.clientY - pointerDownRef.current.y;
        if (dx * dx + dy * dy > clickMoveThreshold * clickMoveThreshold) {
          pointerDownRef.current.moved = true;
        }
      }
      if (activeTool === "measure") {
        manager.updateMeasureHover(event.clientX, event.clientY);
        setMousePos(null);
        return;
      }
      if (event.buttons !== 0) {
        pendingMousePointRef.current = null;
        if (mouseMoveRafRef.current !== null) {
          cancelAnimationFrame(mouseMoveRafRef.current);
          mouseMoveRafRef.current = null;
        }
        setMousePos(null);
        return;
      }
      pendingMousePointRef.current = { x: event.clientX, y: event.clientY };
      if (mouseMoveRafRef.current !== null) return;
      mouseMoveRafRef.current = requestAnimationFrame(() => {
        mouseMoveRafRef.current = null;
        const pending = pendingMousePointRef.current;
        if (!pending) return;
        const intersect = manager.getRayIntersects(pending.x, pending.y);
        setMousePos(intersect ? intersect.point : null);
      });
    };
    const handleKeyDown = (event) => {
      if ((event.key === "z" || event.key === "Z") && (event.ctrlKey || event.metaKey)) {
        handleUndoVisibility();
        return;
      }
      if (event.key === "Escape") {
        if (activeTool === "measure" && measureType !== "none") {
          setMeasureType("none");
          manager.startMeasurement("none");
        }
        if (activeTool === "boxSelect") {
          manager.cancelBoxSelect();
          setActiveTool("none");
        }
        clearSelectionState();
      }
    };
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      if (mouseMoveRafRef.current !== null) {
        cancelAnimationFrame(mouseMoveRafRef.current);
        mouseMoveRafRef.current = null;
      }
      pendingMousePointRef.current = null;
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    activeTool,
    canvasRef,
    clearSelectionState,
    handleContextMenu,
    handleSelect,
    handleUndoVisibility,
    measureType,
    pickEnabled,
    sceneMgrRef,
    setActiveTool,
    setHighlightedMeasureId,
    setMeasureType,
    setMousePos
  ]);
  useEffect(() => {
    const manager = sceneMgrRef.current;
    const canvas = canvasRef.current;
    if (!manager || !canvas || activeTool !== "boxSelect") return;
    manager.controls.mouseButtons.LEFT = void 0;
    const onPointerDown = (event) => {
      if (event.button !== 0) return;
      manager.startBoxSelect(event.clientX, event.clientY);
    };
    const onPointerMove = (event) => {
      manager.updateBoxSelect(event.clientX, event.clientY);
    };
    const onPointerUp = (event) => {
      if (event.button !== 0) return;
      const uuids = manager.endBoxSelect();
      if (uuids.length > 0) {
        const nextUuids = event.shiftKey ? [.../* @__PURE__ */ new Set([...selectedUuids, ...uuids])] : uuids;
        setSelectedUuids(nextUuids);
        setSelectedProps(null);
        manager.highlightObjects(nextUuids);
      }
    };
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      if (manager.controls) {
        manager.controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
      }
      manager.cancelBoxSelect();
    };
  }, [activeTool, canvasRef, sceneMgrRef, selectedUuids, setSelectedProps, setSelectedUuids]);
}

const SUPPORTED_DROP_EXTENSIONS = [
  ".lmb",
  ".glb",
  ".gltf",
  ".ifc",
  ".nbim",
  ".fbx",
  ".obj",
  ".stl",
  ".ply",
  ".3mf",
  ".stp",
  ".step",
  ".igs",
  ".iges"
];
function useViewerFileActions({
  sceneMgrRef,
  t,
  processFiles,
  loadItemsIntoScene,
  setLoading,
  setStatus,
  setProgress,
  setToast,
  setActiveTool,
  setSelectedUuids,
  setSelectedProps,
  resetMeasurementState,
  updateTree,
  isDev
}) {
  const handleOpenFiles = useCallback(async (event) => {
    if (!event.target.files?.length) return;
    await processFiles(Array.from(event.target.files));
    event.target.value = "";
  }, [processFiles]);
  const handleBatchConvert = useCallback(async (event) => {
    const manager = sceneMgrRef.current;
    if (!event.target.files?.length || !manager) return;
    const files = Array.from(event.target.files);
    event.target.value = "";
    const invalidFiles = files.filter((file) => file.name.toLowerCase().endsWith(".nbim"));
    if (invalidFiles.length > 0) {
      setToast({ message: t("unsupported_format"), type: "info" });
      return;
    }
    manager.setChunkLoadingEnabled?.(false);
    manager.setContentVisible?.(false);
    setLoading(true);
    setStatus(`${t("processing")}...`);
    setProgress(0);
    setActiveTool("none");
    try {
      await manager.clear();
      setSelectedUuids([]);
      setSelectedProps(null);
      resetMeasurementState();
      updateTree();
      await loadItemsIntoScene(files);
      updateTree();
      setStatus(`${t("processing")}...`);
      await manager.exportNbim();
      setStatus(t("success"));
      setToast({ message: t("success"), type: "success" });
    } catch (error) {
      console.error("[ThreeViewer] handleBatchConvert error:", error);
      setStatus(t("failed"));
      setToast({ message: `${t("failed")}: ${error.message}`, type: "error" });
    } finally {
      try {
        await sceneMgrRef.current?.clear();
        updateTree();
      } catch {
      }
      sceneMgrRef.current?.setChunkLoadingEnabled?.(true);
      sceneMgrRef.current?.setContentVisible?.(true);
      setLoading(false);
    }
  }, [
    loadItemsIntoScene,
    resetMeasurementState,
    sceneMgrRef,
    setActiveTool,
    setLoading,
    setProgress,
    setSelectedProps,
    setSelectedUuids,
    setStatus,
    setToast,
    t,
    updateTree
  ]);
  const handleOpenUrl = useCallback(async () => {
    const url = window.prompt(t("menu_open_url"), "http://");
    if (!url || !url.startsWith("http")) return;
    if (isDev) {
      console.log("[ThreeViewer] handleOpenUrl called with:", url);
    }
    setLoading(true);
    setStatus(`${t("processing")}...`);
    try {
      await processFiles([url]);
    } catch (error) {
      console.error("[ThreeViewer] handleOpenUrl error:", error);
      setStatus(t("failed"));
      setToast({ message: `${t("failed")}: ${error.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [isDev, processFiles, setLoading, setStatus, setToast, t]);
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);
  const handleDrop = useCallback(async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!event.dataTransfer.files?.length) return;
    const files = Array.from(event.dataTransfer.files);
    const validFiles = files.filter((file) => {
      const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      return SUPPORTED_DROP_EXTENSIONS.includes(extension);
    });
    if (validFiles.length < files.length) {
      setToast({ message: t("unsupported_format"), type: "info" });
    }
    if (validFiles.length > 0) {
      await processFiles(validFiles);
    }
  }, [processFiles, setToast, t]);
  return {
    handleOpenFiles,
    handleBatchConvert,
    handleOpenUrl,
    handleDragOver,
    handleDrop
  };
}

function useViewerLayout(options) {
  const {
    propShowOutline,
    propShowProperties,
    setShowOutline,
    setShowProps
  } = options;
  const [leftWidth, setLeftWidth] = useState(260);
  const [rightWidth, setRightWidth] = useState(300);
  const resizingLeft = useRef(false);
  const resizingRight = useRef(false);
  useEffect(() => {
    if (propShowOutline !== void 0) {
      setShowOutline(propShowOutline);
    }
  }, [propShowOutline, setShowOutline]);
  useEffect(() => {
    if (propShowProperties !== void 0) {
      setShowProps(propShowProperties);
    }
  }, [propShowProperties, setShowProps]);
  useEffect(() => {
    const handleMove = (event) => {
      if (resizingLeft.current) {
        setLeftWidth(Math.max(150, Math.min(500, event.clientX)));
      }
      if (resizingRight.current) {
        const nextWidth = window.innerWidth - event.clientX;
        setRightWidth(Math.max(200, Math.min(600, nextWidth)));
      }
    };
    const handleUp = () => {
      resizingLeft.current = false;
      resizingRight.current = false;
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);
  return {
    leftWidth,
    rightWidth,
    resizingLeft,
    resizingRight
  };
}

const DEFAULT_CLIP_VALUES = { x: [0, 100], y: [0, 100], z: [0, 100] };
const DEFAULT_CLIP_ACTIVE = { x: false, y: false, z: false };
function useViewerTools({ initialSettings, mgrInstance }) {
  const [activeTool, setActiveTool] = useState("none");
  const [explodeEnabled, setExplodeEnabled] = useState(false);
  const [explodeStrength, setExplodeStrength] = useState(32);
  const [explodeMode, setExplodeMode] = useState("radial");
  const [measureType, setMeasureType] = useState("none");
  const [measureHistory, setMeasureHistory] = useState([]);
  const [highlightedMeasureId, setHighlightedMeasureId] = useState(null);
  const [clipEnabled, setClipEnabled] = useState(false);
  const [clipValues, setClipValues] = useState(DEFAULT_CLIP_VALUES);
  const [clipActive, setClipActive] = useState(DEFAULT_CLIP_ACTIVE);
  const [clipHelperVisible, setClipHelperVisible] = usePersistentState(
    "3dbrowser_clipHelperVisible",
    initialSettings?.clip?.helperVisible ?? false,
    {
      serializer: (value) => String(value),
      parser: (raw) => raw === "true"
    }
  );
  const [clipHelperOpacity, setClipHelperOpacity] = usePersistentState(
    "3dbrowser_clipHelperOpacity",
    initialSettings?.clip?.helperOpacity ?? 0.12,
    {
      serializer: (value) => String(value),
      parser: (raw) => {
        const parsed = Number(raw);
        return Number.isFinite(parsed) ? parsed : 0.12;
      }
    }
  );
  const normalizedClipHelperOpacity = useMemo(
    () => Math.min(0.35, Math.max(0.05, clipHelperOpacity)),
    [clipHelperOpacity]
  );
  useEffect(() => {
    if (normalizedClipHelperOpacity !== clipHelperOpacity) {
      setClipHelperOpacity(normalizedClipHelperOpacity);
    }
  }, [clipHelperOpacity, normalizedClipHelperOpacity, setClipHelperOpacity]);
  useEffect(() => {
    if (!mgrInstance) return;
    mgrInstance.setClipHelperOptions({
      visible: clipHelperVisible,
      opacity: normalizedClipHelperOpacity
    });
  }, [clipHelperVisible, mgrInstance, normalizedClipHelperOpacity]);
  useEffect(() => {
    if (!mgrInstance) return;
    if (activeTool !== "measure") {
      mgrInstance.clearMeasurementPreview();
      mgrInstance.highlightMeasurement(null);
      setHighlightedMeasureId(null);
      setMeasureType("none");
    }
  }, [activeTool, mgrInstance]);
  useEffect(() => {
    if (!mgrInstance) return;
    mgrInstance.setClippingEnabled(clipEnabled);
    if (!clipEnabled) return;
    let bounds = mgrInstance.computeTotalBounds(true);
    if (bounds.isEmpty()) {
      bounds = mgrInstance.computeTotalBounds(false);
    }
    if (!bounds.isEmpty()) {
      mgrInstance.updateClippingPlanes(bounds, clipValues, clipActive);
    }
  }, [clipActive, clipEnabled, clipValues, mgrInstance]);
  useEffect(() => {
    if (!mgrInstance) return;
    mgrInstance.startMeasurement(measureType);
  }, [measureType, mgrInstance]);
  useEffect(() => {
    if (!mgrInstance) return;
    mgrInstance.setExplodeEnabled(explodeEnabled);
  }, [explodeEnabled, mgrInstance]);
  useEffect(() => {
    if (!mgrInstance) return;
    mgrInstance.setExplodeStrength(explodeStrength);
  }, [explodeStrength, mgrInstance]);
  useEffect(() => {
    if (!mgrInstance) return;
    mgrInstance.setExplodeMode(explodeMode);
  }, [explodeMode, mgrInstance]);
  const resetExplodeState = () => {
    setExplodeEnabled(false);
    setExplodeStrength(32);
    setExplodeMode("radial");
  };
  const resetMeasurementState = () => {
    setMeasureHistory([]);
    setHighlightedMeasureId(null);
    setMeasureType("none");
  };
  const handleMeasureUpdate = (records) => {
    setMeasureHistory(records.map((record) => ({ id: record.id, type: record.type, val: record.val })));
  };
  return {
    activeTool,
    setActiveTool,
    explodeEnabled,
    setExplodeEnabled,
    explodeStrength,
    setExplodeStrength,
    explodeMode,
    setExplodeMode,
    resetExplodeState,
    measureType,
    setMeasureType,
    measureHistory,
    setMeasureHistory,
    highlightedMeasureId,
    setHighlightedMeasureId,
    resetMeasurementState,
    handleMeasureUpdate,
    clipEnabled,
    setClipEnabled,
    clipValues,
    setClipValues,
    clipActive,
    setClipActive,
    clipHelperVisible,
    setClipHelperVisible,
    clipHelperOpacity: normalizedClipHelperOpacity,
    setClipHelperOpacity
  };
}

const VISIBILITY_BATCH_SIZE = 400;
function nextAnimationFrame() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}
function useViewerVisibility({
  sceneMgrRef,
  selectedUuids,
  setSelectedUuids,
  setSelectedProps,
  updateTree,
  resetLocateState
}) {
  const [contextMenu, setContextMenu] = useState({
    x: 0,
    y: 0,
    visible: false
  });
  const [hiddenUuids, setHiddenUuids] = useState(/* @__PURE__ */ new Set());
  const [isolatedUuids, setIsolatedUuids] = useState(/* @__PURE__ */ new Set());
  const visibilityStackRef = useRef([]);
  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  }, []);
  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      visible: true
    });
  }, []);
  const handleHideSelected = useCallback(() => {
    const sceneManager = sceneMgrRef.current;
    if (!sceneManager || selectedUuids.length === 0) return;
    const stateToRestore = selectedUuids.map((uuid) => {
      const object = sceneManager.contentGroup.getObjectByProperty("uuid", uuid);
      return { uuid, visible: object ? object.visible : true };
    });
    visibilityStackRef.current.push(stateToRestore);
    const uuidsToHide = [...selectedUuids];
    setSelectedUuids([]);
    setSelectedProps(null);
    sceneManager.highlightObjects([]);
    closeContextMenu();
    void (async () => {
      for (let index = 0; index < uuidsToHide.length; index += VISIBILITY_BATCH_SIZE) {
        const chunk = uuidsToHide.slice(index, index + VISIBILITY_BATCH_SIZE);
        const isLastChunk = index + VISIBILITY_BATCH_SIZE >= uuidsToHide.length;
        sceneManager.setObjectsVisibility(chunk, false, { deferRefresh: !isLastChunk });
        if (index + VISIBILITY_BATCH_SIZE < uuidsToHide.length) {
          await nextAnimationFrame();
        }
      }
      const nextHiddenUuids = new Set(hiddenUuids);
      const nextIsolatedUuids = new Set(isolatedUuids);
      uuidsToHide.forEach((uuid) => {
        nextHiddenUuids.add(uuid);
        nextIsolatedUuids.delete(uuid);
      });
      setHiddenUuids(nextHiddenUuids);
      setIsolatedUuids(nextIsolatedUuids);
      updateTree();
    })();
  }, [
    closeContextMenu,
    hiddenUuids,
    isolatedUuids,
    sceneMgrRef,
    selectedUuids,
    setSelectedProps,
    setSelectedUuids,
    updateTree
  ]);
  const handleShowAll = useCallback(() => {
    const sceneManager = sceneMgrRef.current;
    if (!sceneManager) return;
    if (hiddenUuids.size > 0 || isolatedUuids.size > 0) {
      sceneManager.setAllVisibility(true);
      setHiddenUuids(/* @__PURE__ */ new Set());
      setIsolatedUuids(/* @__PURE__ */ new Set());
      updateTree();
    }
    resetLocateState();
    sceneManager.clearLocateFocus();
    closeContextMenu();
  }, [closeContextMenu, hiddenUuids, isolatedUuids, resetLocateState, sceneMgrRef, updateTree]);
  const handleToggleVisibility = useCallback((uuid, visible) => {
    const sceneManager = sceneMgrRef.current;
    if (!sceneManager) return;
    visibilityStackRef.current.push([{ uuid, visible: !visible }]);
    sceneManager.setObjectVisibility(uuid, visible);
    const nextHiddenUuids = new Set(hiddenUuids);
    if (visible) {
      nextHiddenUuids.delete(uuid);
    } else {
      nextHiddenUuids.add(uuid);
    }
    setHiddenUuids(nextHiddenUuids);
    updateTree();
  }, [hiddenUuids, sceneMgrRef, updateTree]);
  const handleHideObject = useCallback((uuid) => {
    const sceneManager = sceneMgrRef.current;
    if (!sceneManager) return;
    visibilityStackRef.current.push([{ uuid, visible: true }]);
    sceneManager.setObjectVisibility(uuid, false);
    setHiddenUuids((prev) => new Set(prev).add(uuid));
    setSelectedUuids((prev) => prev.filter((id) => id !== uuid));
    updateTree();
  }, [sceneMgrRef, setSelectedUuids, updateTree]);
  const handleIsolateObject = useCallback((uuid) => {
    const sceneManager = sceneMgrRef.current;
    if (!sceneManager) return;
    sceneManager.isolateObjects([uuid]);
    setHiddenUuids(/* @__PURE__ */ new Set());
    setIsolatedUuids(/* @__PURE__ */ new Set([uuid]));
    setSelectedUuids([uuid]);
    sceneManager.highlightObjects([uuid]);
    updateTree();
    closeContextMenu();
  }, [closeContextMenu, sceneMgrRef, setSelectedUuids, updateTree]);
  const handleIsolateSelection = useCallback(() => {
    const sceneManager = sceneMgrRef.current;
    if (!sceneManager || selectedUuids.length === 0) return;
    const nextIsolated = selectedUuids.filter((id) => !isolatedUuids.has(id));
    if (nextIsolated.length > 0) {
      sceneManager.isolateObjects(selectedUuids);
      setIsolatedUuids(/* @__PURE__ */ new Set([...isolatedUuids, ...nextIsolated]));
      setHiddenUuids(/* @__PURE__ */ new Set());
      updateTree();
    }
    closeContextMenu();
  }, [closeContextMenu, isolatedUuids, sceneMgrRef, selectedUuids, updateTree]);
  const handleUndoVisibility = useCallback(() => {
    const sceneManager = sceneMgrRef.current;
    if (!sceneManager || visibilityStackRef.current.length === 0) return;
    const lastAction = visibilityStackRef.current.pop();
    if (!lastAction) return;
    sceneManager.applyVisibilityBatch(lastAction, {
      recomputeBounds: true,
      refreshExplode: false,
      invalidateInteractables: true
    });
    const nextHiddenUuids = new Set(hiddenUuids);
    lastAction.forEach((change) => {
      if (change.visible) {
        nextHiddenUuids.delete(change.uuid);
      } else {
        nextHiddenUuids.add(change.uuid);
      }
    });
    setHiddenUuids(nextHiddenUuids);
    updateTree();
  }, [hiddenUuids, sceneMgrRef, updateTree]);
  return {
    contextMenu,
    hiddenUuids,
    isolatedUuids,
    setHiddenUuids,
    setIsolatedUuids,
    handleContextMenu,
    closeContextMenu,
    handleHideSelected,
    handleShowAll,
    handleToggleVisibility,
    handleHideObject,
    handleIsolateObject,
    handleIsolateSelection,
    handleUndoVisibility
  };
}

function useViewpoints({
  currentFileSetId,
  sceneMgrRef,
  setToast,
  setConfirmState,
  t,
  captureStateSnapshot,
  restoreStateSnapshot
}) {
  const [viewpoints, setViewpoints] = useState([]);
  useEffect(() => {
    if (!currentFileSetId) {
      setViewpoints([]);
      return;
    }
    try {
      const saved = localStorage.getItem(`viewpoints_${currentFileSetId}`);
      setViewpoints(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.error("Failed to load viewpoints", error);
      setViewpoints([]);
    }
  }, [currentFileSetId]);
  const persistViewpoints = useCallback((nextViewpoints) => {
    if (!currentFileSetId) return;
    setViewpoints(nextViewpoints);
    try {
      localStorage.setItem(`viewpoints_${currentFileSetId}`, JSON.stringify(nextViewpoints));
    } catch (error) {
      console.error("Failed to persist viewpoints", error);
    }
  }, [currentFileSetId]);
  const captureViewThumbnail = useCallback(() => {
    const manager = sceneMgrRef.current;
    if (!manager) return "";
    try {
      manager.renderer.render(manager.scene, manager.camera);
      const srcCanvas = manager.canvas;
      const scale = Math.min(640 / srcCanvas.width, 360 / srcCanvas.height);
      const dstWidth = Math.round(srcCanvas.width * scale);
      const dstHeight = Math.round(srcCanvas.height * scale);
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = dstWidth;
      tempCanvas.height = dstHeight;
      const context = tempCanvas.getContext("2d");
      if (!context) return "";
      context.drawImage(srcCanvas, 0, 0, dstWidth, dstHeight);
      return tempCanvas.toDataURL("image/jpeg", 0.92);
    } catch (error) {
      console.error("Failed to capture thumbnail", error);
      return "";
    }
  }, [sceneMgrRef]);
  const handleSaveViewpoint = useCallback((customName, saveOptions = {
    visibility: true,
    selection: true,
    clip: true,
    explode: true
  }, replaceId) => {
    const manager = sceneMgrRef.current;
    if (!manager || !currentFileSetId) {
      setToast({ message: t("no_models"), type: "info" });
      return;
    }
    if (manager.contentGroup.children.length === 0) {
      setToast({ message: t("no_models"), type: "info" });
      return;
    }
    const name = customName || `${t("viewpoint_title")} ${viewpoints.length + 1}`;
    const cameraState = manager.getCameraState();
    const image = captureViewThumbnail();
    const stateSnapshot = captureStateSnapshot(saveOptions);
    const nextViewpoints = replaceId ? viewpoints.map((viewpoint) => viewpoint.id === replaceId ? { ...viewpoint, name, cameraState, image, saveOptions, stateSnapshot } : viewpoint) : [...viewpoints, { id: Date.now().toString(), name, cameraState, image, saveOptions, stateSnapshot }];
    persistViewpoints(nextViewpoints);
    setToast({ message: t("success"), type: "success" });
  }, [captureStateSnapshot, captureViewThumbnail, currentFileSetId, persistViewpoints, sceneMgrRef, setToast, t, viewpoints]);
  const handleUpdateViewpointName = useCallback((id, newName) => {
    persistViewpoints(viewpoints.map((viewpoint) => viewpoint.id === id ? { ...viewpoint, name: newName } : viewpoint));
  }, [persistViewpoints, viewpoints]);
  const handleLoadViewpoint = useCallback(async (viewpoint) => {
    if (!viewpoint.cameraState) return;
    sceneMgrRef.current?.setCameraState(viewpoint.cameraState);
    await restoreStateSnapshot(viewpoint.stateSnapshot);
    setToast({ message: `${t("viewpoint_loading")}: ${viewpoint.name}`, type: "info" });
  }, [restoreStateSnapshot, sceneMgrRef, setToast, t]);
  const handleOverwriteViewpoint = useCallback((id) => {
    const viewpoint = viewpoints.find((item) => item.id === id);
    if (!viewpoint) return;
    handleSaveViewpoint(
      viewpoint.name,
      viewpoint.saveOptions || {
        visibility: true,
        selection: true,
        clip: true,
        explode: true
      },
      id
    );
  }, [handleSaveViewpoint, viewpoints]);
  const handleDeleteViewpoint = useCallback((id) => {
    const viewpoint = viewpoints.find((item) => item.id === id);
    setConfirmState({
      isOpen: true,
      title: t("viewpoint_title"),
      message: `${t("confirm_delete")} "${viewpoint?.name || t("viewpoint_default_name")}"?`,
      action: () => {
        persistViewpoints(viewpoints.filter((item) => item.id !== id));
      }
    });
  }, [persistViewpoints, setConfirmState, t, viewpoints]);
  return {
    viewpoints,
    handleSaveViewpoint,
    handleUpdateViewpointName,
    handleLoadViewpoint,
    handleOverwriteViewpoint,
    handleDeleteViewpoint
  };
}

const SUPPORTED_DRAG_EXTENSIONS = [".lmb", ".glb", ".gltf", ".ifc", ".nbim", ".fbx", ".obj", ".stl", ".ply", ".3ds", ".dae", ".stp", ".step", ".igs", ".iges"];
const IGNORED_GLOBAL_ERRORS = [
  "ResizeObserver loop completed",
  "ResizeObserver loop limit",
  "texImage3D: FLIP_Y or PREMULTIPLY_ALPHA"
];
function useViewportLifecycle({
  allowDragOpen,
  mgrInstance,
  viewportRef,
  t,
  processFiles,
  setToast,
  setErrorState
}) {
  useEffect(() => {
    if (!viewportRef.current || !mgrInstance) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width === 0 || height === 0) return;
      requestAnimationFrame(() => {
        mgrInstance.resize(width, height);
      });
    });
    observer.observe(viewportRef.current);
    const handleWindowResize = () => {
      if (!viewportRef.current) return;
      const rect = viewportRef.current.getBoundingClientRect();
      mgrInstance.resize(rect.width, rect.height);
    };
    window.addEventListener("resize", handleWindowResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [mgrInstance, viewportRef]);
  useEffect(() => {
    const handleDragOver = (event) => {
      if (!allowDragOpen) return;
      event.preventDefault();
      event.stopPropagation();
    };
    const handleDrop = async (event) => {
      if (!allowDragOpen) return;
      event.preventDefault();
      event.stopPropagation();
      const files = event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : [];
      if (files.length === 0) return;
      const unsupportedFiles = files.filter((file) => {
        const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
        return !SUPPORTED_DRAG_EXTENSIONS.includes(ext);
      });
      if (unsupportedFiles.length > 0) {
        setToast({
          message: `${t("failed")}: 不支持的格式 - ${unsupportedFiles.map((file) => file.name).join(", ")}`,
          type: "error"
        });
      }
      const supportedFiles = files.filter((file) => {
        const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
        return SUPPORTED_DRAG_EXTENSIONS.includes(ext);
      });
      if (supportedFiles.length > 0) {
        await processFiles(supportedFiles);
      }
    };
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [allowDragOpen, processFiles, setToast, t]);
  useEffect(() => {
    const handleError = (event) => {
      const message = event.message || "";
      if (!message && !event.error || IGNORED_GLOBAL_ERRORS.some((item) => message.includes(item))) {
        return;
      }
      console.error("Global Error:", event.error || message);
      setErrorState({
        isOpen: true,
        title: t("failed"),
        message: message || "An unexpected error occurred",
        detail: event.error?.stack || ""
      });
    };
    const handleRejection = (event) => {
      if (!event.reason) return;
      const message = event.reason?.message || String(event.reason);
      if (IGNORED_GLOBAL_ERRORS.some((item) => message.includes(item))) {
        return;
      }
      console.error("Unhandled Rejection:", event.reason);
      setErrorState({
        isOpen: true,
        title: t("failed"),
        message: message || "A promise was rejected without reason",
        detail: event.reason?.stack || ""
      });
    };
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, [setErrorState, t]);
}

function appendPropertyEntries(entries, groupName, value, source) {
  if (!value) return;
  entries.push(...createPropertyEntries(groupName, value, source));
}
function flattenNestedRecord(groupName, input, entries, source) {
  Object.entries(input).forEach(([key, value]) => {
    if (Array.isArray(value) || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      appendPropertyEntries(entries, groupName, [{ key, value, source }], source);
      return;
    }
    if (value && typeof value === "object") {
      Object.entries(value).forEach(([subKey, subValue]) => {
        appendPropertyEntries(entries, groupName, [{ key: `${key}.${subKey}`, value: subValue, rawKey: subKey, source }], source);
      });
    }
  });
}
function usePropertySearch({
  sceneMgrRef,
  selectedUuids,
  setSelectedUuids,
  onSelectObject,
  focusObjectsInView,
  t,
  setToast
}) {
  const [searchConditions, setSearchConditions] = useState([
    { id: "cond_init", propertyName: "", operator: "contains", value: "" }
  ]);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchStatus, setSearchStatus] = useState("");
  const searchRunTokenRef = useRef(0);
  const searchInFlightRef = useRef(false);
  const resolveModelId = useCallback((uuid, obj) => {
    let cursor = obj;
    while (cursor) {
      const owner = cursor.userData?.originalUuid || cursor.userData?.modelUuid || cursor.userData?.rootUuid;
      if (owner) return String(owner);
      cursor = cursor.parent;
    }
    const structureNode = sceneMgrRef.current?.getStructureNodes(uuid)?.[0];
    if (structureNode?.userData?.originalUuid) return String(structureNode.userData.originalUuid);
    return uuid;
  }, [sceneMgrRef]);
  const buildSearchPropertyEntries = useCallback((uuid, obj) => {
    const entries = [];
    appendPropertyEntries(entries, "Object", [
      { key: "name", value: obj?.name, source: "object" },
      { key: "type", value: obj?.type, source: "object" },
      { key: "uuid", value: uuid, source: "object" },
      { key: "bimid", value: sceneMgrRef.current?.getBimIdByUuid(uuid) || "", source: "object" }
    ]);
    const userData = obj?.userData || {};
    Object.entries(userData).forEach(([key, value]) => {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        appendPropertyEntries(entries, "UserData", [{ key, value, source: "userData" }], "userData");
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          appendPropertyEntries(entries, "UserData", [{ key, value: item, id: `userData::${key}::${index}`, source: "userData" }], "userData");
        });
      }
    });
    const ifcMeta = obj?.userData?.ifcMetadata || {};
    flattenNestedRecord("IFC Metadata", ifcMeta, entries, "ifcMetadata");
    const nbimProps = sceneMgrRef.current?.getNbimProperties(uuid);
    if (nbimProps && typeof nbimProps === "object") {
      flattenNestedRecord("NBIM", nbimProps, entries, "nbim");
    }
    const nbimIfcGroups = sceneMgrRef.current?.getNbimIfcPropertyGroups(uuid, "normalized");
    if (nbimIfcGroups && typeof nbimIfcGroups === "object") {
      Object.entries(nbimIfcGroups).forEach(([groupName, groupEntries]) => {
        appendPropertyEntries(entries, groupName, groupEntries, "nbim-ifc");
      });
    }
    return entries;
  }, [sceneMgrRef]);
  const collectSearchCandidates = useCallback(() => {
    const candidates = [];
    const visited = /* @__PURE__ */ new Set();
    const sceneMgr = sceneMgrRef.current;
    if (!sceneMgr) return candidates;
    sceneMgr.contentGroup.updateMatrixWorld(true);
    sceneMgr.contentGroup.traverse((obj) => {
      const mesh = obj;
      if (!mesh.isMesh || !mesh.visible || !mesh.geometry) return;
      if (mesh.userData?.isIfcGridHelper) return;
      if (visited.has(mesh.uuid)) return;
      visited.add(mesh.uuid);
      candidates.push({
        uuid: mesh.uuid,
        name: mesh.name || mesh.uuid,
        type: mesh.type || "Mesh",
        modelId: resolveModelId(mesh.uuid, mesh),
        sourceLabel: "object",
        source: mesh
      });
    });
    const walkNodes = (nodes) => {
      nodes.forEach((node) => {
        if (!node || node.visible === false) return;
        const id = String(node.id || "");
        if (id && node.bimId && !visited.has(id)) {
          visited.add(id);
          candidates.push({
            uuid: id,
            name: String(node.name || id),
            type: String(node.type || "Node"),
            modelId: String(node.userData?.originalUuid || node.id || id),
            sourceLabel: "structure",
            source: {
              name: node.name,
              type: node.type,
              userData: node.userData || {}
            }
          });
        }
        if (Array.isArray(node.children) && node.children.length > 0) {
          walkNodes(node.children);
        }
      });
    };
    if (Array.isArray(sceneMgr.structureRoot?.children) && sceneMgr.structureRoot.children.length > 0) {
      walkNodes(sceneMgr.structureRoot.children);
    }
    return candidates;
  }, [resolveModelId, sceneMgrRef]);
  const evaluateCondition = useCallback((value, operator, query) => {
    if (operator === "equals") return value === query;
    if (operator === "contains") return value.includes(query);
    if (operator === "notContains") return !value.includes(query);
    if (operator === "startsWith") return value.startsWith(query);
    if (operator === "endsWith") return value.endsWith(query);
    return false;
  }, []);
  const matchesPropertyName = useCallback((entry, query) => {
    if (!query) return false;
    return entry.normalizedKey === query || entry.normalizedPath === query || !!entry.rawKey && normalizePropertyToken(entry.rawKey) === query || entry.normalizedPath.endsWith(`.${query}`);
  }, []);
  const handleRunPropertySearch = useCallback(async () => {
    if (!sceneMgrRef.current) return;
    if (searchInFlightRef.current) return;
    const normalizedConditions = searchConditions.map((item) => ({
      ...item,
      normalizedPropertyName: normalizePropertyToken(item.propertyName),
      normalizedValue: normalizePropertyToken(item.value)
    })).filter((item) => item.normalizedPropertyName && item.normalizedValue);
    if (normalizedConditions.length === 0) {
      setSearchResults([]);
      setSearching(false);
      setSearchProgress(0);
      setSearchStatus("");
      setToast({ message: t("search_invalid_condition"), type: "info" });
      sceneMgrRef.current.highlightObjects(selectedUuids);
      return;
    }
    const runToken = ++searchRunTokenRef.current;
    const searchStartAt = performance.now();
    searchInFlightRef.current = true;
    setSearching(true);
    setSearchProgress(0);
    setSearchStatus(t("searching"));
    try {
      const candidates = collectSearchCandidates();
      const total = candidates.length;
      const batchSize = 600;
      const nextResults = [];
      let lastProgressAt = performance.now();
      let cancelled = false;
      for (let i = 0; i < candidates.length; i++) {
        if (searchRunTokenRef.current !== runToken) {
          cancelled = true;
          setSearchStatus(t("search_cancelled"));
          break;
        }
        const item = candidates[i];
        const entries = buildSearchPropertyEntries(item.uuid, item.source);
        let result = null;
        const matchedBy = /* @__PURE__ */ new Set();
        normalizedConditions.forEach((condition, index) => {
          const matchedEntries = entries.filter((entry) => matchesPropertyName(entry, condition.normalizedPropertyName));
          const matched = matchedEntries.some((entry) => evaluateCondition(entry.normalizedValue, condition.operator, condition.normalizedValue));
          if (matched) {
            matchedEntries.forEach((entry) => {
              if (evaluateCondition(entry.normalizedValue, condition.operator, condition.normalizedValue)) {
                matchedBy.add(entry.path);
              }
            });
          }
          if (index === 0 || result === null) result = matched;
          else if ((condition.connector || "AND") === "AND") result = Boolean(result) && matched;
          else result = Boolean(result) || matched;
        });
        if (result) {
          nextResults.push({
            uuid: item.uuid,
            name: item.name || item.uuid,
            type: item.type,
            modelId: item.modelId,
            source: item.sourceLabel,
            matchedBy: Array.from(matchedBy)
          });
        }
        if ((i + 1) % batchSize === 0 || i === candidates.length - 1) {
          const now = performance.now();
          const progress = total > 0 ? (i + 1) / total * 100 : 100;
          if (now - lastProgressAt > 120 || i === candidates.length - 1) {
            setSearchProgress(progress);
            lastProgressAt = now;
          }
          await new Promise((resolve) => window.setTimeout(resolve, 0));
        }
      }
      if (!cancelled) {
        setSearchResults(nextResults);
        setSearchProgress(100);
        setSearchStatus(`${t("search_results")}: ${nextResults.length}`);
      }
    } finally {
      const elapsed = performance.now() - searchStartAt;
      const minVisibleMs = 220;
      if (elapsed < minVisibleMs) {
        await new Promise((resolve) => window.setTimeout(resolve, minVisibleMs - elapsed));
      }
      setSearching(false);
      searchInFlightRef.current = false;
    }
  }, [buildSearchPropertyEntries, collectSearchCandidates, evaluateCondition, matchesPropertyName, sceneMgrRef, searchConditions, selectedUuids, setToast, t]);
  const handleApplySearchResultHighlight = useCallback((uuid) => {
    if (!sceneMgrRef.current) return;
    const target = sceneMgrRef.current.contentGroup.getObjectByProperty("uuid", uuid);
    focusObjectsInView({ uuids: [uuid], focusUuid: uuid });
    if (target) {
      void onSelectObject(target);
      return;
    }
    setSelectedUuids([uuid]);
  }, [focusObjectsInView, onSelectObject, sceneMgrRef, setSelectedUuids]);
  const handleClearSearchResult = useCallback(() => {
    searchRunTokenRef.current++;
    setSearchResults([]);
    setSearching(false);
    setSearchProgress(0);
    setSearchStatus("");
    searchInFlightRef.current = false;
    if (!sceneMgrRef.current) return;
    sceneMgrRef.current.highlightObjects(selectedUuids);
  }, [sceneMgrRef, selectedUuids]);
  const handleCancelSearch = useCallback(() => {
    if (!searchInFlightRef.current) return;
    searchRunTokenRef.current++;
    setSearchStatus(t("search_cancelling"));
  }, [t]);
  return {
    searchConditions,
    setSearchConditions,
    searchResults,
    searching,
    searchProgress,
    searchStatus,
    handleRunPropertySearch,
    handleApplySearchResultHighlight,
    handleClearSearchResult,
    handleCancelSearch
  };
}

// module scope helper variables

const a = {
	c: null, // center
	u: [ new Vector3(), new Vector3(), new Vector3() ], // basis vectors
	e: [] // half width
};

const b = {
	c: null, // center
	u: [ new Vector3(), new Vector3(), new Vector3() ], // basis vectors
	e: [] // half width
};

const R = [[], [], []];
const AbsR = [[], [], []];
const t = [];

const xAxis = new Vector3();
const yAxis = new Vector3();
const zAxis = new Vector3();
const v1 = new Vector3();
const size = new Vector3();
const closestPoint = new Vector3();
const rotationMatrix = new Matrix3();
const aabb = new Box3();
const matrix = new Matrix4();
const inverse = new Matrix4();
const localRay = new Ray();

/**
 * Represents an oriented bounding box (OBB) in 3D space.
 *
 * @three_import import { OBB } from 'three/addons/math/OBB.js';
 */
class OBB {

	/**
	 * Constructs a new OBB.
	 *
	 * @param {Vector3} [center] - The center of the OBB.
	 * @param {Vector3} [halfSize] - Positive halfwidth extents of the OBB along each axis.
	 * @param {Matrix3} [rotation] - The rotation of the OBB.
	 */
	constructor( center = new Vector3(), halfSize = new Vector3(), rotation = new Matrix3() ) {

		/**
		 * The center of the OBB.
		 *
		 * @type {Vector3}
		 */
		this.center = center;

		/**
		 * Positive halfwidth extents of the OBB along each axis.
		 *
		 * @type {Vector3}
		 */
		this.halfSize = halfSize;

		/**
		 * The rotation of the OBB.
		 *
		 * @type {Matrix3}
		 */
		this.rotation = rotation;

	}

	/**
	 * Sets the OBBs components to the given values.
	 *
	 * @param {Vector3} [center] - The center of the OBB.
	 * @param {Vector3} [halfSize] - Positive halfwidth extents of the OBB along each axis.
	 * @param {Matrix3} [rotation] - The rotation of the OBB.
	 * @return {OBB} A reference to this OBB.
	 */
	set( center, halfSize, rotation ) {

		this.center = center;
		this.halfSize = halfSize;
		this.rotation = rotation;

		return this;

	}

	/**
	 * Copies the values of the given OBB to this instance.
	 *
	 * @param {OBB} obb - The OBB to copy.
	 * @return {OBB} A reference to this OBB.
	 */
	copy( obb ) {

		this.center.copy( obb.center );
		this.halfSize.copy( obb.halfSize );
		this.rotation.copy( obb.rotation );

		return this;

	}

	/**
	 * Returns a new OBB with copied values from this instance.
	 *
	 * @return {OBB} A clone of this instance.
	 */
	clone() {

		return new this.constructor().copy( this );

	}

	/**
	 * Returns the size of this OBB.
	 *
	 * @param {Vector3} target - The target vector that is used to store the method's result.
	 * @return {Vector3} The size.
	 */
	getSize( target ) {

		return target.copy( this.halfSize ).multiplyScalar( 2 );

	}

	/**
	 * Clamps the given point within the bounds of this OBB.
	 *
	 * @param {Vector3} point - The point that should be clamped within the bounds of this OBB.
	 * @param {Vector3} target - The target vector that is used to store the method's result.
	 * @returns {Vector3} - The clamped point.
	 */
	clampPoint( point, target ) {

		// Reference: Closest Point on OBB to Point in Real-Time Collision Detection
		// by Christer Ericson (chapter 5.1.4)

		const halfSize = this.halfSize;

		v1.subVectors( point, this.center );
		this.rotation.extractBasis( xAxis, yAxis, zAxis );

		// start at the center position of the OBB

		target.copy( this.center );

		// project the target onto the OBB axes and walk towards that point

		const x = MathUtils.clamp( v1.dot( xAxis ), - halfSize.x, halfSize.x );
		target.add( xAxis.multiplyScalar( x ) );

		const y = MathUtils.clamp( v1.dot( yAxis ), - halfSize.y, halfSize.y );
		target.add( yAxis.multiplyScalar( y ) );

		const z = MathUtils.clamp( v1.dot( zAxis ), - halfSize.z, halfSize.z );
		target.add( zAxis.multiplyScalar( z ) );

		return target;

	}

	/**
	 * Returns `true` if the given point lies within this OBB.
	 *
	 * @param {Vector3} point - The point to test.
	 * @returns {boolean} - Whether the given point lies within this OBB or not.
	 */
	containsPoint( point ) {

		v1.subVectors( point, this.center );
		this.rotation.extractBasis( xAxis, yAxis, zAxis );

		// project v1 onto each axis and check if these points lie inside the OBB

		return Math.abs( v1.dot( xAxis ) ) <= this.halfSize.x &&
				Math.abs( v1.dot( yAxis ) ) <= this.halfSize.y &&
				Math.abs( v1.dot( zAxis ) ) <= this.halfSize.z;

	}

	/**
	 * Returns `true` if the given AABB intersects this OBB.
	 *
	 * @param {Box3} box3 - The AABB to test.
	 * @returns {boolean} - Whether the given AABB intersects this OBB or not.
	 */
	intersectsBox3( box3 ) {

		return this.intersectsOBB( obb.fromBox3( box3 ) );

	}

	/**
	 * Returns `true` if the given bounding sphere intersects this OBB.
	 *
	 * @param {Sphere} sphere - The bounding sphere to test.
	 * @returns {boolean} - Whether the given bounding sphere intersects this OBB or not.
	 */
	intersectsSphere( sphere ) {

		// find the point on the OBB closest to the sphere center

		this.clampPoint( sphere.center, closestPoint );

		// if that point is inside the sphere, the OBB and sphere intersect

		return closestPoint.distanceToSquared( sphere.center ) <= ( sphere.radius * sphere.radius );

	}

	/**
	 * Returns `true` if the given OBB intersects this OBB.
	 *
	 * @param {OBB} obb - The OBB to test.
	 * @param {number} [epsilon=Number.EPSILON] - A small value to prevent arithmetic errors.
	 * @returns {boolean} - Whether the given OBB intersects this OBB or not.
	 */
	intersectsOBB( obb, epsilon = Number.EPSILON ) {

		// Reference: OBB-OBB Intersection in Real-Time Collision Detection
		// by Christer Ericson (chapter 4.4.1)

		// prepare data structures (the code uses the same nomenclature like the reference)

		a.c = this.center;
		a.e[ 0 ] = this.halfSize.x;
		a.e[ 1 ] = this.halfSize.y;
		a.e[ 2 ] = this.halfSize.z;
		this.rotation.extractBasis( a.u[ 0 ], a.u[ 1 ], a.u[ 2 ] );

		b.c = obb.center;
		b.e[ 0 ] = obb.halfSize.x;
		b.e[ 1 ] = obb.halfSize.y;
		b.e[ 2 ] = obb.halfSize.z;
		obb.rotation.extractBasis( b.u[ 0 ], b.u[ 1 ], b.u[ 2 ] );

		// compute rotation matrix expressing b in a's coordinate frame

		for ( let i = 0; i < 3; i ++ ) {

			for ( let j = 0; j < 3; j ++ ) {

				R[ i ][ j ] = a.u[ i ].dot( b.u[ j ] );

			}

		}

		// compute translation vector

		v1.subVectors( b.c, a.c );

		// bring translation into a's coordinate frame

		t[ 0 ] = v1.dot( a.u[ 0 ] );
		t[ 1 ] = v1.dot( a.u[ 1 ] );
		t[ 2 ] = v1.dot( a.u[ 2 ] );

		// compute common subexpressions. Add in an epsilon term to
		// counteract arithmetic errors when two edges are parallel and
		// their cross product is (near) null

		for ( let i = 0; i < 3; i ++ ) {

			for ( let j = 0; j < 3; j ++ ) {

				AbsR[ i ][ j ] = Math.abs( R[ i ][ j ] ) + epsilon;

			}

		}

		let ra, rb;

		// test axes L = A0, L = A1, L = A2

		for ( let i = 0; i < 3; i ++ ) {

			ra = a.e[ i ];
			rb = b.e[ 0 ] * AbsR[ i ][ 0 ] + b.e[ 1 ] * AbsR[ i ][ 1 ] + b.e[ 2 ] * AbsR[ i ][ 2 ];
			if ( Math.abs( t[ i ] ) > ra + rb ) return false;


		}

		// test axes L = B0, L = B1, L = B2

		for ( let i = 0; i < 3; i ++ ) {

			ra = a.e[ 0 ] * AbsR[ 0 ][ i ] + a.e[ 1 ] * AbsR[ 1 ][ i ] + a.e[ 2 ] * AbsR[ 2 ][ i ];
			rb = b.e[ i ];
			if ( Math.abs( t[ 0 ] * R[ 0 ][ i ] + t[ 1 ] * R[ 1 ][ i ] + t[ 2 ] * R[ 2 ][ i ] ) > ra + rb ) return false;

		}

		// test axis L = A0 x B0

		ra = a.e[ 1 ] * AbsR[ 2 ][ 0 ] + a.e[ 2 ] * AbsR[ 1 ][ 0 ];
		rb = b.e[ 1 ] * AbsR[ 0 ][ 2 ] + b.e[ 2 ] * AbsR[ 0 ][ 1 ];
		if ( Math.abs( t[ 2 ] * R[ 1 ][ 0 ] - t[ 1 ] * R[ 2 ][ 0 ] ) > ra + rb ) return false;

		// test axis L = A0 x B1

		ra = a.e[ 1 ] * AbsR[ 2 ][ 1 ] + a.e[ 2 ] * AbsR[ 1 ][ 1 ];
		rb = b.e[ 0 ] * AbsR[ 0 ][ 2 ] + b.e[ 2 ] * AbsR[ 0 ][ 0 ];
		if ( Math.abs( t[ 2 ] * R[ 1 ][ 1 ] - t[ 1 ] * R[ 2 ][ 1 ] ) > ra + rb ) return false;

		// test axis L = A0 x B2

		ra = a.e[ 1 ] * AbsR[ 2 ][ 2 ] + a.e[ 2 ] * AbsR[ 1 ][ 2 ];
		rb = b.e[ 0 ] * AbsR[ 0 ][ 1 ] + b.e[ 1 ] * AbsR[ 0 ][ 0 ];
		if ( Math.abs( t[ 2 ] * R[ 1 ][ 2 ] - t[ 1 ] * R[ 2 ][ 2 ] ) > ra + rb ) return false;

		// test axis L = A1 x B0

		ra = a.e[ 0 ] * AbsR[ 2 ][ 0 ] + a.e[ 2 ] * AbsR[ 0 ][ 0 ];
		rb = b.e[ 1 ] * AbsR[ 1 ][ 2 ] + b.e[ 2 ] * AbsR[ 1 ][ 1 ];
		if ( Math.abs( t[ 0 ] * R[ 2 ][ 0 ] - t[ 2 ] * R[ 0 ][ 0 ] ) > ra + rb ) return false;

		// test axis L = A1 x B1

		ra = a.e[ 0 ] * AbsR[ 2 ][ 1 ] + a.e[ 2 ] * AbsR[ 0 ][ 1 ];
		rb = b.e[ 0 ] * AbsR[ 1 ][ 2 ] + b.e[ 2 ] * AbsR[ 1 ][ 0 ];
		if ( Math.abs( t[ 0 ] * R[ 2 ][ 1 ] - t[ 2 ] * R[ 0 ][ 1 ] ) > ra + rb ) return false;

		// test axis L = A1 x B2

		ra = a.e[ 0 ] * AbsR[ 2 ][ 2 ] + a.e[ 2 ] * AbsR[ 0 ][ 2 ];
		rb = b.e[ 0 ] * AbsR[ 1 ][ 1 ] + b.e[ 1 ] * AbsR[ 1 ][ 0 ];
		if ( Math.abs( t[ 0 ] * R[ 2 ][ 2 ] - t[ 2 ] * R[ 0 ][ 2 ] ) > ra + rb ) return false;

		// test axis L = A2 x B0

		ra = a.e[ 0 ] * AbsR[ 1 ][ 0 ] + a.e[ 1 ] * AbsR[ 0 ][ 0 ];
		rb = b.e[ 1 ] * AbsR[ 2 ][ 2 ] + b.e[ 2 ] * AbsR[ 2 ][ 1 ];
		if ( Math.abs( t[ 1 ] * R[ 0 ][ 0 ] - t[ 0 ] * R[ 1 ][ 0 ] ) > ra + rb ) return false;

		// test axis L = A2 x B1

		ra = a.e[ 0 ] * AbsR[ 1 ][ 1 ] + a.e[ 1 ] * AbsR[ 0 ][ 1 ];
		rb = b.e[ 0 ] * AbsR[ 2 ][ 2 ] + b.e[ 2 ] * AbsR[ 2 ][ 0 ];
		if ( Math.abs( t[ 1 ] * R[ 0 ][ 1 ] - t[ 0 ] * R[ 1 ][ 1 ] ) > ra + rb ) return false;

		// test axis L = A2 x B2

		ra = a.e[ 0 ] * AbsR[ 1 ][ 2 ] + a.e[ 1 ] * AbsR[ 0 ][ 2 ];
		rb = b.e[ 0 ] * AbsR[ 2 ][ 1 ] + b.e[ 1 ] * AbsR[ 2 ][ 0 ];
		if ( Math.abs( t[ 1 ] * R[ 0 ][ 2 ] - t[ 0 ] * R[ 1 ][ 2 ] ) > ra + rb ) return false;

		// since no separating axis is found, the OBBs must be intersecting

		return true;

	}

	/**
	 * Returns `true` if the given plane intersects this OBB.
	 *
	 * @param {Plane} plane - The plane to test.
	 * @returns {boolean} Whether the given plane intersects this OBB or not.
	 */
	intersectsPlane( plane ) {

		// Reference: Testing Box Against Plane in Real-Time Collision Detection
		// by Christer Ericson (chapter 5.2.3)

		this.rotation.extractBasis( xAxis, yAxis, zAxis );

		// compute the projection interval radius of this OBB onto L(t) = this->center + t * p.normal;

		const r = this.halfSize.x * Math.abs( plane.normal.dot( xAxis ) ) +
				this.halfSize.y * Math.abs( plane.normal.dot( yAxis ) ) +
				this.halfSize.z * Math.abs( plane.normal.dot( zAxis ) );

		// compute distance of the OBB's center from the plane

		const d = plane.normal.dot( this.center ) - plane.constant;

		// Intersection occurs when distance d falls within [-r,+r] interval

		return Math.abs( d ) <= r;

	}

	/**
	 * Performs a ray/OBB intersection test and stores the intersection point
	 * in the given 3D vector.
	 *
	 * @param {Ray} ray - The ray to test.
	 * @param {Vector3} target - The target vector that is used to store the method's result.
	 * @return {?Vector3} The intersection point. If no intersection is detected, `null` is returned.
	 */
	intersectRay( ray, target ) {

		// the idea is to perform the intersection test in the local space
		// of the OBB.

		this.getSize( size );
		aabb.setFromCenterAndSize( v1.set( 0, 0, 0 ), size );

		// create a 4x4 transformation matrix

		matrix.setFromMatrix3( this.rotation );
		matrix.setPosition( this.center );

		// transform ray to the local space of the OBB

		inverse.copy( matrix ).invert();
		localRay.copy( ray ).applyMatrix4( inverse );

		// perform ray <-> AABB intersection test

		if ( localRay.intersectBox( aabb, target ) ) {

			// transform the intersection point back to world space

			return target.applyMatrix4( matrix );

		} else {

			return null;

		}

	}

	/**
	 * Returns `true` if the given ray intersects this OBB.
	 *
	 * @param {Ray} ray - The ray to test.
	 * @returns {boolean} Whether the given ray intersects this OBB or not.
	 */
	intersectsRay( ray ) {

		return this.intersectRay( ray, v1 ) !== null;

	}

	/**
	 * Defines an OBB based on the given AABB.
	 *
	 * @param {Box3} box3 - The AABB to setup the OBB from.
	 * @return {OBB} A reference of this OBB.
	 */
	fromBox3( box3 ) {

		box3.getCenter( this.center );

		box3.getSize( this.halfSize ).multiplyScalar( 0.5 );

		this.rotation.identity();

		return this;

	}

	/**
	 * Returns `true` if the given OBB is equal to this OBB.
	 *
	 * @param {OBB} obb - The OBB to test.
	 * @returns {boolean} Whether the given OBB is equal to this OBB or not.
	 */
	equals( obb ) {

		return obb.center.equals( this.center ) &&
			obb.halfSize.equals( this.halfSize ) &&
			obb.rotation.equals( this.rotation );

	}

	/**
	 * Applies the given transformation matrix to this OBB. This method can be
	 * used to transform the bounding volume with the world matrix of a 3D object
	 * in order to keep both entities in sync.
	 *
	 * @param {Matrix4} matrix - The matrix to apply.
	 * @return {OBB} A reference of this OBB.
	 */
	applyMatrix4( matrix ) {

		const e = matrix.elements;

		let sx = v1.set( e[ 0 ], e[ 1 ], e[ 2 ] ).length();
		const sy = v1.set( e[ 4 ], e[ 5 ], e[ 6 ] ).length();
		const sz = v1.set( e[ 8 ], e[ 9 ], e[ 10 ] ).length();

		const det = matrix.determinant();
		if ( det < 0 ) sx = - sx;

		rotationMatrix.setFromMatrix4( matrix );

		const invSX = 1 / sx;
		const invSY = 1 / sy;
		const invSZ = 1 / sz;

		rotationMatrix.elements[ 0 ] *= invSX;
		rotationMatrix.elements[ 1 ] *= invSX;
		rotationMatrix.elements[ 2 ] *= invSX;

		rotationMatrix.elements[ 3 ] *= invSY;
		rotationMatrix.elements[ 4 ] *= invSY;
		rotationMatrix.elements[ 5 ] *= invSY;

		rotationMatrix.elements[ 6 ] *= invSZ;
		rotationMatrix.elements[ 7 ] *= invSZ;
		rotationMatrix.elements[ 8 ] *= invSZ;

		this.rotation.multiply( rotationMatrix );

		this.halfSize.x *= sx;
		this.halfSize.y *= sy;
		this.halfSize.z *= sz;

		v1.setFromMatrixPosition( matrix );
		this.center.add( v1 );

		return this;

	}

}

const obb = new OBB();

function buildBoxFromGeometry(geometry, matrixWorld) {
  if (!geometry.boundingBox) geometry.computeBoundingBox();
  return geometry.boundingBox ? geometry.boundingBox.clone().applyMatrix4(matrixWorld) : null;
}
function distanceBetweenBoxes(a, b) {
  const dx = Math.max(0, a.min.x - b.max.x, b.min.x - a.max.x);
  const dy = Math.max(0, a.min.y - b.max.y, b.min.y - a.max.y);
  const dz = Math.max(0, a.min.z - b.max.z, b.min.z - a.max.z);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
function buildObbFromGeometry(geometry, matrixWorld) {
  if (!geometry.boundingBox) geometry.computeBoundingBox();
  const bb = geometry.boundingBox;
  if (!bb) return null;
  const center = new THREE.Vector3();
  const halfSize = new THREE.Vector3();
  bb.getCenter(center);
  bb.getSize(halfSize).multiplyScalar(0.5);
  center.applyMatrix4(matrixWorld);
  const rotation = new THREE.Matrix3().setFromMatrix4(matrixWorld);
  return new OBB(center, halfSize, rotation);
}
function useClashCheck({
  sceneMgrRef,
  treeRoot,
  clashModelOptions,
  selectedUuids,
  setSelectedUuids,
  focusObjectsInView,
  t
}) {
  const [clashResults, setClashResults] = useState([]);
  const [clashRunning, setClashRunning] = useState(false);
  const [clashProgress, setClashProgress] = useState(0);
  const [clashStatus, setClashStatus] = useState("");
  const [clashScannedCount, setClashScannedCount] = useState(0);
  const [clashSetA, setClashSetA] = useState([]);
  const [clashSetB, setClashSetB] = useState([]);
  const [clashTolerance, setClashTolerance] = useState(0);
  const [clashMinOverlapVolume, setClashMinOverlapVolume] = useState(0);
  const [clashClearanceDistance, setClashClearanceDistance] = useState(0.05);
  const [clashUseNarrowPhase, setClashUseNarrowPhase] = useState(true);
  const [clashUseTrianglePhase, setClashUseTrianglePhase] = useState(false);
  const [clashIncludeSameModel, setClashIncludeSameModel] = useState(false);
  const [clashPairsScanned, setClashPairsScanned] = useState(0);
  const [clashResultFilter, setClashResultFilter] = useState("ALL");
  const [clashTypeFilter, setClashTypeFilter] = useState("ALL");
  const clashRunTokenRef = useRef(0);
  const clashInFlightRef = useRef(false);
  const clashCandidateCacheRef = useRef(/* @__PURE__ */ new Map());
  const clashModelNameById = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    clashModelOptions.forEach((option) => map.set(option.id, option.name));
    return map;
  }, [clashModelOptions]);
  const resolveModelOwner = useCallback((obj) => {
    let current = obj;
    while (current) {
      const owner = current.userData?.originalUuid;
      if (owner) return String(owner);
      current = current.parent;
    }
    return "";
  }, []);
  const buildMeshInfo = useCallback((uuid, geometry, matrixWorld) => {
    const pos = geometry.attributes.position;
    if (!pos) return null;
    const index = geometry.index;
    const triangleCount = index ? Math.floor(index.count / 3) : Math.floor(pos.count / 3);
    return {
      uuid,
      geometry,
      matrixWorld: matrixWorld.clone(),
      triangleCount
    };
  }, []);
  const collectClashCandidates = useCallback(() => {
    const sceneMgr = sceneMgrRef.current;
    if (!sceneMgr) return [];
    const cached = clashCandidateCacheRef.current;
    cached.clear();
    sceneMgr.contentGroup.updateMatrixWorld(true);
    sceneMgr.contentGroup.traverse((obj) => {
      const mesh = obj;
      if (!mesh.isMesh || !mesh.visible || !mesh.geometry) return;
      if (mesh.userData?.isIfcGridHelper) return;
      const box = buildBoxFromGeometry(mesh.geometry, mesh.matrixWorld);
      if (!box || box.isEmpty()) return;
      const modelId = resolveModelOwner(mesh);
      const candidate = {
        uuid: mesh.uuid,
        name: mesh.name || mesh.uuid,
        modelId,
        modelName: clashModelNameById.get(modelId) || modelId || mesh.name || mesh.uuid,
        box,
        testBox: box.clone(),
        obb: clashUseNarrowPhase ? buildObbFromGeometry(mesh.geometry, mesh.matrixWorld) : null,
        meshInfo: buildMeshInfo(mesh.uuid, mesh.geometry, mesh.matrixWorld)
      };
      cached.set(candidate.uuid, candidate);
    });
    sceneMgr.optimizedMapping.forEach((mappings, originalUuid) => {
      if (cached.has(originalUuid) || !mappings || mappings.length === 0) return;
      const nodes = sceneMgr.getStructureNodes(originalUuid) || [];
      if (nodes.length > 0 && nodes.every((node2) => node2.visible === false)) return;
      const box = new THREE.Box3();
      mappings.forEach((mapping) => {
        const geometry = mapping.geometry || mapping.mesh.geometry;
        if (!geometry) return;
        const matrix = new THREE.Matrix4();
        mapping.mesh.getMatrixAt(mapping.instanceId, matrix);
        matrix.premultiply(mapping.mesh.matrixWorld);
        const partBox = buildBoxFromGeometry(geometry, matrix);
        if (partBox && !partBox.isEmpty()) box.union(partBox);
      });
      if (box.isEmpty()) return;
      const node = nodes[0];
      const modelId = node?.userData?.originalUuid ? String(node.userData.originalUuid) : "";
      cached.set(originalUuid, {
        uuid: originalUuid,
        name: node?.name || originalUuid,
        modelId,
        modelName: clashModelNameById.get(modelId) || modelId || node?.name || originalUuid,
        box,
        testBox: box.clone(),
        obb: null,
        meshInfo: null
      });
    });
    return Array.from(cached.values());
  }, [buildMeshInfo, clashModelNameById, clashUseNarrowPhase, resolveModelOwner, sceneMgrRef]);
  const collectTriangleCentersInBox = useCallback((meshInfo, box, maxCenters, maxTrianglesToScan) => {
    const centers = [];
    const pos = meshInfo.geometry.attributes.position;
    if (!pos) return centers;
    const index = meshInfo.geometry.index;
    const triCount = index ? Math.floor(index.count / 3) : Math.floor(pos.count / 3);
    const scanCount = Math.min(triCount, maxTrianglesToScan);
    const stride = triCount > scanCount ? Math.max(1, Math.floor(triCount / scanCount)) : 1;
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const center = new THREE.Vector3();
    for (let ti = 0; ti < triCount; ti += stride) {
      const i0 = index ? index.getX(ti * 3) : ti * 3;
      const i1 = index ? index.getX(ti * 3 + 1) : ti * 3 + 1;
      const i2 = index ? index.getX(ti * 3 + 2) : ti * 3 + 2;
      a.fromBufferAttribute(pos, i0).applyMatrix4(meshInfo.matrixWorld);
      b.fromBufferAttribute(pos, i1).applyMatrix4(meshInfo.matrixWorld);
      c.fromBufferAttribute(pos, i2).applyMatrix4(meshInfo.matrixWorld);
      center.copy(a).add(b).add(c).multiplyScalar(1 / 3);
      if (!box.containsPoint(center)) continue;
      centers.push(center.clone());
      if (centers.length >= maxCenters) break;
    }
    return centers;
  }, []);
  const isPointInsideMeshByRaycast = useCallback((point, meshInfo) => {
    const pos = meshInfo.geometry.attributes.position;
    if (!pos) return false;
    const index = meshInfo.geometry.index;
    const triCount = index ? Math.floor(index.count / 3) : Math.floor(pos.count / 3);
    const maxTrianglesToScan = 12e3;
    const scanCount = Math.min(triCount, maxTrianglesToScan);
    const stride = triCount > scanCount ? Math.max(1, Math.floor(triCount / scanCount)) : 1;
    const origin = point.clone();
    origin.x -= 1e-4;
    const ray = new THREE.Ray(origin, new THREE.Vector3(1, 0, 0));
    const hit = new THREE.Vector3();
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    let intersections = 0;
    for (let ti = 0; ti < triCount; ti += stride) {
      const i0 = index ? index.getX(ti * 3) : ti * 3;
      const i1 = index ? index.getX(ti * 3 + 1) : ti * 3 + 1;
      const i2 = index ? index.getX(ti * 3 + 2) : ti * 3 + 2;
      a.fromBufferAttribute(pos, i0).applyMatrix4(meshInfo.matrixWorld);
      b.fromBufferAttribute(pos, i1).applyMatrix4(meshInfo.matrixWorld);
      c.fromBufferAttribute(pos, i2).applyMatrix4(meshInfo.matrixWorld);
      const intersection = ray.intersectTriangle(a, b, c, false, hit);
      if (!intersection || hit.x < origin.x) continue;
      intersections++;
    }
    return intersections % 2 === 1;
  }, []);
  const passesTrianglePhase = useCallback((a, b, overlap) => {
    if (!a.meshInfo || !b.meshInfo) return true;
    if (a.meshInfo.triangleCount <= 0 || b.meshInfo.triangleCount <= 0) return true;
    const triLimit = 3e4;
    if (a.meshInfo.triangleCount > triLimit || b.meshInfo.triangleCount > triLimit) return true;
    const centersA = collectTriangleCentersInBox(a.meshInfo, overlap, 4, 6e3);
    const centersB = collectTriangleCentersInBox(b.meshInfo, overlap, 4, 6e3);
    if (centersA.length === 0 || centersB.length === 0) return false;
    return centersA.some((center) => isPointInsideMeshByRaycast(center, b.meshInfo)) || centersB.some((center) => isPointInsideMeshByRaycast(center, a.meshInfo));
  }, [collectTriangleCentersInBox, isPointInsideMeshByRaycast]);
  const handleRunClashCheck = useCallback(async () => {
    if (!sceneMgrRef.current || clashInFlightRef.current) return;
    const runToken = ++clashRunTokenRef.current;
    const startedAt = performance.now();
    clashInFlightRef.current = true;
    setClashRunning(true);
    setClashProgress(0);
    setClashStatus(t("clash_collecting"));
    setClashResults([]);
    setClashPairsScanned(0);
    try {
      const rawCandidates = collectClashCandidates();
      setClashScannedCount(rawCandidates.length);
      if (rawCandidates.length < 2) {
        setClashStatus(t("clash_insufficient_candidates"));
        return;
      }
      const setAFilter = new Set(clashSetA);
      const setBFilter = new Set(clashSetB);
      const hasA = setAFilter.size > 0;
      const hasB = setBFilter.size > 0;
      const pairAllowed = (aModelId, bModelId) => {
        if (!clashIncludeSameModel && aModelId && bModelId && aModelId === bModelId) return false;
        if (hasA && hasB) {
          return setAFilter.has(aModelId) && setBFilter.has(bModelId) || setAFilter.has(bModelId) && setBFilter.has(aModelId);
        }
        if (hasA) return setAFilter.has(aModelId) || setAFilter.has(bModelId);
        if (hasB) return setBFilter.has(aModelId) || setBFilter.has(bModelId);
        return true;
      };
      const candidateEligible = (modelId) => {
        if (hasA && hasB) return setAFilter.has(modelId) || setBFilter.has(modelId);
        if (hasA) return setAFilter.has(modelId);
        if (hasB) return setBFilter.has(modelId);
        return true;
      };
      const effectiveClearance = Math.max(0, clashClearanceDistance);
      const bounded = rawCandidates.filter((candidate) => !candidate.box.isEmpty() && candidateEligible(candidate.modelId)).map((candidate) => {
        const testBox = candidate.box.clone();
        if (clashTolerance > 0 || effectiveClearance > 0) {
          testBox.expandByScalar(Math.max(clashTolerance, effectiveClearance));
        }
        return {
          ...candidate,
          testBox
        };
      });
      if (bounded.length < 2) {
        setClashStatus(t("clash_no_results"));
        setClashProgress(100);
        return;
      }
      bounded.sort((a, b) => a.testBox.min.x - b.testBox.min.x);
      setClashStatus(t("clash_running"));
      const maxResults = 2e3;
      const results = [];
      const overlapBox = new THREE.Box3();
      const overlapSize = new THREE.Vector3();
      const n = bounded.length;
      let pairChecks = 0;
      for (let i = 0; i < n; i++) {
        if (clashRunTokenRef.current !== runToken) {
          setClashStatus(t("clash_cancelled"));
          return;
        }
        const a = bounded[i];
        const aMaxX = a.testBox.max.x;
        for (let j = i + 1; j < n; j++) {
          const b = bounded[j];
          if (b.testBox.min.x > aMaxX) break;
          if (!pairAllowed(a.modelId, b.modelId)) continue;
          pairChecks++;
          if (!a.testBox.intersectsBox(b.testBox)) continue;
          if (clashUseNarrowPhase && a.obb && b.obb) {
            const obbA = a.obb.clone();
            const obbB = b.obb.clone();
            if (clashTolerance > 0) {
              obbA.halfSize.addScalar(clashTolerance);
              obbB.halfSize.addScalar(clashTolerance);
            }
            if (!obbA.intersectsOBB(obbB, Number.EPSILON * 10)) continue;
          }
          overlapBox.copy(a.box).intersect(b.box);
          const hasOverlap = !overlapBox.isEmpty();
          let overlapVolume = 0;
          if (hasOverlap) {
            overlapBox.getSize(overlapSize);
            overlapVolume = Math.max(0, overlapSize.x) * Math.max(0, overlapSize.y) * Math.max(0, overlapSize.z);
          }
          const distance = hasOverlap ? 0 : distanceBetweenBoxes(a.box, b.box);
          const isHardClash = hasOverlap && overlapVolume >= clashMinOverlapVolume;
          const isClearanceClash = !hasOverlap && effectiveClearance > 0 && distance <= effectiveClearance;
          if (!isHardClash && !isClearanceClash) continue;
          if (clashUseTrianglePhase && hasOverlap && !passesTrianglePhase(a, b, overlapBox)) continue;
          const pairKey = [a.uuid, b.uuid].sort().join("::");
          const clashType = isHardClash ? "hard" : "clearance";
          const severity = clashType === "hard" ? overlapVolume > Math.max(0.5, clashMinOverlapVolume * 10) ? "high" : "medium" : distance <= Math.max(1e-3, effectiveClearance * 0.25) ? "high" : "low";
          results.push({
            id: `clash_${clashType}_${pairKey}_${results.length}`,
            pairKey,
            groupKey: `${clashType}::${a.modelId || "unknown"}::${b.modelId || "unknown"}::${pairKey}`,
            ruleId: clashType === "hard" ? "hard-clash-default" : "clearance-default",
            aUuid: a.uuid,
            bUuid: b.uuid,
            aName: a.name,
            bName: b.name,
            overlapVolume,
            distance,
            severity,
            type: clashType,
            status: "new"
          });
          if (results.length >= maxResults) break;
        }
        if (results.length >= maxResults) break;
        if ((i + 1) % 50 === 0 || i === n - 1) {
          const progress = 30 + (i + 1) / n * 70;
          setClashProgress(progress);
          setClashPairsScanned(pairChecks);
          setClashStatus(`${t("clash_running")} ${i + 1}/${n}`);
          await new Promise((resolve) => window.setTimeout(resolve, 0));
        }
      }
      results.sort((x, y) => {
        if (x.type !== y.type) return x.type === "hard" ? -1 : 1;
        if (x.type === "hard") return y.overlapVolume - x.overlapVolume;
        return x.distance - y.distance;
      });
      setClashResults((prev) => {
        const statusByPair = /* @__PURE__ */ new Map();
        prev.forEach((item) => statusByPair.set(item.pairKey, item.status));
        return results.map((item) => ({
          ...item,
          status: statusByPair.get(item.pairKey) || "new"
        }));
      });
      setClashPairsScanned(pairChecks);
      setClashProgress(100);
      setClashStatus(`${t("clash_results")}: ${results.length}`);
      if (results.length === 0) {
        sceneMgrRef.current.clearLocateFocus();
      }
    } finally {
      const elapsed = performance.now() - startedAt;
      const minVisibleMs = 220;
      if (elapsed < minVisibleMs) {
        await new Promise((resolve) => window.setTimeout(resolve, minVisibleMs - elapsed));
      }
      clashInFlightRef.current = false;
      setClashRunning(false);
    }
  }, [clashClearanceDistance, clashIncludeSameModel, clashMinOverlapVolume, clashSetA, clashSetB, clashTolerance, clashUseNarrowPhase, clashUseTrianglePhase, collectClashCandidates, passesTrianglePhase, sceneMgrRef, t]);
  const handleCancelClashCheck = useCallback(() => {
    if (!clashInFlightRef.current) return;
    clashRunTokenRef.current++;
    setClashStatus(t("clash_cancelling"));
  }, [t]);
  const handleClearClashResults = useCallback(() => {
    clashRunTokenRef.current++;
    clashInFlightRef.current = false;
    setClashRunning(false);
    setClashProgress(0);
    setClashStatus("");
    setClashScannedCount(0);
    setClashPairsScanned(0);
    setClashResultFilter("ALL");
    setClashTypeFilter("ALL");
    setClashResults([]);
    sceneMgrRef.current?.clearLocateFocus();
    sceneMgrRef.current?.highlightObjects(selectedUuids);
  }, [sceneMgrRef, selectedUuids]);
  const handleFocusClashResult = useCallback((item) => {
    const uuids = [item.aUuid, item.bUuid];
    focusObjectsInView({
      uuids,
      focusUuid: item.aUuid,
      highlightColors: {
        [item.aUuid]: "#ff4d4f",
        [item.bUuid]: "#1890ff"
      }
    });
  }, [focusObjectsInView]);
  const handleUpdateClashResultStatus = useCallback((id, nextStatus) => {
    setClashResults((prev) => prev.map((item) => item.id === id ? { ...item, status: nextStatus } : item));
  }, []);
  const handleMarkFilteredClashStatus = useCallback((nextStatus) => {
    setClashResults((prev) => prev.map((item) => {
      const matchedStatus = clashResultFilter === "ALL" || clashResultFilter === "NEW" && item.status === "new" || clashResultFilter === "CONFIRMED" && item.status === "confirmed" || clashResultFilter === "RESOLVED" && item.status === "resolved";
      const matchedType = clashTypeFilter === "ALL" || clashTypeFilter === "HARD" && item.type === "hard" || clashTypeFilter === "CLEARANCE" && item.type === "clearance";
      const matched = matchedStatus && matchedType;
      return matched ? { ...item, status: nextStatus } : item;
    }));
  }, [clashResultFilter, clashTypeFilter]);
  const handleExportClashCsv = useCallback(() => {
    if (clashResults.length === 0) return;
    const escapeCsv = (value) => {
      const text = String(value ?? "");
      if (text.includes(",") || text.includes('"') || text.includes("\n")) {
        return `"${text.replace(/"/g, '""')}"`;
      }
      return text;
    };
    const header = ["pairKey", "type", "severity", "ruleId", "aUuid", "aName", "bUuid", "bName", "status", "overlapVolume", "distance"];
    const lines = [header.join(",")];
    clashResults.forEach((item) => {
      lines.push([
        escapeCsv(item.pairKey),
        escapeCsv(item.type),
        escapeCsv(item.severity),
        escapeCsv(item.ruleId),
        escapeCsv(item.aUuid),
        escapeCsv(item.aName),
        escapeCsv(item.bUuid),
        escapeCsv(item.bName),
        escapeCsv(item.status),
        escapeCsv(item.overlapVolume.toFixed(6)),
        escapeCsv(item.distance.toFixed(6))
      ].join(","));
    });
    const csv = "\uFEFF" + lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const now = /* @__PURE__ */ new Date();
    const pad = (value) => String(value).padStart(2, "0");
    const fileName = `clash_report_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.csv`;
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [clashResults]);
  const resetClashState = useCallback(() => {
    clashRunTokenRef.current++;
    clashInFlightRef.current = false;
    setClashResults([]);
    setClashRunning(false);
    setClashProgress(0);
    setClashStatus("");
    setClashScannedCount(0);
    setClashPairsScanned(0);
    setClashResultFilter("ALL");
    setClashTypeFilter("ALL");
  }, []);
  const applyClashModelOptionBounds = useCallback(() => {
    const validIds = new Set(clashModelOptions.map((item) => item.id));
    setClashSetA((prev) => prev.filter((id) => validIds.has(id)));
    setClashSetB((prev) => prev.filter((id) => validIds.has(id)));
  }, [clashModelOptions]);
  return {
    clashResults,
    setClashResults,
    clashRunning,
    clashProgress,
    clashStatus,
    clashScannedCount,
    clashSetA,
    clashSetB,
    clashTolerance,
    clashMinOverlapVolume,
    clashClearanceDistance,
    clashUseNarrowPhase,
    clashUseTrianglePhase,
    clashIncludeSameModel,
    clashPairsScanned,
    clashResultFilter,
    clashTypeFilter,
    setClashSetA,
    setClashSetB,
    setClashTolerance,
    setClashMinOverlapVolume,
    setClashClearanceDistance,
    setClashUseNarrowPhase,
    setClashUseTrianglePhase,
    setClashIncludeSameModel,
    setClashResultFilter,
    setClashTypeFilter,
    handleRunClashCheck,
    handleCancelClashCheck,
    handleClearClashResults,
    handleFocusClashResult,
    handleUpdateClashResultStatus,
    handleMarkFilteredClashStatus,
    handleExportClashCsv,
    resetClashState,
    applyClashModelOptionBounds
  };
}

function useClashSummary(sceneMgrRef, clashResults) {
  const annotatedUuidsRef = useRef(/* @__PURE__ */ new Set());
  const clashSummaryByUuid = useMemo(() => {
    const summary = /* @__PURE__ */ new Map();
    const merge = (uuid, status) => {
      if (!uuid) return;
      const current = summary.get(uuid) || {
        total: 0,
        newCount: 0,
        confirmedCount: 0,
        resolvedCount: 0,
        worstStatus: "resolved"
      };
      current.total += 1;
      if (status === "new") current.newCount += 1;
      else if (status === "confirmed") current.confirmedCount += 1;
      else current.resolvedCount += 1;
      if (current.newCount > 0) current.worstStatus = "new";
      else if (current.confirmedCount > 0) current.worstStatus = "confirmed";
      else current.worstStatus = "resolved";
      summary.set(uuid, current);
    };
    clashResults.forEach((item) => {
      merge(item.aUuid, item.status);
      merge(item.bUuid, item.status);
    });
    const out = {};
    summary.forEach((value, key) => {
      out[key] = value;
    });
    return out;
  }, [clashResults]);
  useEffect(() => {
    if (!sceneMgrRef.current) return;
    const mgr = sceneMgrRef.current;
    const previouslyAnnotated = annotatedUuidsRef.current;
    previouslyAnnotated.forEach((uuid) => {
      const obj = mgr.contentGroup.getObjectByProperty("uuid", uuid);
      if (obj?.userData?.clash) delete obj.userData.clash;
      const nodes = mgr.getStructureNodes(uuid) || [];
      nodes.forEach((node) => {
        if (node?.userData?.clash) delete node.userData.clash;
      });
    });
    const nextAnnotated = /* @__PURE__ */ new Set();
    Object.entries(clashSummaryByUuid).forEach(([uuid, stat]) => {
      nextAnnotated.add(uuid);
      const payload = {
        total: stat.total,
        new: stat.newCount,
        confirmed: stat.confirmedCount,
        resolved: stat.resolvedCount,
        status: stat.worstStatus
      };
      const obj = mgr.contentGroup.getObjectByProperty("uuid", uuid);
      if (obj) {
        if (!obj.userData) obj.userData = {};
        obj.userData.clash = payload;
      }
      const nodes = mgr.getStructureNodes(uuid) || [];
      nodes.forEach((node) => {
        if (!node.userData) node.userData = {};
        node.userData.clash = payload;
      });
    });
    annotatedUuidsRef.current = nextAnnotated;
  }, [clashSummaryByUuid, sceneMgrRef]);
  return clashSummaryByUuid;
}

function useFocusInView({
  sceneMgrRef,
  setSelectedUuids,
  setSelectedProps
}) {
  const focusObjectsInView = useCallback(({
    uuids,
    focusUuid,
    highlightColors,
    updateSelection = true
  }) => {
    const sceneManager = sceneMgrRef.current;
    if (!sceneManager) return false;
    const normalized = Array.from(new Set((uuids || []).map((uuid) => String(uuid || "").trim()).filter(Boolean)));
    if (normalized.length === 0) return false;
    const targetFocus = focusUuid && normalized.includes(focusUuid) ? focusUuid : normalized[0];
    sceneManager.setLocateFocusContext(normalized, targetFocus, highlightColors);
    sceneManager.fitViewToObjects(normalized);
    if (updateSelection) {
      setSelectedUuids(normalized);
      setSelectedProps?.(null);
    }
    return true;
  }, [sceneMgrRef, setSelectedProps, setSelectedUuids]);
  return {
    focusObjectsInView
  };
}

const IS_DEV = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
const ThreeViewer = ({
  allowDragOpen = true,
  hiddenMenus = [],
  libPath = "./libs",
  defaultLang,
  showStats: propShowStats,
  showOutline: propShowOutline,
  showProperties: propShowProperties,
  initialSettings,
  initialFiles,
  onSelect: propOnSelect,
  onLoad,
  hideDeleteModel = false,
  performancePreset = "quality",
  chunkOptions
}) => {
  const theme = themes.light;
  const effectiveChunkOptions = useMemo(() => ({
    chunkReadCacheSize: chunkOptions?.chunkReadCacheSize ?? 128,
    chunkPrefetchWindow: chunkOptions?.chunkPrefetchWindow ?? 0,
    targetMinFps: chunkOptions?.targetMinFps ?? 20,
    ghostMode: chunkOptions?.ghostMode,
    loadProfile: chunkOptions?.loadProfile ?? "max-speed",
    deferIfcProperties: chunkOptions?.deferIfcProperties ?? true,
    preferWorkerOctree: chunkOptions?.preferWorkerOctree ?? true,
    fastGeometrySanitize: chunkOptions?.fastGeometrySanitize ?? true
  }), [chunkOptions]);
  const [lang, setLang] = usePersistentState(
    "3dbrowser_lang",
    () => defaultLang || "zh",
    {
      serializer: (value) => value,
      parser: (raw) => raw === "zh" || raw === "en" ? raw : "zh"
    }
  );
  useEffect(() => {
    if (defaultLang && defaultLang !== lang) {
      setLang(defaultLang);
    }
  }, [defaultLang, lang, setLang]);
  const t = useCallback((key) => getTranslation(lang, key), [lang]);
  useEffect(() => {
    const preventDefault = (event) => {
      event.preventDefault();
    };
    const preventBrowserNavigation = (event) => {
      if (event.button === 3 || event.button === 4) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener("contextmenu", preventDefault, { capture: true });
    document.addEventListener("gesturestart", preventDefault, { capture: true });
    window.addEventListener("auxclick", preventDefault, { capture: true });
    window.addEventListener("mousedown", preventBrowserNavigation, { capture: true });
    return () => {
      document.removeEventListener("contextmenu", preventDefault, { capture: true });
      document.removeEventListener("gesturestart", preventDefault, { capture: true });
      window.removeEventListener("auxclick", preventDefault, { capture: true });
      window.removeEventListener("mousedown", preventBrowserNavigation, { capture: true });
    };
  }, []);
  const [treeRoot, setTreeRoot] = useState([]);
  const {
    selectedUuids,
    selectedUuid,
    setSelectedUuids,
    clearSelection
  } = useSceneSelection();
  const [selectedProps, setSelectedProps] = useState(null);
  const [status, setStatus] = useState(getTranslation(lang, "ready"));
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({
    meshes: 0,
    faces: 0,
    memory: 0,
    textureMemory: 0,
    drawCalls: 0,
    chunksLoaded: 0,
    chunksTotal: 0,
    chunksQueued: 0,
    pixelRatio: 1
  });
  const [chunkProgress, setChunkProgress] = useState({ loaded: 0, total: 0 });
  const [mgrInstance, setMgrInstance] = useState(null);
  const [mousePos, setMousePos] = useState(null);
  const [displayMode, setDisplayMode] = useState("solid");
  const [currentFileSetId, setCurrentFileSetId] = useState("");
  const {
    activeTool,
    setActiveTool,
    explodeEnabled,
    setExplodeEnabled,
    explodeStrength,
    setExplodeStrength,
    explodeMode,
    setExplodeMode,
    resetExplodeState,
    measureType,
    setMeasureType,
    measureHistory,
    setMeasureHistory,
    highlightedMeasureId,
    setHighlightedMeasureId,
    resetMeasurementState,
    handleMeasureUpdate,
    clipEnabled,
    setClipEnabled,
    clipValues,
    setClipValues,
    clipActive,
    setClipActive,
    clipHelperVisible,
    setClipHelperVisible,
    clipHelperOpacity,
    setClipHelperOpacity
  } = useViewerTools({
    initialSettings,
    mgrInstance
  });
  const [pickEnabled, setPickEnabled] = usePersistentState("3dbrowser_pickEnabled", false, {
    serializer: (value) => String(value),
    parser: (raw) => raw === "true"
  });
  const [showStats, setShowStats] = usePersistentState("3dbrowser_showStats", propShowStats ?? true, {
    serializer: (value) => String(value),
    parser: (raw) => raw === "true"
  });
  const [showOutline, setShowOutline] = usePersistentState("3dbrowser_showOutline", propShowOutline ?? true, {
    serializer: (value) => String(value),
    parser: (raw) => raw === "true"
  });
  const [showProps, setShowProps] = usePersistentState("3dbrowser_showProps", propShowProperties ?? true, {
    serializer: (value) => String(value),
    parser: (raw) => raw === "true"
  });
  const [sceneSettings, setSceneSettings] = usePersistentState("3dbrowser_sceneSettings", () => {
    const baseSettings = {
      ambientInt: 2,
      dirInt: 1,
      bgColor: theme.canvasBg,
      viewCubeSize: 120,
      colorSpace: "srgb",
      toneMapping: "aces",
      exposure: 1,
      shadowQuality: "medium",
      adaptiveQuality: true,
      minPixelRatio: 0.8,
      maxPixelRatio: 2,
      targetFps: 50,
      performanceMode: "balanced",
      backLightInt: 0.5,
      highlightColor: "#ff9f1c",
      highlightShowBox: false,
      clip: {
        helperVisible: initialSettings?.clip?.helperVisible ?? false,
        helperOpacity: initialSettings?.clip?.helperOpacity ?? 0.12
      }
    };
    const merged = initialSettings ? { ...baseSettings, ...initialSettings } : baseSettings;
    return merged.bgColor === void 0 ? { ...merged, bgColor: theme.canvasBg } : merged;
  });
  useEffect(() => {
    if (propShowStats !== void 0) setShowStats(propShowStats);
  }, [propShowStats, setShowStats]);
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: "", message: "", action: () => {
  } });
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const canvasRef = useRef(null);
  const viewportRef = useRef(null);
  const sceneMgr = useRef(null);
  const ifcPropertyCacheRef = useRef(/* @__PURE__ */ new Map());
  const { focusObjectsInView } = useFocusInView({
    sceneMgrRef: sceneMgr,
    setSelectedUuids,
    setSelectedProps
  });
  const {
    leftWidth,
    rightWidth,
    resizingLeft,
    resizingRight
  } = useViewerLayout({
    propShowOutline,
    propShowProperties,
    setShowOutline,
    setShowProps
  });
  useEffect(() => {
    const manager = sceneMgr.current;
    if (!manager) return;
    manager.setChunkOptions(effectiveChunkOptions);
    manager.updateSettings({
      ...sceneSettings,
      performanceMode: performancePreset,
      targetFps: effectiveChunkOptions.targetMinFps ?? sceneSettings.targetFps
    });
  }, [effectiveChunkOptions, performancePreset, sceneSettings]);
  const hasModels = treeRoot.length > 0;
  const clashModelOptions = useMemo(() => {
    const options = [];
    const seen = /* @__PURE__ */ new Set();
    (treeRoot || []).forEach((node) => {
      const id = String(node?.object?.userData?.originalUuid || node?.uuid || "");
      if (!id || seen.has(id)) return;
      seen.add(id);
      options.push({ id, name: String(node?.name || id) });
    });
    return options;
  }, [treeRoot]);
  const {
    clashResults,
    clashRunning,
    clashProgress,
    clashStatus,
    clashScannedCount,
    clashSetA,
    clashSetB,
    clashTolerance,
    clashMinOverlapVolume,
    clashClearanceDistance,
    clashUseNarrowPhase,
    clashUseTrianglePhase,
    clashIncludeSameModel,
    clashPairsScanned,
    clashResultFilter,
    clashTypeFilter,
    setClashSetA,
    setClashSetB,
    setClashTolerance,
    setClashMinOverlapVolume,
    setClashClearanceDistance,
    setClashUseNarrowPhase,
    setClashUseTrianglePhase,
    setClashIncludeSameModel,
    setClashResultFilter,
    setClashTypeFilter,
    handleRunClashCheck,
    handleCancelClashCheck,
    handleClearClashResults,
    handleFocusClashResult,
    handleUpdateClashResultStatus,
    handleMarkFilteredClashStatus,
    handleExportClashCsv,
    resetClashState,
    applyClashModelOptionBounds
  } = useClashCheck({
    sceneMgrRef: sceneMgr,
    treeRoot,
    clashModelOptions,
    selectedUuids,
    setSelectedUuids,
    focusObjectsInView,
    t
  });
  const clashSummaryByUuid = useClashSummary(sceneMgr, clashResults);
  const completedFileSetsRef = useRef(/* @__PURE__ */ new Set());
  const currentFileSetIdRef = useRef("");
  useEffect(() => {
    currentFileSetIdRef.current = currentFileSetId;
  }, [currentFileSetId]);
  const [errorState, setErrorState] = useState({ isOpen: false, title: "", message: "" });
  const [toast, setToast] = useState(null);
  const { onManagerChunkProgress } = useChunkProgress({
    fileSetIdRef: currentFileSetIdRef,
    completedFileSetsRef,
    onProgress: setChunkProgress,
    onCompleted: () => {
      setToast({ message: t("all_chunks_loaded"), type: "success" });
      setChunkProgress({ loaded: 0, total: 0 });
    }
  });
  const handleManagerChunkProgress = useCallback((loaded, total) => {
    onManagerChunkProgress(loaded, total);
  }, [onManagerChunkProgress]);
  useSceneStats({
    mgrInstance,
    showStats,
    setStats
  });
  useEffect(() => {
    applyClashModelOptionBounds();
  }, [applyClashModelOptionBounds]);
  const resetLocateStateRef = useRef(() => {
  });
  useEffect(() => {
    const prevLang = lang === "zh" ? "en" : "zh";
    if (status === getTranslation(prevLang, "ready")) {
      setStatus(getTranslation(lang, "ready"));
    }
  }, [lang]);
  const formatNumber = (num) => {
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toString();
  };
  const formatMemory = (mb) => {
    if (mb >= 1024) return (mb / 1024).toFixed(2) + " GB";
    return mb.toFixed(1) + " MB";
  };
  function captureViewpointStateSnapshot(options) {
    const snapshot = {};
    if (options.visibility) {
      snapshot.hiddenUuids = Array.from(hiddenUuids);
      snapshot.isolatedUuids = Array.from(isolatedUuids);
    }
    if (options.selection) {
      snapshot.selectedUuids = [...selectedUuids];
    }
    if (options.clip) {
      snapshot.clip = {
        enabled: clipEnabled,
        values: {
          x: [...clipValues.x],
          y: [...clipValues.y],
          z: [...clipValues.z]
        },
        active: { ...clipActive },
        helperVisible: clipHelperVisible,
        helperOpacity: clipHelperOpacity
      };
    }
    if (options.explode) {
      snapshot.explode = {
        enabled: explodeEnabled,
        strength: explodeStrength,
        mode: explodeMode
      };
    }
    return snapshot;
  }
  async function restoreViewpointStateSnapshot(snapshot) {
    const manager = sceneMgr.current;
    if (!manager || !snapshot) return;
    resetLocateStateRef.current?.();
    manager.clearLocateFocus();
    if (snapshot.clip) {
      setClipEnabled(snapshot.clip.enabled);
      setClipValues(snapshot.clip.values);
      setClipActive(snapshot.clip.active);
      setClipHelperVisible(snapshot.clip.helperVisible);
      setClipHelperOpacity(snapshot.clip.helperOpacity);
    }
    if (snapshot.explode) {
      setExplodeEnabled(snapshot.explode.enabled);
      setExplodeStrength(snapshot.explode.strength);
      setExplodeMode(snapshot.explode.mode);
    }
    if (snapshot.hiddenUuids !== void 0 || snapshot.isolatedUuids !== void 0) {
      manager.setAllVisibility(true);
      const nextHidden = snapshot.hiddenUuids || [];
      const nextIsolated = snapshot.isolatedUuids || [];
      if (nextIsolated.length > 0) {
        manager.isolateObjects(nextIsolated);
        setHiddenUuids(/* @__PURE__ */ new Set());
        setIsolatedUuids(new Set(nextIsolated));
      } else {
        nextHidden.forEach((uuid) => manager.setObjectVisibility(uuid, false));
        setHiddenUuids(new Set(nextHidden));
        setIsolatedUuids(/* @__PURE__ */ new Set());
      }
      updateTree();
    }
    if (snapshot.selectedUuids !== void 0) {
      setSelectedUuids(snapshot.selectedUuids);
      setSelectedProps(null);
      manager.highlightObjects(snapshot.selectedUuids);
      if (snapshot.selectedUuids.length === 1) {
        const target = manager.contentGroup.getObjectByProperty("uuid", snapshot.selectedUuids[0]);
        if (target) {
          await handleSelect(target);
        }
      }
    }
  }
  const {
    viewpoints,
    handleSaveViewpoint,
    handleUpdateViewpointName,
    handleLoadViewpoint,
    handleOverwriteViewpoint,
    handleDeleteViewpoint
  } = useViewpoints({
    currentFileSetId,
    sceneMgrRef: sceneMgr,
    setToast,
    setConfirmState,
    t,
    captureStateSnapshot: captureViewpointStateSnapshot,
    restoreStateSnapshot: restoreViewpointStateSnapshot
  });
  useEffect(() => {
    if (mgrInstance) {
      requestAnimationFrame(() => {
        mgrInstance.resize();
      });
    }
  }, [mgrInstance, showOutline, showProps, leftWidth, rightWidth]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3e3);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const updateTree = useCallback(() => {
    if (!sceneMgr.current) return;
    const root = sceneMgr.current.structureRoot;
    if (!root) {
      setTreeRoot([]);
      return;
    }
    const expandedMap = /* @__PURE__ */ new Map();
    const loadedMap = /* @__PURE__ */ new Map();
    const collectExpanded = (nodes) => {
      const stack = (nodes || []).slice();
      while (stack.length) {
        const n = stack.pop();
        if (!n) continue;
        if (typeof n.uuid === "string") {
          expandedMap.set(n.uuid, !!n.expanded);
          loadedMap.set(n.uuid, n.childrenLoaded !== false);
        }
        if (Array.isArray(n.children) && n.children.length) {
          for (const child of n.children) {
            stack.push(child);
          }
        }
      }
    };
    const convertNode = (node, depth = 0, isFileNode = false, forceLoadChildren = false) => {
      const uuid = node.id;
      const rawChildren = Array.isArray(node.children) ? node.children : [];
      const hasChildren = rawChildren.length > 0;
      const shouldLoadChildren = forceLoadChildren || loadedMap.get(uuid) === true;
      return {
        uuid,
        name: node.name,
        type: node.type === "Mesh" ? "MESH" : "GROUP",
        depth,
        children: shouldLoadChildren ? rawChildren.map((child) => convertNode(child, depth + 1, false, false)) : [],
        expanded: expandedMap.get(uuid) ?? false,
        visible: node.visible !== false,
        object: node,
        isFileNode,
        hasChildren,
        childrenLoaded: shouldLoadChildren
      };
    };
    setTreeRoot((prev) => {
      collectExpanded(prev);
      const roots = [];
      (root.children || []).forEach((c) => {
        if (c.name === "ImportedModels" || c.name === "Tilesets") {
          (c.children || []).forEach((child) => {
            roots.push(convertNode(child, 0, true, true));
          });
        } else {
          roots.push(convertNode(c, 0, true, true));
        }
      });
      return roots;
    });
  }, []);
  const {
    contextMenu,
    hiddenUuids,
    isolatedUuids,
    setHiddenUuids,
    setIsolatedUuids,
    handleContextMenu,
    closeContextMenu,
    handleHideSelected,
    handleShowAll,
    handleToggleVisibility,
    handleHideObject,
    handleIsolateObject,
    handleIsolateSelection,
    handleUndoVisibility
  } = useViewerVisibility({
    sceneMgrRef: sceneMgr,
    selectedUuids,
    setSelectedUuids,
    setSelectedProps,
    updateTree,
    resetLocateState: () => resetLocateStateRef.current()
  });
  const handleDeleteObject = (uuid) => {
    if (!sceneMgr.current) return;
    const obj = sceneMgr.current.contentGroup.getObjectByProperty("uuid", uuid);
    const nodes = sceneMgr.current.getStructureNodes(uuid);
    if (obj || nodes) {
      const name = obj?.name || nodes?.[0]?.name || "Item";
      setConfirmState({
        isOpen: true,
        title: t("delete_item"),
        message: `${t("confirm_delete")} "${name}"?`,
        action: async () => {
          setLoading(true);
          setStatus(t("delete_item") + "...");
          try {
            await sceneMgr.current?.removeModel(uuid);
            setSelectedUuids((prev) => {
              const next = prev.filter((id) => id !== uuid);
              sceneMgr.current?.highlightObjects(next);
              if (next.length === 0) setSelectedProps(null);
              return next;
            });
            updateTree();
            setStatus(t("ready"));
            setToast({ message: t("success"), type: "success" });
          } catch (error) {
            console.error("删除对象失败:", error);
            setToast({ message: t("failed") + ": " + (error instanceof Error ? error.message : String(error)), type: "error" });
          } finally {
            setLoading(false);
          }
        }
      });
    }
  };
  const handleClearSelection = () => {
    clearSelection();
    setSelectedProps(null);
    sceneMgr.current?.highlightObjects([]);
  };
  useEffect(() => {
    if (!canvasRef.current) return;
    const manager = new SceneManager(canvasRef.current, {
      performancePreset,
      chunkOptions: effectiveChunkOptions
    });
    sceneMgr.current = manager;
    setMgrInstance(manager);
    if (onLoad) onLoad(manager);
    manager.updateSettings(sceneSettings);
    requestAnimationFrame(() => {
      manager.resize();
    });
    manager.onChunkProgress = handleManagerChunkProgress;
    manager.onMeasureUpdate = handleMeasureUpdate;
    manager.onStructureUpdate = () => {
      updateTree();
    };
    return () => {
      manager.dispose();
    };
  }, []);
  useEffect(() => {
    if (!mgrInstance || !initialFiles) return;
    const loadInitial = async () => {
      const itemsToProcess = Array.isArray(initialFiles) ? initialFiles : [initialFiles];
      console.log("[ThreeViewer] loadInitial with items:", itemsToProcess);
      await processFiles(itemsToProcess);
    };
    loadInitial();
  }, [mgrInstance, initialFiles]);
  const handleSettingsUpdate = (newSettings) => {
    const merged = {
      ...sceneSettings,
      ...newSettings
    };
    setSceneSettings(merged);
    if (sceneMgr.current) {
      sceneMgr.current.updateSettings(merged);
    }
  };
  const {
    locatedUuid,
    locateResultUuids,
    resetLocateState,
    handleSelect,
    handleLocateObject,
    handleLocateResultsChange,
    handleClearLocate
  } = useViewerSelection({
    sceneMgrRef: sceneMgr,
    selectedUuids,
    setSelectedUuids,
    setSelectedProps,
    setHiddenUuids,
    setIsolatedUuids,
    updateTree,
    propOnSelect,
    ifcPropertyCacheRef,
    clashSummaryByUuid,
    focusObjectsInView,
    t,
    isDev: IS_DEV
  });
  resetLocateStateRef.current = resetLocateState;
  const {
    searchConditions,
    setSearchConditions,
    searchResults,
    searching,
    searchProgress,
    searchStatus,
    handleRunPropertySearch,
    handleApplySearchResultHighlight,
    handleClearSearchResult,
    handleCancelSearch
  } = usePropertySearch({
    sceneMgrRef: sceneMgr,
    selectedUuids,
    setSelectedUuids,
    onSelectObject: handleSelect,
    focusObjectsInView,
    t,
    setToast
  });
  const modeTrayItems = useMemo(() => {
    const items = [];
    if (measureType !== "none") {
      items.push({
        key: "measure",
        label: t("mode_measure"),
        onClear: () => {
          setMeasureType("none");
          setActiveTool("none");
          sceneMgr.current?.clearMeasurementPreview();
        }
      });
    }
    if (clipEnabled) {
      items.push({
        key: "clip",
        label: t("mode_clip"),
        onClear: () => {
          setClipEnabled(false);
          setActiveTool("none");
        }
      });
    }
    if (searchResults.length > 0) {
      items.push({
        key: "search",
        label: `${t("mode_search")} ${searchResults.length}`,
        onClear: handleClearSearchResult
      });
    }
    if (hiddenUuids.size > 0) {
      items.push({
        key: "hidden",
        label: `${t("mode_hidden")} ${hiddenUuids.size}`,
        onClear: handleShowAll
      });
    }
    if (isolatedUuids.size > 0) {
      items.push({
        key: "isolated",
        label: `${t("mode_isolated")} ${isolatedUuids.size}`,
        onClear: handleShowAll
      });
    }
    if (activeTool === "boxSelect") {
      items.push({
        key: "boxSelect",
        label: t("mode_box_select"),
        onClear: () => setActiveTool("none")
      });
    }
    if (clashResults.length > 0) {
      items.push({
        key: "clash",
        label: `${t("mode_clash")} ${clashResults.length}`,
        onClear: handleClearClashResults
      });
    }
    return items;
  }, [
    activeTool,
    clashResults.length,
    clipEnabled,
    handleClearClashResults,
    handleClearSearchResult,
    handleShowAll,
    hiddenUuids.size,
    isolatedUuids.size,
    measureType,
    searchResults.length,
    t
  ]);
  const handleIsolateClashByStatus = useCallback((status2) => {
    if (!sceneMgr.current) return;
    const uuids = Array.from(new Set(
      clashResults.filter((item) => item.status === status2).flatMap((item) => [item.aUuid, item.bUuid]).filter(Boolean)
    ));
    if (uuids.length === 0) return;
    sceneMgr.current.clearLocateFocus();
    sceneMgr.current.isolateObjects(uuids);
    setHiddenUuids(/* @__PURE__ */ new Set());
    setIsolatedUuids(new Set(uuids));
    updateTree();
    sceneMgr.current.fitViewToObjects(uuids);
  }, [clashResults, updateTree]);
  const { processFiles, loadItemsIntoScene } = useFileLoadingFlow({
    managerRef: sceneMgr,
    sceneSettings,
    libPath,
    t,
    setCurrentFileSetId,
    setLoading,
    setStatus,
    setProgress,
    setToast,
    updateTree
  });
  useViewportLifecycle({
    allowDragOpen,
    mgrInstance,
    viewportRef,
    t,
    processFiles,
    setToast,
    setErrorState
  });
  const {
    getDefaultExportFileName,
    handleExport,
    handleClear,
    handleScreenshot
  } = useViewerActions({
    sceneMgrRef: sceneMgr,
    t,
    setLoading,
    setProgress,
    setStatus,
    setToast,
    setActiveTool,
    setConfirmState,
    setSelectedUuids,
    setSelectedProps,
    setChunkProgress,
    resetLocateState,
    clearSearchResult: handleClearSearchResult,
    resetClashState,
    resetMeasurementState,
    resetExplodeState,
    updateTree,
    ifcPropertyCacheRef,
    completedFileSetsRef
  });
  const {
    handleOpenFiles,
    handleBatchConvert,
    handleOpenUrl,
    handleDragOver,
    handleDrop
  } = useViewerFileActions({
    sceneMgrRef: sceneMgr,
    t,
    processFiles,
    loadItemsIntoScene,
    setLoading,
    setStatus,
    setProgress,
    setToast,
    setActiveTool,
    setSelectedUuids,
    setSelectedProps,
    resetMeasurementState,
    updateTree,
    isDev: IS_DEV
  });
  useViewerCanvasInteractions({
    sceneMgrRef: sceneMgr,
    canvasRef,
    activeTool,
    setActiveTool,
    measureType,
    setMeasureType,
    pickEnabled,
    selectedUuids,
    setSelectedUuids,
    setSelectedProps,
    setMousePos,
    setHighlightedMeasureId,
    handleSelect,
    handleContextMenu,
    handleUndoVisibility,
    clearSelectionState: handleClearSelection
  });
  const handleView = (v) => {
    sceneMgr.current?.setView(v);
  };
  const handleDisplayModeChange = (mode) => {
    if (!sceneMgr.current) return;
    setDisplayMode(mode);
    sceneMgr.current.contentGroup.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((m) => {
          if (mode === "transparent") {
            m.wireframe = false;
            m.transparent = true;
            m.opacity = 0.5;
          } else {
            m.wireframe = false;
            m.transparent = false;
            m.opacity = 1;
          }
        });
      }
    });
    sceneMgr.current.requestRender();
  };
  return /* @__PURE__ */ jsx(ErrorBoundary, { t, theme, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `ui-container ui-app-shell font-medium`,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      children: [
        /* @__PURE__ */ jsx(
          Toolbar,
          {
            t,
            handleOpenFiles,
            handleBatchConvert,
            handleOpenUrl,
            handleView,
            handleClear,
            openScreenshotPanel: () => setActiveTool("screenshot"),
            handleDisplayModeChange,
            displayMode,
            pickEnabled,
            setPickEnabled,
            activeTool,
            setActiveTool,
            showOutline,
            setShowOutline,
            showProps,
            setShowProps,
            showStats,
            setShowStats,
            sceneMgr: sceneMgr.current,
            theme,
            hiddenMenus,
            onOpenAbout: () => setIsAboutOpen(true),
            hasModels
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "ui-main-layout", children: [
          showOutline && /* @__PURE__ */ jsxs("div", { className: "ui-sidebar ui-sidebar-left", style: { width: `${leftWidth}px` }, children: [
            /* @__PURE__ */ jsxs("div", { className: "ui-sidebar-header", children: [
              /* @__PURE__ */ jsx("span", { children: t("interface_outline") }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "ui-sidebar-close",
                  onClick: () => setShowOutline(false),
                  children: /* @__PURE__ */ jsx(IconClose, { width: 16, height: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "ui-sidebar-content", children: /* @__PURE__ */ jsx(
              SceneTree,
              {
                t,
                treeRoot,
                setTreeRoot,
                selectedUuid,
                locatedUuid,
                onSelect: (_uuid, obj) => handleSelect(obj),
                onToggleVisibility: handleToggleVisibility,
                onDelete: (obj) => {
                  const uuid = obj?.uuid || obj?.id;
                  if (uuid) handleDeleteObject(uuid);
                },
                onHide: handleHideObject,
                onIsolate: handleIsolateObject,
                onShowAll: handleShowAll,
                onLocate: handleLocateObject,
                onClearLocate: handleClearLocate,
                onLocateResultsChange: handleLocateResultsChange,
                locateResultUuids,
                clashSummaryByUuid
              }
            ) }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "ui-sidebar-resize ui-sidebar-resize-left",
                onMouseDown: () => resizingLeft.current = true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { ref: viewportRef, className: "ui-viewport-shell", style: { backgroundColor: theme.canvasBg }, children: [
            /* @__PURE__ */ jsx("canvas", { ref: canvasRef, className: "ui-viewport-canvas" }),
            /* @__PURE__ */ jsx(ViewCube, { sceneMgr: mgrInstance, theme, lang }),
            contextMenu.visible && /* @__PURE__ */ jsx(
              ContextMenu,
              {
                x: contextMenu.x,
                y: contextMenu.y,
                items: [
                  {
                    label: t("hide_selected"),
                    onClick: handleHideSelected,
                    disabled: selectedUuids.length === 0
                  },
                  {
                    label: t("isolate_selection"),
                    onClick: handleIsolateSelection,
                    disabled: selectedUuids.length === 0
                  },
                  {
                    label: t("clear_selection"),
                    onClick: handleClearSelection,
                    disabled: selectedUuids.length === 0
                  },
                  {
                    label: t("show_all"),
                    onClick: handleShowAll
                  }
                ],
                onClose: closeContextMenu,
                theme
              }
            ),
            toast && /* @__PURE__ */ jsxs("div", { className: "ui-toast", children: [
              /* @__PURE__ */ jsx("div", { className: `ui-toast-dot ${toast.type === "error" ? "ui-toast-dot-error" : toast.type === "success" ? "ui-toast-dot-success" : "ui-toast-dot-info"}` }),
              /* @__PURE__ */ jsx("span", { className: "ui-toast-message", children: toast.message }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "ui-toast-close",
                  onClick: () => setToast(null),
                  children: /* @__PURE__ */ jsx(IconClose, { size: 12 })
                }
              )
            ] }),
            /* @__PURE__ */ jsx(LoadingOverlay, { t, loading, status, progress, theme }),
            activeTool === "measure" && /* @__PURE__ */ jsx(
              MeasurePanel,
              {
                t,
                sceneMgr: sceneMgr.current,
                measureType,
                setMeasureType,
                measureHistory,
                highlightedId: highlightedMeasureId,
                onHighlight: (id) => {
                  setHighlightedMeasureId(id);
                  sceneMgr.current?.highlightMeasurement(id);
                  if (id) sceneMgr.current?.locateMeasurement(id);
                },
                onDelete: (id) => {
                  sceneMgr.current?.removeMeasurement(id);
                  setMeasureHistory((prev) => prev.filter((i) => i.id !== id));
                  if (highlightedMeasureId === id) {
                    setHighlightedMeasureId(null);
                    sceneMgr.current?.highlightMeasurement(null);
                  }
                },
                onClear: () => {
                  sceneMgr.current?.clearAllMeasurements();
                  resetMeasurementState();
                },
                onClose: () => setActiveTool("none"),
                theme
              }
            ),
            activeTool === "clip" && /* @__PURE__ */ jsx(
              ClipPanel,
              {
                t,
                sceneMgr: sceneMgr.current,
                onClose: () => setActiveTool("none"),
                clipEnabled,
                setClipEnabled,
                clipValues,
                setClipValues,
                clipActive,
                setClipActive,
                clipHelperVisible,
                setClipHelperVisible,
                clipHelperOpacity,
                setClipHelperOpacity,
                theme
              }
            ),
            activeTool === "export" && /* @__PURE__ */ jsx(
              ExportPanel,
              {
                t,
                onClose: () => setActiveTool("none"),
                onExport: handleExport,
                getDefaultFileName: getDefaultExportFileName,
                theme
              }
            ),
            activeTool === "screenshot" && /* @__PURE__ */ jsx(
              ScreenshotPanel,
              {
                t,
                onClose: () => setActiveTool("none"),
                onCapture: (mode) => {
                  handleScreenshot(mode);
                  setActiveTool("none");
                },
                theme
              }
            ),
            activeTool === "settings" && /* @__PURE__ */ jsx(
              SettingsPanel,
              {
                t,
                onClose: () => setActiveTool("none"),
                settings: sceneSettings,
                onUpdate: handleSettingsUpdate,
                currentLang: lang,
                setLang,
                showStats,
                setShowStats,
                theme
              }
            ),
            activeTool === "viewpoint" && /* @__PURE__ */ jsx(
              ViewpointPanel,
              {
                t,
                viewpoints,
                onSave: handleSaveViewpoint,
                onUpdateName: handleUpdateViewpointName,
                onLoad: handleLoadViewpoint,
                onDelete: handleDeleteViewpoint,
                onOverwrite: handleOverwriteViewpoint,
                onClose: () => setActiveTool("none"),
                theme
              }
            ),
            activeTool === "search" && /* @__PURE__ */ jsx(
              SearchPanel,
              {
                t,
                onClose: () => setActiveTool("none"),
                conditions: searchConditions,
                results: searchResults,
                searching,
                searchProgress,
                searchStatus,
                onConditionsChange: setSearchConditions,
                onSearch: () => void handleRunPropertySearch(),
                onCancelSearch: handleCancelSearch,
                onApplyResultHighlight: handleApplySearchResultHighlight,
                onClearResult: handleClearSearchResult,
                theme
              }
            ),
            activeTool === "clash" && /* @__PURE__ */ jsx(
              ClashPanel,
              {
                t,
                onClose: () => setActiveTool("none"),
                running: clashRunning,
                progress: clashProgress,
                status: clashStatus,
                scannedCount: clashScannedCount,
                pairsScanned: clashPairsScanned,
                results: clashResults,
                resultFilter: clashResultFilter,
                modelOptions: clashModelOptions,
                setA: clashSetA,
                setB: clashSetB,
                tolerance: clashTolerance,
                minOverlapVolume: clashMinOverlapVolume,
                clearanceDistance: clashClearanceDistance,
                useNarrowPhase: clashUseNarrowPhase,
                useTrianglePhase: clashUseTrianglePhase,
                includeSameModel: clashIncludeSameModel,
                onSetAChange: setClashSetA,
                onSetBChange: setClashSetB,
                onToleranceChange: setClashTolerance,
                onMinOverlapVolumeChange: setClashMinOverlapVolume,
                onClearanceDistanceChange: setClashClearanceDistance,
                onUseNarrowPhaseChange: setClashUseNarrowPhase,
                onUseTrianglePhaseChange: setClashUseTrianglePhase,
                onIncludeSameModelChange: setClashIncludeSameModel,
                onRun: () => void handleRunClashCheck(),
                onCancel: handleCancelClashCheck,
                onClear: handleClearClashResults,
                onExportCsv: handleExportClashCsv,
                onIsolateByStatus: handleIsolateClashByStatus,
                onRestoreVisibility: handleShowAll,
                onResultFilterChange: setClashResultFilter,
                typeFilter: clashTypeFilter,
                onTypeFilterChange: setClashTypeFilter,
                onUpdateResultStatus: handleUpdateClashResultStatus,
                onMarkFilteredStatus: handleMarkFilteredClashStatus,
                onSetASelectAll: () => setClashSetA(clashModelOptions.map((item) => item.id)),
                onSetAClear: () => setClashSetA([]),
                onSetBSelectAll: () => setClashSetB(clashModelOptions.map((item) => item.id)),
                onSetBClear: () => setClashSetB([]),
                onFocusResult: handleFocusClashResult,
                theme
              }
            ),
            activeTool === "explode" && /* @__PURE__ */ jsx(
              ExplodePanel,
              {
                t,
                onClose: () => setActiveTool("none"),
                enabled: explodeEnabled,
                strength: explodeStrength,
                mode: explodeMode,
                onEnabledChange: setExplodeEnabled,
                onStrengthChange: setExplodeStrength,
                onModeChange: setExplodeMode,
                onReset: () => {
                  resetExplodeState();
                  sceneMgr.current?.resetExplode();
                },
                theme
              }
            )
          ] }),
          showProps && /* @__PURE__ */ jsxs("div", { className: "ui-sidebar ui-sidebar-right", style: { width: `${rightWidth}px` }, children: [
            /* @__PURE__ */ jsxs("div", { className: "ui-sidebar-header", children: [
              /* @__PURE__ */ jsx("span", { children: t("interface_props") }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "ui-sidebar-close",
                  onClick: () => setShowProps(false),
                  children: /* @__PURE__ */ jsx(IconClose, { width: 16, height: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "ui-sidebar-content", children: /* @__PURE__ */ jsx(PropertiesPanel, { t, selectedProps, theme }) }),
            /* @__PURE__ */ jsx(
              "div",
              {
                onMouseDown: () => resizingRight.current = true,
                className: "ui-sidebar-resize ui-sidebar-resize-right"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ui-statusbar", children: [
          /* @__PURE__ */ jsxs("div", { className: "ui-statusbar-left", children: [
            /* @__PURE__ */ jsx("span", { children: status }),
            loading && /* @__PURE__ */ jsxs("span", { children: [
              progress,
              "%"
            ] }),
            selectedUuid && selectedUuids.length > 1 && /* @__PURE__ */ jsxs("span", { className: "ui-statusbar-meta", children: [
              t("selected_count"),
              ": ",
              selectedUuids.length
            ] }),
            chunkProgress.total > 0 && chunkProgress.loaded < chunkProgress.total && /* @__PURE__ */ jsxs("div", { className: "ui-chunk-progress", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                t("chunk_loading"),
                ": ",
                chunkProgress.loaded,
                "/",
                chunkProgress.total
              ] }),
              /* @__PURE__ */ jsx("div", { className: "ui-progress-bar ui-progress-bar-compact", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "ui-progress-fill",
                  style: { width: `${chunkProgress.loaded / chunkProgress.total * 100}%` }
                }
              ) })
            ] }),
            modeTrayItems.length > 0 && /* @__PURE__ */ jsx("div", { className: "ui-mode-tray", children: modeTrayItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "ui-mode-pill", children: [
              /* @__PURE__ */ jsx("span", { children: item.label }),
              /* @__PURE__ */ jsx("button", { onClick: item.onClear, children: t("mode_clear") })
            ] }, item.key)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ui-statusbar-right", children: [
            mousePos && /* @__PURE__ */ jsxs("div", { className: "ui-statusbar-coords", children: [
              mousePos.x.toFixed(2),
              ", ",
              mousePos.y.toFixed(2),
              ", ",
              mousePos.z.toFixed(2)
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "ui-tips", children: [
              /* @__PURE__ */ jsx("span", { children: t("tips_rotate") }),
              /* @__PURE__ */ jsx("span", { children: t("tips_pan") }),
              /* @__PURE__ */ jsx("span", { children: t("tips_zoom") })
            ] }),
            showStats && /* @__PURE__ */ jsxs("div", { className: "ui-stats-group", children: [
              /* @__PURE__ */ jsxs("div", { className: "ui-stats-item", title: t("stats_original_meshes"), children: [
                /* @__PURE__ */ jsx(IconBox, { width: 14, height: 14 }),
                /* @__PURE__ */ jsx("span", { children: formatNumber(stats.meshes) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "ui-stats-item", title: t("stats_triangles"), children: [
                /* @__PURE__ */ jsx(IconGrid, { width: 14, height: 14 }),
                /* @__PURE__ */ jsx("span", { children: formatNumber(stats.faces) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "ui-stats-item", children: [
                /* @__PURE__ */ jsx(IconActivity, { width: 14, height: 14 }),
                /* @__PURE__ */ jsx("span", { children: formatMemory(stats.memory) })
              ] }),
              stats.chunksTotal > 0 && /* @__PURE__ */ jsxs("div", { className: "ui-statusbar-metric", title: t("stats_chunks"), children: [
                "CH ",
                stats.chunksLoaded,
                "/",
                stats.chunksTotal
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "ui-statusbar-metric", title: t("stats_pixel_ratio"), children: [
                "DPR ",
                stats.pixelRatio
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "ui-divider-vertical ui-divider-vertical-compact ui-divider-vertical-short" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "ui-statusbar-tag ui-statusbar-tag-compact",
                onClick: () => setLang(lang === "zh" ? "en" : "zh"),
                children: lang === "zh" ? "EN" : "中文"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "ui-divider-vertical ui-divider-vertical-compact ui-divider-vertical-short" }),
            /* @__PURE__ */ jsx("div", { className: "ui-statusbar-tag ui-statusbar-tag-compact ui-statusbar-brand", children: /* @__PURE__ */ jsx("span", { className: "ui-statusbar-brand-label", children: "3D BROWSER" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          ConfirmModal,
          {
            isOpen: confirmState.isOpen,
            title: confirmState.title,
            message: confirmState.message,
            onConfirm: () => {
              confirmState.action();
              setConfirmState({ ...confirmState, isOpen: false });
            },
            onCancel: () => setConfirmState({ ...confirmState, isOpen: false }),
            t,
            theme
          }
        ),
        /* @__PURE__ */ jsx(
          AboutModal,
          {
            isOpen: isAboutOpen,
            onClose: () => setIsAboutOpen(false),
            t,
            theme
          }
        ),
        errorState.isOpen && /* @__PURE__ */ jsx("div", { className: "ui-error-overlay", children: /* @__PURE__ */ jsxs("div", { className: "ui-error-content ui-error-content-wide", children: [
          /* @__PURE__ */ jsxs("div", { className: "ui-error-header ui-error-header-danger", children: [
            /* @__PURE__ */ jsx("span", { children: errorState.title }),
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => setErrorState((prev) => ({ ...prev, isOpen: false })),
                className: "ui-error-close",
                children: /* @__PURE__ */ jsx(IconClose, { width: 18, height: 18 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ui-error-body", children: [
            /* @__PURE__ */ jsx("div", { className: "ui-error-message", children: errorState.message }),
            /* @__PURE__ */ jsx("div", { className: "ui-error-actions", children: /* @__PURE__ */ jsx(
              "button",
              {
                className: "ui-btn ui-btn-primary ui-btn-modal-confirm",
                onClick: () => setErrorState((prev) => ({ ...prev, isOpen: false })),
                children: t("confirm")
              }
            ) })
          ] })
        ] }) })
      ]
    }
  ) });
};

export { ThreeViewer, ThreeViewer as default };
