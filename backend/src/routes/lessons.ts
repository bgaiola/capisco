import { Router } from 'express'
import { requireAuth, requireTier } from '../auth/middleware.js'

const router = Router()

interface LessonPhrase {
  text: string
  context: string
}

interface LessonPack {
  id: string
  emoji: string
  title: string
  description: string
  phrasesByLang: Record<string, LessonPhrase[]>
}

const PACKS: LessonPack[] = [
  {
    id: 'travel',
    emoji: '✈️',
    title: 'Travel essentials',
    description: 'Phrases for airports, hotels, taxis and getting around.',
    phrasesByLang: {
      pt: [
        { text: 'Onde fica o banheiro?', context: 'Asking for the restroom' },
        { text: 'Quanto custa a passagem?', context: 'At a ticket counter' },
        { text: 'Pode me ajudar, por favor?', context: 'Asking for help' },
        { text: 'Estou perdido.', context: 'When you are lost' },
        { text: 'Que horas o hotel abre o café da manhã?', context: 'At the hotel' },
      ],
      es: [
        { text: '¿Dónde está el baño?', context: 'Asking for the restroom' },
        { text: '¿Cuánto cuesta el billete?', context: 'At a ticket counter' },
        { text: '¿Me puedes ayudar, por favor?', context: 'Asking for help' },
        { text: 'Estoy perdido.', context: 'When you are lost' },
        { text: '¿A qué hora abre el desayuno el hotel?', context: 'At the hotel' },
      ],
      en: [
        { text: 'Where is the restroom?', context: 'Asking for the restroom' },
        { text: 'How much is the ticket?', context: 'At a ticket counter' },
        { text: 'Can you help me, please?', context: 'Asking for help' },
        { text: "I'm lost.", context: 'When you are lost' },
        { text: 'What time does the hotel serve breakfast?', context: 'At the hotel' },
      ],
    },
  },
  {
    id: 'restaurant',
    emoji: '🍝',
    title: 'At the restaurant',
    description: 'Order, ask about ingredients, request the bill.',
    phrasesByLang: {
      pt: [
        { text: 'Pode me trazer o cardápio, por favor?', context: 'Asking for the menu' },
        { text: 'Eu sou alérgico a glúten.', context: 'Allergy disclosure' },
        { text: 'Está delicioso, parabéns ao chef.', context: 'A compliment' },
        { text: 'A conta, por favor.', context: 'Asking for the bill' },
        { text: 'Vocês aceitam cartão?', context: 'Payment' },
      ],
      es: [
        { text: '¿Me trae la carta, por favor?', context: 'Asking for the menu' },
        { text: 'Soy alérgico al gluten.', context: 'Allergy disclosure' },
        { text: 'Está buenísimo, mis felicitaciones al chef.', context: 'A compliment' },
        { text: 'La cuenta, por favor.', context: 'Asking for the bill' },
        { text: '¿Aceptan tarjeta?', context: 'Payment' },
      ],
      en: [
        { text: 'Could I see the menu, please?', context: 'Asking for the menu' },
        { text: "I'm allergic to gluten.", context: 'Allergy disclosure' },
        { text: 'This is delicious — compliments to the chef.', context: 'A compliment' },
        { text: 'The check, please.', context: 'Asking for the bill' },
        { text: 'Do you take cards?', context: 'Payment' },
      ],
    },
  },
  {
    id: 'business',
    emoji: '💼',
    title: 'Business meetings',
    description: 'Open meetings, present yourself, agree, follow up.',
    phrasesByLang: {
      pt: [
        { text: 'Obrigado por nos receber hoje.', context: 'Opening a meeting' },
        { text: 'Posso compartilhar minha tela?', context: 'Asking to present' },
        { text: 'Concordo com a sua proposta.', context: 'Agreement' },
        { text: 'Vou enviar um resumo por e-mail.', context: 'Wrap-up' },
        { text: 'Quando podemos marcar o próximo passo?', context: 'Follow-up' },
      ],
      es: [
        { text: 'Gracias por recibirnos hoy.', context: 'Opening a meeting' },
        { text: '¿Puedo compartir mi pantalla?', context: 'Asking to present' },
        { text: 'Estoy de acuerdo con su propuesta.', context: 'Agreement' },
        { text: 'Os enviaré un resumen por correo.', context: 'Wrap-up' },
        { text: '¿Cuándo podemos agendar el siguiente paso?', context: 'Follow-up' },
      ],
      en: [
        { text: 'Thanks for having us today.', context: 'Opening a meeting' },
        { text: 'May I share my screen?', context: 'Asking to present' },
        { text: 'I agree with your proposal.', context: 'Agreement' },
        { text: "I'll send a written summary by email.", context: 'Wrap-up' },
        { text: 'When can we schedule the next step?', context: 'Follow-up' },
      ],
    },
  },
  {
    id: 'small-talk',
    emoji: '☕',
    title: 'Small talk',
    description: 'Break the ice, talk about the weather, weekend plans, hobbies.',
    phrasesByLang: {
      pt: [
        { text: 'Como foi o seu fim de semana?', context: 'Monday morning' },
        { text: 'Que tempo bom hoje, né?', context: 'Weather' },
        { text: 'Você tem algum hobby?', context: 'Hobbies' },
        { text: 'A gente se encontra um dia desses.', context: 'Goodbye' },
        { text: 'Foi um prazer te conhecer.', context: 'After meeting someone' },
      ],
      es: [
        { text: '¿Qué tal tu fin de semana?', context: 'Monday morning' },
        { text: 'Qué buen tiempo hace hoy, ¿eh?', context: 'Weather' },
        { text: '¿Tienes algún pasatiempo?', context: 'Hobbies' },
        { text: 'A ver si nos vemos un día de estos.', context: 'Goodbye' },
        { text: 'Encantado de conocerte.', context: 'After meeting someone' },
      ],
      en: [
        { text: 'How was your weekend?', context: 'Monday morning' },
        { text: 'Lovely weather today, isn’t it?', context: 'Weather' },
        { text: 'Do you have any hobbies?', context: 'Hobbies' },
        { text: 'Let’s catch up sometime.', context: 'Goodbye' },
        { text: 'Nice to meet you.', context: 'After meeting someone' },
      ],
    },
  },
]

router.get('/lessons', requireAuth, requireTier('basic'), (_req, res) => {
  res.json({ packs: PACKS })
})

export { router as lessonsRoute }
