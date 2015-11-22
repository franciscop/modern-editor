# Modern Editor

Modern Editor is a text editor API. It is event-based, meaning that there are many events pre-loaded and you can easily define more. There are no default actions, but in the examples below you can see how easy it is to add new examples. If you want some pre-made ones, you can check the folder `/actions` to see some examples.





## Getting started

First we need to initialize the instance of the editor with a selector of the element (jquery-like):

```js
var options = {};
var editor = new Editor("article", options);
```



## Create actions

An action is something that can happen by several means. They are defined like this:

```js
// Set a new action
editor.action.add(name, {
  menu: {} || "" || false,          // The html or icon to show
  shortcut: {} || "" || false,      // The key for Ctrl+key or { key: "esc" }
  init: function(){} || false,      // Called when activating an editor
  action: function(){} || false,    // Click or shortcut for that action
  destroy: function(){} || false    // Deactivating an editor
});
```

`name`: this is the most important part. It defines the action name for using it in several parts. For example, an action that you named `save` can be triggered later on by calling `editor.trigger("action:save");`

`menu`: set this variable to add the element to the visible menu. For example, if you want a **bold** button you can set it like this: `options: { menu: "<strong>B</strong>" }`.




## API (events)

These are the events that the API defines. You can easily create more with `editor.on("", function(){})` as we can see at the end.



### init

Triggered when the editor is initialized and all of the default actions are added. It initializes the menu within the <body>


### action:<name>

A specific action by its name. These are added automagically when the `editor.add()` function is called. For example, if we want to save we can do it like this:

```js
var editor = new Editor('article');
editor.add('save', { action: function(){ alert("Saving..."); }});

$(".save").click(function(){
  editor.trigger('action:save');
});
```



