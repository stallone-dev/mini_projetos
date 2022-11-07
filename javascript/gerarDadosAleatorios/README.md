# =>Mini-projeto

## Gerador de dados aleatórios

Estudo de como gerar NÚMEROS, DATAS e NOMES aleatórios a partir do JavaScript Vanilla.

### Visualização

Para ver em ação, acesse:
[https://stallone-dev.github.io/mini_projetos/javascript/gerarDadosAleatorios/index.html](https://stallone-dev.github.io/mini_projetos/javascript/gerarDadosAleatorios/index.html)

### Links dos códigos utilizados

- [Codigo JS](https://github.com/stallone-dev/mini_projetos/blob/master/javascript/gerarDadosAleatorios/src/gerador.js)
- [Codigo HTML](https://github.com/stallone-dev/mini_projetos/blob/master/javascript/gerarDadosAleatorios/index.html)
- [Codigo CSS](https://github.com/stallone-dev/mini_projetos/blob/master/javascript/gerarDadosAleatorios/style/style.css)

### Resumo do funcionamento

Utiliza-se a biblioteca ``Math.js``, em especial o comando ``Math.floor(Math.random())``, para gerar valores aleatórios e associá-los às informações buscadsa em cada campo.

Para o caso dos NOMES, utiliza-se os objetos [bd_nomes.json](https://github.com/stallone-dev/mini_projetos/blob/master/javascript/gerarDadosAleatorios/data/bd_nomes.json) como fonte primária, como mostrado no código abaixo:

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

