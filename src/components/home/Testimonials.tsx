import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Award, TrendingUp, Users, Heart } from 'lucide-react';
import { Card } from '../ui/Card';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Small Business Owner',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    content: 'PrintCraft made it so easy to create custom merchandise for my business. The quality is outstanding and my customers love the designs!',
    rating: 5,
    verified: true,
    orderCount: 24,
  },
  {
    id: 2,
    name: 'Mike Chen',
    role: 'Graphic Designer',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
    content: 'As a creator, I love how easy it is to upload my designs and start earning. The platform takes care of everything else!',
    rating: 5,
    verified: true,
    earnings: '$15,678',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Customer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    content: 'The customization tools are incredible! I created the perfect gift for my friend and the delivery was super fast.',
    rating: 5,
    verified: true,
    orderCount: 8,
  },
];

const achievements = [
  {
    icon: Users,
    value: '50K+',
    label: 'Happy Customers',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: TrendingUp,
    value: '100K+',
    label: 'Orders Delivered',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Award,
    value: '1K+',
    label: 'Active Creators',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Heart,
    value: '4.9',
    label: 'Average Rating',
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-500/10',
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md rounded-full px-6 py-3 border border-white/30 shadow-xl mb-6"
          >
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-700">Trusted by thousands</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            What Our <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Community</span> Says
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Join thousands of happy customers and creators who love our platform
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 md:p-8 h-full bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-primary-500 mr-3 group-hover:scale-110 transition-transform" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-white/50 shadow-lg"
                      />
                      {testimonial.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Star className="h-2 w-2 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  {testimonial.orderCount && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Orders</p>
                      <p className="font-bold text-primary-600">{testimonial.orderCount}</p>
                    </div>
                  )}
                  
                  {testimonial.earnings && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Earned</p>
                      <p className="font-bold text-green-600">{testimonial.earnings}</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Achievement Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring" }}
              className="text-center group"
            >
              <Card className="p-6 md:p-8 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${achievement.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <div className={`w-8 h-8 bg-gradient-to-r ${achievement.color} rounded-lg flex items-center justify-center`}>
                    <achievement.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {achievement.value}
                </div>
                <div className="text-gray-600 font-medium">{achievement.label}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Card className="p-8 md:p-12 bg-gradient-to-r from-primary-500/90 to-secondary-500/90 backdrop-blur-md border border-white/20 shadow-2xl text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Creating?</h3>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join our community of creators and customers. Start designing, selling, or shopping today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-xl border border-white/30 shadow-xl transition-all duration-200"
                >
                  Start Designing
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-xl shadow-xl transition-all duration-200"
                >
                  Browse Products
                </motion.button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}