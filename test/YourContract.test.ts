import {ethers} from 'hardhat';
import {expect} from 'chai';
import {Contract} from 'ethers';
import {converters} from '@umb-network/toolbox';
import {fcdValueToNumber} from '@umb-network/toolbox/dist/converters';

// Chain registry address (see https://umbrella-network.readme.io/docs/umb-token-contracts)
const { REGISTRY_CONTRACT_ADDRESS } = process.env;

const setup = async (): Promise<Contract> => {
  const YourContract = await ethers.getContractFactory('YourContract');
  console.log(`deploying contract with REGISTRY_CONTRACT_ADDRESS=[${REGISTRY_CONTRACT_ADDRESS}]`);
  const yourContract = await YourContract.deploy(REGISTRY_CONTRACT_ADDRESS);
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
    const price = await yourContract.getPrice(converters.strToBytes32('BTC-USD'));
    console.log('price: ',price.toString());
    console.log('price as number', fcdValueToNumber(price));
    expect(price).to.gt(0);
  });
});
