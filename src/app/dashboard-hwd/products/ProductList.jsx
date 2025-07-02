export default function ProductList({ products = [], onItemClick }) {
  if (!products.length) {
    return <div className="text-center text-gray-500 py-16">등록된 상품이 없습니다.</div>;
  }
  return (
    <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
      {products.map((product) => (
        <li
          key={product.id}
          className="p-6 hover:bg-gray-50 cursor-pointer"
          onClick={() => onItemClick && onItemClick(product)}
        >
          <div className="flex items-center gap-4">
            {Array.isArray(product.photos) && product.photos.length > 0 && (
              <img
                src={
                  product.photos.find(p => p.isThumbnail)?.fileUrl || product.photos[0]?.fileUrl || ""
                }
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div>
              <div className="font-bold text-lg">{product.name}</div>
              <div className="text-gray-600">₩{product.price?.toLocaleString()}</div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
} 