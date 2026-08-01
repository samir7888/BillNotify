'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { X, Upload, Loader2, Clock, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
}

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  function resetFile() {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleClose() {
    if (loading) return
    resetFile()
    setSubmitted(false)
    onClose()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      toast.error('Please upload a JPG, PNG, or WebP image.')
      resetFile()
      return
    }

    if (selected.size > MAX_FILE_SIZE) {
      toast.error('Image must be smaller than 5 MB.')
      resetFile()
      return
    }

    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) {
      toast.error('Please upload a screenshot of your payment.')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('proof', file)

      const res = await fetch('/api/upgrade', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message ?? data.error ?? 'Failed to submit payment proof.')
        return
      }

      setSubmitted(true)
      resetFile()
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-box animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 480 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.5rem 1.5rem 0',
          }}
        >
          <div>
            <h2 className="heading-md">Upgrade to Pro</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
              NPR 49 one-time · Lifetime access
            </p>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleClose}
            disabled={loading}
            style={{ padding: '0.4rem' }}
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={{ padding: '2rem 1.5rem 2.5rem', textAlign: 'center' }}>
            <CheckCircle2
              size={48}
              color="var(--success)"
              style={{ margin: '0 auto 1rem' }}
            />
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>
              Payment submitted!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Thank you! We&apos;ve received your payment proof. Please wait while we verify
              your payment — this usually takes a few hours. You&apos;ll get Pro access once
              approved.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgb(79 70 229 / 0.08)',
                border: '1px solid rgb(79 70 229 / 0.15)',
                borderRadius: '9999px',
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                color: 'var(--primary)',
                fontWeight: 600,
              }}
            >
              <Clock size={14} />
              Verification in progress
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <button className="btn btn-primary" onClick={handleClose}>
                Got it
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
            <div
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                textAlign: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
                Scan the QR code below and pay <strong style={{ color: 'var(--text)' }}>NPR 49</strong>.
                Then upload a screenshot of your payment confirmation.
              </p>
              <div
                style={{
                  position: 'relative',
                  width: 200,
                  height: 200,
                  margin: '0 auto',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  background: 'white',
                }}
              >
                <Image
                  src="/qr.png"
                  alt="Payment QR code"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Payment screenshot</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="payment-proof-upload"
              />
              {!preview ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1.5rem',
                    border: '2px dashed var(--border-2)',
                    borderRadius: '0.75rem',
                    background: 'var(--bg)',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <Upload size={24} color="var(--primary)" />
                  <span>Click to upload screenshot</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-xmuted)' }}>
                    JPG, PNG or WebP · Max 5 MB
                  </span>
                </button>
              ) : (
                <div style={{ position: 'relative' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Payment proof preview"
                    style={{
                      width: '100%',
                      maxHeight: 200,
                      objectFit: 'contain',
                      borderRadius: '0.75rem',
                      border: '1px solid var(--border)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={resetFile}
                    className="btn btn-ghost btn-sm"
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      background: 'var(--surface)',
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleClose}
                disabled={loading}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !file}
                style={{ flex: 2 }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Submitting…
                  </>
                ) : (
                  'Submit Payment Proof'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
