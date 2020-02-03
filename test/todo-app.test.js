const test = require ('tape'); //https://github.com/dwyl/learn-tape
const fs = require ('fs');  //to read html files (see below)
const path = require ('path');  // so we can open files cross-platform
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'));
require('jsdom-global')(html);  // https://github.com/rstacruz/jsdom-global
const app = require('../lib/todo-app.js'); // functions to test
const id = 'test-app';      // all tests use 'test-app' as root element 

test('todo `model` (Object) has desired keys', function (t) {
  const keys = Object.keys(app.model);
  t.deepEqual(keys, ['todos', 'hash'], "`todos` and `hash` keys are present.");
  t.true(Array.isArray(app.model.todos), "model.todos is an Array")
  t.end();
});

test('todo `update` default case should return model unmodified', function (t) {
  const model = JSON.parse(JSON.stringify(app.model));
  const unmodified_model = app.update('UNKNOWN_ACTION', model);
  t.deepEqual(model, unmodified_model, "model returned unmodified");
  t.end();
});

test('`ADD` a new todo item to model.todos Array via `update`', function (t) {
  const model = JSON.parse(JSON.stringify(app.model)); // initial state
  t.equal(model.todos.length, 0, "initial model.todos.length is 0");
  const updated_model = app.update('ADD', model, "Add Todo List Item");
  const expected = { id: 1, title: "Add Todo List Item", done: false };
  t.equal(updated_model.todos.length, 1, "updated_model.todos.length is 1");
  t.deepEqual(updated_model.todos[0], expected, "Todo list item added.");
  t.end();
});
test('`TOGGLE` a todo item from done=false to done=true', function (t) {
  const model = JSON.parse(JSON.stringify(app.model)); // initial state
  const model_with_todo = app.update('ADD', model, "Toggle a todo list item");
  const item = model_with_todo.todos[0];
  const model_todo_done = app.update('TOGGLE', model_with_todo, item.id);
  const expected = { id: 1, title: "Toggle a todo list item", done: true };
  t.deepEqual(model_todo_done.todos[0], expected, "Todo list item Toggled.");
  t.end();
});
test.only('render_item HTML for a single Todo Item', function (t) {
  const model = {
    todos: [
      { id: 1, title: "Learn Elm Architecture", done: true },
    ],
    hash: '#/' // the "route" to display
  };
  // render the ONE todo list item:
  document.getElementById(id).appendChild(app.render_item(model.todos[0]))

  const done = document.querySelectorAll('.completed')[0].textContent;
  t.equal(done, 'Learn Elm Architecture', 'Done: Learn "TEA"');

  const checked = document.querySelectorAll('input')[0].checked;
  t.equal(checked, true, 'Done: ' + model.todos[0].title + " is done=true");

  elmish.empty(document.getElementById(id)); // clear DOM ready for next test
  t.end();
});
test('render "main" view using (elmish) HTML DOM functions', function (t) {
  const model = {
    todos: [
      { id: 1, title: "Learn Elm Architecture", done: true },
      { id: 2, title: "Build Todo List App",    done: false },
      { id: 3, title: "Win the Internet!",      done: false }
    ],
    hash: '#/' // the "route" to display
  };
  // render the "main" view and append it to the DOM inside the `test-app` node:
  document.getElementById(id).appendChild(app.render_main(model));
  // test that the title text in the model.todos was rendered to <label> nodes:
  document.querySelectorAll('.view').forEach(function (item, index) {
    t.equal(item.textContent, model.todos[index].title,
      "index #" + index + " <label> text: " + item.textContent)
  })

  const inputs = document.querySelectorAll('input'); // todo items are 1,2,3
  [true, false, false].forEach(function(state, index){
    t.equal(inputs[index + 1].checked, state,
      "Todo #" + index + " is done=" + state)
  })
  elmish.empty(document.getElementById(id)); // clear DOM ready for next test
  t.end();
});
test.only('view renders the whole todo app using "partials"', function (t) {
  // render the view and append it to the DOM inside the `test-app` node:
  document.getElementById(id).appendChild(app.view(app.model)); // initial_model

  t.equal(document.querySelectorAll('h1')[0].textContent, "todos", "<h1>todos");
  // placeholder:
  const placeholder = document.getElementById('new-todo')
    .getAttribute("placeholder");
  t.equal(placeholder, "What needs to be done?", "paceholder set on <input>");

  // todo-count should display "0 items left" (based on initial_model):
  const left = document.getElementById('count').innerHTML;
  t.equal(left, "<strong>0</strong> items left", "Todos remaining: " + left);

  elmish.empty(document.getElementById(id)); // clear DOM ready for next test
  t.end();
});
test.only('1. No Todos, should hide #footer and #main', function (t) {
  // render the view and append it to the DOM inside the `test-app` node:
  document.getElementById(id).appendChild(app.view({todos: []})); // No Todos

  const main_display = window.getComputedStyle(document.getElementById('main'));
  t.equal('none', main_display._values.display, "No Todos, hide #main");

  const main_footer= window.getComputedStyle(document.getElementById('footer'));
  t.equal('none', main_footer._values.display, "No Todos, hide #footer");

  elmish.empty(document.getElementById(id)); // clear DOM ready for next test
  t.end();
});
