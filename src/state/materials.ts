import { BuildingInputOutput } from './production';

interface Materials {
    materials: Array<Material>,
    materialData: {
        requests: any,
        results: any,
        data: { [ticker: string]: MaterialData },
    },
    categories: Array<MaterialCategory>,
}

interface Material {
    name: string,
    id: string,
    ticker: string,
    category: string,
    weight: number,
    volume: number,
}

interface MaterialBuildingRecipe {
    buildingCosts: Array<BuildingInputOutput>,
    reactorId: string,
}

interface MaterialCategory {
    children: Array<any>,
    name: string,
    id: string,
    materials: Array<Material>,
}

interface MaterialData {
    material: Material,
    isResource: boolean,
    resourceType: any,
    inputRecipes: Array<MaterialInputOutputRecipe>,
    outputRecipes: Array<MaterialInputOutputRecipe>,
    buildingRecipes: Array<MaterialBuildingRecipe>,
}

interface MaterialInputOutputRecipe {
    inputs: Array<BuildingInputOutput>,
    outputs: Array<BuildingInputOutput>,
    duration: { millis: number },
    reactorId: string,
}

export {
    Material,
    Materials,
    MaterialBuildingRecipe,
    MaterialCategory,
    MaterialData,
    MaterialInputOutputRecipe,
}
