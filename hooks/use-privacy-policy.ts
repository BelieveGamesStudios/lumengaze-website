import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export interface PolicyChangeState {
  showModal: boolean
  policyVersion: number | null
  hasAccepted: boolean
}

const PRIVACY_POLICY_VERSION_KEY = "lumengaze_privacy_policy_version"
const PRIVACY_POLICY_ACCEPTED_KEY = "lumengaze_privacy_policy_accepted"

export function usePrivacyPolicyChange() {
  const [state, setState] = useState<PolicyChangeState>({
    showModal: false,
    policyVersion: null,
    hasAccepted: false,
  })

  useEffect(() => {
    const checkPolicyVersion = async () => {
      try {
        const supabase = createClient()

        // Fetch the latest policy version
        const { data, error } = await supabase
          .from("privacy_policies")
          .select("version")
          .order("version", { ascending: false })
          .limit(1)
          .single()

        if (error && error.code !== "PGRST116") {
          // PGRST116 = no rows
          console.error("Failed to fetch privacy policy version:", error)
          return
        }

        if (!data) return

        const latestVersion = data.version
        const storedVersion = localStorage.getItem(PRIVACY_POLICY_VERSION_KEY)
        const accepted = localStorage.getItem(PRIVACY_POLICY_ACCEPTED_KEY) === "true"

        // If this is a new version and user hasn't accepted it, show modal
        if (storedVersion && parseInt(storedVersion) < latestVersion && !accepted) {
          setState({
            showModal: true,
            policyVersion: latestVersion,
            hasAccepted: false,
          })
        } else if (!storedVersion) {
          // First visit: store the version but don't show modal
          localStorage.setItem(PRIVACY_POLICY_VERSION_KEY, latestVersion.toString())
          localStorage.setItem(PRIVACY_POLICY_ACCEPTED_KEY, "true")
          setState({
            showModal: false,
            policyVersion: latestVersion,
            hasAccepted: true,
          })
        }
      } catch (err) {
        console.error("Error checking privacy policy version:", err)
      }
    }

    checkPolicyVersion()
  }, [])

  const acceptPolicy = () => {
    if (state.policyVersion) {
      localStorage.setItem(PRIVACY_POLICY_VERSION_KEY, state.policyVersion.toString())
      localStorage.setItem(PRIVACY_POLICY_ACCEPTED_KEY, "true")
      setState((prev) => ({ ...prev, showModal: false, hasAccepted: true }))
    }
  }

  return { ...state, acceptPolicy }
}
