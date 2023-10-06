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

### images

This folder contains the images of the cocktails. The common image types `webp, jpg, jpeg, png, gif` are currently supported.

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

## Backend

## CPEE
