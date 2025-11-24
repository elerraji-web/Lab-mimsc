'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
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
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import DOIFetcher from '@/components/DOIFetcher';
import {
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Database,
  Activity,
  Plus,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface DashboardStats {
  users: number;
  publications: number;
  events: number;
  research: number;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  title?: string;
  position: string;
  department?: string;
  phone?: string;
  userType: string;
  bio?: string;
  isActive: boolean;
  approvalStatus: string;
  order: number;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  position: string;
  department: string;
  phone: string;
  userType: string;
  bio: string;
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
  organizer: string;
  speakers: string[];
  attendees: string[];
  maxAttendees: string;
  isPublic: boolean;
  status: string;
  registrationRequired: boolean;
  registrationDeadline: string;
  externalUrl: string;
  tags: string;
  image: string;
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
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface SortableTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

function SortableTableRow({ user, onEdit, onDelete, onApprove, onReject, onMoveUp, onMoveDown }: SortableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: user._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes}>
      <TableCell>
        <div className="flex items-center gap-2">
          <button
            {...listeners}
            className="cursor-grab hover:bg-muted p-1 rounded"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          {user.firstName} {user.lastName}
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.position}</TableCell>
      <TableCell>
        <Badge variant="secondary" className="rounded-none">
          {user.userType}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant={
            user.approvalStatus === 'APPROVED' ? 'default' :
            user.approvalStatus === 'PENDING' ? 'secondary' :
            'destructive'
          }
          className="rounded-none"
        >
          {user.approvalStatus}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          {user.approvalStatus === 'PENDING' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onApprove(user._id)}
                className="rounded-none text-green-600 hover:text-green-700"
              >
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(user._id)}
                className="rounded-none text-red-600 hover:text-red-700"
              >
                Reject
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onMoveUp}
            disabled={!onMoveUp}
            className="rounded-none"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMoveDown}
            disabled={!onMoveDown}
            className="rounded-none"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(user)}
            className="rounded-none"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(user._id)}
            className="rounded-none text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    publications: 0,
    events: 0,
    research: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isBulkAddUserOpen, setIsBulkAddUserOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    position: '',
    department: '',
    phone: '',
    userType: 'FACULTY',
    bio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkUserJson, setBulkUserJson] = useState('');
  const [bulkValidationErrors, setBulkValidationErrors] = useState<string[]>([]);
  const [approvalStatusFilter, setApprovalStatusFilter] = useState<string>('ALL');
  const [isAddPublicationOpen, setIsAddPublicationOpen] = useState(false);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
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
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState<EventFormData>({
    title: '',
    description: '',
    type: 'CONFERENCE',
    startDate: '',
    endDate: '',
    location: '',
    organizer: '',
    speakers: [],
    attendees: [],
    maxAttendees: '',
    isPublic: true,
    status: 'UPCOMING',
    registrationRequired: false,
    registrationDeadline: '',
    externalUrl: '',
    tags: '',
    image: ''
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [eventValidationErrors, setEventValidationErrors] = useState<string[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const [showDOIFetcher, setShowDOIFetcher] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = users.findIndex((user) => user._id === active.id);
      const newIndex = users.findIndex((user) => user._id === over.id);

      const reorderedUsers = arrayMove(users, oldIndex, newIndex);

      // Update local state immediately for better UX
      setUsers(reorderedUsers);

      // Update orders in database
      const orders = reorderedUsers.map((user, index) => ({
        id: user._id,
        order: index,
      }));

      try {
        const response = await fetch('/api/users/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ orders }),
        });

        if (!response.ok) {
          throw new Error('Failed to update user orders');
        }

        toast({
          title: 'Success',
          description: 'User order updated successfully',
        });
      } catch (error) {
        // Revert local state on error
        setUsers(users);
        toast({
          title: 'Error',
          description: 'Failed to update user order',
          variant: 'destructive',
        });
      }
    }
  };

  const handleMoveUp = async (index: number) => {
    const newIndex = index - 1;
    const reorderedUsers = arrayMove(users, index, newIndex);

    setUsers(reorderedUsers);

    const orders = reorderedUsers.map((user, idx) => ({
      id: user._id,
      order: idx,
    }));

    try {
      const response = await fetch('/api/users/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ orders }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user orders');
      }

      toast({
        title: 'Success',
        description: 'User order updated successfully',
      });
    } catch (error) {
      setUsers(users);
      toast({
        title: 'Error',
        description: 'Failed to update user order',
        variant: 'destructive',
      });
    }
  };

  const handleMoveDown = async (index: number) => {
    const newIndex = index + 1;
    const reorderedUsers = arrayMove(users, index, newIndex);

    setUsers(reorderedUsers);

    const orders = reorderedUsers.map((user, idx) => ({
      id: user._id,
      order: idx,
    }));

    try {
      const response = await fetch('/api/users/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ orders }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user orders');
      }

      toast({
        title: 'Success',
        description: 'User order updated successfully',
      });
    } catch (error) {
      setUsers(users);
      toast({
        title: 'Error',
        description: 'Failed to update user order',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    checkAuth();
    loadStats();
    loadUsers();
    loadPublications();
    loadEvents();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/verify', {
        credentials: 'include'
      });

      if (!response.ok) {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const loadStats = async () => {
    try {
      const [usersRes, pubsRes, eventsRes, researchRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/publications'),
        fetch('/api/events'),
        fetch('/api/research')
      ]);

      const users = usersRes.ok ? (await usersRes.json()).data?.length || 0 : 0;
      const publications = pubsRes.ok ? (await pubsRes.json()).data?.length || 0 : 0;
      const events = eventsRes.ok ? (await eventsRes.json()).data?.length || 0 : 0;
      const research = researchRes.ok ? (await researchRes.json()).data?.length || 0 : 0;

      setStats({ users, publications, events, research });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadPublications = async () => {
    try {
      const response = await fetch('/api/publications');
      if (response.ok) {
        const data = await response.json();
        setPublications(data.data || []);
      }
    } catch (error) {
      console.error('Error loading publications:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.data || []);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
      router.push('/admin/login');
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const resetUserForm = () => {
    setUserForm({
      firstName: '',
      lastName: '',
      email: '',
      title: '',
      position: '',
      department: '',
      phone: '',
      userType: 'FACULTY',
      bio: ''
    });
    setEditingUser(null);
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
      organizer: '',
      speakers: [],
      attendees: [],
      maxAttendees: '',
      isPublic: true,
      status: 'UPCOMING',
      registrationRequired: false,
      registrationDeadline: '',
      externalUrl: '',
      tags: '',
      image: ''
    });
    setEditingEvent(null);
    setEventValidationErrors([]);
  };

  const validateEventForm = (form: EventFormData): string[] => {
    const errors: string[] = [];

    if (!form.title.trim()) errors.push('Title is required');
    if (!form.description.trim()) errors.push('Description is required');
    if (!form.type) errors.push('Type is required');
    if (!form.startDate) errors.push('Start date is required');
    if (!form.endDate) errors.push('End date is required');
    if (!form.location.trim()) errors.push('Location is required');

    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      if (end <= start) {
        errors.push('End date must be after start date');
      }
    }

    return errors;
  };

  const validateBulkUsers = (jsonString: string): { isValid: boolean; users?: any[]; errors: string[] } => {
    const errors: string[] = [];
    let users: any[];

    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        errors.push('Input must be a JSON array');
        return { isValid: false, errors };
      }
      users = parsed;
    } catch (e) {
      errors.push('Invalid JSON format');
      return { isValid: false, errors };
    }

    const requiredFields = ['firstName', 'lastName', 'email', 'position', 'userType'];
    const validUserTypes = ['FACULTY', 'STAFF', 'STUDENT', 'POSTDOC'];

    users.forEach((user, index) => {
      if (typeof user !== 'object' || user === null) {
        errors.push(`Item ${index + 1}: Must be an object`);
        return;
      }

      requiredFields.forEach(field => {
        if (!user[field]) {
          errors.push(`Item ${index + 1}: Missing required field '${field}'`);
        }
      });

      if (user.userType && !validUserTypes.includes(user.userType)) {
        errors.push(`Item ${index + 1}: Invalid userType. Must be one of: ${validUserTypes.join(', ')}`);
      }

      if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        errors.push(`Item ${index + 1}: Invalid email format`);
      }
    });

    return { isValid: errors.length === 0, users, errors };
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleAddUser called');
    setIsSubmitting(true);

    try {
      const method = editingUser ? 'PUT' : 'POST';
      const body = editingUser ? { id: editingUser._id, ...userForm } : userForm;

      const response = await fetch('/api/users', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `User ${editingUser ? 'updated' : 'added'} successfully`,
        });
        setIsAddUserOpen(false);
        resetUserForm();
        loadUsers();
        loadStats();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || `Failed to ${editingUser ? 'update' : 'add'} user`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingUser ? 'update' : 'add'} user`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      title: user.title || '',
      position: user.position,
      department: user.department || '',
      phone: user.phone || '',
      userType: user.userType,
      bio: user.bio || ''
    });
    setIsAddUserOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'User deleted successfully',
        });
        loadUsers();
        loadStats();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete user',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const response = await fetch('/api/users/approve', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'User approved successfully',
        });
        loadUsers();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to approve user',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve user',
        variant: 'destructive',
      });
    }
  };

  const handleRejectUser = async (userId: string) => {
    if (!confirm('Are you sure you want to reject this user?')) return;

    try {
      const response = await fetch('/api/users/reject', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'User rejected successfully',
        });
        loadUsers();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to reject user',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject user',
        variant: 'destructive',
      });
    }
  };

  const handleAddPublication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editingPublication ? 'PUT' : 'POST';
      const body = editingPublication
        ? {
            id: editingPublication._id,
            ...publicationForm,
            authors: publicationForm.authors.split(',').map(a => a.trim()),
            tags: publicationForm.tags ? publicationForm.tags.split(',').map(t => t.trim()) : [],
            year: parseInt(publicationForm.year)
          }
        : {
            ...publicationForm,
            authors: publicationForm.authors.split(',').map(a => a.trim()),
            tags: publicationForm.tags ? publicationForm.tags.split(',').map(t => t.trim()) : [],
            year: parseInt(publicationForm.year)
          };

      const response = await fetch('/api/publications', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Publication ${editingPublication ? 'updated' : 'added'} successfully`,
        });
        setIsAddPublicationOpen(false);
        resetPublicationForm();
        loadPublications();
        loadStats();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || `Failed to ${editingPublication ? 'update' : 'add'} publication`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingPublication ? 'update' : 'add'} publication`,
        variant: 'destructive',
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

  const handleDeletePublication = async (publicationId: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;

    try {
      const response = await fetch(`/api/publications?id=${publicationId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Publication deleted successfully',
        });
        loadPublications();
        loadStats();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete publication',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete publication',
        variant: 'destructive',
      });
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateEventForm(eventForm);
    if (errors.length > 0) {
      setEventValidationErrors(errors);
      return;
    }
    setEventValidationErrors([]);
    setIsSubmitting(true);

    try {
      const method = editingEvent ? 'PUT' : 'POST';
      const body = editingEvent
        ? {
            id: editingEvent._id,
            ...eventForm,
            tags: eventForm.tags ? eventForm.tags.split(',').map(t => t.trim()) : [],
            maxAttendees: eventForm.maxAttendees ? parseInt(eventForm.maxAttendees) : undefined
          }
        : {
            ...eventForm,
            tags: eventForm.tags ? eventForm.tags.split(',').map(t => t.trim()) : [],
            maxAttendees: eventForm.maxAttendees ? parseInt(eventForm.maxAttendees) : undefined
          };

      const response = await fetch('/api/events', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Event ${editingEvent ? 'updated' : 'added'} successfully`,
        });
        setIsAddEventOpen(false);
        resetEventForm();
        loadEvents();
        loadStats();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || `Failed to ${editingEvent ? 'update' : 'add'} event`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingEvent ? 'update' : 'add'} event`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      type: event.type,
      startDate: event.startDate.split('T')[0], // assuming ISO string
      endDate: event.endDate.split('T')[0],
      location: event.location,
      organizer: event.organizer || '',
      speakers: event.speakers || [],
      attendees: event.attendees || [],
      maxAttendees: event.maxAttendees ? event.maxAttendees.toString() : '',
      isPublic: event.isPublic,
      status: event.status,
      registrationRequired: event.registrationRequired,
      registrationDeadline: event.registrationDeadline ? event.registrationDeadline.split('T')[0] : '',
      externalUrl: event.externalUrl || '',
      tags: event.tags ? event.tags.join(', ') : '',
      image: event.image || ''
    });
    setEventValidationErrors([]);
    setIsAddEventOpen(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/events?id=${eventId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Event deleted successfully',
        });
        loadEvents();
        loadStats();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete event',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
      });
    }
  };

  const handleBulkAddUsers = async () => {
    const validation = validateBulkUsers(bulkUserJson);
    if (!validation.isValid) {
      setBulkValidationErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setBulkValidationErrors([]);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(validation.users),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: 'Success',
          description: `Added ${result.count || 1} user(s) successfully`,
        });
        setIsBulkAddUserOpen(false);
        setBulkUserJson('');
        loadUsers();
        loadStats();
      } else {
        const error = await response.json();
        if (error.details) {
          // Validation errors from server
          const serverErrors = Object.values(error.details).map((err: any) => err.message);
          setBulkValidationErrors(serverErrors);
        } else {
          toast({
            title: 'Error',
            description: error.error || 'Failed to add users',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add users',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="bg-card border-b-2 border-primary/10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-none flex items-center justify-center border-2 border-primary">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">MIMSC Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="rounded-none">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="rounded-none text-red-600 hover:text-red-700"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-none border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users}</div>
              <p className="text-xs text-muted-foreground">Faculty & Students</p>
            </CardContent>
          </Card>

          <Card className="rounded-none border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Publications</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.publications}</div>
              <p className="text-xs text-muted-foreground">Research Papers</p>
            </CardContent>
          </Card>

          <Card className="rounded-none border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.events}</div>
              <p className="text-xs text-muted-foreground">Upcoming & Past</p>
            </CardContent>
          </Card>

          <Card className="rounded-none border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Research Areas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.research}</div>
              <p className="text-xs text-muted-foreground">Active Projects</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-none border-2 h-12">
            <TabsTrigger value="overview" className="rounded-none font-medium">
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-none font-medium">
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="rounded-none font-medium">
              Content
            </TabsTrigger>
            <TabsTrigger value="system" className="rounded-none font-medium">
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="rounded-none border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    System Status
                  </CardTitle>
                  <CardDescription>Current system health and performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database</span>
                    <Badge variant="secondary" className="rounded-none">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">API Services</span>
                    <Badge variant="secondary" className="rounded-none">Running</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">File Storage</span>
                    <Badge variant="secondary" className="rounded-none">Available</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-none border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full rounded-none justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Seed Sample Data
                  </Button>
                  <Button variant="outline" className="w-full rounded-none justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Export Publications
                  </Button>
                  <Button variant="outline" className="w-full rounded-none justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card className="rounded-none border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  User Management
                  <div className="flex space-x-2">
                    <Select value={approvalStatusFilter} onValueChange={setApprovalStatusFilter}>
                      <SelectTrigger className="w-[180px] rounded-none">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Users</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => { resetUserForm(); setIsAddUserOpen(true); }} className="rounded-none">
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                    <Button onClick={() => { setBulkUserJson(''); setBulkValidationErrors([]); setIsBulkAddUserOpen(true); }} variant="outline" className="rounded-none">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Users in JSON Format
                    </Button>
                  </div>
                  <Dialog open={isAddUserOpen} onOpenChange={(open) => { if (!open) resetUserForm(); setIsAddUserOpen(open); }}>
                    <DialogContent className="sm:max-w-[600px] rounded-none">
                      <DialogHeader>
                        <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                        <DialogDescription>
                          {editingUser ? 'Update user account information.' : 'Create a new user account for faculty, staff, or students.'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddUser} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              value={userForm.firstName}
                              onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              value={userForm.lastName}
                              onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userForm.email}
                            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              value={userForm.title}
                              onChange={(e) => setUserForm({ ...userForm, title: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="position">Position *</Label>
                            <Input
                              id="position"
                              value={userForm.position}
                              onChange={(e) => setUserForm({ ...userForm, position: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Input
                              id="department"
                              value={userForm.department}
                              onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={userForm.phone}
                              onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="userType">User Type *</Label>
                          <Select value={userForm.userType} onValueChange={(value) => setUserForm({ ...userForm, userType: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FACULTY">Faculty</SelectItem>
                              <SelectItem value="STAFF">Staff</SelectItem>
                              <SelectItem value="STUDENT">Student</SelectItem>
                              <SelectItem value="POSTDOC">Postdoc</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={userForm.bio}
                            onChange={(e) => setUserForm({ ...userForm, bio: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)} className="rounded-none">
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting} className="rounded-none">
                            {isSubmitting ? (editingUser ? 'Updating...' : 'Adding...') : (editingUser ? 'Update User' : 'Add User')}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isBulkAddUserOpen} onOpenChange={setIsBulkAddUserOpen}>
                    <DialogContent className="sm:max-w-[700px] rounded-none max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Users in JSON Format</DialogTitle>
                        <DialogDescription>
                          Paste a JSON array of user objects to add multiple users at once. Each user object should include required fields: firstName, lastName, email, position, userType.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <Button variant="outline" className="w-full rounded-none">
                              Show Sample JSON Format
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-4">
                            <pre className="bg-muted p-4 rounded-none text-sm overflow-x-auto">
{`[
 {
   "firstName": "John",
   "lastName": "Doe",
   "email": "john.doe@example.com",
   "title": "Dr.",
   "position": "Professor",
   "department": "Computer Science",
   "phone": "+1-555-0123",
   "office": "Room 101",
   "avatar": "",
   "bio": "Expert in AI",
   "interests": ["Machine Learning", "Data Science"],
   "links": {
     "googleScholar": "https://scholar.google.com/...",
     "researchGate": "",
     "linkedin": "https://linkedin.com/in/johndoe",
     "orcid": "",
     "website": "https://johndoe.com"
   },
   "userType": "FACULTY",
   "isActive": true
 }
]`}
                            </pre>
                          </CollapsibleContent>
                        </Collapsible>
                        <div className="space-y-2">
                          <Label htmlFor="bulkJson">JSON Input *</Label>
                          <Textarea
                            id="bulkJson"
                            value={bulkUserJson}
                            onChange={(e) => setBulkUserJson(e.target.value)}
                            placeholder="Paste your JSON array here..."
                            rows={10}
                            className="font-mono text-sm"
                          />
                        </div>
                        {bulkValidationErrors.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-red-600">Validation Errors:</Label>
                            <ul className="list-disc list-inside text-sm text-red-600">
                              {bulkValidationErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsBulkAddUserOpen(false)} className="rounded-none">
                            Cancel
                          </Button>
                          <Button type="button" onClick={handleBulkAddUsers} disabled={isSubmitting} className="rounded-none">
                            {isSubmitting ? 'Adding Users...' : 'Add Users'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
                <CardDescription>Manage faculty, students, and user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Approval Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <SortableContext
                        items={users.map(user => user._id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {users
                          .filter(user => approvalStatusFilter === 'ALL' || user.approvalStatus === approvalStatusFilter)
                          .map((user, index) => (
                            <SortableTableRow
                              key={user._id}
                              user={user}
                              onEdit={handleEditUser}
                              onDelete={handleDeleteUser}
                              onApprove={handleApproveUser}
                              onReject={handleRejectUser}
                              onMoveUp={index > 0 ? () => handleMoveUp(index) : undefined}
                              onMoveDown={index < users.length - 1 ? () => handleMoveDown(index) : undefined}
                            />
                          ))}
                      </SortableContext>
                    </TableBody>
                  </Table>
                </DndContext>
                {users.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No users found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card className="rounded-none border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Publications Management
                  <Button onClick={() => { resetPublicationForm(); setIsAddPublicationOpen(true); }} className="rounded-none">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Publication
                  </Button>
                  <Dialog open={isAddPublicationOpen} onOpenChange={(open) => { if (!open) resetPublicationForm(); setIsAddPublicationOpen(open); }}>
                    <DialogContent className="sm:max-w-[700px] rounded-none max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingPublication ? 'Edit Publication' : 'Add New Publication'}</DialogTitle>
                        <DialogDescription>
                          {editingPublication ? 'Update publication information.' : 'Create a new publication entry.'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddPublication} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title *</Label>
                          <Input
                            id="title"
                            value={publicationForm.title}
                            onChange={(e) => setPublicationForm({ ...publicationForm, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="abstract">Abstract</Label>
                          <Textarea
                            id="abstract"
                            value={publicationForm.abstract}
                            onChange={(e) => setPublicationForm({ ...publicationForm, abstract: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="type">Type *</Label>
                            <Select value={publicationForm.type} onValueChange={(value) => setPublicationForm({ ...publicationForm, type: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="JOURNAL_ARTICLE">Journal Article</SelectItem>
                                <SelectItem value="CONFERENCE_PAPER">Conference Paper</SelectItem>
                                <SelectItem value="BOOK_CHAPTER">Book Chapter</SelectItem>
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
                              onChange={(e) => setPublicationForm({ ...publicationForm, year: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="authors">Authors * (comma-separated)</Label>
                          <Input
                            id="authors"
                            value={publicationForm.authors}
                            onChange={(e) => setPublicationForm({ ...publicationForm, authors: e.target.value })}
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
                              onChange={(e) => setPublicationForm({ ...publicationForm, venue: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="researchArea">Research Area *</Label>
                            <Input
                              id="researchArea"
                              value={publicationForm.researchArea}
                              onChange={(e) => setPublicationForm({ ...publicationForm, researchArea: e.target.value })}
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
                              onChange={(e) => setPublicationForm({ ...publicationForm, journal: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="conference">Conference</Label>
                            <Input
                              id="conference"
                              value={publicationForm.conference}
                              onChange={(e) => setPublicationForm({ ...publicationForm, conference: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="volume">Volume</Label>
                            <Input
                              id="volume"
                              value={publicationForm.volume}
                              onChange={(e) => setPublicationForm({ ...publicationForm, volume: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="issue">Issue</Label>
                            <Input
                              id="issue"
                              value={publicationForm.issue}
                              onChange={(e) => setPublicationForm({ ...publicationForm, issue: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pages">Pages</Label>
                            <Input
                              id="pages"
                              value={publicationForm.pages}
                              onChange={(e) => setPublicationForm({ ...publicationForm, pages: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="publisher">Publisher</Label>
                            <Input
                              id="publisher"
                              value={publicationForm.publisher}
                              onChange={(e) => setPublicationForm({ ...publicationForm, publisher: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="doi">DOI</Label>
                            <Input
                              id="doi"
                              value={publicationForm.doi}
                              onChange={(e) => setPublicationForm({ ...publicationForm, doi: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="url">URL</Label>
                            <Input
                              id="url"
                              value={publicationForm.url}
                              onChange={(e) => setPublicationForm({ ...publicationForm, url: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pdfUrl">PDF URL</Label>
                            <Input
                              id="pdfUrl"
                              value={publicationForm.pdfUrl}
                              onChange={(e) => setPublicationForm({ ...publicationForm, pdfUrl: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tags">Tags (comma-separated)</Label>
                          <Input
                            id="tags"
                            value={publicationForm.tags}
                            onChange={(e) => setPublicationForm({ ...publicationForm, tags: e.target.value })}
                            placeholder="machine learning, AI, research"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsAddPublicationOpen(false)} className="rounded-none">
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting} className="rounded-none">
                            {isSubmitting ? (editingPublication ? 'Updating...' : 'Adding...') : (editingPublication ? 'Update Publication' : 'Add Publication')}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
                <CardDescription>Manage research publications and academic papers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Authors</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {publications.map((publication) => (
                      <TableRow key={publication._id}>
                        <TableCell className="max-w-xs truncate" title={publication.title}>{publication.title}</TableCell>
                        <TableCell className="whitespace-pre-line" title={publication.authors.join('\n')}>{publication.authors.join('\n')}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-none">
                            {publication.type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{publication.year}</TableCell>
                        <TableCell className="max-w-xs truncate" title={publication.venue}>{publication.venue}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPublication(publication)}
                              className="rounded-none"
                            >
                              Edit
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
                </div>
                {publications.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No publications found.</p>
                )}
                <div className="mt-6">
                  <Collapsible open={showDOIFetcher} onOpenChange={setShowDOIFetcher}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Add Publications from DOI
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      <DOIFetcher />
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none border-2 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Events Management
                  <Button onClick={() => { resetEventForm(); setEventValidationErrors([]); setIsAddEventOpen(true); }} className="rounded-none">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                  <Dialog open={isAddEventOpen} onOpenChange={(open) => { if (!open) resetEventForm(); setIsAddEventOpen(open); }}>
                    <DialogContent className="sm:max-w-[700px] rounded-none max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                        <DialogDescription>
                          {editingEvent ? 'Update event information.' : 'Create a new event entry.'}
                        </DialogDescription>
                        {eventValidationErrors.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-red-600">Validation Errors:</Label>
                            <ul className="list-disc list-inside text-sm text-red-600">
                              {eventValidationErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </DialogHeader>
                      <form onSubmit={handleAddEvent} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title *</Label>
                          <Input
                            id="title"
                            value={eventForm.title}
                            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description *</Label>
                          <Textarea
                            id="description"
                            value={eventForm.description}
                            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                            rows={3}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="type">Type *</Label>
                            <Select value={eventForm.type} onValueChange={(value) => setEventForm({ ...eventForm, type: value })}>
                              <SelectTrigger>
                                <SelectValue />
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
                            <Select value={eventForm.status} onValueChange={(value) => setEventForm({ ...eventForm, status: value })}>
                              <SelectTrigger>
                                <SelectValue />
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
                            <Label htmlFor="startDate">Start Date & Time *</Label>
                            <Input
                              id="startDate"
                              type="datetime-local"
                              value={eventForm.startDate}
                              onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="endDate">End Date & Time *</Label>
                            <Input
                              id="endDate"
                              type="datetime-local"
                              value={eventForm.endDate}
                              onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location *</Label>
                          <Input
                            id="location"
                            value={eventForm.location}
                            onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="organizer">Organizer</Label>
                          <Select value={eventForm.organizer} onValueChange={(value) => setEventForm({ ...eventForm, organizer: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select organizer" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem key={user._id} value={user._id}>
                                  {user.firstName} {user.lastName} ({user.position})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="speakers">Speakers</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between rounded-none"
                              >
                                {eventForm.speakers.length > 0
                                  ? `${eventForm.speakers.length} speaker${eventForm.speakers.length > 1 ? 's' : ''} selected`
                                  : "Select speakers"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Search users..." />
                                <CommandList>
                                  <CommandEmpty>No users found.</CommandEmpty>
                                  <CommandGroup>
                                    {users.map((user) => (
                                      <CommandItem
                                        key={user._id}
                                        onSelect={() => {
                                          const newSpeakers = eventForm.speakers.includes(user._id)
                                            ? eventForm.speakers.filter(id => id !== user._id)
                                            : [...eventForm.speakers, user._id];
                                          setEventForm({ ...eventForm, speakers: newSpeakers });
                                        }}
                                      >
                                        <Checkbox
                                          checked={eventForm.speakers.includes(user._id)}
                                          className="mr-2"
                                        />
                                        {user.firstName} {user.lastName} ({user.position})
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          {eventForm.speakers.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {eventForm.speakers.map((speakerId) => {
                                const speaker = users.find(u => u._id === speakerId);
                                return speaker ? (
                                  <Badge key={speakerId} variant="secondary" className="rounded-none">
                                    {speaker.firstName} {speaker.lastName}
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="attendees">Attendees</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between rounded-none"
                              >
                                {eventForm.attendees.length > 0
                                  ? `${eventForm.attendees.length} attendee${eventForm.attendees.length > 1 ? 's' : ''} selected`
                                  : "Select attendees"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Search users..." />
                                <CommandList>
                                  <CommandEmpty>No users found.</CommandEmpty>
                                  <CommandGroup>
                                    {users.map((user) => (
                                      <CommandItem
                                        key={user._id}
                                        onSelect={() => {
                                          const newAttendees = eventForm.attendees.includes(user._id)
                                            ? eventForm.attendees.filter(id => id !== user._id)
                                            : [...eventForm.attendees, user._id];
                                          setEventForm({ ...eventForm, attendees: newAttendees });
                                        }}
                                      >
                                        <Checkbox
                                          checked={eventForm.attendees.includes(user._id)}
                                          className="mr-2"
                                        />
                                        {user.firstName} {user.lastName} ({user.position})
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          {eventForm.attendees.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {eventForm.attendees.map((attendeeId) => {
                                const attendee = users.find(u => u._id === attendeeId);
                                return attendee ? (
                                  <Badge key={attendeeId} variant="secondary" className="rounded-none">
                                    {attendee.firstName} {attendee.lastName}
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maxAttendees">Max Attendees</Label>
                          <Input
                            id="maxAttendees"
                            type="number"
                            value={eventForm.maxAttendees}
                            onChange={(e) => setEventForm({ ...eventForm, maxAttendees: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="isPublic"
                              checked={eventForm.isPublic}
                              onCheckedChange={(checked) => setEventForm({ ...eventForm, isPublic: checked as boolean })}
                            />
                            <Label htmlFor="isPublic">Is Public</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="registrationRequired"
                              checked={eventForm.registrationRequired}
                              onCheckedChange={(checked) => setEventForm({ ...eventForm, registrationRequired: checked as boolean })}
                            />
                            <Label htmlFor="registrationRequired">Registration Required</Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                          <Input
                            id="registrationDeadline"
                            type="datetime-local"
                            value={eventForm.registrationDeadline}
                            onChange={(e) => setEventForm({ ...eventForm, registrationDeadline: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="externalUrl">External URL</Label>
                          <Input
                            id="externalUrl"
                            value={eventForm.externalUrl}
                            onChange={(e) => setEventForm({ ...eventForm, externalUrl: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tags">Tags (comma-separated)</Label>
                          <Input
                            id="tags"
                            value={eventForm.tags}
                            onChange={(e) => setEventForm({ ...eventForm, tags: e.target.value })}
                            placeholder="tag1, tag2, tag3"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="image">Image URL</Label>
                          <Input
                            id="image"
                            value={eventForm.image}
                            onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsAddEventOpen(false)} className="rounded-none">
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting} className="rounded-none">
                            {isSubmitting ? (editingEvent ? 'Updating...' : 'Adding...') : (editingEvent ? 'Update Event' : 'Add Event')}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
                <CardDescription>Manage academic events, conferences, and seminars</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event._id}>
                        <TableCell className="max-w-xs truncate" title={event.title}>{event.title}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-none">
                            {event.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(event.startDate).toLocaleDateString()}</TableCell>
                        <TableCell className="max-w-xs truncate" title={event.location}>{event.location}</TableCell>
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
                              Edit
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
                  <p className="text-muted-foreground text-center py-4">No events found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <Card className="rounded-none border-2">
              <CardHeader>
                <CardTitle>System Administration</CardTitle>
                <CardDescription>System settings, backups, and maintenance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">System administration interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}