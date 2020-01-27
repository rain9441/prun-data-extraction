import { ExportEncoder } from './services/export-encoder';
import { ReduxStoreHarness } from './services/redux-store-harness';
import { BaseExtractor } from './extractors/base-extractor';

declare function copy(value: string): void;

class SnippetCore {

	Run(e: {new(): BaseExtractor; }) {
		try {
			var extractor = new e();
			var harness = new ReduxStoreHarness();
			var exportEncoder = new ExportEncoder();

			var store = harness.GetStore();
			var data = extractor.Parse(store);
			var exportedData = exportEncoder.ExportToLog(data);

			console.log("Exported Data (copied to clipboard) ", exportedData);

			copy(exportedData);
		} catch (e) {
			console.error('Exception occurred', e);
		}
	}
}

export { SnippetCore }
