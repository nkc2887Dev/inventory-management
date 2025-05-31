import { Iresponse } from "../@types";
import { IPartInput } from "../@types/part.type";
import PartModel from "../models/part.model";
import MESSAGE from "../utils/constants/msg";
import { PART_TYPE } from "../utils/constants/part";
import { handleAssembledPart, handleRawPart } from "./common";

export const createPartService = async (data: IPartInput): Promise<Iresponse> => {
  try {
    const findPart = await PartModel.findOne({ name: data.name });
    if (findPart) {
      return { flag: false, msg: MESSAGE.PART.ALREADY_EXISTS };
    }
    const result = await PartModel.create(data);
    return { flag: true, data: result };
  } catch (error: any) {
    console.error("Error - createPartService : ", error);
    return { flag: false, msg: error.message };
  }
};

export const setToInventoryService = async ( data: any, id: string ): Promise<Iresponse> => {
  try {
    const part = await PartModel.findById(id);
    if (!part) {
      return { flag: false, msg: MESSAGE.PART.NOT_FOUND };
    }

    if (part.type === PART_TYPE.RAW) {
      return await handleRawPart(data, id);
    } else {
      return await handleAssembledPart(data, part, id);
    }
  } catch (error: any) {
    console.error("Error - setToInventoryService:", error);
    return { flag: false, msg: error.message };
  }
};
