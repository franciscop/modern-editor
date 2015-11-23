![Modern Editor](https://raw.githubusercontent.com/franciscop/modern-editor/master/screenshot.png)

> Click the image above for a larger version on mobile

- **Event-based**: most things are an event. For example, when the selection of the text of the editor changes the event `editor.on('select', function(){});` is triggered
- **Extensible**: there are several ways of doing the same thing but one is recommended for consistence. The core is an event api on top of which the editor is built.
- **Defaults**: some common actions are already set and waiting for you to activate them, such as `bold`, `italics`, `link`, etc.
- **Tiny**: 1.6kb is small enough to provide no performance penalty for loading it.


## Getting started

Download the file `editor.js` and `editor.css` and include them within your code. Then we need to initialize the instance of the editor with a selector of the element (jquery-like):

```js
var options = { menu: 'menu' };
var editor = new Editor("article", options);
```

Right now the only relevant option is `options.menu`, which contains the class name that will be assigned to the menu. This is optional in case the default `menu` conflicts with any part from your code. Remember to change the file `editor.css` accordingly with this.

The rest of the code is structured mainly in few parts, the **actions**, the **menu** and the **shortcuts**. They are explained below, along with some others.



## Actions

An action is something that can happen. It includes changing text from normal to bold, saving the current editor or any other actions that can occur to you.

### Create actions

An action is a function that receives as an argument the full editor instance. Let's see a couple of actions. For example, a simple one to make your text bold:

```js
function bold(editor){
  editor.command('bold');
}
```

> Note: `editor.command(command, text)` is an alias for `document.execCommand(command, showUi, text);`

Now a more complex one using jquery to save your changes and remove the editability of the html afterwards:

```js
function save(editor){
  var html = editor.element.innerHTML;
  $.post('/save', html, function(res){
    if (res.error) {
      alert(res.error);
    } else {
      $("article").attr('contenteditable', false);
    }
  }, 'json');
}
```

Now that we have both of the functions, we might decide in what situations we want to execute them. Let's say that we want the `bold` action to be a clickable, bold <kbd><strong>B</strong></kbd> in the menu (for the sake of it, as I love that ctrl+b). Then we add that action to the editor instance and assign the menu button:

```js
var editor = new Editor('article');

editor.add('bold', {
  menu: '<strong>B</strong>',
  action: (editor) => editor.command('bold')
  }
});
```

Make sure the first parameter is a string, since this will be used later to reference the action. This will display an element in the popup menu that contains the `<strong>B</strong>` parsed as html. See more information about how to format the `menu` below in the [Menu section](#menu).


Also let's say that the `save` action can be a shortcut and a 'save' button:

```js
var editor = new Editor('article');

function save(editor){ /* ... same as above */ }

editor.add('save', {
  shortcut: 'ctrl+s',
  action: save
  }
});
```




They are defined like this:

```js
// Set a new action
editor.action.add(name, {
  menu: {} || "" || false,          // The html or icon to show
  shortcut: {} || "" || false,      // The key for Ctrl+key or { key: "esc" }
  action: function(){} || false     // The action itself
});
```

`name`: this is the most important part. It defines the action name for using it in several parts. For example, an action that you named `save` can be triggered later on by calling `editor.trigger("action:save");`

`menu`: set this variable to add the element to the visible menu. For example, if you want a **bold** button you can set it like this: `options: { menu: "<strong>B</strong>" }`.

`shortcut`: set a shortcut that triggers the action. Example: `options: { menu: "esc" }` or `options: { menu: "ctrl+b" }`

`action`: the action that will be called when the `menu` item is clicked, when the `shortcut` is activated or when the action is triggered by other means (`editor.trigger('action:<name>')`). If it's not set, then when it's called it will do nothing




## Menu


## Shortcuts





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



