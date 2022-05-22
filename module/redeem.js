const { bootRedeem, args } = require("../helper/app");
const { web3, bridge } = bootRedeem();
const {
  SetFinishRedeem,
  SetRedeemTxHash,
  UpdateJobId,
  UpdateJobStatus,
} = require("../helper/queries");

const CURRENT_NETWORK = String(args.network).toUpperCase();
const CONFIG = require(`../config/networks/${args.network}.json`);

// @TODO check valid validator first

const PerformRedeem = async (job, done) => {
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
  } = job.data;

  await UpdateJobId({
    txhash: txhash,
    fromChainId: fromChainId,
    bull_job_id: job.id,
  });

  const { address: validator } = web3.eth.accounts.wallet[0];
  const tx = bridge.methods.redeem(txhash, token, amount, to, fromChainId);

  let gasPrice, gasCost, tempTxHash;

  try {
    [gasPrice, gasCost] = await Promise.all([
      web3.eth.getGasPrice(),
      tx.estimateGas({ from: validator }),
    ]);
  } catch (error) {
    // just mark done for job
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
          `Sending Redeem Tx ${data.txhash} to ${CURRENT_NETWORK} blockchain network ${tempTxHash}, waiting for confirmation...`
        );
        await SetRedeemTxHash({
          toTxhash: hash,
          txhash: txhash,
          fromChainId: fromChainId,
        });
      })
      .on("receipt", async (receipt) => {
        console.log(
          `Redeem Tx ${data.txhash} has been processed, check this redeem tx ${CONFIG.EXPLORER_URL}tx/${receipt.transactionHash}`
        );
        await SetFinishRedeem({
          txhash: txhash,
          fromChainId: fromChainId,
        });

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
