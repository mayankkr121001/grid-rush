import { Cell } from '../models/Cell.model.js';
import { IPlayer } from '../models/Player.model.js';

const TOTAL_CELLS = 400;
const GRID_SIZE = 20;

// Socket.IO instance can be optionally registered for broadcasts
let socketEmitter: ((event: string, payload: any) => void) | null = null;

export const setSocketEmitter = (emitter: (event: string, payload: any) => void) => {
  socketEmitter = emitter;
};

export const seedBoard = async (): Promise<void> => {
  try {
    const existingCount = await Cell.countDocuments();

    if (existingCount === TOTAL_CELLS) {
      console.log(`✅ Board already fully seeded (${TOTAL_CELLS} cells present).`);
      return;
    }

    const existingCells = await Cell.find({}, { cellId: 1 }).lean();
    const existingIds = new Set(existingCells.map((c) => c.cellId));

    const missingCells = [];
    for (let id = 0; id < TOTAL_CELLS; id++) {
      if (!existingIds.has(id)) {
        missingCells.push({
          cellId: id,
          row: Math.floor(id / GRID_SIZE),
          column: id % GRID_SIZE,
          ownerId: null,
          claimedAt: null,
        });
      }
    }

    if (missingCells.length > 0) {
      await Cell.insertMany(missingCells, { ordered: false });
      console.log(`🌱 Idempotently seeded ${missingCells.length} missing cells. Total: ${TOTAL_CELLS}.`);
    }
  } catch (error) {
    console.error('❌ Error during board seeding:', error);
  }
};

export const getBoard = async () => {
  const cells = await Cell.find({})
    .sort({ cellId: 1 })
    .populate('ownerId', 'username color')
    .lean();

  const claimedCount = cells.filter((c) => c.ownerId !== null).length;

  const formattedCells = cells.map((cell) => {
    const owner = cell.ownerId as any;
    return {
      cellId: cell.cellId,
      row: cell.row,
      column: cell.column,
      claimedAt: cell.claimedAt,
      owner: owner
        ? {
            id: owner._id.toString(),
            username: owner.username,
            color: owner.color,
          }
        : null,
    };
  });

  return {
    cells: formattedCells,
    stats: {
      total: TOTAL_CELLS,
      claimed: claimedCount,
      available: TOTAL_CELLS - claimedCount,
    },
  };
};

export const claimCell = async (cellId: number, player: IPlayer) => {
  if (typeof cellId !== 'number' || cellId < 0 || cellId >= TOTAL_CELLS || !Number.isInteger(cellId)) {
    const error: any = new Error(`Invalid cellId: must be an integer between 0 and ${TOTAL_CELLS - 1}.`);
    error.statusCode = 400;
    throw error;
  }

  // ATOMIC CONDITIONAL CLAIM
  // Only succeeds if ownerId is currently null
  const updatedCell = await Cell.findOneAndUpdate(
    { cellId, ownerId: null },
    { $set: { ownerId: player._id, claimedAt: new Date() } },
    { new: true }
  ).populate('ownerId', 'username color');

  if (!updatedCell) {
    // Check if cell exists
    const existing = await Cell.findOne({ cellId });
    if (!existing) {
      const error: any = new Error(`Cell ${cellId} does not exist.`);
      error.statusCode = 404;
      throw error;
    }

    // Cell exists but was already claimed by another player -> 409 Conflict
    const error: any = new Error(`Cell ${cellId} was already claimed by another player.`);
    error.statusCode = 409;
    throw error;
  }

  const capturePayload = {
    cellId: updatedCell.cellId,
    owner: {
      id: player._id.toString(),
      username: player.username,
      color: player.color,
    },
    claimedAt: updatedCell.claimedAt?.toISOString(),
  };

  // Broadcast to all connected clients via Socket.IO if available
  if (socketEmitter) {
    socketEmitter('board:cell-captured', capturePayload);
  }

  return {
    success: true,
    cell: capturePayload,
  };
};
