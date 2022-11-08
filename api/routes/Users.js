const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const {sign} =require('jsonwebtoken');
const { validateTheToken } = require('../middlewares/Authent');
const { Op } = require("sequelize");

router.post('/', async (req, res) => {
    
    const { username , password , name , surname , email , telephone , latitudeLongitude , location , country , taxnumber, sellerRating, saleCount, bidderRating, buyCount } = req.body;

    bcrypt.hash(password, 10).then((hash)=>{
        User.create({
            username: username,
            password: hash,
            name: name,
            surname: surname,
            email: email,
            telephone: telephone,
            latitudeLongitude: latitudeLongitude,
            location: location,
            country: country,
            taxnumber: taxnumber,
            sellerRating: sellerRating,
            saleCount: saleCount,
            bidderRating: bidderRating,
            buyCount: buyCount,
            // this here just for safety
            admin: false,
            approved: false,
        });
        res.json('Successful');
    });

});

router.post('/login', async (req, res) => {
    
    const { username , password } = req.body;

    const user = await User.findOne({ where: {username: username}});

    // if the user is not in the table
    if (!user){
        res.json({error: "User doesn't exist!"});
    }
    else{

        if (user.approved===false){
            res.json({error: "approval"});
        }
        else{

            bcrypt.compare(password, user.password).then((matched)=>{
                if(!matched){
                    res.json({error: "Wrong User Credentials!"});
                }
                else{
                    const accessToken = sign({username: user.username, id: user.id}, "hereputyoursecret");
                    res.json({token: accessToken, username: user.username, id: user.id });
                }
            });

        }

        
    }

});

router.get('/fetchy/:id', async (req, res) => {
    const myId = req.params.id;
    const userito = await User.findByPk(myId);

    // Don't return more information from the seller than is safe
    res.json({ username: userito.username, saleCount: userito.saleCount, sellerRating: userito.sellerRating, name: userito.name, surname: userito.surname, id: userito.id });
});

router.get('/exists/:id', async (req, res) => {

    const myId = req.params.id;
    const usr = await User.findOne({ where: { username: myId } });
    
    if(usr ===null){
        res.json({
            exists: false,
        });
    }
    else{
        res.json({
            exists: true,
        });
    }
    
});

// This is not asynchronous cause it's important for security
router.get('/validate', validateTheToken, (req, res) => {

    res.json({
        username: req.user.username, 
        id: req.user.id, 
        status: true,
    });

});

router.get('/fetchyall/:id', async (req, res) => {
    const myId = req.params.id;
    const userito = await User.findByPk(myId, {
        // Don't return the password from the attributes
        attributes: {exclude: ["password"]},
    });
    if (!userito || userito.username==="admin"){
        res.json({message:"Not allowed"})
    }
    else{
        res.json(userito);
    }
});

router.get('/', validateTheToken, async (req, res) => {

    // make sure that it's the admin
    const username = req.user.username;

    if (username==='admin'){

        // excluding here the admin and the password from the info
        const allUsers = await User.findAll( {where: {
            username: { [Op.ne]: 'admin' }
        },
        attributes: {exclude: ["password"]},
        });
        res.json(allUsers);
    }
});



router.get('/approve', validateTheToken , async (req, res) => {

    // excluding here the admin and the password from the info
    const allUsers = await User.findAll( {where: {
        approved: false,
        username: { [Op.ne]: 'admin' }
    },
    attributes: {exclude: ["password"]},
    });
    res.json(allUsers);
    
});

// User approval by the admin after validating the token
router.put('/approve', validateTheToken, async (req, res) => {
    
    const userList = req.body;
    const username = req.user.username;

    if (username==='admin'){
        for (var i = 0; i < userList.length; i++) {
            var userId = userList[i];
            console.log(userId);
            await User.update({
                approved: true
                },
                {where : { 
                    id: userId
                }
            });
        }
        res.json("Succesfully approved users!");
    }
    else{
        res.json("This is forbidden!")
    }
    
});


module.exports = router;