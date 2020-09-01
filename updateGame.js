//======================================================================================//
//RESPONSIBLE FOR UPDATE TASKS AND BUTTONS
//START THE GAME AFTER ALL CODE IS LOADED
//======================================================================================//

//DEFINE ALL GLOBAL PATHS
//==========NAV CLIENT PATH=============
const clientLeftArrowButtonDOM = document.getElementById("btn-clients-left")
const clientSelectedButtonDOM = document.getElementById("btn-clients")
const clientRightArrowButtonDOM = document.getElementById("btn-clients-right")
const menuClientName = document.getElementById("menu-client-name")
const menuClientStages = document.getElementById('menu-client-stages')
const menuClientMaterialsNeeded = document.getElementById(`menu-client-materials`)

//==========NAV STATS PATH=============
const costPerHourDOM = document.getElementById("cost-per-hour")
const menuOwnClients = document.querySelector(".menu-own-company-clients")

//==========NAV STORE PATH=============
const storeCategoryContainerDOM = document.getElementById("store-category")
const storeBuyContainerDOM = document.getElementById("store-buy-items")

//==========NAV INVENTOR / WORKERS-SERVICES / WAREHOUSE PATH=============
const warehouseContainerDOM = document.getElementById("warehouse-container")
const workersAndServicesContainerDOM = document.getElementById("workers-services")

//==========NAV CONSTRUCTION PATH=============
const constructionContainerDOM = document.getElementById("construction-container")


//UPDATE TO PREVIOUS CLIENT
function selectClientRight() {
    currentClient++
    if (stateGame.clients[currentClient] != undefined || stateGame.clients[currentClient] != null) {
        return updateGame()
    }
    currentClient = 0
    updateGame()
}

//UPDATE TO NEXT CLIENT
function selectClientLeft() {
    currentClient--
    if (stateGame.clients[currentClient] != undefined || stateGame.clients[currentClient] != null) {
        return updateGame()
    }
    currentClient = stateGame.clients.length - 1
    updateGame()
}


