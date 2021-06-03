import * as THREE from "three";
// import { DeviceOrientationControls } from "three/examples/jsm/controls/DeviceOrientationControls";
import { DeviceOrientationController } from "./DeviceOrientationController";

let camera, scene, renderer, controls, torus, raycaster, mouse;

init();
animate();

function init() {
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1100
  );
  scene = new THREE.Scene();

  const geometry = new THREE.SphereGeometry(500, 60, 40);
  // invert the geometry on the x-axis so that all of the faces point inward
  geometry.scale(-1, 1, 1);

  const video = document.getElementById("video");
  video.play();

  const texture = new THREE.VideoTexture(video);
  const material = new THREE.MeshBasicMaterial({ map: texture });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const helperGeometry = new THREE.BoxGeometry(100, 100, 100, 4, 4, 4);
  const helperMaterial = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    wireframe: true,
  });
  const helper = new THREE.Mesh(helperGeometry, helperMaterial);
  scene.add(helper);

  const tgeometry = new THREE.TorusGeometry(10, 3, 16, 100);
  const tmaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
  torus = new THREE.Mesh(tgeometry, tmaterial);
  torus.position.set(40, 0, 0);
  scene.add(torus);

  // Lights

  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(5, 5, 5);

  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(pointLight, ambientLight);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  controls = new DeviceOrientationController(camera, renderer.domElement);
  controls.connect();

  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);
  renderer.domElement.addEventListener("mousedown", onDocumentMouseDown);
  renderer.domElement.addEventListener("touchstart", onDocumentTouchStart);
  renderer.domElement.addEventListener("touchend", onDocumentTouchEnd);
}

var temp = false;
var startTap = false;

function onDocumentMouseDown(event) {
  event.preventDefault();

  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects([torus]).length > 0;

  if (intersects) {
    torus.material.color.setHex(temp ? 0x00ff00 : 0xff0000);
    temp = !temp;
  }
}
function onDocumentTouchStart(event) {
  event.preventDefault();

  mouse.x =
    (event.changedTouches[0].clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y =
    -(event.changedTouches[0].clientY / renderer.domElement.clientHeight) * 2 +
    1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects([torus]).length > 0;
  if (intersects) {
    startTap = true;
  } else {
    startTap = false;
  }
}

function onDocumentTouchEnd(event) {
  event.preventDefault();

  if (!startTap) {
    return;
  }

  mouse.x =
    (event.changedTouches[0].clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y =
    -(event.changedTouches[0].clientY / renderer.domElement.clientHeight) * 2 +
    1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects([torus]).length > 0;

  if (intersects) {
    torus.material.color.setHex(temp ? 0x00ff00 : 0xff0000);
    temp = !temp;
  }

  startTap = false;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  window.requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();
  renderer.render(scene, camera);
}
