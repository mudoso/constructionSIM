import * as THREE from '/node_modules/three/build/three.module.js';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { ColladaLoader } from '/node_modules/three/examples/jsm/loaders/ColladaLoader.js';
import { GUI } from '/node_modules/three/examples/jsm/libs/dat.gui.module.js';
import { OutlineEffect } from '/node_modules/three/examples/jsm/effects/OutlineEffect.js';
import Stats from '/node_modules/three/examples/jsm/libs/stats.module.js';


let model = 80;

function main() {

    //TARGET CANVAS, RENDERER, SCENE AND CAMERA
    //======================================================================================//
    const canvas = document.querySelector('canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    const scene = new THREE.Scene();
    console.log("main -> scene", scene)

    renderer.setClearColor("#bed2ab"); // BACKGROUND COLOR
    renderer.setPixelRatio(window.devicePixelRatio * 1); // CONTROLS RESOLUTION
    renderer.setSize(window.innerWidth, window.innerHeight);

    //OUTLINE EFFECT ON RENDERER
    const effect = new OutlineEffect(renderer);

    //DISPLAY AXES FOR HELP
    var axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    //DISPLAY FRAMES PER SECOND
    const stats = createStats();
    // document.body.appendChild(stats.domElement);

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
    camera.position.set(50, 50, 50); // (x, y, z) => (y = height)


    //ORBIT FUNCTION
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(-12, 0, -10);
    controls.update();

    //LISTEN TO ORBIT CHANGES
    controls.addEventListener('change', render);


    //CREATED LIGHTS
    //======================================================================================//

    {
        const ambientLight = new THREE.AmbientLight(0x404040)
        scene.add(ambientLight);

        const light = new THREE.DirectionalLight(0xbbbbbb);
        const helper = new THREE.DirectionalLightHelper(light, 5);
        light.position.set(10, 30, 15);
        scene.add(light);
        // scene.add(helper);

        // const light = new THREE.DirectionalLight(0xFFFFFF, 1);
        // light.position.set(10, 30, 15);
        // scene.add(light);

    }


    //LOAD OBJECT
    //======================================================================================//


    // let landClearing
    // let Excavation

    // let loadingManager = new THREE.LoadingManager()
    // new ColladaLoader(loadingManager).load('Land Clearing.dae', (collada) => {
    //     landClearing = collada.scene
    //     landClearing.name = "Land Clearing"
    //     landClearing.position.set(0, 0, 0);
    //     scene.add(landClearing)
    // });

    // new ColladaLoader(loadingManager).load('Excavation.dae', (collada) => {
    //     Excavation = collada.scene
    //     Excavation.position.set(0, 0, 0);
    //     scene.add(Excavation)
    // });
    // console.log("main -> Excavation", Excavation)


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

    let clientCameraX
    let clientX
    let loadingManager = new THREE.LoadingManager()


    function render(time) {
        time *= 0.001;  // convert time to seconds

        clientX = 0
        clientCameraX = 50 + 100 * currentClient
        camera.position.set(clientCameraX, 50, 50);

        for (let client of stateGame.clients) {

            if (client.pointOnModel == undefined) {
                console.log("CREATE pointOnModel");
                clientX = 100 * stateGame.clients.indexOf(client)
                client.pointOnModel = { x: clientX, y: 0, z: 0 }
            }

            if (client.site == undefined) {
                new ColladaLoader(loadingManager).load(`models/roadSite.dae`, (collada) => {
                    console.log("CREATE roadSite")
                    client.site = collada.scene
                    client.site.position.set(client.pointOnModel.x, client.pointOnModel.y, client.pointOnModel.z);
                    client.site.name = `${client.name}`
                    scene.add(client.site)
                    effect.render(scene, camera);
                })
                new ColladaLoader(loadingManager).load(`models/terrainSite.dae`, (collada) => {
                    console.log("CREATE terrainSite")
                    client.terrain = collada.scene
                    client.terrain.position.set(client.pointOnModel.x, client.pointOnModel.y, client.pointOnModel.z);
                    client.terrain.name = `${client.name}`
                    scene.add(client.terrain)
                    effect.render(scene, camera);
                })
            }

            for (let constructionSiteStage of client.construction) {
                for (let constructionSiteElement of constructionSiteStage) {
                    if (constructionSiteElement.progress >= 100 && constructionSiteElement.loaded == true) {

                        console.log("DELETE COLLADA")
                        constructionSiteElement.loaded = false
                        scene.remove(constructionSiteElement.tridimensional)
                        new ColladaLoader(loadingManager).load(`models/${constructionSiteElement.stage}Done.dae`, (collada) => {
                            console.log("CREATE DONE COLLADA")
                            constructionSiteElement.tridimensional = collada.scene
                            constructionSiteElement.tridimensional.position.set(client.pointOnModel.x, client.pointOnModel.y, client.pointOnModel.z);
                            constructionSiteElement.tridimensional.name = `${constructionSiteElement.stage}`
                            scene.add(constructionSiteElement.tridimensional)
                            effect.render(scene, camera);
                        });
                    }
                    if ((constructionSiteElement.progress > 0 && constructionSiteElement.progress < 100) &&
                        constructionSiteElement.loaded != true) {

                        constructionSiteElement.loaded = true
                        new ColladaLoader(loadingManager).load(`models/${constructionSiteElement.stage}.dae`, (collada) => {
                            console.log("CREATE COLLADA")
                            constructionSiteElement.tridimensional = collada.scene
                            constructionSiteElement.tridimensional.position.set(client.pointOnModel.x, client.pointOnModel.y, client.pointOnModel.z);
                            constructionSiteElement.tridimensional.name = `${constructionSiteElement.stage}`
                            scene.add(constructionSiteElement.tridimensional)
                            effect.render(scene, camera);

                            if (client.terrain != undefined) {
                                console.log("DELETE TERRAIN")
                                scene.remove(client.terrain)
                            }
                        });
                    }
                }
            }
            //RENDER THE SCENE
            effect.render(scene, camera);
            // renderer.render(scene, camera);

            //UPDATES FRAMES PER SECOND
            stats.update();
        }
    }
    setInterval(render, 1000)
}
main();


