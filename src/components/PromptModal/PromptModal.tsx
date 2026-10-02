import { useEffect, useRef } from 'react'
import type { Prompt } from '../../data/promptRepository'
import { CopyButton } from '../CopyButton/CopyButton'
import styles from './PromptModal.module.css'

export function PromptModal({ prompt, onClose }: { prompt: Prompt; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const close = () => {
    dialogRef.current?.close()
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) close()
      }}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>{prompt.title}</h2>
        <pre className={styles.body}>{prompt.body}</pre>
        <div className={styles.actions}>
          <CopyButton text={prompt.body} />
          <button type="button" className={styles.close} onClick={close}>
            Fechar
          </button>
        </div>
      </div>
    </dialog>
  )
}
