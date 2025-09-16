const User = require('../models/user.model');
const bcrypt = require("bcryptjs");
const { generateToken } = require("../lib/utils.js");

//signup 

const handleSignup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name);
  try {

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log()

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json(newUser);
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  try {
    const user = await User.findOne({ email }).lean(); 

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log(user);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("after password chk");

    generateToken(user._id, res);

    const { password : userPassword, ...userWithoutPassword } = user; 
    res.status(200).send(userWithoutPassword);

  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handleLogout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkAuth = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
    handleSignup,
    handleLogin,
    handleLogout,
    checkAuth
}