/**
 * Mini-projeto de um gerador de dados aleatório, utilizando somente HTML e JS Vanilla.
 * 
 * Desenvolvedor: Stallone L. de Souza
 *      LinkedIn: https://www.linkedin.com/in/stallone-l-de-souza/
 *        GitHub: https://github.com/stallone-dev
 * 
 * Início do projeto: [05/11/22 - 20h00];
 * Versão estável   : [06/11/22 - 11h00];
 * Refatoração 1    : [06/11/22 - 22h47];
 */

"use strict";

// Comandos para o HTML

    const numero = document.querySelector(".numero");
    const nome   = document.querySelector(".nome");
    const idade  = document.querySelector(".idade");

    setInterval(numero_aleatorio,1000);
    setInterval(nome_aleatorio,1000);    
    setInterval(idade_aleatoria,1000);

// Geradores de dados aleatórios

function numero_aleatorio(){
    let num_aleatorio = null;
    
    num_aleatorio = _coletorAleatorio(10000);

    numero.innerText = num_aleatorio;
};



function idade_aleatoria(){
    let i_aleatoria = null;

    const ano = _coletorAleatorio((2022-1980), 1980);
    const mes = _coletorAleatorio(12, 1);
    const dia = mes === 1 ? _coletorAleatorio(28, 1) : _coletorAleatorio(30, 1);

    const data_aleatoria = new Date(ano,mes,dia);
    const data_atual = new Date();
    const _idade = (mes <= (data_atual.getMonth()+1)) && (dia < data_atual.getDay())
                            ? parseInt((data_atual - data_aleatoria)/1000/3600/24/365)-1
                            : parseInt((data_atual - data_aleatoria)/1000/3600/24/365)

    i_aleatoria = `${dia}/${mes}/${ano} => ${_idade} anos`

    idade.innerText = i_aleatoria;
};



function nome_aleatorio(){

    fetch('./data/bd_nomes.json')
        .then((resposta) => resposta.json())
        .then((dados) => {_nome(dados)});

    function _nome(bd_nomes){
        const apelidos       = bd_nomes["apelidos"];
        const nomes_proprios = bd_nomes["nomes"];

        const coletar_apelido = _coletorAleatorio(apelidos);
        const coletar_nome1   = _coletorAleatorio(nomes_proprios);
        const coletar_nome2   = _coletorAleatorio(nomes_proprios);
        
        const resultado = `${coletar_nome1} ${coletar_nome2} ''${coletar_apelido}''`;

        nome.innerText = resultado;
    };

};



/**
 * Função para coletar um número aleatório OU um valor aleatório dentro de um VETOR.
 * @param {(number | array<any>)} conjunto Número total de elementos a serem considerados. [Caso seja um Vetor, retornará um dos valores contidos no Vetor].
 * @param {number} acrescimo Número a ser acrescido como possibilidade. [Caso seja maior que o CONJUNTO, servirá como "valor mínimo"].
 * @returns {(number | array<any>)} Retorna o resultado da procura aleatória.
 */
function _coletorAleatorio(conjunto, acrescimo = 0){
    let resultado = undefined;

    if(Array.isArray(conjunto)){
        resultado = conjunto[Math.floor(Math.random() * conjunto.length + acrescimo)] 
                    ?? "INEXISTENTE";
    } else {
        resultado = Math.floor(Math.random() * conjunto + acrescimo);
    }

    return resultado;
};