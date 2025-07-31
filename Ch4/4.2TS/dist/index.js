"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const fourtwo_js_1 = require("./fourtwo.js");
console.log("Hello TypeScript + Node!");
console.log(fs_1.default.readdirSync("."));
let dir = "/Users/alexforest/Desktop/Coding/Tester";
(0, fourtwo_js_1.listNestedFiles)(dir, (error, files) => {
    if (error) {
        console.log("Error occurred: " + error);
    }
    console.log("Number of Files: " + (files === null || files === void 0 ? void 0 : files.length));
});
