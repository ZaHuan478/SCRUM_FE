import TopNavBar from '../Organisms/TopNavBar'
import DoctorSideNav from '../Organisms/DoctorSchedule/DoctorSideNav'
import ProfileAvatarCard from '../Organisms/Profile/ProfileAvatarCard'
import ProfileDocumentImageCard from '../Organisms/Profile/ProfileDocumentImageCard'
import ProfileHero from '../Organisms/Profile/ProfileHero'
import ProfileIdentitySection from '../Organisms/Profile/ProfileIdentitySection'
import ProfileTopBar from '../Organisms/Profile/ProfileTopBar'
import type { ProfileState } from '../../hooks/useProfile'
import ProfilePasswordSection from '../Organisms/Profile/ProfilePasswordSection'

type ProfileTemplateProps = ProfileState & {
  onLogout: () => void
}

const ProfileTemplate = ({
  avatarInputRef,
  cccdValid,
  clearAvatar,
  clearImage,
  doctorDepartmentValue,
  doctorDescriptionValue,
  emailMatches,
  error,
  form,
  handleImageChange,
  handleSubmit,
  isSaving,
  phoneValid,
  status,
  success,
  updateField,
  user,
  onLogout,
}: ProfileTemplateProps) => {
  const profileContent = (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-xl px-lg py-xl md:px-xxl md:py-xxl">
      <ProfileHero avatarUrl={form.avatarUrl} user={user} />

      <div className="grid grid-cols-1 items-start gap-xl lg:grid-cols-3">
        <form className="lg:col-span-3" onSubmit={(event) => {
          void handleSubmit(event)
        }}>
          <ProfileIdentitySection
            cccdValid={cccdValid}
            doctorDepartmentValue={doctorDepartmentValue}
            doctorDescriptionValue={doctorDescriptionValue}
            emailMatches={emailMatches}
            error={error}
            form={form}
            isSaving={isSaving}
            onFieldChange={updateField}
            phoneValid={phoneValid}
            status={status}
            success={success}
            userRole={user.role}
          />
        </form>
        <ProfilePasswordSection onAuthFailure={onLogout} />
        <ProfileAvatarCard
          avatarInputRef={avatarInputRef}
          avatarUrl={form.avatarUrl}
          isSaving={isSaving}
          onAvatarChange={(event) => {
            void handleImageChange(event, 'avatarUrl', 'Ảnh đại diện')
          }}
          onClearAvatar={clearAvatar}
        />

        <ProfileDocumentImageCard
          imageAlt="CCCD mặt trước"
          imageLabel="Ảnh CCCD mặt trước"
          imageUrl={form.cccdFrontImage}
          onChange={(event) => {
            void handleImageChange(event, 'cccdFrontImage', 'Ảnh CCCD')
          }}
          onClear={() => clearImage('cccdFrontImage')}
          title="CCCD mặt trước"
        />

        <ProfileDocumentImageCard
          imageAlt="CCCD mặt sau"
          imageLabel="Ảnh CCCD mặt sau"
          imageUrl={form.cccdBackImage}
          onChange={(event) => {
            void handleImageChange(event, 'cccdBackImage', 'Ảnh CCCD')
          }}
          onClear={() => clearImage('cccdBackImage')}
          title="CCCD mặt sau"
        />


      </div>
    </main>
  )

  if (user.role === 'DOCTOR') {
    return (
      <div className="flex min-h-screen bg-background text-on-background">
        <DoctorSideNav onLogout={onLogout} />
        <div className="flex min-w-0 flex-grow flex-col">
          <ProfileTopBar onLogout={onLogout} user={user} />
          {profileContent}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNavBar active="about" />
      {profileContent}
    </div>
  )
}

export default ProfileTemplate
