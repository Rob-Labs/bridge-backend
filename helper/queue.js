const network_name = require("../config/network_name.json");
const Queue = require("bull");
const RedeemQueue = new Queue("RedeemBackend", process.env.REDIS_URL);

const AddSwapQueue = (jobData) => {
  RedeemQueue.add(network_name[jobData.toChainId], {
    data: jobData,
  });
};

module.exports = { AddSwapQueue };
