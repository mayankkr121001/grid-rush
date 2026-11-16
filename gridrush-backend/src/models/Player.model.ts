import { Schema, model, Document, Types } from 'mongoose';

export interface IPlayer extends Document {
  _id: Types.ObjectId;
  username: string;
  color: string;
  recoveryCodeDigest: string;
  createdAt: Date;
  updatedAt: Date;
}

const playerSchema = new Schema<IPlayer>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 20,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    recoveryCodeDigest: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Player = model<IPlayer>('Player', playerSchema);

