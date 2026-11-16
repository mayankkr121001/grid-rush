import { Schema, model, Document, Types } from 'mongoose';

export interface ICell extends Document {
  cellId: number;
  row: number;
  column: number;
  ownerId: Types.ObjectId | null;
  claimedAt: Date | null;
}

const cellSchema = new Schema<ICell>(
  {
    cellId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
      min: 0,
      max: 399,
    },
    row: {
      type: Number,
      required: true,
      min: 0,
      max: 19,
    },
    column: {
      type: Number,
      required: true,
      min: 0,
      max: 19,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      default: null,
      index: true,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: false,
  }
);

export const Cell = model<ICell>('Cell', cellSchema);

