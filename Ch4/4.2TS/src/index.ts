import fs from "fs";
import { listNestedFiles } from "./fourtwo.js";

console.log("Hello TypeScript + Node!");
console.log(fs.readdirSync("."));

let dir = "/Users/alexforest/Desktop/Coding/Tester";
listNestedFiles(dir, (error, files) => {
  if (error) {
    console.log("Error occurred: " + error);
  }
  console.log("Number of Files: " + files?.length);
});
