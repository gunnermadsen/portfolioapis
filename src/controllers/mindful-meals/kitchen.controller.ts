import { Request, Response } from 'express';
import { Recipes } from '../../models/cookbook.model';
import { Controller, Post, ClassMiddleware, Middleware, Get } from '@overnightjs/core';
import { JwtInterceptor } from '../../middleware/jwt.interceptor';
import * as crypto from 'crypto';
import { PantryItems } from '../../models/pantry.model';


const pantryModel = new PantryItems().getModelForClass(PantryItems);
const recipesModel = new Recipes().getModelForClass(Recipes);

@Controller('api/kitchen')
export class CookbookController {

    constructor() { }

    @Get('cookbook')
    @Middleware(JwtInterceptor.checkJWTToken)
    public async getAllRecipes(request: Request, response: Response): Promise<Response> {

        try {

            let recipes = await recipesModel.find({}, null, { limit: 15 } );

            if (recipes) {

                // recipes.map((recipe: any) => {
                //     return recipe.id = this.generateId(recipe.Name);
                // });

                return response.status(200).json({ recipes: recipes });
            }
            else {
                return response.status(401);
            }

        } catch (error) {
            return response.status(500).json({ error: error });
        }

    }

    @Post('cookbook')
    @Middleware(JwtInterceptor.checkJWTToken)
    public async saveRecipe(request: Request, response: Response): Promise<Response> {

        const recipe = { ...request.body.recipe };

        if (!recipe) {
            return response.status(400).json({ message: "A recipe could not be found" })
        }

        try {

            const result = await recipesModel.create(recipe);

            if (result) {
                return response.status(200).json({ message: "Recipe was saved successfully" })
            }

        } catch (error) {

            return response.status(500).json({ error: error })

        }


    }

    @Get('pantry')
    @Middleware(JwtInterceptor.checkJWTToken)
    public async getPantryItemsById(request: Request, response: Response): Promise<any> {

        const userId: string = request.query.userId;

        if (!userId) {
            return response.status(401).json({ message: "A UserId is needed to get pantry items" })
        }

        try {

            let pantry: any[] = await pantryModel.find({ UserId: userId });

            if (pantry) {

                pantry = await this.checkExpirationStatus(pantry);

                return response.status(200).json({ pantry: pantry });
            }
            else {
                return response.status(404).json({ message: "You do not have any pantry items" });
            }

        } catch (error) {
            return response.status(500).json({ error: error });
        }

    }

    @Post('pantry')
    @Middleware(JwtInterceptor.checkJWTToken)
    public async savePantryItem(request: Request, response: Response): Promise<any> {

        let pantryItem = request.body.item;

        if (!pantryItem) {
            return response.status(401).json({ message: "We could not find the pantry item you are trying to save" })
        }

        try {
            pantryItem.CreatedOn = new Date();
            pantryItem.UpdatedOn = new Date();

            let pantry = await pantryModel.create(pantryItem);

            if (pantry) {

                return response.status(200).json({ pantry: pantry });
            }
            else {
                return response.status(404).json({ message: "You do not have any pantry items" });
            }

        } catch (error) {
            return response.status(500).json({ error: error });
        }

    }



    private async checkExpirationStatus(pantry: any[]): Promise<any> {
        let now = new Date();

        return await pantry.map((item: any) => {

            item.id = this.generateId(item.Name);

            if (item.ExpirationDate < now) {
                item.ExpirationStatus = "EXPIRED";

                // artifically set the expiration date ( for testing purpose )
                // item.ExpirationDate = new Date(Date.now() + 3600000);

                pantryModel.findByIdAndUpdate({ _id: item._id }, { ExpirationStatus: "EXPIRED" });
            } 
            else {
                item.ExpirationStatus = "FRESH";
            }
            return item;
        });
    }
    private generateId(name: string): string {
        return crypto.createHash('md5').update(name).digest('hex');
    }

}