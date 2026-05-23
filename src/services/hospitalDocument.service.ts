import { apiRequest } from '../api/client'

export type HospitalDocumentImage = {
  id: number | string
  document_id: number | string
  original_name: string
  cloudinary_url: string
  mime_type?: string | null
}

export type HospitalDocument = {
  id: number | string
  title: string
  original_filename: string
  file_type: 'PDF' | 'DOCX'
  mime_type: string
  file_size: number
  chunk_count: number
  image_count: number
  status: 'ACTIVE' | 'INACTIVE'
  created_at?: string
  updated_at?: string
  images?: HospitalDocumentImage[]
}

export type HospitalDocumentChunk = {
  id: number | string
  source_id: number | string
  chunk_index: number
  title: string
  content: string
  embedding_model: string
  embedding_dimensions: number
  content_hash: string
  status: 'ACTIVE' | 'INACTIVE'
  created_at?: string
  updated_at?: string
}

export type HospitalDocumentDetail = HospitalDocument & {
  chunks: HospitalDocumentChunk[]
  images: HospitalDocumentImage[]
}

export type SyncEmbeddingsStats = {
  total: number
  created: number
  updated: number
  skipped: number
  failed: number
}

export const getHospitalDocuments = () =>
  apiRequest<HospitalDocument[]>('/hospital-documents')

export const getHospitalDocumentById = (id: number | string) =>
  apiRequest<HospitalDocumentDetail>(`/hospital-documents/${id}`)

export const uploadHospitalDocument = (payload: { file: File; title?: string }) => {
  const formData = new FormData()
  formData.append('file', payload.file)
  if (payload.title?.trim()) {
    formData.append('title', payload.title.trim())
  }

  return apiRequest<HospitalDocument>('/hospital-documents', {
    method: 'POST',
    body: formData,
  })
}

export const updateHospitalDocumentStatus = (id: number | string, status: HospitalDocument['status']) =>
  apiRequest<HospitalDocument>(`/hospital-documents/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })

export const updateHospitalDocument = (id: number | string, payload: { file?: File | null; title: string }) => {
  if (payload.file) {
    const formData = new FormData()
    formData.append('title', payload.title.trim())
    formData.append('file', payload.file)

    return apiRequest<HospitalDocument>(`/hospital-documents/${id}`, {
      method: 'PATCH',
      body: formData,
    })
  }

  return apiRequest<HospitalDocument>(`/hospital-documents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ title: payload.title }),
  })
}

export const deleteHospitalDocument = (id: number | string) =>
  apiRequest<void>(`/hospital-documents/${id}`, {
    method: 'DELETE',
  })

export const syncHospitalDocumentEmbeddings = () =>
  apiRequest<SyncEmbeddingsStats>('/hospital-documents/sync-embeddings', {
    method: 'POST',
  })
