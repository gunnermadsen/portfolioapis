import { prop, Typegoose, ModelType, InstanceType, instanceMethod } from 'typegoose';

import * as mongoose from 'mongoose';
import * as crypto from 'crypto'
// import { PropertyRead } from '@angular/compiler';
import * as jwt from 'jsonwebtoken';

import * as fs from 'fs';
import { Database } from '../db/db.connection';

const util = require('util');
// const RSA_PRIVATE_KEY = fs.readFileSync(__dirname + '/key/private.key');
// const RSA_PUBLIC_KEY = fs.readFileSync(__dirname + '/key/public.key');

export class Recipes extends Typegoose {
    @prop() calories: any;
    @prop() cautions: any;
    @prop() dietLabels: any;
    @prop() healthLabels: any;
    @prop() image: string;
    @prop() ingredientLines: any;
    @prop() ingredients: any;
    @prop() label: any;
    @prop() shareAs: any;
    @prop() source: any;
    @prop() totalDaily: any;
    @prop() totalNutrients: any;

    @instanceMethod saveRecipe(this: InstanceType<Recipes>, recipe: any) {
        this.calories = recipe.calories;
        this.cautions = recipe.cautions;
        this.dietLabels = recipe.dietLabels;
        this.healthLabels = recipe.healthLabels;
        this.image = recipe.image;
        this.ingredientLines = recipe.ingredientLines;
        this.ingredients = recipe.ingredients,
        this.label = recipe.label;
        this.shareAs = recipe.shareAs;
        this.source = recipe.source;
        this.totalDaily = recipe.totalDaily;
        this.totalNutrients = recipe.totalNutrients;
        return recipe;
    }

    @instanceMethod getRecipes(this: InstanceType<Recipes>) {
        
    }

    @instanceMethod generateSessionToken(this: InstanceType<Recipes>, userId: string) {

    }

    
}

