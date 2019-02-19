#!/usr/bin/env node

if (process.env.PWD) {
  console.log("CONTEXT PWD: ", process.env.PWD);
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
    o: "onStart"
  },
  default: {
    context: process.env.PWD || path.join(__dirname, "../../../"),
    checksumFolder: "checksum",
    folder: "react",
    name: "react",
    adjust: "",
    staticPath: "public",
    onStart: true
  }
});
const createStaticBuild = require("../");

const {
  context,
  checksumFolder,
  folder,
  name,
  adjust,
  staticPath,
  onStart
} = argv;
console.log("createStaticBuild :", {
  context,
  checksumFolder,
  folder,
  name,
  adjust,
  staticPath,
  onStart
});

new createStaticBuild({
  context,
  checksumFolder,
  folder,
  name,
  adjust,
  staticPath,
  onStart
});
