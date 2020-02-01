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
