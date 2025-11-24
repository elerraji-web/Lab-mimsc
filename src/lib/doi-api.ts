export interface DOIMetadata {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
}

export async function fetchDOIMetadata(doi: string): Promise<DOIMetadata | null> {
  try {
    const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
    if (!response.ok) {
      console.error(`Failed to fetch DOI ${doi}: ${response.status} ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    if (data.status !== 'ok') {
      console.error(`API error for DOI ${doi}: ${data.status}`);
      return null;
    }
    const message = data.message;
    const title = message.title?.[0] || '';
    const authors = message.author?.map((a: any) => `${a.given || ''} ${a.family || ''}`.trim()).filter((name: string) => name) || [];
    const journal = message['container-title']?.[0] || '';
    const year = message['published-print']?.['date-parts']?.[0]?.[0] ||
                 message['published-online']?.['date-parts']?.[0]?.[0] || 0;
    const doiValue = message.DOI;
    return { title, authors, journal, year, doi: doiValue };
  } catch (error) {
    console.error(`Network error fetching DOI ${doi}:`, error);
    return null;
  }
}