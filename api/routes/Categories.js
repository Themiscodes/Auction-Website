const express = require('express');
const router = express.Router();
const { Category  } = require('../models');
const {validateTheToken} = require('../middlewares/Authent');

router.get('/', async (req, res) => {

    const categories = await Category.findAll();
    res.json(categories);

});

router.post('/', validateTheToken, async (req, res) => {

    const cat = req.body;
    await Category.create(cat);

});

// Recursively find the hierarchy tree, ie all the parents till the root
function myParents(categoriesList, childId){

    var categs = [];
    for (var i=0; i<categoriesList.length;i++){
        if (categoriesList[i].id==childId){
            
            const childCategory = categoriesList[i];
            categs.push(childCategory.name);

            for (var j=0; j<categoriesList.length;j++){
                if (categoriesList[j].id==childCategory.CategoryId){
                    categs.push.apply(categs, myParents(categoriesList, categoriesList[j].id))
                }
            }

        }
    }

    return categs;
}

router.get('/:id', async (req, res) => {

    const furthermostCategoryId = req.params.id;
    const allCategories = await Category.findAll();
    var categories = [];

    categories.push.apply(categories, myParents(allCategories, furthermostCategoryId))

    // Reverse so its from the general to the specific
    var categoriesInorder = categories.reverse()

    res.json(categoriesInorder);
});

module.exports = router;