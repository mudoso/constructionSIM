class Client {
    constructor(clientName) {
        console.log(this);
        this.name = clientName
        this.level = 1
        this.money = 35000
        this.area = randomCount(150) + 50
        this.costPerHour = 0
        this.warehouse = []
        this.workers = []
        this.construction = constructionStage(this.level, this.area)
    }
}


// function createClient(clientName) {
//     let clientCreated = {
//         "name": clientName,
//         "money": 35000,
//         "area": randomCount(150) + 50,
//         "costPerHour": 0,
//         "warehouse": [],
//         "workers": [],
//         "construction": [
//             [
//                 createStageItem("Land Clearing", "clearing"),
//                 createStageItem("Slab", "structure-concrete", 126)
//             ],
//         ]
//     }
//     return clientCreated
// }


function randomIndex(targetArray) {
    return targetArray[Math.floor(Math.random() * targetArray.length)]
}

function randomCount(countRange) {
    return Math.floor(Math.random() * countRange)
}

function constructionStage(level, area) {
    return randomIndex([
        [
            //SMALL WOOD-FRAME HOUSE
            [
                createStageItem("Land Clearing", "clearing", area),
                createStageItem("Excavation", "excavation", area)
            ],
            [
                createStageItem("Slab Foundation", "slab", area)
            ],
            [
                createStageItem("Foundation Finishes", "clearing", area)
            ],
            [
                createStageItem("Structural Walls", "walls-s2x6", area),
                createStageItem("Non-Structural Walls", "walls-s2x4", area)
            ],
            [
                createStageItem("Structural Trusses", "walls-s2x6", area),
                createStageItem("Brick Finishes Outer Walls", "walls-clayBrick", area)
            ],
            [
                createStageItem("Finishes Inner Walls", "walls", area),
                createStageItem("Finishes Roof", "roof", area)
            ]
        ],
        [
            //SMALL MASONRY HOUSE
            [
                createStageItem("Land Clearing", "clearing", area),
                createStageItem("Pile Excavation", "excavation", area)
            ],
            [
                createStageItem("Structural Pile", "structure-concrete", area)
            ],
            [
                createStageItem("Slab Foundation", "slab", area)
            ],
            [
                createStageItem("Masonry Walls", "walls-clayBlock", area),
                createStageItem("Concrete Pillars", "structure-concrete", area)
            ],
            [
                createStageItem("Wooden Trusses", "walls-s2x6", area),
                createStageItem("Brick Finishes Outer Walls", "walls", area)
            ],
            [
                createStageItem("Finishes Inner Walls", "walls", area),
                createStageItem("Ceramic Roof", "roof-ceramic", area)
            ]
        ]
    ])
}



function createStageItem(stageItemName, stage, area) {
    let createStageItem = {
        "stage": stageItemName,
        "index": 0,
        "progress": 0,
        "workersNeeded": createServiceNeed(stage, area),
        "materialNeeded": createMaterialNeed(stage, area)
    }
    return createStageItem
}



function createServiceNeed(stage, area) {
    let serviceNeeded = [] //FINAL SERVICES ARRAY
    let calledStage = [] //CALLED SERVICES RELATED TO STAGE
    //PREVENT INFINITE LOOP
    if (stage == undefined || stage == null) { return [] }
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
    //FOR EACH SERVICE COMPATIBLE WITH CALLED STAGE MAKE A RANDOM COUNT AND ADD TO FINAL ARRAY
    for (let singleService of calledStage) {
        let minimum = area / 50
        let countNumber = randomCount(minimum) // DEFAULT
        console.log(countNumber);
        //SPECIAL RULES
        //======================================================================================//
        if (stage == "excavation") { countNumber = randomCount(minimum) + 1 }
        if (stage == "clearing" && singleService == "Dumpster") { countNumber = 1 }
        if (stage == "slab" && singleService == "Builder") { countNumber = randomCount(minimum) + 1 }
        if (stage == "roof" || stage == "roof-ceramic") { countNumber = randomCount(minimum) + 1 }



        //======================================================================================//

        //ADD TO FINAL ARRAY IF > 0
        if (countNumber > 0) {
            singleService = { "type": singleService, "count": countNumber, "assigned": false }
            serviceNeeded.push(singleService)
        }
        if (countNumber == undefined || countNumber == null) { return console.log(singleService, countNumber, "error") }
    }

    //IF NO SERVICE (EMPTY ARRAY) REDO THE FUNCTION
    if (serviceNeeded.length == 0 || serviceNeeded == undefined) {
        console.log("test");
        createServiceNeed(stage, area)
    }
    else ("ERROR, SERVICE CANNOT GET AT LEAST VALUE OF 1")
    return serviceNeeded
}



