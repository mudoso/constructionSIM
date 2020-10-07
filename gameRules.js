//======================================================================================//
//RESPONSIBLE FOR DEFINE ALL GAME RULES
//======================================================================================//

//DEFINE ALL GLOBAL VARIABLES
let currentClient = 0


//DEFINE ALL GLOBAL PATHS
//==========NAV STATS PATH=============
const companyNameDOM = document.getElementById("own-company-name")
const ownMoneyDOM = document.querySelectorAll(".own-money")
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


// CLOCK FUNCTION
function timeRules() {
    //UPDATE MONEY FROM STATEGAME
    companyNameDOM.innerHTML = stateGame.ownCompany.name
    ownMoneyDOM.forEach(DOM => DOM.innerHTML = stateGame.ownCompany.money)

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
    let min00 = ("0" + min).slice(-2);
    // let date = new Date();
    // let h = date.getHours();
    timeSpan.textContent = hour + ":" + min00;
    stateGame.clock.minute = min00
    stateGame.clock.hour = hour
    stateGame.clock.day = day
    if (stateGame.clients[currentClient] != null) {
        checkCostPerHour()
        verifyAssigned()
    }
}
setInterval(timeRules, 200); //START CLOCK
getNewAvailableClients()


function checkCostPerHour() {
    //LOOK FOR ALL THE ASSIGN WORKERS FOR EACH TYPE
    for (let targetClient of stateGame.clients) {
        targetClient.costPerHour = 0
        for (let workersOnSite of targetClient.workers) {
            if (workersOnSite != undefined) {
                let workersAssignedCount = 0
                for (let constructionSiteStage of targetClient.construction) {
                    for (let constructionSiteElement of constructionSiteStage) {
                        for (let workersAssigned of constructionSiteElement.workersNeeded) {
                            if (workersAssigned.type == workersOnSite.name && workersAssigned.assigned == true) {
                                //GET ALL ASSIGNED WORKERS
                                workersAssignedCount += workersAssigned.count
                            }
                        }
                    }
                }
                //ADD THE WORKERS ON SITE (IDLE) WITH THE ASSIGNED ONES
                let totalWorkersCount = workersAssignedCount + workersOnSite.count

                if (workersOnSite.count > 0 || workersAssignedCount > 0) {
                    workersOnSite.timer++
                    CostPerHourPerType = totalWorkersCount * workersOnSite.price
                    targetClient.costPerHour += CostPerHourPerType

                    //DEDUCE COST PER HOUR OR WHEN JOB TIME FINISH
                    if (workersOnSite.timer >= 60 || hour == 16) {
                        workersOnSite.timer = 0
                        let workersCostPerHour = totalWorkersCount * workersOnSite.price

                        //TAKE OWN MONEY IF CLIENT ONE REACHES ZERO
                        if (targetClient.money < workersCostPerHour) {
                            unassignWorkers()
                            targetClient.money -= workersCostPerHour
                            stateGame.ownCompany.money += targetClient.money
                            targetClient.money = 0
                            workersOnSite.count = 0
                            renderDOM()
                        } else {
                            targetClient.money -= workersCostPerHour
                            ownMoneyDOM.innerHTML = stateGame.ownCompany.money
                            clientMoneyDOM.innerHTML = stateGame.clients[currentClient].money
                        }
                    }
                }
            }
        }
    }
    const costPerHourValueDOM = document.getElementById("costperhour-value")
    costPerHourValueDOM.innerHTML = stateGame.clients[currentClient].costPerHour
}

function unassignWorkers() {
    for (let targetClient of stateGame.clients) {
        for (let constructionSiteStage of targetClient.construction) {
            for (let constructionSiteElement of constructionSiteStage) {
                for (let workerNeeded of constructionSiteElement.workersNeeded) {
                    for (let workersOnSite of targetClient.workers) {
                        if (workerNeeded.assigned == true && workerNeeded.type == workersOnSite.name) {
                            workersOnSite.count += workerNeeded.count
                            console.log(workersOnSite.name + " " + workersOnSite.count)
                            workerNeeded.assigned = false
                        }
                    }
                }
            }
        }
    }
}

