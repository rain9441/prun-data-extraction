import { BaseExtractor } from './base-extractor';
import { State } from '../state/';
import '../helpers';

class TradeExtractor implements BaseExtractor {
    Parse(data: State): any {
        var trades = [{
                dataVersion: 'TRADES-001',
                userInfo: {
                    username: data.user.user.data.username,
                    companyId: data.user.user.data.companyId,
                    userId: data.user.user.data.id,
                },
                trades: this.parseTrades(data),
            },
        ];
        return trades;
    }

    private parseTrades(data: State): any {
        var tradeData = Object.keys(data.comex.trader.orders.data.data)
            .map(key => data.comex.trader.orders.data.data[key])
            .filter(x => x.amount > 0)
            .map(x => {
                return {
                    exchangeCode: x.exchange.code,
                    name: x.exchange.name,
                    type: x.type,
                    ticker: x.material.ticker,
                    amount: x.amount,
                    initialAmount: x.initialAmount,
                    costs: x.limit.amount,
                    currency: x.limit.currency,
                };
            }).sort((a, b) => (a.exchangeCode > b.exchangeCode) ? 1 : -1);

        return tradeData;
    }
}

export { TradeExtractor }
