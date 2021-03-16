import { SnippetCore } from '../snippet-core';
import { MarketHistoryExtractor } from '../extractors/market-history-extractor';

(() => {
    var core = new SnippetCore();
    core.Run(MarketHistoryExtractor);
})();


