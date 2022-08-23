import { Router } from 'express';
import { check } from 'express-validator';
import { register, getPortfolioValues } from '../../controller';

const router = Router();

router.post(
  '/register',
  [check('address', 'Wallet address is required').not().isEmpty()],
  register
);
router.get('/portfolio', getPortfolioValues);

module.exports = router;
