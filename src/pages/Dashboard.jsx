import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { FaStar, FaRegStar, FaReply } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reviews"));
        const allReviews = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const myReviews = allReviews.filter(
          (review) => 
            review.saccoName.trim().toLowerCase() === user.saccoName.trim().toLowerCase()
        );

        setReviews(myReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [user.saccoName]);

  const handleReplySubmit = async (reviewId) => {
    const text = replyText[reviewId];
    if (!text) return;

    try {
      const reviewRef = doc(db, "reviews", reviewId);
      await updateDoc(reviewRef, { saccoReply: text });
      setReviews(reviews.map(review => 
        review.id === reviewId ? { ...review, saccoReply: text } : review
      ));
      setReplyText({ ...replyText, [reviewId]: '' });
      alert("Reply posted successfully!");
    } catch (err) {
      console.error("Error updating document: ", err);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className="mr-1">
        {index < rating ? <FaStar className="inline text-yellow-500" /> : <FaRegStar className="inline text-gray-500" />}
      </span>
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-2">{user.saccoName} Dashboard</h1>
      <p className="text-gray-400 mb-8">Manage your reviews and reply to passenger feedback.</p>

      {loading ? (
        <p className="text-gray-400">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400">No reviews found for {user.saccoName} yet.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-red-600">
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{review.saccoName}</h3>
                  <div className="my-1">{renderStars(review.rating)}</div>
                  <p className="text-gray-300">"{review.reviewText}"</p>
                  <p className="text-gray-500 text-sm mt-2">📍 {review.locationName}</p>
                </div>
              </div>

              {review.saccoReply && (
                <div className="bg-gray-900 p-4 rounded-md mt-4 border border-gray-700">
                  <p className="text-sm text-red-400 font-bold mb-1">Your Reply:</p>
                  <p className="text-gray-300">{review.saccoReply}</p>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Write a public reply..."
                  value={replyText[review.id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [review.id]: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button 
                  onClick={() => handleReplySubmit(review.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-md transition flex items-center gap-2"
                >
                  <FaReply /> Reply
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;