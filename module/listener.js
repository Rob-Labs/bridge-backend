const { bootListener } = require("../helper/app");
const { web3, bridge } = bootListener();
const {
  swap_event_name,
  block_check_request,
  block_check_interval,
} = require("../config/app.json");
const { SwapEventParser } = require("../helper/events_parser");
const { InsertBulkSwapData } = require("../helper/queries");
const { AddSwapQueue } = require("../helper/queue");
const { SetLastBlock, GetLastBlock } = require("../helper/last_block_checker");

const main = async () => {
  const lastBlockChecked = GetLastBlock();
  const currentBlockHeight = await web3.eth.getBlockNumber();
  let toBlockChecked = lastBlockChecked + block_check_request;
  if (toBlockChecked > currentBlockHeight) {
    toBlockChecked = currentBlockHeight;
  }

  const swapEvents = await bridge.getPastEvents(swap_event_name, {
    fromBlock: lastBlockChecked,
    toBlock: toBlockChecked,
  });

  let swapEventdata = [];
  for (let i = 0; i < swapEvents.length; i++) {
    swapEventdata.push(SwapEventParser(swapEvents[i]));
  }

  try {
    // add to queue and database
    AddSwapQueue(swapEventdata);
    await InsertBulkSwapData(swapEventdata);
  } catch (error) {
    throw error;
  }
  SetLastBlock(toBlockChecked);
};

main();
setInterval(() => {
  main();
}, block_check_interval * 60 * 1000);
