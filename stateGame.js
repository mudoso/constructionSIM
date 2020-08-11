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
    "clients": [
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
                // STAGE 2
                [
                    {
                    "stage": "Fundation Concrete Slab",
                    "index": 0,
                    "progress": 0,
                    "workersNeeded": [
                        {"type": "Builder", "count": 2, "assigned": false},
                        {"type": "Carpenter", "count": 1, "assigned": false},
                        {"type": "Mixer Truck", "count": 2, "assigned": false}
                        ],
                    "materialNeeded": [
                        {"name": "Stud 2x8 in.", "count" : 44, "assigned": false},
                        {"name": "Straight Rebar #10", "count" : 200, "assigned": false},
                        {"name": "Galvanized Steel Wire", "count" : 15, "assigned": false},
                        {"name": "Normal Str. Concrete", "count" : 26, "assigned": false}
                        ]
                    }
                ],
                // STAGE 3
                [
                    {
                    "stage": "Outer Walls",
                    "index": 0,
                    "progress": 0,
                    "workersNeeded": [
                        {"type": "Builder", "count": 2, "assigned": false},
                        {"type": "Carpenter", "count": 1, "assigned": false}
                        ],
                    "materialNeeded": [
                        {"name": "Clay Block", "count" : 1800, "assigned": false},
                        {"name": "Mortar", "count" : 400, "assigned": false},
                        {"name": "Straight Rebar #10", "count" : 12, "assigned": false},
                        {"name": "Grout", "count" : 5, "assigned": false}
                        ]
                    },
                    {
                    "stage": "Inner Walls",
                    "index": 1,
                    "progress": 0,
                    "workersNeeded": [
                        {"type": "Builder", "count": 2, "assigned": false}
                        ],
                    "materialNeeded": [
                        {"name": "Clay Block", "count" : 1300, "assigned": false},
                        {"name": "Mortar", "count" : 280, "assigned": false}
                        ]
                    }
                ],
                // STAGE 4
                [
                    {
                    "stage": "Roofing Frame",
                    "index": 0,
                    "progress": 0,
                    "workersNeeded": [
                        {"type": "Roofer", "count": 2, "assigned": false}
                        ],
                    "materialNeeded": [
                        {"name": "Stud 2x4 in.", "count" : 420, "assigned": false},
                        {"name": "OSB Board", "count" : 110, "assigned": false},
                        {"name": "Ceramic Roof Tile", "count" : 1400, "assigned": false}
                        ]
                    },
                    {
                    "stage": "External Wall Finish",
                    "index": 1,
                    "progress": 0,
                    "workersNeeded": [
                        {"type": "Builder", "count": 2, "assigned": false}
                        ],
                    "materialNeeded": [
                        {"name": "Mortar", "count" : 280, "assigned": false}
                        ]
                    }
                ]
            ],
        },
        {
            "name": "Stanley",
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
                        {"type": "Builder", "count": 1, "assigned": false},
                        {"type": "Carpenter", "count": 1, "assigned": false},
                        {"type": "Excavator", "count": 1, "assigned": false}
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
    ],
}
