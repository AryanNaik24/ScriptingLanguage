//Interpreter


import {RuntimeVal,NumberVal} from "./values.ts";
import { BinaryExpr, Identifier, NumericLiteral,Program,Stmt, VarDeclare } from "../frontend/ast.ts";
import Environment from "./environment.ts";
import { evaluateBinary, evalIdentifier } from "./evaluation/expressions.ts";
import { evaluateProgram, evalVarDeclare } from "./evaluation/statements.ts";





//creates a onetime value based on astNode
export function evaluate (astNode:Stmt,env:Environment):RuntimeVal{
    switch (astNode.kind) {
        case "NumericLiteral":
            return{value:(( astNode as NumericLiteral).value),type:"number"}as NumberVal;
        
  
        case "BinaryExpr":
            return evaluateBinary(astNode as BinaryExpr,env);

        case "Program":
            return evaluateProgram(astNode as Program,env);



        case "Identifier":
            return evalIdentifier(astNode as Identifier,env);
        
        case "VarDeclare":
          return evalVarDeclare(astNode as VarDeclare,env);
    
        default:
            console.error("AST Node not setup for this type of interpretation",astNode);
            Deno.exit(1);
            
    }
}
