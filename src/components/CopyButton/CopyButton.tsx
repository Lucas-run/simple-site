import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import styles from './CopyButton.module.css'

export function CopyButton({ text }: { text: string }) {
  const { status, copy } = useCopyToClipboard()

  const label = status === 'copied' ? 'Copiado' : status === 'error' ? 'Erro' : 'Copiar'
  const announcement =
    status === 'copied' ? 'Prompt copiado' : status === 'error' ? 'Falha ao copiar' : ''

  return (
    <>
      <button
        type="button"
        className={styles.root}
        data-state={status}
        onClick={() => copy(text)}
      >
        {label}
      </button>
      <span className={styles.srOnly} role="status" aria-live="polite">
        {announcement}
      </span>
    </>
  )
}
