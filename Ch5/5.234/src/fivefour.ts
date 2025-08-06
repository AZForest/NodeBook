// 5.4 An asynchronous map(): Implement a parallel asynchronous version
// of Array.map() that supports promises and a concurrency limit. The
// function should not directly leverage the TaskQueue or TaskQueuePC
// classes we presented in this chapter, but it can use the underlying patterns.
// The function, which we will define as mapAsync(iterable, callback,
// concurrency), will accept the following as inputs:
// • An iterable, such as an array.
// • A callback, which will receive as the input each item of the iterable
// (exactly like in the original Array.map()) and can return either
// a Promise or a simple value.
// • A concurrency, which defines how many items in the iterable can
// be processed by callback in parallel at each given time.

function mapAsync(
  iterable: Array<unknown>,
  callback: (val: unknown) => Promise<unknown> | unknown,
  concurrency: number
) {
  let running: number = 0;
  let queue: Array<() => Promise<unknown> | unknown> = [];

  iterable.forEach((val, i) => {
    callback(val);
  });

  function next() {
    while (running < concurrency && queue.length > 0) {
      const item = queue.shift();
      if (item) {
        item().finally(() => {
          running--;
          next();
        });
        running++;
      }
    }
  }

  function runTask(task: () => Promise<unknown>) {
    return new Promise((resolve, reject) => {
      queue.push(() => {
        task().then(resolve, reject);
      });
      process.nextTick(next);
    });
  }
}
