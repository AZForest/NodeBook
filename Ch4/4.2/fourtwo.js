import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

// 4.2 List files recursively: Write listNestedFiles(), a callback-style function
// that takes, as the input, the path to a directory in the local filesystem and that
// asynchronously iterates over all the subdirectories to eventually return a list
// of all the files discovered. Here is what the signature of the function should
// look like:
// function listNestedFiles (dir, cb) { /* ... */ }
// Bonus points if you manage to avoid callback hell. Feel free to create
// additional helper functions if needed.

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function listNestedFiles(dir, cb) {
  let direct = "/Users/alexforest/Desktop/AWS_Solutions_Architect";
  let files = [];
  dauphin(direct);
  cb(__filename, __dirname);
}

function dauphin(dir) {
  fs.readdir(dir, (err, children) => {
    if (err) {
      console.log("Err: " + err);
    } else {
      children.forEach((val, index) => {
        //console.log(val);

        const entryPath = path.join(dir, val);
        console.log(entryPath);
        fs.stat(entryPath, (err, stats) => {
          if (stats.isFile()) {
            console.log(val);
          } else if (stats.isDirectory()) {
            dauphin(entryPath);
          } else {
            console.log("Neither");
          }
        });
      });
    }
  });
}
