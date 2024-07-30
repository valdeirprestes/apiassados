import OrderItemModel from "../models/OrderItemModel";
import OrderModel from "../models/OrderModel";
import {Sequelize, Transaction} from "sequelize";
import * as lodash from "lodash";
import StockModel from "../models/StockModel";
import databaseConfig from "../config/databaseConfig";
class OrderController{
    async post(req, res){
        try {
            const order = await OrderModel.create(req.body);
            return res.status(201).json(order);
        } catch (e) {
            console.log(e);
            return res.status(400).json(e.errors.map(err => (err.message)));
        }
    }
    async getall(req,res){
        try {
            const lstfiltros = ["idcliente","idusuario","fase","datamovimento", "estado"];
            let filtros = {};
            lstfiltros.forEach((namefiltro) => {
                let newfiltro =lodash.get(req.body, namefiltro,"");
                if(newfiltro != "")
                    filtros = {...filtros, [namefiltro]:newfiltro};
            });
            const lstorders = await OrderModel.findAll({
                include:{ model: OrderItemModel, as:"itens" },
                where:filtros
            });
            return res.status(200).json(lstorders);
            
        } catch (e) {
            console.log(e);
            return res.status(400).json(e.errors.map(err => err.message));
        }
    }
    async insertitem(req, res){
        try {
            const itemorder  = await OrderItemModel.create(req.body);
            return res.status(201).json(itemorder);
            
        } catch (e) {
            console.log(e);
            //return res.status(400).json({});
            return res.status(400).json(e.errors.map(err => err.message));
        }
    }
    async updateitem(req, res){
        try {
            const itemorder = await OrderItemModel.findByPk(req.params.id);
            if(itemorder)
                return res.status(400).json(`O item ${req.params.id} não foi localizado`);    
            const update_itemmorder = itemorder.update(req.body);
            return res.status(200).json(update_itemmorder)
        } catch (e) {
            console.log(e);
            return res.status(400).json(e.errors.map(err => err.message));
        }
    }
    async closeorder(req,res){

        try {

            const sequelize = await new Sequelize(databaseConfig);
            
            const order = await OrderModel.findByPk(req.params.id,{
                include:{
                    model:OrderItemModel,
                    as:"itens"
                }
            });
            if(!order)
                res.status(400).json(`Não foi encontrado o pedido de id ${req.params.id}`);
            const t = await sequelize.transaction({
                isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
            });
            const updateorder = await order.update({fase:"CONCLUIDO"}, {transaction:t});
            const  {datamovimento, itens} =  order;
            itens.forEach(async item => {
                const obj = {
                    idproduto : item.idproduto,
                    "operacao":"VENDA",
                    "descricao":`Venda  referente ao pedido ${req.params.id}`,
                    "idusuario":req.params.userId,
                    "idusuarioalt":req.params.userId,
                    "saida":item.quantidade,
                    "datamovimento":datamovimento,
                    "natureza":"C"
                }; 
                console.log(obj);
                console.log(`Create stock from product id ${item.idproduto} from order id ${req.params.id}`);
                const newstock = await StockModel.create(obj, {transaction:t});
                await newstock.save();
            });
            //await t.commit();
            await order.save({transaction:t});
            //await t.commit();
            //await StockModel.save({transaction:t});
            return res.status(201).json(updateorder);

        } catch (e) {
            console.log(e);
            //await t.rollback();
            return res.status(400).json(e.errors.map(err => err.message));
        }
    }
}

export default new OrderController();