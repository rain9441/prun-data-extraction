import { Addressable, AddressableLine } from './addressable';
import { Broker, ComEx, Exchange, Order, Trader } from './comex';
import { Ship } from './ship';
import { Inventory, StorageStore } from './storage-store';
import { User } from './user';
import { Workforce } from './workforce';

interface State 
{
	contracts: any,
	corportation: any,
	notifications: any,
	auth: any,
	experts: any,
	data: any,
	user: any,
	materials: any,
	localrules: any,
	sites: any,
	fleet: { ships: { requests: any, results: any, data: { [id: string]: Ship } } },
	game: any,
	objects: any,
	comex: ComEx,
	ui: any,
	countries: any,
	address: { query: any, addressable: { [id: string]: Addressable } },
	subscriptions: any,
	maps: any,
	alerts: any,
	chat: any,
	production: any,
	projects: any,
	workforce: {
		workforces: {
			requests: any,
			results: any,
			data: { [workforceId: string]: Workforce },
		},
	},
	finance: any,
	presence: any,
	planets: any,
	storage: { stores: { [id: string]: StorageStore } },
	forex: any,
	company: any,
	actions: any,
	connection: any,
}

export {
	Addressable,
	AddressableLine,
	Broker,
	ComEx,
	Exchange,
	Inventory,
	Order,
	Ship,
	State,
	StorageStore,
	Trader,
	User,
}
