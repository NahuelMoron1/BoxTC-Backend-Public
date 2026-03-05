import express from "express";
import WordleWord from "../models/mysql/WordleWord";

const router = express.Router();

router.get("/wordle", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const entry = await WordleWord.findByPk(today);

  if (entry) {
    res.json({ word: entry.getDataValue("word") });
  } else {
    res.status(404).json({ error: "Palabra no disponible aún" });
  }
});

export default router;
