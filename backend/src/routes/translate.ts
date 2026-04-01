import { Router } from 'express'
import translate from 'google-translate-api-x'

const router = Router()

/**
 * Dicionário de notas culturais PT→IT para enriquecer a resposta.
 * Mapeamos palavras/padrões comuns do português coloquial brasileiro
 * para dicas úteis sobre o equivalente italiano.
 */
const CULTURAL_NOTES: Array<{ pattern: RegExp; note: string }> = [
  { pattern: /\b(cara|mano|véi|velho)\b/i, note: "Em italiano, expressões como 'amico', 'fratello' ou 'dai' são usadas como equivalentes coloquiais." },
  { pattern: /\b(saudade)\b/i, note: "'Saudade' não tem tradução direta em italiano. 'Nostalgia' ou 'mi manchi' (sinto sua falta) são as aproximações mais comuns." },
  { pattern: /\b(tá|está)\s+(muito|bem)\b/i, note: "O superlativo italiano com '-issimo' (buonissimo, bellissimo) é muito usado coloquialmente para intensificar." },
  { pattern: /\b(legal|bacana|massa|top)\b/i, note: "Em italiano coloquial: 'figo/a', 'forte', 'ganzo/a' (toscano) ou simplesmente 'bello/a'." },
  { pattern: /\b(valeu|falou|tmj)\b/i, note: "Despedidas informais italianas: 'ci vediamo', 'alla prossima', 'a dopo'." },
  { pattern: /\b(bom\s+dia|boa\s+tarde|boa\s+noite)\b/i, note: "Italianos usam: 'buongiorno' (manhã/tarde), 'buonasera' (a partir das 17h), 'buonanotte' (ao se despedir à noite)." },
  { pattern: /\b(com\s+certeza|claro)\b/i, note: "'Certo', 'sicuro', 'senz'altro' são equivalentes italianos comuns." },
  { pattern: /\b(pô|putz|caramba|nossa)\b/i, note: "Interjeições italianas: 'cavolo', 'accidenti', 'mamma mia', 'caspita'." },
  { pattern: /\b(beleza|de\s+boa|suave)\b/i, note: "'Va bene', 'tutto a posto', 'tranquillo' são as formas italianas equivalentes." },
  { pattern: /\b(obrigad[oa])\b/i, note: "'Grazie' é universal. Para mais ênfase: 'grazie mille', 'ti ringrazio'." },
]

function getCulturalNote(originalText: string): string {
  for (const { pattern, note } of CULTURAL_NOTES) {
    if (pattern.test(originalText)) {
      return note
    }
  }
  return 'Dica: tente ouvir a pronúncia italiana várias vezes para memorizar a entonação natural.'
}

router.post('/translate', async (req, res) => {
  try {
    const { text } = req.body

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Campo "text" é obrigatório' })
      return
    }

    const result = await translate(text, { from: 'pt', to: 'it' })

    const traducao = result.text
    const notas = getCulturalNote(text)

    res.json({ traducao, notas })
  } catch (error) {
    console.error('Translation error:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Erro interno ao traduzir',
    })
  }
})

export { router as translateRoute }
