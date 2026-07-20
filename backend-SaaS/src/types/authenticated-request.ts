import { Request } from "express";
import * as core from "express-serve-static-core";
import { JwtPayload } from "./jwt-payload";

// Al extender con los tipos exactos de Express, se acopla perfectamente al enrutador nativo
export interface AuthenticatedRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user: JwtPayload;
}
