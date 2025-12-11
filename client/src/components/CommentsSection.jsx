import { useState } from 'react';
import { Star, Send, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const CommentsSection = ({ recipeId, comments, ratings, onUpdate }) => {
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState(0);
  const user = JSON.parse(localStorage.getItem('user'));


  useState(() => {
    if (user && ratings) {
      const existingRating = ratings.find(r => r.userId === user.id);
      if (existingRating) {
        setUserRating(existingRating.rating);
      }
    }
  }, [user, ratings]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await api.post(`/recipes/${recipeId}/comments`, { text: commentText });
      setCommentText('');
      onUpdate(); // Refresh parent data
    } catch (err) {
      console.error('Failed to post comment', err);
      alert('Failed to post comment. Please try again.');
    }
  };

  const handleRating = async (rating) => {
    try {
      await api.post(`/recipes/${recipeId}/rating`, { rating });
      setUserRating(rating);
      onUpdate(); // Refresh parent data
    } catch (err) {
      console.error('Failed to rate', err);
    }
  };

  return (
    <div className="pt-12 border-t border-gray-100">
      <h2 className="text-2xl font-bold text-brand-dark mb-6">Reviews & Comments</h2>
      
      {/* Add Rating & Comment */}
      {user ? (
        <div className="bg-gray-50 p-6 rounded-2xl mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-bold text-gray-700">Rate this recipe:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => handleRating(star)} className="focus:outline-none">
                  <Star 
                    size={24} 
                    className={`${userRating >= star ? 'text-brand-yellow fill-brand-yellow' : 'text-gray-300'} transition-colors`} 
                  />
                </button>
              ))}
            </div>
          </div>
          
          <form onSubmit={handleCommentSubmit} className="relative">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-4 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none resize-none h-32"
            ></textarea>
            <button 
              type="submit" 
              disabled={!commentText.trim()}
              className="absolute bottom-4 right-4 bg-brand-orange text-white p-2 rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-2xl mb-8 text-center">
          <p className="text-gray-600 mb-2">Please log in to leave a review.</p>
          <Link to="/login" className="text-brand-orange font-bold hover:underline">Sign In</Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="flex gap-4">
              <Link to={`/profile/${comment.user?._id}`} className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden hover:opacity-80 transition-opacity">
                {comment.user?.avatarUrl ? (
                  <img src={comment.user.avatarUrl} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-gray-500" />
                )}
              </Link>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Link to={`/profile/${comment.user?._id}`} className="font-bold text-brand-dark hover:text-brand-orange transition-colors">
                    {comment.user?.username || 'User'}
                  </Link>
                  <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-600">{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
