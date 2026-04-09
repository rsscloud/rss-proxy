export interface StatusTracker {
  lastPingAt: Date | null;
}

export function createStatusTracker(): StatusTracker {
  return { lastPingAt: null };
}
