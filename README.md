# Hubtalk

Command line chat script.

## Install

1. Fork this repository with your github user.
2. Clone the forked repository.
3. Generate RSA Private Key in PEM format:
    
    ssh-keygen -t rsa -b 4096 -P "" -m pem -f secret/hubtalk_rsa

4. Generate RSA Public Key in PEM format:
    
    ssh-keygen -f secret/hubtalk_rsa -e -m pem > hubtalk_rsa.pub

5. Commit your Public Key and push back to your repository.

## Usage

 - hubtalk-cli.js af <name>             Add a friend. (Github username)
 - hubtalk-cli.js lf                    List friends.
 - hubtalk-cli.js msg <name> <message>  Write message to a friend. (Will not send it!)
 - hubtalk-cli.js show <name>           Show conversation with a friend.
 - hubtalk-cli.js receive               Fetch all messages from friends.
 - hubtalk-cli.js send                  Send all messages.
