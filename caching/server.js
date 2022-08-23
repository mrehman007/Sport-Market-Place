import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
// import 'dotenv/config';
import redis from './redis.js';

const port = 4001; // process.env.PORT ||

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

app.get('/api/cache', async (req, res) => {
  try {
    const { page } = req.query;
    const data = await redis.get(page);

    if (data) {
      res.status(200).send({
        data: data,
      });
    } else {
      res.status(200).send({
        data: [],
      });
    }
  } catch (error) {
    res.status(500).send(error?.message);
  }
});

app.post('/api/cache', async (req, res) => {
  try {
    const { page, data } = req.body;

    let r = await redis.set(page, JSON.stringify(data));

    console.log(r);

    res.status(200).send({
      status: 'success',
      message: 'Cache updated',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error?.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port} 🏃`);
});
