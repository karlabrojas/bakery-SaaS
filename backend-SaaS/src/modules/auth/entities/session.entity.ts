export interface SessionEntity {
  id: string;

  user_id: string;

  refresh_token_hash: string;

  is_revoked: boolean;

  device?: string;

  ip_address?: string;

  user_agent?: string;

  expires_at: Date;
}
