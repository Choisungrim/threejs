const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 15, 0, 100 );
camera.lookAt( 10, 2, 4 );

const scene = new THREE.Scene();

const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

const points = [];
points.push( new THREE.Vector4( -10, 10, 1 ) );
points.push( new THREE.Vector4( 10, 10, 0 ) );
points.push( new THREE.Vector4( 10, 10, 0 ) );
points.push( new THREE.Vector4( 10,0,0 ) );
points.push( new THREE.Vector4( 0,0,0 ) );
points.push( new THREE.Vector4( -10,0,0 ) );
points.push( new THREE.Vector4( 0,6,40 ) );


const geometry = new THREE.BufferGeometry().setFromPoints( points );

const line = new THREE.Line( geometry, material );

scene.add( line );
renderer.render( scene, camera );