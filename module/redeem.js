const { bootRedeem, args } = require("../helper/app");
const { web3, bridge } = bootRedeem();

require("../models/db");
const { default: mongoose } = require("mongoose");
const Swap = mongoose.model("Swap");

const Queue = require("bull");
const RedeemQueue = new Queue("RedeemBackend", process.env.REDIS_URL);

const CURRENT_NETWORK = String(args.network).toUpperCase();
const CONFIG = require(`../config/networks/${args.network}.json`);

const PerformRedeem = async (job, done) => {
  `Processing Job Id : ${job.id} ...`;

  const {
    txhash,
    nonce,
    from,
    fromChainId,
    fromToken,
    to,
    toChainId,
    toToken,
    amount,
  } = job.data.data;

  // update job Id
  await Swap.find({ txhash: txhash, fromChainId: fromChainId }).updateOne({
    bullJobId: job.id,
    proceccedOn: Date.now(),
  });

  const { address: validator } = web3.eth.accounts.wallet[0];
  const tx = bridge.methods.redeem(txhash, toToken, amount, to, fromChainId);

  let gasPrice, gasCost, tempTxHash;

  try {
    [gasPrice, gasCost] = await Promise.all([
      web3.eth.getGasPrice(),
      tx.estimateGas({ from: validator }),
    ]);
  } catch (error) {
    if (error.message.includes("Redeem already processed")) {
      console.log(`WARNING : Redeem already processed`);
      // just pass done, because it's already redeemed
      // and we wan't to requeue job
      done();
    }

    if (error.message.includes("DENIED : Not Validator")) {
      console.log(`ERROR : Check your private key, are you correct validator?`);
      // set bull job to failed
      // we need to requeue job
      done(
        new Error("ERROR : Check your private key, are you correct validator?")
      );
      process.exit(1);
    } else {
      /**
       * @TODO check for posible error
       */
      console.log(error.message);
      done();
    }
  }

  try {
    tx.send({
      from: validator,
      gasPrice: gasPrice,
      gas: gasCost,
    })
      .on("transactionHash", async (hash) => {
        tempTxHash = hash;
        console.log(
          `Sending Redeem Tx ${txhash} to ${CURRENT_NETWORK} blockchain network ${tempTxHash}, waiting for confirmation...`
        );
        await Swap.find({ txhash: txhash, fromChainId: fromChainId }).updateOne(
          {
            toTxHash: hash,
            redeemedOn: Date.now(),
          }
        );
      })
      .on("receipt", async (receipt) => {
        console.log(
          `Redeem Tx ${txhash} has been processed, check this redeem tx ${CONFIG.EXPLORER_URL}tx/${receipt.transactionHash}`
        );
        await Swap.find({ txhash: txhash, fromChainId: fromChainId }).updateOne(
          {
            minedOn: Date.now(),
          }
        );
        done();
      })
      .on("error", function (error, receipt) {
        // @TODO handle tx not mined
        done();
      });
  } catch (error) {
    done();
  }
};
console.log(`Redeem process booted .....`);

const main = async () => {
  console.log(`Processing Redeem Job from Queue....`);
  RedeemQueue.process(CURRENT_NETWORK, PerformRedeem);
};

main();
