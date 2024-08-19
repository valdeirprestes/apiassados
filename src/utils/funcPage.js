export default (qtdpagina, pagina) =>{
    try {
        if(!qtdpagina )
            return {};
        if(typeof qtdpagina !== "number" || typeof pagina !== "number")
            throw new Error("Os campos pagina e qtdpagina devem ser números naturais");
        if(qtdpagina < 1 || pagina <1)
            throw new Error("Os campos pagina e qtdpagina devem ser números naturais");
        return {
            "limit":qtdpagina,
            "offset":(qtdpagina * (pagina -1))
        };
    } catch (error) {
        console.log("Error in funcPage function");
        console.log(e);
        return {};
    }

};