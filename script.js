//arquivo a ser carregado e apresentado no editor
const arquivoInicial = 'arquivos/sequenciadorMusical.js';

//lista de caracteres que segmentarão as linhas do código em blocos
//a lista também possui o rotulo, que será utilizado para converter o caracter para o leitor de tela
const separators = [{
	char: ' ',
	rotulo: 'espaço',
},{
	char: ',',
	rotulo: 'vírgula'
},{
	char: '	',
	rotulo: 'identação'
},{
	char: '=>',
	rotulo: 'flecha'
},{
	char: '"',
	rotulo: 'aspas duplas'
},{
	char: '\'',
	rotulo: 'aspas simples'
},{
	char: '+=',
	rotulo: 'mais igual'
},{
	char: '-=',
	rotulo: 'menos igual'
},{
	char: '*=',
	rotulo: 'multiplica igual'
},{
	char: '/=',
	rotulo: 'divide igual'
},{
	char: '=',
	rotulo: 'igual'
},{
	char: '+',
	rotulo: 'mais'
},{
	char: '-',
	rotulo: 'menos'
},{
	char: '*',
	rotulo: 'asterístico'
},{
	char: '/',
	rotulo: 'barra'
},{
	char: '.',
	rotulo: 'ponto'
},{
	char: ':',
	rotulo: 'dois pontos'
},{
	char: ';',
	rotulo: 'ponto e vírgula'
},{
	char: '(',
	rotulo: 'abre parênteses'
},{
	char: ')',
	rotulo: 'fecha parênteses'
},{
	char: '{',
	rotulo: 'abre chaves'
},{
	char: '}',
	rotulo: 'fecha chaves'
},{
	char: '[',
	rotulo: 'abre colchete'
},{
	char: ']',
	rotulo: 'fecha colchete'
}];

var ignorarEdicao = [' '];//lista caracteres do código que devem ser ignorados e não serão editáveis

var execucaoIframe;//iframe da execução
var editorDiv;//div do editor que contém todas as linhas
var linhaSelecionadaDiv;//div que contém todas as caixas editáveis da linha
var blocoSelecionadoDiv;//div editável selecionada na linha atual
var cursorIndex;//index do cursor na caixa de texto editável selecionada
var cursorMaxIndex;//máximo de caracteres da caixa de texto editável selecionada

window.addEventListener("DOMContentLoaded", function(){
	if(document.contentEditable != undefined) {
		alert("Seu navegador não suporta edição de texto HTML5");
	} else {
		inicializa();
	}
}, false);

function inicializa()
{
	//inicializa as instâncias da interface
	execucaoIframe = document.getElementById("execucaoIframe");
	editorDiv = document.getElementById("editorDiv");

	//inicializa eventos dos botões da interface
	document.getElementById("botaoEditor").addEventListener("click", mostraEditor);
	document.getElementById("botaoExecutar").addEventListener("click", executarCodigo);

	//inicializa o monitoramento de teclas apertadas
	document.addEventListener('keydown', onKeyDown);

	//carrega o arquivo inicial
	var xhr = new XMLHttpRequest();
	xhr.open('GET', arquivoInicial);
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			const status = xhr.status;
			if (status === 0 || (status >= 200 && status < 400)) {
				converteCodigoParaEditor(xhr.responseText);
			}
		}
	}
	xhr.send();
}

//Função acionada pela interface que apresenta o editor de conteúdo
function mostraEditor(event)
{
	editorDiv.style.display = "block";
	execucaoIframe.style.display = "none";
	execucaoIframe.contentWindow.location = "about:blank";
}

//Função acionada pela interface que executa a última versão editada do código
function executarCodigo(event)
{
	editorDiv.style.display = "none";
	execucaoIframe.style.display = "block";
	function quandoIframeCarregar() {
		execucaoIframe.contentWindow.setValue(codigoAtual());
		execucaoIframe.removeEventListener("load", quandoIframeCarregar);
	}
	execucaoIframe.addEventListener("load", quandoIframeCarregar);
	execucaoIframe.contentWindow.location = "executar.html";
}

//Função que converte uma string no editor de código
function converteCodigoParaEditor(code){
	//parse code
	var codigoHTML = "";
	var linhas = code.split("\n");
	linhas.forEach((linha, counter) => {
		codigoHTML += `<div class="linha">`;
			codigoHTML += `<button class="botaoLinha" onclick="expandirLinha(this)" onfocus="botaoLinhaFocado(this)" aria-rotulo="Linha ${counter+1}. ${converteCodigoEmAria(linha)}" data-contador="${counter+1}" data-codigo="${encodeURI(linha)}">Linha ${counter+1}. ${linha}</button>`
			codigoHTML += `<div hidden></div>`;
		codigoHTML += `</div>\n`;
	})
	editorDiv.innerHTML = codigoHTML;
}

//Função que divide uma string em uma array separada por uma lista de caracteres
function divideStringPorCaracteres(str, separadoresArray) {
	// Função auxiliar para dividir a string com base em um único caractere
	function divideString(texto, char) {
		let resultado = [];
		let index = texto.indexOf(char);
		
		while (index !== -1) {
			resultado.push(texto.substring(0, index));
			resultado.push(char);
			texto = texto.substring(index + 1);
			index = texto.indexOf(char);
		}
		
		// Adiciona a parte final da string
		if (texto.length > 0) {
			resultado.push(texto);
		}
		
		return resultado;
	}

	// Função principal recursiva
	function divisaoRecursiva(texto, separadoresArray) {
		if (separadoresArray.length === 0) {
			// Se a lista de caracteres estiver vazia, retorna a string como está
			return [texto];
		}

		const caracterAtual = separadoresArray[0];
		const partes = divideString(texto, caracterAtual);
		
		// Chama a função recursivamente para cada parte da string
		const resultado = partes.flatMap(parte => divisaoRecursiva(parte, separadoresArray.slice(1)));

		return resultado;
	}

	// Chama a função principal com a string de entrada e a lista de caracteres
	return divisaoRecursiva(str, separadoresArray);
}

