import hre, { ethers } from 'hardhat';
import { Contract } from 'ethers';

import { sleep } from '../../utils/sleep';

async function main() {
  await deployContract('L2Notifier', ['address'], [process.env.REGISTRY_CONTRACT_ADDRESS]);

  await deployContract('ExampleContract', ['address'], [process.env.REGISTRY_CONTRACT_ADDRESS]);
}

export const deployContract = async (
  contractName: string,
  constructorTypes: string[],
  constructorArgs: unknown[],
): Promise<Contract> => {
  const Contract = await ethers.getContractFactory(contractName);

  const contract = await Contract.deploy(...constructorArgs);

  await contract.deployed();
  console.log(`deployed ${contractName}:`, contract.address);

  await verifyCode(contract.address, constructorArgs);

  return contract;
};

// eslint-disable-next-line
async function verifyCode(address: string, constructorArguments: any): Promise<void> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await hre.run('verify:verify', { address, constructorArguments });
      break;
    } catch (e) {
      console.log(e.message);
      console.log('retrying in 5 sec...');
      await sleep(5000);
    }
  }
}

main()
  .then(() => {
    console.log(`\n\nDONE.\n${'='.repeat(80)}\n`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
