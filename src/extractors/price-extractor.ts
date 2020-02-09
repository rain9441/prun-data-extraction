import { BaseExtractor } from './base-extractor';
import { State } from '../state/';

class PriceExtractor implements BaseExtractor {

    Parse(state: State): any {
        var prices = {};

        return {
            dataVersion: 'PRICES-001',
            userInfo: {
                username: state.user.data.username,
                companyId: state.user.data.companyId,
                userId: state.user.data.id,
            },
            prices,
        };
    }
}

export { PriceExtractor }


