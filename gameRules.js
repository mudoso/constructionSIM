//################## NEED TO BE IMPLEMENTED #########################

// ADDED A FRONT PAGE TO INPUT COMPANY NAME, START NEW GAME OR LOAD GAME
// MAKE A SAVE SYSTEM TO LocalStorage
// MAKE A HELP TOOLTIP TO SHOW INFORMATION ABOUT THE COMPONENTS
// A SKILLS SET IN THE COMPANY STATS
// SKILLS [Network, Construction, Management]
// MAKES SKILLS IMPACT IN THE GAME
// CHANGE TASK PROGRESS FORMULA TO WORK IN ACCORD WITH SKILLS AND DIFFICULT OF THE TASK
// getNewAvailableClients() SHOW "NO CLIENT WHEN THERE IS NO CLIENT IN THAT DAY"
// ?? MAKE MATERIALS AND SERVICES TAKE TIME TO COME TO WORK SITE
// ?? CHANGE CLOCK FUNCTION TO SHOW MORNING, EVENING, AFTERNOON
// ?? MAKE THREE.JS LIGHTs TO CHANGE ACCORDING TO TIME OF THE DAY
// ?? MAKE THREE.JS MeshToonMaterial SHADE EFFECT WORK
// REFACTORING THE CODE AND GET RID OF EXCESSIVE COMMENTS


//======================================================================================//
//RESPONSIBLE FOR DEFINE ALL GAME RULES
//======================================================================================//

//DEFINE ALL GLOBAL VARIABLES
let currentClient = 0
const deletedModels = []


//DEFINE ALL GLOBAL PATHS
//==========NAV STATS PATH=============
const companyNameDOM = document.getElementById("own-company-name")
const ownMoneyDOM = document.querySelectorAll(".own-money")
const ownExperience = document.querySelector(".menu-own-lvl-progress")
let clientMoneyDOM = document.querySelectorAll(".client-money")
const timeSpan = document.getElementById('time');
const dayDom = document.getElementById("day")


//======================================================================================//
//RESPONSIBLE FOR CLOCK RELATED FUNCTIONS
//======================================================================================//

// SET TIME
stateGame.clock.minute = 0
stateGame.clock.hour = 8
stateGame.clock.day = 1


function timeRules() {

    updateNameAndMoneyDOM()

    let min = stateGame.clock.minute
    let hour = stateGame.clock.hour
    let day = stateGame.clock.day

    if (stateGame.clients[currentClient] != null) {
        clientMoneyDOM.forEach(DOM => DOM.innerHTML = stateGame.clients[currentClient].money)
    }
    dayDom.innerHTML = stateGame.clock.day

    min++

    if (min >= 60) { //SET END OF AN HOUR
        min = 0
        hour++
    }
    if (hour == 16) { //SET END OF WORK HOUR
        hour = 8
        day++
        getNewAvailableClients()
        renderDOM()
    }
    let min00 = ('0' + min).slice(-2)
    // let date = new Date();
    // let h = date.getHours();
    timeSpan.textContent = `${hour}:${min00}`
    stateGame.clock.minute = min
    stateGame.clock.hour = hour
    stateGame.clock.day = day

    getCurrentExperience()

    if (stateGame.clients[currentClient] != null) {
        checkCostPerHour()
        verifyAssigned()
    }
}
setInterval(timeRules, 1000); //START CLOCK
getNewAvailableClients(1)

function getCurrentExperience() {
    const currentExperience = stateGame.ownCompany.experience
    const showExperience = (currentExperience / 1000) * 100
    ownExperience.style.width = `${showExperience}%`
}

function updateNameAndMoneyDOM() {
    companyNameDOM.innerHTML = stateGame.ownCompany.name
    ownMoneyDOM.forEach(DOM => DOM.innerHTML = stateGame.ownCompany.money)
}

function checkCostPerHour() {
    for (let targetClient of stateGame.clients) {
        targetClient.costPerHour = 0
        for (let workersOnSite of targetClient.workers) {
            const workerTypeExists = workersOnSite != null

            if (workerTypeExists) {
                const workersAssignedCount = checkAssignedWorkers(targetClient, workersOnSite)
                const isWorkerHired = workersOnSite.count > 0 || workersAssignedCount > 0

                if (isWorkerHired) {
                    const totalWorkersCount = workersAssignedCount + workersOnSite.count
                    const workerTypeCost = workersOnSite.price

                    const costPerHourPerType = totalWorkersCount * workerTypeCost

                    workersOnSite.timer++
                    targetClient.costPerHour += costPerHourPerType

                    const workerCompletedHourCycle = workersOnSite.timer >= 60 || stateGame.clock.hour == 16

                    if (workerCompletedHourCycle) {
                        workersOnSite.timer = 0
                        deduceCostPerHour(targetClient, workersOnSite, costPerHourPerType)
                    }
                }
            }
        }
    }
    renderCostPerHourValueDOM()
}

function renderCostPerHourValueDOM() {
    const costPerHourValueDOM = document.getElementById("costperhour-value")
    costPerHourValueDOM.innerHTML = stateGame.clients[currentClient].costPerHour
}

function checkAssignedWorkers(targetClient, workersOnSite) {
    let workersAssignedCount = 0
    for (let constructionSiteStage of targetClient.construction) {
        for (let constructionSiteElement of constructionSiteStage) {
            for (let workersAssigned of constructionSiteElement.workersNeeded) {
                const isWorkerAssigned = workersAssigned.type == workersOnSite.name && workersAssigned.assigned == true
                if (isWorkerAssigned) {
                    workersAssignedCount += workersAssigned.count
                }
            }
        }
    }
    return workersAssignedCount
}

function deduceCostPerHour(targetClient, workersOnSite, costPerHourPerType) {
    const insufficientClientMoney = targetClient.money < costPerHourPerType

    if (insufficientClientMoney) {
        unassignWorkers(targetClient, workersOnSite)
        deduceOwnMoney(targetClient, costPerHourPerType)
        workersOnSite.count = 0
        renderDOM()
        return
    }
    targetClient.money -= costPerHourPerType
}

function unassignWorkers(targetClient, workersOnSite) {
    for (let constructionSiteStage of targetClient.construction) {
        for (let constructionSiteElement of constructionSiteStage) {
            for (let workerNeeded of constructionSiteElement.workersNeeded) {
                if (workerNeeded.assigned == true && workerNeeded.type == workersOnSite.name) {
                    workersOnSite.count += workerNeeded.count
                    workerNeeded.assigned = false
                }
            }
        }
    }
}

function deduceOwnMoney(targetClient, costPerHourPerType) {
    targetClient.money -= costPerHourPerType
    stateGame.ownCompany.money += targetClient.money
    targetClient.money = 0
}

//======================================================================================//
//END CLOCK FUNCTIONS



//======================================================================================//
//RESPONSIBLE FOR GET NEW CLIENTS OF THE DAY
//======================================================================================//


function randomNumberInteger(min = 0, max = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}


function getNewAvailableClients(numberOfClients = randomNumberInteger(0, 3)) {
    stateGame.lookingForClients = []

    getNewClientList(numberOfClients).forEach(clientName => stateGame.lookingForClients
        .push(new Client(clientName)))


    function getNewClientList(numberOfClients) {
        const newClientsList = Array(numberOfClients).fill().map(() => {
            const randomIndex = randomNumberInteger(0, clientNames.length - 1)
            return clientNames[randomIndex]
        })
        return newClientsList
    }
}


function newClientSelectorBudgetOffer(client, inputOfferClient) {
    const index = stateGame.lookingForClients.indexOf(client)
    const ownCompanyLevelDelta = (Math.random() * stateGame.ownCompany.level / 10) + 1
    const maxClientBudget = client.money * ownCompanyLevelDelta
    const minClientBudget = client.money * 0.5

    if (client.attempt == null) client.attempt = randomCount(stateGame.ownCompany.level) + 1
    if (inputOfferClient.value < minClientBudget || inputOfferClient.value > maxClientBudget) {
        client.attempt -= 1

        if (client.attempt <= 0) stateGame.lookingForClients.splice(index, 1)
        return renderDOM()
    }
    client.money = parseInt(inputOfferClient.value)
    stateGame.clients.unshift(client)
    stateGame.lookingForClients.splice(index, 1);
    renderDOM()
}


//======================================================================================//
//RESPONSIBLE FOR ALL TASKS FUNCTIONS RULES RELATED
//======================================================================================//


function verifyAssigned() {
    for (let targetClient of stateGame.clients) {
        for (let constructionSiteStage of targetClient.construction) {
            for (let constructionSiteElement of constructionSiteStage) {

                if (constructionSiteElement.progress < 100) {
                    const allWorkersAssigned = verifyAssignedWorkers(constructionSiteElement)
                    const allMaterialsAssigned = verifyAssignedMaterials(constructionSiteElement)

                    if (allWorkersAssigned) {
                        const noMaterialNeeded = allMaterialsAssigned === undefined
                        if (noMaterialNeeded || allMaterialsAssigned) {
                            startTask(constructionSiteElement, targetClient)
                        }
                    }
                }
            }
            const constructionSiteStageComplete = constructionSiteStage
                .every(constructionSiteElement => constructionSiteElement.progress >= 100);
            if (!constructionSiteStageComplete) break
        }
    }
}

