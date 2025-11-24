'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, Save, X } from 'lucide-react';
import { fetchDOIMetadata, DOIMetadata } from '@/lib/doi-api';
import { useToast } from '@/hooks/use-toast';

interface FetchResult {
  doi: string;
  data: DOIMetadata | null;
}

interface DOIInputFormProps {
  onSubmit: (results: FetchResult[]) => void;
}

function DOIInputForm({ onSubmit }: DOIInputFormProps) {
  const [inputValue, setInputValue] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Basic DOI regex validation
  const doiRegex = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;

  const validateDOI = (doi: string): boolean => {
    return doiRegex.test(doi.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Split input by newline or comma
    const rawDois = inputValue.split(/[\n,]/).map(doi => doi.trim()).filter(doi => doi.length > 0);
    const validDois: string[] = [];
    const validationErrors: string[] = [];

    rawDois.forEach((doi, index) => {
      if (validateDOI(doi)) {
        validDois.push(doi);
      } else {
        validationErrors.push(`Invalid DOI format at line ${index + 1}: ${doi}`);
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (validDois.length === 0) {
      setErrors(['Please enter at least one valid DOI']);
      return;
    }

    setIsLoading(true);
    try {
      const fetchPromises = validDois.map(async (doi) => {
        const data = await fetchDOIMetadata(doi);
        return { doi, data };
      });
      const results = await Promise.all(fetchPromises);
      onSubmit(results);
      setInputValue('');
    } catch (error) {
      setErrors(['Failed to fetch DOI data. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          DOI Fetcher
        </CardTitle>
        <CardDescription>
          Enter multiple DOIs (one per line or comma-separated) to fetch publication data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="doi-input">DOIs</Label>
            <textarea
              id="doi-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="10.1000/journals.example/123456789&#10;10.1000/journals.example/987654321"
              className="flex h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Fetch DOIs
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

interface FetchedPublicationCardProps {
  result: FetchResult;
  onClose: () => void;
}

function FetchedPublicationCard({ result, onClose }: FetchedPublicationCardProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!result.data) return;
    setIsSaving(true);
    const payload = {
      title: result.data.title || 'Unknown Title',
      authors: result.data.authors.length > 0 ? result.data.authors : ['Unknown Author'],
      doi: result.doi,
      journal: result.data.journal || 'Unknown Journal',
      year: result.data.year > 0 ? result.data.year : new Date().getFullYear(),
      type: 'JOURNAL_ARTICLE',
      venue: result.data.journal || 'Unknown Venue',
      researchArea: 'Research'
    };
    try {
      console.log('DOI Fetcher: Saving publication with payload:', payload);
      const response = await fetch('/api/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log('DOI Fetcher: Response status:', response.status);
      const data = await response.json();
      console.log('DOI Fetcher: Response data:', data);
      if (response.ok && data.success) {
        toast({
          title: 'Success',
          description: 'Publication saved successfully.',
        });
        onClose();
      } else if (response.status === 409) {
        toast({
          title: 'Duplicate DOI',
          description: 'Publication with this DOI already exists.',
          variant: 'destructive'
        });
        onClose();
      } else {
        throw new Error(data.error || `Failed to save publication: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('DOI Fetcher: Save error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save publication.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!result.data) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{result.data.title}</CardTitle>
        <CardDescription>
          <a
            href={`https://doi.org/${result.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {result.doi}
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div><strong>Authors:</strong> {result.data.authors.join(', ')}</div>
          <div><strong>Journal:</strong> {result.data.journal}</div>
          <div><strong>Year:</strong> {result.data.year}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleSave} variant="outline" size="sm" disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button onClick={onClose} variant="outline" size="sm">
          <X className="w-4 h-4 mr-2" />
          Close
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function DOIFetcher() {
  const [fetchedData, setFetchedData] = useState<FetchResult[]>([]);

  const handleSubmit = (results: FetchResult[]) => {
    setFetchedData(results);
    console.log('Fetched data:', results);
  };

  const handleClose = (doi: string) => {
    setFetchedData(prev => prev.filter(result => result.doi !== doi));
  };

  const validResults = fetchedData.filter(result => result.data);

  return (
    <div className="space-y-6">
      <DOIInputForm onSubmit={handleSubmit} />
      {validResults.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Fetched Publications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {validResults.map((result) => (
              <FetchedPublicationCard
                key={result.doi}
                result={result}
                onClose={() => handleClose(result.doi)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}