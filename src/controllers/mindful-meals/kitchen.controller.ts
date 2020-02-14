import { Request, Response, response } from 'express';
import { recipesModel } from '../../models/cookbook.model';
import { Controller, Post, Middleware, Get, Put, Delete } from '@overnightjs/core';
import { JwtInterceptor } from '../../middleware/jwt.interceptor';
import * as crypto from 'crypto';
import { pantryModel } from '../../models/pantry.model';

import { IEdamamRecipes } from '../../models/recipes.interface'
import { KitchenCrawlerService } from './kitchen.crawler.service';

@Controller('api/kitchen')
export class KitchenController {

    @Get('cookbook')
    @Middleware(JwtInterceptor.checkJWTToken)
    public async getAllRecipes(request: Request, response: Response): Promise<Response> {

        const min = request.query.min
        const max = request.query.max

        try {

            const recipes: IEdamamRecipes[] = await recipesModel.find().lean(); //{}, null, { limit: 30 }

            // const count = await recipesModel.count({});

            if (recipes.length) {

                // this.checkIfIngredientsExist(recipes, new KitchenCrawlerService())
                // recipes.splice(min, max)

                const result = recipes.splice(min, max)

                return response.status(200).json({ recipes: result, count: 15 });
            }
            else {
                return response.status(401);
            }

        } catch (error) {
            return response.status(500).json({ error: error });
        }

    }

    @Get('cookbook/search')
    // @Middleware(JwtInterceptor.checkJWTToken)
    public async searchForRecipeByName(request: Request, response: Response): Promise<Response | void> {
        
        const searchTerm = request.query.q
        const limit = parseInt(request.query.limit)
        
        if (!searchTerm || isNaN(limit)) {
            return response.status(400).end()
        }

        const searchExp = new RegExp(searchTerm)

        try {
            const recipes = await recipesModel.find({ label: { $regex: searchExp, $options: 'gi' }}).lean().limit(limit)

            return response.status(200).json(recipes)
        } catch (error) {
            return response.status(500).end()
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
    public async getPantryItemsById(request: Request, response: Response): Promise<Response> {

        const userId: string = request.query.userId;

        if (!userId) {
            return response.status(401).json({ message: "A UserId is needed to get pantry items" })
        }

        try {

            let pantry: any[] = await pantryModel.find({ UserId: userId })

            if (pantry) {

                // const result = await this.checkExpirationStatus(pantry);

                return response.status(200).json(pantry);
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
    public async savePantryItem(request: Request, response: Response): Promise<Response> {

        let pantryItem = request.body.item;

        if (!pantryItem) {
            return response.status(401).json({ message: "We could not find the pantry item you are trying to save" })
        }

        try {

            let pantry = await pantryModel.create(pantryItem);

            if (pantry) {

                return response.status(201).json({ message: "Your pantry item was saved successfully" });
            }
            else {
                return response.status(404).json({ message: "Your pantry item could not be added" });
            }

        } catch (error) {
            return response.status(500).json({ error: error });
        }

    }

    @Put('pantry')
    @Middleware(JwtInterceptor.checkJWTToken)
    public async updatePantryItem(request: Request, response: Response): Promise<Response> {

        let pantryItem = request.body.item;

        if (!pantryItem) {
            return response.status(401).json({ message: "We could not find the pantry item you are trying to update" })
        }

        try {

            let pantry = await pantryModel.updateOne({ _id: pantryItem.id }, pantryItem.changes);

            if (pantry.nModified === 1) {

                return response.status(201).json({ message: "Your pantry item was saved successfully" });
            }
            else {
                return response.status(404).json({ message: "Your pantry item could not be updated" });
            }

        } catch (error) {
            return response.status(500).json({ error: error });
        }

    }

    @Delete('pantry/:id')
    @Middleware(JwtInterceptor.checkJWTToken)
    public async deletePantryItem(request: Request, response: Response): Promise<Response> {

        let pantryItem = request.params.id;

        if (!pantryItem) {
            return response.status(401).json({ message: "We could not find the pantry item you are trying to delete" })
        }

        try {

            let pantry: any = await pantryModel.deleteOne({ _id: pantryItem });

            if (pantry.deletedCount === 1) {

                return response.status(201).json({ message: "Your pantry item was deleted successfully" });
            }
            else {
                return response.status(404).json({ message: "Your pantry item could not be deleted" });
            }

        } catch (error) {
            return response.status(500).json({ error: error });
        }

    }

    @Get('total')
    @Middleware(JwtInterceptor.checkJWTToken)
    private async getNumberOfRecipesInUsersCookbook(request: Request, response: Response): Promise<Response> {
        if (!request.body.id) {
            return response.status(404).json({ message: "An Id is required"})
        }

        try {

            let total = await recipesModel.count({});


            return response.status(200).json({ data: total });

        } catch (error) {

            return response.status(500).json(error);

        }
    }

    private async checkExpirationStatus(pantry: any[]): Promise<any> {

        let now = new Date();

        return await pantry.map( async (item: any) => {

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


    private async checkIfIngredientsExist(recipes: IEdamamRecipes[], crawler: KitchenCrawlerService): Promise<void> {
        try {
            for (let i = 0; i < recipes.length; i++) {
                if (recipes[i].instructions) {
                    continue
                }

                const result = await crawler.crawlUrlForRecipes(recipes[i].url)

            }
        } catch (error) {
            return response.status(500).end()
        }
    }


    private generateId(name: string): string {
        return crypto.createHash('md5').update(name).digest('hex');
    }

}