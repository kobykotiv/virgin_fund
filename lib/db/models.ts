// Removed mongoose dependency — provide no-op connection helpers so other modules calling them won't fail

export async function connectToDatabase() {
  // No-op: MongoDB/mongoose removed from this project.
  // Keep for compatibility with existing callers.
  return { connection: null };
}

export async function disconnectFromDatabase() {
  // No-op
  return;
}
