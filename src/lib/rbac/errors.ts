export class ForbiddenError extends Error {
  readonly status = 403;
  readonly code = "FORBIDDEN";
  constructor(message = "FORBIDDEN") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export function isForbidden(err: unknown): err is ForbiddenError {
  return (
    err instanceof ForbiddenError ||
    (err instanceof Error && (err as { status?: number }).status === 403)
  );
}

export function isUnauthorized(err: unknown): boolean {
  return err instanceof Error && err.message === "Unauthorized";
}
