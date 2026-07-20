import { Response } from "express";
import { BaseController } from "../../../controllers/BaseController";
import { AuthenticatedRequest } from "../../../types/authenticated-request";
import { PaymentService } from "../services/paymentService";

export class PaymentController extends BaseController {
  static async registerAdvance(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const id = this.getParam(req, "id");
      const { bakeryId } = this.getAuthData(req);

      const payment = await PaymentService.registerAdvance(
        id,
        req.body,
        bakeryId,
      );

      this.created(res, payment);
    } catch (error) {
      this.error(res, error);
    }
  }

  static async getAdvances(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const id = this.getParam(req, "id");
      const { bakeryId } = this.getAuthData(req);

      const payments = await PaymentService.getAdvances(id, bakeryId);

      this.ok(res, payments);
    } catch (error) {
      this.error(res, error);
    }
  }

  static async summary(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const id = this.getParam(req, "id");
      const { bakeryId } = this.getAuthData(req);

      const summary = await PaymentService.getPaymentSummary(id, bakeryId);

      this.ok(res, summary);
    } catch (error) {
      this.error(res, error);
    }
  }

  static async payRemaining(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const id = this.getParam(req, "id");
      const { bakeryId } = this.getAuthData(req);

      const payment = await PaymentService.payRemaining(id, req.body, bakeryId);

      this.ok(res, payment);
    } catch (error) {
      this.error(res, error);
    }
  }
}
