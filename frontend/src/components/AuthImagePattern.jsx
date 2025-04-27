
  import {
    MessageCircle,
    Bot,
    Bell,
    Users,
    PieChart,
    CheckSquare,
    Image,
    Settings,
    HelpCircle,
  } from "lucide-react";
  import { motion } from "framer-motion";
  
  const icons = [
    <MessageCircle size="28" />,
    <Bot size="28" />,
    <Bell size="28" />,
    <Users size="28" />,
    <PieChart size="28" />,
    <CheckSquare size="28" />,
    <Image size="28" />,
    <Settings size="28" />,
    <HelpCircle size="28" />,
  ];
  
  const AuthImagePattern = ({ title, subtitle }) => {
    return (
      <div className="hidden lg:flex items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="grid grid-cols-3 gap-4 mb-8">
            {icons.map((icon, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4, type:"spring" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="aspect-square rounded-2xl bg-primary/10 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: i * 0.2 }}
                >
                  {icon}
                </motion.div>
              </motion.div>
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-base-content/60">{subtitle}</p>
        </div>
      </div>
    );
  };
  
  export default AuthImagePattern;
  
