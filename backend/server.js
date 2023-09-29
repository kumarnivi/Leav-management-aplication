const express = require('express'); // for midileWare 
const bodyParser = require('body-parser'); // carch the request transformer
const cors = require('cors'); //
const server = express();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
require('dotenv').config()

const transporter = require('./nodemailer'); // Import the transporter from your nodemailer.js file

const db =require("./database/db") // connect the database
const auth = require("./controller/authController");


// Connect to the database
server.use(cors()); // for using the express
server.use(bodyParser.json());
// ************************************************************************************************************


// Create a user for Admin
server.post('/api/student/add', (req, res) => {
  try {
      let details = {
          name: req.body.name,
          email: req.body.email,
          phonenum: req.body.phonenum,
          NIC:req.body.NIC,
      };

      // Add to the database
      let sql = "INSERT INTO student SET ?";
      db.query(sql, details, (error, results) => {
          if (error) {
              console.log('Error inserting data:', error);
              res.status(500).json({ status: false, message: "Failed to insert data" });
          } else {
              console.log('Data inserted successfully');
              res.status(200).json({ status: true, message: "Data inserted successfully" });
          }
      });
  } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ status: false, message: "An error occurred while processing your request" });
  }
});



// view the user All user 
server.get("/api/student", (req,res) => {
  var sql = 'SELECT * FROM student';
  db.query(sql, function(error, result){
      if(error){
          console.log("not found!")
      }else{
          res.send({status:true, data:result})
      }
  })
})

// get the single data 

server.get("/api/student/:id", (req,res) => {
var studentid = req.params.id;
var sql = 'SELECT * FROM student WHERE id=' + studentid;
db.query(sql, function(error, result){
  if(error) {
      console.log("error connecting for the db search")
  } else {
      res.send({status:true, data: result})
  }
}) 
})


// udate the user data 
server.put("/api/student/update/:id", (req, res) => {
  let sql =
    "UPDATE student SET name='" +
    req.body.name +
    "', email='" +
    req.body.email +
    "',phonenum='" +
    req.body.phonenum +
    "',NIC'" +
    req.body.NIC +
    "'  WHERE id=" +
    req.params.id;

  let a = db.query(sql, (error, result) => {
    if (error) {
      res.send({ status: false, message: "Student Updated Failed" });
    
    } else {
      res.send({ status: true, message: "Student Updated successfully" });
    }
  });
});

// ******************************************************************************************************************************

// Helper function to execute SQL queries
function query(sql, values) {
    return new Promise((resolve, reject) => {
      db.query(sql, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
//*************************************************************************************************************** */
// register user ..

const secretKey =  process.env.JWT_SECRET_KEY

server.post('/api/users/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if the user already exists
      const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
      const existingUser = await query(checkUserQuery, [email]);
  
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash  password
      const hashedPassword = await bcrypt.hash(password, 8);
  
      // Insert user into the database
      const insertUserQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      await query(insertUserQuery, [name, email, hashedPassword]);
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ' server error' });
    }
  });
  

//   login user 
server.post('/api/users/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user exists
      const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
      const user = await query(checkUserQuery, [email]);
  
      if (user.length === 0) {
        return res.status(401).json({ message: 'Invalid user' });
      }
  
      // Compare the  password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user[0].password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password!' });
      }
  
      // JWT token
      const token = jwt.sign({ userId: user[0].id }, secretKey, { expiresIn: '1h' });
  
      res.status(200).json({ email, token, message:"Login Success !" });
  

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  


//  update password

// server.post('/api/users/change-password', async (req, res) => {
//   try {
//       const { email, currentPassword, newPassword } = req.body;
//  console.log(newPassword)
//       // Check if the user exists
//       const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
//       const user = await query(checkUserQuery, [email]);
// console.log(user);
//       if (user.length === 0) {
//           return res.status(404).json({ message: 'User not found' });
//        }

//       // Compare the provided current password with the hashed password in the database
//       const isPasswordValid = await bcrypt.compare(currentPassword, user[0].password);

//       if (!isPasswordValid) {
//           return res.status(401).json({ message: 'Invalid current password' });
//       }

//       // Hash the new password
//       const hashedPassword = await bcrypt.hash(newPassword, 8)

//       // Update the user's password
//       const updatePasswordQuery = 'UPDATE users SET password = ? WHERE email = ?';
//       await query(updatePasswordQuery, [hashedPassword, email]);

