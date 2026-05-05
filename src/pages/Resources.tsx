import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Book, Play, Download, Headphones, Mail, Phone, MapPin, Facebook, Instagram, Youtube, X } from "lucide-react";
import { useState } from "react";

const Resources = () => {
  const resourceCategories = [
    { title: "Sermons", description: "Life-changing messages from our weekly services", icon: Play, gradient: "from-blue-700 to-cyan-500", link: "/resources/sermons" },
    { title: "Books", description: "Spiritual literature for growth and inspiration", icon: Book, gradient: "from-blue-600 to-blue-400", link: "/resources/books" },
    { title: "Podcasts", description: "On-the-go inspiration for your daily journey", icon: Headphones, gradient: "from-cyan-500 to-blue-400", link: "/resources/podcasts" },
    { title: "Downloads", description: "Study guides, worksheets, and digital content", icon: Download, gradient: "from-blue-800 to-cyan-600", link: "/resources/downloads" }
  ];

 const featuredSermons = [
  { 
    title: "The Power of Faith", 
    speaker: "Rev. Prince Appau Bediako", 
    date: "March 15, 2024", 
    duration: "45 min", 
    image: "🎬",
    videoLink: "https://www.youtube.com/watch?v=CuSjTgJV_lA"
  },
  { 
    title: "Walking in Purpose", 
    speaker: "Rev. Prince Appau Bediako", 
    date: "March 8, 2024", 
    duration: "52 min", 
    image: "🎬",
    videoLink: "https://www.youtube.com/watch?v=JtdKbMrPwqQ"
  },
  { 
    title: "Kingdom Principles", 
    speaker: "Rev. Prince Appau Bediako", 
    date: "March 1, 2024", 
    duration: "48 min", 
    image: "🎬",
    videoLink: "https://www.youtube.com/watch?v=cJU6wW5Veo8"
  }
];

  const featuredBooks = [
    { title: "Prophetic Breakthrough", author: "Rev. Prince Appau Bediako", description: "Discover the power of prophetic ministry in your life", price: "$15.99", image: "📚" },
    { title: "Faith That Moves Mountains", author: "Rev. Prince Appau Bediako", description: "Build unshakeable faith for impossible situations", price: "$12.99", image: "📚" },
    { title: "The Believer's Authority", author: "Rev. Prince Appau Bediako", description: "Understanding your position in Christ", price: "$18.99", image: "📚" }
  ];

  const dailyDevotionals = [
    { 
      month: "January", 
      shortMonth: "Jan",
      theme: "New Beginnings",
      devotions: "31 daily devotions on starting fresh with God",
      bgColor: "from-blue-600 to-blue-400",
      days: 31,
      dailyThemes: [
        { day: 1, title: "Fresh Start", scripture: "2 Corinthians 5:17", text: "Therefore, if anyone is in Christ, he is a new creation; old things have passed away" },
        { day: 2, title: "New Mercies", scripture: "Lamentations 3:22-23", text: "Because of the Lord's great love we are not consumed, for his compassions never fail" },
        { day: 3, title: "God's Faithfulness", scripture: "Psalm 25:10", text: "All the ways of the Lord are loving and faithful for those who keep his covenant" },
        { day: 4, title: "Direction From God", scripture: "Proverbs 3:5-6", text: "Trust in the Lord with all your heart and lean not on your own understanding" },
        { day: 5, title: "Strength Renewed", scripture: "Isaiah 40:31", text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles" },
        { day: 6, title: "Purpose In Him", scripture: "Philippians 2:13", text: "For it is God who works in you to will and to act in order to fulfill his good purpose" },
        { day: 7, title: "Rest In Him", scripture: "Matthew 11:28", text: "Come to me, all you who are weary and burdened, and I will give you rest" },
        { day: 8, title: "Hope Anchored", scripture: "Hebrews 6:19", text: "We have this hope as an anchor for the soul, firm and secure" },
        { day: 9, title: "Living Water", scripture: "John 7:38", text: "Whoever believes in me, as Scripture has said, rivers of living water will flow from within them" },
        { day: 10, title: "Transformed Mind", scripture: "Romans 12:2", text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind" },
        { day: 11, title: "God Walks With Us", scripture: "Deuteronomy 31:8", text: "The Lord himself goes before you and will be with you; he will never leave you nor forsake you" },
        { day: 12, title: "Seeds of Faith", scripture: "Mark 4:26-27", text: "This is what the kingdom of God is like: A man scatters seed on the ground" },
        { day: 13, title: "Boldness In Christ", scripture: "Acts 4:29", text: "Now, Lord, consider their threats and enable your servants to speak your word with great boldness" },
        { day: 14, title: "Love Perfected", scripture: "1 John 4:18", text: "Perfect love drives out fear, because fear has to do with punishment" },
        { day: 15, title: "Mountain Moving", scripture: "Matthew 21:22", text: "If you believe, you will receive all you ask for in prayer" },
        { day: 16, title: "Pressed But Not Crushed", scripture: "2 Corinthians 4:8-9", text: "We are hard pressed on all sides, yet not crushed; perplexed, but not in despair" },
        { day: 17, title: "Victory Through Him", scripture: "1 Corinthians 15:57", text: "But thanks be to God, who gives us the victory through our Lord Jesus Christ" },
        { day: 18, title: "Beloved Sons", scripture: "1 John 3:1", text: "See what great love the Father has lavished on us, that we should be called children of God" },
        { day: 19, title: "Every Good Work", scripture: "Philippians 1:6", text: "Being confident of this, that he who began a good work in you will carry it on to completion" },
        { day: 20, title: "Boundless Grace", scripture: "Romans 5:20", text: "Where sin increased, grace increased all the more" },
        { day: 21, title: "Walking In Light", scripture: "1 John 1:7", text: "But if we walk in the light, as he is in the light, we have fellowship with one another" },
        { day: 22, title: "Strength In Weakness", scripture: "2 Corinthians 12:9", text: "My grace is sufficient for you, for my power is made perfect in weakness" },
        { day: 23, title: "Abundant Life", scripture: "John 10:10", text: "I have come that they may have life, and have it to the full" },
        { day: 24, title: "Eternal Perspective", scripture: "2 Corinthians 4:17", text: "For our light and momentary troubles are achieving for us an eternal glory that far outweighs them all" },
        { day: 25, title: "Rooted In Christ", scripture: "Colossians 2:7", text: "Rooted and built up in him, strengthened in the faith as you were taught, and overflowing with thankfulness" },
        { day: 26, title: "Living Sacrifice", scripture: "Romans 12:1", text: "Offer your bodies as a living sacrifice, holy and pleasing to God—this is your true and proper worship" },
        { day: 27, title: "Peace That Surpasses", scripture: "Philippians 4:7", text: "And the peace of God, which transcends all understanding, will guard your hearts and your minds" },
        { day: 28, title: "Compassion Renewed", scripture: "Colossians 3:12", text: "Therefore, as God's chosen people, clothe yourselves with compassion, kindness, humility, gentleness" },
        { day: 29, title: "Joy In Service", scripture: "Nehemiah 8:10", text: "The joy of the Lord is your strength" },
        { day: 30, title: "Faithful Yesterday, Today, Forever", scripture: "Hebrews 13:8", text: "Jesus Christ is the same yesterday and today and forever" },
        { day: 31, title: "Carried By His Power", scripture: "Isaiah 46:4", text: "Even to your old age and gray hairs I am he, I am he who will sustain you" }
      ]
    },
    { 
      month: "February", 
      shortMonth: "Feb",
      theme: "Love & Compassion",
      devotions: "28 daily devotions on Christ's love",
      bgColor: "from-red-600 to-red-400",
      days: 28,
      dailyThemes: Array.from({ length: 28 }, (_, i) => ({
        day: i + 1,
        title: ["Love Defined", "Unconditional Grace", "Compassionate Heart", "Mercy Extended", "Love Never Fails", "Forgive As You're Forgiven", "Love One Another", "Sacrifice Of Love", "Love Covers Sin", "Perfect Love", "Love Your Enemies", "Giving Love", "Love Endures", "Compassion Like Jesus", "Love Conquers", "Love Unites", "Free To Love", "Love's Power", "Faithful Love", "Love Transforms", "Love Speaks", "Love Acts", "Love Heals", "Love Included", "Love Protects", "Love Restores", "Love's Victory", "Love Eternal"][i],
        scripture: ["1 John 4:8", "Romans 3:24", "1 Peter 3:8", "Colossians 3:13", "1 Corinthians 13:4", "Mark 11:25", "John 13:34", "John 15:13", "1 Peter 4:8", "1 John 4:18", "Matthew 5:44", "2 Corinthians 9:7", "1 Corinthians 13:8", "John 11:36", "Romans 8:38-39", "1 Peter 4:10", "Galatians 5:13", "1 John 3:18", "Psalm 86:15", "2 Corinthians 5:14", "Proverbs 10:12", "James 2:26", "1 Thessalonians 5:11", "Ephesians 4:2", "Proverbs 22:3", "Hosea 11:8", "1 Corinthians 15:57", "Revelation 3:9"][i],
        text: ["God is love. Whoever lives in love lives in God, and God in them.", "...through his grace he freely made us acceptable to him.", "Be like-minded, be sympathetic, love one another, be compassionate and humble.", "Bear with each other and forgive one another if any of you has a grievance against someone.", "Love is patient, love is kind. It does not envy, it does not boast...", "And when you stand praying, if you hold anything against anyone, forgive them.", "Love one another. As I have loved you, so you must love one another.", "Greater love has no one than this: to lay down one's life for one's friends.", "Above all, love each other deeply, because love covers a multitude of sins.", "Perfect love drives out fear, because fear has to do with punishment.", "But I tell you, love your enemies and pray for those who persecute you.", "God loves a cheerful giver.", "Love never fails. But where there are prophecies, they will cease...", "See how much the Father has loved us by letting us be called his children!", "For I am convinced that neither death nor life can separate us from God's love.", "Each of you should use whatever gift you have received to serve others.", "You, my brothers and sisters, were called to be free. But do not use your freedom to indulge the flesh.", "Dear children, let us not love with words or speech but with actions and in truth.", "The Lord is compassionate and gracious, slow to anger, abounding in love.", "For Christ's love compels us, because we are convinced that one died for all.", "Whoever deems himself to be religious, yet does not bridle his tongue, deceives himself.", "Faith without deeds is dead.", "Therefore encourage one another and build each other up, just as in fact you are doing.", "Be completely humble and gentle; be patient, bearing with one another in love.", "The prudent see danger and take refuge, but the simple keep going and pay the penalty.", "My heart yearns for Ephraim, though I have often spoken against him.", "But thanks be to God, who gives us the victory through our Lord Jesus Christ.", "I am coming soon. Hold on to what you have, so that no one will take your crown."][i]
      }))
    },
    { 
      month: "March", 
      shortMonth: "Mar",
      theme: "Praying With The Word",
      devotions: "31 daily devotions on Scripture-anchored prayer",
      bgColor: "from-cyan-600 to-cyan-400",
      days: 31,
      dailyThemes: Array.from({ length: 31 }, (_, i) => ({
        day: i + 1,
        title: ["Prayer Anchored", "Scripture Shapes Prayer", "Word-Filled Seeking", "Prayer For Strength", "Intercessory Prayer", "Prayers Of Praise", "Confessing Through Scripture", "Submission In Prayer", "Faith-Filled Petitions", "Prayer For Others", "Gratitude In Prayer", "Prayer's Power", "Wrestling In Prayer", "Prayer For Wisdom", "Persistent Prayer", "United In Prayer", "Prayer Transformation", "Sacred Listening", "Prayer For Healing", "Midnight Prayers", "Prayer Declares", "Word Alive In Prayer", "Prayers From Psalms", "Prayer For Direction", "Bold Asking", "Prayer Community", "Corporate Intercession", "Prayers That Move God", "Prayer Authority", "Prayer For Nations", "Prayer's Victory"][i],
        scripture: ["John 15:7", "Psalm 119:97", "Proverbs 8:11", "Psalm 27:10", "1 Timothy 2:1", "Psalm 100:1", "Psalm 32:5", "James 4:7", "Mark 11:24", "Colossians 1:9", "Philippians 4:6", "James 5:16", "Genesis 32:24-29", "James 1:5", "Luke 18:1", "Matthew 18:19", "Psalm 23:1", "Habakkuk 2:1", "James 5:14-15", "Psalm 119:148", "Proverbs 23:7", "Hebrews 4:12", "Psalm 42:1", "Proverbs 3:5-6", "Luke 11:9", "Acts 1:14", "2 Chronicles 7:14", "Isaiah 62:6-7", "Luke 10:19", "1 Timothy 2:2", "Revelation 12:11"][i],
        text: ["If you remain in me and my words remain in you, ask whatever you wish, and it will be done for you.", "Oh, how I love your law! I meditate on it all day long.", "Blessed are those who find wisdom, those who gain understanding.", "When my father and mother forsake me, the Lord will receive me.", "I urge, then, first of all, that petitions, prayers, intercession and thanksgiving be made for all people.", "Shout for joy to the Lord, all the earth.", "Then I acknowledged my sin to you and did not cover up my iniquity.", "Submit yourselves, then, to God. Resist the devil, and he will flee from you.", "Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours.", "We have not stopped praying for you and asking God to fill you with the knowledge of his will.", "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", "The prayer of a righteous person is powerful and effective.", "So Jacob was left alone, and a man wrestled with him till daybreak.", "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault.", "Then Jesus told his disciples a parable to show them that they should always pray and not give up.", "Again, I tell you that if two of you on earth agree about anything they ask for, it will be done for them by my Father in heaven.", "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me.", "I will stand at my watch and station myself on the ramparts; I will look to see what he will say to me.", "Is anyone among you sick? Let them call the elders of the church to pray over them and anoint them with oil in the name of the Lord.", "My eyes stay open through the watches of the night, that I may meditate on your promises.", "For as a man thinks in his heart, so is he.", "For the word of God is alive and active. Sharper than any double-edged sword, it penetrates even to dividing soul and spirit.", "As the deer pants for streams of water, so my soul pants for you, my God.", "Trust in the Lord with all your heart and lean not on your own understanding.", "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.", "When they heard this, they raised their voices together in prayer to God.", "If my people, who are called by my name, will humble themselves and pray and seek my face and turn from their wicked ways.", "I have posted watchmen on your walls, O Jerusalem; they will never be silent day or night.", "I have given you authority to trample on snakes and scorpions and to overcome all the power of the enemy.", "I urge you, first of all, to pray for all people. Ask God to help them; intercede on their behalf, and give thanks for them.", "They triumphed over him by the blood of the Lamb and by the word of their testimony."][i]
      }))
    },
    { 
      month: "April", 
      shortMonth: "Apr",
      theme: "Resurrection Power",
      devotions: "30 daily devotions on Easter's hope",
      bgColor: "from-emerald-600 to-emerald-400",
      days: 30,
      dailyThemes: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        title: ["Risen With Him", "New Life Begins", "Defeated Death", "Hope Eternal", "Empty Tomb", "Life From Death", "Victory Over Sin", "Resurrection Glory", "Living Stone", "Alive In Christ", "Power To Rise", "Easter Joy", "Resurrection Spirit", "Changed Forever", "Living Proof", "Restored To Life", "Resurrection Love", "Risen Lord", "New Creation", "Life Abundant", "Resurrection Hope", "Living Testament", "Risen Savior", "Easter Victory", "Daily Resurrection", "Resurrection Reality", "New Beginning", "Forever Living", "Resurrection Strength", "Eternal Life"][i],
        scripture: ["Colossians 3:1", "Romans 6:9", "1 Corinthians 15:57", "1 Peter 1:3-4", "Matthew 28:5-6", "John 5:24", "Romans 6:5", "Philippians 3:10", "1 Peter 2:4", "Galatians 2:20", "Ephesians 1:20", "John 11:25-26", "Romans 6:11", "2 Corinthians 5:17", "1 John 1:2", "Colossians 1:18", "1 John 3:1", "Revelation 1:18", "2 Corinthians 5:15", "John 10:10", "Titus 3:7", "1 Thessalonians 4:14", "Mark 16:6", "1 Peter 1:21", "Romans 6:8-9", "Luke 24:5-6", "Revelation 21:5", "John 6:40", "Ephesians 3:20", "John 3:16"][i],
        text: ["Since, then, you have been raised with Christ, set your hearts on things above.", "For this reason Christ died and returned to life so that he might be the Lord of both the dead and the living.", "But thanks be to God, who gives us the victory through our Lord Jesus Christ.", "Praise be to the God and Father of our Lord Jesus Christ! In his great mercy he has given us new birth into a living hope.", "The angel said to the women, 'Do not be afraid, for I know that you are looking for Jesus... he has risen.'", "Very truly I tell you, whoever hears my word and believes him who sent me has eternal life.", "And if we have been united with him in his death, we will certainly also be united with him in a resurrection like his.", "I want to know Christ—yes, to know the power of his resurrection.", "As you come to him, the living Stone—rejected by humans but chosen by God.", "I have been crucified with Christ and I no longer live, but Christ lives in me.", "I pray that the eyes of your heart may be enlightened in order that you may know... his mighty power for us who believe.", "Jesus said to her, 'I am the resurrection and the life. The one who believes in me will live, even though they die.'", "In the same way, count yourselves dead to sin but alive to God in Christ Jesus.", "Therefore, if anyone is in Christ, he is a new creation; the old has gone, the new is here!", "The life appeared; we have seen it and testify to it, and we proclaim to you the eternal life.", "He is the beginning and the firstborn from among the dead, so that in everything he might have the supremacy.", "See what great love the Father has lavished on us, that we should be called children of God!", "I am the Living One; I was dead, and now look, I am alive for ever and ever!", "And he died for all, that those who live should no longer live for themselves but for him who died for them.", "The thief comes only to steal and kill and destroy; I have come that they may have life, to the full.", "He saved us, not on the basis of deeds which we have done in righteousness, but according to His mercy.", "For if we believe that Jesus died and rose again, even so God will bring with Him those who have fallen asleep in Jesus.", "He is not here; he has risen, just as he said!", "And if the Spirit of him who raised Jesus from the dead is living in you, he who raised Christ from the dead will also give life to your mortal bodies.", "But Christ has indeed been raised from the dead, the firstfruits of those who have died.", "Jesus said to them again, 'Peace be with you! As the Father has sent me, I am sending you.'", "And I heard a loud voice from the throne saying, 'Look! God's dwelling place is now among the people!'", "For as the Father raises the dead and gives them life, even so the Son gives life to whom he is pleased to give it.", "Now to him who is able to do immeasurably more than all we ask or imagine, according to his power that is at work within us.", "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."][i]
      }))
    },
    { 
      month: "May", 
      shortMonth: "May",
      theme: "Spiritual Growth",
      devotions: "31 daily devotions on becoming mature in Christ",
      bgColor: "from-purple-600 to-purple-400",
      days: 31,
      dailyThemes: Array.from({ length: 31 }, (_, i) => ({
        day: i + 1,
        title: ["Growing In Grace", "Maturity In Christ", "Spiritual Depth", "Fruit Bearing", "Rooted Deep", "Building Strong", "Becoming Whole", "Faith Development", "Character Growth", "Strengthening", "Pressing Forward", "Growing Roots", "Branches Extended", "Tree Of Life", "Abundant Harvest", "Spiritual Seasons", "Growing Bold", "Faith Increases", "Mature Love", "Complete In Him", "Growing Faith", "Evidence Of Growth", "Developed Spirit", "Solid Foundation", "Growth In Knowledge", "Bearing Much Fruit", "Established", "Full Stature", "Progressive Faith", "Spiritual Maturity"][i],
        scripture: ["2 Peter 3:18", "Ephesians 4:13", "Colossians 1:10", "John 15:5", "Psalm 1:3", "1 Corinthians 3:9", "Ephesians 4:12", "Hebrews 5:12", "2 Peter 1:5-7", "Philippians 1:9", "Philippians 3:12", "Jeremiah 17:8", "Matthew 7:17", "Psalm 92:12", "John 15:8", "Ecclesiastes 3:1", "Proverbs 29:23", "Hebrews 10:22", "1 John 2:14", "Colossians 2:10", "2 Thessalonians 1:3", "1 Timothy 4:15", "Proverbs 4:18", "Proverbs 10:25", "Colossians 1:9-10", "John 15:16", "1 Peter 5:10", "Ephesians 4:13", "Proverbs 22:3", "2 Peter 1:3"][i],
        text: ["But grow in the grace and knowledge of our Lord and Savior Jesus Christ.", "Until we all reach unity in the faith and in the knowledge of the Son of God and become mature.", "And we pray this in order that you may live a life worthy of the Lord and may please him in every way.", "I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit.", "That person is like a tree planted by streams of water, which yields its fruit in season.", "For we are co-workers in God's service; you are God's field, God's building.", "To prepare God's people for works of service, so that the body of Christ may be built up.", "In fact, though by this time you ought to be teachers, you need someone to teach you.", "Make every effort to add to your faith goodness; and to goodness, knowledge; and to knowledge, self-control.", "And this is my prayer: that your love may abound more and more in knowledge and depth of insight.", "Not that I have already obtained all this, or have already arrived at my goal, but I press on.", "That person is like a tree planted along a stream, with roots reaching into the water.", "Every good tree bears good fruit, but a bad tree bears bad fruit.", "The righteous will flourish like the palm tree, they will grow like a cedar of Lebanon.", "This is to my Father's glory, that you bear much fruit, showing yourselves to be my disciples.", "There is a time for everything, and a season for every activity under the heavens.", "When pride comes, then comes disgrace, but with humility comes wisdom.", "Let us draw near to God with a sincere heart and with the full assurance that faith brings.", "I am writing to you, young men, because you are strong, and the word of God lives in you.", "We have been made complete, and you are complete through your relationship with him!", "We ought to thank God for you, because your faith is growing more and more.", "Don't let anyone look down on you because you are young, but set an example for the believers.", "The path of the righteous is like the morning sun, shining ever brighter till the full light of day.", "The wicked are swept away, but the righteous stand firm forever.", "And we pray this in order that you may live a life worthy of the Lord and may please him in every way.", "You did not choose me, but I chose you and appointed you so that you might go and bear fruit.", "And the God of all grace, who called you to his eternal glory in Christ, after you have suffered a little while, will himself restore you and make you strong.", "As a result, Christ's body is built up until we all reach unity in the faith and in the knowledge of the Son of God.", "The prudent see danger and take refuge, but the simple keep going and pay the penalty.", "His divine power has given us everything we need for a godly life through our knowledge of him."][i]
      }))
    },
    { 
      month: "June", 
      shortMonth: "Jun",
      theme: "Grace & Mercy",
      devotions: "30 daily devotions on God's gracious nature",
      bgColor: "from-pink-600 to-pink-400",
      days: 30,
      dailyThemes: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        title: ["Grace Defined", "Unmerited Favor", "Mercy Extended", "Compassion Overflow", "Grace Upon Grace", "Merciful God", "Second Chances", "Forgiveness Flows", "Tender Mercies", "Grace Sufficient", "Mercy's Reach", "Gracious Heart", "Kindness Shown", "Compassion Deep", "Grace Renewed", "Mercy Forever", "Grace Visible", "Divine Compassion", "Merciful Lord", "Grace Flows", "New Mercies", "Extended Grace", "Mercy's Embrace", "Gracious Gift", "Steadfast Mercy", "Grace Covering", "Merciful Always", "Grace Strengthens", "Compassionate Father", "Grace Beyond Measure"][i],
        scripture: ["Ephesians 2:8", "Titus 2:11", "Lamentations 3:22-23", "1 Peter 1:3", "John 1:16", "Psalm 103:8", "2 Peter 3:9", "Colossians 3:13", "Psalm 25:6", "2 Corinthians 12:9", "Hebrews 4:16", "Proverbs 3:3-4", "Philippians 2:1", "Luke 1:77-78", "Psalm 23:6", "Isaiah 54:10", "Hebrews 10:24", "Matthew 9:36", "Hosea 11:8-9", "Romans 5:20", "Lamentations 3:23", "Ephesians 1:3", "Psalm 107:8-9", "Romans 3:24", "Psalm 89:1-2", "Isaiah 40:11", "Psalm 145:8", "Philippians 4:19", "Isaiah 54:7", "Psalm 86:15"][i],
        text: ["For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God.", "For the grace of God has appeared that offers salvation to all people.", "Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning.", "Praise be to the God and Father of our Lord Jesus Christ! In his great mercy he has given us new birth.", "Out of his fullness we have all received grace in place of grace already given.", "The Lord is compassionate and gracious, slow to anger, abounding in love.", "The Lord is not slow in keeping his promise... He is patient with you, not wanting anyone to perish.", "Bear with each other and forgive one another if any of you has a grievance against someone.", "Remember, Lord, your great mercy and love, for they are from of old.", "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.'", "Let us then approach God's throne of grace with confidence, so that we may receive mercy.", "Let love and faithfulness never leave you; bind them around your neck, write them on the tablet of your heart.", "If you have any encouragement from being united with Christ, if any comfort from his love.", "To give his people the knowledge of salvation through the forgiveness of their sins, because of the tender mercy of our God.", "Surely your goodness and love will follow me all the days of my life.", "Though the mountains be shaken and the hills be removed, yet my unfailing love for you will not be shaken.", "And let us consider how we may spur one another on toward love and good deeds.", "Jesus went through all the towns and villages, teaching in their synagogues, proclaiming the good news of the kingdom and healing every disease.", "My heart yearns for him; I will surely have mercy on him, declares the Lord.", "Where sin increased, grace increased all the more.", "They are new every morning; great is your faithfulness.", "Praise be to the God and Father of our Lord Jesus Christ, who has blessed us in the heavenly realms with every spiritual blessing.", "Some were fools through their rebellious ways and suffered affliction because of their iniquities. Then they cried to the Lord in their trouble, and he saved them from their distress.", "For all have sinned and fall short of the glory of God, and all are justified freely by his grace through the redemption that came by Christ Jesus.", "I will sing of the Lord's great love forever; with my mouth I will make your faithfulness known through all generations.", "He tends his flock like a shepherd: He gathers the lambs in his arms and carries them close to his heart.", "The Lord is gracious and compassionate, slow to anger and rich in love.", "And my God will meet all your needs according to the riches of his glory in Christ Jesus.", "With everlasting kindness I will have compassion on you, says the Lord your Redeemer.", "The Lord is compassionate and gracious, slow to anger, abounding in love."][i]
      }))
    },
    { 
      month: "July", 
      shortMonth: "Jul",
      theme: "Freedom In Christ",
      devotions: "31 daily devotions on spiritual liberty",
      bgColor: "from-orange-600 to-orange-400",
      days: 31,
      dailyThemes: Array.from({ length: 31 }, (_, i) => ({
        day: i + 1,
        title: ["Set Free", "Liberty Declared", "Breaking Chains", "Captive Free", "Freedom Won", "Released", "Bondage Broken", "Liberty In Spirit", "Liberated Soul", "No More Chains", "Freely Living", "Freedom's Gift", "Slave No More", "Free Indeed", "Breaking Free", "Liberty Restored", "Free To Serve", "Yoke Lifted", "Freedom Eternal", "True Liberation", "Free From Fear", "Freedom Journey", "Liberty Walks", "Bondage Broken", "Glorious Freedom", "Free In Him", "Liberty's Path", "Unshackled", "Freedom's Power", "Complete Liberation", "Forever Free"][i],
        scripture: ["John 8:36", "Galatians 5:1", "Romans 6:6", "Isaiah 61:1", "2 Corinthians 3:17", "Psalm 118:5", "1 Peter 2:16", "Galatians 5:13", "Romans 8:1-2", "Isaiah 52:2", "Proverbs 8:15", "Galatians 3:28", "John 8:32", "Romans 6:22", "2 Timothy 1:7", "Colossians 1:13", "Ephesians 6:12", "Matthew 11:28", "Psalm 107:14", "Jeremiah 1:8", "Psalm 146:7", "Acts 26:18", "Ecclesiastes 12:13", "Romans 7:6", "Luke 1:74", "Psalm 30:5", "Philippians 4:8", "Isaiah 43:18-19", "Psalm 119:45", "Deuteronomy 5:15", "Leviticus 25:10"][i],
        text: ["So if the Son sets you free, you will be free indeed.", "It is for freedom that Christ has set us free. Stand firm, then, and do not let yourselves be burdened again by a yoke of slavery.", "For we know that our old self was crucified with him so that the body ruled by sin might be done away with, that we should no longer be slaves to sin.", "The Spirit of the Sovereign Lord is on me, because the Lord has anointed me to proclaim good news to the poor. He has sent me to bind up the brokenhearted, to proclaim freedom for the captives.", "Now the Lord is the Spirit, and where the Spirit of the Lord is, there is freedom.", "I called on the Lord in distress; the Lord answered me and set me free.", "Live as free people, but do not use your freedom as a cover-up for evil; live as God's slaves.", "You, my brothers and sisters, were called to be free. But do not use your freedom to indulge the flesh.", "Therefore, there is now no condemnation for those who are in Christ Jesus, because through Christ Jesus the law of the Spirit who gives life has set you free from the law of sin and death.", "Shake off your dust; rise up, sit enthroned, Jerusalem. Free yourself from the chains on your neck, Daughter of Zion, now a captive.", "I, wisdom, dwell together with prudence; I possess knowledge and discretion.", "There is neither Jew nor Gentile, neither slave nor free, nor is there male and female, for you are all one in Christ Jesus.", "To the Jews who had believed him, Jesus said, 'If you hold to my teaching, you are really my disciples. Then you will know the truth, and the truth will set you free.'", "But now that you have been set free from sin and have become slaves of God, the benefit you reap leads to holiness.", "For the Spirit God gave us does not make us timid, but gives us power, love and a sound mind.", "For he has rescued us from the dominion of darkness and brought us into the kingdom of the Son he loves.", "For our struggle is not against flesh and blood, but against the rulers, against the authorities, against the powers of this dark world.", "Come to me, all you who are weary and burdened, and I will give you rest.", "He brought them out of darkness, the utter darkness, and broke away their chains.", "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.", "The Lord sets the prisoners free.", "To open their eyes and turn them from darkness to light, and from the power of Satan to God.", "Now all has been heard; here is the conclusion of the matter: Fear God and keep his commandments.", "But now, by dying to what once bound us, we have been released from the law so that we serve in the new way of the Spirit.", "So that we, being rescued from the hand of our enemies, might serve him without fear.", "Weeping may stay for the night, but rejoicing comes in the morning.", "Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely, whatever is admirable.", "Forget the former things; do not dwell on the past. See, I am doing a new thing! Now it springs up; do you not perceive it?", "I run in the path of your commands, for you have set my heart free.", "Remember that you were slaves in Egypt and the Lord your God brought you out of there with a mighty hand and an outstretched arm.", "Proclaim liberty throughout the land to all its inhabitants."][i]
      }))
    },
    { 
      month: "August", 
      shortMonth: "Aug",
      theme: "Strength & Courage",
      devotions: "31 daily devotions on gaining God's strength",
      bgColor: "from-amber-600 to-amber-400",
      days: 31,
      dailyThemes: Array.from({ length: 31 }, (_, i) => ({
        day: i + 1,
        title: ["Strong In God", "Courageous Heart", "Mighty Power", "Weakness Into Strength", "Standing Firm", "Inner Strength", "Courage Found", "Fortified", "Bravery Blessed", "Strength Renewed", "Overcoming Fear", "God My Rock", "Fearless Living", "Enduring Strength", "Strengthened Within", "Courageous Faith", "Mighty Fortress", "Strength Provider", "Boldly Living", "Power Source", "Unwavering", "Strength Multiplied", "Fortress God", "Armored Strong", "Building Strength", "Steadfast Courage", "Courage Works", "Mighty Through Him", "Strength Eternal", "Victorious Strength", "Strong Tower"][i],
        scripture: ["Ephesians 6:10", "Joshua 1:9", "Isaiah 40:29", "2 Corinthians 12:9", "Ephesians 6:14", "Proverbs 24:5", "Psalm 27:1", "2 Timothy 1:7", "Psalm 73:26", "Nehemiah 8:10", "Proverbs 28:1", "Psalm 31:3", "Psalm 112:7", "Colossians 1:11", "Proverbs 27:12", "Proverbs 29:25", "Psalm 46:1", "Isaiah 41:10", "Deuteronomy 31:6", "Habakkuk 3:19", "Psalm 59:16", "Psalm 18:32", "Proverbs 10:29", "Psalm 144:1", "2 Corinthians 10:4", "Psalm 138:3", "Psalm 121:1-2", "1 Peter 5:10", "Proverbs 8:14", "Proverbs 18:10"][i],
        text: ["Finally, be strong in the Lord and in his mighty power.", "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", "He gives strength to the weary and increases the power of the weak.", "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.'", "Put on the full armor of God so that you can take your stand against the devil's schemes.", "The wise prevail through great power, and those who have knowledge muster their strength.", "The Lord is my light and my salvation—whom shall I fear?", "For the Spirit God gave us does not make us timid, but gives us power, love and a sound mind.", "My flesh and my heart may fail, but God is the strength of my heart and my portion forever.", "The joy of the Lord is your strength.", "The wicked flee though no one pursues, but the righteous are as bold as a lion.", "You are my rock and my fortress; for the sake of your name lead and guide me.", "An evil person fears when no one pursues; but the righteous are bold as a lion.", "Being strengthened with all power according to his glorious might so that you may have great endurance and patience.", "The prudent see danger and take refuge, but the simple keep going and pay the penalty.", "Fear of man will prove to be a snare, but whoever trusts in the Lord is kept safe.", "God is our refuge and strength, an ever-present help in trouble.", "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.", "Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you.", "The Sovereign Lord is my strength; he makes my feet like the feet of a deer, he enables me to tread on the heights.", "But I will sing of your strength, in the morning I will sing of your love; for you are my fortress, my refuge in times of trouble.", "It is God who arms me with strength and keeps my way secure.", "The way of the Lord is a refuge for the blameless, but it is the ruin of those who do evil.", "Praise be to the Lord my Rock, who trains my hands for war, my fingers for battle.", "The weapons we fight with are not the weapons of the world. On the contrary, they have divine power to demolish strongholds.", "You called in distress, and I saved you; I loved you and called you by name.", "I lift up my eyes to the mountains—where does my help come from? My help comes from the Lord, the Maker of heaven and earth.", "And the God of all grace, who called you to his eternal glory in Christ, after you have suffered a little while, will himself restore you and make you strong.", "With me are riches and honor, enduring wealth and prosperity. My fruit is better than fine gold.", "Whoever finds me finds life and receives favor from the Lord."][i]
      }))
    },
    { 
      month: "September", 
      shortMonth: "Sep",
      theme: "Faithfulness",
      devotions: "30 daily devotions on steadfast faith",
      bgColor: "from-yellow-600 to-yellow-400",
      days: 30,
      dailyThemes: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        title: ["Faithful Always", "Trustworthy God", "Unwavering Faith", "Consistent Heart", "True Believer", "Faith Tested", "Standing Firm", "Steadfast Trust", "Reliable Always", "Faith Deepens", "Faithful Witness", "Loyal Servant", "Faith Endures", "Believing Bold", "Tested True", "Faith Grows", "Forever Faithful", "Constant Trust", "Faith Foundation", "Faithful Love", "Proven Faith", "Trust Remains", "Faithful Walk", "Faith Victorious", "Faithful Path", "Integrity Held", "Faith Refined", "Loyalty Shown", "Perpetual Faith", "Faithfully Walking"][i],
        scripture: ["Lamentations 3:23", "Numbers 23:19", "Psalm 89:1-2", "Proverbs 13:17", "Hebrews 10:23", "1 Peter 1:6-7", "Psalm 37:23-24", "Proverbs 14:15", "Psalm 146:6", "Proverbs 27:12", "Revelation 2:10", "2 Timothy 2:13", "Hebrews 10:35-36", "Psalm 31:23", "Deuteronomy 7:9", "Proverbs 3:5-6", "Psalm 112:7-8", "Proverbs 28:20", "1 Corinthians 10:13", "Proverbs 20:6", "Malachi 3:6", "Psalm 86:15", "Proverbs 11:13", "2 Thessalonians 3:3", "Psalm 25:10", "Proverbs 8:17", "1 John 1:9", "Psalm 143:8", "Proverbs 30:5", "Psalm 36:5"][i],
        text: ["They are new every morning; great is your faithfulness.", "God is not human, that he should lie, not a human, that he should change his mind.", "I will sing of the Lord's great love forever; with my mouth I will make your faithfulness known through all generations.", "A faithful envoy brings healing, but one who is unfaithful brings disaster.", "Let us hold unswervingly to the hope we profess, for he who promised is faithful.", "In all this you greatly rejoice, though now for a little while you may have had to suffer grief in all kinds of trials. These have come so that the proven genuineness of your faith.", "The Lord establishes the steps of a godly man whose delight is in the way of the Lord.", "The simple believe anything, but the prudent give thought to their steps.", "The Lord reigns forever, your God, O Zion, for all generations. Praise the Lord!", "The prudent see danger and take refuge, but the simple keep going and pay the penalty.", "Be faithful, even to the point of death, and I will give you life as your victor's crown.", "If we are faithless, he remains faithful, for he cannot disown himself.", "So do not throw away your confidence; it will be richly rewarded. You need to persevere so that when you have done the will of God, you will receive what he has promised.", "Love the Lord, all his faithful people! The Lord preserves those who are true to him.", "Know therefore that the Lord your God is God; he is the faithful God.", "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.", "The righteous person may have many troubles, but the Lord delivers him from them all. Yet the Lord is faithful.", "Wealth and honor come to the one who pursues righteousness, but those who seek evil find it.", "No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear.", "Many claim to have unfailing love, but a faithful person who can find?", "'I the Lord do not change. So you, the descendants of Jacob, are not destroyed.'", "The Lord is compassionate and gracious, slow to anger, abounding in love.", "A gossip betrays a confidence, but a trustworthy person keeps a secret.", "But the Lord is faithful, and he will strengthen you and protect you from the evil one.", "All the ways of the Lord are loving and faithful toward those who keep his covenant and his statutes.", "I love those who love me, and those who seek me find me.", "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.", "Let me hear in the morning of your steadfast love, that I may rejoice.", "Every word of God is flawless; he is a shield to those who take refuge in him.", "Your love, Lord, reaches to the heavens, your faithfulness to the skies."][i]
      }))
    },
    { 
      month: "October", 
      shortMonth: "Oct",
      theme: "Transformation",
      devotions: "31 daily devotions on God's transforming power",
      bgColor: "from-indigo-600 to-indigo-400",
      days: 31,
      dailyThemes: Array.from({ length: 31 }, (_, i) => ({
        day: i + 1,
        title: ["Changed Forever", "Renewed Mind", "New Creature", "Becoming New", "Transformed Spirit", "Changed Heart", "Metamorphosis", "Reshaped", "Transfigured", "Identity New", "Daily Change", "Renewal Daily", "Beauty From Ashes", "Breaking Pattern", "Evolved Faith", "Recreated Soul", "Continual Change", "New Perspective", "Transformed Thinking", "Radiant Change", "Changing Within", "Molded New", "Fresh Start", "Becoming Better", "Changed Vision", "Refiner's Fire", "New Creation", "Renewed Spirit", "Transformation Journey", "Glorious Change", "Perfected Process"][i],
        scripture: ["Romans 12:2", "2 Corinthians 5:17", "Philippians 4:8", "Titus 3:5", "Colossians 3:1", "2 Corinthians 3:18", "Ephesians 4:23", "Proverbs 23:7", "Isaiah 43:18-19", "2 Peter 1:3-4", "Malachi 3:2-3", "Jeremiah 18:4", "Isaiah 61:3", "Romans 6:6", "2 Corinthians 4:16", "2 Corinthians 10:5", "Colossians 2:10", "Proverbs 27:12", "Galatians 5:22-23", "Psalm 139:14", "Hebrews 13:8", "1 Peter 1:14-15", "Proverbs 4:23", "Matthew 6:33", "Ephesians 5:26-27", "Philippians 2:13", "1 Thessalonians 5:23", "Romans 8:29", "2 Corinthians 13:11", "Philippians 1:6"][i],
        text: ["Do not conform to the pattern of this world, but be transformed by the renewing of your mind.", "Therefore, if anyone is in Christ, he is a new creation; the old has gone, the new is here!", "Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely, whatever is admirable—if anything is excellent or praiseworthy—think about such things.", "He saved us, not because of righteous things we had done, but because of his mercy.", "Since, then, you have been raised with Christ, set your hearts on things above, where Christ is, seated at the right hand of God.", "And we all, who with unveiled faces contemplate the Lord's glory, are being transformed into his image with ever-increasing glory.", "You were taught, with regard to your former way of life, to put off your old self, which is being corrupted by its deceitful desires; to be made new in the attitude of your minds.", "For as a man thinks in his heart, so is he.", "Forget the former things; do not dwell on the past. See, I am doing a new thing! Now it springs up; do you not perceive it?", "His divine power has given us everything we need for a godly life through our knowledge of him who called us by his own glory and goodness.", "But who can endure the day of his coming? For he will be like a refiner's fire or a launderer's soap.", "Now Jeremiah was still imprisoned at the courtyard of the guard when the word of the Lord came to him a third time.", "To provide for those who grieve in Zion—to bestow on them a crown of beauty instead of ashes.", "For we know that our old self was crucified with him so that the body ruled by sin might be done away with.", "Therefore we do not lose heart. Though outwardly we are wasting away, yet inwardly we are being renewed day by day.", "We demolish arguments and every pretension that sets itself up against the knowledge of God.", "And in him you have been brought to fullness, which is the fullness of Christ.", "The prudent see danger and take refuge, but the simple keep going and pay the penalty.", "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.", "I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.", "Jesus Christ is the same yesterday and today and forever.", "As obedient children, do not conform to the evil desires you had when you lived in ignorance. But just as he who called you is holy, so be holy in all you do.", "Above all else, guard your heart, for everything you do flows from it.", "But seek first his kingdom and his righteousness, and all these things will be given to you as well.", "To present her to himself as a radiant church, without stain or wrinkle or any other blemish, but holy and blameless.", "For it is God who works in you to will and to act in order to fulfill his good purpose.", "May God himself, the God of peace, sanctify you through and through.", "For those God foreknew he also predestined to be conformed to the image of his Son.", "Finally, brothers and sisters, rejoice! Strive for full restoration, encourage one another, be of one mind, live in peace.", "Being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus."][i]
      }))
    },
    { 
      month: "November", 
      shortMonth: "Nov",
      theme: "Gratitude & Thanksgiving",
      devotions: "30 daily devotions on counting blessings",
      bgColor: "from-teal-600 to-teal-400",
      days: 30,
      dailyThemes: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        title: ["Grateful Heart", "Counting Blessings", "Thanks Given", "Gratitude Flows", "Blessed Life", "Thankful Always", "Appreciation Deep", "Recognition Of Grace", "Praise Lifted", "Thankful Spirit", "Grateful Living", "Blessings Seen", "Thanks Multiplied", "Grateful Mind", "Attitude Of Gratitude", "Blessed Abundance", "Praise Continual", "Grateful Witness", "Thankful Testimony", "Overflowing Thanks", "Recognized Favor", "Grateful Journey", "Blessing Counters", "Thanks Filling", "Perspective Grateful", "Thanksgiving Celebrated", "Grateful Always", "Blessed Completely", "Recognition Full", "Grateful Forever"][i],
        scripture: ["1 Thessalonians 5:16-18", "Philippians 4:4-6", "Colossians 3:16", "Psalm 100:4", "1 Corinthians 15:57", "Ephesians 5:19-20", "Philippians 4:6", "Psalm 103:1-2", "Colossians 2:7", "Hebrews 12:28", "Psalm 30:11-12", "Psalm 47:1", "Psalm 95:1-2", "Luke 17:15-16", "1 Peter 1:3", "Proverbs 10:28", "Psalm 86:12", "Deuteronomy 16:10-11", "2 Corinthians 9:15", "Psalm 107:22", "Philippians 1:3-4", "Ecclesiastes 7:14", "Proverbs 22:4", "Psalm 92:1", "1 Samuel 12:24", "Nehemiah 12:43", "Malachi 3:10", "Psalm 116:12-13", "Colossians 4:2", "Philippians 4:7"][i],
        text: ["Rejoice always, pray continually, give thanks in all circumstances; for this is God's will for you in Christ Jesus.", "Rejoice in the Lord always. I will say it again: Rejoice! Let your gentleness be evident to all. The Lord is near. Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", "Let the message of Christ dwell among you as you teach and admonish one another with all wisdom through psalms, hymns, and songs from the Spirit, singing to God with gratitude in your hearts.", "Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.", "But thanks be to God, who gives us the victory through our Lord Jesus Christ.", "Speak to one another with psalms, hymns, and songs from the Spirit. Sing and make music from your heart to the Lord, always giving thanks to God the Father.", "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", "Praise the Lord, my soul; all my inmost being, praise his holy name. Praise the Lord, my soul, and forget not all his benefits.", "And just as you Colossians received Christ Jesus as Lord, continue to live your lives in him, rooted and built up in him, strengthened in the faith as you were taught, and overflowing with thankfulness.", "Therefore, since we are receiving a kingdom that cannot be shaken, let us be thankful, and so worship God acceptably with reverence and awe.", "You have turned for me my mourning into dancing; you removed my sackcloth and clothed me with joy, that my heart may sing your praises and not be silent.", "Clap your hands, all you nations; shout to God with cries of joy.", "Come, let us bow down in worship, let us kneel before the Lord our Maker; for he is our God and we are the people of his pasture.", "One of them, when he saw he was healed, came back, praising God in a loud voice. He threw himself at Jesus' feet and thanked him.", "Praise be to the God and Father of our Lord Jesus Christ! In his great mercy he has given us new birth into a living hope.", "The prospect of the righteous is joy, but the hopes of the wicked come to nothing.", "I will praise you, Lord my God, with all my heart; I will glorify your name forever.", "Then you shall take some of the first of all the fruit of the soil, which you have harvested from the land that the Lord your God is giving you, and you shall put it in a basket.", "Thanks be to God for his indescribable gift!", "Let them sacrifice thank offerings and tell of his works with songs of joy.", "I always thank my God as I remember you in my prayers, because I hear about your love for all his holy people and your faith in the Lord Jesus.", "When times are good, be happy; but when times are bad, consider: God has made the one as well as the other.", "Humility and the fear of the Lord bring wealth and honor and life.", "It is good to praise the Lord and make music to your name, O Most High, proclaiming your love in the morning and your faithfulness at night.", "You have seen all that the Lord has done for you and your ancestors.", "The joy in that city rose up to heaven, and they celebrated with great rejoicing.", "Bring the whole tithe into the storehouse, that there may be food in my house.", "What can I return to the Lord for all his goodness to me? I will lift up the cup of salvation and call on the name of the Lord.", "Be faithful in prayer, and always be thankful.", "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."][i]
      }))
    },
    { 
      month: "December", 
      shortMonth: "Dec",
      theme: "Hope & Joy",
      devotions: "31 daily devotions on the hope of Christ",
      bgColor: "from-rose-600 to-rose-400",
      days: 31,
      dailyThemes: Array.from({ length: 31 }, (_, i) => ({
        day: i + 1,
        title: ["Hope Eternal", "Joy Complete", "Hope Found", "Joyful Living", "Hope Anchored", "Rejoicing Always", "Hope Rising", "Christmas Joy", "Joyful Blessing", "Hope Dwells", "Joy Overflows", "Hope Strong", "Celebration Joy", "Hope Lasting", "New Hope", "Joy Abounds", "Hope Secured", "Happy Heart", "Joy Radiates", "Hope Embraced", "Joyful Season", "Hope Sustains", "Joy Renewed", "Hope Forever", "Blessed Joy", "Hope Shines", "Joy Triumphant", "Hope Glorious", "Celebrating Hope", "Joy Eternal", "Hope Victory"][i],
        scripture: ["Psalm 39:7", "Philippians 3:1", "Romans 5:5", "Proverbs 10:28", "Hebrews 6:19", "Philippians 4:4", "Psalm 71:5", "Luke 2:10-11", "1 Peter 1:3-4", "Psalm 65:5", "Psalm 64:10", "Lamentations 3:21-23", "Psalm 30:5", "Psalm 146:5", "Colossians 1:27", "Philippians 4:4-5", "Psalm 71:14", "Proverbs 15:13", "Proverbs 17:22", "Nehemiah 8:10", "Psalm 27:13", "Romans 15:13", "Psalm 92:4", "Titus 2:13", "Psalm 130:7", "Psalm 97:12", "1 Thessalonians 1:6", "2 Corinthians 1:3-4", "Psalm 126:3", "Psalm 16:11", "Luke 1:68"][i],
        text: ["But as for me, I watch in hope for the Lord, I wait for God my Savior; my God will hear me.", "Rejoice in the Lord always. I will say it again: Rejoice!", "And hope does not put us to shame, because God's love has been poured out into our hearts through the Holy Spirit.", "The prospect of the righteous is joy, but the hopes of the wicked come to nothing.", "We have this hope as an anchor for the soul, firm and secure.", "Rejoice in the Lord always. I will say it again: Rejoice!", "For you have been my hope, Sovereign Lord, my confidence since my youth.", "And the angel said unto them, Fear not: for, behold, I bring you good tidings of great joy, which shall be to all people. For unto you is born this day in the city of David a Saviour, which is Christ the Lord.", "Praise be to the God and Father of our Lord Jesus Christ! In his great mercy he has given us new birth into a living hope through the resurrection of Jesus Christ from the dead.", "By awesome deeds you answer us with righteousness, God of our salvation.", "Let the righteous be glad and rejoice before God; let them be happy and joyful.", "Yet this I call to mind and therefore I have hope: Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning.", "Weeping may stay for the night, but rejoicing comes in the morning.", "Blessed are those whose hope is in the Lord their God, the Maker of heaven and earth.", "To them God has chosen to make known among the Gentiles the glorious riches of this mystery, which is Christ in you, the hope of glory.", "Rejoice in the Lord always. I will say it again: Rejoice! Let your gentleness be evident to all. The Lord is near.", "I am still confident of this: I will see the goodness of the Lord in the land of the living.", "A happy heart makes the face cheerful, but a crushed spirit dries up the bones.", "A cheerful heart is good medicine, but a crushed spirit dries up the bones.", "The joy of the Lord is your strength.", "Yet I am confident I will see the Lord's goodness in the land of the living.", "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.", "It is good to praise the Lord and make music to your name, O Most High.", "For the grace of God has appeared that offers salvation to all people. It teaches us to say 'No' to ungodliness and worldly passions, and to live self-controlled, upright and godly lives in this present age, while we wait for the blessed hope.", "I am confident of this very thing, that He who began a good work in you will perfect it until the day of Christ Jesus. For it is only right for me to feel this way about you all.", "Sing the praises of the Lord, enthroned in Zion; proclaim among the nations what he has done.", "You became imitators of us and of the Lord; in spite of severe suffering, you welcomed the message with the joy given by the Holy Spirit.", "Praise be to the God and Father of our Lord Jesus Christ, the Father of compassion and the God of all comfort, who comforts us in all our troubles, so that we can comfort those in any trouble with the comfort ourselves receive from God.", "Our mouths were filled with laughter, our tongues with songs of joy.", "You make known to me the path of life; you will fill me with joy in your presence, with eternal pleasures at your right hand.", "Praise be to the Lord, the God of Israel, because he has come to his people and redeemed them."][i]
      }))
    }
  ];

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-900 min-h-[110vh] py-24 flex items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <p className="text-cyan-300 font-semibold uppercase tracking-widest text-sm mb-4">Spiritual Growth</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">Spiritual Resources</h1>
            <p className="text-xl md:text-2xl opacity-95 mb-10 leading-relaxed max-w-2xl mx-auto">
              Equip yourself with powerful spiritual tools for growth and transformation
            </p>
            <Button size="lg" className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:shadow-2xl hover:scale-105 transition-all duration-200 text-white px-8 py-6 text-lg font-semibold shadow-lg">
              Browse All Resources
            </Button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-white">
          <span className="text-xs uppercase tracking-[0.35em] mb-2 text-white/80">Scroll</span>
          <div className="w-10 h-10 rounded-full border border-white/60 bg-white/10 backdrop-blur-xl flex items-center justify-center animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-white">
              <path fill="currentColor" d="M12 16.5l-6-6 1.4-1.4L12 13.7l4.6-4.6 1.4 1.4z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-cyan-600 font-semibold uppercase tracking-widest text-sm mb-3">Available Resources</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Explore Our Collections</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-slate-600">Choose from our curated collections to deepen your spiritual journey</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {resourceCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link key={index} to={category.link} className="group">
                  <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105 bg-white hover:bg-gradient-to-br hover:from-white hover:to-slate-50">
                    <CardContent className="p-8 text-center space-y-4">
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${category.gradient} flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">{category.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Sermons */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-cyan-600 font-semibold uppercase tracking-widest text-sm mb-3">Latest Teachings</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Featured Sermons</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-slate-600">Recent messages that have touched hearts and changed lives</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredSermons.map((sermon, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group bg-white">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-blue-700 to-cyan-500 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500 overflow-hidden">{sermon.image}</div>
                  <div className="p-8 space-y-3">
                    <h3 className="text-2xl font-bold text-slate-900 leading-tight">{sermon.title}</h3>
                    <p className="text-slate-600 font-medium">{sermon.speaker}</p>
                    <div className="flex justify-between text-sm text-slate-500 font-medium pt-2 border-t border-slate-100">
                      <span>📅 {sermon.date}</span>
                      <span>⏱️ {sermon.duration}</span>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg text-white font-semibold mt-4 py-5"
                      onClick={() => window.open(sermon.videoLink, '_blank')}
                    >
                      Watch Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-cyan-600 font-semibold uppercase tracking-widest text-sm mb-3">Spiritual Nourishment</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Daily Devotional</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-slate-600">Choose a month to access daily devotions, pray with Scripture, and deepen your connection with God</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {dailyDevotionals.map((devotional, index) => (
              <button
                key={index}
                onClick={() => setSelectedMonth(devotional)}
                className="group h-full"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white cursor-pointer overflow-hidden">
                  <CardContent className="p-6 text-center space-y-3 h-full flex flex-col">
                    <div className={`w-full h-32 rounded-lg bg-gradient-to-br ${devotional.bgColor} flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow`}>
                      <div className="text-center">
                        <div className="text-xs font-semibold opacity-75 mb-1">MONTH OF</div>
                        <div className="text-2xl font-bold">{devotional.shortMonth}</div>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{devotional.month}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{devotional.theme}</p>
                    <div className="mt-auto pt-2 border-t border-slate-100">
                      <p className="text-xs text-cyan-600 font-semibold">View Devotions</p>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Devotional Modal */}
      {selectedMonth && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${selectedMonth.bgColor} text-white p-8 relative sticky top-0 z-40`}>
              <button
                onClick={() => setSelectedMonth(null)}
                className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              <div className="text-center">
                <p className="text-sm font-semibold opacity-90 mb-2 uppercase tracking-widest">MONTH OF</p>
                <h2 className="text-5xl font-bold mb-4 italic">{selectedMonth.month.toUpperCase()}</h2>
                <div className="w-20 h-1 bg-white/50 rounded-full mx-auto mb-4"></div>
                <p className="text-lg font-semibold opacity-95">{selectedMonth.theme}</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              {/* Daily Devotions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedMonth.dailyThemes && selectedMonth.dailyThemes.map((devotion) => (
                  <div key={devotion.day}>
                    <button
                      onClick={() => setExpandedDay(expandedDay === devotion.day ? null : devotion.day)}
                      className="w-full text-left group"
                    >
                      <div className={`bg-gradient-to-br ${selectedMonth.bgColor} bg-opacity-10 border-2 border-opacity-30 border-current rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer group-hover:border-opacity-100`}>
                        <div className={`text-lg font-bold bg-gradient-to-r ${selectedMonth.bgColor} bg-clip-text text-transparent mb-1`}>
                          Day {devotion.day}
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-2">{devotion.title}</h4>
                        <p className={`text-sm font-semibold bg-gradient-to-r ${selectedMonth.bgColor} bg-clip-text text-transparent`}>
                          {devotion.scripture}
                        </p>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {expandedDay === devotion.day && (
                      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
                        <div className={`bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedDay(null);
                            }}
                            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"
                          >
                            <X size={20} />
                          </button>

                          <div className="space-y-6">
                            <div className="text-center pb-4 border-b-2 border-slate-200">
                              <div className={`text-3xl font-bold bg-gradient-to-r ${selectedMonth.bgColor} bg-clip-text text-transparent mb-2`}>
                                Day {devotion.day}
                              </div>
                              <h3 className="text-2xl font-bold text-slate-900">{devotion.title}</h3>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <p className={`text-sm font-bold bg-gradient-to-r ${selectedMonth.bgColor} bg-clip-text text-transparent uppercase tracking-widest mb-2`}>
                                  Scripture
                                </p>
                                <p className="text-lg font-semibold text-slate-900 mb-2">{devotion.scripture}</p>
                                <p className="text-slate-700 leading-relaxed italic">
                                  "{devotion.text}"
                                </p>
                              </div>

                              <div>
                                <p className={`text-sm font-bold bg-gradient-to-r ${selectedMonth.bgColor} bg-clip-text text-transparent uppercase tracking-widest mb-2`}>
                                  Reflection
                                </p>
                                <p className="text-slate-700 leading-relaxed">
                                  Take time to meditate on this verse. How does {devotion.title.toLowerCase()} apply to your life today? Reflect on areas where God is calling you to deeper faith and trust in His Word.
                                </p>
                              </div>

                              <div>
                                <p className={`text-sm font-bold bg-gradient-to-r ${selectedMonth.bgColor} bg-clip-text text-transparent uppercase tracking-widest mb-2`}>
                                  Prayer
                                </p>
                                <p className="text-slate-700 leading-relaxed italic">
                                  "Father, help me to understand and live out the truth of {devotion.scripture}. Transform my heart through Your Word and help me to apply this truth in my daily life. Guide my steps and strengthen my faith. In Jesus' name, Amen."
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedDay(null);
                              }}
                              className={`w-full bg-gradient-to-r ${selectedMonth.bgColor} hover:shadow-lg text-white font-semibold py-3 rounded-lg transition-all`}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Download Section */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-200">
                <Button 
                  onClick={() => {
                    alert(`Downloading ${selectedMonth.month} Devotional Manual...`);
                  }}
                  className={`flex-1 bg-gradient-to-r ${selectedMonth.bgColor} hover:shadow-lg text-white font-semibold py-6 flex items-center justify-center gap-2`}
                >
                  <Download size={20} />
                  Download Full Manual
                </Button>
                <Button 
                  onClick={() => setSelectedMonth(null)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-6"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-20 mt-20 border-t border-slate-800">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Fathers Heart Chapel</h3>
            <p className="text-slate-400 leading-relaxed text-base">
              Transforming lives through faith, worship, and service. Join our vibrant community and grow in your spiritual journey.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Services", link: "/services" },
                { name: "About Us", link: "/about" },
                { name: "Partnership", link: "/partnership" },
                { name: "Giving", link: "/give/offering" },
                { name: "Contact", link: "/contact" }
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.link}
                    className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6">Contact Us</h3>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-center gap-3 hover:text-white transition-colors"><MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0" /> 123 Church Street, Accra, Ghana</li>
              <li className="flex items-center gap-3 hover:text-white transition-colors"><Phone className="w-5 h-5 text-cyan-400 flex-shrink-0" /> +233 24 352 7174</li>
              <li className="flex items-center gap-3 hover:text-white transition-colors"><Mail className="w-5 h-5 text-cyan-400 flex-shrink-0" /> info@fathersheart.org</li>
            </ul>
            <div className="flex gap-4 mt-6">
              {[
                { icon: <Facebook className="w-4 h-4" />, link: "#", hover: "hover:bg-blue-600" },
                { icon: <Instagram className="w-4 h-4" />, link: "#", hover: "hover:bg-pink-600" },
                { icon: <Youtube className="w-4 h-4" />, link: "#", hover: "hover:bg-red-600" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  className={`w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-white ${social.hover} transition-all duration-200 hover:scale-110`}
                  title={social.link}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Fathers Heart Chapel International. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default Resources;
