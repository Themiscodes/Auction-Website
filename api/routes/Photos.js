const express = require('express');
const router = express.Router();
const {validateTheToken} = require('../middlewares/Authent');
const { upload } = require('../middlewares/Upload');
const { Photo, Item } = require('../models');
const fs = require('fs');
const path = require("path");

// No token cause this needs to work for guests as well
router.get('/:id', async (req, res) => {

    const itemId = req.params.id;
    const images = await Photo.findAll({ where: { ItemId: itemId,}});

    res.json(images);

});


// No token cause this needs to work for guests as well
router.get('/getcover/:id', async (req, res) => {

    const itemId = req.params.id;

    const coverImage = await Photo.findOne({ where: { ItemId: itemId, coverPhoto: true}});

    res.json(coverImage);

});


// So that the seller selects a cover photo
router.put('/setcover/:id', validateTheToken, async (req, res)=>{

    const myId = req.params.id;
    const itemId = req.body.ItemId;


    const anotherone = await Photo.findOne({ where: {id: myId}});

    await Item.update({
        coverPhoto: anotherone.url,
        },
        {where : {
            id: itemId,
        }
    });

});

router.post('/:id', validateTheToken, upload.single('image'), async (req, res) => {

    const filename = req.params.id;
    const myUrl = `https://localhost:33123/images/${filename}`

    const itemId = parseInt(filename.split('_')[0]);

    const anotherone = await Photo.findOne({ where: {ItemId: itemId}});
    
    if(anotherone ===null){
        // Create new photo entry with cover photo true
        await Item.update({
            coverPhoto: myUrl,
            },
            {where : {
                id: itemId,
            }
        });

    }

    await Photo.create({
        ItemId: itemId,
        url: myUrl,
    }).catch(err => {
        console.log(err);
    });

    res.json({message:"Image uploaded!"})

});


// validate the user too before deleting
router.delete('/:id', validateTheToken, async (req, res)=>{
    const myId = req.params.id;
    const photograph = await Photo.findOne({ where: {id: myId}});
    const itemId = photograph.ItemId;
    const localpath = path.join(__dirname, '..', 'images', photograph.url.split('/').pop())

    await Photo.destroy({where : {
        id: myId,
    }});

    // to remove it asunchronously
    fs.unlink(localpath, function(err){
        if(err){
            console.error(err)
        }
        else {
            console.log("File Removed: ", localpath);
        }
    });

    const newcover = await Photo.findOne({ where: {ItemId: itemId}});

    if ( newcover === null){
        await Item.update({
            coverPhoto: "https://localhost:33123/images/placeholder.png",
            },
            {where : {
                id: itemId,
            }
        });
    }
    else{
        await Item.update({
            coverPhoto: newcover.url,
            },
            {where : {
                id: itemId,
            }
        });
    }
});


module.exports = router;