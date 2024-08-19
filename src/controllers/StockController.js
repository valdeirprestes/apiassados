import StockModel from "../models/StockModel";
import * as lodash from "lodash";
import { Op } from "sequelize";
import funcPage from "../utils/funcPage";
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
			const {errors} = e;
			if(errors)
				return res.status(400).json(e.errors.map(err => err.message));
			return res.status(500).json({"errors":['Error interno na API']});
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
            if(Object.keys(filtros).length == 0)
                lststock = await StockModel.findAll(paginador);
            else
                lststock = await StockModel.findAll({
                    where:{[Op.and]:filtros},
                    ...paginador
                });
            return res.status(200).json(lststock);
        } catch (e) {
            console.log(e);
			const {errors} = e;
			if(errors)
				return res.status(400).json(e.errors.map(err => err.message));
			return res.status(500).json({"errors":['Error interno na API']});
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
			const {errors} = e;
			if(errors)
				return res.status(400).json(e.errors.map(err => err.message));
			return res.status(500).json({"errors":['Error interno na API']});
        }
    }
}

export default new StockController();