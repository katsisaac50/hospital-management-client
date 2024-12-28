// import { NextApiRequest, NextApiResponse } from 'next';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// const users = [
//   { id: 1, username: 'patient1', password: bcrypt.hashSync('password123', 10), role: 'patient' },
//   { id: 2, username: 'doctor1', password: bcrypt.hashSync('password123', 10), role: 'doctor' },
// ];

// const secretKey = 'supersecretkey'; // Use environment variables in production!

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { username, password } = req.body;

//     const user = users.find((user) => user.username === username);
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     const passwordMatch = bcrypt.compareSync(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
//     res.status(200).json({ token });
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }
