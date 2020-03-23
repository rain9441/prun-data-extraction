import { PlanetExtractor } from './extractors/planet-extractor'
import { BuildingExtractor } from './extractors/building-extractor'
import { StorageExtractor } from './extractors/storage-extractor'
import { TestHarness } from './test-harness'

class TestExtract {
    constructor() {
    }

    async Run() {
        var tests = [
            PlanetExtractor,
            BuildingExtractor,
            StorageExtractor,
        ];

        for (var test of tests) {
            try {
                console.log(`Running test on ${test.name}`);
                var testHarness = new TestHarness();
                testHarness.Run(test);
            } catch (e) {
                console.error('Exception occurred', e);
            }
        }
    }
}

(async (x) => {
    await new TestExtract().Run()
})();

