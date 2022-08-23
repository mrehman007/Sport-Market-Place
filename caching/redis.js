import Redis from "ioredis";

// const redis = new Redis({
//   host: "127.0.0.1",
//   port: 6379,
//   password: "MSE2}%6a9q[m5-3Q",
// });

const redis = new Redis({
  host: "redis-12265.c89.us-east-1-3.ec2.cloud.redislabs.com",
  port: 12265,
  password: "yQkdBnx2NkIaN7AI6fXYzZXCAKzBmTsL",
});

export default redis;
