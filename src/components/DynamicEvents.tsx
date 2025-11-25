'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import { normalizeAssetPath } from '@/lib/assetPaths';

interface Event {
  _id: string;
  title: string;
  description: string;
  type: 'CONFERENCE' | 'SEMINAR' | 'WORKSHOP' | 'DEFENSE' | 'MEETING' | 'SOCIAL' | 'OTHER';
  startDate: string;
  endDate: string;
  location: string;
  organizer?: {
    firstName: string;
    lastName: string;
    title: string;
    position: string;
  };
  speakers?: Array<{
    firstName: string;
    lastName: string;
    title: string;
    position: string;
  }>;
  maxAttendees?: number;
  isPublic: boolean;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  registrationRequired: boolean;
  registrationDeadline?: string;
  externalUrl?: string;
  tags: string[];
  image?: string;
  poster?: string;
}

interface DynamicEventsProps {
  limit?: number;
  showHeader?: boolean;
  upcomingOnly?: boolean;
  mode?: 'hover' | 'background';
}

export default function DynamicEvents({ limit = 3, showHeader = true, upcomingOnly = true, mode = 'hover' }: DynamicEventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params = new URLSearchParams({
          limit: limit.toString(),
          ...(upcomingOnly && { upcoming: 'true' })
        });

        const response = await fetch(`/api/events?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        if (data.success) {
          setEvents(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [limit, upcomingOnly]);

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
        <p className="text-muted-foreground">Erreur lors du chargement des événements</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun événement à venir</p>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'CONFERENCE': return 'Conférence';
      case 'SEMINAR': return 'Séminaire';
      case 'WORKSHOP': return 'Atelier';
      case 'DEFENSE': return 'Soutenance';
      case 'MEETING': return 'Réunion';
      case 'SOCIAL': return 'Événement social';
      case 'OTHER': return 'Autre';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return <Badge variant="default">À venir</Badge>;
      case 'ONGOING':
        return <Badge variant="secondary">En cours</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline">Terminé</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="text-center space-y-4">
          <Badge variant="secondary">Événements</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Événements à venir</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos prochains événements, séminaires et activités scientifiques
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const isExpanded = expandedId === event._id;
          const cardClasses = mode === 'hover'
            ? 'hover:shadow-lg transition-all cursor-pointer'
            : 'relative overflow-hidden border-2 border-primary/10 bg-background';

          const imageUrl = normalizeAssetPath(event.image);
          const posterUrl = normalizeAssetPath(event.poster);

          return (
            <Card
              key={event._id}
              className={cardClasses}
              onClick={mode === 'hover' ? () => setExpandedId(isExpanded ? null : event._id) : undefined}
              onMouseEnter={mode === 'hover' ? () => setExpandedId(event._id) : undefined}
              onMouseLeave={mode === 'hover' ? () => setExpandedId(null) : undefined}
            >
              {mode === 'background' && imageUrl && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-25"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                  aria-hidden="true"
                />
              )}
              <div className={mode === 'background' ? 'relative' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {getTypeLabel(event.type)}
                    </Badge>
                    {getStatusBadge(event.status)}
                  </div>
                  <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                  <CardDescription className={mode === 'hover' && !isExpanded ? 'line-clamp-2' : ''}>
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    {event.organizer && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>Organisé par {event.organizer.firstName} {event.organizer.lastName}</span>
                      </div>
                    )}
                  </div>

                  {event.speakers && event.speakers.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Intervenants:</p>
                      <div className="text-sm text-muted-foreground">
                        {event.speakers.map((speaker, index) => (
                          <span key={index}>
                            {speaker.firstName} {speaker.lastName}
                            {index < event.speakers!.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {event.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {mode === 'hover' && isExpanded && imageUrl && (
                    <div className="overflow-hidden rounded-md border border-muted">
                      <img
                        src={imageUrl}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  {posterUrl && (
                    <Button
                      asChild
                      variant={mode === 'background' ? 'secondary' : 'outline'}
                      size="sm"
                      className="w-full"
                    >
                      <a href={posterUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Voir le PDF
                      </a>
                    </Button>
                  )}

                  {event.externalUrl && (
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <a href={event.externalUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Plus d'informations
                      </a>
                    </Button>
                  )}
                </CardContent>
              </div>
            </Card>
          );
        })}
      </div>

      {showHeader && (
        <div className="text-center">
          <Button variant="outline">
            Voir tous les événements
          </Button>
        </div>
      )}
    </div>
  );
}
