import React, { useState } from 'react';
import { QrCode, Copy, Check, Download, AlertCircle } from 'lucide-react';
import { getImageUrl } from '../services/api';
import { normalizeGoogleDriveUrl, getGoogleDriveFallbackUrl } from '../utils/googleDrive';

const PaymentQRCard = ({
  registrationFee = 400,
  upiId = '',
  qrUrl = '',
  instructions = 'Scan the QR code and complete payment.'
}) => {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);

  // Compute normalized QR image URL
  const rawQrUrl = qrUrl || '';
  const primaryImgUrl = rawQrUrl ? getImageUrl(rawQrUrl) : '';

  const handleCopyUpi = () => {
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleImageError = (e) => {
    if (!triedFallback && rawQrUrl) {
      setTriedFallback(true);
      const fallback = getGoogleDriveFallbackUrl(rawQrUrl);
      if (fallback && fallback !== e.target.src) {
        e.target.src = fallback;
        return;
      }
    }
    setImageError(true);
  };

  const handleDownload = async () => {
    if (!primaryImgUrl) return;
    try {
      const response = await fetch(primaryImgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'NEXACK_2K26_Payment_QR.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      window.open(primaryImgUrl, '_blank');
    }
  };

  return (
    <div className="rounded-2xl bg-[#090b10] border border-emerald-500/20 shadow-xl p-6 sm:p-8 space-y-6">
      {/* Header Info */}
      <div className="text-center space-y-1">
        <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
          PAYMENT DETAILS
        </span>
        <div className="pt-2">
          <span className="text-xs text-zinc-400 block font-medium font-sans">Registration Fee</span>
          <div className="text-4xl font-extrabold font-heading text-white tracking-tight">
            ₹{registrationFee}
          </div>
        </div>
      </div>

      {/* QR Section */}
      <div className="flex flex-col items-center space-y-3">
        <div className="text-xs font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-1.5 font-mono">
          <QrCode className="w-4 h-4" />
          <span>SCAN TO PAY</span>
        </div>

        <div className="w-52 h-52 bg-white rounded-2xl p-3 border border-zinc-700 shadow-2xl flex items-center justify-center relative overflow-hidden group">
          {imageError || !primaryImgUrl ? (
            <div className="text-center p-4 text-zinc-700 space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-xs font-semibold text-zinc-800 leading-snug">
                Unable to load payment QR.
              </p>
              <p className="text-[11px] text-zinc-500">
                Please contact the organizers or use the UPI ID directly.
              </p>
            </div>
          ) : (
            <img
              src={primaryImgUrl}
              alt="Payment QR Code"
              referrerPolicy="no-referrer"
              onError={handleImageError}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          )}
        </div>

        {primaryImgUrl && !imageError && (
          <button
            type="button"
            onClick={handleDownload}
            className="text-xs text-zinc-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download QR</span>
          </button>
        )}
      </div>

      {/* UPI ID Copy Box */}
      {upiId ? (
        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Official UPI ID</span>
            <span className="text-sm font-mono font-bold text-zinc-200 truncate block">
              {upiId}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyUpi}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition flex-shrink-0 font-mono"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy UPI'}</span>
          </button>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-dashed border-zinc-800 text-center">
          <span className="text-xs text-zinc-500 font-mono">UPI ID will be updated by the organizers soon</span>
        </div>
      )}

      {/* Payment Instructions */}
      <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed font-sans">
        <span className="font-semibold text-zinc-200 block mb-1">Instructions:</span>
        <p>{instructions}</p>
      </div>
    </div>
  );
};

export default PaymentQRCard;
