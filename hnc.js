const { createLayout } = require("./src/layout");

function main() {
  const {
    screen,
    messageForm,
    messageTextarea,
    messageSubmit,
  } = createLayout();

  screen.key(["escape", "q", "C-c"], () => process.exit(0));
  screen.key(["tab"], () => {
    messageForm.focusNext();
    return false;
  });

  messageTextarea.key(["tab"], () => {
    messageForm.focusNext();
  });

  messageSubmit.on("submit", () => {
    messageTextarea.clear();
  });
}

main();
