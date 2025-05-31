import type { Request, Response } from "express"
import type { IApiResponse } from "../@types"

export const notFound = (req: Request, res: Response): void => {
  const response: IApiResponse = {
    success: false,
    message: `Route ${req.originalUrl} not found`,
  }

  res.status(404).json(response)
}
