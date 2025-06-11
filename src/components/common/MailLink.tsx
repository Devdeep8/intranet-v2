// components/common/MailLink.tsx
import { Mail } from "lucide-react"
import Link from "next/link"

type MailLinkProps = {
  email: string
  className?: string
}

export default function MailLink({ email, className = "" }: MailLinkProps) {
  return (
    <Link
      href={`mailto:${email}`}
      className={`inline-flex items-center gap-1 text-sm text-blue-600 hover:underline ${className}`}
    >
      <Mail className="w-4 h-4" />
      {email}
    </Link>
  )
}
