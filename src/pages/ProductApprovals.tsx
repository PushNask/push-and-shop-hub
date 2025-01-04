import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, User, MapPin, Clock, Package } from "lucide-react";
import { toast } from "sonner";

// Mock data - replace with actual data fetching
const MOCK_PENDING_PRODUCTS = [
  {
    id: "p1",
    title: "iPhone 13 Pro",
    description: "Latest model with advanced features",
    price: 750000,
    images: ["/placeholder.svg"],
    category: "Electronics",
    listingType: "featured",
    seller: {
      id: "s1",
      name: "Tech Store",
      rating: 4.5,
      location: "Douala, Cameroon",
      joinedDate: "2023-12-01"
    },
    submittedAt: "2024-02-20T10:00:00Z"
  },
  {
    id: "p2",
    title: "Samsung TV",
    description: "50-inch Smart TV",
    price: 450000,
    images: ["/placeholder.svg"],
    category: "Electronics",
    listingType: "standard",
    seller: {
      id: "s2",
      name: "Electronics Hub",
      rating: 4.2,
      location: "Yaoundé, Cameroon",
      joinedDate: "2023-11-15"
    },
    submittedAt: "2024-02-19T15:30:00Z"
  }
];

const ProductApprovals = () => {
  const [selectedProduct, setSelectedProduct] = useState<typeof MOCK_PENDING_PRODUCTS[0] | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAction = (action: "approve" | "reject") => {
    // Replace with actual API call
    toast.success(`Product ${action === "approve" ? "approved" : "rejected"} successfully`);
    setIsDialogOpen(false);
    setFeedback("");
    setSelectedProduct(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_PENDING_PRODUCTS.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">{product.title}</h3>
                      <Badge variant={product.listingType === "featured" ? "default" : "secondary"}>
                        {product.listingType}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{product.seller.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{product.seller.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Submitted: {formatDate(product.submittedAt)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Package className="h-4 w-4" />
                      <span>XAF {product.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        className="flex-1" 
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsDialogOpen(true);
                        }}
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedProduct && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Product Listing</DialogTitle>
              <DialogDescription>
                Review the details below and approve or reject the listing
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4">
              <div className="grid gap-2">
                <h3 className="font-semibold">{selectedProduct.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
              </div>
              
              <div className="grid gap-2">
                <h4 className="font-semibold">Seller Information</h4>
                <div className="text-sm space-y-1">
                  <p>Name: {selectedProduct.seller.name}</p>
                  <p>Location: {selectedProduct.seller.location}</p>
                  <p>Rating: {selectedProduct.seller.rating}/5</p>
                  <p>Member since: {formatDate(selectedProduct.seller.joinedDate)}</p>
                </div>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="feedback" className="font-semibold">Feedback</label>
                <Textarea
                  id="feedback"
                  placeholder="Enter feedback for the seller (optional)"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => handleAction("reject")}
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button
                onClick={() => handleAction("approve")}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default ProductApprovals;