function verifyAssignedWorkers(constructionSiteElement) {
    const hasWorkerNeeded = constructionSiteElement.workersNeeded[0]

    if (hasWorkerNeeded) {
        return constructionSiteElement.workersNeeded
            .every(workersNeeded => workersNeeded.assigned)
    }
}

function verifyAssignedMaterials(constructionSiteElement) {
    const hasMaterialNeeded = constructionSiteElement.materialNeeded[0]

    if (hasMaterialNeeded) {
        return constructionSiteElement.materialNeeded
            .every(materialNeeded => materialNeeded.assigned)
    }
}

function startTask(constructionSiteElement, targetClient) {
    if (constructionSiteElement == undefined) { console.log("ERROR") }

    if (constructionSiteElement.progress < 100) {

        constructionSiteElement.progress += 1 //PROGRESS RULE

        drawProgressShadowTask(constructionSiteElement)

        const cardTaskPercentage = document.getElementById(`${constructionSiteElement.stage}-${stateGame.clients.indexOf(targetClient)}-${constructionSiteElement.index}-progress`)
        if (cardTaskPercentage == undefined || cardTaskPercentage == null) { return }
        else cardTaskPercentage.innerHTML = `${constructionSiteElement.progress} %`
    }
    // WHEN TASK REACH 100% UPDATE AND SEND WORKERS BACK TO STORE?
    if (constructionSiteElement.progress >= 100) {
        for (let workerAssigned of constructionSiteElement.workersNeeded) {
            for (let workersOnSite of targetClient.workers) {
                if (workerAssigned.type == workersOnSite.name && workerAssigned.assigned == true) {
                    workersOnSite.count += workerAssigned.count
                    workerAssigned.count = 0
                    workerAssigned.assigned = false
                    renderDOM()
                }
            }
        }
    }
}


//SEND THE WORKER(OR SERVICE) BACK AND DEDUCE COST
function sendBackWorkerOrService(workerOrServiceStored) {
    stateGame.clients[currentClient].costPerHour -= workerOrServiceStored.price

    remainingCost = workerOrServiceStored.timer / 60
    // remainingCost = remainingCost * workerOrServiceStored.price
    console.log(workerOrServiceStored.timer)
    stateGame.clients[currentClient].money -= workerOrServiceStored.price
    workerOrServiceStored.count--
    renderDOM()
}

function assignWorkerOrService(workersNeeded, idButton) {

    for (let workersOnSite of stateGame.clients[currentClient].workers) {
        //ASSIGN WORKER TO A TASK
        if (workersOnSite.name == workersNeeded.type &&
            workersOnSite.count >= workersNeeded.count) {
            workersNeeded.assigned = true
            workersOnSite.count -= workersNeeded.count
            return renderDOM()
        }
        //UNASSIGN WORKER TO A TASK
        if (workersOnSite.name == workersNeeded.type &&
            workersNeeded.assigned == true) {
            workersNeeded.assigned = false
            workersOnSite.count += workersNeeded.count
            return renderDOM()
        }
    }
}

function assignMaterial(materialNeeded, idButton) {
    for (let materialOnWarehouse of stateGame.clients[currentClient].warehouse) {
        if (materialOnWarehouse.name == materialNeeded.name &&
            materialOnWarehouse.count >= materialNeeded.count) {
            //ASSIGN MATERIAL TO A TASK
            materialNeeded.assigned = true
            materialOnWarehouse.count -= materialNeeded.count
            return renderDOM()
        }
    }
}

function completeClientConstruction() {
    stateGame.clients[currentClient].money
    stateGame.ownCompany.money += stateGame.clients[currentClient].money
    stateGame.clients[currentClient].money = 0

    stateGame.ownCompany.experience += 200

    deletedModels.push(stateGame.clients[currentClient].THREEmodel)
    deletedModels.push(stateGame.clients[currentClient].THREEsite)
    stateGame.clients[currentClient] = null
    stateGame.clients.splice(currentClient, 1)
    if (currentClient > 0) currentClient--
    renderDOM()
}

function drawProgressShadowTask(constructionSiteElement) {
    const cardTask = document.getElementById(`${constructionSiteElement.stage}-${constructionSiteElement.index}`)
    const getCurrentWidthCard = getComputedStyle(cardTask).width.split('px').slice(0, -1)[0]
    const progressWidthCSS = (constructionSiteElement.progress / 100) * getCurrentWidthCard
    const shadowColor = `rgb(115 170 115 / 20%)`

    cardTask.style.boxShadow = `inset ${progressWidthCSS}px 0 ${shadowColor}`
}


