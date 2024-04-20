
//parser
// deno-lint-ignore-file no-explicit-any
import {
    BinaryExpr,
    Expr,
    Identifier,

    NumericLiteral,
    Program,
    Stmt,
  } from "./ast.ts";
      // NullLiteral, removed
  
  import { Token, tokenize, TokenType } from "./lexer.ts";
  
  /**
   * Frontend for producing a valid AST from sourcode
   */
  export default class Parser {
    private tokens: Token[] = [];
  
    /*
     * Determines if the parsing is complete and the END OF FILE Is reached.
     */
    private not_eof(): boolean {
      return this.tokens[0].type != TokenType.EOF;
    }
  
    /**
     * Returns the currently available token
     */
    private at() {
      return this.tokens[0] as Token;
    }
  
    /**
     * Returns the previous token and then advances the tokens array to the next value.
     */
    private eat() {
      const prev = this.tokens.shift() as Token;
      return prev;
    }
  
    /**
     * Returns the previous token and then advances the tokens array to the next value.
     *  Also checks the type of expected token and throws if the values dnot match.
     */
    private expect(type: TokenType, err: any) {
      const prev = this.tokens.shift() as Token;
      if (!prev || prev.type != type) {
        console.error("Parser Error:\n", err, prev, " - Expecting: ", type);
        Deno.exit(1);
      }
  
      return prev;
    }
  
    public produceAST(sourceCode: string): Program {
      this.tokens = tokenize(sourceCode);
      const program: Program = {
        kind: "Program",
        body: [],
      };
  
      // Parse until end of file
      while (this.not_eof()) {
        program.body.push(this.parse_stmt());
      }
  
      return program;
    }
  
    // Handle complex statement types
    private parse_stmt(): Stmt {
      // skip to parse_expr
      return this.parse_expr();
    }
  
    // Handle expressions
    private parse_expr(): Expr {
      return this.parse_additive_expr();
    }
  
    // Handle Addition & Subtraction Operations
    private parse_additive_expr(): Expr {
      let left = this.parse_multiplicitave_expr();
  
      while (this.at().value == "+" || this.at().value == "-") {
        const operator = this.eat().value;
        const right = this.parse_multiplicitave_expr();
        left = {
          kind: "BinaryExpr",
          left,
          right,
          operator,
        } as BinaryExpr;
      }
  
      return left;
    }
  
    // Handle Multiplication, Division & Modulo Operations
    private parse_multiplicitave_expr(): Expr {
      let left = this.parse_primary_expr();
  
      while (
        this.at().value == "/" || this.at().value == "*" || this.at().value == "%"
      ) {
        const operator = this.eat().value;
        const right = this.parse_primary_expr();
        left = {
          kind: "BinaryExpr",
          left,
          right,
          operator,
        } as BinaryExpr;
      }
  
      return left;
    }
  
    // Orders Of Prescidence
    // AdditiveExpr
    // MultiplicitaveExpr
    // PrimaryExpr
  
    // Parse Literal Values & Grouping Expressions
    private parse_primary_expr(): Expr {
      const tk = this.at().type;
  
      // Determine which token we are currently at and return literal value
      switch (tk) {
        // User defined values.
        case TokenType.Identifier:
          return { kind: "Identifier", symbol: this.eat().value } as Identifier;
        
        // case TokenType.Null:
        //   this.eat();//advance past null keyword
        //   return{kind:"NullLiteral", value:"null"} as NullLiteral;
        // case TokenType.Let:
        // case TokenType.BinaryOperator:
        // case TokenType.Equals:
        // case TokenType.CloseParen:
        // case TokenType.EOF:
        
        // Constants and Numeric Constants
        case TokenType.Number:
          return {
            kind: "NumericLiteral",
            value: parseFloat(this.eat().value),
          } as NumericLiteral;
  
        // Grouping Expressions
        case TokenType.OpenParen: {
          this.eat(); // eat the opening paren
          const value = this.parse_expr();
          this.expect(
            TokenType.CloseParen,
            "Unexpected token found inside parenthesised expression. Expected closing parenthesis.",
          ); // closing paren
          return value;
        }
  
        // Unidentified Tokens and Invalid Code Reached
        default:
          console.error("Unexpected token found during parsing!", this.at());
          Deno.exit(1);
      }
    }
  }