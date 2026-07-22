import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const AdminBackLink = ({ label = 'Back to Dashboard' }) => {
  return (
    <div className="mb-5">
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.05em] text-[var(--prada-mid-gray)] hover:text-[var(--prada-black)] transition-colors"
      >
        <FiArrowLeft size={12} />
        <span>{label}</span>
      </Link>
    </div>
  );
};

export default AdminBackLink;
