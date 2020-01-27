interface Ship {
	id: string,
	type: string,
	naturalId: string,
	name: string
}

class ShipDataProvider {
	public Ships: { [shipId: string]: Ship };

	constructor(private data) {
		this.Ships = Object.keys(data.fleet.ships.data)
			.map(key => data.fleet.ships.data[key])
			.map(ship => ({ 
				id: ship.id,
				type: 'SHIP',
				naturalId: ship.registration,
				name: ship.name
			}))
			.reduce((obj, ship) => Object.assign(obj, { [ship.id]: ship }), {});
	}
}

export { ShipDataProvider, Ship }

