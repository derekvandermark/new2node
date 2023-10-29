import { compileFile } from "pug";

type Pathname = `/${string}`; // this exists in router.ts so make a single source 

// data obj to extend {title: string}?

export function render(templateFile: string, data?: object): string {
    const compiledFunction = compileFile(templateFile);
    return compiledFunction(data);
}