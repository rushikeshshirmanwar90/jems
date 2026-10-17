// Minimal HTTP helper for the JEMS stats server.

export class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
  }
}

export type RawResponse = { status: number; text: string };

/** GET `url` and return the raw status and body. Network failures and timeouts become an ApiError with status 0. */
export async function send(url: string, timeoutMs: number): Promise<RawResponse> {
  const server = new URL(url).origin;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal });
    return { status: response.status, text: await response.text() };
  } catch {
    if (controller.signal.aborted) throw new ApiError(0, `The server at ${server} took too long to answer. Check your internet connection, then try again.`, 'timeout');
    throw new ApiError(0, `Can't reach the server at ${server}. Check your internet connection, then try again.`, 'network');
  } finally {
    clearTimeout(timer);
  }
}

export const errorMessage = (err: unknown) => (err instanceof Error && err.message ? err.message : 'Something went wrong. Try again.');