//Função que converte o código em uma forma verborrágica para o leitor
function converteCodigoEmAria(str){
	separators.forEach(s => {
		if(s.char != " "){
			str = str.replaceAll(s.char,  ", " + s.rotulo + ", ");
		}
	});
	return str;
};

//Função que converte a última versão do código para uma string
function codigoAtual(){
	atualizaERecolheLinhaSelecionada();
	var buttons = Array.from(document.querySelectorAll('.botaoLinha'));
	var code = "";
	buttons.forEach(button => {
		code += decodeURI(button.getAttribute("data-codigo")) + "\n";
	})
	return code;
}

//Função que recolhe a linha editada e atualiza o botão com a última versão do código
function atualizaERecolheLinhaSelecionada(){
	if(linhaSelecionadaDiv) {
		linhaSelecionadaDiv.hidden = true;
		var codigo = "";
		var children = linhaSelecionadaDiv.children;
		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			codigo += child.innerHTML;
		}
		var botao = linhaSelecionadaDiv.previousSibling;
		var contador = botao.getAttribute("data-contador");
		botao.setAttribute("aria-label", `Linha ${contador}. ${converteCodigoEmAria(codigo)}`);
		botao.setAttribute("data-codigo", encodeURI(codigo));
		botao.textContent = `Linha ${contador}. ${codigo}`;
	}
	linhaSelecionadaDiv = null;
}

//Função que abre a linha acionada pelo botão e apresenta as caixas de edição
function expandirLinha(botao){
	atualizaERecolheLinhaSelecionada();
	botao.nextSibling.hidden = false;
	linhaSelecionadaDiv = botao.nextSibling;
	var code = decodeURI(botao.getAttribute("data-codigo"));
	var words = divideStringPorCaracteres(code, separators.map(s => s.char));
	var computedCode = "";
	words.forEach(palavra => {
		var editavel = ignorarEdicao.includes(palavra) ? "" : `contenteditable="true"`;
		computedCode += `<div ${editavel} spellcheck="false" class="palavra">${palavra}</div>`;
	})
	linhaSelecionadaDiv.innerHTML = computedCode;
	linhaSelecionadaDiv.firstChild.focus();
}

//Função que monira quando um botão é selecionado e esconde automaticamente a linha aberta
function botaoLinhaFocado(botao){
	atualizaERecolheLinhaSelecionada();
}

//Função que monitora a mudança de posição do cursor
document.addEventListener("selectionchange", () => {
	var selection = window.getSelection();
	var el = selection.focusNode;

	//se o cursor estiver no texto
	//armazenamos o a posição do cursor e o máximo de caracteres
	if(el.nodeType !== Node.ELEMENT_TEXT){
		if(selection.type == "Caret"){
			cursorIndex = selection.anchorOffset;
			cursorMaxIndex = selection.focusNode.length;
		}
	}

	//as vezes o texto é selecionado, e aí é preciso pegar o elemento pai
	if(el.nodeType !== Node.ELEMENT_NODE){
		el = el.parentNode;
	}
	
	blocoSelecionadoDiv = el;
});

//Função que monitora as teclas apertadas
//Apenas no PC, as teclas direcionais navegam entre as caixas de texto
function onKeyDown(e) {
	if (e.keyCode == '37') {
	   // seta para esquerda
	   procuraBlocoAEsquerda();
	}
	else if (e.keyCode == '39') {
		// seta para direita
		procuraProximoBloco();
	}
}

//Função que verifica se o cursor está no final da caixa editável e procura a caixa posterior
//se estiver na última caixa da linha, será selecionado a primeira caixa de edição da próxima linha
function procuraBlocoADireita(){
	if(blocoSelecionadoDiv){
		if(cursorIndex == cursorMaxIndex){
			if(blocoSelecionadoDiv.nextSibling)
				blocoSelecionadoDiv.nextSibling.focus();
			else {
				blocoSelecionadoDiv.parentNode.nextSibling.nextSibling.firstChild.focus();
			}
		}
	}
}

//Função que verifica se o cursor está no começo da caixa editável e procura a caixa anterior
//se estiver na primeira caixa da linha, será selecionado a última caixa de edição da linha anterior
function procuraBlocoAEsquerda(){
	if(blocoSelecionadoDiv){
		if(cursorIndex == 0){
			if(blocoSelecionadoDiv.previousSibling) {
				blocoSelecionadoDiv = blocoSelecionadoDiv.previousSibling;
			} else {
				blocoSelecionadoDiv = blocoSelecionadoDiv.parentNode.previousSibling;
				if(blocoSelecionadoDiv.nodeType !== Node.ELEMENT_TEXT){
					blocoSelecionadoDiv = blocoSelecionadoDiv.previousSibling;
				}
				blocoSelecionadoDiv = blocoSelecionadoDiv.lastChild;
			}
			var range = document.createRange()
			var sel = window.getSelection()
			console.log(blocoSelecionadoDiv);
			range.setStart(blocoSelecionadoDiv.firstChild, blocoSelecionadoDiv.firstChild.length)
			range.collapse(true)
			
			sel.removeAllRanges()
			sel.addRange(range)
		}
	}
}