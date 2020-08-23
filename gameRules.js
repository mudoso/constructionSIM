
//======================================================================================//
//RESPONSIBLE FOR DEFINE ALL GLOBAL VARIABLES (BUT TIME ONES)
//======================================================================================//

//DEFINE ALL GLOBAL VARIABLES
let currentClient = 0

//DEFINE ALL GLOBAL PATHS
//==========NAV CLIENT PATH=============
const clientLeftArrowButtonDOM = document.getElementById("btn-clients-left")
const clientSelectedButtonDOM = document.getElementById("btn-clients")
const clientRightArrowButtonDOM = document.getElementById("btn-clients-right")

//==========NAV STATS PATH=============
const companyNameDOM = document.getElementById("own-company-name")
const currentDateDOM = document.getElementById("current-date")
const ownMoneyDOM = document.getElementById("own-money")
const clientMoneyDOM = document.getElementById("client-money")
const costPerHourDOM = document.getElementById("cost-per-hour")
const dayDom = document.getElementById("day")


//==========NAV STORE PATH=============
// const storeItems = Object.keys(store)
const storeCategoryContainerDOM = document.getElementById("store-category")
const storeBuyContainerDOM = document.getElementById("store-buy-items")


//==========NAV INVENTOR / WORKERS-SERVICES / WAREHOUSE PATH=============
const warehouseContainerDOM = document.getElementById("warehouse-container")
const statsInventoryWarehouse = stateGame.clients[currentClient].warehouse
const workersAndServicesContainerDOM = document.getElementById("workers-services")
const statsWorkersAndServices = stateGame.clients[currentClient].workers
const statsCostPerHour = stateGame.clients[currentClient].costPerHour

//==========NAV CONSTRUCTION PATH=============
const constructionContainerDOM = document.getElementById("construction-container")
const statsConstructionSite = stateGame.clients[currentClient].construction
//======================================================================================//



//======================================================================================//
//RESPONSIBLE FOR CLOCK RELATED FUNCTIONS
//======================================================================================//

// SET TIME
const span = document.getElementById('time');
let min = 0
let hour = 8
let day = 1
let extraShift = ""


// CLOCK FUNCTION
function timeRules() {
    //UPDATE MONEY FROM STATEGAME
    companyNameDOM.innerHTML = stateGame.ownCompany.name
    ownMoneyDOM.innerHTML = stateGame.ownCompany.money
    clientMoneyDOM.innerHTML = stateGame.clients[currentClient].money
    dayDom.innerHTML = stateGame.clock.day

    min++
    checkCostPerHour() //CHECK AND DEDUCE COST PER HOUR
    if (min >= 60) { //SET END OF AN HOUR
        min = 0
        hour++
    }
    if (hour == 16) { //SET END OF WORK HOUR
        hour = 8
        day++
        endOfWorkTime() //CALL END OF WORKTIME FUNCTION
    }
    let min00 = ("0" + min).slice(-2);
    // let date = new Date();
    // let h = date.getHours();
    span.textContent = hour + ":" + min00;
    stateGame.clock.minute = min00
    stateGame.clock.hour = hour
    stateGame.clock.day = day
    verifyAssigned()
}
setInterval(timeRules, 200); //START CLOCK



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
                    //ADD COST PER HOUR PER TYPE
                    CostPerHourPerType = totalWorkersCount * workersOnSite.price

                    //ADD TO THE TOTAL PER HOUR
                    targetClient.costPerHour += CostPerHourPerType
                    // totalCostPerHour = CostPerHourPerType + totalCostPerHour


                    //DEDUCE COST PER HOUR OR WHEN JOB TIME FINISH
                    if (workersOnSite.timer >= 60 || hour == 16) {
                        workersOnSite.timer = 0
                        let workersCostPerHour = totalWorkersCount * workersOnSite.price

                        //TAKE OWN MONEY IF CLIENT ONE REACHES ZERO
                        if (targetClient.money < workersCostPerHour) {
                            targetClient.money -= workersCostPerHour
                            stateGame.ownCompany.money += targetClient.money
                            targetClient.money = 0
                            endOfWorkTime()
                        } else {
                            targetClient.money -= workersCostPerHour
                            console.log(targetClient.name + " -$" + workersCostPerHour)
                            ownMoneyDOM.innerHTML = stateGame.ownCompany.money
                            clientMoneyDOM.innerHTML = stateGame.clients[currentClient].money
                        }
                    }
                }
            }
        }
    }
    // DEDUCE OWN MONEY IF CLIENT MONEY < 0
    if (stateGame.clients[currentClient].money < 0) {
        stateGame.ownCompany.money += stateGame.clients[currentClient].money
        stateGame.clients[currentClient].money = 0
    }

    let costPerHourValueDOM = document.getElementById("costperhour-value")
    costPerHourValueDOM.innerHTML = stateGame.clients[currentClient].costPerHour
}

