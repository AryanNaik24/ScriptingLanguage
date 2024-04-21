import { Program, VarDeclare } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { MK_NULL, RuntimeVal } from "../values.ts";

export function evaluateProgram(program:Program,env:Environment):RuntimeVal{
    let lastEvaluated:RuntimeVal=MK_NULL();

    for (const statement of program.body){
        lastEvaluated = evaluate(statement,env);
    }

    return lastEvaluated;
}

export function evalVarDeclare(declaration:VarDeclare,env:Environment):RuntimeVal{
    const value= declaration.value ? evaluate(declaration.value,env):MK_NULL();
    return env.declareVar(declaration.identifier,value,declaration.constant);
}