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

    const THREEPath = stateGame.THREEmodels

    //TARGET CANVAS, RENDERER, SCENE AND CAMERA
    //======================================================================================//
    const canvas = document.querySelector('canvas');
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    renderer.setClearColor("#bed2ab"); // BACKGROUND COLOR
    renderer.setPixelRatio(window.devicePixelRatio * 1); // CONTROLS RESOLUTION
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;

    //OUTLINE EFFECT ON RENDERER
    const effect = new OutlineEffect(renderer);

    //DISPLAY AXES FOR HELP
    let axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);


    //ORTHOGONAL CAMERA POSITION
    let aspect = window.innerWidth / window.innerHeight;
    let frustumSize = 30
    let aspectSize = frustumSize * aspect;
    const near = 1;
    const far = 200;

    const camera = new THREE.OrthographicCamera(aspectSize / - 2, aspectSize / 2, frustumSize / 2, frustumSize / - 2, near, far);

    //CAMERA POSITION
    camera.position.set(50, 50, 50); // (x, y, z) => (y = height)
    console.log("main -> camera", camera)

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



    const loadingManager = new THREE.LoadingManager()

    // loadingManager.onProgress = (loaded, total) =>
    //     console.log(loaded, total);

    // loadingManager.onLoad = () =>
    // console.log(`Loading complete!`)

    const colladaLoader = new ColladaLoader(loadingManager)



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





    //========================================================================//
    //RENDER FUNCTION
    //========================================================================//


    function checkDeleteTHREEModels() {
        const hasModelsToBeDeleted = THREEPath.deletedModels.length > 0

        if (hasModelsToBeDeleted) {
            for (let THREEmodel of THREEPath.deletedModels) {
                console.log("DELETED", THREEmodel);
                scene.remove(THREEmodel)
                THREEPath.deletedModels.splice(THREEmodel, 1)
                THREEmodel = null
            }
        }
    }

    function createTHREEModel() {
        for (const client of stateGame.clients) {

            const hasClient = Object.keys(THREEPath.clients)
                .find(item => item == client.id)

            if (!hasClient) THREEPath.clients[client.id] = {}

            const hasSiteModel = THREEPath.clients[client.id].THREEsite
            const hasTHREEModel = THREEPath.clients[client.id].THREEmodel

            if (!hasSiteModel && !hasTHREEModel) {
                const roadSiteFile = `https://raw.githubusercontent.com/mudoso/constructionSIM/master/models/roadSite.dae`
                const THREEmodelFile = `models/${client.constructionType}.dae`
                // const THREEmodelFile = `https://raw.githubusercontent.com/mudoso/constructionSIM/master/models/${client.constructionType}.dae`

                THREEPath.clients[client.id].THREEsite = {}
                THREEPath.clients[client.id].THREEmodel = {}

                // loadSiteModel(client, roadSiteFile)
                loadTHREEModel(client, roadSiteFile, 'THREEsite')
                loadTHREEModel(client, THREEmodelFile, 'THREEmodel')
            }
        }
    }

    function loadTHREEModel(client, THREEmodelFile, THREEmodel) {
        colladaLoader.load(THREEmodelFile, collada => {
            console.log(`CREATE THREEmodel (${client.name})`)
            THREEPath.clients[client.id][THREEmodel] = collada.scene
            THREEPath.clients[client.id][THREEmodel].position.set(0, 0, 0);
            THREEPath.clients[client.id][THREEmodel].name = `${client.name}`

            scene.add(THREEPath.clients[client.id][THREEmodel])

        }, load => {
            if (!load.lengthComputable) return

            const loadProgress = Math.round(load.loaded / load.total * 100, 2)

            console.log(`${client.id} (${loadProgress}% loaded)`)

            if (loadProgress >= 100) {
                THREEPath.clients[client.id].loaded = true
            }
        })
    }

    function hideAllTHREEModels() {
        for (const clientId in THREEPath.clients) {

            const isLoaded = THREEPath.clients[clientId].loaded

            if (!isLoaded)
                return console.log(`${clientId} not loaded`);

            const sketchUpModels = THREEPath.clients[clientId].THREEmodel.children[0].children

            for (const fullGroup of sketchUpModels) {
                fullGroup.children
                    .forEach(colladaModel => colladaModel.visible = false)
            }
        }
    }

    function controlVisibility() {
        const currentId = stateGame.clients[stateGame.clientIndex].id
        const isLoaded = THREEPath.clients[currentId].loaded

        if (!isLoaded)
            return console.log(`${currentId} not loaded`);

        const ModelInProgress = THREEPath.clients[currentId].THREEmodel.children[0].children
            .find(item => item.name == "constructionInProgress")
        const ModelDone = THREEPath.clients[currentId].THREEmodel.children[0].children
            .find(item => item.name == "constructionDone")
        const THREETerrain = THREEPath.clients[currentId].THREEmodel.children[0].children
            .find(item => item.name == "terrainSite")

        THREETerrain.visible = false

        const currentClient = stateGame.clients[stateGame.clientIndex]

        for (const constructionStage of currentClient.construction) {
            for (const { stage, progress } of constructionStage) {

                const currentSite = THREEPath.clients[currentId].THREEsite
                currentSite.visible = true

                const THREEInProgress = ModelInProgress.children
                    .find(item => item.name.replace(/_/g, " ") == stage)

                const THREEDone = ModelDone.children
                    .find(item => item.name.replace(/_/g, " ") == `${stage}Done`)

                {
                    //EXCEPTIONS
                    if (stage == "Land Clearing" && progress == 0)
                        THREEInProgress.visible = true

                    if (stage == "Excavation")
                        progress > 0
                            ? THREETerrain.visible = false
                            : THREETerrain.visible = true
                }

                const isInProgress = progress > 0 && progress < 100
                const isInProgressVisible = THREEInProgress.visible == true

                if (isInProgress && !isInProgressVisible) {
                    THREEInProgress.visible = true
                    THREEDone.visible = false
                }

                const isTaskDone = progress >= 100
                const isTaskDoneVisible = THREEDone.visible == true

                if (isTaskDone && !isTaskDoneVisible) {
                    THREEInProgress.visible = false
                    THREEDone.visible = true
                }
            }
        }
    }


    //========================================================================//
    //RENDER
    //========================================================================//


    function fps() {
        requestAnimationFrame(fps)
        stats.update();
    }

    function render() {
        const hasClients = stateGame.clients.length > 0

        checkDeleteTHREEModels()

        if (!hasClients)
            return effect.render(scene, camera)

        createTHREEModel()
        hideAllTHREEModels()
        controlVisibility()

        effect.render(scene, camera);
    }
    // requestAnimationFrame(render)
    setInterval(render, 2000)
    fps()
}
main();




