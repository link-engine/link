# SGI 2023/2024 - TP3

## Group T05G09
| Name           | Number    | E-Mail                   |
| -------------- | --------- | ------------------------ |
| Martim Videira | 202006289 | up202006289@edu.fe.up.pt |
| Miguel Silva   | 202007972 | up202007972@edu.fe.up.pt |

----


# TP3 - Cars Race

## Main Point

The main objective of this practical assignment was to build a cars' racing game where a player must compete against the computer in a similar way to old arcade games. We've implemented all features requested in the assignment's description, and went on to solidify our knowledge in Graphical Systems in a way none of us could have ever predicted at the beginning of this course. To understand more about the work we've implemented during this semester and to discover the strong points of this TP3 please click on this [link](ENGINE.md).

## Strong Point of the Scene
When it comes to the scene we've developed:

  - **Highest Possible Level Of Interactivity**: the user can traverse each node to select it or its children, and change with position and properties as he wishes. He can decide which camera to use to enjoy the scene. He can toggle and alter any light source's shadow casting, shadow bias and size of its shadow map. Similarly to TP2, this is something that we chose to keep for this project.
  - **Minimap**: a dynamic minimap that follows the player andd displays their position on the screen
  - **Render-to-Texture Collision Detection**: We're using Render-to-texture technique to see if the car is off the track, which is extremely efficient.


# How to Use

Use WASD to drive the car, inside TP3 folder run `python simple_server.py` and go to PORT `8000`.