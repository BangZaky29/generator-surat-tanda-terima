import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export const parseReceiptData = async (text, currentData) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `
Extract receipt letter details from the following text into a JSON object.

Current Date: ${today}

Text to analyze: "${text}"

Target Fields:
- nomorSurat
- tanggal (YYYY-MM-DD)
- tempat
- penerimaNama
- penerimaPekerjaan
- penerimaAlamat
- penerimaHp
- penyerahNama
- perusahaanAktif (boolean)
- perusahaanNama
- items [{ name, qty, notes }]

Return ONLY the JSON.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nomorSurat: { type: Type.STRING },
            tanggal: { type: Type.STRING },
            tempat: { type: Type.STRING },
            penerimaNama: { type: Type.STRING },
            penerimaPekerjaan: { type: Type.STRING },
            penerimaAlamat: { type: Type.STRING },
            penerimaHp: { type: Type.STRING },
            penyerahNama: { type: Type.STRING },
            perusahaanAktif: { type: Type.BOOLEAN },
            perusahaanNama: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  qty: { type: Type.STRING },
                  notes: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const result = JSON.parse(response.text || "{}");

    if (Array.isArray(result.items)) {
      result.items = result.items.map((item, index) => ({
        ...item,
        id: `gen-${Date.now()}-${index}`,
      }));
    }

    return result;
  } catch (err) {
    console.error("Gemini Parse Error:", err);
    throw new Error("Failed to parse text with AI");
  }
};
