import { PriceExtractor } from './extractors/price-extractor'
import { TestHarness } from './test-harness'

class TestExtract {
    constructor() {
    }

    async Run() {
        try {
            console.log('Running test on price extractor');
            var testHarness = new TestHarness();
            testHarness.Run(PriceExtractor);
        } catch (e) {
            console.error('Exception occurred', e);
        }
    }
}

(async (x) => {
    await new TestExtract().Run()
})();

