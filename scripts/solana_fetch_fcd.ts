const anchor = require('@project-serum/anchor');
const { Program } = require('@project-serum/anchor');
const { PublicKey } = require('@solana/web3.js');
const { LeafValueCoder, LeafKeyCoder } = require('@umb-network/toolbox');

const programId = "9agqAPFMkmekbTT4tcz8NCjL4WT2Ccpu8ayn1SGzVwC3";

const IDL = JSON.parse(
  require("fs").readFileSync("./artifacts/solana-idl/chain.json", "utf8")
);

const main = async() => {

  const provider = anchor.AnchorProvider.local("https://api.devnet.solana.com");
  anchor.setProvider(provider);

  let program = new Program(
    IDL,
    new PublicKey(programId),
    provider
  );

  let pair = 'BTC-USD'; 
  let seed = LeafKeyCoder.encode(pair);

  /*  We derive the Program Derived Account (PDA) for
   *  fetching the data stored on the account
   */
  let [fcdPda, _] = await PublicKey.findProgramAddress(
    [seed], program.programId
  );

  const fcd = await program.account.firstClassData.fetch(fcdPda);
  let value = LeafValueCoder.decode('0x' + Buffer.from(fcd.value).toString('hex'), pair);

  console.log(`\n${pair} - ${value} - ${new Date(fcd.timestamp * 1000)}\n`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

