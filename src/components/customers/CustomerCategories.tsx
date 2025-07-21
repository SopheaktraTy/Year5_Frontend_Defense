import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { getAllCategories } from '../../services/categorieService';
import { CategoryDto } from '../../types/categoriesType';

const CategoriesComponent = () => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mouse wheel horizontal scroll
useEffect(() => {
  const el = scrollRef.current;
  if (!el) return;

  const handleWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      requestAnimationFrame(() => {
        el.scrollTo({
          left: el.scrollLeft + e.deltaY,
          behavior: 'smooth',
        });
      });
    }
  };

  el.addEventListener('wheel', handleWheel, { passive: false });
  return () => el.removeEventListener('wheel', handleWheel);
}, [scrollRef.current]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to fetch categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (id: string) => {
    router.push(`/customer/category/${id}`);
  };

  if (loading) {
    return (
      <div className="w-full py-8 ">
        <div className="flex space-x-6 overflow-x-auto px-4 pb-2 scrollbar-hide [&::-webkit-scrollbar]:hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center flex-shrink-0 animate-pulse w-24">
              <div className="w-20 h-20 bg-gray-200 rounded-full mb-2"></div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="w-16 h-3 bg-gray-200 rounded mt-1"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="w-full py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full py-6 ">
     <div
  ref={scrollRef}
  className="flex items-center gap-6 overflow-x-auto scroll-smooth px-4 pb-2 snap-x snap-mandatory scrollbar-hide"
  style={{
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  }}
>
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer group transition-transform duration-200 hover:scale-105 w-24 snap-center"
          >
            <div className="w-16 h-16 mb-2 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shadow group-hover:shadow-md transition-shadow duration-200">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.category_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">
                    {category.category_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-900 truncate text-center w-full">
              {category.category_name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesComponent;
