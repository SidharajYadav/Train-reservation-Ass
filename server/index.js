require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

const app = express();
const port = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
});

// Middleware
app.use(cors());
app.use(express.json());

// JWT verification middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Seat routes
app.get("/api/seats", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM seats ORDER BY row_number, seat_number"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch seats" });
  }
});

app.post("/api/reserve", authenticateToken, async (req, res) => {
  try {
    const { seatIds, userId } = req.body;

    const checkResult = await pool.query(
      "SELECT id FROM seats WHERE id = ANY($1) AND is_reserved = true",
      [seatIds]
    );

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: "Some seats are already reserved" });
    }

    await pool.query(
      "UPDATE seats SET is_reserved = true, user_id = $1 WHERE id = ANY($2)",
      [userId, seatIds]
    );

    res.json({ message: "Seats reserved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Reservation failed" });
  }
});

app.post("/api/cancel", authenticateToken, async (req, res) => {
  try {
    const { seatIds, userId } = req.body;

    const checkResult = await pool.query(
      "SELECT id FROM seats WHERE id = ANY($1) AND user_id != $2",
      [seatIds, userId]
    );

    if (checkResult.rows.length > 0) {
      return res
        .status(403)
        .json({ error: "Cannot cancel seats reserved by another user" });
    }

    await pool.query(
      "UPDATE seats SET is_reserved = false, user_id = NULL WHERE id = ANY($1)",
      [seatIds]
    );

    res.json({ message: "Reservation canceled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Cancellation failed" });
  }
});

// Initialize database and start server
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS seats (
        id SERIAL PRIMARY KEY,
        row_number INTEGER NOT NULL,
        seat_number INTEGER NOT NULL,
        is_reserved BOOLEAN DEFAULT false,
        user_id INTEGER REFERENCES users(id),
        UNIQUE(row_number, seat_number)
      );
    `);

    const seatCount = await pool.query("SELECT COUNT(*) FROM seats");
    if (seatCount.rows[0].count === "0") {
      const seats = [];
      for (let row = 1; row <= 11; row++) {
        const seatsInRow = row === 11 ? 3 : 7;
        for (let seat = 1; seat <= seatsInRow; seat++) {
          seats.push(`(${row}, ${seat})`);
        }
      }
      await pool.query(
        `INSERT INTO seats (row_number, seat_number) VALUES ${seats.join(", ")}`
      );
    }

    console.log("Database initialized");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
