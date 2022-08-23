import Redis from 'ioredis';

// const redis = new Redis({
//   host: "127.0.0.1",
//   port: 6379,
//   password: "MSE2}%6a9q[m5-3Q",
// });

const redis = new Redis({
  host: '54.204.116.76',
  port: 6379,
  password:
    '0EgoGx3HL162kfOtCO5s3Ez0dRMXjbxQaoGYxKdemdESTJEbYjDfSB5vP+bcFLoFynL/iYSip9Jm5cwh',
});

export default redis;
