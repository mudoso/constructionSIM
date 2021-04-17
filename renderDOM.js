const rendererDOM = {
    all() {
        rendererDOM.money()
        rendererDOM.due()
        rendererDOM.clientSelectorMenu()
        rendererDOM.newClientSelector()
        rendererDOM.categoryStoreBtn()
        rendererDOM.warehouseBtn()
        rendererDOM.warehouseLimit()
        rendererDOM.idleWorkersAndServices()
        rendererDOM.costPerHourBtn()
        rendererDOM.ownCompanyMenuClients()
        rendererDOM.ownCompanySkills()
        rendererDOM.addListenerToSpeedPanel()
        rendererDOM.menuClient()
        rendererDOM.constructionTaskCards()
        rendererDOM.handleDisplayOwnMenu()
        rendererDOM.handleDisplayClientMenu()
        rendererDOM.handleSendMoneyClient()
    },

    listener() {
        rendererDOM.handleDisplayWindows()
        rendererDOM.updateNumberOfNewClients()
        rendererDOM.companyStats()
        rendererDOM.money()
        rendererDOM.due()
        rendererDOM.displayAvailableSkillPoints()
        rendererDOM.displaySkillBtn()
        rendererDOM.updateCurrentSkillPoints()
    },

    time() {
        const timeSpan = document.getElementById('time');
        const dayDom = document.getElementById("day")

        const min00 = ('0' + stateGame.clock.minute).slice(-2)
        timeSpan.textContent = `${stateGame.clock.hour}:${min00}`
        dayDom.innerHTML = stateGame.clock.day
    },

    money() {
        const ownMoneyDOM = document.querySelectorAll(".own-money")
        const clientMoneyDOM = document.querySelectorAll(".client-money")

        ownMoneyDOM.forEach(DOM => DOM.innerHTML = stateGame.ownCompany.money)
        clientMoneyDOM.innerHTML = 0

        const hasClientSelected = stateGame.clients[stateGame.clientIndex]

        !hasClientSelected
            ? clientMoneyDOM.forEach(DOM => DOM.innerHTML = 0)
            : clientMoneyDOM.forEach(DOM =>
                DOM.innerHTML = stateGame.clients[stateGame.clientIndex].money)
    },

    due() {
        const dueDateDOM = document.querySelectorAll(".due-date")
        const dueFeeDOM = document.querySelectorAll(".due-fee")
        const dueFeeOwnMoneyDOM = document.querySelectorAll(".due-fee-ownMoney")
        const clientSelected = stateGame.clients[stateGame.clientIndex]
        const costPerDay = stateGame.clients
            .filter(client => stateGame.clock.day > client.dueDate)
            .reduce((acc, client) => acc + client.dueFee, 0)

        const nodeGroup = [
            dueFeeOwnMoneyDOM,
            dueDateDOM,
            dueFeeDOM
        ]

        for (const nodeList of nodeGroup)
            nodeList.forEach(DOM => {
                DOM.innerHTML = ''
                DOM.style.color = ''
                DOM.style.fontWeight = ''
            })

        if (!clientSelected) return

        dueDateDOM.forEach(DOM => DOM.innerHTML = `DUE DATE: DAY ${clientSelected.dueDate}`)
        dueFeeDOM.forEach(DOM => DOM.innerHTML = `DUE FEE: $${clientSelected.dueFee}`)

        const isDueDate = stateGame.clock.day > clientSelected.dueDate

        if (isDueDate) {
            dueDateDOM.forEach(DOM => {
                DOM.style.color = '#ff2a1a'
                DOM.style.fontWeight = 'bold'
            })
            dueFeeDOM.forEach(DOM => {
                DOM.style.color = '#ff2a1a'
                DOM.style.fontWeight = 'bold'
            })
        }
        if (costPerDay > 0) {
            dueFeeOwnMoneyDOM.forEach(DOM => {
                DOM.innerHTML = `($${costPerDay}/day)`
                DOM.style.color = '#ff2a1a'
                DOM.style.fontWeight = 'bold'
            })
        }

    },

    experience(showExperience) {
        const ownExperience = document.querySelectorAll(".menu-own-lvl-progress")
        ownExperience.forEach(DOM => DOM.style.width = `${showExperience}%`)
    },

    companyStats() {
        const companyNameDOM = document.getElementById("own-company-name")
        const ownLevelDOM = document.querySelectorAll(".own-lvl")

        companyNameDOM.innerHTML = stateGame.ownCompany.name
        ownLevelDOM.forEach(DOM => DOM.innerHTML = stateGame.ownCompany.level)
    },


    //COMPANY MENU
    //======================================================================================//

    handleDisplayOwnMenu() {
        const menuOwnCompanyButton = document.getElementById('menu-own-company')
        const menuOwnCompanyButtonOut = document.getElementById('menu-own-company-block')

        menuOwnCompanyButton.onclick = () => rendererDOM.menuCompanyOn(menuOwnCompanyButtonOut)

        menuOwnCompanyButtonOut.addEventListener('click', event => {
            const closeTarget = event.target.id
            if (closeTarget == 'menu-own-company-block') {
                menuOwnCompanyButtonOut.style.opacity = '0'
                menuOwnCompanyButtonOut.style.pointerEvents = 'none'
            }
        })
    },

    menuCompanyOn(menuOwnCompanyButtonOut) {
        menuOwnCompanyButtonOut.style.opacity = '1'
        menuOwnCompanyButtonOut.style.pointerEvents = 'all'
    },

    ownCompanyMenuClients() {
        const menuOwnClients = document.querySelector('.menu-own-company-clients')

        menuOwnClients.innerHTML = ""
        for (const clients of stateGame.clients) {
            const stageItemsProgressList = clients.construction
                .map(stage => stage.map(itemStage => itemStage.progress))
                .flat()

            const completedTasks = stageItemsProgressList
                .filter(progress => progress >= 100)
            const taskProgression = `${completedTasks.length}/${stageItemsProgressList.length}✔️`
            const taskPercentage = Math.floor(completedTasks.length / stageItemsProgressList.length * 1000) / 10

            let button = document.createElement('button')
            button.innerHTML =
                `<div>${clients.name.toUpperCase()}</div>
                <div>${taskProgression} Completed Tasks  (${taskPercentage}%)</div>`
            button.setAttribute('id', clients.name)
            button.setAttribute('class', "flex-between btn")
            button.setAttribute('style', "display: flex")
            button.onclick = () => { }
            menuOwnClients.appendChild(button);
        }
    },

    ownCompanySkills() {
        const menuOwnSkills = document.querySelector('.menu-own-company-skills')

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

            rendererDOM.addSkillButton(skill, isSkillPointAvailable)
        }
        rendererDOM.updateCurrentSkillPoints()
    },

    addSkillButton(skill, isSkillPointAvailable) {
        const skillLI = document.querySelector(`#skill-div-${skill}`)
        const display = isSkillPointAvailable ? 'block' : 'none'

        let button = document.createElement('button')
        button.innerHTML = "+"
        button.setAttribute('class', 'add-skill')
        button.setAttribute('style', `display: ${display}`)
        button.onclick = event =>
            addSkillPoint(event.path[2].children[0].innerText, isSkillPointAvailable)
        skillLI.appendChild(button)
    },

    displaySkillBtn() {
        const addSkillButton = document.querySelectorAll(`.add-skill`)
        const isSkillPointAvailable = stateGame.ownCompany.skillPoints > 0

        isSkillPointAvailable
            ? addSkillButton.forEach(button => button.style.display = 'block')
            : addSkillButton.forEach(button => button.style.display = 'none')

        rendererDOM.displayAvailableSkillPoints()
    },

    displayAvailableSkillPoints() {
        const skillPointsDOM = document.querySelector("#skill-points")
        skillPointsDOM.innerHTML = stateGame.ownCompany.skillPoints
    },

    updateCurrentSkillPoints() {
        const companySkills = Object.entries(stateGame.ownCompany.skills)

        for (const [skill, value] of companySkills) {
            const skillPointsDOM = document.querySelector(`#skill-${skill}`)
            skillPointsDOM.innerHTML = value
        }
    },

    addListenerToSpeedPanel() {
        const speedPauseBtn = document.querySelector('#pause-btn')
        const speedPlayBtn = document.querySelector('#speed-btn')

        speedPauseBtn.onclick = () => stopTime(speedPlayBtn)
        speedPlayBtn.onclick = () => speedTime(speedPlayBtn)
    },


    //CLIENT MENU
    //======================================================================================//

    handleDisplayClientMenu() {
        const menuClientBackgroundBlock = document.getElementById('menu-client-block');

        menuClientBackgroundBlock.addEventListener('click', event => {
            const closeTarget = event.target.id
            if (closeTarget == 'menu-client-block' || closeTarget == 'menu-client-close') {
                menuClientBackgroundBlock.style.opacity = '0'
                menuClientBackgroundBlock.style.pointerEvents = 'none'
            }
        })
    },

    menuClientOn() {
        const menuClientBackgroundBlock = document.getElementById('menu-client-block')

        menuClientBackgroundBlock.style.opacity = '1'
        menuClientBackgroundBlock.style.pointerEvents = 'all'
        rendererDOM.menuClient()
    },

    clientSelectorMenu() {
        const clientSelectedButtonDOM = document.getElementById('btn-clients')
        const clientLeftArrowButtonDOM = document.getElementById('btn-clients-left')
        const clientRightArrowButtonDOM = document.getElementById('btn-clients-right')
        const noClientSelected = stateGame.clients.length == 0

        if (noClientSelected) {
            clientSelectedButtonDOM.onclick = false;
            clientSelectedButtonDOM.innerHTML = "NONE"
            return
        }
        const clientName = stateGame.clients[stateGame.clientIndex].name

        clientSelectedButtonDOM.innerHTML = clientName.toUpperCase()
        clientLeftArrowButtonDOM.onclick = () => rendererDOM.selectClientArrow('left')
        clientRightArrowButtonDOM.onclick = () => rendererDOM.selectClientArrow('right')
        clientSelectedButtonDOM.onclick = () => rendererDOM.menuClientOn()
    },

    selectClientArrow(arrow) {
        switch (arrow) {
            case 'left':
                stateGame.clientIndex--
                break
            case 'right':
                stateGame.clientIndex++
                break
        }
        const isNegativeIndex = stateGame.clientIndex < 0
        const isEndOfClientList = stateGame.clientIndex > stateGame.clients.length - 1

        if (isNegativeIndex)
            stateGame.clientIndex = stateGame.clients.length - 1

        if (isEndOfClientList)
            stateGame.clientIndex = 0

        rendererDOM.all()
    },

    handleSendMoneyClient() {
        const sendMoneyBtn = document.getElementById('send-money')
        const sendMoneyInput = document.getElementById('send-own-money')
        const hasSendMoneyId = sendMoneyBtn || sendMoneyInput

        if (hasSendMoneyId)
            sendMoneyBtn.onclick = () => {
                console.log(object);
                sendMoneyToClient(sendMoneyInput)
            }
    },


    //CLIENT SEARCH
    //======================================================================================//

    updateNumberOfNewClients() {
        const numberNewOfClientsDOM = document.querySelector(".new-span")
        // const newClientSelectorDOM = document.getElementById("looking-for-client")
        const availableNewClients = stateGame.lookingForClients.clientList.length
        const researchTime = stateGame.lookingForClients.researchTime
        const hasResearchTime = researchTime > stateGame.clock.minuteAccumulated
        const emojiText = stateGame.lookingForClients.emojiText
        // const isSearchActive = stateGame.lookingForClients.research

        numberNewOfClientsDOM.innerHTML = ''

        if (hasResearchTime)
            numberNewOfClientsDOM.innerHTML = emojiText

        if (availableNewClients)
            numberNewOfClientsDOM.innerHTML = `(${availableNewClients} NEW)`
    },

    drawReticence() {
        let reticence = '...'

        const reticenceCounter = setInterval(() => {
            const isSearchActive = stateGame.lookingForClients.research

            reticence = reticence + '.'
            if (reticence.length > 3) reticence = ''
            stateGame.lookingForClients.emojiText = `(🔍${reticence})`

            if (!isSearchActive) clearInterval(reticenceCounter)
        }, 500)
    },

    newClientSelector() {
        const newClientSelectorDOM = document.getElementById("looking-for-client")
        const hasAvailableAttempts = stateGame.lookingForClients.lookingAttempts > 0
        const hasAvailableClient = stateGame.lookingForClients.clientList.length > 0

        newClientSelectorDOM.innerHTML = `<h4>NO MORE CLIENTS FOUND TODAY</h4>`

        if (hasAvailableAttempts) {
            const researchBtn = rendererDOM.getSearchNewClientsBtn()

            newClientSelectorDOM.innerHTML = ''
            newClientSelectorDOM.appendChild(researchBtn)
        }

        if (hasAvailableClient) {
            newClientSelectorDOM.innerHTML = ''
            rendererDOM.newClientsList(newClientSelectorDOM)
        }
    },

    getSearchNewClientsBtn() {
        const researchTime = stateGame.lookingForClients.researchTime
        const hasResearchTime = researchTime > stateGame.clock.minuteAccumulated

        const button = document.createElement('button');
        button.innerHTML = `LOOK FOR NEW CLIENTS`
        button.setAttribute('class', "btn");
        button.onclick = () => researchNewClients()

        if (hasResearchTime) {
            button.innerHTML = `(SEARCHING FOR NEW CLIENTS... 🔍)`
            button.onclick = false
        }
        return button
    },

    newClientsList(newClientSelectorDOM) {
        for (const client of stateGame.lookingForClients.clientList) {
            let div = document.createElement('div');
            let btnClass = "btn"
            let attempt = "???"
            if (client.attempt != null && client.attempt > 0) {
                btnClass = "btn btn-sendback"
                attempt = client.attempt
            }
            div.innerHTML =
                `<section id="${client.name}-looking-client" class="looking-client">
                    <button id="${client.name}-newClient-menu" class="btn">
                    ${client.name.toUpperCase()}
                    </button>
                    <div>
                        <input id="${client.id}input" class="form" type="number" name="quantities" 
                            min="${client.money}" 
                            value="${client.money}"
                            step="1000">
                            $
                        <button id="${client.name}-offer-client-btn"
                            class="${btnClass}"
                            btn-sudocontent="Attempts: ${attempt}">OFFER
                        </button>
                    </div>
                </section>`
            newClientSelectorDOM.appendChild(div)

            const buttonNewClientMenu = document.getElementById(`${client.name}-newClient-menu`)
            const buttonOfferClient = document.getElementById(`${client.name}-offer-client-btn`)
            const inputOfferClient = document.getElementById(`${client.id}input`)

            buttonNewClientMenu.onclick = () => rendererDOM.menuNewClientOn(client)
            buttonOfferClient.onclick = () => {
                newClientSelectorBudgetOffer(client, inputOfferClient)
            }
        }
    },

    menuNewClientOn(lookingClient) {
        const menuClientBackgroundBlock = document.getElementById('menu-client-block');

        menuClientBackgroundBlock.style.opacity = '1'
        menuClientBackgroundBlock.style.pointerEvents = 'all'
        rendererDOM.menuClient(lookingClient)
    },

    menuClient(client = undefined) {
        const menuClientName = document.getElementById('menu-client-name')
        const menuClientMoney = document.getElementById('client-money-menu')
        const menuClientDue = document.getElementById('due-client')

        let clientSelected

        client
            ? clientSelected = client
            : clientSelected = stateGame.clients[stateGame.clientIndex]

        if (clientSelected) {
            menuClientName.innerHTML = clientSelected.name.toUpperCase()
            menuClientMoney.innerHTML = clientSelected.money

            let hasDateClass
            let hasFeeClass

            client
                ? (hasDateClass = '', hasFeeClass = '')
                : (hasDateClass = 'due-date', hasFeeClass = 'due-fee')

            menuClientDue.innerHTML =
                `<p class=${hasDateClass}>DUE DATE: DAY ${clientSelected.dueDate}</p>
                <p class=${hasFeeClass}>DUE FEE: $${clientSelected.dueFee}</p>`

            rendererDOM.sendMoneyInput(client)
            rendererDOM.menuClientMaterialsNeeded(clientSelected)
        }
    },

    sendMoneyInput(lookingClient) {
        const menuClientSendMoneyInput = document.getElementById('send-money-input')

        menuClientSendMoneyInput.innerHTML = ""

        if (!lookingClient) {
            menuClientSendMoneyInput.innerHTML =
                `<input class="form money-div" 
                    type="number" 
                    name="send-own-money" id="send-own-money" 
                    min="0"
                    max="10000" 
                    placeholder="0" 
                    step="100" 
                    value="0">
                <button id="send-money" class="btn">Send Money</button>`
            rendererDOM.handleSendMoneyClient()
        }
    },

    menuClientMaterialsNeeded(clientSelected) {
        const menuClientMaterialsNeeded = document.getElementById(`menu-client-materials`)
        const menuMaterialsArray = rendererDOM.materialsNeededList(clientSelected)
        menuClientMaterialsNeeded.innerHTML = ""

        for (const [name, count] of menuMaterialsArray) {
            let button = document.createElement('button');
            button.innerHTML = `${name} (${count})`
            button.setAttribute('class', "btn");
            menuClientMaterialsNeeded.appendChild(button);
        }
    },

    materialsNeededList(clientSelected) {
        const menuClientStages = document.getElementById('menu-client-stages')
        menuClientStages.innerHTML = ""

        const menuMaterialsArray = []

        for (const constructionSiteStage of clientSelected.construction) {
            const stageArrayIndex = clientSelected.construction.indexOf(constructionSiteStage)

            const stageContainer = rendererDOM.createStageContainerHTML(stageArrayIndex)
            menuClientStages.appendChild(stageContainer);

            for (const constructionSiteElement of constructionSiteStage) {
                const stageContainerDOM = document.getElementById(`stage-${stageArrayIndex}`)

                const StageElement = rendererDOM.createStageElementHTML(constructionSiteElement)
                stageContainerDOM.appendChild(StageElement);

                if (constructionSiteElement.progress < 100) {
                    for (const materialNeeded of constructionSiteElement.materialNeeded) {
                        const alreadyInList = menuMaterialsArray
                            .find(itemInArray => itemInArray[0] == materialNeeded.name)

                        alreadyInList
                            ? alreadyInList[1] += materialNeeded.count
                            : menuMaterialsArray
                                .push([materialNeeded.name, materialNeeded.count])
                    }
                }
            }
        }
        return menuMaterialsArray
    },

    createStageContainerHTML(stageArrayIndex) {
        const ul = document.createElement('ul');
        ul.innerHTML = `STAGE ${stageArrayIndex + 1}:`
        ul.setAttribute('id', `stage-${stageArrayIndex}`);
        ul.setAttribute('class', "margin");
        return ul
    },

    createStageElementHTML(constructionSiteElement) {
        const li = document.createElement('li');
        li.innerHTML = `${constructionSiteElement.stage}`
        li.setAttribute('class', "btn");
        if (constructionSiteElement.progress >= 100) {
            li.setAttribute('class', "btn btn-clear");
            li.setAttribute('btn-sudocontent', 'Task Done');
        }
        return li
    },


    //WAREHOUSE (SITE STORAGE)
    //======================================================================================//

    warehouseBtn() {
        const warehouseContainerDOM = document.getElementById('warehouse-container')
        const noClientSelected = stateGame.clients.length == 0

        warehouseContainerDOM.innerHTML = ""

        if (noClientSelected) return
        for (const itemStored of stateGame.clients[stateGame.clientIndex].warehouse) {

            const isTransporting = itemStored.transport.length > 0

            if (itemStored.count > 0 || isTransporting) {

                const materialComing = itemStored.transport
                    .reduce((acc, worker) => acc + worker.count, 0)

                let emoji = ''
                isTransporting
                    ? emoji = ` [${materialComing}...🚚]`
                    : emoji = ''

                let button = document.createElement('button')
                button.setAttribute('id', itemStored.name)
                button.setAttribute('class', `btn btn-sendback`)
                button.setAttribute('btn-sudocontent', '')
                button.onclick = false
                if (itemStored.count > 0) {
                    button.setAttribute('btn-sudocontent', `Discard`)
                    button.onclick = () => { discardWarehouseItem(itemStored) }
                }
                button.innerHTML =
                    `${itemStored.name} <span id="${itemStored.name}">
                    ${itemStored.count}
                    </span>${itemStored.unit}${emoji}`

                warehouseContainerDOM.appendChild(button)
            }
        }
        rendererDOM.warehouseLimit()
    },

    warehouseLimit() {
        const warehouseLimitDOM = document.getElementById('warehouse-limit')
        const noClientSelected = stateGame.clients.length == 0

        if (noClientSelected)
            return warehouseLimitDOM.innerHTML = `SITE STORAGE`

        const warehouseLimit = rendererDOM.warehouseDisplayLimit(warehouseLimitDOM)
        warehouseLimitDOM.innerHTML = `SITE STORAGE (${warehouseLimit})`
    },

    warehouseDisplayLimit(warehouseLimitDOM) {

        const volumeStored = stateGame.clients[stateGame.clientIndex].warehouse
            .reduce((acc, item) => { return acc + (item.count * item.volume) }, 0)
        const stateWarehouseLimit = stateGame.clients[stateGame.clientIndex].warehouseLimit
        const currentVolumeStored = Math.floor(volumeStored / stateWarehouseLimit * 1000) / 10

        const isWarehouseEmpty = stateGame.clients[stateGame.clientIndex].warehouse.length == 0
        const isWarehouseFull = volumeStored >= stateGame.clients[stateGame.clientIndex].warehouseLimit
        const isWarehouse90PercentFull = currentVolumeStored >= 90

        isWarehouse90PercentFull
            ? warehouseLimitDOM.style.color = "#ff2a1a"
            : warehouseLimitDOM.style.color = "var(--text-base-color)"

        switch (true) {
            case isWarehouseEmpty:
                return "EMPTY"
            case isWarehouseFull:
                return "FULL"
            default:
                return `${currentVolumeStored}%`
        }
    },


    //STORE
    //======================================================================================//

    categoryStoreBtn() {
        const storeCategoryContainerDOM = document.getElementById('store-category')

        storeCategoryContainerDOM.innerHTML = ""
        for (const categoryItem of store) {
            let button = document.createElement('button');
            button.innerHTML = categoryItem.name
            button.setAttribute('id', categoryItem.name);
            button.setAttribute('class', 'btn');
            if (categoryItem.service || categoryItem.service == undefined) {
                button.setAttribute('class', 'btn-darkblue');
            }
            button.onclick = () => { rendererDOM.itemList(categoryItem) };
            storeCategoryContainerDOM.appendChild(button);
        }
    },

    itemList(categoryItem) {
        const storeBuyContainerDOM = document.getElementById('store-buy-items')

        storeBuyContainerDOM.innerHTML = ""
        categoryItem.stock.forEach(item => {
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
    },

    idleWorkersAndServices() {
        const workersAndServicesContainerDOM = document.getElementById('workers-services')
        const noClientSelected = stateGame.clients.length == 0

        workersAndServicesContainerDOM.innerHTML = ""
        workersAndServicesContainerDOM.style.display = 'none'

        if (noClientSelected) return
        for (const workerOrServiceStored of stateGame.clients[stateGame.clientIndex].workers) {

            const isTransporting = workerOrServiceStored.transport.length > 0

            if (workerOrServiceStored.count > 0 || isTransporting) {

                const workersComing = workerOrServiceStored.transport
                    .reduce((acc, worker) => acc + worker.count, 0)

                let costPerHourAndIdle = ''
                let emoji = ''

                isTransporting
                    ? emoji = ` [${workersComing}...🚗]`
                    : emoji = ''

                workersAndServicesContainerDOM.style.display = 'grid'
                const button = document.createElement('button');
                button.setAttribute('id', workerOrServiceStored.name);
                button.setAttribute('class', `btn-darkblue btn-sendback btn-${workerOrServiceStored.category}`);
                button.setAttribute('btn-sudocontent', '');
                button.onclick = false
                if (workerOrServiceStored.count > 0) {
                    costPerHourAndIdle = `$${workerOrServiceStored.price}/${workerOrServiceStored.unit} (Idle)`
                    button.setAttribute('btn-sudocontent', `Send Back $${workerOrServiceStored.price}`);
                    button.onclick = () => { sendBackWorkerOrService(workerOrServiceStored) }
                }
                button.innerHTML =
                    `${workerOrServiceStored.count} ${workerOrServiceStored.name} ${costPerHourAndIdle}${emoji}`

                workersAndServicesContainerDOM.appendChild(button);
            }
        }
    },

    costPerHourBtn() {
        const costPerHourDOM = document.getElementById('cost-per-hour')
        const noClientSelected = stateGame.clients.length == 0

        costPerHourDOM.innerHTML = ""

        if (noClientSelected) return
        let button = document.createElement('button');
        button.innerHTML =
            `Total Cost $<span id="costperhour-value">${stateGame.clients[stateGame.clientIndex].costPerHour}</span>/hour`
        button.setAttribute('id', `${Object.keys(stateGame.clients[stateGame.clientIndex].costPerHour)}`);
        button.setAttribute('class', `btn-darkblue`);
        button.onclick = () => { };
        costPerHourDOM.appendChild(button);
    },

    costPerHourValue() {
        const costPerHourValueDOM = document.getElementById("costperhour-value")
        costPerHourValueDOM.innerHTML = stateGame.clients[stateGame.clientIndex].costPerHour
    },

    //TASK CARDS
    //======================================================================================//

    constructionTaskCards() {
        const constructionContainerDOM = document.getElementById('construction-container')
        const noClientSelected = stateGame.clients.length == 0

        constructionContainerDOM.innerHTML = ""

        if (noClientSelected) return

        const currentConstruction = stateGame.clients[stateGame.clientIndex].construction
        for (const constructionSiteStage of currentConstruction) {

            constructionSiteStage.forEach(constructionSiteElement => {
                if (constructionSiteElement.progress < 100) {
                    rendererDOM.taskCard(constructionSiteElement, constructionContainerDOM)
                    rendererDOM.workersOrServicesBtn(constructionSiteElement)
                    rendererDOM.materialsBtn(constructionSiteElement)
                }
            })
            const stageIsCompleted = constructionSiteStage
                .every(constructionSiteElement => constructionSiteElement.progress >= 100);
            if (!stageIsCompleted) break

            const allStagesAreCompleted = currentConstruction
                .every(constructionSiteStage => constructionSiteStage
                    .every(constructionSiteElement => constructionSiteElement.progress >= 100))

            if (allStagesAreCompleted) {
                rendererDOM.finishClientCard(constructionContainerDOM)
                break
            }
        }
    },

    taskCard({ stage, index, progress }, constructionContainerDOM) {
        let div = document.createElement('div');
        const client = stateGame.clients[stateGame.clientIndex].name
        div.innerHTML =
            `<div id="${stage}-${client}-${index}-progressLoading" class="progressLoading"
            style="width: ${progress}%;">
            </div>
            <span id="${stage}-${index}">(${stage})</span>
            <span id="${stage}-${stateGame.clientIndex}-${index}-progress">${progress} %</span>`
        div.setAttribute('id', `${stage}-${index}`);
        div.setAttribute('class', `card center`);
        constructionContainerDOM.appendChild(div);
    },

    workersOrServicesBtn(constructionSiteElement) {
        if (constructionSiteElement.workersNeeded) {
            constructionSiteElement.workersNeeded.forEach(workersNeeded => {
                const button = document.createElement('button');
                const idButton = `${workersNeeded.type}-${constructionSiteElement.index}`

                button.setAttribute('class', 'btn-darkblue');
                button.setAttribute('value', `${workersNeeded.count}`);

                const isWorkersNeededAssigned = workersNeeded.assigned == true
                if (isWorkersNeededAssigned) {
                    button.setAttribute('id', `${idButton}-assigned`);
                    button.setAttribute('btn-sudocontent', 'Unassign');
                    button.setAttribute('class', 'btn-darkblue btn-clear');
                    button.onclick = () => { unassignWorkerOrService(workersNeeded, idButton) };
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
    },

    materialsBtn(constructionSiteElement) {
        if (constructionSiteElement.materialNeeded) {
            constructionSiteElement.materialNeeded.forEach(materialNeeded => {
                let button = document.createElement('button');
                button.innerHTML = `${materialNeeded.count} x ${materialNeeded.name}`
                let idButton = `${materialNeeded.name}-${constructionSiteElement.index}`
                button.setAttribute('id', idButton);
                button.setAttribute('class', 'btn');
                button.setAttribute('value', `${materialNeeded.count}`);
                button.onclick = () => { assignMaterial(materialNeeded, idButton) };

                if (materialNeeded.assigned == true) {
                    button.setAttribute('btn-sudocontent', 'Used');
                    button.setAttribute('class', 'btn-clear btn-darkblue');
                    button.onclick = () => { };
                    button.innerHTML = `${materialNeeded.count} ${materialNeeded.name}`
                }
                const buttonMaterialsNeeded = document.getElementById(`${constructionSiteElement.stage}-${constructionSiteElement.index}`)
                buttonMaterialsNeeded.appendChild(button);
            })
        }
    },

    progressTaskLoading(constructionSiteElement, targetClient) {
        const cardId = `${constructionSiteElement.stage}-${targetClient.name}-${constructionSiteElement.index}-progressLoading`
        const cardTaskLoadingDiv = document.getElementById(cardId)
        if (cardTaskLoadingDiv) {
            cardTaskLoadingDiv.style.width = `${constructionSiteElement.progress}%`
        }
    },

    progressTaskPercentage(constructionSiteElement, targetClient) {
        const cardId = `${constructionSiteElement.stage}-${stateGame.clients.indexOf(targetClient)}-${constructionSiteElement.index}-progress`
        const cardTaskPercentage = document.getElementById(cardId)

        if (cardTaskPercentage == null) return console.log('Card not found / or hidden');
        cardTaskPercentage.innerHTML = `${constructionSiteElement.progress.toFixed(2)} %`
    },

    finishClientCard(constructionContainerDOM) {
        let div = document.createElement('div');
        div.innerHTML = `${stateGame.clients[stateGame.clientIndex].name.toUpperCase()}'s CONSTRUCTION COMPLETED`
        div.setAttribute('id', `${stateGame.clients[stateGame.clientIndex]}-completed`);
        div.setAttribute('class', `card flex-col center`);
        constructionContainerDOM.appendChild(div);

        let button = document.createElement('button');
        button.setAttribute('class', 'btn center');
        button.setAttribute('id', ``);
        button.onclick = () => { completeClientConstruction() };
        button.innerHTML = `CLAIM <b>$${stateGame.clients[stateGame.clientIndex].money}</b>`
        const buttonWorkersNeeded = document.getElementById(`${stateGame.clients[stateGame.clientIndex]}-completed`)
        buttonWorkersNeeded.appendChild(button);
    },

    handleDisplayWindows() {
        const noClientSelected = stateGame.clients.length == 0
        const windowTasks = document.querySelector('.layout-site-construction')
        const windowStore = document.querySelector('.side-menu')
        const windowWarehouse = document.querySelector('.layout-warehouse')

        const windowsList = [windowTasks, windowStore, windowWarehouse,]

        windowsList.forEach(window => {
            window.style.opacity = '1'
            window.style.pointerEvents = 'all'

            if (noClientSelected) {
                window.style.opacity = '0'
                window.style.pointerEvents = 'none'
            }
        })
    },
}

//======================================================================================//
rendererDOM.all() //CALL UPDATE  AFTER ALL CODE IS LOADED
setInterval(rendererDOM.listener, 500)
//======================================================================================//

