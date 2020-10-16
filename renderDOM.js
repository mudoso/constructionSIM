//======================================================================================//
//RESPONSIBLE FOR UPDATE TASKS AND BUTTONS
//START THE GAME AFTER ALL CODE IS LOADED
//======================================================================================//


//DEFINE ALL GLOBAL PATHS
//==========NAV CLIENT PATH=============
const clientLeftArrowButtonDOM = document.getElementById('btn-clients-left')
const clientSelectedButtonDOM = document.getElementById('btn-clients')
const clientRightArrowButtonDOM = document.getElementById('btn-clients-right')
const menuClientBackgroundBlock = document.getElementById('menu-client-block');
const menuClientButtonDOMOut = document.getElementById('menu-client-close');
const menuClientButton = document.getElementById('btn-clients');
const menuClientName = document.getElementById('menu-client-name')
const menuClientMoney = document.getElementById('client-money-menu')
const menuClientStages = document.getElementById('menu-client-stages')
const menuClientMaterialsNeeded = document.getElementById(`menu-client-materials`)
const menuClientSendMoneyInput = document.getElementById('send-money-input')
const costPerHourDOM = document.getElementById('cost-per-hour')
const menuOwnClients = document.querySelector('.menu-own-company-clients')
const menuOwnSkills = document.querySelector('.menu-own-company-skills')
const storeCategoryContainerDOM = document.getElementById('store-category')
const storeBuyContainerDOM = document.getElementById('store-buy-items')
const warehouseContainerDOM = document.getElementById('warehouse-container')
const warehouseLimitDOM = document.getElementById('warehouse-limit')
const workersAndServicesContainerDOM = document.getElementById('workers-services')
const constructionContainerDOM = document.getElementById('construction-container')
const speedPauseBtn = document.querySelector('#pause-btn')
const speedPlayBtn = document.querySelector('#speed-btn')

