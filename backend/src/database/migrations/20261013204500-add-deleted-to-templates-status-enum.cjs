'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add 'deleted' to enum_templates_status in PostgreSQL
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_templates_status" ADD VALUE IF NOT EXISTS 'deleted';`
    );
  },

  async down(queryInterface, Sequelize) {
    // Reverting an enum value in Postgres is not supported directly without dropping the type.
  },
};
