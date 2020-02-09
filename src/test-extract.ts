import { BuildingExtractor } from './extractors/building-extractor'
import { TestHarness } from './test-harness'

class TestExtract {
    constructor() {
    }

    async Run() {
        try {
            console.log('Running test on building extractor');
            var testHarness = new TestHarness();
            testHarness.Run(BuildingExtractor);
        } catch (e) {
            console.error('Exception occurred', e);
        }
    }
}

(async (x) => {
    await new TestExtract().Run()
})();

