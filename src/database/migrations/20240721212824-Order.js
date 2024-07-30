'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('pedidos', { 
    id:{ 
      type:Sequelize.INTEGER,
      allowNull:false,
      autoIncrement:true,
      primaryKey:true
    },
    idcliente:{
      type: Sequelize.INTEGER,
      allowNull:false,
      references:{
        model:"usuarios",
        key:"id"
      },
    },
    idusuario:{
      type: Sequelize.INTEGER,
      allowNull:false,
      references:{
        model:"usuarios",
        key:"id"
      },
    },
    idusuarioalt:{
      type: Sequelize.INTEGER,
      allowNull:false,
      references:{
        model:"usuarios",
        key:"id"
      },
    },
    fase:{
      type:Sequelize.STRING,

    },
    status_pagamento:{
      type:Sequelize.STRING
    },
    datamovimento:{
      type: Sequelize.DATE
    },
    estado:{
      type:Sequelize.STRING
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
    await queryInterface.dropTable('pedidos');
  }
};
