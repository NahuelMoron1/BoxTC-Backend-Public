import { Request, Response } from "express";
import { Timeline, TimelineEvent } from "../models/mysql/associations";

export const getTodayTimeline = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const timeline = await Timeline.findOne({
      where: { date: today },
    });

    if (!timeline) {
      return res.status(404).json({ message: "No timeline found for today" });
    }

    const events = await TimelineEvent.findAll({
      where: { gameID: timeline.getDataValue("id") },
      attributes: ["id", "description", "image"], // 🔹 no exponemos eventDate
    });

    return res.status(200).json({
      timeline: {
        id: timeline.getDataValue("id"),
        date: timeline.getDataValue("date"),
      },
      events,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching today's timeline" });
  }
};

export const verifyTimeline = async (req: Request, res: Response) => {
  try {
    const { timelineId } = req.params;
    const { orderedIds } = req.body;

    if (!timelineId || !orderedIds || !Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // Traemos los eventos reales ordenados por fecha
    const events = await TimelineEvent.findAll({
      where: { gameID: timelineId },
      order: [["eventDate", "ASC"]],
    });

    const correctOrder = events.map((ev) => ({
      id: ev.getDataValue("id"),
      description: ev.getDataValue("description"),
      image: ev.getDataValue("image"),
    }));

    const gameWon =
      orderedIds.length === correctOrder.length &&
      orderedIds.every(
        (id: string, idx: number) => id === correctOrder[idx].id,
      );

    return res.status(200).json({ gameWon, correctOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error verifying timeline" });
  }
};
