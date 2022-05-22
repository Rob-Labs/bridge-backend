const fs = require("fs");
const Web3 = require("web3");
const bridgeABI = require("../abi/Bridge.json");
const Parse = require("./cli_parser");
const args = Parse(process.argv);

const isConfigExist = (filename) => {
  return fs.existsSync(`${__dirname}/../config/networks/${filename}.json`);
};

const checkCliArgsNetwork = () => {
  if (args.network === undefined) {
    console.error(`Please specify network to listen events`);
    process.exit();
  }
  if (!isConfigExist(args.network)) {
    console.error(`Network config not found`);
    process.exit();
  }
};

const checkPrivKeyArgsNetwork = () => {
  if (args.privatekey === undefined) {
    console.error(`Please input private key`);
    process.exit();
  }
};

const checkValidConfigFile = (config) => {
  if (config.RPC_URL == "") {
    console.error(`Config RPC URL is blank`);
    process.exit();
  }
  if (config.BRIDGE_ADDRESS == "") {
    console.error(`Config BRIDGE_ADDRESS is blank`);
    process.exit();
  }
  if (config.NETWORK_NAME == "") {
    console.error(`Config NETWORK NAME is blank`);
    process.exit();
  }
  if (config.EXPLORER_URL == "") {
    console.error(`Config EXPLORER URL is blank`);
    process.exit();
  }
};

const bootListener = () => {
  checkCliArgsNetwork();
  const config = require(`${__dirname}/../config/networks/${args.network}.json`);
  checkValidConfigFile(config);
  const web3 = new Web3(config.RPC_URL);
  const bridge = new web3.eth.Contract(bridgeABI, config.BRIDGE_ADDRESS);

  return { web3, bridge };
};

const bootRedeem = () => {
  checkCliArgsNetwork();
  checkPrivKeyArgsNetwork();
  const config = require(`${__dirname}/../config/networks/${args.network}.json`);
  checkValidConfigFile(config);
  const web3 = new Web3(config.RPC_URL);
  web3.eth.accounts.wallet.add(args.privatekey);
  const bridge = new web3.eth.Contract(bridgeABI, config.BRIDGE_ADDRESS);
  return { web3, bridge };
};

module.exports = { bootListener, bootRedeem, args };
