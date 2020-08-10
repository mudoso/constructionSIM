

//RESPOSIBLE FOR CLOCK RELATED FUNCTIONS


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