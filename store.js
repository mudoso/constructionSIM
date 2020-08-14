store = [
    {
        "name": "Workers",
        "service": true,
        "stock": [
            {
                "name": "Builder",
                "stage": ["clearing", "excavation", "fundation", "structure-concrete", "walls", "roof"],
                "service": true,
                "timer": 0,
                "price": 22,
                "unit": "hour"
            },
            {   
                "name": "Carpenter",
                "stage": ["fundation", "structure-concrete", "walls"],
                "service": true,
                "timer": 0,
                "price": 30,
                "unit": "hour"
            },
            {
                "name": "Roofer",
                "stage": ["roof"],
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
                "stage": ["clearing", "excavation", "fundation", "structure-concrete", "walls", "roof"],
                "service": true,
                "timer": 0,
                "price": 230,
                "unit": "hour"
            },
            {   
                "name": "Concrete Pump",
                "stage": ["fundation", "structure-concrete", "slab"],
                "service": true,
                "timer": 0,
                "price": 120,
                "unit": "hour"
            },
            {   
                "name": "Water Pump",
                "stage": ["excavation", "fundation"],
                "service": true,
                "timer": 0,
                "price": 40,
                "unit": "hour"
            },
            {   
                "name": "Oil Motor",
                "stage": ["fundation"],
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
                "stage": ["clearing", "excavation", "fundation", "retain-wall"],
                "service": true,
                "timer": 0,
                "price": 260,
                "unit": "hour"
            },
            {   
                "name": "Skid Loader",
                "stage": ["clearing", "excavation", "fundation", "retain-wall"],
                "service": true,
                "timer": 0,
                "price": 120,
                "unit": "hour"
            },
            {   
                "name": "Articulated truck",
                "stage": ["structure-concrete", "slab"],
                "service": true,
                "timer": 0,
                "price": 170,
                "unit": "hour"
            },
            {   
                "name": "Mixer Truck",
                "stage": ["fundation", "structure-concrete", "slab"],
                "service": true,
                "timer": 0,
                "price": 180,
                "unit": "hour"
            }
        ]
    },
    {
        "name": "Masonary",
        "service": false,
        "stock": [
            {
                "name": "Clay Bricks",
                "stage": ["walls-claybrick"],
                "price": 1,
                "unit": "un."
            },
            {   
                "name": "Clay Block",
                "stage": ["fundation-clayblock", "structure-clayblock", "walls-clayblock"],
                "price": 3,
                "unit": "un."
            },
            {
                "name": "Concrete Bricks",
                "stage": ["fundation-concretebrick", "structure-concretebrick", "walls-concretebrick"],
                "price": 2,
                "unit": "un."
            },
            {
                "name": "Concrete Block",
                "stage": ["fundation-concreteblock", "structure-concreteblock", "walls-concreteblock"],
                "price": 4,
                "unit": "un."
            },
            {
                "name": "Ceramic Roof Tile",
                "stage": ["roof-ceramic"],
                "price": 3,
                "unit": "un."
            },
            {
                "name": "Mortar",
                "stage": ["walls-claybrick",
                "fundation-clayblock", "structure-clayblock", "walls-clayblock",
                "fundation-concretebrick", "structure-concretebrick", "walls-concretebrick",
                "fundation-concreteblock", "structure-concreteblock", "walls-concreteblock",
                "roof-ceramic"],
                "price": 9,
                "unit": "25kg"
            }
        ],
    },
    {
        "name": "Concrete",
        "service": false,
        "stock": [
            {
                "name": "Normal Str. Concrete",
                "stage": ["fundation-concrete", "retain-wall", "structure-concrete", "slab"],
                "price": 100,
                "unit": "m³"
            }, {
                "name": "High Str. Concrete",
                "stage": ["fundation-concrete", "retain-wall", "structure-concrete", "slab"],
                "price": 120,
                "unit": "m³"
            }, {
                "name": "Grout",
                "stage": [
                    "fundation-clayblock", "structure-clayblock", "walls-clayblock",
                    "fundation-concreteblock", "structure-concreteblock", "walls-concreteblock"],
                "price": 140,
                "unit": "m³"
            }, {
                "name": "Asphalt Concrete",
                "stage": ["fundation", "retain-wall", "slab"],
                "price": 130,
                "unit": "m³"
            }
        ],
    },
    {
        "name": "Rebar",
        "service": false,
        "stock": [
            {
                "name": "Straight Rebar #10",
                "stage": ["fundation", "retain-wall", "structure-concrete"],
                "price": 10,
                "unit": "12m"
            }, {
                "name": "Straight Rebar #15",
                "stage": ["fundation", "retain-wall", "structure-concrete"],
                "price": 16,
                "unit": "12m"
            }, {
                "name": "Straight Rebar #20",
                "stage": ["fundation", "retain-wall", "structure-concrete"],
                "price": 25,
                "unit": "12m"
            }
        ],
    },
    {
        "name": "Wood",
        "service": false,
        "stock": [
            {
                "name": "Stud 2x4 in.",
                "stage": ["retain-wall", "structure-concrete", "walls-s2x4", "roof"],
                "price": 12,
                "unit": "m"
            }, {
                "name": "Stud 2x6 in.",
                "stage": ["retain-wall", "structure-concrete", "walls-s2x6", "roof"],
                "price": 20,
                "unit": "m"
            }, {
                "name": "Stud 2x8 in.",
                "stage": ["retain-wall", "structure-concrete", "walls-s2x8", "roof"],
                "price": 27,
                "unit": "m"
            }, {
                "name": "OSB Board",
                "stage": ["retain-wall", "structure-concrete", "roof",
                "walls-s2x4", "walls-s2x6", "walls-s2x8"],
                "price": 2,
                "unit": "m²"
            }
        ]
    }
]