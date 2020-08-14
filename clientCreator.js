function createClient (clientname) {
    let clientCreated = {
        "name": clientname,
        "money": 6666,
        "costPerHour": 0,
        "warehouse": [],
        "workers": [],
        "construction": [
            [
                fundationStageItem("Land Clearing", "clearing"),
                fundationStageItem("Excavation", "excavation")
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



function fundationStageItem(stageItemName, stageItemType) {
    let fundationStageItem = {
        "stage": stageItemName,
        "index": 0,
        "progress": 0,
        "workersNeeded": serviceNeed(stageItemType)
    }
    return fundationStageItem
}





function serviceNeed(stage) {
    let serviceNeeded = []
    let fundationServices = []
    
    for (let storeCategory of store) {
        if (storeCategory.service == true) {
            for (let itemOnStock of storeCategory.stock) {
                if (itemOnStock.stage != undefined && itemOnStock.stage.includes(stage) == true) {
                    fundationServices.push(itemOnStock.name)
                }                         
            }
        }
    }
    for (let singleService of fundationServices) {
        let countNumber = randomCount(2) // DEFAULT 0 < countNumber < 1

        if (stage == "excavation") {countNumber = randomCount(2)+1} // 1 < countNumber < 2

         
        console.log(countNumber)
        if (countNumber > 0) {
            singleService = {"type": singleService, "count": countNumber, "assigned": false}
            serviceNeeded.push(singleService)
        }
    }
    console.log(serviceNeeded)

    if (serviceNeeded.length == 0) {
        console.log("tenta de novo")
        serviceNeed(stage)
    }
    return serviceNeeded
}











/*
{
    "name": "Jarbas",
    "money": 40000,
    "enoughMoney": true,
    "costPerHour": 0,
    "warehouse": [],
    "workers": [],
    "construction": [
        // STAGE 1
        [
            {
            "stage": "Land Clearing",
            "index": 0,
            "progress": 0,
            "workersNeeded": [
                {"type": "Excavator", "count": 1, "assigned": false},
                {"type": "Dumpster", "count": 1, "assigned": false},
                {"type": "Builder", "count": 1, "assigned": false}
                ]
            },
            {
            "stage": "Excavation",
            "index": 1,
            "progress": 0,
            "workersNeeded": [
                {"type": "Excavator", "count": 1, "assigned": false},
                {"type": "Builder", "count": 1, "assigned": false}
                ]
            },

        ],
    ]
}
*/