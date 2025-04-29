import React, { useContext, useEffect, useState, useRef } from 'react';
import OtherContext from '../context/OtherContext'; // adjust path if needed
import { formatDistanceToNow } from 'date-fns';

const CommentsSection = ({ projectId }) => {
  const {
    comments,
    fetchComments,
    postComment,
    loading,
    deleteComment,
  } = useContext(OtherContext);

  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const commentsListRef = useRef(null);
  const textareaRef = useRef(null);
  
  const user = JSON.parse(localStorage.getItem('elex-user'));
  const userEmail = user?.email;
  const userName = user ? `${user.firstName} ${user.lastName}` : 'Guest';
  const profilePic = user?.profilePic || 'https://ui-avatars.com/api/?name=Guest';
  
  // Study-related emojis and common emojis
  const commonEmojis = [
    "📚", "✏️", "📝", "📖", "🔍", // Study-related
    "💡", "🧠", "📊", "🎓", "⏰", // More study/education
    "👨‍🏫", "👩‍🎓", "🤔", "👍", "❤️", // People and reactions
    "🔥", "⭐", "✅", "❓", "💯" // Common expressions
  ];

  useEffect(() => {
    fetchComments(projectId);
  }, [projectId]);

  useEffect(() => {
    // Scroll to comments list when new comments are loaded
    if (comments.length > 0 && commentsListRef.current) {
      commentsListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  const handleDelete = async (id) => {
    try {
      console.log('Deleting comment with ID:', id);
      await deleteComment(id, projectId);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };
  
  const handlePost = async () => {
    if (!text.trim() || !user) return;
    
    const response = await postComment({
      projectId,
      userName,
      profilePic,
      text,
      userEmail,
    });
    setText('');
    
    // Focus back to textarea and scroll to the latest comment after posting
    if (textareaRef.current) textareaRef.current.focus();
    
    setTimeout(() => {
      if (commentsListRef.current) {
        commentsListRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  const insertEmoji = (emoji) => {
    setText((prevText) => prevText + emoji);
    if (textareaRef.current) textareaRef.current.focus();
  };

  // Handle key press for submitting with Enter+Ctrl
  const handleKeyPress = (e) => {
    console.log(`Pressed key: ${e.code}, Ctrl: ${e.ctrlKey}`);
    if (e.code === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handlePost();
    }
  };
  

  return (
    <div className="mt-8 p-6 bg-black rounded-lg border border-purple-800 shadow-lg w-full">
      <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
        <span className="mr-2">💬</span> Discussion Board
      </h2>

      <div className="flex gap-4 items-start mb-8 w-full">
        <img
          src={profilePic}
          alt="User"
          className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
        />
        <div className="flex-1 w-full">
          <textarea
            ref={textareaRef}
            className="w-full p-4 bg-gray-900 text-white border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-inner"
            rows="4"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              user ? 'Share your thoughts or questions...' : 'Login to join the discussion'
            }
            disabled={!user}
          />
          
          {/* Emoji Picker Section with animation */}
          <div className="mt-3 flex flex-wrap gap-2 bg-gray-900 p-3 rounded-lg border border-gray-800 shadow-inner">
            {commonEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => insertEmoji(emoji)}
                className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-purple-900 rounded-lg transition-all transform hover:scale-110 text-xl"
                disabled={!user}
                title={`Insert ${emoji} emoji`}
              >
                {emoji}
              </button>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              {user ? 'Press Ctrl+Enter to post' : 'Login to comment'}
            </p>
            <button
              onClick={handlePost}
              className="px-6 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 transition-all transform hover:translate-y-px shadow-md flex items-center gap-2"
              disabled={loading || !text.trim() || !user}
            >
              <span>{loading ? 'Posting...' : 'Post Comment'}</span>
              <span className="text-lg">📝</span>
            </button>
          </div>
        </div>
      </div>

      <div 
        ref={commentsListRef}
        className="transition-all duration-300"
      >
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-purple-400 flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading comments...</span>
            </div>
          </div>
        ) : comments.length > 0 ? (
          <div className="max-h-96 overflow-y-auto py-2 pr-2 custom-scrollbar">
            <ul className="space-y-4">
              {comments.map((c) => (
                <li 
                  key={c._id} 
                  className="flex items-start gap-4 relative p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-purple-700 transition-all transform hover:translate-x-1"
                >
                  <img
                    src={c.profilePic || 'https://ui-avatars.com/api/?name=User'}
                    alt={c.user || 'User'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white flex items-center gap-2">
                      {c.userName || 'Unknown'} 
                      <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                    </p>
                    <p className="text-gray-300 my-2 whitespace-pre-wrap">{c.text}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>⏱️</span> {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {c.userEmail === userEmail && (
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-red-900 text-gray-400 hover:text-red-300 transition-colors"
                      aria-label="Delete comment"
                    >
                      🗑️
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 bg-gray-900 rounded-lg border border-gray-800">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-lg">No comments yet. Start the discussion!</p>
            <p className="text-sm text-gray-500 mt-2">Be the first to share your thoughts on this project.</p>
          </div>
        )}
      </div>
      
      {/* Scroll to comments button with animation */}
      {comments.length > 3 && (
        <div className="flex justify-center mt-6">
          <button 
            onClick={() => commentsListRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="px-4 py-2 bg-gray-800 text-purple-300 rounded-full hover:bg-purple-900 hover:text-white transition-all transform hover:scale-105 shadow-md flex items-center gap-2"
          >
            <span>Jump to latest comments</span>
            <span className="animate-bounce">⬇️</span>
          </button>
        </div>
      )}
      
      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #9333ea;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a855f7;
        }
        
        @keyframes glow {
          0% { box-shadow: 0 0 5px rgba(147, 51, 234, 0.5); }
          50% { box-shadow: 0 0 15px rgba(147, 51, 234, 0.8); }
          100% { box-shadow: 0 0 5px rgba(147, 51, 234, 0.5); }
        }
        
        .glow-effect {
          animation: glow 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default CommentsSection;