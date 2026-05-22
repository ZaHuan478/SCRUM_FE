import type { ReactNode } from 'react'

type MarkdownContentProps = {
  content: string
  className?: string
}

type MarkdownBlock =
  | { type: 'paragraph'; lines: string[] }
  | { type: 'heading'; level: number; text: string }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'blockquote'; lines: string[] }
  | { type: 'code'; text: string }

const parseInline = (text: string): ReactNode[] => {
  const nodes: ReactNode[] = []
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    const token = match[0]

    if (token.startsWith('**')) {
      nodes.push(
        <strong className="font-semibold" key={`${match.index}-bold`}>
          {token.slice(2, -2)}
        </strong>,
      )
    } else if (token.startsWith('`')) {
      nodes.push(
        <code
          className="rounded bg-surface-container-high px-1 py-0.5 font-mono text-[0.85em]"
          key={`${match.index}-code`}
        >
          {token.slice(1, -1)}
        </code>,
      )
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      const href = linkMatch?.[2] || ''
      const isSafeHref = /^https?:\/\//i.test(href)

      nodes.push(
        isSafeHref ? (
          <a
            className="font-medium text-primary underline underline-offset-2"
            href={href}
            key={`${match.index}-link`}
            rel="noreferrer"
            target="_blank"
          >
            {linkMatch?.[1]}
          </a>
        ) : (
          linkMatch?.[1] || token
        ),
      )
    }

    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

const parseBlocks = (content: string): MarkdownBlock[] => {
  const lines = String(content || '').replace(/\r\n/g, '\n').split('\n')
  const blocks: MarkdownBlock[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmedLine = line.trim()

    if (!trimmedLine) {
      index += 1
      continue
    }

    const headingMatch = trimmedLine.match(/^(#{1,3})\s+(.+)$/)
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2],
      })
      index += 1
      continue
    }

    if (trimmedLine.startsWith('```')) {
      const codeLines: string[] = []
      index += 1

      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index])
        index += 1
      }

      blocks.push({
        type: 'code',
        text: codeLines.join('\n'),
      })
      index += 1
      continue
    }

    if (/^[-*]\s+/.test(trimmedLine)) {
      const items: string[] = []

      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ''))
        index += 1
      }

      blocks.push({
        type: 'unordered-list',
        items,
      })
      continue
    }

    if (/^\d+\.\s+/.test(trimmedLine)) {
      const items: string[] = []

      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ''))
        index += 1
      }

      blocks.push({
        type: 'ordered-list',
        items,
      })
      continue
    }

    if (trimmedLine.startsWith('>')) {
      const quoteLines: string[] = []

      while (index < lines.length && lines[index].trim().startsWith('>')) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ''))
        index += 1
      }

      blocks.push({
        type: 'blockquote',
        lines: quoteLines,
      })
      continue
    }

    const paragraphLines: string[] = []

    while (
      index < lines.length
      && lines[index].trim()
      && !/^(#{1,3})\s+/.test(lines[index].trim())
      && !lines[index].trim().startsWith('```')
      && !/^[-*]\s+/.test(lines[index].trim())
      && !/^\d+\.\s+/.test(lines[index].trim())
      && !lines[index].trim().startsWith('>')
    ) {
      paragraphLines.push(lines[index].trim())
      index += 1
    }

    blocks.push({
      type: 'paragraph',
      lines: paragraphLines,
    })
  }

  return blocks
}

const MarkdownContent = ({ content, className = '' }: MarkdownContentProps) => {
  const blocks = parseBlocks(content)

  return (
    <div className={`space-y-2 font-body-sm text-body-sm leading-relaxed ${className}`}>
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const HeadingTag = block.level === 1 ? 'h3' : block.level === 2 ? 'h4' : 'h5'

          return (
            <HeadingTag className="font-title-sm text-title-sm font-semibold" key={`${index}-heading`}>
              {parseInline(block.text)}
            </HeadingTag>
          )
        }

        if (block.type === 'unordered-list') {
          return (
            <ul className="list-disc space-y-1 pl-5" key={`${index}-ul`}>
              {block.items.map((item, itemIndex) => (
                <li key={`${index}-${itemIndex}`}>{parseInline(item)}</li>
              ))}
            </ul>
          )
        }

        if (block.type === 'ordered-list') {
          return (
            <ol className="list-decimal space-y-1 pl-5" key={`${index}-ol`}>
              {block.items.map((item, itemIndex) => (
                <li key={`${index}-${itemIndex}`}>{parseInline(item)}</li>
              ))}
            </ol>
          )
        }

        if (block.type === 'blockquote') {
          return (
            <blockquote
              className="border-l-4 border-primary/40 pl-3 text-on-surface-variant"
              key={`${index}-quote`}
            >
              {block.lines.map((line, lineIndex) => (
                <p key={`${index}-${lineIndex}`}>{parseInline(line)}</p>
              ))}
            </blockquote>
          )
        }

        if (block.type === 'code') {
          return (
            <pre
              className="max-w-full overflow-x-auto rounded-lg bg-surface-container-high px-sm py-xs font-mono text-[0.82rem]"
              key={`${index}-code`}
            >
              <code>{block.text}</code>
            </pre>
          )
        }

        return (
          <p key={`${index}-paragraph`}>
            {block.lines.map((line, lineIndex) => (
              <span key={`${index}-${lineIndex}`}>
                {lineIndex > 0 && <br />}
                {parseInline(line)}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}

export default MarkdownContent
