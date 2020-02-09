import { SnippetCore } from '../snippet-core';
import { PlanetExtractor } from '../extractors/planet-extractor';

(() => {
    var core = new SnippetCore();
    core.Run(PlanetExtractor);
})();



