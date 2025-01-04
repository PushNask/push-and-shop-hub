import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Activity, Clock, Eye, MousePointerClick, RefreshCw } from "lucide-react";

// Mock data for demonstration
const generateMockLinkData = () => {
  const links = [];
  for (let i = 1; i <= 120; i++) {
    const isFeatured = i <= 12;
    links.push({
      id: i,
      slot: `P${i}`,
      type: isFeatured ? "featured" : "standard",
      product: i % 3 === 0 ? null : {
        id: `prod-${i}`,
        name: `Product ${i}`,
        expiry: new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000),
      },
      stats: {
        activeVisitors: Math.floor(Math.random() * 100),
        clickRate: Math.random() * 0.15,
        bounceRate: Math.random() * 0.8,
      },
    });
  }
  return links;
};

const LinkManagement = () => {
  const { toast } = useToast();
  const links = generateMockLinkData();

  const handleAutoReplace = (slotId: number) => {
    toast({
      title: "Auto-replacement initiated",
      description: `Slot P${slotId} will be updated with the next product in queue.`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Link Management</h1>
        <p className="text-muted-foreground">
          Manage and monitor 120 permanent link slots (12 featured, 108 standard)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Slots</CardTitle>
            <CardDescription>Active and available slots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">
              12 Featured + 108 Standard
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Active Listings</CardTitle>
            <CardDescription>Currently occupied slots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {links.filter((link) => link.product).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {((links.filter((link) => link.product).length / 120) * 100).toFixed(
                1
              )}
              % occupancy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Average Click Rate
            </CardTitle>
            <CardDescription>Across all active slots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                links.reduce(
                  (acc, link) => acc + (link.product ? link.stats.clickRate : 0),
                  0
                ) / links.filter((link) => link.product).length
              ).toFixed(1)}
              %
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Active Visitors
            </CardTitle>
            <CardDescription>Current total visitors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {links.reduce(
                (acc, link) =>
                  acc + (link.product ? link.stats.activeVisitors : 0),
                0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Link Slots Overview</CardTitle>
          <CardDescription>
            Monitor and manage all permanent link slots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slot</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Current Product</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">{link.slot}</TableCell>
                    <TableCell>
                      <Badge
                        variant={link.type === "featured" ? "default" : "secondary"}
                      >
                        {link.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {link.product ? (
                        link.product.name
                      ) : (
                        <span className="text-muted-foreground">Available</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {link.product ? (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {new Date(link.product.expiry).toLocaleDateString()}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {link.product ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Activity className="h-4 w-4" />
                            <span>
                              {link.stats.clickRate.toFixed(1)}% click rate
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Eye className="h-4 w-4" />
                            <span>{link.stats.activeVisitors} active</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MousePointerClick className="h-4 w-4" />
                            <span>
                              {(link.stats.bounceRate * 100).toFixed(1)}% bounce
                            </span>
                          </div>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {link.product ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAutoReplace(link.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Auto-replace
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAutoReplace(link.id)}
                        >
                          Assign Product
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkManagement;