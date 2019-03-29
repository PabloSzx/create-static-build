#!/usr/bin/env node

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
    s: "silent",
    i: "install"
  },
  default: {
    context: process.env.PWD || process.cwd(),
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
    install: true,
    silent: false,
    force: false
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
  onStart,
  hashFolder,
  shellFolder,
  remove,
  copy,
  build,
  install,
  silent,
  force
} = argv;

if (!silent)
  console.log(`createStaticBuild ${require("../package.json").version} :`, {
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
    install,
    silent,
    force
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
  silent,
  force,
  scripts: {
    remove,
    copy,
    build,
    install
  }
});
