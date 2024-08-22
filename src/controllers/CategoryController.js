import CategoryModel from "../models/CategoryModel";
import funcPage from "../utils/funcPage";
import * as lodash from "lodash";
import { Op } from "sequelize";
import errodeRota from "../utils/errodeRota";
class CategoryController
{
    async post(req, res ){
        try {
            const category = await CategoryModel.create(req.body);
            return res.status(201).json(category);
            
        } catch (e) {
            return errodeRota(e, req, res);
        }
    }
    async getall(req, res){
        try {
            const lstfiltroslike = ["nome", "descricao"];
            const lstfiltrosequal = ["fechamento", "estado"]
            const {help} = req.body;
            if(help)
                return res.status(200).json({
                    "filtroslike":lstfiltroslike, 
                    "filtrosequal":lstfiltrosequal,
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

            let categorys;
            if(Object.getOwnPropertySymbols(todosfiltros).length == 0 )
                categorys = await CategoryModel.findAll(paginador);
            else
                categorys = await CategoryModel.findAll(
                {
                    where:todosfiltros,
                    ...paginador
                }
            );
            return res.status(200).json(categorys);
        } catch (e) {
            return errodeRota(e, req, res);
        }
    }
    async update(req, res){
        try {
            const category = await CategoryModel.findByPk(req.params.id);
            if(!category)
                res.status(400).json({"errors":[`A categoria com id ${req.params.id} não localizada`]});
            const updatecategory = await category.update(req.body);
            return res.status(200).json(updatecategory);
        } catch (e) {
            return errodeRota(e, req, res);
        }
    }
    async count(req, res){
        try {
            const lstfiltroslike = ["nome", "descricao"];
            const lstfiltrosequal = ["fechamento", "estado"]
            const {help} = req.body;
            if(help)
                return res.status(200).json({
                    "filtroslike":lstfiltroslike, 
                    "filtrosequal":lstfiltrosequal,
                    "paginador":"'qtdpagina' e 'pagina' "
                });
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

            let count;
            if(Object.getOwnPropertySymbols(todosfiltros).length == 0 )
                count = await CategoryModel.count();
            else
                count = await CategoryModel.count(
                {
                    where:todosfiltros,
                }
            );
            return res.status(200).json({"quantidade":count});
        } catch (e) {
            return errodeRota(e, req, res);
        }
    }
}
export default new CategoryController();