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
            const lstfiltros = ["nome", "descricao","fechamento", "estado"];
            const {help} = req.body;
            if(help)
                return res.status(200).json({
                    "filtros":lstfiltros, 
                    "tipo":"Like SQL",
                    "paginador":"'qtdpagina' e 'pagina' "
                });
            const {pagina, qtdpagina}= req.body;
            const paginador = funcPage(qtdpagina,pagina);
            let filtros = {};
            lstfiltros.forEach((namefiltro) => {
                let newfiltro =lodash.get(req.body, namefiltro,"");
                if(newfiltro != "")
                    filtros = {...filtros, [namefiltro]:{[Op.like]:`%${newfiltro}%`}};
            });
            let categorys;
            if(Object.keys(filtros).length == 0 )
                categorys = await CategoryModel.findAll(paginador);
            else
                categorys = await CategoryModel.findAll(
                {
                    where:{[Op.or]:filtros},
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
}
export default new CategoryController();