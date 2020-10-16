//################## NEED TO BE IMPLEMENTED #########################

// ADDED A FRONT PAGE TO INPUT COMPANY NAME, START NEW GAME OR LOAD GAME
// MAKE A SAVE SYSTEM TO LocalStorage
// MAKE A HELP TOOLTIP TO SHOW INFORMATION ABOUT THE COMPONENTS
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

//DEFINE ALL GLOBAL PATHS
//==========NAV STATS PATH=============
const clock = stateGame.clock
const companyNameDOM = document.getElementById("own-company-name")
const ownMoneyDOM = document.querySelectorAll(".own-money")
const ownLevelDOM = document.querySelectorAll(".own-lvl")
let clientMoneyDOM = document.querySelectorAll(".client-money")
const timeSpan = document.getElementById('time');


//DEFINE ALL GLOBAL VARIABLES
var currentClient = 0
var deletedModels = []
clock.timeScale = 1000


//======================================================================================//
//RESPONSIBLE FOR CLOCK RELATED FUNCTIONS
//======================================================================================//

// SET TIME
clock.minute = 0
clock.hour = 8
clock.day = 1


function timeRules() {
    const dayDom = document.getElementById("day")

    dayDom.innerHTML = clock.day

    clock.minute++
    clock.minuteAccumulated++

    const minuteCycle = clock.minute >= 60
    const dayCycle = clock.hour >= 16

    if (minuteCycle) {
        clock.minute = 0
        clock.hour++
    }
    if (dayCycle) {
        clock.hour = 8
        clock.day++
        getNewAvailableClients(0)
        getNewLookingAttempts()
        rendererDOM.all()
    }
    let min00 = ('0' + clock.minute).slice(-2)
    timeSpan.textContent = `${clock.hour}:${min00}`

    if (stateGame.clients[currentClient] != null) {
        checkCostPerHour()
        handleTaskProgress()
    }
}
let timeClockRules = setInterval(timeRules, clock.timeScale); //START CLOCK


function listenerFunctions() {

    updateOwnCompanyPropDOM()
    updateClientMoneyDOM()
    updateNumberOfNewClientsDOM()

    getCurrentExperience()
    rendererDOM.displayAvailableSkillPoints()
    rendererDOM.displaySkillBtn()
    rendererDOM.updateCurrentSkillPoints()
}
setInterval(listenerFunctions, 500)


function changeTimeSpeed(timeScale = 0) {
    clock.timeScale = timeScale
    clearInterval(timeClockRules)
    if (timeScale > 0) {
        timeClockRules = setInterval(timeRules, clock.timeScale);
    }
}

function stopTime(speedPlayBtn) {
    speedPlayBtn.innerHTML = '&#8213;'
    changeTimeSpeed(0)
}

function speedTime(speedPlayBtn) {
    const speedOne = 1000
    const speedTwo = 400
    const speedThree = 50

    switch (clock.timeScale) {
        default:
            speedPlayBtn.innerHTML = '&#9658;'
            changeTimeSpeed(speedOne)
            break;
        case speedOne:
            speedPlayBtn.innerHTML = '&#9658;&#9658;'
            changeTimeSpeed(speedTwo)
            break;
        case speedTwo:
            speedPlayBtn.innerHTML = '&#9658;&#9658;&#9658;'
            changeTimeSpeed(speedThree)
            break;
    }
}

function researchNewClients(targetHTML) {
    if (clock.timeScale <= 0) return

    const reticenceCounter = drawReticence(targetHTML)

    const skillValue = stateGame.ownCompany.skills.network
    const researchTime = clock.minuteAccumulated + (60 - skillValue * 2)

    const researchNewClients = setInterval(() => {
        if (clock.minuteAccumulated < researchTime) return

        const hasSomeClient = stateGame.clients.length > 0
        const SkillDelta = Math.floor(120 * skillValue / 10)
        const remainingTime = clock.minuteAccumulated + 60 + SkillDelta

        stateGame.lookingForClients.lookingAttempts--
        stateGame.lookingForClients.emojiText = ''
        hasSomeClient
            ? getNewAvailableClients()
            : getNewAvailableClients(1)
        clearNewClientsList(remainingTime)
        rendererDOM.newClientSelector()

        clearInterval(reticenceCounter)
        clearInterval(researchNewClients)
    }, 500)
}

function drawReticence(targetHTML) {
    targetHTML.innerHTML = `(SEARCHING FOR NEW CLIENTS... 🔍)`
    targetHTML.onclick = false
    let reticence = '...'

    return setInterval(() => {
        reticence = reticence + '.'
        if (reticence.length > 3) reticence = ''
        stateGame.lookingForClients.emojiText = `(🔍${reticence})`
    }, 500);
}

