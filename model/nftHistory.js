const mongoose = require('mongoose');

const nftHistorySchema = mongoose.Schema({
    mediaIpfs: {
        type: String,
        require: true
    },
    mediaType: {
        type: String,
        require: true
    },
    name: {
        type: String
    },
    category: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String,
        require: true
    },
    oldWalletAddress: {
        type: String
    },
    newWalletAddress: {
        type: String
    },
    nftID: {
        type: String
    },
    walletType: {
        type: String,
        require: true
    },
    PriceTrading: {
        type: Number,
        default: 0 
    },
    TradingCompletionTime: {
        type: String
    },
    TxID: {
        type: String
    }

}, { timestamps: true });

//change _id ket to id only
nftHistorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

nftHistorySchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model("nftHistory", nftHistorySchema);