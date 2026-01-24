const { User } = require("../database/models");
const express = require('express');
const bcrypt = require('bcrypt');
const { verifyToken } = require("../utils/token");

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: {
                exclude: ['password']
            }
        });

        res.status(200).json({success: true, message: 'Users retrieved successfully', data: users});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error finding the users', data: {}});
    }
})

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'User ID is not valid', data: {}});
        }

        if(req.user.id != Number(id) || req.user.role !== 'admin') {
            return res.status(401).json({success: false, message: 'Not the same user', data: {}});
        }

        const user = await User.findByPk(id, {
            attributes: {
                exclude: ['password']
            }
        });

        if(!user) {
            return res.status(404).json({success: false, message: 'User not found', data: {}});
        }

        res.status(200).json({success: true, message: 'User retrieved successfully', data: user});

    } catch (error) {
        res.status(500).json({success: false, message: 'Error finding an user', data: {}});
    }
})

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({
            where: { 
                email: email,
             }
        });

        if(existingUser) {
            return  res.status(400).json({success: false, message: 'User already exists', data: {}});
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = await User.create({
            ...req.body,
            password: hashedPassword
        });

        delete user.dataValues.password;

        res.status(201).json({success: true, message: 'User created successfully', data: user});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error creating an user', data: {}});
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'User ID is not valid', data: {}});
        }

        if(req.user.id != Number(id) || req.user.role !== 'admin') {
            return res.status(401).json({success: false, message: 'Not the same user', data: {}});
        }

        const user = await User.findByPk(id);

        if(!user) {
            return res.status(404).json({success: false, message: 'User not found', data: {}});
        }

        const updatedUser = await user.update({
            ...req.body
        });

        delete updatedUser.dataValues.password;

        res.status(200).json({success: true, message: 'User updated successfully', data: updatedUser});
    } catch (error) {
         res.status(500).json({success: false, message: 'Error updating an user', data: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        console.log(req.user);

        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'User ID is not valid', data: {}});
        }

        if(req.user.id != Number(id) || req.user.role !== 'admin') {
            return res.status(401).json({success: false, message: 'Not the same user', data: {}});
        }

        const user = await User.findByPk(id);

        if(!user) {
            return res.status(404).json({success: false, message: 'User not found', data: {}});
        }

        await user.destroy();

        res.status(200).json({success: true, message: 'User deleted with success', data: {}});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error deleting an user', data: {}});
    }
})

module.exports = router;