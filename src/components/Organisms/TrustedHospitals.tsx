const partners = ['Vinmec', 'FV Hospital', 'Hoàn Mỹ', 'Tâm Anh']

const TrustedHospitals = () => {
  return (
    <section className="border-y border-outline-variant/20 bg-surface-container-low px-lg py-xl md:px-xxl">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-lg">
        <p className="text-center font-label-md text-label-md uppercase tracking-widest text-outline">
          Đối tác với các tổ chức y tế hàng đầu
        </p>
        <div className="flex flex-wrap items-center justify-center gap-lg md:gap-xxl">
          {partners.map((partner) => (
            <span className="font-headline-sm text-headline-sm font-bold text-outline transition-colors hover:text-primary" key={partner}>
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustedHospitals
