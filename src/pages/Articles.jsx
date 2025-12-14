import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import ArticleCard from '../components/ArticleCard';
import { Search } from 'lucide-react';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'همه' },
    { id: 'programming', name: 'برنامه‌نویسی' },
    { id: 'ai', name: 'هوش مصنوعی' },
    { id: 'mobile', name: 'موبایل' },
    { id: 'security', name: 'امنیت' },
    { id: 'news', name: 'اخبار' }
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchTerm, selectedCategory, articles]);

  const fetchArticles = async () => {
    try {
      const q = query(
        collection(db, 'articles'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const articlesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setArticles(articlesData);
    } catch (error) {
      console.error('خطا در دریافت مقالات:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredArticles(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            تمام مقالات
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            مرور و جستجو در مقالات تکنولوژی
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          {/* Search Box */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجو در مقالات..."
                className="w-full pr-12 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredArticles.length} مقاله یافت شد
          </p>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-xl"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              مقاله‌ای یافت نشد
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
