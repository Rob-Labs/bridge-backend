const network_name = require("../config/network_name.json");
const Queue = require("bull");
const RedeemQueue = new Queue("RedeemBackend", process.env.REDIS_URL);

const AddSwapQueue = (jobData) => {
  if (jobData.length < 1) {
    return;
  }
  for (let i = 0; i < jobData.length; i++) {
    RedeemQueue.add(network_name[jobData[i].toChainId], {
      data: jobData[i],
    });
  }
  return;
};

module.exports = { AddSwapQueue };
