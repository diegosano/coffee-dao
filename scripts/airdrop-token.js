const sdk = require('./initialize-sdk.js');

(async () => {
  try {
    const editionDrop = await sdk.getContract(
      '0x6550E9AB550cdc932C77E6Bb6D20BC8533348430',
      'edition-drop'
    );

    const token = await sdk.getContract('0xd8B0E181cb194EFDe43D838b6D3BaDf5Fd992915', 'token');

    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

    if (walletAddresses.length === 0) {
      console.log(
        'Ninguém mintou o NFT ainda, peça para alguns amigos fazerem isso e ganhar um NFT de graça!'
      );

      process.exit(0);
    }

    const airdropTargets = walletAddresses.map((address) => {
      const randomAmount = Math.floor(
        Math.random() * (10000 - 1000 + 1) + 1000
      );

      console.log('✅ Vai enviar', randomAmount, 'tokens para ', address);

      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      };

      return airdropTarget;
    });

    console.log('🌈 Começando o airdrop...');

    await token.transferBatch(airdropTargets);

    console.log('✅ Feito o airdrop de tokens para todos os donos de NFT!');
  } catch (err) {
    console.error('O airdrop de tokens falhou', err);
  }
})();
