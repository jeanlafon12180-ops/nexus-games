/**
 * Nexus Games 2.5.0 — versioned contracts for a future authenticated backend.
 * These types describe the API boundary; they do not create accounts or sync data.
 */
export const NEXUS_API_VERSION = "v1" as const;

export type NexusSyncState = "local-only" | "pending" | "synced" | "conflict" | "error";

export type NexusPlayerProfileV1 = {
  schemaVersion: 1;
  displayName: string;
  status: string;
  accent: "green" | "blue" | "violet" | "orange" | "cyan";
  updatedAt: string;
};

export type NexusSaveEnvelopeV1<T> = {
  schemaVersion: 1;
  gameId: "nexus-city" | "neon-dodge" | "creator-studio";
  updatedAt: string;
  payload: T;
};

export type NexusApiHealth = {
  service: "nexus-games";
  version: "2.5.0";
  state: "foundation-ready" | "backend-configured";
  capabilities: {
    accounts: false;
    cloudSaves: false;
    publicGallery: false;
    globalLeaderboard: false;
  };
};
