interface Inventory {
    value: {
        amount: number,
        currency: string,
    },
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

interface StorageStore {
    id: string,
    addressableId: string,
    name: string,
    weightLoad: number,
    weightCapacity: number,
    volumeLoad: number,
    volumeCapacity: number,
    inventory: Array<Inventory>,
    fixed: boolean,
    tradeStore: boolean,
    rank: number,
    type: string,
}

export { StorageStore, Inventory }

