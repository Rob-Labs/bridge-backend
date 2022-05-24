const { bootListener, args } = require("../helper/app");
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
const CURRENT_NETWORK = String(args.network).toUpperCase();

const main = async () => {
  const lastBlockChecked = GetLastBlock();
  const currentBlockHeight = await web3.eth.getBlockNumber();
  if (Number(lastBlockChecked) > currentBlockHeight) {
    console.log(`Blockheight same with last checked..`);
    return;
  }
  let toBlockChecked = Number(lastBlockChecked) + block_check_request;
  if (toBlockChecked > currentBlockHeight) {
    toBlockChecked = currentBlockHeight;
  }
  console.log(
    `checking swap event from ${lastBlockChecked} to ${toBlockChecked} ..`
  );
  const swapEvents = await bridge.getPastEvents(swap_event_name, {
    fromBlock: lastBlockChecked,
    toBlock: toBlockChecked,
  });

  let swapEventdata = [];
  for (let i = 0; i < swapEvents.length; i++) {
    const parsedEvent = SwapEventParser(swapEvents[i]);
    swapEventdata.push(parsedEvent);
    console.log(
      `Incoming SWAP event from ${CURRENT_NETWORK} ${parsedEvent.txhash} `
    );
  }

  try {
    // add to queue and database
    await InsertBulkSwapData(swapEventdata);
    AddSwapQueue(swapEventdata);
  } catch (error) {
    throw error;
  }

  SetLastBlock(toBlockChecked);
};
console.log(`start listening event on ${CURRENT_NETWORK} chain`);
main();
setInterval(() => {
  main();
}, block_check_interval * 1000);
