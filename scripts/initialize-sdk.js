const { ThirdwebSDK } = require('@thirdweb-dev/sdk');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === '') {
  console.log('🛑 Chave privada não encontrada.');
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === '') {
  console.log('🛑 Alchemy API não encontrada.');
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === '') {
  console.log('🛑 Endereço de carteira não encontrado.');
}

const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.PRIVATE_KEY,
  process.env.ALCHEMY_API_URL
);

(async () => {
  try {
    const address = await sdk.getSigner()?.getAddress();

    console.log('👋 SDK inicializado pelo endereço:', address);
  } catch (err) {
    console.error('Falha ao buscar apps no sdk', err);

    process.exit(1);
  }
})();

module.exports = sdk
