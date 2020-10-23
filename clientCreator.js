//======================================================================================//
//CLIENT AND CONSTRUCTION CREATOR
//======================================================================================//

class Client {
    constructor(clientName) {
        console.log(this);
        this.name = clientName
        this.id = getClientId(this.name)
        this.area = randomCount(50) + 50
        this.money = getClientBudget(this.area)
        this.costPerHour = 0
        this.warehouse = []
        this.warehouseLimit = this.area * .4
        this.workers = []
        this.constructionType = buildTypeList()
        this.construction = eval(`${this.constructionType}( ${this.area} )`)
        this.dueDate = getDueDate(this.area, this.construction)
        this.dueFee = getDueFee(this.money)
    }
}


//BUILD CONSTRUCTOR TYPE LIST
//======================================================================================//

function getClientId(name) {
    return name + Math.floor(Math.random() * 100000)
}

function getClientBudget(area) {
    let budget = 0
    budget = Math.floor((Math.random() * 0.3 + 0.9) * 1000 * area / 100) * 100
    return budget
}

function getDueDate(area, construction) {
    const skill1 = stateGame.ownCompany.skills.management
    const skill2 = stateGame.ownCompany.skills.network / 3
    const stages = construction.length

    const SkillDelta = 1 + (skill1 + skill2) / 10
    const daysPerArea = Math.floor(area / 10)
    const daysPerStage = Math.floor(stages * 3 * SkillDelta)
    const setDueTime = stateGame.clock.day + daysPerStage + daysPerArea
    console.log("getDueDate -> setDueTime", setDueTime)
    return setDueTime
}

function getDueFee(money) {
    let skill = stateGame.ownCompany.skills.network
    if (skill > 40)
        skill = 40
    const reducedPercentage = 1 - skill / 100
    const rawPercentage = randomNumberInteger(1, 5) / 100

    const dueFee = Math.floor(money * rawPercentage * reducedPercentage)
    console.log(dueFee, money, rawPercentage, reducedPercentage)
    return dueFee
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
    const serviceNeeded = [] //FINAL SERVICES ARRAY
    const calledStage = [] //CALLED SERVICES RELATED TO STAGE
    const isInvalidStage = stage == null

    if (isInvalidStage) return []

    for (let storeCategory of store) {
        const isService = storeCategory.service == true

        if (isService) {
            for (let itemOnStock of storeCategory.stock) {
                const hasStage = itemOnStock.stage != undefined
                const isValidStage = itemOnStock.stage.includes(stage) == true

                if (hasStage && isValidStage)
                    calledStage.push(itemOnStock.name)

            }
        }
    }
    //FOR EACH SERVICE COMPATIBLE WITH CALLED STAGE MAKE A RANDOM COUNT AND ADD TO FINAL ARRAY
    for (let singleService of calledStage) {

        const countNumber = getFilteredCount(stage, singleService, area) // DEFAULT
        //SPECIAL RULES
        //======================================================================================//



        //======================================================================================//

        const hasService = countNumber > 0
        if (hasService) {
            singleService = {
                "type": singleService,
                "count": countNumber,
                "assigned": false
            }
            serviceNeeded.push(singleService)
        }

        const isInvalidCount = countNumber == null
        if (isInvalidCount)
            return console.log(singleService, countNumber, "error")
    }

    const hasNoService = serviceNeeded.length < 1
    if (hasNoService)
        createServiceNeed(stage, area)

    return serviceNeeded
}

function getFilteredCount(stage, singleService, area) {
    const minimum = area / 50

    switch (true) {
        case singleService == "Builder":
        case singleService == "Carpenter":
        case singleService == "Bricklayer":
        case singleService == "Roofer":
        case singleService == "Welder":
        case stage == "roof":
        case stage == "roof-ceramic":
        case stage == "slab" && singleService == "Builder":
            countNumber = randomCount(minimum) + 1
            break

        case stage == "clearing" && singleService == "Dumpster":
            countNumber = 1
            break

        case stage == "excavation" && singleService == "Excavator":
            countNumber = 1
            break
        case stage == "excavation" && singleService == "Articulated":
            countNumber = 0
            break

        default:
            console.log(stage, "default");
            countNumber = randomCount(minimum)
            break
    }
    return countNumber
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