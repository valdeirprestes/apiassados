'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('usuarios',
      { 
      id:{ 
          type:Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
      },
      nome:{
          type:Sequelize.STRING,
          allowNull: false,
      },
      email:{
          type: Sequelize.STRING,
          allowNull: true,
          unique: true
      },
      senha_criptografada:{
          type: Sequelize.STRING
      },
      cpf:{
          type: Sequelize.STRING,
      },
      perfil:{
          type: Sequelize.STRING,
          allowNull:false
      },
      telefone:{
          type: Sequelize.STRING,
      },
      celular:{
          type: Sequelize.STRING,
      },
      cep:{
          type :Sequelize.STRING,
      },
      logradouro:{
          type:Sequelize.STRING,
      },
      numero:{
          type:Sequelize.STRING,
      },
      municipio:{
          type:Sequelize.STRING,
      },
      uf:{
          type:Sequelize.STRING,
      },
      data_nascimento:{
          type: Sequelize.DATE,
      },
      sexo:{
          type: Sequelize.STRING,
      },
      estado:{
          type:Sequelize.STRING,
      },
      ativo:{
          type: Sequelize.STRING,
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
    await queryInterface.dropTable('usuarios');     
  }
};
