export interface Requirement {
  id: string
  description: string
  completed?: boolean
  subRequirements?: Requirement[]
  noGeneration?: boolean
}

export interface ClassSection {
  title: string
  requirements: Requirement[]
}

export interface PathfinderClass {
  id: string
  name: string
  url?: string
  color: string
  type: 'regular' | 'advanced'
  minAge: number
  sections: ClassSection[]
}



export const classes: PathfinderClass[] = [
  {
    "id": "amigo",
    "name": "Amigo",
    "url": "https://mda.wiki.br/Cart%C3%A3o_de_Amigo/",
    "minAge": 10,
    "color": "blue",
    "type": "regular",
    "sections": [
      {
        "title": "I - Geral",
        "requirements": [
          {
            "id": "amigo-1-1",
            "description": "Ter, no mínimo, 10 anos de idade."
          },
          {
            "id": "amigo-1-2",
            "description": "Ser membro ativo do Clube de Desbravadores."
          },
          {
            "id": "amigo-1-3",
            "description": "Memorizar e explicar o Voto e a Lei do Desbravador."
          },
          {
            "id": "amigo-1-4",
            "description": "Ler o livro do Clube do livro Juvenil do ano em curso."
          },
          {
            "id": "amigo-1-5",
            "description": "Ler o livro \"Vaso de barro\"."
          },
          {
            "id": "amigo-1-6",
            "description": "Participar ativamente da classe bíblica do seu clube."
          }
        ]
      },
      {
        "title": "II - Descoberta Espiritual",
        "requirements": [
          {
            "id": "amigo-2-1",
            "description": "Memorizar e demonstrar seu conhecimento:"
          },
          {
            "id": "amigo-2-2",
            "description": "Criação: o que Deus criou em cada dia da Criação."
          },
          {
            "id": "amigo-2-3",
            "description": "10 pragas: quais as pragas que caíram sobre o Egito."
          },
          {
            "id": "amigo-2-4",
            "description": "12 Tribos: o nome de cada uma das 12 tribos de Israel."
          },
          {
            "id": "amigo-2-5",
            "description": "39 livros do Antigo Testamento e demonstre habilidade para encontrar qualquer um deles."
          },
          {
            "id": "amigo-2-6",
            "description": "Ler e explicar os versos abaixo:"
          },
          {
            "id": "amigo-2-7",
            "description": "João 3:16"
          },
          {
            "id": "amigo-2-8",
            "description": "Efésios 6:1-3"
          },
          {
            "id": "amigo-2-9",
            "description": "II Timóteo 3:16"
          },
          {
            "id": "amigo-2-10",
            "description": "Salmo 1"
          },
          {
            "id": "amigo-2-11",
            "description": "Leitura Bíblica:"
          },
          {
            "id": "amigo-2-12",
            "description": "Gênesis: 1, 2, 3, 4:1-16, 6:11-22, 7, 8, 9:1-19, 11:1-9, 12:1-10, 13, 14:18-24, 15, 17:1-8; 15-22, 18:1-15, 18: 16-33, 19:1-29, 21:1-21, 22:1-19, 23, 24:1-46, 48, 24:52-67, 27, 28, 29, 30:25-31; 31:2-3, 17-18, 32, 33, 37, 40, 41, 42, 43, 44, 45, 47, 50"
          },
          {
            "id": "amigo-2-13",
            "description": "Êxodo: 1, 2, 3, 4:1-17; 27-31, 5, 7, 8, 9, 10; 11, 12, 13:17-22; 14, 15:22-27; 16, 17, 18, 19, 20, 24, 32, 33, 34:1-14; 29-35, 35:4-29 e 40"
          }
        ]
      },
      {
        "title": "III - Servindo a Outros",
        "requirements": [
          {
            "id": "amigo-3-1",
            "description": "Dedicar duas horas ajudando alguém em sua comunidade, através de duas das seguintes atividades:"
          },
          {
            "id": "amigo-3-2",
            "description": "Visitar alguém que precisa de amizade e orar com essa pessoa."
          },
          {
            "id": "amigo-3-3",
            "description": "Oferecer alimento a alguém carente."
          },
          {
            "id": "amigo-3-4",
            "description": "Participar de um projeto ecológico ou educativo."
          },
          {
            "id": "amigo-3-5",
            "description": "Escrever uma redação explicando como ser um bom cidadão no lar e na escola."
          }
        ]
      },
      {
        "title": "IV - Desenvolvendo Amizade",
        "requirements": [
          {
            "id": "amigo-4-1",
            "description": "Mencionar dez qualidades de um bom amigo e apresentar quatro situações diárias onde você praticou a Regra Áurea de Mateus 7:12."
          },
          {
            "id": "amigo-4-2",
            "description": "Saber cantar o Hino Nacional de seu país e conhecer sua história. Saber o nome do autor da letra e da música do hino."
          }
        ]
      },
      {
        "title": "V - Saúde e Aptidão Física",
        "requirements": [
          {
            "id": "amigo-5-1",
            "description": "Completar uma das seguintes especialidades:"
          },
          {
            "id": "amigo-5-2",
            "description": "Natação principiante I"
          },
          {
            "id": "amigo-5-3",
            "description": "Cultura física"
          },
          {
            "id": "amigo-5-4",
            "description": "Nós e amarras"
          },
          {
            "id": "amigo-5-5",
            "description": "Segurança básica na água"
          },
          {
            "id": "amigo-5-6",
            "description": "Utilizando a experiência de Daniel:"
          },
          {
            "id": "amigo-5-7",
            "description": "Explicar os princípios de temperança que ele defendeu ou participar em uma apresentação ou encenação sobre Daniel 1."
          },
          {
            "id": "amigo-5-8",
            "description": "Memorizar e explicar Daniel 1:8."
          },
          {
            "id": "amigo-5-9",
            "description": "Escrever seu compromisso pessoal de seguir um estilo de vida saudável."
          },
          {
            "id": "amigo-5-10",
            "description": "Aprender os princípios de uma dieta saudável e ajudar a preparar um quadro com os grupos básicos de alimentos."
          }
        ]
      },
      {
        "title": "VI - Organização e Liderança",
        "requirements": [
          {
            "id": "amigo-6-1",
            "description": "Através da observação, acompanhar todo o processo de planejamento até a execução de uma caminhada de 5 quilômetros."
          }
        ]
      },
      {
        "title": "VII - Estudo da Natureza",
        "requirements": [
          {
            "id": "amigo-7-1",
            "description": "Completar uma das seguintes especialidades:"
          },
          {
            "id": "amigo-7-2",
            "description": "Felinos"
          },
          {
            "id": "amigo-7-3",
            "description": "Cães"
          },
          {
            "id": "amigo-7-4",
            "description": "Mamíferos"
          },
          {
            "id": "amigo-7-5",
            "description": "Sementes"
          },
          {
            "id": "amigo-7-6",
            "description": "Aves de Estimação"
          },
          {
            "id": "amigo-7-7",
            "description": "Aprender e demonstrar uma maneira para purificar a água e escrever um parágrafo destacando o significado de Jesus como a água da vida."
          },
          {
            "id": "amigo-7-8",
            "description": "Aprender e montar uma barraca em local apropriado."
          }
        ]
      },
      {
        "title": "VIII - Arte de Acampar",
        "requirements": [
          {
            "id": "amigo-8-1",
            "description": "Demonstrar como cuidar corretamente de uma corda. Fazer e explicar o uso prático dos seguintes nós:"
          },
          {
            "id": "amigo-8-2",
            "description": "Simples"
          },
          {
            "id": "amigo-8-3",
            "description": "Cego"
          },
          {
            "id": "amigo-8-4",
            "description": "Direito"
          },
          {
            "id": "amigo-8-5",
            "description": "Cirurgião"
          },
          {
            "id": "amigo-8-6",
            "description": "Lais de guia"
          },
          {
            "id": "amigo-8-7",
            "description": "Lais de guia duplo"
          },
          {
            "id": "amigo-8-8",
            "description": "Escota"
          },
          {
            "id": "amigo-8-9",
            "description": "Catau"
          },
          {
            "id": "amigo-8-10",
            "description": "Pescador"
          },
          {
            "id": "amigo-8-11",
            "description": "Fateixa"
          },
          {
            "id": "amigo-8-12",
            "description": "Volta da fiel"
          },
          {
            "id": "amigo-8-13",
            "description": "Nó de gancho"
          },
          {
            "id": "amigo-8-14",
            "description": "Volta da ribeira"
          },
          {
            "id": "amigo-8-15",
            "description": "Ordinário"
          },
          {
            "id": "amigo-8-16",
            "description": "Completar a especialidade de Acampamento I."
          },
          {
            "id": "amigo-8-17",
            "description": "Apresentar 10 regras para uma caminhada e explicar o que fazer quando estiver perdido."
          },
          {
            "id": "amigo-8-18",
            "description": "Aprender os sinais para seguir uma pista. Preparar e seguir uma pista de no mínimo 10 sinais, que também possa ser seguida por outros."
          }
        ]
      },
      {
        "title": "IX - Estilo de Vida",
        "requirements": [
          {
            "id": "amigo-9-1",
            "description": "Completar uma especialidade na área de Artes e Habilidades Manuais."
          }
        ]
      },
      {
        "title": "Classe Avançada - Amigo da Natureza",
        "requirements": [
          {
            "id": "amigo-10-1",
            "description": "Memorizar, cantar ou tocar o Hino dos Desbravadores e conhecer a história do hino."
          },
          {
            "id": "amigo-10-2",
            "description": "Em consulta com o seu líder, escolher um dos seguintes personagens do Antigo Testamento e conversar com seu grupo sobre o amor e cuidado de Deus e o livramento demonstrado na vida do personagem escolhido."
          },
          {
            "id": "amigo-10-3",
            "description": "José"
          },
          {
            "id": "amigo-10-4",
            "description": "Jonas"
          },
          {
            "id": "amigo-10-5",
            "description": "Ester"
          },
          {
            "id": "amigo-10-6",
            "description": "Rute"
          },
          {
            "id": "amigo-10-7",
            "description": "Levar pelo menos dois amigos não adventistas à Escola Sabatina ou ao Clube de Desbravadores."
          },
          {
            "id": "amigo-10-8",
            "description": "Conhecer os princípios de higiene, de boas maneiras à mesa e como se comportar diante de pessoas que tenham diferentes idades. Demonstrar e explicar como essas boas maneiras podem ser úteis nas reuniões e acampamentos do clube."
          },
          {
            "id": "amigo-10-9",
            "description": "Fazer a especialidade de Arte de acampar."
          },
          {
            "id": "amigo-10-10",
            "description": "Conhecer e identificar 10 flores silvestres e 10 insetos de sua região."
          },
          {
            "id": "amigo-10-11",
            "description": "Começar uma fogueira com apenas um fósforo, usando materiais naturais, e mantê-la acesa."
          },
          {
            "id": "amigo-10-12",
            "description": "Usar corretamente uma faca, facão e uma machadinha e conhecer dez regras para usá-los com segurança."
          },
          {
            "id": "amigo-10-13",
            "description": "Escolher e completar uma especialidade em uma das áreas abaixo:"
          },
          {
            "id": "amigo-10-14",
            "description": "Atividades missionárias"
          },
          {
            "id": "amigo-10-15",
            "description": "Atividades agrícolas"
          }
        ]
      }
    ]
  },
  {
    "id": "companheiro",
    "name": "Companheiro",
    "url": "https://mda.wiki.br/Cart%C3%A3o_de_Companheiro/",
    "minAge": 11,
    "color": "red",
    "type": "regular",
    "sections": [
      {
        "title": "I - Geral",
        "requirements": [
          {
            "id": "companheiro-1-1",
            "description": "Ter, no mínimo, 11 anos de idade."
          },
          {
            "id": "companheiro-1-2",
            "description": "Ser membro ativo do Clube de Desbravadores."
          },
          {
            "id": "companheiro-1-3",
            "description": "Ilustrar de forma criativa o significado do Voto dos Desbravadores."
          },
          {
            "id": "companheiro-1-4",
            "description": "Ler o livro do Clube do Livro Juvenil do ano em curso e escrever um parágrafo sobre o que mais lhe chamou a atenção ou considerou importante."
          },
          {
            "id": "companheiro-1-5",
            "description": "Ler o livro \"Um simples lanche\"."
          },
          {
            "id": "companheiro-1-6",
            "description": "Participar ativamente da classe bíblica do seu clube."
          }
        ]
      },
      {
        "title": "II - Descoberta Espiritual",
        "requirements": [
          {
            "id": "companheiro-2-1",
            "description": "Memorizar e demonstrar seu conhecimento:"
          },
          {
            "id": "companheiro-2-2",
            "description": "10 Mandamentos: A Lei de Deus dada a Moisés."
          },
          {
            "id": "companheiro-2-3",
            "description": "27 livros do Novo Testamento e demonstrar habilidade para encontrar qualquer um deles."
          },
          {
            "id": "companheiro-2-4",
            "description": "Ler e explicar os versos abaixo:"
          },
          {
            "id": "companheiro-2-5",
            "description": "Isa. 41:9-10"
          },
          {
            "id": "companheiro-2-6",
            "description": "Heb. 13:5"
          },
          {
            "id": "companheiro-2-7",
            "description": "Prov. 22:6"
          },
          {
            "id": "companheiro-2-8",
            "description": "I João 1:9"
          },
          {
            "id": "companheiro-2-9",
            "description": "Salmo 8"
          },
          {
            "id": "companheiro-2-10",
            "description": "Leitura Bíblica:"
          },
          {
            "id": "companheiro-2-11",
            "description": "Levítico: 11"
          },
          {
            "id": "companheiro-2-12",
            "description": "Números: 9: 15-23, 11, 12, 13, 14:1-38, 16, 17, 20:1-13; 22-29, 21:4-9, 22, 23; 24:1-10"
          },
          {
            "id": "companheiro-2-13",
            "description": "Deuteronômio: 1:1-17, 32:1-43, 33, 34"
          },
          {
            "id": "companheiro-2-14",
            "description": "Josué: 1, 2, 3, 4, 5:10; 6, 7, 9, 24:1-15; 29"
          },
          {
            "id": "companheiro-2-15",
            "description": "Juízes: 6, 7, 13:1-18; 14, 15, 16"
          },
          {
            "id": "companheiro-2-16",
            "description": "Rute: 1, 2; 3, 4"
          },
          {
            "id": "companheiro-2-17",
            "description": "1 Samuel: 1, 2, 3, 4, 5, 6, 8, 9, 10; 11:12-15, 12, 13, 15, 16, 17, 18:1-19, 20, 21:1-7; 22, 24, 25, 26, 31"
          },
          {
            "id": "companheiro-2-18",
            "description": "2 Samuel: 1, 5, 6, 7, 9, 11; 12:1-25, 15, 18"
          },
          {
            "id": "companheiro-2-19",
            "description": "Em consulta com o seu conselheiro, escolher um dos seguintes temas:"
          },
          {
            "id": "companheiro-2-20",
            "description": "Uma parábola de Jesus"
          },
          {
            "id": "companheiro-2-21",
            "description": "Um milagre de Jesus"
          },
          {
            "id": "companheiro-2-22",
            "description": "O sermão da montanha"
          },
          {
            "id": "companheiro-2-23",
            "description": "Um sermão sobre a Segunda Vinda de Cristo"
          },
          {
            "id": "companheiro-2-24",
            "description": "Escolher um item abaixo para demonstrar seu conhecimento sobre o tema escolhido:"
          },
          {
            "id": "companheiro-2-25",
            "description": "Troca de ideias com seu conselheiro"
          },
          {
            "id": "companheiro-2-26",
            "description": "Atividade que integre todo o grupo"
          },
          {
            "id": "companheiro-2-27",
            "description": "Redação"
          }
        ]
      },
      {
        "title": "III - Servindo a Outros",
        "requirements": [
          {
            "id": "companheiro-3-1",
            "description": "Planejar e dedicar pelo menos duas horas servindo sua comunidade e demonstrando companheirismo para alguém, de maneira prática."
          },
          {
            "id": "companheiro-3-2",
            "description": "Dedicar pelo menos cinco horas participando de um projeto que beneficiará sua comunidade ou igreja."
          }
        ]
      },
      {
        "title": "V - Saúde e Aptidão Física",
        "requirements": [
          {
            "id": "companheiro-5-1",
            "description": "Memorizar e explicar I Coríntios 9:24-27."
          },
          {
            "id": "companheiro-5-2",
            "description": "Conversar com seu líder sobre a aptidão física e os exercícios físicos regulares que se relacionam com uma vida saudável."
          },
          {
            "id": "companheiro-5-3",
            "description": "Aprender sobre os prejuízos que o cigarro causa à saúde e escrever seu compromisso de não fazer uso do fumo."
          },
          {
            "id": "companheiro-5-4",
            "description": "Completar uma das seguintes especialidades:"
          },
          {
            "id": "companheiro-5-5",
            "description": "Natação Principiante II"
          },
          {
            "id": "companheiro-5-6",
            "description": "Acampamento II"
          }
        ]
      },
      {
        "title": "VI - Organização e Liderança",
        "requirements": [
          {
            "id": "companheiro-6-1",
            "description": "Dirigir ou colaborar em uma meditação criativa para a sua unidade ou Clube."
          },
          {
            "id": "companheiro-6-2",
            "description": "Ajudar no planejamento de uma excursão ou acampamento com sua unidade ou clube, envolvendo pelo menos um pernoite."
          }
        ]
      },
      {
        "title": "VII - Estudo da Natureza",
        "requirements": [
          {
            "id": "companheiro-7-1",
            "description": "Participar de jogos da natureza, ou caminhada ecológica em meio a natureza, pelo período de uma hora."
          },
          {
            "id": "companheiro-7-2",
            "description": "Completar duas das seguintes especialidades:"
          },
          {
            "id": "companheiro-7-3",
            "description": "Anfíbios"
          },
          {
            "id": "companheiro-7-4",
            "description": "Aves"
          },
          {
            "id": "companheiro-7-5",
            "description": "Aves domésticas"
          },
          {
            "id": "companheiro-7-6",
            "description": "Pecuária"
          },
          {
            "id": "companheiro-7-7",
            "description": "Répteis"
          },
          {
            "id": "companheiro-7-8",
            "description": "Moluscos"
          },
          {
            "id": "companheiro-7-9",
            "description": "Árvores"
          },
          {
            "id": "companheiro-7-10",
            "description": "Arbustos"
          },
          {
            "id": "companheiro-7-11",
            "description": "Recapitular o estudo da criação e fazer um diário por sete dias registrando suas observações do que foi criado em cada dia correspondente."
          }
        ]
      },
      {
        "title": "VIII - Arte de Acampar",
        "requirements": [
          {
            "id": "companheiro-8-1",
            "description": "Descobrir os pontos cardeais sem a ajuda de uma bússola e desenhar uma Rosa dos Ventos."
          },
          {
            "id": "companheiro-8-2",
            "description": "Participar em um acampamento de final de semana, e fazer um relatório destacando o que mais lhe impressionou positivamente."
          },
          {
            "id": "companheiro-8-3",
            "description": "Aprender ou recapitular os seguintes nós:"
          },
          {
            "id": "companheiro-8-4",
            "description": "Oito"
          },
          {
            "id": "companheiro-8-5",
            "description": "Volta do salteador"
          },
          {
            "id": "companheiro-8-6",
            "description": "Duplo"
          },
          {
            "id": "companheiro-8-7",
            "description": "Caminhoneiro"
          },
          {
            "id": "companheiro-8-8",
            "description": "Direito"
          },
          {
            "id": "companheiro-8-9",
            "description": "Volta do fiel"
          },
          {
            "id": "companheiro-8-10",
            "description": "Escota"
          },
          {
            "id": "companheiro-8-11",
            "description": "Lais de guia"
          },
          {
            "id": "companheiro-8-12",
            "description": "Simples"
          }
        ]
      },
      {
        "title": "IX - Estilo de Vida",
        "requirements": [
          {
            "id": "companheiro-9-1",
            "description": "Completar uma especialidade não realizada anteriormente. Na seção de Artes e Habilidades Manuais."
          }
        ]
      },
      {
        "title": "Classe Avançada - Companheiro de Excursionismo",
        "requirements": [
          {
            "id": "companheiro-10-1",
            "description": "Aprender e demonstrar a composição, significado e uso correto da Bandeira Nacional."
          },
          {
            "id": "companheiro-10-2",
            "description": "Ler a primeira visão de Ellen White e discutir como Deus usa os profetas para apresentar Sua mensagem à igreja (ver \"Primeiros Escritos\", pág. 13-20)."
          },
          {
            "id": "companheiro-10-3",
            "description": "Participar de uma atividade missionária ou comunitária, envolvendo também um amigo."
          },
          {
            "id": "companheiro-10-4",
            "description": "Conversar com seu conselheiro ou unidade sobre como demonstrar respeito pelos seus pais ou responsáveis e fazer uma lista mostrando como cuidam de você."
          },
          {
            "id": "companheiro-10-5",
            "description": "Participar de uma caminhada de 6 quilômetros preparando ao final um relatório de uma página."
          },
          {
            "id": "companheiro-10-6",
            "description": "Escolher um dos seguintes itens:"
          },
          {
            "id": "companheiro-10-7",
            "description": "Assistir à um \"curso como deixar de fumar\""
          },
          {
            "id": "companheiro-10-8",
            "description": "Assistir à dois filmes sobre saúde"
          },
          {
            "id": "companheiro-10-9",
            "description": "Elaborar um cartaz sobre o prejuízo das drogas"
          },
          {
            "id": "companheiro-10-10",
            "description": "Ajudar a preparar material para uma exposição ou passeata sobre saúde"
          },
          {
            "id": "companheiro-10-11",
            "description": "Pesquisar na internet informações sobre saúde e escrever uma página sobre os resultados encontrados"
          },
          {
            "id": "companheiro-10-12",
            "description": "Identificar e descrever 12 aves nativas e 12 árvores nativas."
          },
          {
            "id": "companheiro-10-13",
            "description": "Participar de uma das seguintes cerimônias e sugerir ideias criativas de como realiza-las: Investidura"
          },
          {
            "id": "companheiro-10-14",
            "description": "Participar de uma das seguintes cerimônias e sugerir ideias criativas de como realiza-las: Admissão de lenço"
          },
          {
            "id": "companheiro-10-15",
            "description": "Participar de uma das seguintes cerimônias e sugerir ideias criativas de como realiza-las: Dia do desbravador."
          },
          {
            "id": "companheiro-10-16",
            "description": "Preparar uma refeição em uma fogueira durante um acampamento de clube ou unidade. \n Faça uma lista de 20 alimentos que podem ser facilmente preparados sem utensílios de cozinha na fogueira e que sejam vegetarianos"
          },
          {
            "id": "companheiro-10-18",
            "description": "Preparar um quadro com 15 nós diferentes."
          },
          {
            "id": "companheiro-10-19",
            "description": "Completar a especialidade de Excursionismo pedestre com mochila."
          },
          {
            "id": "companheiro-10-20",
            "description": "Completar uma especialidade não realizada anteriormente:"
          },
          {
            "id": "companheiro-10-21",
            "description": "Habilidades Domésticas"
          },
          {
            "id": "companheiro-10-22",
            "description": "Ciência e Saúde"
          },
          {
            "id": "companheiro-10-23",
            "description": "Atividades Missionárias"
          },
          {
            "id": "companheiro-10-24",
            "description": "Atividades Agrícolas"
          }
        ]
      }
    ]
  },
  {
    "id": "pesquisador",
    "name": "Pesquisador",
    "url": "https://mda.wiki.br/Cart%C3%A3o_de_Pesquisador/",
    "minAge": 12,
    "color": "green",
    "type": "regular",
    "sections": [
      {
        "title": "I - Geral",
        "requirements": [
          {
            "id": "pesquisador-1-1",
            "description": "Ter, no mínimo, 12 anos de idade."
          },
          {
            "id": "pesquisador-1-2",
            "description": "Ser membro ativo do Clube de Desbravadores."
          },
          {
            "id": "pesquisador-1-3",
            "description": "Demonstrar sua compreensão do significado da Lei do Desbravador através de uma das seguintes atividades:"
          },
          {
            "id": "pesquisador-1-4",
            "description": "Representação"
          },
          {
            "id": "pesquisador-1-5",
            "description": "Debate"
          },
          {
            "id": "pesquisador-1-6",
            "description": "Redação"
          },
          {
            "id": "pesquisador-1-7",
            "description": "Ler o livro do Clube do Livro Juvenil do ano e escrever dois parágrafos sobre o que mais lhe chamou a atenção ou considerou importante."
          },
          {
            "id": "pesquisador-1-8",
            "description": "Ler o livro \"Além da Magia\"."
          },
          {
            "id": "pesquisador-1-9",
            "description": "Participar ativamente da classe bíblica do seu clube."
          }
        ]
      },
      {
        "title": "II - Descoberta Espiritual",
        "requirements": [
          {
            "id": "pesquisador-2-1",
            "description": "Memorizar e demonstrar seu conhecimento:"
          },
          {
            "id": "pesquisador-2-2",
            "description": "Levítico 11: quais as regras para os alimentos considerados comestíveis e não comestíveis."
          },
          {
            "id": "pesquisador-2-3",
            "description": "Ler e explicar os versos abaixo:"
          },
          {
            "id": "pesquisador-2-4",
            "description": "Ecles. 12:13-14"
          },
          {
            "id": "pesquisador-2-5",
            "description": "Rom. 6:23"
          },
          {
            "id": "pesquisador-2-6",
            "description": "Apoc. 1:3"
          },
          {
            "id": "pesquisador-2-7",
            "description": "Isa. 43:1-2"
          },
          {
            "id": "pesquisador-2-8",
            "description": "Salmo 51:10"
          },
          {
            "id": "pesquisador-2-9",
            "description": "Salmo 16"
          },
          {
            "id": "pesquisador-2-10",
            "description": "Leitura Bíblica:"
          },
          {
            "id": "pesquisador-2-11",
            "description": "1 Reis: 1:28-53, 3, 4:20-34, 5, 6, 8:12-60, 10, 11:6-43, 12, 16:29-33; 17:1-7, 17:8-24, 18, 19, 21"
          },
          {
            "id": "pesquisador-2-12",
            "description": "2 Reis: 2, 4:1-7, 4:8-41, 5, 6:1-23, 6:24-33; 7, 20, 22, 23:36-37; 24; 25:1-7"
          },
          {
            "id": "pesquisador-2-13",
            "description": "2 Crônicas: 24:1-14, 36"
          },
          {
            "id": "pesquisador-2-14",
            "description": "Esdras: 1, 3; 6:14-15"
          },
          {
            "id": "pesquisador-2-15",
            "description": "Neemias: 1, 2, 4, 8"
          },
          {
            "id": "pesquisador-2-16",
            "description": "Ester: 1, 2, 3, 4, 5, 6, 7;8"
          },
          {
            "id": "pesquisador-2-17",
            "description": "Jó: 1, 2, 42"
          },
          {
            "id": "pesquisador-2-18",
            "description": "Salmos: 1, 15, 19, 23, 24, 27, 37, 39, 42, 46, 67, 90;91, 92; 97, 98, 100, 117, 119:1-80, 119:81-176, 121, 125, 150"
          },
          {
            "id": "pesquisador-2-19",
            "description": "Provérbios: 1, 3, 4, 10, 15, 20, 25"
          },
          {
            "id": "pesquisador-2-20",
            "description": "Eclesiastes: 1"
          },
          {
            "id": "pesquisador-2-21",
            "description": "Conversar com seu líder e escolher uma das seguintes histórias:"
          },
          {
            "id": "pesquisador-2-22",
            "description": "João 3 ? Nicodemos"
          },
          {
            "id": "pesquisador-2-23",
            "description": "João 4 - A mulher samaritana"
          },
          {
            "id": "pesquisador-2-24",
            "description": "Lucas 10 - O bom samaritano"
          },
          {
            "id": "pesquisador-2-25",
            "description": "Lucas 15 - O filho pródigo"
          },
          {
            "id": "pesquisador-2-26",
            "description": "Lucas 19 - Zaqueu"
          },
          {
            "id": "pesquisador-2-27",
            "description": "Através da história escolhida, demonstrar sua compreensão em como Jesus salva as pessoas, usando um dos seguintes métodos abaixo:"
          },
          {
            "id": "pesquisador-2-28",
            "description": "Conversar em grupo com a participação de seu líder."
          },
          {
            "id": "pesquisador-2-29",
            "description": "Apresentar uma mensagem em uma reunião do clube."
          },
          {
            "id": "pesquisador-2-30",
            "description": "Fazer uma série de cartazes ou uma maquete."
          },
          {
            "id": "pesquisador-2-31",
            "description": "Escrever uma poesia ou hino."
          }
        ]
      },
      {
        "title": "III - Servindo a Outros",
        "requirements": [
          {
            "id": "pesquisador-3-1",
            "description": "Conhecer os projetos comunitários desenvolvidos em sua cidade e participar em pelo menos um deles com sua unidade ou clube."
          },
          {
            "id": "pesquisador-3-2",
            "description": "Participar em três atividades missionárias da igreja."
          }
        ]
      },
      {
        "title": "IV - Desenvolvendo Amizade",
        "requirements": [
          {
            "id": "pesquisador-4-1",
            "description": "Participar de um debate ou representação sobre a pressão de grupo e identificar a influência que isso exerce sobre suas decisões."
          },
          {
            "id": "pesquisador-4-2",
            "description": "Visitar um órgão público de sua cidade e descobrir de que maneiras o clube pode ser útil à sua comunidade."
          }
        ]
      },
      {
        "title": "V - Saúde e Aptidão Física",
        "requirements": [
          {
            "id": "pesquisador-5-1",
            "description": "Escolher uma das atividades abaixo e escrever um texto pessoal para um estilo de vida livre do álcool:"
          },
          {
            "id": "pesquisador-5-2",
            "description": "Participar de uma discussão em classe sobre os efeitos do álcool no organismo."
          },
          {
            "id": "pesquisador-5-3",
            "description": "Assistir à um vídeo sobre o álcool ou outras drogas no corpo humano e conversar sobre o assunto."
          }
        ]
      },
      {
        "title": "VI - Organização e Liderança",
        "requirements": [
          {
            "id": "pesquisador-6-1",
            "description": "Dirigir uma cerimônia de abertura da reunião semanal em seu clube ou um programa de Escola Sabatina."
          },
          {
            "id": "pesquisador-6-2",
            "description": "Ajudar a organizar a classe bíblica de seu clube."
          }
        ]
      },
      {
        "title": "VII - Estudo da Natureza",
        "requirements": [
          {
            "id": "pesquisador-7-1",
            "description": "Identificar a estrela Alfa da constelação do Centauro e a constelação de Órion. Conhecer o significado espiritual de Órion, como descrito no livro \"Primeiros Escritos\", de Ellen White, pág. 41."
          },
          {
            "id": "pesquisador-7-2",
            "description": "Completar uma das especialidades abaixo:"
          },
          {
            "id": "pesquisador-7-3",
            "description": "Astronomia"
          },
          {
            "id": "pesquisador-7-4",
            "description": "Cactos"
          },
          {
            "id": "pesquisador-7-5",
            "description": "Climatologia"
          },
          {
            "id": "pesquisador-7-6",
            "description": "Flores"
          },
          {
            "id": "pesquisador-7-7",
            "description": "Rastreio de animais"
          }
        ]
      },
      {
        "title": "VIII - Arte de Acampar",
        "requirements": [
          {
            "id": "pesquisador-8-1",
            "description": "Apresentar seis segredos para um bom acampamento. Participar de um acampamento de final de semana, planejando e cozinhando duas refeições."
          },
          {
            "id": "pesquisador-8-2",
            "description": "Completar as seguintes especialidades:"
          },
          {
            "id": "pesquisador-8-3",
            "description": "Acampamento III"
          },
          {
            "id": "pesquisador-8-4",
            "description": "Primeiros Socorros - básico"
          },
          {
            "id": "pesquisador-8-5",
            "description": "Aprender a usar uma bússola ou GPS (urbano ou campo), e demonstrar sua habilidade encontrando endereços em uma zona urbana."
          }
        ]
      },
      {
        "title": "IX - Estilo de Vida",
        "requirements": [
          {
            "id": "pesquisador-9-1",
            "description": "Completar uma especialidade não realizada anteriormente, em Artes e Habilidades Manuais."
          }
        ]
      },
      {
        "title": "Classe Avançada - Pesquisador de Campo e Bosque",
        "requirements": [
          {
            "id": "pesquisador-10-1",
            "description": "Conhecer e saber usar de forma adequada a Bandeira dos Desbravadores, o bandeirim de unidade e os comandos de ordem unida."
          },
          {
            "id": "pesquisador-10-2",
            "description": "Ler a história de J. N. Andrews ou um pioneiro de seu país e discutir a importância do trabalho de missionários, e porque Cristo ordenou a Grande Comissão (Mateus 28:18-20)."
          },
          {
            "id": "pesquisador-10-3",
            "description": "Convidar uma pessoa para assistir um dos seguintes programas:"
          },
          {
            "id": "pesquisador-10-4",
            "description": "Clube dos Desbravadores"
          },
          {
            "id": "pesquisador-10-5",
            "description": "Classe Bíblica"
          },
          {
            "id": "pesquisador-10-6",
            "description": "Pequeno Grupo"
          },
          {
            "id": "pesquisador-10-7",
            "description": "Fazer uma das seguintes especialidades:"
          },
          {
            "id": "pesquisador-10-8",
            "description": "Asseio e Cortesia Cristã"
          },
          {
            "id": "pesquisador-10-9",
            "description": "Vida Familiar"
          },
          {
            "id": "pesquisador-10-10",
            "description": "Participar de uma caminhada de 10 quilômetros e fazer uma lista dos equipamentos necessários, incluindo a roupa e o calçado que devem ser usados."
          },
          {
            "id": "pesquisador-10-11",
            "description": "Participar na organização de um dos eventos especiais do Clube:"
          },
          {
            "id": "pesquisador-10-12",
            "description": "Investidura"
          },
          {
            "id": "pesquisador-10-13",
            "description": "Admissão de Lenço"
          },
          {
            "id": "pesquisador-10-14",
            "description": "Dia do Desbravador"
          },
          {
            "id": "pesquisador-10-15",
            "description": "Identificar seis pegadas de animais ou aves. Fazer um modelo em gesso, massa de modelar ou biscuit de três dessas pegadas."
          },
          {
            "id": "pesquisador-10-16",
            "description": "Aprender a fazer quatro amarras básicas e construir um móvel de acampamento."
          },
          {
            "id": "pesquisador-10-17",
            "description": "Planejar um cardápio vegetariano para sua unidade, para um acampamento de três dias e apresentar para seu instrutor."
          },
          {
            "id": "pesquisador-10-18",
            "description": "Enviar e receber uma mensagem através das formas de comunicação abaixo:"
          },
          {
            "id": "pesquisador-10-19",
            "description": "Alfabeto com semáforos"
          },
          {
            "id": "pesquisador-10-20",
            "description": "Código Morse, com lanterna"
          },
          {
            "id": "pesquisador-10-21",
            "description": "Alfabeto LIBRAS (língua de sinais)"
          },
          {
            "id": "pesquisador-10-22",
            "description": "Alfabeto Braile"
          },
          {
            "id": "pesquisador-10-23",
            "description": "Completar duas especialidades não realizadas anteriormente, em uma das áreas abaixo:"
          },
          {
            "id": "pesquisador-10-24",
            "description": "Habilidades Domésticas"
          },
          {
            "id": "pesquisador-10-25",
            "description": "Ciência e Saúde"
          },
          {
            "id": "pesquisador-10-26",
            "description": "Atividades Missionárias"
          },
          {
            "id": "pesquisador-10-27",
            "description": "Atividades Agrícolas"
          }
        ]
      }
    ]
  },
  {
    "id": "pioneiro",
    "name": "Pioneiro",
    "url": "https://mda.wiki.br/Cart%C3%A3o_de_Pioneiro/",
    "minAge": 13,
    "color": "gray",
    "type": "regular",
    "sections": [
      {
        "title": "I - Geral",
        "requirements": [
          {
            "id": "pioneiro-1-1",
            "description": "Ter, no mínimo, 13 anos de idade."
          },
          {
            "id": "pioneiro-1-2",
            "description": "Ser membro ativo do Clube de Desbravadores."
          },
          {
            "id": "pioneiro-1-3",
            "description": "Memorizar e entender o Alvo e o Lema JA."
          },
          {
            "id": "pioneiro-1-4",
            "description": "Ler o livro do Clube do Livro Juvenil do ano em curso e resumi-lo em uma página."
          },
          {
            "id": "pioneiro-1-5",
            "description": "Ler o livro \"Expedição Galápagos\"."
          }
        ]
      },
      {
        "title": "II - Descoberta Espiritual",
        "requirements": [
          {
            "id": "pioneiro-2-1",
            "description": "Memorizar e demonstrar seu conhecimento:"
          },
          {
            "id": "pioneiro-2-2",
            "description": "Bem-Aventuranças: O sermão da Montanha"
          },
          {
            "id": "pioneiro-2-3",
            "description": "Ler e explicar os versos abaixo:"
          },
          {
            "id": "pioneiro-2-4",
            "description": "Isa. 26:3"
          },
          {
            "id": "pioneiro-2-5",
            "description": "Rom. 12:12"
          },
          {
            "id": "pioneiro-2-6",
            "description": "João 14:1-3"
          },
          {
            "id": "pioneiro-2-7",
            "description": "Sal. 37:5"
          },
          {
            "id": "pioneiro-2-8",
            "description": "Filip. 3:12-14"
          },
          {
            "id": "pioneiro-2-9",
            "description": "Salmo 23"
          },
          {
            "id": "pioneiro-2-10",
            "description": "I Sam. 15:22"
          },
          {
            "id": "pioneiro-2-11",
            "description": "Conversar em seu clube ou unidade sobre:"
          },
          {
            "id": "pioneiro-2-12",
            "description": "O que é o cristianismo"
          },
          {
            "id": "pioneiro-2-13",
            "description": "Quais são as características de um verdadeiro discípulo"
          },
          {
            "id": "pioneiro-2-14",
            "description": "O que fazer para ser um cristão verdadeiro"
          },
          {
            "id": "pioneiro-2-15",
            "description": "Participar de um estudo especial sobre a inspiração da Bíblia, com a ajuda de um pastor, trabalhando os conceitos de inspiração, revelação e iluminação."
          },
          {
            "id": "pioneiro-2-16",
            "description": "Convidar três ou mais pessoas para assistirem uma classe bíblica ou pequeno grupo."
          },
          {
            "id": "pioneiro-2-17",
            "description": "Leitura bíblica:"
          },
          {
            "id": "pioneiro-2-18",
            "description": "Eclesiastes: 3, 5, 7, 11; 12"
          },
          {
            "id": "pioneiro-2-19",
            "description": "Isaías: 5, 11, 26:1-12; 35, 40, 43, 52:13-15; 53, 58, 60, 61"
          },
          {
            "id": "pioneiro-2-20",
            "description": "Jeremias: 9:23-26, 10:1-16, 18:1-6, 26, 36, 52:1-11"
          },
          {
            "id": "pioneiro-2-21",
            "description": "Daniel: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12"
          },
          {
            "id": "pioneiro-2-22",
            "description": "Joel: 2:12-31"
          },
          {
            "id": "pioneiro-2-23",
            "description": "Amós: 7:10-16; 8:4-11"
          },
          {
            "id": "pioneiro-2-24",
            "description": "Jonas: 1, 2, 3;4"
          },
          {
            "id": "pioneiro-2-25",
            "description": "Miqueias: 4"
          },
          {
            "id": "pioneiro-2-26",
            "description": "Ageu: 2"
          },
          {
            "id": "pioneiro-2-27",
            "description": "Zacarias: 4"
          },
          {
            "id": "pioneiro-2-28",
            "description": "Malaquias: 3; 4"
          },
          {
            "id": "pioneiro-2-29",
            "description": "Mateus: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23"
          }
        ]
      },
      {
        "title": "III - Servindo a Outros",
        "requirements": [
          {
            "id": "pioneiro-3-1",
            "description": "Participar em dois projetos missionários definidos por seu clube."
          },
          {
            "id": "pioneiro-3-2",
            "description": "Trabalhar em um projeto comunitário de sua igreja, escola ou comunidade."
          }
        ]
      },
      {
        "title": "IV - Desenvolvendo Amizade",
        "requirements": [
          {
            "id": "pioneiro-4-1",
            "description": "Participar de um debate e fazer uma avaliação pessoal sobre suas atitudes em dois dos seguintes temas:"
          },
          {
            "id": "pioneiro-4-2",
            "description": "Auto-estima"
          },
          {
            "id": "pioneiro-4-3",
            "description": "Amizade"
          },
          {
            "id": "pioneiro-4-4",
            "description": "Relacionamentos"
          },
          {
            "id": "pioneiro-4-5",
            "description": "Otimismo e pessimismo"
          }
        ]
      },
      {
        "title": "V - Saúde e Aptidão Física",
        "requirements": [
          {
            "id": "pioneiro-5-1",
            "description": "Preparar um programa pessoal de exercícios físicos diários e conversar com seu líder ou conselheiro sobre os princípios de aptidão física. Fazer e assinar um compromisso pessoal de realizar exercícios físicos regularmente."
          },
          {
            "id": "pioneiro-5-2",
            "description": "Discutir as vantagens do estilo de vida Adventista de acordo com o que a Bíblia ensina."
          }
        ]
      },
      {
        "title": "VI - Organização e Liderança",
        "requirements": [
          {
            "id": "pioneiro-6-1",
            "description": "Assistir a um seminário ou treinamento, oferecido pela sua igreja ou distrito nos departamentos abaixo:"
          },
          {
            "id": "pioneiro-6-2",
            "description": "Ministério Pessoal"
          },
          {
            "id": "pioneiro-6-3",
            "description": "Evangelismo"
          },
          {
            "id": "pioneiro-6-4",
            "description": "Participar de uma atividade social de sua igreja."
          }
        ]
      },
      {
        "title": "VII - Estudo da Natureza",
        "requirements": [
          {
            "id": "pioneiro-7-1",
            "description": "Estudar a história do dilúvio e o processo de fossilização."
          },
          {
            "id": "pioneiro-7-2",
            "description": "Completar uma especialidade, não realizada anteriormente, em Estudos da Natureza."
          }
        ]
      },
      {
        "title": "VIII - Arte de Acampar",
        "requirements": [
          {
            "id": "pioneiro-8-1",
            "description": "Fazer um fogo refletor e demonstrar seu uso."
          },
          {
            "id": "pioneiro-8-2",
            "description": "Participar de um acampamento de final de semana, arrumando de forma apropriada sua bolsa ou mochila com o equipamento pessoal necessário."
          },
          {
            "id": "pioneiro-8-3",
            "description": "Completar a especialidade de Resgate básico."
          }
        ]
      },
      {
        "title": "IX - Estilo de Vida",
        "requirements": [
          {
            "id": "pioneiro-9-1",
            "description": "Completar uma especialidade não realizada anteriormente em uma das seguintes áreas:"
          },
          {
            "id": "pioneiro-9-2",
            "description": "Atividades Missionárias"
          },
          {
            "id": "pioneiro-9-3",
            "description": "Atividades Profissionais"
          },
          {
            "id": "pioneiro-9-4",
            "description": "Atividades Agrícolas"
          }
        ]
      },
      {
        "title": "Classe Avançada - Pioneiro de Novas Fronteiras",
        "requirements": [
          {
            "id": "pioneiro-10-1",
            "description": "Completar a especialidade de Cidadania Cristã, caso não tenha sido realizada anteriormente."
          },
          {
            "id": "pioneiro-10-2",
            "description": "Encenar a história do bom samaritano, demonstrando como ajudar as pessoas e auxiliar de forma prática três pessoas ou mais."
          },
          {
            "id": "pioneiro-10-3",
            "description": "Participar em uma das seguintes atividades, apresentando ao final um relatório escrito contendo, no mínimo, duas páginas:"
          },
          {
            "id": "pioneiro-10-4",
            "description": "Caminhar 10 quilômetros"
          },
          {
            "id": "pioneiro-10-5",
            "description": "Cavalgar 2 quilômetros"
          },
          {
            "id": "pioneiro-10-6",
            "description": "Viajar de canoa durante 2 horas"
          },
          {
            "id": "pioneiro-10-7",
            "description": "Praticar 15 quilômetros de ciclismo"
          },
          {
            "id": "pioneiro-10-8",
            "description": "Nadar 200 metros"
          },
          {
            "id": "pioneiro-10-9",
            "description": "Correr 1500 metros"
          },
          {
            "id": "pioneiro-10-10",
            "description": "Rodar 2 Km de patins ou roller"
          },
          {
            "id": "pioneiro-10-11",
            "description": "Completar a especialidade de Mapa e bússola."
          },
          {
            "id": "pioneiro-10-12",
            "description": "Demonstrar habilidade no uso correto de uma machadinha."
          },
          {
            "id": "pioneiro-10-13",
            "description": "Ser capaz de acender uma fogueira num dia de chuva, saber como conseguir lenha seca e manter o fogo aceso."
          },
          {
            "id": "pioneiro-10-14",
            "description": "Completar um dos seguintes itens:"
          },
          {
            "id": "pioneiro-10-15",
            "description": "Pesquisar e identificar dez variedades de plantas comestíveis."
          },
          {
            "id": "pioneiro-10-16",
            "description": "Ser capaz de enviar e receber 35 letras por minuto pelo código semafórico"
          },
          {
            "id": "pioneiro-10-17",
            "description": "Ser capaz de enviar e receber 35 letras por minuto através do código náutico, usando o código internacional."
          },
          {
            "id": "pioneiro-10-18",
            "description": "Ser capaz de apresentar e entender Mateus 24 em LIBRAS (linguagem de sinais)"
          },
          {
            "id": "pioneiro-10-19",
            "description": "Preparar o Salmo 23 em Braile."
          },
          {
            "id": "pioneiro-10-20",
            "description": "Completar uma especialidade, não realizadas anteriormente, em Atividades Recreativas."
          },
          {
            "id": "pioneiro-10-21",
            "description": "Pesquisar e identificar, através de fotografia, exposição ou ao vivo, um dos seguintes itens:"
          },
          {
            "id": "pioneiro-10-22",
            "description": "25 folhas de árvores"
          },
          {
            "id": "pioneiro-10-23",
            "description": "25 rochas e minerais"
          },
          {
            "id": "pioneiro-10-24",
            "description": "25 flores silvestres"
          },
          {
            "id": "pioneiro-10-25",
            "description": "25 borboletas e mariposas"
          },
          {
            "id": "pioneiro-10-26",
            "description": "25 conchas"
          },
          {
            "id": "pioneiro-10-27",
            "description": "Completar a especialidade de Fogueiras e cozinha ao ar livre."
          }
        ]
      }
    ]
  },
  {
    "id": "excursionista",
    "name": "Excursionista",
    "url": "https://mda.wiki.br/Cart%C3%A3o_de_Excursionista/",
    "minAge": 14,
    "color": "purple",
    "type": "regular",
    "sections": [
      {
        "title": "I - Geral",
        "requirements": [
          {
            "id": "excursionista-1-1",
            "description": "Ter, no mínimo, 14 anos de idade."
          },
          {
            "id": "excursionista-1-2",
            "description": "Ser membro ativo do Clube de Desbravadores."
          },
          {
            "id": "excursionista-1-3",
            "description": "Memorizar e explicar o significado do Objetivo JA."
          },
          {
            "id": "excursionista-1-4",
            "description": "Ler o livro do Clube do Livro Juvenil do ano em curso e resumi-lo em uma página."
          },
          {
            "id": "excursionista-1-5",
            "description": "Ler o livro \"O Fim do Começo\"."
          }
        ]
      },
      {
        "title": "II - Descoberta Espiritual",
        "requirements": [
          {
            "id": "excursionista-2-1",
            "description": "Memorizar e demonstrar o seu conhecimento:"
          },
          {
            "id": "excursionista-2-2",
            "description": "12 Apóstolos: O nome do 12 apóstolos de Cristo"
          },
          {
            "id": "excursionista-2-3",
            "description": "Frutos do Espírito: A relação dos adjetivos do caráter do cristão"
          },
          {
            "id": "excursionista-2-4",
            "description": "Ler e explicar os versos abaixo:"
          },
          {
            "id": "excursionista-2-5",
            "description": "Rom. 8:28"
          },
          {
            "id": "excursionista-2-6",
            "description": "Apoc. 21:1-3"
          },
          {
            "id": "excursionista-2-7",
            "description": "II Ped. 1:20-21"
          },
          {
            "id": "excursionista-2-8",
            "description": "I João 2:14"
          },
          {
            "id": "excursionista-2-9",
            "description": "II Cro. 20:20"
          },
          {
            "id": "excursionista-2-10",
            "description": "Salmo 46"
          },
          {
            "id": "excursionista-2-11",
            "description": "Estudar e entender a pessoa do Espírito Santo, como Ele se relaciona, e qual o Seu papel no crescimento espiritual de cada ser humano."
          },
          {
            "id": "excursionista-2-12",
            "description": "Estude, com sua unidade, os eventos finais e a segunda vinda de Cristo."
          },
          {
            "id": "excursionista-2-13",
            "description": "Através do estudo da Bíblia, descobrir o verdadeiro significado da observância do sábado."
          },
          {
            "id": "excursionista-2-14",
            "description": "Leitura bíblica:"
          },
          {
            "id": "excursionista-2-15",
            "description": "Mateus: 24, 25, 26:1-35, 26:36-75, 27:1-31, 27:32-56, 27:57-66, 28"
          },
          {
            "id": "excursionista-2-16",
            "description": "Marcos: 7, 9, 10, 11, 12, 16,"
          },
          {
            "id": "excursionista-2-17",
            "description": "Lucas: 1:4-25, 1:26-66, 2:21-38, 2:39-52, 7:18-28, 8, 10:1-37, 10:38-42; 11:1-13, 12, 13, 14, 15, 16:1-17, 17, 18, 19, 21, 22, 23, 24"
          },
          {
            "id": "excursionista-2-18",
            "description": "João: 1, 2, 3, 4, 5, 6:1-21, 6:22-71, 8:1-38, 9, 10, 11:1-46, 12, 13, 14, 15, 17, 18, 19, 20, 21"
          },
          {
            "id": "excursionista-2-19",
            "description": "Atos: 1, 2, 3, 4, 5, 6, 7, 8"
          }
        ]
      },
      {
        "title": "III - Servindo a Outros",
        "requirements": [
          {
            "id": "excursionista-3-1",
            "description": "Convidar um amigo para participar de uma atividade social de sua igreja ou da Associação/Missão."
          },
          {
            "id": "excursionista-3-2",
            "description": "Participar de um projeto comunitário desde o planejamento, organização até a execução."
          },
          {
            "id": "excursionista-3-3",
            "description": "Discutir como os jovens adventistas devem se relacionar com as pessoas nas diferentes situações do dia a dia, tais como:"
          },
          {
            "id": "excursionista-3-4",
            "description": "Vizinhos"
          },
          {
            "id": "excursionista-3-5",
            "description": "Escola"
          },
          {
            "id": "excursionista-3-6",
            "description": "Atividades sociais"
          },
          {
            "id": "excursionista-3-7",
            "description": "Atividades recreativas"
          }
        ]
      },
      {
        "title": "IV - Desenvolvendo Amizade",
        "requirements": [
          {
            "id": "excursionista-4-1",
            "description": "Através de uma conversa em grupo ou avaliação pessoal, examinar suas atitudes em dois dos seguintes temas:"
          },
          {
            "id": "excursionista-4-2",
            "description": "Auto-estima"
          },
          {
            "id": "excursionista-4-3",
            "description": "Relacionamento familiar"
          },
          {
            "id": "excursionista-4-4",
            "description": "Finanças pessoais"
          },
          {
            "id": "excursionista-4-5",
            "description": "Pressão de grupo"
          },
          {
            "id": "excursionista-4-6",
            "description": "Preparar uma lista contendo cinco sugestões de atividades recreativas para ajudar pessoas com necessidades específicas e colaborar na organização de uma dessas atividades para essas pessoas."
          }
        ]
      },
      {
        "title": "V - Saúde e Aptidão Física",
        "requirements": [
          {
            "id": "excursionista-5-1",
            "description": "Completar a especialidade de Temperança."
          }
        ]
      },
      {
        "title": "VI - Organização e Liderança",
        "requirements": [
          {
            "id": "excursionista-6-1",
            "description": "Preparar um organograma da igreja local e relacionar as funções dos departamentos."
          },
          {
            "id": "excursionista-6-2",
            "description": "Participar em dois programas envolvendo diferentes departamentos da igreja local."
          },
          {
            "id": "excursionista-6-3",
            "description": "Completar a especialidade de Aventuras com Cristo."
          }
        ]
      },
      {
        "title": "VII - Estudo da Natureza",
        "requirements": [
          {
            "id": "excursionista-7-1",
            "description": "Recapitular a historia de Nicodemos e relacioná-la com o ciclo de vida da lagarta ou borboleta, acrescentando um significado espiritual."
          },
          {
            "id": "excursionista-7-2",
            "description": "Completar uma especialidade de Estudos da Natureza, não realizada anteriormente."
          }
        ]
      },
      {
        "title": "VIII - Arte de Acampar",
        "requirements": [
          {
            "id": "excursionista-8-1",
            "description": "Com um grupo de, no mínimo quatro pessoas e com a presença de um conselheiro adulto e experiente, andar pelo menos 20 quilômetros numa área rural ou deserta, incluindo uma noite ao ar livre ou em barraca. Planejar a expedição em detalhes antes da saída. Durante a caminhada, efetuar anotações sobre o terreno, flora e fauna observados. Depois, usando as anotações, participar em uma discussão de grupo, dirigida por seu conselheiro."
          },
          {
            "id": "excursionista-8-2",
            "description": "Completar a especialidade de Pioneirias."
          }
        ]
      },
      {
        "title": "IX - Estilo de Vida",
        "requirements": [
          {
            "id": "excursionista-9-1",
            "description": "Completar uma especialidade, não realizada anteriormente, em uma das seguintes áreas:"
          },
          {
            "id": "excursionista-9-2",
            "description": "Atividades missionárias"
          },
          {
            "id": "excursionista-9-3",
            "description": "Atividades agrícolas"
          },
          {
            "id": "excursionista-9-4",
            "description": "Ciência e saúde"
          },
          {
            "id": "excursionista-9-5",
            "description": "Habilidades domésticas"
          }
        ]
      },
      {
        "title": "Classe Avançada - Excursionista na Mata",
        "requirements": [
          {
            "id": "excursionista-10-1",
            "description": "Fazer uma apresentação escrita ou falada sobre o respeito que devemos ter com a Lei de Deus e as autoridades civis, enumerando pelo menos 10 princípios de comportamento moral."
          },
          {
            "id": "excursionista-10-2",
            "description": "Acompanhar seu pastor ou ancião em uma visita missionária ou estudo bíblico."
          },
          {
            "id": "excursionista-10-3",
            "description": "Completar a especialidade de Testemunho Juvenil."
          },
          {
            "id": "excursionista-10-4",
            "description": "Apresentar cinco atividades na natureza, para serem realizadas no Sábado à tarde."
          },
          {
            "id": "excursionista-10-5",
            "description": "Com sua unidade, construir cinco móveis de acampamento e um portal para o clube."
          },
          {
            "id": "excursionista-10-6",
            "description": "Através da supervisão de seu líder ou conselheiro, conversar em sua unidade ou clube sobre um dos seguintes temas:"
          },
          {
            "id": "excursionista-10-7",
            "description": "Modéstia cristã"
          },
          {
            "id": "excursionista-10-8",
            "description": "Recreação"
          },
          {
            "id": "excursionista-10-9",
            "description": "Saúde"
          },
          {
            "id": "excursionista-10-10",
            "description": "Observância do sábado"
          },
          {
            "id": "excursionista-10-11",
            "description": "Demonstrar conhecimento para encontrar alimentos, através de plantas silvestres de sua região e saber diferenciá-las de plantas tóxicas/venenosas."
          },
          {
            "id": "excursionista-10-12",
            "description": "Demonstrar conhecimento quanto aos procedimentos necessários em caso de ferimentos por diferentes animais peçonhentos e não peçonhentos."
          },
          {
            "id": "excursionista-10-13",
            "description": "Demonstrar técnicas para percorrer trilhas em diferentes tipos de terrenos, como: desertos, florestas, pântanos e rios."
          },
          {
            "id": "excursionista-10-14",
            "description": "Completar a especialidade de Vida Silvestre."
          },
          {
            "id": "excursionista-10-15",
            "description": "Completar a especialidade de Ordem Unida, caso não tenha sido realizada anteriormente."
          }
        ]
      }
    ]
  },
  {
    "id": "guia",
    "name": "Guia",
    "url": "https://mda.wiki.br/Cart%C3%A3o_de_Guia/",
    "minAge": 15,
    "color": "yellow",
    "type": "regular",
    "sections": [
      {
        "title": "I - Geral",
        "requirements": [
          {
            "id": "guia-1-1",
            "description": "Ter, no mínimo, 15 anos de idade."
          },
          {
            "id": "guia-1-2",
            "description": "Ser membro ativo do clube de Desbravadores."
          },
          {
            "id": "guia-1-3",
            "description": "Memorizar e explicar o Voto de Fidelidade à Bíblia."
          },
          {
            "id": "guia-1-4",
            "description": "Ler o livro do Clube de Leitura Juvenil do ano em curso e resumi-lo em uma página."
          },
          {
            "id": "guia-1-5",
            "description": "Ler o livro \"O livro amargo\"."
          }
        ]
      },
      {
        "title": "II - Descoberta Espiritual",
        "requirements": [
          {
            "id": "guia-2-1",
            "description": "Memorizar e demonstrar o seu conhecimento:"
          },
          {
            "id": "guia-2-2",
            "description": "3 mensagens Angélicas: Reveladas em Apocalipse 14:6-12"
          },
          {
            "id": "guia-2-3",
            "description": "7 Igrejas: O nome das igrejas do Apocalipse"
          },
          {
            "id": "guia-2-4",
            "description": "Pedras Preciosas: Os 12 fundamentos da Cidade Santa - A Nova Jerusalém"
          },
          {
            "id": "guia-2-5",
            "description": "Ler e explicar os versos abaixo:"
          },
          {
            "id": "guia-2-6",
            "description": "I Cor. 13"
          },
          {
            "id": "guia-2-7",
            "description": "II Cron. 7:14"
          },
          {
            "id": "guia-2-8",
            "description": "Apoc. 22:18-20"
          },
          {
            "id": "guia-2-9",
            "description": "II Tim. 4:6-7"
          },
          {
            "id": "guia-2-10",
            "description": "Rom. 8:38-39"
          },
          {
            "id": "guia-2-11",
            "description": "Mateus 6:33-34"
          },
          {
            "id": "guia-2-12",
            "description": "Descrever os dons espirituais mencionados nos escritos de Paulo (Coríntios, Efésios, Filipenses) e para quais objetivos a igreja recebe estes dons."
          },
          {
            "id": "guia-2-13",
            "description": "Estudar a estrutura e serviço do santuário no Antigo Testamento e relacionar com o ministério pessoal de Jesus e a cruz."
          },
          {
            "id": "guia-2-14",
            "description": "Ler e resumir três histórias de pioneiros adventistas. Contar essas histórias na reunião do clube, no culto JA ou na Escola Sabatina."
          },
          {
            "id": "guia-2-15",
            "description": "Leitura bíblica:"
          },
          {
            "id": "guia-2-16",
            "description": "Atos: 9:1-31, 9:32-43, 10, 11, 12, 13, 14, 16, 17:1-15, 17:16-34, 18, 19:1-22, 19:23-41, 20, 21:17-40; 22:1-16, 23, 24, 25, 26, 27, 28"
          },
          {
            "id": "guia-2-17",
            "description": "Romanos: 12, 13, 14"
          },
          {
            "id": "guia-2-18",
            "description": "1 Coríntios: 13"
          },
          {
            "id": "guia-2-19",
            "description": "2 Coríntios: 5:11-21, 11:16-33; 12:1-10"
          },
          {
            "id": "guia-2-20",
            "description": "Gálatas: 5:16-26; 6:1-10"
          },
          {
            "id": "guia-2-21",
            "description": "Efésios: 5:1-21, 6"
          },
          {
            "id": "guia-2-22",
            "description": "Filipenses: 4"
          },
          {
            "id": "guia-2-23",
            "description": "Colosenses: 3"
          },
          {
            "id": "guia-2-24",
            "description": "1 Tessalonissenses: 4:13-18, 5"
          },
          {
            "id": "guia-2-25",
            "description": "2 Tessalonissenses: 2, 3"
          },
          {
            "id": "guia-2-26",
            "description": "1 Timóteo: 4:6-16, 5:1-16; 6:11-21"
          },
          {
            "id": "guia-2-27",
            "description": "2 Timóteo: 2, 3"
          },
          {
            "id": "guia-2-28",
            "description": "Filemom:"
          },
          {
            "id": "guia-2-29",
            "description": "Hebreus: 11"
          },
          {
            "id": "guia-2-30",
            "description": "Tiago: 1, 3, 5:7-20"
          },
          {
            "id": "guia-2-31",
            "description": "1 Pedro: 1,, 5:1-11"
          },
          {
            "id": "guia-2-32",
            "description": "2 Pedro: 3"
          },
          {
            "id": "guia-2-33",
            "description": "1 João: 2, 3, 4, 5"
          },
          {
            "id": "guia-2-34",
            "description": "Judas: 1:17:25"
          },
          {
            "id": "guia-2-35",
            "description": "Apocalipse 1, 2, 3, 7:9-17, 12, 13, 14, 19, 20, 21"
          }
        ]
      },
      {
        "title": "III - Servindo a Outros",
        "requirements": [
          {
            "id": "guia-3-1",
            "description": "Ajudar a organizar e participar em uma das seguintes atividades:"
          },
          {
            "id": "guia-3-2",
            "description": "Fazer uma visita de cortesia a uma pessoa doente"
          },
          {
            "id": "guia-3-3",
            "description": "Adotar uma pessoa ou família em necessidade e ajudá-los"
          },
          {
            "id": "guia-3-4",
            "description": "Um projeto de sua escolha aprovado por seu líder"
          },
          {
            "id": "guia-3-5",
            "description": "Discutir com sua unidade os métodos de evangelismo pessoal e colocar alguns princípios em prática."
          }
        ]
      },
      {
        "title": "IV - Desenvolvendo Amizade",
        "requirements": [
          {
            "id": "guia-4-1",
            "description": "Assistir a uma palestra ou aula e examinar suas atitudes em relação a dois dos seguintes temas:"
          },
          {
            "id": "guia-4-2",
            "description": "A Importância da escolha profissional"
          },
          {
            "id": "guia-4-3",
            "description": "Como se relacionar com os pais"
          },
          {
            "id": "guia-4-4",
            "description": "A escolha da pessoa certa para namorar"
          },
          {
            "id": "guia-4-5",
            "description": "O plano de Deus para o sexo"
          }
        ]
      },
      {
        "title": "V - Saúde e Aptidão Física",
        "requirements": [
          {
            "id": "guia-5-1",
            "description": "Fazer uma apresentação, para alunos do ensino fundamental, sobre os oito remédios naturais dados por Deus."
          },
          {
            "id": "guia-5-2",
            "description": "Completar uma das seguintes atividades:"
          },
          {
            "id": "guia-5-3",
            "description": "Escrever uma poesia ou artigo sobre saúde para ser divulgado em uma revista, boletim ou jornal da igreja"
          },
          {
            "id": "guia-5-4",
            "description": "Individualmente ou em grupo, organizar e participar em uma corrida ou atividade similar e apresentar com antecedência um programa de treinamento físico para este evento"
          },
          {
            "id": "guia-5-5",
            "description": "Ler as páginas 102-125 do livro \"Temperança\", de Ellen White, e apresentar em uma página ou mais, 10 textos selecionados da leitura"
          },
          {
            "id": "guia-5-6",
            "description": "Completar a especialidade de Nutrição ou liderar um grupo para a especialidade de Cultura física"
          }
        ]
      },
      {
        "title": "VI - Organização e Liderança",
        "requirements": [
          {
            "id": "guia-6-1",
            "description": "Preparar um organograma da estrutura administrativa da Igreja Adventista em sua Divisão."
          },
          {
            "id": "guia-6-2",
            "description": "Participar em um dos itens abaixo:"
          },
          {
            "id": "guia-6-3",
            "description": "Curso para conselheiros"
          },
          {
            "id": "guia-6-4",
            "description": "Convenção de liderança da Associação/Missão"
          },
          {
            "id": "guia-6-5",
            "description": "2 reuniões de diretoria de seu clube"
          },
          {
            "id": "guia-6-6",
            "description": "Planejar e ensinar, no mínimo, dois requisitos de uma especialidade para um grupo de desbravadores."
          }
        ]
      },
      {
        "title": "VII - Estudo da Natureza",
        "requirements": [
          {
            "id": "guia-7-1",
            "description": "Ler o capitulo 7 do livro \"O Desejado de Todas as Nações\" sobre a infância de Jesus. Apresentar para um grupo, clube ou unidade as lições encontradas, demonstrando a importância que o estudo da natureza exerceu na educação e no ministério de Jesus."
          },
          {
            "id": "guia-7-2",
            "description": "Completar uma das seguintes especialidades:"
          },
          {
            "id": "guia-7-3",
            "description": "Ecologia"
          },
          {
            "id": "guia-7-4",
            "description": "Conservação Ambiental"
          }
        ]
      },
      {
        "title": "VIII - Arte de Acampar",
        "requirements": [
          {
            "id": "guia-8-1",
            "description": "Participar com sua unidade de um acampamento com estrutura de pioneiria, planejar o que deve ser levado e o que vai acontecer neste acampamento."
          },
          {
            "id": "guia-8-2",
            "description": "Planejar, preparar e cozinhar três refeições ao ar livre."
          },
          {
            "id": "guia-8-3",
            "description": "Construir e utilizar um móvel de acampamento em tamanho real, com nós e amarras."
          },
          {
            "id": "guia-8-4",
            "description": "Completar uma especialidade, não realizada anteriormente, que possa ser contada para um dos Mestrados abaixo:"
          },
          {
            "id": "guia-8-5",
            "description": "Aquática"
          },
          {
            "id": "guia-8-6",
            "description": "Esportes"
          },
          {
            "id": "guia-8-7",
            "description": "Atividades Recreativas"
          },
          {
            "id": "guia-8-8",
            "description": "Vida Campestre"
          }
        ]
      },
      {
        "title": "IX - Estilo de Vida",
        "requirements": [
          {
            "id": "guia-9-1",
            "description": "Completar uma especialidade, não realizada anteriormente, em alguma das seguintes áreas:"
          },
          {
            "id": "guia-9-2",
            "description": "Atividades agrícolas"
          },
          {
            "id": "guia-9-3",
            "description": "Ciência e saúde"
          },
          {
            "id": "guia-9-4",
            "description": "Habilidades domésticas"
          },
          {
            "id": "guia-9-5",
            "description": "Atividades profissionais"
          }
        ]
      },
      {
        "title": "Classe Avançada - Guia de Exploração",
        "requirements": [
          {
            "id": "guia-10-1",
            "description": "Completar a especialidade de Mordomia."
          },
          {
            "id": "guia-10-2",
            "description": "Ler o livro \"O maior discurso de Cristo\" e escrever uma página sobre o efeito da leitura em sua vida."
          },
          {
            "id": "guia-10-3",
            "description": "Cumprir um dos seguintes itens:"
          },
          {
            "id": "guia-10-4",
            "description": "Trazer dois amigos para assistir a duas diferentes reuniões da igreja."
          },
          {
            "id": "guia-10-5",
            "description": "Ajudar a planejar e participar de, no mínimo, quatro domingos em uma série de evangelismo jovem."
          },
          {
            "id": "guia-10-6",
            "description": "Escrever uma página ou apresentar uma palestra sobre como influenciar amigos para Cristo."
          },
          {
            "id": "guia-10-7",
            "description": "Observar durante o período de dois meses o trabalho dos diáconos, apresentando um relatório detalhado de suas atividades, contendo:"
          },
          {
            "id": "guia-10-8",
            "description": "Cuidado da propriedade da igreja"
          },
          {
            "id": "guia-10-9",
            "description": "Cerimônia de lava-pés"
          },
          {
            "id": "guia-10-10",
            "description": "Cerimônia de batismo"
          },
          {
            "id": "guia-10-11",
            "description": "Recolhimento dos dízimos e ofertas"
          },
          {
            "id": "guia-10-12",
            "description": "Completar o mestrado em Vida Campestre."
          },
          {
            "id": "guia-10-13",
            "description": "Projetar três tipos diferentes de abrigo, explicar seu uso e utilizar um deles em um acampamento."
          },
          {
            "id": "guia-10-14",
            "description": "Assistir um seminário ou apresentar uma palestra sobre dois dos seguintes temas:"
          },
          {
            "id": "guia-10-15",
            "description": "Aborto"
          },
          {
            "id": "guia-10-16",
            "description": "AIDS"
          },
          {
            "id": "guia-10-17",
            "description": "Violência"
          },
          {
            "id": "guia-10-18",
            "description": "Drogas"
          },
          {
            "id": "guia-10-19",
            "description": "Completar a especialidade de Orçamento familiar."
          },
          {
            "id": "guia-10-20",
            "description": "Completar a especialidade de Liderança campestre."
          }
        ]
      }
    ]
  }
];