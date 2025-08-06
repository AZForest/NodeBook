// 5.3 Producer-consumer with promises: Update the TaskQueuePC class
// internal methods so that they use just promises, removing any use of the
// async/await syntax. Hint: the infinite loop must become an asynchronous
// recursion. Beware of the recursive Promise resolution memory leak!

export class TaskQueuePC {
  private taskQueue: Array<() => Promise<unknown>>;
  private consumerQueue: Array<(task: () => Promise<unknown>) => void>;

  constructor(concurrency: number) {
    this.taskQueue = [];
    this.consumerQueue = [];
    for (let i = 0; i < concurrency; i++) {
      this.consumer();
    }
  }

  async consumer() {
    while (true) {
      try {
        const task = await this.getNextTask();
        await task();
      } catch (err) {
        console.error(err);
      }
    }
  }

  nAconsumer() {
    this.getNextTask()
      .then((task) => {
        return task();
      })
      .catch((err) => console.error(err))
      .finally(() => {
        this.nAconsumer();
      });
  }

  getNextTask(): Promise<() => Promise<unknown>> {
    return new Promise((resolve) => {
      if (this.taskQueue.length !== 0) {
        // const t = this.taskQueue.shift()
        // if (t) return resolve(t);
        return resolve(this.taskQueue.shift()!);
      }
      this.consumerQueue.push(resolve);
    });
  }

  runTask(task: () => Promise<unknown>) {
    return new Promise((resolve, reject) => {
      const taskWrapper = () => {
        const taskPromise = task();
        taskPromise.then(resolve, reject);
        return taskPromise;
      };
      if (this.consumerQueue.length !== 0) {
        const consumer = this.consumerQueue.shift();
        if (consumer) consumer(taskWrapper);
      } else {
        this.taskQueue.push(taskWrapper);
      }
    });
  }
}
