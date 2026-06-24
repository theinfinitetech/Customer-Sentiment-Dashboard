export interface ReviewTemplate {
  name: string;
  industry: string;
  icon: string;
  description: string;
  text: string;
}

export const REVIEW_TEMPLATES: ReviewTemplate[] = [
  {
    name: "Zenith SaaS CRM",
    industry: "SaaS software",
    icon: "AppWindow",
    description: "Feedback about Zenith CRM: features, bugs, support responsiveness, and subscription pricing.",
    text: `1. Zenith CRM has completely changed how our sales team operates. The interface is incredibly intuitive, and setting up workflows took us less than an hour. However, the pricing is a bit steep for small startups. - June 12, 2026
2. I keep getting a 'Network Timeout' error every time I try to import bulk contacts from CSV. Customer support is slow to respond, taking almost 18 hours to get back with a generic reply. Very frustrating. - June 15, 2026
3. The reporting feature is top-tier! I love how easily I can customize dashboards and export PDF reports for stakeholders. Wish the mobile app loaded faster though. - June 10, 2026
4. Terrible billing experience! They charged me twice this month. I contacted their finance department, but still haven't received a refund. Great tool, but operations are highly unorganized. - June 18, 2026
5. I've used CRM tools for a decade, and Zenith's contact organization is by far the cleanest. The integrations with Gmail and Slack work flawlessly. Keep it up! - June 20, 2026
6. The interface is clean, but the application feels extremely laggy when navigating between contact lists containing more than 5,000 entries. They really need to optimize their database queries. - June 14, 2026
7. Zenith CRM's pipeline view is excellent. The drag-and-drop mechanics are smooth and responsive. Support resolved my issue with custom fields quickly today! - June 22, 2026
8. We migrated from Salesforce, and while Zenith is easier to use, it lacks advanced permissions settings. We need role-based granular access which isn't fully supported yet. - June 16, 2026
9. A bug in the latest version is resetting our email signature templates randomly. It's embarrassing to send clients unformatted emails. Please fix this bug immediately! - June 19, 2026
10. Solid CRM with standard features. Pricing is fair if you use the team plan, but the solo tier is way too limited. Offline mode is a life-saver during flights. - June 23, 2026`
  },
  {
    name: "Nova Smart Ring",
    industry: "Hardware & E-commerce",
    icon: "Activity",
    description: "Reviews for Nova Ring: battery life issues since firmware v2.1, sleek titanium aesthetics, and shipping times.",
    text: `1. The Nova Smart Ring is a masterpiece of design. It's lightweight, sleek, and looks like a piece of high-end jewelry. The sleep tracking is shockingly accurate compared to my Apple Watch. - May 28, 2026
2. Warning: Do not upgrade to firmware v2.1! Ever since the update, my battery drains in less than 12 hours. It used to easily last 4 days. Customer support says they are working on a fix, but no timeline. - June 04, 2026
3. I ordered the stealth black edition and it got scratched within two days of normal gym use. For a 'titanium' ring, the durability is extremely disappointing. - June 01, 2026
4. Absolutely love the heart rate variability (HRV) metrics. The accompanying app is beautifully designed, with clean widgets and intuitive health tips. Best ring on the market! - June 08, 2026
5. It took 3 weeks for my ring to arrive, and their shipping tracking link didn't work at all. When it arrived, the sizing kit was missing. The product is decent, but the logistics are a nightmare. - May 30, 2026
6. Nova Ring's sleep coach feature is brilliant. It helped me realize how much alcohol affected my deep sleep. It's comfortable enough to wear all night. - June 10, 2026
7. The ring refuses to sync with Google Fit. I've tried unpairing, restarting my phone, and resetting the ring, but nothing works. The app is useless without integrations. - June 03, 2026
8. Sizing is tricky. I highly recommend ordering the sizing kit first. Customer service was super friendly and let me exchange my size 9 ring for a size 10 free of charge! - June 12, 2026
9. Water resistance is solid. I wear it swimming, washing dishes, and in the shower with no issues. Tracking continues seamlessly. Highly recommend. - June 15, 2026
10. The charging dock is clumsy and magnets are weak. If the ring is nudged slightly, it stops charging. The device itself is fine, but the charger needs a redesign. - June 06, 2026`
  },
  {
    name: "Bistro Greens Cafe",
    industry: "Food, Beverage & Hospitality",
    icon: "Utensils",
    description: "Customer comments for Bistro Greens: organic dishes, weekend wait times, acoustics, and parking constraints.",
    text: `- Bistro Greens is our absolute go-to spot for brunch! The organic avocado toast is divine and the match lattea is the best in the city. The staff is always so welcoming and warm. (June 10, 2026)
- The food is exceptional, but the wait times on Saturdays are getting ridiculous. We waited 50 minutes for a table of two, and another 25 minutes for our food to arrive. They need a better reservation system. (June 13, 2026)
- Inside the cafe is extremely noisy. The acoustics are bad, and with the loud background music, it's impossible to have a quiet conversation. We had to eat outside, which was ruined by flies. (June 08, 2026)
- Love the outdoor patio! The seating is comfortable, surrounded by beautiful green plants. Plus, their vegan pastries are to die for. Will definitely return. (June 20, 2026)
- Good luck finding a parking spot! There are only 4 dedicated parking spaces for the entire cafe. I spent 15 minutes driving around the block. They should partner with the parking garage next door. (June 15, 2026)
- Exceptional organic salads! Everything tastes incredibly fresh and crisp. The prices are high, but you can taste the quality of the local ingredients. Five stars! (June 22, 2026)
- The servers are friendly, but they seem heavily understaffed during lunch hour. It took 15 minutes just to get water and we had to flag down three different people to get the check. (June 11, 2026)
- Great cold brew coffee and clean restrooms. The cafe has high-speed Wi-Fi, making it a pleasant spot to get some morning work done. (June 18, 2026)
- I ordered the gluten-free waffle and it was completely burnt and dry. When I sent it back, they took it off the bill, but didn't offer a replacement. Disappointing hospitality. (June 14, 2026)
- Bistro Greens is a beautiful cafe. They have a fantastic selection of natural wines and cold-pressed juices. A bit of a hidden gem! (June 21, 2026)`
  }
];
