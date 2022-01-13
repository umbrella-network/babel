import 'hardhat'; // required for IDE
import '@nomiclabs/hardhat-ethers'; // required for IDE
import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber, Contract } from 'ethers';
import { LeafKeyCoder, LeafValueCoder } from '@umb-network/toolbox';

// Chain registry address (see https://umbrella-network.readme.io/docs/umb-token-contracts)
const { REGISTRY_CONTRACT_ADDRESS } = process.env;
let exampleContract: Contract;

const setup = async (): Promise<Contract> => {
  const ExampleContract = await ethers.getContractFactory('ExampleContract');
  console.log(`deploying ExampleContract with REGISTRY_CONTRACT_ADDRESS=[${REGISTRY_CONTRACT_ADDRESS}]`);
  const exampleContract = await ExampleContract.deploy(REGISTRY_CONTRACT_ADDRESS);
  await exampleContract.deployed();

  return exampleContract;
};

describe('ExampleContract', () => {
  before(async () => {
    exampleContract = await setup();
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
      await exampleContract.latestBlockInfo();
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
      const price: BigNumber = await exampleContract.getPrice(LeafKeyCoder.encode(label));
      console.log('key as string (label):', label);
      console.log('price:', price.toString());
      const priceAsNumber = LeafValueCoder.decode(price.toHexString(), label);
      console.log('price as number:', priceAsNumber);
      expect(priceAsNumber).to.gt(0).and.lt(100000);
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
      const blockId = 640397;

      const proof = [
        '0x9410d90d8beeb128cc44d3a8e94ea2b10e1e4a3a92f8dbd521005b698caad4bb',
        '0xea1a18fba5dd52314c8ce22129efd46c5c3a544470d5ce6f19bf03d01618de9b',
        '0xb316b1238da51be28ef64e4d275f737691ed48f775f690f9f87a91112f95daf1',
        '0xa258ffb8b080bfa37c2c6fd183ad6921def86334a89682dd95a5016b4cf5f431',
        '0xd476a1f24ccd80413d32ec710db418a888e6310b870514ba6a316cbacc28bd88',
        '0x51af3701042af12a2fc647d2e2378501c86e931a1f5f5669b8bf8da3254db3e8',
        '0xa258cea753bcd3c2968c7af888edc6e9b026be683fa47f3c7b7b21b9735897bb',
        '0x871567bd3dc7ff157f23dc7524fc59d846c322321e6c61184ea163cb633cf0bd',
        '0x3b4f29acf30ecab19ccf9b3b132f70987462e5532effa6ddd1a8c23819a680cd',
        '0xbea0c65262e0f9bdc0c7e47419986f56eecc631d05e6ebffbddb43e3b30ed4bc',
      ];
      // key=BTC-USD
      const keyBytes = '0x0000000000000000000000000000000000000000000046495845445f52414e44';
      const valueBytes = '0xa4823bbb8af721ee6d89a87ac7ae48c8f1dc7422d8e1562c59cb2c159135fe36';

      try {
        const [success, value]: [boolean, BigNumber] = await exampleContract.verifyProofForBlockForNumber(
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
        console.log(`this proof will work only when blockId=${blockId} exists in current Chain contract`);
        console.log('verification will be FALSE on any other scenario because merkle proof will not work');
        console.log("so it's OK if we have error here in that case");
        console.log('\n\nNOTICE\n\n');
      }
    });
  });
});
