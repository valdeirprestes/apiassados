'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('estoque', 
   { 
      id:{
          type:Sequelize.INTEGER,
          allowNull:false,
          autoIncrement:true,
          primaryKey:true
      },
      idproduto:{
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
            model:'produtos',
            key:'id'
        },
      },
      descricao:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      operacao:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      natureza:{
        type:Sequelize.STRING,
        allowNull:false
      },
      entrada:{ 
        type:Sequelize.DECIMAL(10,2), 
        defaultValue:0
      },
      saida:{ 
        type:Sequelize.DECIMAL(10,2), 
        defaultValue:0
      },
      idusuario:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'usuarios',
          key:'id'
        }
      },
      idusuarioalt:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'usuarios',
          key:'id'
        }
      },
      estado:{
        type: Sequelize.STRING,
        allowNull:false
      },
      datamovimento:{
        type: Sequelize.DATE,
        allowNull:false,
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
    await queryInterface.dropTable('estoque');
  }
};
