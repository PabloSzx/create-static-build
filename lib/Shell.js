const shell = require("shelljs");
const _ = require("lodash");

module.exports = class Shell {
  constructor({ context, name }) {
    this.context = context;
    this.name = name;
  }
};