//======================================================================================//
//END CLOCK FUNCTIONS





//======================================================================================//
//RESPONSIBLE FOR ALL TASKS FUNCTIONS RULES RELATED
//======================================================================================//

// UNASSIGN ALL WORKERS AND ZERO COST PER HOUR
function endOfWorkTime() {
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
        for (let workersOnSite of targetClient.workers) {
            stateGame.clients[currentClient].money -= workersOnSite.price * workersOnSite.count
            console.log(workersOnSite.name + " " + workersOnSite.price)
            workersOnSite.count = 0
            updateGame()
        }
    }
}


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
                    console.log("startTask -> workersOnSite", workersOnSite)
                    console.log("startTask -> workerAssigned", workerAssigned)
                    workersOnSite.count += workerAssigned.count
                    workerAssigned.count = 0
                    workerAssigned.assigned = false
                    updateGame()
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
    updateGame()
}


//ASSIGN (OR UNASSIGN) WORKER TO A TASK
function assignWorkerOrService(workersNeeded, idButton) {

    for (let workersOnSite of stateGame.clients[currentClient].workers) {
        //ASSIGN WORKER TO A TASK
        if (workersOnSite.name == workersNeeded.type &&
            workersOnSite.count >= workersNeeded.count) {
            workersNeeded.assigned = true
            workersOnSite.count -= workersNeeded.count
            return updateGame()
        }
        //UNASSIGN WORKER TO A TASK
        if (workersOnSite.name == workersNeeded.type &&
            workersNeeded.assigned == true) {
            workersNeeded.assigned = false
            workersOnSite.count += workersNeeded.count
            return updateGame()
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
            return updateGame()
        }
    }
}

//======================================================================================//
//END TASKS FUNCTIONS RULES





//======================================================================================//
//RESPONSIBLE FOR ALL STORE FUNCTIONS RULES RELATED
//======================================================================================//

//CREATE THE ITEMS LIST OF A CATEGORY WHEN BUTTON IS CLICKED
function itemList(categoryItem) {
    storeBuyContainerDOM.innerHTML = ""
    categoryItem.stock.forEach(item => {

        //DRAW </li> tag First
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

        //THAN DRAW </button> tag + click function
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

//ADD ITEMS TO WAREHOUSE(IF ITS A MATERIAL) OR SITE(IF ITS A WORKER/SERVICE)
function buyItem(itemBought, categoryItem) {
    // console.log(itemBought)
    const inputCountId = `${itemBought.name}-buyinput`
    const getCount = document.getElementById(inputCountId);

    //CONDITION TO PREVENT BREAK CODE IF INPUT IS IN WRONG FORMAT
    if (itemBought === null || getCount === null || getCount < 1) return console.log("DEU TILT")
    if (getCount.value == undefined || getCount.value == null) {
        getCount.value = 1
    }

    //GET THE count BOUGHT
    countBought = parseInt(getCount.value)
    let moneySpent = countBought * itemBought.price

    //PREVENTS BUY SERVICES OR MATERIALS IF CLIENT BUDGET = 0
    if (stateGame.clients[currentClient].money == 0) { return }

    //DEDUCE (CLIENT MONEY + OWN MONEY) IF CLIENT MONEY IS LESS moneySpent
    if (stateGame.clients[currentClient].money <= moneySpent) {
        stateGame.clients[currentClient].money -= moneySpent
        stateGame.ownCompany.money += stateGame.clients[currentClient].money
        stateGame.clients[currentClient].money = 0
        return endOfWorkTime()
    }
    else


        //SUBTRACT MONEY FROM CLIENT IMMEDIATELY IF NOT A SERVICE
        if (itemBought.service) { }
        else { stateGame.clients[currentClient].money -= moneySpent; }


    //CHECK IF IT IS AN ITEM OR A SERVICE
    let warehouseOrWorkersContainer = stateGame.clients[currentClient].warehouse
    if (itemBought.service) {
        warehouseOrWorkersContainer = stateGame.clients[currentClient].workers
    }

    //SEND TO STATEGAME
    let itemStored = warehouseOrWorkersContainer.find(itemStored => itemStored.name === itemBought.name);
    //VERIFY IF ITEM EXISTS
    if (itemStored === undefined) {
        console.log(itemStored)
        itemStored = { ...itemBought, "count": 0, } //CREATE NEW OBJECT
        console.log(itemStored)

        warehouseOrWorkersContainer.unshift(itemStored)
    }

    //ADD TO EXISTING
    for (let itemStored of warehouseOrWorkersContainer) {
        if (itemStored.name === itemBought.name) {
            itemStored.count = itemStored.count + countBought;
            break; //Stop this loop, we found it!
        }
    }

    updateGame()
}

//======================================================================================//
//END STORE FUNCTIONS RULES