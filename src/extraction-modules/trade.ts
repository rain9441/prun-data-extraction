import { SnippetCore } from '../snippet-core';
import { TradeExtractor } from '../extractors/trade-extractor';

(() => {
    var core = new SnippetCore();
    core.Run(TradeExtractor);
})();


