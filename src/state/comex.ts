import { Addressable } from './addressable';
import { Material } from './materials';

interface AmountOfCurrency {
    amount: number,
    currency: string,
}
interface AskOrBid {
    price: { amount: number, currency: string },
    amount: number,
}

interface Broker {
    brokers: { [materialExchangeId: string]: { data: BrokerMaterial, isFetching: boolean } },
    pricesByBrokerId: { [brokerId: string]: BrokerPrice },
}

interface BrokerExchange {
    code: string,
    id: string,
    name: string,
}

interface BrokerMaterial {
    id: string,
    ticker: string,
    exchange: BrokerExchange,
    address: Addressable,
    currency: any,
    material: Material,
    previous: AmountOfCurrency,
    price: AmountOfCurrency,
    priceTime: any,
    high: AmountOfCurrency,
    allTimeHigh: AmountOfCurrency,
    low: AmountOfCurrency,
    allTimeLow: any,
    ask: AskOrBid,
    bid: AskOrBid,
    supply: number,
    demand: number,
    traded: number,
    volume: AmountOfCurrency,
    priceAverage: AmountOfCurrency,
    narrowPriceBand: { low: number, high: number },
    widePriceBand: { low: number, high: number },
    sellingOrders: Array<ComExOrder>,
    buyingOrders: Array<ComExOrder>
}

interface BrokerPrice {
    from: number,
    isFetching: boolean,
    items: Array<BrokerPriceItem>
}

interface BrokerPriceItem {
    date: number,
    open: number,
    close: number,
    volume: number, 
    traded: number,
}

interface ComEx {
    broker: Broker,
    exchange: {
        exchanges: {
            requests: any,
            results: any,
            data: { [id: string]: Exchange },
        },
        brokerLists: any,
    },
    trader: Trader
}

interface ComExOrder {
    id: string,
    trader: any,
    amount: number,
    limit: AmountOfCurrency,
}

interface Exchange {
    id: string,
    name: string,
    code: string,
    operator: any,
    currency: any,
    address: Addressable,
}

interface Order {
    id: string,
    exchange: any,
    brokerId: string,
    type: string,
    material: any,
    amount: number,
    initialAmount: number,
    limit: { amount: number, currency: string },
    status: string,
    created: { timestamp: number },
    trades: Array<any>,

}

interface Trader {
    orders: {
        data: {
            requests: any,
            results: { [id: string]: string },
            data: { [id: string]: Order },
        },
    },
}

export { AmountOfCurrency, Broker, BrokerMaterial, ComEx, ComExOrder, Exchange, Order, Trader }

