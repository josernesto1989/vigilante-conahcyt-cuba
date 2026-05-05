import "dotenv/config"
import { scrapePassportIds } from "./lib/scraper"
import { sendEmail } from "./lib/email"
import { prisma } from "./lib/prisma"

const TARGET_URL = "https://consulmex.sre.gob.mx/la-habana/index.php/avisos/78-becarios-conacyt"

const TWO_MINUTES = 1 * 10 * 1000

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

async function runCron() {
  console.log("[" + new Date().toISOString() + "] Running cron job...")

  try {
    const passportIds = await scrapePassportIds()
    if (passportIds.length === 0) {
      console.log("No passport IDs found")
      return
    }

    console.log("Found", passportIds.length, "passport IDs")

    const aspirantes = await prisma.aspirante.findMany({
    })

    if (aspirantes.length === 0) {
      console.log("No aspirants to check")
      return
    }

    console.log("Checking", aspirantes.length, "aspirants...")

    for (const aspirant of aspirantes) {
      const match = passportIds.includes(aspirant.passportId)
      
      if (match) {
        console.log("Found match:", aspirant.passportId, "->", aspirant.email)
        
        const html = buildEmailHtml(aspirant.passportId)
        await sendEmail(aspirant.email, "¡Has sido seleccionado! - CONACYT La Habana", html)
        
        await prisma.aspirante.delete({
          where: { id: aspirant.id },
        })
        
        console.log("Email sent and removed:", aspirant.email)
      }
    }

    console.log("Cron completed")
  } catch (error) {
    console.error("Cron error:", error)
  }
}

async function startCron() {
  console.log("Starting cron...")
  await runCron()
  setInterval(runCron, TWO_MINUTES)
}

startCron()