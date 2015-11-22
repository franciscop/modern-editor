# Modern Editor

Modern Editor is a text editor API. It is event-based, meaning that there are many events and actions pre-loaded and you can easily define more.


## Characteristics

- **Event-based**: most things are an event. For example, when the selection of the text of the editor changes the event `editor.on('select', function(){});` is triggered
- **Extensible**: there are several ways of doing the same thing but one is recommended for consistence. The core is an event api on top of which the editor is built.
- **Defaults**: some common actions are already set and waiting for you to activate them, such as `bold`, `italics`, `link`, etc.


## Getting started

Download the file `editor.js` and include it within your code. Then we need to initialize the instance of the editor with a selector of the element (jquery-like):

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
  action: function(){} || false     // Click or shortcut for that action
});
```

`name`: this is the most important part. It defines the action name for using it in several parts. For example, an action that you named `save` can be triggered later on by calling `editor.trigger("action:save");`

`menu`: set this variable to add the element to the visible menu. For example, if you want a **bold** button you can set it like this: `options: { menu: "<strong>B</strong>" }`.

`shortcut`: set a shortcut that triggers the action. Example: `options: { menu: "esc" }` or `options: { menu: "ctrl+b" }`

`action`: the action that will be called when the `menu` item is clicked, when the `shortcut` is activated or when the action is triggered by other means (`editor.trigger('action:<name>')`). If it's not set, then when it's called it will do nothing


### Default actions

These actions are added by default but not activated until you set them up. Setting them up is really easy:

```js
// Add a button to the popup menu
editor.add('default:italics', { menu: '<em>i</em>' });

// Add a shortcut to the editor
editor.add('default:bold', { shortcut: 'ctrl+b' });
```



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



