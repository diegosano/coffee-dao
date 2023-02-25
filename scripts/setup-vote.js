const sdk = require( "./initialize-sdk.js");

(async () => {
  try {
    const vote = await sdk.getContract("0xe054E06DbFaC2a98DdC717340832b1f2F6629973", "vote");
    const token = await sdk.getContract("0xd8B0E181cb194EFDe43D838b6D3BaDf5Fd992915", "token");
    await token.roles.grant("minter", vote.getAddress());

    console.log(
      "✅  Módulo de votos recebeu permissão de manipular os tokens com sucesso"
    );
  } catch (error) {
    console.error(
      "falha ao dar acesso aos tokens ao módulo de votos",
      error
    );
    process.exit(1);
  }

  try {
    const vote = await sdk.getContract("0xe054E06DbFaC2a98DdC717340832b1f2F6629973", "vote");
    const token = await sdk.getContract("0xd8B0E181cb194EFDe43D838b6D3BaDf5Fd992915", "token");
    const ownedTokenBalance = await token.balanceOf(
      process.env.WALLET_ADDRESS
    );

    const ownedAmount = ownedTokenBalance.displayValue;
    const percent90 = Number(ownedAmount) / 100 * 90;

    await token.transfer(
      vote.getAddress(),
      percent90
    ); 

    console.log("✅ Transferiu " + percent90 + " tokens para o módulo de votos com sucesso");
  } catch (err) {
    console.error("falhar ao transferir tokens ao módulo de votos", err);
  }
})();
