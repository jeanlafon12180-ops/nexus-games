import { NextResponse } from "next/server";
import type { NexusApiHealth } from "@/lib/online-contract";

export const dynamic = "force-dynamic";

export function GET() {
  const health: NexusApiHealth = {
    service: "nexus-games",
    version: "2.5.0",
    state: "foundation-ready",
    capabilities: {
      accounts: false,
      cloudSaves: false,
      publicGallery: false,
      globalLeaderboard: false
    }
  };

  return NextResponse.json(health, {
    headers: { "Cache-Control": "no-store" }
  });
}
