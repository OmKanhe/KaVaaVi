import { db } from "../index.js";
import bcrypt from "bcrypt"

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const nameRegex = /^[a-zA-Z\s]*$/;


const registerCandidate = async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;

        if (!firstName || !lastName || !emailId || !password) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
    
        // Validate email format
        if (!emailRegex.test(emailId)) {
          return res.status(400).json({ error: 'Invalid email format' });
        }
    
        // Validate password length
        if (password.length < 6) {
          return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }
    
        // Validate first and last name format
        if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
          return res.status(400).json({ error: 'First and last name must contain only letters' });
        }
    
        // Check if the email already exists in the database
        const checkEmailQuery = 'SELECT * FROM users WHERE email_id = ?';
        db.query(checkEmailQuery, [emailId], async (err, result) => {
          if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }
    
          if (result.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
          }
    
          // Hash the password
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
    
          // Insert the new candidate into the database
          const insertQuery = 'INSERT INTO users (first_name, last_name, email_id, password) VALUES (?, ?, ?, ?)';
          db.query(insertQuery, [firstName, lastName, emailId, hashedPassword], (err, result) => {
            if (err) {
              console.error('Error executing query:', err);
              return res.status(500).json({ error: 'Internal server error' });
            }
    
            res.status(200).json({ message: 'Candidate registered successfully' });
          });
        });
      } catch (error) {
        console.error('Error registering candidate:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
};


const loginCandidate = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Validate required fields
    if (!emailId || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if the email exists in the database
    const checkEmailQuery = 'SELECT * FROM users WHERE email_id = ?';
    db.query(checkEmailQuery, [emailId], async (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (result.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const candidate = result[0];

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, candidate.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Login successful
      res.status(200).json({ message: 'Login successful' });
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export {registerCandidate, loginCandidate}
