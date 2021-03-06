//################## NEED TO BE IMPLEMENTED #########################

// ADDED A FRONT PAGE TO INPUT COMPANY NAME, START NEW GAME OR LOAD GAME
// MAKE A SAVE SYSTEM TO LocalStorage
// MAKE A HELP TOOLTIP TO SHOW INFORMATION ABOUT THE COMPONENTS
// MAKES SKILLS IMPACT IN THE GAME
// CHANGE TASK PROGRESS FORMULA TO WORK IN ACCORD WITH SKILLS AND DIFFICULT OF THE TASK
// ?? CHANGE CLOCK FUNCTION TO SHOW MORNING, EVENING, AFTERNOON
// ?? MAKE THREE.JS LIGHTs TO CHANGE ACCORDING TO TIME OF THE DAY
// ?? MAKE THREE.JS MeshToonMaterial SHADE EFFECT WORK
// RESOLVE SEND MONEY PROBLEM
// MAKE CLIENT RUNNING OUT OF MONEY MORE VISIBLE AND FLASHABLE
// MAKE MONEY SPENT / EARN ANIMATION

//============================================================================//
//CLOCK RELATED FUNCTIONS
//============================================================================//


let timeClockRules = setInterval(timeRules, stateGame.clock.timeScale); //START CLOCK

function timeRules() {

    stateGame.clock.minute++
    stateGame.clock.minuteAccumulated++

    const minuteCycle = stateGame.clock.minute >= 60
    const dayCycle = stateGame.clock.hour >= 16

    if (minuteCycle) {
        stateGame.clock.minute = 0
        stateGame.clock.hour++
        // saveGame()
    }
    if (dayCycle) {
        stateGame.clock.hour = 8
        stateGame.clock.day++
        getNewAvailableClients(0)
        getNewLookingAttempts()
        checkDueCost()
        rendererDOM.all()
    }
    rendererDOM.time()

    const hasClientSelected = stateGame.clients[stateGame.clientIndex] != null

    if (hasClientSelected) {
        checkCostPerHour()
        handleTaskProgress()
    }

    const isMorning = stateGame.clock.hour < 12

    isMorning
        ? stateGame.clock.spanTime = 'Morning'
        : stateGame.clock.spanTime = 'Afternoon'
}


setInterval(rulesListener, 500)

function rulesListener() {
    transportItemToContainer()
    checkResearchTime()
    setCurrentExperience()
}



//============================================================================//
//MENU / UI FUNCTIONS
//============================================================================//


function saveGame() {
    const startTime = Date.now();

    const savedGame = JSON.stringify({
        clock: {
            ...stateGame.clock
        },
        ownCompany: {
            ...stateGame.ownCompany
        },
        clients: [
            ...stateGame.clients
        ],
        clientIndex: stateGame.clientIndex,
        lookingForClients: {
            ...stateGame.lookingForClients
        },
    })
    const size = new TextEncoder().encode(savedGame).length
    console.log("saveGame -> size", size / 1000, 'kB')

    localStorage.setItem('save1', savedGame);

    console.log(`${(Date.now() - startTime) / 1000} seconds`);
}

function loadGame() {
    const loadGame = JSON.parse(localStorage.getItem('save1'))
    console.log("loadGame -> loadGame", loadGame)

    stateGame = loadGame
    rendererDOM.all()
}

function stopTime(speedPlayBtn) {
    speedPlayBtn.innerHTML = '&#8213;'
    changeTimeSpeed(0)
}

