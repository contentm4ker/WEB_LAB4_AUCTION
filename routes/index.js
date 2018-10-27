var express = require('express');
var router = express.Router();

var auctionInfo = require('../data/auction_settings');
var auctTimeSetts = auctionInfo.auctSettings;
var paintings = [];
var auctMembers = [];
for (key in auctionInfo.paintings) {
    auctionInfo.paintings[key].ind = Number(key);
    paintings.push(auctionInfo.paintings[key]);
}
for (key in auctionInfo.auctMembers) {
    auctionInfo.auctMembers[key].ind = Number(key);
    auctMembers.push(auctionInfo.auctMembers[key]);
}

router.get('/user', function (req, res) {
    res.render('index',
        {
            nickname: req.query.name,
            money: req.query.money
        });
});

router.get('/admin', function (req, res) {
    res.render('admin',
        {
            pics: paintings,
            members: auctMembers,
            setts: auctTimeSetts
        });
});

module.exports = router;