'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ResearchLead {
  firstName: string;
  lastName: string;
  title?: string;
  position?: string;
}

interface ResearchItem {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  tags: string[];
  lead?: ResearchLead;
}

interface DynamicResearchProps {
  limit?: number;
}

export default function DynamicResearch({ limit = 6 }: DynamicResearchProps) {
  const [researches, setResearches] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResearches = async () => {
      try {
        const response = await fetch(`/api/research?limit=${limit}`);
        if (!response.ok) {
          throw new Error('Failed to fetch researches');
        }
        const data = await response.json();
        if (data.success) {
          setResearches(data.data);
        } else {
          setError(data.error || 'Unable to load researches');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchResearches();
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
        <p className="text-muted-foreground">Erreur lors du chargement des axes de recherche</p>
      </div>
    );
  }

  if (researches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun axe de recherche disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {researches.map((research) => (
        <Card key={research._id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>{research.title}</CardTitle>
                {research.subtitle && (
                  <CardDescription>{research.subtitle}</CardDescription>
                )}
              </div>
              {research.lead && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src="" alt="Responsable de l'axe" />
                    <AvatarFallback>
                      {research.lead.firstName[0]}
                      {research.lead.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {research.lead.title ? `${research.lead.title} ` : ''}
                      {research.lead.firstName} {research.lead.lastName}
                    </div>
                    {research.lead.position && (
                      <div className="text-xs">{research.lead.position}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {research.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {research.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
