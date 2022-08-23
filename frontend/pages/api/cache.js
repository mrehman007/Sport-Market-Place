import redis from "../../utils/redis";

export default async function handler(req, res) {
  try {
    const method = req.method;

    if (method === "POST") {
      const { page, data } = req.body;

      let r = await redis.set(page, JSON.stringify(data));

      console.log(r);

      res.status(200).send({
        status: "success",
        message: "Cache updated",
      });
    } else if (method === "GET") {
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
    } else {
      res.status(405).send("Method Not Allowed");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error?.message);
  }
}
