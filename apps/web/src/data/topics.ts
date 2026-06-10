import { TopicCategoryData } from "@/components/home/TopicSection";

export const TOPIC_CATEGORIES: TopicCategoryData[] = [
  {
    id: "entertainment",
    title: "World's Entertainment",
    links: ["Photos", "Videos", "Today's Blockbuster", "Bollywood"],
    featureArticle: {
      title: "Ranveer Singh to play Lord Shiva in film adaptation of \"The Immortals of Meluha\":",
      description: "The actor has reportedly acquired the rights to The Immortals of Meluha and is developing it into a large-scale mythological film trilogy under his production banner.",
      readTime: "5 MIN READ",
      imageSrc: "https://picsum.photos/id/1014/800/600",
      source: "BBC Channel",
    },
    splitArticles: [
      { title: "Energy Secretary Floats Pause in Federal Gas Tax", readTime: "1 MIN READ" },
      { title: "Lebanese Mourn Eight Members of One Family Killed in Israeli Strike", readTime: "3 MIN READ" }
    ],
    liveUpdate: {
      date: "May 10",
      title: "Iran Responds to U.S. Proposal to End the War",
      imageSrc: "https://picsum.photos/id/1015/600/350"
    },
    relatedArticles: [
      { id: "ent1", source: "The Hollywood Reporter", title: "A Second Chance Led Them Back to Each Other", readTime: "5 MIN READ", imageSrc: "https://picsum.photos/id/1017/300/225" },
      { id: "ent2", source: "The Hollywood Reporter", title: "A Second Chance Led Them Back to Each Other", readTime: "5 MIN READ", imageSrc: "https://picsum.photos/id/1018/300/225" },
      { id: "ent3", source: "The Hollywood Reporter", title: "A Second Chance Led Them Back to Each Other", readTime: "5 MIN READ", imageSrc: "https://picsum.photos/id/1019/300/225" }
    ]
  },
  {
    id: "technology",
    title: "Technology & Innovation",
    links: ["AI", "Gadgets", "Startups", "Space"],
    featureArticle: {
      title: "New Quantum Computer Breaks Processing Record",
      description: "Researchers have unveiled a new quantum processor capable of calculations that would take traditional supercomputers thousands of years to complete, marking a significant milestone in computing.",
      readTime: "6 MIN READ",
      imageSrc: "https://picsum.photos/id/1020/800/600",
      source: "Tech Insider",
    },
    splitArticles: [
      { title: "Major Software Update Rolls Out Globally", readTime: "2 MIN READ" },
      { title: "Electric Vehicle Sales Hit All-Time High This Quarter", readTime: "4 MIN READ" }
    ],
    liveUpdate: {
      date: "May 11",
      title: "Tech CEO Announces Departure Amid Company Restructuring",
      imageSrc: "https://picsum.photos/id/1021/600/350"
    },
    relatedArticles: [
      { id: "tech1", source: "Tech Weekly", title: "The Future of Artificial Intelligence in Everyday Life", readTime: "4 MIN READ", imageSrc: "https://picsum.photos/id/1023/300/225" },
      { id: "tech2", source: "Tech Weekly", title: "The Future of Artificial Intelligence in Everyday Life", readTime: "4 MIN READ", imageSrc: "https://picsum.photos/id/1024/300/225" },
      { id: "tech3", source: "Tech Weekly", title: "The Future of Artificial Intelligence in Everyday Life", readTime: "4 MIN READ", imageSrc: "https://picsum.photos/id/1025/300/225" }
    ]
  },
  {
    id: "sports",
    title: "Sports Highlights",
    links: ["Football", "Cricket", "Tennis", "Olympics"],
    featureArticle: {
      title: "Championship Finals: An Unforgettable Match Under the Stars",
      description: "In a stunning upset, the underdogs managed to secure a victory in the final minutes of the game, cementing their legacy in sports history forever.",
      readTime: "7 MIN READ",
      imageSrc: "https://picsum.photos/id/1026/800/600",
      source: "Sports Network",
    },
    splitArticles: [
      { title: "Top Athlete Announces Retirement After 15 Years", readTime: "3 MIN READ" },
      { title: "New Regulations Proposed for Upcoming Season", readTime: "2 MIN READ" }
    ],
    liveUpdate: {
      date: "May 12",
      title: "International Tournament Draw Reveals Exciting Matchups",
      imageSrc: "https://picsum.photos/id/1027/600/350"
    },
    relatedArticles: [
      { id: "sport1", source: "Sports Daily", title: "Rising Stars to Watch in the Next Season", readTime: "5 MIN READ", imageSrc: "https://picsum.photos/id/1029/300/225" },
      { id: "sport2", source: "Sports Daily", title: "Rising Stars to Watch in the Next Season", readTime: "5 MIN READ", imageSrc: "https://picsum.photos/id/1031/300/225" },
      { id: "sport3", source: "Sports Daily", title: "Rising Stars to Watch in the Next Season", readTime: "5 MIN READ", imageSrc: "https://picsum.photos/id/1032/300/225" }
    ]
  }
];
