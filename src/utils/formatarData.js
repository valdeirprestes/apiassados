function formatarDataBRtoUS(strdata)
{
    const arraydata = strdata.split("/");
    const data = new Date( arraydata[2] + "-" + arraydata[1] + "-" + arraydata[0]);
    return data;
}
function formataDataDateTimeBR(dateData){
    const data  = new Date(dateData);
    const dia = (data.getDate()+1).toString().padStart(2, '0')
    const mes = (data.getMonth()+1).toString().padStart(2, '0')
    const ano  = data.getFullYear().toString();
    return  dia + "/" + mes + "/" + ano;
}


export {formatarDataBRtoUS, formataDataDateTimeBR};