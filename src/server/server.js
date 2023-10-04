const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const axios = require("axios");
const EventEmitter = require("events");

const app = express();
const port = 13741;
const callbackAdresses = [];
const eventEmitter = new EventEmitter();

// Create or connect to the SQLite database
const db = new sqlite3.Database("orders.db");

// Create a table to store orders if it doesn't exist
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, details TEXT NOT NULL, status TEXT DEFAULT 'queued', timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)"
  );
});

app.use(express.json());
app.use(
  cors({
    origin: "https://lehre.bpm.in.tum.de",
  })
);

// Endpoint for creating a new order
app.post("/order", (req, res) => {
  const { cocktail } = req.body;

  console.log("cocktail: ", cocktail);

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
      eventEmitter.emit("orderAvailable");
    }
  );
});

// Endpoint for checking and processing work orders
app.get("/work-order", (req, res) => {
  console.log("Start order preparing");
  callbackAdresses.push(req.headers["cpee-callback"]);
  // Check if there are open orders in the database
  db.get(
    "SELECT * FROM orders WHERE status = 'open' ORDER BY timestamp ASC LIMIT 1",
    (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to check for work orders" });
      }

      if (!row) {
        // No open orders found, send the callback header
        res.setHeader("CPEE-UPDATE", "TRUE");
        console.log("Callback reached");
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

          callbackAdresses.shift();
          console.log("Before positive answer: ", callbackAdresses);

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
  console.log("Reached set finish!");
  const orderId = req.params.id;
  console.log(orderId);

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

      console.log("this: ", this);
      console.log("Reached set finish end");
      res
        .status(200)
        .json({ message: `Order id ${orderId} marked as finished` });
    }
  );
});

eventEmitter.on("orderAvailable", () => {
  console.log("New order arived");
  if (callbackAdresses.length > 0) {
    // Found an open order, update its status to 'processing' and send it as a response
    db.get(
      "SELECT * FROM orders WHERE status = ? ORDER BY timestamp ASC LIMIT 1",
      ["open"],
      (err, row) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Failed to check for work orders" });
        }

        db.run(
          "UPDATE orders SET status = ? WHERE id = ?",
          ["processing", row.id],
          async (err) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Failed to process work order" });
            }

            console.log("Triggered Callback address: ", callbackAdresses[0]);
            await axios.put(callbackAdresses[0], {
              id: row.id,
              cocktailName: row.details,
              status: "processing",
            });
            callbackAdresses.shift();
          }
        );
      }
    );
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
