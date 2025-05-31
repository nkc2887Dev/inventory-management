import { Iresponse, RequiredQuantityMap } from "../@types/index.interface";
import { IAddInventoryInput } from "../@types/inventory.interface";
import InventoryModel from "../models/inventory.model";
import PartModel, { IPart } from "../models/part.model";
import MESSAGE from "../constants/message.constant";

export const handleRawPart = async (
  data: IAddInventoryInput,
  id: string
): Promise<Iresponse> => {
  try {
    const existingInventory = await InventoryModel.findOne({ part: id });

    if (existingInventory) {
      existingInventory.quantity += data.quantity || 0;
      await existingInventory.save();

      return {
        flag: true,
        data: existingInventory,
        msg: MESSAGE.INVENTORY.UPDATE,
      };
    }

    const newInventory = await InventoryModel.create({
      part: id,
      quantity: data.quantity || 0,
    });
    return { flag: true, data: newInventory, msg: MESSAGE.INVENTORY.CREATE };
  } catch (error: any) {
    console.error("Error - handleRawPart:", error);
    return { flag: false, msg: error.message };
  }
};

export const handleAssembledPart = async (
  data: IAddInventoryInput,
  part: IPart,
  id: string
): Promise<Iresponse> => {
  try {
    const requiredQuantities: RequiredQuantityMap = {};
    await computeRequiredQuantities(id, data.quantity, requiredQuantities);

    const rawPartIds = Object.keys(requiredQuantities);
    if (!rawPartIds.length) {
      return { flag: false, msg: MESSAGE.PART.NOT_FOUND };
    }

    const inventories = await InventoryModel.find({
      part: { $in: rawPartIds },
    });
    const inventoryMap = new Map<string, number>();
    inventories.forEach((inv) =>
      inventoryMap.set(inv.part.toString(), inv.quantity)
    );

    const allParts = await PartModel.find({ _id: { $in: rawPartIds } });
    const partNameMap = new Map<string, string>();
    allParts.forEach((p) => partNameMap.set(p._id.toString(), p.name));

    const insufficient: string[] = [];
    for (const partId of rawPartIds) {
      const requiredQty = requiredQuantities[partId];
      const available = inventoryMap.get(partId.toString()) || 0;

      if (available < requiredQty) {
        const partName = partNameMap.get(partId.toString()) || partId;
        insufficient.push(`Insufficient quantity - ${partName || partId}`);
      }
    }

    if (insufficient.length) {
      return { flag: false, msg: insufficient.join(", ") };
    }

    // Execute transaction
    const session = await PartModel.startSession();
    session.startTransaction();

    try {
      for (const partId of rawPartIds) {
        const requiredQty = requiredQuantities[partId];
        const result = await InventoryModel.updateOne(
          { part: partId },
          { $inc: { quantity: -requiredQty } },
          { session }
        );

        if (result.matchedCount === 0) {
          throw new Error(
            `Raw material ${partNameMap.get(partId)} not found in inventory`
          );
        }
      }

      await InventoryModel.findOneAndUpdate(
        { part: id },
        { $inc: { quantity: data.quantity } },
        { upsert: true, new: true, session }
      );

      await session.commitTransaction();
      session.endSession();

      return { flag: true, data: inventories, msg: MESSAGE.INVENTORY.CREATE };
    } catch (err: any) {
      await session.abortTransaction();
      session.endSession();
      return { flag: false, msg: err.message };
    }
  } catch (error: any) {
    console.error("Error - handleAssembledPart:", error);
    return { flag: false, msg: error.message };
  }
};

async function computeRequiredQuantities(
  partId: string,
  multiplier: number,
  map: RequiredQuantityMap,
  depth: number = 0
): Promise<void> {
  const indent = "  ".repeat(depth);

  const part = await PartModel.findById(partId).lean();
  if (!part) {
    return;
  }

  const subParts = part.parts || [];
  if (!subParts.length) {
    map[partId] = (map[partId] || 0) + multiplier;
    return;
  }

  for (const sub of subParts) {
    await computeRequiredQuantities(
      sub.id.toString(),
      sub.quantity * multiplier,
      map,
      depth + 1
    );
  }
}
