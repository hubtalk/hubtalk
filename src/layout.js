const { screen, box, Textarea, Form, Button, List } = require("blessed");
const { grid } = require("blessed-contrib");

const terminalGreen = "#00ff66";

const boxStyle = {
  border: {
    fg: terminalGreen,
  },
};

const createLayout = () => {
  const myScreen = screen({
    smartCSR: true,
  });

  // eslint-disable-next-line new-cap
  const myGrid = new grid({ rows: 12, cols: 12, screen: myScreen });

  const chatBox = myGrid.set(0, 0, 10, 10, box, {
    label: "Messages",
    style: boxStyle,
    mouse: true,
    tags: true,
    scrollable: true,
    alwaysScroll: true,
    keys: true,
    vi: true,
    scrollbar: {
      style: {
        bg: "yellow",
      },
    },
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
        fg: terminalGreen,
      },
      focus: {
        bg: terminalGreen,
      },
      hover: {
        bg: terminalGreen,
      },
    },
  });

  const friendsList = List({
    parent: friendsBox,
    mouse: true,
    keys: true,
    inputOnFocus: true,
    style: {
      selected: {
        bg: terminalGreen,
      },
    },
  });

  return {
    screen: myScreen,
    chatBox,
    friendsBox,
    messageForm,
    messageSubmit,
    messageTextarea,
    friendsList,
  };
};

module.exports = {
  createLayout,
  terminalGreen,
};
