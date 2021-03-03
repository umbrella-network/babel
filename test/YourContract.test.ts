import {ethers} from 'hardhat';
import {expect} from 'chai';
import {Contract} from 'ethers';
import {converters} from '@umb-network/toolbox';

const {UMB_CHAIN_ADDRESS} = process.env;

const setup = async (): Promise<Contract> => {
  if (!UMB_CHAIN_ADDRESS) {
    throw Error('Please setup UMB_CHAIN_ADDRESS in .env file');
  }

  const YourContract = await ethers.getContractFactory('YourContract');
  const yourContract = await YourContract.deploy(process.env.UMB_CHAIN_ADDRESS);
  await yourContract.deployed();
  return yourContract;
};

describe('Umbrella First Class Data - Layer 1', function () {
  let yourContract: Contract;

  before(async () => {
    yourContract = await setup();
  });

  describe('getting latest numeric FCD', function () {
    it('expect to get numeric data by key from UMB Chain', async function () {
      expect(await yourContract.getLatestNumericFCD(converters.strToBytes32('BTC-USD'))).to.gt(0);
    });
  });
});
