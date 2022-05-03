const anchor = require('@project-serum/anchor');
const {Program} = require('@project-serum/anchor');
const {PublicKey, SystemProgram} = require('@solana/web3.js');
const {LeafValueCoder} = require('@umb-network/toolbox');

const programId = "9agqAPFMkmekbTT4tcz8NCjL4WT2Ccpu8ayn1SGzVwC3";

const IDL = JSON.parse(
  require("fs").readFileSync("../artifacts/solana-idl/chain.json", "utf8")
);

const main = async() => {

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  let program = new Program(
    IDL,
    new PublicKey(programId),
    provider
  );

  let blockId = 517349;
  const seed = LeafValueCoder.encode(blockId, '');

  const [blockPda, bump] = await PublicKey.findProgramAddress(
    [seed], program.programId
  );

  const block = await program.account.block.fetch(blockPda);
  const blockRoot = '0x' + Buffer.from(block.root).toString('hex');

  console.log(`Block ID = ${blockId} root = ${blockRoot}`);
  console.log(`timestamp = ${new Date(block.timestamp * 1000)}`);

  let proofs = [
    LeafValueCoder.encode("0x8aa4e4134178289504b4b6c7c85527b41905cf3d51ad95eaec44a87fbe773b82", 'FIXED_'),
    LeafValueCoder.encode("0x2555c92539183bfa28387c6e98403aeb44f8b7602d0580e4679f2432405b62b1", 'FIXED_'),
    LeafValueCoder.encode("0x6bb2d161e2d374a8aa779e0c61ecef7e82b7a6ba6543bf997212ea164c7ec540", 'FIXED_'),
    LeafValueCoder.encode("0xe3cd6c525d52487eb7439d1042dbd917a9b421fd2656a98a6f8af593fd4f4453", 'FIXED_'),
    LeafValueCoder.encode("0x39afef9403f6ccd794a1bf6c48a55a0d4164d8ab9f32992410f62629bd57a6b7", 'FIXED_'),
    LeafValueCoder.encode("0x72d0fddd950ac6ce7f54a48d4003843d526ee02fc21d8c305012bdd17f7058af", 'FIXED_'),
    LeafValueCoder.encode("0xfb1199eb1639a574b06bd4f2fc619a9004fb55dd9016c6b24c4c79498a24099f", 'FIXED_'),
    LeafValueCoder.encode("0xfa9e1fb3aa77f7249c18bd4dbd99bd9c3766a6bf6ab00eac7d5380732059566a", 'FIXED_'),
    LeafValueCoder.encode("0x81b18433beaada4ee9a058a3eb1580498a61789809abb60517ec0ca5e0bcf948", 'FIXED_'),
    LeafValueCoder.encode("0xa8440a4bf999006045d796a91e23fec4b23eee861ba9735d41dc804a76ae0643", 'FIXED_'),
    LeafValueCoder.encode("0xdcec74631415edf80085bdb0907dfb4dd6928db21ebe31b201b1c61cd5a6b412", 'FIXED_'),
    LeafValueCoder.encode("0xe1c181e05f242407fcce79feb83cad315d8d86e5d668f8fa8586d92f7eab082e", 'FIXED_')
  ];

  let key = LeafValueCoder.encode("0x000000000000000000000000000000000000000000000031494e43482d444149", 'FIXED_');
  let value = LeafValueCoder.encode("0x000000000000000000000000000000000000000000000000259ae7ce85275000", 'FIXED_');

  const verifyResultAccount = anchor.web3.Keypair.generate();

  let tx = await program.methods
    .initializeVerifyResult()
    .accounts({
        verifyResult: verifyResultAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
    .signers([verifyResultAccount])
    .rpc({ commitment: "confirmed" });

  let account = await program.account.verifyResult.fetch(verifyResultAccount.publicKey);
  console.log("Verify result =", account.result)

  tx = await program.methods
    .verifyProofForBlock(seed, proofs, key, value)
    .accounts({
        verifyResult: verifyResultAccount.publicKey,
        block: blockPda,
      })
    .rpc({commitment: "confirmed"})

  account = await program.account.verifyResult.fetch(verifyResultAccount.publicKey);
  console.log("Verify result =", account.result)
};

main();

export {};
