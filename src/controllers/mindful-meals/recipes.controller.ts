import { Request, Response } from 'express';
import { Recipes } from '../../models/recipes.model';

const RecipesModel = new Recipes().getModelForClass(Recipes);

export class RecipesController {
    constructor() {}

    public static async getAllRecipes(request: Request, response: Response): Promise<any[]> {

        const recipes = await RecipesModel.find();
        return recipes;
    }

    public static async saveRecipe(request: Request, response: Response) {

        const recipe = {
            calories: request.body.calories,
            cautions: request.body.cautions,
            dietLabels: request.body.dietLabels,
            healthLabels: request.body.healthLabels,
            image: request.body.image,
            ingredientLines: request.body.ingredientLines,
            ingredients: request.body.ingredients,
            label: request.body.label,
            shareAs: request.body.shareAs,
            source: request.body.source,
            totalDaily: request.body.totalDaily,
            totalNutrients: request.body.totalNutrients
        };

        return await RecipesModel.create(recipe);
    }

    
}