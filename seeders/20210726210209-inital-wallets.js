'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */


    return queryInterface.bulkInsert('wallets', [{
      ownerid: 'f8MPMhialjZCCB2yUMZjCPG5yTs1',
      address: '0xc954A319011f7b261b41e799D6AaB17EEc7a7DB8',
      privatekey: '0x26999158e88c6853b13c5db9403f855ecfe517bb9c093e4b5682c0f9783ffca3',
      creationdate: '2021-06-29',
    }, {
      ownerid: 'qDzHIJjwNqSm8HEN308LeQXHnbq2',
      address: '0x935E13d6e744Da2F7F84D4348299367d6Cce00d8',
      privatekey: '0x48bc56a0196d9090a6fae0fd426531da067879c1e4b452f0b97354b73562b942',
      creationdate: '2021-06-30',
    }, {
      ownerid: 'C5Jeg8M5HKaIKOqXt5bZX7IdWFk2',
      address: '0x0928ca7FE0D3d224d50C9F85bbF9D73471FCd12B',
      privatekey: '0xc2f3179baaa162ec9a45b18c52b82c8069a361d38e5c00134187695c3194fe01',
      creationdate: '2021-06-30'
    }, {
      ownerid: 'pvs2jwbOFiZN4WOtQBYmr5LzLU53',
      address: '0xf54Be0eD74e75Ebd42A8C6F7fD0e28a906E98671',
      privatekey: '0x855a8450458871681bf9e7ec7af93aad89b5f49174d4ef549f104a541035ccd7',
      creationdate: '2021-06-30'
    }, {
      ownerid: 'sSbHAjsWp8X3mNJ6rd1JtQB4vtU2',
      address: '0xB1697EA67e742FAdaEE83be722bfead035302499',
      privatekey: '0xffff2fe38b4a018b9d6d18d4a13f4eccd53ed874ca97a8ce6aadec5619aac787',
      creationdate: '2021-06-30'
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('wallets',
      { ownerid: {[Op.in]: ['f8MPMhialjZCCB2yUMZjCPG5yTs1', 'qDzHIJjwNqSm8HEN308LeQXHnbq2', 'C5Jeg8M5HKaIKOqXt5bZX7IdWFk2', 'pvs2jwbOFiZN4WOtQBYmr5LzLU53', 'sSbHAjsWp8X3mNJ6rd1JtQB4vtU2']} }
    );
  }
};



