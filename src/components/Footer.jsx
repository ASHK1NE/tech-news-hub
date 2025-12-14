import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 transition-colors duration-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              درباره ما
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              TechNews Hub پلتفرمی برای اشتراک‌گذاری و خواندن آخرین اخبار و مقالات دنیای تکنولوژی و برنامه‌نویسی است.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              دسترسی سریع
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition">
                  خانه
                </Link>
              </li>
              <li>
                <Link to="/articles" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition">
                  مقالات
                </Link>
              </li>
              <li>
                <Link to="/write" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition">
                  نوشتن مقاله
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              دسته‌بندی‌ها
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-400 text-sm">برنامه‌نویسی</li>
              <li className="text-gray-600 dark:text-gray-400 text-sm">هوش مصنوعی</li>
              <li className="text-gray-600 dark:text-gray-400 text-sm">موبایل</li>
              <li className="text-gray-600 dark:text-gray-400 text-sm">امنیت</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              شبکه‌های اجتماعی
            </h3>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2024 TechNews Hub. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
