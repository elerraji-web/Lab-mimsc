'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface Publication {
  _id: string;
  title: string;
  abstract?: string;
  type: 'JOURNAL_ARTICLE' | 'CONFERENCE_PAPER' | 'BOOK_CHAPTER' | 'BOOK' | 'THESIS' | 'REPORT' | 'PREPRINT';
  authors: string[] | Array<{
    firstName: string;
    lastName: string;
    title: string;
    position: string;
  }>;
  journal?: string;
  conference?: string;
  venue?: string;
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
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [showingAll, setShowingAll] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const fetchPublications = async (fetchLimit?: number) => {
    try {
      const url = fetchLimit ? `/api/publications?limit=${fetchLimit}` : '/api/publications?limit=1000';
      const response = await fetch(url);
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
    }
  };

  useEffect(() => {
    const loadInitialPublications = async () => {
      setLoading(true);
      await fetchPublications(limit);
      setLoading(false);
    };

    loadInitialPublications();
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

  const handleViewAll = async () => {
    if (!showingAll) {
      setLoadingMore(true);
      await fetchPublications();
      setShowingAll(true);
      setLoadingMore(false);
    }
    // Scroll to publications section
    const publicationsSection = document.getElementById('publications');
    if (publicationsSection) {
      publicationsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {showingAll ? 'Toutes les Publications' : 'Publications Récentes'}
          </h2>
          {!showingAll && (
            <Button variant="outline" size="sm" onClick={handleViewAll} disabled={loadingMore}>
              {loadingMore ? 'Chargement...' : 'Voir toutes les publications'}
            </Button>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        {publications.map((pub) => {
          // Handle both string array and object array for authors
          const authorsList = Array.isArray(pub.authors)
            ? pub.authors.map((author) =>
                typeof author === 'string'
                  ? author
                  : `${author.firstName} ${author.lastName}`
              ).join(', ')
            : '';

          const isExpanded = expandedCards.has(pub._id);

          return (
            <Card key={pub._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base leading-tight mb-2">{pub.title}</CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="text-sm font-medium truncate">{authorsList}</div>
                      {(pub.journal || pub.conference || pub.venue) && (
                        <div className="text-xs italic text-muted-foreground">
                          {pub.journal || pub.conference || pub.venue}
                        </div>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <Badge variant="secondary" className="text-xs">
                      {pub.publishedAt ? new Date(pub.publishedAt).getFullYear() : 'N/A'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {getTypeLabel(pub.type)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pt-0 space-y-3">
                  {pub.abstract && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Abstract:</p>
                      <p className="text-sm text-muted-foreground">
                        {pub.abstract}
                      </p>
                    </div>
                  )}
                  
                  {(pub.volume || pub.issue || pub.pages) && (
                    <div className="text-sm text-muted-foreground">
                      {pub.volume && `Vol. ${pub.volume}`}
                      {pub.issue && `, No. ${pub.issue}`}
                      {pub.pages && `, pp. ${pub.pages}`}
                    </div>
                  )}

                  {pub.doi && (
                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-semibold">DOI:</span>
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {pub.doi}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {pub.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              )}

              <div className="px-6 pb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCard(pub._id)}
                  className="w-full text-xs h-7"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      Voir moins
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      Voir plus
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}