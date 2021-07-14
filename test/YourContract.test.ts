import 'hardhat'; // required for IDE
import '@nomiclabs/hardhat-ethers'; // required for IDE

import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Contract, BigNumber } from 'ethers';
import { LeafKeyCoder, LeafValueCoder, constants, SortedMerkleTree } from '@umb-network/toolbox';

const hash = ethers.utils.solidityKeccak256;

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
  /**
   * test output (including console log from smart contract):

   umbChain:
   0x93bf28bd49870cc789831592824598a7d6a01c98
   Fetching block from UMB Network for block id 56997
   umbChain:
   0x93bf28bd49870cc789831592824598a7d6a01c98
   root:
   0xdbce16bc69566d79ecb0f0be3f4fb362d8cb62ece7f5f00238b1df55cc94bc19
   timestamp: 1625054356
   */
  it('expect to present how to use Chain contract', async function () {
    await yourContract.latestBlockInfo();
  });

  /**
   * test output (including console log from smart contract):

   Fetching data from UMB Network
   umbChain:
   0x93bf28bd49870cc789831592824598a7d6a01c98
   key:
   0x000000000000000000000000000000000000000000000000004254432d555344
   value= 34939250000000000000000
   timestamp= 1625054356
   price: 34939250000000000000000
   price as number: 34939.25
   */
  it('expect to get latest price for BTC-USD', async function () {
    const label = 'BTC-USD';
    const price: BigNumber = await yourContract.getPrice(LeafKeyCoder.encode(label));
    console.log('price:', price.toString());
    const priceAsNumber = LeafValueCoder.decode(price.toHexString(), label);
    console.log('price as number:', priceAsNumber);
    expect(priceAsNumber).to.gt(0).and.lt(100000);
  });

  it('expect to get latest FIXED FCD value', async function () {
    try {
      const label = constants.FIXED_NUMBER_PREFIX + 'DAFI-TVL';
      const value: BigNumber = await yourContract.getPrice(LeafKeyCoder.encode(label));
      console.log('value:', value.toString());
      const valueAsNumber = LeafValueCoder.decode(value.toHexString(), label);
      console.log('value as number:', valueAsNumber);
      expect(valueAsNumber.toString()).to.eql(value.toString());
    } catch (e) {
      console.log('label for this example may not exists, but this is not error');
      console.warn(e);
    }
  });

  /**
   * test output (including console log from smart contract):

   Fetching FCD data from UMB Network
   umbChain:
   0x93bf28bd49870cc789831592824598a7d6a01c98
   value 1: 34939250000000000000000
   value 2: 2158420000000000000000
   calculated price 16187419501301878225
   calculated raw price BTC-ETH: 16187419501301878225
   value as number: 16.18741950130188
   */
  it('calculate price based on two different feeds', async function () {
    try {
      const bscUsd = 'BTC-USD';
      const ethUsd = 'ETH-USD';
      const price: BigNumber = await yourContract.calculateEthBtcPriceFCDExample(
        [bscUsd, ethUsd].map(LeafKeyCoder.encode),
      );
      console.log('calculated raw price BTC-ETH:', price.toString());
      const priceAsNumber = LeafValueCoder.decode(price.toHexString(), '');
      console.log('value as number:', priceAsNumber);
    } catch (e) {
      console.log('in case keys for this example not exists, this test might throw, but this is not an error');
      console.warn(e);
    }
  });
});

