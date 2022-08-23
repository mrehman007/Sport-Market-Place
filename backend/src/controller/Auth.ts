import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { sign } from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../model';
import { IUser } from '../types';

/*
 * @route GET api/users/auth
 * @desc  Gets a specific user by their address
 * @param req.body.address Wallet address
 *
 * @access private
 * @returns {User} User
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found', success: false });
    }
    return res.json({ user, success: true });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send('Internal server error');
  }
};

/**
 * @route POST api/users/auth
 * @desc  Authenticate user and get token
 *
 * @access Public
 */
export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0] });
  }

  const { address } = req.body;
  try {
    if (!(await User.exists({ address }))) {
      // register user
      const user = new User({
        address,
      });
      await user.save();
    }
    const user = await User.findOne({ address });

    if (!user) {
      return res
        .status(400)
        .json({ msg: 'Failed to register account', success: false });
    }

    const payload = {
      id: user.id,
      address: user.address,
    };
    sign(
      payload,
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_TOKEN_EXPIRES_IN,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token, success: true });
      }
    );
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send('Internal server error');
  }
};
