import { IUser } from "models/user.ts";

// src/types/request.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: Partial<IUser>;
    }
  }
}

export {};