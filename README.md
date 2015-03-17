# Fill Select v1.0.5

Fill Select is a library for dynamically adding select field options.

- Requires jQuery 1.7+

## Bower Installation

add Fill Select to your project's `bower.json` file, like:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": {
    "jquery": "1.11.0",
    "fillselect": "git@github.com:mpetty/ok-fillSelectField"
  }
}
```

## Usage

```javascript
$('select').fillSelectField({
    method : 'mymethod',                // Name of the method to fire
    callback : function() {},           // Fired after fill select is completed
    defaultText : 'Select One',         // Default text displayed at the top of the select list. Set to false to disable.
    optionString : 'option'             // Options string. can be set to a function to add default attributes. parameters are value and name.
});
```

### To add methods:

Without ajax

```javascript
$.fillSelectField.addMethod("method_name", function() {
    // value is the <option>'s value, text is the text that is displayed for the option.

    return results = {
        value : text
    };
});
```

With ajax
The 2nd parameter is the same as what you would normally use in $.ajax()

```javascript
$.fillSelectField.addMethod("method_name", {}, function() {
    // value is the <option>'s value, text is the text that is displayed for the option.

    return results = {
        value : text
    };
});
```
