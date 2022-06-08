// Curve
const curve = new THREE.CubicBezierCurve3(
	new THREE.Vector3( -1, 0, 0 ),
	new THREE.Vector3( 0, 2, 0 ),
	new THREE.Vector3( 0, 2, 0 ),
	new THREE.Vector3( 1, 0, 0 ),
);

const points = curve.getPoints( 50 );
const geometry = new THREE.BufferGeometry().setFromPoints( points );

// 장면
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

const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

// Create the final object to add to the scene
const curveObject = new THREE.Line( geometry, material );

// redcube
const cube1 = new THREE.Mesh(
	new THREE.BoxGeometry(1,1,1),
	new THREE.MeshBasicMaterial({color:'#ff0000'}),
);
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);
const curveOb = curve.getUtoTmapping(cube1,points);
scene.add(curveOb,curveObject);

renderer.render(scene, camera);
