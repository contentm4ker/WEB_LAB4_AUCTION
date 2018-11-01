// @flow

var express = require('express');
var router = express.Router();
var nickname = "";

var auctionInfo;
if(process.env.NODE_ENV !== 'test') {
    auctionInfo = require('../data/auction_settings');
} else {
    auctionInfo = require('../data/test');
}
var auctMembers = [];
for (let key in auctionInfo.auctMembers) {
    auctionInfo.auctMembers[key].ind = Number(key);
    auctMembers.push(auctionInfo.auctMembers[key]);
}


router.get('/', function (req, res) {
    res.render('userauth');
});

router.post('/', function (req, res) {
    let body = req.body;
    nickname = body.nickname;
    let isAuctMember = false;
    for (let i = 0; i < auctMembers.length; i++) {
        if (auctMembers[i].name === nickname) {
            res.status(200);
            res.send({
                message: 'User successfully authorized!',
                nickname: nickname,
                money: auctMembers[i].money
            });
            isAuctMember = true;
            break;
        }
    }
    if (!isAuctMember) {
        res.status(400);
        res.json({message: "Пользователь не зарегистрирован в аукционе!"});
    }
});

module.exports = router;
