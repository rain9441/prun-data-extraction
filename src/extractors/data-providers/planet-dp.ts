interface Planet {
	id: string,
	type: string,
	naturalId: string,
	name: string
}

class PlanetDataProvider {
	public Planets: { [planetId: string]: Planet };

	constructor(private data) {
		this.Planets = Object.keys(data.planets.planets.data)
			.map(key => data.planets.planets.data[key])
			.map(planet => ({ 
				id: planet.planetId,
				type: 'PLANET',
				naturalId: planet.naturalId,
				name: planet.name,
			}))
			.reduce((obj, planet) => Object.assign(obj, { [planet.id]: planet }), {});
			
	}
}

export { PlanetDataProvider, Planet }
