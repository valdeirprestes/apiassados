import StockModel from "../models/StockModel";
import * as lodash from "lodash";
import { Op } from "sequelize";
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
            console.log(e);
            return res.status(400).json({"errors":e.errors.map(err => err.message)});
        }
    }
    async getall(req, res){
        try {
            const lstfiltros = ["idproduto","estado","operacao","datamovimento"];
            let filtros = {};
            lstfiltros.forEach((namefiltro) => {
                let newfiltro =lodash.get(req.body, namefiltro,"");
                if(newfiltro != "")
                    filtros = {...filtros, [namefiltro]:newfiltro};
            });
            const lstmovements = await StockModel.findAll({
                where:filtros,
            });
            return res.status(200).json(lstmovements);
        } catch (e) {
            console.log(e);
            return res.status(400).json({"errors":e.errors.map(err => err.message)});
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
            console.log(e);
            return res.status(400).json({"errors":e.errors.map(err => err.message)});
        }
    }
}

export default new StockController();