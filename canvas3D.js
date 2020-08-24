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
    document.body.appendChild(stats.domElement);

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
    controls.target.set(- 12, 0, -10);
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

    // let ternero

    // let loadingManager = new THREE.LoadingManager()
    // new ColladaLoader(loadingManager).load('models/TEST-02.dae', (collada) => {
    //     ternero = collada.scene
    //     ternero.name = `${stateGame.clients[currentClient].name}-construction`
    //     ternero.position.set(0, 0, 0);
    //     scene.add(ternero)
    //     console.log(ternero.children[0].children)
    //     for (let construction of ternero.children[0].children) {
    //         // Construction.visible = false
    //         if (construction.name == "constructionDone") {
    //             construction.children.forEach(group => {
    //                 group.visible = false
    //             });
    //         }
    //         if (construction.name == "constructionInProgress") {
    //             construction.children.forEach(group => {
    //                 group.visible = false
    //             });
    //         }
    //     }

    // });


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

    //THREE.js "GLOBAL" VARIABLES BEFORE RENDER STARTS
    let clientCameraX
    let clientX
    let loadingManager = new THREE.LoadingManager()

    function fps() {
        //UPDATES FRAMES PER SECOND
        requestAnimationFrame(fps)
        stats.update();
    }

    function render(time) {
        time *= 0.001;  // convert time to seconds

        //CLIENT CAMERA FORMULA
        clientX = 0
        clientCameraX = 50 + 100 * currentClient
        camera.position.set(clientCameraX, 50, 50);
        controls.target.set(clientCameraX - 50 - 12, 0, -10);

        for (let client of stateGame.clients) {
            //ADD CAMERA POINT TO CLIENT
            if (client.pointOnModel == undefined) {
                console.log("CREATE pointOnModel");
                clientX = 100 * stateGame.clients.indexOf(client)
                client.pointOnModel = { x: clientX, y: 0, z: 0 }
            }
            if (client.site == undefined) {
                //CREATE ROAD FOR NEW CLIENT
                new ColladaLoader(loadingManager).load(`models/roadSite.dae`, (collada) => {
                    console.log("CREATE roadSite")
                    client.site = collada.scene
                    client.site.position.set(client.pointOnModel.x, client.pointOnModel.y, client.pointOnModel.z);
                    client.site.name = `${client.name}-roadSite`
                    scene.add(client.site)
                })
                //CREATE THREE MODEL FOR NEW CLIENT
                new ColladaLoader(loadingManager).load(`models/TEST-02.dae`, (collada) => {
                    console.log("CREATE THREEmodel")
                    client.THREEmodel = collada.scene
                    client.THREEmodel.position.set(client.pointOnModel.x, client.pointOnModel.y, client.pointOnModel.z);
                    client.THREEmodel.name = `${client.name}`
                    scene.add(client.THREEmodel)

                    for (let construction of client.THREEmodel.children[0].children) {
                        //HIDE ALL constructionDone 
                        if (construction.name == "constructionDone") {
                            construction.children.forEach(group => {
                                group.visible = false
                            });
                        }
                        //HIDE ALL constructionInProgress 
                        if (construction.name == "constructionInProgress") {
                            construction.children.forEach(group => {
                                group.visible = false

                                //IF TERRAIN NEEDS CLEARING SET VEGETATION/GARBAGE TO VISIBLE
                                if (group.name.replace(/_/g, " ") == "Land Clearing") {
                                    group.visible = true
                                }
                            });
                        }
                    }
                    effect.render(scene, camera);
                })
            }

            //FIND THREE IN PROGRESS GROUP OF ELEMENTS
            let THREEInProgress = client.THREEmodel.children[0].children.find((item) => {
                return item.name == "constructionInProgress"
            })
            //FIND THREE DONE GROUP OF ELEMENTS
            let THREEDone = client.THREEmodel.children[0].children.find((item) => {
                return item.name == "constructionDone"
            })

            if (THREEInProgress == undefined) {
                console.log("No Three.js Model");
            }

            for (let constructionSiteStage of client.construction) {
                for (let constructionSiteElement of constructionSiteStage) {

                    //FIND THREE IN PROGRESS ELEMENTS
                    let THREEConstructionElementInProgress = THREEInProgress.children.find((item) => {
                        return item.name.replace(/_/g, " ") == constructionSiteElement.stage
                    })
                    //FIND THREE DONE ELEMENTS
                    let THREEConstructionElementDone = THREEDone.children.find((item) => {
                        return item.name.replace(/_/g, " ") == `${constructionSiteElement.stage}Done`
                    })

                    //ADD CURRENT CONSTRUCTION TASK WHEN 0% < PROGRESS < 100%
                    if ((constructionSiteElement.progress > 0 && constructionSiteElement.progress < 100) &&
                        THREEConstructionElementInProgress.visible != true) {

                        THREEConstructionElementInProgress.visible = true
                        THREEConstructionElementDone.visible = false

                        //REMOVES TERRAIN IF THERE IS A EXCAVATION
                        if (constructionSiteElement.stage == "Excavation") {
                            let clientTerrain = client.THREEmodel.children[0].children.find((item) => {
                                return item.name == "terrainSite"
                            })
                            clientTerrain.visible = false
                        }
                    }

                    //DELETE CURRENT CONSTRUCTION TASK AND ADD THE "DONE" ONE WHEN PROGRESS REACHES 100%
                    if (constructionSiteElement.progress >= 100 && THREEConstructionElementDone.visible != true) {

                        THREEConstructionElementInProgress.visible = false
                        THREEConstructionElementDone.visible = true
                    }
                }
            }
            //RENDER THE SCENE
            effect.render(scene, camera);
            // renderer.render(scene, camera);

            //UPDATES FRAMES PER SECOND
            // stats.update();
        }
    }
    setInterval(render, 1000)
    fps()
}
main();