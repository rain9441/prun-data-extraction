import { SnippetCore } from '../snippet-core';
import { MaterialValueExtractor } from '../extractors/material-value-extractor';

(() => {
    var core = new SnippetCore();
    core.Run(MaterialValueExtractor);
})();



