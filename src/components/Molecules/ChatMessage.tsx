import Icon from '../Atoms/Icon'
import DepartmentSuggestionCard from './DepartmentSuggestionCard'
import DoctorSuggestionCard from './DoctorSuggestionCard'
import MarkdownContent from './MarkdownContent'
import type { AIChatMessage } from '../../types/aiChat.types'

type ChatMessageProps = {
  message: AIChatMessage
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[88%] rounded-2xl px-md py-sm shadow-sm ${
        isUser
          ? 'rounded-br-sm bg-primary text-on-primary'
          : 'rounded-bl-sm bg-surface-container text-on-surface'
      }`}>
        {!isUser && message.warningLevel === 'EMERGENCY' && (
          <div className="mb-sm flex items-start gap-xs rounded-lg bg-error-container px-sm py-xs text-on-error-container">
            <Icon className="text-lg" name="emergency_home" />
            <span className="font-body-sm text-body-sm">Dấu hiệu nguy hiểm, hãy cân nhắc đi cấp cứu ngay.</span>
          </div>
        )}
        {isUser ? (
          <p className="whitespace-pre-line font-body-sm text-body-sm leading-relaxed">{message.content}</p>
        ) : (
          <MarkdownContent content={message.content} />
        )}
        {!isUser && message.documentMatches && message.documentMatches.length > 0 && (
          <div className="mt-md space-y-sm">
            <p className="font-label-sm text-label-sm text-on-surface-variant">Tai lieu lien quan</p>
            {message.documentMatches.map((documentMatch) => (
              <div
                className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-sm py-xs"
                key={`${documentMatch.chunkId}-${documentMatch.rank}`}
              >
                <p className="font-label-sm text-label-sm text-on-surface">
                  Top {documentMatch.rank}: {documentMatch.title}
                </p>
                <p className="mt-1 line-clamp-2 font-body-sm text-body-sm text-on-surface-variant">
                  {documentMatch.content}
                </p>
                <p className="mt-1 font-label-sm text-label-sm text-primary">
                  Similarity {Math.round(Number(documentMatch.similarity || 0) * 100)}%
                </p>
              </div>
            ))}
          </div>
        )}
        {!isUser && message.doctorRecommendations && message.doctorRecommendations.length > 0 && (
          <div className="mt-md space-y-sm">
            <p className="font-label-sm text-label-sm text-on-surface-variant">Bác sĩ phù hợp</p>
            {message.doctorRecommendations.map((doctor) => (
              <DoctorSuggestionCard
                doctor={doctor}
                key={`${doctor.doctorId}-${doctor.departmentId}`}
              />
            ))}
          </div>
        )}
        {!isUser && message.recommendations && message.recommendations.length > 0 && (
          <div className="mt-md space-y-sm">
            <p className="font-label-sm text-label-sm text-on-surface-variant">Khoa đề xuất</p>
            {message.recommendations.map((recommendation) => (
              <DepartmentSuggestionCard
                key={recommendation.departmentId}
                recommendation={recommendation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
