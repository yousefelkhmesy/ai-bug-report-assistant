import { validateBugRequest } from "../services/validationService.js";
import { buildBugReport } from "../services/openaiService.js";

export async function generateBugReport(req, res, next) {
  try {
    const validation = validateBugRequest(req.body);

    if (validation.error) {
      return res.status(validation.statusCode).json({
        error: validation.error,
      });
    }

    if (validation.warning) {
      return res.status(validation.statusCode).json({
        warning: validation.warning,
      });
    }

    const result = await buildBugReport(validation.data);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
