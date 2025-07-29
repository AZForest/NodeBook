import { listNestedFiles } from "./fourtwo.js";

listNestedFiles("", (file, dir) => {
  console.log(file);
  console.log(dir);
  //console.log(path.basename);
});
