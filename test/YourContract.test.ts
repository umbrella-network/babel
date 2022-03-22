import 'hardhat'; // required for IDE
import '@nomiclabs/hardhat-ethers'; // required for IDE
import { ethers } from 'hardhat';
import { expect } from 'chai';
import superagent from 'superagent';
import { BigNumber, Contract } from 'ethers';
import { constants, LeafKeyCoder, LeafValueCoder, SortedMerkleTree } from '@umb-network/toolbox';

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

describe('YourContract', () => {
  beforeEach(async () => {
    yourContract = await setup();
  });

  describe('Umbrella - Hello word examples for First Class Data - Layer 1', function () {
    /**
   * below is example of output that this test will produce (including console log from smart contract):

   umbChain:
   0xc11b687cd6061a6516e23769e4657b6efa25d78e
   Fetching block from UMB Network for block id 219031
   umbChain:
   0xc11b687cd6061a6516e23769e4657b6efa25d78e
   root:
   0x44342a726bfd78056018160d5d09a89cb8936d2cf39125f7d2dd0ff461bcd97f
   timestamp: 1639766399
   */
    it('expect to present how to use Chain contract', async function () {
      await yourContract.latestBlockInfo();
    });

    /**
   * below is example of output that this test will produce (including console log from smart contract):

   Fetching data from UMB Network
   key:
   0x000000000000000000000000000000000000000000000000004254432d555344
   umbChain:
   0xc11b687cd6061a6516e23769e4657b6efa25d78e
   value= 46699410000000000000000
   timestamp= 1639766605
   key as string (label): BTC-USD
   price: 46699410000000000000000
   price as number: 46699.41
   */
    it('expect to get latest price for BTC-USD', async function () {
      const label = 'BTC-USD';
      const price: BigNumber = await yourContract.getPrice(LeafKeyCoder.encode(label));
      console.log('key as string (label):', label);
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
        if (e.message.includes('missing trie node')) {
          throw Error(e);
        }

        console.warn(e);

        console.log('\n\nNOTICE\n\n');
        console.log('label for this example may not exists as FCD, but this is not error');
        console.log('this test is here just to present, how to read FCD values, when type for it is FIXED');
        console.log('\n\nNOTICE\n\n');
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
      const bscUsd = 'BTC-USD';
      const ethUsd = 'ETH-USD';

      try {
        const price: BigNumber = await yourContract.calculateEthBtcPriceFCDExample(
          [bscUsd, ethUsd].map(LeafKeyCoder.encode),
        );
        console.log('calculated raw price BTC-ETH:', price.toString());
        const priceAsNumber = LeafValueCoder.decode(price.toHexString(), '');
        console.log('value as number:', priceAsNumber);
      } catch (e) {
        if (e.message.includes('missing trie node')) {
          throw Error(e);
        }

        console.warn(e);

        console.log('\n\nNOTICE\n\n');
        console.log(`in case keys (${bscUsd}, ${ethUsd}) for this example not exists as Layer2 data, `);
        console.log('this test might throw, but this is not an error, you can use keys that exists and it will work');
        console.log('\n\nNOTICE\n\n');
      }
    });
  });

  describe('Umbrella - Hello word examples for fetching L2 data on-chain', function () {
    /**
   * test output (including console log from smart contract):

   umbChain:
   0xc11b687cd6061a6516e23769e4657b6efa25d78e
   verification status: true
   value you can use on-chain: 46982130000000000000000
   */
    it('hardcoded example', async function () {
      // all this data are available via Umbrella API
      const blockId = 219055;

      const proof = [
        '0x7e6b937312b7f3c23823a480c58baef994816da1837fff208d487f351aa791c2',
        '0x2c1ad6d0ce6fd17debaf406c3d4c8712f8e03e1d18bba267e4dce05e5cec438c',
        '0xb6e7f4ba0ad1958dcf4b0efc3fcee50a7f886f8ba76128808123a1e4f3d048ee',
        '0x33e9662a125dbd8f6bdd236a29a57bb1fb70685502d0db0f176fe132a8e229a8',
        '0xd030e49f96ba2f6983cc5c48e77ebe9190b52d8930579a4b288bf6d8b005d119',
        '0xf0ee61771f4eec141f56f28aa3d8ebe7709078b28b5a41a76192568906742089',
        '0x7b10147d64621e70fe27076b7ee21812449b555d081f6c7647b0d9e63d64a22d',
        '0x153f0d7ee99d08880492cbc15c0a97cdee2b237c71c0ec1194d180a15150208f',
        '0xef01c663be4175b4e244dcb4e5365b52a5a38642f1b2cb3ebbe96d4664b3f6b2',
        '0x7e4ea75a717b17dfa18d5109d374a300a1eb911121cb1fab18a409cb534990ee',
        '0xc75b8e21b693481e48f4174bd0b96eb7796dec095740053e8d713b103ead5e68',
      ];
      // key=BTC-USD
      const keyBytes = '0x000000000000000000000000000000000000000000000000004254432d555344';
      const valueBytes = '0x0000000000000000000000000000000000000000000009f2e807e901c7250000';

      try {
        const [success, value]: [boolean, BigNumber] = await yourContract.verifyProofForBlockForNumber(
          blockId,
          proof,
          keyBytes,
          valueBytes,
        );

        if (!success) throw Error('not a big deal :) see explanation');

        expect(value.toString()).eql(BigNumber.from(valueBytes).toString());
      } catch (e) {
        if (e.message.includes('missing trie node')) {
          throw Error(e);
        }

        console.warn(e);

        console.log('\n\nNOTICE\n\n');
        console.log(`this proof will work only when blockId=${blockId} excists in current Chain contract`);
        console.log('verification will be FALSE on any other scenario because merkle proof will not work');
        console.log("so it's OK if we have error here in that case");
        console.log('\n\nNOTICE\n\n');
      }
    });

    // also see https://api.umb.network/docs/
    it('how to pull list of available Layer2 keys', async function () {
      const apiResponse = await superagent.get('https://api.umb.network/keys/layer2');
      const layer2Keys: string[] = apiResponse.body;
      console.log(`we got ${layer2Keys.length} keys`);
      expect(layer2Keys.length).gt(100);
    });

    /**
   * test output (including console log from smart contract):

   umbChain:
   0xc11b687cd6061a6516e23769e4657b6efa25d78e
   Verifying proof # 0
   Verifying proof # 1
   Data verified!
   uint value #1 46982130000000000000000
   uint value #2 3899620000000000000000
   value 1: 46982130000000000000000
   value 2: 3899620000000000000000
   calculated price 12047873895405193326
   calculated raw price BTC-ETH: {"type":"BigNumber","hex":"0xa732a579ba54086e"}
   price as number: 12.047873895405193
   */
    it('calculate price based on two different feeds', async function () {
      try {
        /*
      Proofs should be pulled from Umbrella API
      this example is based on BSC mainnet
       */
        const blockIds = [219055, 219055];

        const btcProof = [
          '0x7e6b937312b7f3c23823a480c58baef994816da1837fff208d487f351aa791c2',
          '0x2c1ad6d0ce6fd17debaf406c3d4c8712f8e03e1d18bba267e4dce05e5cec438c',
          '0xb6e7f4ba0ad1958dcf4b0efc3fcee50a7f886f8ba76128808123a1e4f3d048ee',
          '0x33e9662a125dbd8f6bdd236a29a57bb1fb70685502d0db0f176fe132a8e229a8',
          '0xd030e49f96ba2f6983cc5c48e77ebe9190b52d8930579a4b288bf6d8b005d119',
          '0xf0ee61771f4eec141f56f28aa3d8ebe7709078b28b5a41a76192568906742089',
          '0x7b10147d64621e70fe27076b7ee21812449b555d081f6c7647b0d9e63d64a22d',
          '0x153f0d7ee99d08880492cbc15c0a97cdee2b237c71c0ec1194d180a15150208f',
          '0xef01c663be4175b4e244dcb4e5365b52a5a38642f1b2cb3ebbe96d4664b3f6b2',
          '0x7e4ea75a717b17dfa18d5109d374a300a1eb911121cb1fab18a409cb534990ee',
          '0xc75b8e21b693481e48f4174bd0b96eb7796dec095740053e8d713b103ead5e68',
        ];

        const ethProof = [
          '0x7f83b8bdb97b80cd71756985f4d5a4804a1ba3c70b2c94ce8ecd928d69ae444d',
          '0x294b55e5a3e2b7d20cc187e826d61cfbc81f7df8cc927eca6b1ad5ad59b3ce92',
          '0xd14bc7a4042a56e65c3f6154508585eb5e925e97dadf7ac420c13849e10064b4',
          '0xce5eb7248e88e2efc1e83fd44d20008a9033c4637b3efcd8cf01374013e16d78',
          '0x22cb86f9ad6f9d0089ef1ed5041577260f61593c535e9803072e6402e3dfe872',
          '0xf046574ad63640af85dac2d3fbd77cd0c1ef90c6f67055340df255d728dada82',
          '0x8aa6a8ff7afa7e89ba528a7ba204ad60ac08facf0f85b029e362be0b1a94a725',
          '0xe7a3262be1fac0626363234d26db7219f04fd57aee4c2156fd827989b92448cf',
          '0x80086658a0a17c46f9fd9193e10addf10ba5349920c89345e0589075789f8ed7',
          '0x82520d2a1edead3cdcccd555020992cb2ca8b2c447a4fec796a1a965044348ed',
          '0xc75b8e21b693481e48f4174bd0b96eb7796dec095740053e8d713b103ead5e68',
        ];

        const { proofs, proofItemsCounter } = SortedMerkleTree.flattenProofs([btcProof, ethProof]);

        const keys = [LeafKeyCoder.encode('BTC-USD'), LeafKeyCoder.encode('ETH-USD')];

        const values = [
          '0x0000000000000000000000000000000000000000000009f2e807e901c7250000', // BTC-USD value in bytes from API
          '0x0000000000000000000000000000000000000000000000d3661950ed80ca0000', // ETH-USD value in bytes from API
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
        if (e.message.includes('missing trie node')) {
          throw Error(e);
        }
        console.warn(e);
        console.log('in case keys for this example not exists, this test might throw, but this is not an error');
      }
    });
  });
});
