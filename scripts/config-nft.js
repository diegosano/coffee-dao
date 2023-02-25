const sdk = require('./initialize-sdk.js');
const path = require('node:path');
const { readFileSync } = require('fs');

(async () => {
  try {
    const editionDrop = await sdk.getContract(
      '0x6550E9AB550cdc932C77E6Bb6D20BC8533348430',
      'edition-drop'
    );
    await editionDrop.createBatch([
      {
        name: 'CoffeeDAO Token',
        description: 'Este NFT garante acesso ao CoffeeDAO',
        image: readFileSync(
          path.join(__dirname, '..', 'src', 'assets', 'coffee.jpg')
        ),
      },
    ]);
    console.log('✅ Novo NFT criado com sucesso!');
  } catch (error) {
    console.error('falha ao criar o novo NFT', error);
  }
})();
