import { RequestHandler } from "express";

export const sharePost: RequestHandler = (req, res) => {
  res.redirect(`https://appforfuture.page.link/?amv=100&apn=de.fridaysforfuture.app&ibi=de.fridaysforfuture.app.official&imv=1.0.0&isi=1506077796&link=https://app.fffutu.re/post/${req.params.post}&ofl=https://app.fffutu.re/download`);
};
