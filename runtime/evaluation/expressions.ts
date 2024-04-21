import { AssignmentExpr, BinaryExpr, Identifier } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { NumberVal, RuntimeVal, MK_NULL } from "../values.ts";

export function evaluateNumericBinary(lhs:NumberVal,rhs:NumberVal,operator:string):NumberVal{
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

export function evaluateBinary(binop:BinaryExpr,env:Environment):RuntimeVal{
    const leftHandSide = evaluate(binop.left,env);
    const rigthHandSide =  evaluate(binop.right,env);
    if (leftHandSide.type ==="number"&&rigthHandSide.type==="number") {
        return evaluateNumericBinary(leftHandSide as NumberVal,rigthHandSide as NumberVal,binop.operator);
    }

    return MK_NULL();
}


export function evalIdentifier(ident:Identifier,env:Environment):RuntimeVal{
    const val = env.lookupVar(ident.symbol);
    return val;
}

export function evalAssignment(node:AssignmentExpr,env:Environment):RuntimeVal{
    if(node.assigne.kind !=="Identifier"){
        throw `Invalid LHS inside assignment exprn ${JSON.stringify(node.assigne)}`;
    }

    const varname = (node.assigne as Identifier).symbol;
    return env.assignVar(varname,evaluate(node.value,env))
}