import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import globalPastorBibleStudiesCoordinator from "@/assets/PASTORS AND HODS/GLOBAL PASTOR AND BIBLE STUDIES CO-ORDINATOR.png";
import globalPastorProtocolUshering from "@/assets/PASTORS AND HODS/GLOBAL PASTOR & HOD PROTOCOL AND USHERING .png";
import globalSecretaryAdministrationHod from "@/assets/PASTORS AND HODS/GLOBAL SECRETARY & ADMINISTRATION HOD.png";
import HOD_EDENPLAY from "@/assets/PASTORS AND HODS/HOD - EDENPLAY.png";
import HOD_MEN_ON_MISSION from "@/assets/PASTORS AND HODS/HOD - MEN ON MISSION.png";
import HOD_MONITORING_AND_EVALUATION_TEAM from "@/assets/PASTORS AND HODS/HOD - MONITORING AND EVALUATION TEAM.png";
import HOD_MUSIC_DEPARTMENT from "@/assets/PASTORS AND HODS/HOD - MUSIC DEPARTMENT.png";
import HOD_TELEPASTORING from "@/assets/PASTORS AND HODS/HOD - TELEPASTORING.png";
import HOD_TERTIARY_MINISTRY from "@/assets/PASTORS AND HODS/HOD - TERTIARY MINISTRY.png";
import HOD_WOMEN_ON_THE_MOVE from "@/assets/PASTORS AND HODS/HOD - WOMEN ON THE MOVE.png";
import globalPastorDirectorGhanaChurch from "@/assets/PASTORS AND HODS/GLOBAL PASTOR & DIRECTOR GHANA CHURCH.jpeg";
import beatriceImage from "@/assets/e1 (7).jpg";
import REV1 from "@/assets/rev1.jpeg";
import REV2 from "@/assets/rev2.jpeg";
import PK from "@/assets/pk.jpeg";
import PO from "@/assets/po.jpeg";
import S1 from "@/assets/sunday/1.jpeg";
import S2 from "@/assets/sunday/2.jpeg";
import S3 from "@/assets/sunday/3.jpeg";
import S4 from "@/assets/sunday/4.jpeg";
import S5 from "@/assets/sunday/5.jpeg";
import hero5 from "@/assets/hero5.jpeg";
import tHero from "@/assets/t.jpg";
import { Mail, Facebook, Instagram, Youtube } from "lucide-react";

