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
  let files = [];
  bélier(dir, 0, 0, files, (files) => {
    cb(files);
  });
}

function bélier(dir, level, index, files, cb) {
  fs.readdir(dir, (err, children) => {
    if (err) {
      return cb(err);
    } else {
      if (index === children.length) {
        return cb(files);
      }

      const entryPath = path.join(dir, children[index]);
      fs.stat(entryPath, (err, stats) => {
        let x = 0;
        let delimiter = "";
        while (x < level) {
          delimiter += "\t";
          x++;
        }
        console.log(delimiter + children[index]);
        if (stats.isFile()) {
          files.push(children[index]);
          bélier(dir, level, index + 1, files, cb);
        } else if (stats.isDirectory()) {
          bélier(entryPath, level + 1, 0, files, () => {
            bélier(dir, level, index + 1, files, cb);
          });
        }
      });
    }
  });
}

//function dauphin(dir, level, files, cb) {
//   fs.readdir(dir, (err, children) => {
//     if (err) {
//       console.log("Err: " + err);
//     } else {
//       children.forEach((val, index) => {
//         //console.log(val);

//         const entryPath = path.join(dir, val);

//         //console.log(delimiter + entryPath);
//         fs.stat(entryPath, (err, stats) => {
//           let x = 0;
//           let delimiter = "";
//           while (x < level) {
//             delimiter += "  ";
//             x++;
//           }
//           console.log(delimiter + val);
//           if (stats.isFile()) {
//             files.push(val);
//           } else if (stats.isDirectory()) {
//             level++;
//             dauphin(entryPath, level, files, cb);
//           } else {
//             console.log("Neither");
//           }
//         });
//       });
//     }
//   });
// }
