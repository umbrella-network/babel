/*
  This script fetchs a key/value pair and its proofs from the Umbrella API and
  validated them with a call to the `caller` Solana program, this last performs
  a cross-program invocation (CPI) to the official chain program for the final
  validation. The Merkel root hash is already stored in a block which is a
  Solana data account referenced with a Program Derived Account (kind of
  public-key), this last can is derived in our program using a the block ID and
  the official program ID of `chain`.
 */

import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { LeafKeyCoder, LeafValueCoder } from '@umb-network/toolbox';
import axios from 'axios';
import 'dotenv/config';

const {API_BASE_URL, API_KEY} = process.env;

const chainId = "4SPgs3L7Ey9VyRuZwx4X3y86LSAZXP2Hhpz9Sps4v3iT";
const callerId = "BmmRtz8Zf4rjQgWT643QG2eqHVkXzebSsnR7XipFTrAg";

const IDL = JSON.parse(
  require("fs").readFileSync("./artifacts/solana-idl/chain.json", "utf8")
);

const callerIDL = JSON.parse(
  require("fs").readFileSync("./artifacts/solana-idl/caller.json", "utf8")
);

const main = async() => {

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  let chainProgram = new Program(
    IDL,
    new PublicKey(chainId),
    provider
  );

  let callerProgram = new Program(
    callerIDL,
    new PublicKey(callerId),
    provider
  );

  // We fetch the last block ID from the API
  const latest_block_id: number = await axios
    .get(`${API_BASE_URL}/blocks/latest?chainId=solana`, {
      headers: {
        authorization: API_KEY
      }
    })
    .then(({data}) => data.data.blockId)
    .catch((err) => console.log(`error in fetching last block: ${err}`));

  let pair = "ETH-USD"

  const data = await axios
    .get(`${API_BASE_URL}/proofs?keys[]=${pair}&chainId=solana`, {
      headers: {
        authorization: API_KEY
      }
    })
    .then(({data}) => data.data.leaves[0])
    .catch((err) => console.log(`error in fetching last block: ${err}`));

  const proofs = data.proof.map((x: any) => Buffer.from(x.slice(2), 'hex'));
  const value = Buffer.from(data.value.slice(2), 'hex');
  let key = LeafKeyCoder.encode(pair);

  const seed = LeafValueCoder.encode(latest_block_id, '');

  const [blockPda, bump] = await PublicKey.findProgramAddress(
    [seed], chainProgram.programId
  );

  const block = await chainProgram.account.block.fetch(blockPda);
  const blockRoot = '0x' + Buffer.from(block.root).toString('hex');

  console.log(`\nBlock ID = ${latest_block_id} Root hash in Solana = ${blockRoot}\n`);

  const verifyResultAccount = anchor.web3.Keypair.generate();

  let tx = await chainProgram.methods
    .initializeVerifyResult()
    .accounts({
        verifyResult: verifyResultAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
    .signers([verifyResultAccount])
    .rpc({ commitment: "confirmed" });

  let account = await chainProgram.account.verifyResult.fetch(verifyResultAccount.publicKey);
  console.log("Verify result =", account.result)

  tx = await callerProgram.methods
    .cpiCallVerifyProofForBlock(seed, proofs, key, value)
    .accounts({
      cpiReturn: verifyResultAccount.publicKey,
      cpiReturnProgram: chainProgram.programId,
      block: blockPda,
    })
    .rpc({ commitment: "confirmed" });

  account = await chainProgram.account.verifyResult.fetch(verifyResultAccount.publicKey);
  console.log("Verify result =", account.result)
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

