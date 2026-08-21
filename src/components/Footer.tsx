import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 mt-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-4">Martyrs Of Christ World Outreach</h3>
          <p className="text-muted-foreground">
           Transforming lives  to be effective witnesses of Christ and also live as agents of change in the world at large.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {[ 
              { name: "Services", link: "/services" },
              { name: "About Us", link: "/about" },
              { name: "News & Events", link: "/news" },
              { name: "Partnership", link: "/partnership" },
              { name: "Giving", link: "/give/offering" },
              { name: "Contact", link: "/contact" }
            ].map((item, index) => (
              <li key={index}>
                <Link
                  to={item.link}
                  className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 hover:scale-105 hover:underline transition-transform duration-300"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2"><MapPin className="w-5 h-5" /> 123 Church Street, Accra, Ghana</li>
            <li className="flex items-center gap-2"><Phone className="w-5 h-5" /> +233 24 352 7174</li>
            <li className="flex items-center gap-2"><Mail className="w-5 h-5" /> info@fathersheart.org</li>
          </ul>

          <div className="flex gap-4 mt-4">
            {[ 
              { icon: <Facebook className="w-5 h-5 text-white" />, link: "#" },
              { icon: <Instagram className="w-5 h-5 text-white" />, link: "#" },
              { icon: <Youtube className="w-5 h-5 text-white" />, link: "#" }
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.link}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-400 transition-all duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Martyrs Of Christ World Outreach. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
