import { supabase } from "../../../config/supabase";
import { StorageService } from "../../storage/Storage.service";
import { UpdateBakeryDto } from "../dto/update-bakery.dto";
import { UpdateUserDto } from "../dto/update-profile.dto";
import { ProfileResponse } from "../types/profile.type";

export class ProfileService {
  static async getProfile(userId: string): Promise<ProfileResponse> {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select(
        `
        id,
        first_name,
        last_name,
        email,
        role,
        is_active,
        bakery_id
      `,
      )
      .eq("id", userId)
      .single();

    if (userError || !user) {
      throw new Error("Usuario no encontrado.");
    }

    const { data: bakery, error: bakeryError } = await supabase
      .from("bakeries")
      .select("*")
      .eq("id", user.bakery_id)
      .single();

    if (bakeryError || !bakery) {
      throw new Error("Panadería no encontrada.");
    }

    return {
      user,
      bakery: {
        ...bakery,
        logoUrl: StorageService.getPublicUrl(
          StorageService.BUCKETS.PROFILES,
          bakery.logo_path,
        ),
      },
    };
  }

  static async updateUser(userId: string, body: UpdateUserDto) {
    const { data, error } = await supabase
      .from("users")
      .update({
        first_name: body.first_name,
        last_name: body.last_name,
      })
      .eq("id", userId)
      .select(
        `
        id,
        first_name,
        last_name,
        email,
        role,
        is_active,
        bakery_id
      `,
      )
      .single();

    if (error || !data) {
      throw new Error("No fue posible actualizar el usuario.");
    }

    return data;
  }

  static async updateBakery(userId: string, body: UpdateBakeryDto) {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("bakery_id")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      throw new Error("Usuario no encontrado.");
    }

    const { data, error } = await supabase
      .from("bakeries")
      .update({
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.bakery_id)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error("No fue posible actualizar la panadería.");
    }

    return {
      ...data,
      logoUrl: StorageService.getPublicUrl(
        StorageService.BUCKETS.PROFILES,
        data.logo_path,
      ),
    };
  }

  static async updateLogo(userId: string, file: Express.Multer.File) {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("bakery_id")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      throw new Error("Usuario no encontrado.");
    }

    const { data: bakery, error: bakeryError } = await supabase
      .from("bakeries")
      .select("logo_path")
      .eq("id", user.bakery_id)
      .single();

    if (bakeryError || !bakery) {
      throw new Error("Panadería no encontrada.");
    }

    const logoPath = await StorageService.replaceImage(
      StorageService.BUCKETS.PROFILES,
      StorageService.FOLDERS.PROFILES,
      bakery.logo_path,
      file,
    );

    const { data, error } = await supabase
      .from("bakeries")
      .update({
        logo_path: logoPath,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.bakery_id)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error("No fue posible actualizar el logo.");
    }

    return {
      ...data,
      logoUrl: StorageService.getPublicUrl(
        StorageService.BUCKETS.PROFILES,
        data.logo_path,
      ),
    };
  }
}
