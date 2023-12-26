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

//configurações
var modoEdicaoField;//Selection box que determina o modo de edição do código, por blocos ou por linhas
var exibirLinhaField;//Selection box que determina se deve exibir ou não a numeração das linhas
var modalConfiguracoes;//objeto bootstrap.Modal, controla a janela de configurações

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

	//inicializa configurações
	modoEdicaoField = document.getElementById("modoEdicao");
	exibirLinhaField = document.getElementById("exibirLinha");
	const configModal = document.getElementById('configModal');
	configModal.addEventListener('hidden.bs.modal', carregaConfiguracao);
	modalConfiguracoes = new bootstrap.Modal(configModal);
	document.getElementById('botaoSalvarConfiguracao').addEventListener("click", () =>{
		salvaConfiguracao();
		converteCodigoParaEditor(codigoAtual());
		modalConfiguracoes.hide();
		document.getElementById("botaoConfigurar").focus();
	});
	carregaConfiguracao();

	//carrega o arquivo inicial
	var xhr = new XMLHttpRequest();
	xhr.open('GET', arquivoInicial);
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			const status = xhr.status;
			if (status === 0 || (status >= 200 && status < 400)) {
				converteCodigoParaEditor(xhr.responseText);
				document.getElementsByTagName("h1")[0].focus();
			}
		}
	}
	xhr.send();
}

//Função que apresenta o editor de conteúdo
function mostraEditor(event)
{
	editorDiv.style.display = "block";
	execucaoIframe.style.display = "none";
	execucaoIframe.contentWindow.location = "about:blank";
}

//Função que executa a última versão editada do código
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
function converteCodigoParaEditor(codigo){
	var codigoHTML = "";
	var linhas = codigo.split("\n");
	linhas.forEach((linha, contador) => {
		linha = linha.replace("\r", "");//remove um caracter extra de quebra de linhas no windows
		codigoHTML += `<div class="linha">`;
			codigoHTML += `<button class="botaoLinha" onclick="expandirLinha(this)" onfocus="botaoLinhaFocado(this)" aria-label="${criaCodigoAudivel(true, contador+1, linha)}" data-contador="${contador+1}" data-codigo="${encodeURI(linha)}">${criaCodigoAudivel(false, contador+1, linha)}</button>`
			codigoHTML += `<div hidden></div>`;
		codigoHTML += `</div>\n`;
	})
	editorDiv.innerHTML = codigoHTML;
}

//Função que cria o código audível de acorod com as configurações
function criaCodigoAudivel(ariaMode, contador, codigo){
	var resultado = codigo;
	if(ariaMode){
		resultado = converteCodigoEmAria(resultado);
	}
	if(exibirLinhaField.value == "sim"){
		resultado = "Linha " + contador + ". " + resultado;
	}
	return resultado;
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
	var botoes = Array.from(document.querySelectorAll('.botaoLinha'));
	var codigo = "";
	botoes.forEach((botao, index) => {
		codigo += decodeURI(botao.getAttribute("data-codigo"));
		if(index < botoes.length-1)
			codigo += "\n";
	})
	return codigo;
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
		botao.classList.remove("expandido");
		botao.setAttribute("aria-label", criaCodigoAudivel(true, contador, codigo));
		botao.setAttribute("data-codigo", encodeURI(codigo));
		botao.textContent = criaCodigoAudivel(false, contador, codigo);
	}
	linhaSelecionadaDiv = null;
}

//Função que abre a linha acionada pelo botão e apresenta as caixas de edição
function expandirLinha(botao){
	atualizaERecolheLinhaSelecionada();
	botao.nextSibling.hidden = false;
	botao.classList.add("expandido");
	linhaSelecionadaDiv = botao.nextSibling;
	var codigo = decodeURI(botao.getAttribute("data-codigo"));
	var estruturaHTML = "";
	if(modoEdicaoField.value == "bloco"){
		//quebra o código em vários blocos editáveis individualmente
		var blocos = divideStringPorCaracteres(codigo, separators.map(s => s.char));
		blocos.forEach(bloco => {
			var editavel = ignorarEdicao.includes(bloco) ? "" : `contenteditable="true"`;
			estruturaHTML += `<div ${editavel} spellcheck="false" class="palavra">${bloco}</div>`;
		})
	}else{
		//mantém um único bloco editável para toda a linha
		estruturaHTML +=  `<div contenteditable="true" spellcheck="false" class="palavra">${codigo}</div>`;
	}
	linhaSelecionadaDiv.innerHTML = estruturaHTML;
	linhaSelecionadaDiv.firstChild.focus();
}

//Função que monira quando um botão é selecionado e esconde automaticamente a linha aberta
function botaoLinhaFocado(botao){
	atualizaERecolheLinhaSelecionada();
}

//Função que carrega a configuração
function carregaConfiguracao() {
	if(localStorage.getItem("modoEdicao") === null){
		//ainda não há configuração salva
		//configura valores padrões
		modoEdicaoField.value = "bloco";
		exibirLinhaField.value = "sim";
	}else{
		modoEdicaoField.value = localStorage.getItem("modoEdicao");
		exibirLinhaField.value = localStorage.getItem("exibirLinha");
	}
}

//Função que salva a configuração
function salvaConfiguracao() {
	localStorage.setItem("modoEdicao", modoEdicaoField.value);
	localStorage.setItem("exibirLinha", exibirLinhaField.value);
}