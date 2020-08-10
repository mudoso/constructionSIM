

//RESPOSIBLE FOR DEFINE ALL GLOBAL VARIABLES (BUT TIME ONES)
//RESPOSIBLE FOR DEFINE ALL PATHS


//DEFINE ALL GLOBAL PATHS

//==========NAV CLIENT PATH=============
let currentClient = "client1"
const clientLeftArrowButtonDOM = document.getElementById("btn-clients-left")
const clientSelectedButtonDOM = document.getElementById("btn-clients")
const clientRightArrowButtonDOM = document.getElementById("btn-clients-right")

//==========NAV STATS PATH=============
const currentDateDOM = document.getElementById("current-date")
const ownMoneyDOM = document.getElementById("own-money")

let clientMoney = stateGame[currentClient].money
const clientMoneyDOM = document.getElementById("client-money")

const costPerHourDOM = document.getElementById("cost-per-hour")

//==========NAV STORE PATH=============
const storeItems = Object.keys(store)

const storeCategoryContainerDOM = document.getElementById("store-category")
const storeBuyContainerDOM = document.getElementById("store-buy-items")


//==========NAV INVENTOR / WORKERS-SERVICES / WAREHOUSE PATH=============
const warehouseContainerDOM = document.getElementById("warehosue-container")
const statsInventoryWarehouse = stateGame[currentClient].warehouse

const workersAndServicesContainerDOM = document.getElementById("workers-services")
const statsWorkersAndServices = stateGame[currentClient].workers

const statsCostPerHour = stateGame[currentClient].costPerHour

//==========NAV CONSTUCTION  PATH=============
const constructionContainerDOM = document.getElementById("construction-container")
const statsConstructionSite = stateGame[currentClient].construction
