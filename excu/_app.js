import * as THREE from '../texture/three.module.js';
import Stats from 'examples/jsm/libs/stats.module.js';
import { GUI } from './jsm/libs/dat.gui.module.js';
import { BufferGeometryUtils } from './jsm/utils/BufferGeometryUtils.js';

function FXScene(type, numObjects, cameraZ, fov, rotationSpeed, clearColor) {
    this.clearColor = clearColor;

    this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = cameraZ;

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0x555555));

    const light = new THREE.SpotLight(0xffffff, 1.5);
    light.position.set(0, 0, 5000);
    this.scene.add(light);

    this.rotationSpeed = rotationSpeed;
    const defaultMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true, vertexColors: true });
    this.mesh = new THREE.Mesh(generateGeometry(type, numObjects), defaultMaterial);
    this.scene.add(this.mesh);

    const renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
    this.fbo = new THREE.WebGLRenderTarget(
        window.innerWidth*window.devicePixelRatio, window.innerHeight*window.devicePixelRatio, renderTargetParameters);

    this.render = function(renderer, delta, rtt) {
        this.mesh.rotation.x += delta * this.rotationSpeed.x;
        this.mesh.rotation.y += delta * this.rotationSpeed.y;
        this.mesh.rotation.z += delta * this.rotationSpeed.z;

        renderer.setClearColor(this.clearColor);

        if(rtt) {
            renderer.setRenderTarget(this.fbo);
            renderer.clear();
            renderer.render(this.scene, this.camera);
        } else {
            renderer.setRenderTarget(null);
            renderer.render(this.scene, this.camera);
        }
    }

    this.updateCamera = function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}

