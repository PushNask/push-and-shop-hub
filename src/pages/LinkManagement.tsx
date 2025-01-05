import { useLinkSlots } from "@/hooks/useLinkSlots";
import { LinkManagementTable } from "@/components/admin/LinkManagementTable";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { adminNavItems } from "@/components/admin/navigation/AdminNav";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function LinkManagement() {
  const { linkSlots, isLoading, error, assignProduct, isAssigning } = useLinkSlots();

  return (
    <DashboardLayout title="Link Management" navItems={adminNavItems}>
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Link Slots</h2>
          <p className="text-muted-foreground">
            Manage permanent link slots (P1-P120) for product listings. Slots P1-P12 are featured slots.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load link slots. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        <LinkManagementTable
          linkSlots={linkSlots || []}
          onAssignProduct={assignProduct}
          isLoading={isLoading}
          isAssigning={isAssigning}
        />
      </div>
    </DashboardLayout>
  );
}