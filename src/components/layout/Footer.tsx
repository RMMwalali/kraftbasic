import React from 'react';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  Star,
  Award,
  Zap,
  Shield,
  Truck,
  RotateCcw
} from 'lucide-react';
import { Card } from '../ui/Card';

const footerLinks = {
  products: [
    { name: 'T-Shirts', href: '/products?category=tshirts' },
    { name: 'Hoodies', href: '/products?category=hoodies' },
    { name: 'Mugs', href: '/products?category=mugs' },
    { name: 'Bags', href: '/products?category=bags' },
    { name: 'Posters', href: '/products?category=posters' },
    { name: 'Stickers', href: '/products?category=stickers' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Size Guide', href: '#' },
    { name: 'Shipping Info', href: '#' },
    { name: 'Returns', href: '#' },
    { name: 'Contact Us', href: '#' },
    { name: 'Track Order', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Partnerships', href: '#' },
    { name: 'Affiliate Program', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'GDPR', href: '#' },
    { name: 'Accessibility', href: '#' },
    { name: 'Licenses', href: '#' },
  ],
};

const features = [
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'SSL encrypted checkout',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    description: 'Free shipping over $50',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '30-day return policy',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Award,
    title: 'Quality Guarantee',
    description: '100% satisfaction',
    color: 'from-yellow-500 to-orange-500',
  },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
  { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-500' },
  { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-600' },
  { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-600' },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Features Section */}
        <div className="py-12 md:py-16 border-b border-gray-700/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <Card className="p-4 md:p-6 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-1 group-hover:text-primary-300 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  PrintCraft
                </span>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-300 text-lg leading-relaxed max-w-md"
              >
                Create, customize, and order high-quality print-on-demand products with ease. 
                Join thousands of creators and customers worldwide.
              </motion.p>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                  <Mail className="h-5 w-5 text-primary-400" />
                  <span>support@printcraft.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                  <Phone className="h-5 w-5 text-primary-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                  <MapPin className="h-5 w-5 text-primary-400" />
                  <span>San Francisco, CA</span>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex space-x-4"
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-gray-400 ${social.color} transition-all duration-200 hover:bg-white/10 shadow-lg`}
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Products */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-semibold text-white mb-4 text-lg">Products</h3>
                <ul className="space-y-3">
                  {footerLinks.products.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href} 
                        className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-semibold text-white mb-4 text-lg">Support</h3>
                <ul className="space-y-3">
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href} 
                        className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Company */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-semibold text-white mb-4 text-lg">Company</h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href} 
                        className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Legal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="font-semibold text-white mb-4 text-lg">Legal</h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href} 
                        className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-8 border-t border-gray-700/50"
        >
          <Card className="p-6 md:p-8 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 backdrop-blur-md border border-white/10 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center justify-center md:justify-start">
                  <Heart className="h-5 w-5 text-red-400 mr-2" />
                  Stay Updated
                </h3>
                <p className="text-gray-300">Get the latest designs, offers, and updates delivered to your inbox.</p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-0 sm:min-w-[250px]"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold py-3 px-6 rounded-xl shadow-xl transition-all duration-200 whitespace-nowrap"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-gray-700/50 py-6 md:py-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <span>&copy; 2024 PrintCraft. All rights reserved.</span>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-400 fill-current" />
                <span>in San Francisco</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>4.9/5 from 10,000+ reviews</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Zap className="h-4 w-4 text-green-400" />
                <span>99.9% uptime</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}