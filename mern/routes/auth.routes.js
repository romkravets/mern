const {Router} = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post('/register', async (req, res) => {
   try {
      const {email, password} = req.body

      const candidate = await User.findeOne({email})

      if(candidate) {
         return res.status(400).json({message: 'Empty'})
      } 

      const hashedPassword = await bcrypt.hash(password, 12) 
      const user = new User({email, password: hashedPassword})

      await user.save()

      res.status(201).json({mesage: "User created"})

   } catch (e) {
      res.status(500).json({message: "Error"})
   }
})

// /api/auth/login
router.post('/login', async (req, res) => {
   
})

module.exports = router