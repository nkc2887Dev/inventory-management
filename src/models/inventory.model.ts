import { Schema, Document, Types } from "mongoose";
import { mongoose } from "../config/db.config";

export interface IInventory extends Document {
  part: Types.ObjectId;
  quantity: number;
}

const inventorySchema = new Schema<IInventory>(
  {
    part: { type: Schema.Types.ObjectId, ref: "Part", required: true },
    quantity: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const InventoryModel = mongoose.model<IInventory>("Inventory", inventorySchema);

export default InventoryModel;
