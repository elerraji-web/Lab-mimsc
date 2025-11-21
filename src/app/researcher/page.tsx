'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  User, 
  BookOpen, 
  Award, 
  Users, 
  Calendar,
  ExternalLink,
  Download,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Trophy
} from 'lucide-react';

interface ResearcherData {
  personalInfo: {
    firstName: string;
    lastName: string;
    title: string;
    position: string;
    email: string;
    phone: string;
    office: string;
    avatar: string;
    bio: string;
    interests: string[];
    links: {
      googleScholar?: string;
      researchGate?: string;
      linkedin?: string;
      orcid?: string;
    };
  };
  scientificActivity: {
    publications: Array<{
      id: string;
      title: string;
      authors: string[];
      journal: string;
      year: number;
      volume?: string;
      issue?: string;
      pages?: string;
      doi?: string;
      type: string;
      abstract?: string;
    }>;
    projects: Array<{
      id: string;
      title: string;
      description: string;
      funding: string;
      duration: string;
      role: string;
      status: string;
      partners: string[];
    }>;
    supervisions: Array<{
      id: string;
      studentName: string;
      thesisTitle: string;
      type: string;
      startDate: string;
      endDate: string;
      status: string;
      coSupervisors: string[];
    }>;
    conferences: Array<{
      id: string;
      title: string;
      conference: string;
      location: string;
      date: string;
      type: string;
    }>;
  };
  pedagogicalActivity: {
    courses: Array<{
      id: string;
      title: string;
      code: string;
      level: string;
      program: string;
      semester: string;
      hours: number;
      description: string;
      objectives: string[];
    }>;
    tutorials: Array<{
      id: string;
      title: string;
      type: string;
      audience: string;
      duration: string;
      date: string;
      participants: number;
      description: string;
    }>;
    responsibilities: Array<{
      id: string;
      title: string;
      period: string;
      description: string;
    }>;
    innovations: Array<{
      id: string;
      title: string;
      description: string;
      year: number;
      impact: string;
      recognition: string;
    }>;
  };
  honors: Array<{
    id: string;
    title: string;
    organization: string;
    year: number;
    description: string;
  }>;
}

