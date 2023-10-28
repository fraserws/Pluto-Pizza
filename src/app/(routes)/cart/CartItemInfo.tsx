interface CartItemInfoProps {
  item: Record<string, any>;
}

const CartItemInfo: React.FC<CartItemInfoProps> = ({
  item
}) => {
  return ( 
    <div>
      <div className="flex justify-between">
        <p className=" text-sm font-semibold text-black">
          {item.name}
        </p>
      </div>

      <div className="mt-1 flex text-sm">
        <p className="text-gray-500">{item.color}</p>
        <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{item.size}</p>
      </div>
      <p className="mt-1 text-sm text-gray-500">{item.quantity} x {item.price}</p>
    </div>
  );
}
 
export default CartItemInfo;