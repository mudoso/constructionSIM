stateGame = {
    "clock": {
        "day": 1,
        "hour": 0,
        "minute": 0
    },
    "ownCompany": {
        "name": "Teste",
        "money": 20000
    },
    "client1": {
        "name": "Fulano",
        "money": 40000,
        "enoughMoney": true,
        "costPerHour": 0,
        "warehouse": [],
        "workers": [],
        "construction": [
            [
                // STAGE 1
                {
                "stage": "Excavation",
                "index": 0,
                "progress": 0,
                "workersNeeded": [
                    {"type": "Excavator", "count": 1, "assigned": false},
                    {"type": "Builder", "count": 1, "assigned": false}
                    ]
                },
                {
                "stage": "Fundation Concrete Slab",
                "index": 1,
                "progress": 0,
                "workersNeeded": [
                    {"type": "Builder", "count": 2, "assigned": false},
                    {"type": "Mixer Truck", "count": 2, "assigned": false}
                    ],
                "materialNeeded": [
                    {"name": "Normal Strength Concrete", "count" : 11, "assigned": false}
                    ]
                }
            ],
            // STAGE 2
            [
            {
                "stage": "Wall",
                "index": 0,
                "progress": 0,
                "workersNeeded": [
                    {"type": "Builder", "count": 1, "assigned": false}
                    ],
                "materialNeeded": [
                    {"name": "Clay Bricks", "count" : 150, "assigned": false},
                    {"name": "Mortar", "count" : 1, "assigned": false}
                    ]
            }
            ],
            []
        ],
    },
    "client2": {
        "name": "Fulano",
        "money": 6000,
        "enoughMoney": true,
        "costPerHour": 0,
        "warehouse": [],
        "workers": [],
        "construction": [
            [
                // STAGE 1
                {
                "stage": "Excavation",
                "index": 0,
                "progress": 0,
                "workersNeeded": [
                    {"type": "Excavator", "count": 1, "assigned": false},
                    {"type": "Builder", "count": 1, "assigned": false}
                    ]
                },
                {
                "stage": "Fundation Concrete Slab",
                "index": 1,
                "progress": 0,
                "workersNeeded": [
                    {"type": "Builder", "count": 2, "assigned": false},
                    {"type": "Mixer Truck", "count": 2, "assigned": false}
                    ],
                "materialNeeded": [
                    {"name": "Normal Strength Concrete", "count" : 11, "assigned": false}
                    ]
                }
            ],
            // STAGE 2
            [
            {
                "stage": "Wall",
                "index": 0,
                "progress": 0,
                "workersNeeded": [
                    {"type": "Builder", "count": 1, "assigned": false}
                    ],
                "materialNeeded": [
                    {"name": "Clay Bricks", "count" : 150, "assigned": false},
                    {"name": "Mortar", "count" : 1, "assigned": false}
                    ]
            }
            ],
            []
        ],
    }
}
