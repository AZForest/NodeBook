import { FindRegex } from "./FindRegex.js";
// const FindRegex = require("./FindRegex");

// 3.1 A simple event: Modify the asynchronous FindRegex class so that it
// emits an event when the find process starts, passing the input files list as
// an argument. Hint: beware of Zalgo!

const findRegexInstance = new FindRegex(/hello \w+/);
findRegexInstance
  .addFile("textFile1.txt")
  .addFile("testJson.json")
  .find()
  .on("found", (file, match) => console.log(`Matched ${match} in File ${file}`))
  .on("error", (err) => console.error(`Error found: ${err}`));
