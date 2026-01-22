import * as THREE from 'three';

class OCCTLoader {
  constructor(wasmUrl = "/libs/occt-import-js/occt-import-js.wasm") {
    this.wasmUrl = wasmUrl;
  }
  async load(buffer, t, onProgress) {
    if (onProgress) onProgress(10, t("loading_cad_engine"));
    const initOCCT = (await import('occt-import-js')).default;
    const occt = await initOCCT({
      locateFile: (name) => {
        if (name.endsWith(".wasm")) return this.wasmUrl;
        return name;
      }
    });
    if (onProgress) onProgress(30, t("parsing_cad_data"));
    const fileContent = new Uint8Array(buffer);
    let result;
    try {
      const params = {
        linearDeflection: 0.1,
        angularDeflection: 0.5
      };
      result = occt.ReadStepFile(fileContent, params);
    } catch (e) {
      console.warn("Failed to read as STEP, trying IGES...", e);
    }
    if (!result || !result.success) {
      try {
        const params = {
          linearDeflection: 0.1,
          angularDeflection: 0.5
        };
        result = occt.ReadIgesFile(fileContent, params);
      } catch (e) {
        console.error("Failed to read as IGES", e);
      }
    }
    if (!result || !result.success) {
      throw new Error(t("error_cad_parse_failed"));
    }
    if (onProgress) onProgress(70, t("creating_geometry"));
    const group = new THREE.Group();
    const material = new THREE.MeshPhongMaterial({
      color: 13421772,
      side: THREE.DoubleSide,
      flatShading: false,
      shininess: 30
    });
    for (const mesh of result.meshes) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(mesh.attributes.position.array, 3));
      if (mesh.attributes.normal) {
        geometry.setAttribute("normal", new THREE.Float32BufferAttribute(mesh.attributes.normal.array, 3));
      } else {
        geometry.computeVertexNormals();
      }
      if (mesh.index) {
        geometry.setIndex(new THREE.Uint32BufferAttribute(mesh.index.array, 1));
      }
      const threeMesh = new THREE.Mesh(geometry, material.clone());
      if (mesh.color) {
        const color = new THREE.Color(mesh.color[0], mesh.color[1], mesh.color[2]);
        threeMesh.material.color = color;
      }
      threeMesh.name = mesh.name || "CAD Part";
      threeMesh.userData = {
        ...mesh.userData,
        source: "OCCT"
      };
      group.add(threeMesh);
    }
    if (onProgress) onProgress(100, t("model_loaded"));
    return group;
  }
}

export { OCCTLoader };
