import { IUser } from "models/user";

// src/types/request.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: Partial<IUser>;
    }
  }
}

export {};