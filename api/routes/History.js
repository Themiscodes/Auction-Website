const express = require('express');
const router = express.Router();
const { UserData } = require('../models');
const {validateTheToken} = require('../middlewares/Authent');
const path = require("path");

// Post if he clicked on an auction
router.post('/click/:id', validateTheToken, async (req, res) => {

    const myId = req.params.id;
    
    if (req.body && req.body.userId){

        const userId = req.body.userId;
        var userData = await UserData.findOne( { where: { UserId: userId, ItemId: myId } } );

        if (userData){

            // if he hasn't clicked on that before
            if ( userData.rating<2){

                await userData.update({
                    rating: 2,
                    },
                    {where : {
                        id: userData.id,
                    }
                });

            }
        }
        else{

            await UserData.create({
                rating: 2,
                UserId: userId,
                ItemId: myId
            });

        }
    }
    
});

// Post if he bid on an auction
router.post('/bid/:id', validateTheToken, async (req, res) => {

    const myId = req.params.id;

    if (req.body && req.body.userId){
        const userId = req.body.userId;

        var userData = await UserData.findOne( { where: { UserId: userId, ItemId: myId } } );

        if (userData){

            // if he hasn't bid on that before
            if ( userData.rating<5){
                await userData.update({
                    rating: 5,
                    },
                    {where : {
                        id: userData.id,
                    }
                });
            }
        }
        else{

            // this here is for the imported data from the xmls
            await UserData.create({
                rating: 5,
                UserId: userId,
                ItemId: myId
            });
        }
    }
    
});

// This function calls the recommender (to be called every 24 hours)
async function GenerateData(){

    console.log("Generating Recommendations");
    const { spawn } = require('child_process');

    // the path to the recommender
    const locpath = path.join(__dirname, '..', 'recommender', 'recommender.py')
    const pyProg = spawn('python', [locpath]);

    pyProg.stdout.on('data', function(data) {
        console.log(data.toString());
    });

    pyProg.stderr.on('data', (data) => {
        console.log(data.toString());
    });

}

// Call GenerateData every 24 hours
setInterval( GenerateData, 24*60*60*1000);

// This if you need to run it after starting the server
// setTimeout( GenerateData, 20*1000);

module.exports = router;