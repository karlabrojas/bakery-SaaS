import { randomUUID } from "crypto";
import { supabase } from "../../config/supabase";

export class StorageService {
  static readonly BUCKETS = {
    PRODUCTS: "product-images",
    PROFILES: "profile-images",
  };

  static readonly FOLDERS = {
    PRODUCTS: "products",
    PROFILES: "profile",
  };

  static async uploadImage(
    file: Express.Multer.File,
    bucket: string,
    folder: string,
  ): Promise<string> {
    const extension = file.originalname.split(".").pop();

    const fileName = `${randomUUID()}.${extension}`;

    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new Error(`Error al subir la imagen: ${error.message}`);
    }

    return filePath;
  }

  static async deleteImage(bucket: string, path: string | null): Promise<void> {
    if (!path) return;

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw new Error(`Error al eliminar la imagen: ${error.message}`);
    }
  }

  static getPublicUrl(bucket: string, path: string | null): string | null {
    if (!path) return null;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return data.publicUrl;
  }

  static async replaceImage(
    bucket: string,
    folder: string,
    oldPath: string | null,
    file: Express.Multer.File,
  ): Promise<string> {
    if (oldPath) {
      await this.deleteImage(bucket, oldPath);
    }

    return this.uploadImage(file, bucket, folder);
  }
}
