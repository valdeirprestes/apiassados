'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('fechamovimentos',
      { 
        id:{
          type:Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        idmov:
        {
         type: Sequelize.INTEGER,
         references:{
          model:'movimentos',
          key:'id'
         }
        },
        idusuario:
        {
          type: Sequelize.INTEGER,
          references:{
            model:'usuarios',
            key:'id'
          }
        },
        estado:{
          type:Sequelize.STRING,
          defaultValue: 'NORMAL',
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
      });
      
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('fechamovimentos');
  }
};
