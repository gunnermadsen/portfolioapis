export interface ITotalNutrients {
    [key: string]: {
        label: string,
        quantity: number,
        unit: string
    }
}

export interface IDigest {
    label: string;
    tag: string;
    schemaOrgTag: string | null;
    total: number;
    hasRDI: boolean;
    daily: number;
    unit: string;
    sub: ThisType<IDigest>
}

export interface ITemplate extends IDigest {
    digest: IDigest
}

export interface IEdamamRecipes extends IDigest {
    _id?: string;
    label: string;
    url: string;
    source: string;
    dietLabels: string[]; 
    healthLabels: string[];
    cautions: string[];
    ingredientLines: string[];
    ingredients: Ingredients[];
    calories: number;
    totalWeight: number;
    totalNutrients: ITotalNutrients;
    totalDaily: ITotalNutrients;
    instructions?: string[];
    digest: IDigest
    
}

export interface IEdamamRecipesSearchTerms {
    count: number;
    from: 0;
    hits: IEdamamRecipes
    more: boolean;
    params: {
        app_id: string[],
        app_key: string[],
        sane: string[],
        q: string[]
    };
    q: string,
    to: number;
}

export interface Ingredients {
    text: string;
    weight: number;
    hasIngredient?: boolean;
}