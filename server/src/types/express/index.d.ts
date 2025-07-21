import type { TypeUser } from "../../../../client/src/types/TypeFiles";
declare global {
  namespace Express {
    interface Request {
      user?: TypeUser;
      userId?: number;
    }
  }
}
