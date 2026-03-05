import { Request, Response } from "express";
import Drivers from "../models/mysql/Drivers";

// =================================================================
// 1. MAPA DE NACIONALIDADES (CORREGIDO)
// =================================================================
const nationalityToCode: Record<string, string> = {
  Dutch: "nl",
  "New Zealander": "nz",
  British: "gb",
  Italian: "it",
  Monegasque: "mc",
  Mexican: "mx",
  Thai: "th",
  Finnish: "fi",
  French: "fr",
  Chinese: "cn",
  American: "us",
  Australian: "au",
  Japanese: "jp", // Ya estaba mapeado para "Japanese"
  Japan: "jp", // ⬅️ ¡CORRECCIÓN AÑADIDA!
  Canadian: "ca",
  German: "de",
  Venezuelan: "ve",
  Spanish: "es",
  Russian: "ru",
  Polish: "pl",
  Austrian: "at",
  Brazilian: "br",
  Colombian: "co",
  Portuguese: "pt",
  Swiss: "ch",
  Belgian: "be",
  Swedish: "se",
  Chilean: "cl",
  "South African": "za",
  Indian: "in",
  Argentinian: "ar",
  Rhodesian: "zw",
  Liechtensteiner: "li",
  Irish: "ie",
  Malaysian: "my",
  Uruguayan: "uy",
  Hungarian: "hu",
  Danish: "dk",
  Czech: "cz",
  "East German": "de",
  Indonesian: "id",
};

export const updateAllDriverFlags = async (req: Request, res: Response) => {
  try {
    const drivers = await Drivers.findAll();

    if (!drivers || drivers.length === 0) {
      return res.status(404).json({ message: "No drivers found to update" });
    }

    const updatePromises = drivers.map(async (driver) => {
      const nationality = driver.getDataValue("nationality")?.trim();
      const code = nationalityToCode[nationality] || "unknown";

      // 🚨 CÓDIGO DE ADVERTENCIA MODIFICADO 🚨
      if (code === "unknown") {
        // Usamos los nombres correctos de columna del CSV: 'firstname' y 'lastname'
        const firstname = driver.getDataValue("firstname");
        const lastname = driver.getDataValue("lastname");
        const driverId = driver.getDataValue("id"); // Usamos el ID como respaldo

        // Creamos un mensaje más claro para identificar al piloto
        const driverName =
          firstname && lastname
            ? `${firstname} ${lastname}`
            : `ID: ${driverId}`;

        console.log(
          `[WARN 🚩] Nacionalidad no mapeada encontrada: "${nationality}" para el piloto (${driverName}). Se asignará la ruta 'uploads/flags/unknown'.`
        );
      }
      // FIN DEL CÓDIGO DE ADVERTENCIA MODIFICADO

      const flagPath = `uploads/flags/${code}`;

      driver.setDataValue("flag", flagPath);
      return driver.save();
    });

    await Promise.all(updatePromises);

    return res.json({
      message: "Flags updated successfully",
      totalUpdated: drivers.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err });
  }
};
