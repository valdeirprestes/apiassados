import OrderItemModel from "../models/OrderItemModel";
import UserModel from "../models/UserModel";
import OrderModel from "../models/OrderModel";
import ProductModel from "../models/ProductModel";
import {Sequelize, Transaction} from "sequelize";
import * as lodash from "lodash";
import StockModel from "../models/StockModel";
import databaseConfig from "../config/databaseConfig";
class OrderController{
	async post(req, res){
		try {
			let {edicao, ...resto} = req.body;
			edicao = 1;
			let body = {edicao, ...resto};
			const order = await OrderModel.create(body);
			return res.status(201).json(order);
		} catch (e) {
			console.log(e);
			return res.status(400).json({"errors":e.errors.map(err => err.message)});
		}
	}

	async post2(req, res){
		try {
			let {edicao, ...resto} = req.body;
			edicao = 1;
			
			let include = {
				include:[{
					association: 'OrdemItemModel',
					as: 'itens'
				}]
			};
			let body = {edicao, ...resto};
			console.log('body', body);
			const	order = await OrderModel.create(body);
			return res.status(201).json(order);
		} catch (e) {
			console.log(e);
			return res.status(400).json({"errors":e.errors.map(err => err.message)});
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
	async getalldetails(req,res){
		try {
			const lstfiltros = ["idcliente","idusuario","fase","datamovimento", "estado","mododeentrega"];
			let filtros = {};
			lstfiltros.forEach((namefiltro) => {
				let newfiltro =lodash.get(req.body, namefiltro,"");
				if(newfiltro != "")
					filtros = {...filtros, [namefiltro]:newfiltro};
			});
			const lstorders = await OrderModel.findAll({
				include:[
					{ model: UserModel, 
						as:"cliente",
						"attributes":
						{ 
							"exclude":["senha_criptografada"]
						}
					} ,
					{ 
						model: OrderItemModel, as:"itens",
						include:{
							model:ProductModel, as:"produto"
						}
					}],
				where:filtros
			});
			return res.status(200).json(lstorders);

		} catch (e) {
			console.log(e);
			return res.status(400).json({"errors":e.errors.map(err => err.message)});
		}
	}
	async insertitem(req, res){
		try {
			let {idpedido,edicao, ...rest} = req.body;
			const order = await OrderModel.findByPk(idpedido);
			if(!order)
				return res.status(400).json({"errors":[`O pedido ${idpedido} não existe`]});
			if(order.fase === "CONCLUIDO")
				return res.status(400).json({"errors":[`O pedido ${idpedido} já foi concluído`]});
			if(order.estado === "CANCELADO")
				return res.status(400).json({"errors":[`O pedido ${idpedido} já foi cancelado`]});
			edicao = order.edicao;
			const body = {idpedido,edicao, ...rest};
			const itemorder  = await OrderItemModel.create(body);
			return res.status(201).json(itemorder);

		} catch (e) {
			console.log(e);
			//return res.status(400).json({});
			return res.status(400).json({"errors":e.errors.map(err => err.message)});
		}
	}
	async updateitem(req, res){
		try {
			const itemorder = await OrderItemModel.findByPk(req.params.id);
			if(itemorder)
				return res.status(400).json({"errors":[`O item ${req.params.id} não foi localizado`]});    
			const update_itemmorder = itemorder.update(req.body);
			return res.status(200).json(update_itemmorder)
		} catch (e) {
			console.log(e);
			return res.status(400).json({"errors":e.errors.map(err => err.message)});
		}
	}
	async closeorder(req,res){
		const sequelize = await new Sequelize(databaseConfig);
		const t = await sequelize.transaction();
		try {
			const order = await OrderModel.findByPk(req.params.id,{
				include:{
					model:OrderItemModel,
					as:"itens"
				}
			});
			if(!order)
				res.status(400).json({"errors":[`Não foi encontrado o pedido de id ${req.params.id}`]});
			if(order.fase === "CONCLUIDO")
				return res.status(400).json({"errors":[`O pedido ${idpedido} já foi concluído`]});
			if(order.estado === "CANCELADO")
				return res.status(400).json({"errors":[`O pedido ${idpedido} já foi cancelado`]});
			const updateorder = await order.update({fase:"CONCLUIDO"}, {transaction:t});
			const  {datamovimento, itens} =  order;
			const newitens = [];
			console.log('itens.length', itens.length);
			console.log('itens', itens);
			for (let i=0; i < itens.length; i++){
					const obj = {
						idproduto : itens[i].idproduto,
						"operacao":"VENDA",
						"descricao":`Venda  referente ao pedido ${req.params.id}`,
						"idusuario":req.params.userId,
						"idusuarioalt":req.params.userId,
						"saida":itens[i].quantidade,
						"datamovimento":datamovimento,
						"natureza":"C"
					}; 
					console.log(obj);
					console.log(`Create stock from product id ${itens[i].idproduto} from order id ${req.params.id}`);
					let newstock = await StockModel.create(obj, {transaction:t});
			}
			await t.commit();
			return res.status(201).json(updateorder);
		} catch (e) {
			await t.rollback();
			console.log(e);
			return res.status(400).json({"errors":e.errors.map(err => err.message)});
		}
	}
	async cancel(req, res){
		try {
			const order = await OrderModel.findByPk(req.params.id,{
				include:{
					model:OrderItemModel,
					as:"itens"
				}
			});
			if(!order)
				return res.status(400).json({"errors":[`Não foi encontrado o pedido de id ${req.params.id}`]});
			if(order.fase === "CONCLUIDO")
				return res.status(400).json({"errors":[`O pedido ${req.params.id} já foi concluído`]});
			if(order.estado === "CANCELADO")
				return res.status(400).json({"errors":[`O pedido ${req.params.id} já foi cancelado`]});    
			const update_order = await order.update({"estado":"CANCELADO"});
			return res.status(200).json(update_order)
		} catch (e) {
			console.log(e);
			return res.status(400).json({"errors":e.errors.map(err => err.message)});
		}
	}
}

export default new OrderController();
