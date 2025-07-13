import axios from "axios";

interface MaintenanceResponse {
  isMaintenance: boolean;
}

/**
 * Get maintenance status from server
 */
export async function getMaintenanceStatus(): Promise<boolean> {
  const res = await axios.get<MaintenanceResponse>("/api/maintenance");

  return res.data.isMaintenance;
}

/**
 * Set maintenance status (true = ON, false = OFF)
 */
export async function setMaintenanceStatus(status: boolean): Promise<void> {
  await axios.post("/api/maintenance", { isMaintenance: status });
}