export default function ResearcherProfile() {
  const [researcherData, setResearcherData] = useState<ResearcherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate loading data from JSON file
  useState(() => {
    // In a real app, you would fetch this from an API or import the JSON
    import('@/data/researcher.json').then((data) => {
      setResearcherData(data.default);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!researcherData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Erreur lors du chargement du profil</p>
        </div>
      </div>
    );
  }

  const { personalInfo, scientificActivity, pedagogicalActivity, honors } = researcherData;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="text-center">
                <CardHeader>
                  <Avatar className="w-32 h-32 mx-auto mb-4">
                    <AvatarImage src={personalInfo.avatar} />
                    <AvatarFallback className="text-2xl">
                      {personalInfo.firstName[0]}{personalInfo.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-2xl">
                    {personalInfo.title} {personalInfo.firstName} {personalInfo.lastName}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {personalInfo.position}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${personalInfo.email}`} className="hover:text-primary">
                        {personalInfo.email}
                      </a>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Phone className="w-4 h-4" />
                      <span>{personalInfo.phone}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{personalInfo.office}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">Centres d'intérêt</h4>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {personalInfo.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">Liens</h4>
                    <div className="space-y-1">
                      {personalInfo.links.googleScholar && (
                        <a href={personalInfo.links.googleScholar} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary">
                          <Globe className="w-4 h-4" />
                          Google Scholar
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {personalInfo.links.researchGate && (
                        <a href={personalInfo.links.researchGate} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary">
                          <Globe className="w-4 h-4" />
                          ResearchGate
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {personalInfo.links.linkedin && (
                        <a href={personalInfo.links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary">
                          <Globe className="w-4 h-4" />
                          LinkedIn
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {personalInfo.links.orcid && (
                        <a href={personalInfo.links.orcid} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary">
                          <Globe className="w-4 h-4" />
                          ORCID
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bio and Overview */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-4">Profil Professionnel</h1>
                <p className="text-muted-foreground leading-relaxed">
                  {personalInfo.bio}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{scientificActivity.publications.length}</div>
                    <div className="text-sm text-muted-foreground">Publications</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{scientificActivity.projects.length}</div>
                    <div className="text-sm text-muted-foreground">Projets</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{scientificActivity.supervisions.length}</div>
                    <div className="text-sm text-muted-foreground">Supervisions</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{honors.length}</div>
                    <div className="text-sm text-muted-foreground">Distinctions</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Honors */}
              {honors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Distinctions Récentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {honors.slice(0, 3).map((honor) => (
                        <div key={honor.id} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium">{honor.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {honor.organization} • {honor.year}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <Tabs defaultValue="scientific" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scientific" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Activité Scientifique
            </TabsTrigger>
            <TabsTrigger value="pedagogical" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Activité Pédagogique
            </TabsTrigger>
          </TabsList>

          {/* Scientific Activity Tab */}
          <TabsContent value="scientific" className="mt-8 space-y-8">
            {/* Publications */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  Publications
                </h2>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>
              
              <div className="space-y-4">
                {scientificActivity.publications.map((pub) => (
                  <Card key={pub.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight">{pub.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {pub.authors.join(', ')}
                          </CardDescription>
                        </div>
                        <div className="text-right ml-4">
                          <Badge variant="secondary">{pub.year}</Badge>
                          <div className="text-sm text-muted-foreground mt-1">{pub.type}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        {pub.journal}
                        {pub.volume && `, Vol. ${pub.volume}`}
                        {pub.issue && `, No. ${pub.issue}`}
                        {pub.pages && `, pp. ${pub.pages}`}
                      </p>
                      {pub.doi && (
                        <a 
                          href={`https://doi.org/${pub.doi}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          DOI: {pub.doi}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6" />
                Projets de Recherche
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {scientificActivity.projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                        <Badge variant={project.status === 'Actif' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Financement:</span>
                          <p className="text-muted-foreground">{project.funding}</p>
                        </div>
                        <div>
                          <span className="font-medium">Durée:</span>
                          <p className="text-muted-foreground">{project.duration}</p>
                        </div>
                        <div>
                          <span className="font-medium">Rôle:</span>
                          <p className="text-muted-foreground">{project.role}</p>
                        </div>
                        <div>
                          <span className="font-medium">Partenaires:</span>
                          <p className="text-muted-foreground">{project.partners.join(', ')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Supervisions */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Supervisions
              </h2>
              
              <div className="space-y-4">
                {scientificActivity.supervisions.map((sup) => (
                  <Card key={sup.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{sup.studentName}</CardTitle>
                          <CardDescription>{sup.thesisTitle}</CardDescription>
                        </div>
                        <div className="text-right">
                          <Badge variant={sup.status === 'En cours' ? 'default' : 'secondary'}>
                            {sup.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-1">{sup.type}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Début:</span>
                          <p className="text-muted-foreground">{sup.startDate}</p>
                        </div>
                        <div>
                          <span className="font-medium">Fin:</span>
                          <p className="text-muted-foreground">{sup.endDate}</p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium">Co-superviseurs:</span>
                          <p className="text-muted-foreground">
                            {sup.coSupervisors.length > 0 ? sup.coSupervisors.join(', ') : 'Aucun'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Conferences */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Conférences et Présentations
              </h2>
              
              <div className="space-y-4">
                {scientificActivity.conferences.map((conf) => (
                  <Card key={conf.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{conf.title}</CardTitle>
                          <CardDescription>{conf.conference}</CardDescription>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{conf.type}</Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            {new Date(conf.date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {conf.location}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* Pedagogical Activity Tab */}
          <TabsContent value="pedagogical" className="mt-8 space-y-8">
            {/* Courses */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Cours Enseignés
              </h2>
              
              <div className="space-y-4">
                {pedagogicalActivity.courses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <CardDescription>
                            {course.code} • {course.program} • {course.level}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{course.hours}h</Badge>
                          <div className="text-sm text-muted-foreground mt-1">{course.semester}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Objectifs:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {course.objectives.map((obj, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Tutorials and Workshops */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Lightbulb className="w-6 h-6" />
                Tutoriels et Ateliers
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {pedagogicalActivity.tutorials.map((tutorial) => (
                  <Card key={tutorial.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                          <CardDescription>{tutorial.type}</CardDescription>
                        </div>
                        <Badge variant="outline">{tutorial.participants} participants</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Durée:</span>
                          <p className="text-muted-foreground">{tutorial.duration}</p>
                        </div>
                        <div>
                          <span className="font-medium">Date:</span>
                          <p className="text-muted-foreground">
                            {new Date(tutorial.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">Public:</span>
                          <p className="text-muted-foreground">{tutorial.audience}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6" />
                Responsabilités Administratives
              </h2>
              
              <div className="space-y-4">
                {pedagogicalActivity.responsibilities.map((resp) => (
                  <Card key={resp.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{resp.title}</CardTitle>
                          <CardDescription>{resp.period}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{resp.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Innovations */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Lightbulb className="w-6 h-6" />
                Innovations Pédagogiques
              </h2>
              
              <div className="space-y-4">
                {pedagogicalActivity.innovations.map((innovation) => (
                  <Card key={innovation.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{innovation.title}</CardTitle>
                          <CardDescription>{innovation.year}</CardDescription>
                        </div>
                        <Badge variant="secondary">{innovation.recognition}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{innovation.description}</p>
                      <p className="text-sm font-medium text-primary">
                        Impact: {innovation.impact}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}