const { redisClient } = require("../config/redis");
const { jobQueue } = require("../queue/submitQueue");

const submitCode = async (req, res) => {
  try {
    console.log("tried to hit the submit route ");
    const { roomId, code, input, language } = req.body;
    if (!roomId || !code || !language) {
      return res.status(400).json({ error: "roomId, code, and language are required" });
    }

    await redisClient.set(`code:${roomId}`, code);
    const job = await jobQueue.add({ roomId, code, input, language });

    res.status(202).json({ message: "Code submitted", jobId: job.id });
  } catch (err) {
    console.error("Error submitting code:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getOutput = async (req, res) => {
  const { roomId } = req.params;
  if (!roomId) return res.status(400).json({ error: "roomId is required" });
  const output = await redisClient.get(`output:${roomId}`);
  res.json({ output });
};

module.exports = { submitCode, getOutput };

