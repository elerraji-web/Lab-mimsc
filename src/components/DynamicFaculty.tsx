'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Faculty {
  _id: string;
  firstName: string;
  lastName: string;
  title?: string;
  position: string;
  department?: string;
  bio?: string;
  interests?: string[];
  avatar?: string;
  links?: {
    googleScholar?: string;
    researchGate?: string;
    linkedin?: string;
    website?: string;
  };
}

interface DynamicFacultyProps {
  limit?: number;
}

export default function DynamicFaculty({ limit = 6 }: DynamicFacultyProps) {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch(`/api/users?type=FACULTY&isActive=true`);
        if (!response.ok) {
          throw new Error('Failed to fetch faculty');
        }
        const data = await response.json();
        if (data.success) {
          const people: Faculty[] = data.data;
          setFaculty(limit ? people.slice(0, limit) : people);
        } else {
          setError(data.error || 'Unable to load faculty');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
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
        <p className="text-muted-foreground">Erreur lors du chargement des enseignants-chercheurs</p>
      </div>
    );
  }

  if (faculty.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun enseignant-chercheur trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {faculty.map((member) => (
        <Card key={member._id}>
          <CardHeader className="text-center">
            <Avatar className="w-20 h-20 mx-auto mb-4">
              <AvatarImage src={member.avatar} />
              <AvatarFallback>
                {member.firstName[0]}
                {member.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">
              {member.title ? `${member.title} ` : ''}
              {member.firstName} {member.lastName}
            </CardTitle>
            <CardDescription>{member.position}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-center">
            {member.bio && (
              <p className="text-sm text-muted-foreground">{member.bio}</p>
            )}
            {member.interests && member.interests.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {member.interests.slice(0, 3).map((interest) => (
                  <Badge key={interest} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            )}
            {member.links && (
              <div className="flex flex-wrap justify-center gap-2">
                {member.links.googleScholar && (
                  <Button asChild variant="outline" size="sm">
                    <a href={member.links.googleScholar} target="_blank" rel="noreferrer">Scholar</a>
                  </Button>
                )}
                {member.links.researchGate && (
                  <Button asChild variant="outline" size="sm">
                    <a href={member.links.researchGate} target="_blank" rel="noreferrer">RG</a>
                  </Button>
                )}
                {member.links.linkedin && (
                  <Button asChild variant="outline" size="sm">
                    <a href={member.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                  </Button>
                )}
                {member.links.website && (
                  <Button asChild variant="outline" size="sm">
                    <a href={member.links.website} target="_blank" rel="noreferrer">Site</a>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
