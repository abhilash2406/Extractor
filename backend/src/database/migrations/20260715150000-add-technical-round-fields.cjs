'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Update questions table
    await queryInterface.addColumn('questions', 'type', {
      type: Sequelize.ENUM('MCQ', 'PROGRAMMING'),
      defaultValue: 'MCQ',
      allowNull: false,
    });

    await queryInterface.changeColumn('questions', 'option_a', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('questions', 'option_b', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('questions', 'option_c', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('questions', 'option_d', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('questions', 'correct_answer', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Should match option_a, option_b, option_c, or option_d exactly or hold a key identifier',
    });

    // 2. Update tests table
    await queryInterface.addColumn('tests', 'test_type', {
      type: Sequelize.ENUM('APTITUDE', 'TECHNICAL'),
      defaultValue: 'APTITUDE',
      allowNull: false,
    });

    // 3. Update test_answers table
    await queryInterface.changeColumn('test_answers', 'selected_answer', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('test_answers', 'language', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Revert questions table
    await queryInterface.changeColumn('questions', 'correct_answer', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('questions', 'option_d', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('questions', 'option_c', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('questions', 'option_b', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('questions', 'option_a', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.removeColumn('questions', 'type');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_questions_type";');

    // 2. Revert tests table
    await queryInterface.removeColumn('tests', 'test_type');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_tests_test_type";');

    // 3. Revert test_answers table
    await queryInterface.removeColumn('test_answers', 'language');
    await queryInterface.changeColumn('test_answers', 'selected_answer', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
