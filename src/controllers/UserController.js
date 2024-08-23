import UserModel from "../models/UserModel";
import * as lodash from "lodash";
import { Op } from "sequelize";
import funcPage from "../utils/funcPage";
import errodeRota from "../utils/errodeRota";


class UserController
{

    async post(req, res)
    {
        try
        {
            const user = await UserModel.findOne({while:{email:req.body.email}});
            if(user){
                return res.status(400).json({"errors":[`O campo email  ${req.body.email} já foi cadastrado`]});
            }
            const newuser = await UserModel.create(req.body);
            const user2 = await UserModel.findByPk(newuser.id, {attributes: {exclude: ['senha_criptografada']}});
            return res.status(201).json(user2);
        } catch (e) 
        {
            return errodeRota(e, req, res);
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
            return errodeRota(e, req, res);
        }
    }
    async getuser(req, res){
        try {
            console.log("getuser");
            const id = req.params.id;
            const user = await UserModel.findByPk(id, {attributes: {exclude: ['senha_criptografada']}});
            return res.status(200).json(user);
        } catch (e) {
            return errodeRota(e, req, res);
        }
    }

    async getall(req, res)
    {
        try 
        {   
            const lstfiltroslike = ["nome", "celular", "telefone","email"];
            const lstfiltrosequal = ["perfil","sexo", "estado", "ativo"];
            const {help} = req.body;
            if(help)
                return res.status(200).json({
                    "filtroslike":lstfiltroslike, 
                    "filtroequal":lstfiltrosequal,
                    "paginador":"'qtdpagina' e 'pagina' "
                });
            const {pagina, qtdpagina}= req.body;
            const paginador = funcPage(qtdpagina,pagina);
            let filtroslike = {};
            lstfiltroslike.forEach((namefiltro) => {
                let newfiltro =lodash.get(req.body, namefiltro,"");
                if(newfiltro != "")
                    filtroslike = {...filtroslike, [namefiltro]:{[Op.like]:`%${newfiltro}%`}};
            });
            let filtrosequal = {};
            lstfiltrosequal.forEach((namefiltro) => {
                let newfiltro =lodash.get(req.body, namefiltro,"");
                if(newfiltro != "")
                    filtrosequal = {...filtrosequal, [namefiltro]:{[Op.eq]:newfiltro}};
            });
            let todosfiltros= {}
            if(Object.keys(filtroslike).length > 0)
                todosfiltros = {[Op.or]:filtroslike }; 
            if(Object.keys(filtrosequal).length > 0)
                todosfiltros = {...todosfiltros, ...filtrosequal};
            let users;
            if(Object.getOwnPropertySymbols(todosfiltros).length == 0 )
                users = await UserModel.findAll({
                    attributes: {exclude: ['senha_criptografada']},
                    ...paginador
                });
            else
                users = await UserModel.findAll(
                {
                    attributes: {exclude: ['senha_criptografada']},
                    where:todosfiltros,
                    ...paginador
                }
            );
            return res.status(200).json(users);
            
        } catch (e)
        {
            return errodeRota(e, req, res);
        }
  
    }

    async countuser (req, res){
        try 
        {   
			  console.log(req.body);
            const lstfiltroslike = ["nome", "celular", "telefone","email" ];
            const lstfiltrosequal = ["perfil","sexo", "estado", "ativo"];
            const {help} = req.body;
            if(help)
                return res.status(200).json({
                    "filtroslike":lstfiltroslike, 
                    "filtroequal":lstfiltrosequal
                });
            let filtroslike = {};
            lstfiltroslike.forEach((namefiltro) => {
                let newfiltro =lodash.get(req.body, namefiltro,"");
                if(newfiltro != "")
                    filtroslike = {...filtroslike, [namefiltro]:{[Op.like]:`%${newfiltro}%`}};
            });
            let filtrosequal = {};
            lstfiltrosequal.forEach((namefiltro)=>{
                let newfiltro = lodash.get(req.body,namefiltro,"");
                if(newfiltro != "")
                    filtrosequal = {...filtrosequal, [namefiltro]:{[Op.eq]:newfiltro}};

            });
            let todosfiltros= {}
            if(Object.keys(filtroslike).length > 0)
                todosfiltros = {[Op.or]:filtroslike }; 
            if(Object.keys(filtrosequal).length > 0)
                todosfiltros = {...todosfiltros, ...filtrosequal};      
            
            let countusers;
            if(Object.getOwnPropertySymbols(todosfiltros).length == 0 )
                countusers = await UserModel.count({});
            else
                countusers = await UserModel.count({ where:todosfiltros});
            return res.status(200).json({quantidade:countusers});
            
        } catch (e)
        {
            return errodeRota(e, req, res);
        }

    }


}

export default new UserController();
