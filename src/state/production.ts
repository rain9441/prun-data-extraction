import { Addressable } from './addressable';
import { Material } from './materials';
import { TimeStamp } from './common';

interface Building {
    id: string,
    name: string,
    ticker: string,
    areaCost: number,
    expertise: string,
    buildingCosts: Array<BuildingInputOutput>,
    workforceCapacities: Array<BuildingWorkforce>,
    recipes: Array<BuildingRecipe>,
}

interface BuildingInputOutput {
    material: {
        name: string,
        id: string,
        ticker: string,
        category: string,
        weight: number,
        volume: number, 
    },
    amount: number,
}

interface BuildingRecipe {
    inputs: Array<BuildingInputOutput>,
    outputs: Array<BuildingInputOutput>,
    duration: { millis: number },
}

interface BuildingWorkforce {
    level: string,
    capacity: number,
}

interface Production {
    lines: {
        requests: any,
        results: any,
        data: { [id: string]: ProductionLine },
    },
    all: any,
    bySiteId: any,
    reactorData: {
        requests: any,
        results: any,
        data: { [ticker: string]: Building },
    },
}

interface ProductionLine {
    id: string,
    siteId: string,
    address: Addressable,
    type: string,
    capacity: number,
    slots: number,
    efficiency: number,
    condition: number,
    workforces: Array<any>,
    orders: Array<ProductionLineOrder>,
    productionTemplates: Array<any>,
    efficiencyFactors: Array<any>,
}

interface ProductionLineInputOutput {
    value: {
        amount: number,
        currency: string,
    },
    material: Material,
    amount: number,

}

interface ProductionLineOrder {
    id: string,
    productionLineId: string,
    inputs: Array<ProductionLineInputOutput>,
    outputs: Array<ProductionLineInputOutput>,
    created: TimeStamp,
    started: TimeStamp,
    completion: TimeStamp,
    duration: TimeStamp,
    lastUpdated: TimeStamp,
    completed: number,
    halted: boolean,
    productionFee: any,
    productionFeeCollector: any,
}

export {
    Building,
    BuildingInputOutput,
    BuildingRecipe,
    BuildingWorkforce,
    Production,
    ProductionLine,
    ProductionLineInputOutput,
    ProductionLineOrder,
}

