# En Garde

## Blind fumbling fencing MVP

En Garde is a simple sword-fighting game for two players. The game is paused while both players make their moves and then they play out simultaneously.

- [ ] The game has a modal dictating the rules and controls.
- [ ] The game takes place on a 7 by 7 grid.
- [ ] Two players start at opposite ends in the central row.
- [ ] Players can move three spaces and choose a slashing or jabbing attack.
- [ ] Slashing attacks cover the square in front of the player and either side of it.
- [ ] Jabbing attacks cover two squares in front of the player.
- [ ] A banner to each side of the board dictates the state of play.
- [ ] A jab meeting a jab or slash meeting a slash will cause a parry (both players will recoil one space).
- [ ] Landing an attack finishes the round and the losing player takes a slash to their banner.
- [ ] A player loses when they reach three slashes on their banner and the other player wins.


## Wireframes

### Rules Modal
![modal]
### Game Start
![board]


## Implementation Timeline

### Phase 1
- [x] Set up canvas to render the game window.
- [x] Set up modal placeholder for rules.
- [x] Create Board object with perimeter rules.
- [ ] Create Player object with movement and attack rules.
- [ ] Write key mappings and rules for parsing turns.

### Phase 2
- [ ] Write game loop allowing:
  - [ ] Three rounds of play.
  - [ ] Position reset on hit.
  - [ ] Slashes accrue on hit.
- [ ] Render players and sword strikes on board.
- [ ] Render Slashes on Banner.

### Phase 3
- [ ] Add AI player so game can be played solo.
- [ ] Add sound effects to gameplay.
- [ ] Add time delays on game start and hit.
- [ ] Make graphical adjustments to polish display.

[modal]: ./docs/wireframes/en-garde-modal.png
[board]: ./docs/wireframes/en-garde-elements.png
