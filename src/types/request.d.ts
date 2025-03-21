// src/types/request.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; name: string; email: string };
    }
  }
}

export {};