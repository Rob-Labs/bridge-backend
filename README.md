# BRIDGE BACKEND

## INSTALLATION

### Requirements

before using **BRIDGE BACKEND** application, make sure on your server or your pc have this application intalled :

- NodeJS
- Redis
- Mongodb
- Yarn or NPM
- PM2

### Install Dependencies

To install dependencies just type `yarn install` if using yarn, or `npm install` if using NPM on your terminal

## CONFIG FILE

### Environtment Configuration

Make `.env` file on root folder, you can see example on `env.example.txt`

```env
## REDIS

REDIS_URL = "redis:/127.0.0.1:6379"

## MONGODB
MONGODB_URL="mongodb://127.0.0.1/yourdatabase"
```

### Networks Configuration

Folder `config/networks` stands for bridge network configuration, you can see an example config file at `config/networks/example.json`

- config `START_BLOCK` **MUST** be `integer`
- config file name **MUST** be `lowercase`
- config file name **MUST** be also exist on `config/network_name.json`

```json
{
  "NETWORK_NAME": "Name of network",
  "BRIDGE_ADDRESS": "your bridge address",
  "RPC_URL": "JSON RPC url of network",
  "EXPLORER_URL": "address network blockchain explorer",
  "START_BLOCK": "block number bridge genesis (deployed)"
}
```

### App Configuration

- `swap_event_name` is name of swap event in bridge contract
- `redeem_event_name` is name of redeem event in bridge contract
- `block_check_request` number of block per request
- `block_check_interval` pooling interval swap check events in **seconds**

```json
{
  "swap_event_name": "LogSwap",
  "redeem_event_name": "LogRedeem",
  "block_check_request": 1000,
  "block_check_interval": 30
}
```

## RUNNING APPLICATION

### Running Listener

Listener is program to handle swap events then save to database and make redeem job, to run listener script in production mode you need PM2 to ensure listener script is running forever, and auto restart when it closed

- in production `pm2 start module/listener.js --network=network_your_want_to_listen` example if you want to listen on ropsten network just type `pm2 start module/listener.js --network=ropsten`
- in development or test `node start module/listener.js --network=network_your_want_to_listen` example if you want to listen on ropsten network just type `node start module/listener.js --network=ropsten`

### Running Redeem

Redeem is program to execute redeem process on other chain, to run redeem script in production mode you need PM2 to ensure redeem script is running forever, and auto restart when it closed

- in production `pm2 start module/redeem.js --network=network_your_want_to_redeem --privatekey=your_validator_privatekey` example if you want to redeem on ropsten network just type `pm2 start module/redeem.js --network=ropsten --privatekey=your_validator_privatekey`
- in development or test `node start module/redeem.js --network=network_your_want_to_redeem --privatekey=your_validator_privatekey` example if you want to redeem on ropsten network just type `node start module/redeem.js --network=ropsten --privatekey=your_validator_privatekey`

## ADVANCED NOTE

If you prefer running application by `npm script` you can add script to `package.json` file:

```json
{
  "listen": "node module/listener.js",
  "listenbsc_testnet": "node module/listener.js --network=bsc_testnet",
  "listenbsc": "node module/listener.js --network=bsc",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

and when run you just type `yarn listenbsc` or `npm listenbsc`, you can modify run script as you want
