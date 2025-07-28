import { getPageLinks } from "./utils.js";
import { spider } from "./spider.js";

export function spiderLinks(currentUrl, body, nesting, cb) {
  if (nesting === 0) {
    // Remember Zalgo from chapter 3?
    return process.nextTick(cb);
  }
  const links = getPageLinks(currentUrl, body); // (1)
  if (links.length === 0) {
    return process.nextTick(cb);
  }
  function iterate(index) {
    // (2)
    if (index === links.length) {
      return cb();
    }
    spider(links[index], nesting - 1, function (err) {
      // (3)
      if (err) {
        return cb(err);
      }
      iterate(index + 1);
    });
  }
  iterate(0); // (4)
}
