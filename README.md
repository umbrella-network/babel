# babel

![Umbrella network - logo](./assets/umb.network-logo.png)

Umbrella Network Reference Application

## Setup

```shell
git clone git@github.com:umbrella-network/babel.git
npm install
```

## Run examples

### First Class Data

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
