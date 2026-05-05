"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

const INFO_CONTENT = [
  {
    title: "¿Qué es este servicio?",
    content: "Este es un vigilante no-oficial que monitorea la lista de becarios CONACYT publicada por el Consulado de México en La Habana. No estamos afiliados a CONACYT ni al gobierno mexicano."
  },
  {
    title: "¿Cómo funciona?",
    content: "1. Te registras con tu email y número de pasaporte\n2. Diariamente verificamos si tu pasaporte aparece en la lista\n3. Si hay coincidencia, te enviamos un email de notificación\n4. Tus datos se eliminan después de notificarte"
  },
  {
    title: "¿Es seguro?",
    content: "Tus datos solo se usan para verificar si apareces en la lista. Son eliminados inmediatamente después de enviarte una notificación. No compartilhemos tu información con nadie."
  },
  {
    title: "¿Con qué frecuencia se verifica?",
    content: "La verificación se realiza una vez al día. El sistema revisa la lista oficial del Consulado."
  },
  {
    title: "Aviso importante",
    content: "Este proyecto es independiente y no tiene ninguna relación con CONACYT ni con las autoridades mexicanas. Para información oficial, consulta directamente con el Consulado."
  }
]

function CollapsibleItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 text-left text-sm font-medium text-slate-900 hover:text-slate-700"
      >
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && (
        <div className="pb-3 text-sm text-slate-600 whitespace-pre-line">
          {children}
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const [email, setEmail] = useState("")
  const [passportId, setPassportId] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    const normalizedPassportId = passportId.toUpperCase().trim()

    try {
      const res = await fetch("/api/aspirante", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passportId: normalizedPassportId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Registration failed")
        return
      }

      setSuccess(true)
      setEmail("")
      setPassportId("")
    } catch {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registro de Aspirante</CardTitle>
          <CardDescription>
            Ingresa tus datos para registrarte, serás notificado si tu número de pasaporte aparece en la lista de becarios CONACYT. Tus datos serán eliminados después de la notificación.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
            <strong>Nota:</strong> Este proyecto es independiente y no está afiliado a CONACYT.
          </div>
        </CardContent>

        <CardContent className="border-t border-slate-200 pt-4">
          <p className="mb-2 text-sm font-medium text-slate-900">Información</p>
          {INFO_CONTENT.map((item, index) => (
            <CollapsibleItem key={index} title={item.title}>
              {item.content}
            </CollapsibleItem>
          ))}
        </CardContent>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
                ¡Registro exitoso!
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="passportId" className="text-sm font-medium">
                Pasaporte ID
              </label>
              <Input
                id="passportId"
                type="text"
                placeholder="Número de pasaporte"
                value={passportId}
                onChange={(e) => setPassportId(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardContent>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}