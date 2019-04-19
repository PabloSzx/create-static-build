const path = require("path");
const { hashElement } = require("folder-hash");
const _ = require("lodash");

module.exports = class HashFolder {
  constructor({
    context,
    folder,
    name,
    adjust,
    filterOptions = {
      folders: { exclude: [".*", "node_modules", "LOGS", "build"] },
      files: {
        include: [
          "*.ts",
          "*.tsx",
          "*.js",
          "*.json",
          "*.css",
          "*.scss",
          "*.html",
        ],
      },
    },
  }) {
    this.context = context;
    this.folder = folder;
    this.name = name;
    this.filterOptions = filterOptions;
    this.adjust = adjust;
  }

  getHashFolder(
    context = this.context,
    folder = this.folder,
    filterOptions = this.filterOptions,
    adjust = this.adjust
  ) {
    return new Promise((resolve, reject) => {
      hashElement(
        path.join(context, adjust, folder),
        filterOptions,
        (error, hash) => {
          if (error) {
            reject(console.error("hashing failed:", error));
          } else {
            resolve(hash.toString());
          }
        }
      );
    });
  }
};
