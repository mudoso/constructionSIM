let setClient = "client1"
"teste2"

//==========NAV STATS PATH=============
const currentDateDOM = document.getElementById("current-date")
const ownMoneyDOM = document.getElementById("own-money")

let clientMoney = stateGame[setClient].money
const clientMoneyDOM = document.getElementById("client-money")

const costPerHourDOM = document.getElementById("cost-per-hour")
//==========NAV STORE PATH=============
const storeCategoryContainerDOM = document.getElementById("store-category")
const storeBuyContainerDOM = document.getElementById("store-buy-items")

//==========NAV STORE CATEGORY ITEMS=============
const storeItems = Object.keys(store)

//==========NAV INVENTOR / WORKERS-SERVICES / WAREHOUSE PATH=============
const warehouseContainerDOM = document.getElementById("warehosue-container")
const statsInventoryWarehouse = stateGame[setClient].warehouse

const workersAndServicesContainerDOM = document.getElementById("workers-services")
const statsWorkersAndServices = stateGame[setClient].workers

const statsCostPerHour = stateGame[setClient].costPerHour

//==========NAV CONSTUCTION  PATH=============
const constructionContainerDOM = document.getElementById("construction-container")
const statsConstructionSite = stateGame[setClient].construction



function updateMoney() { //NOT USED ANYMORE

    //DEDUCE CLIENT MONEY FROM COST PER HOUR
    stateGame[setClient].money -= stateGame[setClient].costPerHour
    ownMoneyDOM.innerHTML = stateGame.ownCompany.money
    clientMoneyDOM.innerHTML = stateGame[setClient].money
}

