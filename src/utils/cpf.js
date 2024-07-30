function  gerarDigitoVerificador(text){
    let soma = 0;
    let valor;
    let j=0;
    let i;
    for ( i = text.length+1 ; i>=2 ; i--)
    {
	    soma += Number(text[j]) * i;
	    j += 1;
    }
    valor = soma % 11;
    if(valor < 2)
	    return 0;
    return 11 - valor ;
}



function validaCPF( text ){
    const  raiz = text.slice( 0 , text.length -2 )
    const dig1 = gerarDigitoVerificador(raiz);
    const raiz2 = raiz.slice(1) + dig1;
    const dig2 = gerarDigitoVerificador(raiz2);
    if ( dig1 == text[9] && dig2 == text[10])
	return true;
    return false;
}


export { gerarDigitoVerificador, validaCPF};
