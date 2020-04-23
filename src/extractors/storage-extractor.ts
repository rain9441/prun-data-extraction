import { AddressableDataProvider, Addressable } from './data-providers/addressable-dp'
import { BaseExtractor } from './base-extractor';
import { PlanetDataProvider, Planet } from './data-providers/planet-dp'
import { ShipDataProvider, Ship } from './data-providers/ship-dp'
import { State, WorkforcePopulation } from '../state/';
import '../helpers';

class StorageExtractor implements BaseExtractor {
    private ships: { [shipId: string]: Ship };
    private addresses: { [addressId: string]: Addressable };
    private planets: { [planetId: string]: Planet };

    Parse(data: State): any {

        this.addresses = new AddressableDataProvider(data).Addresses;
        this.planets = new PlanetDataProvider(data).Planets;
        this.ships = new ShipDataProvider(data).Ships;
                
        var colonies = this.parseColonies(data)
            .map(colony => {
                return {
                    dataVersion: 'STORAGE-003-COLONY',
                    userInfo: {
                        username: data.user.user.data.username,
                        companyId: data.user.user.data.companyId,
                        userId: data.user.user.data.id,
                    },
                    colony,
                };
            });

        var tradesAndColonies = [{
                dataVersion: 'STORAGE-003-TRADES',
                userInfo: {
                    username: data.user.user.data.username,
                    companyId: data.user.user.data.companyId,
                    userId: data.user.user.data.id,
                },
                liquid: this.parseLiquid(data),
                trades: this.parseTrades(data),
                ships: this.parseNonColonyStorage(data),
            },
            ...colonies,
        ];

        while (tradesAndColonies.length < 30) {
            tradesAndColonies.push({});
        }
        return tradesAndColonies;
    }

    private parseLiquid(data: State): any {
        var cxBuys = Object.keys(data.comex.trader.orders.data.data)
            .map(key => data.comex.trader.orders.data.data[key])
            // Only sell orders, not buy orders
            .filter(x => x.type.toUpperCase() == "BUYING")
            .map(x => {
                return {
                    naturalId: `CX.${x.exchange.code}`,
                    name: x.exchange.name,
                    bid: {
                        quantity: x.amount,
                        amount: x.limit.amount,
                    },
                    currency: x.limit.currency,
                    amount: x.amount * x.limit.amount,
                    ticker: x.material.ticker,
                };
            });

        var currency = Object.keys(data.finance.cash.balances)
            .map(key => data.finance.cash.balances[key])
            .filter(balance => balance.amount > 0)
            .map(balance => {
                return {
                    naturalId: `WALLET.${balance.currency}`,
                    amount: balance.amount,
                    currency: balance.currency,
                };
            });
        return {
            cxBuys,
            currency
        };
    }

