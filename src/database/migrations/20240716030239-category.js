'use strict';

const { STRING } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('categorias',
     { 
      id:{ 
        type: Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true 
      },
      nome:{
        type: Sequelize.STRING,
        allowNull:false
      },
      descricao:{
        type:Sequelize.STRING,
        allowNull:true
      },
      estado:{
        type:Sequelize.STRING,
      },
      created_at:{
        type: Sequelize.DATE
      },
      updated_at:{
        type: Sequelize.DATE
      }
    });
     
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('categorias');
  }
};
