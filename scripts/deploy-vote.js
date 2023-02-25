const sdk = require( "./initialize-sdk.js");

(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      name: "COFFDAO - A DAO dos amantes de café",
      voting_token_address: "0xd8B0E181cb194EFDe43D838b6D3BaDf5Fd992915",
      voting_delay_in_blocks: 0,
      voting_period_in_blocks: 6570,
      voting_quorum_fraction: 0,
      proposal_token_threshold: 0,
    });

    console.log(
      "✅ Módulo de votos implantado com sucesso no endereço:",
      voteContractAddress,
    );
  } catch (err) {
    console.error("Falha ao implantar o módulo de votos", err);
  }
})();
