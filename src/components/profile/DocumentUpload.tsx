import React, { useEffect, useState } from 'react'
import { UploadCloud, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { submitDocumentAndMarkPending } from '@/lib/data/documents'

interface Props {
  userId?: string | null
  itemKey: string
}

export default function DocumentUpload({ userId, itemKey }: Props) {
  const [isUploading, setIsUploading] = useState(false)
  const [checklistItemId, setChecklistItemId] = useState<string | null>(null)
  const [placementId, setPlacementId] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!userId) return
    // Find a placement for the current user (if any)
    ;(async () => {
      const { data: p, error: pErr } = await supabase
        .from('placements')
        .select('id')
        .eq('talent_id', userId)
        .limit(1)
        .maybeSingle()
      if (pErr) return
      if (p && (p as any).id) setPlacementId((p as any).id)

      // Try to find matching checklist item
      if ((p as any)?.id) {
        const { data: c } = await supabase
          .from('compliance_checklist_items')
          .select('id')
          .eq('placement_id', (p as any).id)
          .eq('item_key', itemKey)
          .maybeSingle()
        if (c && (c as any).id) setChecklistItemId((c as any).id)
      }
    })()
  }, [userId, itemKey])

  function validateFile(file: File) {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png']
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (!allowed.includes(file.type)) return 'Only PDF / JPG / PNG allowed.'
    if (file.size > maxSize) return 'File exceeds 10MB limit.'
    return null
  }

  async function handleFile(file?: File) {
    if (!userId) return toast.error('Sign in to upload documents')
    if (!file) return
    const err = validateFile(file)
    if (err) return toast.error(err)
    setIsUploading(true)
    const res = await submitDocumentAndMarkPending(checklistItemId, userId, file, itemKey, placementId)
    setIsUploading(false)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success('Document uploaded — pending verification')
    }
  }

  return (
    <div className="mt-2">
      <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <FileText className="w-4 h-4" />
        <span>Upload proof</span>
      </label>
      <div className="flex items-center gap-2 mt-2">
        <input id={`doc-input-${itemKey}`} type="file" className="hidden"
          onChange={e => handleFile(e.target.files?.[0])} />
        <label htmlFor={`doc-input-${itemKey}`} className="px-3 py-2 rounded-xl bg-brand-gold/10 text-brand-gold cursor-pointer text-sm">
          {isUploading ? 'Uploading…' : (
            <span className="inline-flex items-center gap-2"><UploadCloud className="w-4 h-4" />Upload</span>
          )}
        </label>
      </div>
    </div>
  )
}
