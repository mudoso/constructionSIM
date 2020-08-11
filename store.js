

//RESPOSIBLE FOR ALL STORE FUNCTIONS RULES RELATED


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