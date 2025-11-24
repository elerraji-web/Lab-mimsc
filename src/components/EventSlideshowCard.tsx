'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  type: 'CONFERENCE' | 'SEMINAR' | 'WORKSHOP' | 'DEFENSE' | 'MEETING' | 'SOCIAL' | 'OTHER';
  startDate: string;
  endDate: string;
  location: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}

export default function EventSlideshowCard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?upcoming=true&limit=5');
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
  }, []);

  useEffect(() => {
    if (events.length === 0) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
        setFade(true);
      }, 250);
    }, 5000);

    return () => clearInterval(interval);
  }, [events.length]);

  if (loading) {
    return (
      <Card className="w-[300px] h-[150px] overflow-hidden hidden md:block shadow-md border border-gray-200 transition-all duration-500 ease-in-out">
        <CardContent className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-[300px] h-[150px] overflow-hidden hidden md:block shadow-md border border-gray-200 transition-all duration-500 ease-in-out">
        <CardContent className="text-center flex items-center justify-center h-full">
          <p className="text-muted-foreground text-sm">Error loading events</p>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="w-[300px] h-[150px] overflow-hidden hidden md:block shadow-md border border-gray-200 transition-all duration-500 ease-in-out">
        <CardContent className="text-center flex items-center justify-center h-full">
          <p className="text-muted-foreground text-sm">No upcoming events at this time.</p>
        </CardContent>
      </Card>
    );
  }

  const currentEvent = events[currentIndex];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'CONFERENCE': return 'Conference';
      case 'SEMINAR': return 'Seminar';
      case 'WORKSHOP': return 'Workshop';
      case 'DEFENSE': return 'Defense';
      case 'MEETING': return 'Meeting';
      case 'SOCIAL': return 'Social';
      case 'OTHER': return 'Other';
      default: return type;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className={`w-[300px] h-[150px] overflow-hidden hidden md:block shadow-md border border-gray-200 transition-all duration-500 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between mb-1">
          <Badge variant="outline" className="text-xs">
            {getTypeLabel(currentEvent.type)}
          </Badge>
          <div className="flex space-x-1">
            {events.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
        <CardTitle className="text-sm leading-tight">{currentEvent.title}</CardTitle>
        <CardDescription className="text-xs line-clamp-2">
          {currentEvent.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{formatDateTime(currentEvent.startDate)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{currentEvent.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}