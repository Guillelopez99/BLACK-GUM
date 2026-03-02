export interface FaqEntry {
  question: string;
  answer: string;
  keywords?: string[];
}

export const faqEntries: FaqEntry[] = [
  {
    question: "¿Qué servicios ofrecen?",
    answer:
      "Producción audiovisual integral, dirección creativa y postproducción. También ofrecemos alquiler de equipos.",
    keywords: ["servicios", "producción", "postproducción", "alquiler", "equipos"]
  },
  {
    question: "¿Dónde están ubicados?",
    answer:
      "Trabajamos desde Madrid y también en formato remoto para proyectos internacionales.",
    keywords: ["ubicación", "madrid", "remoto", "estudio"]
  },
  {
    question: "¿Cómo funciona el proceso de producción?",
    answer:
      "Arrancamos con briefing, propuesta creativa, plan de rodaje y postproducción. Ajustamos cada fase según objetivos y presupuesto.",
    keywords: ["proceso", "briefing", "rodaje", "plan", "postproducción"]
  },
  {
    question: "¿Cuánto cuesta un proyecto?",
    answer:
      "El coste depende del alcance, el equipo y los tiempos. Podemos preparar un presupuesto a medida en menos de 48 h.",
    keywords: ["precio", "coste", "presupuesto", "tarifa"]
  },
  {
    question: "¿En cuánto tiempo entregan?",
    answer:
      "Depende del proyecto, pero solemos entregar en 2 a 4 semanas. Para urgencias, hay opciones express.",
    keywords: ["tiempos", "plazo", "entrega", "urgente", "express"]
  },
  {
    question: "¿Cómo contacto con el equipo?",
    answer:
      "Puedes escribirnos desde la página de contacto y te respondemos el mismo día laborable.",
    keywords: ["contacto", "email", "escribir", "mensaje"]
  }
];
