'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('produtos', 
    { 
      id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
      },
      nome:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      idcategoria:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"categorias",
          key:"id"
        }
      },
      preco:{
        type: Sequelize.DECIMAL(10,2),
        allowNull:false
      },
      foto:{
        type:Sequelize.STRING,
        defaultValue:''
      },
      item_fechamento:{
        type: Sequelize.STRING,
        defaultValue:"NAO"
      },
      estado:{
        type:Sequelize.STRING,
      },
      created_at:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('produtos');
  }
};
