const sdk = require('./initialize-sdk.js');

(async () => {
  try {
    const token = await sdk.getContract(
      '0xd8B0E181cb194EFDe43D838b6D3BaDf5Fd992915',
      'token'
    );

    const amount = 1_000_000;
    await token.mint(amount);
    const totalSupply = await token.totalSupply();

    console.log(
      '✅ Agora temos',
      totalSupply.displayValue,
      '$COFF em circulação'
    );
  } catch (error) {
    console.error('Falha ao imprimir o dinheiro', error);
  }
})();
