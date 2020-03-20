import { RequestHandler } from 'express';
import { Og } from '../models/ogs'

export const createOg: RequestHandler = async (req, res) => {
  const ogName = (req.body as {text: string}).text;
  const newOg = new Og({name: ogName});
  let newOG = await newOg.save()
  res.status(201).json({message: 'Created og', createdOg: ogName});
};

export const getOgs: RequestHandler = (req, res) => {
  Og.find(function (err: Error, ogs) {
    if (err) return console.error(err);
    console.log(ogs);
    res.status(200).json(ogs);
  })
};
