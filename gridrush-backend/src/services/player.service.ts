import { Player, IPlayer } from '../models/Player.model.js';
import { Cell } from '../models/Cell.model.js';
import { generateRecoveryCode, hashRecoveryCode } from '../utils/crypto.js';
import { getRandomColor } from '../utils/palette.js';
import { signPlayerToken } from '../utils/jwt.js';

export interface PlayerPublicProfile {
  id: string;
  username: string;
  color: string;
  claimedCount: number;
}

export const createPlayer = async (rawUsername: string) => {
  const username = (rawUsername || '').trim();

  if (username.length < 2 || username.length > 20) {
    throw new Error('Username must be between 2 and 20 characters.');
  }

  // Generate unique recovery code and digest
  const rawRecoveryCode = generateRecoveryCode();
  const recoveryCodeDigest = hashRecoveryCode(rawRecoveryCode);
  const color = getRandomColor();

  const player = await Player.create({
    username,
    color,
    recoveryCodeDigest,
  });

  const token = signPlayerToken(player._id.toString());

  return {
    player: {
      id: player._id.toString(),
      username: player.username,
      color: player.color,
      claimedCount: 0,
    },
    token,
    rawRecoveryCode,
  };
};

export const recoverPlayer = async (rawCode: string) => {
  const code = (rawCode || '').trim();

  if (!code) {
    throw new Error('Please enter a recovery code.');
  }

  const digest = hashRecoveryCode(code);
  const player = await Player.findOne({ recoveryCodeDigest: digest });

  if (!player) {
    // Generic error to prevent account enumeration
    const error: any = new Error('Invalid recovery code. Please check and try again.');
    error.statusCode = 401;
    throw error;
  }

  const token = signPlayerToken(player._id.toString());
  const claimedCount = await Cell.countDocuments({ ownerId: player._id });

  return {
    player: {
      id: player._id.toString(),
      username: player.username,
      color: player.color,
      claimedCount,
    },
    token,
  };
};

export const rotateRecoveryCode = async (playerId: string) => {
  const newRecoveryCode = generateRecoveryCode();
  const newDigest = hashRecoveryCode(newRecoveryCode);

  const updatedPlayer = await Player.findByIdAndUpdate(
    playerId,
    { $set: { recoveryCodeDigest: newDigest } },
    { new: true }
  );

  if (!updatedPlayer) {
    const error: any = new Error('Player not found.');
    error.statusCode = 404;
    throw error;
  }

  return { newRecoveryCode };
};

export const getPlayerProfile = async (playerId: string): Promise<PlayerPublicProfile> => {
  const player = await Player.findById(playerId);

  if (!player) {
    const error: any = new Error('Player not found.');
    error.statusCode = 404;
    throw error;
  }

  const claimedCount = await Cell.countDocuments({ ownerId: player._id });

  return {
    id: player._id.toString(),
    username: player.username,
    color: player.color,
    claimedCount,
  };
};

