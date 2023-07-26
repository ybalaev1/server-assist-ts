import { Request, Response } from 'express';

import { Constans } from "../model/constans.model";

const getConstants = async (req: Request, res: Response) => {
    const appConstants = await Constans.find().exec();
  
    return res.status(200).json({ data: appConstants });
  };
  export {getConstants}