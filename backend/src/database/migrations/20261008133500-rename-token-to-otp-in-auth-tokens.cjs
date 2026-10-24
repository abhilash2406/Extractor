'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('auth_tokens');
    if (tableInfo.token && !tableInfo.otp) {
      await queryInterface.renameColumn('auth_tokens', 'token', 'otp');
    } else if (!tableInfo.otp) {
      await queryInterface.addColumn('auth_tokens', 'otp', {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('auth_tokens');
    if (tableInfo.otp && !tableInfo.token) {
      await queryInterface.renameColumn('auth_tokens', 'otp', 'token');
    }
  }
};
