import { BaseExtractor } from './base-extractor';
import { MaterialDataProvider } from './data-providers/material-dp';
import { State, Material } from '../state/';
import '../helpers';

class PlanetExtractor implements BaseExtractor {
    private materials: { [materialId: string]: Material };

    Parse(state: State): any {

        this.materials = new MaterialDataProvider(state).Materials;
                
        var stars = this.parseStars(state);
        var systems = this.parseSystems(state);
        
        var explorationData = stars.map(star => {
            if (!systems[star.systemId]) {
                return {
                    star,
                    unexplored: true,
                }
            } else {
                return {
                    star,
                    planets: systems[star.systemId].planets,
                }
            }
        });

        var starsById = stars.toDictionary(star => star.systemId);
        var edgeData = state.maps.universe.data.edges
            .map(edge => {

                var l = starsById[edge.left.systemId].naturalId;
                var r = starsById[edge.right.systemId].naturalId;

                return { l, r };
            });

        return {
            dataVersion: 'PLANETS-001',
            userInfo: {
                username: state.user.data.username,
                companyId: state.user.data.companyId,
                userId: state.user.data.id,
            },
            systems: explorationData,
            edges: edgeData,
        };
    }

    private parseStars(state: State) {
        var stars = state.maps.universe.data.stars.map(star => {

            var lastLine = star.address.lines[star.address.lines.length-1];
            return {
                systemId: star.systemId,
                type: star.type,
                position: Object.assign({}, star.position),
                sectorId: star.sectorId,
                subSectorId: star.subSectorId,
                naturalId: lastLine.entity.naturalId,
                name: lastLine.entity.name,
            }

        });

        return stars;
    }

    private parseSystems(state: State) {
        var systems = Object.keys(state.data.items.systems || [])
            .map(key => state.data.items.systems[key])
            .map(system => {
                return {
                    id: system.id,
                    naturalId: system.naturalId,
                    name: system.name,
                    planets: system.planets.map(systemPlanet => {
                        var planet = state.data.items.planets[systemPlanet.id];
                        if (planet) {
                            return {
                                id: planet.id,
                                naturalId: planet.naturalId,
                                name: planet.name,
                                celestialBodies: planet.celestialBodies.length,
                                radiation: planet.data.radiation,
                                pressure: planet.data.pressure,
                                orbitIndex: planet.data.orbitIndex,
                                fertility: planet.data.fertility,
                                sunlight: planet.data.sunlight,
                                surface: planet.data.surface,
                                gravity: planet.data.gravity,
                                radius: planet.data.radius,
                                temperature: planet.data.temperature,
                                mass: planet.data.mass,
                                magneticField: planet.data.magneticField,
                                massEarth: planet.data.massEarth,
                                resources: planet.data.resources.map(resource => {
                                    var material = this.materials[resource.materialId];
                                    return {
                                        ticker: material.ticker,
                                        type: resource.type,
                                        factor: resource.factor,
                                    }
                                }),
                            };
                        } else {
                            return {
                                id: systemPlanet.id,
                                naturalId: systemPlanet.naturalId,
                                unexplored: true
                            }
                        }
                    }),
                };
            })
            .toDictionary(system => system.id)

        return systems;

    }
}

export { PlanetExtractor }

