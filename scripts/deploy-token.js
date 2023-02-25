const { AddressZero } = require('@ethersproject/constants');
const sdk = require('./initialize-sdk.js');

(async () => {
  try {
    const tokenAddress = await sdk.deployer.deployToken({
      name: 'Token de Governança da CoffeeDAO',
      symbol: 'COFF',
      primary_sale_recipient: AddressZero,
    });

    console.log(
      '✅ Módulo de token implantado com sucesso. Endereço:',
      tokenAddress
    );
  } catch (error) {
    console.error('falha ao implantar módulo do token', error);
  }
})();
