const express = require('express');
const router = express.Router();
const User = require("./userSchema")
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/users', async (req, res) => {
    try {
        const { skip = 0, limit = 10, term } = req.query; 
        let query = {};
        
        if (term && term.trim() !== "") {
            query.name = { $regex: '^' + term.trim(), $options: 'i' };
        }
        
        const totalUsers = await User.countDocuments(query);
        
        let users;
        if (Object.keys(query).length === 0 || query==="") {
            users = await User.find().skip(parseInt(skip)).limit(parseInt(limit));
        } else {
            users = await User.find(query).skip(parseInt(skip)).limit(parseInt(limit));
        }
        
        res.status(200).json({ users, total: totalUsers });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong load users" });
    }
});



router.post('/register', async (req, res) => {
    try {
      
        const {name, lastname, phone, email } = req.body;

      
        const maxCustomIdUser = await User.findOne().sort({ _id: -1 });
        let customIdCounter = maxCustomIdUser ? maxCustomIdUser._id + 1 : 1;

      
        const newUser = new User({
            _id: customIdCounter, 
            name,
            lastname,
            phone,
            email
        });

        
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
    
        await User.deleteOne({ _id: userId });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, lastname, phone, email } = req.body;

        
        const userToUpdate = await User.findById(userId);

 
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        const updatedFields = {};
        if (name !== undefined && name !== "") {
            updatedFields.name = name;
        } else {
            updatedFields.name = userToUpdate.name;
        }
        if (lastname !== undefined && lastname !== "") {
            updatedFields.lastname = lastname;
        } else {
            updatedFields.lastname = userToUpdate.lastname;
        }
        if (phone !== undefined && phone !== "") {
            updatedFields.phone = phone;
        } else {
            updatedFields.phone = userToUpdate.phone;
        }
        if (email !== undefined && email !== "") {
            updatedFields.email = email;
        } else {
            updatedFields.email = userToUpdate.email;
        }

      
        const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

        res.status(200).json(updatedUser); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
