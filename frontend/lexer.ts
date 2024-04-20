
export enum TokenType {
	//Null value
	// Null,
	// Literal Types
	Number,
	Identifier,
	String,
	// Keywords
	Let,

	// Grouping * Operators
	BinaryOperator,
	Equals,
	OpenParen,
	CloseParen,

    //Signifies Last element of file
    EOF
    
}


const KEYWORDS: Record<string, TokenType> = {
	let: TokenType.Let,

};

// Reoresents a single token from the source-code.
export interface Token {
	value: string;
	type: TokenType; 
}


function token(value = "", type: TokenType): Token {
	return { value, type };
}


function isalpha(src: string) {
	return src.toUpperCase() != src.toLowerCase();
}


function isskippable(str: string) {
	return str == " " || str == "\n" || str == "\t";
}

function isint(str: string) {
	const c = str.charCodeAt(0);
	const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
	return c >= bounds[0] && c <= bounds[1];
}


export function tokenize(sourceCode: string): Token[] {
	const tokens = new Array<Token>();
	const src = sourceCode.split("");

	// produce tokens until the EOF is reached.
	while (src.length > 0) {
		// BEGIN PARSING ONE CHARACTER TOKENS
		if (src[0] == "(") {
			tokens.push(token(src.shift(), TokenType.OpenParen));
		} else if (src[0] == ")") {
			tokens.push(token(src.shift(), TokenType.CloseParen));
		} // HANDLE BINARY OPERATORS
		else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" ||src[0]=="%") {
			tokens.push(token(src.shift(), TokenType.BinaryOperator));
		} // Handle Conditional & Assignment Tokens
		else if (src[0] == "=") {
			tokens.push(token(src.shift(), TokenType.Equals));
		} // HANDLE MULTICHARACTER KEYWORDS, TOKENS, IDENTIFIERS ETC...
		else {
			// Handle numeric literals -> Integers
			if (isint(src[0])) {
				let num = "";
				while (src.length > 0 && isint(src[0])) {
					num += src.shift();
				}

				// append new numeric token.
				tokens.push(token(num, TokenType.Number));
			} // Handle Identifier & Keyword Tokens.
			else if (isalpha(src[0])) {
				let ident = "";
				while (src.length > 0 && isalpha(src[0])) {
					ident += src.shift();
				}

				// CHECK FOR RESERVED KEYWORDS
				const reserved = KEYWORDS[ident];
				// If value is not undefined then the identifier is
				// reconized keyword
				if (typeof reserved ==="number") {
					tokens.push(token(ident, reserved));
				} else {
					// Unreconized name must mean user defined symbol.
					tokens.push(token(ident, TokenType.Identifier));
				}
			} else if (isskippable(src[0])) {
				// Skip uneeded chars.
				src.shift();
			} // Handle unreconized characters.
			// TODO: Impliment better errors and error recovery.
			else {
				console.error(
					"Unreconized character found in source: ",
					src[0].charCodeAt(0),
					src[0]
				);
				Deno.exit(1);
			}
		}
	}
    tokens.push({type:TokenType.EOF,value:"End Of File"});
	return tokens;
}

// const source= await Deno.readTextFile('./test.txt');
// for (const token of tokenize(source)){
//     console.log(token);
    
// }