[![Reference App QA - Development](https://github.com/umbrella-network/babel/actions/workflows/pipeline.develop.yml/badge.svg?branch=develop)](https://github.com/umbrella-network/babel/actions/workflows/pipeline.develop.yml)
[![Reference App QA - Production](https://github.com/umbrella-network/babel/actions/workflows/pipeline.yml/badge.svg?branch=main)](https://github.com/umbrella-network/babel/actions/workflows/pipeline.yml)
# babel

![Umbrella network - logo](./assets/umb.network-logo.png)

Umbrella Network Reference Application


# Setup

Install packages.

```shell
git clone git@github.com:umbrella-network/babel.git
npm install
```

Setup a dotenv file (`.env`) with local configuration values. Example:

```
# RPC provider eg. infura
BLOCKCHAIN_PROVIDER_URL=https://ropsten.infura.io/v3/***

# UMBrella Contract Registry contract address for ropsten:
REGISTRY_CONTRACT_ADDRESS=<get-it-from: https://umbrella-network.readme.io/docs/umb-token-contracts#contract-registry>

# UMBrella API Key:
API_KEY=0xXXXXXXX
```

# API - interactive documentation

https://api.umb.network/docs/

# Run examples

## First Class Data

For running FCD example, you need to have RPC provider URL
and you need to setup `.env`, see `example.env`.

**Note**: This example forking a blockchain using hardhat forking feature.
If you provide RPC for BSC mainnet or ETH Ropsten (atm this are our two main environments)
You will have access to all Umbrella feeds (Layer 2 and FCD). 

Then open console and run

```shell
npm run test
```

You should get result like this:

```shell
  Umbrella - Hello word examples for First Class Data - Layer 1
Deploying YourContract with Umbrella Registry: 0x4545e91d2e3647808670dd045ea5f4079b436ebc
umbChain:
0xfbe47aaddd6a0c795b01ab80648534a97f3b5d88
Fetching block from UMB Network for block height 40197
root:
0x4c11cc9dfb3d2dd21d2349042154aba98a9d86ca50608937af2fdf3fb5093275
timestamp: 1615420768
blockchain block number (anchor): 23858534
minter: 0xdc3ebc37da53a644d67e5e3b5ba4eef88d969d5c
    ✓ expect to present how to use Chain contract (5215ms)
55979780000000000000000
    ✓ expect to get latest price for BTC-USD (440ms)


  2 passing (11s)
```
## Layer 2 Data

Run coders examples:

```shell script
npx hardhat run scripts/coders.ts
```

Run API Client examples:

```shell script
npx hardhat run scripts/api-client.ts
```

Run a proof verification example:

```shell script
npx hardhat run scripts/proof-verification.ts
```

## Layer 2 Data Subscription

In this repository there is a system composed by `contracts/ExampleContract.sol` and `contracts/L2Notifier`. The idea here is to have a contract that subscribes for a certain data at some future block. This data can be any Layer 2 Data like some cryptocurrency price or the Random Number (0x0000000000000000000000000000000000000000000046495845445f52414e44, decoded as `FIXED_RAND`).

### L2Notifier.sol

This contract is both where you `register` your delivery request and expects to be `notified` when your data is ready. An off-chain worker will be needed to fetch the data from [Umbrella's API](https://umbrella-network.readme.io/docs) (block id, key, value and Merkle Proof). 

Example: listen to blocks minted by [Umbrella's Chain Contract](https://umbrella-network.readme.io/docs/umb-token-contracts) and when the desired block height is minted, fetch data and start a delivery from your worker towards L2Notifier. Notifier, at it's time, will call the `ExampleContract` (here as the receiver) with the provided data and the proof checked, assuring the data is valid. 

### ExampleContract.sol

This contract holds the logic for the customer side. It implements an interface that verifies if the caller is the authorized contract and some other utilities, as the receiver's business logic requires.
