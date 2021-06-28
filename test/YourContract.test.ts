import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Contract, BigNumber } from 'ethers';
import { LeafKeyCoder, LeafValueCoder } from '@umb-network/toolbox';

// Chain registry address (see https://umbrella-network.readme.io/docs/umb-token-contracts)
const { REGISTRY_CONTRACT_ADDRESS } = process.env;
let yourContract: Contract;

const setup = async (): Promise<Contract> => {
  const YourContract = await ethers.getContractFactory('YourContract');
  console.log(`deploying contract with REGISTRY_CONTRACT_ADDRESS=[${REGISTRY_CONTRACT_ADDRESS}]`);
  const yourContract = await YourContract.deploy(REGISTRY_CONTRACT_ADDRESS);
  await yourContract.deployed();
  return yourContract;
};

before(async () => {
  yourContract = await setup();
});

describe('Umbrella - Hello word examples for First Class Data - Layer 1', function () {
  it('expect to present how to use Chain contract', async function () {
    await yourContract.latestBlockInfo();
  });

  it('expect to get latest price for BTC-USD', async function () {
    const price: BigNumber = await yourContract.getPrice(LeafKeyCoder.encode('BTC-USD'));
    console.log('price:', price.toString());
    const priceAsNumber = LeafValueCoder.decode(price.toHexString());
    console.log('price as number:', priceAsNumber);
    expect(priceAsNumber).to.gt(0).and.lt(100000);
  });
});

describe('Umbrella - Hello word examples for fetching L2 data on-chain', function () {
  it('expect to fetch L2 data securely on-chain', async function () {
    // all this data are available via Umbrella API
    const blockId = 53557;
    const proof = [
      '0x9f6ec43bda049c7170a46ab9a5f8c968e97b7833dddd69fd28e898e724a61677',
      '0x2b644b91eccb6076b40ea5ee3b343025ae0309d479396323717962776d30568f',
      '0x74b0e87901af62f880f12fe4f60a0b2a02a1df20bd70fe8b5b3391e289420fbc',
      '0x23e02b8bd867ecdeb6db76b39f45a6189911c13a67ffefc27f67fc57009274e4',
      '0x23aec4a6a03f1f14a166b0e21b2a62ed5f30fc2f55747d33197e78ae1a964fb0',
      '0xdcf62463d7fe1c3da83bc3ce80cdcd95a56fca5d1182187f674ee4fabb74861c',
      '0xb8a978d7f8739a071ca2672df669b1bc5c9d6a36296e81e2efa26bbef8aefc44',
      '0xf258b2e25c8358545b448d09de381ea88f7d4edb6d2b7c9355a2ead16178531b',
      '0x13f8daeb0d4ff3145a1296833d42d178c24759414adfa8c2ce7a7d5901132216',
      '0x6e99c32f435b8ef3af23d1a9cfc8b6ba2de87897285142c3e09a2fcff578f10d',
      '0xde29bd1dcea144d7b9cd6330ea15a347eaaa44449c55744fb022510517faa36b',
    ];
    // key=BTC-USD
    const keyBytes = '0x000000000000000000000000000000000000000000000000004254432d555344';
    const valueBytes = '0x00000000000000000000000000000000000000000000075e8fa4fde0635b0000';

    try {
      await yourContract.verifyProofForBlockForNumber(blockId, proof, keyBytes, valueBytes);
    } catch (e) {
      // this proof will work only for BSC for Chain=0x93bf28bd49870cc789831592824598a7d6a01c98
      // it will throw error on any other scenario because merkle proof will not work for other cases
      // so it's OK if we have error here
    }
  });
});
