import { RequestHandler } from 'express';
import { Og } from '../models/ogs'

export const createOg: RequestHandler = async (req, res) => {
  try {
    const newOg = new Og(req.body);
    let newOG = await newOg.save()
    res.status(201).json({message: 'Created og', createdOg: newOG});
  } catch (error) {
    res.status(422).json({message: 'Could not create og', error: error});
  }
};

export const getOgs: RequestHandler = (req, res) => {
  Og.find(function (err: Error, ogs) {
    if (err) return console.error(err);
    console.log(ogs);
    res.status(200).json(ogs);
  })
};
