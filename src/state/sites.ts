import { Addressable } from './addressable';
import { Material } from './materials';
import { TimeStamp } from './common';

interface Platform {
    siteId: string,
    id: string,
    module: PlatformModule,
    area: number,
    creationTime: TimeStamp,
    reclaimableMaterials: Array<ReclaimableMaterial>,
    bookValue: {
        amount: number,
        currency: string,
    },
    condition: number,
}

interface PlatformModule {
    id: string,
    platformId: string,
    reactorId: string,
    reactorName: string,
    reactorTicker: string,
    type: string,
}

interface ReclaimableMaterial {
    material: Material,
    amount: number,
}

interface Site {
    siteId: string,
    address: Addressable,
    platforms: Array<Platform>,
    buildOptions: {
        options: Array<any>,
    },
    area: number,
}

interface Sites {
    sites: {
        index: {
            requests: any,
            results: any,
            data: { [id: string]: Site },
        },
        fetchedAll: boolean,
        fetchingAll: boolean,
    },
    byAddress: { 
        [id: string]: {
            isLoading: boolean,
            id: string,
        }
    },
    sections: { [id: string]: Array<Platform> },
}

export { Platform, PlatformModule, ReclaimableMaterial, Site, Sites }

