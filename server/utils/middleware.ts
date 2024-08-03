import { Request, Response, NextFunction } from "express";

const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error.message.includes("E11000 duplicate key error")) {
    return response.status(400).json({ error: "username already taken" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  return next(error);
};

export default { errorHandler };
