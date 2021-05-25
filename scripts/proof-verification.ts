import { ContractRegistry, ChainContract, APIClient } from '@umb-network/toolbox';
import { ethers } from 'ethers';

const { BLOCKCHAIN_PROVIDER_URL, REGISTRY_CONTRACT_ADDRESS, API_BASE_URL, API_KEY } = process.env;

async function main() {
  if (BLOCKCHAIN_PROVIDER_URL && REGISTRY_CONTRACT_ADDRESS && API_KEY) {
    const provider = new ethers.providers.JsonRpcProvider(BLOCKCHAIN_PROVIDER_URL);

    const contractRegistry = new ContractRegistry(provider, REGISTRY_CONTRACT_ADDRESS);
    const chainContractAddress = await contractRegistry.getAddress('Chain');
    const chainContract = new ChainContract(provider, chainContractAddress);
    const apiClient = new APIClient({
      baseURL: API_BASE_URL as string,
      chainContract,
      apiKey: API_KEY,
    });

    const verificationResult = await apiClient.verifyProofForNewestBlock('ETH-USD');

    console.log(verificationResult);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
