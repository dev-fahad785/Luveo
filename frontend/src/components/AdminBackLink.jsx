import { Link } from 'react-router-dom';

const AdminBackLink = ({ label = 'Back to Dashboard' }) => {
    return (
        <div className="mb-4">
            <Link
                to="/admin"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
                <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span>{label}</span>
            </Link>
        </div>
    );
};

export default AdminBackLink;
