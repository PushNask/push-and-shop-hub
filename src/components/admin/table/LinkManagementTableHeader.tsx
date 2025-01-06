import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function LinkManagementTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px] font-semibold">Slot</TableHead>
        <TableHead className="w-[150px] font-semibold">Type</TableHead>
        <TableHead className="w-[300px] font-semibold">Current Product</TableHead>
        <TableHead className="w-[150px] font-semibold">Status</TableHead>
        <TableHead className="min-w-[400px] font-semibold">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}