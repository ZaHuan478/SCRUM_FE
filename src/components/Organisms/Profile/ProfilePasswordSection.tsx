import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../../Atoms/Button'
import Icon from '../../Atoms/Icon'
import Input from '../../Atoms/Input'
import { changeCurrentUserPassword } from '../../../services/user.service'
import { isAuthFailure } from '../../../utils/profile'

type ProfilePasswordSectionProps = {
    onAuthFailure: () => void
}

type PasswordFormState = {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

const emptyPasswordForm: PasswordFormState = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
}

const ProfilePasswordSection = ({ onAuthFailure }: ProfilePasswordSectionProps) => {
    const [form, setForm] = useState<PasswordFormState>(emptyPasswordForm)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const updateField = (field: keyof PasswordFormState, value: string) => {
        setForm((currentForm) => ({
            ...currentForm,
            [field]: value,
        }))
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setSuccess('')

        const currentPassword = form.currentPassword.trim()
        const newPassword = form.newPassword.trim()
        const confirmPassword = form.confirmPassword.trim()

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu mới.')
            return
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự.')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Xác nhận mật khẩu mới không khớp.')
            return
        }

        if (currentPassword === newPassword) {
            setError('Mật khẩu mới không được trùng với mật khẩu hiện tại.')
            return
        }

        setIsSaving(true)

        try {
            await changeCurrentUserPassword({
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            })
            setForm(emptyPasswordForm)
            setSuccess('Mật khẩu đã được cập nhật.')
        } catch (requestError) {
            if (isAuthFailure(requestError)) {
                onAuthFailure()
                return
            }

            setError(requestError instanceof Error ? requestError.message : 'Không thể đổi mật khẩu.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-md shadow-sm lg:col-span-3" onSubmit={(event) => {
            void handleSubmit(event)
        }}>
            <div className="mb-lg flex items-center gap-sm">
                <Icon className="text-primary" name="lock" />
                <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">Đổi mật khẩu</h2>

                </div>
            </div>

            {(error || success) && (
                <p className={`mb-lg rounded-lg px-md py-sm font-body-sm text-body-sm ${error ? 'bg-error-container text-on-error-container' : 'bg-secondary-fixed text-on-secondary-fixed'}`}>
                    {error || success}
                </p>
            )}

            <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
                <Input
                    autoComplete="current-password"
                    id="profile-current-password"
                    label="Mật khẩu hiện tại"
                    onChange={(event) => updateField('currentPassword', event.target.value)}
                    required
                    type="password"
                    value={form.currentPassword}
                />

                <Input
                    autoComplete="new-password"
                    error={form.newPassword && form.newPassword.trim().length < 6 ? 'Ít nhất 6 ký tự.' : undefined}
                    id="profile-new-password"
                    label="Mật khẩu mới"
                    onChange={(event) => updateField('newPassword', event.target.value)}
                    required
                    type="password"
                    value={form.newPassword}
                />

                <Input
                    autoComplete="new-password"
                    error={form.confirmPassword && form.newPassword !== form.confirmPassword ? 'Mật khẩu xác nhận không khớp.' : undefined}
                    id="profile-confirm-password"
                    label="Xác nhận mật khẩu mới"
                    onChange={(event) => updateField('confirmPassword', event.target.value)}
                    required
                    type="password"
                    value={form.confirmPassword}
                />
            </div>

            <div className="mt-xl flex flex-col gap-md border-t border-outline-variant/30 pt-lg sm:flex-row sm:justify-between">
                <Button className="px-lg py-sm" fullWidth={false} isLoading={isSaving} type="submit">
                    Cập nhật mật khẩu
                </Button>
            </div>
        </form>
    )
}

export default ProfilePasswordSection