import { ethers, Contract, Wallet } from 'ethers';
import ERC20ABI from './ERC20ABI';

export default async function allowSpender(
  tokenContractAddress: string,
  spender: string,
  amount: string,
  wallet: Wallet,
): Promise<ethers.providers.TransactionResponse> {
  const tokenContract = new Contract(tokenContractAddress, ERC20ABI, wallet);

  const tx = await tokenContract.approve(spender, amount);

  return tx;
}
