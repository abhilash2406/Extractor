'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resume_versions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      resume_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'resumes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      version_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      content: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      template_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'templates',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      file: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });

    await queryInterface.addIndex('resume_versions', ['resume_id', 'version_number'], {
      unique: true,
      name: 'resume_versions_resume_id_version_number_unique',
    });

    await queryInterface.addIndex('resume_versions', ['resume_id'], {
      name: 'resume_versions_resume_id_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('resume_versions');
  },
};

