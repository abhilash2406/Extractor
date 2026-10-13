'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create templates table
    await queryInterface.createTable('templates', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      thumbnail_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Modern',
      },
      layout_config: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      design_config: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      status: {
        type: Sequelize.ENUM('draft', 'published', 'archived'),
        allowNull: false,
        defaultValue: 'draft',
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

    // 2. Add columns to resumes table if not exists
    const tableInfo = await queryInterface.describeTable('resumes');

    if (!tableInfo.template_id) {
      await queryInterface.addColumn('resumes', 'template_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'templates',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }

    if (!tableInfo.title) {
      await queryInterface.addColumn('resumes', 'title', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Untitled Resume',
      });
    }

    if (!tableInfo.content) {
      await queryInterface.addColumn('resumes', 'content', {
        type: Sequelize.JSONB,
        allowNull: true,
      });
    }

    // Change file column to nullable if necessary
    if (tableInfo.file && tableInfo.file.allowNull === false) {
      await queryInterface.changeColumn('resumes', 'file', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const tableInfo = await queryInterface.describeTable('resumes');

    if (tableInfo.content) {
      await queryInterface.removeColumn('resumes', 'content');
    }
    if (tableInfo.title) {
      await queryInterface.removeColumn('resumes', 'title');
    }
    if (tableInfo.template_id) {
      await queryInterface.removeColumn('resumes', 'template_id');
    }

    await queryInterface.dropTable('templates');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_templates_status";');
  },
};
