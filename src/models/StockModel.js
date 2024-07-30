import { DataTypes, Model } from "sequelize";
import ProductModel from "./ProductModel";
import UserModel from "./UserModel";


class StockModel extends Model{
    static init(sequelize){
        super.init({
            idproduto:{
                type: DataTypes.INTEGER,
                allowNull:false,
                foreignKey:true,
                references:{
                    tableName:"produtos",
                    key:'id'
                },
                validate:{
                    isNumeric:{
                        msg:"O campo idproduto tem que ser um número de id de produto válido"
                    },
                    notNull:{
                        msg:'O campo idproduto é obrigatório para referenciar um produto para o estoque'
                    },
                    async verifyFK(value){
                        const product = await ProductModel.findByPk(value);
                        if(!product)
                            throw new Error("O campo idproduto  não foi registrado");
                    }
                }
            },
            descricao:{
                type: DataTypes.STRING,
                allowNull:false,
                validate:{
                    notNull:{
                        msg:"O campo descrição é obrigatório"
                    },
                    len:{
                        arg:[1,255],
                        msg:"O campo descrição é obrigatório e deve ter até no máximo 255 caracteres"
                    }
                }
            },
            operacao:{
                type:DataTypes.STRING,
                allowNull:false,
                validate:{
                    notNull:{
                        msg:"O campo operacao é obrigatório"
                    },
                    len:{
                        args:[0, 255 ],
                        msg:"O campo operacao é para categoriza as operaçoes"
                    }
                }
            },
            natureza:{
                type:DataTypes.STRING,
                allowNull:false,
                validate:{
                    notNull:{
                        msg:"O campo natureza é obrigatório, refere-se a débito(D) ou crédito(C)"
                    },
                    isIn:{
                        args:[["D","C"]],
                        msg:"O campo natureza deve ser preenchido com D (debito = + ) ou C (crédito = -)"
                    }

                }
            },
            entrada:{ 
                type:DataTypes.DECIMAL(10,2), 
                defaultValue:0,
                validate:{
                    isNumeric:{
                        msg:"O campo entrada deve preenchido com um número"
                    }
                }
            },
            saida:{ 
                type:DataTypes.DECIMAL(10,2), 
                defaultValue:0,
                validate:{
                    isNumeric:{
                        msg:"O campo saida deve preenchido com um número"
                    }
                }
            },
            idusuario:{
                type:DataTypes.INTEGER,
                allowNull:false,
                references:{
                    model:'usuarios',
                    key:'id'
                  },
                  validate:{
                    notNull:{
                        msg:"O campo idusuario é obrigatório para informmar que usuário vai criar o movimento"
                    },
                    async verifyFK(value){
                        const user = await UserModel.findByPk(value);
                        if(!user)
                            throw new Error("O campo idusuario  não foi registrado");
                    }
                  }
            },
            idusuarioalt:{
                type:DataTypes.INTEGER,
                allowNull:false,
                references:{
                    model:'usuarios',
                    key:'id'
                  },
                  validate:{
                    notNull:{
                        msg:"O campo idusuarioalt é obrigatório para informmar que usuário vai alterar o movimento"
                    },
                    async verifyFK(value){
                        const user = await UserModel.findByPk(value);
                        if(!user)
                            throw new Error("O campo idusuarioalt  não foi registrado");
                    }
                  }
            },
            estado:{
                type:DataTypes.STRING,
                defaultValue: 'NORMAL',
                validate:{
                    isIn:{
                        args:[["NORMAL","CANCELADO"]],
                        msg:'O campo estado pode ser apenas NORMAL ou CANCELADO'
                    }
                }
            },
            datamovimento:{
                type: DataTypes.DATE,
                allowNull:false,
                validate:{
                    notNull:{
                        msg:"O campo datamovimento é obrigatório"
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

        },
        {sequelize, tableName:"estoque"});
        return this;
    }
    static associate(models){
        this.belongsTo(models.UserModel,{foreignKey:"idusuario"});
        this.belongsTo(models.UserModel,{foreignKey:"idusuarioalt"});
        this.belongsTo(models.ProductModel,{foreignKey:"idproduto"});
        
    }

}

export default StockModel;