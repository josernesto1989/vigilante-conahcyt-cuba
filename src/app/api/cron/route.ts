import { NextRequest, NextResponse } from "next/server"
import { scrapePassportIds } from "@/lib/scraper"
import { sendEmail } from "@/lib/email"
import { prisma } from "@/lib/prisma"

const TARGET_URL = "https://consulmex.sre.gob.mx/la-habana/index.php/avisos/78-becarios-conacyt"

function buildEmailHtml(passportId: string) {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">¡Felicidades! Has sido seleccionado</h1>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <p style="color: #666;">Tu número de pasaporte aparece en la lista de becarios CONACYT:</p>
          <h2 style="margin-top: 0;">${passportId}</h2>
          <a href="${TARGET_URL}" 
             style="display: inline-block; background: #0066cc; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 4px; margin-top: 10px;">
            Ver lista completa
          </a>
        </div>
      </body>
    </html>
  `
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const passportIds = await scrapePassportIds()
    if (passportIds.length === 0) {
      return NextResponse.json({ error: "No passport IDs found" }, { status: 500 })
    }

    const aspirantes = await prisma.aspirante.findMany()

    if (aspirantes.length === 0) {
      return NextResponse.json({ message: "No aspirants to check" })
    }

    const results: string[] = []

    for (const aspirant of aspirantes) {
      if (passportIds.includes(aspirant.passportId)) {
        const html = buildEmailHtml(aspirant.passportId)
        await sendEmail(aspirant.email, "¡Has sido seleccionado! - CONACYT La Habana", html)
        
        await prisma.aspirante.delete({
          where: { id: aspirant.id },
        })
        
        results.push(aspirant.passportId)
      }
    }

    return NextResponse.json({
      message: "Done",
      notified: results,
    })
  } catch (error) {
    console.error("Cron error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}