import { Model, DataTypes, DECIMAL, ValidationError } from "sequelize";
import ProductModel from "./ProductModel";
import OrderModel from "./OrderModel";
import {ValidationErrorItem} from "sequelize";
import InstanceError from "sequelize";
class OrderItemModel extends Model{
    static init(sequelize){
        super.init({
            idpedido:{
                type: DataTypes.INTEGER,
                allowNull:false,
                references:{
                    tableName:"pedidos",
                    key:"id"
                },
                validate:{
                    notNull:{
                        msg:"O campo idpedido deve ser preenchido"
                    },
                    async verifyFK(value){
                        const order = await  OrderModel.findByPk(value);
                        if(!order)
                            throw new Error("O campo idpedido  não foi registrado");
                    }
                }
                
            },
            idproduto:{
                type:DataTypes.INTEGER,
                allowNull:false,
                references:{
                    tableName:"produtos",
                    key:'id'
                },
                validate:{
                    notNull:{
                        msg:"O campo idproduto deve ser preenchido"
                    },
                    async verifyFK(value){
                        const product = await  ProductModel.findByPk(value);
                        if(!product)
                            throw new Error("O campo idproduto  não foi registrado");
                    }
                }
            },
            preco:{
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                validate:{
                    isNumeric:{
                        msg:"O campo preço deve ter preenchido com valor númerico"
                    }
                }
            },
            quantidade:{
                type: DataTypes.DECIMAL(10,2),
                allowNull:false,
                validate:{
                    notNull:{
                        msg:"O campo quantidade é obrigatório"
                    }
                }
            },
            subtotal:{
                type: DECIMAL(10.2)
            },
            edicao:{
                type:DataTypes,
            },
            estado:{
                type:DataTypes.STRING,
                defaultValue:"NORMAL",
                validate:{
                    isIn:{
                        args:[["NORMAL","CANCELADO"]],
                        msg:'O campo estado pode ser preenchido apenas como NORMAL ou CANCELADO'
                    }
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
        }, {sequelize, tableName:'itenspedidos'});


        this.addHook("beforeSave", async (itempedido) =>{
            if(!itempedido.preco){
                try {

                    const product = await ProductModel.findByPk(itempedido.idproduto);
                    if(!product){
                        throw new Error(`Não foi possível buscar o  preco do produto ${itempedido.idproduto}`);
                    };
                    itempedido.preco = product.preco;                    
                } catch (e) {
                    throw new Error(`Não foi possível buscar o  preco do produto ${itempedido.idproduto}`);
                }
            }
            if( itempedido.quantidade )
                itempedido.subtotal = itempedido.preco * itempedido.quantidade;
     
        });
        return this;
    }
    static associate(models){
        this.belongsTo(models.OrderModel, {foreignKey:"idpedido"});
        this.belongsTo(models.ProductModel, {foreignKey:"idproduto",as:"produto"});
    }
    

}

export default OrderItemModel;
