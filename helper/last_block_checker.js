const fs = require("fs");
const { args } = require("./app");

const isFileExist = (fileName) => {
  return fs.existsSync(fileName);
};

const SetLastBlock = (blocknumber) => {
  const fileName = `${__dirname}/../last_block/${args.network}.txt`;

  fs.writeFileSync(fileName, `${blocknumber + 1}`, (err) => {});
};

const GetLastBlock = () => {
  const filename = `${__dirname}/../last_block/${args.network}.txt`;
  if (!isFileExist(filename)) {
    const { START_BLOCK } = require(`../config/networks/${args.network}`);
    SetLastBlock(START_BLOCK - 1);
    return START_BLOCK;
  }

  return fs.readFileSync(filename).toString();
};

module.exports = { SetLastBlock, GetLastBlock };
