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
import { Mail, Phone, MapPin, Globe, Users, BookOpen, Microscope, Award } from 'lucide-react';
import DynamicTeamSection from '@/components/DynamicTeamSection';
import DynamicPublications from '@/components/DynamicPublications';
import DynamicEvents from '@/components/DynamicEvents';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Microscope className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">MIMSC Lab</h1>
                <p className="text-xs text-muted-foreground">UCA ESTE</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => scrollToSection('home')} className="text-sm font-medium hover:text-primary transition-colors">
                Accueil
              </button>
              <button onClick={() => scrollToSection('about')} className="text-sm font-medium hover:text-primary transition-colors">
                À Propos
              </button>
              <button onClick={() => scrollToSection('research')} className="text-sm font-medium hover:text-primary transition-colors">
                Recherche
              </button>
              <button onClick={() => scrollToSection('team')} className="text-sm font-medium hover:text-primary transition-colors">
                Équipe
              </button>
              <button onClick={() => scrollToSection('publications')} className="text-sm font-medium hover:text-primary transition-colors">
                Publications
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-sm font-medium hover:text-primary transition-colors">
                Contact
              </button>
            </div>

            <Button variant="outline" size="sm">
              EN
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-20 min-h-screen flex items-center bg-gradient-to-br from-primary/5 to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="secondary">Laboratoire de Recherche</Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Modélisation, Intelligence et
                  <span className="text-primary"> Multimédia</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Sciences et Calcul
                </p>
              </div>
              
              <p className="text-lg text-muted-foreground max-w-2xl">
                Le laboratoire MIMSC de l'UCA ESTE se consacre à la recherche avancée en modélisation mathématique, 
                intelligence artificielle et traitement du multimédia pour résoudre des problèmes complexes.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => scrollToSection('research')}>
                  Découvrir nos recherches
                </Button>
                <Button variant="outline" size="lg" onClick={() => scrollToSection('contact')}>
                  Nous contacter
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Publications</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">15</div>
                  <div className="text-sm text-muted-foreground">Membres</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">8</div>
                  <div className="text-sm text-muted-foreground">Projets</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                  <Microscope className="w-16 h-16 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="secondary">À Propos</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Notre Laboratoire</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Excellence en recherche et innovation pour un avenir numérique
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-primary" />
                  Recherche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Recherche fondamentale et appliquée en intelligence artificielle et modélisation mathématique.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Partenariats avec des institutions nationales et internationales pour des projets innovants.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Formation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Encadrement d'étudiants et formation à la pointe de la technologie et de la recherche.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Excellence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Engagement vers l'excellence académique et l'impact sociétal de nos recherches.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="secondary">Recherche</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Axes de Recherche</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nos domaines d'expertise et projets de recherche innovants
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Intelligence Artificielle</CardTitle>
                <CardDescription>Machine Learning & Deep Learning</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Développement d'algorithmes avancés pour l'apprentissage automatique et l'analyse de données complexes.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">ML</Badge>
                  <Badge variant="outline">DL</Badge>
                  <Badge variant="outline">NLP</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Traitement du Multimédia</CardTitle>
                <CardDescription>Image, Audio & Vidéo</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Analyse et traitement avancé du contenu multimédia pour diverses applications industrielles.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">CV</Badge>
                  <Badge variant="outline">Audio</Badge>
                  <Badge variant="outline">VR</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Modélisation Mathématique</CardTitle>
                <CardDescription>Simulation & Optimisation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Modélisation mathématique de systèmes complexes et optimisation pour la prise de décision.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Math</Badge>
                  <Badge variant="outline">Optimisation</Badge>
                  <Badge variant="outline">Simulation</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Big Data Analytics</CardTitle>
                <CardDescription>Data Mining & Visualisation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Extraction de connaissances à partir de grandes masses de données et visualisation interactive.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Data Mining</Badge>
                  <Badge variant="outline">Analytics</Badge>
                  <Badge variant="outline">Viz</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>IoT & Systèmes Intelligents</CardTitle>
                <CardDescription>Capteurs & Automatisation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Développement de systèmes intelligents connectés pour l'industrie et les smart cities.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">IoT</Badge>
                  <Badge variant="outline">Smart Systems</Badge>
                  <Badge variant="outline">Sensors</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Sécurité Informatique</CardTitle>
                <CardDescription>Cryptographie & Privacy</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Recherche en sécurité des systèmes d'information et protection des données personnelles.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Security</Badge>
                  <Badge variant="outline">Crypto</Badge>
                  <Badge variant="outline">Privacy</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="secondary">Équipe</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Notre Équipe</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des chercheurs passionnés dédiés à l'excellence scientifique
            </p>
          </div>

          <Tabs defaultValue="faculty" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="faculty">Enseignants-Chercheurs</TabsTrigger>
              <TabsTrigger value="phd">Doctorants</TabsTrigger>
              <TabsTrigger value="master">Étudiants Master</TabsTrigger>
            </TabsList>

            <TabsContent value="faculty" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src="" />
                      <AvatarFallback>DR</AvatarFallback>
                    </Avatar>
                    <CardTitle>Dr. Ahmed Mohammed</CardTitle>
                    <CardDescription>Directeur du Laboratoire</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      Expert en intelligence artificielle et apprentissage automatique.
                    </p>
                    <div className="flex justify-center gap-2 mt-4">
                      <Badge variant="outline">IA</Badge>
                      <Badge variant="outline">ML</Badge>
                    </div>
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = '/researcher'}
                      >
                        Voir le profil
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src="" />
                      <AvatarFallback>PR</AvatarFallback>
                    </Avatar>
                    <CardTitle>Pr. Fatima Zahra</CardTitle>
                    <CardDescription>Co-Directrice</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      Spécialiste en traitement du signal et analyse d'images.
                    </p>
                    <div className="flex justify-center gap-2 mt-4">
                      <Badge variant="outline">Signal</Badge>
                      <Badge variant="outline">CV</Badge>
                    </div>
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = '/researcher'}
                      >
                        Voir le profil
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src="" />
                      <AvatarFallback>DR</AvatarFallback>
                    </Avatar>
                    <CardTitle>Dr. Karim Omar</CardTitle>
                    <CardDescription>Chercheur Senior</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      Expert en modélisation mathématique et optimisation.
                    </p>
                    <div className="flex justify-center gap-2 mt-4">
                      <Badge variant="outline">Math</Badge>
                      <Badge variant="outline">Optimisation</Badge>
                    </div>
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = '/researcher'}
                      >
                        Voir le profil
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
      <section id="publications" className="py-20">
        <div className="container mx-auto px-4">
          <DynamicPublications limit={6} showHeader={true} />
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <DynamicEvents limit={6} showHeader={true} upcomingOnly={true} />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="secondary">Contact</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Contactez-nous</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                        École Supérieure de Technologie d'Essaouira<br />
                        Université Cadi Ayyad<br />
                        Essaouira, Maroc
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

            <Card>
              <CardHeader>
                <CardTitle>Envoyez-nous un message</CardTitle>
                <CardDescription>
                  Nous vous répondrons dans les plus brefs délais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" placeholder="Votre prénom" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" placeholder="Votre nom" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="votre@email.com" />
                </div>

                <div>
                  <Label htmlFor="subject">Sujet</Label>
                  <Input id="subject" placeholder="Sujet de votre message" />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Votre message..." rows={4} />
                </div>

                <Button className="w-full">
                  Envoyer le message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Microscope className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold">MIMSC Lab</h3>
                  <p className="text-xs text-muted-foreground">UCA ESTE</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Laboratoire de recherche en modélisation, intelligence et multimédia.
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
                  Essaouira, Maroc
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 MIMSC Lab. Tous droits réservés.
            </p>
            <div className="flex space-x-4">
              <button className="text-sm text-muted-foreground hover:text-primary">
                Mentions Légales
              </button>
              <button className="text-sm text-muted-foreground hover:text-primary">
                Politique de Confidentialité
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}