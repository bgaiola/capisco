import type { LangCode } from '../types/languages'

/**
 * Voice-cloning sample texts. Multiple variants per language so each
 * onboarding attempt picks a fresh one. Each text reads in ~30s aloud.
 *
 * For languages where we have a single, high-quality variant we keep just
 * that one (we'd rather repeat a good text than ship machine-translated
 * filler that hurts the voice clone).
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

  it: [
    `Ho una teoria: nessuno sa davvero ordinare da mangiare in una lingua straniera. Facciamo tutti finta. Indichi, sorridi, fai la faccia di chi ha capito, e preghi che non ti portino un piatto di tentacoli.

È esattamente quello che mi è successo a Napoli. Ho ordinato quella che giuravo fosse una margherita. È arrivato un vassoio di frutti di mare con creature che non riuscivo nemmeno a identificare. Ho mangiato tutto, ovviamente — perché rifiutare il cibo in Italia è praticamente un crimine internazionale.

La cosa migliore dell'imparare una lingua nuova è che ogni errore diventa una storia da raccontare ridendo a cena.`,

    `C'è qualcosa di magico nel perdersi in una città che non conosci. Cammini senza meta, senza Google Maps, lasciandoti trascinare dalle strade, dal profumo del pane appena sfornato, dal suono di gente che discute su un balcone al sole.

La prima volta che mi sono perso a Lisbona, sono finito in un mercato dove nessuno parlava la mia lingua. Ho comprato un pastel de nata, un caffè e mi sono seduto a guardare. Un'ora dopo conoscevo tre signore, due gatti e la ricetta della zuppa che servivano la domenica.

Sono quei momenti che resti. Non il museo. Le persone.`,

    `L'altro giorno mi hanno chiesto qual era il mio ricordo di viaggio preferito. Ho pensato a monumenti, tramonti, ristoranti stellati. Alla fine ho detto: un pomeriggio di pioggia a Roma, senza ombrello, senza piano, mangiando un gelato al pistacchio dentro un portone con un cane randagio accanto.

Credo che i ricordi migliori non si programmino. Arrivano quando smetti di voler controllare tutto e cammini, ascolti, ridi con sconosciuti.

Imparare una lingua è un po' così. All'inizio vuoi dominare tutto. Poi accetti che anche il caos insegna.`,
  ],

  fr: [
    `J'ai une théorie : personne ne sait vraiment commander à manger dans une langue étrangère. On fait tous semblant. Tu pointes du doigt, tu souris, tu fais comme si tu avais compris, et tu pries pour qu'on ne t'apporte pas une assiette de tentacules.

C'est exactement ce qui m'est arrivé à Naples. J'ai commandé ce que je jurais être une margherita. Ce qui est arrivé, c'était un plateau de fruits de mer avec des créatures que je ne pouvais même pas identifier. J'ai tout mangé, évidemment — parce que refuser de la nourriture en Italie, c'est pratiquement un crime international.

Le meilleur quand on apprend une nouvelle langue, c'est que chaque erreur devient une histoire qu'on raconte en riant au dîner.`,

    `Il y a quelque chose de magique à se perdre dans une ville qu'on ne connaît pas. Tu marches sans but, sans Google Maps, en te laissant porter par les rues, par l'odeur du pain qui sort du four, par le bruit des gens qui discutent sur une terrasse ensoleillée.

La première fois que je me suis perdu à Lisbonne, j'ai atterri dans un marché où personne ne parlait ma langue. J'ai acheté un pastel de nata, un café, et je me suis assis pour observer. Une heure plus tard, je connaissais trois grand-mères, deux chats et la recette de la soupe qu'elles servaient le dimanche.

Ce sont ces moments-là qu'on garde. Pas le musée. Les gens.`,

    `L'autre jour, on m'a demandé quel était mon meilleur souvenir de voyage. J'ai pensé aux monuments, aux couchers de soleil, aux restaurants étoilés. Mais finalement j'ai dit : un après-midi pluvieux à Rome, sans parapluie, sans plan, à manger une glace à la pistache sous un porche avec un chien errant à côté de moi.

Je crois que les meilleurs souvenirs ne se planifient pas. Ils arrivent quand tu arrêtes d'essayer de tout contrôler et que tu marches, écoutes, ris avec des inconnus.

Apprendre une langue, c'est un peu pareil. Au début tu veux tout maîtriser. Ensuite tu acceptes que le chaos t'apprend aussi.`,
  ],

  zh: [
    `我有一个理论：没有人真正知道怎么用外语点餐。我们都在假装。你指着菜单，微笑，装出听懂了的样子，然后祈祷他们不会端上一盘触手。

这正是我在那不勒斯经历的事情。我点了我发誓是一份玛格丽特披萨的东西。结果端上来的是一大盘海鲜，里面的生物我连名字都叫不出来。我当然全吃了——因为在意大利拒绝食物基本上就是国际犯罪。

学习新语言最棒的地方在于，每个错误都会变成一个让你在晚餐时笑着讲述的故事。`,

    `在一个不熟悉的城市里迷路，是有一种魔力的。你漫无目的地走着，没有地图，让自己跟着街道走，跟着刚出炉的面包香味走，跟着阳台上人们争论的声音走。

我第一次在里斯本迷路的时候，最后走进了一个没人会说我语言的市场。我买了一个蛋挞，一杯咖啡，坐下来观察。一个小时后，我已经认识了三位老奶奶、两只猫，还学到了她们星期天卖的那道汤的做法。

那才是你会记住的瞬间。不是博物馆，是人。`,
  ],

  ru: [
    `У меня есть теория: никто на самом деле не умеет заказывать еду на иностранном языке. Мы все притворяемся. Ты показываешь пальцем, улыбаешься, делаешь вид, что всё понял, и молишься, чтобы тебе не принесли тарелку с щупальцами.

Именно это и случилось со мной в Неаполе. Я заказал то, что был абсолютно уверен — маргариту. Принесли поднос с морепродуктами и существами, которых я даже не мог опознать. Я всё съел, конечно — потому что отказаться от еды в Италии — это практически международное преступление.

Лучшее в изучении нового языка — каждая ошибка превращается в историю для ужина.`,

    `Есть что-то волшебное в том, чтобы заблудиться в незнакомом городе. Ты идёшь без цели, без карт в телефоне, позволяя улицам, запаху свежего хлеба и голосам людей на освещённой солнцем террасе вести тебя.

Когда я впервые заблудился в Лиссабоне, я оказался на рынке, где никто не говорил на моём языке. Я купил пирожное, кофе и сел наблюдать. Через час я уже знал трёх бабушек, двух кошек и рецепт супа, который подавали по воскресеньям.

Именно такие моменты остаются. Не музей. Люди.`,
  ],

  nl: [
    `Ik heb een theorie: niemand weet echt hoe je eten moet bestellen in een vreemde taal. We doen allemaal alsof. Je wijst, glimlacht, doet alsof je het begrepen hebt, en bidt dat ze geen bord met tentakels brengen.

Dat is precies wat mij overkwam in Napels. Ik bestelde wat ik zeker wist een margherita was. Wat er kwam was een schaal zeevruchten met wezens die ik niet eens kon identificeren. Ik at alles op, natuurlijk — want eten weigeren in Italië is praktisch een internationaal misdrijf.

Het beste van een nieuwe taal leren is dat elke fout een verhaal wordt dat je lachend vertelt bij het avondeten.`,

    `Er is iets magisch aan verdwalen in een stad die je niet kent. Je loopt zonder doel, zonder Google Maps, je laat je meedrijven door de straten, door de geur van vers brood, door het geluid van mensen die op een zonnig terras zitten te discussiëren.

De eerste keer dat ik in Lissabon verdwaalde, kwam ik terecht op een markt waar niemand mijn taal sprak. Ik kocht een pastel de nata, een koffie en ging zitten om te kijken. Een uur later kende ik drie oma's, twee katten en het recept van de soep die ze op zondag serveerden.

Dat zijn de momenten die je je herinnert. Niet het museum. De mensen.`,
  ],
}

/** Simple non-cryptographic random pick. */
export function pickSampleText(code: LangCode, exclude?: string): string {
  const list = SAMPLES[code] ?? SAMPLES.en
  if (list.length === 1) return list[0]
  let pick = list[Math.floor(Math.random() * list.length)]
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
  it: 'Ciao, sono io!',
  fr: "Bonjour, c'est moi !",
  zh: '你好，是我！',
  ru: 'Привет, это я!',
  nl: 'Hallo, ik ben het!',
}
