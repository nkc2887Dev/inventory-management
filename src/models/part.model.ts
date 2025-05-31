import { Schema, Types } from "mongoose";
import { mongoose } from "../config/db.config";
import { PART_TYPE } from "../constants/part.constant";

export type PartType = "RAW" | "ASSEMBLED";

export interface IPart extends Document {
  name: string;
  type: PartType;
  quantity: number;
  parts?: {
    id: Types.ObjectId;
    quantity: number;
  }[];
}

const partSchema = new Schema<IPart>({
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(PART_TYPE), required: true },
  quantity: { type: Number, required: true, default: 0 },
  parts: [
    {
      id: { type: Schema.Types.ObjectId, ref: "Part", required: true },
      quantity: { type: Number, required: true },
    },
  ],
}, { timestamps: true });

const PartModel = mongoose.model<IPart>("Part", partSchema);

export default PartModel;
