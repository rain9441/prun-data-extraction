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
    lines: any,
    all: any,
    bySiteId: any,
    reactorData: {
        requests: any,
        results: any,
        data: { [ticker: string]: Building },
    },
}

export {
    Building,
    BuildingInputOutput,
    BuildingRecipe,
    BuildingWorkforce,
    Production,
}

