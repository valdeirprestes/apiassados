import { Model } from "sequelize";
import { DataTypes } from "sequelize";
class CategoryModel extends Model{
    static init(sequelize){
        super.init({
            nome:{
                type:DataTypes.STRING,
                allowNull:false,
                validate:{
                    notNull:{
                        msg:"O campo nome deve ser preenchido"
                    },
                    is:{
                        args:/^[a-z|A-Z-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/i,
                        msg:"O campo nome poder preenchido apenas com letras"
                    }

                }
            },
            descricao:{
                type: DataTypes.STRING,
                allowNull:true
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
            created_at:
            {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            updated_at:{
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }

        }, {sequelize, tableName:'categorias'});
        return this;
    }
    static associate(models){
        this.hasMany(models.ProductModel, {foreignKey:"idcategoria", as:"produtos"})
    }
}

export default CategoryModel;