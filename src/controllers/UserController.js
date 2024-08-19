import UserModel from "../models/UserModel";
import * as lodash from "lodash";
import { Op } from "sequelize";
import funcPage from "../utils/funcPage";



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
			const {errors} = e;
			if(errors)
				return res.status(400).json(e.errors.map(err => err.message));
			return res.status(500).json({"errors":['Error interno na API']});
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
			const {errors} = e;
			if(errors)
				return res.status(400).json(e.errors.map(err => err.message));
			return res.status(500).json({"errors":['Error interno na API']});
        }
    }
    async getuser(req, res){
        try {
            
            const id = req.params.id;
            const user = await UserModel.findByPk(id, {attributes: {exclude: ['senha_criptografada']}});
            return res.status(200).json(user);
        } catch (e) {
            console.log(e);
			const {errors} = e;
			if(errors)
				return res.status(400).json(e.errors.map(err => err.message));
			return res.status(500).json({"errors":['Error interno na API']});
        }
    }

    async getall(req, res)
    {
        try 
        {   
            const lstfiltros = ["nome", "celular", "telefone","perfil","email", "sexo","estado", "ativo" ];
            const {help} = req.body;
            if(help)
                return res.status(200).json({
                    "filtros":lstfiltros, 
                    "tipo":"Like SQL",
                    "paginador":"'qtdpagina' e 'pagina' "
                });
            const {pagina, qtdpagina}= req.body;
            const paginador = funcPage(qtdpagina,pagina);
            let filtros = {};
            lstfiltros.forEach((namefiltro) => {
                let newfiltro =lodash.get(req.body, namefiltro,"");
                if(newfiltro != "")
                    filtros = {...filtros, [namefiltro]:{[Op.like]:`%${newfiltro}%`}};
            });
            let users;
            if(Object.keys(filtros).length == 0 )
                users = await UserModel.findAll({
                    attributes: {exclude: ['senha_criptografada']},
                    ...paginador
                });
            else
                users = await UserModel.findAll(
                {
                    attributes: {exclude: ['senha_criptografada']},
                    where:{[Op.or]:filtros},
                    ...paginador
                }
            );
            return res.status(200).json(users);
            
        } catch (e)
        {
            console.log(e);
			const {errors} = e;
			if(errors)
				return res.status(400).json(e.errors.map(err => err.message));
			return res.status(500).json({"errors":['Error interno na API']});
        }
  
    }


}

export default new UserController();