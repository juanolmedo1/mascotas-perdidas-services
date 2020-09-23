import { Request, Response } from "express";

interface MyPayload {
  id: String;
}

export interface MyContext {
  req: Request;
  res: Response;
  payload?: MyPayload;
}
