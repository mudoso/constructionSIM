
//======================================================================================//
//RESPOSIBLE FOR DEFINE ALL GLOBAL VARIABLES (BUT TIME ONES)
//======================================================================================//

//DEFINE ALL GLOBAL PATHS

//==========NAV CLIENT PATH=============
let currentClient = 0
const clientLeftArrowButtonDOM = document.getElementById("btn-clients-left")
const clientSelectedButtonDOM = document.getElementById("btn-clients")
const clientRightArrowButtonDOM = document.getElementById("btn-clients-right")

//==========NAV STATS PATH=============
const currentDateDOM = document.getElementById("current-date")
const ownMoneyDOM = document.getElementById("own-money")
const clientMoneyDOM = document.getElementById("client-money")
const costPerHourDOM = document.getElementById("cost-per-hour")

//==========NAV STORE PATH=============
const storeItems = Object.keys(store)
const storeCategoryContainerDOM = document.getElementById("store-category")
const storeBuyContainerDOM = document.getElementById("store-buy-items")


//==========NAV INVENTOR / WORKERS-SERVICES / WAREHOUSE PATH=============
const warehouseContainerDOM = document.getElementById("warehosue-container")
const statsInventoryWarehouse = stateGame.clients[currentClient].warehouse
const workersAndServicesContainerDOM = document.getElementById("workers-services")
const statsWorkersAndServices = stateGame.clients[currentClient].workers
const statsCostPerHour = stateGame.clients[currentClient].costPerHour

//==========NAV CONSTUCTION  PATH=============
const constructionContainerDOM = document.getElementById("construction-container")
const statsConstructionSite = stateGame.clients[currentClient].construction

//======================================================================================//



//======================================================================================//
//RESPOSIBLE FOR CLOCK RELATED FUNCTIONS
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
    ownMoneyDOM.innerHTML = stateGame.ownCompany.money
    clientMoneyDOM.innerHTML = stateGame.clients[currentClient].money

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
setInterval(timeRules, 100); //START CLOCK


function checkCostPerHour() {
    let totalCostPerHour = 0 //SET COST PER HOUR TO ZERO AT THE FUNCTION BEGINING
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
                    workersOnSite.timer ++
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
                            console.log(targetClient.name + " -$"+workersCostPerHour)
                            ownMoneyDOM.innerHTML = stateGame.ownCompany.money
                            clientMoneyDOM.innerHTML = stateGame.clients[currentClient].money
                        }
                    }
                }
            }
        }
    // //TOTAL PER HOUR
    // targetClient.costPerHour = totalCostPerHour
    }


    let costPerHourValueDOM = document.getElementById("costperhour-value")
    costPerHourValueDOM.innerHTML = stateGame.clients[currentClient].costPerHour
}

//======================================================================================//
//END CLOCK FUNCTIONS





//======================================================================================//
//RESPOSIBLE FOR ALL TASKS FUNCTIONS RULES RELATED
//======================================================================================//

// UNASSIGN ALL WORKERS AND ZERO COST PER HOUR
function endOfWorkTime() {
    for (let targetClient of stateGame.clients) {
        for (let constructionSiteStage of targetClient.construction) {
            for (let constructionSiteElement of constructionSiteStage) {
                for (let workerNeeded of constructionSiteElement.workersNeeded) {
                    workerNeeded.assigned = false
                    targetClient.costPerHour = 0
                }
            }
        }
        for (let workersOnSite of targetClient.workers) {
            workersOnSite.count = 0
        }
        updateGame()
    }
}


//START THE TASK IF ALL CONDITIONS ARE TRUE
function startTask(constructionSiteElement, targetClient) {
    if (constructionSiteElement == undefined) {console.log("ERROR")}

    if (constructionSiteElement.progress < 100) {

        constructionSiteElement.progress++ //PROGRESS RULE
        const cardTaskPercentage = document.getElementById(`${constructionSiteElement.stage}-${stateGame.clients.indexOf(targetClient)}-${constructionSiteElement.index}-progress`)
        if (cardTaskPercentage == undefined || cardTaskPercentage == null) {return}
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
                    console.log("teste")
                    updateGame()
                }
            }  
        }
    }
}


