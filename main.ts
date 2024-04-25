//any function

import Parser from "./frontend/parser.ts";
import{createGlobalEnv} from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";

//repl();
run("./test.txt");


async function run(filename: string) {
    const parser = new Parser();
    const env = createGlobalEnv();
    
  
    const input = await Deno.readTextFile(filename);
    const program = parser.produceAST(input);
    console.log(program);
    
  
    const result = evaluate(program, env);
    console.log(result);
  }

function repl(){
    const parser = new Parser();
    const env = createGlobalEnv();


    console.log("\nAryanLang v0.1");
    console.log("\nEnter exit to quit.");

    while (true){
        const input = prompt("<3");
        if(!input || input.includes("exit")){
            Deno.exit(1);
        }
        const program = parser.produceAST(input);
        const result = evaluate(program,env);
        console.log(result);
        
    }
    
}