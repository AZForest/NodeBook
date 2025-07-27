import { timeStamp } from "console";
import { EventEmitter } from "events";

// 3.2 Ticker: Write a function that accepts a number and a callback as the
// arguments. The function will return an EventEmitter that emits an event
// called tick every 50 milliseconds until the number of milliseconds is passed
// from the invocation of the function. The function will also call the callback
// when the number of milliseconds has passed, providing, as the result, the total
// count of tick events emitted. Hint: you can use setTimeout() to schedule
// another setTimeout() recursively.

// 3.3 A simple modification: Modify the function created in exercise 3.2 so that
// it emits a tick event immediately after the function is invoked.

// 3.4 Playing with errors: Modify the function created in exercise 3.3 so that
// it produces an error if the timestamp at the moment of a tick (including the
// initial one that we added as part of exercise 3.3) is divisible by 5. Propagate
// the error using both the callback and the event emitter. Hint: use Date.now()
// to get the timestamp and the remainder (%) operator to check whether the
// timestamp is divisible by 5.

// Recursive and correct
export function rocker(delayNum, cb) {
  const e = new EventEmitter();

  let startTime = Date.now();
  let numEvents = 0;

  process.nextTick(() => {
    if (startTime % 5 === 0) {
      e.emit("error", startTime);
      let err = new Error("This is an Error thrown from from first pass.");
      return cb(err);
    }
    e.emit("tick", numEvents, startTime);
    numEvents++;
    iterator();
  });

  function iterator() {
    let currentTime = Date.now();
    if (currentTime - startTime > delayNum) {
      cb(null, numEvents);
      return;
    }
    if (currentTime % 5 === 0) {
      e.emit("error", currentTime);
      let errr = new Error("This is an Error thrown from iterator.");
      return cb(errr);
    }

    e.emit("tick", numEvents, currentTime);
    numEvents++;
    setTimeout(iterator, 50);
  }

  return e;
}
