# siemema-tfm
This is an open-source online fan project of the great board game Terraforming Mars and the upcoming Terraforming Mars RPG. It is not affiliated with FryxGames, Asmodee Digital, Shadowland Games or Steam in any way.

## About
A Terraforming Mars Fan Project - a Victory Point Calculator for the board game and a prototype character sheet for the new Terraforming Mars RPG, based on the Quickstart Guide from [Backerkit](https://www.backerkit.com/c/projects/shadowlands-games/terraforming-mars-ttrpg). The terraforming Mars VP Calculator is made for calculation victory point as easy and fast as possible during an ongoing game. There are two versions available: The enriched version and the mobile / easy version.

## RPG Character Sheet
This is a very first version of a Terraforming Mars RPG character sheet. It contains all data from the quickstart guide so far. Printing to paper or PDF is the main purpose. Also, there is an import / export function to save your character sheet as a JSON file on your hard drive or load it again from your drive. I also added two custom fields of expertise ;-)

![rpg_charactersheet_1](./documentation/rpg_charactersheet_1.png)
![rpg_charactersheet_2](./documentation/rpg_charactersheet_2.png)

## VP Calculator - Enriched Version
This is the enriched version with all official boards and the correct awards and milestones for these boards. It has all the corporations available packages in the resective extension packs, which can be chosen in the game parameters section. When chosen a board, the dropdown menus for the awards and milestones will be filled accordingyly. When selected Venus Next, the awards and milestones will be added with the Venus Next awards and milestones. 

The milestones must first be chosen from the dropdown menu, then the checkbox of the resepctive player needs to be checked and 5 VP are added to this player. All other checkboxes in the same row are then disabled, so that only one player can have this milestone.

With awards it is a little bit different. There multiple players can achieve an award and there are two levels: 5 VP for first rank, 2 VP for second rank basically. The slider for the milestones takes this into account, so that the middle position is 2 VP, and the right position is 5 VP. With only two players, there is no middle position.

Depending on your chosen extensions, the dropdown menus for the corporations will be prepared. The standard corporations are always available. In case of equal victory points, those players with equal VP can enter their money at the end of the game as tie-breaker. The "Reset" button resets all VP and all chosen milestones, awards, corporations, player names and the like. The one thing it does not reset is the board and therefore the dropdowns for awards and milestones are reset to the default of the chosen board.

![enriched version](./documentation/vp_calculator_enriched.png)

![enriched version](./documentation/vp_calculator_enriched_demo.png)

## VP Calculator - Mobile / Easy Version
There is also a mobile version, which is in fact a very early version of this VP calculator. It's the version where it all started. It does calculate the points as easy as the other version, but with no data enrichment. The data enriched version is for future projects. 

![mobile version](./documentation/vp_calculator_mobile.png)

## Random Game Generator
Also in this repo there is a random game generator. Did you ever have problems deciding which game parameters to choose for your next game? Let the randomizer decide!

![mobile version](./documentation/random_game_generator.png)

## Plans for future improvement
I plan to build a backend application which receives the game results and stores them into a database for later data analysis of my games. The "Save" button is just a prototype and still in the works. It basically downloads the result into a JSON file. But as I said, it's still in the works. And of course I will stay up to date with new extensions, boards and so on.
