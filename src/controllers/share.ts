import { RequestHandler } from "express";
import nodeFetch from "node-fetch";

export const sharePost: RequestHandler = async (req, res) => {
  const response = await nodeFetch(`https://app.fffutu.re/ghost/api/v3/content/posts/${req.params.post}/?key=${process.env.GHOST_CONTENT_KEY}`);
  let data = [];
  let title: String = "Error";
  let desc: String = "Error";
  let imageUrl: String = "Error";
  try {
    data = await response.json();
    title = data["posts"][0]["title"];
    desc = data["posts"][0]["excerpt"];
    imageUrl = data["posts"][0]["feature_image"];
    console.log(title);
    console.log(desc);
    console.log(imageUrl);
  } catch (error) {
    console.log(error);
  }
  res.redirect(`https://appforfuture.page.link/?amv=100&apn=de.fridaysforfuture.app&ibi=de.fridaysforfuture.app.official&imv=1.0.0&isi=1506077796&link=https://app.fffutu.re/feed/${req.params.post}&ofl=https://app.fffutu.re/download&st=${title}&sd=${desc}&si=${imageUrl}`);
};
