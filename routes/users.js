const usersRouter = require('express').Router();
const { validateUpdateUser } = require('../middlewares/validateUser');

const {
  getUser,
  updateUser,
} = require('../controllers/users');

usersRouter.get('/me', getUser);
usersRouter.patch('/me', validateUpdateUser, updateUser);

module.exports = usersRouter;
