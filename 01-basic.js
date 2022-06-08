console.log("hello");
console.log(THREE);
const scene = new THREE.Scene();
const group = new THREE.Group();

//Red Cube
const cube1 = new THREE.Mesh(
	new THREE.BoxGeometry(1,1,1),
	new THREE.MeshBasicMaterial({color:'#ff0000'}),
);

// Green Cube
const cube2 = new THREE.Mesh(
	new THREE.BoxGeometry(1,1,1),
	new THREE.MeshBasicMaterial({color:'#00ff00'}),
);

//Blue Cube
const cube3 = new THREE.Mesh(
	new THREE.BoxGeometry(1,1,1),
	new THREE.MeshBasicMaterial({color:'#0000ff'}),
);

// Cube 쌓기
const cube4 = new THREE.Mesh(
	new THREE.BoxGeometry(1,1,1),
	new THREE.MeshBasicMaterial({color:'#ff0000'}),
)
cube2.position.x = -1;
cube3.position.x = 1;
cube4.position.x = -1 
cube4.position.y = 1;

group.add(cube1,cube2,cube3,cube4);

const mesh = new THREE.Mesh(group);

group.position.set(-0.007,1.664,0);
group.rotation.set(138.25,-17.85 ,49.37 )

scene.add(group);

// Sizes
const sizes = {
	width : 2000,
	height : 1000
}

//axesHelper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// 카메라
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height,0.1, 1000);
camera.position.set(0.3,6,2)
camera.rotation.set(-20,0,-0.5)
scene.add(camera);

// Renderer	
const canvas =  document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
	canvas : canvas
})




renderer.setSize(sizes.width,sizes.height);

renderer.render(scene,camera);

console.log(mesh.position.distanceTo(camera.position))



