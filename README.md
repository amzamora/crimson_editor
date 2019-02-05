# Crimson editor

Created to have completely freedom for my app [Crimson](https://github.com/amzamora/crimson).

## How to use it

You createad and HTML file with a pre element with and id. Then you pass that id when instantiating
CrimsonEditor.

Then you can use the following methods:

- `setText(text)        // Receives a string`
- `setFontSize(number)  // Receives size in pixels`
- `insertAtCursor(text) // Receives a string`

## How does it work

The CrimsonEditor class is on the file editor.js.

The constructor job is to attach events to the editor to handle
input.

The parser is used when setText method invoked. It receives somo text and
the editor element. It convert the text into writedown elements and
puts them on the editor.

The element class is the base behaviour for manipulation for most writedown elements.

## To do

### Cursor navigation
- [ ] Add clickling as a way to move the cursor
- [ ] Add up arrow and down arrow as ways to move the cursor

### Edition
- [ ] Selection
  - [ ] Deletion
  - [ ] Copy
- [ ] Image insertion

### Elements
- [ ] Unordered lists
- [ ] Ordered lists
- [ ] Inline elements
