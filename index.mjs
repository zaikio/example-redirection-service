import express from "express";
import * as crypt from "./crypt.mjs";

const app = express();

const port = Number(process.env.PORT || "3000");

app.get("/redirect", (req, res) => {
  if (req.query.state == null) {
    // No state parameter so this isn't something we can respond to
    return res.sendStatus(404);
  }

  try {
    // Decode the state parameter
    const { u } = crypt.decrypt(req.query.state);
    const url = new URL(u);

    // Merge the query of this request into the stored URL
    Object.keys(req.query).forEach(key => {
      url.searchParams.set(key, req.query[key]);
    });

    // Redirect to the merged URL
    res.redirect(url);
  } catch (error) {
    // Something went wrong
    console.error(error);
    res.sendStatus(400);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
