import { listNestedFiles } from "./fourtwo.js";

listNestedFiles("/Users/alexforest/Desktop/Coding/Tester", (files) => {
  console.log("Total Number of files: " + files.length);
  //   files.forEach((file) => {
  //     console.log(file);
  //   });
});
