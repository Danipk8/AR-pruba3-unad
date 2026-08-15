import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';


// ESCENA
const scene = new THREE.Scene();


// CÁMARA
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  20
);


// RENDERER
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.xr.enabled = true;

document.body.appendChild(renderer.domElement);


// BOTÓN AR
document.body.appendChild(
  ARButton.createButton(renderer)
);

// LUZ
const light = new THREE.HemisphereLight(
  0xffffff,
  0xbbbbff,
  3
);

scene.add(light);


// CUBO
const geometry = new THREE.BoxGeometry(
  0.2,
  0.2,
  0.2
);

const material = new THREE.MeshStandardMaterial({
  color: 0x00ff88
});

const cube = new THREE.Mesh(
  geometry,
  material
);

cube.visible = false;

scene.add(cube);


// HIT TEST
/*let hitTestSource = null;
let localReferenceSpace = null;

renderer.xr.addEventListener(
  'sessionstart',
  async () => {

    const session = renderer.xr.getSession();

    localReferenceSpace =
      await session.requestReferenceSpace('local');

    hitTestSource =
      await session.requestHitTestSource({
        space: await session.requestReferenceSpace(
          'viewer'
        )
      });

  }
);


// CUANDO TERMINA AR
renderer.xr.addEventListener(
  'sessionend',
  () => {

    hitTestSource = null;
    localReferenceSpace = null;

    cube.visible = false;

  }
);

*/


// ANIMACIÓN
renderer.setAnimationLoop(
  (timestamp, frame) => {

    if (frame && hitTestSource) {

      const hitTestResults =
        frame.getHitTestResults(
          hitTestSource
        );

      if (hitTestResults.length > 0) {

        const hit = hitTestResults[0];

        const pose =
          hit.getPose(
            localReferenceSpace
          );

        cube.visible = true;

        cube.position.set(
          pose.transform.position.x,
          pose.transform.position.y,
          pose.transform.position.z
        );

      }

    }

    renderer.render(
      scene,
      camera
    );

  }
);


// RESPONSIVE
window.addEventListener(
  'resize',
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);