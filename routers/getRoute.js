const express = require('express');
const route = express.Router();
const nftData = require('../model/nftData');
const nftHistory = require('../model/nftHistory');

route.post('/mintedNFT', async(req, res) => {
    console.log("mintedNFT", req.body)
    var postData = nftData({
        mediaIpfs: req.body.mediaIpfs,
        mediaType: req.body.mediaType,
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        mintStatus: "minted",
        mintedWalletAddress: req.body.walletAddress,
        mintedWalletType: req.body.walletType,
        tokenID: req.body.tokenID
    });

    var finalData = await postData.save();

    var historyData = nftHistory({
        mediaIpfs: req.body.mediaIpfs,
        mediaType: req.body.mediaType,
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        status: "minted",
        newWalletAddress: req.body.walletAddress,
        walletType: req.body.walletType,
        TxID: req.body.txHash,
        nftID: req.body.tokenID
    });

    var finalHistoryData = await historyData.save();

    if (finalData && finalHistoryData) 
        return res.status(200).send(postData);
    return res
        .status(400)
        .send("error");
});

route.post('/getNFTsWithAccount', async(req, res) => {
    console.log("getNFTsWithAccount", req.body)
    let nftListData = await nftData.find({mintedWalletAddress: req.body.walletAddress, mintedWalletType: req.body.walletType})
    let historyData = await nftHistory.find({newWalletAddress: req.body.walletAddress, walletType: req.body.walletType})

    if (nftListData && historyData) 
        return res.status(200).send({
            nftData: nftListData,
            historyData
        });
    return res
        .status(400)
        .send("error");
});

route.post('/getSaleNFTs', async(req, res) => {
    console.log("getSaleNFTs", req.body)
    let saleListData = await nftData.find({mintStatus : "forsale"})

    if (saleListData) 
        return res.status(200).send(saleListData);
    return res
        .status(400)
        .send("error");
});

route.post('/getBoughtHistoryData', async(req, res) => {
    console.log("getBoughtHistoryData", req.body)
    let boughtHistoryData = await nftHistory.find({status : "bought", walletType : req.body.mintedWalletType, nftID : req.body.nftID})

    if (boughtHistoryData) 
        return res.status(200).send(boughtHistoryData);
    return res
        .status(400)
        .send("error");
});

route.post('/saveNFTUpdates', async(req, res) => {
    console.log("saveNFTUpdates", req.body)
    let updateData = await nftData.findByIdAndUpdate(req.body.dbID, {
        name: req.body.name,
        category: req.body.category,
        description: req.body.description
    }, {new: true});

    if (updateData) 
        return res.status(200).send(updateData);
    return res
        .status(400)
        .send("error");
});

route.post('/sellRegisteNFT', async(req, res) => {
    console.log("sellRegisteNFT", req.body)
    let updateData = await nftData.findByIdAndUpdate(req.body.dbID, {
        salePrice: req.body.salePrice,
        mintStatus: "forsale"
    }, {new: true});

    if (updateData) 
        return res.status(200).send(updateData);
    return res
        .status(400)
        .send("error");
});

route.post('/saveBoughtNFT', async(req, res) => {
    console.log("saveBoughtNFT", req.body)
    let currentDate = getCurrentDate();
    let updateData = await nftData.findByIdAndUpdate(req.body.dbID, {
        buyPrice: req.body.salePrice,
        mintStatus: "bought",
        mintedWalletAddress: req.body.newOwner,
        buyCompletionTime : currentDate
    });

    if (updateData) {
        var boughtData = nftHistory({
            mediaIpfs: updateData.mediaIpfs,
            mediaType: updateData.mediaType,
            name: updateData.name,
            category: updateData.category,
            description: updateData.description,
            status: "bought",
            oldWalletAddress: updateData.mintedWalletAddress,
            newWalletAddress: req.body.newOwner,
            walletType: updateData.mintedWalletType,
            TxID: req.body.txHash,
            nftID: updateData.tokenID
        });
    
        var boughtHistoryData = await boughtData.save();

        var soldData = nftHistory({
            mediaIpfs: updateData.mediaIpfs,
            mediaType: updateData.mediaType,
            name: updateData.name,
            category: updateData.category,
            description: updateData.description,
            status: "sold",
            oldWalletAddress: updateData.mintedWalletAddress,
            newWalletAddress: req.body.newOwner,
            walletType: updateData.mintedWalletType,
            TxID: req.body.txHash,
            nftID: updateData.tokenID
        });
    
        var soldHistoryData = await soldData.save();
    
        if (soldHistoryData && boughtHistoryData) 
            return res.status(200).send(boughtHistoryData);
        else return res.status(400).send("error");
    }
    return res
        .status(400)
        .send("error");
});

route.post('/stopSaleNFT', async(req, res) => {
    console.log("stopSaleNFT", req.body)
    let updateData = await nftData.findByIdAndUpdate(req.body.dbID, {
        salePrice: 0,
        mintStatus: "minted"
    }, {new: true});

    if (updateData) 
        return res.status(200).send(updateData);
    return res
        .status(400)
        .send("error");
});

function getCurrentDate() {
    let date_time = new Date();
    // adjust 0 before single digit date
    let date = ("0" + date_time.getDate()).slice(-2);

    // get current month
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);

    // get current year
    let year = date_time.getFullYear();

    // get current hours
    let hours = date_time.getHours();

    // get current minutes
    let minutes = date_time.getMinutes();

    // get current seconds
    let seconds = date_time.getSeconds();

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
}

module.exports = route;