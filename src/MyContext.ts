import { Request, Response } from "express";

interface MyPayload {
  id: string;
}

export interface MyContext {
  req: Request;
  res: Response;
  payload?: MyPayload;
}
