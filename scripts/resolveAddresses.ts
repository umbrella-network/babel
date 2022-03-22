import { ContractRegistry } from '@umb-network/toolbox';
import ethers, { Contract } from 'ethers';

import ERC20ABI from './ERC20ABI';

interface addresses {
  datumRegistry: string;
  umbToken: string;
  umbBridge: string;
}

export default async function resolveAddresses(
  registryAddress: string,
  provider: ethers.providers.Provider,
): Promise<addresses> {
  const registry = new ContractRegistry(provider, registryAddress);

  const [datumRegistry, umbToken] = await Promise.all([
    registry.getAddress('DatumRegistry'),
    registry.getAddress('UMB'),
  ]);

  const UMB = new Contract(umbToken, ERC20ABI, provider);
  const umbBridge: string = await UMB.bridge();

  return {
    datumRegistry,
    umbToken,
    umbBridge,
  };
}
