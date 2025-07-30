import { recursiveFind, TaskQueue } from "./fourthreequeue.js";

let queue = new TaskQueue(20);
queue.on("error", (err) => console.log(err));
queue.on("empty", (files) => console.log("We empty: "));
// queue.on("adding", () => console.log("Adding task..."));
// queue.on("removing", () => console.log("Removing task..."));

recursiveFind(
  "/Users/alexforest/Desktop/Coding/Tester",
  "pomme",
  queue,
  (files) => {
    console.log(files);
  }
);

// recursiveFind("/Users/alexforest/Desktop/Coding/Tester", "pomme", (files) => {
//   console.log(files);
// });
