interface Broker {
	brokers: any,
	pricesByBrokerId: any,
}

interface ComEx {
	broker: Broker,
	exchange: Exchange,
	trader: Trader
}

interface Exchange {
	exchanges: any,
	brokerLists: any,
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

export { Broker, ComEx, Exchange, Order, Trader }

