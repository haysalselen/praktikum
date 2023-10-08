# Fuzzy Drinks

- [Fuzzy Drinks](#fuzzy-drinks)
  - [Motivation](#motivation)
  - [How to run](#how-to-run)
  - [Folders and files](#folders-and-files)
    - [descriptions](#descriptions)
    - [images](#images)
    - [QR-Codes](#qr-codes)
    - [src](#src)
    - [cpee-graph.xml](#cpee-graphxml)
  - [Naming Scheme](#naming-scheme)
  - [Adding a Cocktail](#adding-a-cocktail)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [CPEE](#cpee)

## Motivation

## How to run

1. Deploy the `descriptions`, `images` and `src` folder on your server e.g. [lehre.bpm.in.tum.de](https://lehre.bpm.in.tum.de/)
2. Move to ./src/server
3. Run `npm i`
4. Run `node server.js` to start the server
5. Scan the QR-Code of your preferred cocktail
6. Click "Oder now" to order your cocktail

## Folders and files

### descriptions

This folder contains the descriptions of the cocktails in markdown files.
The currently existsing descriptions have the following pattern:

1. Ingredients: The list of ingredintes of the cocktail.
2. Description: An extensive description of the cocktail which was generated using the ChatGPT prompt: `Give me a description of the cocktail "Zombie" as it would be displayed in a fancy restaurant`, followed by `Do the same for the cocktail "Caipirinha"` where the name of the cocktail was changed for each cocktail.

While the information on the webpage is usually static, this approach enables for easy fixes or changes even for non-programmers as they only have to change text in a mostly familiar fashon. Moreover, markdown enables the user to highlight certain parts without the need to learn any HTML, CSS or JavaScript.

### images

This folder contains the images of the cocktails. The common image types `webp, jpg, jpeg, png, gif, svg` are currently supported.

### QR-Codes

This folder contains the QR-Codes that lead to the respective ordering pages. The QR-Codes have been created using [QRCode-Monkey](https://www.qrcode-monkey.com/de/).

### src

This folder contains the [frontend](#frontend) and [backend](#backend) code.

### cpee-graph.xml

This file contains the [CPEE](https://cpee.org/flow/) testset that can be loaded and run.

## Naming Scheme

When adding cocktails to the menu it is important to follow an nameing scheme.
All [descriptions](#descriptions) have the following naming scheme:

```
${urlSearchParameter}Description.md
```

All [images](#images) have the following nameing scheme:

```
${urlSearchParameter}Description.${format}
```

The `urlSearchParameter` must be the same as defined in the variable `cocktails` in the file `./src/script.js`. This variable stores a map of `urlSearchParameters` and their string representation.
The `format` must be one of the [supported formats](#images).

## Adding a Cocktail

To add a cocktail one has to follow these steps:

1. Add the new cocktail to the `cocktail` variable in `./src/script.js`
2. Add a description following the [naming scheme](#naming-scheme)
3. Add an image following the [naming scheme](#naming-scheme)
4. Create a new [QR-Code](#qr-codes)

## Frontend

The frontend, while minimalistic, consists of all the necessary information and can be seperated into the following 4 components:

1. Image of the Cocktail:

- Visual Appeal: An image of the cocktail provides users with a visual representation of what they are ordering. This can be enticing and visually appealing, potentially increasing the chances of users exploring the cocktail further.
- Quick Identification: A picture can help users quickly identify the cocktail they are interested in, especially if they are familiar with the appearance of the cocktail.

2. Name of the Cocktail:

- Clarity: The name of the cocktail serves as a clear identifier for the drink. It ensures users that the QR-Code worked thus avoiding potential confusion.
- Branding: It's an opportunity to showcase your brand and the unique names you may have for your cocktails, which can make your offerings memorable to users.

3. Description of the Cocktail (Ingredients and Description):

- Information: Users need to know what ingredients are in the cocktail. This information is crucial for people who have allergies or dietary restrictions. It also helps users understand the flavor profile of the cocktail.
- Flavor Profile: The description can give users an idea of the taste and characteristics of the cocktail. This is especially important if your menu includes cocktails with unique or complex flavor profiles.
- Storytelling: A well-crafted description can tell the story behind the cocktail, its history, or the inspiration behind it, creating a more engaging and immersive experience for the users.

4. Order Now Button:

- Call to Action: The "Order Now" button is the key element that prompts users to take action. It is a clear and direct call to action that encourages users to proceed with their order.
- Convenience: It streamlines the user experience by offering a direct path to order the cocktail without having to search for how to do so.

After clicking the "Order Now" button the user is propted with an alert showcasing that either they sucessufly ordered the cocktail and assignes them an ID. After a sucessful order the "Order Now" button will no longer be available. If the order was not sucessful the user will get an Error alert, telling them that an error occured and to please try again in a few minutes.

## Backend

## CPEE
