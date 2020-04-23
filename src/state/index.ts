import { Addressable, AddressableLine } from './addressable';
import { AmountOfCurrency, Broker, BrokerMaterial, ComEx, ComExOrder, Exchange, Order, Trader } from './comex';
import { Data, DataPlanet, DataPlanetResource, System, SystemPlanet } from './data';
import { Maps, MapEdge, MapEdgePoint, MapStar, MapSector, MapSubSector } from './maps';
import { Material, Materials, MaterialBuildingRecipe, MaterialCategory, MaterialData, MaterialInputOutputRecipe } from './materials';
import { Building, BuildingInputOutput, BuildingRecipe, BuildingWorkforce, Production, ProductionLine, ProductionLineInputOutput, ProductionLineOrder } from './production';
import { Ship } from './ship';
import { Site, Sites } from './sites';
import { Inventory, StorageStore } from './storage-store';
import { User } from './user';
import { Workforce, WorkforcePopulation } from './workforce';

interface State 
{
    contracts: any,
    corportation: any,
    notifications: any,
    auth: any,
    experts: any,
    data: Data,
    user: User,
    materials: Materials,
    localrules: any,
    sites: Sites,
    fleet: { ships: { requests: any, results: any, data: { [id: string]: Ship } } },
    game: any,
    objects: any,
    comex: ComEx,
    ui: any,
    countries: any,
    address: { query: any, addressable: { [id: string]: Addressable } },
    subscriptions: any,
    maps: Maps,
    alerts: any,
    chat: any,
    production: Production,
    projects: any,
    workforce: {
        workforces: {
            requests: any,
            results: any,
            data: { [workforceId: string]: Workforce },
        },
    },
    finance: any,
    presence: any,
    planets: any,
    storage: { stores: { [id: string]: StorageStore } },
    forex: any,
    company: any,
    actions: any,
    connection: any,
}

export {
    AmountOfCurrency,
    Addressable,
    AddressableLine,
    Broker,
    BrokerMaterial,
    Building,
    BuildingInputOutput,
    BuildingRecipe,
    BuildingWorkforce,
    ComEx,
    ComExOrder,
    Data,
    Exchange,
    Inventory,
    Maps,
    MapEdge,
    MapEdgePoint,
    MapStar,
    MapSector,
    MapSubSector,
    Material,
    Materials,
    MaterialCategory,
    Order,
    Production,
    ProductionLine,
    ProductionLineInputOutput,
    ProductionLineOrder,
    Ship,
    State,
    StorageStore,
    System,
    Trader,
    User,
    Workforce,
    WorkforcePopulation,
}
