import type { RichCellOutput } from "./types";

interface JupyterMessageHeader {
  msg_id: string;
  msg_type: string;
  session: string;
  username?: string;
  version?: string;
}

interface JupyterWireMessage {
  header: JupyterMessageHeader;
  parent_header?: Partial<JupyterMessageHeader>;
  metadata?: Record<string, unknown>;
  content?: Record<string, unknown>;
}

/**
 * Jembatan WebSocket ke Jupyter Kernel Gateway / JupyterLab lokal atau GPU Tunnel
 * (Protokol Jupyter Messaging v5). Memungkinkan eksekusi PyTorch/CUDA/Native C
 * langsung dari UI Velqora Lab ketika Browser WASM tidak mencukupi.
 */
export class RemoteJupyterBridge {
  private ws: WebSocket | null = null;
  private baseUrl = "";
  private token = "";
  private kernelId = "";
  private sessionId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `velqora_${Date.now()}`;
  private pending = new Map<
    string,
    {
      outputs: RichCellOutput[];
      resolve: (res: { success: boolean; outputs: RichCellOutput[]; executionMs: number }) => void;
      reject: (err: Error) => void;
      startMs: number;
      timer: ReturnType<typeof setTimeout>;
    }
  >();

  get isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  async connect(
    httpOrWsUrl: string,
    token = ""
  ): Promise<{ kernelId: string; kernelName: string }> {
    this.disconnect();
    const cleaned = httpOrWsUrl.trim().replace(/\/+$/, "");
    if (!cleaned) {
      throw new Error("URL Jupyter Server / Kernel Gateway wajib diisi.");
    }

    this.token = token.trim();
    const httpBase = cleaned
      .replace(/^ws:\/\//i, "http://")
      .replace(/^wss:\/\//i, "https://");
    this.baseUrl = httpBase;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.token) {
      headers["Authorization"] = `token ${this.token}`;
    }

    // Create kernel via Jupyter REST API
    const createRes = await fetch(`${httpBase}/api/kernels`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name: "python3" }),
    });
    if (!createRes.ok) {
      throw new Error(
        `Gagal menghubungi Jupyter Server (${createRes.status} ${createRes.statusText}). Pastikan CORS diizinkan (--ServerApp.allow_origin='*').`
      );
    }

    const kernelInfo = (await createRes.json()) as { id: string; name?: string };
    this.kernelId = kernelInfo.id;

    const wsBase = httpBase
      .replace(/^http:\/\//i, "ws://")
      .replace(/^https:\/\//i, "wss://");
    const wsUrl = `${wsBase}/api/kernels/${encodeURIComponent(this.kernelId)}/channels${
      this.token ? `?token=${encodeURIComponent(this.token)}` : ""
    }`;

    await new Promise<void>((resolve, reject) => {
      const socket = new WebSocket(wsUrl);
      const timer = setTimeout(() => {
        socket.close();
        reject(new Error("Timeout koneksi WebSocket Jupyter Kernel (10 detik)."));
      }, 10000);

      socket.onopen = () => {
        clearTimeout(timer);
        this.ws = socket;
        resolve();
      };
      socket.onerror = () => {
        clearTimeout(timer);
        reject(
          new Error(
            "WebSocket gagal terhubung. Periksa CORS/Mixed-Content HTTPS->HTTP atau token Jupyter."
          )
        );
      };
      socket.onmessage = (ev) => this.handleMessage(ev);
      socket.onclose = () => {
        this.ws = null;
      };
    });

    return {
      kernelId: kernelInfo.id,
      kernelName: kernelInfo.name || "python3",
    };
  }

  private handleMessage(event: MessageEvent) {
    try {
      const msg = JSON.parse(String(event.data)) as JupyterWireMessage;
      const parentId = msg.parent_header?.msg_id;
      if (!parentId || !this.pending.has(parentId)) return;

      const entry = this.pending.get(parentId)!;
      const msgType = msg.header?.msg_type;
      const content = msg.content || {};

      if (msgType === "stream") {
        entry.outputs.push({
          kind: "stream",
          name: content.name === "stderr" ? "stderr" : "stdout",
          text: String(content.text || ""),
        });
      } else if (msgType === "execute_result" || msgType === "display_data") {
        const data = (content.data || {}) as Record<string, string>;
        if (data["image/png"]) {
          entry.outputs.push({
            kind: "image",
            mimeType: "image/png",
            data: String(data["image/png"]),
          });
        } else if (data["image/svg+xml"]) {
          entry.outputs.push({
            kind: "image",
            mimeType: "image/svg+xml",
            data: String(data["image/svg+xml"]),
          });
        } else if (data["text/html"]) {
          entry.outputs.push({ kind: "html", html: String(data["text/html"]) });
        } else if (data["text/plain"]) {
          entry.outputs.push({ kind: "text", text: String(data["text/plain"]) });
        }
      } else if (msgType === "error") {
        entry.outputs.push({
          kind: "error",
          ename: String(content.ename || "RemoteError"),
          evalue: String(content.evalue || "Error eksekusi di kernel remote"),
          traceback: Array.isArray(content.traceback)
            ? content.traceback.map((t) =>
                String(t).replace(/\u001b\[[0-9;]*m/g, "")
              )
            : [],
        });
      } else if (msgType === "execute_reply") {
        clearTimeout(entry.timer);
        this.pending.delete(parentId);
        const ok = content.status !== "error";
        entry.resolve({
          success: ok,
          outputs:
            entry.outputs.length > 0
              ? entry.outputs
              : [{ kind: "stream", name: "stdout", text: "(Selesai di Remote Kernel)" }],
          executionMs: Math.round(performance.now() - entry.startMs),
        });
      }
    } catch {
      // Ignore malformed wire frames
    }
  }

  async execute(
    code: string,
    timeoutMs = 120_000
  ): Promise<{ success: boolean; outputs: RichCellOutput[]; executionMs: number }> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("Remote Jupyter Kernel belum terhubung.");
    }

    const msgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const payload = {
      header: {
        msg_id: msgId,
        username: "velqora",
        session: this.sessionId,
        msg_type: "execute_request",
        version: "5.3",
      },
      parent_header: {},
      metadata: {},
      channel: "shell",
      content: {
        code,
        silent: false,
        store_history: true,
        user_expressions: {},
        allow_stdin: false,
        stop_on_error: true,
      },
    };

    return new Promise((resolve, reject) => {
      const startMs = performance.now();
      const timer = setTimeout(() => {
        this.pending.delete(msgId);
        reject(new Error("Remote kernel execution timeout."));
      }, timeoutMs);

      this.pending.set(msgId, {
        outputs: [],
        resolve,
        reject,
        startMs,
        timer,
      });

      this.ws!.send(JSON.stringify(payload));
    });
  }

  async interrupt(): Promise<void> {
    if (!this.baseUrl || !this.kernelId) return;
    const headers: Record<string, string> = {};
    if (this.token) headers["Authorization"] = `token ${this.token}`;
    await fetch(
      `${this.baseUrl}/api/kernels/${encodeURIComponent(this.kernelId)}/interrupt`,
      { method: "POST", headers }
    ).catch(() => {});
  }

  disconnect() {
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // Ignore close errors
      }
      this.ws = null;
    }
    this.pending.forEach((p) => {
      clearTimeout(p.timer);
      p.reject(new Error("Koneksi remote kernel ditutup."));
    });
    this.pending.clear();
  }
}
