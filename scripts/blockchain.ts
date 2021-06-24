import hre from 'hardhat';
import {JsonRpcProvider} from '@ethersproject/providers';

const {BLOCKCHAIN_PROVIDER_URL} = process.env;

const provider = new JsonRpcProvider(BLOCKCHAIN_PROVIDER_URL);

export const resetFork = async (): Promise<void> => {
  // in order to not have warning about block confirmations we will not fork on latest that's why -100
  const blockNumber: number = (await provider.getBlockNumber()) - 100;

  await hre.network.provider.request({
    method: 'hardhat_reset',
    params: [
      {
        forking: {
          jsonRpcUrl: BLOCKCHAIN_PROVIDER_URL as string,
          blockNumber,
        },
      },
    ],
  });
};
