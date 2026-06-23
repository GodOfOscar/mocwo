// src/data/news.ts
import hero1 from "@/assets/hero1.jpeg";
import hero2 from "@/assets/hero2.jpeg";
import hero3 from "@/assets/hero3.jpeg";
import pneuma1 from "@/assets/pnuema1.png";

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  link: string;
  content?: string;
  images?: string[];
  videos?: string[];
  category?: string;
  author?: string;
  readTime?: string;
}

export const news: NewsItem[] = [
  {
    id: 1,
    title: "Higisa Gadola - The Great Encounter",
    excerpt:
      "Join us for a powerful encounter with God from December 20-24. Experience revival, transformation, and the presence of the Holy Spirit.",
    date: "Dec 20-24, 2025",
    image: hero1,
    link: "/news/higisa-gadola",
    category: "Event",
    author: "MOCWO Team",
    readTime: "3 min read",
    content: `
      <p>Join us for <strong>Higisa Gadola - The Great Encounter</strong>, a transformative gathering from December 20-24, 2025. This powerful event brings together believers from across the nation for an unprecedented encounter with the living God.</p>
      
      <h3>What to Expect</h3>
      <ul>
        <li>Daily worship sessions led by anointed ministers</li>
        <li>Powerful prayer meetings and intercession</li>
        <li>Life-changing prophetic ministrations</li>
        <li>Divine healing and deliverance services</li>
        <li>Fellowship and networking opportunities</li>
      </ul>
      
      <h3>Special Highlights</h3>
      <p>Experience the presence of God like never before as we gather for this season of revival and transformation. Our guest speakers include renowned ministers and prophets who will bring fresh revelation and divine encounters.</p>
      
      <h3>Registration</h3>
      <p>Early bird registration is now open. Don't miss this opportunity to be part of what God is doing in our generation.</p>
    `,
    images: [hero1, hero2, hero3],
    videos: []
  },
  {
    id: 2,
    title: "Rev. Prince's 20 Years Anniversary",
    excerpt:
      "Celebrate two decades of apostolic ministry. Honor the faithful service of Rev. Prince Bediako Appau in spreading the gospel.",
    date: "Dec 21, 2025",
    image: hero2,
    link: "/news/rev-prince-anniversary",
    category: "Celebration",
    author: "MOCWO Communications",
    readTime: "4 min read",
    content: `
      <p>Mark your calendars for <strong>December 21, 2025</strong> as we celebrate two decades of apostolic ministry and divine calling with Rev. Prince Bediako Appau.</p>
      
      <h3>A Journey of Faith</h3>
      <p>Rev. Prince Bediako Appau has faithfully served God's kingdom for 20 years, establishing churches, training leaders, and impacting countless lives across Ghana and beyond. His ministry has been characterized by unwavering commitment to the Great Commission and a passion for raising kingdom disciples.</p>
      
      <h3>Celebration Program</h3>
      <ul>
        <li>Special thanksgiving service</li>
        <li>Testimonies from transformed lives</li>
        <li>Recognition of ministry partners</li>
        <li>Cultural performances and celebrations</li>
        <li>Special anniversary message from Rev. Prince</li>
      </ul>
      
      <h3>Join the Celebration</h3>
      <p>This is not just an anniversary; it's a testimony of God's faithfulness and a celebration of what He has accomplished through one man's obedience. Join us as we honor 20 years of ministry and look forward to greater things ahead.</p>
    `,
    images: [hero2, hero1],
    videos: []
  },
  {
    id: 3,
    title: "Pneumatikos Watch Night - A Night of Spirit Fire and Revival",
    excerpt:
      "Join us in June 2026 at the CCB Auditorium for an unforgettable night of worship, prayer, and revival with the power of the Holy Spirit.",
    date: "Jun, 2026",
    image: pneuma1,
    link: "/news/pneumatikos-watch-night",
    category: "Event",
    author: "MOCWO Events Team",
    readTime: "3 min read",
    content: `
      <p>Get ready for <strong>Pneumatikos Watch Night</strong> - A Night of Spirit Fire and Revival! Join us in June 2026 at the CCB Auditorium for an unforgettable night of worship, prayer, and revival.</p>
      
      <h3>Experience the Fire</h3>
      <p>This special watch night service is designed to usher in the power and presence of the Holy Spirit. As we gather in prayer and worship, expect to encounter God's fire that brings revival, renewal, and restoration.</p>
      
      <h3>Program Highlights</h3>
      <ul>
        <li>All-night prayer and intercession</li>
        <li>Powerful worship led by anointed musicians</li>
        <li>Prophetic ministrations and words of knowledge</li>
        <li>Tarrying for the Holy Spirit baptism</li>
        <li>Corporate prayer for revival in the nation</li>
      </ul>
      
      <h3>Preparation</h3>
      <p>Come prepared with a heart of expectation and readiness to receive from God. Bring your Bible, notebook, and a vessel ready to be filled with fresh oil from heaven.</p>
      
      <h3>Location & Time</h3>
      <p><strong>Venue:</strong> CCB Auditorium<br>
      <strong>Date:</strong> June 2026 (Exact date to be announced)<br>
      <strong>Time:</strong> 10:00 PM - 6:00 AM</p>
    `,
    images: [pneuma1, hero1],
    videos: []
  },
  {
    id: 4,
    title: "Atwea Easter Camp - A Season of Renewal",
    excerpt:
      "Experience an incredible Easter season at the Atwea Camp. Join for discipleship, fellowship, worship, and spiritual growth.",
    date: "Easter 2026",
    image: hero1,
    link: "/news/atwea-easter-camp",
    category: "Camp",
    author: "MOCWO Youth Ministry",
    readTime: "5 min read",
    content: `
      <p>Prepare for a life-transforming experience at the <strong>Atwea Easter Camp 2026</strong> - A Season of Renewal! Join us for an incredible Easter season filled with discipleship, fellowship, worship, and spiritual growth.</p>
      
      <h3>Camp Theme: Resurrection Power</h3>
      <p>This year's camp focuses on experiencing the resurrection power of Jesus Christ in our daily lives. Just as Christ conquered death, we too can overcome every challenge through His resurrection power.</p>
      
      <h3>Daily Program</h3>
      <ul>
        <li>Morning devotion and worship</li>
        <li>Bible study and teaching sessions</li>
        <li>Prayer and intercession meetings</li>
        <li>Group discussions and fellowship</li>
        <li>Recreational activities and games</li>
        <li>Evening worship and ministry time</li>
      </ul>
      
      <h3>Special Features</h3>
      <ul>
        <li>Guest speakers and ministers</li>
        <li>Youth-led worship sessions</li>
        <li>Outdoor activities and nature walks</li>
        <li>Creative workshops and seminars</li>
        <li>Campfire fellowship and sharing</li>
      </ul>
      
      <h3>Registration & Accommodation</h3>
      <p>Early registration is encouraged. Accommodation is available for all participants. Contact the youth ministry office for registration details and camp fees.</p>
      
      <p>Don't miss this opportunity to deepen your relationship with God and connect with fellow believers in a beautiful camp setting!</p>
    `,
    images: [hero1, hero2, hero3],
    videos: []
  },
  {
    id: 5,
    title: "Church Hosts Citywide Outreach",
    excerpt:
      "Hundreds joined the initiative as the church reached into underserved neighborhoods with food, prayer, and practical help.",
    date: "Dec 10, 2025",
    image: hero1,
    link: "/news/city-outreach",
  },
  {
    id: 6,
    title: "Youth Conference 2025 Recap",
    excerpt:
      "A powerful three-day gathering where young people encountered transformational teaching and community.",
    date: "Nov 28, 2025",
    image: hero2,
    link: "/news/youth-conference-2025",
  },
  {
    id: 7,
    title: "Partnership Drive: Join Us",
    excerpt:
      "Learn how partnering with us helps fund missions, discipleship, and local outreach projects.",
    date: "Oct 15, 2025",
    image: hero3,
    link: "/news/partnership-drive",
  },
];
