import { supabase } from '@/lib/supabase'
import { updateChecklistItem } from '@/lib/data/mutations'

export interface UploadResult {
  documentId?: string
  filePath?: string
  error?: string
}

export async function uploadApplicantDocument(
  userId: string,
  file: File,
  itemKey: string,
  placementId?: string
): Promise<UploadResult> {
  try {
    const filePath = `${userId}/${itemKey}/${Date.now()}_${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('applicant-docs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        metadata: { owner: userId, item_key: itemKey },
      })

    if (uploadError) return { error: uploadError.message }

    // Insert record into compliance_documents table
    const { data: docData, error: insertError } = await supabase
      .from('compliance_documents')
      .insert({
        placement_id: placementId ?? null,
        item_key: itemKey,
        file_path: filePath,
        file_name: file.name,
        uploaded_by: userId,
      })
      .select('id')
      .single()

    if (insertError) return { error: insertError.message }

    return { documentId: (docData as any).id, filePath }
  } catch (err: any) {
    return { error: err?.message ?? String(err) }
  }
}

export async function submitDocumentAndMarkPending(
  checklistItemId: string | null,
  userId: string,
  file: File,
  itemKey: string,
  placementId?: string
): Promise<UploadResult> {
  const res = await uploadApplicantDocument(userId, file, itemKey, placementId)
  if (res.error) return res
  if (!checklistItemId) return res

  // Update checklist item to pending (submitted)
  const { error } = await updateChecklistItem(checklistItemId, { status: 'pending' })
  if (error) return { ...res, error }
  return res
}
