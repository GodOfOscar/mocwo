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
    { name: "PASTOR DR. RICHARD K.", title: "Global Associate", photo: REV1 },
    { name: "PASTOR EMMANUEL OKRAH", title: "Global Associate", photo: globalPastorDirectorGhanaChurch },
    { name: "PASTOR OBED SARFO", title: "Head of Protocol and Ushering", photo: globalPastorProtocolUshering },
    { name: "PASTOR DR. KWAME FENYI AIDOO", title: "Bible Studies Coordinator", photo: globalPastorBibleStudiesCoordinator },
  ];

  // Global Secretariat - 2 people
  const globalSecretariat = [
    { name: "LADY PASTOR NARNHA", title: "GLOBAL SECRETARIAT", photo: globalSecretaryAdministrationHod },
    { name: "LADY PASTOR MARGARET BOAFO", title: "ASS. GLOBAL SECREATARY",  },
  ];

  // HODs - 8 people
  const hods = [
    { name: "PASTOR TERRY NKANSAH", title: "MEN ON MISSION", photo: HOD_MEN_ON_MISSION },
    { name: "LADY PASTOR LYDIA OKRAH", title: "WOMEN ON THE MOVE", photo: HOD_WOMEN_ON_THE_MOVE },
    { name: "PASTOR DAPILA EVANS", title: "MUSIC DEPARTMENT", photo: HOD_MUSIC_DEPARTMENT },
    { name: "PASTOR EMMANUEL TETTEH", title: "TERTIARY MINISTRY", photo: HOD_TERTIARY_MINISTRY },
    { name: "LADY PASTOR MERCY AGYEI", title: "TELEPASTORING", photo: HOD_TELEPASTORING },
    { name: "LADY PASTOR NARNHA", title: "ADMINISTRATION HOD", photo: globalSecretaryAdministrationHod },
    { name: "LADY PASTOR TITI", title: "EDENPLAY", photo: HOD_EDENPLAY },
    { name: "LADY PASTOR PRISCILLA", title: "MONITORING AND EVALUATION TEAM", photo: HOD_MONITORING_AND_EVALUATION_TEAM },
    { name: "PASTOR OKRAH EMMANUEL", title: "MEDIA AND TECHNICAL",  },
    { name: "PASTOR PHILIP NARTEY", title: "PRAYER",  },
    { name: "PASTOR KINGSLEY ACHEAMPONG", title: "HIGH SCHOOL MINISTRY",  },
    { name: "LADY PASTOR RUTH", title: "OUTREACH HOD", },
  ];

  // Resident Pastors - 4 people
  const residentPastors = [
    { name: "PASTOR TERRY NKANSAH", title: "KUMASI FHCI", photo:HOD_MEN_ON_MISSION },
    { name: "PASTOR ANNOR ATUAHENE", title: "ACCRA FHCI",},
    // { name: "Resident Pastor 3", title: "Resident Pastor", photo: S4 },
    // { name: "Resident Pastor 4", title: "Resident Pastor", photo: S5 },
  ];

  // Campus Pastors - 6 people (can expand as needed)
  const campusPastors = [
    { name: "Ps Annor Atuahene", title: "UG/UPSA CAMPUS", },
    { name: "Lady Ps Princess Amoateng", title: "UHAS CAMPUS",  },
    { name: "Lady Ps Namzoya Deborah ", title: "UDS CAMPUS",  },
    { name: " Lady Ps Gloria Kamsi", title: "UENR CAMPUS", },
    { name: "Abigail Owusu", title: "UMAT-TARKWA CAMPUS",  },
    { name: "Emmanuel Etsibah", title: "UMAT-TAKORADI CAMPUS ", },
    { name: " Ps Aaron Ankrah", title: "UCC CAMPUS",  },
    { name: "Ps Oscar Duut", title: "KNUST CAMPUS",  },
    { name: " Ps George Basoah", title: "USTED CAMPUS", },
    { name: "Ps Richnold Boateng", title: "KSTU CAMPUS",  },
    { name: " Ps Amanda Popel", title: "PRESBY UNIVERSITY COLLEGE CAMPUS",  },
    { name: " Lady Ps Frimpomaa Agyei", title: "KNUST OBUASI CAMPUS",  },
    { name: " Lady Ps Doris Agyekum", title: "UCC DOMINASE CAMPUS",  },
  ];

