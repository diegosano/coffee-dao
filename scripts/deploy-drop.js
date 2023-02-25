const { AddressZero } = require('@ethersproject/constants');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const sdk = require('./initialize-sdk.js');

(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      name: 'Membro da CoffeeDAO',
      description: 'A DAO dos amantes de café',
      image: readFileSync(
        path.join(__dirname, '..', 'src', 'assets', 'coffee.jpg')
      ),
      primary_sale_recipient: AddressZero,
    });

    const editionDrop = await sdk.getContract(
      editionDropAddress,
      'edition-drop'
    );
    const metadata = await editionDrop.metadata.get();

    console.log(
      '✅ Contrato editionDrop implantado com sucesso, endereço:',

      editionDropAddress
    );

    console.log('✅ bundleDrop metadados:', metadata);
  } catch (error) {
    console.log('falha ao implantar contrato editionDrop', error);
  }
})();
