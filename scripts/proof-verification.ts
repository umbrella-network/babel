import {ContractRegistry, ChainContract, APIClient} from '@umb-network/toolbox';
import { ethers } from 'ethers';

async function main() {
  if(process.env.RPC_URL && process.env.UMB_CHAIN_ADDRESS && process.env.API_KEY) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

    const contractRegistry = new ContractRegistry(provider, process.env.UMB_CHAIN_ADDRESS);
    const chainContractAddress = await contractRegistry.getAddress('Chain');
    const chainContract = new ChainContract(provider, chainContractAddress);
    const apiClient = new APIClient({
      baseURL: 'https://api.umb.network/',
      chainContract,
      apiKey : process.env.API_KEY
    });

    const verificationResult = await apiClient.verifyProofForNewestBlock(
      'ETH-USD'
    );

    console.log(verificationResult) // output: {success: true, value: 1234} or {success: false, value: 1234}  
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
