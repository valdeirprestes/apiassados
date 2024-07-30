import ProductModel from "../models/ProductModel"
import * as lodash from "lodash";
import { Op } from "sequelize";
import multer from "multer";
import multerConfig from "../config/multerConfig";
const upload = multer(multerConfig).single("foto");



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
            console.log(e);
            return res.status(400).json(e.errors.map(err => err.message));
        }

    }
    async getall(req, res){
        try {
            const lstfiltros = ["nome", "estado" ];
            let filtros = {};
            lstfiltros.forEach((namefiltro) => {
                let newfiltro =lodash.get(req.body, namefiltro,"");
                if(newfiltro != "")
                    filtros = {...filtros, [namefiltro]:{[Op.like]:`%${newfiltro}%`}};
            });
            const lstproducts = await ProductModel.findAll({
                where:filtros
            });
            return res.status(200).json(lstproducts);
        } catch (e) {
            console.log(e);
            return res.status(400).json(null);
        }
    }
    async update(req, res)
    {
        try {
            const id = req.params.id;
            const product =await ProductModel.findByPk(id);
            if(!product)
                return res.status(400).json(`Não existe produto com o ${id}`);
            const updatedproduct = await product.update(req.body);
            return res.status(200).json(updatedproduct);
        } catch (e) {
            console.log(e);
            return res.status(400).json(e.errors.map(err => err.message));
        }
    }
    async get(req, res)
    {
        try {
            const id = req.params.id;
            const product =await ProductModel.findByPk(id);
            if(!product)
                return res.status(400).json(`Não existe produto com o ${id}`);
            return res.status(200).json(product);
        } catch (e) {
            console.log(e);
            return res.status(400).json(e.errors.map(err => err.message));
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
                    return res.status(400).json(`Não existe produto com id ${req.params.id}`);
                const img ="images/"+req.file.filename;
                const updateproduct = await product.update({foto:img});
                return res.status(201).json(updateproduct);
            } catch (e) {
                return res.status(400).json(e.errors.map(err => err.message));
            }
        });
    }
}

export default new ProductController();