import { getPrompts } from './data/promptRepository'
import { PromptCard } from './components/PromptCard/PromptCard'
import styles from './App.module.css'

function App() {
  const prompts = getPrompts()

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Biblioteca de Prompts</h1>
      <ul className={styles.grid}>
        {prompts.map((prompt) => (
          <li key={prompt.id} className={styles.item}>
            <PromptCard prompt={prompt} />
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
