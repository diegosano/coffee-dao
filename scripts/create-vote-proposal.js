const sdk = require('./initialize-sdk.js');
const { ethers } = require('ethers');

(async () => {
  try {
    const vote = await sdk.getContract('0xe054E06DbFaC2a98DdC717340832b1f2F6629973', 'vote');
    const token = await sdk.getContract('0xd8B0E181cb194EFDe43D838b6D3BaDf5Fd992915', 'token');
    const amount = 420_000;

    const description =
      'Mintar para a DAO uma quantidade adicional de ' +
      amount +
      ' tokens no tesouro?';

    const executions = [
      {
        toAddress: token.getAddress(),
        nativeTokenValue: 0,
        transactionData: token.encoder.encode('mintTo', [
          vote.getAddress(),

          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
      },
    ];

    await vote.propose(description, executions);

    console.log('✅ Proposta de cunhar tokens criada com sucesso!');
  } catch (error) {
    console.error('falha ao criar primeira proposta', error);

    process.exit(1);
  }

  try {

    const vote = await sdk.getContract('0xe054E06DbFaC2a98DdC717340832b1f2F6629973', 'vote');
    const token = await sdk.getContract('0xd8B0E181cb194EFDe43D838b6D3BaDf5Fd992915', 'token');
    const amount = 6_900;

    const description =
      'A DAO deveria transferir ' +
      amount +
      ' tokens do tesouro para ' +
      process.env.WALLET_ADDRESS +
      ' por ser uma pessoa incrível?';

    const executions = [
      {
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          'transfer',
          [
            process.env.WALLET_ADDRESS,
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),

        toAddress: token.getAddress(),
      },
    ];

    await vote.propose(description, executions);

    console.log(
      '✅ Proposta de dar prêmio do tesouro para si mesmo criada com sucesso, vamos torcer para votarem sim!'
    );
  } catch (error) {
    console.error('falha ao criar segunda proposta', error);
  }
})();
