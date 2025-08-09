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
function mapAsync<T, R>(
  iterable: Array<T>,
  callback: (val: T) => Promise<R> | R,
  concurrency: number
): Promise<R> {
  let running: number = 0;
  //let queue: Array<() => Promise<R> | R> = [];
  let queue: Array<[() => Promise<Awaited<T>>, number]> = [];
  let results: Array<R> = [];

  iterable.forEach((item, index) => {
    runTask(item, index);
  });

  function next() {
    while (running < concurrency && queue.length > 0) {
      running++;
      const [item, index] = queue.shift();
      if (item) {
        item()
          .then((res: T) => {
            // results.push(callback(res));
            return Promise.resolve(callback(res));
          })
          .then((res: R) => (results[index] = res))
          .catch((err: Error) => {
            console.error(err);
          })
          .finally(() => {
            running--;
            if (queue.length === 0 && running === 0) {
              return finalCallback(results);
            }
            next();
          });
        running++;
      }
    }
  }

  function runTask(val: T, index: number) {
    return new Promise((resolve, reject) => {
      queue.push([
        () => {
          //task().then(resolve, reject);
          return Promise.resolve(val);
        },
        index,
      ]);
      process.nextTick(next);
    });
  }

  let finalCallback = (value: Array<R> | null) => {};
  return new Promise((resolve) => {
    finalCallback = resolve;
  });
}
