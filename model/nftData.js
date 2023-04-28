const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const nftDataSchema = mongoose.Schema({
    mediaIpfs: {
        type: String,
        require: true
    },
    mediaType: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    mintStatus: {     // minted, forsale, brought
        type: String, 
        require: true
    },
    mintedWalletAddress: {
        type: String,
        require: true
    },
    mintedWalletType: {
        type: String,
        require: true
    },
    minted_at: {
        type: Date,
        default: ()=> new Date().toISOString()
    },
    salePrice: {
        type: Number,
        default: 0 
    },
    buyPrice: {
        type: Number,
        default: 0 
    },
    RegisterationTime: {
        type: String
    },
    buyCompletionTime: {
        type: String
    },
    tokenID: {
        type: String
    }

}, { timestamps: true });

//change _id ket to id only
nftDataSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

nftDataSchema.set('toJSON', {
    virtuals: true,
});
nftDataSchema.plugin(AutoIncrement, {id:'order_seq',inc_field: 'order'})

module.exports = mongoose.model("nftData", nftDataSchema);