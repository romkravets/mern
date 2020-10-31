const {Router} = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, vlidationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post('/register', 
   [
      check('email', 'Not valid email').isEmail(),
      check('password', "Length 6").isLength({min: 6})
   ],
   async (req, res) => {
   try {
      const errors = validationResult(req)

      if (errors.isEmpty()) {
         return res.status(400).json({
            errors: errors.array(),
            message: "Not valid register"
         })
      }
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
router.post(
   '/login', 
    [
      check('email', 'Input correct rmail').normalizeEmail().isEmail(),
      check('password', 'Input password').exists()
   ],
   async (req, res) => {
      try {
      const errors = validationResult(req)

      if (errors.isEmpty()) {
         return res.status(400).json({
            errors: errors.array(),
            message: "Not valid register"
         })
      }
      const {email, password} = req.body

      const user = await User.findOne({email})

      if(!user) {
         return res.status(400).json({message: 'Not found'})
      }

      const isMatch = await bcrypt.compair(password, user.password)

      if (!isMatch) {
         return res.status(400).json({message: "Try egain"})
      }

      const token = jwt.sign(
         {userId: user.id},
         config.get('jwtSecret'),
         {expiresIn: '1h'}
      )

      res.json({token, userId: user.id})
    

   } catch (e) {
      res.status(500).json({message: "Error"})
   }
})

module.exports = router