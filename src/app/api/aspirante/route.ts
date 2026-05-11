import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { email, passportId } = await request.json()

    if (!email || !passportId) {
      return NextResponse.json(
        { error: "Email and passportId are required" },
        { status: 400 }
      )
    }

    const normalizedPassportId = passportId.toUpperCase().trim()

    const aspirante = await prisma.aspirante.create({
      data: {
        email,
        passportId: normalizedPassportId,
      },
    })

    const emailHtml = `
      <h1>Registro Exitoso</h1>
      <p>Te has registrado correctamente en Vigilante CONAHCYT Cuba.</p>
      <p><strong>Datos registrados:</strong></p>
      <ul>
        <li>Email: ${email}</li>
        <li>Pasaporte ID: ${normalizedPassportId}</li>
      </ul>
      <p>Recibirás una notificación por email si tu número de pasaporte aparece en la lista de becarios CONAHCYT.</p>
      <p>Tus datos serán eliminados después de enviarte la notificación.</p>
    `

    await sendEmail(
      email,
      "Registro exitoso - Vigilante CONAHCYT Cuba",
      emailHtml
    )

    return NextResponse.json(aspirante)
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}