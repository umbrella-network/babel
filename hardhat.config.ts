require('custom-env').env(); // eslint-disable-line

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-web3';

import { HardhatUserConfig } from 'hardhat/types';

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      forking: {
        url: process.env.BLOCKCHAIN_PROVIDER_URL as string,
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.7.5',
      },
      {
        version: '0.7.6',
      },
      {
        version: '0.8.0',
      },
    ],
  },
};

export default config;
