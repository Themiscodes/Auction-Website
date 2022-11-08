const express = require('express');
const router = express.Router();
const { Bid, Item , User} = require('../models');
const {validateTheToken} = require('../middlewares/Authent');

router.get('/:itemId', async (req, res) => {

    const itemId = req.params.itemId;
    const bids = await Bid.findAll({where : { ItemId: itemId}});
    res.json(bids);

});

router.post('/', validateTheToken, async (req, res) => {

    let bid = req.body;
    const bidder = await User.findByPk(bid.UserId);
    bid.bidderRating = bidder.bidderRating;
    bid.bidderName = bidder.username;

    await Bid.create(bid);

    // and then update the item currently and highest bidder
    await Item.update({
            currently: bid.amount,
            highestBidder: bid.UserId,
        },
        {where : {
            id: bid.ItemId,
        }
    });

    await Item.increment({number_of_bids: 1}, { where: { id: bid.ItemId } });

});


module.exports = router;