import { ZodError } from "zod";
import ApiResponse from "../utils/ApiResponse.js";

const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(
          new ApiResponse(
            400,
            {
              errors: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
              })),
            },
            "Validation failed"
          )
        );
      }

      next(error);
    }
  };
};

export default validate;