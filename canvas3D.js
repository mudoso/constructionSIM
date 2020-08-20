import * as THREE from '/node_modules/three/build/three.module.js';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { ColladaLoader } from '/node_modules/three/examples/jsm/loaders/ColladaLoader.js';
import Stats from '/node_modules/three/examples/jsm/libs/stats.module.js';


function main() {

    //TARGET CANVAS, RENDERER, SCENE AND CAMERA
    //======================================================================================//
    const canvas = document.querySelector('canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    const scene = new THREE.Scene();

    renderer.setClearColor("#bed2ab"); // BACKGROUND COLOR
    renderer.setPixelRatio(window.devicePixelRatio * 1); // CONTROLS RESOLUTION
    renderer.setSize(window.innerWidth, window.innerHeight);

    const stats = createStats();
    document.body.appendChild(stats.domElement);


    //DISPLAY AXES FOR HELP
    var axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    //DISPLAY FRAMES PER SECOND
    function createStats() {
        let stats = new Stats();
        stats.setMode(0);

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0';
        stats.domElement.style.top = '0';

        return stats;
    }


    //ORTHOGONAL CAMERA POSITION
    let aspect = window.innerWidth / window.innerHeight;
    let frustumSize = 30
    let aspectSize = frustumSize * aspect;
    const near = 1;
    const far = 200;

    const camera = new THREE.OrthographicCamera(aspectSize / - 2, aspectSize / 2, frustumSize / 2, frustumSize / - 2, near, far);

    //CAMERA POSITION
    camera.position.set(50, 50, 50); // (x, y, z) => (z = height)

    //ORBIT FUNCTION
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(-7, 0, -7);
    controls.update();

    //LISTEN TO ORBIT CHANGES
    controls.addEventListener('change', render);


    //CREATED LIGHTS
    //======================================================================================//

    {
        scene.add(new THREE.AmbientLight(0x111111));

        const light = new THREE.DirectionalLight(0xFFFFFF, 1);
        light.position.set(30, 30, 30);
        scene.add(light);
    }


    //LOAD OBJECT
    //======================================================================================//

    {
        let house

        let loadingManager = new THREE.LoadingManager()

        new ColladaLoader(loadingManager).load('casa-teste.dae', (collada) => {
            house = collada.scene,

                house.material = new THREE.MeshPhongMaterial({ color: 0x44aa88 }),
                scene.add(house)

        });

        //TESTING LISTENER TO DELETE HOUSE MODEL
        function remove() {
            scene.remove(house)
        }
        window.addEventListener('click', () => {
            remove();
            render();
        });
    }

    //CREATED OBJECTS
    //======================================================================================//

    {
        const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
        const grassMaterial = new THREE.MeshPhongMaterial({ color: 0x44aa88 });

        const cube = new THREE.Mesh(boxGeometry, grassMaterial);
        cube.position.set(0, 5, 0);
        // scene.add(cube);
    }


    //RESIZE FUNCTION
    //======================================================================================//

    function onWindowResize() {

        let aspect = window.innerWidth / window.innerHeight;
        camera.left = - frustumSize * aspect / 2;
        camera.right = frustumSize * aspect / 2;
        camera.top = frustumSize / 2;
        camera.bottom = - frustumSize / 2;

        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render()
    }
    //LISTEN TO RESIZE WINDOW
    window.addEventListener('resize', onWindowResize, false);


    //TARGET CANVAS, RENDERER AND CAMERA
    //======================================================================================//

    function render(time) {
        time *= 0.001;  // convert time to seconds

        //RENDER THE SCENE
        renderer.render(scene, camera);

        //UPDATES FRAMES PER SECOND
        stats.update();
    }
    setInterval(render, 1000)
}
main();