const renderHierarchySection = (title, members, size = "normal", layout = "grid") => {
    const isLarge = size === 'large';
    const isCenteredPair = layout === 'centered-pair';
    const textSizeClass = isLarge ? 'text-lg' : 'text-lg';
    const subtitleClass = isLarge ? 'text-sm' : 'text-sm';
    const aspectClass = isLarge ? 'aspect-[3/4]' : 'aspect-[4/5]';

    // Make FOUNDERS cards match the smaller image proportions of the other cards
    const mediaRadius = isLarge ? 'rounded-[1.25rem]' : 'rounded-[1.5rem]';

    const sectionCols = isLarge ? 'grid-cols-1 sm:grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    const containerClass = isCenteredPair
      ? 'relative mx-auto flex flex-col gap-4 sm:max-w-[44rem] sm:flex-row sm:justify-center sm:items-stretch sm:gap-4'
      : `grid gap-8 ${sectionCols}`;

    return (
      <div className="mb-20 relative">
        <div className="mx-auto max-w-5xl text-center mb-10">
          <div className="inline-flex items-center justify-center gap-3 rounded-full border border-border/70 bg-white/80 px-6 py-2 shadow-card backdrop-blur-sm">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-foreground">{title}</span>
          </div>
        </div>

        {isCenteredPair ? (
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-400/15" />
        ) : null}

        <div className={containerClass}>
          {isCenteredPair ? (
            <>
              <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-slate-400/15" />
              <div className="pointer-events-none absolute top-1/2 left-1/2 h-5 w-px -translate-x-1/2 bg-slate-400/15" />
            </>
          ) : null}
          {members.map((member, idx) => {
            const hasPhoto = Boolean(member.photo);
            // Keep the subtle object-position tweak, but only when we actually have a photo.
            const objectPosStyle = title.includes('HOD') && hasPhoto && (idx === 0 || idx === 5) ? { objectPosition: 'center 25%' } : undefined;
            const cardClassName = isCenteredPair
              ? 'group relative mx-auto w-full max-w-[22rem] overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_70px_-20px_rgba(15,23,42,0.18)]'
              : 'group relative w-full overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_70px_-20px_rgba(15,23,42,0.18)]';

            return (
              <div
                key={idx}
                className={cardClassName}
              >
                <div className={`relative ${aspectClass} w-full`}>

                  {hasPhoto ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      style={objectPosStyle}
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-muted/60 to-background/40 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-2xl bg-white/60 border border-border/60 shadow-sm flex items-center justify-center">
                        <span className="text-xl">✦</span>
                      </div>
                    </div>
                  )}

                  {/* Caption panel */}
                  <div className="absolute inset-x-0 bottom-0 p-5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 ease-out">
                    <div className="rounded-2xl bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent border border-white/10 backdrop-blur-sm p-4 shadow-lg">
                      <h3 className={`font-semibold text-white ${textSizeClass} leading-snug`}>{member.name}</h3>
                      <p className={`${subtitleClass} text-slate-200/90 mt-2`}>{member.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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

        <div className="relative z-10 container mx-auto px-9 w-full flex justify-center">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/30 mb-6 hover:bg-white/25 transition-all duration-300">
              <span className="text-sm font-semibold text-cyan-200 uppercase tracking-[0.2em]">Our Leadership</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Meet the people leading our mission
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed opacity-95">
              Discover the leadership driving our ministry forward with faith, vision, and compassionate service.
            </p>
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
          <div className="relative space-y-20">
            <div className="absolute inset-y-0 left-1/2 w-px bg-slate-400/15" />
            {/* Founder & Wife - Extra Large */}
            {renderHierarchySection("FOUNDERS", founderAndWife, "normal", "centered-pair")}

            {/* Global Pastors */}
            {renderHierarchySection("GLOBAL PASTORS", globalAssociates, "normal")}

            {/* Global Secretariat */}
            {renderHierarchySection("GLOBAL SECRETARIAT", globalSecretariat, "normal", "centered-pair")}

            {/* HODs */}
            {renderHierarchySection("HEADS OF DEPARTMENTS (HODs)", hods, "normal")}

            {/* Resident Pastors */}
            {renderHierarchySection("RESIDENT PASTORS", residentPastors, "normal", "centered-pair")}

            {/* Campus Pastors */}
            {renderHierarchySection("CAMPUS PASTORS", campusPastors, "normal")}
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
