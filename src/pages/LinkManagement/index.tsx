import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LinkManagementTable } from "./LinkManagementTable";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types/product";

export default function LinkManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: linkSlots, isLoading } = useQuery({
    queryKey: ["link-slots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .not("link_slot", "is", null)
        .order("link_slot", { ascending: true });

      if (error) throw error;
      return data as Product[];
    },
  });

  const assignProductMutation = useMutation({
    mutationFn: async ({ slot, productId }: { slot: number; productId: string }) => {
      // First, clear the slot if it's currently occupied
      const { error: clearError } = await supabase
        .from("products")
        .update({ link_slot: null })
        .eq("link_slot", slot);

      if (clearError) throw clearError;

      // Then assign the new product to the slot
      const { error: assignError } = await supabase
        .from("products")
        .update({ link_slot: slot })
        .eq("id", productId);

      if (assignError) throw assignError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["link-slots"] });
      queryClient.invalidateQueries({ queryKey: ["available-products"] });
      toast({
        title: "Success",
        description: "Product assigned successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to assign product: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleAssignProduct = async (slot: number, productId: string) => {
    await assignProductMutation.mutate({ slot, productId });
  };

  return (
    <DashboardLayout title="Link Management">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Link Slots</h2>
          <p className="text-muted-foreground">
            Manage permanent link slots (P1-P120) for product listings. Slots P1-P12 are featured slots.
          </p>
        </div>

        <LinkManagementTable
          linkSlots={linkSlots || []}
          onAssignProduct={handleAssignProduct}
          isLoading={isLoading || assignProductMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
}