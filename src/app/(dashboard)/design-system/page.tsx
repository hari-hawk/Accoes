"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { StatusClassification } from "@/components/validation/status-classification";
import { ConfidenceScore } from "@/components/validation/confidence-score";
import { ConfidenceSummary } from "@/components/shared/confidence-summary";
import { RoleBadge } from "@/components/shared/role-badge";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FolderKanban,
} from "lucide-react";

const colorSwatches = [
  { name: "Primary (Navy)", variable: "--primary", class: "bg-primary" },
  { name: "Primary Foreground", variable: "--primary-foreground", class: "bg-primary-foreground border" },
  { name: "Background", variable: "--background", class: "bg-background border" },
  { name: "Foreground", variable: "--foreground", class: "bg-foreground" },
  { name: "Muted", variable: "--muted", class: "bg-muted" },
  { name: "Muted Foreground", variable: "--muted-foreground", class: "bg-muted-foreground" },
  { name: "Border", variable: "--border", class: "bg-border" },
  { name: "Card", variable: "--card", class: "bg-card border" },
  { name: "Accent", variable: "--accent", class: "bg-accent" },
  { name: "Destructive", variable: "--destructive", class: "bg-destructive" },
];

const semanticColors = [
  { name: "Pre-approved", class: "bg-status-pre-approved" },
  { name: "Pre-approved BG", class: "bg-status-pre-approved-bg" },
  { name: "Review Required", class: "bg-status-review-required" },
  { name: "Review Required BG", class: "bg-status-review-required-bg" },
  { name: "Action Mandatory", class: "bg-status-action-mandatory" },
  { name: "Action Mandatory BG", class: "bg-status-action-mandatory-bg" },
  { name: "Confidence High", class: "bg-confidence-high" },
  { name: "Confidence Medium", class: "bg-confidence-medium" },
  { name: "Confidence Low", class: "bg-confidence-low" },
];

const typographyScale = [
  { name: "Display", classes: "text-4xl font-bold tracking-tight", sample: "Display Heading" },
  { name: "H1", classes: "text-3xl font-semibold tracking-tight", sample: "Heading 1" },
  { name: "H2", classes: "text-2xl font-semibold", sample: "Heading 2" },
  { name: "H3", classes: "text-xl font-semibold", sample: "Heading 3" },
  { name: "H4", classes: "text-lg font-medium", sample: "Heading 4" },
  { name: "Body", classes: "text-base font-normal", sample: "Body text — The quick brown fox jumps over the lazy dog." },
  { name: "Body Small", classes: "text-sm font-normal", sample: "Small body text for secondary content and descriptions." },
  { name: "Caption", classes: "text-xs font-medium tracking-wide uppercase", sample: "Caption Label" },
  { name: "Overline", classes: "text-[11px] font-semibold tracking-widest uppercase", sample: "Overline Text" },
];

