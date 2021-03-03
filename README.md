# babel

![Umbrella network - logo](./assets/umb.network-logo.png)

Umbrella Network Reference Application

## Prerequisites

1. [brew](http://brew.sh)

  ```sh
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  ```

1. [HubFlow](http://datasift.github.io/gitflow/)

  ```sh
  brew install hubflow
  ```

> If you are on Linux

  ```sh
  git clone https://github.com/datasift/gitflow
  cd gitflow
  sudo ./install.sh
  ```

## Setup

```shell
git clone git@github.com:umbrella-network/babel.git
yarn install
```

## Run examples

### First Class Data

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
