import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function LinkManagementTableHeader() {
  return (
    <TableHeader>
      <TableRow className="border-b">
        <TableHead className="w-[100px] font-bold">Slot</TableHead>
        <TableHead className="w-[120px] font-bold">Type</TableHead>
        <TableHead className="w-[300px] font-bold">Current Product</TableHead>
        <TableHead className="w-[120px] font-bold">Status</TableHead>
        <TableHead className="w-[350px] font-bold text-left">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}