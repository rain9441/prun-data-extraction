import { BaseExtractor } from './base-extractor';
import { State } from '../state/';
import '../helpers';

class BuildingExtractor implements BaseExtractor {

    Parse(state: State): any {

        var buildings = Object.keys(state.production.reactorData.data)
            .map(key => state.production.reactorData.data[key])
            .map(building => {
                return {
                    ticker: building.ticker,
                    area: building.areaCost,
                    expertise: building.expertise
                }
            });

        var buildingCosts = Object.keys(state.production.reactorData.data)
            .map(key => state.production.reactorData.data[key])
            .map(building => {
                return building.buildingCosts.map(cost => {
                    return { 
                        key: `${building.ticker}-${cost.material.ticker}`,
                        building: building.ticker,
                        material: cost.material.ticker,
                        amount: cost.amount,
                    };
                })
            }).reduce((obj, x) => obj.concat(x), []);

        var buildingWorkforce = Object.keys(state.production.reactorData.data)
            .map(key => state.production.reactorData.data[key])
            .map(building => {
                return building.workforceCapacities.map(workforce => {
                    return { 
                        key: `${building.ticker}-${workforce.level}`,
                        building: building.ticker,
                        level: workforce.level,
                        capacity: workforce.capacity,
                    };
                })
            }).reduce((obj, x) => obj.concat(x), []);

        var uniqueBuildingInfo = Object.keys(state.production.reactorData.data)
            .map(key => state.production.reactorData.data[key])
            .map(building => {
                return building.recipes.map(recipe => {
                    return { 
                        outputTicker: recipe.outputs[0].material.ticker,
                        building: building.ticker,
                        duration: recipe.duration.millis / 1000,
                        inputs: recipe.inputs,
                        outputs: recipe.outputs,
                        recipeName: 'UNKNOWN',
                    };
                })
            })
            .flatten()
            // Group by output ticker
            .groupBy(x => `${x.building}-${x.outputTicker}`);

        var normalizedRecipeInfo = Object.keys(uniqueBuildingInfo)
            .map(key => uniqueBuildingInfo[key])
            .map(recipeSet => {
                if (recipeSet.length === 1) {
                    recipeSet.forEach((recipe) => {
                        recipe.recipeName = `${recipe.building}-${recipe.outputs[0].material.ticker}`;
                    });
                } else {
                    recipeSet.forEach((recipe, ix) => {
                        recipe.recipeName = `${recipe.building}-${recipe.outputs[0].material.ticker}-${ix+1}`;
                    });
                }

                return recipeSet;
            }).reduce((obj, x) => obj.concat(x), []);

        var buildingRecipes = normalizedRecipeInfo
            .map(recipeInfo => {
                return { 
                    key: recipeInfo.recipeName,
                    building: recipeInfo.building,
                    duration: recipeInfo.duration,
                };
            });

        var recipeInputs = normalizedRecipeInfo
            .map(recipeInfo => {
                return recipeInfo.inputs.map(input => {
                    return { 
                        key: recipeInfo.recipeName,
                        material: input.material.ticker,
                        amount: input.amount,
                    };
                })
            })
            .flatten()

        var recipeOutputs = normalizedRecipeInfo
            .map(recipeInfo => {
                return recipeInfo.outputs.map(output => {
                    return { 
                        key: recipeInfo.recipeName,
                        material: output.material.ticker,
                        amount: output.amount,
                    };
                });
            })
            .flatten();

        var materials = state.materials.categories
            .map(category => {
                return category.materials.map(material => {
                    return {
                        ticker: material.ticker,
                        name: material.name,
                        category: category.name,
                        weight: material.weight,
                        volume: material.volume,
                    };
                })
            })
            .reduce((obj, x) => obj.concat(x), []);

        var moreRecipeData = Object.keys(state.materials.materialData.data)
            .map(key => state.materials.materialData.data[key])
            .map(materialData => {
                return materialData.outputRecipes
                    .filter(outputRecipe => outputRecipe.inputs.length === 0 && outputRecipe.outputs.length > 0)
                    .map(outputRecipe => {
                        var buildingTicker = state.production.reactorData.results[outputRecipe.reactorId];
                        return { buildingTicker, outputRecipe };
                    })
            })
            .reduce((obj, x) => obj.concat(x), []);

        var moreRecipes = moreRecipeData
            .map(recipeData => {
                return recipeData.outputRecipe.outputs.map(output => {
                    return { 
                        key: `${recipeData.buildingTicker}-${recipeData.outputRecipe.outputs[0].material.ticker}`,
                        building: recipeData.buildingTicker,
                        duration: recipeData.outputRecipe.duration.millis / 1000,
                    };
                });
            })
            .reduce((obj, x) => obj.concat(x), []);

        var moreRecipeOutputs = moreRecipeData
            .map(recipeData => {
                return recipeData.outputRecipe.outputs.map(output => {
                    return { 
                        key: `${recipeData.buildingTicker}-${recipeData.outputRecipe.outputs[0].material.ticker}`,
                        material: output.material.ticker,
                        amount: output.amount,
                    };
                });
            })
            .reduce((obj, x) => obj.concat(x), []);

        return {
            dataVersion: 'BUILDINGS-001',
            userInfo: {
                username: state.user.data.username,
                companyId: state.user.data.companyId,
                userId: state.user.data.id,
            },
            buildings,
            buildingCosts,
            buildingWorkforce,
            buildingRecipes: buildingRecipes.concat(moreRecipes),
            recipeInputs,
            recipeOutputs: recipeOutputs.concat(moreRecipeOutputs),
            materials,
        };
    }
}

export { BuildingExtractor }


