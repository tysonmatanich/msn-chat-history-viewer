# msn-chat-history-viewer

View your MSN Messenger chat history XML files in browser with early 2000's style formatting.

[Try it out now](https://tysonmatanich.github.io/msn-chat-history-viewer/index.html)

## Features

- Simply open the index.html file and drag on a Messenger XML file over to view it formatted similar to how it looked back in the early 2000's
- File can run directly off the file system and doesn't require a web server
- All data stays private in browser with no uploading to a server

### Options

- Toggle on/off
  - Emoticons
  - Logon Name \<email address\>
  - Message Date
  - Message Time
- Display customized names for each party making it easier to tell who the message is from
- Render as a more modern text messaging bubble interface

## Known Issues

- Some chat history XML files are missing @LogonName which custom names relies on to determine who sent the message
- Testing for this tool was done in Chrome on Windows. Might not work correctly in other browsers. Feel free to open a pull request to help add support.

## Sources

### MSN Messenger UI

- https://codepen.io/manz/pen/XWgWyYz
- https://github.com/ManzDev/twitch-msn-messenger

### Emoticons

- http://web.archive.org/web/20140204231459/http://messenger.msn.com/Resource/Emoticons.aspx

### Toggle Switch Control

- https://codepen.io/alvarotrigo/pen/YzEdrKj
