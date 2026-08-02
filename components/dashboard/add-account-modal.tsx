"use client";

import { useState } from "react";
import { toast } from "sonner";
import { X, Zap, Droplets, Loader2 } from "lucide-react";
import { neaLocations } from "@/lib/data/neo-locations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FREE_ACCOUNT_LIMIT } from "@/lib/helper";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plan: string;
  currentCount: number;
}

export function AddAccountModal({
  isOpen,
  onClose,
  onSuccess,
  plan,
  currentCount,
}: AddAccountModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    utilityType: "ELECTRICITY",
    neaLocationCode: "",
    scNo: "",
    consumerId: "",
    emailOverride: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isAtLimit = plan === "FREE" && currentCount >= FREE_ACCOUNT_LIMIT();

  function validate() {
    const e: Record<string, string> = {};
    if (!formData.neaLocationCode.trim())
      e.neaLocationCode = "NEA Location Code is required";
    if (!formData.scNo.trim()) e.scNo = "SC No is required";
    if (!formData.consumerId.trim()) e.consumerId = "Consumer ID is required";
    if (
      formData.emailOverride &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailOverride)
    ) {
      e.emailOverride = "Enter a valid email address";
    }
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utilityType: formData.utilityType,
          neaLocationCode: formData.neaLocationCode.trim(),
          scNo: formData.scNo.trim(),
          consumerId: formData.consumerId.trim(),
          emailOverride: formData.emailOverride.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.status === 403 && data.error === "FREE_LIMIT_REACHED") {
        toast.error(
          "Free plan limit reached. Upgrade to Pro for unlimited accounts."
        );
        onClose();
        return;
      }

      if (res.status === 409) {
        toast.error("This account is already saved.");
        return;
      }

      if (!res.ok) {
        toast.error(
          data.error ?? "Failed to add account. Please check NEA details."
        );
        return;
      }

      toast.success(
        `✅ Account added! ${
          data.account.customerName
            ? `Welcome, ${data.account.customerName}!`
            : ""
        }`
      );
      setFormData({
        utilityType: "ELECTRICITY",
        neaLocationCode: "",
        scNo: "",
        consumerId: "",
        emailOverride: "",
      });
      onClose();
      onSuccess();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Upgrade prompt if at limit
  if (isAtLimit) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md border-0 bg-white/95 backdrop-blur-sm">
          <div className="text-center py-6">
            <div className="text-6xl mb-6">🚀</div>
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-bold bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Upgrade to Pro
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed text-slate-600">
                You've reached the{" "}
                <strong className="text-slate-900">
                  {FREE_ACCOUNT_LIMIT()} account
                </strong>{" "}
                limit on the Free plan. Upgrade to Pro for unlimited accounts
                and priority 2-hour checks.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-6 justify-center">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                asChild
                className="bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              >
                <a href="/pricing">View Pricing →</a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-0 bg-white/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            Add Utility Account
          </DialogTitle>
          <DialogDescription>
            We'll verify and auto-fill your customer name from NEA.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Utility Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Utility Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "ELECTRICITY", label: "Electricity", icon: Zap },
                {
                  value: "WATER",
                  label: "Water",
                  icon: Droplets,
                  disabled: true,
                },
              ].map(({ value, label, icon: Icon, disabled }) => (
                <button
                  key={value}
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    !disabled &&
                    setFormData((f) => ({ ...f, utilityType: value }))
                  }
                  className={`
                    relative flex items-center gap-2 p-3 rounded-xl border-2 transition-all
                    ${
                      formData.utilityType === value
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-600"
                    }
                    ${
                      disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium text-sm">{label}</span>
                  {disabled && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Soon
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* NEA Location Code */}
          <div className="space-y-2">
            <Label htmlFor="nea-location">NEA Location Code</Label>
            <Select
              value={formData.neaLocationCode}
              onValueChange={(value) =>
                setFormData((f) => ({ ...f, neaLocationCode: value || "" }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your NEA location" />
              </SelectTrigger>
              <SelectContent>
                {neaLocations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.neaLocationCode && (
              <p className="text-sm text-red-600">{errors.neaLocationCode}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Found on your electricity bill (District/Service Center code)
            </p>
          </div>

          {/* SC Number */}
          <div className="space-y-2">
            <Label htmlFor="sc-no">SC No (Service Connection Number)</Label>
            <Input
              id="sc-no"
              placeholder="e.g. 1234567"
              value={formData.scNo}
              onChange={(e) =>
                setFormData((f) => ({ ...f, scNo: e.target.value }))
              }
              className="bg-white/70 border-slate-200 focus:border-violet-500"
            />
            {errors.scNo && (
              <p className="text-sm text-red-600">{errors.scNo}</p>
            )}
          </div>

          {/* Consumer ID */}
          <div className="space-y-2">
            <Label htmlFor="consumer-id">Consumer ID</Label>
            <Input
              id="consumer-id"
              placeholder="e.g. 8181"
              value={formData.consumerId}
              onChange={(e) =>
                setFormData((f) => ({ ...f, consumerId: e.target.value }))
              }
              className="bg-white/70 border-slate-200 focus:border-violet-500"
            />
            {errors.consumerId && (
              <p className="text-sm text-red-600">{errors.consumerId}</p>
            )}
          </div>

          {/* Email Override */}
          <div className="space-y-2">
            <Label htmlFor="email-override">
              Notification Email (optional)
            </Label>
            <Input
              id="email-override"
              type="email"
              placeholder="Leave blank to use your account email"
              value={formData.emailOverride}
              onChange={(e) =>
                setFormData((f) => ({ ...f, emailOverride: e.target.value }))
              }
              className="bg-white/70 border-slate-200 focus:border-violet-500"
            />
            {errors.emailOverride && (
              <p className="text-sm text-red-600">{errors.emailOverride}</p>
            )}
          </div>

          {/* Info Card */}
          <Card className="border-violet-200 bg-violet-50/50">
            <CardContent className="p-4">
              <p className="text-sm text-violet-700 leading-relaxed flex items-start gap-2">
                <span className="text-base">ℹ️</span>
                We'll instantly verify your details with NEA and auto-fill your
                customer name. If NEA cannot find the account, an error will be
                shown.
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-2 bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying with NEA…
                </>
              ) : (
                "Add & Verify Account"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
