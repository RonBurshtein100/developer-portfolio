import React from "react";

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <style jsx>{`
        :root {
          --primary: #3b82f6;
          --primary-dark: #2563eb;
          --text-primary: #1a1a1a;
          --text-secondary: #6b7280;
          --bg-primary: #ffffff;
          --bg-secondary: #f8fafc;
          --border: #e5e7eb;
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        [data-theme="dark"] {
          --text-primary: #ffffff;
          --text-secondary: #d1d5db;
          --bg-primary: #111827;
          --bg-secondary: #1f2937;
          --border: #374151;
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
          --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }

        .glass-effect {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        [data-theme="dark"] .glass-effect {
          background: rgba(17, 24, 39, 0.8);
          border: 1px solid rgba(55, 65, 81, 0.3);
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .gradient-text {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .custom-scroll {
          scroll-behavior: smooth;
        }

        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scroll::-webkit-scrollbar-track {
          background: var(--bg-secondary);
        }

        .custom-scroll::-webkit-scrollbar-thumb {
          background: var(--primary);
          border-radius: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float {
            animation: none;
          }
        }
      `}</style>
      <div className="custom-scroll">
        {children}
      </div>
    </div>
  );
}