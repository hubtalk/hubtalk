# Hubtalk

A prototype chat client for our surveillance future. All conversation is visible to everybody, but only a few can decrypt.

## Install

Fork https://github.com/hubtalk/hubtalk-box

Clone this repository

    git clone git@github.com:hubtalk/hubtalk.git

Run `npm i -g`

Run `hubtalk setup <github-username>`

## Usage

    hubtalk af <name>             Add a friend. (Github username)
    hubtalk lf                    List friends.
    hubtalk msg <name> <message>  Write message to a friend. (Will not send it!)
    hubtalk show <name>           Show conversation with a friend.
    hubtalk receive               Fetch all messages from friends.
    hubtalk send                  Send all messages.
