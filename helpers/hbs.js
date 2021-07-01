const moment = require('moment');
const path = require('path');
const fs = require('fs');

module.exports = {
  formatDate: (date, format) => {
    return moment(date).locale('lv').format(format);
  },
  truncate: function (str) {
    const len = 200;
    if (str.length > len && str.length > 0) {
      let new_str = str + ' ';
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(' '));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + '...';
    }
    return str;
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '');
  },
  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    // if (loggedUser === null) return '';
    // if (storyUser._id.toString() == loggedUser._id.toString()) {
    //   if (floating) {
    //     return `<a href="/recipes/edit/${storyId}" class="btn-floating halfway-fab blue" title="Rediģēt recepti"><i class="fas fa-edit fa-small"></i></a>`;
    //   } else {
    //     return `<a href="/recipes/edit/${storyId}" title="Rediģēt recepti"><i class="fas fa-edit"></i></a>`;
    //   }
    // } else {
      return '';
    // }
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      );
  },
  isAuthor: function (storyUser, loggedUser) {
    return storyUser._id.toString() == loggedUser._id.toString();
  },
  pdfExists: function (recipeId) {
    const file = path.join(
      __dirname,
      `../download/${recipeId}/${recipeId}.pdf`
    );
    if (fs.existsSync(file)) {
      return true;
    }
    return false;
  },
  beersmithExists: function (recipeId) {
    const file = path.join(
      __dirname,
      `../download/${recipeId}/${recipeId}.bsmx`
    );
    if (fs.existsSync(file)) {
      return true;
    }
    return false;
  },

  filesExist: (recipeId) => {
    return (
      module.exports.pdfExists(recipeId) ||
      module.exports.beersmithExists(recipeId)
    );
  },
};
