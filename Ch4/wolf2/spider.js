import { urlToFilename } from "./utils.js";
import { spiderLinks } from "./spiderLinks.js";
import fs from "fs";
import path from "path";
import superagent from "superagent";
import mkdirp from "mkdirp";

export function spider(url, nesting, cb) {
  const filename = urlToFilename(url);
  fs.readFile(filename, "utf8", (err, fileContent) => {
    if (err) {
      if (err.code !== "ENOENT") {
        return cb(err);
      }
      // The file doesn't exist, so let's download it
      return download(url, filename, (err, requestContent) => {
        if (err) {
          return cb(err);
        }
        spiderLinks(url, requestContent, nesting, cb);
      });
    }
    // The file already exists, let's process the links
    spiderLinks(url, fileContent, nesting, cb);
  });
}

export function saveFile(filename, contents, cb) {
  mkdirp(path.dirname(filename), (err) => {
    if (err) {
      return cb(err);
    }
    fs.writeFile(filename, contents, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, filename, true);
    });
  });
}

export function download(url, filename, cb) {
  console.log(`Downloading ${url}`);
  superagent.get(url).end((err, res) => {
    if (err) {
      return cb(err);
    }
    saveFile(filename, res.text, (err) => {
      if (err) {
        return cb(err);
      }
      console.log(`Downloaded and saved: ${url}`);
      cb(null, res.text);
    });
  });
}