// VERIFYER ASSIGNED MATERIAL OR WORKER
function verifyAssigned() {
    for (let targetClient of stateGame.clients) {
        for (let constructionSiteStage of targetClient.construction) {
            constructionSiteStage.forEach(constructionSiteElement => {
        
                //VERIFY IF ALL WORKERS (OR SERVICES) WERE ASSIGNED TO THE JOB TO START THE TASK
                if (constructionSiteElement.workersNeeded != undefined){
                    let isWorkersNeededTrue = constructionSiteElement.workersNeeded.every(function (workersNeeded) {
                        return workersNeeded.assigned;
                    });
                    //VERIFY IF ALL MATERIALS WERE ASSIGNED TO THE JOB TO START THE TASK
                    if (constructionSiteElement.materialNeeded != undefined){
                        let = isMaterialNeededTrue = constructionSiteElement.materialNeeded.every(function (materialNeeded) {
                            return materialNeeded.assigned;
                        });
                        // START PROGRESS IF ALL WORKERS AND MATERIALS ARE ASSIGNED
                        if (isWorkersNeededTrue && isMaterialNeededTrue) {
                            return startTask(constructionSiteElement, targetClient)
                        }
                    }
                    // START PROGRESS IF ALL WORKERS ARE ASSIGNED AND THERE IS NO MATERIALS TO TAKS 
                    if (isWorkersNeededTrue && constructionSiteElement.materialNeeded == undefined) {
                        return startTask(constructionSiteElement, targetClient)
                    }
                }
            })
            let condition = constructionSiteStage.every((constructionSiteElement) => {
                return constructionSiteElement.progress >= 100
            });
            if (condition == false){
                //console.log("break")
                break
            }
        }
    }
}
    

//SEND THE WROKER(OR SERVICE) BACK AND DEDUCE COST
function sendBackWorkerOrService(workerOrServiceStored) {
    stateGame.clients[currentClient].money -= workerOrServiceStored.price
    stateGame.clients[currentClient].costPerHour -= workerOrServiceStored.price
    workerOrServiceStored.price
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
        //UNASSAIN WORKER TO A TASK
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
//RESPOSIBLE FOR ALL STORE FUNCTIONS RULES RELATED
//======================================================================================//

//CREATE THE ITEMS LIST OF A CATEGORY WHEN BUTTON IS CLICKED
function itemList(categoryItem) {
    storeBuyContainerDOM.innerHTML = ""
    store[categoryItem].forEach(item => {
        
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
        button.onclick = () => {buyItem(item, categoryItem)};
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

    if (getCount.value == undefined || getCount.value == null) {
        getCount.value = 1
    }
    countBought = parseInt(getCount.value)  //GET THE count BOUGHT
    let moneySpent = countBought * itemBought.price

    if (itemBought === null || getCount === null || getCount < 1) return console.log("DEU TILT")
    //IF TOTAL COST IS LESS OR EQUAL TO 
    if (stateGame.clients[currentClient].money <= moneySpent) {
        if (stateGame.clients[currentClient].money < moneySpent) {return}
        stateGame.clients[currentClient].money -= moneySpent
        stateGame.ownCompany.money += stateGame.clients[currentClient].money
        stateGame.clients[currentClient].money = 0
        return endOfWorkTime()
    }

    stateGame.clients[currentClient].money -= moneySpent;  //SUBTRACT MONEY FROM CLIENT

    //CHECK IF IT IS AN ITEM OR A SERVICE
    let warehouseOrWorkersContainer = stateGame.clients[currentClient].warehouse
    if (itemBought.service) {
        warehouseOrWorkersContainer = stateGame.clients[currentClient].workers
    }

    //SEND TO STATEGAME
    let itemStored = warehouseOrWorkersContainer.find(itemStored => itemStored.name === itemBought.name);
    //VERIFY IF ITEM EXISTS
    if (itemStored === undefined) {
        itemBought.count = 0
        itemBought.category = categoryItem
        warehouseOrWorkersContainer.push(itemBought)
    }
    //ADD TO EXISTING
    addCountToItemStored(itemBought, countBought)
    function addCountToItemStored(itemBought, countBought) {
        for (let itemStored of warehouseOrWorkersContainer) {
            if (itemStored.name === itemBought.name) {
                // if (itemBought.service && countBought > 0) {
                // stateGame.clients[currentClient].costPerHour += itemBought.price
                // }
                itemStored.count = itemStored.count + countBought;
                break; //Stop this loop, we found it!
            }
        }
    }
    updateGame()
}

//======================================================================================//
//END STORE FUNCTIONS RULES