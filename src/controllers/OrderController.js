import OrderItemModel from "../models/OrderItemModel";
import UserModel from "../models/UserModel";
import OrderModel from "../models/OrderModel";
import ProductModel from "../models/ProductModel";
import {Sequelize, Transaction} from "sequelize";
import * as lodash from "lodash";
import StockModel from "../models/StockModel";
import ProductModel from "../models/ProductModel";
import OrderItemModel from "../models/OrderItemModel";
import databaseConfig from "../config/databaseConfig";
import {Op} from "sequelize";
import funcPage from "../utils/funcPage";
import errodeRota from "../utils/errodeRota";
class OrderController{
	async post(req, res){
		try {
			let {edicao, ...resto} = req.body;
			edicao = 1;
			let body = {edicao, ...resto};
			const order = await OrderModel.create(body);
			return res.status(201).json(order);
		} catch (e) {
			return errodeRota(e, req, res);
		}
	}

	async post2(req, res){
		try {
			let {edicao, ...resto} = req.body;
			edicao = 1;
			
			let include = {
				include:[{
					model: OrderItemModel,
					as: 'itens',
				},
				{
					model:UserModel,
					as:"cliente"
				}
			]
			};
			let body = {edicao, ...resto};
			console.log('body', body);
			const	order = await OrderModel.create(body, include);
			return res.status(201).json(order);
		} catch (e) {
			return errodeRota(e, req, res);
		}
	}
	async atualizar2(req, res){
		try {
			let {edicao, ...resto} = req.body;
			edicao += 1;
			
			let include = {
				where:{ id :req.body.id},
				include:[{
					model: OrderItemModel,
					as: 'itens',
				},
				{
					model:UserModel,
					as:"cliente"
				},
				
			]
			};
			let body = {edicao, ...resto};
			console.log('body', body);
			console.log('include\n',include);
			const	order = await OrderModel.update(body,include);
			const orderupdate = await OrderModel.findByPk(body.id,{
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
					}
				],
			});
			return res.status(201).json(orderupdate);
		} catch (e) {
			return errodeRota(e, req, res);
		}
	}
	async getall(req,res){
		try {
			const lstfiltros = ["idcliente","idusuario","fase","datamovimento", "estado","mododeentrega"];
			const {help} = req.body;
			if(help)
                return res.status(200).json({
					"filtros":lstfiltros,
					 "tipo":"Equal SQL",
					 "paginador":"'qtdpagina' e 'pagina' "
				});
			const {pagina, qtdpagina}= req.body;
			const paginador = funcPage(qtdpagina,pagina);
			let filtros = {};
			let {datamovimento, ...resto} = req.body;
			if(datamovimento)
            	datamovimento = new Date(datamovimento);
            let body = {datamovimento, ...resto};
			lstfiltros.forEach((namefiltro) => {
				let newfiltro =lodash.get(body, namefiltro,"");
				if(newfiltro !== "" && newfiltro !== undefined)
					filtros = {...filtros, [namefiltro]:{[Op.eq]:newfiltro}};
			});
			let lstorders;
			if(Object.keys(filtros).length == 0)
				lstorders = await OrderModel.findAll({include:{ model: OrderItemModel, as:"itens" }, ...paginador});
			else{
				lstorders = await OrderModel.findAll({
					include:{ model: OrderItemModel, as:"itens" },
					where:{[Op.and]:filtros},
					...paginador
				});
			}
			return res.status(200).json(lstorders);

		} catch (e) {
			return errodeRota(e, req, res);
		}
	}
	async getdataorder(req, res){
		try {
			const {estadoitens} = req.query;
			console.log("req.params", req.params);
			console.log("req.query", req.query);
			let filtroestado= {};
			if(estadoitens){
				filtroestado = {"where":{"estado":estadoitens}}
			}
			const order = await await OrderModel.findByPk(req.params.id,{
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
						include:[{
							model:ProductModel, as:"produto",
							
						}],
						...filtroestado
					}
				],
			});
			return res.status(200).json(order);
		} catch (e) {
			return errodeRota(e, req, res);
		}
	}
	async getalldetails(req,res){
		try {
			const lstfiltros = ["idcliente","idusuario","fase","datamovimento", "estado","mododeentrega"];
			const lstItenfiltros = ['estado'];
			const {help} = req.body;
			if(help)
                return res.status(200).json({
					"filtrosequal":lstfiltros,
					 "paginador":"'qtdpagina' e 'pagina' ",
					 "itens":"{estado:NORMAL|CANCELADO}"
				});
			const {pagina, qtdpagina}= req.body;
			const paginador = funcPage(qtdpagina,pagina);
			let filtros = {};
			let {datamovimento, itens, ...resto} = req.body;
			if(datamovimento)
            	datamovimento = new Date(datamovimento);
            let body = {datamovimento, itens, ...resto};
			lstfiltros.forEach((namefiltro) => {
				let newfiltro =lodash.get(body, namefiltro,"");
				if(newfiltro !== "" && newfiltro !== undefined)
					filtros = {...filtros, [namefiltro]:{[Op.eq]:newfiltro}};
			});
			let filtroitens= {};
			console.log("\n\nitens\n\n", itens,"\n\n");
			if(itens ){
				lstItenfiltros.forEach((namefiltro)=>{
					let newfiltro = lodash.get(itens, namefiltro, "");
					console.log("filtro", newfiltro);
					if(newfiltro !== "" && newfiltro !==undefined)
						filtroitens = {... filtroitens, [namefiltro] : {[Op.eq]:newfiltro}};
				});
				if(Object.getOwnPropertySymbols(filtroitens).length > 0 || Object.getOwnPropertyNames(filtroitens).length > 0)
					filtroitens = {where:filtroitens}
			}
			
			let lstorders;
			if(Object.keys(filtros).length == 0 || Object.getOwnPropertyNames(filtros).length == 0)
				lstorders = await OrderModel.findAll({
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
								model:ProductModel, as:"produto",
							},
							...filtroitens
						}
					],
					...paginador
				});
			else
				lstorders = await OrderModel.findAll({
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
							model:ProductModel, as:"produto",
						},
						...filtroitens
					}],
				where:{[Op.and]:filtros},
				...paginador
			});
			return res.status(200).json(lstorders);

		} catch (e) {
			return errodeRota(e, req, res);
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
			return errodeRota(e, req, res);
		}
	}
	async updateitem(req, res){
		try {
			const sequelize = await new Sequelize(databaseConfig);
			const itemorder = await OrderItemModel.findByPk(req.params.id);
			if(!itemorder)
				return res.status(400).json({"errors":[`O item ${req.params.id} não foi localizado`]});
			
			const update_itemmorder = itemorder.update(req.body);
			return res.status(200).json(update_itemmorder)
		} catch (e) {
			return errodeRota(e, req, res);
		}
	}
	async atualizar(req, res){
		const sequelize = await new Sequelize(databaseConfig);
		const t = await sequelize.transaction();
		try {
			let idorder = req.body.id;
			if(!idorder)
				return res.status(400).json({"errors":[`O pedido ${idorder} não foi localizado`]});
			let order = await OrderModel.findByPk(idorder);
			if(!order)
				return res.status(400).json({"errors":[`O pedido ${idorder} não foi localizado`]});
			let {itens, cliente, ...orderdata} = req.body;
			if(cliente){
				let {perfil, ...rest} = cliente;
				perfil = "CLIENTE";
				cliente = {perfil,...rest};
				let newcliente = await UserModel.create(cliente, {transaction:t});
				let {idcliente, ...rest2} = orderdata;
				idcliente = newcliente.id;
				orderdata = {idcliente, ...rest2}
			}

			if(itens){
				await OrderItemModel.update({"estado":"CANCELADO"},
				{ 
					where:{"idpedido":idorder, "estado":"NORMAL"},
					transaction:t
				});

				
				for(let k=0 ; k < itens.length; k++) {
					let {idpedido, ...rest3}  = itens[k];
					idpedido = idorder;
					let newitem = {idpedido, ...rest3}
					await OrderItemModel.create(newitem, {transaction:t});
				}
				
			}
			if(orderdata){
				let {edicao, ...rest3} = orderdata;
				const func = (order1)=> {let {edicao, ...rest} = order1; return edicao; }
				let edicao2 =  func(order);
				edicao = edicao2 + 1;
				orderdata = {edicao, ...rest3};
				console.log("orderdata\n\n", orderdata, "\n\n");
				order = await order.update(orderdata, {transaction:t});
			}
			t.commit();
			const updateorder =  await OrderModel.findByPk(idorder,{
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
					}
				],
			});
			return res.status(200).json(updateorder);
		} catch (e) {
			t.rollback();
			return errodeRota(e, req, res);
		}

	}
	async closeorder(req,res){
		const sequelize = await new Sequelize(databaseConfig);
		const t = await sequelize.transaction();
		try {
			const order = await OrderModel.findByPk(req.params.id,{
				include:{
					model:OrderItemModel,
					as:"itens",
					while:{
						"item_fechamento":"SIM"
					}
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
			
			for (let i=0; i < itens.length; i++){
				if( itens[i].estado =="NORMAL")
				{
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
			}
			await t.commit();
			return res.status(201).json(updateorder);
		} catch (e) {
			await t.rollback();
			return errodeRota(e, req, res);
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
			return errodeRota(e, req, res);
		}
	}


	async count(req,res){
		try {
			const lstfiltros = ["idcliente","idusuario","fase","datamovimento", "estado","mododeentrega"];
			const {help} = req.body;
			if(help)
                return res.status(200).json({
					"filtrosequal":lstfiltros
				});
		
			let filtros = {};
			let {datamovimento, ...resto} = req.body;
			if(datamovimento)
            	datamovimento = new Date(datamovimento);
            let body = {datamovimento, ...resto};
			lstfiltros.forEach((namefiltro) => {
				let newfiltro =lodash.get(body, namefiltro,"");
				if(newfiltro !== "" && newfiltro !== undefined)
					filtros = {...filtros, [namefiltro]:{[Op.eq]:newfiltro}};
			});
			let countlstorders;
			if(Object.keys(filtros).length == 0)
				countlstorders = await OrderModel.count();
			else
				countlstorders = await OrderModel.count({
				where:{[Op.and]:filtros}
			});
			return res.status(200).json({"quantidade":countlstorders});

		} catch (e) {
			return errodeRota(e, req, res);
		}
	}

	async somaproduto(req,res){
		console.log("somaproduto");
		try {
			const lstfiltros = ["idproduto", "estado","datamovimento"];
			const {help} = req.body;
			const sequelize = new Sequelize(databaseConfig);
			if(help)
                return res.status(200).json({
					"filtrosequal":lstfiltros
				});
		
			let filtros = {};
			let {datamovimento, ...resto} = req.body;
			if(datamovimento)
            	datamovimento = new Date(datamovimento);
            let body = {datamovimento, ...resto};
			lstfiltros.forEach((namefiltro) => {
				let newfiltro =lodash.get(body, namefiltro,"");
				if(newfiltro !== "" && newfiltro !== undefined)
					filtros = {...filtros, [namefiltro]:{[Op.eq]:newfiltro}};
			});
			let sumproduct;
			if(Object.keys(filtros).length == 0)
				sumproduct = await  OrderModel.findAll({
					attributes:['datamovimento'],
                    include: {
                            model: OrderItemModel,
                            as:'itens',
							attributes:[
								'idproduto', 
								[sequelize.fn('SUM', sequelize.col('quantidade')), 'sub_quantidade']
							],
							include:{
								model: ProductModel,
								as: "produto"
							}
                    },
                    group: [ 'itens.idproduto']
				});
			else
				sumproduct = await  OrderModel.findAll({
					attributes:['datamovimento'],
					include: {
							model: OrderItemModel,
							as:'itens',
							attributes:[
								'idproduto', 
								[sequelize.fn('SUM', sequelize.col('quantidade')), 'sub_quantidade']
							],
							include:{
								model: ProductModel,
								as: "produto"
							}
					},
					group: [ 'itens.idproduto'],
					where:{[Op.and]:filtros}
				});
			
			return res.status(200).json(sumproduct);

		} catch (e) {
			return errodeRota(e, req, res);
		}
	}
}

export default new OrderController();
