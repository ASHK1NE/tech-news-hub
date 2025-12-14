import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import ArticleCard from '../components/ArticleCard';
import { TrendingUp, Zap, Code, Smartphone, Shield, Brain } from 'lucide-react';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'همه', icon: TrendingUp },
    { id: 'programming', name: 'برنامه‌نویسی', icon: Code },
    { id: 'ai', name: 'هوش مصنوعی', icon: Brain },
    { id: 'mobile', name: 'موبایل', icon: Smartphone },
    { id: 'security', name: 'امنیت', icon: Shield },
    { id: 'news', name: 'اخبار', icon: Zap }
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const q = query(
        collection(db, 'articles'),
        orderBy('createdAt', 'desc'),
        limit(20)
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

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            به دنیای تکنولوژی خوش آمدید
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            آخرین اخبار، مقالات و آموزش‌های دنیای برنامه‌نویسی و فناوری
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <a 
              href="#articles" 
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              مشاهده مقالات
            </a>
            <a 
              href="/write" 
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              نوشتن مقاله
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-lg font-semibold transition ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon size={20} />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section id="articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {selectedCategory === 'all' ? 'جدیدترین مقالات' : `مقالات ${categories.find(c => c.id === selectedCategory)?.name}`}
        </h2>

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
              هنوز مقاله‌ای در این دسته وجود ندارد
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            چرا TechNews Hub؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                محتوای باکیفیت
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                مقالات و آموزش‌های تخصصی از بهترین نویسندگان
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain size={32} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                جامعه فعال
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                بحث و تبادل نظر با افراد علاقه‌مند به تکنولوژی
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                به‌روز و سریع
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                آخرین اخبار و رویدادهای دنیای تکنولوژی
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