// UPDATE ALL THE BUTTONS, CARDS AND THEIR RESPECTIVE .onclick CALLOUTS
function updateGame() {

    ownMoneyDOM.innerHTML = stateGame.ownCompany.money
    clientMoneyDOM.innerHTML = stateGame.clients[currentClient].money

    //UPDATE CLIENT
    menuClientName.innerHTML = stateGame.clients[currentClient].name.toUpperCase()
    clientSelectedButtonDOM.innerHTML = stateGame.clients[currentClient].name
    clientLeftArrowButtonDOM.onclick = () => { selectClientLeft() };
    clientRightArrowButtonDOM.onclick = () => { selectClientRight() };

    //UPDATE CATEGORY CATALOG BUTTONS
    storeCategoryContainerDOM.innerHTML = ""
    for (let categoryItem of store) {
        let button = document.createElement('button');
        button.innerHTML = categoryItem.name
        button.setAttribute('id', categoryItem.name);
        if (categoryItem.service == true || categoryItem.service == undefined) {
            button.setAttribute('class', 'btn-darkblue');
        }
        else button.setAttribute('class', 'btn');
        button.onclick = () => { itemList(categoryItem) };
        storeCategoryContainerDOM.appendChild(button);
    }

    //UPDATE WAREHOUSE BUTTONS
    warehouseContainerDOM.innerHTML = ""
    stateGame.clients[currentClient].warehouse.forEach(itemStored => {
        if (itemStored.count > 0) {
            let button = document.createElement('button');
            button.innerHTML =
                `${itemStored.name} <span id="${itemStored.name}">
            ${itemStored.count}
            </span>${itemStored.unit}`
            button.setAttribute('id', itemStored.name);
            button.setAttribute('class', `btn`);
            button.onclick = () => { };
            warehouseContainerDOM.appendChild(button);
        }
    })

    //UPDATE WORKERS AND SERVICES BUTTONS
    workersAndServicesContainerDOM.innerHTML = ""
    for (let workerOrServiceStored of stateGame.clients[currentClient].workers) {
        if (workerOrServiceStored.count > 0) {
            let button = document.createElement('button');
            button.innerHTML =
                `${workerOrServiceStored.count} ${workerOrServiceStored.name} $${workerOrServiceStored.price}/${workerOrServiceStored.unit} (Idle)`
            button.setAttribute('id', workerOrServiceStored.name);
            button.setAttribute('class', `btn-darkblue btn-sendback btn-${workerOrServiceStored.category}`);
            button.setAttribute('btn-sudocontent', `Send Back $${workerOrServiceStored.price}`);
            button.onclick = () => { sendBackWorkerOrService(workerOrServiceStored) };
            workersAndServicesContainerDOM.appendChild(button);
        }
    }

    //UPDATE COST PER HOUR
    costPerHourDOM.innerHTML = ""
    let button = document.createElement('button');
    button.innerHTML =
        `Total Cost $<span id="costperhour-value">${stateGame.clients[currentClient].costPerHour}</span>/hour ${extraShift}`
    button.setAttribute('id', `${Object.keys(stateGame.clients[currentClient].costPerHour)}`);
    button.setAttribute('class', `btn-darkblue`);
    button.onclick = () => { };
    costPerHourDOM.appendChild(button);

    //MENU CLIENTS ON COMPANY MENU
    menuOwnClients.innerHTML = ""
    for (let clients of stateGame.clients) {
        let button = document.createElement('li');
        button.innerHTML = clients.name
        button.setAttribute('id', clients.name);
        button.setAttribute('class', "btn");
        button.onclick = () => { };
        menuOwnClients.appendChild(button);
    }

    //MENU CURRENT CLIENT TASKS
    menuClientStages.innerHTML = ""
    menuClientMaterialsNeeded.innerHTML = ""
    const menuMaterialsArray = []
    for (let constructionSiteStage of stateGame.clients[currentClient].construction) {
        let button = document.createElement('ul');
        let stageArray = stateGame.clients[currentClient].construction
        button.innerHTML = `STAGE ${stageArray.indexOf(constructionSiteStage) + 1}:`
        button.setAttribute('id', `stage-${stageArray.indexOf(constructionSiteStage)}`);
        button.setAttribute('class', "margin");
        menuClientStages.appendChild(button);

        for (let constructionSiteElement of constructionSiteStage) {
            let button = document.createElement('li');
            button.innerHTML = `${constructionSiteElement.stage}`
            button.setAttribute('class', "btn");
            if (constructionSiteElement.progress >= 100) {
                button.setAttribute('class', "btn btn-clear");
                button.setAttribute('btn-sudocontent', 'Task Done');
            }
            document.getElementById(`stage-${stageArray.indexOf(constructionSiteStage)}`).appendChild(button);

            //UPDATE menuMaterialsArray WITH REMAINING NEEDED MATERIALS IN CLIENT MENU
            if (constructionSiteElement.progress < 100) {
                for (let materialNeeded of constructionSiteElement.materialNeeded) {

                    let materialFound = menuMaterialsArray.find(material => material[0] == materialNeeded.name)
                    if (materialFound != undefined) {
                        materialFound[1] += materialNeeded.count
                    } else {
                        menuMaterialsArray.push([materialNeeded.name, materialNeeded.count])
                    }
                }
            }
        }
    }
    //UPDATE REMAINING NEEDED MATERIALS IN CLIENT MENU
    for (let materialArray of menuMaterialsArray) {
        let button = document.createElement('button');
        button.innerHTML = `${materialArray[0]} (${materialArray[1]})`
        button.setAttribute('class', "btn");
        menuClientMaterialsNeeded.appendChild(button);
    }

    //UPDATE CONSTRUCTION SITE CARD TASKS
    constructionContainerDOM.innerHTML = ""
    for (let constructionSiteStage of stateGame.clients[currentClient].construction) {
        constructionSiteStage.forEach(constructionSiteElement => {

            //TRACK PROGRESS AND DRAW CARD
            if (constructionSiteElement.progress < 100) {
                //CREATE </div> TAG FIRST
                let div = document.createElement('div');
                div.innerHTML =
                    `<span id="${constructionSiteElement.stage}-${constructionSiteElement.index}">
                (${constructionSiteElement.stage})
                </span>
                <span id="${constructionSiteElement.stage}-${currentClient}-${constructionSiteElement.index}-progress">
                ${constructionSiteElement.progress} %
                </span> <br>`
                div.setAttribute('id', `${constructionSiteElement.stage}-${constructionSiteElement.index}`);
                div.setAttribute('class', `card center`);
                // div.onclick = () => {};
                constructionContainerDOM.appendChild(div);

                //THAN DRAW </button> TAG FOR ==WORKERS (OR SERVICES) NEEDED
                if (constructionSiteElement.workersNeeded) {
                    constructionSiteElement.workersNeeded.forEach(workersNeeded => {
                        let button = document.createElement('button');
                        let idButton = `${workersNeeded.type}-${constructionSiteElement.index}`
                        button.setAttribute('class', 'btn-darkblue');
                        button.setAttribute('value', `${workersNeeded.count}`);
                        //VERIFY IF WORKER (OR SERVICES) IS ALREADY ASSIGNED TO A JOB
                        if (workersNeeded.assigned == true) {
                            button.setAttribute('id', `${idButton}-assigned`);
                            button.setAttribute('btn-sudocontent', 'Unassign');
                            button.setAttribute('class', 'btn-darkblue btn-clear');
                            button.onclick = () => { assignWorkerOrService(workersNeeded, idButton) };
                            button.innerHTML = `${workersNeeded.count} ${workersNeeded.type} Assigned`
                        }
                        else {
                            button.setAttribute('id', idButton);
                            button.onclick = () => { assignWorkerOrService(workersNeeded, idButton) };
                            button.innerHTML = `${workersNeeded.count} ${workersNeeded.type} Needed`
                        }
                        const buttonWorkersNeeded = document.getElementById(`${constructionSiteElement.stage}-${constructionSiteElement.index}`)
                        buttonWorkersNeeded.appendChild(button);
                    })
                }

                //THAN DRAW </button> TAG FOR ==MATERIALS NEEDED==
                if (constructionSiteElement.materialNeeded) {
                    constructionSiteElement.materialNeeded.forEach(materialNeeded => {
                        let button = document.createElement('button');
                        button.innerHTML = `${materialNeeded.count} x ${materialNeeded.name}`
                        let idButton = `${materialNeeded.name}-${constructionSiteElement.index}`
                        button.setAttribute('id', idButton);
                        button.setAttribute('class', 'btn');
                        button.setAttribute('value', `${materialNeeded.count}`);
                        //VERIFY IF MATERIAL IS ALREADY ASSIGNED TO A JOB
                        if (materialNeeded.assigned == true) {
                            button.setAttribute('btn-sudocontent', 'Used');
                            button.setAttribute('class', 'btn-darkblue btn-clear');
                            button.onclick = () => { };
                            button.innerHTML = `${materialNeeded.count} ${materialNeeded.name}`
                        }
                        button.onclick = () => { assignMaterial(materialNeeded, idButton) };
                        const buttonMaterialsNeeded = document.getElementById(`${constructionSiteElement.stage}-${constructionSiteElement.index}`)
                        buttonMaterialsNeeded.appendChild(button);
                    })
                }
            }
        })

        let condition = constructionSiteStage.every((constructionSiteElement) => {
            return constructionSiteElement.progress >= 100
        });
        if (condition == false) {
            //console.log("break")
            break
        }

    }
}
//======================================================================================//
updateGame() //CALL UPDATE FUNCTION AFTER ALL CODE IS LOADED
//======================================================================================//


