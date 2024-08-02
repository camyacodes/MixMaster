import { Request, Response, NextFunction } from "express";

const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (error.message.includes("E11000 duplicate key error")) {
    return response.status(400).json({ error: "username already taken" });
  }

  return;
};

export default { errorHandler };