function renderDOM() {

    renderMoney()

    renderClientSelectorMenu()

    renderNewClientSelector()

    renderCategoryStoreBtn()

    renderWarehouseBtn()

    renderWarehouseLimit()

    renderWorkersAndServicesBtn()

    renderCostPerHourBtn()

    renderOwnCompanyMenuClients()

    renderOwnCompanyMenuSkills()

    addListenerToSpeedPanel()

    renderMenuClient()

    renderConstructionTaskCards()

    //======================================================================================//
    //RENDER FUNCTIONS
    //======================================================================================//


    //HEADER AND NAV
    //======================================================================================//
    function renderMoney() {
        ownMoneyDOM.innerHTML = stateGame.ownCompany.money
        clientMoneyDOM.innerHTML = 0
        if (stateGame.clients[currentClient] == null) {
            return clientMoneyDOM.innerHTML = 0
        }
        clientMoneyDOM.innerHTML = stateGame.clients[currentClient].money
    }

    function renderOwnCompanyMenuClients() {
        menuOwnClients.innerHTML = ""
        for (let clients of stateGame.clients) {
            const stageItemsProgressList = clients.construction
                .map(stage => stage.map(itemStage => itemStage.progress))
                .flat()

            const completedTasks = stageItemsProgressList
                .filter(progress => progress >= 100)
            const taskProgression = `${completedTasks.length}/${stageItemsProgressList.length}✔️`
            const taskPercentage = Math.floor(completedTasks.length / stageItemsProgressList.length * 1000) / 10

            let button = document.createElement('button')
            button.innerHTML = `<div>${clients.name}</div><div>${taskProgression} Completed Tasks   (${taskPercentage}%)</div>`
            button.setAttribute('id', clients.name)
            button.setAttribute('class', "flex-between btn")
            button.setAttribute('style', "display: flex")
            button.onclick = () => { }
            menuOwnClients.appendChild(button);
        }
    }

    function renderOwnCompanyMenuSkills() {
        menuOwnSkills.innerHTML = ""
        const companySkills = Object.entries(stateGame.ownCompany.skills)

        for (const [skill, value] of companySkills) {
            let li = document.createElement('li');
            li.innerHTML =
                `<h3>${skill.toUpperCase()}</h3>
                <div id="skill-div-${skill}" class="skill-span">
                    <h3 id="skill-${skill}">${value}</h3>
                </div>`
            li.setAttribute('class', "skill-line flex-between")
            menuOwnSkills.appendChild(li)

            const isSkillPointAvailable = stateGame.ownCompany.skillPoints > 0

            addSkillButton(skill, isSkillPointAvailable)
        }
    }

    function addSkillButton(skill, isSkillPointAvailable) {
        const skillLI = document.querySelector(`#skill-div-${skill}`)

        let button = document.createElement('button')
        button.innerHTML = "+"
        button.setAttribute('class', 'add-skill')
        button.setAttribute('style', "display: none")
        button.onclick = event =>
            addSkillPoint(event.path[2].children[0].innerText, isSkillPointAvailable)
        skillLI.appendChild(button)
    }

    function addListenerToSpeedPanel() {
        speedPauseBtn.onclick = () => stopTime(speedPlayBtn)
        speedPlayBtn.onclick = () => speedTime(speedPlayBtn)
    }

    function renderClientSelectorMenu() {

        if (stateGame.clients[currentClient] == null) {
            clientSelectedButtonDOM.onclick = () => { };
            return clientSelectedButtonDOM.innerHTML = "NONE"
        }

        clientSelectedButtonDOM.innerHTML = stateGame.clients[currentClient].name
        clientLeftArrowButtonDOM.onclick = () => { selectClientLeft() };
        clientRightArrowButtonDOM.onclick = () => { selectClientRight() };
        clientSelectedButtonDOM.onclick = () => { menuClientOn(menuClientBackgroundBlock) };
    }

    function selectClientRight() {
        currentClient++
        if (stateGame.clients[currentClient] != null) return renderDOM()
        currentClient = 0
        renderDOM()
    }

    function selectClientLeft() {
        currentClient--
        if (stateGame.clients[currentClient] != null) return renderDOM()
        currentClient = stateGame.clients.length - 1
        renderDOM()
    }

    function menuClientOn(menuClientBackgroundBlock) {
        menuClientBackgroundBlock.style.display = "block"
    }

    // function menuClientOff(menuClientBackgroundBlock) {
    //     menuClientBackgroundBlock.style.display = "none"
    //     renderMenuClient()
    // }

    menuClientBackgroundBlock.addEventListener('click', event => {
        const closeTarget = event.target.id
        if (closeTarget == 'menu-client-block' || closeTarget == 'menu-client-close') {
            menuClientBackgroundBlock.style.display = "none"
        }
    })

    function renderNewClientSelector() {
        const renderNewClientSelectorDOM = document.getElementById("looking-for-client")
        renderNewClientSelectorDOM.innerHTML = ""

        const areAvailableAttempts = stateGame.lookingForClients.lookingAttempts > 0
        const areAvailableClient = stateGame.lookingForClients.clientList.length > 0

        if (!areAvailableClient) {
            renderNewClientSelectorDOM.innerHTML =
                `<h4>NO MORE CLIENTS FOUND TODAY</h4>`
        }

        if (areAvailableAttempts && !areAvailableClient) {
            renderNewClientSelectorDOM.innerHTML = ''

            let button = document.createElement('button');
            button.innerHTML = `LOOK FOR NEW CLIENTS`
            button.setAttribute('class', "btn");
            button.onclick = event => { researchNewClients(event.target) }
            renderNewClientSelectorDOM.appendChild(button);
        }

        for (let client of stateGame.lookingForClients.clientList) {
            let section = document.createElement('div');
            let btnClass = "btn"
            let attempt = "???"
            if (client.attempt != null && client.attempt > 0) {
                btnClass = "btn btn-sendback"
                attempt = client.attempt
            }
            section.innerHTML =
                `<section id="${client.name}-looking-client" class="looking-client">
                    <button id="${client.name}-newClient-menu" class="btn">${client.name}</button>
                    <div>
                        <input id="${client.id}input" class="form" type="number" name="quantities" 
                            min="${client.money}" 
                            value="${client.money}"
                            step="1000">
                            $
                        <button id="${client.name}-offer-client-btn"
                            class="${btnClass}"
                            btn-sudocontent="Attempts: ${attempt}">OFFER</button>
                    </div>
                </section>`
            renderNewClientSelectorDOM.appendChild(section);

            const buttonNewClientMenu = document.getElementById(`${client.name}-newClient-menu`)
            const buttonOfferClient = document.getElementById(`${client.name}-offer-client-btn`)
            const inputOfferClient = document.getElementById(`${client.id}input`)
            buttonOfferClient.onclick = () => { newClientSelectorBudgetOffer(client, inputOfferClient) }
            buttonNewClientMenu.onclick = () => {
                const menuClientBackgroundBlock = document.getElementById('menu-client-block');
                menuClientBackgroundBlock.style.display = "block"
                renderMenuClient(client)
            }
        }
    }

    function renderMenuClient(targetClientIsTrue) {

        menuClientStages.innerHTML = ""
        menuClientMaterialsNeeded.innerHTML = ""
        menuClientSendMoneyInput.innerHTML = ""
        menuClientMoney.innerHTML = clientMoneyDOM.innerHTML


        let clientSelected = stateGame.clients[currentClient]
        if (targetClientIsTrue) {
            clientSelected = targetClientIsTrue
            menuClientMoney.className = "";
            clientMoneyDOM = document.querySelectorAll(".client-money")
            menuClientMoney.innerHTML = clientSelected.money
        }
        if (clientSelected != targetClientIsTrue) {
            renderSendMoneyInput()
            menuClientMoney.className = "client-money";
            clientMoneyDOM = document.querySelectorAll(".client-money")
        }
        if (clientSelected == null) return

        menuClientName.innerHTML = clientSelected.name.toUpperCase()



        addMaterialsNeededToArray(clientSelected)
    }

    function addMaterialsNeededToArray(clientSelected) {

        const menuMaterialsArray = []

        for (let constructionSiteStage of clientSelected.construction) {
            let button = document.createElement('ul');
            let stageArray = clientSelected.construction
            button.innerHTML = `STAGE ${stageArray.indexOf(constructionSiteStage) + 1}:`
            button.setAttribute('id', `stage-${stageArray.indexOf(constructionSiteStage)}`);
            button.setAttribute('class', "margin");
            menuClientStages.appendChild(button);

            for (let constructionSiteElement of constructionSiteStage) {
                let button = document.createElement('li');
                button.innerHTML = `${constructionSiteElement.stage}`
                button.setAttribute('class', "btn");
                if (constructionSiteElement.progress >= 100) {
                    button.setAttribute('class', "btn btn-clear");
                    button.setAttribute('btn-sudocontent', 'Task Done');
                }
                document.getElementById(`stage-${stageArray.indexOf(constructionSiteStage)}`).appendChild(button);

                //UPDATE menuMaterialsArray WITH REMAINING NEEDED MATERIALS IN CLIENT MENU

                if (constructionSiteElement.progress < 100) {
                    for (let materialNeeded of constructionSiteElement.materialNeeded) {
                        let materialFound = menuMaterialsArray.find(itemInArray => itemInArray[0] == materialNeeded.name)
                        if (materialFound != undefined) {
                            let materialFoundCount = materialFound[1]
                            materialFoundCount += materialNeeded.count
                        } else {
                            menuMaterialsArray.push([materialNeeded.name, materialNeeded.count])
                        }
                    }
                }
            }
        }
        renderMenuClientMaterialsNeeded(menuMaterialsArray)
    }

    function renderMenuClientMaterialsNeeded(menuMaterialsArray) {
        //UPDATE REMAINING NEEDED MATERIALS IN CLIENT MENU
        for (let materialArray of menuMaterialsArray) {
            let button = document.createElement('button');
            button.innerHTML = `${materialArray[0]} (${materialArray[1]})`
            button.setAttribute('class', "btn");
            menuClientMaterialsNeeded.appendChild(button);
        }
    }

    function renderSendMoneyInput() {
        menuClientSendMoneyInput.innerHTML = `
            <input class="form money-div" type="number" name="send-own-money" id="send-own-money" 
            min="0"
            max="10000" 
            placeholder="0" 
            step="100" 
            value="0">
            <button id="send-money" class="btn">Send Money</button>
        `
        handleSendMoneyClient()
    }

    //WAREHOUSE (SITE STORAGE)
    //======================================================================================//

    function renderWarehouseBtn() {
        warehouseContainerDOM.innerHTML = ""
        if (stateGame.clients[currentClient] == null) return
        stateGame.clients[currentClient].warehouse.forEach(itemStored => {
            if (itemStored.count > 0) {
                let button = document.createElement('button');
                button.innerHTML =
                    `${itemStored.name} <span id="${itemStored.name}">
                ${itemStored.count}
                </span>${itemStored.unit}`
                button.setAttribute('id', itemStored.name);
                button.setAttribute('class', `btn btn-sendback`);
                button.setAttribute('btn-sudocontent', `Discard`);
                button.onclick = () => { discardWarehouseItem(itemStored) };
                warehouseContainerDOM.appendChild(button);
            }
        })
    }

    function renderWarehouseLimit() {
        if (stateGame.clients[currentClient] == null) return warehouseLimitDOM.innerHTML = `SITE STORAGE`
        warehouseLimitDOM.innerHTML = `SITE STORAGE (${warehouseDisplayLimit()})`
    }

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

    //STORE
    //======================================================================================//

    function renderCategoryStoreBtn() {
        storeCategoryContainerDOM.innerHTML = ""
        for (let categoryItem of store) {
            let button = document.createElement('button');
            button.innerHTML = categoryItem.name
            button.setAttribute('id', categoryItem.name);
            button.setAttribute('class', 'btn');
            if (categoryItem.service || categoryItem.service == undefined) {
                button.setAttribute('class', 'btn-darkblue');
            }
            button.onclick = () => { itemList(categoryItem) };
            storeCategoryContainerDOM.appendChild(button);
        }
    }

    function itemList(categoryItem) {
        storeBuyContainerDOM.innerHTML = ""
        categoryItem.stock.forEach(item => {
            //DRAW </li> FIRST
            let li = document.createElement('li');
            li.innerHTML = `
                <header>${item.name}</header>
                <section>
                    <div>
                        <input id="${item.name}-buyinput" type="number" class="form"
                        min="1" max="9999" placeholder="" step="1"
                        value=1>
                    </div>
                    <span id="${item.name}-buylist"></span>
                    <div class="unit">/${item.unit}</div>
                </section>
                `
            storeBuyContainerDOM.appendChild(li);
            //THAN DRAW </button>
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

    function renderWorkersAndServicesBtn() {
        workersAndServicesContainerDOM.innerHTML = ""
        workersAndServicesContainerDOM.style.display = 'none'
        if (stateGame.clients[currentClient] == null) return
        for (let workerOrServiceStored of stateGame.clients[currentClient].workers) {
            if (workerOrServiceStored.count > 0) {
                workersAndServicesContainerDOM.style.display = 'grid'
                let button = document.createElement('button');
                button.innerHTML =
                    `${workerOrServiceStored.count} ${workerOrServiceStored.name} $${workerOrServiceStored.price}/${workerOrServiceStored.unit} (Idle)`
                button.setAttribute('id', workerOrServiceStored.name);
                button.setAttribute('class', `btn-darkblue btn-sendback btn-${workerOrServiceStored.category}`);
                button.setAttribute('btn-sudocontent', `Send Back $${workerOrServiceStored.price}`);
                button.onclick = () => { sendBackWorkerOrService(workerOrServiceStored) };
                workersAndServicesContainerDOM.appendChild(button);
            }
        }
    }

    function renderCostPerHourBtn() {
        costPerHourDOM.innerHTML = ""
        if (stateGame.clients[currentClient] == null) return
        let button = document.createElement('button');
        button.innerHTML =
            `Total Cost $<span id="costperhour-value">${stateGame.clients[currentClient].costPerHour}</span>/hour`
        button.setAttribute('id', `${Object.keys(stateGame.clients[currentClient].costPerHour)}`);
        button.setAttribute('class', `btn-darkblue`);
        button.onclick = () => { };
        costPerHourDOM.appendChild(button);
    }


    //TASK CARDS
    //======================================================================================//

    function renderConstructionTaskCards() {
        constructionContainerDOM.innerHTML = ""

        if (stateGame.clients[currentClient] == null) return

        for (let constructionSiteStage of stateGame.clients[currentClient].construction) {
            constructionSiteStage.forEach(constructionSiteElement => {

                if (constructionSiteElement.progress < 100) {
                    renderTaskCard(constructionSiteElement)
                    renderWorkersOrServicesBtn(constructionSiteElement)
                    renderMaterialsBtn(constructionSiteElement)
                }
            })
            let stageIsCompleted = constructionSiteStage
                .every(constructionSiteElement => constructionSiteElement.progress >= 100);
            if (!stageIsCompleted) break

            let allStagesAreCompleted = stateGame.clients[currentClient].construction
                .every(constructionSiteStage => constructionSiteStage
                    .every(constructionSiteElement => constructionSiteElement.progress >= 100))

            if (allStagesAreCompleted) {
                renderFinishClientCard()
                break
            }
        }
    }

    function renderTaskCard({ stage, index, progress }) {
        let div = document.createElement('div');
        const client = stateGame.clients[currentClient].name
        div.innerHTML =
            `<div id="${stage}-${client}-${index}-progressLoading" class="progressLoading"
            style="width: ${progress}%;">
            </div>
            <span id="${stage}-${index}">(${stage})</span>
            <span id="${stage}-${currentClient}-${index}-progress">${progress} %</span>
            
            `
        div.setAttribute('id', `${stage}-${index}`);
        div.setAttribute('class', `card center`);
        constructionContainerDOM.appendChild(div);
    }

    function renderWorkersOrServicesBtn(constructionSiteElement) {
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
                    button.onclick = () => { assignWorkerOrService(workersNeeded, idButton) };
                    button.innerHTML = `${workersNeeded.count} ${workersNeeded.type} Assigned`
                }
                else {
                    button.setAttribute('id', idButton);
                    button.onclick = () => { assignWorkerOrService(workersNeeded, idButton) };
                    button.innerHTML = `${workersNeeded.count} ${workersNeeded.type} Needed`
                }
                const buttonWorkersNeeded = document.getElementById(`${constructionSiteElement.stage}-${constructionSiteElement.index}`)
                buttonWorkersNeeded.appendChild(button);
            })
        }
    }

    function renderMaterialsBtn(constructionSiteElement) {
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
                    button.onclick = () => { };
                    button.innerHTML = `${materialNeeded.count} ${materialNeeded.name}`
                }
                button.onclick = () => { assignMaterial(materialNeeded, idButton) };
                const buttonMaterialsNeeded = document.getElementById(`${constructionSiteElement.stage}-${constructionSiteElement.index}`)
                buttonMaterialsNeeded.appendChild(button);
            })
        }
    }

    function renderFinishClientCard() {
        let div = document.createElement('div');
        div.innerHTML = `${stateGame.clients[currentClient].name.toUpperCase()}'s CONSTRUCTION COMPLETED`
        div.setAttribute('id', `${stateGame.clients[currentClient]}-completed`);
        div.setAttribute('class', `card flex-col center`);
        constructionContainerDOM.appendChild(div);

        let button = document.createElement('button');
        button.setAttribute('class', 'btn center');
        button.setAttribute('id', ``);
        button.onclick = () => { completeClientConstruction() };
        button.innerHTML = `CLAIM <b>$${stateGame.clients[currentClient].money}</b>`
        const buttonWorkersNeeded = document.getElementById(`${stateGame.clients[currentClient]}-completed`)
        buttonWorkersNeeded.appendChild(button);
    }
}
//======================================================================================//
renderDOM() //CALL UPDATE FUNCTION AFTER ALL CODE IS LOADED
//======================================================================================//


function handleDisplayMenu() {
    const menuOwnCompanyButton = document.getElementById('menu-own-company');
    const menuOwnCompanyButtonOut = document.getElementById('menu-own-company-block');

    menuOwnCompanyButton.onclick = () => { menuCompanyOn() };
    function menuCompanyOn() { menuOwnCompanyButtonOut.style.display = "block" }

    menuOwnCompanyButtonOut.addEventListener('click', event => {
        const closeTarget = event.target.id
        if (closeTarget == 'menu-own-company-block') {
            menuOwnCompanyButtonOut.style.display = "none"
        }
    })
}
handleDisplayMenu()


