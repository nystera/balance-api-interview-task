import express from 'express';
import fetch from 'node-fetch';
import userBalances from '../mock/users.js';
import dotenv from 'dotenv';

// Setup config variables
dotenv.config();

// Declare constants
const app = express();
const port = process.env.PORT || 3000;
const apiURL = 'https://www.bitstamp.net/api/v2/ticker/'

app.get('/:userId', async (req, res) => {
  try {
    const id = req.params.userId;
    const userInfo = userBalances[`user-${id}`];
    // Throws error if user is not found
    if (userInfo === undefined) {
      res.status(404).json({
        error: "no user found in database"
      });
      return
    }
    const crypCurrHold = Object.keys(userInfo)
    // Assumes user info are valid so errors only can be found if can't retrieve from API
    let promises = crypCurrHold.map(async (crypto) => {
      const response = await fetch(
        `${apiURL}/${crypto.toLowerCase()}usd`,
        {
          method: 'GET',
        });
      const result = await response.json();
      return Number(result["last"]) * Number(userInfo[crypto]);
    });
    const values = await Promise.all(promises);
    const totalValue = await values.reduce((prev, curr) => prev + curr);
    res.json({
      id: id,
      USD: (Math.round(totalValue * 100) / 100).toFixed(2)
    });
  } catch (err) { // Very basic error handling 
    res.status(408).json({
      error: err
    });
  }
});

app.get('/', async (req, res) => {
  res.send("append /id to try out the GET API")
});

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

export default server;