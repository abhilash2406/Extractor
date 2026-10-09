import React, { useState } from 'react';
import { 
  Palette, 
  Plus, 
  Search, 
  Sparkles, 
  Eye, 
  Edit, 
  Trash2, 
  Layers, 
  CheckCircle2,
  FileCode2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const defaultTemplates = [
  {
    id: 1,
    title: 'Modern Resume Extractor',
    category: 'Resume & CV',
    type: 'AI Structured Schema',
    fieldsCount: 24,
    status: 'ACTIVE',
    lastModified: '2 days ago',
    description: 'Extracts skills, work experience timeline, education, certifications, and contact details with high accuracy.',
  },
  {
    id: 2,
    title: 'Invoice & Receipt Parser',
    category: 'Finance',
    type: 'Key-Value Extractor',
    fieldsCount: 16,
    status: 'ACTIVE',
    lastModified: '5 days ago',
    description: 'Parses vendor name, tax details, itemized lines, total amounts, currency, and issue dates.',
  },
  {
    id: 3,
    title: 'Candidate Skill Evaluator',
    category: 'HR & Recruitment',
    type: 'Semantic Scoring',
    fieldsCount: 12,
    status: 'ACTIVE',
    lastModified: '1 week ago',
    description: 'Matches candidate proficiencies against job role requirements and scores overall candidate fit.',
  },
  {
    id: 4,
    title: 'Identity Document OCR',
    category: 'Verification',
    type: 'ID Document Parser',
    fieldsCount: 10,
    status: 'DRAFT',
    lastModified: '2 weeks ago',
    description: 'Extracts full name, date of birth, unique ID numbers, issue/expiry dates from identity proofs.',
  }
];

const TemplatesPage = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Resume & CV', 'Finance', 'HR & Recruitment', 'Verification'];

  const filteredTemplates = defaultTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(search.toLowerCase()) || 
                          template.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Extraction Templates
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build and configure AI extraction prompts, schemas, and processing templates.
          </p>
        </div>
        <Button className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>Create Template</span>
        </Button>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredTemplates.map((tpl) => (
          <Card key={tpl.id} className="group hover:shadow-md transition-all duration-200 flex flex-col justify-between">
            <CardHeader className="p-5 sm:p-6 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileCode2 className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                      {tpl.title}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground font-medium">
                      {tpl.category} • {tpl.fieldsCount} schema fields
                    </span>
                  </div>
                </div>
                <Badge variant={tpl.status === 'ACTIVE' ? 'success' : 'secondary'}>
                  {tpl.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {tpl.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs text-muted-foreground">
                <span>Updated {tpl.lastModified}</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;
