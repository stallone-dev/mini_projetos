/**
 * Exemplo de como cruzar dados a partir de duas bases diferentes do google planilhas,
 * trazendo o resultado final de volta para o google planilhas..
 * 
 * Planilha-exemplo : <https://docs.google.com/spreadsheets/d/1b30hbqSpbMqM8zGmpa3XsYYoRNMcBAF20R2MYH6Cjds/>
 * Script-montado   : <https://script.google.com/d/1ce3bf4otixEfCKDIZH5JNQ-TfLRYVabP4MNqqqZmnAJdR0_gOBMzpgeL/edit?usp=sharing>
 * 
 * Desenvolvido por : Stallone L.S. <https://github.com/stallone-dev>
 * 
 * Início do desenvolvimento : [15/10/22]
 * Fim do desenvovlimento    : [16/10/22]
 */


/**
 * Função para cruzar os dados das duas bases da planilha e retornar, na planilha de "resultados", os dados encontrados.
 * @param {boolean} BUSCAR_VALORES_DIVERGENTES Retornar os resultados que possuem divergência na coluna "valores".
 * @param {(number|string)} BUSCAR_SERIE_ESPECIFICA Buscar uma série específica dentro da base ATF.
 */
 function cruzamentoDeDados(BUSCAR_VALORES_DIVERGENTES = false, BUSCAR_SERIE_ESPECIFICA = null) {

    const URL_PLANILHA = "https://docs.google.com/spreadsheets/d/1b30hbqSpbMqM8zGmpa3XsYYoRNMcBAF20R2MYH6Cjds/";

    // 1ª etapa => Definir o contexto dos dados // Onde estão os dados [Utiliza-se funções do AppsScript];
    const planilha_trabalhada = SpreadsheetApp.openByUrl(URL_PLANILHA);

    const page_OF           = planilha_trabalhada.getSheetByName("Base_OF"); 
    const page_ATF          = planilha_trabalhada.getSheetByName("Base_ATF");
    const page_resultados   = planilha_trabalhada.getSheetByName("RESULTADO");

    const dados_OF  = page_OF.getDataRange().getValues();
    const dados_ATF = page_ATF.getDataRange().getValues();

    // Limpeza dos resultados para novo preenchimento:
    page_resultados.getRange(2, 1, page_resultados.getLastRow(), page_resultados.getLastColumn()).clearContent();



    // 2ª etapa => Coletar as informações que são relevantes para o cruzamento [JavaScript puro]
    const ID_OF = {
        id          : dados_OF[0].indexOf("ID"),
        contab      : dados_OF[0].indexOf("Data Contab"), 
        valor_of    : dados_OF[0].indexOf("VALOR"),
        serie       : dados_OF[0].indexOf("Série"),
    };

    const ID_ATF = {
        id          : dados_ATF[0].indexOf("ID"),
        emissao     : dados_ATF[0].indexOf("Emissão"),
        nf          : dados_ATF[0].indexOf("NF"),
        serie       : dados_ATF[0].indexOf("Série"),
        valor_atf   : dados_ATF[0].indexOf("Valor total"),
        chave       : dados_ATF[0].indexOf("Chave de acesso"),
    };
    


    // 3ª etapa => Fazer o cruzamento dos dados [JavaScript puro]
    let matrizResultado = [];

    for(let lin_OF in dados_OF){
        if(Number(lin_OF) === 0){continue}; // Comando para PULAR a primeira linha, que seria a de cabeçalho

        for(let lin_ATF in dados_ATF){
            if(Number(lin_ATF) === 0){continue}; // Comando para PULAR a primeira linha, que seria a de cabeçalho
            

            // **REGIÃO DE ANÁLISE PARA CRUZAMENTO DOS DADOS**
            // ================================================================================================

            let osIDsCombinam     = dados_OF[lin_OF][ID_OF.id] === dados_ATF[lin_ATF][ID_ATF.id];
            let osValoresCombinam = dados_OF[lin_OF][ID_OF.valor_of] === dados_ATF[lin_ATF][ID_ATF.valor_atf];
            let filtrarSerie      = null;

            if(!BUSCAR_VALORES_DIVERGENTES){osValoresCombinam = false};

            if(BUSCAR_SERIE_ESPECIFICA !== null){

                filtrarSerie = dados_ATF[lin_ATF][ID_ATF.serie] === BUSCAR_SERIE_ESPECIFICA;

            } else {filtrarSerie = true};
            

            if(osIDsCombinam && filtrarSerie && !osValoresCombinam){

            // ================================================================================================

                // Novo conjunto de dados que será retornado para a planilha
                const resultado = {
                    emissao     : dados_ATF[lin_ATF][ID_ATF.emissao],
                    contab      : dados_OF[lin_OF][ID_OF.contab],
                    chave       : dados_ATF[lin_ATF][ID_ATF.chave],
                    nf          : dados_ATF[lin_ATF][ID_ATF.nf],
                    serie       : dados_ATF[lin_ATF][ID_ATF.serie],
                    valor_of    : dados_OF[lin_OF][ID_OF.valor_of],
                    valor_atf   : dados_ATF[lin_ATF][ID_ATF.valor_atf],
                };

                // Comando especial para CONVERTER o Objeto{resultado} em um vetor[resultado]
                const resultado_convertido = Object.values(resultado);

                // Injetando o vetor[resultado] na matriz principal de resultados
                matrizResultado.push(resultado_convertido);


            }; // Fim IF das referências entre as bases
        }; // Fim loop dados ATF
    }; // Fim loop dados OF



    // 4ª etapa => Retornar o resultado para a planilha [Novamnete utilizando os comandos do AppsScript]
    // Referência da região onde as informações serão injetadas
    const lin_inicial = 2;
    const col_inicial = 1;
    const lin_final = matrizResultado.length;       // length ==> Propriedade que "conta" quantas linhas existem
    const col_final = matrizResultado[0].length;    // Aqui ela "conta" quantas colunas existem

    // Comando para injetar a matriz na planilha de resultados
    page_resultados.getRange(lin_inicial, col_inicial, lin_final, col_final).setValues(matrizResultado);
    
}
