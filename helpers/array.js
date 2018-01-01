exports.isModelInArray = function (id) {
  return function (model) {
    if (model && model.id) {
      return model.id.toString() === id;
    }
    return false;
  }
}
