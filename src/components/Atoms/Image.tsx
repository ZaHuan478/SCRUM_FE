import Icon from './Icon'

type ImageProps = {
  src?: string
  alt?: string
  className?: string
  fallbackClassName?: string
}

const Image = ({ src, alt = '', className = '', fallbackClassName = '' }: ImageProps) => {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-surface-variant text-outline ${fallbackClassName || className}`}>
        <Icon name="image" className="text-5xl" />
      </div>
    )
  }

  return <img alt={alt} className={className} src={src} />
}

export default Image
