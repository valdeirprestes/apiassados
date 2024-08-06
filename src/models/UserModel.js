import  Sequelize, { DataTypes }  from "sequelize";
import { DataTypes } from "sequelize";
import bcryptjs from "bcryptjs";
import { validaCPF } from "../utils/cpf";
import {formatarDataBRtoUS, formataDataDateTimeBR} from "../utils/formatarData";


export default class UserModel extends Sequelize.Model
{
    static init(sequelize)
    {
        super.init({
            nome:{
                type:DataTypes.STRING,
                allowNull: false,
                validate:{
                    notNull:{
                        msg:'O campo nome é obrigatório'
                    },
                    len:{
                        args:[1,255],
                        msg:'O campo nome pode ter entre 1 a 255 caracteres'
                    },
                    is:{
                        args:/^[a-z|A-Z-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/i,
                        msg:"O campo nome poder preenchido apenas com letras"
                    } 
                }
            },
            email:{
                type: DataTypes.STRING,
                allowNull: false,
                unique:{
                    msg:"O campo email já foi registrado"
                },
                validate:{
                    notNull:{
                        msg:'O campo email é obrigátorio',
                    },
                    isEmail:{
                        msg:'Email inválido'
                    }
                }

            },
            senha:{
              type: DataTypes.VIRTUAL,  
            },
            senha_criptografada:{
                type: DataTypes.STRING,
            },
            cpf:{
                type: DataTypes.STRING,
                defaultValue: '',
                validate:{
                    valida(value){
                        if(!value)
                            return value;
                        else if(!validaCPF(value))
                            throw new Error("CPF é inválido");
                        else
                            return value;
                    }
                }
            },
            perfil:{
                type: DataTypes.STRING,
                allowNull:false,
                defaultValue: 'CLIENTE',
                validate:{
                    isIn:{
                        args:[["ADM","CLIENTE","ATENDENTE"]],
                        msg:'O campo perfil pode ser apenas ADM, CLIENTE ou ATENDENTE'
                    }
                }
            },
            telefone:{
                type: DataTypes.STRING,
                defaultValue: '',
                validate:{
                    len:{
                        args:[0,14],
                        msg:'O campo telefone pode ter no máximo de 14 caracteres (XX)XXXXX-XXXX'
                    }
                }
            },
            celular:{
                type: DataTypes.STRING,
                defaultValue: '',
                validate:{
                    len:{
                        args:[0,14],
                        msg:'O campo telefone pode ter no máximo de 14 caracteres (XX)XXXXX-XXXX'
                    }
                }
            },
            cep:{
                type :DataTypes.STRING,
                defaultValue: '',
                validate:{
                    len:{
                        args:[0,8],
                        msg:'O campo CEP pode ter no máximo de 8 caracteres'
                    }
                }

            },
            logradouro:{
                type:DataTypes.STRING,
                defaultValue: '',
                validate:{
                    len:{
                        args:[0,20],
                        msg:'O campo logradouro pode ter no máximo de 20 caracteres'
                    }
                }
            },
            numero:{
                type:DataTypes.STRING,
                defaultValue: '',
                validate:{
                    len:{
                        args:[0,20],
                        msg:'O campo numero pode ter no máximo de 20 caracteres'
                    }
                }
            },
            municipio:{
                type:DataTypes.STRING,
                defaultValue: '',
                validate:{
                    len:{
                        args:[0,20],
                        msg:'O campo municipio pode ter no máximo de 20 caracteres'
                    }
                }
            },
            uf:{
                type:DataTypes.STRING,
                defaultValue: '',
                validate:{
                    len:{
                        args:[0,2],
                        msg:'O campo UF pode ter no máximo de 2 caracteres'
                    }
                }
            },
            data_nascimento:{
                type: DataTypes.STRING,
                /*  eu cheguei a pensar em deixar para inserir dados e retornar dados no padrão DD/MM/AAAA
                    mas, desta forma se perderia a horas para alguns atributos, então comentei este o codigo abaixo
                */
                
                /*
                set(value){
                    const setar = formatarDataBRtoUS(value);
                    console.log("Setar", setar, "type", typeof setar);
                    this.setDataValue("data_nascimento",setar);
                },
                get(){
                    const value = this.getDataValue("data_nascimento");
                    if(!value)
                        return value;
                    return formataDataDateTimeBR(value.toString());
                }
                */
               validate:{
                testedata (value){
                    try {
                        const reg_data = /^\d{4}-(([1|2|3]\d)|(0\d))-((0[1-9])|[1|2|3]\d)$/;
                    let tmp = new Date(value);
                    let data = `${value}`;
                    let testedata = tmp.toISOString().split('T')[0];
                    /*console.log("testedata", testedata, "value", value)
                    console.log("teste match data ", value.match(reg_data));*/
                    if(!data.match(reg_data))
                        throw new Error("O campo data_nascimento deve ser uma string no formato YYYY-MM-DD");
                    if(data != testedata)
                        throw new Error("O campo data_nascimento esta com uma data inválida")
                    } catch (e) {
                        throw new Error("O campo data_nascimento deve ser uma string no formato YYYY-MM-DD");
                    }
                },
               }
            },
            sexo:{
                type: DataTypes.STRING,
                defaultValue:'FEMININO',
                validate:{
                    isIn:{
                        args:[["MASCULINO","FEMININO"]],
                        msg:'O campo sexo pode ser apenas FEMININO ou MASCULINO'
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
            ativo:{
                type: DataTypes.STRING,
                defaultValue: 'SIM',
                validate:{
                    isIn:{
                        args:[["SIM","NAO"]],
                        msg:'O campo ativo pode ser apenas SIM ou NAO'
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
        {
            sequelize, 
            tableName:"usuarios",
        });
        this.addHook("beforeSave", async (user) =>{
            if(user.senha )
                user.senha_criptografada = await bcryptjs.hash(user.senha, 8 );
     
        });
        return this;
    }
    static associtate(models){
        this.hasMany(models.MovementModel,{foreignKey:'idusuario'});
        this.hasMany(models.MovementModel,{foreignKey:'idusuarioalt'});
        this.hasMany(models.CloseMovementModel,{foreignKey:'idusuario'});
        this.hasMany(models.StockModel,{foreignKey:'idusuario'});
        this.hasMany(models.StockModel,{foreignKey:'idusuarioalt'});
        this.hasMany(models.OrderModel,{foreignKey:'idcliente'});
        this.hasMany(models.OrderModel,{foreignKey:'idusuario'});
        this.hasMany(models.OrderModel,{foreignKey:'idusuarioalt'});
    }
    passwordIsValid(senha){
        return bcryptjs.compare(senha, this.senha_criptografada);
    }
};
