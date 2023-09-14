export default function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No access.' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: ' No access.' });
  }
}
