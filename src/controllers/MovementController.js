import MovementModel from "../models/MovementModel";
import CloseMovementModel from "../models/CloseMovementModel";
import * as lodash from "lodash";

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
            console.log(e);
            return res.status(400).json(e.errors.map(err => err.message));
        }

    }
    async getall(req, res)
    {
        try 
        {
            const lstfiltros = ["estado","operacao","data"];
            let filtros = {};
            lstfiltros.forEach((namefiltro) => {
                let newfiltro =lodash.get(req.body, namefiltro,"");
                if(newfiltro != "")
                    filtros = {...filtros, [namefiltro]:{[Op.like]:`%${newfiltro}%`}};
            });
            const lstmovements = await MovementModel.findAll({
                where:filtros,
                include:{
                    model:CloseMovementModel, 
                    as:"fechamentos",
                    attributes:["idmov","idusuario", "estado", "created_at","updated_at"],
                    
                }
            });
            return res.status(200).json(lstmovements);
            
        } catch (e) {
            console.log(e);
            return res.status(400).json(e.errors.map(err => err.message));
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
            console.log(e);
            return res.status(400).json(e.errors.map(err => err.message));
        }
    }
    async close(req, res){
        try {
            const {idmov, idusuario} = req.body;
            let movement = await MovementModel.findByPk(idmov);
            if(!movement)
                return res.status(400).json(`Movimento id ${idmov} é invalido`);
            if(movement.operacao == "FECHADO")
                return res.status(400).json(`Movimento id ${idmov} já esta fechado`);
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
            console.log(e);
            return res.status(400).json(e.errors.map(err => err.message));            
        }
    }
    async reopen(req, res){
        try {
            const {idmov, idusuario} = req.body;
            let movement = await MovementModel.findByPk(idmov);
            if(!movement)
                return res.status(400).json(`Movimento id ${idmov} é invalido`);
            if(movement.operacao == "ABERTO")
                return res.status(400).json(`Movimento id ${idmov} já esta aberto`);
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
            console.log(e);
            return res.status(400).json(e.errors.map(err => err.message));            
        }
        
    }
}
export default new MovementController();