const db = require("./database");
const util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.InsertBulkSwapData = async (data) => {
  if (data.length < 1) {
    return;
  }
  let insert_query = `INSERT IGNORE INTO \`bridge_transaction\` (\`txhash\`,\`nonce\`,\`from\`,\`fromChainId\`,\`fromToken\`,\`to\`,\`toChainId\`,\`toToken\`,\`amount\`,\`is_queued\`) VALUES `;
  for (const [i, v] of data.entries()) {
    if (i === data.length - 1) {
      insert_query = `${insert_query} ('${v.txhash}','${v.nonce}','${v.from}','${v.fromChainId}','${v.fromToken}','${v.to}','${v.toChainId}','${v.toToken}','${v.amount}',1)`;
    } else {
      insert_query = `${insert_query} ('${v.txhash}','${v.nonce}','${v.from}','${v.fromChainId}','${v.fromToken}','${v.to}','${v.toChainId}','${v.toToken}','${v.amount}',1),`;
    }
  }
  try {
    const res = await query(insert_query);
    return res;
  } catch (error) {
    throw error;
  }
};

module.exports.SetRedeemTxHash = async (data) => {
  let update_query = `UPDATE \`bridge_transaction\` SET \`toTxhash\` = ${data.toTxhash} WHERE \`txhash\` = ${data.txhash} AND \`fromChainId\` = ${data.fromChainId}`;

  try {
    const res = await query(update_query);
    return res;
  } catch (error) {
    throw error;
  }
};

module.exports.UpdateJobId = async (data) => {
  let update_query = `UPDATE \`bridge_transaction\` SET \`bull_job_id\` = ${data.bull_job_id} WHERE \`txhash\` = ${data.txhash} AND \`fromChainId\` = ${data.fromChainId}`;

  try {
    const res = await query(update_query);
    return res;
  } catch (error) {
    throw error;
  }
};

module.exports.UpdateJobStatus = async (data) => {
  let update_query = `UPDATE \`bridge_transaction\` SET \`bull_job_status\` = ${data.bull_job_id} WHERE \`txhash\` = ${data.txhash} AND \`fromChainId\` = ${data.fromChainId}`;

  try {
    const res = await query(update_query);
    return res;
  } catch (error) {
    throw error;
  }
};

module.exports.SetFinishRedeem = async (data) => {
  let update_query = `UPDATE \`bridge_transaction\` SET \`is_mined\` = ${data.is_mined} WHERE \`txhash\` = ${data.txhash} AND \`fromChainId\` = ${data.fromChainId}`;

  try {
    const res = await query(update_query);
    return res;
  } catch (error) {
    throw error;
  }
};
