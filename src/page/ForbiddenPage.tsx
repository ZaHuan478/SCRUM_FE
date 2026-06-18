import { Link } from 'react-router-dom'

const ForbiddenPage = () => (
  <main className="flex min-h-screen items-center justify-center bg-background px-lg text-on-background">
    <section className="w-full max-w-lg rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-xl text-center shadow-[0px_12px_30px_rgba(15,23,42,0.08)]">
      <h1 className="font-headline-md text-headline-md text-on-surface">Khong co quyen truy cap</h1>
      <p className="mt-md font-body-md text-body-md text-on-surface-variant">
        Tai khoan cua ban khong co quyen su dung chuc nang nay.
      </p>
      <Link
        className="mt-xl inline-flex min-h-11 items-center rounded bg-primary px-lg py-sm font-label-md text-label-md uppercase tracking-[0.7px] text-on-primary transition-colors hover:bg-primary-container"
        to="/"
      >
        Ve trang chu
      </Link>
    </section>
  </main>
)

export default ForbiddenPage
