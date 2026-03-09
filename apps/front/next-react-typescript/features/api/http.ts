import { API_URL } from "./config";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type QueryValue = string | number | boolean | null | undefined;

type ApiFetchOptions = {
  method?: HttpMethod;
  body?: BodyInit | Record<string, unknown> | null;
  query?: Record<string, QueryValue>;
  headers?: HeadersInit;
};

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(path, API_URL);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { method = "GET", body, query, headers } = options;

  const finalHeaders = new Headers(headers);
  let finalBody: BodyInit | undefined;

  if (body == null) {
    finalBody = undefined;
  } else if (isFormData(body)) {
    finalBody = body;
  } else if (
    typeof body === "string" ||
    body instanceof Blob ||
    body instanceof URLSearchParams
  ) {
    finalBody = body;
  } else {
    finalHeaders.set("Content-Type", "application/json");
    finalBody = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: finalHeaders,
    body: finalBody,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    const payload = isJson ? await response.json().catch(() => null) : null;

    throw {
      message:
        payload?.message ?? payload?.error ?? `HTTP error ${response.status}`,
      status: response.status,
    };
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (!isJson) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
