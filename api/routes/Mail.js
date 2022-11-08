const express = require('express');
const router = express.Router();
const { User, Mail, Message, Contact } = require('../models');
const {validateTheToken} = require('../middlewares/Authent');
const { Op } = require("sequelize");


router.get('/bidder/:id', validateTheToken, async (req, res) => {

    const myId = req.params.id;

    const inboxMessages = await Mail.findAll({ where: { bidderId: myId,}});

    res.json(inboxMessages);

});

router.get('/seller/:id', validateTheToken, async (req, res) => {

    const myId = req.params.id;

    const allMessages = await Mail.findAll({ 
        where: { sellerId: myId,},
    });

    res.json(allMessages);

});

router.get('/bidder/:id', validateTheToken, async (req, res) => {

    const myId = req.params.id;

    const allMessages = await Mail.findAll({ 
        where: { bidderId: myId,},
    });

    res.json(allMessages);

});

router.get('/newmail/:id', async (req, res) => {

    const myId = req.params.id;
    const newmail = await Message.findOne({ where: {recipientId: myId, read: false}});
    
    if(newmail ===null){
        res.json({
            gotmail: false,
        });
    }
    else{
        res.json({
            gotmail: true,
        });
    }

});

router.get('/newmailcount/:id', async (req, res) => {

    const myId = req.params.id;
    const newmails = await Message.findAll({ where: {recipientId: myId, read: false}});
    
    if(newmails ===null){
        res.json({
            count: 0,
        });
    }
    else{
        res.json({
            count: newmails.length,
        });
    }

});

router.get('/seller/chat/:id', validateTheToken, async (req, res) => {

    const myId = req.params.id;
    const mailId  = req.header("mailId");

    const chat = await Message.findAll({
        where:{
            MailId: mailId
        },
    });
    res.json(chat);

});

router.get('/auctions/:id', validateTheToken, async (req, res) => {

    const myId = req.params.id;
    const bidderId  = req.header("otherId");

    // the chat between them is an AND where the bidder is the recipient
    // and the seller is the reciever OR the opposite
    const mails = await Mail.findAll({
        where:{
            [Op.or]: [
                { [Op.and]: [
                        { sellerId: bidderId },
                        { bidderId: myId }
                    ]
                },
                {[Op.and]: [
                    { sellerId: myId },
                    { bidderId: bidderId }
                    ]
                }
            ]
    }});


    res.json(mails);

});


router.get('/inbox/:id', validateTheToken, async (req, res) => {

    const myId = req.params.id;

    const inboxMessages = await Message.findAll({ where: { recipientId: myId, deletedInbox: false}});

    res.json(inboxMessages);

});


router.get('/outbox/:id', validateTheToken, async (req, res) => {

    const myId = req.params.id;

    const inboxMessages = await Message.findAll({ where: { senderId: myId, deletedOutbox: false }});

    res.json(inboxMessages);

});

router.get('/contacts/:id', validateTheToken, async (req, res) => {

    const myId = req.params.id;

    const contacts = await Contact.findAll({ where: 
            {UserId: myId},
    });

    res.json(contacts);

});

router.post('/confirmpayment/:id', validateTheToken, async (req, res) => {
    
    const mailId = req.params.id;
    const bidderId = req.body.bidderId
    const bidderRating = req.body.bidderRating;

    // Increment bidder's buy count and add their rating
    await User.increment({buyCount: 1}, { where: { id: bidderId } });
    await User.increment({bidderRating: bidderRating}, { where: { id: bidderId } });

    // Update mail that the item has been payed
    await Mail.update({
        payed: true,
        bidderRating: bidderRating,
        },
        {where : { 
            id: mailId
        }
    });

});

router.post('/confirmarrival/:id', validateTheToken, async (req, res) => {
    
    const mailId = req.params.id;
    const sellerId = req.body.sellerId
    const sellerRating = req.body.sellerRating;

    // Increment bidder's buy count and add their rating
    await User.increment({saleCount: 1}, { where: { id: sellerId } });
    await User.increment({sellerRating: sellerRating}, { where: { id: sellerId } });

    // Update mail that the item has been payed
    await Mail.update({
        arrived: true,
        sellerRating: sellerRating,
        },
        {where : { 
            id: mailId
        }
    });

});

router.put('/message/deleteinbox/:id', async (req, res) => {

    const mesId = req.params.id;

    console.log(mesId);

    await Message.update({
        read: true,
        deletedInbox: true,
    },
    {where: {
        id: mesId
    }});

});

router.put('/message/deleteoutbox/:id', async (req, res) => {

    const mesId = req.params.id;

    console.log(mesId);

    await Message.update({
        read: true,
        deletedOutbox: true,
    },
    {where: {
        id: mesId
    }});


});

router.put('/message/read/:id', async (req, res) => {

    const mesId = req.params.id;

    console.log(mesId);

    await Message.update({
        read: true,
    },
    {where: {
        id: mesId
    }});


});

router.post('/message/:id', validateTheToken, async (req, res) => {
    
    const myId = req.params.id;
    const messagio = req.body;
    const userito = await User.findByPk(myId);
    const recipio = await User.findByPk(messagio.recipientId);

    // Create message
    await Message.create({
        title: messagio.title,
        body: messagio.body,
        senderId: myId,
        senderName: userito.name,
        senderSurname: userito.surname,
        recipientName: recipio.name,
        recipientSurname: recipio.surname,
        recipientId: messagio.recipientId,
        MailId: messagio.MailId,
        UserId: myId,
    }).catch(err => {
        console.log(err);
    });

});


module.exports = router;