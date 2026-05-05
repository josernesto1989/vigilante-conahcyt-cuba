import * as cheerio from "cheerio"

const URL = "https://consulmex.sre.gob.mx/la-habana/index.php/avisos/78-becarios-conacyt"

export async function scrapePassportIds(): Promise<string[]> {
  try {
    const response = await fetch(URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      console.error("Failed to fetch URL:", response.status)
      return []
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    const passportIds: string[] = []

$("table tr").each((_, row) => {
      const tds = $(row).find("td")
      if (tds.length >= 3) {
        const passportId = $(tds[2]).text().trim().toUpperCase()
        if (passportId && passportId !== "PASA PORTE" && /^[A-Z0-9]+$/.test(passportId)) {
          passportIds.push(passportId)
        }
      }
    })

    return passportIds
  } catch (error) {
    console.error("Scraping error:", error)
    return []
  }
}