    private parseNonColonyStorage(data: State): any {
        var nonColonyStorage = Object.keys(data.storage.stores)
            .map(key => data.storage.stores[key])
            .filter(x => x.type.toUpperCase() == "STL_FUEL_STORE" || x.type.toUpperCase() == "FTL_FUEL_STORE" || x.type.toUpperCase() == "SHIP_STORE")
            .map(x => {
                var name:string = x.name;
                var naturalId:string = null;

                if (!!this.ships[x.addressableId]) {
                    name = this.ships[x.addressableId].name;
                    naturalId = this.ships[x.addressableId].naturalId;
                } 

                return {
                    name,
                    naturalId,
                    type: x.type,
                    inventory: x.items
                        .filter(inv => inv.type.toUpperCase() != "BLOCKED" && inv.type.toUpperCase() != "SHIPMENT")
                        .map(inv => ([
                            inv.quantity.material.ticker,
                            inv.quantity.amount,
                        ]))
                };
            });

        return nonColonyStorage;
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
                    inventory: x.map(inv => ([
                        inv.ticker,
                        inv.amount,
                    ]))
                }
            });

        return trades;
    }

    private parseColonies(data: State): any {
        var sitesAndAddresses = Object.keys(data.sites.sites.index.data)
            .map(key => data.sites.sites.index.data[key])
            .map(site => {
                var address = this.addresses[site.siteId];
                return {
                    siteId: site.siteId,
                    address,
                };
            });

        var storageBySiteId = Object.keys(data.storage.stores)
            .map(key => data.storage.stores[key])
            .filter(x => x.type.toUpperCase() == "STORE")
            .map(x => {
                var name:string = x.name;
                var naturalId:string = null;

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

                return {
                    siteId: x.addressableId,
                    inventory: x.items
                        .filter(inv => inv.type.toUpperCase() != "BLOCKED" && inv.type.toUpperCase() != "SHIPMENT")
                        .map(inv => ([
                            inv.quantity.material.ticker,
                            inv.quantity.amount,
                        ]))
                };
            })
            .toDictionary(x => x.siteId);

        var workforcesBySiteId = Object.keys(data.workforce.workforces.data)
            .map(key => data.workforce.workforces.data[key])
            .map(workforceSite => {
                var workforceByLevel = workforceSite.workforces
                    .toDictionary(x => x.level);

                var workforceToLocal = (workforce: WorkforcePopulation) => {
                    // minimize the JSON foot print to reduce size of output
                    return {
                        p: workforce.population,
                        c: workforce.capacity,
                        r: workforce.required,
                        s: workforce.satisfaction
                    };
                };

                return {
                    siteId: workforceSite.siteId,
                    pioneers: workforceToLocal(workforceByLevel['PIONEER']),
                    settlers: workforceToLocal(workforceByLevel['SETTLER']),
                    technicians: workforceToLocal(workforceByLevel['TECHNICIAN']),
                    engineers: workforceToLocal(workforceByLevel['ENGINEER']),
                    scientists: workforceToLocal(workforceByLevel['SCIENTIST']),
                };
            })
            .toDictionary(x => x.siteId);

        var buildingsBySiteId = Object.keys(data.sites.sections)
            .map(key => ({ siteId: key, platforms: data.sites.sections[key] }))
            .map(({ siteId, platforms }) => {
                return {
                    siteId,
                    buildings: platforms.map(platform => {
                        return {
                            id: `${platform.module.reactorTicker}-${platform.id.toUpperCase().substring(0,8)}`,
                            ticker: platform.module.reactorTicker,
                            created: platform.creationTime.timestamp,
                            reclaimables: platform.reclaimableMaterials.map(reclaimableMaterial => {
                                return [
                                    reclaimableMaterial.material.ticker,
                                    reclaimableMaterial.amount,
                                ];
                            }),
                            condition: platform.condition,
                        };
                    }),
                };
            })
            .toDictionary(x => x.siteId);

        var productionLinesBySiteId = Object.keys(data.production.lines.data)
            .map(key => data.production.lines.data[key])
            .groupBy(x => x.siteId);

        var productionQueuesBySiteId = Object.keys(productionLinesBySiteId)
            .map(key => ({ siteId: key, productionLines: productionLinesBySiteId[key] }))
            .map(({ siteId, productionLines }) => {
                var address = this.addresses[siteId];

                return {
                    siteId,
                    productionLines: productionLines.map(productionLine => {
                        return {
                            type: productionLine.type,
                            orders: productionLine.orders.map(order => {
                                return {
                                    id: `${address.naturalId}-${productionLine.type}-${order.id.toUpperCase().substring(0,8)}`,
                                    completed: order.completed,
                                    remaining: order.completion ? (order.completion.timestamp - order.lastUpdated.timestamp) : null,
                                    inputs: (order.inputs || []).map(io => {
                                        return [
                                            io.material.ticker,
                                            io.amount,
                                        ];
                                    }),
                                    outputs: order.outputs.map(io => {
                                        return [
                                            io.material.ticker,
                                            io.amount,
                                        ];
                                    }),
                                };
                            }),
                        };
                    }),
                };
            })
            .toDictionary(x => x.siteId);

        var colonies = sitesAndAddresses.map(({ siteId, address }) => {
            var workforces = workforcesBySiteId[siteId];
            var buildings = buildingsBySiteId[siteId];
            var productionQueue = productionQueuesBySiteId[siteId];
            var storage = storageBySiteId[siteId];

            return {
                naturalId: address.naturalId,
                name: address.name,
                workforces: {
                    p: workforces.pioneers,
                    s: workforces.settlers,
                    t: workforces.technicians,
                    e: workforces.engineers,
                    c: workforces.scientists,
                },
                storage: storage.inventory,
                buildings: buildings.buildings,
                productionLines: productionQueue ? productionQueue.productionLines : [],
            }
        });

        return colonies;
    }
}

export { StorageExtractor }
