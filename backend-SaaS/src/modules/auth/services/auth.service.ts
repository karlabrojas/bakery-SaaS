import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { supabase } from "../../../config/supabase";
import { hashToken } from "../../../utils/hash";
import { TokenService } from "./token.service";
import { RegisterDto } from "../validations/register";
import { LoginUserDto } from "../validations/token.servide";
import { UserEntity } from "../entities/user.entity";
import { SessionEntity } from "../entities/session.entity";
import { JwtPayload } from "../../../types/jwt-payload";

export class AuthService {
  private tokenService = new TokenService();

  /** Registro */

  async register(
    data: RegisterDto,
    metadata: {
      ip: string;
      userAgent: string;
    },
  ) {
    const existingUser = await supabase
      .from("users")
      .select("id")
      .eq("email", data.user.email)
      .maybeSingle();

    if (existingUser.data) {
      throw new Error("El correo ya está registrado");
    }

    const bakeryResult = await supabase
      .from("bakeries")
      .insert({
        name: data.bakery.name,
        address: data.bakery.address,
        phone: data.bakery.phone,
        email: data.bakery.email,
      })
      .select()
      .single();

    if (bakeryResult.error || !bakeryResult.data) {
      throw new Error("No se pudo crear la panadería");
    }

    const bakery = bakeryResult.data;

    const passwordHash = await bcrypt.hash(data.user.password, 12);

    const userResult = await supabase
      .from("users")
      .insert({
        bakery_id: bakery.id,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        email: data.user.email,
        password_hash: passwordHash,
        role: "ADMIN",
        is_active: true,
      })
      .select()
      .single();

    if (userResult.error || !userResult.data) {
      throw new Error("No se pudo crear el usuario");
    }

    const user = userResult.data as UserEntity;

    const sessionId = randomUUID();

    const payload: JwtPayload = {
      userId: user.id,
      bakeryId: bakery.id,
      role: user.role,
      sessionId,
    };

    const { accessToken, refreshToken, refreshHash } =
      this.generateTokens(payload);

    await this.createSession({
      id: sessionId,
      user_id: user.id,
      refresh_token_hash: refreshHash,
      is_revoked: false,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ip_address: metadata.ip,
      user_agent: metadata.userAgent,
    });

    return {
      bakery,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  /** Inicio de sesión */

  async login(
    data: LoginUserDto,
    metadata: {
      ip: string;
      userAgent: string;
    },
  ) {
    const { email, password } = data;

    const response = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    const user = response.data as UserEntity | null;

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      throw new Error("Credenciales inválidas");
    }

    if (!user.is_active) {
      throw new Error("Usuario inactivo");
    }

    const sessionId = randomUUID();

    const payload: JwtPayload = {
      userId: user.id,
      bakeryId: user.bakery_id,
      role: user.role,
      sessionId,
    };

    const { accessToken, refreshToken, refreshHash } =
      this.generateTokens(payload);

    await this.createSession({
      id: sessionId,
      user_id: user.id,
      refresh_token_hash: refreshHash,
      is_revoked: false,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ip_address: metadata.ip,
      user_agent: metadata.userAgent,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /** Refresh token */

  async refresh(refreshToken: string) {
    const payload = this.tokenService.verifyRefreshToken(refreshToken);

    const response = await supabase
      .from("sessions")
      .select("*")
      .eq("id", payload.sessionId)
      .single();

    const session = response.data as SessionEntity | null;

    if (!session) {
      throw new Error("Session not found");
    }

    if (session.is_revoked) {
      throw new Error("Session revoked");
    }

    const incomingHash = hashToken(refreshToken);

    if (session.refresh_token_hash !== incomingHash) {
      await supabase
        .from("sessions")
        .update({
          is_revoked: true,
        })
        .eq("id", payload.sessionId);

      throw new Error("Refresh Token Reuse Detected");
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      refreshHash,
    } = this.generateTokens(payload);

    await supabase
      .from("sessions")
      .update({
        refresh_token_hash: refreshHash,
      })
      .eq("id", payload.sessionId);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /** Cierre de sesión */

  async logout(userId: string, sessionId: string) {
    await supabase
      .from("sessions")
      .update({
        is_revoked: true,
      })
      .eq("id", sessionId)
      .eq("user_id", userId);
  }

  private generateTokens(payload: JwtPayload) {
    const accessToken = this.tokenService.generateAccessToken(payload);

    const refreshToken = this.tokenService.generateRefreshToken(payload);

    const refreshHash = hashToken(refreshToken);

    return {
      accessToken,
      refreshToken,
      refreshHash,
    };
  }

  private async createSession(session: SessionEntity) {
    const { error } = await supabase.from("sessions").insert(session);

    if (error) {
      throw new Error("No se pudo crear la sesión");
    }
  }
}
