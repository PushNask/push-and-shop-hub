import { FormField, FormItem, FormControl, FormDescription, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface ListingFeeSectionProps {
  form: any;
}

const feeStructure = {
  standard: { '24': 10, '48': 17, '72': 25, '96': 30, '120': 40 },
  featured: { '24': 25, '48': 40, '72': 60, '96': 80, '120': 100 },
} as const;

export function ListingFeeSection({ form }: ListingFeeSectionProps) {
  const listingType = form.watch("listingType");
  const duration = form.watch("duration");
  const fee = feeStructure[listingType as keyof typeof feeStructure][duration as keyof (typeof feeStructure)['standard']];

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="listingType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Listing Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="standard">Standard Listing (P13-P120)</SelectItem>
                <SelectItem value="featured">Featured Listing (P1-P12)</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Featured listings appear in top positions and get more visibility
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="48">48 hours</SelectItem>
                <SelectItem value="72">72 hours</SelectItem>
                <SelectItem value="96">96 hours</SelectItem>
                <SelectItem value="120">120 hours</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-gray-700">Selected Plan</h4>
              <p className="text-sm text-gray-600">
                {listingType === 'featured' ? 'Featured' : 'Standard'} listing for {duration} hours
              </p>
            </div>
            <div className="text-xl font-bold text-primary">
              ${fee}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}