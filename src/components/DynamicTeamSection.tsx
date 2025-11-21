'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentType: 'PHD' | 'MASTER' | 'POSTDOC';
  program: string;
  specialization: string;
  thesisTitle?: string;
  researchArea: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_LEAVE' | 'WITHDRAWN';
  bio?: string;
  interests: string[];
  supervisor?: {
    firstName: string;
    lastName: string;
    title: string;
    position: string;
  };
  coSupervisors?: Array<{
    firstName: string;
    lastName: string;
    title: string;
    position: string;
  }>;
}

interface DynamicTeamSectionProps {
  studentType: 'PHD' | 'MASTER';
  title: string;
}

export default function DynamicTeamSection({ studentType, title }: DynamicTeamSectionProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`/api/students?type=${studentType}&status=ACTIVE`);
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        if (data.success) {
          setStudents(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [studentType]);

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
        <p className="text-muted-foreground">Erreur lors du chargement des étudiants</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun étudiant trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {students.map((student) => (
        <Card key={student._id}>
          <CardHeader className="text-center">
            <Avatar className="w-16 h-16 mx-auto mb-4">
              <AvatarImage src={student.avatar} />
              <AvatarFallback>
                {student.firstName[0]}{student.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">
              {student.firstName} {student.lastName}
            </CardTitle>
            <CardDescription>
              {student.studentType === 'PHD' ? 'Doctorant' : 'Master'} 
              {student.studentType === 'PHD' && student.thesisTitle && ` - ${getYearLabel(student)}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground text-center mb-3">
              {student.thesisTitle || student.specialization}
            </p>
            <div className="flex flex-wrap gap-1 justify-center mb-3">
              {student.interests.slice(0, 2).map((interest, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
            {student.supervisor && (
              <p className="text-xs text-muted-foreground text-center">
                Superviseur: {student.supervisor.firstName} {student.supervisor.lastName}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getYearLabel(student: Student): string {
  const startDate = new Date(student.startDate);
  const currentDate = new Date();
  const yearsDiff = currentDate.getFullYear() - startDate.getFullYear();
  
  if (yearsDiff === 0) return '1ère année';
  if (yearsDiff === 1) return '2ème année';
  if (yearsDiff === 2) return '3ème année';
  return `${yearsDiff + 1}ème année`;
}