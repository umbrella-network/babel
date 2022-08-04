import * as anchor from '@project-serum/anchor';
import {Program} from '@project-serum/anchor';
import {PublicKey, Connection} from '@solana/web3.js';
import fs from 'fs';

import {derivePDAFromFCDKey, getReturnLog} from './solana-utils';

/*
 Execution example:
  SOLANA_CHAIN_PROGRAM_ID=4SPgs3L7Ey9VyRuZwx4X3y86LSAZXP2Hhpz9Sps4v3iT
  SOLANA_CALLER_PROGRAM_ID=BAxZZXMFKHn4cw2NJTM83uLSuuhF3BBq76WLKvDkz5xj
  ANCHOR_PROVIDER_URL="https://api.devnet.solana.com"
  ANCHOR_WALLET=~/.config/solana/id.json
  ts-node ./scripts/solana_read_fcd_onchain.ts
*/

const chainProgramId = process.env.SOLANA_CHAIN_PROGRAM_ID as string;
const callerProgramId = process.env.SOLANA_CALLER_PROGRAM_ID as string;

const IDL = JSON.parse(fs.readFileSync('./solana-idl/caller.json', 'utf8'));

const main = async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const callerProgram = new Program(IDL, new PublicKey(callerProgramId), provider);

  const key = 'BTC-USD';
  const [fcdPda, seed] = await derivePDAFromFCDKey(key, new PublicKey(chainProgramId));

  let tx = await callerProgram.methods
    .readFcd()
    .accounts({
      fcd: fcdPda,
    })
    .rpc({commitment: 'confirmed'});

  const solanaProvider = new Connection(process.env.ANCHOR_PROVIDER_URL as string);
  console.log(await getReturnLog(solanaProvider, tx))
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
