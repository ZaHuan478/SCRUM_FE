import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DragEvent, FormEvent } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'
import {
  deleteHospitalDocument,
  getHospitalDocumentById,
  getHospitalDocuments,
  updateHospitalDocument,
  updateHospitalDocumentStatus,
  uploadHospitalDocument,
  type HospitalDocument,
  type HospitalDocumentDetail,
} from '../../../services/hospitalDocument.service'

const MAX_DOCUMENT_FILE_SIZE = 100 * 1024 * 1024

const formatFileSize = (size: number) => {
  if (!Number.isFinite(size)) return '0 KB'
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`
  return `${Math.max(Math.round(size / 1024), 1)} KB`
}

const HospitalDocumentManager = () => {
  const [documents, setDocuments] = useState<HospitalDocument[]>([])
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [isUploading, setIsUploading] = useState(false)
  const [deletingDocumentId, setDeletingDocumentId] = useState<number | string | null>(null)
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<HospitalDocumentDetail | null>(null)
  const [detailStatus, setDetailStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [error, setError] = useState('')
  const [editingDocument, setEditingDocument] = useState<HospitalDocument | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editFile, setEditFile] = useState<File | null>(null)
  const [updatingDocumentId, setUpdatingDocumentId] = useState<number | string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const editFileInputRef = useRef<HTMLInputElement | null>(null)

  const activeDocuments = useMemo(
    () => documents.filter((document) => document.status === 'ACTIVE').length,
    [documents],
  )
  const totalChunks = useMemo(
    () => documents.reduce((total, document) => total + Number(document.chunk_count || 0), 0),
    [documents],
  )

  const loadDocuments = useCallback(async () => {
    setStatus('loading')
    setError('')
    try {
      setDocuments(await getHospitalDocuments())
      setStatus('ready')
    } catch (requestError) {
      setStatus('error')
      setError(requestError instanceof Error ? requestError.message : 'Không tải được tài liệu.')
    }
  }, [])

  useEffect(() => {
    void loadDocuments()
  }, [loadDocuments])

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file || isUploading) return

    const form = event.currentTarget
    setIsUploading(true)
    setError('')
    try {
      const uploadedDocument = await uploadHospitalDocument({ file, title })
      setDocuments((currentDocuments) => [uploadedDocument, ...currentDocuments])
      setTitle('')
      setFile(null)
      form.reset()
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Tải tài liệu lên thất bại.')
    } finally {
      setIsUploading(false)
    }
  }, [file, isUploading, title])

  const handleSelectedFile = useCallback((selectedFile?: File | null) => {
    if (!selectedFile) return

    const fileName = selectedFile.name.toLowerCase()
    const isAllowedFile = fileName.endsWith('.pdf') || fileName.endsWith('.docx')

    if (!isAllowedFile) {
      setError('Chỉ hỗ trợ file PDF hoặc DOCX.')
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    if (selectedFile.size > MAX_DOCUMENT_FILE_SIZE) {
      setError('File tài liệu phải nhỏ hơn hoặc bằng 100 MB.')
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setError('')
    setFile(selectedFile)
  }, [])

  const handleDragOver = useCallback((event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    setIsDraggingFile(true)
  }, [])

  const handleDragLeave = useCallback((event: DragEvent<HTMLLabelElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDraggingFile(false)
    }
  }, [])

  const handleDrop = useCallback((event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDraggingFile(false)
    handleSelectedFile(event.dataTransfer.files?.[0])
  }, [handleSelectedFile])

  const handleToggleStatus = useCallback(async (document: HospitalDocument) => {
    const nextStatus = document.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    setError('')
    try {
      const updatedDocument = await updateHospitalDocumentStatus(document.id, nextStatus)
      setDocuments((currentDocuments) => currentDocuments.map((item) => (
        item.id === document.id ? { ...item, status: updatedDocument.status } : item
      )))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không cập nhật được trạng thái.')
    }
  }, [])

  const handleOpenEdit = useCallback((document: HospitalDocument) => {
    setEditingDocument(document)
    setEditTitle(document.title)
    setEditFile(null)
    setError('')
    if (editFileInputRef.current) editFileInputRef.current.value = ''
  }, [])

  const handleCloseEdit = useCallback(() => {
    if (updatingDocumentId) return
    setEditingDocument(null)
    setEditTitle('')
    setEditFile(null)
    if (editFileInputRef.current) editFileInputRef.current.value = ''
  }, [updatingDocumentId])

  const handleSelectedEditFile = useCallback((selectedFile?: File | null) => {
    if (!selectedFile) {
      setEditFile(null)
      return
    }

    const fileName = selectedFile.name.toLowerCase()
    const isAllowedFile = fileName.endsWith('.pdf') || fileName.endsWith('.docx')

    if (!isAllowedFile) {
      setError('Chỉ hỗ trợ file PDF hoặc DOCX.')
      setEditFile(null)
      if (editFileInputRef.current) editFileInputRef.current.value = ''
      return
    }

    if (selectedFile.size > MAX_DOCUMENT_FILE_SIZE) {
      setError('File tài liệu phải nhỏ hơn hoặc bằng 100 MB.')
      setEditFile(null)
      if (editFileInputRef.current) editFileInputRef.current.value = ''
      return
    }

    setError('')
    setEditFile(selectedFile)
  }, [])

  const handleUpdateDocument = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingDocument || updatingDocumentId) return

    const nextTitle = editTitle.trim()
    if (!nextTitle) {
      setError('Tiêu đề tài liệu là bắt buộc.')
      return
    }

    setUpdatingDocumentId(editingDocument.id)
    setError('')
    try {
      const updatedDocument = await updateHospitalDocument(editingDocument.id, {
        file: editFile,
        title: nextTitle,
      })
      const replacedFile = Boolean(editFile)
      setDocuments((currentDocuments) => currentDocuments.map((item) => (
        item.id === updatedDocument.id ? { ...item, ...updatedDocument } : item
      )))
      setSelectedDocument((currentDocument) => (
        currentDocument?.id === updatedDocument.id
          ? replacedFile
            ? null
            : { ...currentDocument, ...updatedDocument, chunks: currentDocument.chunks }
          : currentDocument
      ))
      if (replacedFile && selectedDocument?.id === updatedDocument.id) {
        setDetailStatus('idle')
      }
      setEditingDocument(null)
      setEditTitle('')
      setEditFile(null)
      if (editFileInputRef.current) editFileInputRef.current.value = ''
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không cập nhật được tài liệu.')
    } finally {
      setUpdatingDocumentId(null)
    }
  }, [editFile, editTitle, editingDocument, selectedDocument, updatingDocumentId])

  const handleDeleteDocument = useCallback(async (document: HospitalDocument) => {
    const confirmed = window.confirm(`Xóa tài liệu "${document.title}" và tất cả đoạn nội dung/ảnh của tài liệu này?`)
    if (!confirmed || deletingDocumentId) return

    setDeletingDocumentId(document.id)
    setError('')
    try {
      await deleteHospitalDocument(document.id)
      setDocuments((currentDocuments) => currentDocuments.filter((item) => item.id !== document.id))
      if (selectedDocument?.id === document.id) {
        setSelectedDocument(null)
        setDetailStatus('idle')
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không xóa được tài liệu.')
    } finally {
      setDeletingDocumentId(null)
    }
  }, [deletingDocumentId, selectedDocument])

  const handleOpenDetail = useCallback(async (document: HospitalDocument) => {
    setDetailStatus('loading')
    setError('')
    try {
      const detail = await getHospitalDocumentById(document.id)
      setSelectedDocument(detail)
      setDetailStatus('ready')
    } catch (requestError) {
      setDetailStatus('error')
      setError(requestError instanceof Error ? requestError.message : 'Không tải được chi tiết tài liệu.')
    }
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedDocument(null)
    setDetailStatus('idle')
  }, [])

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-lg border-b border-outline-variant/20 p-lg md:p-xl">
        <div className="flex flex-col justify-between gap-md md:flex-row md:items-start">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Tài liệu AI bệnh viện</h2>
            <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
              Tải lên PDF/DOCX, hệ thống sẽ chia nội dung thành các đoạn có chồng lặp, tạo embedding bằng Gemini và lưu dữ liệu vector.
            </p>
          </div>
          <div className="grid w-full grid-cols-2 gap-sm sm:w-auto">
            <div className="rounded-lg bg-surface-container px-md py-sm">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Đang dùng</p>
              <p className="font-title-md text-title-md text-on-surface">{activeDocuments}</p>
            </div>
            <div className="rounded-lg bg-surface-container px-md py-sm">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Đoạn vector</p>
              <p className="font-title-md text-title-md text-on-surface">{totalChunks}</p>
            </div>
          </div>
        </div>

        <form className="grid gap-lg rounded-lg bg-surface-container-low p-md lg:grid-cols-[minmax(220px,0.75fr)_minmax(360px,1.25fr)]" onSubmit={handleSubmit}>
          <Input
            aria-label="Tiêu đề tài liệu"
            className="py-sm text-body-sm"
            icon="description"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Tiêu đề tài liệu"
            value={title}
          />
          <label
            className={`relative flex min-h-36 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed px-lg py-lg text-center transition-colors ${
              isDraggingFile
                ? 'border-primary bg-primary-container/40 text-on-primary-container'
                : 'border-outline-variant/60 bg-surface-container-lowest text-on-surface hover:border-primary/70 hover:bg-primary-container/10'
            }`}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <span className="pointer-events-none absolute -right-2 bottom-4 h-20 w-16 rotate-[-8deg] rounded-sm border border-outline-variant/20 bg-white/80 shadow-lg">
              <span className="mx-auto mt-4 block h-2 w-9 rounded-full bg-outline-variant/20" />
              <span className="mx-auto mt-2 block h-2 w-10 rounded-full bg-outline-variant/20" />
              <span className="mx-auto mt-2 block h-2 w-8 rounded-full bg-outline-variant/20" />
            </span>
            <span className="pointer-events-none absolute left-1/2 top-3 h-10 w-24 -translate-x-1/2 rounded-full border-t-2 border-dotted border-outline-variant/50" />
            <span className="mb-sm flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-primary">
              <Icon name={isDraggingFile ? 'download' : 'upload_file'} />
            </span>
            <span className="z-10 inline-flex items-center gap-xs rounded-lg bg-primary px-lg py-sm font-label-md text-label-md text-on-primary shadow-md">
              <Icon name="cloud_upload" />
              Tải lên
            </span>
            <span className="z-10 mt-sm block font-body-sm text-body-sm text-on-surface-variant">
              {file ? `${file.name} - ${formatFileSize(file.size)}` : 'hoặc kéo thả file PDF/DOCX vào đây'}
            </span>
            <span className="z-10 mt-xs block font-body-sm text-body-sm text-on-surface-variant">
              Hỗ trợ .pdf, .docx tối đa 100 MB
            </span>
            <input
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={(event) => handleSelectedFile(event.target.files?.[0] ?? null)}
              ref={fileInputRef}
              type="file"
            />
          </label>
          <Button
            className="lg:col-start-2 flex items-center justify-center gap-xs px-lg py-sm"
            disabled={!file || isUploading}
            fullWidth={false}
            type="submit"
          >
            <Icon name="cloud_upload" />
            {isUploading ? 'Đang xử lý' : 'Nhập tài liệu'}
          </Button>
        </form>

        {error && (
          <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
            {error}
          </p>
        )}
      </div>

      {status === 'loading' && <div className="p-xl font-body-sm text-body-sm text-on-surface-variant">Đang tải tài liệu...</div>}
      {status === 'error' && !error && (
        <div className="m-lg rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
          Chưa tải được danh sách tài liệu.
        </div>
      )}
      {status === 'ready' && documents.length === 0 && (
        <div className="p-xl text-center font-body-md text-body-md text-on-surface-variant">Chưa có tài liệu nào.</div>
      )}
      {documents.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-outline-variant/20 bg-surface-container-low">
              <tr>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Tài liệu</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Loại</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Đoạn vector</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Ảnh</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Trạng thái</th>
                <th className="px-xl py-md text-right font-label-md text-label-md text-on-surface-variant">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {documents.map((document) => (
                <tr className="transition-colors hover:bg-surface-container-low" key={document.id}>
                  <td className="px-xl py-lg">
                    <p className="min-w-56 font-label-md text-label-md text-on-surface">{document.title}</p>
                    <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
                      {document.original_filename} - {formatFileSize(Number(document.file_size))}
                    </p>
                  </td>
                  <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">{document.file_type}</td>
                  <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">{document.chunk_count}</td>
                  <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">{document.image_count}</td>
                  <td className="px-xl py-lg">
                    <span className={`inline-flex w-fit items-center gap-xs rounded-full px-sm py-xs font-label-sm text-label-sm ${
                      document.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${document.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {document.status === 'ACTIVE' ? 'Đang tìm kiếm' : 'Tạm ngưng'}
                    </span>
                  </td>
                  <td className="px-xl py-lg text-right">
                    <div className="flex justify-end gap-sm">
                      <Button
                        className="px-md py-sm"
                        fullWidth={false}
                        onClick={() => handleOpenEdit(document)}
                        type="button"
                        variant="ghost"
                      >
                        Sửa
                      </Button>
                      <Button
                        className="px-md py-sm"
                        fullWidth={false}
                        onClick={() => void handleOpenDetail(document)}
                        type="button"
                        variant="ghost"
                      >
                        Chi tiết
                      </Button>
                      <Button
                        className="px-md py-sm"
                        fullWidth={false}
                        onClick={() => void handleToggleStatus(document)}
                        type="button"
                        variant="ghost"
                      >
                        {document.status === 'ACTIVE' ? 'Tắt' : 'Bật'}
                      </Button>
                      <Button
                        className="border-error/30 px-md py-sm text-error hover:bg-error-container"
                        disabled={deletingDocumentId === document.id}
                        fullWidth={false}
                        onClick={() => void handleDeleteDocument(document)}
                        type="button"
                        variant="ghost"
                      >
                        {deletingDocumentId === document.id ? 'Đang xóa' : 'Xóa'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editingDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/40 px-md py-lg">
          <form
            className="w-full max-w-xl rounded-xl bg-surface-container-lowest p-lg shadow-2xl"
            onSubmit={handleUpdateDocument}
          >
            <div className="flex items-start justify-between gap-md">
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface">Sửa tài liệu</h3>
                <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
                  Cập nhật tiêu đề hoặc thay file để hệ thống xử lý lại nội dung AI.
                </p>
              </div>
              <Button
                aria-label="Đóng form sửa tài liệu"
                className="rounded-full p-sm"
                disabled={Boolean(updatingDocumentId)}
                fullWidth={false}
                onClick={handleCloseEdit}
                type="button"
                variant="ghost"
              >
                <Icon name="close" />
              </Button>
            </div>

            <div className="mt-lg space-y-md">
              <Input
                autoFocus
                id="hospital-document-edit-title"
                label="Tiêu đề tài liệu"
                maxLength={255}
                onChange={(event) => setEditTitle(event.target.value)}
                value={editTitle}
              />
              <div className="rounded-lg bg-surface-container px-md py-sm">
                <p className="font-label-sm text-label-sm text-on-surface-variant">File gốc</p>
                <p className="mt-xs break-all font-body-sm text-body-sm text-on-surface">
                  {editingDocument.original_filename}
                </p>
              </div>
              <label className="block rounded-lg border border-dashed border-outline-variant/60 bg-surface-container-low px-md py-md">
                <span className="font-label-md text-label-md text-on-surface">Thay thế file</span>
                <span className="mt-xs block font-body-sm text-body-sm text-on-surface-variant">
                  Tùy chọn. Khi chọn file mới, hệ thống sẽ đọc lại nội dung, chia thành các đoạn và tạo embedding mới.
                </span>
                <input
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="mt-sm block w-full font-body-sm text-body-sm text-on-surface file:mr-md file:rounded-lg file:border-0 file:bg-primary file:px-md file:py-sm file:font-label-sm file:text-label-sm file:text-on-primary"
                  disabled={Boolean(updatingDocumentId)}
                  onChange={(event) => handleSelectedEditFile(event.target.files?.[0] ?? null)}
                  ref={editFileInputRef}
                  type="file"
                />
                {editFile && (
                  <span className="mt-sm flex items-center justify-between gap-sm rounded-lg bg-primary-container px-md py-sm text-on-primary-container">
                    <span className="break-all font-body-sm text-body-sm">
                      {editFile.name} - {formatFileSize(editFile.size)}
                    </span>
                    <button
                      className="shrink-0 font-label-sm text-label-sm text-primary"
                      disabled={Boolean(updatingDocumentId)}
                      onClick={() => {
                        setEditFile(null)
                        if (editFileInputRef.current) editFileInputRef.current.value = ''
                      }}
                      type="button"
                    >
                      Bỏ chọn
                    </button>
                  </span>
                )}
              </label>
              {error && (
                <p className="rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
                  {error}
                </p>
              )}
            </div>

            <div className="mt-lg flex flex-col-reverse gap-sm sm:flex-row sm:justify-end">
              <Button
                disabled={Boolean(updatingDocumentId)}
                fullWidth={false}
                onClick={handleCloseEdit}
                type="button"
                variant="ghost"
              >
                Hủy
              </Button>
              <Button
                className="px-lg py-sm"
                disabled={Boolean(updatingDocumentId) || !editTitle.trim()}
                fullWidth={false}
                type="submit"
              >
                {updatingDocumentId ? 'Đang xử lý' : editFile ? 'Thay file và lưu' : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </div>
      )}
      {(detailStatus === 'loading' || selectedDocument) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/40 px-md py-lg">
          <section className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-2xl">
            <header className="flex items-start justify-between gap-md border-b border-outline-variant/20 px-lg py-md">
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface">
                  {selectedDocument?.title || 'Đang tải chi tiết'}
                </h3>
                {selectedDocument && (
                  <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
                    {selectedDocument.original_filename} - {selectedDocument.file_type} - {selectedDocument.chunk_count} đoạn - {selectedDocument.image_count} ảnh
                  </p>
                )}
              </div>
              <Button
                aria-label="Đóng chi tiết tài liệu"
                className="rounded-full p-sm"
                fullWidth={false}
                onClick={handleCloseDetail}
                type="button"
                variant="ghost"
              >
                <Icon name="close" />
              </Button>
            </header>

            <div className="grid min-h-0 flex-1 gap-lg overflow-y-auto p-lg lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
              {detailStatus === 'loading' && (
                <div className="lg:col-span-2 rounded-lg bg-surface-container px-md py-lg font-body-sm text-body-sm text-on-surface-variant">
                  Đang tải các đoạn nội dung và ảnh...
                </div>
              )}

              {selectedDocument && (
                <>
                  <section className="min-w-0">
                    <div className="mb-md flex items-center justify-between gap-md">
                      <h4 className="font-title-md text-title-md text-on-surface">Các đoạn đã xử lý AI</h4>
                      <span className="rounded-full bg-primary-container px-sm py-xs font-label-sm text-label-sm text-on-primary-container">
                        {selectedDocument.chunks.length} đoạn
                      </span>
                    </div>
                    <div className="space-y-md">
                      {selectedDocument.chunks.length === 0 && (
                        <p className="rounded-lg bg-surface-container px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
                          Chưa có đoạn nào cho tài liệu này.
                        </p>
                      )}
                      {selectedDocument.chunks.map((chunk) => (
                        <article
                          className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-md py-md"
                          key={chunk.id}
                        >
                          <div className="flex flex-col justify-between gap-sm md:flex-row md:items-start">
                            <div>
                              <h5 className="font-label-md text-label-md text-on-surface">
                                Đoạn {chunk.chunk_index}
                              </h5>
                              <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
                                {chunk.embedding_model} - {chunk.embedding_dimensions} chiều
                              </p>
                            </div>
                            <span className={`w-fit rounded-full px-sm py-xs font-label-sm text-label-sm ${
                              chunk.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {chunk.status}
                            </span>
                          </div>
                          <p className="mt-md whitespace-pre-line rounded-lg bg-surface-container-lowest px-md py-sm font-body-sm text-body-sm leading-relaxed text-on-surface">
                            {chunk.content}
                          </p>
                          <p className="mt-sm break-all font-body-sm text-body-sm text-on-surface-variant">
                            Mã băm: {chunk.content_hash}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>

                  <aside className="min-w-0">
                    <div className="mb-md flex items-center justify-between gap-md">
                      <h4 className="font-title-md text-title-md text-on-surface">Ảnh trong tài liệu</h4>
                      <span className="rounded-full bg-secondary-container px-sm py-xs font-label-sm text-label-sm text-on-secondary-container">
                        {selectedDocument.images.length} ảnh
                      </span>
                    </div>
                    {selectedDocument.images.length === 0 && (
                      <p className="rounded-lg bg-surface-container px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
                        Tài liệu này không có ảnh đã trích xuất.
                      </p>
                    )}
                    <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-1">
                      {selectedDocument.images.map((image) => (
                        <figure
                          className="overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-low"
                          key={image.id}
                        >
                          <img
                            alt={image.original_name}
                            className="h-48 w-full bg-surface-container object-contain"
                            loading="lazy"
                            src={image.cloudinary_url}
                          />
                          <figcaption className="space-y-xs px-md py-sm">
                            <p className="font-label-sm text-label-sm text-on-surface">{image.original_name}</p>
                            <a
                              className="break-all font-body-sm text-body-sm text-primary"
                              href={image.cloudinary_url}
                              rel="noreferrer"
                              target="_blank"
                            >
                              Mở trên Cloudinary
                            </a>
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </aside>
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </section>
  )
}

export default HospitalDocumentManager
