store = [
    {
        "name": "Workers",
        "service": true,
        "stock": [
            {
                "name": "Builder",
                "stage": ["clearing", "excavation", "foundation", "structure-concrete", "walls", "roof", "slab",
                    "sheathing", "floor", "drywall", "door/window"],
                "service": true,
                "timer": 0,
                "price": 22,
                "unit": "hour"
            },
            {
                "name": "Carpenter",
                "stage": ["foundation", "structure-concrete", "walls", "retain-wall", "structure-concrete",
                    "walls-s2x4", "walls-s2x6", "walls-s2x8", "sheathing", "floor", "drywall", "door/window"],
                "service": true,
                "timer": 0,
                "price": 30,
                "unit": "hour"
            },
            {
                "name": "Bricklayer",
                "stage": [
                    "walls-clayBrick", "foundation-clayBlock", "structure-clayBlock", "walls-clayBlock",
                    "foundation-concreteBrick", "structure-concreteBrick", "walls-concreteBrick",
                    "foundation-concreteBlock", "structure-concreteBlock", "walls-concreteBlock",
                    "roof-ceramic"],
                "service": true,
                "timer": 0,
                "price": 30,
                "unit": "hour"
            },
            {
                "name": "Roofer",
                "stage": ["roof", "roof-ceramic"],
                "service": true,
                "timer": 0,
                "price": 40,
                "unit": "hour"
            },
            {
                "name": "Welder",
                "stage": ["structure-steel"],
                "service": true,
                "timer": 0,
                "price": 40,
                "unit": "hour"
            }
        ],
    },
    {
        "name": "Services",
        "service": true,
        "stock": [
            {
                "name": "Dumpster",
                "stage": ["clearing", "excavation", "foundation"],
                "service": true,
                "timer": 0,
                "price": 230,
                "unit": "hour"
            },
            {
                "name": "Concrete Pump",
                "stage": ["foundation", "structure-concrete", "slab", "retain-wall"],
                "service": true,
                "timer": 0,
                "price": 120,
                "unit": "hour"
            },
            {
                "name": "Water Pump",
                "stage": ["excavation", "foundation"],
                "service": true,
                "timer": 0,
                "price": 40,
                "unit": "hour"
            },
            {
                "name": "Oil Motor",
                "stage": ["foundation"],
                "service": true,
                "timer": 0,
                "price": 70,
                "unit": "hour"
            }
        ],
    },
    {
        "name": "Machinery",
        "service": true,
        "stock": [
            {
                "name": "Excavator",
                "stage": ["clearing", "excavation", "foundation", "retain-wall"],
                "service": true,
                "timer": 0,
                "price": 260,
                "unit": "hour"
            },
            {
                "name": "Skid Loader",
                "stage": ["clearing", "excavation", "foundation", "retain-wall"],
                "service": true,
                "timer": 0,
                "price": 120,
                "unit": "hour"
            },
            {
                "name": "Articulated truck",
                "stage": ["clearing", "foundation", "structure-concrete", "slab", "retain-wall"],
                "service": true,
                "timer": 0,
                "price": 170,
                "unit": "hour"
            },
            {
                "name": "Mixer Truck",
                "stage": ["foundation", "structure-concrete", "slab"],
                "service": true,
                "timer": 0,
                "price": 180,
                "unit": "hour"
            }
        ]
    },
    {
        "name": "Masonry",
        "service": false,
        "stock": [
            {
                "name": "Clay Bricks",
                "stage": ["walls-clayBrick"],
                "price": 1,
                "unit": "un.",
                "volume": 0.0015
            },
            {
                "name": "Clay Block",
                "stage": ["foundation-clayBlock", "structure-clayBlock", "walls-clayBlock"],
                "price": 3,
                "unit": "un.",
                "volume": 0.016
            },
            {
                "name": "Concrete Bricks",
                "stage": ["foundation-concreteBrick", "structure-concreteBrick", "walls-concreteBrick"],
                "price": 2,
                "unit": "un.",
                "volume": 0.002
            },
            {
                "name": "Concrete Block",
                "stage": ["foundation-concreteBlock", "structure-concreteBlock", "walls-concreteBlock"],
                "price": 4,
                "unit": "un.",
                "volume": 0.016
            },
            {
                "name": "Ceramic Roof Tile",
                "stage": ["roof-ceramic"],
                "price": 3,
                "unit": "un.",
                "volume": 0.003
            },
            {
                "name": "Mortar",
                "stage": [
                    "walls-clayBrick", "foundation-clayBlock", "structure-clayBlock", "walls-clayBlock",
                    "foundation-concreteBrick", "structure-concreteBrick", "walls-concreteBrick",
                    "foundation-concreteBlock", "structure-concreteBlock", "walls-concreteBlock",
                    "roof-ceramic"],
                "price": 9,
                "unit": "25kg",
                "volume": 0.03
            }
        ],
    },
    {
        "name": "Concrete",
        "service": false,
        "stock": [
            {
                "name": "Normal Str. Concrete",
                "stage": ["foundation-concrete", "retain-wall", "structure-concrete", "slab"],
                "price": 100,
                "unit": "m³",
                "volume": 1
            },
            {
                "name": "High Str. Concrete",
                "stage": ["foundation-concrete", "retain-wall", "structure-concrete", "slab"],
                "price": 120,
                "unit": "m³",
                "volume": 1
            },
            {
                "name": "Grout",
                "stage": [
                    "foundation-clayBlock", "structure-clayBlock", "walls-clayBlock",
                    "foundation-concreteBlock", "structure-concreteBlock", "walls-concreteBlock"],
                "price": 140,
                "unit": "m³",
                "volume": 1
            },
            {
                "name": "Asphalt Concrete",
                "stage": ["asphalt-foundation"],
                "price": 130,
                "unit": "m³",
                "volume": 1
            }
        ],
    },
    {
        "name": "Rebar",
        "service": false,
        "stock": [
            {
                "name": "Straight Rebar #10",
                "stage": ["foundation", "retain-wall", "structure-concrete", "slab", "structure-concreteBlock",
                    "foundation-clayBlock"],
                "price": 10,
                "unit": "m",
                "volume": 0.001
            },
            {
                "name": "Straight Rebar #15",
                "stage": ["foundation", "retain-wall", "structure-concrete", "slab"],
                "price": 16,
                "unit": "m",
                "volume": 0.0015
            },
            {
                "name": "Straight Rebar #20",
                "stage": ["foundation", "retain-wall", "structure-concrete", "slab"],
                "price": 25,
                "unit": "m",
                "volume": 0.0025
            }
        ],
    },
    {
        "name": "Wood",
        "service": false,
        "stock": [
            {
                "name": "Stud 2x4 in.",
                "stage": ["retain-wall", "structure-concrete", "walls-s2x4", "roof", "roof-ceramic", "drywall"],
                "price": 12,
                "unit": "m",
                "volume": 0.001
            },
            {
                "name": "Stud 2x6 in.",
                "stage": ["retain-wall", "structure-concrete", "walls-s2x6", "roof", "roof-ceramic"],
                "price": 20,
                "unit": "m",
                "volume": 0.0015
            },
            {
                "name": "Stud 2x8 in.",
                "stage": ["retain-wall", "structure-concrete", "walls-s2x8", "roof", "roof-ceramic"],
                "price": 27,
                "unit": "m",
                "volume": 0.002
            },
            {
                "name": "OSB Board",
                "stage": ["retain-wall", "structure-concrete", "roof",
                    "walls-s2x4", "walls-s2x6", "walls-s2x8", "sheathing"],
                "price": 2,
                "unit": "m²",
                "volume": 0.03
            },
            {
                "name": "Hardwood Floor",
                "stage": ["floor"],
                "price": 4,
                "unit": "m²",
                "volume": 0.07
            }
        ]
    },
    {
        "name": "Drywall",
        "service": false,
        "stock": [
            {
                "name": "Drywall Panels",
                "stage": ["drywall"],
                "price": 15,
                "unit": "un.",
                "volume": 0.01
            },
            {
                "name": "Plaster",
                "stage": ["drywall"],
                "price": 18,
                "unit": "25kg",
                "volume": 0.03
            },
            {
                "name": "Insulation",
                "stage": ["drywall"],
                "price": 10,
                "unit": "m²",
                "volume": 0.05
            }
        ]
    },
    {
        "name": "Doors",
        "service": false,
        "stock": [
            {
                "name": "Regular Door",
                "stage": ["door/window"],
                "price": 1200,
                "unit": "un.",
                "volume": 0.4
            }
        ]
    },
    {
        "name": "Windows",
        "service": false,
        "stock": [
            {
                "name": "Regular Window",
                "stage": ["door/window"],
                "price": 850,
                "unit": "un.",
                "volume": 0.35
            },
            {
                "name": "Small Window",
                "stage": ["door/window"],
                "price": 700,
                "unit": "un.",
                "volume": 0.1
            }
        ]
    }
]