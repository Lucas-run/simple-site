import { useState } from 'react'
import type { Prompt } from '../../data/promptRepository'
import { CopyButton } from '../CopyButton/CopyButton'
import { PromptModal } from '../PromptModal/PromptModal'
import styles from './PromptCard.module.css'

const PREVIEW_LENGTH = 160

function makePreview(body: string): string {
  if (body.length <= PREVIEW_LENGTH) return body
  return `${body.slice(0, PREVIEW_LENGTH)}…`
}

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <article className={styles.root}>
      <div className={styles.header}>
        <h3 className={styles.title}>{prompt.title}</h3>
        <CopyButton text={prompt.body} />
      </div>
      <p className={styles.category}>{prompt.category}</p>
      <ul className={styles.tags}>
        {prompt.tags.map((tag) => (
          <li key={tag} className={styles.tag}>
            {tag}
          </li>
        ))}
      </ul>
      <p className={styles.preview}>{makePreview(prompt.body)}</p>
      <button type="button" className={styles.read} onClick={() => setIsOpen(true)}>
        Ler
      </button>
      {isOpen && <PromptModal prompt={prompt} onClose={() => setIsOpen(false)} />}
    </article>
  )
}
