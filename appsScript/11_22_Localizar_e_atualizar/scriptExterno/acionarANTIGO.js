const SS = SpreadsheetApp;
//const UI = SS.getUi();
const SENHA_ACIONADORA = "TOPINSERT"


function acionador(){

    const acionamento = UI.prompt("ACIONADOR DA INJEÇÃO DE DADOS","Por gentileza, insira a senha de acionamento:",UI.ButtonSet.OK_CANCEL);
    const respostaInserida = acionamento.getResponseText();
    const botaoSelecionado = acionamento.getSelectedButton();

    if(botaoSelecionado !== UI.Button.OK){
        SS.getActiveSpreadsheet().toast("Operação cancelada.","STATUS ACIONAMENTO");
    } else if(respostaInserida.toString() === SENHA_ACIONADORA) {
        SS.getActiveSpreadsheet().toast("Acionamento iniciado!","STATUS ACIONAMENTO");
        _injetarOS();
    } else {
        UI.alert("Por gentileza, insira a senha correta.");
        acionador();
    }


}



function _injetarOS(){
    const sheet     = SS.openByUrl("https://docs.google.com/spreadsheets/d/13F9fkCvbbBrwNxXSFkRHGGcmjIdCHufpjl5FW4qoelw/");
    const page      = sheet.getSheetByName("Injetor");
    const dataRange = page.getRange(2,2,page.getLastRow(),5)
                               .getValues()
                               .filter(lin => lin[0] !== '');

    /*
    const indice_data_hora = {
      data    : dataRange[0].indexOf("REALIZADA"),
      saida   : dataRange[0].indexOf("SAÍDA"),
      retorno : dataRange[0].indexOf("RETORNO")
    };

    const dataFinal = dataRange.map(function(lin){
      if(lin[indice_data_hora.data] != "REALIZADA" && lin[indice_data_hora.saida] !== ''){
        let data = lin[indice_data_hora.data];
        lin[indice_data_hora.data] = Utilities.formatDate(data, 'GMT', 'dd/MM') || null;
        let saida = lin[indice_data_hora.saida];
        lin[indice_data_hora.saida] = Utilities.formatDate(saida, 'GMT-0306', "HH:mm") || null;
        let retorno = lin[indice_data_hora.retorno];
        lin[indice_data_hora.retorno] = Utilities.formatDate(retorno, 'GMT-0306', "HH:mm") || null;
      }
      return lin
    }) ;
    */
    const dataFinal = dataRange;
    console.log(dataFinal);

    const urlBD = "https://docs.google.com/spreadsheets/d/13F9fkCvbbBrwNxXSFkRHGGcmjIdCHufpjl5FW4qoelw/";
    const urlInjecao = urlBD;

    page.getRange(3,1,page.getLastRow()-1).clearContent();
    page.getRange(3,2,page.getLastRow()-1,5).setBackgroundRGB(200,200,200);
    SpreadsheetApp.flush();

    InjetorOS.injetarDadosOS(urlBD, dataFinal, urlInjecao, page.getSheetName());

    page.getRange(3,2,page.getLastRow()-2,5).setBackgroundRGB(255,255,255);
}