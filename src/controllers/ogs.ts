import { RequestHandler } from 'express';
import { Og } from '../models/ogs'
// import { Document, Model, model, Types, Schema, Query } from "mongoose"
const mongoose = require('mongoose');


// DB schema
const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const Item = mongoose.model('item', ItemSchema);

export const createOg: RequestHandler = (req, res, next) => {
  // const name = (req.body as {text: string}).text;
  // const newOg = new Og(Math.random().toString(), name);

  const newItem = new Item({
    name: req.body.text
  });

  newItem.save().then(() => {
      res.status(201).json({message: 'Created og', createdOg: req.body.text});
    });   
};

export const getOgs: RequestHandler = (req, res, next) => {
  Item.find(function (err: Error, items: any) {
    if (err) return console.error(err);
    console.log(items);
    res.status(200).json(items);
  })
};