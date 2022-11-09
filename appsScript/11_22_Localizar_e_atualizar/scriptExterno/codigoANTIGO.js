/*
    Projeto desenvolvido como ferramenta para atualizar dados das OSs dentro da base de dados geral.
    
    Autor: Stallone L. de Souza - Estagiário

    Início do desenvolvimento: [11/08/22 - 11:00]
    Primeira versão estável: [19/09/22 - 07:30]
    Atualizações:    
    [06/10/22] => Implantado um novo item para coletar: "Destinação"
 */


    const Objetivos = {
        coletar_Relacao_OS      : 'coletarRelacaoOS()',
        coletar_Relacao_Injecao : 'coletarRelacaoInjecao()',
        localizar_OP_Especifica : 'localizarOSEspecifica()',
        localizar_OP_Anterior   : 'localizarOsEspecifica()',
        Injetar_Dados_OS        : 'injetarDadosOS()',
        
        STATUS                  : 'VERSÃO ESTÁVEL FINALIZADA'
    };
    
    const TagGeral = {
        os                  : "OS",
        rms                 : "RMS",
        op                  : "OP",
        data_realizada      : "REALIZADA",
        motorista           : "MOTORISTA",
        n_cacamba           : "Nº CAÇAMBA",
        residuo_encontrado  : "TIPO DE MATERIAL",
        destinacao          : "ATERRO",
        frota               : "CARRO",
        n_viagem            : "VIAGEM",
        hr_saida            : "SAÍDA",
        hr_retorno          : "RETORNO",
        ANO_BASE            : "Modelo",
        resultado   : "_RESULTADO",
        responsavel : "_RESPONSAVEL",
    };
    
    
    /**
     * Função para filtrar dentro do Banco de Dados a relação de remessas de uma OS específica procurada.
     * @param {string} URL_PLANILHA_BD URL da planilha que contém a base de dados.
     * @param {number} OS_PROCURADA Número da OS procurada.
     * @returns {Array|Object} Retorna um Array de objetos contendo a posição da OS na planilha, bem como alguns dados extras sobre cada OS para facilitar a localização.
     */
    function coletarRelacaoOS(URL_PLANILHA_BD, OS_PROCURADA){
    
        console.warn("INICIALIZANDO: Coletar relação da OS");
    
        // Contexto geral
        const sheetDB = SpreadsheetApp.openByUrl(URL_PLANILHA_BD).getSheets();
    
        let ResultadoArrayOS = [];
    
        for(let page in sheetDB){
            const pageName = sheetDB[page].getName().toString();
            if(pageName.indexOf(TagGeral.ANO_BASE) !== -1){
    
                const dataBase = sheetDB[page].getDataRange()
                                              .getValues()
                                              .filter(lin => lin[1] != '');
    
                console.log(`--STATUS do Contexto--\n\nColetando página: ${pageName}`);
    
                _coletar(dataBase, pageName);
            };
        };
    
    
        // Coleta de dados inicial
        function _coletar(dataRange, sheetPage){
            const indice = {
                os  : dataRange[0].indexOf(TagGeral.os),
                rms : dataRange[0].indexOf(TagGeral.rms),
                op  : dataRange[0].indexOf(TagGeral.op)
            };
    
            for(let lin in dataRange){
                const item = dataRange[lin][indice.os];
    
                if(item === OS_PROCURADA){
                    let resultado = {
                        page: sheetPage,
                        lin : Number(lin)+1,
                        os  : item,
                        rms : dataRange[lin][indice.rms],
                        op  : dataRange[lin][indice.op].toString().toUpperCase()
                    };
    
                    ResultadoArrayOS.push(resultado);
    
                }; // Fim IF entre as OSs
            }; // Fim loop entre as linhas
        }; // Fim função 'COLETAR'
    
        console.log(`--STATUS Coleta Inicial--\n\nResultado:`);
        console.log(ResultadoArrayOS);
    
    
        // Ajustando ordenação do array
    
        const ordemOP = ['R','T','E'];
    
        ResultadoArrayOS.sort((a,b) => (a.rms < b.rms) ? 1 : (a.rms > b.rms) ? -1 : 0)
                        .sort((a,b) => ordemOP.indexOf(a.op) - ordemOP.indexOf(b.op));
    
        console.log(`--STATUS Ordenação do Array--\n\nResultado:`);
        console.log(ResultadoArrayOS);
    
        
        console.warn("FINALIZANDO: Coletar relação da OS");
    
        return ResultadoArrayOS
    }
    
    
    
    /**
     * Função para localizar uma OS específica com base na REMESSAA e na OPERAÇÃO específicas dentro da relação de uma única OS.
     * @param {Array} RELACAO_OS Relação de objetos contendo dados sobre a posição de cada remessa da OS obtidos através da Coleta de OSs.
     * @param {number} RMS_PROCURADA Número da remessa procurada.
     * @param {string} OP_PROCURADA Letra que representa a operação específica que deseja procurar, sendo possível [R, T, E].
     * @returns {Object} Retorna um objeto contendo a posição e operação exata localizada, bem como um LOG retornando um resumo do resultado.
     */
    function localizarOSEspecifica(RELACAO_OS, RMS_PROCURADA, OP_PROCURADA){
        
        console.warn(`INICIALIZANDO: Localizar OS Específica`);
        // Contexto geral
        const arrayObjOS = [...RELACAO_OS];
    
        let resultadoPesquisa = {
            obj_os_procurada : undefined,
            obj_os_anterior  : undefined,
            log              : undefined
        };
    
        // Seleção da OS
        for(let lin in arrayObjOS){
            
            const item = arrayObjOS[lin];

            if(RMS_PROCURADA === null){

                console.log("REMESSA DE RETIRADA")
                if(item.op === OP_PROCURADA){
                    resultadoPesquisa.obj_os_procurada = item;
                    resultadoPesquisa.obj_os_anterior  = arrayObjOS[Number(lin)+1];
                    resultadoPesquisa.log = `LOCALIZADA => Página: ${item.page}, Linha: ${item.lin}, RMS: ${item.rms}, OP: ${item.op}`;
                    break;
                }

            } else {
            
                if(item.rms === RMS_PROCURADA && item.op === OP_PROCURADA){
                    resultadoPesquisa.obj_os_procurada = item;
                    resultadoPesquisa.obj_os_anterior  = arrayObjOS[Number(lin)+1];
                    resultadoPesquisa.log = `LOCALIZADA => Página: ${item.page}, Linha: ${item.lin}, RMS: ${item.rms}, OP: ${item.op}`;
                    break;
                };
            };
    
        };
    
        resultadoPesquisa.obj_os_procurada === undefined ? resultadoPesquisa.log = `NÃO LOCALIZADA` : undefined;
    
        console.log(`--STATUS Seleção OS--\n\nResultado encontrado:`);
        console.log(resultadoPesquisa);
    
        console.warn(`FINALIZANDO: Localizar OS Específica`);
        return resultadoPesquisa
    }
    
    
    
    
    
    /**
     * Função de transformação do Array de dados a inserir em um Array de objetos contendo esses dados.
     * @param {Array} ARRAY_DADOS_A_INJETAR Array de dados a serem injetados, contendo também a linha de cabeçalho.
     * @returns {Array} Retorna um Array de objetos contendo os dados a serem injetados.
     */
    function coletarRelacaoInjecao(ARRAY_DADOS_A_INJETAR){
    
        console.warn('INICIALIZANDO: Coletar Relação para Injetar');
    
        // Contexto geral
        let resultadoArrayInjecao = [];
    
        const dadosBase = [...ARRAY_DADOS_A_INJETAR];
    
        const indiceInjecao = {
            os                  : dadosBase[0].indexOf(TagGeral.os),
            rms                 : dadosBase[0].indexOf(TagGeral.rms),
            op                  : dadosBase[0].indexOf(TagGeral.op),
            data_realizada      : dadosBase[0].indexOf(TagGeral.data_realizada),
            motorista           : dadosBase[0].indexOf(TagGeral.motorista),
            n_cacamba           : dadosBase[0].indexOf(TagGeral.n_cacamba),
            residuo_encontrado  : dadosBase[0].indexOf(TagGeral.residuo_encontrado),
            destinacao          : dadosBase[0].indexOf(TagGeral.destinacao),
            frota               : dadosBase[0].indexOf(TagGeral.frota),
            n_viagem            : dadosBase[0].indexOf(TagGeral.n_viagem),
            hr_saida            : dadosBase[0].indexOf(TagGeral.hr_saida),
            hr_retorno          : dadosBase[0].indexOf(TagGeral.hr_retorno),

            resultado   : dadosBase[0].indexOf(TagGeral.resultado),
            responsavel : dadosBase[0].indexOf(TagGeral.responsavel),
        };
    
    
        // Transformação de array para objetos
        for(let lin in dadosBase){
            if(Number(lin) !== 0){
    
                let resultado = {
                    os                  : dadosBase[lin][indiceInjecao.os],
                    rms                 : dadosBase[lin][indiceInjecao.rms] || null,
                    op                  : dadosBase[lin][indiceInjecao.op].toString().toUpperCase(),
                    data_realizada      : dadosBase[lin][indiceInjecao.data_realizada] || null,
                    motorista           : dadosBase[lin][indiceInjecao.motorista] || null,
                    n_cacamba           : dadosBase[lin][indiceInjecao.n_cacamba] || null,
                    residuo_encontrado  : dadosBase[lin][indiceInjecao.residuo_encontrado] || null,
                    destinacao          : dadosBase[lin][indiceInjecao.destinacao] || null,
                    frota               : dadosBase[lin][indiceInjecao.frota] || null,
                    n_viagem            : dadosBase[lin][indiceInjecao.n_viagem] || null,
                    hr_saida            : dadosBase[lin][indiceInjecao.hr_saida] || null,
                    hr_retorno          : dadosBase[lin][indiceInjecao.hr_retorno] || null,
                    
                    resultado   :dadosBase[lin][indiceInjecao.resultado] || null,
                    responsavel :dadosBase[lin][indiceInjecao.responsavel] || null,
                };
    
                resultadoArrayInjecao.push(resultado);
    
            }; // Fim IF de exclusão
        }; // Fim loop entre as linhas
    
        console.log(`--STATUS Transformação do array de injeção--\n\nResultado:`);
        console.log(resultadoArrayInjecao);
    
        console.warn("FINALZIANDO: Coletar Relação para Injetar");
        return resultadoArrayInjecao
    };
    
    
    
    
    /**
     * Função-mestre para atualizar a Base de Dados das OSs.
     * @param {string} URL_PLANILHA_DESTINO URL da base de dados onde serão atualizadas as informações.
     * @param {Array} ARRAY_INJECAO Array contendo os dados que serão inseridos na BD, incluindo a linha de cabeçalho.
     * @param {string} URL_PLANILHA_INJECAO URL da planilha de origem da injeção de dados.
     * @param {string} NOME_PAG_INJECAO Nome da página que contém a origem da injeção de dados.
     */
    function injetarDadosOS(URL_PLANILHA_DESTINO, ARRAY_INJECAO, URL_PLANILHA_INJECAO, NOME_PAG_INJECAO){
    
        console.warn("INICIALIZANDO: Injetar dados na BD por OS");
    
        // Contexto Geral
        const origemInjecao   = SpreadsheetApp.openByUrl(URL_PLANILHA_INJECAO).getSheetByName(NOME_PAG_INJECAO);
        const dadosAInjetar   = coletarRelacaoInjecao(ARRAY_INJECAO);
    
        console.log("--STATUS preparo para injecao---\n\nArray de injeção:");
        console.log(dadosAInjetar);
    
    
        // Loop pela relação de dados a injetar
        for(let lin in dadosAInjetar){
            let dados = dadosAInjetar[lin];
            let residuo = {residuo_encontrado: dados.residuo_encontrado, destinacao: dados.destinacao};
    
            const relacaoOS   = coletarRelacaoOS(URL_PLANILHA_DESTINO, dados.os);
            const osEspecfica = localizarOSEspecifica(relacaoOS, dados.rms, dados.op);
    
            const injecao = {
                primaria    : osEspecfica.obj_os_procurada,
                secundaria  : osEspecfica.obj_os_anterior,
                log : osEspecfica.log
            };
    
            console.warn("!!! ACIONANDO INJEÇÃO !!!");
    
            if(injecao.log === 'NÃO LOCALIZADA'){
    
                origemInjecao.getRange(Number(lin)+3,1).setValue(injecao.log);
    
                console.warn(injecao.log);
    
                SpreadsheetApp.flush();
    
            } else {
    
                if(injecao.primaria.op === 'T'){
    
                _injetar(injecao.secundaria.page, injecao.secundaria.lin, residuo, true);
                delete dados.residuo_encontrado;
                delete dados.destinacao;
    
                } else if(injecao.primaria.op === 'R'){
    
                    _injetar(injecao.secundaria.page, injecao.secundaria.lin, residuo, true);
    
                };
    
                _injetar(injecao.primaria.page, injecao.primaria.lin, dados, false);
    
                origemInjecao.getRange(Number(lin)+3,1).setValue(injecao.log);
                
                console.warn(injecao.log);
    
                SpreadsheetApp.flush();
            };
    
            console.warn("!!! INJEÇÃO FINALIZADA !!!");
    
        }; //Fim loop entre array de injeção
    
    
    
        // Injeção
    
        /**
         * Função auxiliar para injetar os dados na planilha.
         * @param {string} PAGE_DESTINO Nome da página-destino na base de dados para a injeção.
         * @param {number} LIN_DESTINO Número da linha onde serão inseridos os dados.
         * @param {(Object|string)} DADOS_A_INJETAR Objeto ou String contendo os dados que serão inseridos na base de dados.
         * @param {boolean} SECUNDARIA Booleano relativo à injeção secundária, que atualiza a remessa anterior.
         */
        function _injetar(PAGE_DESTINO, LIN_DESTINO, DADOS_A_INJETAR, SECUNDARIA){
            const planilhaDestino = SpreadsheetApp.openByUrl(URL_PLANILHA_DESTINO);
            const pageDestino = planilhaDestino.getSheetByName(PAGE_DESTINO);
    
            const dados = {...DADOS_A_INJETAR};
    
            const cabecalho = pageDestino.getRange(1,1,1,pageDestino.getLastColumn()).getValues();
    
            const indice = {                
                data_realizada      : cabecalho[0].indexOf(TagGeral.data_realizada),
                motorista           : cabecalho[0].indexOf(TagGeral.motorista),
                n_cacamba           : cabecalho[0].indexOf(TagGeral.n_cacamba),
                residuo_encontrado  : cabecalho[0].indexOf(TagGeral.residuo_encontrado),
                destinacao          : cabecalho[0].indexOf(TagGeral.destinacao),
                frota               : cabecalho[0].indexOf(TagGeral.frota),
                n_viagem            : cabecalho[0].indexOf(TagGeral.n_viagem),
                hr_saida            : cabecalho[0].indexOf(TagGeral.hr_saida),
                hr_retorno          : cabecalho[0].indexOf(TagGeral.hr_retorno),

                resultado   : cabecalho[0].indexOf(TagGeral.resultado),
                responsavel : cabecalho[0].indexOf(TagGeral.responsavel),
            };
            
            console.warn(dados);
            if(SECUNDARIA === true){
                
                pageDestino.getRange(LIN_DESTINO, indice.residuo_encontrado+1)
                           .setValue(dados.residuo_encontrado);

                pageDestino.getRange(LIN_DESTINO, indice.destinacao+1)
                           .setValue(dados.destinacao);
    
            } else {
    
            for(let item in dados){
                for(let id in indice){
                    if(item === id && dados[item] !== undefined){
    
                        pageDestino.getRange(LIN_DESTINO, indice[id]+1)
                                   .setValue(dados[item]);
    
                    }; // Fim desvio condicional
                }; // Fim loop entre o índice
            }; // Fim loop entre os dados
    
            }; // Fim IF sobre Secundária
        }; // Fim função de injetar
    
    
    
        console.warn("FINALIZANDO: Injetar dados na BD por OS");
    
    }