import type { LangCode } from '../types/languages'

/**
 * Voice-cloning sample texts. Multiple variants per language so each
 * onboarding attempt picks a fresh one. Each text is ~30s read aloud.
 */
const SAMPLES: Record<LangCode, string[]> = {
  es: [
    `Tengo una teoría: nadie sabe realmente pedir comida en otro idioma. Todos fingimos. Señalas, sonríes, pones cara de que entendiste, y rezas para que no te traigan un plato con tentáculos.

Eso fue exactamente lo que me pasó en Nápoles. Pedí lo que juraba era una margherita. Llegó una bandeja de mariscos con criaturas que no podía ni identificar. Me lo comí todo, claro — porque rechazar comida en Italia es prácticamente un crimen internacional.

Lo mejor de aprender un idioma nuevo es que cada error se convierte en una anécdota para la cena.`,

    `Hay algo mágico en perderse en una ciudad que no conoces. Caminas sin rumbo, sin Google Maps, dejándote llevar por las calles, por el olor del pan recién hecho, por el sonido de la gente discutiendo en una terraza.

La primera vez que me perdí en Lisboa, terminé en un mercado donde nadie hablaba mi idioma. Compré un pastel de nata, un café y me senté a observar. Una hora después, ya conocía a tres abuelas, dos gatos y la receta de la sopa que servían los domingos.

Esos son los momentos que recuerdas. No el museo. La gente.`,

    `El otro día me preguntaron cuál era mi recuerdo favorito de viaje. Pensé en monumentos, en atardeceres, en restaurantes con estrella. Pero al final dije: una tarde de lluvia en Roma, sin paraguas, sin plan, comiendo helado de pistacho dentro de un portal con un perro callejero a mi lado.

Creo que los mejores recuerdos no se planean. Aparecen cuando dejas de intentar que todo salga bien y simplemente caminas, escuchas, hueles, te ríes con desconocidos.

Aprender un idioma es un poco así. Al principio quieres controlarlo todo. Después aceptas que el caos también enseña.`,

    `Confieso algo: yo aprendí a saludar en seis idiomas antes de aprender a pedir el baño en cualquiera de ellos. Es un orden de prioridades cuestionable. Lo descubrí cuando estaba en Atenas, tomando café tras café, sintiéndome muy europeo, hasta que el cuerpo me recordó que existen otras necesidades.

Pregunté con gestos. Una señora muy amable me señaló el camino, riéndose. Salí de allí con una lección clara: el vocabulario de supervivencia primero. Lo poético después.

Desde entonces siempre aprendo tres frases antes de pisar un país nuevo: hola, gracias, y dónde está el baño.`,
  ],

  en: [
    `I have a theory: nobody actually knows how to order food in a foreign language. We all just pretend. You point, smile, nod like you understood, and pray they don't bring you a plate of tentacles.

That's exactly what happened to me in Naples. I ordered what I was absolutely certain was a margherita pizza. What arrived was a seafood platter with creatures I couldn't even identify. I ate everything, of course — because refusing food in Italy is basically an international crime.

The best part of learning a new language is that every mistake becomes a dinner party story.`,

    `There's something magical about getting lost in a city you don't know. You walk without a plan, without Google Maps, letting yourself be pulled by the streets, by the smell of fresh bread, by the sound of people arguing on a sunny terrace.

The first time I got lost in Lisbon, I ended up in a market where nobody spoke my language. I bought a pastel de nata, a coffee, and sat down to watch. An hour later I knew three grandmothers, two cats, and the recipe for the soup they served on Sundays.

Those are the moments you remember. Not the museum. The people.`,

    `The other day someone asked me what my favourite travel memory was. I thought about landmarks, sunsets, restaurants with stars on the door. But in the end I said: a rainy afternoon in Rome, no umbrella, no plan, eating pistachio gelato inside a doorway with a stray dog next to me.

I think the best memories aren't planned. They show up when you stop trying to control the day and just walk, listen, smell, laugh with strangers.

Learning a language is a bit like that. You want to control everything. Then you accept that chaos teaches you too.`,

    `I'll confess something: I learned how to say hello in six languages before learning how to ask for a bathroom in any of them. It's a questionable order of priorities. I figured this out in Athens, drinking coffee after coffee, feeling very cosmopolitan, until my body reminded me that other needs exist.

I asked with gestures. A very kind woman pointed me the way, laughing. I walked out with a clear lesson: survival vocabulary first, poetry second.

Now I always learn three phrases before stepping into a new country: hello, thank you, and where's the bathroom.`,
  ],

  pt: [
    `Eu tenho uma teoria: ninguém realmente sabe pedir comida em outro idioma. A gente finge. Você aponta, sorri, faz cara de quem entendeu, e torce pra não chegar um prato com tentáculos.

Foi exatamente o que aconteceu comigo em Nápoles. Pedi o que eu jurava ser uma margherita. Chegou uma travessa de frutos do mar que eu não conseguia nem identificar. Comi tudo, claro — porque recusar comida na Itália é praticamente um crime internacional.

O melhor de aprender um idioma novo é que cada erro vira uma história que você conta rindo no jantar.`,

    `Tem uma coisa mágica em se perder numa cidade que você não conhece. Você anda sem rumo, sem Google Maps, se deixando levar pelas ruas, pelo cheiro do pão saindo do forno, pelo som de gente discutindo numa varanda ensolarada.

A primeira vez que me perdi em Lisboa, fui parar num mercado onde ninguém falava meu idioma. Comprei um pastel de nata, um café e sentei pra observar. Uma hora depois, já conhecia três senhoras, dois gatos e a receita da sopa que faziam aos domingos.

São esses os momentos que a gente lembra. Não o museu. As pessoas.`,

    `Outro dia me perguntaram qual era minha lembrança favorita de viagem. Pensei em monumentos, em pôres do sol, em restaurantes com estrela. Mas no fim respondi: uma tarde de chuva em Roma, sem guarda-chuva, sem plano, comendo sorvete de pistache dentro de uma portaria com um cachorro de rua do meu lado.

Acho que as melhores memórias não são planejadas. Elas aparecem quando você para de tentar controlar tudo e só caminha, escuta, cheira, ri com estranhos.

Aprender um idioma é um pouco assim. No começo você quer dominar tudo. Depois aceita que o caos também ensina.`,

    `Confesso uma coisa: aprendi a cumprimentar em seis idiomas antes de aprender a pedir o banheiro em qualquer um deles. É uma ordem de prioridades questionável. Descobri isso em Atenas, tomando café atrás de café, me sentindo muito cosmopolita, até o corpo lembrar que existem outras necessidades.

Perguntei por mímica. Uma senhora muito gentil me apontou o caminho, dando risada. Saí de lá com uma lição clara: vocabulário de sobrevivência primeiro. Poesia depois.

Desde então sempre aprendo três frases antes de pisar num país novo: oi, obrigado, e onde fica o banheiro.`,
  ],
}

/** Simple non-cryptographic random pick. */
export function pickSampleText(code: LangCode, exclude?: string): string {
  const list = SAMPLES[code] ?? SAMPLES.en
  if (list.length === 1) return list[0]
  let pick = list[Math.floor(Math.random() * list.length)]
  // Avoid repeating the exact same text twice in a row.
  if (exclude && pick === exclude) {
    pick = list[(list.indexOf(pick) + 1) % list.length]
  }
  return pick
}

/** Preview phrase per target language for the post-clone preview. */
export const PREVIEW_PHRASES: Record<LangCode, string> = {
  en: "Hello, it's me!",
  es: '¡Hola, soy yo!',
  pt: 'Olá, sou eu!',
}
