import { RequestHandler } from 'express';
import { Og } from '../models/ogs'

// TODO: Use db instead
const OGS: Og[] = [];

export const createOg: RequestHandler = (req, res, next) => {
  const name = (req.body as {text: string}).text;
  const newOg = new Og(Math.random().toString(), name);
  OGS.push(newOg);
  res.status(201).json({message: 'Created og', createdOg: newOg});
};

export const getOgs: RequestHandler = (req, res, next) => {
    res.status(200).json(OGS);
  };