function speedTime(speedPlayBtn) {
    const speedOne = 1000
    const speedTwo = speedOne * 0.3
    const speedThree = speedTwo * 0.1

    switch (stateGame.clock.timeScale) {
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

function changeTimeSpeed(timeScale = 0) {
    stateGame.clock.timeScale = timeScale
    clearInterval(timeClockRules)
    if (timeScale > 0) {
        timeClockRules = setInterval(timeRules, stateGame.clock.timeScale);
    }
}

function sendMoneyToClient(sendMoneyInput) {
    const countSent = parseInt(sendMoneyInput.value)
    const isNumber = typeof countSent == 'number'
    const hasCompanyMoney = countSent > stateGame.ownCompany.money

    sendMoneyInput.value = 0

    if (isNumber || hasCompanyMoney) {
        stateGame.ownCompany.money -= countSent
        stateGame.clients[stateGame.clientIndex].money += countSent
    }
}

function addSkillPoint(skillName) {
    const isSkillPointAvailable = stateGame.ownCompany.skillPoints > 0

    if (isSkillPointAvailable) {
        const skillSelected = skillName.toLowerCase()

        stateGame.ownCompany.skillPoints--
        stateGame.ownCompany.skills[skillSelected]++

        rendererDOM.displayAvailableSkillPoints()
        rendererDOM.displaySkillBtn()
        rendererDOM.updateCurrentSkillPoints()
    }
}



//============================================================================//
//NEW CLIENTS FUNCTIONS
//============================================================================//


function researchNewClients() {
    const skillValue = stateGame.ownCompany.skills.network
    const researchTime = stateGame.clock.minuteAccumulated + (60 - skillValue * 2)

    stateGame.lookingForClients.research = true
    stateGame.lookingForClients.researchTime = researchTime

    rendererDOM.drawReticence()
    rendererDOM.newClientSelector()
}

function checkResearchTime() {
    const researchTime = stateGame.lookingForClients.researchTime
    const remainingTime = stateGame.lookingForClients.remainingTime
    const isSearchActive = stateGame.lookingForClients.research
    const hasResearchTime = researchTime > stateGame.clock.minuteAccumulated
    const hasRemainingTime = remainingTime > stateGame.clock.minuteAccumulated

    const hasAvailableAttempts = stateGame.lookingForClients.lookingAttempts > 0
    const hasAvailableClient = stateGame.lookingForClients.clientList.length > 0

    if (!hasRemainingTime && hasAvailableClient) {
        getNewAvailableClients(0)
    }

    if (!isSearchActive || hasResearchTime) return

    if (hasAvailableAttempts && !hasAvailableClient && !hasResearchTime) {
        const skillValue = stateGame.ownCompany.skills.network
        const SkillDelta = Math.floor(120 * skillValue / 10)
        const setRemainingTime = stateGame.clock.minuteAccumulated + 60 + SkillDelta

        stateGame.lookingForClients.remainingTime = setRemainingTime
        stateGame.lookingForClients.lookingAttempts--
        stateGame.lookingForClients.research = false

        const hasSomeClient = stateGame.clients.length > 0
        hasSomeClient
            ? getNewAvailableClients()
            : getNewAvailableClients(1)
    }
}

function clearNewClientsList(remainingTime) {
    if (stateGame.clock.minuteAccumulated < remainingTime) return
    getNewAvailableClients(0)
    rendererDOM.newClientSelector()
}

function getNewLookingAttempts() {
    const relatedSkill = stateGame.ownCompany.skills.network
    const skillDelta = Math.floor(relatedSkill / 3)
    stateGame.lookingForClients.lookingAttempts = 1 + skillDelta
}

function randomNumberInteger(min = 0, max = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getNewAvailableClients(numberOfClients = randomNumberInteger(0, 3)) {
    stateGame.lookingForClients.clientList = []

    if (numberOfClients > 0)
        numberOfClients += getExtraClientWithSkill()

    getNewClientList(numberOfClients).forEach(clientName =>
        stateGame.lookingForClients.clientList
            .push(new Client(clientName)))

    rendererDOM.newClientSelector()
}

function getNewClientList(numberOfClients) {
    return Array(numberOfClients).fill()
        .map(() => {
            const randomIndex = randomNumberInteger(0, clientNames.length - 1)
            return clientNames[randomIndex]
        })
}

function getExtraClientWithSkill() {
    const relatedSkill = stateGame.ownCompany.skills.network
    const skillDelta1 = (relatedSkill + 11) / 10
    const skillDelta2 = Math.random() + relatedSkill / 50
    const extraClient = Math.floor(skillDelta2 * skillDelta1)

    return extraClient
}

function newClientSelectorBudgetOffer(client, inputOfferClient) {
    const index = stateGame.lookingForClients.clientList.indexOf(client)
    const ownCompanyLevelDelta = (Math.random() * stateGame.ownCompany.level / 10) + 1
    const maxClientBudget = client.money * ownCompanyLevelDelta
    const minClientBudget = client.money * 0.5

    if (client.attempt == null)
        client.attempt = randomCount(stateGame.ownCompany.level) + 1
    if (inputOfferClient.value < minClientBudget || inputOfferClient.value > maxClientBudget) {
        client.attempt -= 1

        if (client.attempt <= 0) stateGame.lookingForClients.clientList.splice(index, 1)
        return rendererDOM.newClientSelector()
    }
    client.money = parseInt(inputOfferClient.value)
    stateGame.clients.unshift(client)
    stateGame.lookingForClients.clientList.splice(index, 1);
    rendererDOM.all()
}

function setCurrentExperience(addExperience = 0) {

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

    rendererDOM.experience(showExperience)
}

function checkCostPerHour() {
    for (const targetClient of stateGame.clients) {
        targetClient.costPerHour = 0
        for (const workersOnSite of targetClient.workers) {
            const workerTypeExists = workersOnSite != null

            if (workerTypeExists) {
                const workersAssignedCount = checkAssignedWorkers(targetClient, workersOnSite)
                const isWorkerHired = workersOnSite.count > 0 || workersAssignedCount > 0

                if (isWorkerHired) {
                    const totalWorkersCount = workersAssignedCount + workersOnSite.count
                    const workerTypeCost = workersOnSite.price

                    const costPerHourPerType = totalWorkersCount * workerTypeCost

                    targetClient.costPerHour += costPerHourPerType

                    handleWorkerTimer(targetClient, workersOnSite, costPerHourPerType)
                }
            }
        }
    }
    rendererDOM.costPerHourValue()
}

function handleWorkerTimer(targetClient, workersOnSite, costPerHourPerType) {
    workersOnSite.timer++

    const workerCompletedHourCycle =
        workersOnSite.timer >= 60 || stateGame.clock.hour == 16

    if (workerCompletedHourCycle) {
        workersOnSite.timer = 0
        deduceCostPerHour(targetClient, workersOnSite, costPerHourPerType)
    }
}

function deduceCostPerHour(targetClient, workersOnSite, costPerHourPerType) {
    const insufficientClientMoney = targetClient.money < costPerHourPerType

    if (insufficientClientMoney) {
        unassignWorkers(targetClient, workersOnSite)
        deduceOwnMoney(targetClient, costPerHourPerType)
        workersOnSite.count = 0
        rendererDOM.idleWorkersAndServices()
        return
    }
    targetClient.money -= costPerHourPerType
    rendererDOM.money()
}

function unassignWorkers(targetClient, workersOnSite) {
    for (const constructionSiteStage of targetClient.construction) {
        for (const constructionSiteElement of constructionSiteStage) {
            for (const workerNeeded of constructionSiteElement.workersNeeded) {
                if (workerNeeded.assigned == true && workerNeeded.type == workersOnSite.name) {
                    workersOnSite.count += workerNeeded.count
                    workerNeeded.assigned = false
                }
            }
        }
    }
    rendererDOM.idleWorkersAndServices()
}

function deduceOwnMoney(targetClient, costPerHourPerType) {
    targetClient.money -= costPerHourPerType
    stateGame.ownCompany.money += targetClient.money
    targetClient.money = 0
    rendererDOM.money()
}

function checkAssignedWorkers(targetClient, workersOnSite) {
    let workersAssignedCount = 0
    for (const constructionSiteStage of targetClient.construction) {
        for (const constructionSiteElement of constructionSiteStage) {
            for (const workersAssigned of constructionSiteElement.workersNeeded) {
                const isWorkerAssigned = workersAssigned.type == workersOnSite.name && workersAssigned.assigned == true

                if (isWorkerAssigned) {
                    workersAssignedCount += workersAssigned.count
                }
            }
        }
    }
    return workersAssignedCount
}

function checkDueCost() {
    for (const targetClient of stateGame.clients) {
        const isDueDate = stateGame.clock.day > targetClient.dueDate
        if (isDueDate) {
            stateGame.ownCompany.money -= targetClient.dueFee
        }
    }
}



//============================================================================//
//TASKS FUNCTIONS
//============================================================================//


function handleTaskProgress() {
    for (const targetClient of stateGame.clients) {
        for (const constructionSiteStage of targetClient.construction) {
            for (const constructionSiteElement of constructionSiteStage) {

                verifyAssigned(constructionSiteElement, targetClient)
            }
            const hasConstructionInProgress = verifyConstructionInProgress(constructionSiteStage)
            if (hasConstructionInProgress) break
        }
        const hasStagesInProgress = verifyStageInProgress(targetClient)
        if (!hasStagesInProgress)
            sendBackAllWorkerOrService(targetClient)
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
        if (workerOrServiceStored.count > 0)
            sendBackWorkerOrService(workerOrServiceStored)
    })
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

        function getProgress(constructionSiteElement, targetClient) {
            const area = targetClient.area
            const workersQuantity = constructionSiteElement.workersNeeded
                .reduce((acc, service) => acc + service.count, 0)

            const skill1 = stateGame.ownCompany.skills.construction
            const skill2 = stateGame.ownCompany.skills.management

            const mainValue = workersQuantity / area * 10
            const skillDelta1 = (skill1 / area)
            const skillDelta2 = (skill2 / area) / 2

            const rawPercentage = mainValue + skillDelta1 + skillDelta2
            return rawPercentage
        }
        constructionSiteElement.progress += getProgress(constructionSiteElement, targetClient)
        constructionSiteElement.progress = parseFloat(constructionSiteElement.progress.toFixed(2))

        rendererDOM.progressTaskLoading(constructionSiteElement, targetClient)
        rendererDOM.progressTaskPercentage(constructionSiteElement, targetClient)
    }
    handleCompletedTask(constructionSiteElement, targetClient)
}

function handleCompletedTask(constructionSiteElement, targetClient) {
    if (constructionSiteElement.progress >= 100) {
        for (const workerAssigned of constructionSiteElement.workersNeeded) {
            for (const workersOnSite of targetClient.workers) {
                const isSameWorker = workerAssigned.type == workersOnSite.name
                const isWorkerAssigned = workerAssigned.assigned == true

                if (isSameWorker && isWorkerAssigned) {
                    workersOnSite.count += workerAssigned.count
                    workerAssigned.count = 0
                    workerAssigned.assigned = false

                    rendererDOM.all()
                }
            }
        }
    }
}

function sendBackWorkerOrService(workerOrServiceStored) {
    stateGame.clients[stateGame.clientIndex].costPerHour -= workerOrServiceStored.price
    stateGame.clients[stateGame.clientIndex].money -= workerOrServiceStored.price
    workerOrServiceStored.count--

    rendererDOM.costPerHourBtn()
    rendererDOM.idleWorkersAndServices()
}

function assignWorkerOrService(workersNeeded) {
    const workersOnSite = stateGame.clients[stateGame.clientIndex].workers
        .find(workerOnSite => workerOnSite.name == workersNeeded.type)

    if (!workersOnSite) return
    if (workersOnSite.count < workersNeeded.count) return

    workersNeeded.assigned = true
    workersOnSite.count -= workersNeeded.count

    rendererDOM.idleWorkersAndServices()
    rendererDOM.constructionTaskCards()
}

function unassignWorkerOrService(workersNeeded) {
    const workersOnSite = stateGame.clients[stateGame.clientIndex].workers
        .find(workerOnSite => workerOnSite.name == workersNeeded.type)

    if (!workersOnSite) return
    if (workersNeeded.assigned != true) return

    workersNeeded.assigned = false
    workersOnSite.count += workersNeeded.count

    rendererDOM.idleWorkersAndServices()
    rendererDOM.constructionTaskCards()
}

function assignMaterial(materialNeeded) {
    for (const materialOnWarehouse of stateGame.clients[stateGame.clientIndex].warehouse) {
        if (materialOnWarehouse.name == materialNeeded.name &&
            materialOnWarehouse.count >= materialNeeded.count) {

            materialNeeded.assigned = true
            materialOnWarehouse.count -= materialNeeded.count

            rendererDOM.warehouseBtn()
            rendererDOM.constructionTaskCards()
            return
        }
    }
}

function completeClientConstruction() {
    const currentCompanyMoney = stateGame.clients[stateGame.clientIndex].money
    stateGame.ownCompany.money += currentCompanyMoney
    stateGame.clients[stateGame.clientIndex].money = 0

    const experiencePoints = getExperiencePoints()

    setCurrentExperience(experiencePoints)

    const clientId = stateGame.clients[stateGame.clientIndex].id
    const THREE = stateGame.THREEmodels

    THREE.deletedModels.push(THREE.clients[clientId].THREEmodel)
    THREE.deletedModels.push(THREE.clients[clientId].THREEsite)
    THREE.clients[clientId] = null
    delete THREE.clients[clientId]

    stateGame.clients[stateGame.clientIndex] = null
    stateGame.clients.splice(stateGame.clientIndex, 1)

    if (stateGame.clientIndex > 0) stateGame.clientIndex--

    rendererDOM.all()
}

function getExperiencePoints() {
    const currentClient = stateGame.clients[stateGame.clientIndex]
    const clientArea = currentClient.area
    const clientCountStages = currentClient.construction.length
    const skillPrimary = stateGame.ownCompany.skills.construction
    const skillSecondary = stateGame.ownCompany.skills.management
    const skillMax = skillPrimary + skillSecondary
    const skillCoef = (1 + skillMax / 10)

    return clientArea * clientCountStages * skillCoef
}



//============================================================================//
//STORE AND WAREHOUSE FUNCTIONS
//============================================================================//


function buyItem(itemBought, categoryItem) {
    const noClientSelected = stateGame.clients.length == 0
    if (noClientSelected) return

    const getCount = document.getElementById(`${itemBought.name}-buyinput`);

    if (checkValidation(itemBought, getCount)) return

    const countBought = parseInt(getCount.value)
    const moneySpent = countBought * itemBought.price

    const isItemBoughtMaterial = !itemBought.service
    if (isItemBoughtMaterial) {
        const isWarehouseFull = checkWarehouseSpace(itemBought, countBought)
        if (isWarehouseFull) return
        handleBoughtMaterials(moneySpent)
    }

    getCount.value = 1

    addItemBoughtToContainer(itemBought, countBought)

    rendererDOM.warehouseBtn()
    rendererDOM.costPerHourBtn()
    rendererDOM.idleWorkersAndServices()
}

function checkValidation(itemBought, getCount) {
    const hasClientMoney = stateGame.clients[stateGame.clientIndex].money > 0
    const isValidInput = itemBought != null || getCount != null
    const isValidValue = getCount.value != null || getCount.value > 0

    const conditions = [
        hasClientMoney,
        isValidInput,
        isValidValue,
    ].some(condition => condition == false)

    return conditions
}

function checkWarehouseSpace(itemBought, countBought) {

    const volumeStored = stateGame.clients[stateGame.clientIndex].warehouse
        .reduce((acc, item) => { return acc + (item.count * item.volume) }, 0)
    const totalVolume = volumeStored + countBought * itemBought.volume
    const warehouseLimit = stateGame.clients[stateGame.clientIndex].warehouseLimit

    return isVolumeHigherThanWarehouseLimit = totalVolume > warehouseLimit
}

function handleBoughtMaterials(moneySpent) {
    const notEnoughClientMoney =
        stateGame.clients[stateGame.clientIndex].money <= moneySpent

    if (notEnoughClientMoney) return deduceOwnAndClientMoney(moneySpent)
    stateGame.clients[stateGame.clientIndex].money -= moneySpent
}

function deduceOwnAndClientMoney(moneySpent) {
    stateGame.clients[stateGame.clientIndex].money -= moneySpent
    stateGame.ownCompany.money += stateGame.clients[stateGame.clientIndex].money
    stateGame.clients[stateGame.clientIndex].money = 0
}

function addItemBoughtToContainer(itemBought, countBought) {
    const warehouseOrSiteContainer = getContainer(itemBought)
    createItemObject(itemBought, warehouseOrSiteContainer)

    const ItemStored = warehouseOrSiteContainer
        .find(itemStored => itemStored.name === itemBought.name)

    createTransportItem(ItemStored, countBought)
}

function getContainer(itemBought) {
    const isService = itemBought.service

    if (isService) return stateGame.clients[stateGame.clientIndex].workers
    return stateGame.clients[stateGame.clientIndex].warehouse
}

function createItemObject(itemBought, warehouseOrSiteContainer) {
    const isItemStored = warehouseOrSiteContainer
        .some(itemStored => itemStored.name === itemBought.name)

    if (!isItemStored) {
        const newItemStored = {
            ...itemBought,
            "count": 0,
            "volumeTotal": 0,
            "transport": []
        }
        warehouseOrSiteContainer.unshift(newItemStored)
    }
}

function createTransportItem(ItemStored, countBought) {
    const skillValue = stateGame.ownCompany.skills.management
    const transportTime = stateGame.clock.minuteAccumulated + (60 - skillValue * 2)

    const newTransportItem = {
        "count": countBought,
        "timer": transportTime,
    }
    ItemStored.transport.unshift(newTransportItem)
}

function transportItemToContainer() {
    for (const client of stateGame.clients) {
        for (const materialStored of client.warehouse) {
            const isTransporting = materialStored.transport.length > 0

            if (isTransporting)
                transportItem(materialStored)
        }
        for (const workerStored of client.workers) {
            const isTransporting = workerStored.transport.length > 0

            if (isTransporting)
                transportItem(workerStored)
        }
    }
}

function transportItem(itemStored) {
    itemStored.transport.forEach((transportItem, index) => {

        const transportTime = transportItem.timer
        const hasTransportTime = transportTime > stateGame.clock.minuteAccumulated

        if (hasTransportTime) return

        itemStored.count = itemStored.count + transportItem.count;
        itemStored.transport.splice(index, 1)
        rendererDOM.warehouseBtn()
        rendererDOM.idleWorkersAndServices()
    })
}

function discardWarehouseItem(materialStored) {
    const warehouseContainer = stateGame.clients[stateGame.clientIndex].warehouse
    const indexOfItemSelected = warehouseContainer.indexOf(materialStored)

    warehouseContainer.splice(indexOfItemSelected, 1)
    rendererDOM.all()
}