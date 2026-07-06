import { randomUUID } from "crypto";
import { supabase } from "../../config/supabase";

export class StorageService {
  private static readonly BUCKET = "product-images";
  private static readonly FOLDER = "products";

  /**
   * Sube una imagen al bucket y devuelve la ruta almacenada.
   * Ejemplo:
   * products/8d8b7b0b-9f5e-4d92-a1d6-8f9b3f93a1f7.png
   */
  static async uploadProductImage(file: Express.Multer.File): Promise<string> {
    const extension = file.originalname.split(".").pop();

    const fileName = `${randomUUID()}.${extension}`;

    const filePath = `${this.FOLDER}/${fileName}`;

    const { error } = await supabase.storage
      .from(this.BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new Error(`Error al subir la imagen: ${error.message}`);
    }

    return filePath;
  }

  /**
   * Elimina una imagen del bucket.
   */
  static async deleteImage(path: string | null): Promise<void> {
    if (!path) return;

    const { error } = await supabase.storage.from(this.BUCKET).remove([path]);

    if (error) {
      throw new Error(`Error al eliminar la imagen: ${error.message}`);
    }
  }

  /**
   * Obtiene la URL pública de una imagen.
   */
  static getPublicUrl(path: string | null): string | null {
    if (!path) return null;

    const { data } = supabase.storage.from(this.BUCKET).getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Reemplaza una imagen.
   * Elimina la anterior y sube la nueva.
   * Devuelve el nuevo path.
   */
  static async replaceImage(
    oldPath: string | null,
    file: Express.Multer.File,
  ): Promise<string> {
    if (oldPath) {
      await this.deleteImage(oldPath);
    }

    return await this.uploadProductImage(file);
  }
}
