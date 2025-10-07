import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

type ValidationType = "body" | "params" | "query";

export interface TypedRequest<T = any> extends Request {
  validatedData?: {
    body?: any;
    params?: any;
    query?: any;
  };
}

export const validate = (
  schema: z.ZodSchema,
  type: ValidationType = "body"
) => {
  return (req: TypedRequest, res: Response, next: NextFunction) => {
    try {
      let dataToValidate;

      switch (type) {
        case "body":
          dataToValidate = req.body;
          break;
        case "params":
          dataToValidate = req.params;
          break;
        case "query":
          dataToValidate = req.query;
          break;
        default:
          dataToValidate = req.body;
      }

      const validatedData = schema.parse(dataToValidate);

      if (!req.validatedData) {
        req.validatedData = {};
      }

      req.validatedData[type] = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          message: "Dados de entrada inválidos",
          errors: errorMessages,
        });
      }

      console.error("Erro de validação:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  };
};

export const validateBody = (schema: z.ZodSchema) => validate(schema, "body");

export const validateParams = (schema: z.ZodSchema) =>
  validate(schema, "params");

export const validateQuery = (schema: z.ZodSchema) => validate(schema, "query");

export const getValidatedData = <T>(
  req: TypedRequest,
  type: ValidationType = "body"
): T => {
  return req.validatedData?.[type] as T;
};
