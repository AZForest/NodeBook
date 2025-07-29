import { concatFiles } from "./fourone.js";

const newFileName = "test4.txt";

concatFiles(
  newFileName,
  (err, num) => {
    console.log("Num of files read: " + num);
  },
  "./test.txt",
  "./test2.txt",
  "test3.txt"
);

// concatFiles((f, res) => {
//     console.log("Some results: " + f);
//     console.log("More: " + res);
//   }, "./test.txt");
