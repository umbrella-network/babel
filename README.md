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

For running FCD example, you need to have:
1. `Chain` contract address
2. RPC provider URL

and you need to setup them into `.env`, see `example.env`.

**Note**: Provider URL and `Chain` address must point to the same network.

Then open console and run

```shell
hardhat node
```

Open another console and run

```shell
npm run test
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