console.log(THREE);
// 정면
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x004fff);

// 카메라
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);
camera.position.z=4;

// 캔버스
const canvas = document.querySelector('#webgl');

// 렌더링
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);

//document.body.appendChild(renderer.domElement);


// 매쉬
const plane = new THREE.Mesh(
	new THREE.PlaneGeometry(1,1),
	new THREE.MeshBasicMaterial({
        color : 0x999999,
        side : THREE.DoubleSide
      })
);
const plane2 = new THREE.Mesh(
	new THREE.PlaneGeometry(2,2),
	new THREE.MeshBasicMaterial({
        color : 0x999999,
        side : THREE.DoubleSide
      })
);
plane.rotation.y=7;
plane.rotation.x=1;
plane2.rotation.x=5;

const group = new THREE.Group();
group.add(plane,plane2);
const mesh = new THREE.Mesh(group);
const material = new THREE.MeshBasicMaterial({
  color : 0x999999,
  side : THREE.DoubleSide
});
scene.add(group);


function render(time) {
    time *= 0.0007;  // convert time to seconds
    
    plane.rotation.z = time;
    plane2.rotation.z = time;
    renderer.render(scene, camera);
   
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);