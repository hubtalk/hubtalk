const { createLayout } = require("./src/layout");

function main() {
  const {
    screen,
    messageForm,
    messageTextarea,
    messageSubmit,
  } = createLayout();

  screen.key(["escape", "q", "C-c"], () => process.exit(0));

  messageTextarea.key(["tab"], () => {
    messageForm.focusNext();
  });

  screen.keyPress(["tab"], () => {
    messageForm.focusNext();
    return false;
  });

  messageSubmit.on("submit", () => {
    messageTextarea.clear();
  });
}

main();
