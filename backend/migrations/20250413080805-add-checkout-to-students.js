'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('students', 'check_in', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('students', 'check_out', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('students', 'check_in');
    await queryInterface.removeColumn('students', 'check_out');
  }
};