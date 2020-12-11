const { screen, box, Textarea, Form, Button } = require("blessed");
const { grid } = require("blessed-contrib");

const boxStyle = {
  border: {
    fg: "green",
  },
};

const createLayout = () => {
  const myScreen = screen();

  // eslint-disable-next-line new-cap
  const myGrid = new grid({ rows: 12, cols: 12, screen: myScreen });

  const chatBox = myGrid.set(0, 0, 10, 10, box, {
    label: "Messages",
    style: boxStyle,
  });
  const friendsBox = myGrid.set(0, 10, 10, 2, box, {
    label: "Contacts",
    style: boxStyle,
  });
  const messageForm = myGrid.set(10, 0, 2, 12, Form, {
    label: "Compose",
    style: boxStyle,
  });

  const messageTextarea = Textarea({
    keys: true,
    parent: messageForm,
    mouse: true,
    inputOnFocus: true,
  });

  const messageSubmit = Button({
    parent: messageForm,
    mouse: true,
    keys: true,
    shrink: true,
    padding: {
      left: 1,
      right: 1,
    },
    right: 1,
    bottom: 0,
    content: "Submit",
    border: {
      type: "line",
    },
    style: {
      border: {
        fg: "green",
      },
      focus: {
        bg: "green",
      },
      hover: {
        bg: "green",
      },
    },
  });

  myScreen.render();

  return {
    screen: myScreen,
    chatBox,
    friendsBox,
    messageForm,
    messageSubmit,
    messageTextarea,
  };
};

module.exports = {
  createLayout,
};
