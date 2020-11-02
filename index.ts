import dotenv from 'dotenv';
if (!dotenv.config()) {
  throw new Error('read .env failure');
}

import 'pinpoint-node-agent';
import express from 'express';
import Axios, { AxiosRequestConfig } from 'axios';
import urijs from 'urijs';

const PORT = process.env.PORT || 8080;
const app = express();

// Axios 의 get 메소드 사용
app.get('/', async (_req, res) => {
  const response = await Axios.get<string>('https://naver.com');

  return res.json({
    status: response.status,
    data: response.data.slice(0, 1000),
  });
});

// Axios 의 request 메소드를 사용
app.get('/complex', async (_req, res) => {
  const requestConfig: AxiosRequestConfig = {
    method: 'GET',
    headers: {},
    url: urijs('https://naver.com').href(),
    timeout: 5000,
    validateStatus: () => true,
  };

  const response = await Axios.request(requestConfig);

  return res.json({
    status: response.status,
    data: response.data.slice(0, 1000),
  });
});

app.listen(PORT, async () => {
  console.log(`listening on ${8080}`);
});
