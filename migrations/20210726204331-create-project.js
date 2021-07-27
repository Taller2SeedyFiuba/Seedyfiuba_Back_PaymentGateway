'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('projects', {
      projectid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerid: {
        type: Sequelize.STRING
      },
      smcid: {
        type: Sequelize.INTEGER
      }
    });
    await queryInterface.addConstraint('projects', {
      type: 'foreign key',
      name: 'fkey_ownerid',
      fields: ['ownerid'],
      references: { //Required field
        table: 'wallets',
        field: 'ownerid'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('projects', 'fkey_ownerid');
    await queryInterface.dropTable('projects');
  }
};