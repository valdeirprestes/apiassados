'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('itenspedidos', 
    { 
      id:{ 
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
      },
      idpedido:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'pedidos',
          key:'id'
        }
      },
        idproduto:{
          type: Sequelize.INTEGER,
          allowNull:false,
          references:{
            model:'produtos',
            key:'id'
          }
      },
      preco:{
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      quantidade:{
        type:Sequelize.DECIMAL(10,2),
        allowNull:false
      },
      subtotal:{
        type:Sequelize.DECIMAL(10,2),
        allowNull:false
      },
      edicao:{
        type:Sequelize.INTEGER
      },
      estado:{
        type:Sequelize.STRING,
        allowNull:false
      },
      created_at:
      {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('itenspedidos');
  }
};
