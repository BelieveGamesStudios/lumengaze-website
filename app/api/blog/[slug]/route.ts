import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params

  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug } = await params
  const body = await request.json()

  const { data, error } = await supabase.from("blog_posts").update(body).eq("slug", slug).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug } = await params

  const { error } = await supabase.from("blog_posts").delete().eq("slug", slug)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
