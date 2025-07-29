import fs from "fs";

// 4.1 File concatenation: Write the implementation of concatFiles(), a
// callback-style function that takes two or more paths to text files in the
// filesystem and a destination file:

// This function must copy the contents of every source file into the destination
// file, respecting the order of the files, as provided by the arguments list.
// For instance, given two files, if the first file contains foo and the second
// file contains bar, the function should write foobar (and not barfoo) in the
// destination file. Note that the preceding example signature is not valid
// JavaScript syntax: you need to find a different way to handle an arbitrary
// number of arguments. For instance, you could use the rest parameters syntax
// (nodejsdp.link/rest-parameters).

export function concatFiles(dest, cb, ...srcFile) {
  wolfStarter(0, dest, srcFile, (numFiles) => {
    if (err) {
      return cb(err);
    }
    cb(null, numFiles);
  });
}

function wolfStarter(index, dest, srcFile, cb) {
  console.log(index, srcFile.length);
  if (index === srcFile.length) {
    return cb(index);
  }
  wolf(srcFile[index], dest, () => {
    index++;
    wolfStarter(index, dest, srcFile, cb);
  });
}

function wolf(fileName, dest, cb) {
  fs.readFile(fileName, "utf8", (err, fileContent) => {
    if (err) {
      return cb(err);
    }

    wolfWrite(fileContent, dest, cb);
  });
}

function wolfWrite(fileContents, dest, cb) {
  fs.appendFile(dest, `${fileContents}\n`, (err) => {
    if (err) {
      return cb(err);
    }

    return cb();
  });
}
