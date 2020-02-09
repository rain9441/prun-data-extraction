import { SnippetCore } from '../snippet-core';
import { StorageExtractor } from '../extractors/storage-extractor';

(() => {
    var core = new SnippetCore();
    core.Run(StorageExtractor);
})();


