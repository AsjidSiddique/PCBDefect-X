export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface DetectionBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Detection {
  class_id: number;
  class_name: string;
  confidence: number;
  box: DetectionBox;
}

export interface PredictionResponse {
  detections: Detection[];
  num_detections: number;
  threshold_used: number;
  image_size: { width: number; height: number };
  model_input_size: { width: number; height: number };
  inference_ms: number;
  backend: string;
  active_provider: string;
}

export interface HealthResponse {
  status: "ok" | "error";
  model_loaded: boolean;
  model: string;
  dataset: string;
  classes: string[];
  active_provider?: string | null;
  detail?: string | null;
}

export async function checkHealth(): Promise<HealthResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as HealthResponse;
  } catch {
    return null;
  }
}

export async function runInference(file: File, threshold: number): Promise<PredictionResponse> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE_URL}/predict?threshold=${threshold}`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      /* ignore parse failure */
    }
    throw new Error(detail);
  }

  return (await res.json()) as PredictionResponse;
}
