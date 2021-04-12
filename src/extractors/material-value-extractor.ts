import { BaseExtractor } from './base-extractor';
import { MaterialDataProvider } from './data-providers/material-dp';
import { State, Material } from '../state/';
import '../helpers';

class MaterialValueExtractor implements BaseExtractor {
    private materials: { [materialId: string]: Material };

    Parse(state: State): any {
        this.materials = new MaterialDataProvider(state).Materials;

        var materialsByTicker = Object.keys(this.materials)
            .map(key => this.materials[key])
            .map(material => {
                return {
                    ticker: material.ticker,
                };
            })
            .reduce((obj, material) => Object.assign(obj, { [material.ticker]: material }), {})

        var exchanges = Object.keys(state.comex.exchange.exchanges.data)
            .map(key => state.comex.exchange.exchanges.data[key])
            .map(exchange => {
                return {
                    id: exchange.id,
                    name: exchange.name,
                    code: exchange.code,
                    currency: exchange.currency.code,
                };
            });

        var materialValues = [];
        Object.keys(state.comex.broker.brokers)
            .map(key => state.comex.broker.brokers[key])
            .filter(broker => !!broker.data)
            .forEach(broker => {
                var materialPrice = materialsByTicker[broker.data.material.ticker];

                var mmBuy = broker.data.buyingOrders
                    .filter(order => order.amount === null)
                    .map(order => order.limit.amount)[0] ?? '';
                var mmSell = broker.data.sellingOrders
                    .filter(order => order.amount === null)
                    .map(order => order.limit.amount)[0] ?? '';

                materialValues.push({ ticker: broker.data.material.ticker, cx: broker.data.exchange.code, type: 'mm-buy', value: mmBuy });
                materialValues.push({ ticker: broker.data.material.ticker, cx: broker.data.exchange.code, type: 'mm-sell', value: mmSell });

                var ask = broker.data.ask ? broker.data.ask.price.amount : '';
                var bid = broker.data.bid ? broker.data.bid.price.amount : '';
                var avg = broker.data.priceAverage ? broker.data.priceAverage.amount : '';

                materialValues.push({ ticker: broker.data.material.ticker, cx: broker.data.exchange.code, type: 'ask', value: ask });
                materialValues.push({ ticker: broker.data.material.ticker, cx: broker.data.exchange.code, type: 'bid', value: bid });
                materialValues.push({ ticker: broker.data.material.ticker, cx: broker.data.exchange.code, type: 'avg', value: avg });
            });

        // Batch 500 values at a time
        var materialValuesByBatch = materialValues.groupBy((x, ix) => (Math.floor(ix / 500)).toString());

        return [{
            dataVersion: 'MATERIAL-VALUE-001',
            userInfo: {
                username: state.user.user.data.username,
                companyId: state.user.user.data.companyId,
                userId: state.user.user.data.id,
            },
            exchanges,
        }, ...Object.values(materialValuesByBatch)]
    }
}

export { MaterialValueExtractor }


