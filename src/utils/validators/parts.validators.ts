import joi from "joi";
import { PART_TYPE } from "../constants/part";

export const createPart = joi.object({
  name: joi.string().required(),
  type: joi.string().valid(...Object.values(PART_TYPE)).required(),
  quantity: joi.number().min(0).default(0),
  parts: joi.array().items(
    joi.object({
      id: joi.string().hex().length(24).required(),
      quantity: joi.number().min(1).required(),
    })
  ).optional(),
}).unknown(false);

export const addInventory = joi.object({
  quantity: joi.number().min(1).required(),
}).unknown(false);
