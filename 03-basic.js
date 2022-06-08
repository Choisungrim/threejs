console.log(THREE);
// 정면
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x004fff);

// 카메라
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);

// 캔버스
const canvas = document.querySelector('#webgl');

// 렌더링
const renderer = new THREE.WebGLRenderer({canvas});

//document.body.appendChild(renderer.domElement);
//renderer.setSize(window.innerWidth, window.innerHeight);

function render(time) {
    time *= 0.001;  // convert time to seconds
    
    //cube.rotation.x = time;
    //cube.rotation.y = time;
   
    renderer.render(scene, camera);
   
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);