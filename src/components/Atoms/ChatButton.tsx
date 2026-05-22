import Icon from './Icon'

type ChatButtonProps = {
  isOpen: boolean
  onClick: () => void
}

const ChatButton = ({ isOpen, onClick }: ChatButtonProps) => (
  <button
    aria-label={isOpen ? 'Đóng trợ lý AI' : 'Mở trợ lý AI'}
    className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-xl transition-all hover:bg-primary-container hover:shadow-2xl active:scale-95"
    onClick={onClick}
    type="button"
  >
    <Icon className="text-3xl" name={isOpen ? 'close' : 'smart_toy'} />
  </button>
)

export default ChatButton
