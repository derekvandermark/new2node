import { compileFile } from "pug";

export function render<Data extends { title: string }>(templateFile: string, data?: Data): string {
    const compiledFunction = compileFile(templateFile);
    return compiledFunction(data);
}