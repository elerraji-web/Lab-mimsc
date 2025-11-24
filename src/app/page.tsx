'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Globe, Users, BookOpen, Microscope, Award, LogIn } from 'lucide-react';
import Link from 'next/link';
import DynamicTeamSection from '@/components/DynamicTeamSection';
import DynamicPublications from '@/components/DynamicPublications';
import DynamicEvents from '@/components/DynamicEvents';
import DynamicFaculty from '@/components/DynamicFaculty';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');

  const researchAreas = [
    {
      title: 'Analyse Mathématique et Calcul Scientifique',
      subtitle: 'EDP & Méthodes Numériques',
      description:
        "Résolution d'équations aux dérivées partielles et développement de méthodes numériques pour la simulation de systèmes complexes.",
      tags: ['EDP', 'Calcul Scientifique', 'Simulation']
    },
    {
      title: 'Transport Optimal, EDP et Graphes',
      subtitle: 'Applications aux Sciences des Données',
      description: 'Théorie du transport optimal et applications aux problèmes de traitement et analyse de données sur graphes.',
      tags: ['Transport Optimal', 'Graphes', 'Data Science']
    },
    {
      title: 'Modélisation Mathématique en Biomédecine',
      subtitle: 'Électrocardiographie & Reconstruction',
      description: 'Modélisation pour la reconstruction des potentiels épi-cardiaques et applications en électrocardiographie.',
      tags: ['Biomédecine', 'ECG', 'Reconstruction']
    },
    {
      title: 'Traitement et Restauration d\'Images',
      subtitle: 'Équations Non Linéaires',
      description: 'Application d\'équations non linéaires pour la restauration et le traitement d\'images médicales et scientifiques.',
      tags: ['Traitement d\'Images', 'Restauration', 'EDP Non Linéaires']
    },
    {
      title: 'Modélisation Environnementale',
      subtitle: 'Systèmes Complexes',
      description: 'Modélisation de problèmes environnementaux via des approches mathématiques et informatiques avancées.',
      tags: ['Environnement', 'Modélisation', 'Systèmes Complexes']
    },
    {
      title: 'Méthodes Informatiques pour les Nouvelles Technologies',
      subtitle: 'Deep Learning & IA',
      description: "Développement de méthodes informatiques avancées incluant les réseaux de neurones profonds pour la segmentation 3D et l'analyse de données.",
      tags: ['Deep Learning', 'IA', 'Segmentation 3D']
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Header - Formal Academic Style */}
      <header className="fixed top-0 w-full bg-card border-b-2 border-primary/10 z-50 shadow-sm">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/logo.svg" alt="MIMSC Logo" className="w-12 h-12 object-contain rounded-none border-2 border-primary" />
              <div>
                <h1 className="text-xl font-bold tracking-tight">MIMSC</h1>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">UCA · EST Essaouira</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              <button onClick={() => scrollToSection('home')} className="px-4 py-2 text-sm font-medium hover:text-primary hover:bg-accent/50 transition-colors rounded-none">
                Accueil
              </button>
              <button onClick={() => scrollToSection('about')} className="px-4 py-2 text-sm font-medium hover:text-primary hover:bg-accent/50 transition-colors rounded-none">
                À Propos
              </button>
              <button onClick={() => scrollToSection('research')} className="px-4 py-2 text-sm font-medium hover:text-primary hover:bg-accent/50 transition-colors rounded-none">
                Recherche
              </button>
              <button onClick={() => scrollToSection('team')} className="px-4 py-2 text-sm font-medium hover:text-primary hover:bg-accent/50 transition-colors rounded-none">
                Équipe
              </button>
              <button onClick={() => scrollToSection('publications')} className="px-4 py-2 text-sm font-medium hover:text-primary hover:bg-accent/50 transition-colors rounded-none">
                Publications
              </button>
              <button onClick={() => scrollToSection('contact')} className="px-4 py-2 text-sm font-medium hover:text-primary hover:bg-accent/50 transition-colors rounded-none">
                Contact
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="outline" size="sm" className="rounded-none border-2">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="rounded-none border-2">
                EN
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section - Formal Academic Design */}
      <section id="home" className="pt-24 min-h-screen flex items-center bg-card border-b-2 border-primary/10">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="rounded-none px-4 py-1.5 text-xs uppercase tracking-wider font-semibold">
                  Laboratoire de Recherche
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                  Laboratoire de Mathématiques, Informatique et
                  <br />
                  <span className="text-primary">Modélisation des Systèmes Complexes</span>
                </h1>
                <p className="text-2xl font-semibold text-muted-foreground tracking-wide">
                  MIMSC
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-foreground/80 leading-relaxed">
                  Le laboratoire MIMSC, rattaché à l'École Supérieure de Technologie (EST) de l'Université Cadi Ayyad (UCA),
                  se consacre à la modélisation mathématique et informatique de systèmes complexes issus de l'environnement,
                  de l'analyse de données, de la physique et de la finance.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button size="lg" onClick={() => scrollToSection('research')} className="rounded-none px-8 py-6 text-base font-semibold">
                  Découvrir nos Recherches
                </Button>
                <Button variant="outline" size="lg" onClick={() => scrollToSection('contact')} className="rounded-none px-8 py-6 text-base font-semibold border-2">
                  Nous Contacter
                </Button>
              </div>

              {/* Statistics - Formal Layout */}
              <div className="grid grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto border-t border-border">
                <div className="text-center py-6 border-r border-border last:border-r-0">
                  <div className="text-4xl font-bold text-primary mb-2">50+</div>
                  <div className="text-sm uppercase tracking-wider text-muted-foreground font-medium">Publications</div>
                </div>
                <div className="text-center py-6 border-r border-border last:border-r-0">
                  <div className="text-4xl font-bold text-primary mb-2">15</div>
                  <div className="text-sm uppercase tracking-wider text-muted-foreground font-medium">Membres</div>
                </div>
                <div className="text-center py-6">
                  <div className="text-4xl font-bold text-primary mb-2">8</div>
                  <div className="text-sm uppercase tracking-wider text-muted-foreground font-medium">Projets</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Formal Academic Structure */}
      <section id="about" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="rounded-none px-4 py-1.5 text-xs uppercase tracking-wider font-semibold">
              À Propos
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Notre Laboratoire</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Rattaché à l'École Supérieure de Technologie de l'Université Cadi Ayyad
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <Card className="rounded-none border-2 hover:border-primary/30 transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-primary/10 rounded-none">
                    <Microscope className="w-5 h-5 text-primary" />
                  </div>
                  Recherche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  Modélisation mathématique et informatique de systèmes complexes via équations différentielles, optimisation et contrôle optimal.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-none border-2 hover:border-primary/30 transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-primary/10 rounded-none">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  Collaborations nationales et internationales sur des problèmes issus de l'environnement, des sciences des données et de la physique.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-none border-2 hover:border-primary/30 transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-primary/10 rounded-none">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  Formation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  Formation doctorale et encadrement d'étudiants en mathématiques appliquées, informatique et modélisation.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-none border-2 hover:border-primary/30 transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-primary/10 rounded-none">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  Excellence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  Publications dans des revues internationales de haut niveau et contributions scientifiques reconnues.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Research Section - Structured Academic Layout */}
      <section id="research" className="py-24 bg-card border-y-2 border-primary/10">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="rounded-none px-4 py-1.5 text-xs uppercase tracking-wider font-semibold">
              Recherche
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Axes de Recherche</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Nos domaines d'expertise et projets de recherche innovants
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {researchAreas.map((area) => (
              <Card key={area.title} className="rounded-none border-2 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold leading-tight">{area.title}</CardTitle>
                  <CardDescription className="text-sm font-medium text-primary/70">{area.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-foreground/70 leading-relaxed">{area.description}</p>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    {area.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-none text-xs font-medium">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Professional Academic Layout */}
      <section id="team" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="rounded-none px-4 py-1.5 text-xs uppercase tracking-wider font-semibold">
              Équipe
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Notre Équipe</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Des chercheurs passionnés dédiés à l'excellence scientifique
            </p>
          </div>

          <Tabs defaultValue="faculty" className="w-full max-w-7xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 rounded-none border-2 h-12">
              <TabsTrigger value="faculty" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium">
                Enseignants-Chercheurs
              </TabsTrigger>
              <TabsTrigger value="phd" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium">
                Doctorants
              </TabsTrigger>
              <TabsTrigger value="master" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium">
                Étudiants Master
              </TabsTrigger>
            </TabsList>

          <TabsContent value="faculty" className="mt-8">
              <DynamicFaculty />
            </TabsContent>

            <TabsContent value="phd" className="mt-8">
              <DynamicTeamSection studentType="PHD" title="Doctorants" />
            </TabsContent>

            <TabsContent value="master" className="mt-8">
              <DynamicTeamSection studentType="MASTER" title="Étudiants Master" />
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Publications Section */}
      <section id="publications" className="py-24 bg-card border-y-2 border-primary/10">
        <div className="container mx-auto px-6">
          <DynamicPublications limit={6} showHeader={true} />
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <DynamicEvents limit={6} showHeader={true} upcomingOnly={true} />
        </div>
      </section>

      {/* Contact Section - Formal Professional Style */}
      <section id="contact" className="py-24 bg-card border-t-2 border-primary/10">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="rounded-none px-4 py-1.5 text-xs uppercase tracking-wider font-semibold">
              Contact
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Contactez-nous</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Nous sommes ouverts à la collaboration et aux nouvelles opportunités de recherche
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Informations de Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Adresse</p>
                      <p className="text-sm text-muted-foreground">
                        École Supérieure de Technologie<br />
                        Université Cadi Ayyad<br />
                        Essaouira / Marrakech, Maroc
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        mimsc@este.uca.ma
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-sm text-muted-foreground">
                        +212 524 78 90 12
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Site Web</p>
                      <p className="text-sm text-muted-foreground">
                        www.este.uca.ma/mimsc
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="rounded-none border-2">
              <CardHeader className="border-b-2 border-border bg-muted/30">
                <CardTitle className="text-xl font-bold">Envoyez-nous un Message</CardTitle>
                <CardDescription className="text-sm">
                  Nous vous répondrons dans les plus brefs délais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-semibold">Prénom</Label>
                    <Input id="firstName" placeholder="Votre prénom" className="rounded-none mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-semibold">Nom</Label>
                    <Input id="lastName" placeholder="Votre nom" className="rounded-none mt-1.5" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                  <Input id="email" type="email" placeholder="votre@email.com" className="rounded-none mt-1.5" />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm font-semibold">Sujet</Label>
                  <Input id="subject" placeholder="Sujet de votre message" className="rounded-none mt-1.5" />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-semibold">Message</Label>
                  <Textarea id="message" placeholder="Votre message..." rows={5} className="rounded-none mt-1.5" />
                </div>

                <Button className="w-full rounded-none py-6 text-base font-semibold">
                  Envoyer le Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer - Professional Academic Style */}
      <footer className="bg-primary/5 border-t-2 border-primary/20">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-none flex items-center justify-center border-2 border-primary">
                  <Microscope className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">MIMSC</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">UCA EST</p>
                </div>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Laboratoire de Mathématiques, Informatique et Modélisation des Systèmes Complexes.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Liens Rapides</h4>
              <div className="space-y-2">
                <button onClick={() => scrollToSection('home')} className="text-sm text-muted-foreground hover:text-primary block text-left">
                  Accueil
                </button>
                <button onClick={() => scrollToSection('about')} className="text-sm text-muted-foreground hover:text-primary block text-left">
                  À Propos
                </button>
                <button onClick={() => scrollToSection('research')} className="text-sm text-muted-foreground hover:text-primary block text-left">
                  Recherche
                </button>
                <button onClick={() => scrollToSection('team')} className="text-sm text-muted-foreground hover:text-primary block text-left">
                  Équipe
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Recherche</h4>
              <div className="space-y-2">
                <button className="text-sm text-muted-foreground hover:text-primary block text-left">
                  Publications
                </button>
                <button className="text-sm text-muted-foreground hover:text-primary block text-left">
                  Projets
                </button>
                <button className="text-sm text-muted-foreground hover:text-primary block text-left">
                  Collaborations
                </button>
                <button className="text-sm text-muted-foreground hover:text-primary block text-left">
                  Séminaires
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Contact</h4>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  mimsc@este.uca.ma
                </p>
                <p className="text-sm text-muted-foreground">
                  +212 524 78 90 12
                </p>
                <p className="text-sm text-muted-foreground">
                  Essaouira / Marrakech, Maroc
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-10 bg-border" />

          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pt-4">
            <p className="text-sm text-foreground/60">
              © 2024 MIMSC - Université Cadi Ayyad. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <button className="text-sm text-foreground/60 hover:text-primary font-medium transition-colors">
                Mentions Légales
              </button>
              <button className="text-sm text-foreground/60 hover:text-primary font-medium transition-colors">
                Politique de Confidentialité
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}