import { Request, Response } from "express";
import { SLACK_UI_DEV_OPS_ERRORS } from "../models/config";

export const postErrorNotification = async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;

    const publicMessage =
      context?.err?.message || context?.message || "Sin mensaje";
    const errorMessage = context?.err?.error.message || "Sin mensaje";
    const statusCode = context?.err?.status || context?.statusCode || "N/A";
    const url = context?.url || req.headers.referer || "N/A";
    const userAgent = req.headers["user-agent"] || "N/A";
    const authToken = req.cookies["access_token"];

    const payload = {
      text: message, // fallback
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `${statusCode} - ${message}`,
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Public Message:*\n${publicMessage}`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Error Message:*\n${errorMessage}`,
          },
        },
        {
          type: "section",
          text: { type: "mrkdwn", text: `*Status:*\n${statusCode}` },
        },
        {
          type: "section",
          text: { type: "mrkdwn", text: `*Url:*\n${url}` },
        },
        {
          type: "section",
          text: { type: "mrkdwn", text: `*Auth Token:*\n${authToken}` },
        },
        {
          type: "section",
          text: { type: "mrkdwn", text: `*Browser:*\n${userAgent}` },
        },
      ],
    };

    const resp = await fetch(SLACK_UI_DEV_OPS_ERRORS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
