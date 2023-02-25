const sdk = require('./initialize-sdk.js');
const { MaxUint256 } = require('@ethersproject/constants');

(async () => {
  try {
    const editionDrop = await sdk.getContract(
      '0x6550E9AB550cdc932C77E6Bb6D20BC8533348430',
      'edition-drop'
    );

    const claimConditions = [
      {
        startTime: new Date(),
        maxQuantity: 50_000,
        price: 0,
        quantityLimitPerTransaction: 1,
        waitInSeconds: MaxUint256,
      },
    ];

    await editionDrop.claimConditions.set('0', claimConditions);

    console.log('✅ Condições de reivindicação configuradas com sucesso!');
  } catch (error) {
    console.error('Falha ao definir condições de reivindicação', error);
  }
})();
