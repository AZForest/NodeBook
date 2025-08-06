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

function mapNonAsync(iterable, callback) {
  let results = [];
  iterable.forEach((item) => {
    results.push(callback(item));
  });
  return results;
}

function mapAsync(iterable, callback, concurrency) {
  let results = [];
  let queue = [];
  let running = 0;
  iterable.forEach((item) => {
    //runTask(() => Promise.resolve(item));
    runTask(item);
  });

  function next() {
    while (running < concurrency && queue.length > 0) {
      running++;
      const item = queue.shift();
      item()
        .then((res) => {
          // console.log(results);
          results.push(callback(res));
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          running--;
          if (queue.length === 0) {
            return finalCallback(results);
          }
          next();
        });
    }
  }

  function runTask(val) {
    return new Promise((resolve, reject) => {
      queue.push(() => {
        //return val().then(resolve, reject);
        return Promise.resolve(val);
      });
      process.nextTick(next);
    });
  }

  let finalCallback = () => {};
  return new Promise((resolve) => {
    finalCallback = resolve;
  });
}
let z = mapAsync([1, 2, 3, 4, 5], (val) => val * 30, 1);
z.then((res) => console.log(res));

let x = [1, 2, 3, 4, 5].map((val) => val * 5);
console.log(x);

let r = mapNonAsync([1, 2, 3, 4, 5], (val) => val * 20);
console.log(r);

//let z = mapAsync([1, 2, 3, 4, 5], (val) => val * 30, 1);
//console.log(z);
// setTimeout(() => {
//   console.log(r);
// }, 3000);
