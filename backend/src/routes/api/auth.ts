import { Router } from 'express';
import { check } from 'express-validator';
import { validateToken } from '../../middleware';
import { login, getCurrentUser } from '../../controller';

const router = Router();

router.get('/', validateToken, getCurrentUser);

router.post(
  '/login',
  [check('address', 'Wallet address is required').not().isEmpty()],
  login
);

module.exports = router;
