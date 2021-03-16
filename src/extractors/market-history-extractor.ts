import { AddressableDataProvider, Addressable } from './data-providers/addressable-dp'
import { BaseExtractor } from './base-extractor';
import { PlanetDataProvider, Planet } from './data-providers/planet-dp'
import { ShipDataProvider, Ship } from './data-providers/ship-dp'
import { State, WorkforcePopulation } from '../state/';
import '../helpers';

class MarketHistoryExtractor implements BaseExtractor {
    Parse(data: State): any {
        var brokerData = data.comex.broker.brokers;
        var pricesByBrokerId = data.comex.broker.pricesByBrokerId;

        var brokerPrices = Object.values(brokerData)
            .map(x => {
                return {
                    id: x.data.id,
                    cx: x.data.exchange.code,
                    ticker: x.data.material.ticker,
                    prices: pricesByBrokerId[x.data.id]
                }
            })
            .filter(x => !!x.prices);

        var transactions = brokerPrices
            .map(brokerPrice => 
                brokerPrice.prices.items
                    .map(item => ({
                        group: `${brokerPrice.cx}-${brokerPrice.ticker}`,
                        cx: brokerPrice.cx,
                        ticker: brokerPrice.ticker,
                        from: brokerPrice.prices.from,
                        date: item.date,
                        price: item.close,
                        qty: item.traded,
                    }))
                
            )
            .flatten();
            
        // Batch 500 transactions at a time
        var transactionsByBatch = transactions.groupBy((x, ix) => (Math.floor(ix / 500)).toString());
       
        var batches = Object.values(transactionsByBatch)
            .map(batch => {
                var itemsByTicker = batch.groupBy(x => x.group)
                var groupedItemsByTicker = Object.keys(itemsByTicker)
                    .map(key => {
                        return { 
                            ticker: itemsByTicker[key][0].ticker,
                            cx: itemsByTicker[key][0].cx,
                            items: itemsByTicker[key]
                                .map(item => ({ date: item.date, price: item.price, qty: item.qty }))
                        };
                    })
                return groupedItemsByTicker;
            });

        var cxTickerData = brokerPrices
            .map(brokerPrice => ({
                cx: brokerPrice.cx,
                ticker: brokerPrice.ticker,
                from: brokerPrice.prices.from,
            }))

        return [
            cxTickerData,
            ...batches
        ]
    }
}

export { MarketHistoryExtractor }
