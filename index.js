const fs = require("fs");
const Parse = require("./helper/cli_parser");

const args = Parse(process.argv);
console.log(args);

if (fs.existsSync(`${args.network}.json`)) {
  console.log(`Ada`);
}