function getNewLookingAttempts() {
    const relatedSkill = stateGame.ownCompany.skills.network
    const skillDelta = Math.floor(relatedSkill / 3)
    stateGame.lookingForClients.lookingAttempts = 1 + skillDelta
}

function clearNewClientsList(remainingTime) {
    const clearNewClients = setInterval(() => {
        if (clock.minuteAccumulated < remainingTime) return
        getNewAvailableClients(0)
        rendererDOM.newClientSelector()
        clearInterval(clearNewClients)
    }, 500);
}

function updateNumberOfNewClientsDOM() {
    const numberNewOfClientsDOM = document.querySelector(".new-span")
    const availableNewClients = stateGame.lookingForClients.clientList.length
    const emojiText = stateGame.lookingForClients.emojiText

    if (availableNewClients < 1) {
        return numberNewOfClientsDOM.innerHTML = `${emojiText}`
    }
    numberNewOfClientsDOM.innerHTML = `(${availableNewClients} NEW)`
}

function updateClientMoneyDOM() {
    if (stateGame.clients[currentClient] != null) {
        clientMoneyDOM.forEach(DOM => DOM.innerHTML = stateGame.clients[currentClient].money)
    }
}

function addSkillPoint(skillName) {
    const isSkillPointAvailable = stateGame.ownCompany.skillPoints > 0

    if (isSkillPointAvailable) {
        stateGame.ownCompany.skillPoints--
        stateGame.ownCompany.skills[skillName.toLowerCase()]++

        rendererDOM.displayAvailableSkillPoints()
        rendererDOM.displaySkillBtn()
        rendererDOM.updateCurrentSkillPoints()

    }
}

function getCurrentExperience(addExperience = 0) {
    const ownExperience = document.querySelectorAll(".menu-own-lvl-progress")

    stateGame.ownCompany.experience += addExperience
    let currentExperience = stateGame.ownCompany.experience
    const experienceCap = 1000

    if (currentExperience >= experienceCap) {
        stateGame.ownCompany.level++
        stateGame.ownCompany.skillPoints++
        stateGame.ownCompany.experience = currentExperience - experienceCap
        currentExperience = experienceCap
    }
    const showExperience = (currentExperience / 1000) * 100

    ownExperience.forEach(DOM => DOM.style.width = `${showExperience}%`)
}

function updateOwnCompanyPropDOM() {
    companyNameDOM.innerHTML = stateGame.ownCompany.name
    ownMoneyDOM.forEach(DOM => DOM.innerHTML = stateGame.ownCompany.money)
    ownLevelDOM.forEach(DOM => DOM.innerHTML = stateGame.ownCompany.level)
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

                    const workerCompletedHourCycle = workersOnSite.timer >= 60 || clock.hour == 16

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
        rendererDOM.all()
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
    stateGame.lookingForClients.clientList = []

    getNewClientList(numberOfClients).forEach(clientName => stateGame.lookingForClients.clientList
        .push(new Client(clientName)))
}

function getNewClientList(numberOfClients) {
    return Array(numberOfClients).fill()
        .map(() => {
            const randomIndex = randomNumberInteger(0, clientNames.length - 1)
            return clientNames[randomIndex]
        })
}

function newClientSelectorBudgetOffer(client, inputOfferClient) {
    const index = stateGame.lookingForClients.clientList.indexOf(client)
    const ownCompanyLevelDelta = (Math.random() * stateGame.ownCompany.level / 10) + 1
    const maxClientBudget = client.money * ownCompanyLevelDelta
    const minClientBudget = client.money * 0.5

    if (client.attempt == null) client.attempt = randomCount(stateGame.ownCompany.level) + 1
    if (inputOfferClient.value < minClientBudget || inputOfferClient.value > maxClientBudget) {
        client.attempt -= 1

        if (client.attempt <= 0) stateGame.lookingForClients.clientList.splice(index, 1)
        return rendererDOM.all()
    }
    client.money = parseInt(inputOfferClient.value)
    stateGame.clients.unshift(client)
    stateGame.lookingForClients.clientList.splice(index, 1);
    rendererDOM.all()
}


//======================================================================================//
//RESPONSIBLE FOR ALL TASKS FUNCTIONS RULES RELATED
//======================================================================================//


