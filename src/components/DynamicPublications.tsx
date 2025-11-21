'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar } from 'lucide-react';

interface Publication {
  _id: string;
  title: string;
  abstract?: string;
  type: 'JOURNAL_ARTICLE' | 'CONFERENCE_PAPER' | 'BOOK_CHAPTER' | 'BOOK' | 'THESIS' | 'REPORT' | 'PREPRINT';
  authors: Array<{
    firstName: string;
    lastName: string;
    title: string;
    position: string;
  }>;
  journal?: string;
  conference?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  doi?: string;
  url?: string;
  publishedAt?: string;
  researchArea: string;
  tags: string[];
  citations: number;
}

interface DynamicPublicationsProps {
  limit?: number;
  showHeader?: boolean;
}

export default function DynamicPublications({ limit = 4, showHeader = true }: DynamicPublicationsProps) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch(`/api/publications?limit=${limit}`);
        if (!response.ok) {
          throw new Error('Failed to fetch publications');
        }
        const data = await response.json();
        if (data.success) {
          setPublications(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, [limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Erreur lors du chargement des publications</p>
      </div>
    );
  }

  if (publications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucune publication trouvée</p>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'JOURNAL_ARTICLE': return 'Article';
      case 'CONFERENCE_PAPER': return 'Conférence';
      case 'BOOK_CHAPTER': return 'Chapitre';
      case 'BOOK': return 'Livre';
      case 'THESIS': return 'Thèse';
      case 'REPORT': return 'Rapport';
      case 'PREPRINT': return 'Preprint';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Publications Récentes</h2>
          <Button variant="outline" size="sm">
            Voir toutes les publications
          </Button>
        </div>
      )}
      
      <div className="space-y-4">
        {publications.map((pub) => (
          <Card key={pub._id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight">{pub.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {pub.authors.map((author, index) => (
                      <span key={index}>
                        {author.firstName} {author.lastName}
                        {index < pub.authors.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </CardDescription>
                </div>
                <div className="text-right ml-4">
                  <Badge variant="secondary">
                    {pub.publishedAt ? new Date(pub.publishedAt).getFullYear() : 'N/A'}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">
                    {getTypeLabel(pub.type)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {pub.journal || pub.conference || 'Publication'}
                {pub.volume && `, Vol. ${pub.volume}`}
                {pub.issue && `, No. ${pub.issue}`}
                {pub.pages && `, pp. ${pub.pages}`}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {pub.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {pub.doi && (
                  <a 
                    href={`https://doi.org/${pub.doi}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    DOI
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}