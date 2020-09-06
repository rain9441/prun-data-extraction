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
                    name: building.name,
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
            })
            .flatten();

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
            })
            .flatten();

        var uniqueBuildingInfo = Object.keys(state.production.reactorData.data)
            .map(key => state.production.reactorData.data[key])
            .map(building => {
                return building.recipes.map(recipe => {
                    return { 
                        outputTicker: recipe.outputs.map(output => output.material.ticker).join('-'),
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
                        recipe.recipeName = `${recipe.building}-${recipe.outputTicker}`;
                    });
                } else {
                    // For output combos that have multiple recipes, we need to get unique string of inputs
                    var recipesGroupedByInputNames = recipeSet.map(recipe => {
                            var inputNames = recipe
                                .inputs
                                .slice()
                                .sort((left, right) => left.material.ticker.toLowerCase().localeCompare(right.material.ticker.toLowerCase()))
                                .map(x => x.material.ticker)
                                .join('-');
                            return { recipe, inputNames };
                        }).groupBy(x => x.inputNames)

                    Object.keys(recipesGroupedByInputNames)
                        .map(key => recipesGroupedByInputNames[key])
                        .map(group => ({ inputNames: group[0].inputNames, recipes: group.map(x => x.recipe)}))
                        .forEach(group => {
                            group
                                .recipes
                                .slice()
                                .sort((left, right) => left.duration - right.duration)
                                .forEach((recipe,ix) => {
                                    if (group.recipes.length === 1) {
                                        recipe.recipeName = `${recipe.building}-${recipe.outputTicker}-${group.inputNames}`;
                                    } else {
                                        recipe.recipeName = `${recipe.building}-${recipe.outputTicker}-${group.inputNames}-${ix+1}`;
                                    }
                                });
                        });

                    //.forEach(group => {
                    //    recipe.recipeName = `${recipe.building}-${recipe.outputTicker}-${inputName}`;
                    //});
                }

                return recipeSet;
            })
            .flatten();

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
            .flatten();

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
            .flatten();

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
            .flatten();

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
            .flatten();

        return {
            dataVersion: 'BUILDINGS-002',
            userInfo: {
                username: state.user.user.data.username,
                companyId: state.user.user.data.companyId,
                userId: state.user.user.data.id,
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


