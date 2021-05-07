import {ethers} from 'hardhat';
import {expect} from 'chai';
import {Contract} from 'ethers';
import {converters} from '@umb-network/toolbox';

// Chain registry address (see https://umbrella-network.readme.io/docs/umb-token-contracts)
const { UMB_REGISTRY_ADDRESS } = process.env;

const setup = async (): Promise<Contract> => {
  const YourContract = await ethers.getContractFactory('YourContract');
  console.log(`deploying contract with UMB_REGISTRY_ADDRESS=[${UMB_REGISTRY_ADDRESS}]`);
  const yourContract = await YourContract.deploy(UMB_REGISTRY_ADDRESS);
  await yourContract.deployed();
  return yourContract;
};

describe('Umbrella - Hello word examples for First Class Data - Layer 1', function () {
  let yourContract: Contract;

  before(async () => {
    yourContract = await setup();
  });

  it('expect to present how to use Chain contract', async function () {
    await yourContract.latestBlockInfo();
  });

  it('expect to get latest price for BTC-USD', async function () {
    const price = await yourContract.getCurrentPrice(converters.strToBytes32('BTC-USD'));
    console.log(price.toString());
    expect(price).to.gt(0);
  });
});
