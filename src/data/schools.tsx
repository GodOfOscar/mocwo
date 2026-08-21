export type MediaItem = {
  type: "image" | "video";
  src: string;
};

export type School = {
  id: string;
  name: string;
  description: string;
  report: string;
  media: MediaItem[];
};

export const schools: School[] = [
  {
    id: "opoku",
    name: "Opoku Ware Senior High School",
    description: "A wonderful experience and time in the presence of God",
    report: `
      During our outreach at Opoku Ware Senior High School, 
      more than 1200 students gathered for a time of worship, 
      mentorship, and career guidance. 
      Many students expressed renewed hope for their future 
      and showed interest in STEM programs. 
      Teachers also noted a visible impact on discipline and motivation.
    `,
    media: [
      { type: "image", src: "/media/opoku/photo1.jpg" },
      { type: "image", src: "/media/opoku/photo2.jpg" },
      { type: "video", src: "https://www.youtube.com/watch?v=GUrlXQd132w&pp=ygUYcmV2IHByaW5jZSBiZWRpYWtvIGFwcGF1" },
    ],
  },
  {
    id: "prempeh",
    name: "Prempeh Senior High School",
    description: "A wonderful experience and time in the presence of God",
    report: `
      At Prempeh Senior High School, over 1850 students participated 
      in sessions that combined spiritual renewal and academic mentorship. 
      The program emphasized leadership, excellence, and responsibility. 
      Feedback from students showed a deep sense of encouragement 
      and commitment to their studies.
    `,
    media: [
      { type: "image", src: "/media/prempeh/photo1.jpg" },
      { type: "video", src: "https://www.youtube.com/watch?v=GUrlXQd132w&pp=ygUYcmV2IHByaW5jZSBiZWRpYWtvIGFwcGF1" },
      { type: "video", src: "https://www.youtube.com/watch?v=GUrlXQd132w&pp=ygUYcmV2IHByaW5jZSBiZWRpYWtvIGFwcGF1" },
      { type: "video", src: "https://www.youtube.com/watch?v=GUrlXQd132w&pp=ygUYcmV2IHByaW5jZSBiZWRpYWtvIGFwcGF1" },
      { type: "video", src: "https://www.youtube.com/watch?v=GUrlXQd132w&pp=ygUYcmV2IHByaW5jZSBiZWRpYWtvIGFwcGF1" },
    ],
  },
  {
    id: "stlouis",
    name: "St. Louis Senior High School",
    description: "A wonderful experience and time in the presence of God",
    report: `
      Our team engaged with 1600 students at St. Louis Senior High School. 
      The outreach focused on character building, academic discipline, 
      and spiritual growth. 
      Teachers reported that the sessions boosted morale 
      and inspired students to embrace both faith and education.
    `,
    media: [
      { type: "image", src: "/media/stlouis/photo1.jpg" },
      { type: "image", src: "/media/stlouis/photo2.jpg" },
    ],
  },
  {
    id: "wesleygirls",
    name: "Kumasi Wesley Girls Senior High School",
    description: "A wonderful experience and time in the presence of God",
    report: `
      At Kumasi Wesley Girls, we met over 2400 students 
      in an atmosphere filled with worship and impactful teaching. 
      Many young women were inspired to pursue careers in STEM fields 
      while holding firm to Christian values. 
      Staff testified that the program left a lasting impression.
    `,
    media: [
      { type: "image", src: "/media/wesleygirls/photo1.jpg" },
      { type: "video", src: "/media/wesleygirls/video1.mp4" },
    ],
  },
  {
    id: "kumasacademy",
    name: "Kumasi Academy Senior High School",
    description: "A wonderful experience and time in the presence of God",
    report: `
      Kumasi Academy welcomed us warmly with 1600 students present. 
      The focus was on personal discipline, teamwork, and spiritual growth. 
      Several students shared testimonies of how the sessions 
      encouraged them to develop both academically and spiritually.
    `,
    media: [
      { type: "image", src: "/media/kumasacademy/photo1.jpg" },
    ],
  },
  {
    id: "presec",
    name: "Presbyterian Boys Senior High School (PRESEC)",
    description: "A wonderful experience and time in the presence of God",
    report: `
      Our outreach at PRESEC, with more than 3400 students, 
      was one of the largest. 
      We held multiple sessions on leadership, faith, and science, 
      motivating students to aim high in academics 
      while staying rooted in Christian values. 
      The impact was evident in the lively participation and feedback.
    `,
    media: [
      { type: "image", src: "/media/presec/photo1.jpg" },
      { type: "video", src: "/media/presec/video1.mp4" },
    ],
  },
  {
    id: "serwaa",
    name: "Serwaa Nyarko Senior High School",
    description: "A wonderful experience and time in the presence of God",
    report: `
      Serwaa Nyarko SHS, with 1800 students, experienced a powerful time 
      of worship and mentorship. 
      The sessions emphasized character development and resilience. 
      Students left motivated to pursue excellence 
      and to impact their communities positively.
    `,
    media: [
      { type: "image", src: "/media/serwaa/photo1.jpg" },
    ],
  },
  {
    id: "armedforces",
    name: "Armed Forces Senior High School",
    description: "A wonderful experience and time in the presence of God",
    report: `
      At Armed Forces SHS, over 1800 students participated 
      in an outreach program that focused on discipline, faith, 
      and leadership. 
      The school environment was energized, and many students 
      pledged to take their education and spiritual lives more seriously.
    `,
    media: [
      { type: "image", src: "/media/armedforces/photo1.jpg" },
      { type: "video", src: "/media/armedforces/video1.mp4" },
    ],
  },
  {
    id: "mfantsipim",
    name: "Mfantsipim Senior High School",
    description: "A wonderful experience and time in the presence of God",
    report: `
      At Mfantsipim SHS, nearly 1900 students attended our sessions. 
      The program combined mentorship, worship, and career guidance. 
      Students were inspired to excel in STEM fields 
      and to lead lives of integrity. 
      The outreach strengthened our relationship with the school community.
    `,
    media: [
      { type: "image", src: "/media/mfantsipim/photo1.jpg" },
      { type: "image", src: "/media/mfantsipim/photo2.jpg" },
    ],
  },
  // Generic media collections for site-wide media pages
  {
    id: "sunday-service",
    name: "Sunday Service Highlights",
    description: "Highlights from our Sunday services — worship, sermons, and testimonies.",
    report: "",
    media: [
      { type: "image", src: "/media/sunday/a (1).jpeg" },
      { type: "image", src: "/media/sunday/a (17).jpeg" },
      { type: "image", src: "/media/sunday/a (18).jpeg" },
      { type: "image", src: "/media/sunday/a (19).jpeg" },
      { type: "image", src: "/media/sunday/a (20).jpeg" },
      { type: "image", src: "/media/sunday/a (21).jpeg" },
      { type: "image", src: "/media/sunday/a (22).jpeg" },
      { type: "image", src: "/media/sunday/a (23).jpeg" },
      { type: "image", src: "/media/sunday/a (24).jpeg" },
      { type: "image", src: "/media/sunday/a (25).jpeg" },
      { type: "image", src: "/media/sunday/a (26).jpeg" },
      { type: "image", src: "/media/sunday/a (27).jpeg" },
      { type: "image", src: "/media/sunday/a (28).jpeg" },
      { type: "image", src: "/media/sunday/a (29).jpeg" },
      { type: "image", src: "/media/sunday/a (30).jpeg" },
      { type: "image", src: "/media/sunday/a (31).jpeg" },
    ],
  },
  {
    id: "watch-night",
    name: "Watch Night Highlights",
    description: "Powerful moments from our watch night services.",
    report: "",
    media: [
      { type: "image", src: "/media/watch-night/b (27).jpeg" },
      { type: "image", src: "/media/watch-night/b (28).jpeg" },
      { type: "image", src: "/media/watch-night/b (29).jpeg" },
      { type: "image", src: "/media/watch-night/b (30).jpeg" },
      { type: "image", src: "/media/watch-night/b (31).jpeg" },
      { type: "image", src: "/media/watch-night/b (32).jpeg" },
      { type: "image", src: "/media/watch-night/b (33).jpeg" },
      { type: "image", src: "/media/watch-night/b (34).jpeg" },
      { type: "image", src: "/media/watch-night/b (35).jpeg" },
      { type: "image", src: "/media/watch-night/b (36).jpeg" },
      { type: "image", src: "/media/watch-night/b (37).jpeg" },
      { type: "image", src: "/media/watch-night/b (38).jpeg" },
      { type: "image", src: "/media/watch-night/b (39).jpeg" },
      { type: "image", src: "/media/watch-night/b (40).jpeg" },
      { type: "image", src: "/media/watch-night/b (41).jpeg" },
      { type: "image", src: "/media/watch-night/b (42).jpeg" },
      { type: "image", src: "/media/watch-night/b (43).jpeg" },
      { type: "image", src: "/media/watch-night/b (44).jpeg" },
      { type: "image", src: "/media/watch-night/b (45).jpeg" },
      { type: "image", src: "/media/watch-night/b (46).jpeg" },
      { type: "image", src: "/media/watch-night/b (47).jpeg" },
      { type: "image", src: "/media/watch-night/b (48).jpeg" },
      { type: "image", src: "/media/watch-night/b (49).jpeg" },
      { type: "image", src: "/media/watch-night/b (50).jpeg" },
      { type: "image", src: "/media/watch-night/b (51).jpeg" },
      { type: "image", src: "/media/watch-night/b (52).jpeg" },
      { type: "image", src: "/media/watch-night/b (53).jpeg" },
      { type: "image", src: "/media/watch-night/b (54).jpeg" },
      { type: "image", src: "/media/watch-night/b (55).jpeg" },
      { type: "image", src: "/media/watch-night/b (56).jpeg" },
      { type: "image", src: "/media/watch-night/b (57).jpeg" },
      { type: "image", src: "/media/watch-night/b (58).jpeg" },
      { type: "image", src: "/media/watch-night/b (59).jpeg" },
      { type: "image", src: "/media/watch-night/b (60).jpeg" },
      { type: "image", src: "/media/watch-night/b (61).jpeg" },
      { type: "image", src: "/media/watch-night/b (62).jpeg" },
      { type: "image", src: "/media/watch-night/b (63).jpeg" },
      { type: "image", src: "/media/watch-night/b (64).jpeg" },
      { type: "image", src: "/media/watch-night/b.jpeg" },
    ],
  },
  {
    id: "atwea-camps",
    name: "Atwea Camps",
    description: "Images and videos from our Atwea camps and outreach programs.",
    report: "",
    media: [
      { type: "image", src: "/media/atwea-camps/c (1).jpeg" },
      { type: "image", src: "/media/atwea-camps/c (2).jpeg" },
      { type: "image", src: "/media/atwea-camps/c (3).jpeg" },
      { type: "image", src: "/media/atwea-camps/c (4).jpeg" },
      { type: "image", src: "/media/atwea-camps/c (5).jpeg" },
      { type: "image", src: "/media/atwea-camps/c (6).jpeg" },
      { type: "image", src: "/media/atwea-camps/c (7).jpeg" },
      { type: "image", src: "/media/atwea-camps/c (8).jpeg" },
      { type: "image", src: "/media/atwea-camps/c (9).jpeg" },
      { type: "image", src: "/media/atwea-camps/c (10).jpeg" },
      { type: "image", src: "/media/atwea-camps/c (11).jpeg" },
      { type: "image", src: "/media/atwea-camps/c (12).jpeg" },
      { type: "image", src: "/media/atwea-camps/c (13).jpeg" },
      { type: "image", src: "/media/atwea-camps/c (14).jpeg" },
      { type: "image", src: "/media/atwea-camps/c (15).jpeg" },
    ],
  },
  {
    id: "others",
    name: "Other Media",
    description: "Additional photos and videos from various events and programs.",
    report: "",
    media: [
      { type: "image", src: "/media/others/1 (2).jpeg" },
      { type: "image", src: "/media/others/d (1).jpeg" },
      { type: "image", src: "/media/others/d (2).jpeg" },
      { type: "image", src: "/media/others/d (3).jpeg" },
      { type: "image", src: "/media/others/d (4).jpeg" },
      { type: "image", src: "/media/others/d (5).jpeg" },
      { type: "image", src: "/media/others/d (6).jpeg" },
      { type: "image", src: "/media/others/d (7).jpeg" },
      { type: "image", src: "/media/others/d (8).jpeg" },
      { type: "image", src: "/media/others/d (9).jpeg" },
      { type: "image", src: "/media/others/d (10).jpeg" },
      { type: "image", src: "/media/others/d (11).jpeg" },
      { type: "image", src: "/media/others/d (12).jpeg" },
      { type: "image", src: "/media/others/d (13).jpeg" },
      { type: "image", src: "/media/others/d (14).jpeg" },
      { type: "image", src: "/media/others/d (15).jpeg" },
      { type: "image", src: "/media/others/d (16).jpeg" },
      { type: "image", src: "/media/others/d (17).jpeg" },
      { type: "image", src: "/media/others/d (18).jpeg" },
      { type: "image", src: "/media/others/d (19).jpeg" },
      { type: "image", src: "/media/others/d (20).jpeg" },
      { type: "image", src: "/media/others/d (21).jpeg" },
      { type: "image", src: "/media/others/d (22).jpeg" },
      { type: "image", src: "/media/others/d (23).jpeg" },
      { type: "image", src: "/media/others/d (24).jpeg" },
      { type: "image", src: "/media/others/d (25).jpeg" },
      { type: "image", src: "/media/others/d (26).jpeg" },
    ],
  },
];
