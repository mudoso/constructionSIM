class Client {
    constructor(clientName) {
        console.log(this);
        this.name = clientName
        this.level = 1
        this.money = 35000
        this.area = randomCount(50) + 50
        this.costPerHour = 0
        this.warehouse = []
        this.workers = []
        this.construction = constructionStage(this.level, this.area)
    }
}


// function createClient(clientName) {
//     return {
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
                createStageItem("Finishes Roof", "roof", area)
            ]
        ]
        // ,
        // [
        //     //SMALL MASONRY HOUSE
        //     [
        //         createStageItem("Land Clearing", "clearing", area),
        //         createStageItem("Pile Excavation", "excavation", area)
        //     ],
        //     [
        //         createStageItem("Structural Pile", "structure-concrete", area)
        //     ],
        //     [
        //         createStageItem("Slab Foundation", "slab", area)
        //     ],
        //     [
        //         createStageItem("Masonry Walls", "walls-clayBlock", area),
        //         createStageItem("Concrete Pillars", "structure-concrete", area)
        //     ],
        //     [
        //         createStageItem("Wooden Trusses", "walls-s2x6", area),
        //         createStageItem("Brick Finishes Outer Walls", "walls", area)
        //     ],
        //     [
        //         createStageItem("Finishes Inner Walls", "walls", area),
        //         createStageItem("Ceramic Roof", "roof-ceramic", area)
        //     ]
        // ]
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
        console.log(singleService, countNumber);
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
            console.log("createServiceNeed -> singleService", singleService)
        }
        if (countNumber == undefined || countNumber == null) { return console.log(singleService, countNumber, "error") }
    }

    //IF NO SERVICE (EMPTY ARRAY) REDO THE FUNCTION
    if (serviceNeeded.length < 1 || serviceNeeded == undefined) {
        createServiceNeed(stage, area)
    }
    else (console.log("ERROR, SERVICE CANNOT GET AT LEAST VALUE OF 1", stage))
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

        if (singleMaterial == "Clay Bricks") { countNumber = Math.floor((randomCount(41) + 40 * (Math.random() + 1) / 1.5 * area)) } // 40 < countNumber < 80
        if (singleMaterial == "Clay Block") { countNumber = Math.floor((randomCount(31) + 30 * (Math.random() + 1) / 1.5 * area)) } // 30 < countNumber < 60
        if (singleMaterial == "Concrete Bricks") { countNumber = Math.floor((randomCount(41) + 40 * (Math.random() + 1) / 1.5 * area)) } // 40 < countNumber < 80
        if (singleMaterial == "Concrete Block") { countNumber = Math.floor((randomCount(31) + 30) * (Math.random() + 1) / 1.5 * area) } // 30 < countNumber < 60

        if (singleMaterial == "Mortar") { countNumber = Math.floor((randomCount(3) + 3) * (Math.random() + 1) / 1.5 * area) } // 3 < countNumber < 5

        if (singleMaterial == "Ceramic Roof Tile") { countNumber = (randomCount(5) + 14) * area } // 14 < countNumber < 18

        if (stage == "foundation-concrete" || stage == "slab" || stage == "retain-wall" || stage == "structure-concrete") {
            if (singleMaterial == "Normal Str. Concrete") { countNumber = Math.floor(0.15 * (Math.random() + 1) / 1.5 * area) }
        } else {
            if (singleMaterial == "Normal Str. Concrete") { countNumber = Math.floor(randomCount(2) * (Math.random() + 1) / 1.5 * 0.15 * area) }
            if (singleMaterial == "High Str. Concrete") { countNumber = Math.floor(randomCount(2) * (Math.random() + 1) / 1.5 * 0.15 * area) }
            if (singleMaterial == "Grout") { countNumber = Math.floor(randomCount(2) * (Math.random() + 1) / 1.5 * 0.15 * area) }
            if (singleMaterial == "Asphalt Concrete") { countNumber = Math.floor(randomCount(2) * (Math.random() + 1) / 1.5 * 0.15 * area) }
        }

        if (singleMaterial == "Straight Rebar #10") { countNumber = Math.floor(1.6 * Math.random() * area) }
        if (singleMaterial == "Straight Rebar #15") { countNumber = Math.floor(randomCount(2) * Math.random() * 1.3 * area) }
        if (singleMaterial == "Straight Rebar #20") { countNumber = Math.floor(randomCount(2) * Math.random() * 0.9 * area) }

        if (stage == "walls-s2x4" || stage == "roof") {
            if (singleMaterial == "Stud 2x4 in.") { countNumber = Math.floor(3.5 * (Math.random() + 1) / 1.5 * area) }
        }
        else if (stage == "walls-s2x6") {
            if (singleMaterial == "Stud 2x6 in.") { countNumber = Math.floor(3.5 * (Math.random() + 1) / 1.5 * area) }
        }
        else if (stage == "walls-s2x8") {
            if (singleMaterial == "Stud 2x8 in.") { countNumber = Math.floor(2.4 * (Math.random() + 1) / 1.5 * area) }
        }
        else {
            if (singleMaterial == "Stud 2x4 in.") { countNumber = Math.floor(randomCount(2) * (Math.random() + 1) / 1.5 * 3.5 * area) }
            if (singleMaterial == "Stud 2x6 in.") { countNumber = Math.floor(randomCount(2) * (Math.random() + 1) / 1.5 * 3.5 * area) }
            if (singleMaterial == "Stud 2x8 in.") { countNumber = Math.floor(randomCount(2) * (Math.random() + 1) / 1.5 * 3.5 * area) }
        }
        if (singleMaterial == "OSB Board") { countNumber = Math.floor(1.4 * (Math.random() + 1) / 1.5 * area) }
        if (singleMaterial == "Hardwood Floor") { countNumber = Math.floor(1.1 * (Math.random() + 1) / 1.5 * area) }

        if (singleMaterial == "Drywall Panels") { countNumber = Math.floor(0.7 * (Math.random() + 1) / 1.5 * area) }
        if (singleMaterial == "Plaster") { countNumber = Math.floor(.5 * (Math.random() + 1) / 1.5 * area) }
        if (singleMaterial == "Insulation") { countNumber = Math.floor(1.6 * (Math.random() + 1) / 1.5 * area) }

        if (stage == "door/window") { countNumber = Math.floor(0.07 * (Math.random() + 1) / 1.5 * area) }


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






