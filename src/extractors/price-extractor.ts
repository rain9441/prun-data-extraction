import { BaseExtractor } from './base-extractor';
import { MaterialDataProvider } from './data-providers/material-dp';
import { State, Material } from '../state/';

class PriceExtractor implements BaseExtractor {
    private materials: { [materialId: string]: Material };

    Parse(state: State): any {
        this.materials = new MaterialDataProvider(state).Materials;

        var materialPricesByTicker = Object.keys(this.materials)
            .map(key => this.materials[key])
            .map(material => {
                return {
                    ticker: material.ticker,
                };
            })
            .reduce((obj, materialPrice) => Object.assign(obj, { [materialPrice.ticker]: materialPrice }), {})

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

        Object.keys(state.comex.broker.brokers)
            .map(key => state.comex.broker.brokers[key])
            .filter(broker => !!broker.data)
            .forEach(broker => {
                var materialPrice = materialPricesByTicker[broker.data.material.ticker];

                materialPrice.marketMaker = {
                    buy: broker.data.buyingOrders
                        .filter(order => order.amount === null)
                        .map(order => order.limit.amount)[0],
                    sell: broker.data.sellingOrders
                        .filter(order => order.amount === null)
                        .map(order => order.limit.amount)[0],
                }

                materialPrice[broker.data.exchange.code] = {
                    ask: broker.data.ask ? {
                        amount: broker.data.ask.amount,
                        price: broker.data.ask.price.amount,
                        available: broker.data.sellingOrders
                            .reduce((acc, order) => acc + order.amount ?? 0, 0.0),
                    } : null,
                    bid : broker.data.bid ? {
                        amount: broker.data.bid.amount,
                        price: broker.data.bid.price.amount,
                        available: broker.data.buyingOrders
                            .reduce((acc, order) => acc + order.amount ?? 0, 0.0),
                    } : null,
                    averagePrice: broker.data.priceAverage ? broker.data.priceAverage.amount : null,
                };
            });

        return {
            dataVersion: 'PRICES-001',
            userInfo: {
                username: state.user.data.username,
                companyId: state.user.data.companyId,
                userId: state.user.data.id,
            },
            exchanges,
            materialPrices: Object.values(materialPricesByTicker)
        };
    }
}

export { PriceExtractor }


