var initial_model = {
  todos: [], // empty array which we will fill shortly
  hash: "#/" // the hash in the url (for routing)
}


/* module.exports is needed to run the functions using Node.js for testing! */
/* istanbul ignore next */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    model: initial_model
  }
}
/*
 * `update` transforms the `model` based on the `action`.
 * @param {String} action - the desired action to perform on the model.
 * @param {Object} model - the App's data ("state").
 * @return {Object} new_model - the transformed model.
 */
