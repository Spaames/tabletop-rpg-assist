# Tabletop RPG Assit App

## Description

This NextJS Application helps the GM to manage a RPG with his players.
It also helps the players to understand what is going on and help the to immerse themselves.
The big part is based on the image in the public folder, which are created as scenes in the App. A scene can have his players/entities to specify who is there. Current Health is global.
There are few functionalities : 
- Creating campaign, players, entities (I mean NPC, ennemies, everything which is not a player) and managing their attributs.
- Interactive map : you can change the background for a scene or a map, and move the players/entities. This will be save even if you change the scenes.
- Fight management : the current health will be visible on the card and you can add or remove health. If someone is dead, this will be visible. When you start a fight, the order will be based on the
initiative attribut and the players who need to play will be visible.

## Planning to do 

- Change to WebSockets
- Change the fight system : actually, it's based on the rule but I prefer to determine myself the order. There is some situation where a basic application of the rule is not coherent.
- Correct the situation where you put a looooot of entities.
- Switch to multi client ---> for distancial game
- Script somewhere to put img in correct folder


## Installation 

1. Clone the repo with 
   ```bash
   git clone <url>
2. Go the the folder with
   ```bash
   cd <folder_name>
3. Install package with
   ```bash
   npm install
4. run the app with
   ```bash
   npm run dev
