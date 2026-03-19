/// <reference types="node" />

// Published snapshot storage — both POST (publish) and GET (read) live in the
// SAME file so they share the same Vercel Lambda instance and therefore the
// same in-memory global state.

interface SnapshotData {
  class: { id: string; name: string; monitorCode: string };
  students: { id: string; name: string }[];
  scores: Record<string, Record<string, number[]>>;
  updatedAt: string;
}

declare global {
  var __publishedSnapshots: Map<string, SnapshotData> | undefined;
}

function getSnapshotsMap(): Map<string, SnapshotData> {
  if (!global.__publishedSnapshots) {
    global.__publishedSnapshots = new Map<string, SnapshotData>();
  }
  return global.__publishedSnapshots;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export default async function handler(req: any, res: any) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Extract code from dynamic route param or URL
    let code: string | null = null;
    if (req.query?.code) {
      code = String(req.query.code);
    } else if (req.url) {
      const parts = req.url.split("/").filter(Boolean);
      const idx = parts.indexOf("published-snapshot");
      if (idx >= 0 && idx < parts.length - 1) {
        code = parts[idx + 1].split("?")[0];
      }
    }

    if (!code) {
      return res.status(400).json({ message: "Missing code parameter" });
    }

    const key = normalize(code);
    const snapshots = getSnapshotsMap();

    // ---- POST: teacher publishes a snapshot ----
    if (req.method === "POST") {
      let body = req.body;
      if (typeof body === "string") {
        try { body = JSON.parse(body); } catch { return res.status(400).json({ message: "Invalid JSON" }); }
      }

      if (!body || !body.class || !body.students) {
        return res.status(400).json({ message: "Missing required fields (class, students)" });
      }

      const snapshot: SnapshotData = {
        class: {
          id: body.class.id || body.classId || "",
          name: body.class.name || "",
          monitorCode: key,
        },
        students: Array.isArray(body.students) ? body.students : [],
        scores: body.scores || {},
        updatedAt: new Date().toISOString(),
      };

      snapshots.set(key, snapshot);
      console.log(`[published-snapshot] Published snapshot for "${key}" — ${snapshot.students.length} students, scores for ${Object.keys(snapshot.scores).length} students`);

      return res.status(200).json({ success: true, monitorCode: key });
    }

    // ---- GET: parent reads a snapshot ----
    if (req.method === "GET") {
      const snapshot = snapshots.get(key);

      console.log(`[published-snapshot] GET "${key}" — found: ${!!snapshot}, total snapshots: ${snapshots.size}, keys: [${Array.from(snapshots.keys()).join(", ")}]`);

      if (!snapshot) {
        return res.status(404).json({ message: "No published snapshot" });
      }
      return res.status(200).json(snapshot);
    }

    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  } catch (error: any) {
    console.error("[published-snapshot] Error:", error);
    return res.status(500).json({ message: error?.message || "Internal server error" });
  }
}
