#!/usr/bin/env node

if (process.env.PWD) {
  console.log("CONTEXT PWD: ", process.env.PWD);
} else {
  process.env.PWD = process.cwd();
  console.log("PWD Generated: ", process.env.PWD);
}
const path = require("path");
const argv = require("minimist")(process.argv.slice(2), {
  alias: {
    c: "context",
    cf: "checksumFolder",
    f: "folder",
    n: "name",
    a: "adjust",
    sp: "staticPath",
    o: "onStart",
    hf: "hashFolder",
    sf: "shellFolder",
    rm: "remove",
    cp: "copy",
    b: "build",
  },
  default: {
    context: process.env.PWD || path.join(__dirname, "../../../"),
    checksumFolder: "checksum",
    folder: "react",
    name: "react",
    adjust: "",
    staticPath: "public",
    onStart: true,
    copy: true,
    hashFolder: undefined,
    shellFolder: undefined,
    remove: true,
    copy: true,
    build: true,
  },
});

const createStaticBuild = require("../");

const {
  context,
  checksumFolder,
  folder,
  name,
  adjust,
  staticPath,
  onStart,
  hashFolder,
  shellFolder,
  remove,
  copy,
  build,
} = argv;
console.log("createStaticBuild 1.0.9501 :", {
  context,
  checksumFolder,
  folder,
  name,
  adjust,
  staticPath,
  onStart,
  hashFolder,
  shellFolder,
  remove,
  copy,
  build,
});

new createStaticBuild({
  context,
  checksumFolder,
  folder,
  name,
  adjust,
  staticPath,
  onStart,
  hashFolder,
  shellFolder,
  scripts: {
    remove,
    copy,
    build,
  },
});
