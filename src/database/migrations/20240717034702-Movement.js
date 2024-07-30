'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('movimentos', 
    { 
      id:{ 
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement : true,
        primaryKey:true
      },
      estado:{
        type:Sequelize.STRING,
        defaultValue: 'NORMAL',
    },
    data:{
        type:Sequelize.DATE,
        allowNull:false,
    },
    operacao:{
        type:Sequelize.STRING,
    },
    idusuario:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'usuarios',
        key:'id'
      }
    },
    idusuarioalt:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'usuarios',
        key:'id'
      }
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
    await queryInterface.dropTable('movimentos');
  }
};
