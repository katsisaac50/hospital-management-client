import { NextApiRequest, NextApiResponse } from 'next';

const doctors = [
  { id: 1, name: 'Dr. Adams', specialization: 'Cardiology' },
  { id: 2, name: 'Dr. Clark', specialization: 'Neurology' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(doctors);
}
