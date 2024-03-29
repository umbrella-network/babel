import '@nomiclabs/hardhat-ethers'; // required for IDE

import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import { ABI } from '@umb-network/toolbox';
import { LeafKeyCoder } from '@umb-network/toolbox';
import { deployMockContract } from 'ethereum-waffle';

let L2Notifier: Contract;
let ExampleContract: Contract;
let chainContract: Contract;
let contractRegistry: Contract;

const CURRENT_BLOCK = 10;
const DELIVERY_BLOCK = CURRENT_BLOCK + 10; // rule inside ExampleContract.subscribeL2Value

const setup = async (): Promise<Contract[]> => {
  const [owner] = await ethers.getSigners();

  [contractRegistry, chainContract] = await Promise.all([
    deployMockContract(owner, ABI.registryAbi),
    deployMockContract(owner, ABI.chainAbi),
  ]);

  const deployL2Notifier = async () => {
    const L2NotifierFactory = await ethers.getContractFactory('L2Notifier');
    const L2Notifier = await L2NotifierFactory.deploy(contractRegistry.address);
    await L2Notifier.deployed();

    return L2Notifier;
  };

  const deployExampleContract = async () => {
    const ExampleContractFactory = await ethers.getContractFactory('ExampleContract');
    const ExampleContract = await ExampleContractFactory.deploy(contractRegistry.address);
    await ExampleContract.deployed();

    return ExampleContract;
  };

  [L2Notifier, ExampleContract] = await Promise.all([deployL2Notifier(), deployExampleContract()]);

  const chainBytes32 = ethers.utils.formatBytes32String('Chain');
  const l2NotifierBytes32 = ethers.utils.formatBytes32String('L2Notifier');

  await Promise.all([
    contractRegistry.mock.getAddress.withArgs(chainBytes32).returns(chainContract.address),
    contractRegistry.mock.getAddressByString.withArgs('Chain').returns(chainContract.address),
    contractRegistry.mock.getAddress.withArgs(l2NotifierBytes32).returns(L2Notifier.address),
    contractRegistry.mock.getAddressByString.withArgs('L2Notifier').returns(L2Notifier.address),
    chainContract.mock.getBlockId.returns(CURRENT_BLOCK),
    chainContract.mock.verifyProofForBlock.returns(false),
  ]);

  return [L2Notifier, ExampleContract, chainContract, contractRegistry];
};

describe('L2Notifier', () => {
  beforeEach(async () => {
    [L2Notifier, ExampleContract, chainContract, contractRegistry] = await setup();
  });

  // Check the supported keys in:
  // https://api.umb.network/keys/layer2
  // https://api.sbx.umb.network/keys/layer2
  describe('L2Notifier::register', function () {
    it('expect Registry to be set', async function () {
      expect(await L2Notifier.registry()).to.eq(contractRegistry.address);
    });

    it('registers for some key in the future', async function () {
      const key = `0x${LeafKeyCoder.encode('FIXED_RAND1').toString('hex')}`;

      const [signer] = await ethers.getSigners();

      expect(L2Notifier.register(key, 1000000000))
        .to.emit(L2Notifier, 'LogSubscriptionCreated')
        .withArgs(signer.address, key);
    });

    it('cannot register twice', async function () {
      const key = `0x${LeafKeyCoder.encode('FIXED_RAND2').toString('hex')}`;

      await L2Notifier.register(key, 1000000000);

      await expect(L2Notifier.register(key, 1000000001)).to.be.revertedWith('cannot subscribe multiple times');
    });

    it('cannot subscribe for a block in the past', async function () {
      const key = `0x${LeafKeyCoder.encode('FIXED_RAND3').toString('hex')}`;

      await expect(L2Notifier.register(key, 10)).to.be.revertedWith('should subscribe for the future block');
    });
  });

  describe('L2Notifier::notify', function () {
    const blockId = 640514;
    const proof = [
      '0x9410d90d8beeb128cc44d3a8e94ea2b10e1e4a3a92f8dbd521005b698caad4bb',
      '0x6b305231e6770cc8befc528c4fec422e43c17fc70f43004f3b3fa36a9ab0050a',
      '0x7208fef337a19338d4b02f455c3ff369ad1f6ad846c94cc7b16841194d5ffb4a',
      '0x6bdc1a2a920a1a29df58e5a6321ce611ec9ab2d00255310b8bba03d9a092f60d',
      '0xd476a1f24ccd80413d32ec710db418a888e6310b870514ba6a316cbacc28bd88',
      '0x537743c98643edda64706221658e64a5730df3b71e8467ac31704c8cb653239e',
      '0xa258cea753bcd3c2968c7af888edc6e9b026be683fa47f3c7b7b21b9735897bb',
      '0x871567bd3dc7ff157f23dc7524fc59d846c322321e6c61184ea163cb633cf0bd',
      '0x3b4f29acf30ecab19ccf9b3b132f70987462e5532effa6ddd1a8c23819a680cd',
      '0x62b534c8424785aa8c154c9616d64bc0755c672501d131d1e844e39f53d71d8e',
    ];

    // key = BTC-USD
    const keyBytes = '0x0000000000000000000000000000000000000000000046495845445f52414e44';
    const valueBytes = '0x305239bb51cb441ff8c2c4d7767a87d4bce4079f9712de615c959ab3c0c37755';

    beforeEach(async () => {
      await ExampleContract.subscribeL2Value(keyBytes);
      await chainContract.mock.getBlockId.returns(DELIVERY_BLOCK);
    });

    describe('when there is no subscription for that data', () => {
      it('reverts with message', async function () {
        const [signer] = await ethers.getSigners();

        await expect(
          L2Notifier.notify(signer.address, blockId, LeafKeyCoder.encode('FIXED_RAND4'), valueBytes, proof),
        ).to.be.revertedWith('cannot find subscription');
      });
    });

    describe('when trying to deliver earlier than set by contract', () => {
      it('should wait for enough blocks', async function () {
        await chainContract.mock.getBlockId.returns(DELIVERY_BLOCK - 1);

        await expect(
          L2Notifier.notify(ExampleContract.address, blockId, keyBytes, valueBytes, proof),
        ).to.be.revertedWith('should wait for enough blocks');
      });
    });

    describe('when delivered data is faulty', () => {
      beforeEach(async () => {
        await chainContract.mock.verifyProofForBlock.returns(false);
      });

      it('reverts with message "proof is not valid"', async () => {
        const exampleContractAddress = ExampleContract.address;
        console.log(ExampleContract.address);
        console.log(L2Notifier.address);

        await expect(L2Notifier.notify(exampleContractAddress, blockId, keyBytes, keyBytes, proof)).to.be.revertedWith(
          'proof is not valid',
        );
      });
    });

    describe('when delivery succeeds', () => {
      beforeEach(async () => {
        await chainContract.mock.verifyProofForBlock.returns(true);
      });

      it('emits success notification', async function () {
        await expect(L2Notifier.notify(ExampleContract.address, blockId, keyBytes, valueBytes, proof))
          .to.emit(ExampleContract, 'LogSubscriptionReceived')
          .withArgs(keyBytes, valueBytes);
      });
    });

    describe('when delivering from unauthorized address', () => {
      it('reverts the delivery with message', async function () {
        await expect(ExampleContract.dataVerified(keyBytes, valueBytes)).to.be.revertedWith(
          'should only called by Umbrella notifier',
        );
      });
    });
  });
});
