const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const mkdirp = require("mkdirp");

module.exports = class Checksum {
  constructor({ context, folder, name, checksumFolder, adjust }) {
    this.context = context;
    this.folder = folder;
    this.name = name;
    this.adjust = adjust;
    this.checksumFolder = checksumFolder
      ? path.join(context, adjust, checksumFolder)
      : path.join(__dirname, "../data");

    console.log("this.checksumFolder", this.checksumFolder);
  }

  async ready(name = this.name, checksumFolder = this.checksumFolder) {
    return new Promise((resolve, reject) => {
      mkdirp(checksumFolder, err => {
        fs.writeFile(
          path.join(checksumFolder, "checksum.json"),
          JSON.stringify({}),
          { flag: "wx" },
          async err => {
            try {
              this.read();
              if (!_.has(this.checksum, name)) {
                this.checksum[name] = {
                  checksum: "",
                  modified: false,
                };
                await this.save();
              }
              resolve(true);
            } catch (err) {
              reject(err);
            }
          }
        );
      });
    });
  }

  checkHashFolder(hash, name = this.name) {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.checksum[name].checksum !== hash) {
          this.checksum[name].checksum = hash;
          this.checksum[name].modified = true;
          resolve(true); //shell build
        } else {
          resolve(false);
          this.checksum[name].modified = false;
        }

        this.save();
      } catch (err) {
        reject(err);
      }
    });
  }

  read(checksumFolder = this.checksumFolder) {
    this.checksum = JSON.parse(
      fs.readFileSync(path.join(checksumFolder, "checksum.json")).toString()
    );
  }

  save(
    checksum = this.checksum,
    name = this.name,
    checksumFolder = this.checksumFolder
  ) {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(checksumFolder, "checksum.json"),
        JSON.stringify(checksum),
        "utf8",
        err => {
          if (err) {
            reject(err);
          } else {
            console.log(
              `Checksum ${path.join(checksumFolder, "checksum.json")} saved`
            );
            resolve(true);
          }
        }
      );
    });
  }
};
