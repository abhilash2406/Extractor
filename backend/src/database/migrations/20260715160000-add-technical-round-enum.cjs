'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding the 'technical_round' value to the enum_applications_status ENUM
    // Using a raw query because Sequelize queryInterface doesn't have a direct method to add enum values in Postgres
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_applications_status" ADD VALUE IF NOT EXISTS 'technical_round';`
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Removing an ENUM value in Postgres is complex and not straightforward without dropping and recreating the entire type/column.
    // Since this is just an addition, we leave down empty, or we could handle it by reverting to the previous state.
    // For safety, no action is taken on down.
  }
};
