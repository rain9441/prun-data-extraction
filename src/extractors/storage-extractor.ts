import { AddressableDataProvider, Addressable } from './data-providers/addressable-dp'
import { BaseExtractor } from './base-extractor';
import { PlanetDataProvider, Planet } from './data-providers/planet-dp'
import { ShipDataProvider, Ship } from './data-providers/ship-dp'
import { State } from '../state/';

class StorageExtractor implements BaseExtractor {
    private ships: { [shipId: string]: Ship };
    private addresses: { [addressId: string]: Addressable };
    private planets: { [planetId: string]: Planet };

    Parse(data: State): any {

        this.addresses = new AddressableDataProvider(data).Addresses;
        this.planets = new PlanetDataProvider(data).Planets;
        this.ships = new ShipDataProvider(data).Ships;
                
        return {
            dataVersion: 'STORAGE-001',
            userInfo: {
                username: data.user.data.username,
                companyId: data.user.data.companyId,
                userId: data.user.data.id,
            },
            storage: this.parseStorage(data),
            trades: this.parseTrades(data),
            colonies: this.parseColonies(data),
        };
    }

    private parseStorage(data: State): any {
        var storage = Object.keys(data.storage.stores)
            .map(key => data.storage.stores[key])
            .map(x => {
                var name:string = x.name;
                var naturalId:string = null;

                if (x.type.toUpperCase() == "STL_FUEL_STORE" || x.type.toUpperCase() == "FTL_FUEL_STORE" || x.type.toUpperCase() == "SHIP_STORE" ) {
                    if (!!this.ships[x.addressableId]) {
                        name = this.ships[x.addressableId].name;
                        naturalId = this.ships[x.addressableId].naturalId;
                    } 
                } else if (x.type.toUpperCase() == "STORE") {
                    if (!!this.addresses[x.addressableId]) {
                        name = this.addresses[x.addressableId].name;
                        naturalId = this.addresses[x.addressableId].naturalId;
                    } else if (!!this.planets[x.addressableId]) {
                        name = this.planets[x.addressableId].name;
                        naturalId = this.planets[x.addressableId].naturalId;
                    } else {
                        name = "PLANET"
                        naturalId = "UNKNOWN"
                    }
                }

                return {
                    name,
                    naturalId,
                    type: x.type,
                    inventory: x.items
                        .filter(inv => inv.type.toUpperCase() != "BLOCKED" && inv.type.toUpperCase() != "SHIPMENT")
                        .map(inv => ({
                            amount: inv.quantity.amount,
                            ticker: inv.quantity.material.ticker
                        }))
                };
            });
        return storage;
    }

    private parseTrades(data: State): any {
        var tradeData = Object.keys(data.comex.trader.orders.data.data)
            .map(key => data.comex.trader.orders.data.data[key])
            // Only sell orders, not buy orders
            .filter(x => x.type.toUpperCase() == "SELLING")
            .map(x => {
                return {
                    naturalId: `CX.${x.exchange.code}`,
                    name: x.exchange.name,
                    amount: x.amount,
                    ticker: x.material.ticker
                };
            });

        var tradesByNaturalId = tradeData
            .reduce((obj, trade) => Object.assign(obj, { [trade.naturalId]: obj[trade.naturalId] ? [...obj[trade.naturalId], trade] : [trade] }), {});

        var trades = Object.values(tradesByNaturalId)
            .map((x: Array<any>) => {
                return {
                    naturalId: x[0].naturalId,
                    name: x[0].name,
                    type: "CX-SELL",
                    inventory: x.map(inv => ({
                        amount: inv.amount,
                        ticker: inv.ticker
                    }))
                }
            });

        return trades;
    }

    private parseColonies(data: State): any {
        var colonies = Object.keys(data.workforce.workforces.data)
            .map(key => data.workforce.workforces.data[key])
            .map(workforceSite => {
                var address = this.addresses[workforceSite.siteId];
                var workforceByLevel = workforceSite.workforces
                    .reduce((obj, workforce) => Object.assign(obj, { [workforce.level]: workforce }), {});

                var workforceToLocal = (workforce) => {
                    return {
                        population: workforce.population,
                        capacity: workforce.capacity,
                        required: workforce.required,
                        satisfaction: workforce.satisfaction
                    }
                };

                return {
                    naturalId: address.naturalId,
                    name: address.name,
                    pioneers: workforceToLocal(workforceByLevel['PIONEER']),
                    settlers: workforceToLocal(workforceByLevel['SETTLER']),
                    technicians: workforceToLocal(workforceByLevel['TECHNICIAN']),
                    engineers: workforceToLocal(workforceByLevel['ENGINEER']),
                    scientists: workforceToLocal(workforceByLevel['SCIENTIST']),
                }
            });

        return colonies;
    }

}

export { StorageExtractor }
