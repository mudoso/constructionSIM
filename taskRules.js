

//RESPOSIBLE FOR ALL TASKS FUNCTIONS RULES RELATED

//START THE TASK IF ALL CONDITIONS ARE TRUE
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
    for (let workersOnSite of statsWorkersAndServices) {
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