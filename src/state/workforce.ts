import { Addressable } from './addressable';

interface Workforce {
	address: Addressable,
	siteId: string,
	workforces: Array<WorkforcePopulation>,
}

interface WorkforcePopulation {
	level: string,
	population: number,
	capacity: number,
	required: number,
	satisfaction: number,
	needs: Array<any>,
}

export { Workforce, WorkforcePopulation }

