interface Addressable {
	lines: Array<AddressableLine>,
}

interface AddressableLine {
	entity: {
		id: string,
		naturalId: string,
		name: string,
		_type: string,
		_proxy_key: string,
	},
	type: string,
}

export { Addressable, AddressableLine }
