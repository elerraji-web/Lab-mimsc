'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, User } from 'lucide-react';

interface CurrentUser {
  _id: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export default function PortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // First try admin verify to respect admin_token from /api/admin/auth or issued admin_token
        const adminRes = await fetch('/api/admin/verify', { credentials: 'include' });
        if (adminRes.ok) {
          const data = await adminRes.json();
          setUser({
            _id: data?.user?.id || '',
            firstName: data?.user?.firstName || '',
            lastName: data?.user?.lastName || '',
            role: 'ADMIN',
          });
          setIsLoading(false);
          return;
        }

        // Fallback to user session check
        const res = await fetch('/api/auth', { credentials: 'include' });
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        const role = (data.user?.role || '').toString().toUpperCase();
        if (role !== 'ADMIN') {
          router.push('/user');
          return;
        }
        setUser(data.user);
      } catch {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl rounded-none border-2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Choose your view</CardTitle>
          <CardDescription>
            Welcome back {user.firstName} {user.lastName}. Select how you want to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            className="w-full h-24 rounded-none text-lg flex items-center justify-center gap-2"
            variant="default"
            onClick={() => router.push('/admin/dashboard')}
          >
            <Shield className="w-5 h-5" />
            Admin view
          </Button>
          <Button
            className="w-full h-24 rounded-none text-lg flex items-center justify-center gap-2"
            variant="outline"
            onClick={() => router.push('/user')}
          >
            <User className="w-5 h-5" />
            User view
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
