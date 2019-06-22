import * as express from 'express';
import { Request, Response } from 'express';
import { RecipesController } from '../controllers/mindful-meals/recipes.controller';

// const recipeCtrl = require('../controllers/mindful-meals/recipe.controller');
// const pantryCtrl = require('../controllers/mindful-meals/pantry.controller');
// const basketCtrl = require('../controllers/mindful-meals/basket.controller');

const router = express.Router();

// endpoint for testing
router.get('/', function (req: Request, res: Response, next: any) {
    res.status(200).json({ "message": "HTTP Status Code 200: Operation successful" });
});

router.post('/', function (req: Request, res: Response, next: any) {
    res.status(200).json(req.body);
});

router.get('/recipes', (request: Request, response: Response) => {
    RecipesController
        .getAllRecipes(request, response)
        .then((recipes: any) => {
            return response.status(200).json(recipes)
        })
        .catch((error: any) => {
            return response.status(500).json(error);
        })
});

router.post('/recipes', (request: Request, response: Response) => {
    RecipesController
        .saveRecipe(request, response)
        .then((recipes: any) => {
            return response.status(200).json(recipes)
        })
        .catch((error: any) => {
            return response.status(500).json(error);
        });
});
// router.delete('/recipes/:id', recipeCtrl.deleteRecipe);

// router.get('/basket', basketCtrl.getBasket);
// router.post('/basket', basketCtrl.saveBasket);

// router.get('/pantry', pantryCtrl.getPantry);
// router.put('/pantry/:itemid', pantryCtrl.updatePantryItem);
// router.post('/pantry', pantryCtrl.savePantryItem);

//router.get('/timezones', timezoneCtrl.setId);

module.exports = router;