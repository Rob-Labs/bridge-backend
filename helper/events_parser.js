const SwapEventParser = (data) => {
  let parsed_log = {};

  const logdata = data.returnValues;

  parsed_log.txhash = data.transactionHash;
  parsed_log.nonce = logdata.nonce;
  parsed_log.from = logdata.from;
  parsed_log.fromChainId = logdata.fromChainId;
  parsed_log.fromToken = logdata.fromToken;
  parsed_log.to = logdata.to;
  parsed_log.toChainId = logdata.toChainId;
  parsed_log.toToken = logdata.toToken;
  parsed_log.amount = logdata.amount;

  return parsed_log;
};

const RedeemEventParser = (data) => {
  let parsed_log = {};

  const logdata = data.returnValues;

  parsed_log.txhash = data.transactionHash;
  parsed_log.txs = logdata.txs;
  parsed_log.token = logdata.token;
  parsed_log.amount = logdata.amount;
  parsed_log.to = logdata.to;
  parsed_log.fromChainId = logdata.fromChainId;

  return parsed_log;
};

module.exports = { SwapEventParser, RedeemEventParser };
