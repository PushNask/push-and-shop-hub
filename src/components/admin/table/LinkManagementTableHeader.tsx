import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function LinkManagementTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Slot</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Current Product</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}