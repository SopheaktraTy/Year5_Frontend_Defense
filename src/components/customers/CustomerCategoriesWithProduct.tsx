import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { getCategoryById, getAllCategories } from '../../services/categoryService';
import { CategoryDto, CategoryWithProductsDto } from '../../types/categoryType';
import ProductCard from '../customers/CustomerProductCard';
import CategoriesSidebar from './CustomerCategoriesSidebar';

const ProductCategoryPage: React.FC = () => {
  const router = useRouter();
  const { categoryId } = router.query;

  const [category, setCategory] = useState<CategoryWithProductsDto | null>(null);
  const [allCategories, setAllCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('az');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [availability, setAvailability] = useState<'in' | 'out' | null>(null);
  const [discountRange, setDiscountRange] = useState<'low' | 'high' | null>(null);

  useEffect(() => {
    if (categoryId && typeof categoryId === 'string') {
      fetchCategoryData(categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchCategoryData = async (id: string) => {
    try {
      setLoading(true);
      const data = await getCategoryById(id);
      setCategory(data);
    } catch (err) {
      console.error('Failed to load category:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const data = await getAllCategories();
      setAllCategories(data);
    } catch (err) {
      console.error('Failed to load all categories:', err);
    }
  };

  const handleCategoryChange = (id: string) => {
    router.push(`/customer/category/${id}`);
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  const handleAvailabilityChange = (status: 'in' | 'out' | null) => {
    setAvailability(status);
  };

  const handleDiscountChange = (range: 'low' | 'high' | null) => {
    setDiscountRange(range);
  };

  const getDiscountedPrice = (p: CategoryWithProductsDto['products'][0]) =>
    p.discount_percentage_tag && p.discount_percentage_tag > 0
      ? p.original_price - (p.original_price * p.discount_percentage_tag) / 100
      : p.original_price;

  const sortedProducts = useMemo(() => {
    if (!category) return [];

    return [...category.products]
      .filter((p) => {
        const price = getDiscountedPrice(p);
        const discount = p.discount_percentage_tag || 0;

        const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
        const matchesAvailability =
          availability === null ||
          (availability === 'in' && p.total_quantity > 0) ||
          (availability === 'out' && p.total_quantity === 0);
        const matchesDiscount =
          discountRange === null ||
          (discountRange === 'low' && discount <= 50) ||
          (discountRange === 'high' && discount > 50);

        return matchesPrice && matchesAvailability && matchesDiscount;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'az':
            return a.product_name.localeCompare(b.product_name);
          case 'za':
            return b.product_name.localeCompare(a.product_name);
          case 'price-low-high':
            return getDiscountedPrice(a) - getDiscountedPrice(b);
          case 'price-high-low':
            return getDiscountedPrice(b) - getDiscountedPrice(a);
          default:
            return 0;
        }
      });
  }, [category, sortBy, priceRange, availability, discountRange]);

  // Return loading early — this is now safe
  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!category) return <div className="text-center py-20">Category not found.</div>;

  return (
    <div className="min-h-screen">
      <div className="bg-gray-900 text-white py-16 px-4">
        <h1 className="text-4xl font-bold mb-2">{category.category_name}</h1>
        <p className="text-sm text-gray-300">Browse all products in this category</p>
      </div>

      <div className="container mx-auto  py-8 flex gap-6">
        <CategoriesSidebar
          categories={allCategories.map((cat) => ({
            id: cat.id,
            name: cat.category_name,
          }))}
          selectedCategoryId={category.id}
          onCategoryChange={handleCategoryChange}
          onPriceChange={handlePriceChange}
          onAvailabilityChange={handleAvailabilityChange}
          onDiscountChange={handleDiscountChange}
        />

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6 rounded-lg bg-white p-4 ">
            <div className='flex flex-col gap-0'>
                <h1 className="text-3xl font-bold mb-2">{category.category_name}</h1>
              <span className="text-gray-600 text-base font-normal">{sortedProducts.length} products</span>
            </div>
           
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm bg-white min-w-32"
            >
              <option value="az">Name: A-Z</option>
              <option value="za">Name: Z-A</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center text-gray-500 py-16">No products found in this category.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryPage;
