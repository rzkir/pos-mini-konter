interface Permission {
  id: number;
  name: string;
  description: string;
  is_granted: boolean;
  created_at: string;
  updated_at: string;
}

interface PermissionRequest {
  permission_name: string;
  reason?: string;
}
