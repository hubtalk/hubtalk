# Hubtalk

A prototype chat client for our surveillance future. All conversation is visible to everybody, but only a few can decrypt.

## Install

1. Fork this repository with your github user.
2. Clone the forked repository.
3. Run `npm i`
4. Run `npm run setup`

## Usage

    hubtalk-cli.js af <name>             Add a friend. (Github username)
    hubtalk-cli.js lf                    List friends.
    hubtalk-cli.js msg <name> <message>  Write message to a friend. (Will not send it!)
    hubtalk-cli.js show <name>           Show conversation with a friend.
    hubtalk-cli.js receive               Fetch all messages from friends.
    hubtalk-cli.js send                  Send all messages.