function generateGeometry(objectType, numObjects) {
    function applyVertexColors(geometry, color) {
        const position = geometry.attributes.position;
        const colors = [];

        for(let i=0; i<position.count; i++) {
            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    }

    const geometries =[];
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const color = new THREE.Color();

    for(let i=0; i<numObjects; i++) {
        position.x = Math.random() * 10000 - 5000;
        position.y = Math.random() * 6000 - 3000;
        position.z = Math.random() * 8000 - 4000;

        rotation.x = Math.random() * 2 * Math.PI;
        rotation.y = Math.random() * 2 * Math.PI;
        rotation.z = Math.random() * 2 * Math.PI;

        quaternion.setFromEuler(rotation);

        scale.x = Math.random() * 200 + 100;

        let geometry;

        if(objectType === 'cube') {
            geometry = new THREE.BoxGeometry(1, 1, 1);
            geometry = geometry.toNonIndexed();
            scale.y = Math.random() * 200 + 100;
            scale.z = Math.random() * 200 + 100;
            color.setRGB(0, 0, 0.1+0.9*Math.random());
        } else if(objectType === 'sphere') {
            geometry = new THREE.IcosahedronGeometry(1, 1);
            scale.y = scale.z = scale.x;
            color.setRGB(0.1+0.9*Math.random(), 0, 0);
        } else {
            console.log('err');
        }

        applyVertexColors(geometry, color);

        matrix.compose(position, quaternion, scale);
        geometry.applyMatrix4(matrix);

        geometries.push(geometry);
    }

    return BufferGeometryUtils.mergeBufferGeometries(geometries);   
}

function Transition(sceneA, sceneB) {
    this.scene = new THREE.Scene();
    this.cameraOrtho = new THREE.OrthographicCamera(window.innerWidth/-2, window.innerWidth/2, window.innerHeight/2, window.innerHeight/-2, -10, 10);
    this.textures = [];
    
    const loader = new THREE.TextureLoader();

    for(let i=0; i<6; i++) {
        this.textures[i] = loader.load('textures/transition/transition' + (i+1) + ".png");
    }

    this.quadMaterial = new THREE.ShaderMaterial({
        uniforms: {
            tDiffuse1: {
                value: null
            },
            tDiffuse2: {
                value: null
            },
            mixRatio: {
                value: 0.0
            },
            threshold: {
                value: 0.1
            },
            useTexture: {
                value: 1
            },
            tMixTexture: {
                value: this.textures[0]
            }
        },
        vertexShader: [
            "varying vec2 vUv;",
            "void main() {",
            "   vUv = vec2( uv.x, uv.y );",
            "   gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        ].join("\n"),
        fragmentShader: [
            "uniform float mixRatio;",
            "uniform sampler2D tDiffuse1;",
            "uniform sampler2D tDiffuse2;",
            "uniform sampler2D tMixTexture;",
            "uniform int useTexture;",
            "uniform float threshold;",
            "varying vec2 vUv;",
            "void main() {",
            "	vec4 texel1 = texture2D( tDiffuse1, vUv );",
            "	vec4 texel2 = texture2D( tDiffuse2, vUv );",
            "	if (useTexture==1) {",
            "		vec4 transitionTexel = texture2D( tMixTexture, vUv );",
            "		float r = mixRatio * (1.0 + threshold * 2.0) - threshold;",
            "		float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);",
            "		gl_FragColor = mix( texel1, texel2, mixf );",
            "	} else {",
            "		gl_FragColor = mix( texel2, texel1, mixRatio );",
            "	}",
            "}"
        ].join("\n")
    });

    const quadGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
    this.quad = new THREE.Mesh(quadGeometry, this.quadMaterial);
    this.scene.add(this.quad);

    this.sceneA = sceneA;
    this.sceneB = sceneB;

    this.quadMaterial.uniforms.tDiffuse1.value = sceneA.fbo.texture;
    this.quadMaterial.uniforms.tDiffuse2.value = sceneB.fbo.texture;

    this.needChange = false;

    this.setTextureThreshold = function(value) {
        this.quadMaterial.uniforms.threshold.value = value;
    };

    this.useTexture = function(value) {
        this.quadMaterial.uniforms.useTexture.value = value ? 1 : 0;
    };

    this.setTexture = function(i) {
        this.quadMaterial.uniforms.tMixTexture.value = this.textures[i];
    }

    this.render = function(renderer, transitionParams, clock) {
        const delta = clock.getDelta();

        if(transitionParams.animateTransition) {
            const t = (1 + Math.sin(transitionParams.transitionSpeed * clock.getElapsedTime())) / 2;
            transitionParams.transition = THREE.MathUtils.smoothstep(t, 0.1, 0.9);

            if(transitionParams.loopTexture && (transitionParams.transition == 0.0 || transitionParams.transition == 1.0)) {
                if(this.needChange) {
                    transitionParams.texture = (transitionParams.texture + 1) % this.textures.length;
                    this.quadMaterial.uniforms.tMixTexture.value = this.textures[transitionParams.texture];
                    this.needChange = false;
                }
            } else {
                this.needChange = true;
            }
        }

        this.quadMaterial.uniforms.mixRatio.value = transitionParams.transition;
        if(transitionParams.transition == 0) {
            this.sceneB.render(renderer, delta, false);
        } else if(transitionParams.transition == 1) {
            this.sceneA.render(renderer, delta, false);
        } else {
            this.sceneA.render(renderer, delta, true);
            this.sceneB.render(renderer, delta, true);

            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(this.scene, this.cameraOrtho);
        }
    };
}

class App {
    constructor() {
        this._initialize();
    }

    _initialize() {
        this.domWebGL = document.createElement('div');
        document.body.appendChild(this.domWebGL);

        let renderer = new THREE.WebGLRenderer({ antialias: true });
        this.domWebGL.appendChild(renderer.domElement);

        this.renderer = renderer;

        this._stats = new Stats();
        this.domWebGL.appendChild(this._stats.dom);

        this._clock = new THREE.Clock();

        this._setupGUI();
        this._setupModel();

        window.onresize = this.resize.bind(this);

        this.resize();
    }

    _setupModel() {
        const sceneA = new FXScene("cube", 1000, 4000, 70, new THREE.Vector3(0, -0.4, 0), 0xffffff);
        const sceneB = new FXScene("sphere", 500, 2000, 50, new THREE.Vector3(0, 0.2, 0.1), 0x000000);

        this._transition = new Transition(sceneA, sceneB);
        this._sceneA = sceneA;
        this._sceneB = sceneB;
    }

    update() {
        this._stats.update();
    }

    render(time) {
        requestAnimationFrame(this.render.bind(this));

        this._transition.render(this.renderer, this._transitionParams, this._clock);

        this.update(time);
    }

    resize() {
        const aspect = window.innerWidth / window.innerHeight;

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this._sceneA.updateCamera();
        this._sceneB.updateCamera();

        this.render();
    }

    _setupGUI() {
        const transitionParams = {
            "useTexture": true,
            "transition": 0.5,
            "transitionSpeed": 2.0,
            "texture": 5,
            "loopTexture": true,
            "animateTransition": true,
            "textureThreshold": 0.3
        };

        const gui = new GUI();
        
        gui.add(transitionParams, "useTexture").onChange((value) => {
            this._transition.useTexture(value);
        });

        gui.add(transitionParams, "loopTexture");

        gui.add(transitionParams, "texture", { Perlin: 0, Squares: 1, Cells: 2, Distort: 3, Gradient: 4, Radial: 5}).onChange((value) => {
            this._transition.setTexture(value);
        }).listen();

        gui.add(transitionParams, "textureThreshold", 0, 1, 0.01).onChange((value) => {
            this._transition.setTextureThreshold(value);
        });

        gui.add(transitionParams, "animateTransition");
        gui.add(transitionParams, "transition", 0, 1, 0.01).listen();
        gui.add(transitionParams, "transitionSpeed", 0.5, 5, 0.01);

        this._transitionParams = transitionParams;
    }
}

window.onload = function () {
    (new App()).render();
}