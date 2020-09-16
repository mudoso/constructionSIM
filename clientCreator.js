//======================================================================================//
//CLIENT AND CONSTRUCTION CREATOR
//======================================================================================//

class Client {
    constructor(clientName) {
        console.log(this);
        this.name = clientName
        this.id = this.name + Math.floor(Math.random() * 100000)
        // this.attempt = randomCount(stateGame.ownCompany.level) + 1
        this.area = randomCount(50) + 50
        this.money = clientBudgetFormula(this.area)
        this.costPerHour = 0
        this.warehouse = []
        this.warehouseLimit = this.area * .4
        console.log(this.name, this.warehouseLimit)
        this.workers = []
        this.constructionType = buildTypeList()
        this.construction = eval(`${this.constructionType}( ${this.area} )`)
    }
}


//BUILD CONSTRUCTOR TYPE LIST
//======================================================================================//

function clientBudgetFormula(area) {
    console.log(area)
    let budget = 0
    budget = Math.floor((Math.random() * 0.3 + 0.9) * 1000 * area / 100) * 100
    return budget
}


function buildTypeList() {
    return randomIndex([
        "SmallWoodFrameHouse_01"
    ])
}

function SmallWoodFrameHouse_01(area) {
    return [
        [
            createStageItem("Land Clearing", "clearing", area),
            createStageItem("Excavation", "excavation", area)
        ],
        [
            createStageItem("Slab Foundation", "slab", area)
        ],
        [
            createStageItem("Structural Wood Walls", "walls-s2x6", area),
            createStageItem("Non-Structural Wood Walls", "walls-s2x4", area)
        ],
        [
            createStageItem("Structural Wood Trusses", "walls-s2x6", area),
            createStageItem("Sheathing", "sheathing", area)
        ],
        [
            createStageItem("Windows and Doors", "door/window", area),
            createStageItem("Drywall", "drywall", area),
            createStageItem("Flooring", "floor", area),
            createStageItem("Brick Finishes Outer Walls", "walls-clayBrick", area)
        ],
        [
            createStageItem("Deck", "walls-s2x4", area),
            createStageItem("Exterior Finishes", "clearing", area),
            createStageItem("Finishes Roof", "roof", area)
        ]
    ]
}

//======================================================================================//


function randomIndex(targetArray) {
    return targetArray[Math.floor(Math.random() * targetArray.length)]
}
function randomCount(countRange) {
    return Math.floor(Math.random() * countRange)
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
        //SPECIAL RULES
        //======================================================================================//

        if (stage == "excavation") {
            if (singleService == "Excavator") { countNumber = 1 }
            if (singleService == "Articulated truck") { countNumber = 0 }
        }
        if (singleService == "Builder" ||
            singleService == "Carpenter" ||
            singleService == "Bricklayer" ||
            singleService == "Roofer" ||
            singleService == "Welder") {
            countNumber = randomCount(minimum) + 1
        }
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
    if (serviceNeeded.length < 1 || serviceNeeded == undefined) {
        createServiceNeed(stage, area)
    }
    // else (console.log("ERROR, SERVICE CANNOT GET AT LEAST VALUE OF 1", stage))
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
        let randomDelta = (Math.random() + 1) / 1.5

        //SPECIAL RULES
        //======================================================================================//

        if (singleMaterial == "Clay Bricks") { countNumber = Math.floor((randomCount(41) + 40 * randomDelta * area)) } // 40 < countNumber < 80
        if (singleMaterial == "Clay Block") { countNumber = Math.floor((randomCount(31) + 30 * randomDelta * area)) } // 30 < countNumber < 60
        if (singleMaterial == "Concrete Bricks") { countNumber = Math.floor((randomCount(41) + 40 * randomDelta * area)) } // 40 < countNumber < 80
        if (singleMaterial == "Concrete Block") { countNumber = Math.floor((randomCount(31) + 30) * randomDelta * area) } // 30 < countNumber < 60

        if (singleMaterial == "Mortar") { countNumber = Math.floor((randomCount(3) + 3) * randomDelta * area) } // 3 < countNumber < 5

        if (singleMaterial == "Ceramic Roof Tile") { countNumber = (randomCount(5) + 14) * area } // 14 < countNumber < 18

        if (stage == "foundation-concrete" || stage == "slab" || stage == "retain-wall" || stage == "structure-concrete") {
            if (singleMaterial == "Normal Str. Concrete") { countNumber = Math.floor(0.15 * randomDelta * area) }
        } else {
            if (singleMaterial == "Normal Str. Concrete") { countNumber = Math.floor(randomCount(2) * randomDelta * 0.15 * area) }
            if (singleMaterial == "High Str. Concrete") { countNumber = Math.floor(randomCount(2) * randomDelta * 0.15 * area) }
            if (singleMaterial == "Grout") { countNumber = Math.floor(randomCount(2) * randomDelta * 0.15 * area) }
            if (singleMaterial == "Asphalt Concrete") { countNumber = Math.floor(randomCount(2) * randomDelta * 0.15 * area) }
        }

        if (singleMaterial == "Straight Rebar #10") { countNumber = Math.floor(1.6 * Math.random() * area) }
        if (singleMaterial == "Straight Rebar #15") { countNumber = Math.floor(randomCount(2) * Math.random() * 1.3 * area) }
        if (singleMaterial == "Straight Rebar #20") { countNumber = Math.floor(randomCount(2) * Math.random() * 0.9 * area) }

        if (singleMaterial == "Stud 2x4 in.") { countNumber = Math.floor(randomDelta * 3.5 * area) }
        if (singleMaterial == "Stud 2x6 in.") { countNumber = Math.floor(randomDelta * 3.5 * area) }
        if (singleMaterial == "Stud 2x8 in.") { countNumber = Math.floor(randomDelta * 3.5 * area) }

        if (singleMaterial == "OSB Board") { countNumber = Math.floor(1.4 * randomDelta * area) }
        if (singleMaterial == "Hardwood Floor") { countNumber = Math.floor(1.1 * randomDelta * area) }

        if (singleMaterial == "Drywall Panels") { countNumber = Math.floor(0.7 * randomDelta * area) }
        if (singleMaterial == "Plaster") { countNumber = Math.floor(.5 * randomDelta * area) }
        if (singleMaterial == "Insulation") { countNumber = Math.floor(1.6 * randomDelta * area) }

        if (stage == "door/window") { countNumber = Math.floor(0.06 * randomDelta * area) }


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