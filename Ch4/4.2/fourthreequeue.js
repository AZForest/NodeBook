import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { EventEmitter } from "events";

// export function recursiveFind(dir, keyword, queue, cb) {
//   let files = [];
//   queue.pushTask((done) => {
//     renard(dir, keyword, 0, files, queue, (files) => {
//       cb(files);
//     });
//   });
// }

export function recursiveFind(dir, keyword, queue, finalCb) {
  let files = [];

  queue.once("empty", () => {
    finalCb(files);
  });
  queue.pushTask((done) => {
    renard(dir, keyword, files, queue, done);
  });
}

function renard2(dir, keyword, files, queue, cb, rfcb) {
  fs.readdir(dir, (err, children) => {
    if (err) {
      return cb(err);
    }
    if (children.length === 0) {
      return;
    }

    children.forEach((child) => {
      const entryPath = path.join(dir, child);
      fs.stat(entryPath, (err, stats) => {
        if (err) {
          return cb(err);
        }
        if (stats.isFile()) {
          searchFile(entryPath, keyword, (inFile) => {
            if (inFile) {
              files.push(entryPath);
              console.log("getting here ", files.length);
            }
            return cb();
          });
        } else if (stats.isDirectory()) {
          queue.pushTask(() => {
            renard(entryPath, keyword, files, queue, cb);
            return cb();
          });
        }
      });
    });
  });
}

function renard(dir, keyword, files, queue, renDone) {
  fs.readdir(dir, (err, children) => {
    if (err) {
      return renDone(err);
    }
    if (children.length === 0) {
      return renDone();
    }

    children.forEach((child) => {
      const entryPath = path.join(dir, child);
      queue.pushTask((statDone) => {
        fs.stat(entryPath, (err, stats) => {
          if (err) {
            return statDone(err);
          }
          if (stats.isFile()) {
            queue.pushTask((searchDone) => {
              searchFile(entryPath, keyword, (inFile) => {
                if (inFile) {
                  files.push(entryPath);
                  console.log("getting here ", files.length);
                }
                searchDone();
              });
            });
          } else if (stats.isDirectory()) {
            queue.pushTask((doneDir) => {
              renard(entryPath, keyword, files, queue, doneDir);
            });
          }
          statDone();
        });
      });
    });
    renDone();
  });
}

function searchFile(file, text, cb) {
  fs.readFile(file, "utf8", (err, contents) => {
    if (err) {
      return cb(err);
    }
    cb(contents.includes(text));
  });
}

export class TaskQueue extends EventEmitter {
  constructor(concurrency) {
    super();
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  pushTask(task) {
    this.queue.push(task);
    this.emit("adding");
    process.nextTick(this.next.bind(this));
  }

  next() {
    if (this.running === 0 && this.queue.length === 0) {
      return this.emit("empty");
    }

    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      task((err) => {
        if (err) {
          this.emit("error", err);
        }
        this.running--;
        this.emit("removing");
        process.nextTick(this.next.bind(this));
      });
      this.running++;
    }
  }
}
