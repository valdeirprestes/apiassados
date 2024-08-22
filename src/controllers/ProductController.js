import ProductModel from "../models/ProductModel"
import * as lodash from "lodash";
import { Op } from "sequelize";
import multer from "multer";
import multerConfig from "../config/multerConfig";
const upload = multer(multerConfig).single("foto");
import funcPage from "../utils/funcPage";
import errodeRota from "../utils/errodeRota";
import CategoryModel from "../models/CategoryModel";


class ProductController
{
    async post(req, res)
    {
        try
        {
            const newproduct = await ProductModel.create(req.body);
            return res.status(201).json(newproduct);
        } catch (e) 
        {
            return errodeRota(e, req, res);
        }
    }
    async getall(req, res){
        try {
            const lstfiltroslike = ["nome"];
            const lstfiltrosequal = ["item_fechamento", "estado", "idcategoria"];
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
                todosfiltros = filtroslike ; 
            if(Object.keys(filtrosequal).length > 0)
                todosfiltros = {...todosfiltros, ...filtrosequal};      
            let lstproducts;
            
            if(Object.keys(todosfiltros).length == 0)
                lstproducts = await ProductModel.findAll({
                    include:{
                        model:CategoryModel, as:"categoria"
                    },
                    ...paginador
            });
            else
                lstproducts = await ProductModel.findAll({
                include:{
                    model:CategoryModel, as:"categoria"
                },
                where:todosfiltros,
                ...paginador
            });
            
            return res.status(200).json(lstproducts);
        } catch (e) {
            return errodeRota(e, req, res);
        }
    }
    async update(req, res)
    {
        try {
            const id = req.params.id;
            let product =await ProductModel.findByPk(id);
            if(!product)
                return res.status(400).json({"errors":[`Não existe produto com o ${id}`]});
            const updatedproduct = await product.update(req.body, { include:[{ "model":CategoryModel, as:"categoria"}]});
            product =await ProductModel.findByPk(id, { include:[{ "model":CategoryModel, as:"categoria"}]});
            return res.status(200).json(product);
        } catch (e) {
            return errodeRota(e, req, res);
        }
    }
    async get(req, res)
    {
        console.log("get");
        try {
            const id = req.params.id;
            const product =await ProductModel.findByPk(id, { include:[{ "model":CategoryModel, as:"categoria"}]});
            if(!product)
                return res.status(400).json({"errors":[`Não existe produto com o ${id}`]});
            return res.status(200).json(product);
        } catch (e) {
            return errodeRota(e, req, res);
        }
    }
    imgupload(req,res){
        return upload(req, res, async (error) => {
            if(error)
            {
                return res.status(400).json(error);
            }
            try {
                const product = await ProductModel.findByPk(req.params.id);
                if(!product)
                    return res.status(400).json({"errors":[`Não existe produto com id ${req.params.id}`]});
                const img ="images/"+req.file.filename;
                const updateproduct = await product.update({foto:img});
                return res.status(201).json(updateproduct);
            } catch (e) {
                return errodeRota(e, req, res);
            }
        });
    }

    async count(req, res){
        try {
            const lstfiltroslike = ["nome"];
            const lstfiltrosequal = ["item_fechamento", "estado", "idcategoria"];
            const {help} = req.body;
            if(help)
                return res.status(200).json({
                    "filtroslike":lstfiltroslike,
                    "filtrosequal":lstfiltrosequal
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
                todosfiltros = filtroslike ; 
            if(Object.keys(filtrosequal).length > 0)
                todosfiltros = {...todosfiltros, ...filtrosequal};      

            let countproducts;
            if(Object.keys(todosfiltros).length == 0)
                countproducts = await ProductModel.count();
            else
                countproducts = await ProductModel.count({
                where:todosfiltros,
                });
            return res.status(200).json({"quantidade":countproducts});
        } catch (e) {
            return errodeRota(e, req, res);
        }
    }
}

export default new ProductController();