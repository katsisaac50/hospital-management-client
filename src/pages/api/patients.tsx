import { NextApiRequest, NextApiResponse } from 'next';

const patients = [
  { id: 1, name: 'John Doe', age: 45 },
  { id: 2, name: 'Jane Smith', age: 32 },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(patients);
}
