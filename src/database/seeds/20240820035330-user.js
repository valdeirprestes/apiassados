'use strict';
const { faker } = require("@faker-js/faker");
const bcryptjs = require("bcryptjs");


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let lista=[]
    let perfils = ["ADM", "ATENDENTE","CLIENTE"];
    /*Usuario padrão*/ 
    lista.push({
      "nome": 'Usuario',
      "email":'usuario@gmail.com',
      "senha_criptografada":await bcryptjs.hash("senha123", 8 ),
      "perfil":'ADM',
      "estado": "NORMAL",
      "sexo": "MASCULINO",
      "ativo":"SIM",
      "created_at": new Date(),
      "updated_at": new Date(),
    });


    for(let x=0; x < perfils.length ; x++ ){
      for(let y = 0 ; y < 10 ; y++ ){
        lista.push({
          "nome": faker.internet.userName(),
          "email":faker.internet.email(),
          "senha_criptografada":await bcryptjs.hash("senha123", 8 ),
          "perfil":perfils[x],
          "estado": "NORMAL",
          "sexo": "MASCULINO",
          "ativo":"SIM",
          "created_at": new Date(),
          "updated_at": new Date(),
        });
      } 
    }
    await queryInterface.bulkInsert('usuarios', lista , {});
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};
