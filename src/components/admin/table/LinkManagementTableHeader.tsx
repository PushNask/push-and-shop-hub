import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function LinkManagementTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Slot</TableHead>
        <TableHead className="w-[150px]">Type</TableHead>
        <TableHead className="w-[300px]">Current Product</TableHead>
        <TableHead className="w-[150px]">Status</TableHead>
        <TableHead className="w-[200px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}