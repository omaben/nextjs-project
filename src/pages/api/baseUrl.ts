// pages/api/apiUrl.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '';
  const keyLicense: string = process.env.NEXT_LICENSE_KEY || '';
  res.status(200).json({ baseUrl, keyLicense });
};
