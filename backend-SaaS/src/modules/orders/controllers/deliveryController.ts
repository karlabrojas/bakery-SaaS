import { Response } from "express";
import { BaseController } from "../../../controllers/BaseController";
import { AuthenticatedRequest } from "../../../types/authenticated-request";
import { DeliveryService } from "../services/deliveryService";

export class DeliveryController extends BaseController {
  static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = this.getParam(req, "id");
      const { bakeryId } = this.getAuthData(req);

      const delivery = await DeliveryService.createDelivery(
        id,
        req.body,
        bakeryId,
      );

      this.created(res, delivery);
    } catch (error) {
      this.error(res, error);
    }
  }

  static async get(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = this.getParam(req, "id");
      const { bakeryId } = this.getAuthData(req);

      const delivery = await DeliveryService.getDelivery(id, bakeryId);

      this.ok(res, delivery);
    } catch (error) {
      this.error(res, error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = this.getParam(req, "id");
      const { bakeryId } = this.getAuthData(req);

      const delivery = await DeliveryService.updateDelivery(
        id,
        req.body,
        bakeryId,
      );

      this.ok(res, delivery);
    } catch (error) {
      this.error(res, error);
    }
  }

  static async changeStatus(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const id = this.getParam(req, "id");
      const { bakeryId } = this.getAuthData(req);

      const delivery = await DeliveryService.changeDeliveryStatus(
        id,
        req.body.status,
        bakeryId,
      );

      this.ok(res, delivery);
    } catch (error) {
      this.error(res, error);
    }
  }

  static async complete(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const id = this.getParam(req, "id");
      const { bakeryId, userId } = this.getAuthData(req);

      const result = await DeliveryService.completeDelivery(
        id,
        bakeryId,
        userId,
      );

      this.ok(res, result);
    } catch (error) {
      this.error(res, error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = this.getParam(req, "id");
      const { bakeryId } = this.getAuthData(req);

      const result = await DeliveryService.deleteDelivery(id, bakeryId);

      this.ok(res, result);
    } catch (error) {
      this.error(res, error);
    }
  }
}
