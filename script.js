import * as THREE from "./three.js-master/build/three.module.js";
import { OBJLoader } from "./three.js-master/examples/jsm/loaders/OBJLoader.js";

export function example7(map_size) {
  /*
  **  Init THREE.js
  */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const loader = new THREE.TextureLoader();
  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  let uniform = {
    time: { value: 1 }
  };

  const ambientLight = new THREE.AmbientLight(0xfcf3cf, 1);
  scene.add(ambientLight);

  /*
  **  Move the camera.
  */
  
  camera.position.z = 5;
  camera.position.x = 1;
  camera.rotation.x = 45;
  camera.position.y = -8;



  /*
  ** Init head snake
  */

  let object;

  const manager = new THREE.LoadingManager(loadModel);
  const texture_loader = new THREE.TextureLoader(manager);
  const texture = texture_loader.load('./assets/images/snake_texture/snake_texture.png');

  const object_loader = new OBJLoader(manager);
  object_loader.load('./assets/snake_head.obj', function (obj) {
    object = obj;
  }, onProgress, onError);

  function loadModel() {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.material.map = texture;
      }
    });

    object.rotation.x = (Math.PI / 180) * 90;
    scene.add(object);
  }

  function onProgress(xhr) {
    if (xhr.lengthComputable) {
      const loading_completed = xhr.loaded / xhr.total / 100;
      console.log('Model ' + Math.round(loading_completed, 2) + '% loaded.');
    }
  }

  function onError(err) {
    console.log(err);
  }

  /*
  ** Init the snake map
  */

  const material = new THREE.MeshBasicMaterial({ map: loader.load("./assets/images/grass.jpg") });
  const geometry_plane = new THREE.PlaneGeometry(map_size, map_size, 1, 1);
  const plane = new THREE.Mesh(geometry_plane, material);

  scene.add(plane);

  /*
  **  init the game.
  */

  let game = {
    map: [],
    snake: {
      head: {
        x: 3,
        x: 1
     },
      tail: {
        x: 1,
        x: 1
     }
    }
  };

  for (let y = 0; y != map_size; y++) { //Init the map
    game.map[y] = [];
    for (let x = 0; x != map_size; x++) {
      game.map[y][x] = null;
    }
  }


  window.addEventListener('keydown', function (event) {
    let keyCode = event.which;
      let delta = 1;

      if (keyCode == 65) {        //a
        object.position.x -= delta;
        object.rotation.y = 0;
      }

      if (keyCode == 83) {        //s
        object.position.y -= delta;
        object.rotation.y = (Math.PI / 180) * 90;
      }

      if (keyCode == 68) {        //d
        object.position.x += delta;
        object.rotation.y = (Math.PI / 180) * 180;
      }

      if (keyCode == 87) {       //w
        object.position.y += delta;
        object.rotation.y = (Math.PI / 180) * -90;
      }
  });


  renderer.setAnimationLoop(function () {
    renderer.render(scene, camera);
  });

  document.body.appendChild(renderer.domElement);


}
