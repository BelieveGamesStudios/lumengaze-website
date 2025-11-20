"use client"

import { usePrivacyPolicyChange } from "@/hooks/use-privacy-policy"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PrivacyPolicyModal() {
  const { showModal, acceptPolicy, policyVersion } = usePrivacyPolicyChange()

  if (!showModal) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="glass border-white/20 max-w-md w-full">
        <CardHeader>
          <CardTitle>Privacy Policy Updated</CardTitle>
          <CardDescription>Please review and accept our updated privacy policy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We've updated our privacy policy. Please review the changes and accept to continue using our services.
          </p>
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href="/privacy">Read Policy</Link>
            </Button>
            <Button onClick={acceptPolicy} className="flex-1">
              Accept
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Version {policyVersion}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
