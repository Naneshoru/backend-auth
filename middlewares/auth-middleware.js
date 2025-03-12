import jwt from 'jsonwebtoken'

const protectRoute = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

export default protectRoute