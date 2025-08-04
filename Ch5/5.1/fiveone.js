// 5.1 Dissecting Promise.all(): Implement your own version of Promise.
// all() leveraging promises, async/await, or a combination of the two.
// The function must be functionally equivalent to its original counterpart.

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
const prom = promiseAllCreator(promises).then(
  (res) => console.log("Response: " + res),
  (err) => console.log("Prom Err: " + err)
);
// const realProm = Promise.all(promises).then(
//   (res) => console.log("Response: " + res),
//   (err) => console.log("Prom Err: " + err)
// );

function promiseAllCreator(promises) {
  return new Promise((resolve, reject) => {
    newArr = [];

    let currentCount = 0;
    let totalCount = promises.length;
    promises.forEach((promise, index) => {
      promise.then(
        (result) => {
          // console.log(result);
          //newArr.push(result);
          newArr[index] = result;
          currentCount++;
          if (currentCount == totalCount) {
            resolve(newArr);
          }
        },
        (err) => {
          //throw new Error("Operation " + promise + " failed: " + err);
          //reject(new Error("Operation " + promise + " failed: " + err));
          reject(err);
        }
      );
      // .catch((err) => {
      //   console.log("Here: " + err);
      //   reject(err);
      // });
      // .then(
      //   (res) => {},
      //   (err) => {
      //     reject(err);
      //   }
      // );
    });
  });
}

// const p = new Promise((resolve, reject) => {
//   const time = new Date().getMilliseconds();
//   setTimeout(() => {
//     const now = new Date().getMilliseconds();
//     console.log(time);
//     console.log(now);
//     if (now - time > 100) {
//       resolve(5);
//     } else {
//       reject(0);
//     }
//   }, 1000);
// }).then(
//   (res) => {
//     console.log("Res: " + res);
//   },
//   (err) => {
//     console.log("Err: " + err);
//   }
// );

//Promise.all;
