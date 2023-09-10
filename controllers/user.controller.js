import prisma from './index.js';
import { compareSync, hash, genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';

const createToken = (_id, _email, _login, _name) => {
  return jwt.sign({ _id, _email, _login, _name }, process.env.SECRET_KEY, {
    expiresIn: '3d',
  });
};

export const create = async (req, res) => {
  const data = req.body;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: data.email,
        },
        {
          login: data.login,
        },
      ],
    },
  });

  if (user) {
    return res
      .status(400)
      .json({ error: 'User with this email or login already exists.' });
  }

  if (
    !data.email ||
    !data.login ||
    !data.password ||
    !data.check_password ||
    !data.name
  )
    return res.status(400).json({ error: 'All fields are required.' });

  if (data.password !== data.check_password)
    return res.status(400).json({ error: 'Passwords are different.' });

  try {
    const new_user = {
      email: data.email,
      password: data.password,
      login: data.login,
      name: data.name,
    };
    const salt = await genSalt(10);
    new_user.password = await hash(new_user.password, salt);

    const created_user = await prisma.user.create({ data: new_user });
    const token = createToken(
      created_user.id,
      created_user.email,
      created_user.login,
      created_user.name
    );
    return res.status(200).send({ token });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: 'Something went wrong while creating user.' });
  }
};

export const login = async (req, res) => {
  const data = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: data.login,
          },
          {
            login: data.login,
          },
        ],
      },
    });

    if (!user)
      return res.status(400).json({ error: 'Incorrect email or password...' });

    const isValidPassword = compareSync(data.password, user.password);
    if (!isValidPassword)
      return res.status(400).json({ error: 'Incorrect email or password...' });

    const token = createToken(user.id, user.email, user.login, user.name);
    return res.status(200).send({ token });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Incorrect email or password...' });
  }
};

export const check = async (req, res) => {
  const token = createToken(
    req.user._id,
    req.user._email,
    req.user._login,
    req.user._name
  );
  return res.status(200).send({ token });
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const user = await prisma.user.findFirst({ where: { id: id } });
    return res.status(200).json(user || {});
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: 'Something went wrong while fetching user...' });
  }
};

export const getUsers = async (req, res) => {

  const search_line = req.query?.search_line?.trim() || '';
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            login: {
              contains: search_line,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: search_line,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: 'Something went wrong while fetching user...' });
  }
};
