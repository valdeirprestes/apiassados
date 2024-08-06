import  { DataTypes, Model }  from "sequelize";
import { DataTypes } from "sequelize";
import urlConfig from "../config/urlConfig";

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
        this.hasMany(models.StockModel , {foreignKey:"idproduto"});
        this.hasMany(models.OrderItemModel , {foreignKey:"idproduto", as:"produto"});
    }
}
