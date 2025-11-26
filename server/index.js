// server/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Allow frontend to talk to backend in dev
app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server
    credentials: true,
  })
);

app.use(express.json());

// TEMP: we'll later use real Clerk userId coming from the frontend
const getUserId = (req) => {
  // Later: read from auth header / Clerk token
  return "demo-user-1";
};

// Health check
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Job Deck API is running 🚀" });
});

/**
 * Ensure the user row exists before we create jobs
 */
async function ensureUser(userId) {
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });
}

/**
 * GET /api/jobs
 */
app.get("/api/jobs", async (req, res) => {
  try {
    const userId = getUserId(req);

    const jobs = await prisma.job.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(jobs);
  } catch (err) {
    console.error("GET /api/jobs error:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

/**
 * POST /api/jobs
 */
app.post("/api/jobs", async (req, res) => {
  try {
    const userId = getUserId(req);
    await ensureUser(userId);

    const { title, company, status, location, source, url } = req.body;

    if (!title || !status) {
      return res
        .status(400)
        .json({ error: "title and status are required fields" });
    }

    const job = await prisma.job.create({
      data: {
        userId,
        title,
        company: company || null,
        status,
        location: location || null,
        source: source || null,
        url: url || null,
      },
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("POST /api/jobs error:", err);
    res.status(500).json({ error: "Failed to create job" });
  }
});

/**
 * PUT /api/jobs/:id
 */
app.put("/api/jobs/:id", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { title, company, status, location, source, url } = req.body;

    const existing = await prisma.job.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Job not found" });
    }

    const updated = await prisma.job.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        company: company ?? existing.company,
        status: status ?? existing.status,
        location: location ?? existing.location,
        source: source ?? existing.source,
        url: url ?? existing.url,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("PUT /api/jobs/:id error:", err);
    res.status(500).json({ error: "Failed to update job" });
  }
});

/**
 * DELETE /api/jobs/:id
 */
app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const existing = await prisma.job.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Job not found" });
    }

    await prisma.job.delete({
      where: { id },
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/jobs/:id error:", err);
    res.status(500).json({ error: "Failed to delete job" });
  }
});

/**
 * GET /api/jobs/:id
 */
app.get("/api/jobs/:id", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const job = await prisma.job.findFirst({
      where: { id, userId },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    console.error("GET /api/jobs/:id error:", err);
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
