const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const User = require("./models/User");

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Node backend running ✅");
});

// ================= CRUD =================

// ✅ CREATE
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ READ (ONLY ONE ROUTE)
app.get("/users", async (req, res) => {
  try {
    console.log("GET /users hit");
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE
app.delete("/users/:email", async (req, res) => {
  try {
    await User.deleteOne({ email: req.params.email });
    res.json({ message: "User deleted" });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= DB + SERVER =================

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log("MongoDB Error:", err));