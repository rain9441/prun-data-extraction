import { SnippetCore } from '../snippet-core';
import { BuildingExtractor } from '../extractors/building-extractor';

(() => {
    var core = new SnippetCore();
    core.Run(BuildingExtractor);
})();

