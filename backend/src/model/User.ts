import { Schema, model, Model } from 'mongoose';
import { IUser } from '../types';

// An interface that describes what attributes a user model should have
interface UserModel extends Model<IUser> {
  build(attrs: IUser): IUser;
}

// Creating user schema
const UserSchema = new Schema<IUser, UserModel>(
  {
    address: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
      default: '',
    },
    balances: [
      {
        balance: {
          type: Number,
          default: 0,
        },
        timestamp: {
          type: Number,
          default: Date.now(),
        },
        coin: {
          type: String,
          default: 'MATIC',
        },
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
    timestamps: true,
  }
);

// Statics
UserSchema.statics.build = (attrs: IUser) => {
  return new User(attrs);
};

// Creating user model
const User = model<IUser>('User', UserSchema);

export { User };
