"use client"

import type React from "react"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"

// ReactQuill dynamic import (client-only)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
}

const quillFormats = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "link", "image"]

// Polyfill ReactDOM.findDOMNode (best-effort)
if (typeof window !== "undefined") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ReactDOM = require("react-dom")
    // @ts-ignore
    if (ReactDOM && !ReactDOM.findDOMNode) {
      // @ts-ignore
      ReactDOM.findDOMNode = (instance: any) => {
        if (!instance) return null
        if (instance.editor && instance.editor.root) return instance.editor.root
        if (typeof instance.getEditor === "function") {
          const ed = instance.getEditor()
          return ed?.root || null
        }
        if (instance instanceof HTMLElement) return instance
        return null
      }
    }
  } catch (e) {
    // ignore
  }
}

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PrivacyPolicy {
  id: string
  content: string
  version: number
  updated_at: string
}

export default function PrivacyAdminPage() {
  const [policy, setPolicy] = useState<PrivacyPolicy | null>(null)
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchPolicy()
  }, [])

  const fetchPolicy = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("privacy_policies")
        .select("*")
        .order("version", { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        throw error
      }

      if (data) {
        setPolicy(data)
        setContent(data.content)
      } else {
        setContent("")
      }
    } catch (err: any) {
      setMessage({ type: "error", text: `Failed to load policy: ${err?.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content.trim()) {
      setMessage({ type: "error", text: "Privacy policy content cannot be empty." })
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      const newVersion = (policy?.version || 0) + 1

      const { data, error } = await supabase.from("privacy_policies").insert([
        {
          content,
          version: newVersion,
        },
      ]).select()

      if (error) throw error

      if (data && data[0]) {
        setPolicy(data[0])
        setMessage({ type: "success", text: `Privacy policy saved successfully! Version ${newVersion}` })
      }
    } catch (err: any) {
      setMessage({ type: "error", text: `Failed to save policy: ${err?.message}` })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold gradient-text">Privacy Policy</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Policy"}
        </Button>
      </div>

      {policy && (
        <div className="mb-4 text-sm text-muted-foreground">
          <p>Current version: {policy.version} | Last updated: {new Date(policy.updated_at).toLocaleString()}</p>
        </div>
      )}

      {message && (
        <Card className={`mb-6 ${message.type === "success" ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
          <CardContent className="pt-6">
            <p className={message.type === "success" ? "text-green-400" : "text-red-400"}>{message.text}</p>
          </CardContent>
        </Card>
      )}

      <Card className="glass border-white/20 p-6">
        <div className="prose prose-invert bg-card/50 p-2 rounded-lg border border-white/20">
          {/* @ts-ignore */}
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Write your privacy policy here..."
          />
        </div>
      </Card>

      <div className="mt-6 flex gap-2">
        <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
          {saving ? "Saving..." : "Save Policy"}
        </Button>
        <Button variant="outline" onClick={fetchPolicy}>
          Reset
        </Button>
      </div>
    </div>
  )
}
