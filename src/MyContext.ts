import { Request, Response } from "express";

interface MyPayload {
  id: String;
  firstName: String;
  lastName: String;
  province: String;
  location: String;
  email: String;
  username: String;
  phoneNumber: String;
  dateOfBirth: String;
}

export interface MyContext {
  req: Request;
  res: Response;
  payload?: MyPayload;
}