//======================================================================================//
//END TASKS FUNCTIONS RULES



//RESPONSIBLE FOR HANDLE SEND MONEY TO CLIENT FUNCTION
//======================================================================================//

function handleSendMoneyClient() {
    const sendMoneyBtn = document.getElementById('send-money');
    const sendMoneyInput = document.getElementById('send-own-money');

    sendMoneyBtn.onclick = () => { sendMoneyToClient() };

    function sendMoneyToClient() {
        let countSent = parseInt(sendMoneyInput.value)
        sendMoneyInput.value = 0
        if (countSent > stateGame.ownCompany.money) return console.log("Not enough money");

        stateGame.ownCompany.money -= countSent
        stateGame.clients[currentClient].money += countSent
    }
}
handleSendMoneyClient()



//======================================================================================//
//RESPONSIBLE FOR ALL STORE AND WAREHOUSE FUNCTIONS RULES RELATED
//======================================================================================//



//ADD ITEMS TO WAREHOUSE(IF ITS A MATERIAL) OR SITE(IF ITS A WORKER/SERVICE)
function buyItem(itemBought, categoryItem) {
    const inputCountId = `${itemBought.name}-buyinput`
    const getCount = document.getElementById(inputCountId);

    const noClientSelected = stateGame.clients[currentClient] == null
    const isInvalidInput = itemBought == null || getCount == null
    const isInvalidValue = getCount.value == null || getCount.value < 1

    if (noClientSelected) return console.log("No Client Selected")
    if (isInvalidInput) return console.log("Invalid Input")
    if (isInvalidValue) return getCount.value = 1

    const noClientMoney = stateGame.clients[currentClient].money == 0
    if (noClientMoney) return console.log("Not Enough Client Money")

    const countBought = parseInt(getCount.value)
    const moneySpent = countBought * itemBought.price

    const isItemBoughtMaterial = !itemBought.service
    if (isItemBoughtMaterial) {
        const isWarehouseFull = checkWarehouseSpace()
        if (isWarehouseFull) return ("Warehouse Full")
        handleBoughtMaterials()
    }

    getCount.value = 1

    addItemBoughtToContainer()
    renderDOM()


    // buyItem FUNCTIONS ============================================================//

    function checkWarehouseSpace() {
        const isItemBoughtMaterial = !itemBought.service

        if (isItemBoughtMaterial) {
            const volumeStored = stateGame.clients[currentClient].warehouse
                .reduce((acc, item) => { return acc + (item.count * item.volume) }, 0)

            const isVolumeHigherThanWarehouseLimit = (volumeStored + countBought * itemBought.volume) > stateGame.clients[currentClient].warehouseLimit
            return isVolumeHigherThanWarehouseLimit
        }
    }

    function handleBoughtMaterials() {
        const notEnoughClientMoney = stateGame.clients[currentClient].money <= moneySpent

        if (notEnoughClientMoney) return deduceOwnAndClientMoney()
        stateGame.clients[currentClient].money -= moneySpent
    }

    function deduceOwnAndClientMoney() {
        stateGame.clients[currentClient].money -= moneySpent
        stateGame.ownCompany.money += stateGame.clients[currentClient].money
        stateGame.clients[currentClient].money = 0
    }

    function addItemBoughtToContainer() {
        const warehouseOrSiteContainer = checkContainer()
        createItemObject(warehouseOrSiteContainer)

        const ItemStored = warehouseOrSiteContainer
            .find(itemStored => itemStored.name === itemBought.name)

        ItemStored.count = ItemStored.count + countBought;
    }

    function checkContainer() {
        const isService = itemBought.service

        if (isService) return stateGame.clients[currentClient].workers
        return stateGame.clients[currentClient].warehouse
    }

    function createItemObject(warehouseOrSiteContainer) {
        const isItemStored = warehouseOrSiteContainer
            .some(itemStored => itemStored.name === itemBought.name)

        if (!isItemStored) {
            const newItemStored = { ...itemBought, "count": 0, "volumeTotal": 0, }
            warehouseOrSiteContainer.unshift(newItemStored)
        }
    }
}

function discardWarehouseItem(materialStored) {
    const warehouseContainer = stateGame.clients[currentClient].warehouse
    const indexOfItemSelected = warehouseContainer.indexOf(materialStored)
    warehouseContainer.splice(indexOfItemSelected, 1)
    renderDOM()
}



//======================================================================================//
//END STORE FUNCTIONS RULES