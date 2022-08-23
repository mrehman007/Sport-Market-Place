import { Application } from 'express';

export const configureRoutes = (app: Application) => {
  app.use('/api/auth', require('./api/auth'));
  app.use('/api/users', require('./api/users'));
  app.use('/', (req, res) => {
    res.status(200).send('Welcome to Fantasy Sport Range!');
  });
};
