import type { Category } from '../types/task';

const BASE_URL = 'https://dummyjson.com';

export interface QuoteResponse {
  content: string;
  author: string;
}

// Mapeamento: slug da API → nome em português + ícone
// A API retorna os slugs, nós exibimos os nomes traduzidos
const CATEGORY_MAP: Record<string, { name: string; icon: string }> = {
  'beauty':                 { name: 'Saúde',          icon: '❤️'  },
  'fragrances':             { name: 'Evento',          icon: '🎉'  },
  'furniture':              { name: 'Compras',         icon: '🛒'  },
  'groceries':              { name: 'Faculdade',       icon: '🎓'  },
  'home-decoration':        { name: 'Namorado(a)',     icon: '💕'  },
  'kitchen-accessories':    { name: 'Trabalho',        icon: '💼'  },
  'laptops':                { name: 'Estudar',         icon: '📚'  },
  'mens-shirts':            { name: 'Pessoal',         icon: '👤'  },
  'mens-shoes':             { name: 'Financeiro',      icon: '💰'  },
  'mens-watches':           { name: 'Exercício',       icon: '🏋️' },
};

export const api = {
  async getMotivationalQuote(): Promise<QuoteResponse> {
    try {
      const response = await fetch(`${BASE_URL}/quotes/random`);
      if (!response.ok) throw new Error('Failed to fetch quote');
      const data = await response.json() as { quote: string; author: string };
      return { content: data.quote, author: data.author };
    } catch {
      return {
        content: 'O sucesso é a soma de pequenos esforços repetidos dia após dia.',
        author: 'Robert Collier',
      };
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${BASE_URL}/products/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json() as Array<{ name: string; slug: string; url: string }>;

      // Filtra apenas os slugs que temos mapeamento e transforma nos nomes PT-BR
      const mapped = data
        .filter((cat) => CATEGORY_MAP[cat.slug] !== undefined)
        .map((cat, index) => {
          const { name, icon } = CATEGORY_MAP[cat.slug];
          return {
            id: index + 1,
            name,
            slug: cat.slug,
            url: cat.url,
            description: name,
            icon,
          };
        });

      return mapped;
    } catch {
      // Fallback caso a API esteja fora — mantém as categorias PT-BR
      return [
        { id: 1, name: 'Trabalho',    slug: 'trabalho',   url: '', description: 'Trabalho',    icon: '💼' },
        { id: 2, name: 'Faculdade',   slug: 'faculdade',  url: '', description: 'Faculdade',   icon: '🎓' },
        { id: 3, name: 'Saúde',       slug: 'saude',      url: '', description: 'Saúde',       icon: '❤️' },
        { id: 4, name: 'Evento',      slug: 'evento',     url: '', description: 'Evento',      icon: '🎉' },
        { id: 5, name: 'Namorado(a)', slug: 'namorado',   url: '', description: 'Namorado(a)', icon: '💕' },
        { id: 6, name: 'Compras',     slug: 'compras',    url: '', description: 'Compras',     icon: '🛒' },
        { id: 7, name: 'Estudar',     slug: 'estudar',    url: '', description: 'Estudar',     icon: '📚' },
        { id: 8, name: 'Pessoal',     slug: 'pessoal',    url: '', description: 'Pessoal',     icon: '👤' },
        { id: 9, name: 'Financeiro',  slug: 'financeiro', url: '', description: 'Financeiro',  icon: '💰' },
        { id: 10, name: 'Exercício',  slug: 'exercicio',  url: '', description: 'Exercício',   icon: '🏋️' },
      ];
    }
  },
};
