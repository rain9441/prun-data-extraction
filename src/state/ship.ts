interface Ship {
    id: string,
    idShipStore: string,
    registration: string,
    name: string,
    commissioningTime: { timeStamp: number },
    manufacturer: string,
    address: string,
    flightId: string,
    stlFuelFlowRate: number,
    idStlFuelStore: string,
    idFtlFuelStore: string,
    mass: number,
    operatingEmptyMass: number,
    volume: number,
    acceleration: number,
    reactorPower: number,
    emitterMinPower: number,
    emitterMaxPower: number,
    operatingTimeStl: { millis: number },
    operatingTimeFtl: { millis: number },
}

export { Ship }


