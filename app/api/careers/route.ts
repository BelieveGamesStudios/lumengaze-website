import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("careers").select("*").order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const body = await request.json()

  const { data, error } = await supabase.from("careers").insert([body]).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
