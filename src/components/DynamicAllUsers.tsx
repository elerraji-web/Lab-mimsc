'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  title?: string;
  position: string;
  department?: string;
  bio?: string;
  interests?: string[];
  avatar?: string;
  userType: string;
  links?: {
    googleScholar?: string;
    researchGate?: string;
    linkedin?: string;
    website?: string;
  };
}

interface DynamicAllUsersProps {
  limit?: number;
}

export default function DynamicAllUsers({ limit }: DynamicAllUsersProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/users?isActive=true`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        if (data.success) {
          const people: User[] = data.data;
          setUsers(limit ? people.slice(0, limit) : people);
        } else {
          setError(data.error || 'Unable to load users');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
        <p className="text-muted-foreground">Erreur lors du chargement des membres</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun membre trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((member) => (
        <Card key={member._id} className="rounded-none border-2 hover:border-primary/30 transition-all duration-300">
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
            <Badge variant="secondary" className="rounded-none w-fit mx-auto">
              {member.userType === 'FACULTY' ? 'Enseignant-Chercheur' :
               member.userType === 'STUDENT' ? 'Étudiant' :
               member.userType === 'STAFF' ? 'Personnel' :
               member.userType === 'POSTDOC' ? 'Post-Doctorant' : member.userType}
            </Badge>
          </CardHeader>
          <Collapsible open={expandedUsers[member._id] || false} onOpenChange={(open) => setExpandedUsers(prev => ({ ...prev, [member._id]: open })) }>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full mt-2 rounded-none">
                {expandedUsers[member._id] ? 'Masquer les détails' : 'Afficher les détails'}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3 text-center">
                {member.bio && (
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                )}
                {member.interests && member.interests.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.interests.slice(0, 3).map((interest) => (
                      <Badge key={interest} variant="outline" className="rounded-none text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
                {member.links && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.links.googleScholar && (
                      <Button asChild variant="outline" size="sm" className="rounded-none">
                        <a href={member.links.googleScholar} target="_blank" rel="noreferrer">Scholar</a>
                      </Button>
                    )}
                    {member.links.researchGate && (
                      <Button asChild variant="outline" size="sm" className="rounded-none">
                        <a href={member.links.researchGate} target="_blank" rel="noreferrer">RG</a>
                      </Button>
                    )}
                    {member.links.linkedin && (
                      <Button asChild variant="outline" size="sm" className="rounded-none">
                        <a href={member.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                      </Button>
                    )}
                    {member.links.website && (
                      <Button asChild variant="outline" size="sm" className="rounded-none">
                        <a href={member.links.website} target="_blank" rel="noreferrer">Site</a>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
}