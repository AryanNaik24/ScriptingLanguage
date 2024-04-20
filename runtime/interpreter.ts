//Interpreter


import {RuntimeVal,NumberVal,ValueType,NullVal} from "./values.ts";
import { BinaryExpr, NodeType,NumericLiteral,Program,Stmt } from "../frontend/ast.ts";


function evaluateProgram(program:Program):RuntimeVal{
    let lastEvaluated:RuntimeVal={type:"null",value:"null"}as NullVal;

    for (const statement of program.body){
        lastEvaluated = evaluate(statement);
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

function evaluateBinary(binop:BinaryExpr):RuntimeVal{
    const leftHandSide = evaluate(binop.left);
    const rigthHandSide =  evaluate(binop.right);
    if (leftHandSide.type ==="number"&&rigthHandSide.type==="number") {
        return evaluateNumericBinary(leftHandSide as NumberVal,rigthHandSide as NumberVal,binop.operator);
    }

    return {type:"null",value:"null"}as NullVal;
}


//creates a onetime value based on astNode
export function evaluate (astNode:Stmt):RuntimeVal{
    switch (astNode.kind) {
        case "NumericLiteral":
            return{value:(( astNode as NumericLiteral).value),type:"number"}as NumberVal;
        
        case "NullLiteral":
            return {value:"null",type:"null"}as NullVal;
        
        case "BinaryExpr":
            return evaluateBinary(astNode as BinaryExpr);

        case "Program":
            return evaluateProgram(astNode as Program);



        //case "Identifier":
    
        default:
            console.error("AST Node not setup for this type of interpretation",astNode);
            Deno.exit(1);
            
    }
}
