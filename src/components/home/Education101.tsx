import Education101Client, { EducationTab } from "./Education101Client";

const HOME_PAGE_ID = 38;

async function getEducationTabs(): Promise<EducationTab[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages/${HOME_PAGE_ID}?acf_format=standard`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.acf?.education_tabs ?? [];
}

export default async function Education101() {
  const tabs = await getEducationTabs();
  return <Education101Client tabs={tabs} />;
}
