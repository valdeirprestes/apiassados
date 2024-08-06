import UserModel from "../models/UserModel";
import * as lodash from "lodash";
import { Op } from "sequelize";



class UserController
{

    async post(req, res)
    {
        try
        {
            const newuser = await UserModel.create(req.body);
            const user2 = await UserModel.findByPk(newuser.id, {attributes: {exclude: ['senha_criptografada']}});
            return res.status(201).json(user2);
        } catch (e) 
        {
            console.log(e);
            return res.status(400).json({"errors":e.errors.map(err => err.message)});
        }
    }
    async update(req, res){
        try {
            const id = req.params.id;
            const user = await UserModel.findByPk(id);
            if(!user){
                return res.status(400).json({"errors":[`Não existem usuário com id ${id}`]});
            }
            const userupdate = await user.update(req.body, {attributes: {exclude: ['senha_criptografada']}});
            const user2 = await UserModel.findByPk(userupdate.id, {attributes: {exclude: ['senha_criptografada']}});
            return res.status(201).json(user2);  
        } catch (e) {
            console.log(e);
            return res.status(400).json({"errors":e.errors.map(err => err.message)});
        }
    }
    async getuser(req, res){
        try {
            
            const id = req.params.id;
            const user = await UserModel.findByPk(id, {attributes: {exclude: ['senha_criptografada']}});
            return res.status(200).json(user);
        } catch (e) {
            return res.status(400).json(null);
        }
    }

    async getall(req, res)
    {
        try 
        {   
            const lstfiltros = ["nome", "celular", "telefone","perfil","email", "sexo","estado", "ativo" ];
            let filtros = {};
            lstfiltros.forEach((namefiltro) => {
                let newfiltro =lodash.get(req.body, namefiltro,"");
                if(newfiltro != "")
                    filtros = {...filtros, [namefiltro]:{[Op.like]:`%${newfiltro}%`}};
            });
            const users = await UserModel.findAll(
                {
                    attributes: {exclude: ['senha_criptografada']},
                    where:filtros
                }
            );
            return res.status(200).json(users);
            
        } catch (e)
        {
            return res.status(400).json({"errors":e.errors.map(err => err.message)});
        }
  
    }


}

export default new UserController();