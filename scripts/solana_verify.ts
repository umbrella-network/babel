/*
  This script fetchs a key/value pair and its proofs from the Umbrella API and
  validated them with a call to the `chain` Solana program. The Merkel root hash
  is already stored in a block which is a Solana data account referenced with a
  Program Derived Account (kind of public-key), this last is derived in our
  program using the block ID and the official program ID of `chain`.
 */

import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { LeafKeyCoder, LeafValueCoder } from '@umb-network/toolbox';
import axios from 'axios';
import fs from 'fs';
import 'dotenv/config';

const { API_BASE_URL, API_KEY } = process.env;

// program ID on Sandbox/Mainnet
const chainId = '4SPgs3L7Ey9VyRuZwx4X3y86LSAZXP2Hhpz9Sps4v3iT';

const IDL = JSON.parse(fs.readFileSync('./artifacts/solana-idl/chain.json', 'utf8'));

const main = async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = new Program(IDL, new PublicKey(chainId), provider);

  // We fetch the last block ID from the API
  const latest_block_id: number = await axios
    .get(`${API_BASE_URL}/blocks/latest?chainId=solana`, {
      headers: {
        authorization: API_KEY,
      },
    })
    .then(({ data }) => data.data.blockId)
    .catch((err) => console.log(`error in fetching last block: ${err}`));

  const seed = LeafValueCoder.encode(latest_block_id, '');
  const pair = 'ETH-USD';

  const data = await axios
    .get(`${API_BASE_URL}/proofs?keys[]=${pair}&chainId=solana`, {
      headers: {
        authorization: API_KEY,
      },
    })
    .then(({ data }) => data.data.leaves[0])
    .catch((err) => console.log(`error in fetching proofs: ${err}`));

  const proofs = data.proof.map((x: string) => Buffer.from(x.slice(2), 'hex'));
  const value = Buffer.from(data.value.slice(2), 'hex');
  const key = LeafKeyCoder.encode(pair);

  const [blockPda] = await PublicKey.findProgramAddress([seed], program.programId);

  const block = await program.account.block.fetch(blockPda);
  const blockRoot = '0x' + Buffer.from(block.root).toString('hex');

  console.log(`\nBlock ID = ${latest_block_id} Root hash in Solana = ${blockRoot}\n`);

  const verifyResultAccount = anchor.web3.Keypair.generate();

  await program.methods
    .initializeVerifyResult()
    .accounts({
      verifyResult: verifyResultAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([verifyResultAccount])
    .rpc({ commitment: 'confirmed' });

  // The first time should print "False" since we are initializing an account
  let account = await program.account.verifyResult.fetch(verifyResultAccount.publicKey);
  console.log('Verify result =', account.result);

  await program.methods
    .verifyProofForBlock(seed, proofs, key, value)
    .accounts({
      verifyResult: verifyResultAccount.publicKey,
      block: blockPda,
    })
    .rpc({ commitment: 'confirmed' });

  // The second time should print "True" since the proof are right (they come from the API)
  account = await program.account.verifyResult.fetch(verifyResultAccount.publicKey);
  console.log('Verify result =', account.result);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
