import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { LeafKeyCoder, LeafValueCoder } from '@umb-network/toolbox';
import fs from 'fs';

const programId = '9agqAPFMkmekbTT4tcz8NCjL4WT2Ccpu8ayn1SGzVwC3';

const IDL = JSON.parse(
  fs.readFileSync('./artifacts/solana-idl/chain.json', 'utf8')
);

const main = async() => {

  const provider = anchor.AnchorProvider.local('https://api.devnet.solana.com');
  anchor.setProvider(provider);

  const program = new Program(
    IDL,
    new PublicKey(programId),
    provider
  );

  const pair = 'BTC-USD'; 
  const seed = LeafKeyCoder.encode(pair);

  /*  We derive the Program Derived Account (PDA) for
   *  fetching the data stored on the account
   */
  const [fcdPda] = await PublicKey.findProgramAddress(
    [seed], program.programId
  );

  const fcd = await program.account.firstClassData.fetch(fcdPda);
  const value = LeafValueCoder.decode('0x' + Buffer.from(fcd.value).toString('hex'), pair);

  console.log(`\n${pair} - ${value} - ${new Date(fcd.timestamp * 1000)}\n`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

