'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { normalizeAssetPath } from '@/lib/assetPaths';
import {
  Users,
  BookOpen,
  Calendar,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  title?: string;
  position: string;
  department?: string;
  phone?: string;
  office?: string;
  avatar?: string;
  bio?: string;
  interests?: string[];
  links?: {
    googleScholar?: string;
    researchGate?: string;
    linkedin?: string;
    orcid?: string;
    website?: string;
  };
  userType: string;
  approvalStatus: string;
}

interface Publication {
  _id: string;
  title: string;
  abstract?: string;
  type: string;
  authors: string[];
  journal?: string;
  conference?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  doi?: string;
  url?: string;
  year: number;
  venue: string;
  pdfUrl?: string;
  researchArea: string;
  tags?: string[];
  citations?: number;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer?: string;
  speakers?: string[];
  attendees?: string[];
  maxAttendees?: number;
  isPublic: boolean;
  status: string;
  registrationRequired: boolean;
  registrationDeadline?: string;
  externalUrl?: string;
  tags?: string[];
  poster?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface PublicationFormData {
  title: string;
  abstract: string;
  type: string;
  authors: string;
  journal: string;
  conference: string;
  volume: string;
  issue: string;
  pages: string;
  publisher: string;
  doi: string;
  url: string;
  year: string;
  venue: string;
  pdfUrl: string;
  researchArea: string;
  tags: string;
}

interface EventFormData {
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  location: string;
  speakers: string[];
  attendees: string[];
  maxAttendees: string;
  isPublic: boolean;
  status: string;
  registrationRequired: boolean;
  registrationDeadline: string;
  externalUrl: string;
  tags: string;
  poster: string;
  image: string;
}

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uiStatus, setUiStatus] = useState<'initial' | 'pending' | 'approved' | 'rejected'>('initial');
  const [isAddPublicationOpen, setIsAddPublicationOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [publicationForm, setPublicationForm] = useState<PublicationFormData>({
    title: '',
    abstract: '',
    type: 'JOURNAL_ARTICLE',
    authors: '',
    journal: '',
    conference: '',
    volume: '',
    issue: '',
    pages: '',
    publisher: '',
    doi: '',
    url: '',
    year: '',
    venue: '',
    pdfUrl: '',
    researchArea: '',
    tags: ''
  });
  const [eventForm, setEventForm] = useState<EventFormData>({
    title: '',
    description: '',
    type: 'CONFERENCE',
    startDate: '',
    endDate: '',
    location: '',
    speakers: [],
    attendees: [],
    maxAttendees: '',
    isPublic: true,
    status: 'UPCOMING',
    registrationRequired: false,
    registrationDeadline: '',
    externalUrl: '',
    tags: '',
    poster: '',
    image: ''
  });
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    title: '',
    position: '',
    department: '',
    phone: '',
    office: '',
    bio: '',
    interests: '',
    avatar: '',
    googleScholar: '',
    researchGate: '',
    linkedin: '',
    orcid: '',
    website: ''
  });
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const uploadFile = async (file: File, type: 'avatar' | 'poster' | 'image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error || 'File upload failed');
    }

    const data = await response.json();
    return data.path as string;
  };

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth', {
        credentials: 'include'
      });

      if (!response.ok) {
        router.push('/login');
        return;
      }

      const data = await response.json();
      setUser(data.user);
      // If admin, ensure role is uppercase for UI checks
      if (data.user?.role && typeof data.user.role === 'string') {
        data.user.role = data.user.role.toUpperCase();
      }
      const approvalStatus = data.user.approvalStatus;
      if (approvalStatus === 'PENDING') {
        setUiStatus('pending');
        setIsLoading(false);
        return;
      } else if (approvalStatus === 'APPROVED') {
        setUiStatus('approved');
        loadUserData(data.user._id);
      } else {
        setUiStatus('rejected');
        setIsLoading(false);
        return;
      }
    } catch (error) {
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      // Load user's publications (those where user is in authors)
      const pubsResponse = await fetch(
        `/api/publications?author=${encodeURIComponent(
          (user?.firstName ?? '') + ' ' + (user?.lastName ?? '')
        )}`
      );
      if (pubsResponse.ok) {
        const pubsData = await pubsResponse.json();
        setPublications(pubsData.data || []);
      }

      // Load user's events (those organized by user)
      const eventsResponse = await fetch(`/api/events?organizer=${userId}`);
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.data || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE', credentials: 'include' });
      router.push('/login');
    } catch (error) {
      router.push('/login');
    }
  };

  const resetPublicationForm = () => {
    setPublicationForm({
      title: '',
      abstract: '',
      type: 'JOURNAL_ARTICLE',
      authors: '',
      journal: '',
      conference: '',
      volume: '',
      issue: '',
      pages: '',
      publisher: '',
      doi: '',
      url: '',
      year: '',
      venue: '',
      pdfUrl: '',
      researchArea: '',
      tags: ''
    });
    setEditingPublication(null);
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      type: 'CONFERENCE',
      startDate: '',
      endDate: '',
      location: '',
      speakers: [],
      attendees: [],
      maxAttendees: '',
      isPublic: true,
      status: 'UPCOMING',
      registrationRequired: false,
      registrationDeadline: '',
      externalUrl: '',
      tags: '',
      poster: '',
      image: ''
    });
    setEditingEvent(null);
    setPosterFile(null);
    setImageFile(null);
  };

  const handleAddPublication = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editingPublication ? 'PUT' : 'POST';
      const body = editingPublication
        ? {
            id: editingPublication._id,
            ...publicationForm,
            authors: publicationForm.authors.split(',').map((a) => a.trim()),
            tags: publicationForm.tags
              ? publicationForm.tags.split(',').map((t) => t.trim())
              : [],
            year: parseInt(publicationForm.year, 10)
          }
        : {
            ...publicationForm,
            authors: publicationForm.authors.split(',').map((a) => a.trim()),
            tags: publicationForm.tags
              ? publicationForm.tags.split(',').map((t) => t.trim())
              : [],
            year: parseInt(publicationForm.year, 10)
          };

      const response = await fetch('/api/publications', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Publication ${editingPublication ? 'updated' : 'added'} successfully`
        });
        setIsAddPublicationOpen(false);
        resetPublicationForm();
        if (user) loadUserData(user._id);
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || `Failed to ${editingPublication ? 'update' : 'add'} publication`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingPublication ? 'update' : 'add'} publication`,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePublication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/publications?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast({ title: 'Success', description: 'Publication deleted successfully' });
        if (user) loadUserData(user._id);
      } else {
        const err = await res.json().catch(() => null);
        toast({
          title: 'Error',
          description: err?.error || 'Failed to delete publication',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let posterPath = eventForm.poster;
      let imagePath = eventForm.image;
      if (posterFile) {
        posterPath = await uploadFile(posterFile, 'poster');
      }
      if (imageFile) {
        imagePath = await uploadFile(imageFile, 'image');
      }
      posterPath = normalizeAssetPath(posterPath);
      imagePath = normalizeAssetPath(imagePath);

      const method = editingEvent ? 'PUT' : 'POST';
      const body = editingEvent
        ? {
            id: editingEvent._id,
            ...eventForm,
            tags: eventForm.tags
              ? eventForm.tags.split(',').map((t) => t.trim())
              : [],
            maxAttendees: eventForm.maxAttendees
              ? parseInt(eventForm.maxAttendees, 10)
              : undefined,
            poster: posterPath,
            image: imagePath
          }
        : {
            ...eventForm,
            tags: eventForm.tags
              ? eventForm.tags.split(',').map((t) => t.trim())
              : [],
            maxAttendees: eventForm.maxAttendees
              ? parseInt(eventForm.maxAttendees, 10)
              : undefined,
            poster: posterPath,
            image: imagePath
          };

      const response = await fetch('/api/events', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Event ${editingEvent ? 'updated' : 'added'} successfully`
        });
        setIsAddEventOpen(false);
        resetEventForm();
        if (user) loadUserData(user._id);
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || `Failed to ${editingEvent ? 'update' : 'add'} event`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error
          ? error.message
          : `Failed to ${editingEvent ? 'update' : 'add'} event`,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast({ title: 'Success', description: 'Event deleted successfully' });
        if (user) loadUserData(user._id);
      } else {
        const err = await res.json().catch(() => null);
        toast({
          title: 'Error',
          description: err?.error || 'Failed to delete event',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProfile = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let avatarPath = profileForm.avatar;
      if (avatarFile) {
        avatarPath = await uploadFile(avatarFile, 'avatar');
      }

      const updateData = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        title: profileForm.title,
        position: profileForm.position,
        department: profileForm.department,
        phone: profileForm.phone,
        office: profileForm.office,
        bio: profileForm.bio,
        interests: profileForm.interests
          ? profileForm.interests.split(',').map((i) => i.trim())
          : [],
        avatar: avatarPath,
        links: {
          googleScholar: profileForm.googleScholar,
          researchGate: profileForm.researchGate,
          linkedin: profileForm.linkedin,
          orcid: profileForm.orcid,
          website: profileForm.website
        }
      };

      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ id: user?._id, ...updateData })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully'
        });
        setIsEditProfileOpen(false);
        setAvatarFile(null);
        checkAuth(); // Reload user data
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to update profile',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPublication = (publication: Publication) => {
    setEditingPublication(publication);
    setPublicationForm({
      title: publication.title,
      abstract: publication.abstract || '',
      type: publication.type,
      authors: publication.authors.join(', '),
      journal: publication.journal || '',
      conference: publication.conference || '',
      volume: publication.volume || '',
      issue: publication.issue || '',
      pages: publication.pages || '',
      publisher: publication.publisher || '',
      doi: publication.doi || '',
      url: publication.url || '',
      year: publication.year.toString(),
      venue: publication.venue,
      pdfUrl: publication.pdfUrl || '',
      researchArea: publication.researchArea,
      tags: publication.tags ? publication.tags.join(', ') : ''
    });
    setIsAddPublicationOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      type: event.type,
      startDate: event.startDate.slice(0, 16),
      endDate: event.endDate.slice(0, 16),
      location: event.location,
      speakers: event.speakers || [],
      attendees: event.attendees || [],
      maxAttendees: event.maxAttendees ? event.maxAttendees.toString() : '',
      isPublic: event.isPublic,
      status: event.status,
      registrationRequired: event.registrationRequired,
      registrationDeadline: event.registrationDeadline
        ? event.registrationDeadline.slice(0, 16)
        : '',
      externalUrl: event.externalUrl || '',
      tags: event.tags ? event.tags.join(', ') : '',
      poster: normalizeAssetPath(event.poster || ''),
      image: normalizeAssetPath(event.image || '')
    });
    setPosterFile(null);
    setImageFile(null);
    setIsAddEventOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (uiStatus === 'pending') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-8">
        <div className="mb-12 flex justify-center">
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-32 w-32 opacity-30 drop-shadow-lg"
          />
        </div>
        <Card className="w-full max-w-md shadow-2xl border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Pending Approval
            </CardTitle>
            <CardDescription className="text-xl text-muted-foreground">
              Your account is under review by the administrator.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-0">
            <Alert>
              <Users className="h-4 w-4" />
              <AlertTitle>Waiting for Approval</AlertTitle>
              <AlertDescription>
                Please be patient while we review your application. You&apos;ll
                be notified once your account is approved and you gain full
                access to the dashboard.
              </AlertDescription>
            </Alert>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (uiStatus === 'rejected') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-8">
        <Card className="w-full max-w-md shadow-2xl border-destructive/20">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Account Rejected
            </CardTitle>
            <CardDescription className="text-xl text-muted-foreground">
              Your account request has been rejected. Please contact the
              administrator if you believe this is a mistake.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-0">
            <Button
              onClick={handleLogout}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* User Header */}
      <header className="bg-card border-b-2 border-primary/10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={user.avatar || ''}
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  Welcome, {user.firstName} {user.lastName}
                </h1>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {user.position}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user.role === 'ADMIN' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => router.push('/admin/dashboard')}
                  className="rounded-none"
                >
                  Admin View
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setProfileForm({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    title: user.title || '',
                    position: user.position,
                    department: user.department || '',
                    phone: user.phone || '',
                    office: user.office || '',
                    avatar: user.avatar || '',
                    bio: user.bio || '',
                    interests: user.interests ? user.interests.join(', ') : '',
                    googleScholar: user.links?.googleScholar || '',
                    researchGate: user.links?.researchGate || '',
                    linkedin: user.links?.linkedin || '',
                    orcid: user.links?.orcid || '',
                    website: user.links?.website || ''
                  });
                  setAvatarFile(null);
                  setIsEditProfileOpen(true);
                }}
                className="rounded-none"
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 rounded-none"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-none border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                My Publications
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publications.length}</div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Account Type
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="rounded-none">
                {user.userType}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="publications" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-2 h-12">
            <TabsTrigger value="publications" className="rounded-none font-medium">
              My Publications
            </TabsTrigger>
            <TabsTrigger value="events" className="rounded-none font-medium">
              My Events
            </TabsTrigger>
          </TabsList>

          {/* Publications Tab */}
          <TabsContent value="publications" className="mt-6">
            <Card className="rounded-none border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Publications Management</span>
                  <Button
                    onClick={() => {
                      resetPublicationForm();
                      setIsAddPublicationOpen(true);
                    }}
                    className="rounded-none"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Publication
                  </Button>
                </CardTitle>
                <CardDescription>
                  Manage your research publications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Venue</TableHead>
                        <TableHead className="w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {publications.map((publication) => (
                        <TableRow key={publication._id}>
                          <TableCell
                            className="max-w-xs truncate"
                            title={publication.title}
                          >
                            {publication.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="rounded-none">
                              {publication.type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{publication.year}</TableCell>
                          <TableCell
                            className="max-w-xs truncate"
                            title={publication.venue}
                          >
                            {publication.venue}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleEditPublication(publication)
                            }
                            className="rounded-none"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePublication(publication._id)}
                            className="rounded-none text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {publications.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No publications found.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add/Edit Publication Dialog */}
            <Dialog
              open={isAddPublicationOpen}
              onOpenChange={(open) => {
                if (!open) {
                  resetPublicationForm();
                }
                setIsAddPublicationOpen(open);
              }}
            >
              <DialogContent className="sm:max-w-[700px] rounded-none max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPublication ? 'Edit Publication' : 'Add New Publication'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPublication
                      ? 'Update publication information.'
                      : 'Create a new publication entry.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddPublication} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pub-title">Title *</Label>
                    <Input
                      id="pub-title"
                      value={publicationForm.title}
                      onChange={(e) =>
                        setPublicationForm({
                          ...publicationForm,
                          title: e.target.value
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="abstract">Abstract</Label>
                    <Textarea
                      id="abstract"
                      value={publicationForm.abstract}
                      onChange={(e) =>
                        setPublicationForm({
                          ...publicationForm,
                          abstract: e.target.value
                        })
                      }
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type *</Label>
                      <Select
                        value={publicationForm.type}
                        onValueChange={(value) =>
                          setPublicationForm({
                            ...publicationForm,
                            type: value
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="JOURNAL_ARTICLE">
                            Journal Article
                          </SelectItem>
                          <SelectItem value="CONFERENCE_PAPER">
                            Conference Paper
                          </SelectItem>
                          <SelectItem value="BOOK_CHAPTER">
                            Book Chapter
                          </SelectItem>
                          <SelectItem value="BOOK">Book</SelectItem>
                          <SelectItem value="THESIS">Thesis</SelectItem>
                          <SelectItem value="REPORT">Report</SelectItem>
                          <SelectItem value="PREPRINT">Preprint</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year *</Label>
                      <Input
                        id="year"
                        type="number"
                        value={publicationForm.year}
                        onChange={(e) =>
                          setPublicationForm({
                            ...publicationForm,
                            year: e.target.value
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authors">Authors * (comma-separated)</Label>
                    <Input
                      id="authors"
                      value={publicationForm.authors}
                      onChange={(e) =>
                        setPublicationForm({
                          ...publicationForm,
                          authors: e.target.value
                        })
                      }
                      placeholder="Author 1, Author 2, Author 3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue *</Label>
                      <Input
                        id="venue"
                        value={publicationForm.venue}
                        onChange={(e) =>
                          setPublicationForm({
                            ...publicationForm,
                            venue: e.target.value
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="researchArea">Research Area *</Label>
                      <Input
                        id="researchArea"
                        value={publicationForm.researchArea}
                        onChange={(e) =>
                          setPublicationForm({
                            ...publicationForm,
                            researchArea: e.target.value
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="journal">Journal</Label>
                      <Input
                        id="journal"
                        value={publicationForm.journal}
                        onChange={(e) =>
                          setPublicationForm({
                            ...publicationForm,
                            journal: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="conference">Conference</Label>
                      <Input
                        id="conference"
                        value={publicationForm.conference}
                        onChange={(e) =>
                          setPublicationForm({
                            ...publicationForm,
                            conference: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="volume">Volume</Label>
                      <Input
                        id="volume"
                        value={publicationForm.volume}
                        onChange={(e) =>
                          setPublicationForm({
                            ...publicationForm,
                            volume: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issue">Issue</Label>
                      <Input
                        id="issue"
                        value={publicationForm.issue}
                        onChange={(e) =>
                          setPublicationForm({
                            ...publicationForm,
                            issue: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pages">Pages</Label>
                      <Input
                        id="pages"
                        value={publicationForm.pages}
                        onChange={(e) =>
                          setPublicationForm({
                            ...publicationForm,
                            pages: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="publisher">Publisher</Label>
                      <Input
                        id="publisher"
                        value={publicationForm.publisher}
                        onChange={(e) =>
                          setPublicationForm({
                            ...publicationForm,
                            publisher: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doi">DOI</Label>
                      <Input
                        id="doi"
                        value={publicationForm.doi}
                        onChange={(e) =>
                          setPublicationForm({
                            ...publicationForm,
                            doi: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="url">URL</Label>
                      <Input
                        id="url"
                        value={publicationForm.url}
                        onChange={(e) =>
                          setPublicationForm({
                            ...publicationForm,
                            url: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pdfUrl">PDF URL</Label>
                      <Input
                        id="pdfUrl"
                        value={publicationForm.pdfUrl}
                        onChange={(e) =>
                          setPublicationForm({
                            ...publicationForm,
                            pdfUrl: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={publicationForm.tags}
                      onChange={(e) =>
                        setPublicationForm({
                          ...publicationForm,
                          tags: e.target.value
                        })
                      }
                      placeholder="machine learning, AI, research"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddPublicationOpen(false)}
                      className="rounded-none"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-none"
                    >
                      {isSubmitting
                        ? editingPublication
                          ? 'Updating...'
                          : 'Adding...'
                        : editingPublication
                        ? 'Update Publication'
                        : 'Add Publication'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-6">
            <Card className="rounded-none border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Events Management</span>
                  <Button
                    onClick={() => {
                      resetEventForm();
                      setIsAddEventOpen(true);
                    }}
                    className="rounded-none"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </CardTitle>
                <CardDescription>Manage events you organize</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Poster</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event._id}>
                        <TableCell
                          className="max-w-xs truncate"
                          title={event.title}
                        >
                          {event.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-none">
                            {event.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(event.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell
                          className="max-w-xs truncate"
                          title={event.location}
                        >
                          {event.location}
                        </TableCell>
                        <TableCell>
                          {event.poster ? (
                            <a
                              href={event.poster}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline"
                            >
                              View
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-none">
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditEvent(event)}
                              className="rounded-none"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteEvent(event._id)}
                              className="rounded-none text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {events.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No events found.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Add/Edit Event Dialog */}
            <Dialog
              open={isAddEventOpen}
              onOpenChange={(open) => {
                if (!open) {
                  resetEventForm();
                }
                setIsAddEventOpen(open);
              }}
            >
              <DialogContent className="sm:max-w-[700px] rounded-none max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingEvent
                      ? 'Update event information.'
                      : 'Create a new event entry.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">Title *</Label>
                    <Input
                      id="event-title"
                      value={eventForm.title}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          title: e.target.value
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={eventForm.description}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          description: e.target.value
                        })
                      }
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-type">Type *</Label>
                      <Select
                        value={eventForm.type}
                        onValueChange={(value) =>
                          setEventForm({
                            ...eventForm,
                            type: value
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CONFERENCE">Conference</SelectItem>
                          <SelectItem value="SEMINAR">Seminar</SelectItem>
                          <SelectItem value="WORKSHOP">Workshop</SelectItem>
                          <SelectItem value="DEFENSE">Defense</SelectItem>
                          <SelectItem value="MEETING">Meeting</SelectItem>
                          <SelectItem value="SOCIAL">Social</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={eventForm.status}
                        onValueChange={(value) =>
                          setEventForm({
                            ...eventForm,
                            status: value
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UPCOMING">Upcoming</SelectItem>
                          <SelectItem value="ONGOING">Ongoing</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">
                        Start Date &amp; Time *
                      </Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        value={eventForm.startDate}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            startDate: e.target.value
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date &amp; Time *</Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={eventForm.endDate}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            endDate: e.target.value
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={eventForm.location}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          location: e.target.value
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAttendees">Max Attendees</Label>
                    <Input
                      id="maxAttendees"
                      type="number"
                      value={eventForm.maxAttendees}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          maxAttendees: e.target.value
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={eventForm.isPublic}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            isPublic: e.target.checked
                          })
                        }
                        className="rounded"
                      />
                      <Label htmlFor="isPublic">Is Public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="registrationRequired"
                        checked={eventForm.registrationRequired}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            registrationRequired: e.target.checked
                          })
                        }
                        className="rounded"
                      />
                      <Label htmlFor="registrationRequired">
                        Registration Required
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationDeadline">
                      Registration Deadline
                    </Label>
                    <Input
                      id="registrationDeadline"
                      type="datetime-local"
                      value={eventForm.registrationDeadline}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          registrationDeadline: e.target.value
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="externalUrl">External URL</Label>
                    <Input
                      id="externalUrl"
                      value={eventForm.externalUrl}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          externalUrl: e.target.value
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-tags">
                      Tags (comma-separated)
                    </Label>
                    <Input
                      id="event-tags"
                      value={eventForm.tags}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          tags: e.target.value
                        })
                      }
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="poster">Poster (PDF or image)</Label>
                    <Input
                      id="poster"
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
                    />
                    {posterFile && (
                      <p className="text-sm text-muted-foreground">
                        Selected file: {posterFile.name}
                      </p>
                    )}
                    {!posterFile && eventForm.poster && (
                      <p className="text-sm text-muted-foreground">
                        Current file:{' '}
                        <a
                          href={normalizeAssetPath(eventForm.poster)}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          View poster
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image-upload">Event image (upload)</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                    {imageFile && (
                      <p className="text-sm text-muted-foreground">
                        Selected file: {imageFile.name}
                      </p>
                    )}
                    {!imageFile && eventForm.image && (
                      <p className="text-sm text-muted-foreground">
                        Current image:{' '}
                        <a
                          href={normalizeAssetPath(eventForm.image)}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          View image
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL (optional)</Label>
                    <Input
                      id="image"
                      value={eventForm.image}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          image: e.target.value
                        })
                      }
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddEventOpen(false)}
                      className="rounded-none"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-none"
                    >
                      {isSubmitting
                        ? editingEvent
                          ? 'Updating...'
                          : 'Adding...'
                        : editingEvent
                        ? 'Update Event'
                        : 'Add Event'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>

        {/* Edit Profile Dialog */}
        <Dialog
          open={isEditProfileOpen}
          onOpenChange={setIsEditProfileOpen}
        >
          <DialogContent className="sm:max-w-[600px] rounded-none max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your profile information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={profileForm.firstName}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        firstName: e.target.value
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={profileForm.lastName}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        lastName: e.target.value
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={profileForm.title}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        title: e.target.value
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={profileForm.position}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        position: e.target.value
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Profile Picture</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                />
                {avatarFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected file: {avatarFile.name}
                  </p>
                )}
                {!avatarFile && profileForm.avatar && (
                  <p className="text-sm text-muted-foreground">
                    Current picture:{' '}
                    <a
                      href={profileForm.avatar}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      View
                    </a>
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profileForm.department}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        department: e.target.value
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        phone: e.target.value
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="office">Office</Label>
                <Input
                  id="office"
                  value={profileForm.office}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      office: e.target.value
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileForm.bio}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      bio: e.target.value
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interests">
                  Interests (comma-separated)
                </Label>
                <Input
                  id="interests"
                  value={profileForm.interests}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      interests: e.target.value
                    })
                  }
                  placeholder="Machine Learning, AI, Research"
                />
              </div>
              <div className="space-y-4">
                <Label>Links</Label>
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="googleScholar" className="text-sm">
                      Google Scholar
                    </Label>
                    <Input
                      id="googleScholar"
                      value={profileForm.googleScholar}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          googleScholar: e.target.value
                        })
                      }
                      placeholder="https://scholar.google.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="researchGate" className="text-sm">
                      ResearchGate
                    </Label>
                    <Input
                      id="researchGate"
                      value={profileForm.researchGate}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          researchGate: e.target.value
                        })
                      }
                      placeholder="https://researchgate.net/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-sm">
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={profileForm.linkedin}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          linkedin: e.target.value
                        })
                      }
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orcid" className="text-sm">
                      ORCID
                    </Label>
                    <Input
                      id="orcid"
                      value={profileForm.orcid}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          orcid: e.target.value
                        })
                      }
                      placeholder="https://orcid.org/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm">
                      Website
                    </Label>
                    <Input
                      id="website"
                      value={profileForm.website}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          website: e.target.value
                        })
                      }
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="rounded-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-none"
                >
                  {isSubmitting ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
