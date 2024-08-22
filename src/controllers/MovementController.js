import MovementModel from "../models/MovementModel";
import CloseMovementModel from "../models/CloseMovementModel";
import * as lodash from "lodash";
import { Op } from "sequelize";
import funcPage from "../utils/funcPage";
import errodeRota from "../utils/errodeRota";
class MovementController
{
    async post(req, res)
    {
        try 
        {   
            let { idusuario, idusuarioalt, ...rest} = req.body;
            idusuarioalt = idusuario;
            const body = { idusuario, idusuarioalt, ...rest};
            const movement = await MovementModel.create(body);
            return res.status(201).json(movement);
        } catch (e) {
            return errodeRota(e, req, res);
        }

    }
    async getall(req, res)
    {
        try 
        {
            const lstfiltros = ["estado","operacao","data"];
            const {help} = req.body;
			if(help)
                return res.status(200).json({
                    "filtrosequal":lstfiltros, 
                    "paginador":"'qtdpagina' e 'pagina' "
                });
            const {pagina, qtdpagina}= req.body;
            const paginador = funcPage(qtdpagina,pagina);
            let filtros = {};
            let {data, ...resto} = req.body;
            if(data)
                data = new Date(data);
            let body = {data, ...resto};
            lstfiltros.forEach((namefiltro) => {
                let newfiltro =lodash.get(body, namefiltro,"");
                if(newfiltro != "")
                    filtros = {...filtros, [namefiltro]:{[Op.eq]:newfiltro}};
            });
            let lstmovements;
            if(Object.keys(filtros).length == 0)
                lstmovements = await MovementModel.findAll({
                    include:{
                        model:CloseMovementModel, 
                        as:"fechamentos",
                        attributes:["idmov","idusuario", "estado", "created_at","updated_at"],
                        
                    },
                    ...paginador
                });
            else
                lstmovements = await MovementModel.findAll({
                    include:{
                        model:CloseMovementModel, 
                        as:"fechamentos",
                        attributes:["idmov","idusuario", "estado", "created_at","updated_at"],
                        
                    },
                    where:{[Op.and]:filtros},
                    ...paginador
                });
            return res.status(200).json(lstmovements);
            
        } catch (e) {
            return errodeRota(e, req, res);
        }

    }
    async get(req, res){
        try {
            const movement = await MovementModel.findByPk(req.params.id,{
                include:{
                    model:CloseMovementModel,
                    as:"fechamentos",
                    attributes:["idmov","idusuario", "estado", "created_at","updated_at"],
                    
                }
            });
            return res.status(200).json(movement);
        } catch (e) {
            return errodeRota(e, req, res);
        }
    }
    async close(req, res){
        try {
            const {idmov, idusuario} = req.body;
            let movement = await MovementModel.findByPk(idmov);
            if(!movement)
                return res.status(400).json({"errors":[`Movimento id ${idmov} é invalido`]});
            if(movement.operacao == "FECHADO")
                return res.status(400).json({"errors":[`Movimento id ${idmov} já esta fechado`]});
            await CloseMovementModel.update({estado:"CANCELADO"},{where: {idmov:idmov}});
            const closemovement = await CloseMovementModel.create({idmov, idusuario});
            const updatemov = await movement.update({operacao:"FECHADO"});
            movement = await MovementModel.findByPk(idmov, {
                include:{
                    model:CloseMovementModel, as:"fechamentos",
                    attributes:["idmov","idusuario", "estado", "created_at","updated_at"],
                    
                }
            });
            return res.status(201).json(movement);

        } catch (e) {
            return errodeRota(e, req, res);
        }
    }
    async reopen(req, res){
        try {
            const {idmov, idusuario} = req.body;
            let movement = await MovementModel.findByPk(idmov);
            if(!movement)
                return res.status(400).json({"errors":[`Movimento id ${idmov} é invalido`]});
            if(movement.operacao == "ABERTO")
                return res.status(400).json({"errors":[`Movimento id ${idmov} já esta aberto`]});
            await CloseMovementModel.update({"estado":"CANCELADO"},{where: {idmov:idmov}});
            const updatemov = await movement.update({operacao:"ABERTO"});
            movement = await MovementModel.findByPk(idmov, {
                include:{
                    model:CloseMovementModel, as:"fechamentos",
                    attributes:["idmov","idusuario", "estado", "created_at","updated_at"],
                    
                }
            });
            return res.status(201).json(movement);
            
        } catch (e) {
            return errodeRota(e, req, res);           
        }
        
    }

    async count(req, res)
    {
        try 
        {
            const lstfiltros = ["estado","operacao","data"];
            const {help} = req.body;
			if(help)
                return res.status(200).json({
                    "filtrosequal":lstfiltros, 
                    "paginador":"'qtdpagina' e 'pagina' "
                });
            let filtros = {};
            let {data, ...resto} = req.body;
            if(data)
                data = new Date(data);
            let body = {data, ...resto};
            lstfiltros.forEach((namefiltro) => {
                let newfiltro =lodash.get(body, namefiltro,"");
                if(newfiltro != "")
                    filtros = {...filtros, [namefiltro]:{[Op.eq]:newfiltro}};
            });
            let countmov;
            if(Object.keys(filtros).length == 0)
                countmov = await MovementModel.count({
                    include:{
                        model:CloseMovementModel, 
                        as:"fechamentos",
                        attributes:["idmov","idusuario", "estado", "created_at","updated_at"],
                        
                    },
                });
            else
                countmov = await MovementModel.count({
                    include:{
                        model:CloseMovementModel, 
                        as:"fechamentos",
                        attributes:["idmov","idusuario", "estado", "created_at","updated_at"],
                        
                    },
                    where:{[Op.and]:filtros},
                });
            return res.status(200).json({"quantidade":countmov});
            
        } catch (e) {
            return errodeRota(e, req, res);
        }

    }
}
export default new MovementController();