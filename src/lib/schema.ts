interface Crumb {
  label: string;
  href?: string;
}

export function breadcrumbListSchema(
  items: Crumb[],
  site: string | URL | undefined,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, site).toString() } : {}),
    })),
  };
}
