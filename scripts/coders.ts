import { LeafValueCoder, LeafKeyCoder } from '@umb-network/toolbox';

async function main() {
  const f = 1234.0000987;
  const label = 'A';

  // encode data for leaf:
  const leafData: Buffer = LeafValueCoder.encode(f, label);
  console.log(leafData);

  // decode data
  const originalValue: number = LeafValueCoder.decode(leafData.toString('hex'), label) as number;
  console.log(originalValue);

  // encoder accepts Buffer or hex string
  console.log(LeafKeyCoder.encode('ETH-USD')); // <Buffer 65 74 68 2d 75 73 64>;
  console.log(LeafKeyCoder.decode(Buffer.from('6574682d757364', 'hex'))); // 'ETH-USD'
  console.log(LeafKeyCoder.decode('0x6574682d757364')); // 'ETH-USD'
  console.log(LeafKeyCoder.decode('6574682d757364')); // 'ETH-USD'
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
