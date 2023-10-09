const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const axios = require("axios");
const EventEmitter = require("events");

const app = express();
const port = 13741;
const eventEmitter = new EventEmitter();

// Create or connect to the SQLite orders database
const db = new sqlite3.Database("database.db");

// Create a database to store orders if it doesn't exist and callback addresses
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, details TEXT NOT NULL, status TEXT DEFAULT 'queued', timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);"
  ).run(
    "CREATE TABLE IF NOT EXISTS callbacks (id INTEGER PRIMARY KEY AUTOINCREMENT, address TEXT NOT NULL);"
  );
});

app.use(express.json());
app.use(
  cors({
    origin: "https://lehre.bpm.in.tum.de", //only allow requests from lehre server
  })
);

// Endpoint for creating a new order
app.post("/order", (req, res) => {
  const { cocktail } = req.body;

  if (!cocktail) {
    return res.status(400).json({ error: "Cocktail name is required" });
  }

  // Insert the order into the database with status 'open'
  db.run(
    "INSERT INTO orders (details, status) VALUES (?, ?)",
    [cocktail, "open"],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Failed to create order" });
      }
      const id = this.lastID;
      res.status(200).json({ id });
      //trigger callback
      eventEmitter.emit("orderAvailable");
    }
  );
});

// Endpoint for checking and processing work orders
app.get("/work-order", (req, res) => {
  console.log("Start order preparing");

  // Check if there are open orders in the database
  db.get(
    "SELECT * FROM orders WHERE status = 'queued' ORDER BY timestamp ASC LIMIT 1",
    (err, row) => {
      if (err) {
        console.error("Failed to check for orders");
        return res
          .status(500)
          .json({ error: "Failed to check for work orders" });
      }

      //if not save callback in database and return callback header
      if (!row) {
        db.run("INSERT INTO callbacks (address) VALUES (?)", [
          req.headers["cpee-callback"],
        ]);
        console.log(`Callback address ${req.headers["cpee-callback"]} stored!`);
        // No open orders found, send the callback header
        res.setHeader("CPEE-UPDATE", "TRUE");
        return res.status(200).send();
      }

      // Found an open order, update its status to 'processing' and send it as a response
      db.run(
        "UPDATE orders SET status = 'processing' WHERE id = ?",
        [row.id],
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Failed to process work order" });
          }

          res.status(200).json({
            id: row.id,
            cocktailName: row.details,
            status: "processing",
          });
        }
      );
    }
  );
});

// Endpoint for marking an order as finished
app.put("/finished/:id", (req, res) => {
  const orderId = req.params.id;

  // Update the order's status to 'finished'
  db.run(
    "UPDATE orders SET status = ? WHERE id = ?",
    ["finished", orderId],
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to mark order as finished" });
      }

      res
        .status(200)
        .json({ message: `Order id ${orderId} marked as finished` });
    }
  );
});

//Callback function for a new order
eventEmitter.on("orderAvailable", () => {
  console.log("New order has arrived");

  //check if any callbacks are stored
  db.get("SELECT * FROM callbacks LIMIT 1", (err, callbackRow) => {
    if (err) {
      console.error("Failed to check for callback addresses: ", err);
    }

    console.log("Callbackrow: ", callbackRow);

    //if a callback is waiting serve it new order
    if (callbackRow) {
      console.log(`Callback address ${callbackRow.address} exists`);
      // Found an open order, update its status to 'processing' and send it as a response
      db.get(
        "SELECT * FROM orders WHERE status = ? ORDER BY timestamp ASC LIMIT 1",
        ["open"],
        (err, orderRow) => {
          if (err) {
            console.error("Failed to check for work orders: ", err);
            //return res.status(500).json({ error: "Failed to check for work orders" });
          }

          //update status to 'processing'
          db.run(
            "UPDATE orders SET status = ? WHERE id = ?",
            ["processing", orderRow.id],
            async (err) => {
              if (err) {
                console.error("Failed to process work order: ", err);
                // return res.status(500).json({ error: "Failed to process work order" });
              }

              console.log("Triggered Callback address: ", callbackRow.address);
              await axios.put(callbackRow.address, {
                id: orderRow.id,
                cocktailName: orderRow.details,
                status: "processing",
              });

              //delete the served callback address
              db.run(
                `DELETE FROM callbacks where id = ${callbackRow.id}`,
                (err) => {
                  if (err) {
                    console.error(
                      `Failed to delete callback address ${callbackRow.address}`
                    );
                    //return res.status(500).json({error: `Failed to delete callback address ${row.address}`,});
                  }
                }
              );
              return;
            }
          );
        }
      );
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
