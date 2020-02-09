import { BaseExtractor } from './extractors/base-extractor'
import * as fs from 'fs';
import { glob } from 'glob'

class TestHarness {
    constructor() {
    }

    Run(e: {new(): BaseExtractor; }) {

        glob("test-data/**/*.json", {}, (er, dataFiles) => {
            dataFiles
                .map(dataFile => ({ dataFile, obj: JSON.parse(fs.readFileSync(dataFile).toString()) }))
                .forEach(data => {
                    console.log('dataFile', data.dataFile);
                    var extractor = new e(); 
                    var output = extractor.Parse(data.obj);
                    var asJson = JSON.stringify(output, null, 4);

                    if (!fs.existsSync('test-data-output')) {
                        fs.mkdirSync('test-data-output');
                    }

                    var outputFolder = `test-data-output/${extractor.constructor.name}`;
                    if (!fs.existsSync(outputFolder)) {
                        fs.mkdirSync(outputFolder);
                    }
                    var outputFile = data.dataFile.replace(/test-data\/(.*).json/, `${outputFolder}/$1.json`);
                    fs.writeFileSync(outputFile, asJson);
                });
            console.log("Extracting storage stuff");
        });

    }
}

export { TestHarness };
