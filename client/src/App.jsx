import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AllRecipesPage from './pages/AllRecipesPage';
import AIPage from './pages/AIPage';
import ProfilePage from './pages/ProfilePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CreateRecipePage from './pages/CreateRecipePage';
import AllChefsPage from './pages/AllChefsPage';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="content pb-20 md:pb-0"> 
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="/explore" element={
              <ProtectedRoute>
                <AllRecipesPage />
              </ProtectedRoute>
            } />
            <Route path="/chefs" element={
              <ProtectedRoute>
                <AllChefsPage />
              </ProtectedRoute>
            } />
            <Route path="/ai-chef" element={
              <ProtectedRoute>
                <AIPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/profile/:id" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/recipe/:id" element={
              <ProtectedRoute>
                <RecipeDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/create-recipe" element={
              <ProtectedRoute>
                <CreateRecipePage />
              </ProtectedRoute>
            } />
            <Route path="/edit-recipe/:id" element={
              <ProtectedRoute>
                <CreateRecipePage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        <MobileBottomNav />
      </div>
    </Router>
  );
}

export default App;
