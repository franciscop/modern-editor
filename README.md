
> **DISCONTINUED** this project has become a much harder thing that I thought initially. The main problem is Contenteditable, which works great for basic things such as bold but is a horrible tool to build upon. I am using [CKEditor](https://ckeditor.com/) now and totally looking forward [CKEditor 5](http://ckeditor.com/blog-list).

<a href="http://www.francisco.io/editor/" target="\_blank">
  <img src="https://raw.githubusercontent.com/franciscop/modern-editor/master/screenshot.png" alt="Modern Editor" />
</a>

> Click the image above for [an interactive demo](http://www.francisco.io/editor/)

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


### Options

These are the available options with their defaults:

```js
var options = {

  // The class that will be assigned to the menu (in case there's a conflict).
  // If you modify it, remember to modify also the editor.css
  menu: 'menu',

  // Show or not the menu when the action menu:show is triggered
  active: true,
};
```

The rest of the code is structured mainly in few parts, the [**actions**](#actions), the [**menu**](#menu), the [**shortcuts**](#shortcuts), the [**events**](#events) and few others.


### Reference

```js
// Set a new action
editor.add(name, {
  menu: "" || false,          // The html or icon to show
  shortcut: "" || false,      // The key for Ctrl+key or { key: "esc" }
  action: function(){} || false     // The action itself
});
```

`name`: unique name for referencing the current action. For example, an action that you named `save` can be triggered later on by calling `editor.trigger("action:save");`

`menu`: the item html in the visible menu. For example, if you want a **bold** button you can set it like this: `menu: "<strong>B</strong>"`. [Read more about the menu](#menu)

`shortcut`: a keyboard set a shortcut that triggers the action. For example: `shortcut: "ctrl+b"`. [Read more about shortcuts](#shortcuts)

`action`: the action that will be called when the `menu` item is clicked, when the `shortcut` is activated or when the action is triggered by other means (`editor.trigger('action:<name>')`). [Read more about the actions](#actions)




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


A more complex one using jquery to save your changes and remove the editability of the html afterwards:

```js
function save(editor){
  var html = editor.element.innerHTML;
  $.post('/save', html, function(res){
    if (res.error) {
      alert(res.error);
    } else {
      $("article").attr('contenteditable', false);
      editor.options.active = false;
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


### Trigger actions

Sometimes you might want to trigger an action manually. For instance, you might want to save the document automatically every minute. For doing this you can trigger the action manually from the code:

```js
var editor = new Editor("article");

// Save the action 'save'
editor.add("save", {
  action: (editor) => $.post('/save', editor.element.innerHTML);
});

setInterval(() => editor.trigger('action:save'), 1000 * 60);
```

> you can even add the action manually, but it's not recommended so you'll need to dig in the code to see how it's possible (;




### Default actions

There ~~are~~ *will be* some common actions defined by default. They aren't active until you set them up, which is easy:

```js
// Add a button to the popup menu for formatting as italics
editor.add('default:italics', { menu: '<em>i</em>' });

// Add a shortcut to the editor for formatting as bold
editor.add('default:bold', { shortcut: 'ctrl+b' });

// ...
```

You can trigger them as usual, `action:` prefix for the action name:

```js
editor.trigger('action:default:bold');
```





## Menu

WIP


## Shortcuts

WIP




## Events

These are the events that the API defines. You can easily create more with `editor.on("", function(){})` as we can see at the end. All of them can be set to listen with `on()` or can be called with `trigger()`, however it doesn't make sense to call some or to listen to some. So only the recommended ones are set:



### init

```js
editor.on('init', function(){});
```

Triggered when the editor is initialized and all of the default actions are added. It initializes the menu within the `<body>`. It is highly discouraged to trigger it manually since some undesired actions might be called.


### action

```js
editor.on('action', function(){});
```

When any action is triggered. This can be really useful for tracking which actions are most used and which ones are not used at all for future changes  .


### action:<name>

```js
editor.on('action:<name>', function(){});
editor.trigger('action:<name>');
```

A specific action by its name. These are added automagically when the `editor.add()` function is called as we can see in [the actions section](#actions). Adding a listener or triggering an action is easy.

```js
var editor = new Editor('article');
editor.add('save', { action: function(){ alert("Saving..."); }});

// Adding another listener
editor.on('action:save', function(){
  console.log('Saving...');
});

// Adding a manual trigger
$(".save").click(function(){
  editor.trigger('action:save');
});
```

### click

A click or touch is performed somewhere

```js
editor.on('click', function(){});
```


### refresh

The content of the editor is re-read and parsed. This is continuously being triggered both with an interval and when several events happen. You might want to trigger with new events

```js
editor.on('refresh', function(){});
editor.trigger('refresh');
```


### select

Triggers when the selection of text is changed

```js
editor.on('select', function(){});
```



### key

When a key from the keyboard is pressed

```js
editor.on('key', function(){});
```


### shortcut

When a registered shortcut is triggered

```js
editor.on('shortcut', function(){});
```


### Others

There are some other events that are not so relevant for people developing *with* the Modern Editor, but they are relevant for people delving deep into the code of it. These are **NOT** guaranteed to stay the same within a major number of semver:

- `menu:add`: when an item is added to the menu
- `menu:separator`: adds a separator for the menu
- `menu:show`: display the menu
- `menu:hide`: hide the menu
- `menu:move`: reposition the menu to the current selection

- `select:check`: checks whether the current selection has changed

- `shortcut:add`: adds a new shortcut manually



## Author, credits & License

Created by Francisco Presencia. It started from [my old but popular answer on StackOverflow](http://stackoverflow.com/a/20471268/938236) and evolved into something that is loosely based on Medium's and CKEditor editors with extensibility and simplicity in mind.

It is licensed under the MIT License as can be seen in the file `LICENSE` for everyone to use it.
