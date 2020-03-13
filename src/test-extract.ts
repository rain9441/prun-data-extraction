import { BuildingExtractor } from './extractors/building-extractor'
import { StorageExtractor } from './extractors/storage-extractor'
import { TestHarness } from './test-harness'

class TestExtract {
    constructor() {
    }

    async Run() {
        try {
            console.log('Running test on storage extractor');
            var testHarness = new TestHarness();
            testHarness.Run(StorageExtractor);
        } catch (e) {
            console.error('Exception occurred', e);
        }
    }
}

(async (x) => {
    await new TestExtract().Run()
})();

