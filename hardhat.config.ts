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
      /*
        forking with hardhat stops working for ropsten
        In order to fix the reference app so we can use it as example
        we need to fork manually.
        For now forking with configuration will be disabled,
        however it is working fine with other networks.
       */
      // forking: {
      //   url: process.env.BLOCKCHAIN_PROVIDER_URL as string,
      // }
    }
  },
  solidity: {
    compilers: [
      {
        version: '0.7.5'
      }
    ]
  },
};

export default config;