function createMaterialNeed(stage, area) {
    let materialNeeded = [] //FINAL MATERIAL ARRAY
    let calledStage = [] //CALLED MATERIALS RELATED TO STAGE
    //PREVENT INFINITE LOOP
    if (stage == undefined || stage == null) { return [] }
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
    //FOR EACH MATERIAL COMPATIBLE WITH CALLED STAGE MAKE A RANDOM COUNT AND ADD TO FINAL ARRAY
    for (let singleMaterial of calledStage) {

        let countNumber = 0 // DEFAULT
        //SPECIAL RULES
        //======================================================================================//

        if (singleMaterial == "Clay Bricks") { countNumber = (randomCount(41) + 40 * area) } // 40 < countNumber < 80
        if (singleMaterial == "Clay Block") { countNumber = (randomCount(31) + 30 * area) } // 30 < countNumber < 60
        if (singleMaterial == "Concrete Bricks") { countNumber = (randomCount(41) + 40 * area) } // 40 < countNumber < 80
        if (singleMaterial == "Concrete Block") { countNumber = (randomCount(31) + 30) * area } // 30 < countNumber < 60

        if (singleMaterial == "Mortar") { countNumber = (randomCount(3) + 3) * area } // 3 < countNumber < 5

        if (singleMaterial == "Ceramic Roof Tile") { countNumber = (randomCount(5) + 14) * area } // 14 < countNumber < 18

        if (stage == "foundation-concrete" || stage == "slab" || stage == "retain-wall" || stage == "structure-concrete") {
            if (singleMaterial == "Normal Str. Concrete") { countNumber = Math.floor(0.05 * area) }
        } else {
            if (singleMaterial == "Normal Str. Concrete") { countNumber = Math.floor(randomCount(2) * 0.05 * area) }
            if (singleMaterial == "High Str. Concrete") { countNumber = Math.floor(randomCount(2) * 0.05 * area) }
            if (singleMaterial == "Grout") { countNumber = Math.floor(randomCount(2) * 0.04 * area) }
            if (singleMaterial == "Asphalt Concrete") { countNumber = Math.floor(randomCount(2) * 0.1 * area) }
        }

        if (singleMaterial == "Straight Rebar #10") { countNumber = Math.floor(1.6 * area) }
        if (singleMaterial == "Straight Rebar #15") { countNumber = Math.floor(randomCount(2) * 1.3 * area) }
        if (singleMaterial == "Straight Rebar #20") { countNumber = Math.floor(randomCount(2) * 0.9 * area) }

        if (stage == "walls-s2x4" || stage == "roof") {
            if (singleMaterial == "Stud 2x4 in.") { countNumber = Math.floor(3.5 * area) }
        }
        else if (stage == "walls-s2x6") {
            if (singleMaterial == "Stud 2x6 in.") { countNumber = Math.floor(3.5 * area) }
        }
        else if (stage == "walls-s2x8") {
            if (singleMaterial == "Stud 2x8 in.") { countNumber = Math.floor(2.4 * area) }
        }
        else {
            if (singleMaterial == "Stud 2x4 in.") { countNumber = Math.floor(randomCount(2) * 3.5 * area) }
            if (singleMaterial == "Stud 2x6 in.") { countNumber = Math.floor(randomCount(2) * 3.5 * area) }
            if (singleMaterial == "Stud 2x8 in.") { countNumber = Math.floor(randomCount(2) * 3.5 * area) }
        }
        if (singleMaterial == "OSB Board") { countNumber = Math.floor(1.4 * area) }


        //======================================================================================//

        //ADD TO FINAL ARRAY IF > 0
        if (countNumber > 0) {
            singleMaterial = { "name": singleMaterial, "count": countNumber, "assigned": false },
                materialNeeded.push(singleMaterial)
        }
        if (countNumber == undefined) { return console.log(singleService, countNumber, "error") }

    }
    //IF NO SERVICE (EMPTY ARRAY) REDO THE FUNCTION
    if (materialNeeded.length == 0 || materialNeeded == undefined) {
        console.log("NO MATERIAL");
    }
    return materialNeeded
}






