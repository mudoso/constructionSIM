function createClient (clientname) {
    let clientCreated = {
        "name": clientname,
        "money": 6666,
        "costPerHour": 0,
        "warehouse": [],
        "workers": [],
        "construction": [
            [
                createStageItem("Land Clearing", "clearing"),
                createStageItem("Excavation", "excavation")
            ],
        ]
    }
    return clientCreated
}


function randomIndex(targetArrey) {
    return targetArrey[Math.floor(Math.random() * targetArrey.length)]
}

function randomCount(countRange) {
    return Math.floor(Math.random() * countRange)
}

function constructionStage() {
    return [itemStage(fundation )]
}



function createStageItem(stageItemName, stage) {
    let createStageItem = {
        "stage": stageItemName,
        "index": 0,
        "progress": 0,
        "workersNeeded": createServiceNeed(stage),
        "materialNeeded": []
    }
    return createStageItem
}



function createServiceNeed(stage) {
    let serviceNeeded = [] //FINAL SERVICES ARRAY
    let calledStage = [] //CALLED SERVICES RELATED TO STAGE
    //PREVENT INFINITE LOOP
    if(stage == undefined || stage == null) {return []}
    //LOOK FOR ITEMS IN THE STORE THAT MATCH CALLED STAGE
    for (let storeCategory of store) {
        if (storeCategory.service == true) {
            for (let itemOnStock of storeCategory.stock) {
                if (itemOnStock.stage != undefined && itemOnStock.stage.includes(stage) == true) {
                    calledStage.push(itemOnStock.name)
                }                         
            }
        }
    }
    //FOR EACH SERVICE COMPATIBLE WITH CALLEDSTAGE MAKE A RANDOM COUNT AND ADD TO FINAL ARRAY
    for (let singleService of calledStage) {

        let countNumber = randomCount(2) // DEFAULT 0 < countNumber < 1
        //SPECIAL RULES
        if (stage == "excavation") {countNumber = randomCount(2)+1} // 1 < countNumber < 2
        if (stage == "clearing" && singleService == "Dumpster") {countNumber = randomCount(2)+1} // 1 < countNumber < 2
        //ADD TO FINAL ARRAY IF > 0
        if (countNumber > 0) {
            singleService = {"type": singleService, "count": countNumber, "assigned": false}
            serviceNeeded.push(singleService)
        }
    }
    //IF NO SERVICE (EMPTY ARRAY) REDO THE FUNCTION
    if (serviceNeeded.length == 0) {
        createServiceNeed(stage)
    }
    else return serviceNeeded
}



function createMaterialNeed(stage) {
    let materialNeeded = [] //FINAL MATERIAL ARRAY
    let calledStage = [] //CALLED MATERIALS RELATED TO STAGE
    //PREVENT INFINITE LOOP
    if(stage == undefined || stage == null) {return []}
    //LOOK FOR ITEMS IN THE STORE THAT MATCH CALLED STAGE
    for (let storeCategory of store) {
        if (storeCategory.service != true || storeCategory.service == undefined) {
            for (let itemOnStock of storeCategory.stock) {
                if (itemOnStock.stage != undefined && itemOnStock.stage.includes(stage) == true) {
                    calledStage.push(itemOnStock.name)
                }                         
            }
        }
    }
    //FOR EACH MATERIAL COMPATIBLE WITH CALLEDSTAGE MAKE A RANDOM COUNT AND ADD TO FINAL ARRAY
    for (let singleMaterial of calledStage) {

        let countNumber = randomCount(2) // DEFAULT 0 < countNumber < 1
        //SPECIAL RULES
        if (stage == "excavation") {countNumber = randomCount(2)+1} // 1 < countNumber < 2
        if (stage == "clearing") {countNumber = randomCount(2)+1} // 1 < countNumber < 2
         
        if (countNumber > 0) {
            singleMaterial = {"name": singleMaterial, "count" : countNumber, "assigned": false},
            serviceNeeded.push(singleMaterial)
        }
    }
    //IF NO SERVICE (EMPTY ARRAY) REDO THE FUNCTION
    if (serviceNeeded.length == 0) {
        createServiceNeed(stage)
    }
    else return serviceNeeded
}




