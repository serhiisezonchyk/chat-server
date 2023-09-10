import prisma from './index.js';

export const createChat = async (req, res) => {
  const { first_id, second_id } = req.body;

  try {
    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          {
            members: {
              some: { user_id: first_id },
            },
          },
          {
            members: {
              some: { user_id: second_id },
            },
          },
        ],
      },
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChat = await prisma.chat.create({
      data: {
        members: {
          create: [{ user_id: first_id }, { user_id: second_id }],
        },
      },
    });

    return res.status(201).json(newChat);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Something went wrong...' });
  }
};

export const findUserChats = async (req, res) => {
  const { user_id } = req.params;

  try {
    const userChats = await prisma.chat.findMany({
      where: {
        members: {
          some: {
            user_id,
          },
        },
      },
      include: {
        members: {
          where: {
            user_id: {
              not: user_id, 
            },
          },
          include:{
            user:true,
          }
        },
      },
    });

    return res.status(200).json(userChats);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Something went wrong...' });
  }
};

export const findChat = async (req, res) => {
  const { first_id, second_id } = req.params;

  try {
    const chat = await prisma.chat.findFirst({
      where: {
        members: {
          some: {
            user_id: {
              in: [first_id, second_id],
            },
          },
        },
      },
      include: {
        members: true,
      },
    });

    return res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Something went wrong...' });
  }
};
