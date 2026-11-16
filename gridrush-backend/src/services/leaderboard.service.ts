import { Cell } from '../models/Cell.model.js';
import mongoose from 'mongoose';

export interface LeaderboardEntry {
  id: string;
  username: string;
  color: string;
  claimedCount: number;
}

export const getLeaderboard = async (limit = 10): Promise<LeaderboardEntry[]> => {
  const result = await Cell.aggregate([
    {
      $match: {
        ownerId: { $ne: null },
      },
    },
    {
      $group: {
        _id: '$ownerId',
        claimedCount: { $sum: 1 },
      },
    },
    {
      $sort: {
        claimedCount: -1,
        _id: 1,
      },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: 'players',
        localField: '_id',
        foreignField: '_id',
        as: 'playerInfo',
      },
    },
    {
      $unwind: '$playerInfo',
    },
    {
      $project: {
        _id: 0,
        id: { $toString: '$playerInfo._id' },
        username: '$playerInfo.username',
        color: '$playerInfo.color',
        claimedCount: 1,
      },
    },
  ]);

  return result;
};

