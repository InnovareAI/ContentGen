import { CampaignForm } from "@/components/campaigns/CampaignForm";

export default function NewCampaignPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Campaign</h1>
        <p className="text-muted-foreground">
          Enter your topic and we&apos;ll generate content for all selected platforms.
        </p>
      </div>

      <CampaignForm />
    </div>
  );
}
