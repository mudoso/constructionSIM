// import * as THREE from './node_modules/three/build/three.module.js';
// import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
// import { ColladaLoader } from './node_modules/three/examples/jsm/loaders/ColladaLoader.js';
// import { OutlineEffect } from './node_modules/three/examples/jsm/effects/OutlineEffect.js';
// import Stats from './node_modules/three/examples/jsm/libs/stats.module.js';

import * as THREE from 'https://unpkg.com/three@0.120.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js';
import { ColladaLoader } from 'https://unpkg.com/three@0.120.1/examples/jsm/loaders/ColladaLoader.js';
import { OutlineEffect } from 'https://unpkg.com/three@0.120.1/examples/jsm/effects/OutlineEffect.js';
import Stats from 'https://unpkg.com/three@0.120.1/examples/jsm/libs/stats.module.js';


function main() {

    //TARGET CANVAS, RENDERER, SCENE AND CAMERA
    //======================================================================================//
    const canvas = document.querySelector('canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    const scene = new THREE.Scene();

    renderer.setClearColor("#bed2ab"); // BACKGROUND COLOR
    renderer.setPixelRatio(window.devicePixelRatio * 1); // CONTROLS RESOLUTION
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;

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
    controls.target.set(-7.5, 0, -7.5);
    controls.enabled = true
    controls.enableKeys = false
    controls.enablePan = false
    controls.minZoom = 1
    controls.maxZoom = 1.5
    controls.maxPolarAngle = Math.PI / 3
    controls.update();

    //LISTEN TO ORBIT CHANGES
    controls.addEventListener('change', render);


    //CREATED LIGHTS
    //======================================================================================//


    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight);
    const light = new THREE.DirectionalLight(0xbbbbbb);
    light.position.set(10, 30, 15);
    scene.add(light);


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

        for (let client of stateGame.clients) {

            function createTHREEModel() {
                if (client.THREEsite == null) {
                    client.THREEsite = {}
                    //CREATE ROAD FOR NEW CLIENT
                    new ColladaLoader(loadingManager).load(`https://raw.githubusercontent.com/mudoso/constructionSIM/master/models/roadSite.dae`, collada => {
                        console.log(`CREATE roadSite (${client.name})`)
                        client.THREEsite = collada.scene
                        client.THREEsite.position.set(0, 0, 0);
                        client.THREEsite.name = `${client.name}-roadSite`
                        scene.add(client.THREEsite)
                    })
                    //CREATE THREE MODEL FOR NEW CLIENT
                    // new ColladaLoader(loadingManager).load(`https://raw.githubusercontent.com/mudoso/constructionSIM/master/models/${client.constructionType}.dae`, (collada) => {
                    new ColladaLoader(loadingManager).load(`models/${client.constructionType}.dae`, collada => {
                        console.log(`CREATE THREEmodel (${client.name})`)
                        client.THREEmodel = collada.scene
                        client.THREEmodel.position.set(0, 0, 0);
                        client.THREEmodel.name = `${client.name}`
                        scene.add(client.THREEmodel)
                    })
                }
            }
            createTHREEModel()

            if (!client.THREEsite) return console.log(`LOADING roadSite.dae (${client.name})`);
            if (!client.THREEmodel) return console.log(`LOADING ${client.constructionType}.dae (${client.name})`);

            const sketchUpModels = client.THREEmodel.children[0].children
            for (let construction of sketchUpModels) {
                //HIDE ALL constructionDone
                if (construction.name == "constructionDone") {
                    construction.children.forEach(colladaModel => colladaModel.visible = false)
                }
                //HIDE ALL constructionInProgress
                if (construction.name == "constructionInProgress") {
                    construction.children.forEach(colladaModel => colladaModel.visible = false)
                }
                //HIDE ALL terrainSite
                if (construction.name == "terrainSite") construction.visible = false
            }
            //HIDE ALL ROAD
            client.THREEsite.visible = false
        }

        if (deletedModels.length > 0) {
            for (let THREEmodel of deletedModels) {
                console.log("DELETED", THREEmodel);
                scene.remove(THREEmodel)
                deletedModels.splice(THREEmodel, 1)
            }
        }

        let noClientsWithTHREEModel = stateGame.clients
            .every(client => { client.THREEmodel == null })
        if (noClientsWithTHREEModel) return effect.render(scene, camera);

        if (!stateGame.clients[currentClient].THREEmodel) return effect.render(scene, camera)

        //FIND THREE IN PROGRESS GROUP OF ELEMENTS
        let THREEInProgress = stateGame.clients[currentClient].THREEmodel.children[0].children
            .find(item => item.name == "constructionInProgress")
        //FIND THREE DONE GROUP OF ELEMENTS
        let THREEDone = stateGame.clients[currentClient].THREEmodel.children[0].children
            .find(item => item.name == "constructionDone")
        //FIND THREE TERRAIN ELEMENT
        let THREETerrain = stateGame.clients[currentClient].THREEmodel.children[0].children
            .find(item => item.name == "terrainSite")

        THREETerrain.visible = false
        if (THREETerrain.visible) THREETerrain.visible = false


        for (let constructionSiteStage of stateGame.clients[currentClient].construction) {
            for (let constructionSiteElement of constructionSiteStage) {

                //SHOW ROAD
                stateGame.clients[currentClient].THREEsite.visible = true

                //FIND THREE IN PROGRESS ELEMENTS
                let THREEConstructionElementInProgress = THREEInProgress.children
                    .find((item) => { return item.name.replace(/_/g, " ") == constructionSiteElement.stage })
                //FIND THREE DONE ELEMENTS
                let THREEConstructionElementDone = THREEDone.children
                    .find((item) => { return item.name.replace(/_/g, " ") == `${constructionSiteElement.stage}Done` })
                //CATCH THREE.JS MODELS ERRORS
                if (THREEConstructionElementDone == undefined || THREEConstructionElementDone == null) {
                    console.log(constructionSiteElement.stage, "NO THREE JS ###########");
                }

                //EXCEPTIONS
                if (constructionSiteElement.stage == "Land Clearing" && constructionSiteElement.progress <= 0) {
                    THREEConstructionElementInProgress.visible = true
                }
                if (constructionSiteElement.stage == "Excavation") {
                    THREETerrain.visible = true
                    if (constructionSiteElement.progress > 0) THREETerrain.visible = false
                }

                //TOGGLE ON CURRENT CONSTRUCTION TASK WHEN 0% < PROGRESS < 100%
                if ((constructionSiteElement.progress > 0 && constructionSiteElement.progress < 100) &&
                    THREEConstructionElementInProgress.visible != true) {

                    THREEConstructionElementInProgress.visible = true
                    THREEConstructionElementDone.visible = false
                }

                //TOGGLE OFF CURRENT CONSTRUCTION TASK AND ADD THE "DONE" ONE WHEN PROGRESS REACHES 100%
                if (constructionSiteElement.progress >= 100 && THREEConstructionElementDone.visible != true) {

                    THREEConstructionElementInProgress.visible = false
                    THREEConstructionElementDone.visible = true
                }
            }
        }

        //RENDER THE SCENE
        effect.render(scene, camera);
    }
    setInterval(render, 2000)
    fps()
}
main();