describe('Umbrella - Hello word examples for fetching L2 data on-chain', function () {
  /**
   * test output (including console log from smart contract):

   umbChain:
   0x93bf28bd49870cc789831592824598a7d6a01c98
   verification status: true
   value you can use on-chain: 34800910000000000000000
   */
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

  /**
   * test output (including console log from smart contract):

   umbChain:
   0xa90068cdc31812d075e4eb5b88b3ed8137ee4a9f
   Verifying proof # 0
   Verifying proof # 1
   Data verified!
   uint value #1 32468450000000000000000
   uint value #2 1950600000000000000000
   value 1: 32468450000000000000000
   value 2: 1950600000000000000000
   calculated price 16645365528555316312
   calculated raw price BTC-ETH: {"type":"BigNumber","hex":"0xe70037c1de126458"}
   price as number: 16.645365528555317
   */
  it('calculate price based on two different feeds', async function () {
    try {
      /*
      Proofs should be pulled from Umbrella API
      this example is based on BSC mainnet
       */
      const blockIds = [17568, 17568];

      const btcProof = [
        '0x3d8625ddbf2586114295ec805b3065e0baf2fa3eb7dd2a57ada8405ca80ff4ed',
        '0x8dfefa5aa7a7935acaf0294a896e67950fd698d851198b4e7bc30632eb3652a5',
        '0x4f7a01e7a65b2fc5ed8e210da303f37edc9c33ef469d26b6b66f41d0c1960aa0',
        '0x6402b58adb0672aa339a30daad2e8cb88e461d829c54c37f96221c3a52a5d773',
        '0x4247a4994f9133b464b624a8923943605656d96daaeaef277157b4c5dfe5671b',
        '0x98cdf1e1beb254d1cbb0559029c7bb27544cf1d3e74f7aa534fb7f08436e0602',
        '0xd61cc368fa1abc0947e9189c08f35977396a981500feea2b59364416b946e56e',
        '0x98c2283c01f8f7733c71ba18ab8929b750df8c0172740b8ae7e92427ba3d7b86',
        '0x4ad8e4bc1bb683b9b4e9468b52da30903bda766032480c2edab520882180621e',
        '0xc05cb83481a131531c9a98666e8bc95c1f97b10e0f36ea750a3364c2d996ee8a',
      ];

      const ethProof = [
        '0xda2dade13ce18ba8d167c9f76b07f5aac982c98a4bbef0cd9cd64b6744da5013',
        '0x7d1a322ef5de4ad4c5f5ecc0c693f401cfc799cb95a83d01f8ce072b0a215354',
        '0xd2d3d9264f30a2e8527d578f7d89aaf5d89018c78751302888da229d4bd8ea5e',
        '0x87935f3b4b351a2f354325a4c4db1f98f58c1f40d53b53f6ec80a342fac60e23',
        '0x8e0b3f34bd794139773830ff1df45f8ec9dc16b3e3efeea5c49da7cb7dcca0c7',
        '0xee9e1382798cf26ae88e15de0744b7f44c4b09617427c56f51eea449b82b2744',
        '0x138802138027b954444786cd347fba5f72b46ed87a9738fe0361ede67f70170a',
        '0x5a4bd75a5603d2ae0d0d8f8c521f045b89a73bb927a1765209a50a1722147dac',
        '0x2e24c23afc65c28361c5f060e25a05ce69413dfe6db272bbc87b1d32f5813934',
        '0x7b092aa2545f230b629efd89e3644629e094f6b612f3d5d4566c32963ce3880c',
      ];

      const { proofs, proofItemsCounter } = SortedMerkleTree.flattenProofs([btcProof, ethProof]);

      const keys = [LeafKeyCoder.encode('BTC-USD'), LeafKeyCoder.encode('ETH-USD')];

      const values = [
        '0x0000000000000000000000000000000000000000000006e01e4271c77bbd0000', // BTC-USD value in bytes from API
        '0x000000000000000000000000000000000000000000000069be034d473cf40000', // ETH-USD value in bytes from API
      ];

      // this is how we can create merkle leaves off-chain
      // but this example also doing this on-chain, so they are not in use, it is just for reference
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const leaves = [
        hash(['bytes32', 'bytes32'], [keys[0], values[0]]),
        hash(['bytes32', 'bytes32'], [keys[1], values[1]]),
      ];

      const price: BigNumber = await yourContract.calculateEthBtcPriceL2Example(
        blockIds,
        proofs,
        proofItemsCounter,
        keys,
        values,
      );

      console.log('calculated raw price BTC-ETH:', JSON.stringify(price));
      const priceAsNumber = LeafValueCoder.decode(price.toHexString(), '');
      console.log('price as number:', priceAsNumber);
    } catch (e) {
      console.log('in case keys for this example not exists, this test might throw, but this is not an error');
      console.warn(e);
    }
  });
});
