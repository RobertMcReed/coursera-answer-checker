# Coursera Answer Checker Chrome Extension

A Chrome extension used to check _expected_ answers in a Coursera Jupyter notebook.

Highlight your answer and then separately highlight the expected answer. Each will be stripped of "extraneous" characters as determined by a regular expression and what remains will be compared. If they are the same, a green indicator is shown, otherwise a red indicator is shown.

You can open the developer console to see more detailed information. If the answers do not match, the console will show at what point the two values stopped matching.

You can change the regular expression used for stripping by clicking on the extension's icon.

The extension will only run on pages that match `https://hub.coursera-notebooks.org/*`.


## Demo

<img src="images/demo.gif">


## How to Use

Install from the Chrome extension store, or add the unpacked module manually.

## Support

Email <a href="mailto:robert.mc.reed@gmail.com">robert.mc.reed@gmail.com</a>.


## TODO

- remove submit button, update on popup close (or onchange)
- add options in popup for show/hide notifications
- option for detailed notifications or basic
