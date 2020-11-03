import express from 'express';
import User from '../models/userModel';
import { getToken, isAuth } from '../util';

const router = express.Router();

//Sign-in; Get email and password from user for sign-in
router.post('/signin', async (req, res) => {
  const signinUser = await User.findOne({
    //check email and password
    email: req.body.email,
    password: req.body.password,
  });

  //if email & password exists, send back data to front end
  if (signinUser) {
    res.send({
      uid: signinUser.uid,
      fullName: signinUser.fullName,
      username: signinUser.username,
      email: signinUser.email,
      password: signinUser.password,
      balance: signinUser.balance,
      isAuth: signinUser.isAuth,
      isSeller: signinUser.isSeller,
      isAdmin: signinUser.isAdmin,
      token: getToken(signinUser),
    });
  } else {
    res.status(401).send({ message: 'Invalid Email or Password.' });
  }
});

//User Registration
router.post('/register', async (req, res) => {
  const user = new User({
    fullName: req.body.fullName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    isSeller: req.body.isSeller == true,
  });
  const newUser = await user.save();
  if (newUser) {
    res.send({
      uid: newUser.uid,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      balance: newUser.balance,
      isAuth: newUser.isAuth,
      isSeller: newUser.isSeller,
      isAdmin: newUser.isAdmin,
      token: getToken(newUser),
    });
  } else {
    res.status(401).send({ message: 'Invalid User Data.' });
  }
});

//Create admin
router.get('/createadmin', async (req, res) => {
  try {
    const user = new User({
      fullName: 'Admin',
      username: 'Admin',
      email: 'admin@admin.com',
      password: 'admin',
      isSeller: false,
      isAdmin: true,
      balance: 0,
    });
    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    res.send({ message: error.message });
  }
});

export default router;
