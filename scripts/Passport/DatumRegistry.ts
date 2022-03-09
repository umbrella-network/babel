import { DatumRegistryContract } from '@umb-network/toolbox';
import { Contract } from 'ethers';
import hre, { ethers } from 'hardhat';

import ERC20ABI from '../ERC20ABI';
import allowSpender from '../allowSpender';
import resolveAddresses from '../resolveAddresses';

const { REGISTRY_CONTRACT_ADDRESS } = process.env;

async function main() {
  if (!REGISTRY_CONTRACT_ADDRESS) throw new Error('Please set the REGISTRY_CONTRACT_ADDRESS');

  const { addresses, wallet } = await setupTest();

  // Contract that will get data delivered to
  const RECEIVER_ADDRESS = '0xd3e5Bf479BF8A2252D89D2990dDE2173869166D0'; // StandardDatumReceiver

  // wallet with provider will make it able to create _write_ transactions
  const datumRegistry = new DatumRegistryContract(wallet, addresses.datumRegistry);

  console.log('  Creating a Datum');
  let tx = await datumRegistry.create({
    receiverAddress: RECEIVER_ADDRESS,
    funderAddress: wallet.address,
    depositAmount: '0', // you can already deposit within the Datum creation
    keys: ['UMB-USD', 'ETH-USD', 'BTC-USD'],
  });
  // waits one block so the tx is confirmed
  await tx.wait();
  console.log('Confirmed! [1/6] \n');

  console.log('  Removing keys');
  // remove keys you don't need anymore
  tx = await datumRegistry.removeKeys(RECEIVER_ADDRESS, ['BTC-USD', 'ETH-USD']);
  await tx.wait();
  console.log('Confirmed! [2/6] \n');

  console.log('  Depositing funds');
  // deposit $UMB 0,000000000000000001 (with 18 decimals as an usual ERC20)
  tx = await datumRegistry.deposit(RECEIVER_ADDRESS, '1');
  await tx.wait();
  console.log('Confirmed! [3/6] \n');

  console.log('  Adding keys');
  // add another key to your Datum
  tx = await datumRegistry.addKeys(RECEIVER_ADDRESS, ['BNB-USD']);
  await tx.wait();
  console.log('Confirmed! [4/6] \n');

  console.log('  Disabling Datum');
  // this will disable your Datum, you'll not receive updates until  you activate it again
  tx = await datumRegistry.setDatumEnabled(RECEIVER_ADDRESS, false);
  await tx.wait();
  console.log('Confirmed! [5/6] \n');

  console.log('  Withdrawing funds');
  // not specifying the amount will withdraw the whole balance of your Datum
  tx = await datumRegistry.withdraw(RECEIVER_ADDRESS);
  await tx.wait();
  console.log('Confirmed! [6/6] \n');
}

async function setupTest() {
  const addresses = await resolveAddresses(REGISTRY_CONTRACT_ADDRESS as string, ethers.provider);
  console.log('Resolved Addresses:', addresses);

  const wallet = ethers.Wallet.createRandom().connect(ethers.provider);

  // Add funds to Wallet
  // Add funds to Bridge so it can mint tokens by itself
  await hre.network.provider.send('hardhat_setBalance', [wallet.address, '0xde0b6b3a7640000']);
  await hre.network.provider.send('hardhat_setBalance', [addresses.umbBridge, '0xde0b6b3a7640000']);
  
  // Impersonates Bridge to mint UMB tokens to Wallet
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [addresses.umbBridge],
  });

  const signer = await ethers.getSigner(addresses.umbBridge);
  const UMB = new Contract(addresses.umbToken, ERC20ABI, signer);
  const mintTx = await UMB.mint(wallet.address, '1');
  await mintTx.wait();

  await hre.network.provider.request({
    method: 'hardhat_stopImpersonatingAccount',
    params: [addresses.umbBridge],
  });

  console.log('\n  Allowing Spender');
  const allowanceTx = await allowSpender(addresses.umbToken, addresses.datumRegistry, '5000' + '0'.repeat(18), wallet);
  await allowanceTx.wait();
  console.log('Contract allowed \n');

  return { addresses, wallet };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
