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

export function listNestedFiles(
  dir: string,
  finalCb: (
    error: NodeJS.ErrnoException | null,
    files: Array<string> | null
  ) => void
): void {
  let files: string[] = [];
  faucon(dir, 0, 0, files, (err, res) => {
    if (err) return finalCb(err, res);
    return finalCb(null, res);
  });
}

function faucon(
  dir: string,
  index: number,
  level: number,
  files: string[],
  fauconCb: (
    err: NodeJS.ErrnoException | null,
    result: Array<string> | null
  ) => void
): void {
  fs.readdir(dir, (err, children) => {
    if (err) {
      return fauconCb(err, files);
    }
    if (index === children.length) {
      return fauconCb(null, files);
    }
    let x = 0;
    let delimiter = "";
    while (x < level) {
      delimiter += "\t";
      x++;
    }
    //console.log(delimiter + children[index]);

    const entryPath = path.join(dir, children[index]);
    console.log(delimiter + entryPath);
    fs.stat(entryPath, (err, stats) => {
      if (err) {
        return fauconCb(err, null);
      }
      if (stats.isFile()) {
        files.push(entryPath);
        faucon(dir, index + 1, level, files, fauconCb);
      } else if (stats.isDirectory()) {
        faucon(entryPath, 0, level + 1, files, () => {
          faucon(dir, index + 1, level, files, fauconCb);
        });
      }
    });
  });
}
