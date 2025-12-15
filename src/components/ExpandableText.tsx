'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ExpandableTextProps {
  html: string
  maxLines?: number
  className?: string
}

export function ExpandableText({ html, maxLines = 20, className = '' }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsTruncation, setNeedsTruncation] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Convert plain text with \n\n to HTML paragraphs if no <p> tags exist
  const processedHtml = useMemo(() => {
    if (!html) return ''
    // If already has paragraph tags, return as-is
    if (html.includes('<p>') || html.includes('<p ')) {
      return html
    }
    // Convert double newlines to paragraph breaks
    const paragraphs = html.split(/\n\n+/)
    return paragraphs
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => `<p>${p.replace(/\n/g, ' ')}</p>`)
      .join('')
  }, [html])

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(contentRef.current).lineHeight) || 24
      const maxHeight = lineHeight * maxLines
      setNeedsTruncation(contentRef.current.scrollHeight > maxHeight + 20)
    }
  }, [processedHtml, maxLines])

  const lineClampStyle = !isExpanded && needsTruncation ? {
    display: '-webkit-box',
    WebkitLineClamp: maxLines,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  } : {}

  return (
    <div>
      <div
        ref={contentRef}
        className={`prose prose-sm max-w-none ${className}`}
        style={lineClampStyle}
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
      {needsTruncation && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 flex items-center gap-1 text-sm font-medium text-detroit-green hover:underline"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Read more
            </>
          )}
        </button>
      )}
    </div>
  )
}