//       res.status(200).json({ message: 'Password changed successfully' });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// });


// token 

// function generateChangeToken() {
//   const token = Math.random().toString(36).substr(2, 10);
//   return token;
// }



function generateChangeToken(userId) {
  const secretKey = 'your-secret-key'; // Replace with your secret key
  const expiresIn = '1h'; // Token expiration time

  const token = jwt.sign({ userId }, secretKey, { expiresIn });

  return token;
}

// password reset request send by email

server.post('/api/users/request-password-change', async (req, res) => {
  try {
      const { email } = req.body;

      // Check if the user exists
      const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
      const user = await query(checkUserQuery, [email]);

      if (user.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Generate a password change token and set an expiration time
      const changeToken = generateChangeToken();
      const changeTokenExpiration = new Date();
      changeTokenExpiration.setHours(changeTokenExpiration.getHours() + 1); // Token expires in 1 hour

      // Store the change token and expiration in the database
      const updateTokenQuery = 'UPDATE users SET  reset_token = ?, reset_token_expiration = ? WHERE email = ?';
      await query(updateTokenQuery, [changeToken, changeTokenExpiration, email]);

      // Send the change token to the user via email
      const mailOptions = {
          from: 'nodejs791@gmail.com',
          to: email,
          subject: 'Password Change Request',
          text: `To change your password, click the following link: http://example.com/change-password?token=${changeToken}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error(error);
              return res.status(500).json({ message: 'Failed to send change token email' });
          }
          console.log('Change token email sent:', info.response);
          res.status(200).json({ message: 'Password change token sent' , token:changeToken});
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


server.post('/api/users/reset-password', async (req, res) => {
  try {
      const { email, token, newPassword } = req.body;

      // Verify if the token is valid and not expired
      const verifyTokenQuery = 'SELECT * FROM users WHERE email = ? AND  reset_token = ? AND  reset_token_expiration > NOW()';
      const user = await query(verifyTokenQuery, [email, token]);

      if (user.length === 0) {
          return res.status(401).json({ message: 'Invalid or expired change token' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password and remove the change token
      const updatePasswordQuery = 'UPDATE users SET password = ?,  reset_token = NULL,  reset_token_expiration = NULL WHERE email = ?';
      await query(updatePasswordQuery, [hashedPassword, email]);


      res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


// get all register  user 
  server.get("/api/users", (req,res) => {
    var sql = 'SELECT * FROM users';
    db.query(sql, function(error, result){
        if(error){
            console.log("not found!")
        }else{
            res.send({status:true, data:result})
        }
    })
})


// get single user
server.get("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ error: 'Please provide a user ID' });
    }

    // Build the SQL query to select a user by ID
    const sql = 'SELECT * FROM users WHERE id = ?';

    // Execute the SQL query with the userId as a parameter
    db.query(sql, [userId], function (error, result) {
      if (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        if (result.length === 0) {
          res.status(404).json({ error: 'User not found' });
        } else {
          res.status(200).json({ status: true, data: result[0] });
        }
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




//*******************************************************************************************************/


//  leave request form
server.post('/api/leave_requests', async (req, res) => {
  const { name, email, date_from, date_to, reason } = req.body;

  try {
    // Insert the form data into the MySQL database
    const insertQuery = 'INSERT INTO leave_requests (name, email, date_from, date_to, reason) VALUES (?, ?, ?, ?, ?)';
    await db.query(insertQuery, [name, email, date_from, date_to, reason]);

    console.log('Leave request submitted successfully');
    res.status(200).json({ message: 'Leave request submitted successfully' });
  } catch (err) {
    console.error('Error inserting data into MySQL:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


server.get("/api/leave_requests", (req, res) => {
  try {
    var sql = 'SELECT * FROM leave_requests';
    db.query(sql, function (error, result) {
      if (error) {
        console.error("Error fetching leave requests:", error);
        res.status(500).json({ status: false, error: "Internal server error" });
      } else {
        res.status(200).json({ status: true, data: result });
      }
    });
  } catch (err) {
    console.error("Error in /api/leave_requests route:", err);
    res.status(500).json({ status: false, error: "Internal server error" });
  }
});

//****************************************************************************************************** */









// connet the server which using port
server.listen(8080, function (error) {
  if (error) {
      console.log('Error:', error);
  } else {
      console.log("Server started on port 8080");
  }
});

