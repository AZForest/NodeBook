"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
// 5.2 TaskQueue with promises: Migrate the TaskQueue class internals from
// promises to async/await where possible. Hint: you won't be able to use
// async/await everywhere.
class TaskQueue extends events_1.EventEmitter {
    constructor(concurrency) {
        super();
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }
    async next() {
        while (this.running < this.concurrency && this.queue.length) {
            const task = this.queue.shift();
            //   if (task) {
            //     task().finally(() => {
            //       this.running--;
            //       this.next();
            //     });
            //   }
            this.running++;
            if (task)
                await task();
            this.running--;
            this.next();
        }
    }
    //   runTask<T>(task: () => Promise<T>): Promise<T> {
    //     return new Promise((resolve, reject) => {
    //       this.queue.push(() => {
    //         return task().then(resolve, reject);
    //       });
    //       process.nextTick(this.next.bind(this));
    //     });
    //   }
    async runTaskAsync(task) {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                // let res = await task();
                // resolve(res);
                try {
                    let res = await task();
                    resolve(res);
                }
                catch (err) {
                    reject(err);
                }
            });
            process.nextTick(this.next.bind(this));
        });
    }
}
//# sourceMappingURL=index.js.map