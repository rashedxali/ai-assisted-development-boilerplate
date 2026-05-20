import { BodyText } from "@/components/globals/typography/body-text";
import type { CartItem } from "@/hooks/use-cart";

type Props = {
  product: CartItem;
};

export default function CheckoutProductCard({ product }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-dark-5 pb-4">
      <BodyText variant="14m" className="text-dark-100">
        {product.name}
      </BodyText>
      <BodyText variant="14r" className="text-dark-100">
        BDT {(product.price * product.quantity).toLocaleString()}
      </BodyText>
    </div>
  );
}
