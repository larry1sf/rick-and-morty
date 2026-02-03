export const sections = {
  all: "todos",
  character: "personajes",
  episode: "episodios",
  location: "ubicaciones",
};
export const sectionsInverse = Object.fromEntries(
  Object.entries(sections).map(([key, value]) => [value, key]),
);

export const Desconocidos = (ori?: string, text?: string) =>
  ori?.includes("unknown") ? `${text} desconocid@` : ori || "Desconocid@";

export const SpedieDesconocida = (ori: string) => {
  if (ori.includes("Human")) return "Humano";
  if (ori.includes("Alien")) return "Extraterrestre";
  if (ori.includes("unknown")) return "Desconocid@";
  return ori;
};

export const StadoDesconocido = (ori: string) => {
  if (ori.includes("unknown")) return "Desconocid@";
  if (ori.includes("Alive")) return "Vivo";
  if (ori.includes("Dead")) return "Muerto";
  return ori;
};

export const GeneroDesconocido = (ori: string) => {
  if (ori.includes("unknown")) return "Desconocid@";
  if (ori.includes("Male")) return "Masculino";
  if (ori.includes("Female")) return "Femenino";
  if (ori.includes("Genderless")) return "Sin género";
  return ori;
}

export const parseEpisode = (episodeStr: string) => {
  if (!episodeStr) return { season: 0, episode: 0, display: "Error" };
  const match = episodeStr?.match(/S(\d+)E(\d+)/);
  if (match) {
    return {
      season: parseInt(match[1]),
      episode: parseInt(match[2]),
      display: `Temporada ${match[1]} - Episodio ${match[2]}`,
    };
  }
  return { season: 0, episode: 0, display: episodeStr };
};