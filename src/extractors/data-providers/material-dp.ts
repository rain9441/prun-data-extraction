import { State, Material } from '../../state';


class MaterialDataProvider {
    public Materials: { [materialId: string]: Material };

    constructor(private data: State) {
        this.Materials = data.materials.materials
            .reduce((obj, material) => Object.assign(obj, { [material.id]: material }), {});
    }
}

export { MaterialDataProvider, Material }

