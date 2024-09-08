import StockModel from "../models/StockModel";
import CategoryModel from "../models/CategoryModel";

import * as lodash from "lodash";
import { Op } from "sequelize";
import funcPage from "../utils/funcPage";
import errodeRota from "../utils/errodeRota";
import Sequelize from "sequelize";
import databaseConfig from "../config/databaseConfig";
import ProductModel from "../models/ProductModel";
class StockController{
    async add(req, res){
        try {
            let { idusuario, idproduto, descricao, datamovimento, entrada, operacao, ...rest} = req.body;
            let idusuarioalt = idusuario;
            if(!operacao) 
                operacao= "ESTOCAR";
            let natureza ="D";
            if(!entrada || entrada <= 0)
                return res.status(400).json({"errors":["O campo entrada deve ser preenchido com valor a estocar"]});
            const body = {idusuario, idproduto, descricao, datamovimento, entrada, idusuarioalt, operacao, natureza };
            const stock = await StockModel.create(body)
            return res.status(201).json(stock);
        } catch (e) {
            return errodeRota(e, req, res);
        }
    }
    async getall(req, res){
        try {
            const lstfiltros = ["idproduto","estado","operacao","datamovimento"];
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
                if(newfiltro != "")
                filtros = {...filtros, [namefiltro]:{[Op.eq]:newfiltro}};
            });
            let lststock;
            if(Object.getOwnPropertySymbols(filtros).length == 0 )
                lststock = await StockModel.findAll(paginador);
            else
                lststock = await StockModel.findAll({
                    where:{[Op.and]:filtros},
                    ...paginador
                });
            return res.status(200).json(lststock);
        } catch (e) {
            return errodeRota(e, req, res);
        }
    }
    async sub(req, res){
        try {
            let { idusuario, idproduto, descricao, datamovimento, saida, operacao, ...rest} = req.body;
            let idusuarioalt = idusuario;
            if(!operacao) 
                operacao= "VENDER";
            let natureza ="C";
            if(!saida || saida <= 0)
                return res.status(400).json({"errors":["O campo saida deve ser preenchido com valor a estocar"]});
            const body = {idusuario, idproduto, descricao, datamovimento, saida, idusuarioalt, operacao, natureza };
            const stock = await StockModel.create(body)
            return res.status(201).json(stock);
        } catch (e) {
            return errodeRota(e, req, res);
        }
    }

    async count(req, res){
        try {
            const lstfiltros = ["idproduto","estado","operacao","datamovimento"];
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
                if(newfiltro != "")
                filtros = {...filtros, [namefiltro]:{[Op.eq]:newfiltro}};
            });
            let lststock;
            if(Object.getOwnPropertySymbols(filtros).length == 0 )
                lststock = await StockModel.count();
            else
                lststock = await StockModel.count({
                    where:{[Op.and]:filtros},
                });
            return res.status(200).json({"quantidade":lststock});
        } catch (e) {
            return errodeRota(e, req, res);
        }
    }


    async saldo(req, res){
        try {
            const lstfiltros = ["idproduto","estado","operacao","datamovimento"];
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
                if(newfiltro != "")
                filtros = {...filtros, [namefiltro]:{[Op.eq]:newfiltro}};
            });
            let lststock;
            if(Object.keys(filtros).length == 0)
                lststock = await StockModel.findAll({
                    attributes:[
                        'id',
                        'idproduto',
                        'datamovimento',
                        [sequelize.fn('SUM', sequelize.col('entrada')), 'sub_entrada'],
                        [sequelize.fn('SUM', sequelize.col('saida')), 'sub_saida']],
                    include:{
                        model: ProductModel,
                        as:'produto'
                    },
                    group: 'idproduto'
                });
            else
                lststock = await StockModel.findAll({
                    attributes:[
                        'id',
                        'idproduto',
                        'datamovimento',
                        [sequelize.fn('SUM', sequelize.col('entrada')), 'sub_entrada'],
                        [sequelize.fn('SUM', sequelize.col('saida')), 'sub_saida'],
                        [sequelize.literal('(entrada - saida)'), 'saldo']],
                    include:{
                            model: ProductModel,
                            as:'produto',
									 include:{
										 model: CategoryModel,
										 as: 'categoria'
									 }

                    },
                    group: 'idproduto' ,
                    where:{[Op.and]:filtros},
                });
            return res.status(200).json(lststock);
        } catch (e) {
            return errodeRota(e, req, res);
        }
    }
}

export default new StockController();
