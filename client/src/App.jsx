import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import ScanPage from './pages/ScanPage.jsx';
import BoardPage from './pages/BoardPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/board" replace /> },
  { path: '/scan', element: <ScanPage /> },
  { path: '/board', element: <BoardPage /> },
  { path: '/admin', element: <AdminPage /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
