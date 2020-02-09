import { SnippetCore } from '../snippet-core';
import { PriceExtractor } from '../extractors/price-extractor';

(() => {
    var core = new SnippetCore();
    core.Run(PriceExtractor);
})();



