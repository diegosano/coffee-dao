const sdk = require('./initialize-sdk.js');

(async () => {
  try {
    const token = await sdk.getContract('0xd8B0E181cb194EFDe43D838b6D3BaDf5Fd992915', 'token');
    const allRoles = await token.roles.getAll();

    console.log('๐ Papeis que existem agora:', allRoles);

    await token.roles.setAll({ admin: [], minter: [] });

    console.log(
      '๐ Papeis depois de remover nรณs mesmos',

      await token.roles.getAll()
    );

    console.log('โ Revogados nossos super-poderes sobre os tokens ERC-20');
  } catch (error) {
    console.error(
      'Falha ao remover nossos direitos sobre o tesouro da DAO',
      error
    );
  }
})();
