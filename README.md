# Wheel of Fortune
Did you ever wanted to elect a winner through a raffle and needed a quick an simple app for that? This is one of them. A simple and lightweight angular app doing this very single thing.

## How does it work?
In a simple CRUD list you manage the participants for the raffle. Each participant has an amount of spokes in the wheel, which can be seen as a winning chance. Then you turn the wheel and elect a winner, the winners are stored on the winner page. Both the winners and participants are stored in localstorage at the moment.

For screenshots see [Screenshots](#screenshots).

The size of a single participant's slice is calculated as `(360 / (total number of spokes)) * number of spokes`.

To start the election, slide the wheel or press the Go button. [Hammer.JS](http://hammerjs.github.io/) is used to handle the pan event and by is mobile friendly by  that. If using slide, the rotation is based on the distance on the X Axis, if pressing the Go button, a random integer between 0 and 360 is used to base the distance calculation on. For random integers, [chance.js](http://chancejs.com/) is used.

## Setup & Run
Use `git clone`, `npm install` or download the tarball from github to install it. Here, git clone will be used.

```bash
git clone https://github.com/finanzcheck/wheel-of-fortune.git
npm install
npm start
```

Then open your browser and go to `http://localhost:3000`.

## Screenshots
### Wheel
![Wheel](/docs/screenshots/wheel.png?raw=true "Wheel")

### Wheel Hover
![Wheel Hover](/docs/screenshots/wheel_hover.png?raw=true "Wheel")

### Participants list
![Participants](/docs/screenshots/participants.png?raw=true "Wheel")

### Winners list
![Winners](/docs/screenshots/winners.png?raw=true "Wheel")
