interface Addressable {
	id: string,
	type: string,
	naturalId: string,
	name: string
}

class AddressableDataProvider {
	public Addresses: { [addressId: string]: Addressable };

	constructor(private data) {
		this.Addresses = Object.keys(data.address.addressable)
			.map(key => ({key, addressable: data.address.addressable[key]}))
			.filter(kvp => !!kvp.addressable)
			.map(kvp => {
				var lastLine = kvp.addressable.lines[kvp.addressable.lines.length - 1];
				return {
					id: kvp.key,
					type: lastLine.type,
					naturalId: lastLine.entity.naturalId,
					name: lastLine.entity.name,
				};
			})
			.reduce((obj, address) => Object.assign(obj, { [address.id]: address }), {});
	}
}

export { AddressableDataProvider, Addressable }
