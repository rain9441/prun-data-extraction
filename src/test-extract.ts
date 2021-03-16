import { BuildingExtractor } from './extractors/building-extractor'
import { MarketHistoryExtractor } from './extractors/market-history-extractor'
import { PlanetExtractor } from './extractors/planet-extractor'
import { PriceExtractor } from './extractors/price-extractor'
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
            PriceExtractor,
            MarketHistoryExtractor
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

