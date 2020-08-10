

//RESPOSIBLE FOR DEFINE ALL GLOBAL VARIABLES (BUT TIME ONES)
//RESPOSIBLE FOR DEFINE ALL PATHS
//RESPOSIBLE FOR UPDATE TASKS AND BUTTONS
//START THE GAME AFTER ALL CODE IS LOADED





// UPDATE ALL THE BUTTONS, CARDS AND THEIR RESPECTIVE .onclick CALLOUTS
function updateGame() {

    /*
    clientLeftArrowButtonDOM
    clientSelectedButtonDOM
    clientRightArrowButtonDOM
    */

    //UPDATE CLIENT
    clientSelectedButtonDOM.innerHTML = currentClient
    clientLeftArrowButtonDOM.onclick = () => {};
    clientRightArrowButtonDOM.onclick = () => {};


    //UPDATE CATEGORY CATALOG BUTTONS
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
    `Total Cost $<span id="costperhour-value">${stateGame[currentClient].costPerHour}</span>/hour ${extraShift}`
    button.setAttribute('id', `${Object.keys(stateGame[currentClient].costPerHour)}`);
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

updateGame() //CALL UPDATE FUNCTION AFTER ALL CODE IS LOADED