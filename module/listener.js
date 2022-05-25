const { bootListener, args } = require("../helper/app");
const { web3, bridge } = bootListener();
const {
  swap_event_name,
  block_check_request,
  block_check_interval,
} = require("../config/app.json");
const { SwapEventParser } = require("../helper/events_parser");
const { AddSwapQueue } = require("../helper/queue");
const { SetLastBlock, GetLastBlock } = require("../helper/last_block_checker");
/**
 * DB
 */
require("../models/db");
const { default: mongoose } = require("mongoose");
const Swap = mongoose.model("Swap");
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

  for (let i = 0; i < swapEvents.length; i++) {
    const parsedEvent = SwapEventParser(swapEvents[i]);
    console.log(
      `Incoming SWAP event from ${CURRENT_NETWORK} ${parsedEvent.txhash} `
    );
    /**
     * @TODO Insert to mongodb
     */
    try {
      const res = await Swap.create(parsedEvent);
      if (res) console.log(`success add to db`);
    } catch (error) {
      if (error.message.includes("E11000 duplicate key error")) {
        console.log(`WARN : swap data already recorded`);
      } else {
        console.error(error);
      }
    }

    AddSwapQueue(parsedEvent);
  }

  try {
    // add to queue and database
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
