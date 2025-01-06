interface ProductPriceProps {
  price: number;
  currency?: string;
}

export const ProductPrice = ({ price, currency = 'XAF' }: ProductPriceProps) => {
  return (
    <p className="text-sm text-muted-foreground">
      {currency} {price.toLocaleString()}
    </p>
  );
};