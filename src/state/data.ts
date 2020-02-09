interface Data {
    items: {
        users: any,
        systems: { [id: string]: System },
        planets: { [id: string]: DataPlanet },
    },
    statuses: any,
    locators: any,
    requests: any,
    subscriptions: any,
}

interface DataPlanet {
    naturalId: string,
    nameable: boolean,
    namer: string,
    data: {
        radiation: number,
        resources: Array<DataPlanetResource>,
        pressure: number,
        orbitIndex: number,
        orbit: any,
        fertility: number,
        sunlight: number,
        surface: boolean,
        gravity: number,
        radius: number,
        plots: Array<any>,
        temperature: number,
        mass: number,
        magneticField: number,
        massEarth: number,
    },
    name: string,
    localRules: any,
    buildOptions: any,
    currency: any,
    governingEntity: any,
    planetId: string,
    address: any,
    namingDate: any,
    governor: any,
    country: any,
    celestialBodies: Array<any>,
    projects: Array<any>,
    id: string,
}

interface DataPlanetResource {
    materialId: string,
    type: string,
    factor: number,
}

interface System {
    naturalId: string,
    nameable: boolean,
    namer: string,
    name: string,
    currency: string,
    star: any,
    address: any,
    connections: Array<string>,
    namingDate: any,
    country: any,
    celestialBodies: Array<any>,
    id: string,
    planets: Array<SystemPlanet>,

}

interface SystemPlanet {
    id: string,
    naturalId: string,
    orbit: any,
    mass: number,
    massEarth: number,
    surface: boolean,
    address: any,
}

export { 
    Data,
    DataPlanet,
    DataPlanetResource,
    System,
    SystemPlanet
}