function handleTaskProgress() {
    for (let targetClient of stateGame.clients) {
        for (let constructionSiteStage of targetClient.construction) {
            for (let constructionSiteElement of constructionSiteStage) {

                verifyAssigned(constructionSiteElement, targetClient)
            }
            const hasConstructionInProgress = verifyConstructionInProgress(constructionSiteStage)
            if (hasConstructionInProgress) break
        }
        const hasStageInProgress = verifyStageInProgress(targetClient)
        if (hasStageInProgress) break

        sendBackAllWorkerOrService(targetClient)
    }
}

function verifyAssigned(constructionSiteElement, targetClient) {
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

function verifyConstructionInProgress(constructionSiteStage) {
    return constructionSiteStage
        .some(constructionSiteElement => constructionSiteElement.progress < 100)
}

function verifyStageInProgress(targetClient) {
    return targetClient.construction
        .some(constructionSiteStage => constructionSiteStage
            .some(constructionSiteElement => constructionSiteElement.progress < 100))
}

function sendBackAllWorkerOrService(targetClient) {
    targetClient.workers.forEach(workerOrServiceStored => {
        if (workerOrServiceStored.count > 0) sendBackWorkerOrService(workerOrServiceStored)
    })
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
    if (constructionSiteElement.progress < 100) {

        constructionSiteElement.progress += 1 //PROGRESS RULE

        drawProgressLoadingTask(constructionSiteElement, targetClient)

        const cardId = `${constructionSiteElement.stage}-${stateGame.clients.indexOf(targetClient)}-${constructionSiteElement.index}-progress`
        const cardTaskPercentage = document.getElementById(cardId)

        if (cardTaskPercentage == null) return console.log('Card not found / or hidden');
        cardTaskPercentage.innerHTML = `${constructionSiteElement.progress} %`
    }
    handleCompletedTask(constructionSiteElement, targetClient)
}

function handleCompletedTask(constructionSiteElement, targetClient) {
    if (constructionSiteElement.progress >= 100) {
        for (let workerAssigned of constructionSiteElement.workersNeeded) {
            for (let workersOnSite of targetClient.workers) {
                if (workerAssigned.type == workersOnSite.name && workerAssigned.assigned == true) {
                    workersOnSite.count += workerAssigned.count
                    workerAssigned.count = 0
                    workerAssigned.assigned = false
                    rendererDOM.all()
                }
            }
        }
    }
}

//SEND THE WORKER(OR SERVICE) BACK AND DEDUCE COST
function sendBackWorkerOrService(workerOrServiceStored) {
    stateGame.clients[currentClient].costPerHour -= workerOrServiceStored.price

    remainingCost = workerOrServiceStored.timer / 60
    console.log(workerOrServiceStored.timer)
    stateGame.clients[currentClient].money -= workerOrServiceStored.price
    workerOrServiceStored.count--
    rendererDOM.all()
}

function assignWorkerOrService(workersNeeded, idButton) {

    for (let workersOnSite of stateGame.clients[currentClient].workers) {
        //ASSIGN WORKER TO A TASK
        if (workersOnSite.name == workersNeeded.type &&
            workersOnSite.count >= workersNeeded.count) {
            workersNeeded.assigned = true
            workersOnSite.count -= workersNeeded.count
            return rendererDOM.all()
        }
        //UNASSIGN WORKER TO A TASK
        if (workersOnSite.name == workersNeeded.type &&
            workersNeeded.assigned == true) {
            workersNeeded.assigned = false
            workersOnSite.count += workersNeeded.count
            return rendererDOM.all()
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
            return rendererDOM.all()
        }
    }
}

function completeClientConstruction() {
    stateGame.clients[currentClient].money
    stateGame.ownCompany.money += stateGame.clients[currentClient].money
    stateGame.clients[currentClient].money = 0

    getCurrentExperience(200)

    deletedModels.push(stateGame.clients[currentClient].THREEmodel)
    deletedModels.push(stateGame.clients[currentClient].THREEsite)
    stateGame.clients[currentClient] = null
    stateGame.clients.splice(currentClient, 1)
    if (currentClient > 0) currentClient--
    rendererDOM.all()
}

function drawProgressLoadingTask(constructionSiteElement, targetClient) {
    const cardId = `${constructionSiteElement.stage}-${targetClient.name}-${constructionSiteElement.index}-progressLoading`
    const cardTaskLoadingDiv = document.getElementById(cardId)
    if (cardTaskLoadingDiv) {
        cardTaskLoadingDiv.style.width = `${constructionSiteElement.progress}%`
    }
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
    rendererDOM.all()


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
    rendererDOM.all()
}



//======================================================================================//
//END STORE FUNCTIONS RULES