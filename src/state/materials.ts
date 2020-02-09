interface Materials {
    materials: Array<Material>,
    materialData: any,
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

interface MaterialCategory {
    children: Array<any>,
    name: string,
    id: string,
    materials: Array<Material>,
}

export {
    Material,
    Materials,
    MaterialCategory,
}
