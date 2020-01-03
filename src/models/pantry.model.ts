import { prop, getModelForClass } from '@typegoose/typegoose';

export class PantryItems {

    @prop()
    public Name: String;

    @prop()
    public Quantity: Number;

    @prop()
    public UserId: String;

    @prop()
    public ExpirationDate: Date;

    @prop()
    public Category: String;

    @prop()
    public ExpirationStatus: String;

    @prop()
    public Calories: Number;

    @prop()
    public ServingSize: Number;

    @prop()
    public Tags: String[];

    @prop()
    public CreatedOn: Date;

    @prop()
    public IsDeleted: Boolean;
    
    @prop()
    public UpdatedOn: Date;

}

export const pantryModel = getModelForClass(PantryItems);
