import { prop, Typegoose } from 'typegoose';
import { PantryCategories } from './pantry-categories.type';

export class PantryItems extends Typegoose {

    @prop()
    public Name: string;

    @prop()
    public Quantity: number;

    @prop()
    public UserId: string;

    @prop()
    public ExpirationDate: Date;

    @prop()
    public Category: string;

    @prop()
    public ExpirationStatus: string;

    @prop()
    public Calories: number;

    @prop()
    public ServingSize: number;

    @prop()
    public Tags: string[];

    @prop()
    public CreatedOn: Date;
    
    // @prop()
    // public EditedOn: Date;

}