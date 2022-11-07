# Mini-projeto ⚙️

## Gerador de dados aleatórios [Nomes, Números e Idades]

Mini-estudo de como gerar ``Números``, ``Datas`` e ``Nomes`` aleatórios a partir do JavaScript Vanilla.

Para este projeto foi utilizado a biblioteca [``Math.js``](https://mathjs.org/) em conjunto à API nativa [``Fetch``](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API/Using_Fetch) para acessar um pequeno Banco de Dados em JSON.

O resultado é este:

<p align="center">
  <a href="https://stallone-dev.github.io/mini_projetos/javascript/gerarDadosAleatorios/index.html" target="_blank"><img alt="GIF demonstrativo do projeto, é mostrado uma tela contendo três campos em branco: Número, Nome e Idade, os três são preenchidos com valores aleatórios que os representam. Em seguida o usuário aperta em um botão chamado 'Observar', fazendo surgir uma tabela com o registro dos valores aleatórios que estão aparecendo nos três campos iniciais" title="demonstracao_V1" src="./_gitHubIMAGES/demonstracao_v1.apng" /></a>
</p>

Para ver em ação, acesse:
[https://stallone-dev.github.io/mini_projetos/javascript/gerarDadosAleatorios/index.html](https://stallone-dev.github.io/mini_projetos/javascript/gerarDadosAleatorios/index.html)

### Links dos arquivos utilizados no projeto

- [Codigo JS](https://github.com/stallone-dev/mini_projetos/blob/master/javascript/gerarDadosAleatorios/src/gerador.js)
- [Codigo HTML](https://github.com/stallone-dev/mini_projetos/blob/master/javascript/gerarDadosAleatorios/index.html)
- [Codigo CSS](https://github.com/stallone-dev/mini_projetos/blob/master/javascript/gerarDadosAleatorios/style/style.css)
- [Base de dados em JSON](https://github.com/stallone-dev/mini_projetos/blob/master/javascript/gerarDadosAleatorios/data/bd_nomes.json)

### Resumo do funcionamento

Para gerar valores aleatórios, utilizou-se o comando ``Math.floor(Math.random() * CONJUNTO + ACRESCIMO)``, onde o ``CONJUNTO`` representa dois cenários:
- Quando se trata de um Array simples, representa os elementos do Array;
- Quando se trata de valores normais, representa o valor máximo a ser obtido;

Já o ``ACRESCIMO`` representa o valor mínimo a ser obtido como resultado.

Essa estrutura está representada no comando ``_coletorAleatorio``, como mostrado abaixo:

```js
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
```

Para o caso dos ``NOMES``, utilzou-se a API ``fetch`` para acessar o JSON <[bd_nomes.json](https://github.com/stallone-dev/mini_projetos/blob/master/javascript/gerarDadosAleatorios/data/bd_nomes.json)> e extrair dele os Arrays de nomes possíveis, como mostrado no código abaixo:

```js
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
```

