"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNestedFiles = listNestedFiles;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// 4.3 Recursive find: Write recursiveFind(), a callback-style function that
// takes a path to a directory in the local filesystem and a keyword, as per the
// following signature:
// function recursiveFind(dir, keyword, cb) { /* ... */ }
// The function must find all the text files within the given directory that
// contain the given keyword in the file contents. The list of matching files
// should be returned using the callback when the search is completed. If no
// matching file is found, the callback must be invoked with an empty array.
// As an example test case, if you have the files foo.txt, bar.txt, and baz.txt
// in myDir and the keyword 'batman' is contained in the files foo.txt and baz.
// txt, you should be able to run the following code:
// recursiveFind('myDir', 'batman', console.log)
// // should print ['foo.txt', 'baz.txt']
// Bonus points if you make the search recursive (it looks for text files in any
// subdirectory as well). Extra bonus points if you manage to perform the
// search within different files and subdirectories in parallel, but be careful to
// keep the number of parallel tasks under control!
// 4.2 List files recursively: Write listNestedFiles(), a callback-style function
// that takes, as the input, the path to a directory in the local filesystem and that
// asynchronously iterates over all the subdirectories to eventually return a list
// of all the files discovered. Here is what the signature of the function should
// look like:
// function listNestedFiles (dir, cb) { /* ... */ }
// Bonus points if you manage to avoid callback hell. Feel free to create
// additional helper functions if needed.
function listNestedFiles(dir, finalCb) {
    let files = [];
    faucon(dir, 0, 0, files, (err, res) => {
        if (err)
            return finalCb(err, res);
        return finalCb(null, res);
    });
}
//(NodeJS.ErrnoException | null ) & ([] | null | void)
function faucon(dir, index, level, files, fauconCb) {
    fs_1.default.readdir(dir, (err, children) => {
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
        const entryPath = path_1.default.join(dir, children[index]);
        console.log(delimiter + entryPath);
        fs_1.default.stat(entryPath, (err, stats) => {
            if (err) {
                return fauconCb(err, null);
            }
            if (stats.isFile()) {
                files.push(entryPath);
                faucon(dir, index + 1, level, files, fauconCb);
            }
            else if (stats.isDirectory()) {
                faucon(entryPath, 0, level + 1, files, () => {
                    faucon(dir, index + 1, level, files, fauconCb);
                });
            }
        });
    });
}
