import { Request, Response, NextFunction } from "express";
import AppError from "utils/app-error";

const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (allowedRoles.includes(req.user.role)) {
      next()
    } else {
      throw new AppError('Usuário não autorizado.', 403)
    }
  }
}

export default authorizeRoles