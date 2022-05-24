const { bootRedeem, args } = require("../helper/app");
const { web3, bridge } = bootRedeem();
const {
  SetFinishRedeem,
  SetRedeemTxHash,
  UpdateJobId,
  UpdateJobStatus,
} = require("../helper/queries");
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

  await UpdateJobId({
    txhash: txhash,
    fromChainId: fromChainId,
    bull_job_id: job.id,
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
    // just mark done for job
    // and we will requeue again if needed
    done();
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
        await SetRedeemTxHash({
          toTxhash: hash,
          txhash: txhash,
          fromChainId: fromChainId,
        });
      })
      .on("receipt", async (receipt) => {
        await SetFinishRedeem({
          txhash: txhash,
          fromChainId: fromChainId,
        });
        console.log(
          `Redeem Tx ${txhash} has been processed, check this redeem tx ${CONFIG.EXPLORER_URL}tx/${receipt.transactionHash}`
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
  console.log(`checking given privatekey ..`);

  const bridgeValidator = await bridge.methods.validator().call();
  const { address: validator } = web3.eth.accounts.wallet[0];

  if (bridgeValidator != validator) {
    console.error(`VALIDATOR NOT MATCH : Check Your Private Key`);
    process.exit();
  }
  console.log(`Processing Redeem Job from Queue....`);
  RedeemQueue.process(CURRENT_NETWORK, PerformRedeem);
};

main();
