import  { DataTypes, Model }  from "sequelize";
import { DataTypes } from "sequelize";
import urlConfig from "../config/urlConfig";
import CategoryModel from "../models/CategoryModel";

export default class ProductModel extends Model{
    static init(sequelize)
    {
        super.init(
        {
            nome:{
                type: DataTypes.STRING,
                allowNull:false,
                validate:{
                    notNull:{
                        msg:'O campo nome é obrigatório'
                    },
                    len:{
                        args:[1,255],
                        msg:'O campo nome tem que ter entre 1 a 255 caracteres'
                    }
                }
            },
            idcategoria:{
                type: DataTypes.STRING,
                allowNull:false,
                validate:{
                    notNull:{
                        msg:"O campo idcategoria é obrigatório para informmar que usuário vai fechar o movimento"
                    },
                    async verifyFK(value){
                      const category = await CategoryModel.findByPk(value);
                      if(!category)
                          throw new Error("O campo idcategoria  não foi registrado");
                    }
                }
            },
            preco:{
                type: DataTypes.DECIMAL(10,2),
                allowNull:false,
                defaultValue:0.00,
                validate:{
                    isNumeric:{
                        msg:'O campo preço deve ser prenchindo com um valor'
                    }
                }
            },
            foto:{
                type:DataTypes.STRING,
                defaultValue:''
            },
            item_fechamento:{
                type:DataTypes.STRING,
                allowNull:false,
                defaultValue:"NAO",
                validate:{
                    isIn:{
                        args:[["SIM","NAO"]],
                        msg:'O campo fechamento pode ser apenas SIM ou NAO'
                    }
                }
            },
            unidade_parcial:{
                type: DataTypes.STRING,
                allowNull:false,
                defaultValue:"NAO",
                validate:{
                    notNull:{
                        msg:"Preencha o campo unidade_parcial respondendo SIM se o produto pode ser  parcial como kilos ou NÃO (inteiro como refrigerante)"
                    },
                    isIn:{
                        args:[["SIM", "NAO"]],
                        msg:"Preencha o campo unidade_parcial respondendo SIM se o produto pode ser  parcial como kilos ou NÃO (inteiro como refrigerante)"
                    }
                }

            },
            estado:{
                type:DataTypes.STRING,
                defaultValue:'NORMAL',
                validate:{
                    isIn:{
                        args:[["NORMAL","CANCELADO"]],
                        msg:'O campo estado pode ser apenas NORMAL ou CANCELADO'
                    }
                }
            },
            url:{
                type:DataTypes.VIRTUAL,
                get(){
                    if(this.getDataValue("foto") == "") return "";
                    return urlConfig.url + "/" + this.getDataValue("foto");
                }
            },
            created_at:{
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            updated_at:{
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        }
        ,{sequelize, tableName:"produtos"});
        return this;

    };

    static associate(models){
        this.hasMany(models.StockModel , {foreignKey:"idproduto", as:"produto"});
        this.hasMany(models.OrderItemModel , {foreignKey:"idproduto"});
        this.belongsTo(models.CategoryModel, {foreignKey:"idcategoria", as:"categoria"})
    }
}
