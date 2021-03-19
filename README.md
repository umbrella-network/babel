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
RPC_URL=https://ropsten.infura.io/v3/*** # RPC provider eg. infura
UMB_CHAIN_ADDRESS=0x10816eA91c8001B3a3890e8c597c5972b4E4aBfC # UMBrella Chain contract address
API_KEY=0xXXXXXXX # UMBrella API Key
```

# Run examples

## First Class Data

For running FCD example, you need to have RPC provider URL
and you need to setup it into `.env`, see `example.env`.

**Note**: Provider URL needs to be for Kovan testnet.

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

Run converter examples:

```shell script
npx hardhat run scripts/converters.ts
```

Run API Client examples:

```shell script
npx hardhat run scripts/api-client.ts
```

Run a proof verification example:

```shell script
npx hardhat run scripts/proof-verification.ts
```