function traduzirErro(erro) {
	const mapeamentoErros = {
		'SyntaxError': {
			'message': 'Erro de sintaxe',
			'Unexpected identifier': 'Identificador inesperado',
			'Unexpected token': 'Token inesperado',
			'Unexpected reserved word': 'Palavra reservada inesperada',
			'Unexpected number': 'Número inesperado',
			'Unexpected string': 'String inesperada',
			'Unexpected template string': 'Template string inesperado',
			'Unexpected regular expression': 'Expressão regular inesperada',
			'Unexpected comment': 'Comentário inesperado',
			'Unexpected newline': 'Quebra de linha inesperada',
			'Invalid or unexpected token': 'Token inválido ou inesperado',
			'Invalid regular expression': 'Expressão regular inválida',
			'Template literal required': 'Template literal necessário',
			'Unclosed template literal': 'Template literal não fechado',
			'Unterminated regular expression': 'Expressão regular não terminada',
			'Missing semicolon': 'Ponto e vírgula ausente',
			'Illegal return statement': 'Declaração de retorno ilegal',
			'Illegal break statement': 'Declaração de break ilegal',
			'Illegal continue statement': 'Declaração de continue ilegal',
			'Illegal throw statement': 'Declaração de throw ilegal',
			'Illegal assignment': 'Atribuição ilegal',
			'Illegal constructor': 'Construtor ilegal',
			'Illegal super constructor call': 'Chamada de super construtor ilegal',
			'Illegal new.target': 'new.target ilegal',
			'Invalid left-hand side in assignment': 'Lado esquerdo inválido na atribuição',
			'Invalid left-hand side in for-loop': 'Lado esquerdo inválido no for-loop',
			'Invalid shorthand property initializer': 'Inicializador de propriedade abreviada inválido',
			'Invalid destructuring assignment target': 'Destino de atribuição destrutiva inválido',
			'Invalid regular expression flags': 'Flags inválidas para expressão regular',
			'Invalid escape sequence': 'Sequência de escape inválida',
			'Invalid Unicode escape sequence': 'Sequência de escape Unicode inválida',
			'Invalid hex escape sequence': 'Sequência de escape hexadecimal inválida',
			'Invalid octal escape sequence': 'Sequência de escape octal inválida',
			'Invalid binary escape sequence': 'Sequência de escape binária inválida',
			'Invalid character escape sequence': 'Sequência de escape de caractere inválida',
			'Invalid private name': 'Nome privado inválido',
			// Adicione mais mensagens conforme necessário
		},
		'ReferenceError': {
			'message': 'Erro de referência',
			'is not defined': 'não está definido',
			'is not defined in the environment': 'não está definido no ambiente',
			'is not defined in module': 'não está definido no módulo',
			'is not defined in the specified module': 'não está definido no módulo especificado',
			'is not a function': 'não é uma função',
			'is not an object': 'não é um objeto',
			'is not an iterator': 'não é um iterador',
			'is not iterable': 'não é iterável',
			'is not a constructor': 'não é um construtor',
			'is not a valid shorthand property initializer': 'não é um inicializador de propriedade abreviada válido',
			'is not a valid meta-property': 'não é uma metapropriedade válida',
			// Adicione mais mensagens conforme necessário
		},
		'TypeError': {
			'message': 'Erro de tipo',
			'is not a function': 'não é uma função',
			'is not an object': 'não é um objeto',
			'is not an array': 'não é um array',
			'is not a constructor': 'não é um construtor',
			'is not a valid shorthand property initializer': 'não é um inicializador de propriedade abreviada válido',
			'is not a valid meta-property': 'não é uma metapropriedade válida',
			'cannot convert undefined or null to object': 'não é possível converter undefined ou null para objeto',
			'cannot read property': 'não é possível ler a propriedade',
			'cannot set property': 'não é possível definir a propriedade',
			'cannot delete property': 'não é possível excluir a propriedade',
			'cannot define property': 'não é possível definir a propriedade',
			'cannot create property': 'não é possível criar a propriedade',
			'cannot call method': 'não é possível chamar o método',
			'cannot apply the operand': 'não é possível aplicar o operando',
			'argument is not a valid predicate': 'o argumento não é um predicado válido',
			'arguments is not an object': 'arguments não é um objeto',
			'assignment to constant variable': 'atribuição a uma variável constante',
			'cyclic object value': 'valor de objeto cíclico',
			'incompatible receiver': 'receptor incompatível',
			'non-object property access': 'acesso a propriedade não objeto',
			'object is not extensible': 'objeto não é extensível',
			'object is not extensible in strict mode': 'objeto não é extensível no modo estrito',
			'proxy has no trap': 'proxy não possui armadilha',
			'cannot perform \'get\' on a proxy that has been revoked': 'não é possível realizar \'get\' em um proxy que foi revogado',
			'cannot perform \'set\' on a proxy that has been revoked': 'não é possível realizar \'set\' em um proxy que foi revogado',
			'revoked proxy': 'proxy revogado',
			'non-configurable array element': 'elemento de array não configurável',
			'non-configurable property': 'propriedade não configurável',
			'redeclared variable': 'variável redeclarada',
			'undeclared variable': 'variável não declarada',
			'getter must be a function': 'getter deve ser uma função',
			'setter must be a function': 'setter deve ser uma função',
			'getter and setter must be functions': 'getter e setter devem ser funções',
			'getter and setter cannot be the same function': 'getter e setter não podem ser a mesma função',
			'cannot convert object to primitive value': 'não é possível converter objeto para valor primitivo',
			'cannot convert object to primitive value in strict mode': 'não é possível converter objeto para valor primitivo no modo estrito',
			'cannot convert object to primitive value while coercing': 'não é possível converter objeto para valor primitivo ao coercer',
			'cannot convert object to primitive value using ToPrimitive': 'não é possível converter objeto para valor primitivo usando ToPrimitive',
			'cannot convert object to primitive value using ToPrimitive method': 'não é possível converter objeto para valor primitivo usando o método ToPrimitive',
			'cannot convert object to primitive value using Symbol.toPrimitive': 'não é possível converter objeto para valor primitivo usando Symbol.toPrimitive',
			'cannot convert object to primitive value using Symbol.toPrimitive method': 'não é possível converter objeto para valor primitivo usando o método Symbol.toPrimitive',
			'cannot convert undefined to object': 'não é possível converter undefined para objeto',
			'cannot convert null to object': 'não é possível converter null para objeto',
			'cannot convert boolean to object': 'não é possível converter booleano para objeto',
			'cannot convert number to object': 'não é possível converter número para objeto',
			'cannot convert string to object': 'não é possível converter string para objeto',
			'cannot convert symbol to object': 'não é possível converter símbolo para objeto',
			'cannot convert bigint to object': 'não é possível converter bigint para objeto',
			'cannot convert function to object': 'não é possível converter função para objeto',
			'cannot convert object to primitive type': 'não é possível converter objeto para tipo primitivo',
			'cannot convert object to primitive type in strict mode': 'não é possível converter objeto para tipo primitivo no modo estrito',
			'cannot convert object to primitive type while coercing': 'não é possível converter objeto para tipo primitivo ao coercer',
			'cannot convert object to primitive type using ToPrimitive': 'não é possível converter objeto para tipo primitivo usando ToPrimitive',
			'cannot convert object to primitive type using ToPrimitive method': 'não é possível converter objeto para tipo primitivo usando o método ToPrimitive',
			'cannot convert object to primitive type using Symbol.toPrimitive': 'não é possível converter objeto para tipo primitivo usando Symbol.toPrimitive',
			'cannot convert object to primitive type using Symbol.toPrimitive method': 'não é possível converter objeto para tipo primitivo usando o método Symbol.toPrimitive',
			'cannot convert undefined to primitive type': 'não é possível converter undefined para tipo primitivo',
			'cannot convert null to primitive type': 'não é possível converter null para tipo primitivo',
			'cannot convert boolean to primitive type': 'não é possível converter booleano para tipo primitivo',
			'cannot convert number to primitive type': 'não é possível converter número para tipo primitivo',
			'cannot convert string to primitive type': 'não é possível converter string para tipo primitivo',
			'cannot convert symbol to primitive type': 'não é possível converter símbolo para tipo primitivo',
			'cannot convert bigint to primitive type': 'não é possível converter bigint para tipo primitivo',
			'cannot convert function to primitive type': 'não é possível converter função para tipo primitivo',
			'is not an error object': 'não é um objeto de erro',
			'is not a valid non-null object': 'não é um objeto não nulo válido',
			// Adicione mais mensagens conforme necessário
		},
		'RangeError': {
			'message': 'Erro de alcance',
			'Invalid array length': 'Comprimento inválido do array',
			'Invalid typed array length': 'Comprimento inválido do typed array',
			'Invalid argument': 'Argumento inválido',
			'Invalid radix': 'Radix inválido',
			'Precision is out of range': 'Precisão está fora da faixa',
			// Adicione mais mensagens conforme necessário
		},
		'URIError': {
			'message': 'Erro de URI',
			'URI malformed': 'URI malformado',
			'URI malformed (percent encoding)': 'URI malformado (codificação percentual)',
			// Adicione mais mensagens conforme necessário
		}
	};

	const nomeErro = erro.name || 'Erro Desconhecido';
	const mensagemErro = erro.message || 'Erro desconhecido';
  
	// Verifica se contém a tradução
	for (const erroType in mapeamentoErros) {
	  for (const dynamicMessage in mapeamentoErros[erroType]) {
		if (mensagemErro.includes(dynamicMessage)) {
		  return nomeErro.replace(erroType, mapeamentoErros[erroType].message) + ": " + mensagemErro.replace(dynamicMessage, mapeamentoErros[erroType][dynamicMessage]);
		}
	  }
	}
  
	// Se não encontrou a tradução, devolve em inglês
	return nomeErro + ": " + mensagemErro;
  
}

window.onerror = function(msg, url, line, colno, error){
	var erroTraduzido = traduzirErro(error);
	var errorMessage = document.getElementById("errorMessage");
	errorMessage.setAttribute("aria-label", `Erro na linha ${line}: ${erroTraduzido}`)
	errorMessage.innerHTML = `<strong>Erro na linha ${line}</strong>: ${erroTraduzido}`;
	errorMessage.hidden = false;
	errorMessage.focus();
}