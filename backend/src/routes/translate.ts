import { Router } from 'express'
import translateModule from 'google-translate-api-x'

// google-translate-api-x exports differ between ESM/CJS — normalize
const translate = (typeof translateModule === 'function'
  ? translateModule
  : (translateModule as any).default ?? translateModule) as (
  text: string,
  opts: { from: string; to: string },
) => Promise<{ text: string }>

const router = Router()

/**
 * Dicionário de notas culturais para enriquecer a resposta.
 * Mapeamos padrões por par de idiomas.
 */
const CULTURAL_NOTES: Record<string, Array<{ pattern: RegExp; note: string }>> = {
  'pt→it': [
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
  ],
  'es→it': [
    { pattern: /\b(vale|guay|mola)\b/i, note: "In Italian: 'figo', 'forte', 'bello'. Spanish 'vale' = Italian 'va bene'." },
    { pattern: /\b(tío|tía)\b/i, note: "'Tío/tía' as slang = Italian 'amico/amica' or 'tipo/tipa'." },
  ],
  'en→it': [
    { pattern: /\b(cool|awesome)\b/i, note: "Italian equivalents: 'figo', 'fantastico', 'forte'. 'Cool' is sometimes used as-is in Italian slang." },
    { pattern: /\b(guys)\b/i, note: "Italian: 'ragazzi' (mixed/male group) or 'ragazze' (all female)." },
  ],
  'fr→it': [
    { pattern: /\b(sympa|cool|chouette)\b/i, note: "En italien: 'simpatico', 'figo', 'bello'. Le français 'sympa' est proche de l'italien 'simpatico'." },
  ],
}

const GENERIC_TIPS: Record<string, string> = {
  it: 'Tip: listen to the Italian pronunciation several times to memorize the natural intonation.',
  pt: 'Dica: ouça a pronúncia várias vezes para memorizar a entonação natural.',
  es: 'Consejo: escucha la pronunciación varias veces para memorizar la entonación natural.',
  en: 'Tip: listen to the pronunciation several times to memorize the natural intonation.',
  fr: 'Conseil: écoutez la prononciation plusieurs fois pour mémoriser l\'intonation naturelle.',
  zh: '提示：多听几次发音，记住自然的语调。',
  ru: 'Совет: прослушайте произношение несколько раз, чтобы запомнить естественную интонацию.',
  nl: 'Tip: luister meerdere keren naar de uitspraak om de natuurlijke intonatie te onthouden.',
}

function getCulturalNote(originalText: string, from: string, to: string): string {
  // Try exact pair first, then any pair ending with 'to'
  const pairKey = `${from}→${to}`
  const notes = CULTURAL_NOTES[pairKey]
  if (notes) {
    for (const { pattern, note } of notes) {
      if (pattern.test(originalText)) {
        return note
      }
    }
  }
  return GENERIC_TIPS[from] || GENERIC_TIPS['en']
}

router.post('/translate', async (req, res) => {
  try {
    const { text, from = 'pt', to = 'it' } = req.body

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Campo "text" é obrigatório' })
      return
    }

    const result = await translate(text, { from, to })

    const traducao = result.text
    const notas = getCulturalNote(text, from, to)

    res.json({ traducao, notas })
  } catch (error) {
    console.error('Translation error:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Erro interno ao traduzir',
    })
  }
})

export { router as translateRoute }
