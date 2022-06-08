console.log(THREE);
// 정면
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x004fff);

// 카메라
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);
camera.position.z=3;
// 캔버스
const canvas = document.querySelector('#webgl');

// 렌더링
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


// 매쉬
const geometry = new THREE.BoxGeometry(0.5,0.5,0.5);
const material = new THREE.MeshStandardMaterial({
  color : 0x999999
});
const cube = new THREE.Mesh(geometry,material)
scene.add(cube);


function render(time) {
    time *= 0.001;  // convert time to seconds
    
    cube.rotation.x = time;
    cube.rotation.y = time;
   
    renderer.render(scene, camera);
   
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);