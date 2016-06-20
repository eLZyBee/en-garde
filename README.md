# En Garde

## Blind fumbling fencing MVP

En Garde is a simple sword-fighting game for two players. The game is paused while both players make their moves and then they play out simultaneously.

- [x] The game has a modal dictating the rules and controls.
- [x] The game takes place on a 7 by 7 grid.
- [x] Two players start at opposite ends in the central row.
- [x] Players have four actions, either moving, jabbing or slashing.
- [x] Slashing attacks cover the square in front of the player and either side of it.
- [x] Jabbing attacks cover two squares in front of the player.
- [x] A banner to each side of the board dictates the state of play.
- [x] Landing an attack finishes the round and the losing player takes a slash to their banner.
- [x] A player loses when they reach three slashes on their banner and the other player wins.


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
- [x] Create Player object with movement and attack rules.
- [x] Write key mappings and rules for parsing turns.

### Phase 2
- [x] Write game loop allowing:
  - [x] Three rounds of play.
  - [x] Position reset on hit.
  - [x] Banner slashes accrue on hit.
- [x] Render players and sword strikes on board.
- [x] Render Slashes on Banner.

### Phase 3
- [x] Add AI player so game can be played solo.
- [ ] Add sound effects to gameplay.
- [x] Add time delays on game start and hit.
- [ ] Make graphical adjustments to polish display.

[modal]: ./docs/wireframes/en-garde-modal.png
[board]: ./docs/wireframes/en-garde-elements.png
