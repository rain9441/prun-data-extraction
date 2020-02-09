import { Addressable } from './addressable';
import { Position } from './position';

interface Maps {
    universe: {
        data: {
            isFetching: boolean,
            isFetchingSectors: boolean,
            isFetchingStarData: boolean,
            stars: Array<MapStar>,
            edges: Array<MapEdge>,
            sectors: Array<MapSector>,
        },
        visualization: any,
    },
    systems: {
        highlightedMissions: any,
        contextMenuInformation: any,
        traffic: any,

    },
}

interface MapEdge {
    id: string,
    left: MapEdgePoint,
    right: MapEdgePoint,
}

interface MapEdgePoint {
    systemId: string,
    position: Position,
}

interface MapStar {
    systemId: string,
    address: Addressable,
    name: string,
    type: string,
    position: Position,
    sectorId: string,
    subSectorId: string,
    connections: Array<string>,
}

interface MapSector {
    id: string,
    name: string,
    hex: { q: number, r: number, s: number },
    size: number,
    subsectors: Array<MapSubSector>,
}

interface MapSubSector {
}

export { 
    Maps,
    MapEdge,
    MapEdgePoint,
    MapStar,
    MapSector,
    MapSubSector,
}

