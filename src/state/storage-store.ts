interface Inventory {
    quantity: {
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
    },
    id: string,
    type: string,
    weight: number,
    volume: number,
}

interface StorageStore {
    id: string,
    addressableId: string,
    name: string,
    weightLoad: number,
    weightCapacity: number,
    volumeLoad: number,
    volumeCapacity: number,
    items: Array<Inventory>,
    fixed: boolean,
    tradeStore: boolean,
    rank: number,
    locked: boolean,
    type: string,
}

export { StorageStore, Inventory }

