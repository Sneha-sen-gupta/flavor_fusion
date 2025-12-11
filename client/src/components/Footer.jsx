import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold text-brand-dark">FlavorFusion</span>
            </div>
            <p className="text-gray-500 max-w-sm">
              Discover, create, and share culinary masterpieces with the world.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-brand-dark mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-500">
              <li><a href="/" className="hover:text-brand-orange">Home</a></li>
              <li><a href="/ai-chef" className="hover:text-brand-orange">AI Chef</a></li>
              <li><a href="/create-recipe" className="hover:text-brand-orange">Add Recipe</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-dark mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-500">
              <li><a href="#" className="hover:text-brand-orange">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-orange">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2025 FlavorFusion. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart size={14} className="text-brand-orange fill-brand-orange" />
            <span>by <span className="font-bold text-brand-dark">Team Aurixa</span></span>
          </div>
          <p></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
