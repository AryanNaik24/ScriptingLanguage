//Interpreter


import {RuntimeVal,NumberVal,ValueType,NullVal, MK_NULL} from "./values.ts";
import { BinaryExpr, Identifier, NodeType,NumericLiteral,Program,Stmt } from "../frontend/ast.ts";
import Environment from "./environment.ts";


function evaluateProgram(program:Program,env:Environment):RuntimeVal{
    let lastEvaluated:RuntimeVal=MK_NULL();

    for (const statement of program.body){
        lastEvaluated = evaluate(statement,env);
    }

    return lastEvaluated;
}

function evaluateNumericBinary(lhs:NumberVal,rhs:NumberVal,operator:string):NumberVal{
    let result: number;
    if (operator == "+") {
      result = lhs.value + rhs.value;
    } else if (operator == "-") {
      result = lhs.value - rhs.value;
    } else if (operator == "*") {
      result = lhs.value * rhs.value;
    } else if (operator == "/") {
      // TODO: Division by zero checks
      if (rhs.value!==0) {
      result = lhs.value / rhs.value;
      }
      else {
        console.error("Invalid Expression!");
        Deno.exit(1);
        
      }
    } else {
      result = lhs.value % rhs.value;
    }
  
    return { value: result, type: "number" };
}

function evaluateBinary(binop:BinaryExpr,env:Environment):RuntimeVal{
    const leftHandSide = evaluate(binop.left,env);
    const rigthHandSide =  evaluate(binop.right,env);
    if (leftHandSide.type ==="number"&&rigthHandSide.type==="number") {
        return evaluateNumericBinary(leftHandSide as NumberVal,rigthHandSide as NumberVal,binop.operator);
    }

    return MK_NULL();
}


function evalIdentifier(ident:Identifier,env:Environment):RuntimeVal{
    const val = env.lookupVar(ident.symbol);
    return val;
}


//creates a onetime value based on astNode
export function evaluate (astNode:Stmt,env:Environment):RuntimeVal{
    switch (astNode.kind) {
        case "NumericLiteral":
            return{value:(( astNode as NumericLiteral).value),type:"number"}as NumberVal;
        
        // case "NullLiteral":
        //     return MK_NULL();
        
        case "BinaryExpr":
            return evaluateBinary(astNode as BinaryExpr,env);

        case "Program":
            return evaluateProgram(astNode as Program,env);



        case "Identifier":
            return evalIdentifier(astNode as Identifier,env);
    
        default:
            console.error("AST Node not setup for this type of interpretation",astNode);
            Deno.exit(1);
            
    }
}
