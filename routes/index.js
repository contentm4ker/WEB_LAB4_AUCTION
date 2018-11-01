// @flow
var express = require('express');
var router = express.Router();

var auctionInfo;
if(process.env.NODE_ENV !== 'test') {
    auctionInfo = require('../data/auction_settings');
} else {
    auctionInfo = require('../data/test');
}
var auctTimeSetts = auctionInfo.auctSettings;
var paintings = [];
var auctMembers = [];
for (let key in auctionInfo.paintings) {
    auctionInfo.paintings[key].ind = Number(key);
    paintings.push(auctionInfo.paintings[key]);
}
for (let key in auctionInfo.auctMembers) {
    auctionInfo.auctMembers[key].ind = Number(key);
    auctMembers.push(auctionInfo.auctMembers[key]);
}

router.get('/user', function (req, res) {
    if (Object.keys(req.query).length === 0) {
        res.status(400);
        res.json({message: "Отсутствуют данные пользователя!"});
    } else {
        res.render('index',
            {
                nickname: req.query.name,
                money: req.query.money
            });
    }
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