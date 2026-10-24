import React from 'react';
import { ArrowLeft, Download, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const UserResumePreview = ({
  onBack,
  resumeUrl,
  isResumeLoading,
  isResumeError,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-xs text-muted-foreground hover:text-foreground gap-1.5 h-8 px-2.5 rounded-lg cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to User Details</span>
        </Button>
        {resumeUrl?.url && (
          <Button asChild size="sm" variant="outline" className="h-8 text-xs gap-1.5 rounded-lg">
            <a href={resumeUrl.url} target="_blank" rel="noreferrer" download>
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </a>
          </Button>
        )}
      </div>

      {isResumeLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-2" />
          <p className="text-xs font-medium">Loading candidate resume...</p>
        </div>
      ) : isResumeError || !resumeUrl?.url ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground p-6 rounded-2xl border border-destructive/20 bg-destructive/5">
          <AlertTriangle className="h-8 w-8 mb-2 text-destructive opacity-80" />
          <p className="text-xs font-semibold text-destructive">No resume document available for this user.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/80 overflow-hidden bg-slate-950 shadow-sm">
          <object data={resumeUrl.url} type="application/pdf" className="w-full h-[500px]">
            <div className="p-8 text-center bg-card h-full flex flex-col items-center justify-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground mb-3">Your browser doesn't support inline PDF preview.</p>
              <Button asChild size="sm">
                <a href={resumeUrl.url} target="_blank" rel="noreferrer">
                  Download Resume PDF
                </a>
              </Button>
            </div>
          </object>
        </div>
      )}
    </div>
  );
};

export default UserResumePreview;
