const {createLayout} = require("./src/layout");

function main() {
  const {screen, messageForm, messageTextarea, messageSubmit} = createLayout();

  screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0));

  messageTextarea.key(['tab'], (ch, key) => {
    messageForm.focusNext();
  });

  screen.key(['tab'], (ch, key) => {
    messageForm.focusNext();
    return false;
  });

  messageSubmit.on('submit', () => {
    messageTextarea.clear();
  })
}

main();
