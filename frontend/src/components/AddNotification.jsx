import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminBackLink from './AdminBackLink';

const NotificationForm = () => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [timer, setTimer] = useState(3000);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_BACKEND_URL + '/notification';

  useEffect(() => {
    axios.get(API_URL + '/notification')
      .then(res => {
        setCurrentNotification(res.data);
        setMessage(res.data.message);
        setType(res.data.type);
        setTimer(res.data.timer);
      })
      .catch(() => setCurrentNotification(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL + '/add-notification', { message, type, timer }, { withCredentials: true });
      alert('Notification saved successfully');
    } catch (err) {
      console.error(err);
      alert('Error saving notification');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(API_URL + '/delete-notification');
      setCurrentNotification(null);
      setMessage('');
      setType('info');
      setTimer(3000);
      alert('Notification deleted');
    } catch (err) {
      console.error(err);
      alert('Error deleting notification');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-[clamp(16px,4vw,40px)] py-10">
      <AdminBackLink />
      <div className="border border-[var(--prada-border)] bg-white p-6 sm:p-8">
        <h2 className="text-sm font-bold tracking-[0.05em] uppercase text-[var(--prada-black)] mb-6">
          Notification Manager
        </h2>

        {loading ? (
          <p className="text-[10px] font-mono text-[var(--prada-mid-gray)]">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] block mb-1.5">
                Message
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full border border-[var(--prada-border)] px-3 py-2.5 text-sm text-[var(--prada-black)] outline-none focus:border-[var(--prada-black)] transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] block mb-1.5">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-[var(--prada-border)] px-3 py-2.5 text-sm text-[var(--prada-black)] outline-none focus:border-[var(--prada-black)] transition-colors bg-white"
              >
                <option value="info">Info</option>
                <option value="sale">Sale</option>
                <option value="warning">Warning</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] block mb-1.5">
                Timer (ms)
              </label>
              <input
                type="number"
                value={timer}
                onChange={(e) => setTimer(Number(e.target.value))}
                min={100}
                className="w-full border border-[var(--prada-border)] px-3 py-2.5 text-sm text-[var(--prada-black)] outline-none focus:border-[var(--prada-black)] transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-[10px] font-semibold tracking-[0.1em] uppercase bg-[var(--prada-black)] text-white border border-[var(--prada-black)] hover:bg-black/90 transition-colors active:scale-[0.98]"
            >
              Save Notification
            </button>

            {currentNotification && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full py-3 text-[10px] font-semibold tracking-[0.1em] uppercase border border-[var(--brand-accent)] text-[var(--brand-accent)] hover:bg-[var(--brand-accent)] hover:text-white transition-colors active:scale-[0.98]"
              >
                Delete Notification
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default NotificationForm;
