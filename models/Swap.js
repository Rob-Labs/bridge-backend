const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema({
  txhash: String,
  nonce: Number,
  from: String,
  fromChainId: Number,
  fromToken: String,
  to: String,
  toChainId: Number,
  toToken: String,
  amount: String,
  toTxHash: String,
  bullJobId: Number,
  swappedOn: Date,
  listenedOn: {
    type: Date,
    default: Date.now,
  },
  proceccedOn: Date,
  redeemedOn: Date,
  minedOn: Date,
});
swapSchema.index({ fromChainId: 1, txhash: 1 }, { unique: true });

module.exports = mongoose.model("Swap", swapSchema);
