export class SaleService {
  static async getAll() {
    return [];
  }

  static async create(data: any) {
    return {
      message: "Venta registrada",
      data,
    };
  }
}