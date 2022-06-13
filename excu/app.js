import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r126/three.module.min.js'

class App {
    constructor() {
        this._initialize();
    }

    _initialize(fontText) {
        this.domWebGL = document.createElement('div');
        document.body.appendChild(this.domWebGL);

        let scene = new THREE.Scene();
        let renderer = new THREE.WebGLRenderer();

        renderer.setClearColor(0x000000, 1.0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        this.domWebGL.appendChild(renderer.domElement);  
        window.onresize = this.resize.bind(this); 
        
        this.renderer = renderer;
        this.scene = scene;

        this._setupModel(fontText);
        this._setupCamera();
    }

    _setupModel() {
        let fontLoader = new THREE.FontLoader();
        fontLoader.load("Do Hyeon_Regular.json", (font) => {
            let geometry = new THREE.TextGeometry(
                "최성림",
                { 
                    font: font,
                    size: 1,
                    height: 0,
                    curveSegments: 12
                }
            );

            geometry.computeBoundingBox();
            let xMid = -0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
            geometry.translate( xMid, 0, 0 );


            let material = new THREE.MeshBasicMaterial({
                color: 0xffffff, 
                wireframe: true
            });
    
            let mesh = new THREE.Mesh(geometry, material);
            
            this.scene.add(mesh);

            this.mesh = mesh;

            this.render();
        });


    }

    _setupCamera() {
        let camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 12;
        
        //camera.up.set(0,-1,0);
        camera.lookAt(this.scene.position);
        
        this.scene.add(camera);
        this.camera = camera;
    }

    update() {
        //this.mesh.rotation.y += 0.01;
    }

    render() {
        this.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        let camera = this.camera;
        let renderer = this.renderer;
        let scene = this.scene;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }
}

window.onload = function() {
    new App()
}