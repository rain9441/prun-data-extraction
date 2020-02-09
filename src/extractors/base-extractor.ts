import { State } from '../state/';

interface BaseExtractor {
    Parse(data: State): any;
}

export { BaseExtractor }
