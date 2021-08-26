import { NextFunction, Request, Response } from 'express';

const validPostFields = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body.user = req.body.jwt.userId;
    if (!req.body.message) {
      return res.status(422).json({ message: 'The fields message are required' });
    }
  }
  return next();
};

export { validPostFields };
