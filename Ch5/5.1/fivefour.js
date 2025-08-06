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

function mapAsync(iterable, concurrency, callback) {
  let running = 0;
  let queue = [];
  let results = new Array(iterable.length);
  let index = 0;

  iterable.forEach((promise) => {
    runTask(() => callback(promise));
  });

  function next() {
    while (running < concurrency && queue.length) {
      const item = queue.shift();
      const taskIndex = index++;
      item()
        .then((res) => {
          results[taskIndex] = res;
          console.log(res + " getting here");
        })
        .catch((err) => {
          console.error("Task error:", err);
        })
        .finally(() => {
          running--;
          if (running === 0 && !queue.length) {
            return finalCallback(results);
          }
          next();
        });
      running++;
    }
  }

  function runTask(task) {
    return new Promise((resolve, reject) => {
      queue.push(() => {
        return task().then(resolve, reject);
      });
      process.nextTick(next);
    });
  }

  let finalCallback = () => {};
  return new Promise((resolve) => {
    finalCallback = resolve;
  });
}

mapAsync([1, 2, 3], 2, (num) => {
  return new Promise((resolve) => setTimeout(() => resolve(num * 2), 1000));
}).then((results) => {
  console.log("Done:", results);
});
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let promises = [
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (true) {
        resolve(1);
      } else {
        reject(-1);
      }
    }, 1000);
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (true) {
        resolve(2);
      } else {
        reject(-2);
      }
    }, 1500);
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (true) {
        resolve(3);
      }
      reject(-3);
    }, 500);
  }),
];
//mappedArr = mapAsync(promises, 1, (results) => console.log(results));