const Leadership = () => {
  const [email, setEmail] = useState("");

  // Founder and Wife - Extra Large
  const founderAndWife = [
    { name: "Rev. Prince Appau Bediako", title: "Founder & Senior Pastor", photo: REV2 },
    { name: "Prophetess Mrs. Beatrice Appau Bediako", title: "Co-Leader & Wife", photo: beatriceImage },
  ];

  // Global Pastors - 4 people
  const globalAssociates = [
    { name: "Global Associate 1", title: "Global Associate", photo: REV1 },
    { name: "PASTOR EMMANUEL OKRAH", title: "Global Associate", photo: globalPastorDirectorGhanaChurch },
    { name: "PASTOR OBED SARFO", title: "Head of Protocol and Ushering", photo: globalPastorProtocolUshering },
    { name: "PASTOR DR. KWAME FENYI AIDOO", title: "Bible Studies Coordinator", photo: globalPastorBibleStudiesCoordinator },
  ];

  // Global Secretariat - 2 people
  const globalSecretariat = [
    { name: "LADY PASTOR NARNHA", title: "ADMINISTRATION HOD", photo: globalSecretaryAdministrationHod },
    { name: "Secretariat Head 2", title: "Global Secretariat", photo: S2 },
  ];

  // HODs - 8 people
  const hods = [
    { name: "PASTOR TERRY NKANSAH", title: "MEN ON MISSION", photo: HOD_MEN_ON_MISSION },
    { name: "LADY PASTOR LYDIA OKRAH", title: "WOMEN ON THE MOVE", photo: HOD_WOMEN_ON_THE_MOVE },
    { name: "PASTOR DAPI", title: "MUSIC DEPARTMENT", photo: HOD_MUSIC_DEPARTMENT },
    { name: "PASTOR", title: "TERTIARY MINISTRY", photo: HOD_TERTIARY_MINISTRY },
    { name: "LADY PASTOR MERCY AGYEI", title: "TELEPASTORING", photo: HOD_TELEPASTORING },
    { name: "LADY PASTOR TITI", title: "EDENPLAY", photo: HOD_EDENPLAY },
    { name: "LADY PASTOR", title: "MONITORING AND EVALUATION TEAM", photo: HOD_MONITORING_AND_EVALUATION_TEAM },
    // { name: "HOD Worship", title: "Head of Departments", photo: S1 },
  ];

  // Resident Pastors - 4 people
  const residentPastors = [
    { name: "Resident Pastor 1", title: "Resident Pastor", photo: S2 },
    { name: "Resident Pastor 2", title: "Resident Pastor", photo: S3 },
    { name: "Resident Pastor 3", title: "Resident Pastor", photo: S4 },
    { name: "Resident Pastor 4", title: "Resident Pastor", photo: S5 },
  ];

  // Campus Pastors - 6 people (can expand as needed)
  const campusPastors = [
    { name: "Campus Pastor 1", title: "Campus Pastor", photo: REV1 },
    { name: "Campus Pastor 2", title: "Campus Pastor", photo: REV2 },
    { name: "Campus Pastor 3", title: "Campus Pastor", photo: PK },
    { name: "Campus Pastor 4", title: "Campus Pastor", photo: PO },
    { name: "Campus Pastor 5", title: "Campus Pastor", photo: S1 },
    { name: "Campus Pastor 6", title: "Campus Pastor", photo: S2 },
  ];

  const renderHierarchySection = (title, members, size = "normal") => {
    const isLarge = size === 'large';
    const sizeClasses = isLarge 
      ? 'w-80 h-96' 
      : 'w-56 h-72';
    const gapClass = isLarge ? 'gap-12' : 'gap-6';
    const textSizeClass = isLarge ? 'text-2xl' : 'text-lg';
    const subtitleClass = isLarge ? 'text-base' : 'text-sm';

    return (
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">{title}</h3>
        <div className={`flex flex-wrap justify-center ${gapClass}`}>
          {members.map((member, idx) => (
            <div
              key={idx}
              className={`group cursor-pointer relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${sizeClasses}`}
            >
              <img 
                src={member.photo} 
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                style={title.includes('HOD') && (idx === 0 || idx === 5) ? { objectPosition: 'center 25%' } : undefined}
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Text Content at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className={`font-bold mb-1 ${textSizeClass}`}>
                  {member.name}
                </h3>
                <p className={`${subtitleClass} text-gray-200 font-medium`}>
                  {member.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden pt-16">
      {/* Hero Section */}
      <section className="relative min-h-96 flex items-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${tHero})`,
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/80 via-slate-900/70 to-slate-950/60" />
        {/* colour overlay like homepage */}

        <div className="relative z-10 container mx-auto px-4 w-full flex justify-center">
          <div className="max-w-3xl text-center">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-cyan text-white mb-6 leading-tight">
              Meet our team 
            </h1>
            {/* <p className="text-xl md:text-2xl text-gray-100 leading-relaxed">
              Our people define our success. We are all passionate and committed to making a positive impact in the world.
            </p> */}
          </div>
        </div>
      </section>

      {/* Meet the Leadership Team Section */}
      <section className="py-20 bg-gradient-to-r from-purple-100 via-pink-100 to-cyan-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-start md:gap-16 mb-16">
            <div className="md:w-1/4">
              <div className="inline-block px-4 py-2 bg-slate-900 text-white rounded-full mb-6">
                {/* <p className="text-sm font-semibold">Leadership Hierarchy</p> */}
              </div>
            </div>
            <div className="md:w-3/4">
              {/* <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
                Meet the<br />leadership team
              </h2> */}
            </div>
          </div>

          {/* Hierarchy Sections */}
          <div className="space-y-20">
            {/* Founder & Wife - Extra Large */}
            {renderHierarchySection("Founder & Senior Pastor", founderAndWife, "large")}

            {/* Global Pastors */}
            {renderHierarchySection("Global Pastors", globalAssociates, "normal")}

            {/* Global Secretariat */}
            {renderHierarchySection("Global Secretariat", globalSecretariat, "normal")}

            {/* HODs */}
            {renderHierarchySection("Heads of Departments (HODs)", hods, "normal")}

            {/* Resident Pastors */}
            {renderHierarchySection("Resident Pastors", residentPastors, "normal")}

            {/* Campus Pastors */}
            {renderHierarchySection("Campus Pastors", campusPastors, "normal")}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Join Our Team Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-12 md:p-16 text-white flex flex-col justify-between min-h-80">
              <div>
                <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                  <p className="text-sm font-semibold text-white">Join our team</p>
                </div>
                <h3 className="text-4xl md:text-5xl font-black leading-tight mb-4">
                  Be a part of our mission to make a difference
                </h3>
              </div>
              <Link to="/membership">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-3">
                  Apply Now
                </Button>
              </Link>
            </div>

            {/* Collaboration Card */}
            <div className="bg-gradient-to-br from-cyan-200 via-blue-100 to-purple-100 rounded-3xl p-12 md:p-16 text-gray-900 flex flex-col justify-between min-h-80">
              <div>
                <div className="inline-block px-4 py-2 bg-slate-900/10 backdrop-blur-sm rounded-full mb-6">
                  <p className="text-sm font-semibold text-gray-900">Let's collaborate</p>
                </div>
                <h3 className="text-4xl md:text-5xl font-black leading-tight mb-4">
                  Ready to make a difference? Support our mission and help us create a better world together.
                </h3>
              </div>
              <Link to="/contact">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 font-bold px-8 py-3">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Leadership;
