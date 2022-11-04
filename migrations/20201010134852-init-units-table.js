'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //adding m2 to following e999Id 's: 244, 239, 242, 1277, 243
    //adding cm to following e999Id 's: 237, 
    //adding ha to following e999Id 's: 245, 
    //adding bal to following e999Id 's: 586, 
    // await queryInterface.upsert('details', {units: 'cm'}, {units: 'm2'}, {e999Id: 237})
    await queryInterface.bulkUpdate('details', {units: 'm2'}, {
      e999Id: [244, 239, 242, 1277, 243]
    })
    await queryInterface.bulkUpdate('details', {units: 'cm'}, {
      e999Id: 237
    })
    await queryInterface.bulkUpdate('details', {units: 'ha'}, {
      e999Id: 245
    })
    await queryInterface.bulkUpdate('details', {units: 'bal'}, {
      e999Id: 586
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate('details', {units: null}, {
      e999Id: [244, 239, 242, 1277, 243]
    })
    await queryInterface.bulkUpdate('details', {units: null}, {
      e999Id: 237
    })
    await queryInterface.bulkUpdate('details', {units: null}, {
      e999Id: 245
    })
    await queryInterface.bulkUpdate('details', {units: null}, {
      e999Id: 586
    })
  }
};
