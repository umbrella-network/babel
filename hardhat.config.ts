require('custom-env').env(); // eslint-disable-line

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-web3';

import {HardhatUserConfig} from 'hardhat/types';

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      forking: {
        url: process.env.RPC_URL as string,
      }
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.6.8'
      },
    ]
  },
};

export default config;
