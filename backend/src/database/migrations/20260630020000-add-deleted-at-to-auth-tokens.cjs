'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('auth_tokens', 'status', {
      type: Sequelize.ENUM('ACTIVE', 'BLOCKED', 'INACTIVE', 'DELETED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('auth_tokens', 'status');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_auth_tokens_status";');
  }
};