const spacingValues = [
  { name: "1", value: "4px", class: "w-1" },
  { name: "2", value: "8px", class: "w-2" },
  { name: "3", value: "12px", class: "w-3" },
  { name: "4", value: "16px", class: "w-4" },
  { name: "5", value: "20px", class: "w-5" },
  { name: "6", value: "24px", class: "w-6" },
  { name: "8", value: "32px", class: "w-8" },
  { name: "10", value: "40px", class: "w-10" },
  { name: "12", value: "48px", class: "w-12" },
  { name: "16", value: "64px", class: "w-16" },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Separator />
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="space-y-12 pb-12">
      <PageHeader
        title="Design System"
        description="Colors, typography, spacing, and component reference for the Accoes Submittal AI platform"
      />

      {/* Colors */}
      <Section title="Colors">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Base Palette</h3>
          <div className="grid grid-cols-5 gap-3">
            {colorSwatches.map((swatch) => (
              <div key={swatch.name}>
                <div className={`h-16 rounded-lg ${swatch.class}`} />
                <p className="mt-1.5 text-xs font-medium">{swatch.name}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{swatch.variable}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Semantic Colors</h3>
          <div className="grid grid-cols-5 gap-3">
            {semanticColors.map((swatch) => (
              <div key={swatch.name}>
                <div className={`h-16 rounded-lg ${swatch.class}`} />
                <p className="mt-1.5 text-xs font-medium">{swatch.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <p className="text-sm text-muted-foreground">
          Primary font: <strong>Inter</strong>. All text uses the Inter font family.
        </p>
        <div className="space-y-4">
          {typographyScale.map((item) => (
            <div key={item.name} className="flex items-baseline gap-4 border-b pb-3">
              <span className="text-xs font-medium text-muted-foreground w-24 shrink-0">
                {item.name}
              </span>
              <span className={item.classes}>{item.sample}</span>
              <span className="ml-auto text-[10px] text-muted-foreground font-mono shrink-0">
                {item.classes}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Spacing */}
      <Section title="Spacing">
        <p className="text-sm text-muted-foreground mb-3">
          Based on an 8px grid system. Uses Tailwind spacing scale.
        </p>
        <div className="space-y-2">
          {spacingValues.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <span className="text-xs font-mono w-8 text-muted-foreground">{item.name}</span>
              <span className="text-xs font-mono w-12 text-muted-foreground">{item.value}</span>
              <div className={`h-4 rounded bg-primary ${item.class}`} />
            </div>
          ))}
        </div>
      </Section>

      {/* Components */}
      <Section title="Components">
        {/* Buttons */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Buttons</h3>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><FileText className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Badges & Status</h3>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
          <div className="flex flex-wrap gap-3">
            <StatusIndicator status="planning" />
            <StatusIndicator status="active" />
            <StatusIndicator status="on_hold" />
            <StatusIndicator status="completed" />
            <StatusIndicator status="draft" />
            <StatusIndicator status="in_review" />
            <StatusIndicator status="complete" />
            <StatusIndicator status="error" />
          </div>
          <div className="flex flex-wrap gap-3">
            <StatusClassification status="pre_approved" />
            <StatusClassification status="review_required" />
            <StatusClassification status="action_mandatory" />
          </div>
          <div className="flex flex-wrap gap-3">
            <RoleBadge role="admin" />
            <RoleBadge role="submitter" />
            <RoleBadge role="reviewer" />
            <RoleBadge role="global_viewer" />
          </div>
        </div>

        {/* Confidence */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Confidence Indicators</h3>
          <div className="flex items-center gap-6">
            <ConfidenceScore score={95} size="sm" />
            <ConfidenceScore score={95} size="md" />
            <ConfidenceScore score={95} size="lg" />
            <ConfidenceScore score={76} size="lg" />
            <ConfidenceScore score={42} size="lg" />
          </div>
          <div className="flex items-center gap-6">
            <ConfidenceSummary
              data={{ preApproved: 5, reviewRequired: 3, actionMandatory: 2, total: 10, overallConfidence: 78 }}
              size="sm"
            />
            <ConfidenceSummary
              data={{ preApproved: 5, reviewRequired: 3, actionMandatory: 2, total: 10, overallConfidence: 78 }}
              size="md"
            />
            <ConfidenceSummary
              data={{ preApproved: 5, reviewRequired: 3, actionMandatory: 2, total: 10, overallConfidence: 78 }}
              size="lg"
            />
          </div>
        </div>

        {/* Form Elements */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Form Elements</h3>
          <div className="flex flex-wrap items-center gap-4 max-w-md">
            <Input placeholder="Text input" className="w-48" />
            <div className="flex items-center gap-2">
              <Switch id="switch-demo" />
              <label htmlFor="switch-demo" className="text-sm">Toggle</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="check-demo" />
              <label htmlFor="check-demo" className="text-sm">Checkbox</label>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Progress</h3>
          <div className="max-w-md space-y-3">
            <Progress value={25} className="h-2" />
            <Progress value={65} className="h-2" />
            <Progress value={100} className="h-2" />
          </div>
        </div>

        {/* Stat Cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Stat Cards</h3>
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Pre-approved" value={8} icon={CheckCircle2} />
            <StatCard label="Review Required" value={3} icon={AlertTriangle} />
            <StatCard label="Action Mandatory" value={1} icon={XCircle} />
          </div>
        </div>

        {/* Skeleton Loading */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Loading Skeleton</h3>
          <Card className="py-0">
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Empty State</h3>
          <EmptyState
            icon={FolderKanban}
            title="No items found"
            description="Try adjusting your search or filters."
          >
            <Button size="sm">Action</Button>
          </EmptyState>
        </div>
      </Section>

      {/* Accessibility */}
      <Section title="Accessibility">
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-status-pre-approved mt-0.5 shrink-0" />
            <p>WCAG AA color contrast compliance on all text elements</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-status-pre-approved mt-0.5 shrink-0" />
            <p>Focus-visible styles on all interactive elements (via shadcn/ui)</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-status-pre-approved mt-0.5 shrink-0" />
            <p>Full keyboard navigation support across all views</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-status-pre-approved mt-0.5 shrink-0" />
            <p>Semantic HTML elements with appropriate ARIA attributes</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-status-pre-approved mt-0.5 shrink-0" />
            <p>Readable typography scaling with Inter font at 16px base</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-status-pre-approved mt-0.5 shrink-0" />
            <p>Reduced motion support via prefers-reduced-motion</p>
          </div>
        </div>
      </Section>
    </div>
  );
}
