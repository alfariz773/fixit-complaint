const API_URL = "http://localhost:8000/api";

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };


  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  const contentType = res.headers.get("content-type");
  const data =
    contentType && contentType.includes("application/json")
      ? await res.json()
      : null;

  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return data;
}
