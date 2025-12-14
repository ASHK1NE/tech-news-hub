import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import CommentSection from '../components/CommentSection';
import { Heart, Clock, User, Trash2, Edit } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  useEffect(() => {
    if (article && currentUser) {
      setIsLiked(article.likes?.includes(currentUser.uid) || false);
    }
  }, [article, currentUser]);

  const fetchArticle = async () => {
    try {
      const docRef = doc(db, 'articles', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setArticle({ id: docSnap.id, ...docSnap.data() });
      } else {
        alert('مقاله یافت نشد');
        navigate('/');
      }
    } catch (error) {
      console.error('خطا در دریافت مقاله:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      alert('برای لایک کردن باید وارد شوید');
      return;
    }

    const articleRef = doc(db, 'articles', id);
    
    try {
      if (isLiked) {
        await updateDoc(articleRef, {
          likes: arrayRemove(currentUser.uid)
        });
        setArticle({
          ...article,
          likes: article.likes.filter(uid => uid !== currentUser.uid)
        });
      } else {
        await updateDoc(articleRef, {
          likes: arrayUnion(currentUser.uid)
        });
        setArticle({
          ...article,
          likes: [...(article.likes || []), currentUser.uid]
        });
      }
    } catch (error) {
      console.error('خطا در لایک:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید این مقاله را حذف کنید؟')) {
      try {
        await deleteDoc(doc(db, 'articles', id));
        navigate('/');
      } catch (error) {
        console.error('خطا در حذف مقاله:', error);
        alert('خطا در حذف مقاله');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Image */}
        {article.imageUrl && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block px-4 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4 space-x-reverse text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {article.authorName}
                  </p>
                  <div className="flex items-center space-x-1 space-x-reverse text-sm">
                    <Clock size={14} />
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              {currentUser && currentUser.uid === article.authorId && (
                <>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </>
              )}
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition ${
                  isLiked
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                <span className="font-semibold">{article.likes?.length || 0}</span>
              </button>
            </div>
          </div>

          {/* Excerpt */}
          {article.excerpt && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-600 rounded">
              <p className="text-gray-700 dark:text-gray-300 italic">
                {article.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <CommentSection articleId={id} />
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
