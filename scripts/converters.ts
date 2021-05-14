import { converters } from '@umb-network/toolbox';

async function main() {
  console.log(converters.numberToUint256(10)); // '0x8ac7230489e80000'
  console.log(converters.numberToUint256(10.01)); // '0x8aeaa9f6f9a90000'
  
  // '0x4869207468657265210000000000000000000000000000000000000000000000'
  console.log(converters.strToBytes32('Hi there!'));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
