import fs from "fs";
import path from "path";

const ch09Path = path.resolve(__dirname, "../src/lib/curriculum/topics/machine-learning/chunk2-ch09.ts");
let ch09 = fs.readFileSync(ch09Path, "utf-8");

// Fix \nabla_\boldsymbol{\beta} -> \nabla_{\boldsymbol{\beta}}
const countBefore09 = (ch09.match(/\\nabla_\\boldsymbol/g) || []).length;
ch09 = ch09.replace(/\\nabla_\\boldsymbol/g, "\\nabla_{\\boldsymbol");
ch09 = ch09.replace(/\\nabla_{\\boldsymbol{\\beta}}/g, "\\nabla_{\\boldsymbol{\\beta}}");
// Check if { was already closed
// If it replaced \nabla_\boldsymbol{\beta} -> \nabla_{\boldsymbol{\beta}}
// we need to make sure the closing brace is present:
// Original was: \nabla_\boldsymbol{\beta} -> now \nabla_{\boldsymbol{\beta}}
// Wait: \nabla_\boldsymbol{\beta} has only one opening { after \boldsymbol
// So replacing \nabla_\boldsymbol with \nabla_{\boldsymbol would yield:
// \nabla_{\boldsymbol{\beta} (missing the closing brace for \nabla_{...}!)
// So \nabla_\boldsymbol{\beta} should become \nabla_{\boldsymbol{\beta}}!

// Let's reload ch09 fresh to be exact:
ch09 = fs.readFileSync(ch09Path, "utf-8");
ch09 = ch09.replaceAll("\\\\nabla_\\\\boldsymbol{\\\\beta}", "\\\\nabla_{\\\\boldsymbol{\\\\beta}}");
fs.writeFileSync(ch09Path, ch09, "utf-8");
console.log("ch09 updated. Matches replaced:", (ch09.match(/\\nabla_{\\boldsymbol{\\beta}}/g) || []).length);

// Now fix ch32
const ch32Path = path.resolve(__dirname, "../src/lib/curriculum/topics/machine-learning/chunk7-ch32.ts");
let ch32 = fs.readFileSync(ch32Path, "utf-8");
ch32 = ch32.replaceAll("untrusted_model.pkl", "untrusted\\\\_model.pkl");
fs.writeFileSync(ch32Path, ch32, "utf-8");
console.log("ch32 updated.");
