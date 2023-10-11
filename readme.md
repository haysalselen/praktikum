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

In the context of this project, our primary goal is to introduce an interactive and fun way to order cocktails using QR codes. To achieve this, we've designed elegantly crafted QR codes, each tailored to a specific cocktail. These [QR codes](#qr-codes), when scanned, seamlessly guide users to a dedicated [web component](#frontend) containing comprehensive details about the cocktail. From this interface, placing an order is effortless and user-friendly.

To ensure the smooth and effective management of these orders, we've developed a resilient [backend system](#backend). This backend system exposes a series of endpoints that facilitate interaction with our [Cloud Process Execution Engine (CPEE)](#cpee). Following this documentation, you can find detailed information on the specifics of our system's implementation.

## How to run

1. Deploy the `descriptions`, `images` and `src` folder on your server e.g. [lehre.bpm.in.tum.de](https://lehre.bpm.in.tum.de/)
2. Move to ./src/server
3. Run `npm i`
4. Run `node server.js` to start the server
5. Scan the QR-Code of your preferred cocktail
6. Click "Order now" to order your cocktail

## Folders and files

### descriptions

This folder contains the descriptions of the cocktails in markdown files.
The currently existing descriptions have the following pattern:

1. Ingredients: The list of ingredients of the cocktail.
2. Description: An extensive description of the cocktail which was generated using the ChatGPT prompt: `Give me a description of the cocktail "Zombie" as it would be displayed in a fancy restaurant`, followed by `Do the same for the cocktail "Caipirinha"` where the name of the cocktail was changed for each cocktail.

While the information on the webpage is usually static, this approach enables for easy fixes or changes even for non-programmers as they only have to change text in a mostly familiar fashion. Moreover, markdown enables the user to highlight certain parts without the need to learn any HTML, CSS or JavaScript.

### images

This folder contains the images of the cocktails. The common image types `webp, jpg, jpeg, png, gif, svg` are currently supported.

### QR-Codes

This folder contains the QR-Codes that lead to the respective ordering pages. The QR-Codes have been created using [QRCode-Monkey](https://www.qrcode-monkey.com/de/).

### src

This folder contains the [frontend](#frontend) and [backend](#backend) code.

### cpee-graph.xml

This file contains the [CPEE](https://cpee.org/flow/) testset that can be loaded and run.

## Naming Scheme

When adding cocktails to the menu it is important to follow an naming scheme.
All [descriptions](#descriptions) have the following naming scheme:

```
${urlSearchParameter}Description.md
```

All [images](#images) have the following naming scheme:

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

The frontend, while minimalistic, consists of all the necessary information and can be separated into the following 4 components:

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

After clicking the "Order Now" button the user is prompted with an alert showcasing that either they successfully ordered the cocktail and assigns them an ID. After a successful order the "Order Now" button will no longer be available. If the order was not successful the user will get an Error alert, telling them that an error occurred and to please try again in a few minutes.

_The following screenshots illustrate the user workflow in the frontend application. This flow begins with scanning a QR code to order a zombie cocktail and progresses to the cocktail description page._

<img src="https://github.com/haysalselen/praktikum/assets/117772399/409b8181-2797-4125-8746-f09f294b33fb" alt="screenshot0" width="280.416666667" height="576.666666667"/>
<img src="https://github.com/haysalselen/praktikum/assets/117772399/6631218f-a4c8-4c1f-990c-cdd694d47fa0" alt="screenshot1" width="280.416666667" height="576.666666667"/>
<img src="https://github.com/haysalselen/praktikum/assets/117772399/114d8d7f-e62e-4d4f-9d90-a1e7749ee901" alt="screenshot2" width="280.416666667" height="576.666666667"/>

_When the order is successful, the user will promptly receive their unique order ID, while in the event of any issues, an error message will be displayed._

<img src="https://github.com/haysalselen/praktikum/assets/117772399/488128f1-1321-4902-9f47-6e3a1de4ca20" alt="screenshot3" width="280.416666667" height="576.666666667"/>
<img src="https://github.com/haysalselen/praktikum/assets/117772399/634ef3de-a007-405b-9f6b-b246ff3690e6" alt="screenshot4" width="280.416666667" height="576.666666667"/>

## Backend

The backend code provides the essential functionality for receiving, processing, and managing cocktail orders.

1. Dependencies: Express is used to create a server, while sqlite3 manages the SQLite database. Cors ensures secure communication between the server and the frontend, allowing requests only from a specific origin (https://lehre.bpm.in.tum.de). Axios is employed for making HTTP requests, and EventEmitter facilitates event-driven programming that is necessary for triggering specific actions in response to arrival of new orders and callback requests from CPEE.

2. Database Initialization/Management: The code includes a database file "database.db" where it is connected to store and manage orders and callback addresses using SQLite. It establishes two tables:

- orders:

| Field Name | Data Type | Description                                                    |
| ---------- | --------- | -------------------------------------------------------------- |
| id         | INTEGER   | Unique auto-incrementing order ID                              |
| details    | TEXT      | Description/details of the cocktail                            |
| status     | TEXT      | Order status (defaulted to 'queued', 'processing', 'finished') |
| timestamp  | DATETIME  | Timestamp of when the order was created                        |

- callbacks:

| Field Name | Data Type | Description                           |
| ---------- | --------- | ------------------------------------- |
| id         | INTEGER   | Unique auto-incrementing callback ID  |
| address    | TEXT      | Callback address for future reference |

3. API Routes: The backend exposes several API routes to facilitate various aspects of the cocktail ordering process:

- #### `/order`

  This endpoint handles the creation of new cocktail orders. It validates the request checking that the cocktail field is provided. Then, it inserts the order into the database, and triggers the "orderAvailable" event.

- #### `/work-order`

  This endpoint is responsible for checking and processing work orders. It checks for open orders in the "orders" table, prioritizing the oldest order based on its timestamp. In the absence of open orders, the route stores the provided callback address in the "callbacks" table for future reference. When an open order is detected, the route updates the order's status to 'processing' and sends the order details as a JSON response.

- #### `/finished/:id`:
  This route allows the marking of an order as 'finished' by specifying its unique ID as a URL parameter.

4. Code Flow and Event Handling: The backend employs an event-driven architecture using EventEmitter to manage the "orderAvailable" event. This event serves as a crucial mechanism for signaling the arrival of a new order. The associated event listener checks for pending callback addresses in the "callbacks" table. When a callback address is found, the listener retrieves the oldest open order, updates its status to 'processing,' and transmits the order details to the callback address through an HTTP PUT request. Subsequently, the served callback address is deleted from the "callbacks" table, ensuring that each callback is processed only once.

## CPEE

<img width="226" alt="cpee-final" src="https://github.com/haysalselen/praktikum/assets/117772399/0e050c57-4893-4bc8-aabb-a564576e0cc3">

The CPEE graph operates via a sequence of two primary service calls with scripts, executed within a loop.

- The first service call involves fetching an order using the [GET endpoint](#work-order) provided by the backend system. When this endpoint is activated, it attempts to dispatch a drink order to the CPEE if an order is available. In cases where no order is currently available, the callback address from the corresponding CPEE call is stored for potential use in future orders.

- Ideally, there should be an additional step after retrieving the order, where the cocktail is prepared and served. However, it's important to note that this particular aspect falls outside the scope of our project.

- Following these steps, a [second service call](#finishedid) finalizes the processing of the order and marks it as finished. 

<img width="508" alt="cpee-final2" src="https://github.com/haysalselen/praktikum/assets/117772399/30a282cf-4fe4-401e-a958-dfdeecfba356">

_In this service call, a prepare statement is employed as shown above to fetch the ID of the order currently in progress and then integrate it into the respective service call._

<img width="576" alt="cpee-final1" src="https://github.com/haysalselen/praktikum/assets/117772399/106db6c9-d081-4448-8ecc-ce4db1cc08d9">

_The following data elements are retrieved after a successful ordering of a zombie cocktail._
