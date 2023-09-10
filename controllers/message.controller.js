import prisma from './index.js';

export const createMessage = async (req, res) => {
  const { chat_id, sender_id, text } = req.body;
  try {
    const message = await prisma.message.create({
      data: {
        chat: { connect: { id: chat_id } },
        sender: { connect: { id: sender_id } },
        text: text,
      },
    });
    return res.status(200).json(message);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Something went wrong...' });
  }
};

export const getMessages = async (req, res) => {
  const { chat_id } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: {
        chat_id: chat_id,
      },
    });
    return res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Something went wrong...' });
  }
};
