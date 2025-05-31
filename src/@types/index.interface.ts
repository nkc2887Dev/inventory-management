import { Response } from "express";

export interface Iresponse {
  flag: boolean;
  msg?: string;
  data?: Object;
}

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface RequiredQuantityMap {
  [partId: string]: number;
}

export interface SendResponseParams {
  res: Response;
  success: boolean;
  message?: string;
  data?: any;
  statusCode?: number;
}

