'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { X, Zap, Droplets, Loader2 } from 'lucide-react'
import { FREE_ACCOUNT_LIMIT } from '@/lib/utils'
import { neaLocations } from '@/lib/data/neo-locations'

interface AddAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  plan: string
  currentCount: number
}

export function AddAccountModal({
  isOpen,
  onClose,
  onSuccess,
  plan,
  currentCount,
}: AddAccountModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    utilityType: 'ELECTRICITY',
    neaLocationCode: '',
    scNo: '',
    consumerId: '',
    emailOverride: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isAtLimit = plan === 'FREE' && currentCount >= FREE_ACCOUNT_LIMIT()

  function validate() {
    const e: Record<string, string> = {}
    if (!formData.neaLocationCode.trim()) e.neaLocationCode = 'NEA Location Code is required'
    if (!formData.scNo.trim()) e.scNo = 'SC No is required'
    if (!formData.consumerId.trim()) e.consumerId = 'Consumer ID is required'
    if (formData.emailOverride && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailOverride)) {
      e.emailOverride = 'Enter a valid email address'
    }
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          utilityType: formData.utilityType,
          neaLocationCode: formData.neaLocationCode.trim(),
          scNo: formData.scNo.trim(),
          consumerId: formData.consumerId.trim(),
          emailOverride: formData.emailOverride.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (res.status === 403 && data.error === 'FREE_LIMIT_REACHED') {
        toast.error('Free plan limit reached. Upgrade to Pro for unlimited accounts.')
        onClose()
        return
      }

      if (res.status === 409) {
        toast.error('This account is already saved.')
        return
      }

      if (!res.ok) {
        toast.error(data.error ?? 'Failed to add account. Please check NEA details.')
        return
      }

      toast.success(`✅ Account added! ${data.account.customerName ? `Welcome, ${data.account.customerName}!` : ''}`)
      setFormData({ utilityType: 'ELECTRICITY', neaLocationCode: '', scNo: '', consumerId: '', emailOverride: '' })
      onClose()
      onSuccess()
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Upgrade prompt if at limit
  if (isAtLimit) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-box animate-bounce-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
          <div style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <h2 className="heading-md" style={{ marginBottom: '0.75rem' }}>
              Upgrade to Pro
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              You&apos;ve reached the <strong>{FREE_ACCOUNT_LIMIT()} account</strong> limit on the Free plan.
              Upgrade to Pro for unlimited accounts and priority 2-hour checks.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={onClose} id="upgrade-modal-cancel">
                Cancel
              </button>
              <a href="/pricing" className="btn btn-primary" id="upgrade-modal-cta">
                View Pricing →
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box " onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.5rem 1.5rem 0',
          }}
        >
          <div>
            <h2 className="heading-md">Add Utility Account</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
              We&apos;ll verify and auto-fill your customer name from NEA.
            </p>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            id="add-account-modal-close"
            style={{ padding: '0.4rem' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {/* Utility Type */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Utility Type</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { value: 'ELECTRICITY', label: 'Electricity', icon: Zap },
                { value: 'WATER', label: 'Water (Soon)', icon: Droplets, disabled: true },
              ].map(({ value, label, icon: Icon, disabled }) => (
                <button
                  key={value}
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && setFormData((f) => ({ ...f, utilityType: value }))}
                  id={`utility-type-${value.toLowerCase()}`}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1rem',
                    border: `2px solid ${formData.utilityType === value ? 'var(--primary)' : 'var(--border-2)'}`,
                    borderRadius: '0.625rem',
                    background: formData.utilityType === value ? 'rgb(79 70 229 / 0.08)' : 'var(--bg)',
                    color: formData.utilityType === value ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    opacity: disabled ? 0.5 : 1,
                    transition: 'all 0.15s',
                  }}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* NEA Location Code */}
          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="nea-location-code">
              NEA Location Code
            </label>
            <select
              id="nea-location-code"
              className="form-input"
              value={formData.neaLocationCode}
              onChange={(e) => setFormData((f) => ({ ...f, neaLocationCode: e.target.value }))}
            >

              {
                neaLocations.map((location) => (
                  <option key={location.value} value={location.value} >
                    {location.label}
                  </option>
                ))
              }
            </select>
            {errors.neaLocationCode && <p className="form-error">{errors.neaLocationCode}</p>}
            <p style={{ fontSize: '0.72rem', color: 'var(--text-xmuted)', marginTop: '0.3rem' }}>
              Found on your electricity bill (District/Service Center code)
            </p>
          </div>

          {/* SC No */}
          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="sc-no">
              SC No (Service Connection Number)
            </label>
            <input
              id="sc-no"
              className="form-input"
              type="text"
              placeholder="e.g. 1234567"
              value={formData.scNo}
              onChange={(e) => setFormData((f) => ({ ...f, scNo: e.target.value }))}
            />
            {errors.scNo && <p className="form-error">{errors.scNo}</p>}
          </div>

          {/* Consumer ID */}
          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="consumer-id">
              Consumer ID
            </label>
            <input
              id="consumer-id"
              className="form-input"
              type="text"
              placeholder="e.g. 8181"
              value={formData.consumerId}
              onChange={(e) => setFormData((f) => ({ ...f, consumerId: e.target.value }))}
            />
            {errors.consumerId && <p className="form-error">{errors.consumerId}</p>}
          </div>

          {/* Email Override (optional) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="email-override">
              Notification Email (optional)
            </label>
            <input
              id="email-override"
              className="form-input"
              type="email"
              placeholder="Leave blank to use your account email"
              value={formData.emailOverride}
              onChange={(e) => setFormData((f) => ({ ...f, emailOverride: e.target.value }))}
            />
            {errors.emailOverride && <p className="form-error">{errors.emailOverride}</p>}
          </div>

          <div
            style={{
              background: 'rgb(79 70 229 / 0.06)',
              border: '1px solid rgb(79 70 229 / 0.15)',
              borderRadius: '0.625rem',
              padding: '0.75rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: '1.5rem',
              lineHeight: 1.5,
            }}
          >
            ℹ️ We&apos;ll instantly verify your details with NEA and auto-fill your customer name.
            If NEA cannot find the account, an error will be shown.
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              id="add-account-cancel"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              id="add-account-submit"
              disabled={loading}
              style={{ flex: 2 }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Verifying with NEA…
                </>
              ) : (
                'Add & Verify Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
