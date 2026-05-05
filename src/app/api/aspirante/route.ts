import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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

    return NextResponse.json(aspirante)
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}