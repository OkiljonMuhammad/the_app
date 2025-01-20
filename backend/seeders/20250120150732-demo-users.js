'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', [
      { name: 'Alex Clare', email: 'a_clare42@gmail.com', lastSeen: new Date(), role: null, blocked: false, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Jim Morrison', email: 'dmtimer9@dealyaari.com', lastSeen: new Date(), role: 'CFO, Meta Platforms, Inc.', blocked: false, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Nina Simone', email: 'marishabelin@giftcode-ao.com', lastSeen: new Date('2024-10-12T15:45:30Z'), role: 'Regional Manager, Amazon.com, Inc.',blocked: false, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Frank Zappa', email: 'zappa_f@citybank.com', lastSeen: new Date(), role: 'Architect, Meta Platforms, Inc.', blocked: false, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