function updateGame() {

    //UPDATE MONEY FROM STATEGAME
    ownMoneyDOM.innerHTML = stateGame.ownCompany.money
    clientMoneyDOM.innerHTML = stateGame[setClient].money
    
    //UPDATE CLIENT@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    /*
    storeCategoryContainerDOM.innerHTML = ""
    storeItems.forEach(categoryItem => {
        let button = document.createElement('button');
        button.innerHTML = categoryItem
        button.setAttribute('id', categoryItem);
        if (categoryItem === "Workers" || categoryItem === "Services") {
            button.setAttribute('class', 'btn-darkblue');
        }
        else button.setAttribute('class', 'btn');
        button.onclick = () => {itemList(categoryItem)};
        storeCategoryContainerDOM.appendChild(button);
    })
    */

    //UPDATE CATEGORY CATALOG
    storeCategoryContainerDOM.innerHTML = ""
    storeItems.forEach(categoryItem => {
        let button = document.createElement('button');
        button.innerHTML = categoryItem
        button.setAttribute('id', categoryItem);
        if (categoryItem === "Workers" || categoryItem === "Services") {
            button.setAttribute('class', 'btn-darkblue');
        }
        else button.setAttribute('class', 'btn');
        button.onclick = () => {itemList(categoryItem)};
        storeCategoryContainerDOM.appendChild(button);
    })

    //UPDATE WAREHOUSE BUTTONS
    warehouseContainerDOM.innerHTML = ""
    statsInventoryWarehouse.forEach(itemStored => {
        if (itemStored.count > 0) {
            let button = document.createElement('button');
            button.innerHTML =
            `${itemStored.name} <span id="${itemStored.name}">
            ${itemStored.count}
            </span>${itemStored.unit}`
            button.setAttribute('id', itemStored.name);
            button.setAttribute('class', `btn`);
            button.onclick = () => {};
            warehouseContainerDOM.appendChild(button);
        }
    })
    
    //UPDATE WORKERS AND SERVICES BUTTONS
    workersAndServicesContainerDOM.innerHTML = ""
    statsWorkersAndServices.forEach(workerOrServiceStored => {
        if (workerOrServiceStored.count > 0) {
            let button = document.createElement('button');
            button.innerHTML =
            `${workerOrServiceStored.count} ${workerOrServiceStored.name} $${workerOrServiceStored.price}/${workerOrServiceStored.unit}`
            button.setAttribute('id', workerOrServiceStored.name);
            button.setAttribute('class', `btn-darkblue btn-sendback btn-${workerOrServiceStored.category}`);
            button.setAttribute('btn-sudocontent', `Send Back $${workerOrServiceStored.price}`);
            button.onclick = () => {sendBackWorkerOrService(workerOrServiceStored)};
            workersAndServicesContainerDOM.appendChild(button);
        }

    })
    
    //UPDATE COST PER HOUR
    costPerHourDOM.innerHTML = ""
    let button = document.createElement('button');
    button.innerHTML =
    `Total Cost $<span id="costperhour-value">${stateGame[setClient].costPerHour}</span>/hour ${extraShift}`
    button.setAttribute('id', `${Object.keys(stateGame[setClient].costPerHour)}`);
    button.setAttribute('class', `btn-darkblue`);
    button.onclick = () => {};
    costPerHourDOM.appendChild(button);


    //UPDATE CONSTRUCTION SITE CARD TASKS
    constructionContainerDOM.innerHTML = ""
    for (let constructionSiteStage of statsConstructionSite) {
        constructionSiteStage.forEach(constructionSiteElement => {

            //TRACK PROGRESS AND DRAW CARD
            if (constructionSiteElement.progress < 100) {
                //CREATE </div> TAG FIRST
                let div = document.createElement('div');
                div.innerHTML =
                `<span id="${constructionSiteElement.stage}-${constructionSiteElement.index}">
                (${constructionSiteElement.stage})
                </span>
                <span id="${constructionSiteElement.stage}-${constructionSiteElement.index}-progress">
                ${constructionSiteElement.progress} %
                </span> <br>`
                div.setAttribute('id', `${constructionSiteElement.stage}-${constructionSiteElement.index}`);
                div.setAttribute('class', `card center`);
                // div.onclick = () => {};
                constructionContainerDOM.appendChild(div);

                //THAN DRAW </button> TAG FOR ==WORKERS (OR SERVICES) NEEDED==
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
                            button.onclick = () => {assignWorkerOrService(workersNeeded, idButton)};
                            button.innerHTML = `${workersNeeded.count} ${workersNeeded.type} Assigned`
                        }
                        else {
                            button.setAttribute('id', idButton);
                            button.onclick = () => {assignWorkerOrService(workersNeeded, idButton)};
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
                            button.onclick = () => {};
                            button.innerHTML = `${materialNeeded.count} ${materialNeeded.name}`
                        }
                        button.onclick = () => {assignMaterial(materialNeeded, idButton)};
                        const buttonMaterialsNeeded = document.getElementById(`${constructionSiteElement.stage}-${constructionSiteElement.index}`)
                        buttonMaterialsNeeded.appendChild(button);
                    })
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


// SET TIME
const span = document.getElementById('time');
let min = 0
let hour = 8
let day = 1
let extraShift = ""
// CLOCK FUNCTION
function timeRules() {
    min++
    checkCostPerHour()
    if (min >= 60) { //SET END OF AN HOUR
        min = 0
        hour++
        checkCostPerHour()
    }
    if (hour == 16) { //SET END OF WORK HOUR
        hour = 8
        day++
        endOfWorkTime()
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
setInterval(timeRules, 100);



function checkCostPerHour() {
    let totalCostPerHour = 0 //SET COST PER HOUR TO ZERO AT THE FUNCTION BEGINING
    //LOOK FOR ALL THE ASSIGN WORKERS FOR EACH TYPE
    for (let workersOnSite of statsWorkersAndServices) {
        if (workersOnSite != undefined) {
            let workersAssignedCount = 0
            for (let constructionSiteStage of statsConstructionSite) {
                for (let constructionSiteElement of constructionSiteStage) {
                    for (let workersAssigned of constructionSiteElement.workersNeeded) {
                        if (workersAssigned.type == workersOnSite.name) {
                            if (workersAssigned.assigned == true) {
                                //GET ALL ASSIGNED WORKERS
                                workersAssignedCount += workersAssigned.count
                            }
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
                totalCostPerHour = CostPerHourPerType + totalCostPerHour

                //DEDUCE COST PER HOUR OR WHEN JOB TIME FINISH
                if (workersOnSite.timer >= 60 || hour == 16) {
                    workersOnSite.timer = 0
                    let workersCostPerHour = totalWorkersCount * workersOnSite.price

                    //TAKE OWN MONEY IF CLIENT ONE REACHES ZERO
                    if (stateGame[setClient].money < workersCostPerHour) {
                        stateGame[setClient].money -= workersCostPerHour
                        stateGame.ownCompany.money += stateGame[setClient].money
                        stateGame[setClient].money = 0
                        endOfWorkTime()
                    } else {
                        stateGame[setClient].money -= workersCostPerHour
                        console.log(workersCostPerHour)
                        ownMoneyDOM.innerHTML = stateGame.ownCompany.money
                        clientMoneyDOM.innerHTML = stateGame[setClient].money
                    }
                }
            }
        }
    }
    //TOTAL PER HOUR
    stateGame[setClient].costPerHour = totalCostPerHour
    let costPerHourValueDOM = document.getElementById("costperhour-value")
    costPerHourValueDOM.innerHTML = stateGame[setClient].costPerHour

}




// UNASSIGN ALL WORKERS AND ZERO COST PER HOUR
function endOfWorkTime() {
    for (let constructionSiteStage of statsConstructionSite) {
        for (let constructionSiteElement of constructionSiteStage) {
            for (let workerNeeded of constructionSiteElement.workersNeeded) {
                workerNeeded.assigned = false
                stateGame[setClient].costPerHour = 0
            }
        }
    }
    for (let workersOnSite of statsWorkersAndServices) {
        workersOnSite.count = 0
    }
    updateGame()
}



// VERIFYER ASSIGNED MATERIAL OR WORKER
function verifyAssigned() {
for (let constructionSiteStage of statsConstructionSite) {
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
                    return startTask(constructionSiteElement)
                }
            }
            // START PROGRESS IF ALL WORKERS ARE ASSIGNED AND THERE IS NO MATERIALS TO TAKS 
            if (isWorkersNeededTrue && constructionSiteElement.materialNeeded == undefined) {
                return startTask(constructionSiteElement)
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


function sendBackWorkerOrService(workerOrServiceStored) {
    stateGame[setClient].money -= workerOrServiceStored.price
    stateGame[setClient].costPerHour -= workerOrServiceStored.price
    workerOrServiceStored.price
    workerOrServiceStored.count--
    updateGame()
}


function startTask(constructionSiteElement) {
    if (constructionSiteElement == undefined) {
        console.log("ERROR")
    }
    if (constructionSiteElement.progress < 100) {
        
        constructionSiteElement.progress++ //PROGRESS RULE
        const cardTaskPercentage = document.getElementById(`${constructionSiteElement.stage}-${constructionSiteElement.index}-progress`)
        cardTaskPercentage.innerHTML = `${constructionSiteElement.progress} %`

        // WHEN TASK REACH 100% UPDATE AND SEND WORKERS BACK TO STORE?
        if (constructionSiteElement.progress >= 100) {
            for (let workerAssigned of constructionSiteElement.workersNeeded) {
                for (let workersOnSite of statsWorkersAndServices) {
                    if (workerAssigned.type == workersOnSite.name) {
                        workersOnSite.count += workerAssigned.count
                        workerAssigned.count = 0
                        updateGame()
                    }
                }  
                updateGame()
            }
        }
    }
}

//ASSIGN (OR UNASSIGN) WORKER TO A TASK
function assignWorkerOrService(workersNeeded, idButton) {
    for (let workersOnSite of statsWorkersAndServices) {
        //UNASSAIN WORKER TO A TASK
        if (workersOnSite.name == workersNeeded.type && 
            workersNeeded.assigned == true) {
            workersNeeded.assigned = false
            workersOnSite.count += workersNeeded.count
            return updateGame()
        }
        //ASSIGN WORKER TO A TASK
        if (workersOnSite.name == workersNeeded.type &&
            workersOnSite.count >= workersNeeded.count) {
            workersNeeded.assigned = true
            workersOnSite.count -= workersNeeded.count
            return updateGame()
        }    
    }
}

//ASSIGN MATERIAL TO A TASK
function assignMaterial(materialNeeded, idButton) {
    for (let materialOnWarehouse of statsInventoryWarehouse) {
        if (materialOnWarehouse.name == materialNeeded.name &&
            materialOnWarehouse.count >= materialNeeded.count) {
            //ASSIGN MATERIAL TO A TASK
            materialNeeded.assigned = true
            materialOnWarehouse.count -= materialNeeded.count
            return updateGame()
        }    
    }
}


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
        button.innerHTML = item.price
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
    if (stateGame[setClient].money <= moneySpent) {
        if (stateGame[setClient].money == 0) {return}
        stateGame[setClient].money -= moneySpent
        stateGame.ownCompany.money += stateGame[setClient].money
        stateGame[setClient].money = 0
        return endOfWorkTime()
    } 
    stateGame[setClient].money -= moneySpent;  //SUBTRACT MONEY FROM CLIENT

    // CHECK IF IT IS AN ITEM OR A SERVICE
    let warehouseOrWorkersContainer = stateGame[setClient].warehouse
    if (itemBought.service) {
        warehouseOrWorkersContainer = stateGame[setClient].workers
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
    function addCountToItemStored( itemBought, countBought ) {
        for (let itemStored of warehouseOrWorkersContainer) {
            if (itemStored.name === itemBought.name) {
                if (itemBought.service && countBought > 0) {
                stateGame[setClient].costPerHour += itemBought.price
                }
                itemStored.count = itemStored.count + countBought;
                break; //Stop this loop, we found it!
            }
        }
    }
    updateGame()
}

updateGame()