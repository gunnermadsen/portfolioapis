import { prop, getModelForClass } from '@typegoose/typegoose';

export class Recipes {
    @prop() 
    public calories: any;
    
    @prop() 
    public cautions: any;
    
    @prop() 
    public dietLabels: any;
    
    @prop() 
    public healthLabels: any;
    
    @prop() 
    public image: string;
    
    @prop() 
    public ingredientLines: any;
    
    @prop() 
    public ingredients: any;
    
    @prop() 
    public label: any;
    
    @prop() 
    public shareAs: any;
    
    @prop() 
    public source: any;
    
    @prop() 
    public totalDaily: any;
    
    @prop() 
    public totalNutrients: any;

}

export const recipesModel = getModelForClass(Recipes);
