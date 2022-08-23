import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { sign } from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../model';

export const getPortfolioValues = async (req: Request, res: Response) => {
  let users = await User.find();

  let data = users.map((u) => {
    return {
      user: u.address,
      balance: u.balances[u.balances.length - 1]?.balance || 0,
    };
  });
  console.log({ data });
  return res.status(200).json({ data, success: true });
};
/**
 *
 * @param req.body.address Wallet address
 */
export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let _errors = errors.array().map((error) => {
      return {
        msg: error.msg,
        field: error.param,
        success: false,
      };
    });
    return res.status(400).json(_errors);
  }

  const { nickname, address } = req.body;

  if (await User.exists({ address })) {
    return res
      .status(400)
      .json({ msg: 'User with this address already exists', success: false });
  }

  const user = new User({
    address,
  });
  try {
    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };
    sign(
      payload,
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_TOKEN_EXPIRES_IN,
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token, success: true });
      }
    );
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

/**
 * Gets a specific User By Id
 * @param id User Id
 *
 * @private
 *
 * @returns User | null
 */

export const getUserById = async (id: string) => {
  try {
    return await User.findById(id);
  } catch (err: any) {
    console.error(err.message);
    return null;
  }
};
