import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Contract, BigNumber } from 'ethers';
import { LeafKeyCoder, LeafValueCoder, constants } from '@umb-network/toolbox';

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
    const label = 'BTC-USD';
    const price: BigNumber = await yourContract.getPrice(LeafKeyCoder.encode(label));
    console.log('price:', price.toString());
    const priceAsNumber = LeafValueCoder.decode(price.toHexString(), label);
    console.log('price as number:', priceAsNumber);
    expect(priceAsNumber).to.gt(0).and.lt(100000);
  });

  it('expect to get latest FIXED FCD value', async function () {
    const label = constants.FIXED_NUMBER_PREFIX + 'DAFI-TVL';
    const value: BigNumber = await yourContract.getPrice(LeafKeyCoder.encode(label));
    console.log('value:', value.toString());
    const valueAsNumber = LeafValueCoder.decode(value.toHexString(), label);
    console.log('value as number:', valueAsNumber);
    expect(valueAsNumber.toString()).to.eql(value.toString());
  });
});
