export interface FaqItem {
  q: string;
  a: string;
}

export const CATEGORY_FAQS: Record<string, FaqItem[]> = {
  "smokable-hemp-flower": [
    { q: "What is smokable hemp flower?", a: "Smokable hemp flower is the dried bud of the hemp plant, rich in CBD and other cannabinoids. It looks and smells like cannabis but contains ≤0.3% THC, making it federally legal. It's one of the fastest ways to experience CBD — effects are felt within minutes." },
    { q: "Will smoking hemp flower get me high?", a: "No. Hemp flower contains ≤0.3% Delta-9 THC, which is far too low to produce intoxicating effects. You may feel relaxed and calm, but not 'high' in the traditional sense. Our THCA flower may produce mild effects when heated." },
    { q: "What's the difference between CBD flower and THCA flower?", a: "CBD flower is bred to be high in CBD with minimal THC. THCA flower contains tetrahydrocannabinolic acid, which converts to THC when heated (smoked/vaped). THCA flower may produce stronger effects than CBD flower." },
    { q: "How should I store hemp flower?", a: "Store in a cool, dark place in an airtight container. Avoid direct sunlight, heat, and moisture. Properly stored hemp flower stays fresh for 6-12 months. Glass mason jars work great." },
  ],
  "edibles-gummies": [
    { q: "How long do CBD gummies take to kick in?", a: "CBD gummies typically take 30-90 minutes to take effect, as they need to pass through your digestive system. Effects can last 4-6 hours. For faster relief, consider sublingual tinctures instead." },
    { q: "How many gummies should I take?", a: "Start with one gummy and wait at least 2 hours before taking more. Most gummies contain 10-25mg of CBD per piece. Everyone's body is different — start low and increase gradually until you find your sweet spot." },
    { q: "Are CBD gummies safe?", a: "Yes, when purchased from reputable sources. All our gummies are third-party lab tested for potency, purity, and contaminants. They contain no artificial colors or flavors and are made with natural ingredients." },
    { q: "Do CBD gummies contain sugar?", a: "Most gummies contain some sugar for taste. We also carry sugar-free and low-sugar options. Check individual product labels for specific nutritional information or ask our staff for recommendations." },
  ],
  "tinctures": [
    { q: "How do I use a CBD tincture?", a: "Place the desired amount under your tongue using the dropper, hold for 60-90 seconds, then swallow. This sublingual method allows CBD to absorb directly into your bloodstream for faster effects (15-30 minutes)." },
    { q: "What strength tincture should I start with?", a: "Beginners should start with a lower potency (250-500mg per bottle). You can always increase your dose or move to a higher strength. Our staff can help you find the right starting point based on your body weight and goals." },
    { q: "Can I add CBD tincture to food or drinks?", a: "Yes! CBD tinctures can be added to smoothies, coffee, tea, or food. However, sublingual use provides faster absorption. When added to food, effects may take longer (similar to edibles)." },
    { q: "How should I store my tincture?", a: "Store upright in a cool, dark place. Avoid direct sunlight and heat. Most tinctures have a shelf life of 1-2 years when properly stored. Refrigeration is optional but can extend freshness." },
  ],
  "topicals": [
    { q: "How do CBD topicals work?", a: "CBD topicals are applied directly to the skin, where they interact with cannabinoid receptors in your skin and muscle tissue. They provide localized relief without entering your bloodstream — ideal for targeted areas." },
    { q: "How long do topicals take to work?", a: "Most people feel effects within 15-30 minutes of application. Apply generously to the affected area and massage in. Effects typically last 2-4 hours. Reapply as needed." },
    { q: "Will CBD topicals show up on a drug test?", a: "No. Topically applied CBD does not enter your bloodstream in significant amounts and should not affect drug test results." },
  ],
  "vapes": [
    { q: "Is vaping CBD safe?", a: "Vaping CBD from reputable brands using quality hardware is considered one of the cleaner inhalation methods. All our vape products are lab-tested and free from vitamin E acetate, heavy metals, and harmful additives." },
    { q: "How quickly does vaping CBD work?", a: "Vaping provides the fastest onset of effects — typically within 1-5 minutes. This makes it ideal for acute relief. Effects generally last 1-3 hours." },
    { q: "What's the difference between disposable and cartridge vapes?", a: "Disposable vapes are pre-filled, pre-charged, and ready to use — just inhale and dispose when empty. Cartridge vapes use a reusable battery with replaceable cartridges, which is more economical and eco-friendly long-term." },
  ],
  "infused-beverages": [
    { q: "How do CBD-infused beverages work?", a: "CBD beverages use nano-emulsion technology to make CBD water-soluble, which improves absorption. Effects are typically felt faster than traditional edibles — usually within 15-30 minutes." },
    { q: "Can I drink CBD beverages daily?", a: "Yes! CBD beverages are a great way to incorporate cannabinoids into your daily wellness routine. Most contain moderate doses (10-25mg) perfect for regular use. As always, listen to your body." },
  ],
  "pets": [
    { q: "Is CBD safe for my pet?", a: "Yes, when using products specifically formulated for pets. Never give human CBD products to animals, as they may contain ingredients harmful to pets. Our pet CBD line is vet-reviewed and uses pet-safe ingredients." },
    { q: "How much CBD should I give my pet?", a: "A general guideline is 1-2mg of CBD per 10 pounds of body weight. Start with the lowest dose and observe your pet's response over 2 weeks before adjusting. Consult your veterinarian for personalized advice." },
    { q: "What can CBD help my pet with?", a: "Pet owners commonly use CBD for anxiety (separation, thunderstorms, travel), joint discomfort, age-related issues, appetite support, and overall wellness. Results vary by pet." },
  ],
  "cbd-pouches": [
    { q: "What are CBD pouches?", a: "CBD pouches are small, tobacco-free pouches placed between your lip and gum. They deliver CBD through oral absorption — similar to nicotine pouches but with cannabinoids instead. Discreet, convenient, and no smoke or vapor." },
    { q: "How long do I keep a CBD pouch in?", a: "Most users keep a CBD pouch in for 15-30 minutes. You'll feel a tingling sensation as the CBD absorbs. Remove and dispose when the flavor fades." },
    { q: "Are CBD pouches a good alternative to smoking?", a: "Many customers use CBD pouches as a smoke-free, vape-free alternative. They provide fast-acting CBD without any inhalation. Great for use at work, in the car, or anywhere smoking isn't practical." },
  ],
};
