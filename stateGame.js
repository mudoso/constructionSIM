let stateGame = {
    "clock": {
        "timeScale": 1000,
        "day": 1,
        "hour": 8,
        "minute": 0,
        "minuteAccumulated": 0
    },
    "ownCompany": {
        "name": "TERNERO Ltda.",
        "level": 1,
        "experience": 0,
        "money": 20000,
        "costPerDay": 0,
        "skillPoints": 0,
        "skills": {
            "construction": 1,
            "management": 1,
            "network": 1,
        }
    },
    "lookingForClients": {
        "research": false,
        "researchTime": 0,
        "remainingTime": 0,
        "lookingAttempts": 1,
        "emojiText": '',
        "clientList": [
            // { ...new Client("Jiraya") },
            // { ...new Client("Marcia") },
            // { ...new Client("Juliano") },
        ],
    },
    "clientIndex": 0,
    "clients": [
        // { ...new Client("Jiraya") },
        // { ...new Client("Marcia") },
    ],
    "THREEmodels": {
        "clients": [],
        "deletedModels": [],
    }
}

// {
//     "name": "Stanley",
//     "money": 6000,
//     "enoughMoney": true,
//     "costPerHour": 0,
//     "warehouse": [],
//     "workers": [],
//     "construction": [
//         [
//             // STAGE 1
//             {
//                 "stage": "Excavation",
//                 "index": 0,
//                 "progress": 0,
//                 "workersNeeded": [
//                     { "type": "Builder", "count": 1, "assigned": false },
//                     { "type": "Carpenter", "count": 1, "assigned": false },
//                     { "type": "Excavator", "count": 1, "assigned": false }
//                 ]
//             },
//             {
//                 "stage": "Slab Foundation",
//                 "index": 1,
//                 "progress": 0,
//                 "workersNeeded": [
//                     { "type": "Builder", "count": 2, "assigned": false },
//                     { "type": "Mixer Truck", "count": 2, "assigned": false }
//                 ],
//                 "materialNeeded": [
//                     { "name": "Normal Str. Concrete", "count": 11, "assigned": false }
//                 ]
//             }
//         ]
//     ],
// },