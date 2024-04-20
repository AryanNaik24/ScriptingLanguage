//any function

import Parser from "./frontend/parser.ts";
import { evaluate } from "./runtime/interpreter.ts";

repl();

function repl(){
    const parser = new Parser();
    console.log("\nAryanLang v0.1");
    console.log("\nEnter exit to quit.");

    while (true){
        const input = prompt(">");
        if(!input || input.includes("exit")){
            Deno.exit(1);
        }
        const program = parser.produceAST(input);
        const result = evaluate(program);
        console.log(result);
        
    }
    
}