function randomNumberInteger(min = 0, max = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getNewClientList(numberOfTimes) {
    const newClientsList = []

    for (numberOfTimes; numberOfTimes > 0; numberOfTimes--) {
        let randomIndex = randomNumberInteger(0, clientNames.length - 1)
        let newClientRandomName = clientNames[randomIndex]
        newClientsList.push(newClientRandomName)
    }
    return newClientsList
}

function getNewAvailableClients(numberOfTimes = 0) {

    stateGame.lookingForClients = []

    if (numberOfTimes < 1) numberOfTimes = randomNumberInteger(0, 3)

    getNewClientList(numberOfTimes).forEach(clientName => stateGame.lookingForClients
        .push(new Client(clientName)))
}

//======================================================================================//
//END CLOCK FUNCTIONS





//======================================================================================//
//RESPONSIBLE FOR ALL TASKS FUNCTIONS RULES RELATED
//======================================================================================//


//START THE TASK IF ALL CONDITIONS ARE TRUE
function startTask(constructionSiteElement, targetClient) {
    if (constructionSiteElement == undefined) { console.log("ERROR") }

    if (constructionSiteElement.progress < 100) {

        constructionSiteElement.progress += 10 //PROGRESS RULE
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


//VERIFY ASSIGNED MATERIAL OR WORKER
function verifyAssigned() {
    for (let targetClient of stateGame.clients) {
        for (let constructionSiteStage of targetClient.construction) {
            for (let constructionSiteElement of constructionSiteStage) {

                //VERIFY IF ALL WORKERS (OR SERVICES) WERE ASSIGNED TO THE JOB TO START THE TASK
                if (constructionSiteElement.workersNeeded != undefined) {
                    let isWorkersNeededTrue = constructionSiteElement.workersNeeded.every(function (workersNeeded) {
                        return workersNeeded.assigned;
                    });
                    //VERIFY IF ALL MATERIALS WERE ASSIGNED TO THE JOB TO START THE TASK
                    if (constructionSiteElement.materialNeeded != undefined) {
                        let = isMaterialNeededTrue = constructionSiteElement.materialNeeded.every(function (materialNeeded) {
                            return materialNeeded.assigned;
                        });
                        // START PROGRESS IF ALL WORKERS AND MATERIALS ARE ASSIGNED
                        if (isWorkersNeededTrue && isMaterialNeededTrue) {
                            startTask(constructionSiteElement, targetClient)
                        }
                    }
                    // START PROGRESS IF ALL WORKERS ARE ASSIGNED AND THERE IS NO MATERIALS TO TASK 
                    if (isWorkersNeededTrue && constructionSiteElement.materialNeeded == undefined) {
                        startTask(constructionSiteElement, targetClient)
                    }
                }
            }
            let condition = constructionSiteStage.every((constructionSiteElement) => {
                return constructionSiteElement.progress >= 100
            });
            if (condition == false) { break } //PREVENT NEXT STAGE IF ALL PROGRESS OF CURRENT STAGE ARE NOT 100%
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


//ASSIGN (OR UNASSIGN) WORKER TO A TASK
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


//ASSIGN MATERIAL TO A TASK
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

//======================================================================================//
//END TASKS FUNCTIONS RULES


//RESPONSIBLE FOR HANDLE COMPLETE CONSTRUCTION FUNCTION
//======================================================================================//
function completeClientConstruction() {
    stateGame.clients[currentClient].money
    stateGame.ownCompany.money += stateGame.clients[currentClient].money
    stateGame.clients[currentClient].money = 0

    deletedModels.push(stateGame.clients[currentClient].THREEmodel)
    deletedModels.push(stateGame.clients[currentClient].THREEsite)
    stateGame.clients[currentClient] = null
    stateGame.clients.splice(currentClient, 1)
    if (currentClient > 0) currentClient--
    renderDOM()
}


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



//RESPONSIBLE FOR HANDLE LOOKING CLIENTS FUNCTIONS
//======================================================================================//

function newClientSelector(client, inputOfferClient) {
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
//RESPONSIBLE FOR ALL STORE AND WAREHOUSE FUNCTIONS RULES RELATED
//======================================================================================//



//ADD ITEMS TO WAREHOUSE(IF ITS A MATERIAL) OR SITE(IF ITS A WORKER/SERVICE)
function buyItem(itemBought, categoryItem) {
    const inputCountId = `${itemBought.name}-buyinput`
    const getCount = document.getElementById(inputCountId);
    if (stateGame.clients[currentClient] == null) return
    const volumeStored = stateGame.clients[currentClient].warehouse
        .reduce((acc, item) => { return acc + (item.count * item.volume) }, 0)

    //CONDITION TO PREVENT BREAK CODE IF INPUT IS IN WRONG FORMAT
    if (itemBought === null || getCount === null || getCount < 1) return console.log("Invalid Input")
    if (getCount.value == null) getCount.value = 1

    countBought = parseInt(getCount.value)
    let moneySpent = countBought * itemBought.price

    //PREVENTS BUY SERVICES OR MATERIALS IF CLIENT BUDGET = 0
    if (stateGame.clients[currentClient].money == 0) { return }

    //COVER COST WITH OWN MONEY (CLIENT MONEY + OWN MONEY) IF CLIENT MONEY IS LESS moneySpent
    if (stateGame.clients[currentClient].money <= moneySpent) {
        if (!itemBought.service) {
            deduceOwnAndClientMoney()
        }
    } else {
        //SUBTRACT MONEY FROM CLIENT IMMEDIATELY IF NOT A SERVICE
        if (!itemBought.service) {
            const volumeIsHigherThanWarehouseLimit = (volumeStored + countBought * itemBought.volume) > stateGame.clients[currentClient].warehouseLimit
            if (volumeIsHigherThanWarehouseLimit) { return }
            stateGame.clients[currentClient].money -= moneySpent
        }
    }
    getCount.value = 1

    //CHECK IF IT IS AN ITEM OR A SERVICE
    let warehouseOrWorkersContainer = stateGame.clients[currentClient].warehouse
    if (itemBought.service) {
        warehouseOrWorkersContainer = stateGame.clients[currentClient].workers
    }

    //SEND TO STATEGAME
    let itemStored = warehouseOrWorkersContainer.find(itemStored => itemStored.name === itemBought.name);
    //VERIFY IF ITEM EXISTS
    if (itemStored === undefined) {
        itemStored = { ...itemBought, "count": 0, "volumeTotal": 0, } //CREATE NEW OBJECT
        warehouseOrWorkersContainer.unshift(itemStored)
    }

    //ADD TO EXISTING
    for (let itemStored of warehouseOrWorkersContainer) {
        if (itemStored.name === itemBought.name) {
            itemStored.count = itemStored.count + countBought;
            break; //Stop this loop, we found it!
        }
    }
    renderDOM()


    function deduceOwnAndClientMoney() {
        stateGame.clients[currentClient].money -= moneySpent
        stateGame.ownCompany.money += stateGame.clients[currentClient].money
        stateGame.clients[currentClient].money = 0
    }
}

//DISCARD WAREHOUSE (SITE STORAGE) ITEM
function discardWarehouseItem(materialStored) {
    const warehouseContainer = stateGame.clients[currentClient].warehouse
    const indexOfItemSelected = warehouseContainer.indexOf(materialStored)
    warehouseContainer.splice(indexOfItemSelected, 1)
    renderDOM()
}

//HANDLE WAREHOUSE (SITE STORAGE) LIMIT
function warehouseDisplayLimit() {
    if (stateGame.clients[currentClient] == null) return
    const volumeStored = stateGame.clients[currentClient].warehouse
        .reduce((acc, item) => { return acc + (item.count * item.volume) }, 0)
    const currentVolumeStored = `${Math.floor(volumeStored / stateGame.clients[currentClient].warehouseLimit * 1000) / 10}`

    warehouseLimitDOM.style.color = "var(--text-base-color)"
    if (stateGame.clients[currentClient].warehouse[0] == null) return "EMPTY"
    if (currentVolumeStored >= 90) { warehouseLimitDOM.style.color = "#ff2a1a" }
    if (volumeStored >= stateGame.clients[currentClient].warehouseLimit) return "FULL"
    return `${currentVolumeStored}%`
}


//======================================================================================//
//END STORE FUNCTIONS RULES