//CREATE THE ITEMS LIST OF A CATEGORY WHEN BUTTON IS CLICKED
function itemList(categoryItem) {
    storeBuyContainerDOM.innerHTML = ""
    categoryItem.stock.forEach(item => {
        //DRAW </li> FIRST
        let li = document.createElement('li');
        li.innerHTML =
            `<header>${item.name}</header>
            <section>
                <div>
                    <input id="${item.name}-buyinput" type="number" class="form"
                    min="1" max="9999" placeholder="" step="1"
                    value=1>
                </div>
                <span id="${item.name}-buylist"></span>
                <div class="unit">/${item.unit}</div>
            </section>`
        storeBuyContainerDOM.appendChild(li);

        //THAN DRAW </button>
        let button = document.createElement('button');
        button.innerHTML = `$${item.price}`
        button.setAttribute('id', item.name);
        button.setAttribute('class', 'btn btn-buy');
        button.setAttribute('value', item.price);
        button.onclick = () => { buyItem(item, categoryItem) };
        const spanId = `${item.name}-buylist`
        const buttonOnBuyList = document.getElementById(spanId)
        buttonOnBuyList.appendChild(button);
        return
    })
}


//OWN COMPANY WINDOW ON/OFF
function displayMenu() {
    const menuOwnCompanyButton = document.getElementById('menu-own-company');
    const menuOwnCompanyButtonOut = document.getElementById('menu-own-company-block');
    menuOwnCompanyButton.onclick = () => { menuCompanyOn() };
    function menuCompanyOn() { menuOwnCompanyButtonOut.style.display = "block" }
    menuOwnCompanyButtonOut.onclick = () => { menuCompanyOff() };
    function menuCompanyOff() { menuOwnCompanyButtonOut.style.display = "none" }

    const menuClientButton = document.getElementById('btn-clients');
    const menuClientButtonOut = document.getElementById('menu-client-block');
    menuClientButton.onclick = () => { menuClientOn() };
    function menuClientOn() { menuClientButtonOut.style.display = "block" }
    menuClientButtonOut.onclick = () => { menuClientOff() };
    function menuClientOff() { menuClientButtonOut.style.display = "none" }
}
displayMenu()