import type { Request, Response } from "express";
import { createPartService, setToInventoryService } from "../services/parts.service";
import { sendResponse } from "../utils/sendResponse";
import MESSAGE from "../constants/msg.constant";

export const createPartController = async ( req: Request, res: Response ): Promise<void> => {
  const result = await createPartService(req.body);
  if (!result?.flag) {
    return sendResponse({
      res,
      success: false,
      message: result?.msg,
      statusCode: 500,
    });
  }
  return sendResponse({
    res,
    success: true,
    message: MESSAGE.PART.CREATE,
    data: result.data,
  });
};

export const setToInventoryController = async ( req: Request, res: Response ): Promise<void> => {
  const result = await setToInventoryService(req.body, req.params.id);
  if (!result?.flag) {
    return sendResponse({
      res,
      success: false,
      message: result?.msg,
      statusCode: 500,
    });
  }
  return sendResponse({
    res,
    success: true,
    message: result?.msg,
    data: result.data,
  });
};
