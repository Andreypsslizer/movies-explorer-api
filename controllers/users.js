const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const RegistratedError = require('../errors/registrated-err');
const NotAuthorizedError = require('../errors/not-authorized-err');

const getUser = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .orFail(new NotFoundError('Пользователь с указанным id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new RegistratedError('Пользователь с таким email уже существует'));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
    });
    res.json({
      name: user.name, email: user.email,
    });
  } catch (error) {
    if (error.code === 11000) {
      next(new RegistratedError('Пользователь с таким email уже существует'));
    } else if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(error);
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { NODE_ENV, JWT_SECRET } = process.env;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
      { expiresIn: '7d' },
    );
    res.json({
      token,
    });
  } catch (error) {
    next(new NotAuthorizedError('Неправильные почта или пароль'));
  }
};

module.exports = {
  getUser,
  updateUser,
  createUser,
  login,
};
