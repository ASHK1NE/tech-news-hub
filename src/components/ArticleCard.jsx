import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Clock, User } from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

const ArticleCard = ({ article }) => {
  const { currentUser } = useAuth();
  const [likes, setLikes] = useState(article.likes || []);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setIsLiked(likes.includes(currentUser.uid));
    }
  }, [currentUser, likes]);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('برای لایک کردن باید وارد شوید');
      return;
    }

    const articleRef = doc(db, 'articles', article.id);
    
    try {
      if (isLiked) {
        await updateDoc(articleRef, {
          likes: arrayRemove(currentUser.uid)
        });
        setLikes(likes.filter(id => id !== currentUser.uid));
      } else {
        await updateDoc(articleRef, {
          likes: arrayUnion(currentUser.uid)
        });
        setLikes([...likes, currentUser.uid]);
      }
    } catch (error) {
      console.error('خطا در لایک:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR').format(date);
  };

  return (
    <Link 
      to={`/article/${article.id}`}
      className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
    >
      {/* Image */}
      {article.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {article.category}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
          {article.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {article.excerpt || article.content?.substring(0, 150)}...
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center space-x-1 space-x-reverse">
              <User size={16} />
              <span>{article.authorName}</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <Clock size={16} />
              <span>{formatDate(article.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 space-x-reverse transition ${
                isLiked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
              <span>{likes.length}</span>
            </button>
            <div className="flex items-center space-x-1 space-x-reverse">
              <MessageCircle size={18} />
              <span>{article.commentsCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
