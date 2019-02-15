const path = require("path");
const { hashElement } = require("folder-hash");
const _ = require("lodash");

module.exports = class HashFolder {
  constructor({
    context,
    folder,
    name,
    filterOptions = {
      folders: { exclude: [".*", "node_modules", "LOGS"] },
      files: { include: ["*.js", "*.json"] },
    },
  }) {
    this.context = context;
    this.folder = folder;
    this.name = name;
    this.filterOptions = filterOptions;
  }

  getHashFolder(
    context = this.context,
    folder = this.folder,
    filterOptions = this.filterOptions
  ) {
    return new Promise((resolve, reject) => {
      hashElement(path.join(context, folder), filterOptions, (error, hash) => {
        if (error) {
          reject(console.error("hashing failed:", error));
        } else {
          resolve(hash.toString());
        }
      });
    });
  }
};
